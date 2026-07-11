export type ProviderType = 'paystack' | 'flutterwave' | 'monnify' | 'generic';
export type EventStatus = 'pending' | 'success' | 'failed' | 'retrying';

export interface Endpoint {
    id: string;
    url: string;
    provider_type: ProviderType;
    created_at: string;
    total_events: number;
    events_today: number;
    success_rate: number | null;
}

export interface WebhookEvent {
    id: string;
    endpoint_id: string;
    status: 'pending' | 'success' | 'failed';
    display_status: EventStatus;
    payload: Record<string, unknown>;
    headers: Record<string, string>;
    created_at: string;
    updated_at: string;
    destination_url: string;
    provider_type: ProviderType;
    last_duration_ms: number | null;
    attempt_count: number;
}

export interface Delivery {
    id: string;
    event_id: string;
    attempt_number: number;
    status_code: number | null;
    response_body: string | null;
    duration_ms: number;
    created_at: string;
}

export interface Diagnosis {
    event_id: string;
    analysis: string;
    created_at: string;
}

export interface EventDetail extends WebhookEvent {
    deliveries: Delivery[];
    diagnosis: Diagnosis | null;
}

export interface Stats {
    events_today: string;
    failed_today: string;
    success_rate: string | null;
    avg_latency_ms: string | null;
}