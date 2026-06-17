const assert = require('node:assert');

function env(name, fallback) {
  const value = process.env[name];
  if (value !== undefined) return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable: ${name}`);
}

function dbUrl() {
  return env('DATABASE_URL');
}

function jwtSecret() {
  return env('JWT_SECRET');
}

module.exports = { env, dbUrl, jwtSecret };
