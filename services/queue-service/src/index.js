const express = require('express');
const { config } = require('@flowtab/config');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'queue-service', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[queue-service] listening on port ${PORT}`);
});
