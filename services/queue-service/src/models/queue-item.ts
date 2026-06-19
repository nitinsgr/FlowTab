import {
  QueueItem,
  CreateQueueItemRequest,
  UpdateQueueItemRequest,
  QueueListParams,
  QueueItemStatus,
} from '@flowtab/shared-types';
import { query } from '@flowtab/db';


function rowToQueueItem(row: Record<string, unknown>): QueueItem {
  return {
    id: row['id'] as string,
    restaurant_id: row['restaurant_id'] as string,
    party_name: row['party_name'] as string,
    party_size: row['party_size'] as number,
    contact_phone: (row['contact_phone'] as string) ?? null,
    contact_email: (row['contact_email'] as string) ?? null,
    notes: (row['notes'] as string) ?? null,
    priority: row['priority'] as number,
    status: row['status'] as QueueItem['status'],
    eta_minutes: (row['eta_minutes'] as number) ?? null,
    created_at: row['created_at'] as string,
    updated_at: row['updated_at'] as string,
    seated_id: (row['seated_id'] as string) ?? null,
    resolved_at: (row['resolved_at'] as string) ?? null,
  };
}

export async function createQueueItem(
  restaurantId: string,
  data: CreateQueueItemRequest,
  etaMinutes: number | null,
): Promise<QueueItem> {
  const result = await query(
    `INSERT INTO queue_items(restaurant_id, party_name, party_size, contact_phone, contact_email, notes, priority, eta_minutes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *`,
    [
      restaurantId,
      data.party_name,
      data.party_size,
      data.contact_phone || null,
      data.contact_email || null,
      data.notes || null,
      data.priority ?? 0,
      etaMinutes,
    ],
  );
  return rowToQueueItem(result.rows[0]);
}


export async function findQueueItems(
  restaurantId: string,
  params: QueueListParams,
): Promise<QueueItem[]> {
  const conditions: string[] = ['restaurant_id = $1'];
  const values: unknown[] = [restaurantId];
  let paramIndex = 2;

  if(params.status){
    conditions.push(`status = $${paramIndex++}`);
    values.push(params.status);
  }

  const sortBy = params.sort_by || 'created_at';
  const sortOrder = params.sort_order === 'desc' ? 'DESC' : 'ASC';
  const limit = params.limit && params.limit > 0 ? params.limit : 50;
  const offset = params.offset && params.offset > 0 ? params.offset : 0;
  const allowedSortFields = ['createdAt', 'priority','party_size','party_name','eta_minutes','updated_at'];

  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';

  const result = await query(
    `SELECT * FROM queue_items
     WHERE ${conditions.join(' AND ')}
     ORDER BY priority ASC, ${safeSortBy} ${sortOrder}
     LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
    [...values, limit, offset],
  );

  return result.rows.map(rowToQueueItem);
}

export async function findQueueItemById(id: string): Promise<QueueItem | null> {
  const result = await query('SELECT * FROM queue_items WHERE id = $1', [id]);
  return result.rows.length > 0 ? rowToQueueItem(result.rows[0]) : null;
}

export async function updateQueueItem(
  id: string,
  data: UpdateQueueItemRequest,
): Promise<QueueItem | null>{
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if(data.priority !== undefined){
    fields.push(`priority = $${paramIndex++}`);
    values.push(data.priority);
  }
  if(data.notes !== undefined ){
    fields.push(`notes = $${paramIndex++}`);
    values.push(data.notes);
  }
  if(data.status !== undefined){
    fields.push(`status = $${paramIndex++}`);
    values.push(data.status);
  }
  if(fields.length === 0) {
    return findQueueItemById(id);
  }
  if(
    data.status === 'cancelled' ||
    data.status === 'seated' ||
    data.status === 'no-show'
  ){
    fields.push('resolved_at = NOW()');
  }
  fields.push('updated_at = NOW()');
  values.push(id);

  const result = await query(
    `UPDATE queue_items SET ${fields.join(', ')} WHERE id = $${paramIndex}
    RETURNING *`,
    values,
  );
  return result.rows.length > 0 ? rowToQueueItem(result.rows[0]): null;
  }

export async function deleteQueueItem(id: string): Promise<boolean> {
  const result = await query(
    `UPDATE queue_items SET status = 'cancelled', resolved_at = NOW(), update_at = NOW() WHERE id = $1 RETURNING id`,
    [id],
  );
  return result.rows.length > 0;
}

export async function countWaitingAhead(restaurantId: string): Promise<number> {
  const result = await query(
    `SELECT count(*):: int AS count FROM queue_items
    WHERE restaurant_id = $1 AND status = 'waiting'`,
    [restaurantId],
  );
  return result.rows[0].count as number;
}

//
export interface RestaurantConfig {
  avg_service_rate: number;
  avg_table_capacity: number;
}

export async function getRestaurant(
  id: string,
): Promise<RestaurantConfig | null> {
  const result = await query(
    `SELECT avg_service_rate, avg_table_capacity FROM restaurants WHERE id = $1`,
    [id],
  );
  return result.rows.length > 0 ? (result.rows[0] as RestaurantConfig) : null;
}

