# -*- coding: utf-8 -*-
"""Điền explanation Lô 4 (STT 61–80) theo mẫu 4 khối."""
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

    q = by[61]
    ex[61] = (
        block(
            "D",
            q["options"][3],
            "Khoản 2 Điều 26 Nghị định số 214/2025/NĐ-CP.",
            "Khoản 2 Điều 26 liệt kê nội dung hồ sơ mời thầu gồm chỉ dẫn nhà thầu (kèm tùy chọn mua thêm nếu có), bảng dữ liệu đấu thầu, tiêu chuẩn đánh giá, biểu mẫu, phạm vi cung cấp/yêu cầu kỹ thuật, điều kiện và biểu mẫu hợp đồng… Biên bản hoàn thiện hợp đồng là tài liệu hình thành sau khi có kết quả lựa chọn nhà thầu, không thuộc nội dung hồ sơ mời thầu.",
            "Phương án A thuộc nội dung HSMT theo Điểm a Khoản 2 Điều 26.\n"
            "Phương án B thuộc nội dung HSMT theo Điểm b Khoản 2 Điều 26.\n"
            "Phương án C thuộc nội dung HSMT theo Điểm đ Khoản 2 Điều 26.",
        ),
        "Khoản 2 Điều 26 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[62]
    ex[62] = (
        block(
            "C",
            q["options"][2],
            "Khoản 12 Điều 26 Nghị định số 214/2025/NĐ-CP.",
            "Khoản 12 Điều 26: hồ sơ mời thầu không được yêu cầu giấy phép bán hàng nói chung; chỉ khi hàng hóa đặc thù, phức tạp cần gắn với trách nhiệm của nhà sản xuất về dịch vụ sau bán hàng thì mới có thể yêu cầu giấy phép bán hàng.",
            "Phương án A sai vì hàng hóa thông thường, có sẵn trên thị trường không được yêu cầu giấy phép bán hàng.\n"
            "Phương án B sai vì chỉ riêng việc nhập khẩu không phải căn cứ để yêu cầu giấy phép bán hàng.\n"
            "Phương án D sai vì giá trị lớn không phải điều kiện để yêu cầu giấy phép bán hàng theo Khoản 12 Điều 26.",
        ),
        "Khoản 12 Điều 26 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[63]
    ex[63] = (
        block(
            "B",
            q["options"][1],
            "Khoản 2 và Khoản 3 Điều 44 VBHN Luật Đấu thầu; Khoản 2 Điều 26 Nghị định số 214/2025/NĐ-CP (nguyên tắc không hạn chế cạnh tranh).",
            "Hồ sơ mời thầu không được nêu điều kiện hạn chế sự tham gia của nhà thầu hoặc tạo lợi thế bất bình đẳng. Yêu cầu nhà thầu phải là chủ sở hữu thiết bị chào thầu là điều kiện thu hẹp đối tượng tham dự, thường bị coi là hạn chế cạnh tranh. Các yêu cầu về hợp đồng tương tự, năng lực tài chính, nghĩa vụ thuế thuộc nhóm tiêu chuẩn năng lực/hợp lệ được phép quy định phù hợp mẫu E-HSMT.",
            "Phương án A sai vì yêu cầu chứng minh hợp đồng tương tự là nội dung năng lực, kinh nghiệm được phép.\n"
            "Phương án C sai vì năng lực tài chính lành mạnh thuộc tiêu chuẩn năng lực được phép.\n"
            "Phương án D sai vì hoàn thành nghĩa vụ thuế thuộc nội dung đánh giá năng lực tài chính/hợp lệ theo quy định.",
        ),
        "Khoản 2 và Khoản 3 Điều 44 VBHN Luật Đấu thầu; Khoản 2 Điều 26 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[64]
    ex[64] = (
        block(
            "B",
            q["options"][1],
            "Khoản 2 Điều 44 VBHN Luật Đấu thầu.",
            "Khoản 2 Điều 44 cho phép hồ sơ mời thầu nêu xuất xứ theo nhóm nước, vùng lãnh thổ (và tiêu chuẩn khác do Chính phủ quy định). Quy định này áp dụng cả với đấu thầu rộng rãi qua mạng, kể cả mua sắm tập trung. Không được nêu xuất xứ cụ thể một nước như điều kiện bắt buộc theo hướng hạn chế cạnh tranh.",
            "Phương án A sai vì không được nêu xuất xứ cụ thể một nước bất kỳ như yêu cầu cứng.\n"
            "Phương án C sai vì cụm từ “hoặc tương đương” gắn với nhãn hiệu/catalô minh họa (Điểm c các quy định chi tiết về nhãn hiệu), không biến việc nêu một nước cụ thể thành hợp lệ.\n"
            "Phương án D sai vì Luật cho phép nêu xuất xứ theo nhóm nước, vùng lãnh thổ.",
        ),
        "Khoản 2 Điều 44 VBHN Luật Đấu thầu",
    )

    q = by[65]
    ex[65] = (
        block(
            "B",
            q["options"][1],
            "Mẫu E-HSMT ban hành kèm theo Thông tư số 79/2025/TT-BTC (Đơn dự thầu ký bằng chữ ký số khi nộp E-HSDT; Mẫu giấy ủy quyền).",
            "Theo mẫu E-HSMT, đơn dự thầu được ký bằng chữ ký số của nhà thầu khi nộp E-HSDT trên Hệ thống. Mẫu giấy ủy quyền chỉ nêu phạm vi ủy quyền cho các việc như đối chiếu tài liệu, hoàn thiện hợp đồng (và thương thảo nếu có) – không bao gồm việc ký đơn dự thầu. Do đó đại diện hợp pháp không được ủy quyền cho Giám đốc chi nhánh để ký đơn dự thầu.",
            "Phương án A sai vì ủy quyền bằng văn bản theo mẫu không mở rộng tới ký đơn dự thầu.\n"
            "Phương án C sai vì việc tạo tài khoản nghiệp vụ cho Giám đốc chi nhánh không thay thế nghĩa vụ ký đơn dự thầu bằng chữ ký số của nhà thầu theo mẫu.\n"
            "Phương án D sai vì phương án B đúng.",
        ),
        "Mẫu E-HSMT kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[66]
    ex[66] = (
        block(
            "B",
            q["options"][1],
            "Mục 18.8 E-CDNT Mẫu E-HSMT hàng hóa (và mẫu tương ứng) kèm theo Thông tư số 79/2025/TT-BTC.",
            "Khi giá trị bảo đảm dự thầu nhỏ hơn 50 triệu đồng, tại thời điểm đóng thầu nhà thầu chưa phải đính kèm thư bảo lãnh/giấy chứng nhận bảo hiểm bảo lãnh mà cam kết trong đơn dự thầu; thời gian có hiệu lực của thư bảo lãnh hoặc giấy chứng nhận bảo hiểm bảo lãnh được quy định trong Thông báo mời đối chiếu tài liệu.",
            "Phương án A sai vì không lấy thời hạn hiệu lực bảo lãnh từ E-HSMT trong trường hợp < 50 triệu đồng theo Mục 18.8.\n"
            "Phương án C sai vì không phải Thông báo mời thương thảo hợp đồng.\n"
            "Phương án D sai vì phương án B đúng.",
        ),
        "Mục 18.8 E-CDNT Mẫu E-HSMT kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[67]
    ex[67] = (
        block(
            "C",
            q["options"][2],
            "Mục 18.8 E-CDNT Mẫu E-HSMT kèm theo Thông tư số 79/2025/TT-BTC.",
            "Cùng Mục 18.8: thời gian có hiệu lực của thư bảo lãnh dự thầu hoặc giấy chứng nhận bảo hiểm bảo lãnh được tính từ ngày thực hiện đối chiếu tài liệu (theo số ngày ghi trong Thông báo mời đối chiếu tài liệu).",
            "Phương án A sai vì không tính từ ngày có thời điểm đóng thầu trong trường hợp < 50 triệu đồng theo Mục 18.8.\n"
            "Phương án B sai vì không tính từ ngày phê duyệt kết quả lựa chọn nhà thầu.\n"
            "Phương án D sai vì phương án C đúng.",
        ),
        "Mục 18.8 E-CDNT Mẫu E-HSMT kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[68]
    ex[68] = (
        block(
            "C",
            q["options"][2],
            "Điều 28 Thông tư số 79/2025/TT-BTC.",
            "Điều 28: trường hợp E-HSMT có yêu cầu cung cấp hàng mẫu, nhà thầu có thể nộp bổ sung hàng mẫu trong thời hạn 05 ngày làm việc sau thời điểm đóng thầu.",
            "Phương án A sai vì không phải 07 ngày làm việc sau đóng thầu.\n"
            "Phương án B sai vì không tính từ thời điểm mở thầu và không phải 07 ngày.\n"
            "Phương án D sai vì được phép nộp bổ sung hàng mẫu trong hạn 05 ngày làm việc sau đóng thầu.",
        ),
        "Điều 28 Thông tư số 79/2025/TT-BTC",
    )

    q = by[69]
    ex[69] = (
        block(
            "C",
            q["options"][2],
            "Khoản 5 Điều 63 Nghị định số 214/2025/NĐ-CP; Bảng tiêu chuẩn đánh giá về kỹ thuật Mẫu E-HSMT tư vấn kèm theo Thông tư số 79/2025/TT-BTC.",
            "Tiêu chí uy tín nhà thầu thông qua tham dự thầu, kết quả thực hiện hợp đồng được ấn định 5% tổng số điểm kỹ thuật. Với thang điểm 1.000, số điểm tương ứng là 5% × 1.000 = 50 điểm.",
            "Phương án A sai vì 150 điểm vượt quá tỷ trọng 5%.\n"
            "Phương án B sai vì 100 điểm tương ứng 10%, không khớp tỷ trọng 5%.\n"
            "Phương án D sai vì tiêu chí này được ấn định 5%, không phải khoảng 0–49 điểm.",
        ),
        "Khoản 5 Điều 63 Nghị định số 214/2025/NĐ-CP; Mẫu E-HSMT tư vấn kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[70]
    ex[70] = (
        block(
            "D",
            q["options"][3],
            "Ghi chú về quy mô hợp đồng tương tự tại Mẫu E-HSMT dịch vụ phi tư vấn kèm theo Thông tư số 79/2025/TT-BTC.",
            "Với gói thầu có tính chất công việc lặp lại theo chu kỳ qua các năm, giá trị hợp đồng tương tự khoảng 30% giá trị phần công việc theo chu kỳ 01 năm (không lấy theo tổng cả thời gian thực hiện). Gói thuê hệ thống máy chủ 5 năm, giá gói 5 tỷ đồng → giá trị 01 năm = 1 tỷ đồng → quy mô tối thiểu ≈ 30% × 1 tỷ = 300 triệu đồng.",
            "Phương án A sai vì 2,5 tỷ là 50% tổng giá gói thầu, không đúng cách xác định theo chu kỳ.\n"
            "Phương án B sai vì 2 tỷ không khớp 30% giá trị một năm.\n"
            "Phương án C sai vì 1,5 tỷ không khớp 30% giá trị một năm.",
        ),
        "Mẫu E-HSMT dịch vụ phi tư vấn kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[71]
    ex[71] = (
        block(
            "D",
            q["options"][3],
            "Khoản 10 Điều 26 Nghị định số 214/2025/NĐ-CP.",
            "Khoản 10 Điều 26: đối với đấu thầu quốc tế, hồ sơ mời thầu phải quy định sử dụng lao động trong nước đối với những vị trí lao động trong nước đáp ứng được và có khả năng cung cấp, đặc biệt là lao động phổ thông. Do đó cả A và C đều đúng.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B sai vì không được ưu tiên dùng lao động nước ngoài khi trong nước chưa đáp ứng theo hướng “tạo điều kiện tiếp nhận công nghệ” như cách diễn đạt phương án B.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Khoản 10 Điều 26 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[72]
    ex[72] = (
        block(
            "B",
            q["options"][1],
            "Điểm b các quy định chi tiết Khoản 2 Điều 44 VBHN Luật Đấu thầu tại Nghị định số 214/2025/NĐ-CP (xuất xứ theo nhóm nước).",
            "Khi HSMT nêu xuất xứ theo nhóm nước, vùng lãnh thổ mà không gồm Việt Nam, hàng hóa có xuất xứ Việt Nam vẫn được xem xét, đánh giá.",
            "Phương án A sai vì hàng hóa xuất xứ Việt Nam không bị loại khỏi việc xem xét, đánh giá.\n"
            "Phương án C sai vì không yêu cầu bắt buộc bổ sung hàng hóa đúng nhóm nước đã nêu theo hướng loại trừ xuất xứ Việt Nam.\n"
            "Phương án D sai vì cùng lý do với C.",
        ),
        "Khoản 2 Điều 44 VBHN Luật Đấu thầu; quy định chi tiết tại Nghị định số 214/2025/NĐ-CP",
    )

    q = by[73]
    ex[73] = (
        block(
            "C",
            q["options"][2],
            "Ghi chú tiêu chuẩn hợp đồng tương tự Mẫu E-HSMT hàng hóa kèm theo Thông tư số 79/2025/TT-BTC.",
            "Tính chất tương tự được xác định theo tiêu chí hàng hóa thuộc cùng chủng loại/lĩnh vực do E-HSMT yêu cầu hoặc hàng hóa có cùng mã Chương, mã Nhóm (4 số đầu mã HS). Nhà thầu đáp ứng một trong các tiêu chí này được coi là có tính chất tương tự.",
            "Phương án A chưa đủ vì chỉ nêu lĩnh vực tổng quát, bỏ tiêu chí mã HS.\n"
            "Phương án B chưa đủ vì chỉ nêu mã HS, bỏ tiêu chí chủng loại/lĩnh vực.\n"
            "Phương án D sai vì A và B riêng lẻ đều chưa đầy đủ theo mẫu; đáp án đúng là cách kết hợp “hoặc” tại C.",
        ),
        "Mẫu E-HSMT hàng hóa kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[74]
    ex[74] = (
        block(
            "A",
            q["options"][0],
            "Khoản 2 Điều 20 Nghị định số 214/2025/NĐ-CP; Khoản 5 Điều 26 Nghị định số 214/2025/NĐ-CP.",
            "Đối với gói không phải tư vấn, thông tin uy tín tham dự thầu được xử lý theo cơ chế bảo đảm dự thầu tăng mức (gấp 03 lần) trong thời hạn quy định, không đưa vào tiêu chuẩn đánh giá về kỹ thuật. Tiêu chuẩn kỹ thuật phi tư vấn gồm các yêu cầu về vệ sinh môi trường, PCCC, an toàn lao động, bảo hành/bảo trì (nếu có)…",
            "Phương án B thuộc nội dung có thể đưa vào tiêu chuẩn kỹ thuật phi tư vấn.\n"
            "Phương án C thuộc nội dung có thể đưa vào tiêu chuẩn kỹ thuật phi tư vấn.\n"
            "Phương án D sai vì A đúng là nội dung không thuộc tiêu chuẩn kỹ thuật phi tư vấn.",
        ),
        "Khoản 2 Điều 20 và Khoản 5 Điều 26 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[75]
    ex[75] = (
        block(
            "A",
            q["options"][0],
            "Bảng tiêu chuẩn đánh giá về kỹ thuật Mẫu E-HSMT tư vấn kèm theo Thông tư số 79/2025/TT-BTC; Khoản 5 Điều 63 Nghị định số 214/2025/NĐ-CP.",
            "Tiêu chí “Kinh nghiệm và năng lực của nhà thầu” được quy định tỷ trọng từ 0% đến 15% tổng số điểm. Vì có thể lấy 0%, E-HSMT có thể không quy định tiêu chuẩn kinh nghiệm và năng lực trong tiêu chuẩn đánh giá về kỹ thuật.",
            "Phương án B sai vì mẫu cho phép quy định mức điểm tối thiểu đối với tiêu chí khi được sử dụng.\n"
            "Phương án C sai vì uy tín tham dự thầu được quy định 5% tổng số điểm trong tiêu chuẩn kỹ thuật tư vấn.\n"
            "Phương án D sai vì với tư vấn, hợp đồng tương tự chủ yếu xét tính chất tương tự theo ghi chú mẫu, không bắt buộc đồng thời quy mô giá trị như cách diễn đạt D.",
        ),
        "Mẫu E-HSMT tư vấn kèm theo Thông tư số 79/2025/TT-BTC; Khoản 5 Điều 63 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[76]
    ex[76] = (
        block(
            "A",
            q["options"][0],
            "Ghi chú kinh nghiệm thi công công trình tương tự Mẫu E-HSMT xây lắp kèm theo Thông tư số 79/2025/TT-BTC.",
            "Với tổ hợp nhiều công trình, có thể chỉ yêu cầu công trình/hạng mục chính cùng loại kết cấu có cấp cao nhất. Ví dụ trong mẫu với Nhà A1 kết cấu dạng nhà cấp II giá trị (2X): có thể quy định nhà thầu đã hoàn thành công trình dạng nhà cấp II, giá trị tối thiểu 50% × (2X), không bắt buộc kèm kinh nghiệm hàng rào, nhà bảo vệ hay công trình cấp thấp hơn.",
            "Phương án B sai vì không bắt buộc phải gồm hạng mục hàng rào, nhà bảo vệ.\n"
            "Phương án C sai vì yêu cầu cấp III thấp hơn cấp của công trình chính đang xét (cấp II).\n"
            "Phương án D sai vì vừa sai về cấp vừa thêm hạng mục phụ không bắt buộc.",
        ),
        "Mẫu E-HSMT xây lắp kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[77]
    ex[77] = (
        block(
            "C",
            q["options"][2],
            "Khoản 4 Điều 58 VBHN Luật Đấu thầu; quy định đánh giá kỹ thuật tại Nghị định số 214/2025/NĐ-CP và Mẫu E-HSMT (chào hàng cạnh tranh).",
            "Đối với tiêu chuẩn đánh giá về kỹ thuật, được sử dụng phương pháp chấm điểm hoặc tiêu chí đạt/không đạt. Chào hàng cạnh tranh cũng áp dụng nguyên tắc này; E-BDL cho phép chọn một trong hai phương pháp theo quy mô, tính chất gói thầu.",
            "Phương án A sai vì không bắt buộc chỉ dùng đạt/không đạt.\n"
            "Phương án B sai vì không bắt buộc chỉ dùng chấm điểm.\n"
            "Phương án D sai vì không đủ khi chỉ yêu cầu cam kết mà không đánh giá theo tiêu chuẩn kỹ thuật đã nêu trong HSMT.",
        ),
        "Khoản 4 Điều 58 VBHN Luật Đấu thầu; Mẫu E-HSMT kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[78]
    ex[78] = (
        block(
            "B",
            q["options"][1],
            "Điểm (iii)/(iv) ghi chú quy mô hợp đồng tương tự Mẫu E-HSMT hàng hóa (4A) kèm theo Thông tư số 79/2025/TT-BTC (nhiều hạng mục cùng mã Chương, mã Nhóm; không thuộc mua sắm tập trung/khối lượng lớn).",
            "Hai hạng mục A (4 tỷ) và B (6 tỷ) cùng mã HS 9035 (cùng mã A), không còn hạng mục khác mã. Theo điểm (iii), K = 50% × (tổng hạng mục không cùng mã A + giá trị cao nhất các hạng mục cùng mã A) = 50% × (0 + 6 tỷ) = 3 tỷ đồng. Mức yêu cầu phù hợp là cung cấp 01 hợp đồng cùng mã 9035 với giá trị tối thiểu 03 tỷ đồng.",
            "Phương án A sai vì 02 tỷ thấp hơn K = 03 tỷ.\n"
            "Phương án C sai vì 05 tỷ tương ứng 50% tổng hai hạng mục, không phải công thức điểm (iii).\n"
            "Phương án D sai vì 07 tỷ vượt quá và không phù hợp công thức K.",
        ),
        "Mẫu E-HSMT hàng hóa (4A) kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[79]
    ex[79] = (
        block(
            "C",
            q["options"][2],
            "Ghi chú quy mô hợp đồng tương tự Mẫu E-HSMT hàng hóa kèm theo Thông tư số 79/2025/TT-BTC.",
            "Khi khối lượng, số lượng công việc căn cứ nhu cầu theo các năm và thời gian thực hiện gói thầu dài hơn 01 năm, E-HSMT yêu cầu giá trị hợp đồng tương tự theo chu kỳ 01 năm (thường 50% giá trị theo chu kỳ 01 năm), không lấy theo tổng cả thời gian thực hiện gói thầu.",
            "Phương án A sai vì lấy 50% cả giá gói thầu nhiều năm.\n"
            "Phương án B sai vì không có mức 70% giá gói thầu theo ghi chú này.\n"
            "Phương án D sai vì diễn đạt “tối thiểu bằng 50% giá gói thầu” vẫn neo theo tổng giá gói, không phải theo chu kỳ 01 năm.",
        ),
        "Mẫu E-HSMT hàng hóa kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[80]
    ex[80] = (
        block(
            "A",
            q["options"][0],
            "Mục về nhà thầu phụ Mẫu E-HSMT hàng hóa kèm theo Thông tư số 79/2025/TT-BTC; Khoản 2 Điều 67 VBHN Luật Đấu thầu.",
            "Với gói mua sắm hàng hóa, mẫu E-HSMT khẳng định năng lực/kinh nghiệm nhà thầu phụ không được xem xét khi đánh giá E-HSDT; nhà thầu được ký với nhà thầu phụ đã kê khai hoặc được chủ đầu tư chấp thuận để thực hiện dịch vụ liên quan. Việc bắt buộc chủ đầu tư phải ghi tỷ lệ % giá trị dành cho nhà thầu phụ trong E-BDL làm cơ sở lập E-HSDT không phù hợp quy định/mẫu áp dụng cho gói hàng hóa theo tình huống đề bài.",
            "Phương án B phù hợp mẫu: không xem xét năng lực, kinh nghiệm nhà thầu phụ khi đánh giá E-HSDT.\n"
            "Phương án C phù hợp quyền ký với nhà thầu phụ đã nêu trong E-HSDT.\n"
            "Phương án D phù hợp quyền ký với nhà thầu phụ được chủ đầu tư chấp thuận cho dịch vụ liên quan.",
        ),
        "Mẫu E-HSMT hàng hóa kèm theo Thông tư số 79/2025/TT-BTC",
    )

    for stt, (expl, src) in ex.items():
        by[stt]["explanation"] = expl
        by[stt]["source"] = src

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Lot4 filled: {sum(1 for q in bank['questions'] if q['lot']==4 and q['explanation'])}/20")


if __name__ == "__main__":
    main()
