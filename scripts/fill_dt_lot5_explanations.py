# -*- coding: utf-8 -*-
"""Điền explanation Lô 5 (STT 81–100) theo mẫu 4 khối."""
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

    q = by[81]
    ex[81] = (
        block(
            "D",
            q["options"][3],
            "Điều 6 và Điểm d Khoản 1 Điều 16 VBHN Luật Đấu thầu.",
            "Bảo đảm cạnh tranh theo Điều 6 gắn với độc lập pháp lý/tài chính (cổ phần, vốn góp, cùng cơ quan quản lý…), không lấy quan hệ anh em ruột giữa người đại diện theo pháp luật của hai nhà thầu độc lập làm căn cứ vi phạm. Điểm d Khoản 1 Điều 16 cấm quan hệ gia đình trong trường hợp cá nhân phía chủ đầu tư/bên mời thầu/tổ chuyên gia… với nhà thầu, không áp dụng cho quan hệ giữa hai nhà thầu tham dự với nhau. Do đó tình huống anh em ruột đại diện hai nhà thầu không thuộc hành vi bị cấm và không vi phạm bảo đảm cạnh tranh theo các quy định nêu trên.",
            "Phương án A sai vì không thuộc hành vi bị cấm tại Điều 16 theo đúng phạm vi áp dụng.\n"
            "Phương án B sai vì Điều 6 không quy định quan hệ huyết thống giữa đại diện hai nhà thầu là vi phạm cạnh tranh.\n"
            "Phương án C sai vì không có căn cứ loại một trong hai hồ sơ chỉ vì quan hệ anh em ruột của người đại diện.",
        ),
        "Điều 6 và Điểm d Khoản 1 Điều 16 VBHN Luật Đấu thầu",
    )

    q = by[82]
    ex[82] = (
        block(
            "C",
            q["options"][2],
            "Điểm e Khoản 1 Điều 5 VBHN Luật Đấu thầu; Khoản 3 Điều 26 Nghị định số 214/2025/NĐ-CP.",
            "Điểm e Khoản 1 Điều 5: nhà thầu có tư cách hợp lệ khi không đang trong thời gian bị cấm tham dự thầu theo quyết định của người có thẩm quyền. Đây là nội dung đánh giá tư cách hợp lệ/tính hợp lệ hồ sơ dự thầu, không phải tiêu chuẩn kỹ thuật, tài chính hay năng lực–kinh nghiệm.",
            "Phương án A sai vì kỹ thuật là nhóm tiêu chuẩn đánh giá riêng.\n"
            "Phương án B sai vì tài chính là nhóm tiêu chuẩn đánh giá riêng.\n"
            "Phương án D sai vì năng lực, kinh nghiệm là nhóm tiêu chuẩn đánh giá riêng.",
        ),
        "Điểm e Khoản 1 Điều 5 VBHN Luật Đấu thầu",
    )

    q = by[83]
    ex[83] = (
        block(
            "A",
            q["options"][0],
            "Khoản 4 Điều 26 Nghị định số 214/2025/NĐ-CP; Điểm a Khoản 3 Điều 32 Nghị định số 214/2025/NĐ-CP.",
            "Tiêu chuẩn năng lực, kinh nghiệm được xây dựng theo tiêu chí đạt/không đạt. Nhà thầu được đánh giá đạt tất cả nội dung/tiêu chuẩn về năng lực và kinh nghiệm trong hồ sơ mời thầu thì mới đáp ứng yêu cầu để chuyển sang bước đánh giá kỹ thuật.",
            "Phương án B sai vì không đủ khi chỉ đáp ứng một trong các tiêu chuẩn.\n"
            "Phương án C sai vì không có tỷ lệ “hai phần ba” theo quy định nêu trên.\n"
            "Phương án D sai vì phải đạt tất cả tiêu chuẩn đã nêu, không chỉ các tiêu chuẩn “quan trọng”.",
        ),
        "Khoản 4 Điều 26 và Điểm a Khoản 3 Điều 32 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[84]
    ex[84] = (
        block(
            "B",
            q["options"][1],
            "Khoản 2 Điều 29 Nghị định số 214/2025/NĐ-CP.",
            "Với đấu thầu trong nước gói xây lắp (PC, phần xây lắp EC), tổ chuyên gia đánh giá nhân sự chủ chốt, thiết bị thi công chủ yếu trước hết trên cơ sở cam kết trong đơn dự thầu; sau đánh giá tài chính, chỉ nhà thầu xếp hạng thứ nhất được đánh giá chi tiết theo kê khai, tài liệu đính kèm.",
            "Phương án A sai vì không đánh giá chi tiết nhân sự/thiết bị với tất cả nhà thầu tham dự.\n"
            "Phương án C sai vì không lấy toàn bộ nhà thầu đạt kỹ thuật để đánh giá chi tiết nội dung này.\n"
            "Phương án D sai vì vẫn phải đánh giá (chi tiết với nhà thầu xếp thứ nhất).",
        ),
        "Khoản 2 Điều 29 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[85]
    ex[85] = (
        block(
            "A",
            q["options"][0],
            "Khoản 2 Điều 24 VBHN Luật Đấu thầu; Mẫu E-HSMT chào hàng cạnh tranh kèm theo Thông tư số 79/2025/TT-BTC.",
            "Với chào hàng cạnh tranh, hồ sơ mời thầu không bắt buộc quy định tiêu chuẩn đánh giá về năng lực, kinh nghiệm. Khi HSMT không yêu cầu đánh giá NLKN, không thực hiện bước đánh giá NLKN; nhà thầu cam kết đáp ứng năng lực, kinh nghiệm trong đơn dự thầu. Việc nhà thầu tự đính kèm tài liệu NLKN không làm phát sinh nghĩa vụ bắt buộc phải đánh giá nếu HSMT không yêu cầu.",
            "Phương án B sai vì không bắt buộc đánh giá NLKN chỉ vì nhà thầu đính kèm tài liệu khi HSMT không yêu cầu.\n"
            "Phương án C sai vì không bắt buộc đánh giá NLKN trong mọi trường hợp chào hàng cạnh tranh.\n"
            "Phương án D sai vì B không đúng.",
        ),
        "Khoản 2 Điều 24 VBHN Luật Đấu thầu; Mẫu E-HSMT kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[86]
    ex[86] = (
        block(
            "B",
            q["options"][1],
            "Mẫu E-HSMT xây lắp kèm theo Thông tư số 79/2025/TT-BTC (nội dung chứng minh nguồn lực tài chính).",
            "Với yêu cầu nguồn lực tài chính, nhà thầu kê khai thông tin; cam kết cung cấp tín dụng chỉ là một cách chứng minh khi chủ đầu tư cho phép sử dụng. Hồ sơ mời thầu có thể yêu cầu hoặc không yêu cầu cam kết cung cấp tín dụng – không bắt buộc trong mọi gói xây lắp.",
            "Phương án A sai vì không bắt buộc phải chứng minh nguồn lực tài chính bằng cam kết tín dụng.\n"
            "Phương án C sai vì phương thức một giai đoạn hai túi hồ sơ không làm phát sinh nghĩa vụ bắt buộc này.\n"
            "Phương án D sai vì giá gói thầu trên 20 tỷ đồng cũng không buộc phải dùng cam kết tín dụng.",
        ),
        "Mẫu E-HSMT xây lắp kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[87]
    ex[87] = (
        block(
            "A",
            q["options"][0],
            "Khoản 2 Điều 93 và Khoản 4 Điều 29 Nghị định số 214/2025/NĐ-CP.",
            "Với hàng hóa thuộc danh mục tiêu chuẩn, định mức do cấp có thẩm quyền ban hành, điều kiện xét duyệt trúng thầu gồm giá đề nghị trúng thầu của từng hàng hóa không vượt mức giá theo định mức. Đồng thời, với gói chia phần áp dụng giá thấp nhất, tổng giá đề nghị trúng thầu của gói thầu phải thấp nhất và không vượt giá gói thầu được duyệt. Do máy tính và bàn ghế thuộc danh mục định mức, phải bảo đảm cả điều kiện từng mặt hàng theo định mức và tổng giá gói thầu.",
            "Phương án B sai vì bỏ điều kiện so sánh với tiêu chuẩn, định mức từng mặt hàng.\n"
            "Phương án C sai vì lấy “giá từng phần thấp nhất” và bỏ định mức từng mặt hàng – không khớp quy định kết hợp nêu trên.\n"
            "Phương án D sai vì phương án A đúng.",
        ),
        "Khoản 2 Điều 93 và Khoản 4 Điều 29 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[88]
    ex[88] = (
        block(
            "B",
            q["options"][1],
            "Ghi chú chứng minh thiết bị thi công chủ yếu Mẫu E-HSMT xây lắp kèm theo Thông tư số 79/2025/TT-BTC.",
            "Theo mẫu, nhà thầu chỉ cần cung cấp một trong các tài liệu: giấy đăng ký thiết bị, hợp đồng, hóa đơn mua hàng, giấy đăng kiểm/kiểm định theo pháp luật để chứng minh khả năng huy động thiết bị thi công chủ yếu thuộc sở hữu của mình; không phải cung cấp đầy đủ mọi loại tài liệu kể cả khi E-HSMT liệt kê nhiều loại.",
            "Phương án A sai vì không bắt buộc cung cấp đầy đủ tất cả các loại tài liệu đã liệt kê.\n"
            "Phương án C sai vì không bắt buộc cặp giấy đăng ký kèm đăng kiểm/kiểm định.\n"
            "Phương án D sai vì không bắt buộc phải là hợp đồng và hóa đơn mua hàng.",
        ),
        "Mẫu E-HSMT xây lắp kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[89]
    ex[89] = (
        block(
            "B",
            q["options"][1],
            "Điều 32 và Điều 33 Nghị định số 214/2025/NĐ-CP (trình tự đánh giá, phê duyệt kết quả lựa chọn nhà thầu).",
            "Danh sách xếp hạng nhà thầu được hình thành trong quá trình đánh giá; chủ đầu tư không phải phê duyệt danh sách xếp hạng trong nhiều trường hợp theo Nghị định 214. Đối tượng thẩm định trước phê duyệt là kết quả lựa chọn nhà thầu (khi có yêu cầu thẩm định), không phải danh sách xếp hạng nhà thầu. Do đó danh sách xếp hạng không phải thẩm định trước khi phê duyệt.",
            "Phương án A sai vì số lượng nhà thầu trong danh sách xếp hạng không làm phát sinh nghĩa vụ thẩm định danh sách.\n"
            "Phương án C sai vì không thuộc thẩm quyền tùy nghi của người có thẩm quyền theo hướng bắt buộc thẩm định danh sách.\n"
            "Phương án D sai vì A và C không đúng.",
        ),
        "Điều 32 và Điều 33 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[90]
    ex[90] = (
        block(
            "D",
            q["options"][3],
            "Khoản 5 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Khi tại thời điểm đóng thầu chỉ có 01 nhà thầu nộp hồ sơ dự thầu (đấu thầu rộng rãi…), chủ đầu tư được xử lý theo một trong hai cách: mở thầu ngay để đánh giá; hoặc gia hạn thời điểm đóng thầu tối thiểu 10 ngày đối với đấu thầu rộng rãi. Với gói xây lắp đấu thầu rộng rãi trong nước, cả A và B đều đúng.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C sai vì Khoản 5 Điều 140 giao chủ đầu tư xem xét, giải quyết theo hai cách nêu trên, không bắt buộc báo cáo người có thẩm quyền để quyết định thay cho hai cách đó.",
        ),
        "Khoản 5 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[91]
    ex[91] = (
        block(
            "B",
            q["options"][1],
            "Ghi chú đánh giá hợp đồng tương tự Mẫu E-HSMT xây lắp kèm theo Thông tư số 79/2025/TT-BTC.",
            "Khi công ty mẹ tham dự thầu và huy động công ty con/thành viên thực hiện một phần công việc, phải kê khai phần việc dành cho công ty con; việc đánh giá kinh nghiệm hợp đồng tương tự căn cứ giá trị, khối lượng công việc do công ty mẹ và công ty con đảm nhiệm trong gói thầu.",
            "Phương án A sai vì không bỏ qua kinh nghiệm gắn với phần việc công ty con đảm nhiệm.\n"
            "Phương án C sai vì không chỉ đánh giá công ty con và bỏ qua phân bổ khối lượng.\n"
            "Phương án D sai vì không cộng gộp kinh nghiệm mẹ–con mà bỏ qua phân biệt khối lượng từng bên đảm nhiệm.",
        ),
        "Mẫu E-HSMT xây lắp kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[92]
    ex[92] = (
        block(
            "A",
            q["options"][0],
            "Ghi chú kinh nghiệm công trình tương tự Mẫu E-HSMT xây lắp kèm theo Thông tư số 79/2025/TT-BTC.",
            "Với gói chỉ gồm 01 công trình độc lập, kinh nghiệm tương tự xét theo công trình nhà thầu đã hoàn thành toàn bộ hoặc hoàn thành phần lớn, cùng loại kết cấu, cấp công trình và đáp ứng quy mô theo yêu cầu hồ sơ mời thầu.",
            "Phương án B sai vì không chỉ xét công trình đã hoàn thành toàn bộ/đã nghiệm thu theo cách loại trừ “hoàn thành phần lớn”.\n"
            "Phương án C sai vì với 01 công trình độc lập không chuyển sang xét theo từng hạng mục công việc thay cho công trình cùng loại kết cấu, cấp.\n"
            "Phương án D sai vì chỉ phương án A đúng đủ.",
        ),
        "Mẫu E-HSMT xây lắp kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[93]
    ex[93] = (
        block(
            "D",
            q["options"][3],
            "Ghi chú tính chất hợp đồng tương tự Mẫu E-HSMT hàng hóa kèm theo Thông tư số 79/2025/TT-BTC.",
            "Tính chất tương tự được xác định theo tiêu chí hàng hóa thuộc cùng lĩnh vực tổng quát do E-HSMT yêu cầu hoặc hàng hóa có cùng 4 số đầu mã HS với hàng hóa thuộc gói thầu. Nhà thầu đáp ứng một trong hai tiêu chí này được coi là có tính chất tương tự. Do đó B và C đều đúng.",
            "Phương án A chưa đủ/không khớp đúng cách diễn đạt tiêu chí trong mẫu (mẫu dùng lĩnh vực tổng quát hoặc mã HS, không lấy “cùng chủng loại” như điều kiện duy nhất).\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Mẫu E-HSMT hàng hóa kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[94]
    ex[94] = (
        block(
            "A",
            q["options"][0],
            "Ghi chú tiêu chuẩn năng lực Mẫu E-HSMT dịch vụ phi tư vấn kèm theo Thông tư số 79/2025/TT-BTC (gói chia nhiều phần).",
            "Khi nhà thầu tham dự nhiều phần, yêu cầu về doanh thu được xác định trên tổng giá trị doanh thu bình quân yêu cầu đối với các phần mà nhà thầu tham dự (cộng các mức yêu cầu của từng phần đã tham dự).",
            "Phương án B sai vì không đánh giá doanh thu tách rời từng phần mà bỏ tổng yêu cầu các phần tham dự.\n"
            "Phương án C sai vì không lấy riêng phần có giá trị lớn nhất thay cho tổng yêu cầu.\n"
            "Phương án D sai vì phương án A đúng.",
        ),
        "Mẫu E-HSMT dịch vụ phi tư vấn kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[95]
    ex[95] = (
        block(
            "B",
            q["options"][1],
            "Ghi chú quy mô hợp đồng tương tự Mẫu E-HSMT hàng hóa kèm theo Thông tư số 79/2025/TT-BTC (gói chia nhiều phần).",
            "Với gói hàng hóa chia nhiều phần, đánh giá quy mô hợp đồng tương tự tương ứng từng phần nhà thầu tham dự; nhà thầu không phải đáp ứng tổng quy mô hợp đồng tương tự cộng dồn của tất cả các phần đã tham dự.",
            "Phương án A sai vì không yêu cầu tổng quy mô hợp đồng tương tự của mọi phần tham dự.\n"
            "Phương án C sai vì không lấy phần có giá trị nhỏ nhất làm chuẩn duy nhất.\n"
            "Phương án D sai vì phương án B đúng.",
        ),
        "Mẫu E-HSMT hàng hóa kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[96]
    ex[96] = (
        block(
            "B",
            q["options"][1],
            "Mục 23.7 E-CDNT Mẫu E-HSMT hàng hóa kèm theo Thông tư số 79/2025/TT-BTC.",
            "Khi E-HSMT yêu cầu cam kết/hợp đồng nguyên tắc về bảo hành, bảo trì, duy tu, bảo dưỡng mà E-HSDT chưa đính kèm, chủ đầu tư yêu cầu nhà thầu làm rõ, bổ sung tài liệu trong thời gian phù hợp nhưng không ít hơn 03 ngày làm việc để làm cơ sở đánh giá E-HSDT.",
            "Phương án A sai vì không loại ngay hồ sơ chỉ vì thiếu tài liệu cam kết/hợp đồng nguyên tắc nêu trên.\n"
            "Phương án C sai vì không phải xin ý kiến người có thẩm quyền như tình huống mặc định.\n"
            "Phương án D sai vì không bỏ qua bước làm rõ để đến khi trúng thầu mới bổ sung.",
        ),
        "Mục 23.7 E-CDNT Mẫu E-HSMT hàng hóa kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[97]
    ex[97] = (
        block(
            "C",
            q["options"][2],
            "Mẫu E-HSMT hàng hóa kèm theo Thông tư số 79/2025/TT-BTC (yêu cầu đề xuất cụ thể ký mã hiệu, nhãn hiệu, xuất xứ, hãng sản xuất).",
            "Nhà thầu phải đề xuất cụ thể ký mã hiệu, nhãn hiệu, xuất xứ, hãng sản xuất của hàng hóa chào thầu để làm cơ sở đánh giá. Trường hợp không đề xuất cụ thể các thông tin này, hồ sơ dự thầu không được xem xét, đánh giá (không dùng làm rõ để bổ sung bản chất đề xuất hàng hóa).",
            "Phương án A sai vì không được lấy làm rõ để thay thế nghĩa vụ đề xuất cụ thể các thông tin bắt buộc này.\n"
            "Phương án B sai vì tổ chuyên gia không tự suy diễn từ catalogue khi nhà thầu không đề xuất cụ thể.\n"
            "Phương án D sai vì không được để đến khi trúng thầu mới bổ sung các thông tin then chốt này.",
        ),
        "Mẫu E-HSMT hàng hóa kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[98]
    ex[98] = (
        block(
            "B",
            q["options"][1],
            "Mục về nhà thầu phụ Mẫu E-HSMT xây lắp kèm theo Thông tư số 79/2025/TT-BTC; Khoản 2 Điều 67 VBHN Luật Đấu thầu.",
            "Với nhà thầu phụ thông thường (không phải nhà thầu phụ đặc biệt), năng lực và kinh nghiệm của nhà thầu phụ không được xem xét khi đánh giá hồ sơ dự thầu; bản thân nhà thầu tham dự vẫn phải đáp ứng năng lực, kinh nghiệm cho toàn bộ phần việc, kể cả phần dự kiến giao thầu phụ.",
            "Phương án A sai vì nhà thầu chính vẫn phải đáp ứng NLKN cho phần giao thầu phụ; đồng thời không đánh giá NLKN nhà thầu phụ theo hướng A.\n"
            "Phương án C sai vì không để chủ đầu tư tùy nghi chọn đánh giá hay không đánh giá nhà thầu phụ thông thường.\n"
            "Phương án D sai vì vừa đánh giá nhà thầu phụ vừa bắt nhà thầu chính đáp ứng – không khớp quy định nhà thầu phụ thông thường.",
        ),
        "Mẫu E-HSMT xây lắp kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[99]
    ex[99] = (
        block(
            "A",
            q["options"][0],
            "Mục 20.2 E-CDNT Mẫu E-HSMT kèm theo Thông tư số 79/2025/TT-BTC.",
            "Khi cần sửa đổi E-HSDT đã nộp (trước đóng thầu) mà E-HSMT không sửa đổi, nhà thầu phải rút toàn bộ E-HSDT đã nộp, chỉnh sửa cho phù hợp rồi nộp lại E-HSDT mới trên Hệ thống.",
            "Phương án B sai vì vẫn phải rút toàn bộ E-HSDT đã nộp trước khi nộp bản mới.\n"
            "Phương án C sai vì không được chỉ sửa trên bản đã nộp mà không nộp lại E-HSDT mới.\n"
            "Phương án D sai vì nhà thầu được sửa đổi trước thời điểm đóng thầu theo đúng quy trình rút–nộp lại.",
        ),
        "Mục 20.2 E-CDNT Mẫu E-HSMT kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[100]
    ex[100] = (
        block(
            "A",
            q["options"][0],
            "Mục 20.2 E-CDNT Mẫu E-HSMT kèm theo Thông tư số 79/2025/TT-BTC.",
            "Nếu nhà thầu đã nộp E-HSDT trước khi chủ đầu tư sửa đổi E-HSMT thì phải nộp lại E-HSDT mới phù hợp E-HSMT đã sửa; thực hiện bằng cách rút toàn bộ E-HSDT đã nộp, chỉnh sửa rồi nộp lại. E-HSDT nộp trước khi E-HSMT được sửa đổi sẽ không được mở, xem xét, đánh giá nếu không nộp lại.",
            "Phương án B sai vì vẫn phải rút toàn bộ E-HSDT đã nộp trước đó.\n"
            "Phương án C sai vì không được chỉ sửa trên bản cũ mà không nộp lại E-HSDT mới.\n"
            "Phương án D sai vì phương án A đúng.",
        ),
        "Mục 20.2 E-CDNT Mẫu E-HSMT kèm theo Thông tư số 79/2025/TT-BTC",
    )

    for stt, (expl, src) in ex.items():
        by[stt]["explanation"] = expl
        by[stt]["source"] = src

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2), encoding="utf-8")
    n = sum(1 for q in bank["questions"] if q["lot"] == 5 and q["explanation"])
    print(f"Lot5 filled: {n}/20")


if __name__ == "__main__":
    main()
