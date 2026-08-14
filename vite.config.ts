import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Popup Google cần COOP cho phép cửa sổ con, không dùng same-origin.
const authHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
}

export default defineConfig({
  plugins: [react()],
  server: {
    headers: authHeaders,
  },
  preview: {
    headers: authHeaders,
  },
})
