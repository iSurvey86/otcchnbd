import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { ADMIN_EMAILS } from './config'

export interface AuthUser {
  uid: string
  email: string | null
  name: string | null
}

function getAdminApp(): App | null {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim()
    || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim()
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim()
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')?.trim()

  if (!projectId || !clientEmail || !privateKey) return null

  if (getApps().length) return getApps()[0]!
  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  })
}

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(getAdminApp())
}

export async function verifyBearerUser(
  request: Request,
): Promise<{ user: AuthUser } | { error: string; status: number }> {
  const header = request.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!token) return { error: 'Thiếu token đăng nhập.', status: 401 }

  const app = getAdminApp()
  if (!app) {
    return {
      error: 'Chưa cấu hình Firebase Admin (FIREBASE_ADMIN_*).',
      status: 500,
    }
  }

  try {
    const decoded = await getAuth(app).verifyIdToken(token)
    return {
      user: {
        uid: decoded.uid,
        email: decoded.email ?? null,
        name: decoded.name ?? null,
      },
    }
  } catch {
    return { error: 'Token không hợp lệ hoặc đã hết hạn.', status: 401 }
  }
}

export function requireAdmin(
  user: AuthUser,
): { error: string; status: number } | null {
  if (!user.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return { error: 'Không có quyền admin.', status: 403 }
  }
  return null
}
