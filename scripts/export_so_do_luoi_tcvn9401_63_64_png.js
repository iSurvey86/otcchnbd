/**
 * PNG sơ đồ TCVN 9401:2024 — Điều 6.3 (thi công MB) & 6.4 (quan trắc CD ngang)
 * Palette khác TT 68 / sơ đồ 6.2
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const outDir = path.join(__dirname, "..", "docs", "tcvn");

const W = 1920;
const H = 1080;
const RX = 1872;
const LX = 48;
const LW = 200;
const CX = 268;
const CONTENT_W = RX - CX;

function layoutRows(count, topY = 95, footH = 110) {
  const footY = H - 48 - footH;
  const avail = footY - 24 - topY;
  const gap = Math.floor(avail / (count * 1.45));
  const rowH = Math.floor((avail - gap * (count - 1)) / count);
  const rows = [];
  let y = topY;
  for (let i = 0; i < count; i++) {
    rows.push({ y, h: rowH, b: y + rowH, t: y });
    y += rowH + gap;
  }
  return { rows, footY, footH, gaps: gap };
}

function mkHelpers(C, stroke = C.stroke) {
  function arr(x1, y1, x2, y2, dashed = false) {
    const dash = dashed ? ' stroke-dasharray="7 5"' : "";
    const mk = dashed ? "arrD" : "arr";
    const strokeCol = dashed ? C.arrDash : C.arrSolid;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeCol}" stroke-width="${dashed ? 2 : 2.5}" marker-end="url(#${mk})"${dash}/>`;
  }
  function arrV(cx, yFrom, yTo, dashed = false) {
    return arr(cx, yFrom, cx, yTo, dashed);
  }
  function box(x, y, w, h, fill, r = 10) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
  }
  function midBlock(cx, by, bh, lines) {
    const gap = lines.length >= 5 ? 24 : lines.length >= 4 ? 26 : 28;
    const blockH = (lines.length - 1) * gap + (lines[0].fs || 13);
    const y0 = by + (bh - blockH) / 2 + (lines[0].fs || 13) * 0.45;
    return lines
      .map((ln, i) => {
        const fs = ln.fs || 13;
        const fw = ln.bold ? "700" : ln.fw || "400";
        const fill = ln.fill || "#fff";
        return `<text x="${cx}" y="${y0 + i * gap}" text-anchor="middle" dominant-baseline="middle" font-family="Segoe UI, Arial, sans-serif" font-size="${fs}" font-weight="${fw}" fill="${fill}">${ln.t}</text>`;
      })
      .join("\n  ");
  }
  function lblBlock(by, bh, title, sub) {
    return midBlock(LX + LW / 2, by, bh, [
      { t: title, fs: 15, bold: true, fill: C.lblText },
      { t: sub, fs: 13, fw: "600", fill: C.lblSub },
    ]);
  }
  function header(title, sub, note) {
    return `
  <text x="960" y="42" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="700" fill="${C.title}">${title}</text>
  <text x="960" y="70" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="14" fill="${C.subtitle}">${sub}</text>
  ${note ? `<text x="960" y="88" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="12" fill="${C.note}">${note}</text>` : ""}`;
  }
  function footer(footY, footH, line1, line2) {
    return `
  ${box(LX, footY, RX - LX, footH, C.foot, 8)}
  <text x="68" y="${footY + 38}" font-family="Segoe UI, Arial, sans-serif" font-size="15" fill="${C.footText}">${line1}</text>
  <text x="68" y="${footY + 72}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="${C.footSub}">${line2}</text>`;
  }
  function svgWrap(C, body) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <marker id="arr" markerWidth="10" markerHeight="10" refX="9" refY="4" orient="auto">
      <path d="M0,0 L10,4 L0,8 Z" fill="${C.arrSolid}"/>
    </marker>
    <marker id="arrD" markerWidth="10" markerHeight="10" refX="9" refY="4" orient="auto">
      <path d="M0,0 L10,4 L0,8 Z" fill="${C.arrDash}"/>
    </marker>
  </defs>
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  ${body}
</svg>`;
  }
  return { arr, arrV, box, midBlock, lblBlock, header, footer, svgWrap };
}

/** Điều 6.3 — palette xanh lục / cyan */
function build63() {
  const C = {
    bg: "#0a1f1c",
    title: "#ecfdf5",
    subtitle: "#5eead4",
    note: "#64748b",
    lbl: "#166534",
    lblText: "#ecfdf5",
    lblSub: "#a7f3d0",
    src: "#0e7490",
    c1: "#047857",
    c2: "#0369a1",
    end: "#0891b2",
    foot: "#134e4a",
    footText: "#f0fdfa",
    footSub: "#94a3b8",
    stroke: "rgba(110,231,183,0.18)",
    arrSolid: "#6ee7b7",
    arrDash: "#94a3b8",
  };
  const Hlp = mkHelpers(C);
  const { rows, footY, footH, gaps } = layoutRows(3);
  const [R1, R2, R3] = rows;
  const R1CX = CX + CONTENT_W / 2;
  const C1X = CX + CONTENT_W / 4;
  const C2X = CX + (CONTENT_W * 3) / 4;
  const halfW = Math.floor((CONTENT_W - 20) / 2);
  const C2BX = CX + halfW + 20;
  const MID12 = R1.b + gaps / 2;
  const MID23 = R2.b + gaps / 2;

  const body = `
  ${Hlp.header(
    "L\u01AF\u1EDAI KH\u1ED0NG CH\u1EBE M\u1EB6T B\u1EB2NG THI C\u00D4NG",
    "TCVN 9401:2024 \u00B7 \u0110i\u1EC1u 6.3 \u00B7 GNSS t\u0129nh \u00B7 B\u1EA3ng 3",
    "Ph\u1EE5c v\u1EE5 b\u1ED1 tr\u00ED h\u1EA1ng m\u1EE5c c\u00F4ng tr\u00ECnh t\u1EEB thi\u1EBFt k\u1EBF ra th\u1EF1c \u0111\u1ECBa"
  )}

  ${Hlp.box(LX, R1.y, LW, R1.h, C.lbl)}
  ${Hlp.box(CX, R1.y, CONTENT_W, R1.h, C.src)}
  ${Hlp.lblBlock(R1.y, R1.h, "NGU\u1ED2N", "(\u0110i\u1EC1u 6.3.7)")}
  ${Hlp.midBlock(R1CX, R1.y, R1.h, [
    { t: "L\u01AF\u1EDAI KS C\u00D4NG TR\u00CCNH / \u0110I\u1EC2M T\u1ECCA \u0110\u1ED8 KH\u1EA2O S\u00C1T", fs: 17, bold: true, fill: "#fff" },
    { t: "Kh\u1EDFi tinh VN-2000 \u00B7 \u0111o n\u1ED1i \u2265 3 \u0111i\u1EC3m (\u2264 3 \u0111i\u1EC3m m\u1EDBi: \u2265 2 \u0111i\u1EC3m)", fs: 13, fill: "#cffafe" },
    { t: "GNSS t\u0129nh \u00B7 l\u01B0\u1EDBi c\u1EA1nh ng\u1eafn tr\u00EAn m\u1EB7t b\u1EB1ng XD", fs: 13, fill: "#a5f3fc" },
  ])}
  ${Hlp.arrV(C1X, R1.b, R2.t)}
  ${Hlp.arrV(C2X, R1.b, R2.t)}
  <line x1="${LX}" y1="${MID12}" x2="${RX}" y2="${MID12}" stroke="#64748b" stroke-width="1.5" stroke-dasharray="10 8" opacity="0.5"/>

  ${Hlp.box(LX, R2.y, LW, R2.h, C.lbl)}
  ${Hlp.box(CX, R2.y, halfW, R2.h, C.c1)}
  ${Hlp.box(C2BX, R2.y, halfW, R2.h, C.c2)}
  ${Hlp.lblBlock(R2.y, R2.h, "HAI C\u1EA4P", "(\u0110i\u1EC1u 6.3.1)")}
  ${Hlp.midBlock(CX + halfW / 2, R2.y, R2.h, [
    { t: "\u0110\u1ED8 CH\u00CDNH X\u00C1C C\u1EA4P 1", fs: 17, bold: true, fill: "#fff" },
    { t: "Kho\u1EA3ng c\u00E1ch TB 300\u2013500 m (\u0110i\u1EC1u 6.3.2, B\u1EA3ng 3)", fs: 13, fill: "#d1fae5" },
    { t: "CT &gt; 1 km\u00B2 \u00B7 KCN quan tr\u1ECDng (\u0110i\u1EC1u 6.3.3)", fs: 12, fill: "#fef08a" },
    { t: "MP c\u1EA1nh y\u1EBFu 1/40 000", fs: 11, fill: "#bbf7d0" },
  ])}
  ${Hlp.midBlock(C2BX + halfW / 2, R2.y, R2.h, [
    { t: "\u0110\u1ED8 CH\u00CDNH X\u00C1C C\u1EA4P 2", fs: 17, bold: true, fill: "#fff" },
    { t: "Kho\u1EA3ng c\u00E1ch TB 100\u2013300 m (\u0110i\u1EC1u 6.3.2, B\u1EA3ng 3)", fs: 13, fill: "#e0f2fe" },
    { t: "CT &lt; 1 km\u00B2 \u00B7 khu XD th\u00F4ng th\u01B0\u1EDDng (\u0110i\u1EC1u 6.3.3)", fs: 12, fill: "#fef08a" },
    { t: "MP c\u1EA1nh y\u1EBFu 1/20 000", fs: 11, fill: "#bae6fd" },
  ])}
  ${Hlp.arr(C1X, R2.b, R1CX, R3.t, true)}
  ${Hlp.arr(C2BX + halfW / 2, R2.b, R1CX, R3.t, true)}
  <line x1="${LX}" y1="${MID23}" x2="${RX}" y2="${MID23}" stroke="#64748b" stroke-width="1.5" stroke-dasharray="10 8" opacity="0.5"/>

  ${Hlp.box(LX, R3.y, LW, R3.h, C.lbl)}
  ${Hlp.box(CX, R3.y, CONTENT_W, R3.h, C.end)}
  ${Hlp.lblBlock(R3.y, R3.h, "THI C\u00D4NG", "(\u0110i\u1EC1u 6.3.1)")}
  ${Hlp.midBlock(R1CX, R3.y, R3.h, [
    { t: "B\u1ED0 TR\u00cd H\u1EA0NG M\u1EE4C CT \u00B7 M\u1ED0C KI\u00CAN TR\u00CAN M\u1EB6T B\u1EB2NG XD", fs: 18, bold: true, fill: "#fff" },
    { t: "M\u1ED1c b\u00EA t\u00F4ng / \u0111\u00FAc s\u1EB5n / khoan g\u1eafn tr\u00EAn n\u1EC1n \u0111\u00E1, b\u00EA t\u00F4ng (\u0110i\u1EC1u 6.3.6, PL A)", fs: 13, fill: "#cffafe" },
    { t: "Hi\u1EC7u s\u1ED1 \u0111\u1ED9 cao &gt; 32 m: hi\u1EC7u ch\u1EC9nh m\u1EB7t chi\u1EBFu (\u0110i\u1EC1u 6.3.8, TCVN 9398)", fs: 12, fill: "#a5f3fc" },
  ])}

  ${Hlp.footer(
    footY,
    footH,
    `<tspan font-weight="700" fill="#4ade80">Li\u00EAn k\u1EBFt \u0111\u1ED9 ch\u00EDnh x\u00E1c (\u0110i\u1EC1u 6.3.4):</tspan> MP \u0111i\u1EC3m y\u1EBFu 2,0 cm \u2192 quy \u0111\u1ECBa l\u01B0\u1EDBi CS c\u1EA5p 2 (KS CT); 1,5 cm \u2192 QT CD ngang c\u1EA5p 4; \u2264 0,5 cm \u2192 QT c\u1EA5p 1\u20132.`,
    "Ngu\u1ED3n: TCVN 9401:2024 \u2014 \u0110i\u1EC1u 6.3, B\u1EA3ng 3; tham chi\u1EBFu \u0110i\u1EC1u 6.2 (l\u01B0\u1EDBi KS c\u00F4ng tr\u00ECnh)."
  )}`;

  return Hlp.svgWrap(C, body);
}

/** Điều 6.4 — palette hồng / cam / vàng / indigo */
function build64() {
  const C = {
    bg: "#1a1210",
    title: "#fff7ed",
    subtitle: "#fdba74",
    note: "#78716c",
    lbl: "#92400e",
    lblText: "#fffbeb",
    lblSub: "#fde68a",
    coord: "#4338ca",
    base: "#7c2d12",
    c1: "#be123c",
    c2: "#c2410c",
    c3: "#a16207",
    c4: "#3f6212",
    end: "#581c87",
    foot: "#292018",
    footText: "#fef3c7",
    footSub: "#a8a29e",
    stroke: "rgba(251,191,36,0.16)",
    arrSolid: "#fbbf24",
    arrDash: "#94a3b8",
  };
  const Hlp = mkHelpers(C);
  const { rows, footY, footH, gaps } = layoutRows(4, 92);
  const [R1, R2, R3, R4] = rows;
  const CXM = CX + CONTENT_W / 2;
  const colW = Math.floor((CONTENT_W - 30) / 4);
  const cxs = [CX + colW / 2, CX + colW + 10 + colW / 2, CX + 2 * (colW + 10) + colW / 2, CX + 3 * (colW + 10) + colW / 2];
  const fills = [C.c1, C.c2, C.c3, C.c4];
  const MID = (a, b) => a.b + gaps / 2;

  const body = `
  ${Hlp.header(
    "L\u01AF\u1EDAI QUAN TR\u1EAEC CHUY\u1EC2N D\u1ECACH NGANG",
    "TCVN 9401:2024 \u00B7 \u0110i\u1EC1u 6.4 \u00B7 GNSS t\u0129nh \u00B7 B\u1EA3ng 4",
    "Gi\u00E1m s\u00E1t bi\u1EBFn d\u1EA1ng ngang c\u00F4ng tr\u00ECnh \u00B7 h\u1EC7 t\u1ECDa \u0111\u1ED9 \u0111\u1ED9c l\u1EADp"
  )}

  ${Hlp.box(LX, R1.y, LW, R1.h, C.lbl)}
  ${Hlp.box(CX, R1.y, CONTENT_W, R1.h, C.coord)}
  ${Hlp.lblBlock(R1.y, R1.h, "H\u1EC6 T\u1ECAA", "(\u0110i\u1EC1u 6.4.4)")}
  ${Hlp.midBlock(CXM, R1.y, R1.h, [
    { t: "H\u1EC6 T\u1ECAA \u0110\u1ED8 \u0110\u1ED8C L\u1EACP", fs: 17, bold: true, fill: "#fff" },
    { t: "Khi c\u1EA7n t\u1ECDa \u0111\u1ED9 QG: \u0111o n\u1ED1i m\u1ED9t s\u1ED1 \u0111i\u1EC3m t\u1ECDa \u0111\u1ED9 qu\u1ED1c gia", fs: 13, fill: "#c7d2fe" },
    { t: "GNSS khi t\u1EA7m th\u00F4ng tho\u00E1ng t\u1ED1t (\u0110i\u1EC1u 6.4.2, 6.2.8)", fs: 13, fill: "#e0e7ff" },
  ])}
  ${Hlp.arrV(CXM, R1.b, R2.t)}
  <line x1="${LX}" y1="${MID(R1, R2)}" x2="${RX}" y2="${MID(R1, R2)}" stroke="#64748b" stroke-width="1.5" stroke-dasharray="10 8" opacity="0.5"/>

  ${Hlp.box(LX, R2.y, LW, R2.h, C.lbl)}
  ${Hlp.box(CX, R2.y, CONTENT_W, R2.h, C.base)}
  ${Hlp.lblBlock(R2.y, R2.h, "B\u1EACC 1", "(\u0110i\u1EC1u 6.4.5)")}
  ${Hlp.midBlock(CXM, R2.y, R2.h, [
    { t: "L\u01AF\u1EDAI C\u01A0 S\u1EDE \u2014 M\u1ED0C CHU\u1EA8N", fs: 17, bold: true, fill: "#fff" },
    { t: "C\u00E1c m\u1ED1c chu\u1EA9n \u0111o n\u1ED1i v\u1EDBi nhau \u00B7 v\u00F2ng kh\u00E9p", fs: 13, fill: "#fed7aa" },
    { t: "C\u1EA5p 1\u20132 \u0111\u1ED9 ch\u00EDnh x\u00E1c cao: c\u00F3 th\u1EC3 1 b\u1EADc l\u01B0\u1EDBi duy nh\u1EA5t", fs: 12, fill: "#fef08a" },
  ])}
  ${cxs.map((cx) => Hlp.arr(cx, R2.b, cx, R3.t)).join("\n  ")}
  <line x1="${LX}" y1="${MID(R2, R3)}" x2="${RX}" y2="${MID(R2, R3)}" stroke="#64748b" stroke-width="1.5" stroke-dasharray="10 8" opacity="0.5"/>

  ${Hlp.box(LX, R3.y, LW, R3.h, C.lbl)}
  ${cxs
    .map((cx, i) => {
      const x = CX + i * (colW + 10);
      return Hlp.box(x, R3.y, colW, R3.h, fills[i]);
    })
    .join("\n  ")}
  ${Hlp.lblBlock(R3.y, R3.h, "4 C\u1EA4P", "(\u0110i\u1EC1u 6.4.2)")}
  ${Hlp.midBlock(cxs[0], R3.y, R3.h, [
    { t: "C\u1EA4P 1", fs: 16, bold: true, fill: "#fff" },
    { t: "M\u1ED1c \u0111\u1ECBnh t\u00E2m b\u1EAFt bu\u1ED9c", fs: 12, fill: "#fecdd3" },
    { t: "(\u0110i\u1EC1u 6.4.6)", fs: 11, fill: "#fda4af" },
  ])}
  ${Hlp.midBlock(cxs[1], R3.y, R3.h, [
    { t: "C\u1EA4P 2", fs: 16, bold: true, fill: "#fff" },
    { t: "\u0110\u1ED9 ch\u00EDnh x\u00E1c cao", fs: 12, fill: "#ffedd5" },
    { t: "M\u00E1y \u2265 3 t\u1EA7n s\u1ED1 (B\u1EA3ng 5)", fs: 11, fill: "#fed7aa" },
  ])}
  ${Hlp.midBlock(cxs[2], R3.y, R3.h, [
    { t: "C\u1EA4P 3", fs: 16, bold: true, fill: "#fff" },
    { t: "Quan tr\u1EAFc th\u01B0\u1EDDng", fs: 12, fill: "#fef9c3" },
    { t: "Sai s\u1ED1 c\u1EA1nh &lt; (5 mm + 1 mm\u00B7D)", fs: 11, fill: "#fde047" },
  ])}
  ${Hlp.midBlock(cxs[3], R3.y, R3.h, [
    { t: "C\u1EA4P 4", fs: 16, bold: true, fill: "#fff" },
    { t: "Quan tr\u1EAFc m\u1EE9c \u0111\u1ED9 th\u1EA5p h\u01A1n", fs: 12, fill: "#ecfccb" },
    { t: "Li\u00EAn k\u1EBFt MP 1,5 cm (\u0110i\u1EC1u 6.3.4)", fs: 11, fill: "#d9f99d" },
  ])}
  ${cxs.map((cx) => Hlp.arr(cx, R3.b, CXM, R4.t, true)).join("\n  ")}
  <line x1="${LX}" y1="${MID(R3, R4)}" x2="${RX}" y2="${MID(R3, R4)}" stroke="#64748b" stroke-width="1.5" stroke-dasharray="10 8" opacity="0.5"/>

  ${Hlp.box(LX, R4.y, LW, R4.h, C.lbl)}
  ${Hlp.box(CX, R4.y, CONTENT_W, R4.h, C.end)}
  ${Hlp.lblBlock(R4.y, R4.h, "QUAN TR\u1EAEC", "(\u0110i\u1EC1u 6.4.1)")}
  ${Hlp.midBlock(CXM, R4.y, R4.h, [
    { t: "M\u1ED0C QUAN TR\u1EAEC TR\u00CAN C\u00D4NG TR\u00CCNH", fs: 18, bold: true, fill: "#fff" },
    { t: "M\u1ED1c chu\u1EA9n + \u0111i\u1EC3m c\u01A1 s\u1EDF trung gian + m\u1ED1c g\u1EAFn tr\u1EF1c ti\u1EBFp tr\u00EAn CT", fs: 13, fill: "#e9d5ff" },
    { t: "B\u1EADc 2: l\u01B0\u1EDBi quan tr\u1EAFc n\u1ED1i m\u1ED1c chu\u1EA9n \u2194 m\u1ED1c tr\u00EAn c\u00F4ng tr\u00ECnh (\u0110i\u1EC1u 6.4.5)", fs: 12, fill: "#ddd6fe" },
  ])}

  ${Hlp.footer(
    footY,
    footH,
    `<tspan font-weight="700" fill="#fb923c">C\u1EA5u tr\u00FAc (\u0110i\u1EC1u 6.4.5):</tspan> 1\u20132 b\u1EADc \u2014 b\u1EADc 1: l\u01B0\u1EDBi c\u01A1 s\u1EDF; b\u1EADc 2: l\u01B0\u1EDBi quan tr\u1EAFc. \u0110\u1ED9 ch\u00EDnh x\u00E1c cao (c\u1EA5p 1\u20132): c\u00F3 th\u1EC3 thi\u1EBFt k\u1EBF 1 b\u1EADc.`,
    "Ngu\u1ED3n: TCVN 9401:2024 \u2014 \u0110i\u1EC1u 6.4, B\u1EA3ng 4\u20135; tham chi\u1EBFu TCVN 9399 (m\u1ED1c QT)."
  )}`;

  return Hlp.svgWrap(C, body);
}

async function exportOne(svg, base) {
  const svgPath = path.join(outDir, `${base}.svg`);
  const pngPath = path.join(outDir, `${base}.png`);
  const png4k = path.join(outDir, `${base}-4k.png`);
  fs.writeFileSync(svgPath, svg, "utf8");
  const buf = Buffer.from(svg, "utf8");
  await sharp(buf, { density: 150 }).png().toFile(pngPath);
  await sharp(buf, { density: 220 }).resize(3840, 2160).png().toFile(png4k);
  console.log("OK", pngPath, fs.statSync(pngPath).size);
}

async function main() {
  await exportOne(build63(), "so-do-luoi-tcvn9401-2024-thicong");
  await exportOne(build64(), "so-do-luoi-tcvn9401-2024-quantrac");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
