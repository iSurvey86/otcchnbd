import { createClient } from '@supabase/supabase-js'
import { getSupabaseAdmin, isSupabaseConfigured } from './supabaseAdmin'

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  if (email.length > 254) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  return email
}

export function normalizeOtp(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const code = value.replace(/\s/g, '')
  if (!/^\d{6}$/.test(code)) return null
  return code
}

function authClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim()
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}

function errText(error: { message?: string; code?: string } | null): string {
  if (!error) return ''
  return [error.code, error.message].filter(Boolean).join(' ')
}

function mapOtpError(message: string, fallback: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('rate') || lower.includes('too many')) {
    return 'Gửi mã quá nhiều lần. Đợi vài phút rồi thử lại, hoặc đăng nhập Google.'
  }
  if (
    lower.includes('disabled') ||
    lower.includes('not enabled') ||
    lower.includes('signups not allowed')
  ) {
    return 'Chưa bật đăng nhập Email trên Supabase.'
  }
  if (lower.includes('not confirmed') || lower.includes('unconfirmed')) {
    return 'Tài khoản email chưa xác nhận. Tắt Confirm email trên Supabase, xóa user trong Authentication → Users, rồi gửi mã lại.'
  }
  if (
    lower.includes('expired') ||
    lower.includes('invalid') ||
    lower.includes('otp_expired')
  ) {
    return 'Mã không đúng hoặc đã hết hạn. Dùng mail mới nhất, hoặc gửi lại mã.'
  }
  return message.trim() || fallback
}

async function confirmEmailIfUnconfirmed(email: string): Promise<void> {
  const db = getSupabaseAdmin()
  if (!db) return
  const created = await db.auth.admin.createUser({
    email,
    email_confirm: true,
  })
  if (!created.error) return
  const { data, error } = await db.auth.admin.listUsers({ perPage: 200 })
  if (error) return
  const user = data.users.find((item) => item.email?.toLowerCase() === email)
  if (!user || user.email_confirmed_at) return
  await db.auth.admin.updateUserById(user.id, { email_confirm: true })
}

export async function sendEmailOtp(
  email: string,
): Promise<{ ok: true } | { error: string; status: number }> {
  if (!isSupabaseConfigured()) {
    return { error: 'Chưa cấu hình Supabase.', status: 500 }
  }
  await confirmEmailIfUnconfirmed(email)
  const { error } = await authClient().auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo:
        process.env.VERCEL_ENV === 'production'
          ? 'https://onthicchn.org'
          : 'http://localhost:3000',
    },
  })
  if (error) {
    console.error('sendEmailOtp', error)
    return {
      error: mapOtpError(errText(error), 'Không gửi được mã. Thử lại sau.'),
      status: 400,
    }
  }
  return { ok: true }
}

export async function verifyEmailOtp(
  email: string,
  token: string,
): Promise<{ ok: true } | { error: string; status: number }> {
  if (!isSupabaseConfigured()) {
    return { error: 'Chưa cấu hình Supabase.', status: 500 }
  }

  const { error } = await authClient().auth.verifyOtp({
    email,
    token,
    type: 'email',
  })
  if (error) {
    const raw = errText(error)
    console.error('verifyEmailOtp', error)
    return {
      error: `${mapOtpError(raw, 'Mã không đúng hoặc đã hết hạn.')} (${raw || 'no-detail'})`,
      status: 401,
    }
  }
  return { ok: true }
}
