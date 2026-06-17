const express = require('express');
const { config } = require('@flowtab/config');

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'analytics-service', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[analytics-service] listening on port ${PORT}`);
});
