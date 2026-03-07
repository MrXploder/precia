/**
 * authService — user authentication via PocketBase.
 *
 * Wraps PocketBase's built-in auth system so that the rest of the app
 * never imports PocketBase directly.
 *
 * Responsibilities:
 *   signUp      — create a new user account
 *   login       — authenticate with email + password
 *   logout      — clear the session
 *   getCurrentUser — return the currently authenticated user or null
 *
 * Session persistence is handled automatically by PocketBase (localStorage).
 */
import type { RecordModel } from 'pocketbase'

import type { User } from '@/domain'
import { pb } from './pocketbase'

/**
 * Create a new user account.
 * @throws {ClientResponseError} on validation errors or network failure.
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string,
): Promise<User> {
  const record = await pb.collection('users').create<RecordModel>({
    email,
    password,
    passwordConfirm: password,
    displayName,
  })
  return mapToUser(record)
}

/**
 * Authenticate an existing user with email and password.
 * On success, the session is stored in pb.authStore automatically.
 * @throws {ClientResponseError} if credentials are invalid.
 */
export async function login(email: string, password: string): Promise<User> {
  const authData = await pb.collection('users').authWithPassword<RecordModel>(email, password)
  return mapToUser(authData.record)
}

/**
 * Sign the current user out and clear the session from localStorage.
 */
export function logout(): void {
  pb.authStore.clear()
}

/**
 * Return the currently authenticated user, or null if not signed in.
 * Reads from the in-memory auth store — no network request needed.
 */
export function getCurrentUser(): User | null {
  if (!pb.authStore.isValid || !pb.authStore.record) return null
  return mapToUser(pb.authStore.record as RecordModel)
}

/** Map a PocketBase user record to the domain User type. */
function mapToUser(record: RecordModel): User {
  return {
    id: record.id,
    email: record['email'] as string,
    displayName: (record['displayName'] ?? '') as string,
    createdAt: new Date(record['created'] as string),
  }
}
