export function env(name: string, fallback?: string): string {
  const value = process.env[name];
  if (value !== undefined) return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable: ${name}`);
}

export function dbUrl(): string {
  return env('DATABASE_URL');
}

export function jwtSecret(): string {
  return env('JWT_SECRET');
}
