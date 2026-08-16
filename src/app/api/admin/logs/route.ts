import { NextResponse } from 'next/server'
import { requireAdmin, verifyBearerUser } from '@/lib/firebaseAdmin'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Chưa cấu hình Supabase.' }, { status: 500 })
  }
  const auth = await verifyBearerUser(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const denied = requireAdmin(auth.user)
  if (denied) {
    return NextResponse.json({ error: denied.error }, { status: denied.status })
  }

  const url = new URL(request.url)
  const limit = Math.min(Number(url.searchParams.get('limit') || 400), 500)

  const db = getSupabaseAdmin()!
  const { data, error } = await db
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data: data ?? [] })
}
