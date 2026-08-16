# -*- coding: utf-8 -*-
"""Điền explanation Lô 15 (STT 281–300) theo mẫu 4 khối, căn cứ CSPL local."""
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

    q = by[281]
    ex[281] = (
        block(
            "B",
            q["options"][1],
            "Nghị định số 214/2025/NĐ-CP (tiêu chuẩn đánh giá về kỹ thuật theo phương pháp chấm điểm).",
            "Khi sử dụng phương pháp chấm điểm để xây dựng tiêu chuẩn đánh giá về kỹ thuật, mức điểm yêu cầu tối thiểu về kỹ thuật không được thấp hơn 70% tổng số điểm kỹ thuật. Đây là ngưỡng sàn tối thiểu bắt buộc theo NĐ 214.",
            "Phương án A sai vì 60% thấp hơn ngưỡng tối thiểu 70% theo quy định.\n"
            "Phương án C sai vì 80% cao hơn ngưỡng sàn, không phải mức tối thiểu bắt buộc.\n"
            "Phương án D sai vì 90% cũng cao hơn ngưỡng sàn, không phải quy định tối thiểu.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[282]
    ex[282] = (
        block(
            "C",
            q["options"][2],
            "Nghị định số 214/2025/NĐ-CP (phương pháp đánh giá E-HSDT đối với gói HH/XL/PTV/hỗn hợp).",
            "Phương pháp giá đánh giá được áp dụng đối với gói thầu mua sắm hàng hóa, xây lắp, phi tư vấn và hỗn hợp tổ chức theo hình thức đấu thầu rộng rãi, đấu thầu hạn chế và chào hàng cạnh tranh. Các hình thức chỉ định thầu, mua sắm trực tiếp không có cạnh tranh giá nên không áp dụng phương pháp này.",
            "Phương án A sai vì phương pháp giá đánh giá còn áp dụng cho đấu thầu hạn chế và chào hàng cạnh tranh, không chỉ đấu thầu rộng rãi.\n"
            "Phương án B sai vì chỉ định thầu và mua sắm trực tiếp không sử dụng phương pháp giá đánh giá.\n"
            "Phương án D sai vì không phải tất cả hình thức (chỉ định thầu, đặt hàng, MSTT… không áp dụng).",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[283]
    ex[283] = (
        block(
            "D",
            q["options"][3],
            "VBHN Luật Đấu thầu (điều kiện xét duyệt trúng thầu đối với gói thầu xây lắp và gói thầu tư vấn là tổ chức).",
            "Đối với gói thầu xây lắp, một trong các điều kiện xét duyệt trúng thầu là giá trị phần sai lệch thiếu không vượt quá 10% giá dự thầu. Điều kiện này không có trong quy định về xét duyệt trúng thầu đối với nhà thầu tư vấn là tổ chức, vì hồ sơ đề xuất tài chính tư vấn không tính sai lệch thiếu theo nghĩa xây lắp.",
            "Phương án A sai vì cả xây lắp lẫn tư vấn đều yêu cầu E-HSDT/hồ sơ đề xuất hợp lệ.\n"
            "Phương án B sai vì cả hai đều yêu cầu giá đề nghị trúng thầu không vượt giá gói thầu.\n"
            "Phương án C sai vì cả hai đều yêu cầu đề xuất kỹ thuật đáp ứng yêu cầu E-HSMT/hồ sơ yêu cầu.",
        ),
        "VBHN Luật Đấu thầu",
    )

    q = by[284]
    ex[284] = (
        block(
            "B",
            q["options"][1],
            "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP (thẩm quyền sửa đổi hợp đồng).",
            "Khi sửa đổi hợp đồng làm thay đổi thời gian thực hiện nhưng không vượt thời gian thực hiện dự án, hoặc vượt giá gói thầu (bao gồm dự phòng) đã duyệt nhưng không làm vượt tổng mức đầu tư, chủ đầu tư có thẩm quyền quyết định mà không cần trình người có thẩm quyền.",
            "Phương án A sai vì người có thẩm quyền chỉ quyết định khi vượt tổng mức đầu tư hoặc vượt giá gói thầu ngoài khung cho phép.\n"
            "Phương án C sai vì cơ quan quản lý cấp trên không có thẩm quyền quyết định sửa đổi hợp đồng trong tình huống này.\n"
            "Phương án D sai vì bên mời thầu không có thẩm quyền quyết định sửa đổi hợp đồng.",
        ),
        "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP",
    )

    q = by[285]
    ex[285] = (
        block(
            "B",
            q["options"][1],
            "VBHN Luật Đấu thầu (thời gian hiệu lực của bảo đảm thực hiện hợp đồng).",
            "Thời gian có hiệu lực của bảo đảm thực hiện hợp đồng được tính từ ngày hợp đồng có hiệu lực đến ngày các bên hoàn thành nghĩa vụ theo hợp đồng hoặc chuyển sang thực hiện nghĩa vụ bảo hành đối với trường hợp có quy định về bảo hành.",
            "Phương án A sai vì tính từ ngày ký hợp đồng và kết thúc tại ngày thanh toán cuối cùng là không đúng quy định.\n"
            "Phương án C sai vì bảo đảm thực hiện hợp đồng không tính từ ngày nộp hồ sơ dự thầu.\n"
            "Phương án D sai vì thời điểm bắt đầu là thông báo trúng thầu và kết thúc là hết bảo hành đều sai so với quy định.",
        ),
        "VBHN Luật Đấu thầu",
    )

    q = by[286]
    ex[286] = (
        block(
            "D",
            q["options"][3],
            "VBHN Luật Đấu thầu (hợp đồng theo thời gian – phạm vi áp dụng).",
            "Hợp đồng theo thời gian áp dụng trong cả ba trường hợp: (1) tình trạng khẩn cấp; (2) sửa chữa, bảo trì công trình, máy móc, thiết bị; (3) dịch vụ tư vấn khi khó xác định phạm vi và thời gian thực hiện dịch vụ. Phương án A, B, C đều đúng nên D là đáp án đầy đủ.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "VBHN Luật Đấu thầu",
    )

    q = by[287]
    ex[287] = (
        block(
            "B",
            q["options"][1],
            "VBHN Luật Đấu thầu (giá trị bảo đảm thực hiện hợp đồng).",
            "Giá trị bảo đảm thực hiện hợp đồng được xác định trên cơ sở giá hợp đồng, thường từ 2% đến 10% giá hợp đồng tùy tính chất gói thầu. Căn cứ là giá hợp đồng thực tế ký kết, không phải giá gói thầu hay giá dự thầu.",
            "Phương án A sai vì giá gói thầu là căn cứ xác định giá trị bảo đảm dự thầu, không phải bảo đảm thực hiện hợp đồng.\n"
            "Phương án C sai vì giá dự thầu của nhà thầu không phải căn cứ xác định bảo đảm thực hiện hợp đồng.\n"
            "Phương án D sai vì tổng mức đầu tư không phải căn cứ tính bảo đảm thực hiện hợp đồng.",
        ),
        "VBHN Luật Đấu thầu",
    )

    q = by[288]
    ex[288] = (
        block(
            "B",
            q["options"][1],
            "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP (thẩm quyền sửa đổi hợp đồng).",
            "Chủ đầu tư tự quyết định sửa đổi hợp đồng mà không cần người có thẩm quyền cho phép khi: thay đổi thời gian thực hiện hợp đồng nhưng không vượt thời gian thực hiện dự án HOẶC vượt giá gói thầu (bao gồm dự phòng) đã duyệt nhưng không làm vượt tổng mức đầu tư. Phương án B mô tả chính xác điều kiện này.",
            "Phương án A sai vì vượt giá gói và vượt tổng mức đầu tư đồng thời thì người có thẩm quyền phải quyết định.\n"
            "Phương án C sai vì vượt thời gian thực hiện dự án thì người có thẩm quyền mới quyết định.\n"
            "Phương án D sai vì thay đổi thiết kế cơ sở dẫn đến điều chỉnh chủ trương đầu tư cần người có thẩm quyền phê duyệt.",
        ),
        "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP",
    )

    q = by[289]
    ex[289] = (
        block(
            "B",
            q["options"][1],
            "VBHN Luật Đấu thầu (điều kiện không cần ký văn bản sửa đổi hợp đồng).",
            "Không phải ký văn bản sửa đổi hợp đồng khi thay đổi giá hợp đồng nếu đồng thời đáp ứng đủ ba điều kiện: (1) không vượt giá gói thầu; (2) không vượt thời gian thực hiện gói thầu ghi trong hợp đồng; (3) phương pháp, công thức, hạng mục và nội dung cần thiết để điều chỉnh đã được quy định trong hợp đồng.",
            "Phương án A sai vì cho phép vượt thời gian thực hiện gói thầu, vi phạm điều kiện (2).\n"
            "Phương án C sai vì cho phép vượt giá gói thầu, vi phạm điều kiện (1).\n"
            "Phương án D mô tả điều kiện về thẩm quyền chủ đầu tư sửa đổi hợp đồng, không phải điều kiện miễn ký văn bản sửa đổi.",
        ),
        "VBHN Luật Đấu thầu",
    )

    q = by[290]
    ex[290] = (
        block(
            "B",
            q["options"][1],
            "VBHN Luật Đấu thầu (phân biệt hợp đồng theo đơn giá cố định và đơn giá điều chỉnh).",
            "Điểm khác biệt chính: hợp đồng theo đơn giá cố định có đơn giá không thay đổi suốt quá trình thực hiện; hợp đồng theo đơn giá điều chỉnh có đơn giá có thể thay đổi theo công thức, chỉ số giá đã thỏa thuận khi giá cả thị trường biến động.",
            "Phương án A sai vì thời gian thực hiện không phải tiêu chí phân biệt; cả hai loại đều có thể áp dụng cho gói dài hoặc ngắn.\n"
            "Phương án C sai vì cả hai loại đều có thể có hoặc không có chi phí dự phòng; đây không phải điểm phân biệt.\n"
            "Phương án D sai vì cả hai loại không chỉ giới hạn cho tư vấn hay xây lắp.",
        ),
        "VBHN Luật Đấu thầu",
    )

    q = by[291]
    ex[291] = (
        block(
            "C",
            q["options"][2],
            "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP (thẩm quyền phê duyệt sửa đổi hợp đồng).",
            "Cả hai tình huống đều phải do người có thẩm quyền quyết định: (1) vượt giá gói 10% dù không vượt tổng mức đầu tư → người có thẩm quyền quyết định vì đã vượt giá gói thầu; (2) vượt giá gói 2% và làm tổng mức đầu tư tăng → người có thẩm quyền quyết định vì cả hai điều kiện cùng vi phạm. Chủ đầu tư chỉ tự quyết khi không vượt giá gói và không vượt tổng mức đầu tư.",
            "Phương án A sai vì cả hai tình huống đều vượt giá gói thầu nên người có thẩm quyền mới quyết định.\n"
            "Phương án B sai vì tình huống (1) cũng vượt giá gói thầu, không thể để chủ đầu tư tự quyết.\n"
            "Phương án D sai vì UBND tỉnh không có thẩm quyền đặc biệt riêng trong các trường hợp này.",
        ),
        "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP",
    )

    q = by[292]
    ex[292] = (
        block(
            "B",
            q["options"][1],
            "VBHN Luật Đấu thầu (hợp đồng theo chi phí cộng phí).",
            "Hợp đồng theo chi phí cộng phí áp dụng khi tại thời điểm lựa chọn nhà thầu chưa đủ cơ sở xác định phạm vi công việc, nhu cầu cần thiết về các yếu tố và chi phí đầu vào để thực hiện các công việc dự kiến của hợp đồng.",
            "Phương án A sai vì hợp đồng trọn gói áp dụng khi đã xác định rõ phạm vi, khối lượng và giá trọn gói cố định.\n"
            "Phương án C sai vì đơn giá cố định áp dụng khi xác định được đơn giá các hạng mục nhưng chưa xác định chính xác tổng khối lượng.\n"
            "Phương án D sai vì hợp đồng theo kết quả đầu ra áp dụng khi có thể xác định rõ sản phẩm/kết quả đầu ra cụ thể.",
        ),
        "VBHN Luật Đấu thầu",
    )

    q = by[293]
    ex[293] = (
        block(
            "C",
            q["options"][2],
            "Nghị định số 214/2025/NĐ-CP (điều chỉnh kế hoạch lựa chọn nhà thầu do thay đổi thời gian thực hiện hợp đồng).",
            "Trường hợp thời gian thực hiện hợp đồng thay đổi (kéo dài từ 120 lên 180 ngày) nhưng không làm thay đổi các nội dung khác của kế hoạch lựa chọn nhà thầu đã duyệt (giá gói thầu, hình thức lựa chọn, nguồn vốn…), chủ đầu tư không cần điều chỉnh kế hoạch lựa chọn nhà thầu.",
            "Phương án A sai vì không cần báo cáo người có thẩm quyền trước khi điều chỉnh thời gian thực hiện gói thầu trong trường hợp này.\n"
            "Phương án B sai vì thay đổi thời gian thực hiện hợp đồng không thuộc trường hợp phải điều chỉnh kế hoạch lựa chọn nhà thầu.\n"
            "Phương án D sai vì C đúng theo quy định của Nghị định số 214/2025/NĐ-CP.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[294]
    ex[294] = (
        block(
            "C",
            q["options"][2],
            "Khoản 4 Điều 100 Nghị định số 214/2025/NĐ-CP (chào giá trực tuyến rút gọn – phê duyệt kết quả lựa chọn nhà thầu).",
            "Đối với gói thầu áp dụng chào giá trực tuyến rút gọn, việc phê duyệt kết quả lựa chọn nhà thầu thực hiện trên cơ sở chấp thuận được trao hợp đồng của nhà thầu xếp thứ nhất. Quy trình rút gọn không có bước lập báo cáo của tổ chuyên gia hay thẩm định kết quả như quy trình thông thường.",
            "Phương án A sai vì chào giá trực tuyến rút gọn không có tổ chuyên gia lập báo cáo đề nghị.\n"
            "Phương án B sai vì không cần tổ thẩm định trong quy trình rút gọn.\n"
            "Phương án D sai vì A và B đều không đúng.",
        ),
        "Khoản 4 Điều 100 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[295]
    ex[295] = (
        block(
            "C",
            q["options"][2],
            "Khoản 4 Điều 100 Nghị định số 214/2025/NĐ-CP (chào giá trực tuyến rút gọn – xét duyệt trúng thầu).",
            "Trong chào giá trực tuyến rút gọn, xét duyệt trúng thầu căn cứ vào giá dự thầu tại thời điểm kết thúc chào giá trực tuyến của nhà thầu xếp thứ nhất (nhà thầu có giá thấp nhất, hoặc chào đầu tiên nếu hòa giá). Đây không phải giá trong đơn dự thầu ban đầu hay giá gói thầu.",
            "Phương án A sai vì giá trong đơn dự thầu ban đầu có thể khác giá tại thời điểm kết thúc chào giá trực tuyến.\n"
            "Phương án B sai vì giá gói thầu trong kế hoạch lựa chọn nhà thầu là giá trần, không phải căn cứ xét duyệt trúng thầu.\n"
            "Phương án D sai vì C đúng theo quy định.",
        ),
        "Khoản 4 Điều 100 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[296]
    by[296]["answer"] = 3  # CRITICAL FIX: đổi từ A (0) sang D (3)
    ex[296] = (
        block(
            "D",
            q["options"][3],
            "Điều 103 Nghị định số 214/2025/NĐ-CP (mua sắm trực tuyến – điều kiện áp dụng và phê duyệt).",
            "Theo Điều 103 NĐ 214, mua sắm trực tuyến PHẢI được phê duyệt trong kế hoạch lựa chọn nhà thầu — bác bỏ phương án A (nói 'không cần phê duyệt'). Phạm vi áp dụng là hàng hóa, dịch vụ (không giới hạn chỉ 'dịch vụ tư vấn' như B và C nêu). Ngưỡng giá gói thầu 500 triệu đồng đúng cho dự toán mua sắm nhưng phương án B xác định sai phạm vi dịch vụ; phương án C sai cả phạm vi dịch vụ lẫn ngưỡng giá trị (nêu 01 tỷ). Do A, B, C đều có nội dung không chính xác → D.",
            "Phương án A sai vì mua sắm trực tuyến phải được phê duyệt trong kế hoạch lựa chọn nhà thầu theo Điều 103 NĐ 214.\n"
            "Phương án B sai vì giới hạn phạm vi là 'dịch vụ tư vấn' không đúng quy định (phải là 'hàng hóa, dịch vụ').\n"
            "Phương án C sai vì xác định sai cả phạm vi dịch vụ lẫn ngưỡng giá trị (01 tỷ không phải ngưỡng đúng).",
        ),
        "Điều 103 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[297]
    ex[297] = (
        block(
            "A",
            q["options"][0],
            "VBHN Luật Đấu thầu (ưu đãi nhà thầu có sử dụng lao động đặc thù – gói thầu dưới 500 triệu đồng).",
            "Đối với gói thầu thuộc dự toán mua sắm có giá dưới 500 triệu đồng, chủ đầu tư được quyết định cho phép tham dự thầu nhà thầu có từ 50% lao động trở lên là người khuyết tật, thương binh, dân tộc thiểu số và có hợp đồng lao động thời hạn từ 03 tháng trở lên còn hiệu lực tại thời điểm đóng thầu.",
            "Phương án B sai vì ngưỡng tỷ lệ lao động là 50%, không phải 25%.\n"
            "Phương án C sai vì hợp đồng lao động phải từ 03 tháng trở lên, không phải dưới 03 tháng.\n"
            "Phương án D sai vì kết hợp sai cả tỷ lệ (25%) lẫn thời hạn hợp đồng lao động (dưới 03 tháng).",
        ),
        "VBHN Luật Đấu thầu",
    )

    q = by[298]
    ex[298] = (
        block(
            "D",
            q["options"][3],
            "Khoản 1 Điều 5 VBHN Luật Đấu thầu (tư cách hợp lệ của nhà thầu).",
            "Nhà thầu A không đủ tư cách hợp lệ khi: (A) sử dụng tài khoản của chi nhánh B — chi nhánh không phải pháp nhân độc lập, không được mở tài khoản hệ thống riêng để dự thầu thay cho nhà thầu; (C) sử dụng tài khoản của công ty con hạch toán phụ thuộc C — đơn vị hạch toán phụ thuộc không có tư cách pháp lý độc lập để tham dự thầu. Cả A và C đều đúng → D.",
            "Phương án A đúng nhưng chưa đủ (còn phương án C cũng đúng).\n"
            "Phương án B là trường hợp hợp lệ (nhà thầu A sử dụng chính tài khoản của mình).\n"
            "Phương án C đúng nhưng chưa đủ (còn phương án A cũng đúng).",
        ),
        "Khoản 1 Điều 5 VBHN Luật Đấu thầu",
    )

    q = by[299]
    ex[299] = (
        block(
            "A",
            q["options"][0],
            "Thông tư số 79/2025/TT-BTC (hàng mẫu trong đấu thầu qua mạng).",
            "Đối với gói thầu mua sắm hàng hóa có yêu cầu cung cấp hàng mẫu, nhà thầu có thể nộp bổ sung hàng mẫu trong thời hạn 05 ngày làm việc sau thời điểm đóng thầu. Đây là thời hạn nộp bổ sung, không phải thời hạn nộp ngay lúc nộp E-HSDT.",
            "Phương án B sai vì không bắt buộc nộp hàng mẫu ngay sau khi nộp thành công E-HSDT.\n"
            "Phương án C sai vì đơn vị thời gian là ngày làm việc, không phải ngày thông thường (05 ngày ≠ 05 ngày làm việc).\n"
            "Phương án D sai vì A đúng theo quy định.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    q = by[300]
    ex[300] = (
        block(
            "A",
            q["options"][0],
            "Nghị định số 214/2025/NĐ-CP (biên bản mở thầu đối với đấu thầu không qua mạng).",
            "Biên bản mở thầu đối với đấu thầu không qua mạng bắt buộc phải có chữ ký của: chủ đầu tư, tổ chuyên gia và các nhà thầu tham dự lễ mở thầu. Lưu ý: chỉ các nhà thầu thực tế có mặt tại lễ mở thầu mới ký, không phải tất cả nhà thầu đã nộp hồ sơ dự thầu.",
            "Phương án B sai vì 'các nhà thầu tham dự thầu' bao gồm cả những nhà thầu không đến lễ mở thầu, không đúng quy định.\n"
            "Phương án C sai vì thiếu chữ ký của tổ chuyên gia.\n"
            "Phương án D sai vì B và C đều không đúng.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Lot15 filled: {filled}/20")


if __name__ == "__main__":
    main()
