# -*- coding: utf-8 -*-
"""Điền explanation Lô 1 (STT 1–20) theo mẫu 4 khối."""
from __future__ import annotations

import json
from pathlib import Path

BANK = Path(r"d:\AIPoject\otcchnbd\src\data\dt\bank.json")


def block(stt: int, letter: str, opt: str, can_cu: str, phan_tich: str, doi_chieu: str) -> str:
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
    by_stt = {q["stt"]: q for q in bank["questions"]}

    explanations: dict[int, tuple[str, str]] = {}
    # (explanation, updated_source)

    q = by_stt[1]
    explanations[1] = (
        block(
            1,
            "A",
            q["options"][0],
            "Khoản 1 Điều 2 VBHN Luật Đấu thầu (Luật số 22/2023/QH15 được sửa đổi, bổ sung bởi Luật số 57/2024/QH15 và Luật số 90/2025/QH15).",
            "Khoản 1 Điều 2 xác định đối tượng bắt buộc áp dụng Luật khi lựa chọn nhà thầu của cơ quan, tổ chức, cá nhân sử dụng vốn ngân sách nhà nước / vốn thu hợp pháp của cơ quan nhà nước, đơn vị sự nghiệp công lập (trừ các trường hợp tại Khoản 7, 8 và 9 Điều 3) để thực hiện dự án đầu tư, dự toán mua sắm… Do đó gói thầu thuộc dự án sử dụng vốn ngân sách nhà nước của cơ quan nhà nước thuộc trường hợp bắt buộc tổ chức lựa chọn nhà thầu theo Luật Đấu thầu.",
            "Phương án B sai vì lựa chọn nhà thầu của doanh nghiệp nhà nước không sử dụng vốn ngân sách nhà nước thuộc trường hợp được tự quyết định theo Điểm d Khoản 7 Điều 3 Luật Đấu thầu, không thuộc đối tượng bắt buộc tại Khoản 1 Điều 2.\n"
            "Phương án C sai vì đơn vị sự nghiệp công lập tự bảo đảm chi thường xuyên không sử dụng ngân sách nhà nước cũng thuộc Điểm d Khoản 7 Điều 3 (tự quyết định), không phải đối tượng bắt buộc tại Khoản 1 Điều 2.\n"
            "Phương án D sai vì việc thuê, mua, thuê mua nhà, trụ sở, tài sản gắn liền với đất thuộc Điểm c Khoản 7 Điều 3 – được tự quyết định việc mua sắm, không thuộc trường hợp bắt buộc theo Khoản 1 Điều 2.",
        ),
        "Khoản 1 Điều 2 VBHN Luật Đấu thầu",
    )

    q = by_stt[2]
    explanations[2] = (
        block(
            2,
            "D",
            q["options"][3],
            "Điều 1 VBHN Luật Đấu thầu.",
            "Điều 1 quy định phạm vi điều chỉnh gồm: (i) quản lý nhà nước đối với hoạt động đấu thầu; (ii) thẩm quyền và trách nhiệm của các cơ quan, tổ chức, cá nhân trong hoạt động đấu thầu; (iii) hoạt động lựa chọn nhà thầu thực hiện gói thầu và lựa chọn nhà đầu tư thực hiện dự án đầu tư kinh doanh. Các nội dung A, B, C đều nằm trong Điều 1 nên phương án đúng là D.",
            "Phương án A chỉ nêu một phần phạm vi điều chỉnh nên chưa đủ.\n"
            "Phương án B chỉ nêu phần thẩm quyền, trách nhiệm nên chưa đủ.\n"
            "Phương án C chỉ nêu hoạt động lựa chọn nhà thầu/nhà đầu tư nên chưa đủ.\n"
            "Chỉ phương án D bao quát đầy đủ nội dung Điều 1.",
        ),
        "Điều 1 VBHN Luật Đấu thầu",
    )

    q = by_stt[3]
    explanations[3] = (
        block(
            3,
            "D",
            q["options"][3],
            "Khoản 1 Điều 2 VBHN Luật Đấu thầu (đối tượng áp dụng).",
            "Đối tượng áp dụng Luật tập trung vào cơ quan, tổ chức, cá nhân tham gia/có liên quan đến hoạt động đấu thầu thuộc các trường hợp tại Điều 2 (đặc biệt Khoản 1 về lựa chọn nhà thầu dùng vốn ngân sách/vốn hợp pháp của cơ quan nhà nước, đơn vị SNCL…). Hoạt động mua phần mềm kế toán của hộ kinh doanh cá thể không thuộc các đối tượng/trường hợp đó, nên không thuộc đối tượng áp dụng Luật Đấu thầu.",
            "Phương án A sai vì mua thuốc, hóa chất, vật tư xét nghiệm bằng ngân sách của bệnh viện công lập thuộc Điểm b Khoản 1 Điều 2.\n"
            "Phương án B sai vì gói thầu xây dựng dùng vốn đầu tư công của Ban QLDA thuộc phạm vi Khoản 1 Điều 2.\n"
            "Phương án C sai vì mua sắm trang thiết bị làm việc bằng vốn nhà nước của Văn phòng UBND tỉnh thuộc Khoản 1 Điều 2.",
        ),
        "Khoản 1 Điều 2 VBHN Luật Đấu thầu",
    )

    q = by_stt[4]
    explanations[4] = (
        block(
            4,
            "B",
            q["options"][1],
            "Khoản 4 Điều 4 VBHN Luật Đấu thầu.",
            "Khoản 4 Điều 4 định nghĩa dịch vụ tư vấn gồm lập, đánh giá báo cáo quy hoạch và các dịch vụ tư vấn khác. Gói thầu lập nhiệm vụ quy hoạch vùng thuộc loại dịch vụ tư vấn.",
            "Phương án A sai vì thiết kế và cung cấp hệ thống xử lý nước thải thuộc gói thầu hỗn hợp (EP) theo Khoản 16 Điều 4, không phải dịch vụ tư vấn đơn thuần.\n"
            "Phương án C sai vì quảng cáo thuộc dịch vụ phi tư vấn theo Khoản 5 Điều 4.\n"
            "Phương án D sai vì mua phần mềm kế toán thuộc mua sắm hàng hóa (phần mềm thương mại) theo Khoản 17 Điều 4.",
        ),
        "Khoản 4 Điều 4 VBHN Luật Đấu thầu",
    )

    q = by_stt[5]
    explanations[5] = (
        block(
            5,
            "A",
            q["options"][0],
            "Khoản 5 Điều 4 VBHN Luật Đấu thầu.",
            "Khoản 5 Điều 4 quy định dịch vụ phi tư vấn gồm in ấn và các dịch vụ khác không phải dịch vụ tư vấn. Gói thầu in sổ công tác thuộc dịch vụ phi tư vấn.",
            "Phương án B sai vì thuê kiểm toán thuộc dịch vụ tư vấn (Khoản 4 Điều 4).\n"
            "Phương án C sai vì mua phần mềm thuộc mua sắm hàng hóa (Khoản 17 Điều 4).\n"
            "Phương án D sai vì xây dựng trụ sở thuộc xây lắp (Khoản 33 Điều 4).",
        ),
        "Khoản 5 Điều 4 VBHN Luật Đấu thầu",
    )

    q = by_stt[6]
    explanations[6] = (
        block(
            6,
            "D",
            q["options"][3],
            "Khoản 8 Điều 4 VBHN Luật Đấu thầu.",
            "Khoản 8 Điều 4 định nghĩa đấu thầu là quá trình lựa chọn nhà thầu để ký kết, thực hiện hợp đồng cung cấp dịch vụ tư vấn, phi tư vấn, mua sắm hàng hóa, xây lắp và lựa chọn nhà đầu tư để ký kết, thực hiện hợp đồng dự án đầu tư kinh doanh, trên cơ sở cạnh tranh, công bằng, minh bạch, hiệu quả kinh tế và trách nhiệm giải trình. Nội dung A và B đều đúng theo định nghĩa này.",
            "Phương án A đúng nhưng chưa đủ vì chỉ nêu lựa chọn nhà thầu.\n"
            "Phương án B đúng nhưng chưa đủ vì chỉ nêu lựa chọn nhà đầu tư.\n"
            "Phương án C sai vì diễn đạt chung chung, không khớp định nghĩa tại Khoản 8 Điều 4 (thiếu yếu tố cạnh tranh, công bằng, minh bạch, hiệu quả kinh tế và trách nhiệm giải trình; không phân biệt đủ nhà thầu/nhà đầu tư).",
        ),
        "Khoản 8 Điều 4 VBHN Luật Đấu thầu",
    )

    q = by_stt[7]
    explanations[7] = (
        block(
            7,
            "A",
            q["options"][0],
            "Khoản 10 Điều 4 VBHN Luật Đấu thầu.",
            "Khoản 10 Điều 4: Đấu thầu quốc tế là hoạt động đấu thầu mà nhà thầu, nhà đầu tư trong nước, nước ngoài được tham dự thầu. Phương án A khớp đúng định nghĩa.",
            "Phương án B sai vì Luật không bắt buộc nhà thầu trong nước phải liên danh với nhà thầu nước ngoài khi tham dự đấu thầu quốc tế.\n"
            "Phương án C sai vì không chỉ nhà thầu quốc tế mới được tham dự.\n"
            "Phương án D sai vì đó là đấu thầu trong nước (Khoản 11 Điều 4).",
        ),
        "Khoản 10 Điều 4 VBHN Luật Đấu thầu",
    )

    q = by_stt[8]
    explanations[8] = (
        block(
            8,
            "B",
            q["options"][1],
            "Khoản 13 Điều 4 VBHN Luật Đấu thầu.",
            "Khoản 13 Điều 4: Giá đề nghị trúng thầu là giá dự thầu của nhà thầu được đề nghị trúng thầu sau khi đã được sửa lỗi, hiệu chỉnh sai lệch theo yêu cầu của HSMT/HSYC, trừ đi giá trị giảm giá (nếu có).",
            "Phương án A sai vì nhầm với nội dung quyết định phê duyệt kết quả; không phải định nghĩa giá đề nghị trúng thầu.\n"
            "Phương án C sai vì đó gần với giá dự thầu chưa qua sửa lỗi/hiệu chỉnh/giảm giá (Khoản 12 Điều 4).\n"
            "Phương án D sai vì đó là giá hợp đồng (Khoản 14 Điều 4).",
        ),
        "Khoản 13 Điều 4 VBHN Luật Đấu thầu",
    )

    q = by_stt[9]
    explanations[9] = (
        block(
            9,
            "C",
            q["options"][2],
            "Khoản 17 Điều 4 VBHN Luật Đấu thầu.",
            "Khoản 17 Điều 4 liệt kê hàng hóa gồm máy móc, thiết bị, nguyên liệu… phần mềm thương mại và thuốc, hóa chất, vật tư xét nghiệm, thiết bị y tế. Nội dung A và B đều thuộc định nghĩa hàng hóa nên đáp án là C.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án D sai vì logistics, bảo hiểm, quảng cáo, nghiệm thu chạy thử, chụp ảnh vệ tinh thuộc dịch vụ phi tư vấn (Khoản 5 Điều 4), không phải hàng hóa.",
        ),
        "Khoản 17 Điều 4 VBHN Luật Đấu thầu",
    )

    q = by_stt[10]
    explanations[10] = (
        block(
            10,
            "D",
            q["options"][3],
            "Điểm a, b và c Khoản 1 Điều 10 VBHN Luật Đấu thầu.",
            "Khoản 1 Điều 10 liệt kê đối tượng ưu đãi trong lựa chọn nhà thầu, trong đó có: hàng hóa xuất xứ Việt Nam (Điểm a); sản phẩm, dịch vụ thân thiện môi trường (Điểm b); nhà thầu trong nước sản xuất hàng hóa xuất xứ Việt Nam phù hợp HSMT (Điểm c). Cả A, B, C đều đúng nên chọn D.",
            "Phương án A, B, C mỗi phương án chỉ nêu một đối tượng ưu đãi nên chưa bao quát đủ câu hỏi “đối tượng nào sau đây”.\n"
            "Phương án D là đáp án đầy đủ theo Điểm a, b, c Khoản 1 Điều 10.",
        ),
        "Điểm a, b, c Khoản 1 Điều 10 VBHN Luật Đấu thầu",
    )

    q = by_stt[11]
    explanations[11] = (
        block(
            11,
            "D",
            q["options"][3],
            "Điểm c, đ và h Khoản 1 Điều 10 VBHN Luật Đấu thầu.",
            "Điểm c: nhà thầu trong nước sản xuất hàng hóa xuất xứ Việt Nam phù hợp HSMT. Điểm đ: nhà thầu trong nước tham dự độc lập hoặc liên danh với nhà thầu trong nước khác khi tham dự đấu thầu quốc tế. Điểm h: nhà thầu có sử dụng lao động nữ, thương binh, người khuyết tật hoặc người dân tộc thiểu số. Cả A, B, C đều đúng nên chọn D.",
            "Phương án A, B, C mỗi phương án chỉ nêu một nhóm nhà thầu được ưu đãi nên chưa đủ.\n"
            "Phương án D bao quát đủ các trường hợp nêu trong câu hỏi theo Điểm c, đ, h Khoản 1 Điều 10.",
        ),
        "Điểm c, đ, h Khoản 1 Điều 10 VBHN Luật Đấu thầu",
    )

    q = by_stt[12]
    explanations[12] = (
        block(
            12,
            "D",
            q["options"][3],
            "Điểm d Khoản 7 Điều 3 VBHN Luật Đấu thầu.",
            "Khoản 7 Điều 3 cho phép cơ quan, tổ chức, doanh nghiệp tự quyết định việc mua sắm trên cơ sở công khai, minh bạch, hiệu quả và trách nhiệm giải trình trong một số trường hợp; Điểm d nêu rõ lựa chọn nhà thầu của DNNN không dùng vốn NSNN, ĐVSNCL tự bảo đảm chi thường xuyên và chi đầu tư, ĐVSNCL tự bảo đảm chi thường xuyên không dùng NSNN. Phương án D khớp đúng Điểm d.",
            "Phương án A sai vì gói thầu thuộc dự án vốn đầu tư công của cơ quan nhà nước thuộc đối tượng áp dụng bắt buộc tại Khoản 1 Điều 2, không thuộc trường hợp tự quyết định tại Khoản 7 Điều 3.\n"
            "Phương án B sai vì ĐVSNCL bảo đảm một phần chi thường xuyên dùng vốn đầu tư công vẫn thuộc phạm vi áp dụng Luật theo Khoản 1 Điều 2.\n"
            "Phương án C sai vì gói thầu dùng vốn NSNN của DNNN thuộc đối tượng áp dụng Khoản 1 Điều 2, không phải trường hợp tự quyết định.",
        ),
        "Điểm d Khoản 7 Điều 3 VBHN Luật Đấu thầu",
    )

    q = by_stt[13]
    explanations[13] = (
        block(
            13,
            "C",
            q["options"][2],
            "Khoản 2 Điều 12 VBHN Luật Đấu thầu.",
            "Khoản 2 Điều 12: ngôn ngữ sử dụng đối với đấu thầu quốc tế là tiếng Anh hoặc tiếng Việt và tiếng Anh.",
            "Phương án A sai vì tiếng Việt là ngôn ngữ đấu thầu trong nước (Khoản 1 Điều 12), không phải quy định riêng cho đấu thầu quốc tế.\n"
            "Phương án B sai vì Luật không quy định tiếng Đức.\n"
            "Phương án D sai vì không có quy định tiếng Đức hoặc tiếng Anh theo cặp đó.",
        ),
        "Khoản 2 Điều 12 VBHN Luật Đấu thầu",
    )

    q = by_stt[14]
    explanations[14] = (
        block(
            14,
            "C",
            q["options"][2],
            "Khoản 2 Điều 12 VBHN Luật Đấu thầu.",
            "Khoản 2 Điều 12 quy định thêm: nếu ngôn ngữ trong HSMQT/HSMST/HSMT/HSYC là tiếng Việt và tiếng Anh thì nhà thầu, nhà đầu tư được lựa chọn tiếng Việt hoặc tiếng Anh để tham dự thầu. Do đó đáp án là C.",
            "Phương án A sai vì không bắt buộc chỉ dùng tiếng Việt.\n"
            "Phương án B sai vì không bắt buộc chỉ dùng tiếng Anh.\n"
            "Phương án D sai vì Luật cho phép chọn một trong hai ngôn ngữ, không bắt buộc dùng đồng thời cả hai.",
        ),
        "Khoản 2 Điều 12 VBHN Luật Đấu thầu",
    )

    q = by_stt[15]
    explanations[15] = (
        block(
            15,
            "C",
            q["options"][2],
            "Điểm d Khoản 1 Điều 11 VBHN Luật Đấu thầu.",
            "Điểm d Khoản 1 Điều 11: tổ chức đấu thầu quốc tế mua sắm hàng hóa khi hàng hóa trong nước không sản xuất được hoặc sản xuất được nhưng không đáp ứng một trong các yêu cầu về kỹ thuật, chất lượng, giá. Đồng thời, hàng hóa thông dụng đã nhập khẩu và chào bán tại Việt Nam thì không tổ chức đấu thầu quốc tế. Phương án C khớp điều kiện này.",
            "Phương án A sai vì hàng hóa thông dụng, đơn giản, có sẵn không phải điều kiện mở đấu thầu quốc tế theo Điểm d.\n"
            "Phương án B sai vì nếu trong nước sản xuất được và đáp ứng kỹ thuật, chất lượng, giá thì không thuộc điều kiện mở đấu thầu quốc tế; chủ đầu tư cũng không được lấy lý do “muốn mua nhập khẩu” để mở quốc tế trái quy định.\n"
            "Phương án D sai vì Điểm d Khoản 1 Điều 11 nêu rõ hàng hóa thông dụng đã nhập khẩu và chào bán tại Việt Nam thì không tổ chức đấu thầu quốc tế.",
        ),
        "Điểm d Khoản 1 Điều 11 VBHN Luật Đấu thầu",
    )

    q = by_stt[16]
    explanations[16] = (
        block(
            16,
            "C",
            q["options"][2],
            "Khoản 4 Điều 9 VBHN Luật Đấu thầu.",
            "Khoản 4 Điều 9: Trường hợp hủy thầu, hồ sơ liên quan được lưu trữ trong thời hạn 05 năm kể từ ngày quyết định hủy thầu được ban hành. Do đó vẫn phải lưu trữ 05 năm.",
            "Phương án A sai vì không được hủy hồ sơ ngay sau quyết định hủy thầu.\n"
            "Phương án B sai vì không có quy định trả lại hồ sơ ngay và không lưu trữ khi hủy thầu.\n"
            "Phương án D sai vì thời hạn lưu trữ là 05 năm, không phải 03 năm.",
        ),
        "Khoản 4 Điều 9 VBHN Luật Đấu thầu",
    )

    q = by_stt[17]
    explanations[17] = (
        block(
            17,
            "A",
            q["options"][0],
            "Khoản 3 Điều 9 VBHN Luật Đấu thầu (ngân hàng cũ ghi “Điều 40” là nhầm; nội dung xử lý hủy hồ sơ đề xuất tài chính không nhận lại thuộc Điều 9).",
            "Khoản 1 Điều 9 quy định trả lại hồ sơ đề xuất tài chính không vượt qua bước kỹ thuật theo thời hạn tương ứng. Khoản 3: hết thời hạn mà nhà thầu không nhận lại thì chủ đầu tư xem xét, quyết định hủy hồ sơ nhưng phải bảo đảm thông tin không bị tiết lộ. Đây đúng với tình huống nhà thầu từ chối nhận lại hồ sơ.",
            "Phương án B sai vì Khoản 3 Điều 9 cho phép hủy hồ sơ (với điều kiện bảo mật), không bắt buộc lưu trữ theo pháp luật lưu trữ như hồ sơ hoàn công/quyết toán.\n"
            "Phương án C sai vì thời hạn lưu trữ tối thiểu 05 năm tại Khoản 6 Điều 9 áp dụng cho hồ sơ quá trình lựa chọn nhà thầu nói chung (trừ các Khoản 1, 2, 4, 5), không phải cách xử lý khi nhà thầu không nhận lại hồ sơ đề xuất tài chính.\n"
            "Phương án D sai vì phương án A đúng.",
        ),
        "Khoản 3 Điều 9 VBHN Luật Đấu thầu",
    )

    q = by_stt[18]
    explanations[18] = (
        block(
            18,
            "C",
            q["options"][2],
            "Khoản 5 Điều 9 VBHN Luật Đấu thầu (ngân hàng cũ ghi “Điều 44” là nhầm; Điều 44 là nội dung HSMT).",
            "Khoản 5 Điều 9: Hồ sơ quyết toán, hồ sơ hoàn công và tài liệu liên quan đến nhà thầu trúng thầu của gói thầu được lưu trữ theo quy định của pháp luật về lưu trữ.",
            "Phương án A sai vì không lưu trữ theo quy định nội bộ nhà thầu.\n"
            "Phương án B sai vì không lưu trữ theo quy định của tư vấn giám sát.\n"
            "Phương án D sai vì phương án C đúng.",
        ),
        "Khoản 5 Điều 9 VBHN Luật Đấu thầu",
    )

    q = by_stt[19]
    explanations[19] = (
        block(
            19,
            "C",
            q["options"][2],
            "Điểm b Khoản 1 Điều 9 VBHN Luật Đấu thầu (áp dụng với gói thầu xây lắp theo phương thức một giai đoạn hai túi hồ sơ; nội dung này cũng được thể hiện trong mẫu HSMT kèm theo Thông tư 79/2025/TT-BTC).",
            "Điểm b Khoản 1 Điều 9: đối với gói thầu cung cấp dịch vụ phi tư vấn, mua sắm hàng hóa, xây lắp, hỗn hợp áp dụng phương thức một giai đoạn hai túi hồ sơ, hồ sơ đề xuất tài chính của nhà thầu không vượt qua bước đánh giá kỹ thuật được trả lại khi hoàn trả hoặc giải tỏa bảo đảm dự thầu của nhà thầu không được lựa chọn hoặc khi đăng tải kết quả lựa chọn nhà thầu. Phương án C khớp quy định này.",
            "Phương án A sai vì thời Điểm gửi thư mời thương thảo không phải mốc trả hồ sơ đề xuất tài chính của nhà thầu không đạt kỹ thuật.\n"
            "Phương án B sai vì Luật không quy định trả ngay khi kết thúc đánh giá kỹ thuật.\n"
            "Phương án D sai vì thời Điểm ký hợp đồng không phải mốc trả hồ sơ theo Điểm b Khoản 1 Điều 9.",
        ),
        "Điểm b Khoản 1 Điều 9 VBHN Luật Đấu thầu",
    )

    q = by_stt[20]
    explanations[20] = (
        block(
            20,
            "A",
            q["options"][0],
            "Điểm b Khoản 1 Điều 15 VBHN Luật Đấu thầu.",
            "Điểm b Khoản 1 Điều 15: Hồ sơ mời thầu đối với đấu thầu quốc tế được phát hành trên Hệ thống mạng đấu thầu quốc gia; nhà thầu nộp tiền mua bản điện tử hồ sơ mời thầu khi nộp hồ sơ dự thầu. Phương án A đúng nguyên văn quy định.",
            "Phương án B sai vì không còn mô hình bán HSMT bản giấy theo giờ hành chính tại địa chỉ chủ đầu tư đối với đấu thầu quốc tế theo Điểm b Khoản 1 Điều 15.\n"
            "Phương án C sai vì B không đúng nên không thể A và B đều đúng.\n"
            "Phương án D sai vì A đúng.",
        ),
        "Điểm b Khoản 1 Điều 15 VBHN Luật Đấu thầu",
    )

    for stt, (expl, src) in explanations.items():
        by_stt[stt]["explanation"] = expl
        by_stt[stt]["source"] = src

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2), encoding="utf-8")
    filled = sum(1 for q in bank["questions"] if q["lot"] == 1 and q["explanation"])
    print(f"Lot1 filled: {filled}/20")


if __name__ == "__main__":
    main()
