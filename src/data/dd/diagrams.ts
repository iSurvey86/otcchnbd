export interface DdGridDiagram {
  id: string
  source: string
  title: string
  blurb: string
  src: string
}

/** Sơ đồ lưới TT 68/2015 và TCVN 9401:2024 — file trong `public/tcvn/`. */
export const DD_GRID_DIAGRAMS: DdGridDiagram[] = [
  {
    id: 'tt68',
    source: 'TT 68/2015',
    title: 'Hệ thống lưới tọa độ và độ cao',
    blurb: 'Lưới khống chế đo vẽ BDĐH tỷ lệ 1:500–1:5000',
    src: '/tcvn/so-do-luoi-tt68-2015.png',
  },
  {
    id: '9401-62',
    source: 'TCVN 9401 §6.2',
    title: 'Lưới khảo sát công trình',
    blurb: 'Lưới KS phục vụ thiết kế và thi công',
    src: '/tcvn/so-do-luoi-tcvn9401-2024.png',
  },
  {
    id: '9401-63',
    source: 'TCVN 9401 §6.3',
    title: 'Lưới khống chế mặt bằng thi công',
    blurb: 'Khống chế MB và bố trí công trình',
    src: '/tcvn/so-do-luoi-tcvn9401-2024-thicong.png',
  },
  {
    id: '9401-64',
    source: 'TCVN 9401 §6.4',
    title: 'Lưới quan trắc chuyển dịch ngang',
    blurb: 'Quan trắc biến dịch công trình',
    src: '/tcvn/so-do-luoi-tcvn9401-2024-quantrac.png',
  },
]
