'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const STORAGE_KEY = 'otcchnbd.admin.viewAsUser'

/**
 * Admin bật «Xem như người dùng» → ẩn nút Quản lý / UI admin trên chrome,
 * để hình dung trải nghiệm end user (vẫn đăng nhập admin).
 */
export function useAdminViewAsUser() {
  const { isAdmin } = useAuth()
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    try {
      setFlag(localStorage.getItem(STORAGE_KEY) === '1')
    } catch {
      setFlag(false)
    }
  }, [])

  const setViewAsUser = useCallback((next: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
    } catch {
      /* ignore */
    }
    setFlag(next)
  }, [])

  const viewAsUser = Boolean(isAdmin && flag)

  return {
    isAdmin,
    viewAsUser,
    setViewAsUser,
    enterViewAsUser: () => setViewAsUser(true),
    exitViewAsUser: () => setViewAsUser(false),
  }
}
