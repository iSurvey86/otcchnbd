# Parse QĐ 308/QĐ-ĐĐBĐVN question bank into TypeScript modules.
from __future__ import annotations

import json
import re
from pathlib import Path

SRC = Path(r"d:\AIPoject\otcchnbd\tmp-bank.txt")
OUT_DIR = Path(r"d:\AIPoject\otcchnbd\src\data")
SOURCE = "Quyết định 308/QĐ-ĐĐBĐVN ngày 29/12/2020"

text = SRC.read_text(encoding="utf-8")
start = text.find("PHẦN I. CÂU HỎI VỀ KIẾN THỨC PHÁP LUẬT")
mid = text.find("PHẦN II. CÂU HỎI VỀ KINH NGHIỆM NGHỀ NGHIỆP")
part1 = text[start:mid]
part2 = text[mid:]

SKIP = re.compile(
    r"^(TT Nội dung câu hỏi Đáp án|PHẦN I\.|PHẦN II\.|NGÂN HÀNG CÂU HỎI|"
    r"\(Ban hành kèm theo|trưởng Cục Đo đạc)",
    re.I,
)
Q_LINE = re.compile(r"^(\d{1,3})(?:\s+(.*))?$")
OPT_LINE = re.compile(r"^([abcd])(?:\s+(.*))?$", re.I)
STARTS_LETTER = re.compile(r"^[A-Za-zÀ-ỹĂÂÊÔƠƯĐăâêôơưđ]")


def normalize(s: str) -> str:
    s = s.replace("\u00a0", " ")
    s = re.sub(r"[ \t]+", " ", s)
    return s.strip()


def strip_x(s: str) -> tuple[str, bool]:
    had = False
    chunks = []
    for piece in re.split(r"\n", s):
        raw = piece.strip()
        if re.search(r"(^|\s)X$", raw):
            had = True
            raw = re.sub(r"(^|\s)X$", "", raw).strip()
        if raw == "X":
            had = True
            continue
        if raw:
            chunks.append(raw)
    out = re.sub(r"\s+", " ", " ".join(chunks)).strip()
    return out, had


def body_lines(raw: str) -> list[str]:
    lines = []
    for ln in raw.splitlines():
        ln = normalize(ln)
        if not ln or SKIP.search(ln):
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


def parse_options(block_lines: list[str]) -> tuple[list[str], list[int]]:
    options = ["", "", "", ""]
    marks: list[int] = []
    idx: int | None = None
    for ln in block_lines:
        if ln == "X":
            if idx is not None and idx not in marks:
                marks.append(idx)
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
        print(f"{label} missing starts: {missing}")

    questions = []
    for si, (line_i, num, rest) in enumerate(starts):
        end = starts[si + 1][0] if si + 1 < len(starts) else len(lines)
        block = lines[line_i + 1 : end]
        prompt_parts = [rest] if rest else []
        opt_from = 0
        for j, ln in enumerate(block):
            if OPT_LINE.match(ln):
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
            print(
                f"WARN {label} #{num}: empty_opts={empty} marks={marks} "
                f"prompt_len={len(prompt)}"
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
            "đường chuyền",
            "toàn đạc",
            "đo sâu",
            "hồi âm",
            "rtk",
            "cors",
            "giao hội",
        )
    ):
        return "do-truc-tiep"
    return "chat-luong-de-an"


def to_records(items: list[dict], section: str) -> list[dict]:
    prefix = "pl" if section == "phap-luat" else "kn"
    classify = classify_law if section == "phap-luat" else classify_skill
    letters = "ABCD"
    out = []
    for q in items:
        ans = q["answer"]
        if ans < 0 or ans > 3:
            continue
        correct = q["options"][ans]
        out.append(
            {
                "id": f"{prefix}-{q['num']:03d}",
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


def write_ts(path: Path, const_name: str, data: list[dict]) -> None:
    body = json.dumps(data, ensure_ascii=False, indent=2)
    path.write_text(
        "import type { Question } from '../types'\n\n"
        f"export const {const_name}: Question[] = {body}\n",
        encoding="utf-8",
    )


law = parse_section(part1, 100, "LAW")
skill = parse_section(part2, 293, "SKILL")
print("LAW", len(law), "last", law[-1]["num"] if law else None)
print("SKILL", len(skill), "last", skill[-1]["num"] if skill else None)

bad_law = [q["num"] for q in law if q["answer"] < 0 or any(not o for o in q["options"])]
bad_skill = [q["num"] for q in skill if q["answer"] < 0 or any(not o for o in q["options"])]
print("bad law", bad_law)
print("bad skill", bad_skill)

write_ts(OUT_DIR / "questions-law.ts", "LAW_QUESTIONS", to_records(law, "phap-luat"))
write_ts(OUT_DIR / "questions-skill.ts", "SKILL_QUESTIONS", to_records(skill, "kinh-nghiem"))
print("written", len(to_records(law, "phap-luat")), len(to_records(skill, "kinh-nghiem")))
