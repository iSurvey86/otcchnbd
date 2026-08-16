# -*- coding: utf-8 -*-
"""Điền explanation Lô 11 (STT 201–220) theo mẫu 4 khối, căn cứ CSPL local."""
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

    q = by[201]
    ex[201] = (
        block(
            "C",
            q["options"][2],
            "Khoản 6 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Đối với trường hợp hủy thầu theo khoản 1 Điều 17 Luật Đấu thầu (và xử lý tình huống theo khoản 4 Điều 140), không phải điều chỉnh thời gian bắt đầu tổ chức lựa chọn nhà thầu trong kế hoạch lựa chọn nhà thầu.",
            "Phương án A sai vì không bắt buộc điều chỉnh thời gian bắt đầu tổ chức LCNT.\n"
            "Phương án B sai vì không phải giải pháp bắt buộc theo khoản 6 Điều 140.\n"
            "Phương án D sai vì C đúng.",
        ),
        "Khoản 6 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[202]
    ex[202] = (
        block(
            "B",
            q["options"][1],
            "Khoản 3 Điều 17 VBHN Luật Đấu thầu.",
            "Hủy thầu được thực hiện từ ngày phát hành HSMST/HSMQT/HSMT/HS yêu cầu đến trước khi ký kết hợp đồng, thỏa thuận khung đối với mua sắm tập trung.",
            "Phương án A sai vì khoảng thời gian quá hẹp (chỉ từ đóng thầu đến có kết quả).\n"
            "Phương án C sai vì bắt đầu từ đóng thầu, không đúng.\n"
            "Phương án D sai vì hủy thầu không thực hiện sau khi đã ký kết hợp đồng/thỏa thuận khung.",
        ),
        "Khoản 3 Điều 17 VBHN Luật Đấu thầu",
    )

    q = by[203]
    ex[203] = (
        block(
            "C",
            q["options"][2],
            "Khoản 32 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Trong quá trình đánh giá E-HSDT mà chưa có kết quả LCNT, nếu nhà thầu có tên trong biên bản mở thầu bị khóa tài khoản thì hồ sơ dự thầu của nhà thầu không được tiếp tục xem xét, đánh giá.",
            "Phương án A sai vì không yêu cầu mở khóa để tiếp tục đánh giá.\n"
            "Phương án B sai vì không tiếp tục đánh giá.\n"
            "Phương án D sai vì vừa không tiếp tục đánh giá vừa không gắn điều kiện mở khóa.",
        ),
        "Khoản 32 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[204]
    ex[204] = (
        block(
            "D",
            q["options"][3],
            "Khoản 29 Điều 140 Nghị định số 214/2025/NĐ-CP; Điểm b Khoản 1 Điều 17 VBHN Luật Đấu thầu.",
            "Với gói xây lắp/PTV/TV áp dụng đấu thầu trước (Điều 42 Luật): nếu dự án được duyệt làm tăng giá gói thầu (hoặc dự toán) từ 30% trở lên hoặc thay đổi tiêu chuẩn đánh giá kỹ thuật quan trọng/cấp công trình trong HSMT đã phát hành thì chủ đầu tư hủy thầu.",
            "Phương án A sai vì không tiếp tục đánh giá trong tình huống này.\n"
            "Phương án B sai vì không xử lý bằng sửa đổi/phát hành bổ sung thay cho hủy thầu.\n"
            "Phương án C sai vì không hoàn thiện hợp đồng bằng cách bổ sung khối lượng theo hướng này.",
        ),
        "Khoản 29 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[205]
    ex[205] = (
        block(
            "A",
            q["options"][0],
            "Khoản 19 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Nhà thầu trúng thầu không hoàn thiện/ký kết hợp đồng hoặc tại thời điểm ký kết không đáp ứng NLKT, tài chính theo khoản 2 Điều 66 Luật: chủ đầu tư hủy quyết định phê duyệt kết quả LCNT trước đó và mời nhà thầu xếp hạng tiếp theo (nếu có) vào hoàn thiện hợp đồng.",
            "Phương án B sai vì không mặc định hủy thầu toàn bộ.\n"
            "Phương án C sai vì không dùng biện pháp không công nhận kết quả trong tình huống này.\n"
            "Phương án D sai vì không phải đình chỉ cuộc thầu.",
        ),
        "Khoản 19 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[206]
    ex[206] = (
        block(
            "C",
            q["options"][2],
            "Khoản 24 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Chủ đầu tư và nhà thầu được thỏa thuận điều chỉnh phạm vi công việc giữa các thành viên liên danh khi cần đẩy nhanh tiến độ hoặc do điều kiện khách quan không phải lỗi của nhà thầu (bảo đảm năng lực thành viên nhận việc bổ sung, không nhằm chuyển nhượng thầu).",
            "Phương án A sai vì lý do “không muốn tiếp tục” không đủ điều kiện.\n"
            "Phương án B sai vì không được điều chuyển toàn bộ chỉ vì CĐT muốn.\n"
            "Phương án D sai vì chuyển nhượng để tiết kiệm chi phí trái quy định.",
        ),
        "Khoản 24 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[207]
    ex[207] = (
        block(
            "A",
            q["options"][0],
            "Khoản 11 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Quy định bảo đảm thực hiện hợp đồng lớn hơn 10% nhưng không quá 30% chỉ áp dụng khi giá dự thầu thấp khác thường ảnh hưởng chất lượng, hoặc gói xây lắp/EC có giá sau sửa lỗi/hiệu chỉnh/trừ giảm giá thấp hơn 80% giá gói thầu. Giá bằng 85% giá gói thầu không thuộc ngưỡng <80% → không được lấy căn cứ này để quy định mức 15%.",
            "Phương án B sai vì không phụ thuộc đồng ý của nhà thầu.\n"
            "Phương án C sai vì không thuộc tình huống cho phép nâng mức BDTHĐ theo khoản 11.\n"
            "Phương án D sai vì không khắc phục bằng chấp thuận của NCTT theo quy định này.",
        ),
        "Khoản 11 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[208]
    ex[208] = (
        block(
            "A",
            q["options"][0],
            "Khoản 16 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Gói áp dụng thương thảo hợp đồng: nếu nhà thầu xếp hạng thứ nhất không thương thảo / không ký biên bản / thương thảo không thành công thì chủ đầu tư mời nhà thầu xếp hạng tiếp theo (nếu có) vào thương thảo.",
            "Phương án B sai vì không mặc định hủy thầu.\n"
            "Phương án C sai vì không phải cho chào lại giá trong tình huống này.\n"
            "Phương án D sai vì bước tiếp theo là thương thảo, không phải hoàn thiện hợp đồng.",
        ),
        "Khoản 16 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[209]
    ex[209] = (
        block(
            "D",
            q["options"][3],
            "Khoản 12 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Gói xây lắp/hỗn hợp đấu thầu quốc tế có dự toán: HSDT không cân bằng → chủ đầu tư có thể yêu cầu nhà thầu làm rõ bằng văn bản các chi phí cấu thành giá dự thầu; đồng thời có thể quy định BDTHĐ lớn hơn 10% nhưng không quá 30% giá hợp đồng để đề phòng rủi ro. A và B đều đúng → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C sai vì không phải mời chào lại giá theo khoản 12.",
        ),
        "Khoản 12 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[210]
    ex[210] = (
        block(
            "B",
            q["options"][1],
            "Khoản 15 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Khi chi nhánh, xí nghiệp, văn phòng đại diện được tách ra khỏi pháp nhân, nhà thầu tiếp nhận hoặc hình thành từ đó được kế thừa năng lực, kinh nghiệm trong đấu thầu mà đơn vị đó đã thực hiện.",
            "Phương án A sai vì được kế thừa.\n"
            "Phương án C sai vì kế thừa cả năng lực và kinh nghiệm, không chỉ kinh nghiệm.\n"
            "Phương án D sai vì không chỉ kế thừa năng lực.",
        ),
        "Khoản 15 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[211]
    ex[211] = (
        block(
            "D",
            q["options"][3],
            "Điểm b Khoản 22 Điều 140 Nghị định số 214/2025/NĐ-CP.",
            "Khi một/một số thành viên liên danh vi phạm hợp đồng: tịch thu BDTHĐ của tất cả thành viên nếu phần việc còn lại tách thành gói riêng; nếu phần việc được giao cho thành viên còn lại đủ NLKN thì chỉ tịch thu BDTHĐ của thành viên vi phạm. B và C đều đúng → D.",
            "Phương án A sai vì vẫn có trường hợp tịch thu BDTHĐ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Khoản 22 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[212]
    ex[212] = (
        block(
            "C",
            q["options"][2],
            "Mẫu E-HSMT hàng hóa/thiết bị y tế (ví dụ Mẫu số 4A/4B hoặc mẫu tương ứng) ban hành kèm Thông tư số 79/2025/TT-BTC.",
            "Nhà thầu phải đề xuất cụ thể ký mã hiệu (nếu có), nhãn hiệu, xuất xứ, hãng sản xuất. Không đề xuất cụ thể thì E-HSDT không được xem xét, đánh giá → bị đánh giá không đáp ứng và loại.",
            "Phương án A sai vì không xử lý bằng yêu cầu bổ sung/làm rõ để khắc phục thiếu đề xuất bắt buộc này.\n"
            "Phương án B sai vì không tiếp tục đánh giá rồi mới yêu cầu khi xếp thứ nhất.\n"
            "Phương án D sai vì không cần xin ý kiến NCTT trong tình huống này.",
        ),
        "Mẫu E-HSMT hàng hóa/TBYT kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[213]
    ex[213] = (
        block(
            "D",
            q["options"][3],
            "Điều 8 Thông tư số 79/2025/TT-BTC.",
            "Văn bản điện tử trên Hệ thống có giá trị pháp lý, làm cơ sở đối chiếu/xác thực; thời điểm gửi/nhận căn cứ thời gian thực trên Hệ thống; cơ quan giải ngân/thanh tra/kiểm toán không được yêu cầu cung cấp văn bản giấy khi có thể tra cứu văn bản điện tử trên Hệ thống (trừ khi cần xác nhận bản gốc). Cả 3 nhận định đều đúng → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Điều 8 Thông tư số 79/2025/TT-BTC",
    )

    q = by[214]
    ex[214] = (
        block(
            "C",
            q["options"][2],
            "Khoản 10 Điều 3 Thông tư số 79/2025/TT-BTC.",
            "Tài khoản nghiệp vụ là tài khoản được tạo bởi Tài khoản tham gia Hệ thống để thực hiện các nghiệp vụ trên Hệ thống.",
            "Phương án A sai vì đó không phải định nghĩa tài khoản nghiệp vụ.\n"
            "Phương án B sai vì không phải do Trung tâm cấp phép theo cách nêu.\n"
            "Phương án D sai vì A và B đều không đúng.",
        ),
        "Khoản 10 Điều 3 Thông tư số 79/2025/TT-BTC",
    )

    q = by[215]
    ex[215] = (
        block(
            "C",
            q["options"][2],
            "Điểm c Khoản 1 Điều 8 VBHN Luật Đấu thầu.",
            "Nhà thầu có trách nhiệm cập nhật, đăng tải thông tin về năng lực, kinh nghiệm của mình vào cơ sở dữ liệu nhà thầu. Thông tin uy tín/vi phạm không phải trách nhiệm kê khai của nhà thầu theo điểm này.",
            "Phương án A sai vì uy tín do chủ đầu tư đăng tải/đánh giá theo quy định khác.\n"
            "Phương án B sai vì thông tin vi phạm không do nhà thầu tự kê khai theo điểm c.\n"
            "Phương án D sai vì chỉ C đúng.",
        ),
        "Điểm c Khoản 1 Điều 8 VBHN Luật Đấu thầu",
    )

    q = by[216]
    ex[216] = (
        block(
            "D",
            q["options"][3],
            "Điểm a Khoản 1 Điều 8 VBHN Luật Đấu thầu; Điểm h Khoản 1 Điều 7 VBHN Luật Đấu thầu.",
            "Chủ đầu tư có trách nhiệm đăng tải thông tin chủ yếu của hợp đồng (điểm h khoản 1 Điều 7) theo điểm a khoản 1 Điều 8.",
            "Phương án A sai vì không phải bên mời thầu (lựa chọn nhà thầu).\n"
            "Phương án B sai vì không phải tổ chuyên gia.\n"
            "Phương án C sai vì không phải tư vấn đấu thầu.",
        ),
        "Điểm a Khoản 1 Điều 8; Điểm h Khoản 1 Điều 7 VBHN Luật Đấu thầu",
    )

    q = by[217]
    ex[217] = (
        block(
            "C",
            q["options"][2],
            "Khoản 5 Điều 23 Nghị định số 214/2025/NĐ-CP.",
            "Tư vấn đấu thầu không được thay chủ đầu tư đăng tải các nội dung thuộc trách nhiệm đăng tải của chủ đầu tư. Nếu dùng tài khoản của mình đăng tải thay chủ đầu tư thì bị khóa tài khoản 06 tháng kể từ ngày phát hiện.",
            "Phương án A sai vì tham gia lập/đánh giá E-HSMT không phải hành vi khóa 06 tháng theo khoản 5.\n"
            "Phương án B sai vì thẩm định HSMT/KQLCNT không phải hành vi khóa 06 tháng theo khoản 5.\n"
            "Phương án D sai vì đăng tải NLKN của chính mình là trách nhiệm hợp lệ.",
        ),
        "Khoản 5 Điều 23 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[218]
    ex[218] = (
        block(
            "B",
            q["options"][1],
            "Khoản 4 Điều 8 VBHN Luật Đấu thầu.",
            "Thông tin chủ yếu của hợp đồng (điểm h khoản 1 Điều 7) phải đăng tải chậm nhất 05 ngày làm việc kể từ ngày hợp đồng có hiệu lực.",
            "Phương án A sai vì mốc là hợp đồng có hiệu lực, không phải ngày ký kết.\n"
            "Phương án C sai vì thiếu “làm việc”.\n"
            "Phương án D sai vì không lấy mốc nộp BDTHĐ.",
        ),
        "Khoản 4 Điều 8 VBHN Luật Đấu thầu",
    )

    q = by[219]
    ex[219] = (
        block(
            "C",
            q["options"][2],
            "Khoản 2 Điều 20 Nghị định số 214/2025/NĐ-CP.",
            "Trong thời hạn 07 ngày làm việc kể từ ngày nhà thầu có hành vi bị đánh giá về uy tín, chủ đầu tư đăng tải danh sách nhà thầu và tài liệu liên quan trên Hệ thống mạng đấu thầu quốc gia.",
            "Phương án A sai vì không phải tổ chuyên gia và không phải 03 ngày.\n"
            "Phương án B sai vì không phải bên mời thầu và không phải 05 ngày.\n"
            "Phương án D sai vì không phải người có thẩm quyền đăng tải danh sách này.",
        ),
        "Khoản 2 Điều 20 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[220]
    ex[220] = (
        block(
            "B",
            q["options"][1],
            "Quy định về sửa đổi hồ sơ mời thầu / bảo đảm thời gian chuẩn bị HSDT trong Nghị định số 214/2025/NĐ-CP (chủ đầu tư thực hiện gia hạn thời điểm đóng thầu trên Hệ thống).",
            "Khi sửa đổi HSMT mà không bảo đảm đủ thời gian tối thiểu trước đóng thầu thì phải gia hạn thời điểm đóng thầu; việc gia hạn trên Hệ thống do chủ đầu tư thực hiện.",
            "Phương án A sai vì không phải người có thẩm quyền gia hạn trên Hệ thống.\n"
            "Phương án C sai vì không phải tổ chuyên gia.\n"
            "Phương án D sai vì không phải tư vấn đấu thầu.",
        ),
        "Nghị định số 214/2025/NĐ-CP (gia hạn thời điểm đóng thầu do chủ đầu tư)",
    )

    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Lot11 filled: {filled}/20")


if __name__ == "__main__":
    main()
