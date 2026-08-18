import { isSupabaseConfigured } from './supabaseAdmin'

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

function gotrueUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim().replace(/\/$/, '')
  return `${base}/auth/v1/${path}`
}

async function gotrue(
  path: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; status: number; message: string }> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim()
  const res = await fetch(gotrueUrl(path), {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const json = (await res.json().catch(() => ({}))) as {
    msg?: string
    message?: string
    error_description?: string
    error?: string
  }
  const message =
    json.msg || json.message || json.error_description || json.error || ''
  return { ok: res.ok, status: res.status, message }
}

function mapOtpError(message: string, fallback: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('rate') || lower.includes('too many')) {
    return 'Mail thử nghiệm chỉ gửi được vài lần mỗi giờ. Đợi khoảng 1 giờ rồi gửi lại, hoặc bấm Tiếp tục với Google.'
  }
  if (
    lower.includes('disabled') ||
    lower.includes('not enabled') ||
    lower.includes('signups not allowed')
  ) {
    return 'Chưa bật đăng nhập Email trên Supabase (Authentication → Providers → Email).'
  }
  if (
    lower.includes('invalid') ||
    lower.includes('expired') ||
    lower.includes('otp')
  ) {
    return 'Mã không đúng hoặc đã hết hạn.'
  }
  return fallback
}

export async function sendEmailOtp(
  email: string,
): Promise<{ ok: true } | { error: string; status: number }> {
  if (!isSupabaseConfigured()) {
    return { error: 'Chưa cấu hình Supabase.', status: 500 }
  }
  const result = await gotrue('otp', {
    email,
    create_user: true,
  })
  if (!result.ok) {
    return {
      error: mapOtpError(result.message, 'Không gửi được mã. Thử lại sau.'),
      status: result.status >= 400 && result.status < 500 ? result.status : 500,
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
  const result = await gotrue('verify', {
    type: 'email',
    email,
    token,
  })
  if (!result.ok) {
    return {
      error: mapOtpError(result.message, 'Mã không đúng hoặc đã hết hạn.'),
      status: 401,
    }
  }
  return { ok: true }
}
