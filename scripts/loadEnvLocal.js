const fs = require('fs')
const path = require('path')

/** Đọc biến từ .env.local (không ghi đè env đã có). */
function loadEnvLocal(rootDir = path.join(__dirname, '..')) {
  const envPath = path.join(rootDir, '.env.local')
  if (!fs.existsSync(envPath)) return
  const raw = fs.readFileSync(envPath, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    val = val.replace(/\\n/g, '\n')
    if (process.env[key] == null || process.env[key] === '') {
      process.env[key] = val
    }
  }
}

module.exports = { loadEnvLocal }
