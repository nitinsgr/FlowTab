export type QueueItemStatus = 'waiting' | 'seated' | 'completed' | 'cancelled' | 'no-show'

export interface CreateQueueItemRequest {
  party_name: string;
  party_size: number;
  contact_phone?: string;
  contact_email?: string;
  notes?: string;
  priority?: number; // default 0; negative = bump
}

export interface UpdateQueueItemRequest {
  priority?: number;
  notes?: string;
  status?: QueueItemStatus;
}

export interface QueueItem {
  id: string;
  restaurant_id: string;
  party_name: string;
  party_size: number;
  contact_phone: string | null;
  contact_email: string | null;
  notes: string | null;
  priority: number;
  status: QueueItemStatus;
  eta_minutes: number | null;
  created_at: string;
  updated_at: string;
  seated_id: string | null;
  resolved_at: string | null;
}

export interface QueueListParams {
  status?: QueueItemStatus;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

