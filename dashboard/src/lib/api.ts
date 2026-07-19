import type { Endpoint, WebhookEvent, EventDetail, Stats } from '@/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getAuthToken(): Promise<string | null> {
    if (typeof window === 'undefined') {
        const { auth } = await import('@clerk/nextjs/server');
        const { getToken } = await auth();
        return getToken();
    } else {
        // @ts-expect-error Clerk is globally available on window
        if (window.Clerk?.session) {
            // @ts-expect-error
            return window.Clerk.session.getToken();
        }
        return null;
    }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API}${path}`, {
        ...options,
        headers: { ...headers, ...options?.headers },
        cache: 'no-store',
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(body.error ?? `HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
}

export const api = {
    getStats: () =>
        apiFetch<Stats>('/api/stats'),

    getEvents: (status?: string) =>
        apiFetch<WebhookEvent[]>(
            `/api/events${status && status !== 'all' ? `?status=${status}` : ''}`
        ),

    getEvent: (id: string) =>
        apiFetch<EventDetail>(`/api/events/${id}`),

    replayEvent: (id: string) =>
        apiFetch<{ success: boolean; message: string }>(`/api/events/${id}/replay`, {
            method: 'POST',
        }),

    getEndpoints: () =>
        apiFetch<Endpoint[]>('/api/endpoints'),

    createEndpoint: (data: { url: string; provider_type: string; secret?: string }) =>
        apiFetch<Endpoint>('/api/endpoints', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};
