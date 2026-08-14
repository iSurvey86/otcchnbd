export const GUEST_LIMIT = 15

const DEFAULT_ADMINS = ['minhphuong.npsc@gmail.com']

export const ADMIN_EMAILS = Array.from(
  new Set([
    ...DEFAULT_ADMINS,
    ...(import.meta.env.VITE_ADMIN_EMAILS ?? '')
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  ]),
)

export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()))
}

export const LOGIN_COPY = {
  default: 'Đăng nhập Google để ôn và thi không giới hạn.',
  quota: `Bạn đã dùng hết ${GUEST_LIMIT} câu miễn phí. Đăng nhập Google để tiếp tục.`,
  exam: `Đã hết ${GUEST_LIMIT} câu miễn phí. Đăng nhập Google để bắt đầu thi thử.`,
} as const
