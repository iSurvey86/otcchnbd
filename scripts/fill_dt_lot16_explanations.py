# -*- coding: utf-8 -*-
"""Điền explanation Lô 16 (STT 301–320) theo mẫu 4 khối, căn cứ CSPL local."""
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

    q = by[301]
    ex[301] = (
        block(
            "D",
            q["options"][3],
            "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC (đánh giá E-HSDT trong đấu thầu qua mạng).",
            "Đối với đấu thầu qua mạng, không có khái niệm 'bản gốc' và 'bản chụp' như đấu thầu truyền thống: (A) đánh giá E-HSDT thực hiện trực tiếp trên Hệ thống, không phải bản chụp; (B) nhà thầu không có trách nhiệm đảm bảo tính thống nhất giữa bản gốc/bản chụp vì không tồn tại khái niệm này; (C) không có quy định đánh giá theo bản gốc khi sai khác với bản chụp. Cả A, B, C đều sai → D.",
            "Phương án A sai vì đánh giá E-HSDT thực hiện trên dữ liệu điện tử trên Hệ thống, không phải bản chụp.\n"
            "Phương án B sai vì đấu thầu qua mạng không có phân biệt bản gốc/bản chụp, nhà thầu không có trách nhiệm như mô tả.\n"
            "Phương án C sai vì quy định về sai khác bản gốc/bản chụp áp dụng cho đấu thầu không qua mạng, không phải qua mạng.",
        ),
        "Nghị định số 214/2025/NĐ-CP; Thông tư số 79/2025/TT-BTC",
    )

    q = by[302]
    ex[302] = (
        block(
            "B",
            q["options"][1],
            "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP (ký kết hợp đồng đối với nhà thầu liên danh).",
            "Đối với nhà thầu liên danh, tất cả thành viên tham gia liên danh phải trực tiếp ký và đóng dấu (nếu có) vào văn bản hợp đồng. Không được ủy quyền cho thành viên đứng đầu hay bất kỳ thành viên nào thay mặt ký hợp đồng.",
            "Phương án A sai vì không được ủy quyền cho thành viên đứng đầu liên danh ký thay.\n"
            "Phương án C sai vì không được ủy quyền cho bất kỳ thành viên nào ký thay các thành viên còn lại.\n"
            "Phương án D sai vì không phải bất kỳ thành viên nào cũng có thể đại diện ký thay toàn bộ liên danh.",
        ),
        "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP",
    )

    q = by[303]
    ex[303] = (
        block(
            "B",
            q["options"][1],
            "VBHN Luật Đấu thầu (bảo đảm thực hiện hợp đồng – hình thức tự thực hiện).",
            "Hình thức tự thực hiện không yêu cầu bảo đảm thực hiện hợp đồng vì đơn vị thực hiện chính là chủ đầu tư hoặc đơn vị trực thuộc, không có quan hệ hợp đồng độc lập cần bảo đảm. Các hình thức lựa chọn nhà thầu khác có cạnh tranh (DTRR, ĐTHL, CGTT) đều phải nộp bảo đảm thực hiện hợp đồng.",
            "Phương án A sai vì đấu thầu rộng rãi phải nộp bảo đảm thực hiện hợp đồng.\n"
            "Phương án C sai vì đấu thầu hạn chế phải nộp bảo đảm thực hiện hợp đồng.\n"
            "Phương án D sai vì chào hàng cạnh tranh phải nộp bảo đảm thực hiện hợp đồng.",
        ),
        "VBHN Luật Đấu thầu",
    )

    q = by[304]
    ex[304] = (
        block(
            "B",
            q["options"][1],
            "Khoản 2 Điều 101 Nghị định số 214/2025/NĐ-CP (chào giá trực tuyến theo quy trình thông thường).",
            "Trong chào giá trực tuyến theo quy trình thông thường, sau khi đánh giá E-HSDT về kỹ thuật, các nhà thầu đáp ứng yêu cầu kỹ thuật được mời tham gia chào giá trực tuyến. Do đó, chào giá trực tuyến được thực hiện ở bước đánh giá về tài chính (để xác định giá cạnh tranh sau khi đã vượt kỹ thuật).",
            "Phương án A sai vì bước chuẩn bị lựa chọn nhà thầu là giai đoạn lập E-HSMT, không phải thực hiện chào giá.\n"
            "Phương án C sai vì thương thảo hợp đồng diễn ra sau khi có nhà thầu xếp hạng nhất, không phải trong giai đoạn chào giá.\n"
            "Phương án D sai vì đánh giá hồ sơ đề xuất kỹ thuật là bước trước khi chào giá, không phải bước thực hiện chào giá.",
        ),
        "Khoản 2 Điều 101 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[305]
    ex[305] = (
        block(
            "B",
            q["options"][1],
            "Khoản 4 Điều 100 Nghị định số 214/2025/NĐ-CP (nguyên tắc chào giá trực tuyến – bảo mật tên nhà thầu).",
            "Trong quá trình chào giá trực tuyến, tên nhà thầu không được công khai trên Hệ thống nhằm bảo đảm tính cạnh tranh, khách quan. Hệ thống chỉ hiển thị mức giá chào, các yếu tố khác ngoài giá (nếu có) và thời gian còn lại của phiên chào giá, không hiển thị tên nhà thầu.",
            "Phương án A sai vì mức giá chào được công khai để các nhà thầu cạnh tranh trực tiếp.\n"
            "Phương án C sai vì các yếu tố khác ngoài giá (nếu có) được công khai trên Hệ thống.\n"
            "Phương án D sai vì thời gian còn lại của phiên chào giá được hiển thị công khai.",
        ),
        "Khoản 4 Điều 100 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[306]
    ex[306] = (
        block(
            "B",
            q["options"][1],
            "Điều 103 Nghị định số 214/2025/NĐ-CP (mua sắm trực tuyến – phê duyệt trong kế hoạch lựa chọn nhà thầu).",
            "Mua sắm trực tuyến phải được phê duyệt trong kế hoạch lựa chọn nhà thầu. Đây là điều kiện bắt buộc theo Điều 103 NĐ 214, không phụ thuộc vào giá trị gói thầu hay loại dự án/dự toán.",
            "Phương án A sai vì mua sắm trực tuyến bắt buộc phải phê duyệt trong kế hoạch lựa chọn nhà thầu.\n"
            "Phương án C sai vì không có ngoại lệ miễn phê duyệt khi giá gói thầu dưới 500 triệu đồng.\n"
            "Phương án D sai vì không phân biệt giữa dự án đầu tư và dự toán mua sắm trong yêu cầu phê duyệt.",
        ),
        "Điều 103 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[307]
    ex[307] = (
        block(
            "B",
            q["options"][1],
            "Điều 103 Nghị định số 214/2025/NĐ-CP (mua sắm trực tuyến – cơ chế thông báo đặt hàng).",
            "Khi có yêu cầu đặt hàng trong mua sắm trực tuyến, Hệ thống mạng đấu thầu quốc gia tự động gửi thông báo cho nhà thầu đã trúng thầu trong mua sắm tập trung trước đó — đây là nhà thầu đã được ký thỏa thuận khung/hợp đồng mua sắm tập trung, sẵn sàng cung cấp hàng hóa, dịch vụ theo điều khoản đã thỏa thuận.",
            "Phương án A sai vì chỉ gửi cho nhà thầu đã trúng trong mua sắm tập trung, không phải cả mua sắm không tập trung.\n"
            "Phương án C sai vì Hệ thống không gửi thông báo cho chủ đầu tư mà gửi cho nhà thầu.\n"
            "Phương án D sai vì đơn vị mua sắm tập trung không phải đối tượng nhận thông báo tự động này.",
        ),
        "Điều 103 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[308]
    ex[308] = (
        block(
            "B",
            q["options"][1],
            "Điều 103 Nghị định số 214/2025/NĐ-CP (mua sắm trực tuyến – thời hạn xác nhận đơn hàng).",
            "Sau khi nhận được yêu cầu đặt hàng qua mua sắm trực tuyến, nhà thầu có 03 ngày làm việc để xác nhận hoặc từ chối đơn hàng. Đây là đơn vị ngày làm việc, không phải ngày thông thường.",
            "Phương án A sai vì 24 giờ quá ngắn, không phải thời hạn quy định.\n"
            "Phương án C sai vì đơn vị là ngày làm việc, không phải ngày thông thường.\n"
            "Phương án D sai vì 05 ngày làm việc dài hơn mức quy định 03 ngày làm việc.",
        ),
        "Điều 103 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[309]
    ex[309] = (
        block(
            "B",
            q["options"][1],
            "Khoản 4 Điều 100 Nghị định số 214/2025/NĐ-CP (nguyên tắc hòa giá trong chào giá trực tuyến).",
            "Trường hợp có nhiều nhà thầu cùng chào mức giá thấp nhất bằng nhau sau khi kết thúc phiên chào giá, nhà thầu nào chào mức giá đó trước (thời điểm chào giá sớm hơn) sẽ được xếp hạng thứ nhất. Đây là nguyên tắc ưu tiên 'hòa giá → chào thấp nhất đầu tiên' theo NĐ 214.",
            "Phương án A sai vì năng lực tài chính không phải tiêu chí xử lý hòa giá trong chào giá trực tuyến.\n"
            "Phương án C sai vì 'nộp hồ sơ dự thầu sớm nhất' là tiêu chí khác, không phải thời điểm chào giá.\n"
            "Phương án D sai vì không có cơ chế yêu cầu các nhà thầu chào lại giá trong tình huống hòa giá.",
        ),
        "Khoản 4 Điều 100 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[310]
    ex[310] = (
        block(
            "B",
            q["options"][1],
            "Khoản 2 Điều 101 Nghị định số 214/2025/NĐ-CP (thông báo mời tham gia chào giá trực tuyến thông thường).",
            "Sau khi đánh giá kỹ thuật và xác định danh sách nhà thầu đáp ứng yêu cầu, chủ đầu tư phải gửi thông báo mời tham gia chào giá trực tuyến cho các nhà thầu tối thiểu 03 ngày làm việc trước thời điểm bắt đầu chào giá.",
            "Phương án A sai vì 24 giờ quá ngắn, không đủ thời gian cho nhà thầu chuẩn bị.\n"
            "Phương án C sai vì đơn vị là ngày làm việc, không phải ngày thông thường.\n"
            "Phương án D sai vì 05 ngày làm việc dài hơn mức tối thiểu quy định 03 ngày làm việc.",
        ),
        "Khoản 2 Điều 101 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[311]
    ex[311] = (
        block(
            "B",
            q["options"][1],
            "VBHN Luật Đấu thầu (làm rõ hồ sơ dự thầu – năng lực, kinh nghiệm).",
            "Đối với đấu thầu rộng rãi không qua mạng, sau khi đóng thầu, nhà thầu được phép chủ động gửi tài liệu đến chủ đầu tư để làm rõ về năng lực, kinh nghiệm. Đây là quyền chủ động của nhà thầu, không cần chờ chủ đầu tư yêu cầu.",
            "Phương án A sai vì nhà thầu không cần chờ chủ đầu tư có yêu cầu mới được gửi tài liệu làm rõ năng lực, kinh nghiệm.\n"
            "Phương án C sai vì không phải hoàn toàn bị cấm bổ sung tài liệu về năng lực, kinh nghiệm sau đóng thầu.\n"
            "Phương án D sai vì rút hồ sơ dự thầu để nộp lại không phải cách xử lý phù hợp và bị tính là vi phạm.",
        ),
        "VBHN Luật Đấu thầu",
    )

    q = by[312]
    ex[312] = (
        block(
            "B",
            q["options"][1],
            "VBHN Luật Đấu thầu (quyền từ chối hoàn thiện hợp đồng của nhà thầu).",
            "Nhà thầu được từ chối hoàn thiện hợp đồng mà không bị đánh giá về uy tín và không bị tịch thu bảo đảm dự thầu khi chủ đầu tư đưa ra các yêu cầu trong hoàn thiện hợp đồng không phù hợp với nội dung hồ sơ mời thầu, hồ sơ dự thầu đã được chấp thuận.",
            "Phương án A sai vì nhà thầu không được từ chối hoàn thiện hợp đồng trong mọi trường hợp mà không bị chế tài.\n"
            "Phương án C sai vì nhà thầu đề nghị điều chỉnh đơn giá ngoài quy định mà chủ đầu tư không chấp nhận thì nhà thầu không được từ chối mà không bị phạt.\n"
            "Phương án D sai vì C không đúng nên B và C không thể cùng đúng.",
        ),
        "VBHN Luật Đấu thầu",
    )

    q = by[313]
    ex[313] = (
        block(
            "B",
            q["options"][1],
            "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP (xử lý sai lệch thiếu khi không có đơn giá).",
            "Đối với đấu thầu không qua mạng, khi nhà thầu xếp hạng thứ nhất sau hiệu chỉnh sai lệch không có đơn giá cho phần sai lệch thiếu, đơn giá được ưu tiên áp dụng đầu tiên là đơn giá tương ứng có giá trị thấp nhất trong các hồ sơ dự thầu khác đã vượt qua bước đánh giá về kỹ thuật.",
            "Phương án A sai vì đơn giá trong dự toán gói thầu chỉ được áp dụng khi không có đơn giá từ các HSDT khác vượt kỹ thuật.\n"
            "Phương án C sai vì đơn giá hình thành giá gói thầu được áp dụng sau khi đã xét đơn giá từ HSDT khác vượt kỹ thuật.\n"
            "Phương án D sai vì không áp dụng đơn giá cao nhất mà phải áp dụng đơn giá thấp nhất để bảo vệ chủ đầu tư.",
        ),
        "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP",
    )

    q = by[314]
    ex[314] = (
        block(
            "D",
            q["options"][3],
            "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP (gói thầu bảo hiểm – bảo đảm dự thầu).",
            "Đối với gói thầu bảo hiểm, nhà thầu tham dự thầu không được xuất trình giấy chứng nhận bảo hiểm bảo lãnh do chính mình phát hành để làm bảo đảm dự thầu, bất kể giá trị bảo lãnh là bao nhiêu. Quy định này nhằm tránh xung đột lợi ích khi nhà thầu vừa là người phát hành bảo lãnh vừa là người được bảo lãnh. Cả A, B, C đều sai → D.",
            "Phương án A sai vì không được dùng dù nhà thầu là doanh nghiệp bảo hiểm uy tín.\n"
            "Phương án B sai vì không có ngoại lệ dựa trên giá trị bảo lãnh (50 triệu).\n"
            "Phương án C sai vì cũng không có ngoại lệ cho giá trị nhỏ hơn 50 triệu đồng.",
        ),
        "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP",
    )

    q = by[315]
    ex[315] = (
        block(
            "A",
            q["options"][0],
            "Nghị định số 214/2025/NĐ-CP (giải thích lý do không trúng thầu).",
            "Sau khi có quyết định phê duyệt kết quả lựa chọn nhà thầu, khi nhà thầu không trúng thầu yêu cầu giải thích lý do cụ thể, chủ đầu tư phải trả lời trong thời hạn 02 ngày làm việc kể từ ngày nhận được yêu cầu của nhà thầu.",
            "Phương án B sai vì 03 ngày làm việc dài hơn mức quy định 02 ngày làm việc.\n"
            "Phương án C sai vì 05 ngày làm việc là thời hạn đăng tải kết quả lựa chọn nhà thầu, không phải thời hạn giải thích.\n"
            "Phương án D sai vì 07 ngày làm việc vượt xa thời hạn quy định.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[316]
    ex[316] = (
        block(
            "A",
            q["options"][0],
            "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP (đấu thầu trước – bảo đảm dự thầu).",
            "Đối với gói thầu đấu thầu trước, nhà thầu không phải thực hiện biện pháp bảo đảm dự thầu bằng tài chính (thư bảo lãnh/tiền đặt cọc) nhưng phải có cam kết trong đơn dự thầu về việc thực hiện bảo đảm dự thầu khi ký kết hợp đồng.",
            "Phương án B sai vì đấu thầu trước không bắt buộc phải thực hiện bảo đảm dự thầu bằng tài chính.\n"
            "Phương án C sai vì đây là quy định bắt buộc (không phải tùy chủ đầu tư) và phương án A đã mô tả đúng.\n"
            "Phương án D sai vì không có ngoại lệ dựa trên giá trị bảo đảm dự thầu.",
        ),
        "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP",
    )

    q = by[317]
    ex[317] = (
        block(
            "B",
            q["options"][1],
            "Nghị định số 214/2025/NĐ-CP (đánh giá ưu đãi khi nhà thầu không kê khai).",
            "Khi các nhà thầu chào hàng hóa cùng ký mã hiệu, hãng sản xuất, xuất xứ Việt Nam nhưng có nhà thầu kê khai ưu đãi, có nhà thầu không kê khai, chủ đầu tư quyết định cho phép các nhà thầu không kê khai được làm rõ để có cơ sở đánh giá ưu đãi, bảo đảm sự công bằng giữa các nhà thầu.",
            "Phương án A sai vì không tính ưu đãi cho tất cả là không công bằng với nhà thầu có hàng hóa thực sự thuộc đối tượng ưu đãi.\n"
            "Phương án C sai vì chỉ xét ưu đãi cho nhà thầu đã kê khai sẽ bất lợi cho nhà thầu quên kê khai nhưng đủ điều kiện.\n"
            "Phương án D sai vì tính ưu đãi mà không có cơ sở xác nhận từ nhà thầu không kê khai là không có căn cứ.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[318]
    ex[318] = (
        block(
            "A",
            q["options"][0],
            "Khoản 3 Điều 30 Thông tư số 79/2025/TT-BTC (đánh giá E-HSDT qua mạng – bản scan báo cáo).",
            "Sau khi đánh giá E-HSDT, tổ trưởng tổ chuyên gia đính kèm bản scan báo cáo đánh giá E-HSDT lên Hệ thống. Bản scan báo cáo này phải có chữ ký của tất cả thành viên trong tổ chuyên gia, không chỉ tổ trưởng.",
            "Phương án B sai vì không thể chỉ có chữ ký tổ trưởng; tất cả thành viên đều phải ký.\n"
            "Phương án C sai vì phải kèm đầy đủ phiếu chấm của các thành viên, không chỉ báo cáo tổng hợp.\n"
            "Phương án D sai vì B và C đều không đúng.",
        ),
        "Khoản 3 Điều 30 Thông tư số 79/2025/TT-BTC",
    )

    q = by[319]
    ex[319] = (
        block(
            "C",
            q["options"][2],
            "Nghị định số 09/2022/NĐ-CP sửa đổi Nghị định số 95/2020/NĐ-CP; Nghị định số 17/2025/NĐ-CP (hiệp định mở cửa thị trường mua sắm chính phủ).",
            "Việt Nam đã mở cửa thị trường mua sắm chính phủ (đấu thầu) trong ba hiệp định: (1) Hiệp định CPTPP; (2) Hiệp định thương mại tự do EVFTA với EU; (3) Hiệp định thương mại tự do UKVFTA với Vương quốc Anh. Việt Nam chưa gia nhập GPA của WTO.",
            "Phương án A sai vì ngoài CPTPP còn có EVFTA và UKVFTA.\n"
            "Phương án B sai vì ngoài CPTPP và EVFTA còn có UKVFTA.\n"
            "Phương án D sai vì không phải tất cả hiệp định; ví dụ RCEP không có chương mua sắm chính phủ áp dụng cho Việt Nam.",
        ),
        "Nghị định số 09/2022/NĐ-CP; Nghị định số 17/2025/NĐ-CP",
    )

    q = by[320]
    ex[320] = (
        block(
            "C",
            q["options"][2],
            "Hiệp định CPTPP (số lượng thành viên ký kết ban đầu).",
            "Hiệp định CPTPP được ký kết ngày 08/3/2018 tại Santiago, Chile với 11 quốc gia thành viên ban đầu gồm: Úc, Brunei, Canada, Chile, Nhật Bản, Malaysia, Mexico, New Zealand, Peru, Singapore và Việt Nam. Con số 12 là của Hiệp định TPP gốc (trước khi Mỹ rút).",
            "Phương án A sai vì 8 nước ít hơn số thực tế.\n"
            "Phương án B sai vì 9 nước cũng ít hơn số thực tế.\n"
            "Phương án D sai vì 12 nước là số thành viên của TPP gốc (có Mỹ), không phải CPTPP.",
        ),
        "Hiệp định CPTPP",
    )

    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Lot16 filled: {filled}/20")


if __name__ == "__main__":
    main()
