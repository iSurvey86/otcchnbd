/**
 * PNG sơ đồ lưới TCVN 9401:2024 — 1920×1080, nền tối (cùng style TT 68)
 * Nguồn: Điều 6.2 — lưới khống chế khảo sát công trình (GNSS tĩnh)
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
const CW1 = 780;
const CX2 = CX + CW1 + 20;
const CW2 = 804;
const CS1W = 380;
const CS2X = CX + CS1W + 10;
const CS2W = 390;
const ELVX = CS2X + CS2W + 10;

const CS1CX = CX + CS1W / 2;
const CS2CX = CS2X + CS2W / 2;
const ELVCX = ELVX + CW2 / 2;
const DV1CX = CX + CW1 / 2;
const DV2CX = CX2 + CW2 / 2;
const DETAIL_CX = 960;

const R1Y = 95;
const R1H = 140;
const GAP12 = 65;
const R2Y = R1Y + R1H + GAP12;
const R2H = 155;
const GAP23 = 65;
const R3Y = R2Y + R2H + GAP23;
const R3H = 182;
const GAP34 = 65;
const R4Y = R3Y + R3H + GAP34;
const R4H = 110;
const FOOTH = 110;
const FOOTY = H - 48 - FOOTH;

const R1B = R1Y + R1H;
const R2T = R2Y;
const R2B = R2Y + R2H;
const R3T = R3Y;
const R3B = R3Y + R3H;
const R4T = R4Y;
const MID12 = R1B + GAP12 / 2;
const MID23 = R2B + GAP23 / 2;

const C = {
  bg: "#12121f",
  lbl: "#6366f1",
  lblText: "#eef2ff",
  lblSub: "#c7d2fe",
  coord: "#4f46e5",
  elev: "#db2777",
  both: "#9333ea",
  end: "#0e7490",
  foot: "#1e1b4b",
  stroke: "rgba(199,210,254,0.16)",
};

function arr(x1, y1, x2, y2, dashed = false) {
  const dash = dashed ? ' stroke-dasharray="7 5"' : "";
  const mk = dashed ? "arrD" : "arr";
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${dashed ? "#a5b4fc" : "#c4b5fd"}" stroke-width="${dashed ? 2 : 2.5}" marker-end="url(#${mk})"${dash}/>`;
}

function arrV(cx, yFrom, yTo, dashed = false) {
  return arr(cx, yFrom, cx, yTo, dashed);
}

function box(x, y, w, h, fill, r = 10) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${C.stroke}" stroke-width="1"/>`;
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

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <marker id="arr" markerWidth="10" markerHeight="10" refX="9" refY="4" orient="auto">
      <path d="M0,0 L10,4 L0,8 Z" fill="#cbd5e1"/>
    </marker>
    <marker id="arrD" markerWidth="10" markerHeight="10" refX="9" refY="4" orient="auto">
      <path d="M0,0 L10,4 L0,8 Z" fill="#94a3b8"/>
    </marker>
  </defs>

  <rect width="${W}" height="${H}" fill="${C.bg}"/>

  <text x="960" y="42" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700" fill="#f8fafc">
    H\u1EC6 TH\u1ED0NG L\u01AF\u1EDAI T\u1ECCA \u0110\u1ED8 V\u00C0 \u0110\u1ED8 CAO
  </text>
  <text x="960" y="68" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="14" fill="#93c5fd">
    TCVN 9401:2024 \u00B7 L\u01B0\u1EDBi kh\u1ED1ng ch\u1EBF khảo s\u00E1t c\u00F4ng tr\u00ECnh (GNSS t\u0129nh)
  </text>
  <text x="960" y="86" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="12" fill="#64748b">
    \u0110i\u1EC1u 6.2 \u00B7 \u0110\u1ECBnh ngh\u0129a 3.x (l\u01B0\u1EDBi qu\u1ED1c gia) \u00B7 B\u1EA3ng 2
  </text>

  <!-- H\u00C0NG 1 -->
  ${box(LX, R1Y, LW, R1H, C.lbl)}
  ${box(CX, R1Y, CW1, R1H, C.coord)}
  ${box(CX2, R1Y, CW2, R1H, C.elev)}
  ${lblBlock(R1Y, R1H, "L\u01AF\u1EDAI QU\u1ED0C GIA", "(\u0110\u1ECBnh ngh\u0129a 3.x)")}
  ${midBlock(CX + CW1 / 2, R1Y, R1H, [
    { t: "L\u01AF\u1EDAI T\u1ECCA \u0110\u1ED8 QU\u1ED0C GIA", fs: 17, bold: true, fill: "#fff" },
    { t: "H\u1EC7 VN-2000 \u00B7 th\u1ED1ng nh\u1EA5t to\u00E0n qu\u1ED1c", fs: 13, fill: "#dbeafe" },
    { t: "C\u1EA5p 0 \u00B7 H\u1EA1ng I \u00B7 II \u00B7 III", fs: 14, fw: "600", fill: "#fef08a" },
  ])}
  ${midBlock(CX2 + CW2 / 2, R1Y, R1H, [
    { t: "L\u01AF\u1EDAI \u0110\u1ED8 CAO QU\u1ED0C GIA", fs: 17, bold: true, fill: "#fff" },
    { t: "\u0110i\u1EC3m g\u1ED1c \u0111\u1ED9 cao qu\u1ED1c gia (\u0110\u1ED3 S\u01A1n)", fs: 13, fill: "#ffedd5" },
    { t: "H\u1EA1ng I \u00B7 II \u00B7 III \u00B7 IV", fs: 14, fw: "600", fill: "#fef08a" },
  ])}
  ${arrV(CS1CX, R1B, R2T)}
  ${arrV(CS2CX, R1B, R2T)}
  ${arrV(ELVCX, R1B, R2T)}
  <line x1="${LX}" y1="${MID12}" x2="${RX}" y2="${MID12}" stroke="#64748b" stroke-width="1.5" stroke-dasharray="10 8" opacity="0.6"/>

  <!-- H\u00C0NG 2 -->
  ${box(LX, R2Y, LW, R2H, C.lbl)}
  ${box(CX, R2Y, CS1W, R2H, C.coord)}
  ${box(CS2X, R2Y, CS2W, R2H, C.coord)}
  ${box(ELVX, R2Y, CW2, R2H, C.elev)}
  ${lblBlock(R2Y, R2H, "L\u01AF\u1EDAI C\u01A0 S\u1EDE", "(\u0110i\u1EC1u 6.2.1)")}
  ${midBlock(CS1CX, R2Y, R2H, [
    { t: "C\u01A0 S\u1EDE C\u1EA4P 1", fs: 16, bold: true, fill: "#fff" },
    { t: "GNSS t\u0129nh \u00B7 t\u1EEB \u0111i\u1EC3m t\u1ECDa \u0111\u1ED9 QG", fs: 13, fill: "#dbeafe" },
    { t: "Kho\u1EA3ng c\u00E1ch 1\u20135 km (\u0110i\u1EC1u 6.2.6, B\u1EA3ng 2)", fs: 12, fill: "#bfdbfe" },
  ])}
  ${midBlock(CS2CX, R2Y, R2H, [
    { t: "C\u01A0 S\u1EDE C\u1EA4P 2", fs: 16, bold: true, fill: "#fff" },
    { t: "GNSS t\u0129nh \u00B7 t\u0103ng d\u00E0y \u0111i\u1EC3m KC", fs: 13, fill: "#dbeafe" },
    { t: "T\u1EEB l\u01B0\u1EDBi c\u01A1 s\u1EDF c\u1EA5p 1 tr\u1EDF l\u00EAn (\u0110i\u1EC1u 6.2.6)", fs: 12, fill: "#bfdbfe" },
    { t: "C\u00F3 th\u1EC3 \u0111o v\u1EBD chi ti\u1EBFt tr\u1EF1c ti\u1EBFp", fs: 11, fill: "#93c5fd" },
  ])}
  ${midBlock(ELVCX, R2Y, R2H, [
    { t: "L\u01AF\u1EDAI \u0110\u1ED8 CAO K\u1EF8 THU\u1EADT", fs: 16, bold: true, fill: "#fff" },
    { t: "01 c\u1EA5p \u0111\u1ED9 cao trong KC c\u01A1 s\u1EDF", fs: 13, fill: "#ffedd5" },
    { t: "G\u1ED1c: \u0111\u1ED9 cao QG h\u1EA1ng IV tr\u1EDF l\u00EAn", fs: 12, fill: "#fed7aa" },
    { t: "K\u1EBF h\u1EE3p GNSS t\u0129nh (\u0110i\u1EC1u 5.7)", fs: 11, fill: "#fdba74" },
  ])}
  ${arr(CS1CX, R2B, DV1CX, R3T)}
  ${arr(CS2CX, R2B, DV1CX, R3T)}
  ${arr(CS2CX, R2B, DV2CX, R3T)}
  ${arr(ELVCX, R2B, DV1CX, R3T)}
  ${arr(ELVCX, R2B, DV2CX, R3T)}
  <line x1="${LX}" y1="${MID23}" x2="${RX}" y2="${MID23}" stroke="#64748b" stroke-width="1.5" stroke-dasharray="10 8" opacity="0.6"/>

  <!-- H\u00C0NG 3 -->
  ${box(LX, R3Y, LW, R3H, C.lbl)}
  ${box(CX, R3Y, CW1, R3H, C.both)}
  ${box(CX2, R3Y, CW2, R3H, C.both)}
  ${lblBlock(R3Y, R3H, "L\u01AF\u1EDAI \u0110O V\u1EBC", "(\u0110i\u1EC1u 6.2.7)")}
  ${midBlock(DV1CX, R3Y, R3H, [
    { t: "\u0110O V\u1EBC C\u1EA4P 1", fs: 17, bold: true, fill: "#fff" },
    { t: "GNSS t\u0129nh \u2014 t\u1ECDa \u0111\u1ED9 &amp; \u0111\u1ED9 cao \u0111\u1ED3ng th\u1EDDi", fs: 13, fill: "#ede9fe" },
    { t: "MP v\u1ECB tr\u00ED 0,02 m \u00B7 MP \u0111\u1ED9 cao 0,03 m", fs: 13, fill: "#ede9fe" },
    { t: "(\u0110i\u1EC1u 6.2.13 \u00B7 B\u1EA3ng 2)", fs: 12, fill: "#fef08a" },
    { t: "\u2265 3 \u0111i\u1EC3m g\u1ED1c t\u1ECDa \u0111\u1ED9 / \u0111\u1ED9 cao QG", fs: 11, fill: "#ddd6fe" },
  ])}
  ${midBlock(DV2CX, R3Y, R3H, [
    { t: "\u0110O V\u1EBC C\u1EA4P 2", fs: 17, bold: true, fill: "#fff" },
    { t: "GNSS t\u0129nh / GNSS \u0111\u1ED9ng / \u0111\u01B0\u1EDDng chuy\u1EC1n", fs: 13, fill: "#ede9fe" },
    { t: "MP v\u1ECB tr\u00ED 0,03 m \u00B7 l\u01B0\u1EDBi KC cu\u1ED1i c\u00F9ng", fs: 13, fill: "#ede9fe" },
    { t: "(\u0110i\u1EC1u 6.2.14\u20136.2.15 \u00B7 B\u1EA3ng 2)", fs: 12, fill: "#fef08a" },
    { t: "T\u0103ng d\u00E0y \u0111i\u1EC3m ph\u1EE5c v\u1EE5 \u0111o \u0111\u1EA1c chi ti\u1EBFt", fs: 11, fill: "#ddd6fe" },
  ])}
  ${arr(DV1CX, R3B, DETAIL_CX, R4T, true)}
  ${arr(DV2CX, R3B, DETAIL_CX, R4T, true)}
  <line x1="${LX}" y1="${R3B + 24}" x2="${RX}" y2="${R3B + 24}" stroke="#64748b" stroke-width="1.5" stroke-dasharray="10 8" opacity="0.6"/>

  <!-- H\u00C0NG 4 -->
  ${box(LX, R4Y, LW, R4H, C.lbl)}
  ${box(CX, R4Y, 1872 - CX, R4H, C.end)}
  ${lblBlock(R4Y, R4H, "CHI TI\u1EBET", "(\u0110i\u1EC1u 6.2.1)")}
  ${midBlock(960, R4Y, R4H, [
    { t: "\u0110O V\u1EBD B\u1EA2N \u0110\u1ED2 \u0110\u1ECAA H\u00CCNH C\u00D4NG TR\u00CCNH", fs: 18, bold: true, fill: "#fff" },
    { t: "1:500 \u00B7 1:1000 \u00B7 1:2000 \u00B7 1:5000  |  \u0110o \u0111\u1EA1c \u0111\u1ECBa h\u00ECnh, \u0111\u1ECBa v\u1EADt ph\u1EE5c v\u1EE5 thi\u1EBFt k\u1EBF XD", fs: 13, fill: "#ccfbf1" },
  ])}

  <!-- Ch\u00E2n -->
  ${box(LX, FOOTY, 1872 - LX, FOOTH, C.foot, 8)}
  <text x="68" y="${FOOTY + 38}" font-family="Segoe UI, Arial, sans-serif" font-size="15" fill="#f1f5f9">
    <tspan font-weight="700" fill="#fbbf24">Nguy\u00EAn t\u1EAFc (\u0110i\u1EC1u 6.2.2):</tspan>
    c\u1EA5p cao \u2192 c\u1EA5p th\u1EA5p; t\u1ED5ng th\u1EC3 \u2192 c\u1EE5c b\u1ED9.
    <tspan font-weight="700" fill="#67e8f9"> GNSS:</tspan>
    c\u00F3 th\u1EC3 b\u1ECF qua c\u1EA5p trung gian khi x\u00E2y d\u1EF1ng l\u01B0\u1EDBi t\u1ECDa \u0111\u1ED9 c\u1EA5p th\u1EA5p h\u01A1n.
  </text>
  <text x="68" y="${FOOTY + 72}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#94a3b8">
    Ngu\u1ED3n: TCVN 9401:2024 \u2014 \u0110i\u1EC1u 6.2 (l\u01B0\u1EDBi KS c\u00F4ng tr\u00ECnh), \u0110\u1ECBnh ngh\u0129a 3.x, B\u1EA3ng 2; tham chi\u1EBFu TT 68/2015 v\u1EC1 ph\u00E2n c\u1EA5p l\u01B0\u1EDBi qu\u1ED1c gia.
  </text>
</svg>`;

async function main() {
  const svgPath = path.join(outDir, "so-do-luoi-tcvn9401-2024.svg");
  const pngPath = path.join(outDir, "so-do-luoi-tcvn9401-2024.png");
  const png4k = path.join(outDir, "so-do-luoi-tcvn9401-2024-4k.png");
  fs.writeFileSync(svgPath, svg, "utf8");
  const buf = Buffer.from(svg, "utf8");
  await sharp(buf, { density: 150 }).png().toFile(pngPath);
  await sharp(buf, { density: 220 }).resize(3840, 2160).png().toFile(png4k);
  console.log("OK", pngPath, fs.statSync(pngPath).size);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
