import { NextResponse } from 'next/server'
import { requireAdmin, verifyBearerUser } from '@/lib/firebaseAdmin'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
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

  const { id } = await context.params
  const body = (await request.json().catch(() => ({}))) as {
    status?: string
    adminReply?: string
  }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (body.status) patch.status = body.status
  if (body.adminReply !== undefined) {
    patch.admin_reply = body.adminReply.trim() || null
  }

  const db = getSupabaseAdmin()!
  const { error } = await db.from('feedback').update(patch).eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
