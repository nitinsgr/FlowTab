const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'analytics-service', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Analytics service listening on port ${PORT}`);
});
