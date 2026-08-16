# -*- coding: utf-8 -*-
"""Điền explanation Lô 18 (STT 341–360) theo mẫu 4 khối, căn cứ CSPL local + FTA."""
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

    # Q341 – HĐ điện tử bắt buộc: gói DTRR/hạn chế/CHCT/CGTT/MSTT qua và không qua mạng, thanh toán KBNN
    q = by[341]
    ex[341] = (
        block(
            "A",
            q["options"][0],
            "Điều 32 Thông tư số 79/2025/TT-BTC.",
            "Bắt buộc sử dụng hợp đồng điện tử đối với gói thầu tổ chức lựa chọn nhà thầu theo hình thức đấu thầu rộng rãi, đấu thầu hạn chế, chào hàng cạnh tranh, chào giá trực tuyến, mua sắm trực tuyến – bất kể qua mạng hay không qua mạng – khi việc thanh toán hợp đồng thực hiện qua Kho bạc nhà nước. Không bắt buộc với gói thầu không thanh toán qua KBNN.",
            "Phương án B sai vì đặt hàng, chỉ định thầu, mua sắm trực tiếp, đàm phán giá, LCTTDB, gói thầu cộng đồng, tư vấn cá nhân rút gọn không thuộc diện bắt buộc ký HĐ điện tử.\n"
            "Phương án C sai vì gói thanh toán không qua KBNN không bắt buộc ký HĐ điện tử.\n"
            "Phương án D sai vì A đúng hơn D: A bao gồm cả qua mạng và không qua mạng, còn D chỉ nêu 'trên Hệ thống' nên hẹp hơn thực tế quy định.",
        ),
        "Điều 32 Thông tư số 79/2025/TT-BTC",
    )

    # Q342 – Sau sơ tuyển NLKN thay đổi → cập nhật khi nộp E-HSDT
    q = by[342]
    ex[342] = (
        block(
            "A",
            q["options"][0],
            "Nghị định số 214/2025/NĐ-CP (quy định về sơ tuyển và đấu thầu); Thông tư số 79/2025/TT-BTC.",
            "Đối với gói thầu đã áp dụng sơ tuyển, nhà thầu vượt qua sơ tuyển vẫn phải cập nhật lại năng lực và kinh nghiệm trong E-HSDT nếu có sự thay đổi so với thời điểm tham dự sơ tuyển. Hệ thống cho phép nhà thầu cập nhật thông tin trực tuyến để đảm bảo tính chính xác tại thời điểm đánh giá E-HSDT.",
            "Phương án B sai vì chỉ đính kèm hồ sơ năng lực là chưa đủ nếu có thay đổi – phải cập nhật chủ động.\n"
            "Phương án C sai vì không thể không cập nhật khi NLKN có thay đổi – thông tin phải phản ánh thực tế.\n"
            "Phương án D sai vì A và C mâu thuẫn; chỉ A là đúng.",
        ),
        "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC",
    )

    # Q343 – Quy trình 02: A, B, C đều đúng
    q = by[343]
    ex[343] = (
        block(
            "D",
            q["options"][3],
            "Thông tư số 79/2025/TT-BTC (quy định về đánh giá E-HSDT quy trình 02).",
            "Quy trình 02 áp dụng cho gói mua sắm hàng hóa, dịch vụ phi tư vấn, máy đặt, máy mượn theo phương thức một giai đoạn một túi hồ sơ, sử dụng phương pháp 'giá thấp nhất' và không có ưu đãi. Hệ thống tự động xếp hạng nhà thầu theo giá dự thầu (sau khi trừ giảm giá) mà không cần phê duyệt danh sách xếp hạng. Khi từ 02 nhà thầu xếp thứ nhất, chuyển sang đánh giá quy trình 01. Tất cả ba nội dung A, B, C đều đúng.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    # Q344 – Quy trình 02: trình tự đánh giá NT xếp hạng 1: hợp lệ → KT → tài chính → NLKN
    q = by[344]
    ex[344] = (
        block(
            "C",
            q["options"][2],
            "Thông tư số 79/2025/TT-BTC (trình tự đánh giá E-HSDT theo quy trình 02).",
            "Theo quy trình 02, tổ chuyên gia đánh giá tuần tự E-HSDT của nhà thầu xếp hạng thứ nhất (giá thấp nhất) theo các bước: (1) tính hợp lệ của E-HSDT; (2) đánh giá về kỹ thuật; (3) đánh giá về tài chính; (4) đánh giá năng lực và kinh nghiệm. Nếu bước nào không đáp ứng thì chuyển sang nhà thầu xếp hạng tiếp theo, không cần đánh giá tất cả nhà thầu cùng lúc.",
            "Phương án A sai vì không đánh giá tất cả nhà thầu cùng lúc trong quy trình 02.\n"
            "Phương án B sai vì trình tự hợp lệ → NLKN → KT thiếu bước tài chính và sai thứ tự.\n"
            "Phương án D sai vì đánh giá tất cả nhà thầu một lúc là quy trình 01, không phải quy trình 02.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    # Q345 – Phi tư vấn 2 tỷ, yêu cầu làm rõ tiếp nhận 04/11 (Thứ 3), đóng thầu 11/11 (Thứ 3)
    # Phải trả lời trong 03 ngày LV kể từ ngày tiếp nhận: 05/11, 06/11, 07/11 → chậm nhất 07/11
    q = by[345]
    ex[345] = (
        block(
            "C",
            q["options"][2],
            "Thông tư số 79/2025/TT-BTC (quy định về trả lời yêu cầu làm rõ E-HSMT).",
            "Khi nhận yêu cầu làm rõ, chủ đầu tư phải trả lời trên Hệ thống trong vòng 03 ngày làm việc kể từ ngày tiếp nhận. Ngày tiếp nhận là 04/11/2025 (Thứ 3). Đếm 03 ngày làm việc: 05/11 (Thứ 4) = ngày 1, 06/11 (Thứ 5) = ngày 2, 07/11 (Thứ 6) = ngày 3. Trả lời chậm nhất vào 07/11 (Thứ 6) thì thời gian từ ngày trả lời đến ngày đóng thầu (11/11, Thứ 3) vẫn đủ để nhà thầu chuẩn bị và không cần gia hạn.",
            "Phương án A sai vì 05/11 chỉ là ngày LV thứ 1 từ ngày tiếp nhận, CĐT còn có thể trả lời muộn hơn mà không cần gia hạn.\n"
            "Phương án B sai vì 06/11 chưa phải ngày cuối hạn trả lời (còn ngày 07/11 là hạn).\n"
            "Phương án D sai vì 08/11 (Thứ 7) không phải ngày làm việc và vượt qua hạn 03 ngày LV.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    # Q346 – Sai: thông báo KQLCNT cho các NT tham dự thầu trong 03 ngày LV là không đúng
    q = by[346]
    ex[346] = (
        block(
            "D",
            q["options"][3],
            "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC.",
            "Sau khi phê duyệt kết quả lựa chọn nhà thầu, quy định thực tế là: chủ đầu tư đăng tải KQLCNT trên Hệ thống trong vòng 05 ngày làm việc (không phải gửi văn bản thông báo cho từng nhà thầu tham dự trong 03 ngày). Nhà thầu không trúng thầu có thể gửi đề nghị giải thích và CĐT có 02 ngày LV để trả lời. Phương án D mô tả sai cơ chế (không gửi văn bản cho tất cả NT mà đăng tải lên Hệ thống).",
            "Phương án A đúng: CĐT đăng tải KQLCNT trên Hệ thống trong 05 ngày LV.\n"
            "Phương án B đúng: nhà thầu có quyền gửi đề nghị giải thích qua Hệ thống hoặc gặp trực tiếp CĐT.\n"
            "Phương án C đúng: CĐT trả lời giải thích trong 02 ngày LV.",
        ),
        "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC",
    )

    # Q347 – Tất cả A, B, C đúng về thông báo chấp thuận E-HSDT và trao hợp đồng
    q = by[347]
    ex[347] = (
        block(
            "D",
            q["options"][3],
            "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC.",
            "Theo quy định về đấu thầu qua mạng: (A) CĐT gửi thông báo chấp thuận E-HSDT và trao hợp đồng qua Hệ thống cho nhà thầu trúng thầu sau khi đăng tải KQLCNT, kèm yêu cầu về BĐTH, thời gian hoàn thiện và ký kết HĐ; (B) Thông báo này là một phần của hồ sơ hợp đồng; (C) Thời hạn tính từ ngày CĐT gửi thông báo cho NT trúng thầu trên Hệ thống. Cả ba đều đúng.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC",
    )

    # Q348 – Giá trần CGTT rút gọn: phương án B và C đều đúng
    q = by[348]
    ex[348] = (
        block(
            "D",
            q["options"][3],
            "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC (quy định giá trần CGTT rút gọn).",
            "Về giá trần trong chào giá trực tuyến rút gọn: (B) Đối với hợp đồng trọn gói, giá trần là giá gói thầu trong KHLCNT được duyệt (hoặc dự toán khi dự toán duyệt sau KHLCNT); (C) Đối với hợp đồng đơn giá cố định hoặc đơn giá điều chỉnh, giá trần là giá gói thầu chưa bao gồm chi phí dự phòng (hoặc dự toán chưa bao gồm dự phòng khi duyệt sau KHLCNT). Cả B và C đều đúng.",
            "Phương án A sai vì hợp đồng trọn gói và đơn giá cố định/điều chỉnh có cách tính giá trần khác nhau, không áp dụng một công thức chung như A mô tả.\n"
            "Phương án B đúng nhưng chưa đủ (chỉ cho trọn gói).\n"
            "Phương án C đúng nhưng chưa đủ (chỉ cho đơn giá cố định/điều chỉnh).",
        ),
        "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC",
    )

    # Q349 – Bước giá CGTT rút gọn: 0,1% – 0,3% giá trần
    q = by[349]
    ex[349] = (
        block(
            "A",
            q["options"][0],
            "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC (bước giá chào giá trực tuyến rút gọn).",
            "Bước giá trong chào giá trực tuyến rút gọn được quy định là một giá trị trong khoảng từ 0,1% đến 0,3% giá trần. Bước giá nhỏ đảm bảo cạnh tranh tiệm cận, tránh bước quá lớn làm mất ý nghĩa đấu thầu hoặc bước quá nhỏ gây tắc nghẽn hệ thống.",
            "Phương án B sai vì 0,5% – 0,8% cao hơn mức quy định.\n"
            "Phương án C sai vì 1% – 2% cao hơn nhiều so với mức quy định.\n"
            "Phương án D sai vì 1% – 3% nằm ngoài biên độ quy định.",
        ),
        "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC",
    )

    # Q350 – Sự cố Hệ thống dài hạn: Bộ Tài chính thông báo cách thức LCNT
    q = by[350]
    ex[350] = (
        block(
            "A",
            q["options"][0],
            "Thông tư số 79/2025/TT-BTC (quy định xử lý sự cố Hệ thống mạng đấu thầu quốc gia dài hạn).",
            "Khi Hệ thống mạng đấu thầu quốc gia gặp sự cố dài hạn mà không thể khắc phục trong thời gian ngắn, Bộ Tài chính (cơ quan quản lý Hệ thống) có trách nhiệm thông báo về cách thức lựa chọn nhà thầu thay thế. Không phải Cục Quản lý đấu thầu hay Trung tâm Đấu thầu qua mạng quốc gia.",
            "Phương án B sai vì Cục Quản lý đấu thầu (thuộc Bộ KH&ĐT) không quản lý Hệ thống mạng đấu thầu.\n"
            "Phương án C sai vì Trung tâm Đấu thầu qua mạng quốc gia (nếu có) là đơn vị vận hành, không phải ra thông báo xử lý sự cố về phương thức LCNT.\n"
            "Phương án D sai vì chỉ A (Bộ Tài chính) mới có thẩm quyền theo TT 79.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    # Q351 – Bộ Tài chính thông báo trên Cổng TTĐT của Chính phủ
    q = by[351]
    ex[351] = (
        block(
            "A",
            q["options"][0],
            "Thông tư số 79/2025/TT-BTC (xử lý sự cố Hệ thống dài hạn).",
            "Theo Thông tư 79, khi Hệ thống gặp sự cố dài hạn, Bộ Tài chính thông báo trên Cổng thông tin điện tử của Chính phủ (chinhphu.vn) – kênh thông tin chính thức rộng rãi nhất – về cách thức thực hiện lựa chọn nhà thầu trong thời gian sự cố.",
            "Phương án B sai vì Cổng TTĐT của Bộ Tài chính có phạm vi tiếp cận hẹp hơn Cổng Chính phủ.\n"
            "Phương án C sai vì Hệ thống mạng đấu thầu quốc gia đã gặp sự cố không vận hành được, không thể đăng thông báo lên đó.\n"
            "Phương án D sai vì chỉ A mới đúng theo quy định TT 79.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    # Q352 – Hàng mẫu: A và B đều đúng
    q = by[352]
    ex[352] = (
        block(
            "D",
            q["options"][3],
            "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC (yêu cầu hàng mẫu trong E-HSMT).",
            "Về yêu cầu hàng mẫu trong gói thầu mua sắm hàng hóa: (A) Nhà thầu được phép nộp bổ sung hàng mẫu trong thời hạn 05 ngày làm việc sau thời điểm đóng thầu; (B) Chủ đầu tư phải bảo đảm yêu cầu hàng mẫu không làm tăng chi phí, hạn chế cạnh tranh hoặc tạo lợi thế bất bình đẳng. Cả hai nội dung đều đúng.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C sai vì cả A và B đều đúng.",
        ),
        "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC",
    )

    # Q353 – Mua sắm trực tuyến: ký HĐ điện tử khi thanh toán qua KBNN
    q = by[353]
    ex[353] = (
        block(
            "C",
            q["options"][2],
            "Điều 32 Thông tư số 79/2025/TT-BTC.",
            "Gói thầu mua sắm trực tuyến (kể cả dưới 500 triệu đồng) bắt buộc ký hợp đồng điện tử trên Hệ thống khi việc thanh toán hợp đồng thực hiện qua Kho bạc nhà nước. Nếu không thanh toán qua KBNN thì không bắt buộc ký hợp đồng điện tử.",
            "Phương án A sai vì không phải bất kể điều kiện thanh toán mà chỉ khi thanh toán qua KBNN.\n"
            "Phương án B sai vì không phải chủ đầu tư tự quyết định hoàn toàn – phải theo tiêu chí thanh toán qua KBNN.\n"
            "Phương án D sai vì giá trị < 500 triệu không phải tiêu chí miễn HĐ điện tử – tiêu chí là thanh toán qua KBNN.",
        ),
        "Điều 32 Thông tư số 79/2025/TT-BTC",
    )

    # Q354 – Sai: tên nhà thầu KHÔNG được công khai trong CGTT
    q = by[354]
    ex[354] = (
        block(
            "D",
            q["options"][3],
            "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC (quy định về chào giá trực tuyến rút gọn).",
            "Trong quá trình chào giá trực tuyến, Hệ thống công khai mức giá chào và các yếu tố khác ngoài giá (nếu có), đồng thời hiển thị thời gian còn lại của phiên chào giá. Tuy nhiên, TÊN NHÀ THẦU không được công khai trong quá trình chào giá để đảm bảo cạnh tranh độc lập, tránh thông đồng. Phương án D sai khi nói cả giá lẫn tên nhà thầu được công khai.",
            "Phương án A đúng: được nêu yêu cầu về xuất xứ, ký mã hiệu, thông số kỹ thuật và các yêu cầu khác.\n"
            "Phương án B đúng: chủ đầu tư cần nghiên cứu khoảng thời gian phù hợp giữa ngày giao hàng sớm nhất và muộn nhất.\n"
            "Phương án C đúng: nhà thầu không đề xuất ngày giao hàng cụ thể mà cam kết theo yêu cầu CĐT.",
        ),
        "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC",
    )

    # Q355 – Quy trình 02: HH/phi tư vấn/máy đặt-mượn, 1G1T, giá thấp nhất, không ưu đãi
    q = by[355]
    ex[355] = (
        block(
            "A",
            q["options"][0],
            "Thông tư số 79/2025/TT-BTC (điều kiện áp dụng quy trình 02).",
            "Tổ chuyên gia được phép chọn quy trình 02 để đánh giá E-HSDT khi đồng thời đáp ứng: (1) Gói thầu mua sắm hàng hóa, dịch vụ phi tư vấn, máy đặt, máy mượn; (2) Phương thức một giai đoạn một túi hồ sơ; (3) Sử dụng phương pháp 'giá thấp nhất'; (4) Các nhà thầu và E-HSDT đều không có bất kỳ ưu đãi nào.",
            "Phương án B sai vì dịch vụ tư vấn không thuộc điều kiện áp dụng quy trình 02.\n"
            "Phương án C sai vì gói thầu xây lắp không thuộc điều kiện áp dụng quy trình 02.\n"
            "Phương án D sai vì A đúng.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    # Q356 – Chỉ định thầu: 1 bản gốc + tối đa 02 bản chụp HSĐX
    q = by[356]
    ex[356] = (
        block(
            "B",
            q["options"][1],
            "Nghị định số 214/2025/NĐ-CP (hồ sơ yêu cầu chỉ định thầu).",
            "Theo quy định về lập hồ sơ yêu cầu đối với hình thức chỉ định thầu, chủ đầu tư quy định nhà thầu chuẩn bị 01 bản gốc và tối đa 02 bản chụp hồ sơ đề xuất. Số lượng bản chụp được giới hạn để tiết kiệm chi phí trong khi vẫn đủ phục vụ công tác đánh giá và lưu trữ.",
            "Phương án A sai vì 01 bản chụp không đủ cho nhu cầu đánh giá và lưu trữ.\n"
            "Phương án C sai vì tối đa 02 bản chụp, không phải 03.\n"
            "Phương án D sai vì tối đa 02 bản chụp, không phải 04.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    # Q357 – CGTT rút gọn HH: nhà thầu ĐƯỢC thay đổi trọng số trong quá trình chào giá
    q = by[357]
    ex[357] = (
        block(
            "B",
            q["options"][1],
            "Thông tư số 79/2025/TT-BTC (quy định về chào giá trực tuyến rút gọn, điều chỉnh trọng số).",
            "Trong quá trình chào giá trực tuyến rút gọn, nhà thầu CÓ THỂ thay đổi trọng số của từng hạng mục hàng hóa trong khi vẫn đảm bảo giá dự thầu không vượt giá trần. Phương án B khẳng định 'nhà thầu không được thay đổi trọng số' là SAI, đây là phát biểu không đúng theo quy định của Thông tư 79.",
            "Phương án A đúng: lần đầu nhà thầu nhập trọng số là đơn giá dự kiến chào.\n"
            "Phương án C đúng: nhà thầu cần nghiên cứu công thức tính thành tiền từ trọng số để đề xuất phù hợp.\n"
            "Phương án D đúng: nhà thầu phải điền trọng số đơn giá (N1, N2,...) theo từng hạng mục.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    # Q358 – Lần đầu nhập trọng số = đơn giá dự kiến chào cho từng hạng mục
    q = by[358]
    ex[358] = (
        block(
            "C",
            q["options"][2],
            "Thông tư số 79/2025/TT-BTC (hướng dẫn nhập trọng số trong CGTT rút gọn).",
            "Trong lần chào giá đầu tiên của chào giá trực tuyến rút gọn, nhà thầu cần nhập trọng số cho từng hạng mục hàng hóa. Trọng số là đơn giá dự kiến nhà thầu sẽ chào cho hạng mục đó. Hệ thống sử dụng các trọng số này cùng với khối lượng để tính thành tiền và giá dự thầu tổng thể.",
            "Phương án A sai vì nhập ngẫu nhiên là không hợp lệ và không có ý nghĩa kinh tế.\n"
            "Phương án B sai vì trọng số là đơn giá, không phải khối lượng từng hạng mục.\n"
            "Phương án D sai vì Hệ thống không tự động tính trọng số – nhà thầu phải chủ động nhập.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    # Q359 – Sai khác Mẫu 10B vs tài liệu đính kèm → đánh giá theo Mẫu 10B (trừ khi nhãn/hãng không tồn tại)
    q = by[359]
    ex[359] = (
        block(
            "B",
            q["options"][1],
            "Thông tư số 79/2025/TT-BTC; Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (Mẫu số 10B Chương IV).",
            "Khi có sự sai khác giữa thông tin kê khai trong Mẫu số 10B và tài liệu đính kèm, tổ chuyên gia đánh giá theo thông tin nhà thầu đã kê khai trong Mẫu 10B (dữ liệu webform chính thức). Ngoại lệ duy nhất: nếu ký mã hiệu, nhãn hiệu, hãng sản xuất kê khai tại Mẫu 10B không tồn tại trên thị trường thì không được đánh giá theo thông tin đó.",
            "Phương án A sai vì không đánh giá theo tài liệu đính kèm khi có sai khác – ưu tiên Mẫu 10B.\n"
            "Phương án C sai vì sai khác thông tin không tự động dẫn đến loại nhà thầu – phải theo quy tắc ưu tiên Mẫu 10B.\n"
            "Phương án D sai vì A và B không thể đồng thời đúng; chỉ B là đúng.",
        ),
        "Thông tư số 79/2025/TT-BTC; Mẫu E-HSMT",
    )

    # Q360 – Chào "theo catalog đính kèm" thay vì kê khai Mẫu 10B → E-HSDT không được xem xét
    q = by[360]
    ex[360] = (
        block(
            "C",
            q["options"][2],
            "Thông tư số 79/2025/TT-BTC; Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (Mẫu số 10B Chương IV).",
            "Theo quy định, nhà thầu bắt buộc phải kê khai đầy đủ thông tin về hàng hóa (ký mã hiệu, nhãn hiệu, hãng sản xuất, xuất xứ) trực tiếp tại Mẫu số 10B dạng webform trên Hệ thống. Trường hợp nhà thầu A ghi 'theo catalog đính kèm' thay vì điền thông tin vào Mẫu 10B là không tuân thủ yêu cầu của E-HSMT → E-HSDT không được xem xét, đánh giá nội dung đó.",
            "Phương án A sai vì không được đánh giá theo catalog thay thế Mẫu 10B.\n"
            "Phương án B sai vì không có cơ chế cho làm rõ để thay thế kê khai Mẫu 10B – nhà thầu phải tự kê khai.\n"
            "Phương án D sai vì chỉ C đúng.",
        ),
        "Thông tư số 79/2025/TT-BTC; Mẫu E-HSMT",
    )

    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Lot18 filled: {filled}/20")


if __name__ == "__main__":
    main()
