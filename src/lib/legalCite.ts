/** Chuẩn hóa viết hoa thuật ngữ dẫn chiếu pháp luật: Điểm, Khoản, Điều. */
export function normalizeLegalCaps(text: string): string {
  if (!text) return text
  return text
    .replace(
      /\bđiểm\b(?=\s*[A-Za-zÀ-ỹĐđ0-9])/gi,
      'Điểm',
    )
    .replace(/\bkhoản\b(?=\s*\d)/gi, 'Khoản')
    .replace(/\bđiều\b(?=\s*\d)/gi, 'Điều')
}
