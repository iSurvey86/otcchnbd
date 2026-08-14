import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { getFirebase } from './firebase'

export type LogEvent =
  | 'login'
  | 'logout'
  | 'question_answered'
  | 'exam_started'
  | 'exam_submitted'
  | 'paywall_hit'

export async function upsertUser(user: User): Promise<void> {
  const fb = getFirebase()
  if (!fb) return
  try {
    const ref = doc(fb.db, 'users', user.uid)
    const snap = await getDoc(ref)
    await setDoc(
      ref,
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: user.providerData[0]?.providerId ?? 'password',
        lastLoginAt: serverTimestamp(),
        lastSeenAt: serverTimestamp(),
        ...(snap.exists()
          ? {}
          : { createdAt: serverTimestamp(), answerCount: 0, examCount: 0, loginCount: 0 }),
      },
      { merge: true },
    )
    await updateDoc(ref, { loginCount: increment(1) })
  } catch {
    // Auth vẫn thành công nếu Firestore chưa mở quyền
  }
}

export async function logEvent(
  user: User | null,
  event: LogEvent,
  payload: Record<string, string | number | boolean | null> = {},
): Promise<void> {
  const fb = getFirebase()
  if (!fb || !user) return
  try {
    await addDoc(collection(fb.db, 'logs'), {
      uid: user.uid,
      email: user.email,
      event,
      createdAt: serverTimestamp(),
      ...payload,
    })
  } catch {
    // Bỏ qua lỗi ghi log để không chặn ôn/thi
  }
}

export async function bumpUserStat(
  uid: string,
  field: 'answerCount' | 'examCount',
): Promise<void> {
  const fb = getFirebase()
  if (!fb) return
  try {
    await updateDoc(doc(fb.db, 'users', uid), {
      [field]: increment(1),
      lastSeenAt: serverTimestamp(),
    })
  } catch {
    // Bỏ qua nếu user doc chưa tồn tại
  }
}
