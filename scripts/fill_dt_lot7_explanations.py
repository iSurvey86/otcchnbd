# -*- coding: utf-8 -*-
"""Điền explanation Lô 7 (STT 121–140) theo mẫu 4 khối, căn cứ CSPL local."""
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

    q = by[121]
    ex[121] = (
        block(
            "A",
            q["options"][0],
            "Khoản 6 Điều 68 VBHN Luật Đấu thầu.",
            "Nhà thầu không được hoàn trả bảo đảm thực hiện hợp đồng khi: từ chối thực hiện hợp đồng khi hợp đồng đã có hiệu lực; vi phạm thỏa thuận trong hợp đồng; hoặc chậm tiến độ do lỗi của nhà thầu nhưng từ chối gia hạn hiệu lực của bảo đảm thực hiện hợp đồng. Phương án A khớp đúng điểm a Khoản 6.",
            "Phương án B sai vì chậm tiến độ nhưng vẫn hoàn thành chưa đủ để tịch thu bảo đảm theo Khoản 6 (trừ khi từ chối gia hạn bảo đảm).\n"
            "Phương án C sai vì điều chỉnh tiến độ do bất khả kháng không thuộc trường hợp không hoàn trả.\n"
            "Phương án D sai vì đề xuất thay đổi nhà thầu phụ không phải trường hợp tịch thu bảo đảm thực hiện hợp đồng theo Khoản 6.",
        ),
        "Khoản 6 Điều 68 VBHN Luật Đấu thầu",
    )

    q = by[122]
    ex[122] = (
        block(
            "A",
            q["options"][0],
            "Khoản 2 Điều 68 VBHN Luật Đấu thầu.",
            "Bảo đảm thực hiện hợp đồng áp dụng đối với nhà thầu được lựa chọn, trừ: nhà thầu tư vấn; tự thực hiện/tham gia của cộng đồng; gói thầu thuộc hạn mức chỉ định thầu. Nhà thầu cung cấp dịch vụ phi tư vấn không thuộc các trường hợp loại trừ → phải áp dụng bảo đảm thực hiện hợp đồng.",
            "Phương án B sai vì gói thuộc hạn mức chỉ định thầu được miễn bảo đảm thực hiện hợp đồng.\n"
            "Phương án C sai vì nhà thầu tư vấn được miễn.\n"
            "Phương án D sai vì hình thức tự thực hiện được miễn.",
        ),
        "Khoản 2 Điều 68 VBHN Luật Đấu thầu",
    )

    q = by[123]
    ex[123] = (
        block(
            "D",
            q["options"][3],
            "Khoản 1 Điều 65 VBHN Luật Đấu thầu.",
            "Hồ sơ hợp đồng với nhà thầu bao gồm: văn bản hợp đồng; phụ lục hợp đồng (danh mục chi tiết phạm vi công việc, biểu giá, tiến độ thực hiện nếu có); quyết định phê duyệt kết quả lựa chọn nhà thầu. Cả A, B, C đều thuộc Khoản 1 → chọn tất cả.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Khoản 1 Điều 65 VBHN Luật Đấu thầu",
    )

    q = by[124]
    ex[124] = (
        block(
            "A",
            q["options"][0],
            "Quy định mở thầu đối với đấu thầu không qua mạng Nghị định số 214/2025/NĐ-CP (biên bản mở thầu đăng tải trong 24 giờ kể từ thời điểm mở thầu).",
            "Với đấu thầu không qua mạng, biên bản mở thầu phải được đăng tải trên Hệ thống mạng đấu thầu quốc gia trong thời hạn 24 giờ kể từ thời điểm mở thầu. Thời hạn 02 giờ gắn với việc tiến hành mở thầu kể từ đóng thầu (qua mạng), không phải thời hạn đăng tải biên bản không qua mạng.",
            "Phương án B sai vì 02 giờ không phải hạn đăng tải biên bản mở thầu không qua mạng.\n"
            "Phương án C sai vì không có hạn 04 giờ theo quy định nêu trên.\n"
            "Phương án D sai vì không phải 03 ngày làm việc.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[125]
    ex[125] = (
        block(
            "B",
            q["options"][1],
            "Khoản 5 Điều 70 VBHN Luật Đấu thầu; Điểm b Khoản 5 quy định chi tiết sửa đổi hợp đồng Nghị định số 214/2025/NĐ-CP.",
            "Hợp đồng theo đơn giá cố định: tăng/giảm khối lượng thực tế so với khối lượng trong hợp đồng (ở đây giảm từ 11.000 xuống 10.500 đơn vị) thuộc trường hợp thay đổi khối lượng đã được quy định trong hợp đồng; khi đáp ứng điều kiện Khoản 5 Điều 70 thì không phải ký kết văn bản sửa đổi hợp đồng.",
            "Phương án A sai vì không bắt buộc sửa đổi/ký văn bản sửa đổi trong trường hợp này.\n"
            "Phương án C sai vì không bắt buộc ký phụ lục chỉ để điều chỉnh khối lượng theo đơn giá cố định khi đã thỏa điều kiện Khoản 5.\n"
            "Phương án D sai vì A và C đều không đúng.",
        ),
        "Khoản 5 Điều 70 VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP",
    )

    q = by[126]
    ex[126] = (
        block(
            "D",
            q["options"][3],
            "Khoản 2 quy định chi tiết sửa đổi hợp đồng Nghị định số 214/2025/NĐ-CP; Khoản 5 Điều 70 VBHN Luật Đấu thầu.",
            "Các bên có thể thỏa thuận trong hợp đồng về quy trình, thủ tục sửa đổi hợp đồng đối với thay đổi chính sách/pháp luật, bất khả kháng, thay đổi vận chuyển/địa điểm giao hàng… (các trường hợp A–C). Còn tăng/giảm thời gian (HĐ theo thời gian), chi phí trực tiếp (chi phí cộng phí), giá trị cơ sở tính % (HĐ tỷ lệ %), mức giảm trừ/tăng thanh toán (HĐ theo kết quả đầu ra) thuộc nhóm thay đổi đã quy định trong hợp đồng theo hướng không phải ký văn bản sửa đổi khi đủ điều kiện → không thuộc nhóm bắt buộc thỏa thuận quy trình sửa đổi như A–C.",
            "Phương án A sai vì đây là trường hợp các bên có thể thỏa thuận quy trình sửa đổi trong hợp đồng.\n"
            "Phương án B sai vì bất khả kháng thuộc nhóm có thể thỏa thuận quy trình sửa đổi.\n"
            "Phương án C sai vì thay đổi vận chuyển/địa điểm giao hàng thuộc nhóm có thể thỏa thuận quy trình sửa đổi.",
        ),
        "Nghị định số 214/2025/NĐ-CP; Điều 70 VBHN Luật Đấu thầu",
    )

    q = by[127]
    ex[127] = (
        block(
            "D",
            q["options"][3],
            "Điểm c Khoản 1 Điều 45 VBHN Luật Đấu thầu.",
            "Hồ sơ mời quan tâm, hồ sơ mời sơ tuyển, hồ sơ mời thầu được phát hành đồng thời với thông báo mời quan tâm/mời sơ tuyển/mời thầu — tức phát hành ngay khi thông báo đăng tải thành công trên Hệ thống, không chờ thêm 01 ngày hay 03 ngày và không phát hành trước khi đăng tải.",
            "Phương án A sai vì không quy định phát hành sau 01 ngày.\n"
            "Phương án B sai vì không được phát hành trước khi đăng tải thông báo.\n"
            "Phương án C sai vì không quy định phát hành sau 03 ngày.",
        ),
        "Điểm c Khoản 1 Điều 45 VBHN Luật Đấu thầu",
    )

    q = by[128]
    ex[128] = (
        block(
            "A",
            q["options"][0],
            "Khoản 1 Điều 42 VBHN Luật Đấu thầu.",
            "Đấu thầu trước là việc thực hiện trước một số thủ tục trước khi điều ước quốc tế/thỏa thuận vay được ký kết (với ODA/vay ưu đãi) hoặc trước khi dự án được phê duyệt đầu tư nhằm đẩy nhanh tiến độ, trừ gói thầu cần thực hiện trước khi phê duyệt dự án. Phương án A đúng với định nghĩa này; không mở rộng sang “dự toán mua sắm” như phương án D.",
            "Phương án B sai vì không đồng nghĩa với mọi gói thuộc giai đoạn chuẩn bị đầu tư.\n"
            "Phương án C sai vì đấu thầu trước không bỏ yêu cầu phê duyệt kế hoạch lựa chọn nhà thầu theo cách diễn đạt đó.\n"
            "Phương án D sai vì gắn thêm “dự toán mua sắm” ngoài phạm vi định nghĩa tại Điều 42.",
        ),
        "Khoản 1 Điều 42 VBHN Luật Đấu thầu",
    )

    q = by[129]
    ex[129] = (
        block(
            "A",
            q["options"][0],
            "Điều 82 Nghị định số 214/2025/NĐ-CP.",
            "Quy trình mua sắm trực tiếp gồm lập/phê duyệt hồ sơ yêu cầu (phê duyệt căn cứ tờ trình, không phải thẩm định hồ sơ yêu cầu), phát hành hồ sơ yêu cầu, đánh giá hồ sơ đề xuất và thương thảo đề xuất, phê duyệt và công khai kết quả, hoàn thiện/ký kết hợp đồng. Bước không có trong quy trình là thẩm định hồ sơ yêu cầu.",
            "Phương án B sai vì đánh giá hồ sơ đề xuất và thương thảo vẫn thuộc quy trình.\n"
            "Phương án C sai vì phát hành hồ sơ yêu cầu thuộc quy trình.\n"
            "Phương án D sai vì phê duyệt và công khai kết quả thuộc quy trình.",
        ),
        "Điều 82 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[130]
    ex[130] = (
        block(
            "C",
            q["options"][2],
            "Quy trình chào hàng cạnh tranh Nghị định số 214/2025/NĐ-CP (phê duyệt và công khai kết quả theo Điều 33, không phải thẩm định kết quả lựa chọn nhà thầu).",
            "Với chào hàng cạnh tranh, việc phê duyệt và công khai kết quả lựa chọn nhà thầu thực hiện theo Điều 33 NĐ 214 nhưng không phải thẩm định kết quả lựa chọn nhà thầu. Các bước phê duyệt/công khai kết quả và hoàn thiện, ký kết, quản lý hợp đồng vẫn thực hiện.",
            "Phương án A sai vì vẫn phải phê duyệt kết quả lựa chọn nhà thầu.\n"
            "Phương án B sai vì vẫn phải công khai kết quả lựa chọn nhà thầu.\n"
            "Phương án D sai vì hoàn thiện, ký kết và quản lý thực hiện hợp đồng vẫn thuộc quy trình.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[131]
    ex[131] = (
        block(
            "A",
            q["options"][0],
            "Khoản 2 Điều 45 VBHN Luật Đấu thầu.",
            "Ngoài các mốc thời gian bắt buộc tại Khoản 1 Điều 45 (chuẩn bị HSDT, sửa đổi HSMT, phát hành đồng thời thông báo), các công việc khác — gồm phê duyệt hồ sơ mời thầu — do chủ đầu tư quyết định trên cơ sở bảo đảm tiến độ của dự án, gói thầu. Không còn hạn cứng “tối đa 05 ngày làm việc” như các phương án B, C.",
            "Phương án B sai vì Luật không ấn định tối đa 05 ngày làm việc theo cách nêu.\n"
            "Phương án C sai vì không ấn định tối đa 05 ngày làm việc kể từ báo cáo thẩm định.\n"
            "Phương án D sai vì B và C đều không đúng.",
        ),
        "Khoản 2 Điều 45 VBHN Luật Đấu thầu",
    )

    q = by[132]
    ex[132] = (
        block(
            "A",
            q["options"][0],
            "Khoản 2 Điều 45 VBHN Luật Đấu thầu.",
            "Thời gian phê duyệt kết quả lựa chọn nhà thầu thuộc nhóm công việc do chủ đầu tư quyết định trên cơ sở bảo đảm tiến độ dự án, gói thầu (Khoản 2 Điều 45), không bị khống chế cứng 05 ngày làm việc như B, C.",
            "Phương án B sai vì không có hạn tối đa 05 ngày làm việc theo cách nêu.\n"
            "Phương án C sai vì không có hạn tối đa 05 ngày làm việc kể từ báo cáo thẩm định theo cách nêu.\n"
            "Phương án D sai vì B và C đều không đúng.",
        ),
        "Khoản 2 Điều 45 VBHN Luật Đấu thầu",
    )

    q = by[133]
    ex[133] = (
        block(
            "D",
            q["options"][3],
            "Khoản 2 Điều 45 VBHN Luật Đấu thầu.",
            "Thời gian đánh giá hồ sơ dự thầu do chủ đầu tư quyết định trên cơ sở bảo đảm tiến độ của dự án, gói thầu. Các mức “tối đa 45/60 ngày” hoặc “30/60 ngày” không còn là cách xác định theo Điều 45 hiện hành; cũng không giao cho người có thẩm quyền quyết định theo phương án C.",
            "Phương án A sai vì không áp dụng hạn cứng 45/60 ngày theo cách nêu.\n"
            "Phương án B sai vì không áp dụng hạn cứng 30/60 ngày theo cách nêu.\n"
            "Phương án C sai vì trách nhiệm quyết định thuộc chủ đầu tư theo Khoản 2 Điều 45, không phải công thức “người có thẩm quyền, chủ đầu tư” như diễn đạt C.",
        ),
        "Khoản 2 Điều 45 VBHN Luật Đấu thầu",
    )

    q = by[134]
    ex[134] = (
        block(
            "C",
            q["options"][2],
            "Khoản 3 quy định chỉ định thầu rút gọn Nghị định số 214/2025/NĐ-CP.",
            "Chỉ định thầu rút gọn gồm: (a) chuẩn bị và gửi dự thảo hợp đồng cho nhà thầu; (b) hoàn thiện hợp đồng, phê duyệt và công khai kết quả lựa chọn nhà thầu; (c) ký kết và quản lý thực hiện hợp đồng. Không tách bước “thương thảo hợp đồng”/“thẩm định kết quả” như quy trình thông thường.",
            "Phương án A sai vì thêm thẩm định kết quả và tách thương thảo không đúng quy trình rút gọn.\n"
            "Phương án B sai vì vẫn nêu thẩm định kết quả và tách thương thảo.\n"
            "Phương án D sai vì đó là quy trình chỉ định thầu thông thường (có hồ sơ yêu cầu), không phải rút gọn.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[135]
    ex[135] = (
        block(
            "D",
            q["options"][3],
            "Quy trình một giai đoạn một túi hồ sơ Nghị định số 214/2025/NĐ-CP (thương thảo hợp đồng với gói hỗn hợp; HH/XL/PTV đấu thầu quốc tế; đấu thầu hạn chế theo Khoản 1 Điều 22 Luật Đấu thầu).",
            "Với phương thức một giai đoạn một túi hồ sơ, thương thảo hợp đồng (nếu có) được thực hiện đối với gói hỗn hợp; gói mua sắm hàng hóa/xây lắp/PTV áp dụng đấu thầu quốc tế; và gói đấu thầu hạn chế theo Khoản 1 Điều 22 Luật Đấu thầu. A, B, C đều thuộc các trường hợp này → chọn tất cả.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[136]
    ex[136] = (
        block(
            "D",
            q["options"][3],
            "Điểm a Khoản 2 Điều 53 VBHN Luật Đấu thầu.",
            "Bộ trưởng Bộ Y tế ban hành: danh mục mua sắm tập trung cấp quốc gia đối với thuốc; và danh mục mua sắm tập trung cấp quốc gia đối với thiết bị y tế, vật tư xét nghiệm trong trường hợp cần thiết.",
            "Phương án A sai vì ô tô không thuộc thẩm quyền ban hành danh mục của Bộ Y tế theo điểm này.\n"
            "Phương án B sai vì thiết bị CNTT không phải danh mục do Bộ Y tế ban hành theo điểm a.\n"
            "Phương án C sai vì “dịch vụ đơn giản” không khớp nội dung điểm a Điều 53.",
        ),
        "Điều 53 VBHN Luật Đấu thầu",
    )

    q = by[137]
    ex[137] = (
        block(
            "A",
            q["options"][0],
            "Quy định mua sắm tập trung Nghị định số 214/2025/NĐ-CP (thực hiện thông qua hình thức đấu thầu rộng rãi).",
            "Mua sắm tập trung được thực hiện thông qua hình thức đấu thầu rộng rãi (trừ khi hàng hóa/dịch vụ đáp ứng điều kiện chỉ định thầu, chào hàng cạnh tranh, đàm phán giá, trường hợp đặc biệt). Bảo hiểm tài sản cho cơ quan thuộc tỉnh không mặc định thuộc đàm phán giá → hình thức áp dụng là đấu thầu rộng rãi.",
            "Phương án B sai vì không mặc định dùng đấu thầu hạn chế.\n"
            "Phương án C sai vì không mặc định dùng đàm phán giá.\n"
            "Phương án D sai vì không kết hợp bắt buộc đấu thầu rộng rãi và đàm phán giá.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[138]
    ex[138] = (
        block(
            "D",
            q["options"][3],
            "Khoản 6 Điều 53 VBHN Luật Đấu thầu.",
            "Đơn vị mua sắm tập trung thực hiện việc lựa chọn nhà thầu trên cơ sở nhiệm vụ được giao hoặc hợp đồng ký với các đơn vị có nhu cầu. Cả A và B đều đúng.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C sai vì đơn vị mua sắm tập trung được thực hiện lựa chọn nhà thầu.",
        ),
        "Khoản 6 Điều 53 VBHN Luật Đấu thầu",
    )

    q = by[139]
    ex[139] = (
        block(
            "B",
            q["options"][1],
            "Khoản 3 Điều 54 VBHN Luật Đấu thầu.",
            "Thời hạn áp dụng thỏa thuận khung được quy định trong kế hoạch lựa chọn nhà thầu nhưng không quá 36 tháng. Không phải 40 tháng; cũng không đủ khi chỉ nói “do người có thẩm quyền quyết định” mà bỏ trần 36 tháng.",
            "Phương án A sai vì không quy định 40 tháng.\n"
            "Phương án C sai vì thiếu điều kiện “không quá 36 tháng”.\n"
            "Phương án D sai vì C không đầy đủ/không đúng bằng B.",
        ),
        "Điều 54 VBHN Luật Đấu thầu",
    )

    q = by[140]
    ex[140] = (
        block(
            "B",
            q["options"][1],
            "Quy định hoàn thiện, ký kết hợp đồng trong mua sắm tập trung Nghị định số 214/2025/NĐ-CP.",
            "Nhà thầu đã ký thỏa thuận khung phải thực hiện biện pháp bảo đảm thực hiện hợp đồng trước hoặc cùng thời điểm hợp đồng có hiệu lực cho đơn vị có nhu cầu mua sắm (không phải cho đơn vị mua sắm tập trung).",
            "Phương án A sai vì bảo đảm thực hiện hợp đồng nộp cho đơn vị có nhu cầu, không phải đơn vị mua sắm tập trung.\n"
            "Phương án C sai vì vẫn phải thực hiện bảo đảm trước/cùng thời điểm hợp đồng có hiệu lực.\n"
            "Phương án D sai vì không nộp sau khi hợp đồng có hiệu lực và không nộp cho đơn vị mua sắm tập trung.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    # Verify Điều 53 number for Q136/Q138
    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Lot7 filled: {filled}/20")


if __name__ == "__main__":
    main()
