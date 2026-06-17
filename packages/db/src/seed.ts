import { v4 as uuidv4 } from 'uuid';
import { query } from './index';

export async function seed(): Promise<void> {
  const existing = await query('SELECT id FROM restaurants WHERE slug = $1', ['default']);
  if (existing.rows.length > 0) {
    console.log('[seed] default restaurant already exists, skipping');
    return;
  }

  await query(
    `INSERT INTO restaurants (id, name, slug, avg_service_rate, avg_table_capacity)
     VALUES ($1, $2, $3, $4, $5)`,
    [uuidv4(), 'Default Restaurant', 'default', 15.0, 4],
  );
  console.log('[seed] default restaurant created');
}
