# -*- coding: utf-8 -*-
"""Điền explanation Lô 10 (STT 181–200) theo mẫu 4 khối, căn cứ CSPL local."""
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

    q = by[181]
    ex[181] = (
        block(
            "A",
            q["options"][0],
            "Điểm b Khoản 1 Điều 139 Nghị định số 214/2025/NĐ-CP.",
            "Gói thầu thuộc phạm vi Điều 1, Điều 2 Luật Đấu thầu do tổ chức, đơn vị thuộc phạm vi quản lý của tỉnh (đơn vị sự nghiệp công lập thuộc tỉnh) là chủ đầu tư thì Hội đồng giải quyết kiến nghị do Giám đốc Sở Tài chính thành lập. Dự án dùng vốn NSNN thuộc phạm vi Luật → Giám đốc Sở Tài chính tỉnh B có trách nhiệm thành lập.",
            "Phương án B sai vì thuộc trách nhiệm thành lập theo điểm b khoản 1 Điều 139.\n"
            "Phương án C sai vì không phụ thuộc yêu cầu của Chủ tịch UBND tỉnh.\n"
            "Phương án D sai vì không phụ thuộc đề nghị của giám đốc doanh nghiệp.",
        ),
        "Điểm b Khoản 1 Điều 139 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[182]
    ex[182] = (
        block(
            "C",
            q["options"][2],
            "Điểm c Khoản 3 Điều 139 Nghị định số 214/2025/NĐ-CP.",
            "Hội đồng giải quyết kiến nghị có quyền yêu cầu nhà thầu, chủ đầu tư và các cá nhân, cơ quan liên quan cung cấp thông tin của gói thầu, dự án và thông tin liên quan khác để thực hiện nhiệm vụ. Không có thẩm quyền hủy thầu hay không công nhận kết quả lựa chọn nhà thầu.",
            "Phương án A sai vì hủy thầu không thuộc quyền của Hội đồng.\n"
            "Phương án B sai vì Hội đồng chỉ đề nghị xem xét tạm dừng ký kết/thực hiện hợp đồng trong trường hợp cần thiết, không phải yêu cầu chủ đầu tư tạm dừng theo cách nêu.\n"
            "Phương án D sai vì không công nhận kết quả thuộc thẩm quyền khác (người có thẩm quyền).",
        ),
        "Điểm c Khoản 3 Điều 139 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[183]
    ex[183] = (
        block(
            "B",
            q["options"][1],
            "Điểm a Khoản 1 Điều 137 Nghị định số 214/2025/NĐ-CP.",
            "Đối với kiến nghị về nội dung HSMT: đơn của cơ quan, tổ chức quan tâm đến gói thầu. Đối với các nội dung khác về quá trình tổ chức lựa chọn nhà thầu: đơn kiến nghị phải là của nhà thầu tham dự thầu.",
            "Phương án A sai vì cá nhân quan tâm không đủ điều kiện theo điểm a.\n"
            "Phương án C sai vì cơ quan/tổ chức quan tâm chỉ áp dụng với kiến nghị về nội dung HSMT.\n"
            "Phương án D sai vì C không đúng với loại kiến nghị này.",
        ),
        "Điểm a Khoản 1 Điều 137 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[184]
    ex[184] = (
        block(
            "D",
            q["options"][3],
            "Khoản 1 và Khoản 2 Điều 138 Nghị định số 214/2025/NĐ-CP.",
            "Nội dung kiến nghị được công khai trên Hệ thống mạng đấu thầu quốc gia; văn bản giải quyết kiến nghị của chủ đầu tư và của người có thẩm quyền cũng được đăng tải trên Hệ thống. Cả A, B, C đều đúng → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Điều 138 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[185]
    ex[185] = (
        block(
            "B",
            q["options"][1],
            "Điểm đ Khoản 2 Điều 137 Nghị định số 214/2025/NĐ-CP.",
            "Nhà thầu có trách nhiệm nộp chi phí giải quyết kiến nghị trong thời hạn 02 ngày làm việc kể từ ngày nhận được thông báo của bộ phận thường trực (bộ phận thường trực thông báo mức/cách nộp trong 03 ngày làm việc kể từ khi nhận đơn).",
            "Phương án A sai vì 03 ngày làm việc là thời hạn bộ phận thường trực gửi thông báo, không phải thời hạn nhà thầu nộp.\n"
            "Phương án C sai vì không phải 04 ngày làm việc.\n"
            "Phương án D sai vì không phải 05 ngày làm việc.",
        ),
        "Điểm đ Khoản 2 Điều 137 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[186]
    ex[186] = (
        block(
            "C",
            q["options"][2],
            "Điều 138 Nghị định số 214/2025/NĐ-CP (quy định về tổ chức, đơn vị, doanh nghiệp nhà nước / đơn vị sự nghiệp công lập chọn áp dụng hoặc ngoài phạm vi nhưng tự áp dụng Luật).",
            "Gói thầu dùng nguồn thu hợp pháp (không dùng NSNN) của đơn vị SNCL: trách nhiệm giải quyết kiến nghị thuộc người đứng đầu đơn vị; người đứng đầu tự ban hành điều kiện, quy trình giải quyết kiến nghị trong đơn vị mình — không áp dụng quy trình CĐT/NCTT theo Luật như A/B.",
            "Phương án A sai vì không mặc định áp dụng quy trình CĐT của Luật trong trường hợp này.\n"
            "Phương án B sai vì không mặc định áp dụng quy trình NCTT của Luật.\n"
            "Phương án D sai vì C đúng.",
        ),
        "Điều 138 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[187]
    ex[187] = (
        block(
            "A",
            q["options"][0],
            "Điểm a Khoản 2 Điều 139 Nghị định số 214/2025/NĐ-CP.",
            "Thành viên Hội đồng giải quyết kiến nghị không được là người có quan hệ gia đình theo Luật Doanh nghiệp với người ký đơn kiến nghị. Con đẻ của ông A (người ký đơn) thuộc quan hệ gia đình → anh C không được tham gia.",
            "Phương án B sai vì đủ NLKN cũng không khắc phục xung đột quan hệ gia đình.\n"
            "Phương án C sai vì Chủ tịch Hội đồng không thể chấp thuận ngoại lệ này.\n"
            "Phương án D sai vì người có thẩm quyền cũng không thể chấp thuận ngoại lệ này.",
        ),
        "Điểm a Khoản 2 Điều 139 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[188]
    ex[188] = (
        block(
            "C",
            q["options"][2],
            "Khoản 2 Điều 139 Nghị định số 214/2025/NĐ-CP.",
            "Bộ phận thường trực giúp việc cho Chủ tịch Hội đồng giải quyết kiến nghị có trách nhiệm tiếp nhận và quản lý chi phí do nhà thầu có kiến nghị nộp.",
            "Phương án A sai vì không phải người có thẩm quyền.\n"
            "Phương án B sai vì không phải chủ đầu tư.\n"
            "Phương án D sai vì không phải tổ chuyên gia.",
        ),
        "Khoản 2 Điều 139 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[189]
    ex[189] = (
        block(
            "A",
            q["options"][0],
            "Khoản 8 Điều 14 Nghị định số 214/2025/NĐ-CP.",
            "Gói một giai đoạn hai túi hồ sơ: nhà thầu không đạt kỹ thuật → không mở hồ sơ đề xuất tài chính → chi phí Hội đồng căn cứ giá gói thầu (100 tỷ đồng). Theo điểm c khoản 8 Điều 14: giá từ 100 tỷ đến dưới 200 tỷ, tỷ lệ 0,02% nhưng tối thiểu 25 triệu → 0,02%×100 tỷ = 20 triệu < mức tối thiểu → nộp 25 triệu đồng.",
            "Phương án B sai vì 22,5 triệu là tính theo giá dự thầu 90 tỷ (điểm b), không áp dụng khi chưa mở HSDX tài chính.\n"
            "Phương án C sai vì 20 triệu là kết quả 0,02% chưa áp dụng mức tối thiểu 25 triệu.\n"
            "Phương án D sai vì không khớp mức tối thiểu/điểm tính.",
        ),
        "Khoản 8 Điều 14 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[190]
    ex[190] = (
        block(
            "D",
            q["options"][3],
            "Khoản 13 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Khi HSMT cho phép đề xuất biện pháp thi công khác, phần sai khác giữa khối lượng theo biện pháp trong HSMT và theo biện pháp nhà thầu đề xuất không bị hiệu chỉnh sai lệch; phần sai khác này không bị tính là sai lệch thiếu.",
            "Phương án A sai vì không bị hiệu chỉnh và không tính sai lệch thừa.\n"
            "Phương án B gần đúng về không hiệu chỉnh nhưng nêu “không tính sai lệch thừa” không khớp quy định “không tính sai lệch thiếu”.\n"
            "Phương án C sai vì không bị hiệu chỉnh thành sai lệch thiếu.",
        ),
        "Khoản 13 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[191]
    ex[191] = (
        block(
            "A",
            q["options"][0],
            "Khoản 11 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Khi giá dự thầu sau sửa lỗi, hiệu chỉnh sai lệch, trừ giảm giá (nếu có) thấp khác thường, để đề phòng rủi ro chủ đầu tư có thể quy định giá trị bảo đảm thực hiện hợp đồng lớn hơn 10% nhưng không quá 30% giá hợp đồng.",
            "Phương án B sai vì vượt mức tối đa 30%.\n"
            "Phương án C sai vì vượt mức tối đa 30%.\n"
            "Phương án D sai vì vượt mức tối đa 30%.",
        ),
        "Khoản 11 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[192]
    ex[192] = (
        block(
            "D",
            q["options"][3],
            "Điểm thuộc Khoản 10 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Đối với gói thầu chia phần, chủ đầu tư có thể phê duyệt kết quả lựa chọn nhà thầu cho từng phần với điều kiện giá đề nghị trúng thầu không vượt giá của phần đó trong giá gói thầu.",
            "Phương án A sai vì được phép phê duyệt từng phần.\n"
            "Phương án B sai vì điều kiện so với cả giá gói thầu, không phải “không vượt giá gói thầu” nói chung.\n"
            "Phương án C sai vì không có điều kiện tiết kiệm tối thiểu 5%.",
        ),
        "Khoản 10 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[193]
    ex[193] = (
        block(
            "A",
            q["options"][0],
            "Điểm a Khoản 10 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Khi một phần hoặc nhiều phần không có nhà thầu tham dự (hoặc không có nhà thầu đáp ứng), chủ đầu tư tách phần đó ra thành gói thầu riêng biệt để tổ chức lựa chọn nhà thầu theo quy định.",
            "Phương án B sai vì không mặc định hủy thầu toàn bộ.\n"
            "Phương án C sai vì không đàm phán giao cho nhà thầu phần khác.\n"
            "Phương án D sai vì B và C đều không đúng.",
        ),
        "Điểm a Khoản 10 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[194]
    ex[194] = (
        block(
            "A",
            q["options"][0],
            "Điểm a Khoản 3 Điều 88 VBHN Luật Đấu thầu.",
            "Với lựa chọn nhà thầu, người quyết định xử lý tình huống là chủ đầu tư. Trong trường hợp phức tạp, chủ đầu tư quyết định xử lý tình huống sau khi có ý kiến của người có thẩm quyền.",
            "Phương án B sai vì không phải NCTT quyết định sau ý kiến tổ chuyên gia.\n"
            "Phương án C sai vì đảo vai trò CĐT và NCTT.\n"
            "Phương án D sai vì không yêu cầu ý kiến đồng thời của CĐT và tổ chuyên gia theo cách nêu.",
        ),
        "Điểm a Khoản 3 Điều 88 VBHN Luật Đấu thầu",
    )

    q = by[195]
    ex[195] = (
        block(
            "B",
            q["options"][1],
            "Điểm c Khoản 22 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Khi chấm dứt hợp đồng với một/một số thành viên liên danh vi phạm: chỉ thành viên vi phạm bị coi là không hoàn thành hợp đồng và bị chủ đầu tư đăng tải trên Hệ thống mạng đấu thầu quốc gia; thành viên còn lại tiếp tục thực hiện phần công việc đảm nhận.",
            "Phương án A sai vì không coi cả liên danh là không hoàn thành hợp đồng.\n"
            "Phương án C sai vì đơn vị đăng tải là chủ đầu tư, không phải bên mời thầu.\n"
            "Phương án D sai vì vừa sai phạm vi liên danh vừa sai chủ thể đăng tải.",
        ),
        "Khoản 22 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[196]
    ex[196] = (
        block(
            "A",
            q["options"][0],
            "Khoản 20 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Khi áp dụng chỉ định thầu phần công việc chưa thực hiện sau khi chấm dứt hợp đồng với nhà thầu vi phạm, giá trị phần công việc chưa thực hiện được tính bằng giá trị ghi trong hợp đồng trừ đi giá trị phần công việc đã thực hiện trước đó.",
            "Phương án B sai vì không cập nhật giá hợp đồng tại thời điểm chỉ định.\n"
            "Phương án C sai vì không tính theo giá trị còn lại cập nhật giá.\n"
            "Phương án D sai vì không trừ theo dự toán được duyệt thay cho giá trị đã thực hiện theo hợp đồng.",
        ),
        "Khoản 20 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[197]
    ex[197] = (
        block(
            "D",
            q["options"][3],
            "Khoản 24 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Khi cần đẩy nhanh tiến độ so với hợp đồng đã ký (sửa đổi hợp đồng), chủ đầu tư và nhà thầu được thỏa thuận điều chỉnh phạm vi công việc giữa các thành viên liên danh phù hợp với tiến độ hoặc tiến độ được rút ngắn (bảo đảm năng lực thành viên nhận việc bổ sung, không nhằm chuyển nhượng thầu).",
            "Phương án A sai vì không được tự thỏa thuận mà không có chủ đầu tư.\n"
            "Phương án B sai vì không đủ ở mức chỉ thông báo cho chủ đầu tư.\n"
            "Phương án C sai vì không bắt buộc phải được người có thẩm quyền cho phép theo quy định này.",
        ),
        "Khoản 24 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[198]
    ex[198] = (
        block(
            "D",
            q["options"][3],
            "Khoản 26 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Nhân sự nhà thầu bị cơ quan điều tra kết luận vi phạm đấu thầu gây hậu quả nghiêm trọng theo pháp luật hình sự nhằm mục đích cho nhà thầu trúng thầu, nhưng chưa bị Tòa án kết án hoặc nhà thầu chưa bị NCTT ra quyết định cấm → nhà thầu vẫn được tiếp tục tham dự thầu.",
            "Phương án A sai vì chưa đến mức bị cấm/kết án thì vẫn được tham dự.\n"
            "Phương án B sai vì không quy định mở nhưng không đánh giá.\n"
            "Phương án C sai vì không trả lại HSDT theo nguyên trạng trong trường hợp này.",
        ),
        "Khoản 26 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[199]
    ex[199] = (
        block(
            "A",
            q["options"][0],
            "Khoản 27 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Chủ đầu tư được chấp thuận thay đổi hàng hóa phiên bản/năm sản xuất mới hơn nếu đáp ứng đủ điều kiện, trong đó hàng hóa thay thế và hàng hóa trong hợp đồng cùng hãng sản xuất và cùng xuất xứ; tính năng kỹ thuật, cấu hình, thông số và yêu cầu kỹ thuật khác tương đương hoặc tốt hơn.",
            "Phương án B sai vì vẫn bắt buộc cùng xuất xứ.\n"
            "Phương án C sai vì vẫn bắt buộc cùng hãng sản xuất.\n"
            "Phương án D sai vì bắt buộc cùng hãng và cùng xuất xứ.",
        ),
        "Khoản 27 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[200]
    ex[200] = (
        block(
            "A",
            q["options"][0],
            "Khoản 31 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Gói đặc thù áp dụng chỉ định thầu hoặc lựa chọn nhà thầu trong trường hợp đặc biệt: nếu nhà thầu nước ngoài ràng buộc chỉ ký hợp đồng khi không phải đăng ký trên Hệ thống mạng đấu thầu quốc gia thì khi đăng tải kết quả, chủ đầu tư không cần yêu cầu nhà thầu nước ngoài đăng ký.",
            "Phương án B sai vì không bắt buộc yêu cầu đăng ký trong tình huống này.\n"
            "Phương án C sai vì không loại nhà thầu vì lý do này.\n"
            "Phương án D sai vì không hủy thầu vì lý do này.",
        ),
        "Khoản 31 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Lot10 filled: {filled}/20")


if __name__ == "__main__":
    main()
