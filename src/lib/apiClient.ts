import type { User } from 'firebase/auth'
import { getFirebaseAuth } from './firebase'

export async function authHeaders(
  user?: User | null,
): Promise<HeadersInit | null> {
  const auth = getFirebaseAuth()
  const current = user ?? auth?.currentUser ?? null
  if (!current) return null
  try {
    const token = await current.getIdToken()
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  } catch {
    return null
  }
}

export async function apiJson<T>(
  path: string,
  init: RequestInit & { user?: User | null } = {},
): Promise<{ ok: true; data: T } | { ok: false; error: string; status: number }> {
  const headers = await authHeaders(init.user)
  if (!headers) {
    return { ok: false, error: 'Chưa đăng nhập.', status: 401 }
  }
  try {
    const res = await fetch(path, {
      ...init,
      headers: { ...headers, ...(init.headers || {}) },
    })
    const body = (await res.json().catch(() => ({}))) as {
      error?: string
      data?: T
    } & T
    if (!res.ok) {
      return {
        ok: false,
        error: body.error || `Lỗi ${res.status}`,
        status: res.status,
      }
    }
    return { ok: true, data: (body.data !== undefined ? body.data : body) as T }
  } catch {
    return { ok: false, error: 'Không kết nối được máy chủ.', status: 0 }
  }
}
