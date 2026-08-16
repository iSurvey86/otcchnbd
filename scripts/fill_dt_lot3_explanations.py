# -*- coding: utf-8 -*-
"""Điền explanation Lô 3 (STT 41–60) theo mẫu 4 khối."""
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

    q = by[41]
    ex[41] = (
        block(
            "A",
            q["options"][0],
            "Khoản 3 Điều 7 VBHN Luật Đấu thầu.",
            "Khoản 3 Điều 7 quy định các thông tin về lựa chọn nhà thầu (gồm kế hoạch lựa chọn nhà thầu tại Điểm a Khoản 1 Điều 7) được đăng tải trên Hệ thống mạng đấu thầu quốc gia (trừ trường hợp thuộc danh mục bí mật nhà nước). Do đó kế hoạch lựa chọn nhà thầu bắt buộc đăng tải trên Hệ thống mạng đấu thầu quốc gia.",
            "Phương án B sai vì Luật không bắt buộc đăng tải kế hoạch trên Báo Tài chính – Đầu tư.\n"
            "Phương án C sai vì không thay thế nghĩa vụ đăng tải trên Hệ thống mạng đấu thầu quốc gia.\n"
            "Phương án D sai vì B không đúng nên không thể A và B đều đúng.",
        ),
        "Khoản 3 Điều 7 VBHN Luật Đấu thầu",
    )

    q = by[42]
    ex[42] = (
        block(
            "A",
            q["options"][0],
            "Khoản 4 Điều 8 VBHN Luật Đấu thầu.",
            "Khoản 4 Điều 8: thông tin quy định tại các Điểm a, d, g, h, i Khoản 1 Điều 7 (trong đó Điểm a gồm kế hoạch lựa chọn nhà thầu) phải được đăng tải trên Hệ thống mạng đấu thầu quốc gia chậm nhất là 05 ngày làm việc kể từ ngày văn bản được ban hành.",
            "Phương án B sai vì không phải 07 ngày thường.\n"
            "Phương án C sai vì không phải 07 ngày làm việc.\n"
            "Phương án D sai vì không phải 10 ngày.",
        ),
        "Khoản 4 Điều 8 VBHN Luật Đấu thầu",
    )

    q = by[43]
    ex[43] = (
        block(
            "A",
            q["options"][0],
            "Khoản 2 Điều 39 VBHN Luật Đấu thầu.",
            "Điều 39 quy định nội dung kế hoạch lựa chọn nhà thầu gồm tên gói thầu, giá gói thầu, nguồn vốn, hình thức và phương thức, thời gian tổ chức lựa chọn nhà thầu, loại hợp đồng, thời gian thực hiện gói thầu… Trong các phương án đưa ra, chỉ “Giá gói thầu” khớp đúng một nội dung bắt buộc của kế hoạch theo Khoản 2 Điều 39.",
            "Phương án B sai vì kế hoạch ghi “thời gian thực hiện gói thầu” (Khoản 7 Điều 39), không phải “thời gian thực hiện hợp đồng”.\n"
            "Phương án C sai vì giám sát hoạt động đấu thầu không thuộc nội dung kế hoạch lựa chọn nhà thầu tại Điều 39.\n"
            "Phương án D sai vì B và C không đúng.",
        ),
        "Khoản 2 Điều 39 VBHN Luật Đấu thầu",
    )

    q = by[44]
    ex[44] = (
        block(
            "A",
            q["options"][0],
            "Khoản 4 Điều 80 Nghị định số 214/2025/NĐ-CP.",
            "Khoản 4 Điều 80: đối với gói thầu hoặc nội dung mua sắm có giá không quá 50 triệu đồng, thủ trưởng cơ quan, đơn vị mua sắm quyết định việc mua sắm bảo đảm tiết kiệm, hiệu quả, tự chịu trách nhiệm; không bắt buộc theo đủ điều kiện/quy trình chỉ định thầu rút gọn nhưng phải bảo đảm hóa đơn, chứng từ đầy đủ theo pháp luật. Đây chính là cách thực hiện mua sắm đơn giản, không bắt buộc lập đầy đủ kế hoạch lựa chọn nhà thầu như gói thầu thông thường.",
            "Phương án B sai vì vẫn phải bảo đảm hóa đơn, chứng từ đầy đủ; không được bỏ hóa đơn.\n"
            "Phương án C sai vì không bắt buộc phải hình thành gói thầu và lập kế hoạch lựa chọn nhà thầu theo các hình thức đấu thầu/chào hàng/chỉ định.\n"
            "Phương án D sai vì C không đúng nên không thể A và C đều đúng.",
        ),
        "Khoản 4 Điều 80 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[45]
    ex[45] = (
        block(
            "D",
            q["options"][3],
            "Khoản 1 Điều 40 VBHN Luật Đấu thầu (phân loại phần công việc khi lập kế hoạch lựa chọn nhà thầu).",
            "Khi lập kế hoạch, hồ sơ trình duyệt phải tách: phần công việc không áp dụng một trong các hình thức lựa chọn nhà thầu; và phần công việc thuộc kế hoạch hình thành gói thầu. Công việc Hội đồng đền bù giải phóng mặt bằng tự làm thuộc phần không áp dụng hình thức lựa chọn nhà thầu; còn phần phải thuê tư vấn phục vụ GPMB thì hình thành gói thầu thuộc kế hoạch lựa chọn nhà thầu. Do đó B và C đều đúng.",
            "Phương án A sai vì không phải mọi công việc liên quan GPMB đều đưa vào phần không áp dụng hình thức lựa chọn nhà thầu.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Khoản 1 Điều 40 VBHN Luật Đấu thầu",
    )

    q = by[46]
    ex[46] = (
        block(
            "B",
            q["options"][1],
            "Mẫu tờ trình kế hoạch lựa chọn nhà thầu kèm theo Thông tư số 79/2025/TT-BTC (hướng dẫn kê khai phần công việc đã thực hiện).",
            "Theo hướng dẫn mẫu tờ trình kế hoạch lựa chọn nhà thầu, đối với gói thầu đã thanh lý hợp đồng, giá trị phần công việc đã thực hiện được ghi theo giá trị thanh lý hợp đồng (không lấy giá gói thầu hay giá hợp đồng ban đầu).",
            "Phương án A sai vì giá gói thầu là giá trị phê duyệt trong kế hoạch, không phản ánh giá trị đã thanh lý.\n"
            "Phương án C sai vì giá hợp đồng có thể khác giá trị khi thanh lý.\n"
            "Phương án D sai vì chỉ phương án B phù hợp mẫu tờ trình.",
        ),
        "Mẫu tờ trình kế hoạch lựa chọn nhà thầu kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[47]
    ex[47] = (
        block(
            "A",
            q["options"][0],
            "Điểm đ Khoản 1 Điều 5 VBHN Luật Đấu thầu.",
            "Điểm đ Khoản 1 Điều 5: nhà thầu có tư cách hợp lệ khi bảo đảm cạnh tranh trong đấu thầu theo quy định tại Điều 6. Như vậy bảo đảm cạnh tranh là một nội dung đánh giá về tư cách hợp lệ.",
            "Phương án B sai vì năng lực, kinh nghiệm là nhóm tiêu chuẩn đánh giá riêng.\n"
            "Phương án C sai vì kỹ thuật là nhóm tiêu chuẩn đánh giá riêng.\n"
            "Phương án D sai vì tài chính là nhóm tiêu chuẩn đánh giá riêng.",
        ),
        "Điểm đ Khoản 1 Điều 5 VBHN Luật Đấu thầu",
    )

    q = by[48]
    ex[48] = (
        block(
            "A",
            q["options"][0],
            "Khoản 2 Điều 6 VBHN Luật Đấu thầu; Điểm a Khoản 1 Điều 4 Nghị định số 214/2025/NĐ-CP.",
            "Nhà thầu tham dự thầu phải độc lập với nhà thầu tư vấn lập, thẩm định hồ sơ mời thầu của gói thầu đó. Đối với gói hàng hóa, yêu cầu này được cụ thể tại Điểm a Khoản 1 Điều 4 Nghị định 214.",
            "Phương án B sai vì độc lập với nhà thầu khác chỉ bắt buộc trong đấu thầu hạn chế (Điểm b Khoản 2 Điều 6), không phải đấu thầu rộng rãi nói chung.\n"
            "Phương án C sai vì Luật/Nghị định không yêu cầu độc lập với tư vấn lập kế hoạch tổng thể lựa chọn nhà thầu như điều kiện cạnh tranh tương ứng.\n"
            "Phương án D sai vì không có yêu cầu độc lập với tư vấn lập kế hoạch lựa chọn nhà thầu trong các quy định nêu trên.",
        ),
        "Khoản 2 Điều 6 VBHN Luật Đấu thầu; Điểm a Khoản 1 Điều 4 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[49]
    ex[49] = (
        block(
            "D",
            q["options"][3],
            "Điều 6 VBHN Luật Đấu thầu.",
            "Các phương án A, B, C phản ánh đúng nghĩa vụ độc lập theo Điều 6. Phương án D nêu nhà thầu thực hiện hợp đồng phải độc lập với tư vấn lập kế hoạch lựa chọn nhà thầu – không phải nội dung bảo đảm cạnh tranh theo Điều 6, nên nhận định D không phù hợp.",
            "Phương án A phù hợp Điểm d Khoản 1 Điều 6 (độc lập với chủ đầu tư và các ngoại lệ).\n"
            "Phương án B phù hợp Khoản 2 Điều 6 (độc lập với tư vấn quản lý dự án, giám sát).\n"
            "Phương án C phù hợp Khoản 2 Điều 6 (độc lập với tư vấn lập, thẩm tra, thẩm định thiết kế, dự toán).",
        ),
        "Điều 6 VBHN Luật Đấu thầu",
    )

    q = by[50]
    ex[50] = (
        block(
            "D",
            q["options"][3],
            "Điểm a, b, c Khoản 3 Điều 4 Nghị định số 214/2025/NĐ-CP; Điểm b Khoản 2 Điều 6 VBHN Luật Đấu thầu.",
            "Với gói EPC, EP, EC, Khoản 3 Điều 4 Nghị định 214 yêu cầu độc lập với tư vấn lập/thẩm tra FEED, BCKTKT/BCNCKT (theo trường hợp). Việc phải độc lập với nhà thầu khác cùng tham dự chỉ áp dụng đối với đấu thầu hạn chế, không áp dụng với đấu thầu rộng rãi. Do đó phương án D không thuộc quy định bảo đảm cạnh tranh cho tình huống đấu thầu rộng rãi gói EPC/EP/EC.",
            "Phương án A đúng theo Điểm a Khoản 3 Điều 4 Nghị định 214.\n"
            "Phương án B đúng theo Điểm b Khoản 3 Điều 4 Nghị định 214.\n"
            "Phương án C đúng theo Điểm c Khoản 3 Điều 4 Nghị định 214.",
        ),
        "Điểm a, b, c Khoản 3 Điều 4 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[51]
    ex[51] = (
        block(
            "B",
            q["options"][1],
            "Điểm c Khoản 3 Điều 26 Nghị định số 214/2025/NĐ-CP.",
            "Khoản 3 Điều 26 liệt kê nội dung đánh giá tính hợp lệ của hồ sơ dự thầu, trong đó có hiệu lực của hồ sơ dự thầu đáp ứng yêu cầu hồ sơ mời thầu.",
            "Phương án A sai vì nhân sự chủ chốt thuộc đánh giá năng lực/kinh nghiệm hoặc kỹ thuật, không phải tính hợp lệ HSDT theo Khoản 3 Điều 26.\n"
            "Phương án C sai vì năng lực tài chính thuộc tiêu chuẩn năng lực, kinh nghiệm.\n"
            "Phương án D sai vì nghĩa vụ thuế thuộc tiêu chuẩn năng lực tài chính (trong tiêu chuẩn năng lực, kinh nghiệm), không phải tiêu chí tính hợp lệ tại Điểm c Khoản 3.",
        ),
        "Điểm c Khoản 3 Điều 26 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[52]
    ex[52] = (
        block(
            "C",
            q["options"][2],
            "Khoản 2 Điều 14 VBHN Luật Đấu thầu; Khoản 3 Điều 63 Nghị định số 214/2025/NĐ-CP.",
            "Bảo đảm dự thầu chỉ áp dụng với phi tư vấn, hàng hóa, xây lắp, hỗn hợp và lựa chọn nhà đầu tư (Khoản 2 Điều 14), không áp dụng đối với gói tư vấn. Do đó “bảo đảm dự thầu hợp lệ” không phải tiêu chuẩn đánh giá tính hợp lệ hồ sơ dự thầu gói tư vấn.",
            "Phương án A đúng là nội dung hợp lệ hồ sơ đề xuất kỹ thuật tư vấn (hiệu lực HSDXKT).\n"
            "Phương án B đúng là nội dung hợp lệ (có bản gốc HSDXKT).\n"
            "Phương án D đúng là nội dung hợp lệ hồ sơ đề xuất kỹ thuật tư vấn theo Khoản 3 Điều 63 Nghị định 214.",
        ),
        "Khoản 2 Điều 14 VBHN Luật Đấu thầu; Khoản 3 Điều 63 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[53]
    ex[53] = (
        block(
            "A",
            q["options"][0],
            "Khoản 4 và Khoản 5 Điều 26 Nghị định số 214/2025/NĐ-CP.",
            "Đối với gói mua sắm hàng hóa, xây lắp (và tương tự với phi tư vấn), tiêu chuẩn đánh giá về năng lực và kinh nghiệm được xây dựng bằng tiêu chí đạt, không đạt.",
            "Phương án B sai vì chấm điểm dùng cho tiêu chuẩn kỹ thuật (khi chọn phương pháp chấm điểm), không phải phương pháp bắt buộc cho năng lực, kinh nghiệm.\n"
            "Phương án C sai vì không kết hợp hai phương pháp cho năng lực, kinh nghiệm theo quy định nêu trên.\n"
            "Phương án D sai vì phương pháp dựa trên kỹ thuật là phương pháp đánh giá tổng thể khác, không phải cách xây dựng tiêu chuẩn năng lực, kinh nghiệm.",
        ),
        "Khoản 4 và Khoản 5 Điều 26 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[54]
    ex[54] = (
        block(
            "A",
            q["options"][0],
            "Khoản 4 Điều 26 Nghị định số 214/2025/NĐ-CP.",
            "Khoản 4 Điều 26 quy định tiêu chuẩn năng lực, kinh nghiệm gói hàng hóa gồm năng lực tài chính với doanh thu (cùng giá trị tài sản ròng, nghĩa vụ thuế…). Doanh thu bình quân các năm gần nhất là nội dung thuộc nhóm này và được dùng trong thực tiễn lập HSMT.",
            "Phương án B sai vì Khoản 12 Điều 26 quy định nguyên tắc không yêu cầu giấy phép bán hàng (trừ hàng đặc thù).\n"
            "Phương án C sai vì số năm thành lập không phải tiêu chuẩn năng lực, kinh nghiệm bắt buộc theo Khoản 4 Điều 26.\n"
            "Phương án D sai vì “năng lực quản lý” chung không phải tiêu chí được liệt kê như doanh thu/tài sản ròng.",
        ),
        "Khoản 4 Điều 26 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[55]
    ex[55] = (
        block(
            "A",
            q["options"][0],
            "Khoản 4 Điều 26 Nghị định số 214/2025/NĐ-CP.",
            "Khoản 4 Điều 26 nêu kinh nghiệm thực hiện các hợp đồng cung cấp hàng hóa tương tự kèm “(nếu có)” – tức không bắt buộc trong mọi gói thầu mua sắm hàng hóa đấu thầu rộng rãi. Các nội dung tài sản ròng, doanh thu, nghĩa vụ thuế thuộc nhóm năng lực tài chính được quy định để đánh giá.",
            "Phương án B sai vì giá trị tài sản ròng thuộc năng lực tài chính theo Khoản 4 Điều 26.\n"
            "Phương án C sai vì doanh thu thuộc năng lực tài chính theo Khoản 4 Điều 26.\n"
            "Phương án D sai vì thực hiện nghĩa vụ kê khai thuế, nộp thuế thuộc nội dung đánh giá năng lực tài chính theo Khoản 4 Điều 26.",
        ),
        "Khoản 4 Điều 26 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[56]
    ex[56] = (
        block(
            "C",
            q["options"][2],
            "Khoản 5 Điều 26 Nghị định số 214/2025/NĐ-CP.",
            "Khoản 5 Điều 26: tiêu chuẩn năng lực, kinh nghiệm gói xây lắp gồm năng lực tài chính (giá trị tài sản ròng, doanh thu, nghĩa vụ thuế…). Đây là tiêu chuẩn bắt buộc thuộc nhóm năng lực, kinh nghiệm khi đấu thầu rộng rãi.",
            "Phương án A sai vì có bản gốc HSDT thuộc đánh giá tính hợp lệ (Khoản 3 Điều 26).\n"
            "Phương án B sai vì có tên trong danh sách ngắn thuộc tư cách hợp lệ khi đã có danh sách ngắn (Điều 5 Luật), không phải tiêu chuẩn năng lực, kinh nghiệm.\n"
            "Phương án D sai vì bảo đảm dự thầu hợp lệ thuộc tính hợp lệ HSDT (Khoản 3 Điều 26).",
        ),
        "Khoản 5 Điều 26 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[57]
    ex[57] = (
        block(
            "A",
            q["options"][0],
            "Điểm b Khoản 5 Điều 26 Nghị định số 214/2025/NĐ-CP.",
            "Điểm b Khoản 5 Điều 26: đối với nội dung công việc xây lắp thuộc gói thầu xây lắp, EC, tiêu chuẩn đánh giá về kỹ thuật được đưa ra yêu cầu về nhãn hiệu theo nhóm nhãn hiệu cho nguyên nhiên vật liệu, vật tư và các yếu tố đầu vào.",
            "Phương án B sai vì quy định nêu rõ xây lắp, EC – không phải EPC.\n"
            "Phương án C sai vì không gồm EPC và PC theo đúng phạm vi Điểm b Khoản 5.\n"
            "Phương án D sai vì không gồm PC theo đúng phạm vi Điểm b Khoản 5.",
        ),
        "Điểm b Khoản 5 Điều 26 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[58]
    ex[58] = (
        block(
            "C",
            q["options"][2],
            "Khoản 5 Điều 63 Nghị định số 214/2025/NĐ-CP.",
            "Khoản 5 Điều 63 quy định tiêu chuẩn đánh giá về kỹ thuật gói tư vấn gồm kinh nghiệm và năng lực; uy tín nhà thầu; giải pháp và phương pháp luận… Nghĩa vụ kê khai thuế và nộp thuế thuộc nội dung đánh giá tính hợp lệ hồ sơ đề xuất kỹ thuật (Khoản 3 Điều 63), không phải tiêu chuẩn đánh giá về kỹ thuật.",
            "Phương án A đúng là tiêu chuẩn kỹ thuật (giải pháp phương pháp luận).\n"
            "Phương án B đúng là tiêu chuẩn kỹ thuật (uy tín nhà thầu).\n"
            "Phương án D đúng là tiêu chuẩn kỹ thuật (kinh nghiệm và năng lực nhà thầu).",
        ),
        "Khoản 5 Điều 63 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[59]
    ex[59] = (
        block(
            "C",
            q["options"][2],
            "Điểm b Khoản 1 Điều 26 và Điểm b Khoản 1 Điều 63 Nghị định số 214/2025/NĐ-CP.",
            "Căn cứ lập hồ sơ mời thầu gồm kế hoạch lựa chọn nhà thầu được duyệt (và kế hoạch tổng thể nếu có). Đây là một trong các căn cứ bắt buộc khi lập HSMT.",
            "Phương án A sai vì báo giá nhà thầu không phải căn cứ lập HSMT.\n"
            "Phương án B sai vì “quyết định mua sắm được phê duyệt” không thay thế kế hoạch lựa chọn nhà thầu trong các căn cứ tại Điều 26/63.\n"
            "Phương án D sai vì B không đúng.",
        ),
        "Điểm b Khoản 1 Điều 26 và Điểm b Khoản 1 Điều 63 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[60]
    ex[60] = (
        block(
            "B",
            q["options"][1],
            "Điều 58 và Điều 59 VBHN Luật Đấu thầu.",
            "Điều 59 quy định các phương pháp đánh giá hồ sơ dự thầu gói tư vấn: giá thấp nhất, giá cố định, kết hợp kỹ thuật và giá, dựa trên kỹ thuật. Phương pháp giá đánh giá được quy định tại Điều 58 cho phi tư vấn, hàng hóa, xây lắp, hỗn hợp – không áp dụng đối với gói tư vấn.",
            "Phương án A sai vì giá thấp nhất được áp dụng cho tư vấn theo Khoản 1 Điều 59.\n"
            "Phương án C sai vì kết hợp kỹ thuật và giá được áp dụng cho tư vấn theo Khoản 3 Điều 59.\n"
            "Phương án D sai vì giá cố định được áp dụng cho tư vấn theo Khoản 2 Điều 59.",
        ),
        "Điều 58 và Điều 59 VBHN Luật Đấu thầu",
    )

    for stt, (expl, src) in ex.items():
        by[stt]["explanation"] = expl
        by[stt]["source"] = src

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Lot3 filled: {sum(1 for q in bank['questions'] if q['lot']==3 and q['explanation'])}/20")


if __name__ == "__main__":
    main()
