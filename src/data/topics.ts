import type { Topic } from '../types'

export const TOPICS: Topic[] = [
  {
    id: 'luat-chung',
    section: 'phap-luat',
    title: 'Luật Đo đạc và Bản đồ',
    blurb: 'Khái niệm, nguyên tắc, hành vi bị cấm, phân loại hoạt động cơ bản và chuyên ngành.',
  },
  {
    id: 'giay-phep-chung-chi',
    section: 'phap-luat',
    title: 'Giấy phép và chứng chỉ',
    blurb: 'Điều kiện cấp, hạng I/II, sát hạch, thời hạn, cấp lại, cấp đổi, thu hồi.',
  },
  {
    id: 'cong-trinh-ha-tang',
    section: 'phap-luat',
    title: 'Công trình hạ tầng đo đạc',
    blurb: 'Mốc, trạm GNSS, hành lang bảo vệ, di dời, phá dỡ, trách nhiệm bảo vệ.',
  },
  {
    id: 'csdl-ban-do',
    section: 'phap-luat',
    title: 'Dữ liệu, bản đồ, NSDI',
    blurb: 'CSDL nền địa lý, bản đồ địa hình, hành chính, biên giới, lưu trữ, cung cấp.',
  },
  {
    id: 'toan-ban-do',
    section: 'kinh-nghiem',
    title: 'Toán bản đồ & VN-2000',
    blurb: 'Hệ quy chiếu, phép chiếu UTM/Gauss, múi chiếu, phân mảnh, tỷ lệ.',
  },
  {
    id: 'do-truc-tiep',
    section: 'kinh-nghiem',
    title: 'Đo đạc trực tiếp',
    blurb: 'GNSS, toàn đạc, thủy chuẩn, đường chuyền, sai số, độ chính xác.',
  },
  {
    id: 'anh-vien-tham',
    section: 'kinh-nghiem',
    title: 'Ảnh hàng không & viễn thám',
    blurb: 'Chụp ảnh, chồng phủ, GSD, trực giao, LiDAR, giải đoán ảnh.',
  },
  {
    id: 'chat-luong-de-an',
    section: 'kinh-nghiem',
    title: 'Đề án, CSDL & chất lượng',
    blurb: 'Thiết kế kỹ thuật — dự toán, GIS, kiểm tra chất lượng sản phẩm.',
  },
]
