/**
 * pocketbase — singleton PocketBase client.
 *
 * All services must import and reuse `pb` from this file.
 * Never create a second PocketBase instance anywhere in the codebase.
 *
 * Configuration:
 *   Set VITE_POCKETBASE_URL in your .env file (see .env.example).
 *   Default: http://127.0.0.1:8090 (local PocketBase instance).
 *
 * PocketBase handles session persistence automatically via localStorage.
 * The auth state is accessible as `pb.authStore`.
 */
import PocketBase from 'pocketbase'

export const pb = new PocketBase(
  import.meta.env.VITE_POCKETBASE_URL ?? 'http://127.0.0.1:8090',
)
