import express from 'express';
import { applyPending } from '@flowtab/db/src/migrate';
import { seed } from '@flowtab/db/src/seed';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'queue-service', timestamp: new Date().toISOString() });
});

async function start(): Promise<void> {
  try {
    await applyPending();
    await seed();
  } catch (err) {
    console.error('[queue-service] migration failed:', (err as Error).message);
  }

  app.listen(PORT, () => {
    console.log(`[queue-service] listening on port ${PORT}`);
  });
}

start();
