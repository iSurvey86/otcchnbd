# -*- coding: utf-8 -*-
"""Điền explanation Lô 13 (STT 241–260) theo mẫu 4 khối, căn cứ CSPL local."""
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

    q = by[241]
    ex[241] = (
        block(
            "D",
            q["options"][3],
            "Khoản 6 Điều 14 VBHN Luật Đấu thầu; Khoản 16 Điều 140 Nghị định số 214/2025/NĐ-CP; Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC.",
            "Chủ đầu tư có thể đề nghị gia hạn hiệu lực E-HSDT/BDDT trước khi hết hạn để tiếp tục đánh giá. Khi mời nhà thầu xếp hạng tiếp theo vào thương thảo mà HSDT hết hiệu lực thì phải yêu cầu gia hạn trước khi thương thảo. A và B đúng; không phải mọi trường hợp trước khi phê duyệt KQLCNT đều bắt buộc gia hạn như C. → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C sai vì không phải điều kiện bắt buộc theo cách nêu.",
        ),
        "Khoản 6 Điều 14 VBHN Luật Đấu thầu; Khoản 16 Điều 140 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[242]
    ex[242] = (
        block(
            "C",
            q["options"][2],
            "Điều 5 Thông tư số 79/2025/TT-BTC.",
            "File đính kèm không được thiết lập mật khẩu. Tệp tin có mật khẩu không đáp ứng yêu cầu → không được xem xét, đánh giá; không yêu cầu nộp lại hay cung cấp mật khẩu để khắc phục theo quy định này.",
            "Phương án A sai vì không xử lý bằng yêu cầu nộp lại file không mật khẩu.\n"
            "Phương án B sai vì không yêu cầu cung cấp mật khẩu để đánh giá.\n"
            "Phương án D sai vì A và B đều không đúng.",
        ),
        "Điều 5 Thông tư số 79/2025/TT-BTC",
    )

    q = by[243]
    ex[243] = (
        block(
            "A",
            q["options"][0],
            "Mẫu số 12C/12D/12E CGTT rút gọn kèm Thông tư số 79/2025/TT-BTC.",
            "Thời điểm bắt đầu và thời điểm kết thúc chào giá trực tuyến rút gọn do chủ đầu tư điền trong giờ hành chính.",
            "Phương án B sai vì bắt đầu cũng phải trong giờ hành chính.\n"
            "Phương án C sai vì cả hai mốc đều bắt buộc trong giờ hành chính.\n"
            "Phương án D sai vì A đúng.",
        ),
        "Mẫu CGTT rút gọn kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[244]
    ex[244] = (
        block(
            "B",
            q["options"][1],
            "Điểm c Khoản 5 Điều 102 Nghị định số 214/2025/NĐ-CP.",
            "Nhà thầu được mời xác nhận chấp thuận trao hợp đồng phải xác nhận trong thời gian tối đa 03 ngày làm việc kể từ ngày chủ đầu tư mời trên Hệ thống.",
            "Phương án A sai vì thiếu “làm việc”.\n"
            "Phương án C sai vì không phải 05 ngày.\n"
            "Phương án D sai vì không phải 05 ngày làm việc.",
        ),
        "Điểm c Khoản 5 Điều 102 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[245]
    ex[245] = (
        block(
            "B",
            q["options"][1],
            "Điểm c Khoản 5 Điều 102 Nghị định số 214/2025/NĐ-CP.",
            "Khi từ chối/không xác nhận: công khai tên nhà thầu; khóa chức năng chào giá trực tuyến 06 tháng kể từ ngày công khai; bị đánh giá về uy tín. Không có quy định khóa tài khoản 03 tháng theo đề nghị Bộ Tài chính như B → B là nội dung không đúng.",
            "Phương án A đúng theo quy định (công khai tên).\n"
            "Phương án C đúng (khóa chức năng CGTT 06 tháng).\n"
            "Phương án D đúng (đánh giá về uy tín).",
        ),
        "Điểm c Khoản 5 Điều 102 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[246]
    ex[246] = (
        block(
            "A",
            q["options"][0],
            "Điểm a Khoản 2 Điều 99 Nghị định số 214/2025/NĐ-CP.",
            "Chào giá trực tuyến theo quy trình thông thường áp dụng với gói dịch vụ phi tư vấn thông dụng, đơn giản (và một số gói hàng hóa thông dụng theo điểm b, c). Không áp dụng cho xây lắp, tư vấn, hỗn hợp theo các phương án B–D.",
            "Phương án B sai vì xây lắp không thuộc CGTT thông thường theo điểm a khoản 2.\n"
            "Phương án C sai vì dịch vụ tư vấn không thuộc phạm vi này.\n"
            "Phương án D sai vì hỗn hợp không thuộc phạm vi này.",
        ),
        "Điểm a Khoản 2 Điều 99 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[247]
    ex[247] = (
        block(
            "C",
            q["options"][2],
            "Điểm c Khoản 5 Điều 102 Nghị định số 214/2025/NĐ-CP.",
            "Việc mời xác nhận chấp thuận được trao hợp đồng trên Hệ thống là bước của chào giá trực tuyến rút gọn. Đấu thầu rộng rãi/CHCT/hạn chế và CGTT thông thường không dùng bước xác nhận này theo cùng quy định.",
            "Phương án A sai vì không áp dụng bước xác nhận này cho DTRR/CHCT/hạn chế.\n"
            "Phương án B sai vì CGTT thông thường không có bước xác nhận trao HĐ như rút gọn.\n"
            "Phương án D sai vì chỉ C đúng.",
        ),
        "Điểm c Khoản 5 Điều 102 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[248]
    ex[248] = (
        block(
            "C",
            q["options"][2],
            "Khoản 3 Điều 102 Nghị định số 214/2025/NĐ-CP.",
            "Kể từ lượt chào giá thứ hai, giá chào của nhà thầu không được thấp hơn 90% giá thấp nhất hiển thị trên Hệ thống.",
            "Phương án A sai vì không phải 80%.\n"
            "Phương án B sai vì không phải 85%.\n"
            "Phương án D sai vì không phải 95%.",
        ),
        "Khoản 3 Điều 102 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[249]
    ex[249] = (
        block(
            "D",
            q["options"][3],
            "Điểm c Khoản 1 Điều 102 Nghị định số 214/2025/NĐ-CP.",
            "Thông báo mời thầu CGTT rút gọn không nêu yêu cầu về bảo đảm dự thầu → không yêu cầu BDDT.",
            "Phương án A sai vì không áp dụng mức 5%.\n"
            "Phương án B sai vì không áp dụng mức 10%.\n"
            "Phương án C sai vì không áp dụng khung 1–3%.",
        ),
        "Điểm c Khoản 1 Điều 102 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[250]
    ex[250] = (
        block(
            "C",
            q["options"][2],
            "Điểm c Khoản 5 Điều 101 Nghị định số 214/2025/NĐ-CP.",
            "CGTT thông thường: nhà thầu được mời nhưng không tham gia thì HSDT tiếp tục được đánh giá về tài chính theo HSDT đã nộp trước đóng thầu — không loại/khóa tài khoản chỉ vì từ chối tham gia CGTT.",
            "Phương án A sai vì không đánh giá HSDXTC không đạt chỉ vì từ chối tham gia.\n"
            "Phương án B sai vì không loại và khóa tài khoản 06 tháng trong tình huống này.\n"
            "Phương án D sai vì A và B đều không đúng.",
        ),
        "Điểm c Khoản 5 Điều 101 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[251]
    ex[251] = (
        block(
            "C",
            q["options"][2],
            "Khoản 1 Điều 103 Nghị định số 214/2025/NĐ-CP.",
            "Mua sắm trực tuyến áp dụng với hàng hóa, dịch vụ của gói thầu thuộc dự toán mua sắm có giá gói thầu không quá 500 triệu đồng (gói thuộc dự án: không quá 01 tỷ đồng).",
            "Phương án A sai vì hạn mức dự toán mua sắm không phải 100 triệu.\n"
            "Phương án B sai vì không phải 300 triệu.\n"
            "Phương án D sai vì 01 tỷ là hạn mức gói thuộc dự án, không phải dự toán mua sắm.",
        ),
        "Khoản 1 Điều 103 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[252]
    ex[252] = (
        block(
            "C",
            q["options"][2],
            "Điểm g Khoản 1 Điều 91 Nghị định số 214/2025/NĐ-CP; Điểm i Khoản 2 Điều 50 VBHN Luật Đấu thầu.",
            "Trong MSTT đấu thầu rộng rãi: đơn vị mua sắm tập trung có thể ký HĐ trực tiếp với nhà thầu (không ký thỏa thuận khung); khi đã ký thỏa thuận khung thì đơn vị có nhu cầu ký HĐ với nhà thầu. Hợp đồng điện tử được thực hiện trên Hệ thống theo Luật → A và B đều đúng → C.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án D sai vì A và B đều đúng.",
        ),
        "Điều 91 Nghị định số 214/2025/NĐ-CP; Điều 50 VBHN Luật Đấu thầu",
    )

    q = by[253]
    ex[253] = (
        block(
            "A",
            q["options"][0],
            "Khoản 1 Điều 103 Nghị định số 214/2025/NĐ-CP.",
            "MSTT trực tuyến chỉ áp dụng hàng hóa, dịch vụ: dự toán mua sắm ≤ 500 triệu; thuộc dự án ≤ 01 tỷ. Không áp dụng xây lắp theo hạn mức nêu ở B/C.",
            "Phương án B sai vì xây lắp không thuộc phạm vi mua sắm trực tuyến Điều 103.\n"
            "Phương án C sai vì hạn mức và loại gói không khớp Điều 103.\n"
            "Phương án D sai vì B và C đều sai.",
        ),
        "Khoản 1 Điều 103 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[254]
    ex[254] = (
        block(
            "C",
            q["options"][2],
            "Khoản 6 Điều 102 Nghị định số 214/2025/NĐ-CP (so với Khoản 7 Điều 101).",
            "Quy trình CGTT rút gọn quy định bước “Phê duyệt và công khai kết quả” (không ghi “Thẩm định, phê duyệt” như CGTT thông thường tại khoản 7 Điều 101). Phê duyệt trên cơ sở chấp thuận trao hợp đồng của nhà thầu → không phải thẩm định KQLCNT.",
            "Phương án A sai vì không chỉ thẩm định giá chào.\n"
            "Phương án B sai vì không phải bắt buộc thẩm định khi NCTT yêu cầu theo cách nêu.\n"
            "Phương án D sai vì A và B đều không đúng.",
        ),
        "Khoản 6 Điều 102 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[255]
    ex[255] = (
        block(
            "B",
            q["options"][1],
            "Mẫu E-HSMT xây lắp kèm Thông tư số 79/2025/TT-BTC (làm rõ E-HSDT).",
            "Khi webform hợp đồng tương tự không thống nhất với file chứng minh, chủ đầu tư yêu cầu làm rõ E-HSDT trên Hệ thống — không loại ngay và không yêu cầu gửi bản giấy.",
            "Phương án A sai vì không đánh giá không đạt ngay khi chưa làm rõ.\n"
            "Phương án C sai vì làm rõ trên Hệ thống, không bổ sung bản giấy để đánh giá.\n"
            "Phương án D sai vì chỉ B đúng.",
        ),
        "Mẫu E-HSMT xây lắp kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[256]
    ex[256] = (
        block(
            "D",
            q["options"][3],
            "Điều 8 Thông tư số 79/2025/TT-BTC; Khoản 3 Điều 50 VBHN Luật Đấu thầu.",
            "Văn bản điện tử trên Hệ thống có giá trị pháp lý, làm cơ sở đối chiếu/xác thực; thời điểm gửi/nhận theo thời gian thực trên Hệ thống; cơ quan giải ngân không được yêu cầu cung cấp văn bản giấy khi có thể tra cứu văn bản điện tử trên Hệ thống. Cả A, B, C đúng → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Điều 8 Thông tư số 79/2025/TT-BTC; Điều 50 VBHN Luật Đấu thầu",
    )

    q = by[257]
    ex[257] = (
        block(
            "D",
            q["options"][3],
            "Quy định làm rõ E-HSDT trên Hệ thống mạng đấu thầu quốc gia (Thông tư số 79/2025/TT-BTC / Mẫu E-HSMT).",
            "Chức năng trả lời làm rõ E-HSDT trên Hệ thống không giới hạn số lần đối với mỗi yêu cầu làm rõ (khác với một số nội dung khác bị giới hạn số lần bổ sung/thay thế).",
            "Phương án A sai vì không giới hạn 01 lần.\n"
            "Phương án B sai vì không giới hạn 02 lần.\n"
            "Phương án C sai vì không giới hạn 03 lần.",
        ),
        "Thông tư số 79/2025/TT-BTC; Mẫu E-HSMT",
    )

    q = by[258]
    ex[258] = (
        block(
            "C",
            q["options"][2],
            "Thông tư số 79/2025/TT-BTC (thông tin bảo đảm dự thầu khi nộp E-HSDT).",
            "Với nhà thầu liên danh, các thành viên phải sử dụng cùng thể thức bảo lãnh dự thầu: cùng bảo lãnh điện tử hoặc cùng bảo lãnh bằng giấy — không được lẫn thể thức.",
            "Phương án A sai vì không được dùng thể thức khác nhau.\n"
            "Phương án B sai vì không bắt buộc chỉ được dùng bảo lãnh điện tử.\n"
            "Phương án D sai vì không bắt buộc chỉ được dùng bảo lãnh giấy.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    q = by[259]
    ex[259] = (
        block(
            "A",
            q["options"][0],
            "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (Mục bảo đảm dự thầu).",
            "Trong 05 ngày làm việc kể từ ngày nhận yêu cầu của chủ đầu tư, nếu nhà thầu từ chối hoặc không nộp bản gốc thư bảo lãnh/giấy chứng nhận bảo hiểm bảo lãnh (bản giấy) thì bị xử lý theo cam kết trong đơn dự thầu. Chủ thể yêu cầu là chủ đầu tư, không phải bên mời thầu/tổ chuyên gia/tư vấn.",
            "Phương án B sai vì không phải yêu cầu của bên mời thầu.\n"
            "Phương án C sai vì không phải yêu cầu của tổ chuyên gia.\n"
            "Phương án D sai vì không phải yêu cầu của tư vấn đấu thầu.",
        ),
        "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    q = by[260]
    ex[260] = (
        block(
            "D",
            q["options"][3],
            "Khoản 5 Điều 50 VBHN Luật Đấu thầu; Khoản 11 Điều 98 Nghị định số 214/2025/NĐ-CP.",
            "Không đấu thầu trên Hệ thống gồm: phương thức hai giai đoạn (một/hai túi hồ sơ), đấu thầu quốc tế; và các hình thức chỉ định thầu, đặt hàng, giao nhiệm vụ, mua sắm trực tiếp, tự thực hiện, đàm phán giá, trường hợp đặc biệt, gói có sự tham gia của cộng đồng… A, B, C đều thuộc trường hợp không áp dụng đấu thầu qua mạng → D.",
            "Phương án A đúng nhưng chưa đủ.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Khoản 5 Điều 50 VBHN Luật Đấu thầu; Khoản 11 Điều 98 Nghị định số 214/2025/NĐ-CP",
    )

    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Lot13 filled: {filled}/20")


if __name__ == "__main__":
    main()
