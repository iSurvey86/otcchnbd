# -*- coding: utf-8 -*-
"""Điền explanation Lô 20 (STT 381–390) theo mẫu 4 khối, căn cứ CSPL local + FTA."""
from __future__ import annotations

import json
from pathlib import Path

BANK = Path(r"d:\AIPoject\otcchnbd\src\data\dt\bank.json")


def block(letter: str, opt: str, can_cu: str, phan_tich: str, doi_chieu: str) -> str:
    return "\n".join(
        [
            "Đáp án chính xác cho câu hỏi này là:",
            f"{letter}. {opt}",
            "",
            "Căn cứ:",
            can_cu,
            "",
            "Phân tích:",
            phan_tich,
            "",
            "Đối chiếu với các phương án còn lại:",
            doi_chieu,
        ]
    )


def main() -> None:
    bank = json.loads(BANK.read_text(encoding="utf-8"))
    by = {q["stt"]: q for q in bank["questions"]}
    ex: dict[int, tuple[str, str]] = {}

    # Q381 – Giá gói thầu cập nhật trong vòng 28 ngày trước mở thầu
    q = by[381]
    ex[381] = (
        block(
            "A",
            q["options"][0],
            "Nghị định số 214/2025/NĐ-CP (quy định về cập nhật giá gói thầu trước mở thầu).",
            "Theo quy định, giá gói thầu có thể được cập nhật trong thời hạn 28 ngày trước ngày mở thầu nếu cần thiết. Đây là khoảng thời gian đủ để phản ánh biến động giá vật liệu, nhân công hoặc các yếu tố đầu vào mà không ảnh hưởng đến quá trình chuẩn bị hồ sơ dự thầu của nhà thầu (nhà thầu đã có đủ thời gian chuẩn bị HSDT trước khi giá được cập nhật).",
            "Phương án B sai vì 18 ngày không phải thời hạn quy định để cập nhật giá gói thầu.\n"
            "Phương án C sai vì 7 ngày là quá ngắn và không phải quy định về cập nhật giá gói thầu.\n"
            "Phương án D sai vì 7 ngày làm việc cũng không phải mốc quy định cập nhật giá gói thầu.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    # Q382 – HSMST phát hành miễn phí, chuẩn bị E-HSDST tối thiểu 9 ngày LV
    q = by[382]
    ex[382] = (
        block(
            "C",
            q["options"][2],
            "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC (quy định về hồ sơ mời sơ tuyển).",
            "Hồ sơ mời sơ tuyển (E-HSMST) được phát hành miễn phí trên Hệ thống mạng đấu thầu quốc gia (không thu phí bán hồ sơ). Thời gian chuẩn bị hồ sơ dự sơ tuyển (E-HSDST) tối thiểu là 09 ngày làm việc kể từ ngày đầu tiên phát hành E-HSMST đến thời điểm đóng sơ tuyển.",
            "Phương án A sai vì thời gian chuẩn bị tối thiểu là 9 ngày LV, không phải 7 ngày LV.\n"
            "Phương án B sai vì E-HSMST được phát hành miễn phí, không thu phí; và thời gian là 9 ngày LV không phải 9 ngày thực tế.\n"
            "Phương án D sai vì thời gian 9 ngày là ngày LV, không phải ngày thực tế (9 ngày thực tế ≈ 6 ngày LV, quá ngắn).",
        ),
        "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC",
    )

    # Q383 – CGTT rút gọn: A, B, C đều đúng
    q = by[383]
    ex[383] = (
        block(
            "D",
            q["options"][3],
            "Nghị định số 214/2025/NĐ-CP (điều kiện áp dụng chào giá trực tuyến rút gọn).",
            "Chào giá trực tuyến rút gọn được áp dụng trong các trường hợp: (A) Gói thầu mua sắm hàng hóa phải mua của hãng cụ thể để đảm bảo tương thích công nghệ, bản quyền (không giới hạn giá trị, 20 tỷ áp dụng được); (B) Gói thầu phi tư vấn phải mua của hãng cụ thể tương tự (10 tỷ áp dụng được); (C) Gói thầu mua sắm hàng hóa thông dụng, sẵn có với giá gói thầu không quá 05 tỷ đồng đối với dự án. Cả ba trường hợp đều đúng.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    # Q384 – CPTPP dịch vụ XD, ĐTQT: ưu đãi nội khối cho liên danh có NT Nhật ≥ 50%
    q = by[384]
    ex[384] = (
        block(
            "A",
            q["options"][0],
            "Nghị định số 95/2020/NĐ-CP (ưu đãi nhà thầu nội khối trong đấu thầu quốc tế).",
            "Đối với gói thầu dịch vụ xây dựng thuộc phạm vi CPTPP tổ chức đấu thầu quốc tế, ưu đãi nội khối có thể áp dụng cho nhà thầu liên danh trong đó có thành viên là nhà thầu nội khối (thuộc nước thành viên CPTPP) và thành viên đó đảm nhận từ 50% trở lên giá trị công việc. Nhật Bản là thành viên CPTPP nên nhà thầu Nhật Bản là nhà thầu nội khối.",
            "Phương án B sai vì ngưỡng là ≥ 50%, không phải ≥ 25%.\n"
            "Phương án C sai vì Hoa Kỳ không phải thành viên CPTPP (đã rút), không được coi là nhà thầu nội khối CPTPP.\n"
            "Phương án D sai vì ngưỡng là ≥ 50%, không phải ≥ 40%.",
        ),
        "Nghị định số 95/2020/NĐ-CP",
    )

    # Q385 – Nguyên tắc KHLCNT theo NĐ 95: không chia nhỏ gói thầu để tránh áp dụng NĐ
    q = by[385]
    ex[385] = (
        block(
            "B",
            q["options"][1],
            "Nghị định số 95/2020/NĐ-CP (nguyên tắc lập kế hoạch lựa chọn nhà thầu).",
            "Một trong các nguyên tắc cơ bản khi lập kế hoạch lựa chọn nhà thầu theo Nghị định 95 là không được chia nhỏ gói thầu nhằm mục đích lách các ngưỡng giá trị để tránh áp dụng Nghị định này. Nguyên tắc này đảm bảo các cam kết mở cửa thị trường theo FTA được thực thi thực chất.",
            "Phương án A sai vì KHLCNT theo NĐ 95 vẫn phải ghi rõ số lượng gói thầu.\n"
            "Phương án C sai vì không bắt buộc toàn bộ phương thức lựa chọn nhà thầu phải là đấu thầu qua mạng.\n"
            "Phương án D sai vì không phải ghi ngày cụ thể – quy định về thời gian có thể linh hoạt hơn.",
        ),
        "Nghị định số 95/2020/NĐ-CP",
    )

    # Q386 – CPTPP: chấm dứt ưu đãi trong nước vào 14/01/2044
    q = by[386]
    ex[386] = (
        block(
            "C",
            q["options"][2],
            "Nghị định số 95/2020/NĐ-CP (Phụ lục về lộ trình chấm dứt ưu đãi trong nước theo CPTPP).",
            "Đối với gói thầu chỉ thuộc phạm vi điều chỉnh của Hiệp định CPTPP, lộ trình chấm dứt áp dụng ưu đãi trong nước (domestic preference) được quy định kết thúc vào ngày 14 tháng 01 năm 2044. Đây là mốc thời gian cụ thể trong Phụ lục của Nghị định 95/2020/NĐ-CP về chuyển tiếp cam kết CPTPP.",
            "Phương án A sai vì 14/01/2038 không phải mốc chấm dứt ưu đãi CPTPP.\n"
            "Phương án B sai vì 01/8/2038 không phải mốc chấm dứt ưu đãi CPTPP.\n"
            "Phương án D sai vì 01/8/2044 không phải mốc chấm dứt ưu đãi theo Phụ lục NĐ 95.",
        ),
        "Nghị định số 95/2020/NĐ-CP (Phụ lục lộ trình CPTPP)",
    )

    # Q387 – EVFTA, 01/8/2020 – 13/01/2029: tổng ưu đãi tối đa 40%
    q = by[387]
    ex[387] = (
        block(
            "B",
            q["options"][1],
            "Nghị định số 95/2020/NĐ-CP (Phụ lục về ưu đãi trong nước theo EVFTA).",
            "Trong giai đoạn từ 01/8/2020 (ngày EVFTA có hiệu lực) đến 13/01/2029, tổng giá trị ưu đãi trong nước tối đa trong một năm là 40% tổng giá hợp đồng các gói thầu thuộc phạm vi điều chỉnh của Nghị định 95/2020/NĐ-CP. Sau ngày 13/01/2029, lộ trình tiếp tục giảm dần theo cam kết EVFTA.",
            "Phương án A sai vì 30% thấp hơn mức tối đa được phép trong giai đoạn đầu EVFTA.\n"
            "Phương án C sai vì 50% cao hơn mức tối đa quy định (40%).\n"
            "Phương án D sai vì 60% cao hơn nhiều so với mức tối đa quy định (40%).",
        ),
        "Nghị định số 95/2020/NĐ-CP (Phụ lục lộ trình EVFTA)",
    )

    # Q388 – Nhà thầu EU, chi phí SX tại nước thành viên 45% < 50% → không được ưu đãi
    q = by[388]
    ex[388] = (
        block(
            "A",
            q["options"][0],
            "Nghị định số 95/2020/NĐ-CP (tiêu chí hưởng ưu đãi đối với hàng hóa từ nước thành viên).",
            "Để được hưởng ưu đãi đối với hàng hóa từ nước thành viên trong đấu thầu quốc tế theo EVFTA, chi phí sản xuất hàng hóa tại các nước thành viên phải đạt tối thiểu 50% tổng chi phí sản xuất. Nhà thầu EU này có chi phí sản xuất tại nước thành viên là 45% < 50%, không đáp ứng ngưỡng tối thiểu → không được hưởng ưu đãi.",
            "Phương án B sai vì chỉ có chi phí SX tại nước thành viên là chưa đủ – phải đạt ≥ 50%.\n"
            "Phương án C sai vì 45% không đạt ngưỡng 50% quy định → không đủ điều kiện ưu đãi.\n"
            "Phương án D sai vì đã có đủ thông tin (45% chi phí nội khối) để kết luận không đủ điều kiện ưu đãi.",
        ),
        "Nghị định số 95/2020/NĐ-CP",
    )

    # Q389 – CPTPP, HH thông dụng ≤ 10 tỷ → chuẩn bị HSDT tối thiểu 10 ngày
    q = by[389]
    ex[389] = (
        block(
            "A",
            q["options"][0],
            "Nghị định số 95/2020/NĐ-CP (thời gian chuẩn bị HSDT trong đấu thầu theo CPTPP).",
            "Đối với gói thầu mua sắm hàng hóa thông dụng, sẵn có trên thị trường với đặc tính kỹ thuật được tiêu chuẩn hóa, tương đương nhau về chất lượng và có giá gói thầu không quá 10 tỷ đồng theo CPTPP, thời gian chuẩn bị hồ sơ dự thầu tối thiểu là 10 ngày.",
            "Phương án B sai vì 15 ngày không phải thời gian tối thiểu cho gói HH thông dụng ≤ 10 tỷ theo CPTPP.\n"
            "Phương án C sai vì 20 ngày không phải thời gian tối thiểu theo quy định CPTPP cho trường hợp này.\n"
            "Phương án D sai vì 25 ngày cao hơn nhiều so với thời gian tối thiểu quy định.",
        ),
        "Nghị định số 95/2020/NĐ-CP",
    )

    # Q390 – EVFTA, ĐTQT, có ưu đãi: xếp hạng ngang → ưu tiên nhà thầu sử dụng nhiều lao động nội khối hơn
    q = by[390]
    ex[390] = (
        block(
            "A",
            q["options"][0],
            "Nghị định số 95/2020/NĐ-CP (nguyên tắc ưu đãi trong đấu thầu quốc tế theo EVFTA).",
            "Theo Nghị định 95, trong đấu thầu quốc tế gói thầu thuộc phạm vi EVFTA có áp dụng ưu đãi, sau khi tính ưu đãi nếu các hồ sơ dự thầu xếp hạng ngang nhau, ưu tiên sẽ được trao cho nhà thầu sử dụng nhiều lao động nội khối hơn (so sánh trên cơ sở giá trị tiền lương, tiền công chi trả cho lao động từ các nước thành viên). Đây là nguyên tắc phá vỡ tình trạng xếp ngang.",
            "Phương án B sai vì ưu tiên không dựa trên đề xuất chi phí nội khối thấp hơn.\n"
            "Phương án C sai vì nhà thầu không được hưởng tất cả các ưu đãi cùng lúc; mỗi nhà thầu chỉ được hưởng tối đa một loại ưu đãi.\n"
            "Phương án D sai vì ưu tiên không dựa trên mức độ chênh lệch chi phí nội khối so với yêu cầu HSMT.",
        ),
        "Nghị định số 95/2020/NĐ-CP",
    )

    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Lot20 filled: {filled}/10")


if __name__ == "__main__":
    main()
