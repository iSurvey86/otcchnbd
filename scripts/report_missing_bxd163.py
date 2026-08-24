# Report missing STT numbers per track/kind after PDF parse.
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path

import parse_bxd163 as p

OUT_MD = Path(__file__).resolve().parents[1] / "src" / "data" / "xd" / "missing-questions.md"
OUT_JSON = Path(__file__).resolve().parents[1] / "src" / "data" / "xd" / "missing-questions.json"

KIND_ORDER = ("Pháp luật chung", "Pháp luật riêng", "Chuyên môn")


def ranges(ns: list[int]) -> str:
    if not ns:
        return ""
    out: list[str] = []
    start = end = ns[0]
    for n in ns[1:]:
        if n == end + 1:
            end = n
        else:
            out.append(str(start) if start == end else f"{start}–{end}")
            start = end = n
    out.append(str(start) if start == end else f"{start}–{end}")
    return ", ".join(out)


def reliable_nums(nums_all: list[int]) -> tuple[list[int], list[int]]:
    """
    Keep STTs that form a near-continuous sequence.
    Outliers that jump >20 from the last kept value are listed separately
    (often page numbers mis-parsed as STT).
    """
    s = sorted(set(nums_all))
    if not s:
        return [], []
    kept: list[int] = []
    outliers: list[int] = []
    for n in s:
        if not kept:
            kept.append(n)
            continue
        if n - kept[-1] <= 20:
            kept.append(n)
        else:
            outliers.append(n)
    return kept, outliers


def main() -> None:
    p.PARSE_HANGS = ("I", "II", "III")
    tracks = p.build_tracks()
    doc = p.fitz.open(p.PDF)

    report: list[dict] = []
    total_missing = 0

    for track in tracks:
        lines = p.extract_lines(doc, track["page_start"], track["page_end"])
        raw = [
            q
            for q in p.parse_questions(lines)
            if q.get("code") == track["fieldCode"] and q.get("hang") == track["hang"]
        ]
        by_kind: dict[str, list[int]] = defaultdict(list)
        for q in raw:
            by_kind[q["kind"]].append(q["num"])

        track_miss: dict = {}
        for kind in KIND_ORDER:
            nums_all = by_kind.get(kind, [])
            if not nums_all:
                continue
            nums, outliers = reliable_nums(nums_all)
            if not nums:
                continue
            missing = [n for n in range(1, max(nums) + 1) if n not in nums]
            dups = sorted([n for n, k in Counter(nums_all).items() if k > 1])
            if missing or dups or outliers:
                track_miss[kind] = {
                    "missing": missing,
                    "dups": dups,
                    "outliers": outliers,
                    "count": len(set(nums_all) - set(outliers)),
                    "max": max(nums),
                }
                total_missing += len(missing)

        if track_miss:
            report.append(
                {
                    "trackId": p.track_id(track["fieldCode"], track["hang"]),
                    "title": track["title"],
                    "hang": track["hang"],
                    "fieldCode": track["fieldCode"],
                    "kinds": track_miss,
                }
            )

    lines_out: list[str] = [
        "# Câu hỏi thiếu khi parse QĐ 163/QĐ-BXD (18/02/2025)",
        "",
        f"Tổng số STT thiếu (đã loại nhiễu số trang): **{total_missing}**",
        f"Số track còn thiếu ≥ 1 câu: **{sum(1 for r in report if any(k.get('missing') for k in r['kinds'].values()))}** / {len(tracks)}",
        "",
        "Cách đọc: số dưới đây là **STT trong PDF** của đúng loại câu trong track đó.",
        "Bổ sung tay: mở đúng chuyên ngành + hạng + loại câu trong PDF, lấy đúng STT liệt kê.",
        "",
    ]

    for row in report:
        has_action = any(
            info["missing"] or info["dups"] or info.get("outliers")
            for info in row["kinds"].values()
        )
        if not has_action:
            continue
        lines_out.append(
            f"## {row['fieldCode']} · {row['title']} — Hạng {row['hang']}"
        )
        lines_out.append(f"`{row['trackId']}`")
        lines_out.append("")
        for kind, info in row["kinds"].items():
            miss = info["missing"]
            dups = info["dups"]
            outliers = info.get("outliers") or []
            if not miss and not dups and not outliers:
                continue
            lines_out.append(
                f"- **{kind}** (đã có {info['count']}/{info['max']}):"
            )
            if miss:
                lines_out.append(
                    f"  - Thiếu STT: `{ranges(miss)}` (**{len(miss)}** câu)"
                )
            if dups:
                lines_out.append(
                    f"  - Trùng STT (cần kiểm): `{', '.join(map(str, dups))}`"
                )
            if outliers:
                lines_out.append(
                    f"  - STT nhiễu/bỏ qua khi đếm: `{ranges(outliers)}`"
                )
        lines_out.append("")

    OUT_MD.write_text("\n".join(lines_out), encoding="utf-8")
    OUT_JSON.write_text(
        json.dumps(
            {"totalMissing": total_missing, "tracks": report},
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print("total_missing", total_missing)
    print("tracks_listed", len(report))
    print("written", OUT_MD)


if __name__ == "__main__":
    main()
