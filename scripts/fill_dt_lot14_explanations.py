# -*- coding: utf-8 -*-
"""Điền explanation Lô 14 (STT 261–280) theo mẫu 4 khối, căn cứ CSPL local."""
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

    q = by[261]
    ex[261] = (
        block(
            "A",
            q["options"][0],
            "Điểm a Khoản 4 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Khi tại thời điểm đóng thầu không có nhà thầu tham dự, chủ đầu tư có thể hủy thông báo mời thầu (E-TBMT) để mời thầu lại. Không hủy sau mở thầu theo cách nêu ở B; phương án C không phải quy định xử lý tình huống tại khoản 4 Điều 140.",
            "Phương án B sai vì không hủy E-TBMT sau mở thầu theo điểm a khoản 4.\n"
            "Phương án C sai vì không phải căn cứ hủy theo khoản 4 Điều 140.\n"
            "Phương án D sai vì chỉ A đúng.",
        ),
        "Điểm a Khoản 4 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[262]
    ex[262] = (
        block(
            "D",
            q["options"][3],
            "Quy định về trách nhiệm theo dõi thông tin trên Hệ thống Nghị định số 214/2025/NĐ-CP; Mục về sửa đổi E-HSMT trong Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC.",
            "Nhà thầu phải theo dõi/cập nhật thông tin sửa đổi E-HSMT, thay đổi thời điểm đóng thầu trên Hệ thống và tự chịu bất lợi nếu không cập nhật. Hệ thống đồng thời gửi thông báo (email) cho nhà thầu quan tâm. A, B, C đều đúng → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Nghị định số 214/2025/NĐ-CP; Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[263]
    ex[263] = (
        block(
            "A",
            q["options"][0],
            "Thông tư số 79/2025/TT-BTC (quy định về E-HSMT không đầy đủ thông tin).",
            "E-HSMT thiếu thiết kế/bản vẽ/tài liệu hoặc thông tin không rõ ràng gây khó chuẩn bị E-HSDT thì không hợp lệ; chủ đầu tư phải sửa đổi, bổ sung cho phù hợp và đăng tải lại E-HSMT.",
            "Phương án B sai vì không đủ ở mức chỉ “bổ sung/sửa đổi” mà không đăng tải lại.\n"
            "Phương án C sai vì không chỉ đính kèm thêm thành phần thiếu.\n"
            "Phương án D sai vì không mặc định hủy thầu trong tình huống này.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    q = by[264]
    ex[264] = (
        block(
            "A",
            q["options"][0],
            "Điều 32 Thông tư số 79/2025/TT-BTC; Điểm i Khoản 2 Điều 50 VBHN Luật Đấu thầu.",
            "Bắt buộc ký hợp đồng điện tử trên Hệ thống đối với gói DTRR, hạn chế, CHCT, CGTT, mua sắm trực tuyến mà thanh toán qua Kho bạc nhà nước. Không bắt buộc khi thanh toán không qua Kho bạc; không phải mọi gói qua mạng/không qua mạng.",
            "Phương án B sai vì không qua Kho bạc thì chỉ khuyến khích, không bắt buộc.\n"
            "Phương án C sai vì không phải tất cả gói đấu thầu qua mạng.\n"
            "Phương án D sai vì phạm vi quá rộng.",
        ),
        "Điều 32 Thông tư số 79/2025/TT-BTC",
    )

    q = by[265]
    ex[265] = (
        block(
            "A",
            q["options"][0],
            "Thông tư số 79/2025/TT-BTC (đánh giá E-HSDT trên Hệ thống).",
            "Sau khi đánh giá E-HSDT, tổ trưởng tổ chuyên gia đính kèm bản scan báo cáo đánh giá E-HSDT có chữ ký của tất cả thành viên tổ chuyên gia trên Hệ thống.",
            "Phương án B sai vì bắt buộc có chữ ký tất cả thành viên.\n"
            "Phương án C sai vì không chỉ cần chữ ký tổ trưởng.\n"
            "Phương án D sai vì A đúng.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    q = by[266]
    ex[266] = (
        block(
            "D",
            q["options"][3],
            "Khoản 2 Điều 102 và Khoản 4 Điều 100 Nghị định số 214/2025/NĐ-CP; Mẫu CGTT rút gọn kèm Thông tư số 79/2025/TT-BTC.",
            "Gói 02 tỷ thuộc mức đăng tải TBMT tối thiểu 05 ngày làm việc trước ngày bắt đầu CGTT; thời gian CGTT tối thiểu 24 giờ; thời điểm kết thúc phải trong giờ hành chính. Đăng tải 11h Thứ 2 (15/9) → ngày bắt đầu sớm nhất là Thứ 3 (23/9) giờ hành chính → kết thúc sớm nhất sau ≥24 giờ: 08h00 Thứ 4 (24/9).",
            "Phương án A sai vì chưa đủ 05 ngày làm việc và chưa bảo đảm khung thời gian.\n"
            "Phương án B sai vì 08h Thứ 3 (23/9) là mốc bắt đầu khả dĩ, không phải kết thúc sớm nhất hợp lệ.\n"
            "Phương án C sai vì 11h Thứ 3 chưa phải thời điểm kết thúc sớm nhất đúng quy tắc 24 giờ + giờ hành chính.",
        ),
        "Điều 100, Điều 102 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[267]
    ex[267] = (
        block(
            "A",
            q["options"][0],
            "Thông tư số 79/2025/TT-BTC (kê khai trên webform); Mẫu E-HSMT (giảm giá ghi trong đơn dự thầu).",
            "Giảm giá được kê khai trên đơn dự thầu/webform. Bản scan thư giảm giá đính kèm không phải căn cứ đánh giá → tệp tin này không được xem xét, đánh giá.",
            "Phương án B sai vì không đánh giá theo file đính kèm thư giảm giá.\n"
            "Phương án C sai vì không làm rõ theo file scan thư giảm giá.\n"
            "Phương án D sai vì không bổ sung theo file scan thư giảm giá.",
        ),
        "Thông tư số 79/2025/TT-BTC; Mẫu E-HSMT",
    )

    q = by[268]
    ex[268] = (
        block(
            "A",
            q["options"][0],
            "Điểm b Khoản 4 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Gia hạn đóng thầu tối thiểu 05 ngày làm việc chỉ áp dụng gói XL/hỗn hợp ≤ 20 tỷ hoặc HH/PTV ≤ 10 tỷ (và một số trường hợp mời QT/ST). Gói HH 15 tỷ > 10 tỷ → gia hạn tối thiểu 10 ngày.",
            "Phương án B sai vì 05 ngày làm việc không áp dụng với HH 15 tỷ.\n"
            "Phương án C sai vì không phải 05 ngày.\n"
            "Phương án D sai vì không phải 03 ngày làm việc.",
        ),
        "Điểm b Khoản 4 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[269]
    ex[269] = (
        block(
            "A",
            q["options"][0],
            "Khoản 11 Điều 98 Nghị định số 214/2025/NĐ-CP; Khoản 5 Điều 50 VBHN Luật Đấu thầu.",
            "Đấu thầu qua mạng không áp dụng phương thức hai giai đoạn một túi/hai túi hồ sơ. Phương thức áp dụng qua mạng là một giai đoạn (một túi hoặc hai túi tùy gói); trong các phương án, chỉ A (01 giai đoạn, 01 túi hồ sơ) đúng.",
            "Phương án B sai vì 02 giai đoạn 01 túi không đấu thầu trên Hệ thống.\n"
            "Phương án C sai vì 02 giai đoạn 02 túi không đấu thầu trên Hệ thống.\n"
            "Phương án D sai vì B và C không đúng.",
        ),
        "Khoản 11 Điều 98 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[270]
    ex[270] = (
        block(
            "D",
            q["options"][3],
            "Khoản 2 Điều 99 Nghị định số 214/2025/NĐ-CP.",
            "CGTT theo quy trình thông thường áp dụng theo tính chất gói (PTV thông dụng, đơn giản; HH thông dụng đã chuẩn hóa…) — không quy định hạn mức giá gói thầu cho dự toán mua sắm như các mức 500 triệu/02 tỷ/05 tỷ.",
            "Phương án A sai vì 500 triệu không phải hạn mức CGTT thông thường.\n"
            "Phương án B sai vì 02 tỷ là hạn mức liên quan CGTT rút gọn/dự toán, không phải CGTT thông thường.\n"
            "Phương án C sai vì 05 tỷ không phải hạn mức CGTT thông thường.",
        ),
        "Khoản 2 Điều 99 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[271]
    ex[271] = (
        block(
            "C",
            q["options"][2],
            "Khoản 2 Điều 102 và Khoản 4 Điều 100 Nghị định số 214/2025/NĐ-CP; Mẫu CGTT rút gọn kèm Thông tư số 79/2025/TT-BTC.",
            "Gói 01 tỷ (< 02 tỷ): đăng tải TBMT tối thiểu 03 ngày làm việc trước ngày bắt đầu CGTT; CGTT tối thiểu 24 giờ; kết thúc trong giờ hành chính. Đăng tải 11h Thứ 2 (15/9) → bắt đầu sớm nhất 11h Thứ 5 (18/9) → kết thúc sớm nhất 11h Thứ 6 (19/9).",
            "Phương án A sai vì 08h Thứ 6 không phải mốc kết thúc sớm nhất khớp 24 giờ từ bắt đầu sớm nhất.\n"
            "Phương án B sai vì Thứ 7 không bảo đảm giờ hành chính/khung tối thiểu đúng cách tính.\n"
            "Phương án D sai vì 08h Thứ 2 tuần sau quá muộn so với mốc sớm nhất.",
        ),
        "Điều 100, Điều 102 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[272]
    ex[272] = (
        block(
            "D",
            q["options"][3],
            "Thông tư số 79/2025/TT-BTC (thành phần E-HSMST, E-HSMT).",
            "Bảng dữ liệu, tiêu chuẩn đánh giá tính hợp lệ, yêu cầu NLKN phải được số hóa dạng webform. Bản đính kèm (không phải webform) của tiêu chuẩn hợp lệ hoặc yêu cầu NLKN không được coi là một phần của E-HSMST/E-HSMT và nhà thầu không phải đáp ứng. B và C đúng; A (webform) là thành phần hợp lệ. → D.",
            "Phương án A sai vì bảng dữ liệu dạng webform là thành phần của E-HSMT.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    q = by[273]
    ex[273] = (
        block(
            "C",
            q["options"][2],
            "Khoản 1 Điều 5 Thông tư số 79/2025/TT-BTC.",
            "File phải: mở được bằng phần mềm thông dụng; dùng Unicode; nén mở được bằng ZIP/Rar/7Zip thông dụng; không nhiễm virus, không lỗi/hỏng, không mật khẩu. Phương án A sai vì nêu “không thuộc Unicode”. Chỉ C đúng hoàn toàn.",
            "Phương án A sai vì bắt buộc dùng Unicode, không phải phông ngoài Unicode.\n"
            "Phương án B gần đúng nhưng câu hỏi chọn yêu cầu đúng; B không phải đáp án khóa.\n"
            "Phương án D sai vì A không đúng nên không thể “các phương án trên đều đúng”.",
        ),
        "Khoản 1 Điều 5 Thông tư số 79/2025/TT-BTC",
    )

    q = by[274]
    ex[274] = (
        block(
            "A",
            q["options"][0],
            "Khoản 2 Điều 5 Thông tư số 79/2025/TT-BTC.",
            "File đính kèm trong E-HSMT không mở/không đọc được thì chủ đầu tư phải đăng tải và phát hành lại toàn bộ E-HSMT.",
            "Phương án B sai vì phải phát hành lại toàn bộ, không chỉ sửa đổi.\n"
            "Phương án C sai vì không phải đề nghị Trung tâm sửa giúp theo cách nêu.\n"
            "Phương án D sai vì chỉ A đúng.",
        ),
        "Khoản 2 Điều 5 Thông tư số 79/2025/TT-BTC",
    )

    q = by[275]
    ex[275] = (
        block(
            "D",
            q["options"][3],
            "Khoản 1 và Khoản 3 Điều 6 Thông tư số 79/2025/TT-BTC.",
            "Khi Hệ thống tự động gia hạn đóng thầu do sự cố, việc đánh giá E-HSDT thực hiện trên cơ sở thời điểm đóng thầu nêu trong E-TBMT trước sự cố hoặc thời điểm đóng thầu mà Hệ thống tự động gia hạn. A và B đều đúng → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C sai vì không do chủ đầu tư tự quyết định mốc đánh giá.",
        ),
        "Khoản 1 và Khoản 3 Điều 6 Thông tư số 79/2025/TT-BTC",
    )

    q = by[276]
    ex[276] = (
        block(
            "C",
            q["options"][2],
            "Khoản 6 Điều 3 Thông tư số 79/2025/TT-BTC.",
            "Chứng thư số sử dụng trên Hệ thống là chứng thư số công cộng do tổ chức cung cấp dịch vụ chứng thực chữ ký số công cộng cấp, hoặc chứng thư số do tổ chức cung cấp dịch vụ chứng thực chữ ký số chuyên dùng Chính phủ cấp.",
            "Phương án A sai vì không phải mọi tổ chức chuyên dùng đều được chấp nhận.\n"
            "Phương án B sai vì không phải tất cả loại chứng thư số.\n"
            "Phương án D sai vì A không đúng.",
        ),
        "Khoản 6 Điều 3 Thông tư số 79/2025/TT-BTC",
    )

    q = by[277]
    ex[277] = (
        block(
            "D",
            q["options"][3],
            "Thông tư số 79/2025/TT-BTC (bảo lãnh dự thầu điện tử trên Hệ thống).",
            "Khi dùng bảo lãnh dự thầu điện tử phát hành/lưu trữ trên Hệ thống, các yếu tố giá trị, thời gian hiệu lực và đối tượng thụ hưởng được kiểm soát để luôn đáp ứng yêu cầu E-HSMT. A, B, C đều đúng → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    q = by[278]
    ex[278] = (
        block(
            "B",
            q["options"][1],
            "Khoản 3 Điều 6 Thông tư số 79/2025/TT-BTC.",
            "Khi Hệ thống gia hạn đóng thầu, đánh giá E-HSDT (gồm BDDT) theo mốc đóng thầu trước sự cố hoặc mốc đóng thầu mới. Nhà thầu A lấy hiệu lực từ 25/9 (mốc cũ) và nhà thầu B từ 26/9 (mốc mới), mỗi bên khớp một trong hai mốc được chấp nhận → cả hai hợp lệ.",
            "Phương án A sai vì A không bị coi không hợp lệ.\n"
            "Phương án C sai vì B không bị coi không hợp lệ.\n"
            "Phương án D sai vì cả hai đều hợp lệ.",
        ),
        "Khoản 3 Điều 6 Thông tư số 79/2025/TT-BTC",
    )

    q = by[279]
    ex[279] = (
        block(
            "C",
            q["options"][2],
            "Điều 59 VBHN Luật Đấu thầu (phương pháp đánh giá gói tư vấn).",
            "Phương pháp giá cố định và phương pháp dựa trên kỹ thuật đều xếp hạng thứ nhất nhà thầu đáp ứng kỹ thuật và có điểm kỹ thuật cao nhất. Điểm chung quyết định xếp thứ nhất là điểm kỹ thuật cao nhất.",
            "Phương án A sai vì giá thấp nhất không phải tiêu chí xếp thứ nhất của hai phương pháp này.\n"
            "Phương án B sai vì điểm tổng hợp cao nhất thuộc phương pháp kết hợp kỹ thuật và giá.\n"
            "Phương án D sai vì giá đề nghị trúng thầu thấp nhất không phải điểm chung của hai phương pháp này.",
        ),
        "Điều 59 VBHN Luật Đấu thầu",
    )

    q = by[280]
    ex[280] = (
        block(
            "C",
            q["options"][2],
            "Khoản 3 Điều 59 VBHN Luật Đấu thầu.",
            "Phương pháp kết hợp giữa kỹ thuật và giá áp dụng đối với gói tư vấn chú trọng tới cả chất lượng và chi phí thực hiện gói thầu.",
            "Phương án A sai vì gói đơn giản, chi phí thấp thiên về phương pháp khác (giá thấp nhất/giá cố định tùy trường hợp).\n"
            "Phương án B sai vì yêu cầu kỹ thuật rất cao, chi phí cố định thiên về giá cố định hoặc dựa trên kỹ thuật.\n"
            "Phương án D sai vì quy trình tiêu chuẩn hóa không phải đặc điểm của phương pháp kết hợp.",
        ),
        "Khoản 3 Điều 59 VBHN Luật Đấu thầu",
    )

    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Lot14 filled: {filled}/20")


if __name__ == "__main__":
    main()
