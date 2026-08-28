/**
 * Wrapper — tái xuất TCVN 9401:2024 Word (bố cục thống nhất).
 * Prefer: node scripts/export_tcvn_clean_docx.js 9401
 */
process.argv[2] = '9401'
require('./export_tcvn_clean_docx.js')
