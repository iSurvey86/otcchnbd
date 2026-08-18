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

function errCode(error: unknown): string {
  return typeof error === 'object' && error && 'code' in error
    ? String((error as { code: string }).code)
    : ''
}

/** Tạo Firebase session cho user đã xác thực email (OTP). Cùng email Google → cùng tài khoản. */
export async function createFirebaseTokenForEmail(
  email: string,
): Promise<{ token: string } | { error: string; status: number }> {
  const app = getAdminApp()
  if (!app) {
    return {
      error: 'Chưa cấu hình Firebase Admin (FIREBASE_ADMIN_*).',
      status: 500,
    }
  }

  const auth = getAuth(app)
  let uid: string
  try {
    uid = (await auth.getUserByEmail(email)).uid
  } catch (error) {
    if (errCode(error) !== 'auth/user-not-found') {
      return { error: 'Không tạo được phiên đăng nhập.', status: 500 }
    }
    try {
      uid = (
        await auth.createUser({
          email,
          emailVerified: true,
          displayName: email.split('@')[0] || undefined,
        })
      ).uid
    } catch (createError) {
      if (errCode(createError) !== 'auth/email-already-exists') {
        return { error: 'Không tạo được tài khoản.', status: 500 }
      }
      uid = (await auth.getUserByEmail(email)).uid
    }
  }

  try {
    return { token: await auth.createCustomToken(uid) }
  } catch {
    return { error: 'Không tạo được phiên đăng nhập.', status: 500 }
  }
}
