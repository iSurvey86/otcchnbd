# Parse QĐ 163/QĐ-BXD question banks into per-track JSON files.
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

import fitz

PDF = Path(r"G:\My Drive\AIProject_Data\Thi CCHN\Xay dung\BXD_163-QD_BXD_18 02 2025.pdf")
OUT_DIR = Path(r"d:\AIPoject\otcchnbd\src\data\xd")
SOURCE = "Quyết định 163/QĐ-BXD ngày 18/02/2025"

TITLES = {
    "1.1": "Khảo sát địa hình",
    "1.2": "Khảo sát địa chất công trình",
    "2": "Thiết kế quy hoạch xây dựng",
    "3.1": "Kết cấu công trình",
    "3.2": "Công trình khai thác mỏ",
    "3.3": "Đường bộ",
    "3.4": "Đường sắt",
    "3.5": "Cầu – Hầm",
    "3.6": "Đường thủy nội địa – Hàng hải",
    "3.7": "Thủy lợi, đê điều",
    "3.8": "Cấp nước – thoát nước",
    "3.9": "Xử lý chất thải rắn",
    "3.10": "Cơ–điện: Hệ thống điện",
    "3.11": "Cơ–điện: Cấp–thoát nước công trình",
    "3.12": "Cơ–điện: Thông gió – cấp thoát nhiệt",
    "4.1": "Giám sát công tác xây dựng công trình",
    "4.2": "Giám sát lắp đặt thiết bị công trình",
    "5": "Định giá xây dựng",
    "6": "Quản lý dự án đầu tư xây dựng",
}

# page_start / page_end are 1-based inclusive
PAGE_RANGES: dict[str, dict[str, tuple[int, int]]] = {
    "I": {
        "1.1": (4, 29),
        "1.2": (30, 57),
        "2": (58, 101),
        "3.1": (102, 138),
        "3.2": (139, 163),
        "3.3": (164, 190),
        "3.4": (191, 215),
        "3.5": (216, 245),
        "3.6": (246, 272),
        "3.7": (273, 320),
        "3.8": (321, 346),
        "3.9": (347, 367),
        "3.10": (368, 395),
        "3.11": (396, 418),
        "3.12": (419, 444),
        "4.1": (445, 530),
        "4.2": (531, 560),
        "5": (561, 587),
        "6": (588, 626),
    },
    "II": {
        "1.1": (627, 653),
        "1.2": (654, 681),
        "2": (682, 726),
        "3.1": (727, 757),
        "3.2": (758, 780),
        "3.3": (781, 807),
        "3.4": (808, 832),
        "3.5": (833, 862),
        "3.6": (863, 889),
        "3.7": (890, 931),
        "3.8": (932, 955),
        "3.9": (956, 976),
        "3.10": (977, 1004),
        "3.11": (1005, 1027),
        "3.12": (1028, 1053),
        "4.1": (1054, 1140),
        "4.2": (1141, 1163),
        "5": (1164, 1191),
        "6": (1192, 1231),
    },
    "III": {
        "1.1": (1232, 1256),
        "1.2": (1257, 1284),
        "2": (1285, 1329),
        "3.1": (1330, 1359),
        "3.2": (1360, 1382),
        "3.3": (1383, 1409),
        "3.4": (1410, 1434),
        "3.5": (1435, 1464),
        "3.6": (1465, 1488),
        "3.7": (1489, 1527),
        "3.8": (1528, 1551),
        "3.9": (1552, 1571),
        "3.10": (1572, 1598),
        "3.11": (1599, 1620),
        "3.12": (1621, 1645),
        "4.1": (1646, 1725),
        "4.2": (1726, 1748),
        "5": (1749, 1780),
        "6": (1781, 1829),
    },
}

# Default: all hangs. Override via PARSE_HANGS env if needed.
PARSE_HANGS = ("I", "II", "III")


def build_tracks() -> list[dict]:
    tracks: list[dict] = []
    for hang in PARSE_HANGS:
        for code, (start, end) in PAGE_RANGES[hang].items():
            tracks.append(
                {
                    "fieldCode": code,
                    "hang": hang,
                    "title": TITLES[code],
                    "page_start": start,
                    "page_end": end,
                }
            )
    return tracks


TRACKS = build_tracks()

HEADER_START = re.compile(
    r"^(\d+(?:\.\d+)?)\.\s*Câu hỏi\s+(Pháp luật chung|Pháp luật riêng|Chuyên môn)\b"
)
HEADER_FULL = re.compile(
    r"^(\d+(?:\.\d+)?)\.\s*Câu hỏi\s+(Pháp luật chung|Pháp luật riêng|Chuyên môn)"
    r"\s*-\s*(.+?)\s*-\s*Hạng\s+(I{1,3})$"
)
OPT = re.compile(r"^([abcd])\.\s*(.*)$", re.I)
ANS = re.compile(r"^[abcd]$", re.I)
HANG = re.compile(r"^I{1,3}$")
NUM = re.compile(r"^\d+$")

KIND_MAP = {
    "Pháp luật chung": "pl-chung",
    "Pháp luật riêng": "pl-rieng",
    "Chuyên môn": "chuyen-mon",
}


def track_id(field_code: str, hang: str) -> str:
    return f"xd-{field_code}-hang-{hang.lower()}"


def hang_slug(hang: str) -> str:
    return hang.lower()


def extract_lines(doc: fitz.Document, start: int, end: int) -> list[str]:
    chunks: list[str] = []
    for i in range(start - 1, end):
        chunks.append(doc[i].get_text())
    full = "\n".join(chunks).replace("\u00a0", " ")
    lines = [re.sub(r"[ \t]+", " ", ln).strip() for ln in full.splitlines()]
    return [ln for ln in lines if ln]


def match_header(lines: list[str], i: int) -> tuple[re.Match[str], int] | None:
    """Match section header; may span two lines when title wraps."""
    if i >= len(lines) or not HEADER_START.match(lines[i]):
        return None
    combined = lines[i]
    consumed = 1
    m = HEADER_FULL.match(combined)
    if not m and i + 1 < len(lines):
        combined = f"{lines[i]} {lines[i + 1]}"
        m = HEADER_FULL.match(combined)
        consumed = 2
    if not m:
        return None
    return m, i + consumed


def is_header_at(lines: list[str], i: int) -> bool:
    return match_header(lines, i) is not None


def parse_questions(lines: list[str]) -> list[dict]:
    current_kind: str | None = None
    current_hang: str | None = None
    current_code: str | None = None
    current_title: str | None = None
    questions: list[dict] = []
    i = 0
    while i < len(lines):
        hdr = match_header(lines, i)
        if hdr:
            hm, next_i = hdr
            current_code = hm.group(1)
            current_kind = hm.group(2)
            current_title = hm.group(3).strip()
            current_hang = hm.group(4)
            i = next_i
            continue
        if lines[i] in ("STT", "Câu hỏi", "Đáp án", "Hạng"):
            i += 1
            continue
        if not NUM.match(lines[i]):
            i += 1
            continue

        num = int(lines[i])
        i += 1
        prompt_parts: list[str] = []
        while i < len(lines) and not OPT.match(lines[i]) and not is_header_at(lines, i):
            if lines[i] in ("STT", "Câu hỏi", "Đáp án", "Hạng"):
                i += 1
                continue
            prompt_parts.append(lines[i])
            i += 1

        options = ["", "", "", ""]
        while i < len(lines):
            om = OPT.match(lines[i])
            if not om:
                break
            idx = "abcd".index(om.group(1).lower())
            options[idx] = om.group(2).strip()
            i += 1
            while i < len(lines):
                cur = lines[i]
                if (
                    OPT.match(cur)
                    or ANS.match(cur)
                    or is_header_at(lines, i)
                    or cur in ("STT", "Câu hỏi", "Đáp án", "Hạng")
                    or (NUM.match(cur) and all(options))
                    or HANG.match(cur)
                ):
                    break
                options[idx] = (options[idx] + " " + cur).strip()
                i += 1

        answer = -1
        hang = current_hang
        if i < len(lines) and ANS.match(lines[i]):
            answer = "abcd".index(lines[i].lower())
            i += 1
        if i < len(lines) and HANG.match(lines[i]):
            hang = lines[i]
            i += 1

        prompt = re.sub(r"\s+", " ", " ".join(prompt_parts)).strip()
        if current_kind and prompt and answer >= 0 and all(options):
            questions.append(
                {
                    "num": num,
                    "kind": current_kind,
                    "hang": hang,
                    "code": current_code,
                    "title": current_title,
                    "prompt": prompt,
                    "options": options,
                    "answer": answer,
                }
            )
    return questions


def to_app_records(items: list[dict], field_code: str, hang: str) -> list[dict]:
    letters = "ABCD"
    slug = hang_slug(hang)
    out: list[dict] = []
    counters: Counter[str] = Counter()
    for q in items:
        kind_id = KIND_MAP[q["kind"]]
        counters[kind_id] += 1
        n = counters[kind_id]
        section = "kinh-nghiem" if kind_id == "chuyen-mon" else "phap-luat"
        ans = q["answer"]
        out.append(
            {
                "id": f"xd-{field_code}-{slug}-{kind_id}-{n:03d}",
                "section": section,
                "topic": kind_id,
                "prompt": q["prompt"],
                "options": q["options"],
                "answer": ans,
                "explanation": f"Đáp án đúng: {letters[ans]}. {q['options'][ans]}",
                "source": SOURCE,
            }
        )
    return out


def write_track(doc: fitz.Document, track: dict) -> dict:
    field_code = track["fieldCode"]
    hang = track["hang"]
    title = track["title"]
    tid = track_id(field_code, hang)
    lines = extract_lines(doc, track["page_start"], track["page_end"])
    raw = [
        q
        for q in parse_questions(lines)
        if q.get("code") == field_code and q.get("hang") == hang
    ]

    print(f"\n=== {tid} ===")
    print("raw total", len(raw))
    print(dict(Counter((q["kind"], q["hang"]) for q in raw)))
    for kind in ("Pháp luật chung", "Pháp luật riêng", "Chuyên môn"):
        qs = [q for q in raw if q["kind"] == kind]
        nums = [q["num"] for q in qs]
        missing = [n for n in range(1, (max(nums) if nums else 0) + 1) if n not in nums]
        print(kind, "count", len(qs), "max", max(nums) if nums else None, "missing", missing[:15], ("..." if len(missing) > 15 else ""))

    records = to_app_records(raw, field_code, hang)
    payload = {
        "trackId": tid,
        "fieldCode": field_code,
        "hang": hang,
        "title": title,
        "source": SOURCE,
        "questions": records,
    }
    out_path = OUT_DIR / f"{field_code}-hang-{hang_slug(hang)}.json"
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print("written", out_path.name, "questions", len(records))
    return {
        "trackId": tid,
        "fieldCode": field_code,
        "hang": hang,
        "title": title,
        "file": out_path.name,
        "count": len(records),
    }


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(PDF)
    summary = [write_track(doc, t) for t in TRACKS]
    manifest = {
        row["trackId"]: {
            "file": row["file"],
            "count": row["count"],
            "title": row["title"],
            "fieldCode": row["fieldCode"],
            "hang": row["hang"],
        }
        for row in summary
        if row["count"] > 0
    }
    # Merge with existing manifest if present (keep other hangs later)
    manifest_path = OUT_DIR / "manifest.json"
    if manifest_path.exists():
        prev = json.loads(manifest_path.read_text(encoding="utf-8"))
        prev.update(manifest)
        manifest = prev
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print("\nSUMMARY", len(summary), "tracks; manifest", len(manifest))
    for row in summary:
        print(row["trackId"], row["count"])


if __name__ == "__main__":
    main()
