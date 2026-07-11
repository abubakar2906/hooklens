import type { Endpoint, WebhookEvent, EventDetail, Stats } from '@/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options?.headers },
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