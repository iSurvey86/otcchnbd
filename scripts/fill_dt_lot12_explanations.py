# -*- coding: utf-8 -*-
"""Điền explanation Lô 12 (STT 221–240) theo mẫu 4 khối, căn cứ CSPL local."""
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

    q = by[221]
    ex[221] = (
        block(
            "D",
            q["options"][3],
            "Khoản 2 Điều 103 Nghị định số 214/2025/NĐ-CP.",
            "Thời gian áp dụng mua sắm trực tuyến với hạng mục trong danh mục mua sắm tập trung: (i) thời gian thực hiện hợp đồng nếu không ký thỏa thuận khung nhưng không quá 24 tháng kể từ ngày hợp đồng có hiệu lực, hoặc thời gian hiệu lực thỏa thuận khung; (ii) nếu hợp đồng/thỏa thuận khung chưa công khai thì 24 tháng kể từ ngày đăng tải kết quả LCNT. A và B đều đúng → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C sai vì thiếu điều kiện “hợp đồng, thỏa thuận khung chưa được công khai”.",
        ),
        "Khoản 2 Điều 103 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[222]
    ex[222] = (
        block(
            "D",
            q["options"][3],
            "Thông tư số 79/2025/TT-BTC (quy trình lựa chọn nhà thầu qua mạng trên Hệ thống).",
            "Đối với đấu thầu qua mạng, lập E-HSMT, trình/phê duyệt E-HSMT và phê duyệt kết quả lựa chọn nhà thầu đều thực hiện trên Hệ thống mạng đấu thầu quốc gia. Cả A, B, C đúng → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    q = by[223]
    ex[223] = (
        block(
            "D",
            q["options"][3],
            "Thông tư số 79/2025/TT-BTC (làm rõ E-HSMT trên Hệ thống).",
            "Yêu cầu làm rõ E-HSMT do nhà thầu gửi đến chủ đầu tư qua Hệ thống; chủ đầu tư trả lời yêu cầu làm rõ E-HSMT trên Hệ thống (không do tổ chuyên gia/tư vấn trả lời bằng tài khoản riêng theo cách nêu).",
            "Phương án A sai vì không trả lời bằng văn bản ngoài Hệ thống do tổ chuyên gia.\n"
            "Phương án B sai vì chủ thể trả lời là chủ đầu tư, không phải tổ chuyên gia.\n"
            "Phương án C sai vì tư vấn không thay chủ đầu tư trả lời trên tài khoản tư vấn.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    q = by[224]
    ex[224] = (
        block(
            "D",
            q["options"][3],
            "Thông tư số 79/2025/TT-BTC (sửa đổi E-HSMT sau phát hành).",
            "Khi sửa đổi E-HSMT sau phát hành, chủ đầu tư phải đăng tải trên Hệ thống: quyết định sửa đổi kèm nội dung sửa đổi và E-HSMT đã được sửa đổi. Không yêu cầu đăng tải báo cáo thẩm định E-HSMT sửa đổi theo quy định này. A và B đúng → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C sai vì không bắt buộc đăng tải báo cáo thẩm định theo quy định này.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    q = by[225]
    ex[225] = (
        block(
            "A",
            q["options"][0],
            "Mẫu E-HSMT xây lắp (Mẫu số 3A) ban hành kèm Thông tư số 79/2025/TT-BTC (Mục về bảo đảm dự thầu).",
            "Khi giá trị bảo đảm dự thầu nhỏ hơn 50 triệu đồng, nhà thầu không phải đính kèm thư bảo lãnh/giấy chứng nhận bảo hiểm bảo lãnh mà cam kết trong đơn dự thầu. 40 triệu < 50 triệu → A đúng; các mức ≥ 50 triệu không thuộc trường hợp này.",
            "Phương án B sai vì 50 triệu không nhỏ hơn 50 triệu.\n"
            "Phương án C sai vì 60 triệu ≥ 50 triệu.\n"
            "Phương án D sai vì 100 triệu ≥ 50 triệu.",
        ),
        "Mẫu số 3A E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[226]
    ex[226] = (
        block(
            "B",
            q["options"][1],
            "Mẫu E-HSMT (Mục bảo đảm dự thầu) kèm Thông tư số 79/2025/TT-BTC.",
            "Bản gốc thư bảo lãnh dự thầu/giấy chứng nhận bảo hiểm bảo lãnh (bản giấy) được nộp cho chủ đầu tư khi nhà thầu được mời vào đối chiếu tài liệu (hoặc khi thuộc trường hợp không được hoàn trả BDDT).",
            "Phương án A sai vì không gửi qua email tổ trưởng tổ chuyên gia.\n"
            "Phương án C sai vì không gửi bản gốc theo địa chỉ bên mời thầu như đấu thầu không qua mạng.\n"
            "Phương án D sai vì không nộp cho đơn vị tư vấn đánh giá.",
        ),
        "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[227]
    ex[227] = (
        block(
            "D",
            q["options"][3],
            "Thông tư số 79/2025/TT-BTC (mở thầu qua mạng).",
            "Chủ đầu tư phải mở thầu và công khai biên bản mở thầu trên Hệ thống trong thời hạn 02 giờ kể từ thời điểm đóng thầu (một giai đoạn một túi hồ sơ).",
            "Phương án A sai vì không phải Hệ thống tự động mở thầu.\n"
            "Phương án B sai vì thời hạn là 02 giờ, không phải 04 giờ.\n"
            "Phương án C sai vì chủ thể mở thầu là chủ đầu tư, không phải tổ chuyên gia.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    q = by[228]
    ex[228] = (
        block(
            "C",
            q["options"][2],
            "Khoản 32 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Trong quá trình đánh giá E-HSDT mà chưa có kết quả LCNT, nhà thầu có tên trong biên bản mở thầu bị khóa tài khoản thì E-HSDT không được tiếp tục xem xét, đánh giá.",
            "Phương án A sai vì không tiếp tục đánh giá.\n"
            "Phương án B sai vì không tiếp tục đánh giá kèm điều kiện mở khóa trước ký HĐ.\n"
            "Phương án D sai vì bị khóa tài khoản không đương nhiên là hành vi gian lận dẫn đến cấm theo cách nêu.",
        ),
        "Khoản 32 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[229]
    ex[229] = (
        block(
            "C",
            q["options"][2],
            "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (nộp, rút, sửa đổi E-HSDT).",
            "Nhà thầu chỉ được rút, sửa đổi, nộp lại E-HSDT trước thời điểm đóng thầu; sau đóng thầu không rút được E-HSDT trên Hệ thống. Nhà thầu cũng không thể tự làm rõ E-HSDT sau đóng thầu.",
            "Phương án A sai vì sau đóng thầu không thay đổi nội dung E-HSDT.\n"
            "Phương án B sai vì nhà thầu không tự làm rõ sau đóng thầu.\n"
            "Phương án D sai vì vẫn có thể mở thầu khi chỉ có 01 nhà thầu theo quy định xử lý tình huống.",
        ),
        "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[230]
    ex[230] = (
        block(
            "A",
            q["options"][0],
            "Điều 6 Thông tư số 79/2025/TT-BTC.",
            "Khi Hệ thống gặp sự cố ngoài khả năng kiểm soát, các gói thầu có thời điểm đóng thầu, thời điểm kết thúc chào giá trực tuyến… trong khoảng từ khi sự cố đến sau hoàn thành khắc phục 02 giờ được Hệ thống tự động gia hạn (thời điểm mới sau 06 giờ kể từ khi khắc phục xong). Không gồm thời điểm đăng tải kết quả LCNT như phương án B.",
            "Phương án B sai vì không lấy mốc đăng tải kết quả LCNT để tự động gia hạn theo Điều 6.\n"
            "Phương án C sai vì cửa sổ sự cố là 02 giờ, không phải 04 giờ.\n"
            "Phương án D sai vì A đúng.",
        ),
        "Điều 6 Thông tư số 79/2025/TT-BTC",
    )

    q = by[231]
    ex[231] = (
        block(
            "D",
            q["options"][3],
            "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC.",
            "Khi tham dự thầu qua mạng: nhà thầu chịu trách nhiệm về tính chính xác thông tin trên webform và file đính kèm; chỉ nộp một bộ E-HSDT cho một E-TBMT; chỉ được rút/sửa đổi/nộp lại trước đóng thầu. Cả 3 đúng → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[232]
    ex[232] = (
        block(
            "C",
            q["options"][2],
            "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (sửa đổi, nộp lại E-HSDT).",
            "Nếu nhà thầu đã nộp E-HSDT trước khi chủ đầu tư sửa đổi E-HSMT thì phải nộp lại E-HSDT mới phù hợp E-HSMT đã sửa đổi. Lỗi kỹ thuật mở file hay sự cố tự động gia hạn không đương nhiên buộc nộp lại theo cách nêu ở A/B.",
            "Phương án A sai vì không phải trường hợp bắt buộc nộp lại theo quy định này.\n"
            "Phương án B sai vì gia hạn do sự cố không đồng nghĩa phải nộp lại E-HSDT đã nộp.\n"
            "Phương án D sai vì chỉ C đúng.",
        ),
        "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[233]
    ex[233] = (
        block(
            "D",
            q["options"][3],
            "Khoản 4 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Khi đóng thầu không có nhà thầu tham dự: chủ đầu tư có thể hủy thông báo mời thầu để mời lại, hoặc gia hạn đóng thầu tối thiểu 05 ngày làm việc với gói XL/hỗn hợp ≤ 20 tỷ, HH/PTV ≤ 10 tỷ (và một số trường hợp mời QT/ST). A và C đúng; không chuyển sang đấu thầu rộng rãi không qua mạng như B. → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B sai vì không chuyển hình thức không qua mạng theo khoản 4.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Khoản 4 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[234]
    ex[234] = (
        block(
            "B",
            q["options"][1],
            "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (làm rõ E-HSDT).",
            "Khi có sự không thống nhất giữa thông tin hợp đồng tương tự trên webform và file chứng minh, chủ đầu tư yêu cầu nhà thầu làm rõ E-HSDT trên Hệ thống — không loại ngay và không yêu cầu bổ sung bản giấy ngoài Hệ thống theo cách nêu.",
            "Phương án A sai vì không đánh giá không đạt ngay khi chưa làm rõ.\n"
            "Phương án C sai vì làm rõ trên Hệ thống, không yêu cầu gửi bản giấy để đánh giá.\n"
            "Phương án D sai vì B đúng.",
        ),
        "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[235]
    ex[235] = (
        block(
            "D",
            q["options"][3],
            "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (làm rõ E-HSDT).",
            "Chủ đầu tư dành cho nhà thầu không ít hơn 03 ngày làm việc để thực hiện làm rõ E-HSDT. Không giới hạn theo hướng chỉ được làm rõ tư cách/NLKN hoặc chỉ kỹ thuật/tài chính như A/B; cũng không phải “tối đa 03 ngày” như C.",
            "Phương án A sai vì không cấm làm rõ kỹ thuật/tài chính theo cách nêu.\n"
            "Phương án B sai vì không cấm làm rõ tư cách/NLKN theo cách nêu.\n"
            "Phương án C sai vì là tối thiểu (không ít hơn), không phải tối đa 03 ngày.",
        ),
        "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[236]
    ex[236] = (
        block(
            "D",
            q["options"][3],
            "Điều 5 Thông tư số 79/2025/TT-BTC.",
            "File đính kèm phải mở được bằng phần mềm thông dụng, dùng Unicode, nén mở được bằng ZIP/Rar/7Zip thông dụng và không bị nhiễm virus, lỗi, hỏng, không đặt mật khẩu. File nhiễm virus/lỗi/hỏng không được xem xét, đánh giá.",
            "Phương án A sai vì đây là file hợp lệ được xem xét.\n"
            "Phương án B sai vì Unicode là yêu cầu hợp lệ.\n"
            "Phương án C sai vì file nén mở được bằng phần mềm thông dụng là hợp lệ.",
        ),
        "Điều 5 Thông tư số 79/2025/TT-BTC",
    )

    q = by[237]
    ex[237] = (
        block(
            "C",
            q["options"][2],
            "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (nguyên tắc đánh giá E-HSDT).",
            "Hệ thống tự động đánh giá một số nội dung như lịch sử không hoàn thành hợp đồng, nghĩa vụ thuế, kết quả hoạt động tài chính, doanh thu bình quân hằng năm. Bảo đảm dự thầu và thỏa thuận liên danh không thuộc nhóm tự động đánh giá như doanh thu.",
            "Phương án A sai vì bảo đảm dự thầu không do Hệ thống tự động đánh giá theo cách nêu.\n"
            "Phương án B sai vì thỏa thuận liên danh không do Hệ thống tự động đánh giá.\n"
            "Phương án D sai vì chỉ C đúng.",
        ),
        "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[238]
    ex[238] = (
        block(
            "D",
            q["options"][3],
            "Mẫu báo cáo đánh giá E-HSDT (Mẫu BCĐG) ban hành kèm Thông tư số 79/2025/TT-BTC.",
            "Từ 2021 trở đi: Hệ thống đánh giá theo thông tin trích xuất hoặc do nhà thầu cập nhật; trước 2021: theo thông tin nhà thầu kê khai; hộ kinh doanh không đánh giá tiêu chí kết quả hoạt động tài chính. Cả A, B, C đúng → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Mẫu BCĐG kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[239]
    ex[239] = (
        block(
            "D",
            q["options"][3],
            "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (nội dung Hệ thống đánh giá không đạt — tổ chuyên gia không sửa thành đạt).",
            "Các nội dung Hệ thống đánh giá tự động mà tổ chuyên gia không thể sửa từ không đạt thành đạt gồm: tư cách hợp lệ; không có nhân sự bị Tòa án kết án vi phạm đấu thầu gây hậu quả nghiêm trọng; lịch sử không hoàn thành hợp đồng do lỗi nhà thầu; nghĩa vụ kê khai/nộp thuế; kết quả hoạt động tài chính; doanh thu bình quân hằng năm.",
            "Phương án A sai vì thiếu lịch sử không hoàn thành HĐ/thuế/tài chính; thừa/thiếu không khớp đủ danh mục.\n"
            "Phương án B sai vì đưa bảo đảm dự thầu vào danh mục không sửa được.\n"
            "Phương án C sai vì đưa trạng thái tạm ngừng/chấm dứt tham gia Hệ thống thay cho lịch sử không hoàn thành hợp đồng.",
        ),
        "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[240]
    ex[240] = (
        block(
            "A",
            q["options"][0],
            "Thông tư số 79/2025/TT-BTC (Quy trình 02 đánh giá E-HSDT).",
            "Quy trình 02 áp dụng với gói HH/PTV/máy đặt-máy mượn, một giai đoạn một túi hồ sơ, phương pháp giá thấp nhất và nhà thầu/E-HSDT không có bất kỳ ưu đãi nào. Phương án A khớp. B dùng giá đánh giá; C là xây lắp (không thuộc quy trình 02); D có ưu đãi như nhau (không thỏa “không có ưu đãi”).",
            "Phương án B sai vì dùng phương pháp giá đánh giá.\n"
            "Phương án C sai vì xây lắp không thuộc phạm vi quy trình 02.\n"
            "Phương án D sai vì vẫn có ưu đãi (dù như nhau), không thỏa điều kiện không có ưu đãi.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Lot12 filled: {filled}/20")


if __name__ == "__main__":
    main()
