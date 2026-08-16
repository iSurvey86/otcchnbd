# -*- coding: utf-8 -*-
"""Điền explanation Lô 6 (STT 101–120) theo mẫu 4 khối, căn cứ CSPL local."""
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

    q = by[101]
    ex[101] = (
        block(
            "D",
            q["options"][3],
            "Mục 20.3 E-CDNT Mẫu E-HSMT hàng hóa/xây lắp (4A/3A) kèm theo Thông tư số 79/2025/TT-BTC.",
            "Khi nhà thầu rút E-HSDT sau thời điểm đóng thầu và trong thời gian có hiệu lực của E-HSDT thì đồng thời: không được hoàn trả bảo đảm dự thầu; bị đánh giá không đảm bảo uy tín khi tham dự thầu; và không được tiếp tục đánh giá E-HSDT. Cả ba hệ quả đều đúng nên chọn “Các phương án trên đều đúng”.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Mục 20.3 E-CDNT Mẫu E-HSMT kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[102]
    ex[102] = (
        block(
            "B",
            q["options"][1],
            "Điều 6 VBHN Luật Đấu thầu; tiêu chuẩn tư cách hợp lệ về bảo đảm cạnh tranh Mẫu E-HSMT hàng hóa (4A) kèm theo Thông tư số 79/2025/TT-BTC.",
            "Nhà thầu là đơn vị sự nghiệp công lập phải không cùng thuộc một cơ quan/tổ chức trực tiếp quản lý với chủ đầu tư, trừ các ngoại lệ (ĐVSNCL thuộc cơ quan quản lý nhà nước có chức năng, nhiệm vụ phù hợp với gói thầu của chính cơ quan đó; các ĐVSNCL cùng một cơ quan trực tiếp quản lý; ĐVSNCL và doanh nghiệp cùng cơ quan trực tiếp quản lý, góp vốn). Ở phương án B, Chi cục B là chủ đầu tư (đơn vị hành chính), ĐVSNCL A và Chi cục B cùng do Sở Tài chính trực tiếp quản lý nhưng không thuộc ngoại lệ nêu trên → không đáp ứng bảo đảm cạnh tranh.",
            "Phương án A thuộc ngoại lệ: ĐVSNCL thuộc Sở Tài chính, chức năng phù hợp, Sở là chủ đầu tư.\n"
            "Phương án C thuộc ngoại lệ: hai ĐVSNCL cùng một cơ quan trực tiếp quản lý.\n"
            "Phương án D thuộc ngoại lệ: ĐVSNCL và doanh nghiệp cùng một cơ quan trực tiếp quản lý, góp vốn khi tham dự gói thầu của nhau.",
        ),
        "Điều 6 VBHN Luật Đấu thầu; Mẫu E-HSMT hàng hóa (4A) kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[103]
    ex[103] = (
        block(
            "A",
            q["options"][0],
            "Tiêu chuẩn đánh giá tính hợp lệ / thỏa thuận liên danh Mẫu E-HSMT hàng hóa (4A) kèm theo Thông tư số 79/2025/TT-BTC.",
            "Dù gói thầu chỉ có 01 hạng mục (hệ thống máy chủ), nhà thầu vẫn được liên danh nếu phân chia công việc trong liên danh theo các công việc thuộc quá trình sản xuất hạng mục trong bảng giá dự thầu; không được chia các công việc ngoài hạng mục/ngoài quá trình sản xuất hạng mục đó.",
            "Phương án B sai vì không cấm liên danh chỉ vì gói thầu còn 01 hạng mục.\n"
            "Phương án C sai vì thu xếp tài chính không thuộc phân chia công việc theo quá trình sản xuất hạng mục trong bảng giá.\n"
            "Phương án D sai vì C không đúng.",
        ),
        "Mẫu E-HSMT hàng hóa (4A) kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[104]
    ex[104] = (
        block(
            "B",
            q["options"][1],
            "Khoản 2 Điều 6 Nghị định số 214/2025/NĐ-CP (ưu đãi khi có hàng hóa CPSX trong nước từ 50% trở lên); Khoản 18 Điều 140 Nghị định số 214/2025/NĐ-CP (ưu tiên DNNVV do phụ nữ làm chủ khi ngang nhau); Mục 28 E-CDNT Mẫu E-HSMT hàng hóa (4A) (ngưỡng ưu đãi CPSX từ 30% trở lên).",
            "Có nhà thầu D chào CPSX 60% (≥ 50%) nên áp dụng ưu đãi theo Khoản 2 Điều 6 NĐ 214: hàng không thuộc đối tượng ưu đãi cộng 10%; hàng ưu đãi nhưng CPSX < 50% cộng 2,5%; hàng CPSX ≥ 50% không cộng thêm. A (20%) không đạt ngưỡng ưu đãi ≥ 30% → giá so sánh 95 × 1,10 = 104,5; B (40%) và C (45%) → 100 × 1,025 = 102,5; D (60%) → 105. Giá so sánh thấp nhất là B và C (102,5). Khi ngang nhau, ưu tiên trao thầu cho DNNVV do phụ nữ làm chủ → chọn B (C không phải DNNVV nữ).",
            "Phương án A sai vì sau ưu đãi giá so sánh của A cao hơn B/C.\n"
            "Phương án C sai vì khi ngang B, ưu tiên DNNVV do phụ nữ làm chủ thuộc về B.\n"
            "Phương án D sai vì giá so sánh của D cao hơn B/C.",
        ),
        "Điều 6 và Khoản 18 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[105]
    ex[105] = (
        block(
            "B",
            q["options"][1],
            "Nguyên tắc đánh giá hồ sơ dự thầu (Điều 29 Nghị định số 214/2025/NĐ-CP); nội dung mở thầu ghi nhận thư giảm giá đã nộp cùng hồ sơ (Nghị định số 214/2025/NĐ-CP).",
            "Thư giảm giá là nội dung đề xuất tài chính phải có trong hồ sơ dự thầu đã nộp trước thời điểm đóng thầu. Nhà thầu đề nghị bổ sung thư giảm giá sau đóng thầu (kể cả lý do thất lạc bưu điện) không được chấp nhận để đánh giá.",
            "Phương án A sai vì lỗi vận chuyển không làm phát sinh quyền nộp bổ sung thư giảm giá sau đóng thầu.\n"
            "Phương án C sai vì không được “tạm ghi nhận” rồi trình Người có thẩm quyền để hợp thức hóa thư nộp muộn.\n"
            "Phương án D sai vì đây không phải tình huống được mở rộng chấp nhận thư giảm giá nộp sau đóng thầu.",
        ),
        "Điều 29 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[106]
    ex[106] = (
        block(
            "C",
            q["options"][2],
            "Nội dung thương thảo hợp đồng Mẫu E-HSMT tư vấn (6A) kèm theo Thông tư số 79/2025/TT-BTC; Điểm đ Khoản 4 Điều về thương thảo hợp đồng Nghị định số 214/2025/NĐ-CP (thương thảo về giá khi vượt giá gói thầu với phương pháp dựa trên kỹ thuật).",
            "Gói tư vấn đấu thầu rộng rãi: mẫu E-HSMT tư vấn cho phép thương thảo về chi phí dịch vụ tư vấn trong quá trình thương thảo hợp đồng. Các gói xây lắp/hàng hóa/PTV nói chung không thương thảo chi phí theo kiểu đó; thương thảo về giá chỉ trong trường hợp hẹp (ví dụ giá đề nghị trúng thầu vượt giá gói thầu với phương pháp dựa trên kỹ thuật), không khớp các phương án A, B.",
            "Phương án A sai vì chào hàng cạnh tranh XL/HH/PTV không được suy ra quyền thương thảo chi phí như tư vấn.\n"
            "Phương án B sai vì gói thuốc áp dụng kết hợp kỹ thuật và giá không đồng nghĩa được thương thảo chi phí như gói tư vấn.\n"
            "Phương án D sai vì gói tư vấn được phép thương thảo về chi phí theo mẫu 6A.",
        ),
        "Mẫu E-HSMT tư vấn (6A) kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[107]
    ex[107] = (
        block(
            "C",
            q["options"][2],
            "Ghi chú xác định hợp đồng tương tự Mẫu E-HSMT hàng hóa (4A) kèm theo Thông tư số 79/2025/TT-BTC (đánh giá theo tính chất công việc đã thực hiện, giá trị nghiệm thu).",
            "Với gói cung cấp thuốc, hợp đồng tương tự được xét theo tính chất công việc cung cấp thuốc đã thực hiện (đã nghiệm thu), không bị giới hạn chỉ ở cơ sở khám chữa bệnh công lập. Hợp đồng cung cấp thuốc cho cơ sở khám chữa bệnh tư nhân và cho cơ sở kinh doanh thuốc đều có tính chất tương tự về cung cấp thuốc → A và B đều đúng.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án D sai vì A và B đều được chấp nhận về tính chất hợp đồng tương tự.",
        ),
        "Mẫu E-HSMT hàng hóa (4A) kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[108]
    ex[108] = (
        block(
            "C",
            q["options"][2],
            "Nội dung thương thảo hợp đồng Mẫu E-HSMT tư vấn (6A); Khoản về thay đổi nhân sự chủ chốt khi thương thảo hợp đồng Nghị định số 214/2025/NĐ-CP.",
            "Trong thương thảo, nhà thầu không được thay đổi nhân sự đã đề xuất, trừ khi thời gian đánh giá E-HSDT kéo dài hơn dự kiến trong kế hoạch lựa chọn nhà thầu hoặc vì lý do bất khả kháng khiến nhân sự chủ chốt không thể tham gia; nhân sự thay thế phải tương đương/cao hơn và không được đổi giá dự thầu. Không có quy định “được đổi 01 lần khi không đáp ứng/không chứng minh huy động” như phương án B.",
            "Phương án A sai vì vẫn có ngoại lệ kéo dài đánh giá/bất khả kháng.\n"
            "Phương án B sai vì không đúng điều kiện và giới hạn “01 lần” theo quy định nêu trên.\n"
            "Phương án D sai vì B không đúng.",
        ),
        "Mẫu E-HSMT tư vấn (6A); Nghị định số 214/2025/NĐ-CP",
    )

    q = by[109]
    ex[109] = (
        block(
            "B",
            q["options"][1],
            "Quy định làm rõ/bổ sung hợp đồng tương tự Mẫu E-HSMT xây lắp (3A) kèm theo Thông tư số 79/2025/TT-BTC.",
            "Khi hợp đồng tương tự kê khai/đính kèm không đáp ứng E-HSMT (hoặc kê khai không đầy đủ), chủ đầu tư yêu cầu nhà thầu làm rõ, bổ sung hợp đồng khác được cập nhật từ hồ sơ năng lực trên Hệ thống (thời hạn không ít hơn 03 ngày làm việc). Không có hợp đồng đáp ứng thì nhà thầu bị loại.",
            "Phương án A sai vì không loại ngay mà phải cho bổ sung/thay thế theo mẫu.\n"
            "Phương án C sai vì không chờ xếp thứ nhất mới cho bổ sung.\n"
            "Phương án D sai vì không đồng thời điều chỉnh yêu cầu HSMT chỉ vì HSDT chưa đáp ứng.",
        ),
        "Mẫu E-HSMT xây lắp (3A) kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[110]
    ex[110] = (
        block(
            "C",
            q["options"][2],
            "Quy định về bảo đảm dự thầu không hợp lệ Nghị định số 214/2025/NĐ-CP (ký trước khi phát hành hồ sơ mời thầu).",
            "Thư bảo lãnh/giấy chứng nhận bảo hiểm bảo lãnh dự thầu bị coi là không hợp lệ nếu ký trước khi phát hành hồ sơ mời thầu (cùng các lỗi như sai giá trị thấp hơn yêu cầu, sai hiệu lực ngắn hơn, sai tên thụ hưởng, kèm điều kiện bất lợi…). Thời gian hiệu lực dài hơn hoặc giá trị cao hơn yêu cầu không làm bảo lãnh trở thành không hợp lệ.",
            "Phương án A sai vì hiệu lực dài hơn yêu cầu vẫn hợp lệ.\n"
            "Phương án B sai vì giá trị cao hơn yêu cầu vẫn hợp lệ.\n"
            "Phương án D sai vì A và B không phải trường hợp không hợp lệ.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[111]
    ex[111] = (
        block(
            "B",
            q["options"][1],
            "Ghi chú nộp báo cáo tài chính Mẫu E-HSMT xây lắp (3A) kèm theo Thông tư số 79/2025/TT-BTC.",
            "Đóng thầu 20/3/2025, năm tài chính 01/01–31/12. Thời điểm đóng thầu nằm sau ngày kết thúc năm tài chính 2024 và trước/trong ngày cuối tháng thứ 3 kể từ 31/12/2024 (tức trước/trong 31/3/2025) nên yêu cầu BCTC 03 năm gần nhất áp dụng cho các năm trước năm 2024: 2021, 2022, 2023.",
            "Phương án A sai vì lùi quá xa (2020–2022), không khớp quy tắc tháng thứ 3.\n"
            "Phương án C sai vì không yêu cầu năm 2024 khi đóng thầu trong 03 tháng đầu năm 2025.\n"
            "Phương án D sai vì không phải bộ năm 2019–2021.",
        ),
        "Mẫu E-HSMT xây lắp (3A) kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[112]
    ex[112] = (
        block(
            "A",
            q["options"][0],
            "Ghi chú công trình xây lắp tương tự Mẫu E-HSMT xây lắp (3A) kèm theo Thông tư số 79/2025/TT-BTC.",
            "Công trình đang xét: nhà cấp II, giá trị 60 tỷ. Theo ví dụ mẫu: có 2 công trình nhà cấp III hoàn thành toàn bộ/phần lớn lần lượt 30 tỷ và 50 tỷ thì được coi là đã hoàn thành/hoàn thành phần lớn một công trình dân dụng cấp II với giá trị 30 tỷ (lấy giá trị công trình cấp III nhỏ hơn trong cặp đủ điều kiện quy đổi).",
            "Phương án B sai vì cặp 30 và 20 tỷ không khớp ví dụ/ngưỡng quy đổi cấp III → cấp II như mẫu.\n"
            "Phương án C sai vì 30+20+10 không thay cho cặp 30 và 50 theo ví dụ mẫu.\n"
            "Phương án D sai vì một công trình cấp III giá trị 60 tỷ không được coi tương đương công trình cấp II theo cách nêu tại ví dụ mẫu.",
        ),
        "Mẫu E-HSMT xây lắp (3A) kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[113]
    ex[113] = (
        block(
            "D",
            q["options"][3],
            "Ghi chú giá trị hợp đồng tương tự Mẫu E-HSMT phi tư vấn (5A) kèm theo Thông tư số 79/2025/TT-BTC.",
            "Yêu cầu 30% × 01 tỷ = 300 triệu. Được cộng giá trị công việc cùng tính chất đã nghiệm thu (kể cả hợp đồng chưa hoàn thành/chưa thanh lý); không tính phần chưa nghiệm thu. A: 100 + 250 = 350 ≥ 300; B: hợp đồng hoàn thành 300 = 300; C: chỉ tính 400 đã nghiệm thu ≥ 300. Cả ba trường hợp đều đáp ứng.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Mẫu E-HSMT phi tư vấn (5A) kèm theo Thông tư số 79/2025/TT-BTC",
    )

    # Theo điểm (i)/(ii) mẫu 4A: B (1,6 tỷ ≥ Y=1,5 tỷ, đủ 2 mã, hợp đồng hoàn thành) đạt;
    # chỉ A không đạt → đáp án A (sửa lệch đáp án ngân hàng D).
    q = by[114]
    q["answer"] = 0
    ex[114] = (
        block(
            "A",
            q["options"][0],
            "Điểm (i)/(ii) ghi chú quy mô hợp đồng tương tự Mẫu E-HSMT hàng hóa (4A) kèm theo Thông tư số 79/2025/TT-BTC.",
            "Hai hạng mục khác mã Chương/Nhóm; Y = 50% × 3 tỷ = 1,5 tỷ. Đường (ii): từng mã phải ≥ 50% giá trị hạng mục tương ứng và không được cộng gộp cùng mã giữa nhiều hợp đồng (8415 ≥ 0,5 tỷ; 8507 ≥ 1 tỷ). Phương án A: 8415 chỉ có 400 triệu ở một hợp đồng (không được cộng 400+100) → không đạt 0,5 tỷ → không đáp ứng. Phương án B đạt theo (i): một hợp đồng hoàn thành đủ hai mã, tổng 1,6 tỷ ≥ 1,5 tỷ. Phương án C đạt theo (ii): 600 triệu và 1 tỷ.",
            "Phương án B sai (với tư cách đáp án “không đáp ứng”) vì B đã đáp ứng theo điểm (i).\n"
            "Phương án C sai vì C đã đáp ứng theo điểm (ii).\n"
            "Phương án D sai vì chỉ A không đáp ứng, B vẫn đáp ứng.",
        ),
        "Mẫu E-HSMT hàng hóa (4A) kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[115]
    ex[115] = (
        block(
            "A",
            q["options"][0],
            "Mục về nhà thầu phụ Mẫu E-HSMT phi tư vấn (5A) kèm theo Thông tư số 79/2025/TT-BTC.",
            "Với nhà thầu liên danh, từng thành viên chỉ được sử dụng nhà thầu phụ không vượt tỷ lệ % quy định trên giá trị phần công việc mà thành viên đó đảm nhận trong thỏa thuận liên danh. Vậy A: tối đa 20% × 30%; B: tối đa 20% × 70%.",
            "Phương án B sai vì không lấy 20% trên toàn bộ 100% gói cho từng thành viên.\n"
            "Phương án C sai vì không để thỏa thuận nội bộ liên danh thay cho giới hạn theo phần việc từng thành viên.\n"
            "Phương án D sai vì chỉ A đúng.",
        ),
        "Mẫu E-HSMT phi tư vấn (5A) kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[116]
    ex[116] = (
        block(
            "A",
            q["options"][0],
            "Khoản 7 Điều 14 VBHN Luật Đấu thầu; Mục 18 E-CDNT Mẫu E-HSMT (liên danh nộp bảo đảm dự thầu riêng rẽ).",
            "Khi liên danh nộp bảo đảm dự thầu riêng rẽ, nếu một thành viên vi phạm dẫn đến không được hoàn trả bảo đảm dự thầu (gồm hành vi bị cấm/gian lận theo Điều 16 Luật Đấu thầu) thì giá trị bảo đảm dự thầu của tất cả thành viên trong liên danh không được hoàn trả.",
            "Phương án B sai vì không chỉ tịch thu riêng thành viên A.\n"
            "Phương án C sai vì không chỉ tịch thu riêng thành viên B.\n"
            "Phương án D sai vì vẫn không được hoàn trả toàn bộ bảo đảm của liên danh.",
        ),
        "Khoản 7 Điều 14 VBHN Luật Đấu thầu; Mẫu E-HSMT kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[117]
    ex[117] = (
        block(
            "C",
            q["options"][2],
            "Ghi chú hợp đồng tương tự theo chu kỳ Mẫu E-HSMT phi tư vấn (5A) kèm theo Thông tư số 79/2025/TT-BTC.",
            "Gói 3 năm, 12 tỷ, công việc lặp chu kỳ: yêu cầu khoảng 30% giá trị theo chu kỳ 01 năm → 30% × (12/3) = 1,2 tỷ, xét theo 01 năm tương ứng. A: đã nghiệm thu 12 tháng đầu = 1,2 tỷ → đạt. B: có thể cộng giá trị hạng mục cùng tính chất đã thực hiện/nghiệm thu (300 triệu + 1 tỷ = 1,3 tỷ) ≥ 1,2 tỷ → đạt. Cả A và B đáp ứng.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án D sai vì cả hai nhà thầu đều đáp ứng mức 1,2 tỷ theo chu kỳ.",
        ),
        "Mẫu E-HSMT phi tư vấn (5A) kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[118]
    ex[118] = (
        block(
            "D",
            q["options"][3],
            "Ghi chú nguồn lực tài chính / tài sản thanh khoản cao Mẫu E-HSMT xây lắp (3A) kèm theo Thông tư số 79/2025/TT-BTC.",
            "Khi E-HSMT yêu cầu chứng minh nguồn lực tài chính (kể cả cam kết tín dụng), nhà thầu có thể chứng minh bằng tài sản thanh khoản cao (tiền mặt và tương đương tiền mặt — gồm số dư tài khoản, tiền gửi tiết kiệm…), hạn mức tín dụng khả dụng (xác nhận số dư hạn mức), các nguồn tài chính hợp lệ khác, hoặc cam kết cung cấp tín dụng của tổ chức tín dụng (nếu được phép/sử dụng). Các phương án A, B, C đều là cách chứng minh phù hợp → chọn tất cả.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Mẫu E-HSMT xây lắp (3A) kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[119]
    ex[119] = (
        block(
            "C",
            q["options"][2],
            "Khoản 7 Điều 64 VBHN Luật Đấu thầu.",
            "Hợp đồng theo tỷ lệ phần trăm chỉ có thể áp dụng cho gói thầu bảo hiểm công trình mà giá trị hợp đồng được xác định chính xác trên cơ sở giá trị công trình thực tế được nghiệm thu.",
            "Phương án A sai vì mua sắm thiết bị y tế không thuộc phạm vi loại hợp đồng này.\n"
            "Phương án B sai vì xây dựng công trình không áp dụng hợp đồng theo tỷ lệ phần trăm theo Khoản 7 Điều 64.\n"
            "Phương án D sai vì tư vấn giám sát không phải trường hợp nêu tại Khoản 7 Điều 64.",
        ),
        "Khoản 7 Điều 64 VBHN Luật Đấu thầu",
    )

    q = by[120]
    ex[120] = (
        block(
            "A",
            q["options"][0],
            "Điều 119 Nghị định số 214/2025/NĐ-CP.",
            "Giá hợp đồng và các điều khoản cụ thể về thanh toán ghi trong hợp đồng là cơ sở để thanh toán cho nhà thầu. Việc thanh toán không căn cứ theo dự toán và các quy định, hướng dẫn về định mức, đơn giá của Nhà nước.",
            "Phương án B sai vì không lấy dự toán gói thầu làm cơ sở thanh toán.\n"
            "Phương án C sai vì chỉ dự toán gói thầu không phải cơ sở thanh toán.\n"
            "Phương án D sai vì A đúng.",
        ),
        "Điều 119 Nghị định số 214/2025/NĐ-CP",
    )

    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"filled {filled} questions (101-120); Q114 answer -> {by[114]['answer']}")


if __name__ == "__main__":
    main()
