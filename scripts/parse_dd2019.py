# Parse ngân hàng câu hỏi ĐDBĐ 2019 (QĐ BTNMT 2019) from extracted PDF text.
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "tmp-dd-2019-bank.txt"
OUT_JSON = ROOT / "src" / "data" / "dd" / "official-2019.json"

SOURCE = (
    "Ngân hàng câu hỏi phục vụ sát hạch CCHN Đo đạc và Bản đồ "
    "(ban hành kèm QĐ số 2317/QĐ-BTNMT ngày 06/9/2019)"
)

# Sửa câu bị lỗi trích xuất PDF (page break / thiếu nhãn a–d).
LAW_PATCH_BY_NUM: dict[int, dict] = {
    1: {
        "prompt": "Nội dung hoạt động đo đạc và bản đồ cơ bản không bao gồm hoạt động nào sau đây:",
        "options": [
            "Thành lập bản đồ địa hình quốc gia tỷ lệ 1:1.000.000",
            "Đo đạc, thành lập bản đồ địa chính",
            "Xây dựng hệ thống dữ liệu ảnh hàng không và hệ thống dữ liệu ảnh viễn thám",
            "Xây dựng cơ sở dữ liệu nền địa lý quốc gia và thành lập bản đồ địa hình quốc gia tỷ lệ 1:2.000",
        ],
        "answer": 1,
    },
    4: {
        "prompt": "Bộ Tài nguyên và Môi trường có trách nhiệm nào sau đây:",
        "options": [
            "Xây dựng, cập nhật cơ sở dữ liệu nền địa lý quốc gia tỷ lệ 1:2.000",
            "Xây dựng, cập nhật cơ sở dữ liệu nền địa lý quốc gia tỷ lệ 1:5.000",
            "Xây dựng, cập nhật cơ sở dữ liệu đo đạc và bản đồ về địa giới hành chính",
            "Đo đạc, thành lập bản đồ phục vụ lập hồ sơ địa giới hành chính các cấp",
        ],
        "answer": 2,
    },
    5: {
        "prompt": "Bộ Tài nguyên và Môi trường không có trách nhiệm nào sau đây:",
        "options": [
            "Xây dựng, cập nhật cơ sở dữ liệu nền địa lý quốc gia trên đất liền tỷ lệ 1:10.000",
            "Thành lập, cập nhật hệ thống bản đồ địa hình quốc gia trên đất liền tỷ lệ 1:10.000",
            "Xây dựng, cập nhật cơ sở dữ liệu và bản đồ địa hình quốc gia khu vực đảo, quần đảo, bản đồ địa hình đáy biển tỷ lệ 1:10.000",
            "Xây dựng, cập nhật cơ sở dữ liệu nền địa lý quốc gia tỷ lệ 1:2.000",
        ],
        "answer": 3,
    },
    8: {
        "prompt": "Cơ quan nào sau đây có trách nhiệm tổ chức thực hiện đo đạc, thành lập hải đồ vùng biển Việt Nam và liền kề:",
        "options": [
            "Bộ Quốc phòng",
            "Bộ Giao thông vận tải",
            "Bộ Tài nguyên và Môi trường",
            "Bộ Nông nghiệp và Phát triển nông thôn",
        ],
        "answer": 0,
    },
    9: {
        "prompt": "Cơ quan nào sau đây có trách nhiệm ban hành quy chuẩn kỹ thuật quốc gia về đo đạc, thành lập bản đồ công trình ngầm:",
        "options": [
            "Bộ Tài nguyên và Môi trường",
            "Bộ Xây dựng",
            "Bộ Công thương",
            "Ủy ban nhân dân cấp tỉnh",
        ],
        "answer": 1,
    },
    10: {
        "prompt": "Trách nhiệm tổ chức bảo vệ mốc đo đạc quốc gia thuộc cơ quan, tổ chức, cá nhân nào sau đây:",
        "options": [
            "Bộ Tài nguyên và Môi trường",
            "Ủy ban nhân dân cấp tỉnh",
            "Chủ sử dụng đất nơi có mốc đo đạc quốc gia",
            "Chủ đầu tư xây dựng mốc",
        ],
        "answer": 1,
    },
    34: {
        "prompt": "Trách nhiệm hướng dẫn thể hiện đường biên giới quốc gia, chủ quyền lãnh thổ trên sản phẩm đo đạc và bản đồ, xuất bản phẩm bản đồ thuộc cơ quan nào sau đây:",
        "options": [
            "Bộ Ngoại giao",
            "Bộ Quốc phòng",
            "Bộ Tài nguyên và Môi trường",
            "Bộ Nội vụ",
        ],
        "answer": 2,
    },
    42: {
        "prompt": "Trách nhiệm ban hành quy chuẩn kỹ thuật quốc gia về đo đạc và bản đồ cơ bản thuộc cơ quan nào sau đây:",
        "options": [
            "Bộ Tài nguyên và Môi trường",
            "Các bộ, ngành có liên quan đến hoạt động đo đạc và bản đồ",
            "Bộ Khoa học và Công nghệ",
            "Bao gồm tất cả các cơ quan nêu tại a, b và c",
        ],
        "answer": 0,
    },
    43: {
        "prompt": "Trách nhiệm ban hành định mức kinh tế - kỹ thuật về đo đạc và bản đồ cơ bản thuộc cơ quan nào sau đây:",
        "options": [
            "Bộ Tài nguyên và Môi trường",
            "Các bộ, ngành có liên quan đến hoạt động đo đạc và bản đồ",
            "Bộ Tài chính",
            "Bao gồm tất cả các cơ quan nêu tại a, b và c",
        ],
        "answer": 0,
    },
    52: {
        "prompt": "Cơ quan nào sau đây có thẩm quyền quy định về miễn, giảm phí khai thác, sử dụng thông tin, dữ liệu đo đạc và bản đồ phục vụ mục đích quốc phòng, an ninh, phòng, chống thiên tai:",
        "options": [
            "Bộ Tài nguyên và Môi trường",
            "Bộ Tài chính",
            "Bộ Quốc phòng",
            "Ủy ban nhân dân cấp tỉnh",
        ],
        "answer": 1,
    },
    59: {
        "prompt": "Cơ quan, tổ chức nào sau đây có trách nhiệm ban hành Danh mục phương tiện đo được sử dụng trong hoạt động đo đạc và bản đồ phải được kiểm định:",
        "options": [
            "Bộ Tài nguyên và Môi trường",
            "Bộ Khoa học và Công nghệ",
            "Các cơ quan sử dụng phương tiện đo",
            "Tổ chức cung cấp phương tiện đo",
        ],
        "answer": 1,
    },
}

SKILL_PATCH_BY_INDEX: dict[int, dict] = {
    13: {
        "prompt": "Việc chuyển toạ độ từ Hệ VN-2000 sang Hệ WGS-84 quốc tế sử dụng bao nhiêu tham số?",
        "options": [
            "3 tham số (∆X0, ∆Y0, ∆Z0)",
            "7 tham số (∆X0, ∆Y0, ∆Z0, ω0, ψ0, ε0, k)",
            "8 tham số (∆X0, ∆Y0, ∆Z0, ω0, ψ0, ε0, k, L0)",
            "4 tham số (∆X0, ∆Y0, ∆Z0, k)",
        ],
        "answer": 1,
    },
    56: {
        "prompt": "Hình thức quan sát của vệ tinh địa tĩnh là:",
        "options": [
            "Quan sát một khu vực cố định",
            "Quan sát đều đặn theo chu kỳ",
            "Quan sát không đều, theo từng cuộc thí nghiệm",
            "Tất cả các yếu tố nêu tại a, b và c đều đúng",
        ],
        "answer": 0,
    },
}

SKIP = re.compile(
    r"^(TT$|án$|Nội dung câu hỏi|Đáp\s*$|Đáp án$|PHẦN I\.|PHẦN II\.|"
    r"NGÂN HÀNG CÂU HỎI|BỘ TÀI NGUYÊN VÀ MÔI TRƯỜNG$|"
    r"\(Ban hành kèm theo|Ký bởi:|Email:|Cơ quan:|Ngày ký:|KT\. BỘ|THỨ TRƯỞNG|"
    r"CỘNG HÒA|Độc lập|2317$)",
    re.I,
)
SECTION_HDR = re.compile(r"^\d+\.\s+[A-ZÀ-Ỹ]")
Q_LINE = re.compile(r"^(\d{1,3})(?:\s+(.*))?$")
OPT_LINE = re.compile(r"^([abcd])(?:\s+(.*))?$", re.I)
STARTS_LETTER = re.compile(r"^[A-Za-zÀ-ỹĂÂÊÔƠƯĐăâêôơưđ0-9(]")


def normalize(s: str) -> str:
    s = s.replace("\u00a0", " ")
    s = re.sub(r"[ \t]+", " ", s)
    return s.strip()


def strip_x(s: str) -> tuple[str, bool]:
    had = False
    chunks = []
    for piece in re.split(r"\n", s):
        raw = piece.strip()
        if raw.lower() == "x":
            had = True
            continue
        if re.search(r"(^|\s)[xX]$", raw):
            had = True
            raw = re.sub(r"(^|\s)[xX]$", "", raw).strip()
        if raw:
            chunks.append(raw)
    out = re.sub(r"\s+", " ", " ".join(chunks)).strip()
    return out, had


def body_lines(raw: str) -> list[str]:
    lines = []
    for ln in raw.splitlines():
        ln = normalize(ln)
        if not ln or SKIP.search(ln) or SECTION_HDR.match(ln):
            continue
        lines.append(ln)
    return lines


def find_starts(lines: list[str], last_num: int) -> list[tuple[int, int, str]]:
    starts: list[tuple[int, int, str]] = []
    expected = 1
    for i, ln in enumerate(lines):
        m = Q_LINE.match(ln)
        if not m:
            continue
        num = int(m.group(1))
        rest = normalize(m.group(2) or "")
        if rest and not STARTS_LETTER.match(rest):
            continue
        if num != expected:
            continue
        starts.append((i, num, rest))
        expected += 1
        if expected > last_num:
            break
    return starts


def parse_options_plain(block_lines: list[str]) -> tuple[list[str], list[int]]:
    options: list[str] = []
    marks: list[int] = []
    for ln in block_lines:
        if ln.lower() == "x":
            if options and (len(options) - 1) not in marks:
                marks.append(len(options) - 1)
            continue
        extra, had = strip_x(ln)
        if not extra:
            continue
        options.append(extra)
        if had and (len(options) - 1) not in marks:
            marks.append(len(options) - 1)
    while len(options) < 4:
        options.append("")
    return options[:4], marks


def parse_options(block_lines: list[str]) -> tuple[list[str], list[int]]:
    if not any(OPT_LINE.match(ln) for ln in block_lines):
        plain = parse_options_plain(block_lines)
        if any(plain[0]):
            return plain
    options = ["", "", "", ""]
    marks: list[int] = []
    idx: int | None = None
    for ln in block_lines:
        if ln.lower() == "x":
            if idx is not None and idx not in marks:
                marks.append(idx)
            idx = None
            continue
        m = OPT_LINE.match(ln)
        if m:
            idx = "abcd".index(m.group(1).lower())
            rest, had = strip_x(m.group(2) or "")
            if options[idx]:
                for k in range(idx + 1, 4):
                    if not options[k]:
                        idx = k
                        break
            options[idx] = rest
            if had and idx not in marks:
                marks.append(idx)
            continue
        if idx is None:
            continue
        extra, had = strip_x(ln)
        if extra:
            options[idx] = (options[idx] + " " + extra).strip()
        if had and idx not in marks:
            marks.append(idx)
    return [re.sub(r"\s+", " ", o).strip() for o in options], marks


def parse_section(raw: str, last_num: int, label: str) -> list[dict]:
    lines = body_lines(raw)
    starts = find_starts(lines, last_num)
    found = {n for _, n, _ in starts}
    missing = [i for i in range(1, last_num + 1) if i not in found]
    if missing:
        sys.stderr.write(
            f"{label} missing starts ({len(missing)}): {missing[:15]}\n"
        )

    questions = []
    for si, (line_i, num, rest) in enumerate(starts):
        end = starts[si + 1][0] if si + 1 < len(starts) else len(lines)
        block = lines[line_i + 1 : end]
        prompt_parts = [rest] if rest else []
        opt_from = 0
        for j, ln in enumerate(block):
            if OPT_LINE.match(ln) or ln.lower() == "x":
                opt_from = j
                break
            extra, _ = strip_x(ln)
            if extra:
                prompt_parts.append(extra)
            opt_from = j + 1
        prompt = re.sub(r"\s+", " ", " ".join(prompt_parts)).strip()
        options, marks = parse_options(block[opt_from:])
        empty = sum(1 for o in options if not o)
        if empty or len(marks) != 1:
            sys.stderr.write(
                f"WARN {label} #{num}: empty_opts={empty} marks={marks}\n"
            )
        questions.append(
            {
                "num": num,
                "prompt": prompt,
                "options": options,
                "answer": marks[0] if len(marks) == 1 else -1,
            }
        )
    return questions


def classify_law(prompt: str) -> str:
    t = prompt.lower()
    if any(
        k in t
        for k in (
            "giấy phép",
            "chứng chỉ",
            "sát hạch",
            "hạng i",
            "hạng ii",
            "gia hạn",
            "cấp lại",
            "cấp đổi",
            "thu hồi",
            "người phụ trách kỹ thuật",
            "nhân viên kỹ thuật",
        )
    ):
        return "giay-phep-chung-chi"
    if any(
        k in t
        for k in (
            "mốc đo đạc",
            "hành lang bảo vệ",
            "trạm định vị",
            "phá dỡ",
            "di dời",
            "công trình hạ tầng đo đạc",
            "điểm gốc đo đạc",
        )
    ):
        return "cong-trinh-ha-tang"
    if any(
        k in t
        for k in (
            "cơ sở dữ liệu",
            "bản đồ hành chính",
            "bản đồ địa hình",
            "biên giới",
            "địa giới",
            "lưu trữ",
            "cung cấp",
            "hạ tầng dữ liệu không gian",
            "ảnh hàng không",
            "viễn thám",
            "bản đồ chuẩn",
            "hải đồ",
            "công trình ngầm",
            "sở hữu trí tuệ",
        )
    ):
        return "csdl-ban-do"
    return "luat-chung"


def classify_skill(prompt: str) -> str:
    t = prompt.lower()
    if any(
        k in t
        for k in (
            "ảnh hàng không",
            "viễn thám",
            "lidar",
            "bay chụp",
            "bay quét",
            "đo ảnh",
            "trực giao",
            "gsd",
            "chồng phủ",
            "độ phủ",
            "tăng dày",
            "máy chụp ảnh",
            "enc",
            "hải đồ",
        )
    ):
        return "anh-vien-tham"
    if any(
        k in t
        for k in (
            "vn-2000",
            "utm",
            "gauss",
            "múi chiếu",
            "mảnh bản đồ",
            "phép chiếu",
            "tỷ lệ",
            "khung trong",
            "kinh tuyến",
            "ellipsoid",
            "hệ tọa độ",
            "hệ quy chiếu",
            "chia mảnh",
            "lưới chiếu",
        )
    ):
        return "toan-ban-do"
    if any(
        k in t
        for k in (
            "gnss",
            "thủy chuẩn",
            "đo sâu",
            "hồi âm",
            "rtk",
            "cors",
            "giao hội",
            "toàn đạc",
            "đường chuyền",
        )
    ):
        return "do-truc-tiep"
    return "chat-luong-de-an"


def to_records(
    items: list[dict],
    section: str,
    id_prefix: str,
    *,
    seq: bool = False,
) -> list[dict]:
    classify = classify_law if section == "phap-luat" else classify_skill
    letters = "ABCD"
    out = []
    for i, q in enumerate(items):
        ans = q["answer"]
        if ans < 0 or ans > 3 or any(not o for o in q["options"]):
            continue
        correct = q["options"][ans]
        num = (i + 1) if seq else q["num"]
        out.append(
            {
                "id": f"{id_prefix}-{num:03d}",
                "section": section,
                "topic": classify(q["prompt"]),
                "prompt": q["prompt"],
                "options": q["options"],
                "answer": ans,
                "explanation": f"Đáp án đúng: {letters[ans]}. {correct}",
                "source": SOURCE,
            }
        )
    return out


def sanitize_text(s: str) -> str:
    s = re.sub(
        r"^SÁT HẠCH XÉT CẤP.*?Môi trường\)\s*",
        "",
        s,
        flags=re.I,
    )
    s = re.sub(r"\s+\d+\s+TT\s+án\s*", " ", s, flags=re.I)
    s = re.sub(r"TT\s+án\s*\d*\s*", " ", s, flags=re.I)
    s = re.sub(r"hoạt độngđo", "hoạt động đo", s, flags=re.I)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def sanitize_records(records: list[dict]) -> None:
    letters = "ABCD"
    for r in records:
        r["prompt"] = sanitize_text(r["prompt"])
        r["options"] = [sanitize_text(o) for o in r["options"]]
        ans = r["answer"]
        if 0 <= ans <= 3:
            r["explanation"] = (
                f"Đáp án đúng: {letters[ans]}. {r['options'][ans]}"
            )


def apply_law_patches(items: list[dict]) -> None:
    by_num = {q["num"]: q for q in items}
    for num, patch in LAW_PATCH_BY_NUM.items():
        target = by_num.get(num)
        if target:
            target.update(patch)
        else:
            items.append({"num": num, **patch})


def apply_skill_patches(items: list[dict]) -> None:
    for idx, patch in SKILL_PATCH_BY_INDEX.items():
        if idx < len(items):
            items[idx].update(patch)


def parse_part2(text: str) -> list[dict]:
    part2 = text[text.find("PHẦN II.") :]
    headers = list(re.finditer(r"(?m)^\d+\.\s+[A-ZÀ-Ỹ]", part2))
    items: list[dict] = []
    for i, m in enumerate(headers):
        start = m.start()
        end = headers[i + 1].start() if i + 1 < len(headers) else len(part2)
        chunk = part2[start:end]
        label = m.group(0)[:24]
        items.extend(parse_section(chunk, 500, label))
    return items


def main() -> int:
    if not SRC.exists():
        print("Missing", SRC, "- run PDF extract first", file=sys.stderr)
        return 1

    text = SRC.read_text(encoding="utf-8")
    mid = text.find("PHẦN II.")
    if mid < 0:
        print("PHẦN II not found", file=sys.stderr)
        return 1
    part1 = text[:mid]
    law = parse_section(part1, 80, "LAW")
    apply_law_patches(law)
    skill = parse_part2(text)
    apply_skill_patches(skill)
    print("LAW", len(law), "last", law[-1]["num"] if law else None)
    print("SKILL", len(skill), "sections parsed")

    records = [
        *to_records(law, "phap-luat", "2019-pl"),
        *to_records(skill, "kinh-nghiem", "2019-kn", seq=True),
    ]
    sanitize_records(records)
    print("valid records", len(records))

    payload = {
        "bankId": "official-2019",
        "questions": records,
    }
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print("written", OUT_JSON)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
