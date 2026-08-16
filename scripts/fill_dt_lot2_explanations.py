# -*- coding: utf-8 -*-
"""Điền explanation Lô 2 (STT 21–40) theo mẫu 4 khối."""
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
    by_stt = {q["stt"]: q for q in bank["questions"]}
    ex: dict[int, tuple[str, str]] = {}

    q = by_stt[21]
    ex[21] = (
        block(
            "B",
            q["options"][1],
            "Khoản 1 Điều 14 Nghị định số 214/2025/NĐ-CP.",
            "Khoản 1 Điều 14 Nghị định 214 quy định: đối với gói thầu sử dụng vốn ngân sách nhà nước, tiền bán bản điện tử hồ sơ mời thầu, hồ sơ yêu cầu được chủ đầu tư nộp vào ngân sách nhà nước theo quy định của Luật Ngân sách nhà nước.",
            "Phương án A sai vì cơ chế tài chính nội bộ của chủ đầu tư chỉ áp dụng khi gói thầu không sử dụng vốn ngân sách nhà nước (cùng Khoản 1 Điều 14).\n"
            "Phương án C sai vì không có quy định xử lý tiền bán hồ sơ theo cơ chế khoán chi trong trường hợp dùng vốn ngân sách nhà nước.\n"
            "Phương án D sai vì phương án B đúng.",
        ),
        "Khoản 1 Điều 14 Nghị định số 214/2025/NĐ-CP",
    )

    q = by_stt[22]
    ex[22] = (
        block(
            "C",
            q["options"][2],
            "Điều 7 và Khoản 1 Điều 8 VBHN Luật Đấu thầu; Khoản 9 Điều 14 Nghị định số 214/2025/NĐ-CP (biểu phí trên Hệ thống).",
            "Điều 7 và Khoản 1 Điều 8 Luật Đấu thầu quy định trách nhiệm đăng tải thông tin về kế hoạch lựa chọn nhà thầu và kết quả lựa chọn nhà thầu trên Hệ thống mạng đấu thầu quốc gia. Khoản 9 Điều 14 Nghị định 214 liệt kê các khoản phí thu trên Hệ thống (duy trì hồ sơ năng lực, nộp hồ sơ dự thầu, phí nhà thầu trúng thầu…) nhưng không quy định thu phí đăng tải quyết định phê duyệt kế hoạch/kết quả lựa chọn nhà thầu đối với gói thầu chỉ định thầu. Do đó việc đăng tải các quyết định này là miễn phí.",
            "Phương án A sai vì 220.000 đồng là mức phí nộp hồ sơ dự thầu đối với chào hàng cạnh tranh (Khoản 9 Điều 14 Nghị định 214), không phải phí đăng tải quyết định chỉ định thầu.\n"
            "Phương án B sai vì 330.000 đồng gắn với phí duy trì hồ sơ năng lực hoặc nộp hồ sơ dự thầu với một số hình thức khác, không phải phí đăng tải quyết định chỉ định thầu.\n"
            "Phương án D sai vì không có mức 110.000 đồng cho nội dung đăng tải nêu trong câu hỏi.",
        ),
        "Điều 7 và Khoản 1 Điều 8 VBHN Luật Đấu thầu; Khoản 9 Điều 14 Nghị định số 214/2025/NĐ-CP",
    )

    q = by_stt[23]
    ex[23] = (
        block(
            "C",
            q["options"][2],
            "Khoản 3 Điều 19 VBHN Luật Đấu thầu; Điểm d Khoản 1 Điều 21 Nghị định số 214/2025/NĐ-CP.",
            "Khoản 3 Điều 19 Luật Đấu thầu quy định thành viên tổ chuyên gia, tổ thẩm định phải có tối thiểu 03 năm công tác thuộc một trong các lĩnh vực liên quan đến nội dung pháp lý, kỹ thuật, tài chính của gói thầu. Điểm d Khoản 1 Điều 21 Nghị định 214 cụ thể hóa yêu cầu tối thiểu 03 năm công tác tương ứng. Quy định này áp dụng cả khi thành viên thuộc tổ chức tư vấn đấu thầu.",
            "Phương án A sai vì không đủ 03 năm theo quy định.\n"
            "Phương án B sai vì không đủ 03 năm theo quy định.\n"
            "Phương án D sai vì Luật và Nghị định đều có quy định về số năm kinh nghiệm tối thiểu.",
        ),
        "Khoản 3 Điều 19 VBHN Luật Đấu thầu; Điểm d Khoản 1 Điều 21 Nghị định số 214/2025/NĐ-CP",
    )

    q = by_stt[24]
    ex[24] = (
        block(
            "C",
            q["options"][2],
            "Điểm d Khoản 7 Điều 3 VBHN Luật Đấu thầu.",
            "Khi đơn vị sự nghiệp công lập A đã trúng thầu và tự bảo đảm chi thường xuyên (không sử dụng ngân sách nhà nước cho phần mua sắm hậu cần phục vụ thực hiện hợp đồng đào tạo), Điểm d Khoản 7 Điều 3 cho phép tự quyết định việc mua sắm trên cơ sở công khai, minh bạch, hiệu quả và trách nhiệm giải trình, không bắt buộc tổ chức lựa chọn nhà thầu theo toàn bộ quy trình Luật Đấu thầu cho các dịch vụ hậu cần nêu trong tình huống.",
            "Phương án A sai vì không thuộc trường hợp bắt buộc áp dụng toàn bộ Luật theo Khoản 1 Điều 2 khi đã thuộc Điểm d Khoản 7 Điều 3.\n"
            "Phương án B sai vì hợp đồng với UBND tỉnh không thay thế quy định về đối tượng tự quyết định mua sắm tại Điểm d Khoản 7 Điều 3.\n"
            "Phương án D sai vì phân cấp mua sắm của UBND tỉnh không làm thay đổi quyền tự quyết định theo Điểm d Khoản 7 Điều 3 đối với trường hợp này.",
        ),
        "Điểm d Khoản 7 Điều 3 VBHN Luật Đấu thầu",
    )

    q = by_stt[25]
    ex[25] = (
        block(
            "A",
            q["options"][0],
            "Điểm a Khoản 7 Điều 3 VBHN Luật Đấu thầu.",
            "Điểm a Khoản 7 Điều 3 cho phép tự quyết định việc mua sắm khi lựa chọn nhà thầu thực hiện gói thầu sử dụng vốn do tổ chức, cá nhân trong nước tài trợ mà nhà tài trợ yêu cầu không lựa chọn nhà thầu theo quy định của Luật này, trên cơ sở bảo đảm công khai, minh bạch, hiệu quả và trách nhiệm giải trình. Phương án A khớp đúng điều kiện này.",
            "Phương án B sai vì bỏ qua trường hợp ngoại lệ tại Điểm a Khoản 7 Điều 3 khi nhà tài trợ yêu cầu không áp dụng Luật Đấu thầu.\n"
            "Phương án C sai vì không phải mọi trường hợp vốn tài trợ trong nước đều được miễn Luật; chỉ khi nhà tài trợ yêu cầu không lựa chọn nhà thầu theo Luật.\n"
            "Phương án D sai vì Luật đã quy định rõ điều kiện tại Điểm a Khoản 7 Điều 3, không bắt buộc xin ý kiến UBND tỉnh để xác định lại.",
        ),
        "Điểm a Khoản 7 Điều 3 VBHN Luật Đấu thầu",
    )

    q = by_stt[26]
    ex[26] = (
        block(
            "A",
            q["options"][0],
            "Điểm a Khoản 1 Điều 9 VBHN Luật Đấu thầu.",
            "Điểm a Khoản 1 Điều 9: đối với gói thầu cung cấp dịch vụ tư vấn, hồ sơ đề xuất về tài chính của nhà thầu không vượt qua bước đánh giá kỹ thuật được trả lại nguyên trạng trong thời hạn 10 ngày kể từ ngày ký hợp đồng với nhà thầu được lựa chọn.",
            "Phương án B sai vì thời hạn không phải 05 ngày.\n"
            "Phương án C sai vì thời hạn không phải 15 ngày.\n"
            "Phương án D sai vì đây là hồ sơ phải trả lại theo Khoản 1 Điều 9, không áp dụng lưu trữ theo pháp luật lưu trữ như hồ sơ hoàn công/quyết toán (Khoản 5 Điều 9).",
        ),
        "Điểm a Khoản 1 Điều 9 VBHN Luật Đấu thầu",
    )

    q = by_stt[27]
    ex[27] = (
        block(
            "C",
            q["options"][2],
            "Khoản 1 Điều 9 VBHN Luật Đấu thầu.",
            "Khoản 1 Điều 9 bắt buộc trả lại nguyên trạng hồ sơ đề xuất tài chính của nhà thầu không đạt kỹ thuật theo thời hạn quy định. Việc giữ lại quá thời hạn là không đúng nghĩa vụ xử lý hồ sơ và có thể phát sinh khiếu nại/kiến nghị từ nhà thầu về quyền được nhận lại hồ sơ.",
            "Phương án A sai vì Luật không cho phép giữ hồ sơ tài chính của nhà thầu không đạt kỹ thuật làm cơ sở đánh giá lại ngoài thời hạn trả lại.\n"
            "Phương án B sai vì giữ lại quá hạn không phải biện pháp bảo đảm trách nhiệm của chủ đầu tư; trái lại là không thực hiện đúng nghĩa vụ trả hồ sơ.\n"
            "Phương án D sai vì A và B đều không đúng.",
        ),
        "Khoản 1 Điều 9 VBHN Luật Đấu thầu",
    )

    q = by_stt[28]
    ex[28] = (
        block(
            "C",
            q["options"][2],
            "Điều 6 VBHN Luật Đấu thầu (đặc biệt Khoản 2 và Khoản 4).",
            "Điều 6 yêu cầu nhà thầu tham dự thầu độc lập về pháp lý và tài chính với nhà thầu tư vấn lập hồ sơ mời thầu, tư vấn thiết kế… theo các ngưỡng sở hữu vốn. Ở phương án C, công ty B chỉ sử dụng nhà thầu phụ là tư vấn C; C sở hữu 30% cổ phần của công ty A (tư vấn thiết kế kỹ thuật dự án Y). Bản thân B không thuộc các trường hợp bị coi là không độc lập với tư vấn lập HSMT/thiết kế theo Điểm d Khoản 4 Điều 6 theo đúng tình huống đề bài, nên vẫn đáp ứng bảo đảm cạnh tranh.",
            "Phương án A sai vì nhà thầu phụ A chính là tư vấn lập Chương V yêu cầu kỹ thuật của E-HSMT gói thầu → vi phạm độc lập với tư vấn lập hồ sơ mời thầu (Khoản 2 Điều 6).\n"
            "Phương án B sai vì Công ty B vừa tham dự thầu vừa là tư vấn lập Chương V E-HSMT → không độc lập.\n"
            "Phương án D sai vì tư vấn lập HSMT sở hữu 30% vốn góp của nhà thầu B → vi phạm điều kiện độc lập về tài chính giữa nhà thầu và tư vấn (Khoản 4 Điều 6).",
        ),
        "Điều 6 VBHN Luật Đấu thầu",
    )

    q = by_stt[29]
    ex[29] = (
        block(
            "A",
            q["options"][0],
            "Khoản 4 Điều 11 VBHN Luật Đấu thầu; Khoản 2 Điều 67 VBHN Luật Đấu thầu.",
            "Khoản 4 Điều 11 cho phép, đối với đấu thầu trong nước thuộc lĩnh vực khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số, nhà thầu trong nước được sử dụng nhà thầu phụ hoặc nhà thầu phụ đặc biệt là nhà thầu nước ngoài cho phần công việc đặc thù chưa thực hiện được hoặc cần chuyển giao công nghệ. Đồng thời, Khoản 2 Điều 67 quy định giá trị công việc tối đa dành cho nhà thầu phụ không bao gồm khối lượng công việc dành cho nhà thầu phụ đặc biệt.",
            "Phương án B sai vì Khoản 4 Điều 11 cho phép ngoại lệ dùng nhà thầu phụ/nhà thầu phụ đặc biệt nước ngoài trong lĩnh vực nêu trên.\n"
            "Phương án C sai vì giá trị tối đa dành cho nhà thầu phụ không bao gồm khối lượng dành cho nhà thầu phụ đặc biệt.\n"
            "Phương án D sai vì C không đúng nên không thể A và C đều đúng.",
        ),
        "Khoản 4 Điều 11 VBHN Luật Đấu thầu",
    )

    q = by_stt[30]
    ex[30] = (
        block(
            "A",
            q["options"][0],
            "Khoản 1 Điều 18 Thông tư số 79/2025/TT-BTC.",
            "Khoản 1 Điều 18 Thông tư 79: hồ sơ mời thầu được phê duyệt trên Hệ thống; đối với lựa chọn nhà thầu không qua mạng, hồ sơ mời thầu được phát hành trên Hệ thống ngay sau khi đăng tải thành công thông báo mời thầu. Chủ đầu tư không được phát hành hồ sơ mời thầu bản giấy (bản giấy không có giá trị pháp lý để lập, đánh giá hồ sơ dự thầu).",
            "Phương án B sai vì không được phát hành bản giấy có giá trị pháp lý.\n"
            "Phương án C sai vì không phê duyệt/phát hành theo hình thức bản giấy.\n"
            "Phương án D sai vì chỉ phương án A đúng.",
        ),
        "Khoản 1 Điều 18 Thông tư số 79/2025/TT-BTC",
    )

    q = by_stt[31]
    ex[31] = (
        block(
            "B",
            q["options"][1],
            "Khoản 1 Điều 24 VBHN Luật Đấu thầu; Điều 81 Nghị định số 214/2025/NĐ-CP.",
            "Khoản 1 Điều 24 Luật Đấu thầu xác định các loại gói thầu được chào hàng cạnh tranh (phi tư vấn thông dụng đơn giản; hàng hóa thông dụng sẵn có; xây lắp đơn giản đã có thiết kế bản vẽ thi công…). Điều 81 Nghị định 214 quy định hạn mức giá gói thầu không quá 10 tỷ đồng. Do đó gói thầu dịch vụ phi tư vấn thông dụng, đơn giản không quá 10 tỷ đồng thuộc trường hợp được áp dụng chào hàng cạnh tranh.",
            "Phương án A sai vì không phải mọi gói mua sắm hàng hóa ≤ 10 tỷ đều được chào hàng cạnh tranh; phải là hàng hóa thông dụng, sẵn có, đặc tính kỹ thuật tiêu chuẩn hóa theo Điểm b Khoản 1 Điều 24.\n"
            "Phương án C sai vì dịch vụ tư vấn không thuộc đối tượng chào hàng cạnh tranh tại Khoản 1 Điều 24.\n"
            "Phương án D sai vì xây lắp chào hàng cạnh tranh yêu cầu đã có thiết kế bản vẽ thi công được phê duyệt và hạn mức theo Nghị định 214 là không quá 10 tỷ đồng, không phải 15 tỷ đồng theo phương án.",
        ),
        "Khoản 1 Điều 24 VBHN Luật Đấu thầu; Điều 81 Nghị định số 214/2025/NĐ-CP",
    )

    q = by_stt[32]
    ex[32] = (
        block(
            "B",
            q["options"][1],
            "Điều 24 VBHN Luật Đấu thầu; Điều 81 Nghị định số 214/2025/NĐ-CP; Điều 21 VBHN Luật Đấu thầu.",
            "Gói thầu mua sắm hàng hóa thông dụng, sẵn có trên thị trường giá 05 tỷ đồng thuộc trường hợp được chào hàng cạnh tranh (Điều 24 Luật và hạn mức ≤ 10 tỷ đồng tại Điều 81 Nghị định 214). Đồng thời, đấu thầu rộng rãi không bị hạn mức tối thiểu (Điều 21), nên kế hoạch lựa chọn nhà thầu có thể phê duyệt chào hàng cạnh tranh hoặc đấu thầu rộng rãi.",
            "Phương án A sai vì không bắt buộc chỉ được chào hàng cạnh tranh.\n"
            "Phương án C sai vì không thuộc trường hợp bắt buộc chỉ định thầu.\n"
            "Phương án D sai vì không được mặc định chỉ định thầu chỉ vì giá 05 tỷ; chỉ định thầu còn phải thuộc trường hợp/hạn mức riêng tại Điều 78 Nghị định 214.",
        ),
        "Điều 24 và Điều 21 VBHN Luật Đấu thầu; Điều 81 Nghị định số 214/2025/NĐ-CP",
    )

    q = by_stt[33]
    ex[33] = (
        block(
            "A",
            q["options"][0],
            "Khoản 4 Điều 78 Nghị định số 214/2025/NĐ-CP.",
            "Khoản 4 Điều 78 Nghị định 214: gói thầu thuộc dự toán mua sắm không hình thành dự án có giá gói thầu không quá 500 triệu đồng được áp dụng chỉ định thầu theo hạn mức. Đây đúng với tình huống gói thầu không hình thành dự án thuộc dự toán mua sắm thường xuyên.",
            "Phương án B sai vì 800 triệu đồng là hạn mức chỉ định thầu đối với gói thầu dịch vụ tư vấn thuộc dự án.\n"
            "Phương án C sai vì không phải hạn mức 01 tỷ đồng cho trường hợp này.\n"
            "Phương án D sai vì không phải 300 triệu đồng theo Khoản 4 Điều 78.",
        ),
        "Khoản 4 Điều 78 Nghị định số 214/2025/NĐ-CP",
    )

    q = by_stt[34]
    ex[34] = (
        block(
            "D",
            q["options"][3],
            "Khoản 4 Điều 78 Nghị định số 214/2025/NĐ-CP.",
            "Khoản 4 Điều 78 Nghị định 214: gói thầu dịch vụ phi tư vấn, hàng hóa, xây lắp, hỗn hợp thuộc dự án có giá gói thầu không quá 02 tỷ đồng thuộc hạn mức chỉ định thầu. Do đó hạn mức chỉ định thầu đối với gói thầu mua sắm hàng hóa thuộc dự án đầu tư là 02 tỷ đồng.",
            "Phương án A sai vì 800 triệu đồng là hạn mức gói tư vấn thuộc dự án.\n"
            "Phương án B sai vì 500 triệu đồng là hạn mức gói thuộc dự toán mua sắm không hình thành dự án.\n"
            "Phương án C sai vì không phải 01 tỷ đồng theo Khoản 4 Điều 78.",
        ),
        "Khoản 4 Điều 78 Nghị định số 214/2025/NĐ-CP",
    )

    q = by_stt[35]
    ex[35] = (
        block(
            "D",
            q["options"][3],
            "Khoản 1 Điều 20 VBHN Luật Đấu thầu.",
            "Khoản 1 Điều 20 liệt kê các hình thức lựa chọn nhà thầu (chỉ định thầu, lựa chọn trong trường hợp đặc biệt, đặt hàng, mua sắm trực tiếp; đấu thầu rộng rãi, chào hàng cạnh tranh, đấu thầu hạn chế; tự thực hiện, tham gia của cộng đồng, đàm phán giá). “Đấu thầu qua mạng” là phương thức tổ chức trên Hệ thống mạng đấu thầu quốc gia, không phải một hình thức lựa chọn nhà thầu được phê duyệt trong kế hoạch lựa chọn nhà thầu.",
            "Phương án A sai vì đấu thầu rộng rãi là hình thức tại Điểm b Khoản 1 Điều 20.\n"
            "Phương án B sai vì đấu thầu hạn chế là hình thức tại Điểm b Khoản 1 Điều 20.\n"
            "Phương án C sai vì mua sắm trực tiếp là hình thức tại Điểm a Khoản 1 Điều 20.",
        ),
        "Khoản 1 Điều 20 VBHN Luật Đấu thầu",
    )

    q = by_stt[36]
    ex[36] = (
        block(
            "B",
            q["options"][1],
            "Khoản 4 Điều 78 Nghị định số 214/2025/NĐ-CP; Điều 21 và Điều 24 VBHN Luật Đấu thầu.",
            "Gói tư vấn tổ chức giá 500 triệu đồng thuộc dự án nằm trong hạn mức chỉ định thầu đối với dịch vụ tư vấn thuộc dự án (không quá 800 triệu đồng) theo Khoản 4 Điều 78 Nghị định 214, nên được chỉ định thầu. Đồng thời có thể áp dụng đấu thầu rộng rãi (Điều 21, không hạn mức). Không áp dụng chào hàng cạnh tranh vì Điều 24 không bao gồm dịch vụ tư vấn.",
            "Phương án A sai vì không bắt buộc chỉ định thầu; vẫn được chọn đấu thầu rộng rãi.\n"
            "Phương án C sai vì chào hàng cạnh tranh không áp dụng cho gói tư vấn.\n"
            "Phương án D sai vì có chào hàng cạnh tranh là không đúng đối với tư vấn.",
        ),
        "Khoản 4 Điều 78 Nghị định số 214/2025/NĐ-CP; Điều 21 và Điều 24 VBHN Luật Đấu thầu",
    )

    q = by_stt[37]
    ex[37] = (
        block(
            "A",
            q["options"][0],
            "Điều 21 VBHN Luật Đấu thầu.",
            "Điều 21 định nghĩa đấu thầu rộng rãi là hình thức không hạn chế số lượng nhà thầu tham dự; không quy định hạn mức giá gói thầu tối thiểu hay tối đa để được áp dụng. Do đó không có hạn mức áp dụng đối với đấu thầu rộng rãi.",
            "Phương án B sai vì Luật không quy định ngưỡng trên 20 tỷ đồng.\n"
            "Phương án C sai vì Luật không quy định ngưỡng trên 10 tỷ đồng.\n"
            "Phương án D sai vì các ngưỡng nêu là nhầm với hạn mức của hình thức khác (chào hàng cạnh tranh/chỉ định thầu), không phải hạn mức đấu thầu rộng rãi.",
        ),
        "Điều 21 VBHN Luật Đấu thầu",
    )

    q = by_stt[38]
    ex[38] = (
        block(
            "A",
            q["options"][0],
            "Khoản 1 Điều 25 VBHN Luật Đấu thầu.",
            "Khoản 1 Điều 25: mua sắm trực tiếp được áp dụng đối với gói thầu mua sắm hàng hóa tương tự thuộc dự án, dự toán mua sắm… Do đó hình thức này chỉ áp dụng cho gói thầu mua sắm hàng hóa.",
            "Phương án B sai vì không áp dụng mua sắm trực tiếp cho xây lắp theo Điều 25.\n"
            "Phương án C sai vì không áp dụng cho dịch vụ phi tư vấn theo Điều 25.\n"
            "Phương án D sai vì không bao gồm dịch vụ phi tư vấn.",
        ),
        "Khoản 1 Điều 25 VBHN Luật Đấu thầu",
    )

    q = by_stt[39]
    ex[39] = (
        block(
            "D",
            q["options"][3],
            "Điểm b Khoản 2 Điều 25 VBHN Luật Đấu thầu.",
            "Điểm b Khoản 2 Điều 25 quy định chủ đầu tư chỉ được áp dụng mua sắm trực tiếp một lần đối với các loại hàng hóa thuộc gói thầu (với giới hạn khối lượng từng hạng mục). Vì vậy phương án “được áp dụng mua sắm trực tiếp nhiều lần” không phải điều kiện để áp dụng hình thức này – đây là nội dung sai.",
            "Phương án A đúng với Điểm a Khoản 2 Điều 25 (đã trúng thầu rộng rãi/hạn chế và đã ký hợp đồng trước đó).\n"
            "Phương án B đúng với Điểm d Khoản 2 Điều 25 (không quá 12 tháng).\n"
            "Phương án C đúng với Điểm c Khoản 2 Điều 25 (đơn giá không vượt và phù hợp giá thị trường).",
        ),
        "Điểm b Khoản 2 Điều 25 VBHN Luật Đấu thầu",
    )

    q = by_stt[40]
    ex[40] = (
        block(
            "A",
            q["options"][0],
            "Khoản 1 Điều 20 và Điều 29a VBHN Luật Đấu thầu.",
            "Khoản 1 Điều 20 liệt kê đặt hàng là một trong các hình thức lựa chọn nhà thầu. Điều 29a quy định chi tiết về đặt hàng. Do đó phương án A đúng.",
            "Phương án B sai vì Điều 29a quy định: hàng hóa, dịch vụ đặt hàng theo pháp luật quản lý ngành, lĩnh vực thì thực hiện theo pháp luật đó; chỉ khi pháp luật ngành, lĩnh vực không quy định quy trình, thủ tục thì mới áp dụng pháp luật về đấu thầu.\n"
            "Phương án C sai vì đặt hàng không chỉ cho sản phẩm, dịch vụ công mà còn các trường hợp tại các Điểm b, c, d Khoản 1 Điều 29a.\n"
            "Phương án D sai vì Luật không giới hạn đặt hàng chỉ với nguồn chi thường xuyên ngân sách nhà nước.",
        ),
        "Khoản 1 Điều 20 và Điều 29a VBHN Luật Đấu thầu",
    )

    for stt, (expl, src) in ex.items():
        by_stt[stt]["explanation"] = expl
        by_stt[stt]["source"] = src

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2), encoding="utf-8")
    filled = sum(1 for q in bank["questions"] if q["lot"] == 2 and q["explanation"])
    print(f"Lot2 filled: {filled}/20")


if __name__ == "__main__":
    main()
