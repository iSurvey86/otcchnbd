# -*- coding: utf-8 -*-
"""Điền explanation Lô 19 (STT 361–380) theo mẫu 4 khối, căn cứ CSPL local."""
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

    # Q361 – Khai "không có" ký mã hiệu nhưng hãng SX có → tiếp tục xét nếu tài liệu đính kèm đủ thông tin
    q = by[361]
    ex[361] = (
        block(
            "C",
            q["options"][2],
            "Thông tư số 79/2025/TT-BTC; Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (Mẫu số 10B Chương IV).",
            "Trường hợp nhà thầu kê khai 'không có' đối với nội dung ký mã hiệu trong Mẫu 10B, nhưng hãng sản xuất thực tế có ký mã hiệu cho hàng hóa đó, tổ chuyên gia tiếp tục xem xét và đánh giá nếu tài liệu đính kèm của nhà thầu đầy đủ thông tin kỹ thuật cần thiết để xác định hàng hóa. Đây là trường hợp nhà thầu bỏ sót thông tin, không phải gian lận, nên không tự động loại.",
            "Phương án A sai vì không cần yêu cầu làm rõ khi tài liệu đính kèm đã đủ thông tin.\n"
            "Phương án B sai vì không loại E-HSDT chỉ vì khai 'không có' ký mã hiệu nếu tài liệu đính kèm đủ thông tin.\n"
            "Phương án D sai vì C là đáp án đúng.",
        ),
        "Thông tư số 79/2025/TT-BTC; Mẫu E-HSMT",
    )

    # Q362 – Gói đủ ĐK chỉ định thầu nhưng áp dụng DTRR → chuẩn bị HSDT tối thiểu 09 ngày
    q = by[362]
    ex[362] = (
        block(
            "C",
            q["options"][2],
            "Khoản 3 Điều 138 Nghị định số 214/2025/NĐ-CP (thời gian chuẩn bị HSDT gói thầu đủ điều kiện chỉ định thầu nhưng áp dụng đấu thầu rộng rãi).",
            "Đối với gói thầu đủ điều kiện chỉ định thầu theo Khoản 1 Điều 78 Nghị định 214, nhưng chủ đầu tư quyết định áp dụng đấu thầu rộng rãi để tăng tính cạnh tranh, thời gian chuẩn bị hồ sơ dự thầu tối thiểu là 09 ngày (ngày thực tế, không phải ngày làm việc) kể từ ngày đầu tiên E-HSMT được phát hành đến ngày có thời điểm đóng thầu.",
            "Phương án A sai vì 18 ngày áp dụng cho các gói DTRR thông thường, không phải gói thầu đủ ĐK chỉ định thầu.\n"
            "Phương án B sai vì 09 ngày làm việc (≈ 13 ngày thực tế) cao hơn mức quy định cho trường hợp này.\n"
            "Phương án D sai vì 18 ngày làm việc cao hơn nhiều so với mức tối thiểu quy định cho trường hợp này.",
        ),
        "Khoản 3 Điều 138 Nghị định số 214/2025/NĐ-CP",
    )

    # Q363 – ĐTKKM có thư giảm giá: hiệu chỉnh SL trên giá DT CHƯA trừ giảm giá
    q = by[363]
    ex[363] = (
        block(
            "D",
            q["options"][3],
            "Nghị định số 214/2025/NĐ-CP; Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (quy định về hiệu chỉnh sai lệch).",
            "Đối với đấu thầu không qua mạng, khi nhà thầu có thư giảm giá, việc hiệu chỉnh sai lệch (tính đúng, tính đủ các hạng mục, cộng/trừ sai lệch) thực hiện trên cơ sở giá dự thầu CHƯA trừ đi giá trị giảm giá. Giá trị giảm giá chỉ được trừ sau khi đã hoàn thành việc hiệu chỉnh sai lệch, để xác định giá đề nghị trúng thầu chính xác.",
            "Phương án A sai vì giá dự thầu sau khi trừ giảm giá là kết quả tính, không phải cơ sở hiệu chỉnh sai lệch.\n"
            "Phương án B sai vì giá đề nghị trúng thầu là kết quả cuối cùng sau hiệu chỉnh và trừ giảm giá, không phải cơ sở hiệu chỉnh.\n"
            "Phương án C sai vì giá gói thầu không phải cơ sở để hiệu chỉnh sai lệch HSDT.",
        ),
        "Nghị định số 214/2025/NĐ-CP; Mẫu E-HSMT",
    )

    # Q364 – Liên danh bảo hành: cam kết tự thực hiện HOẶC có HĐ nguyên tắc với đơn vị đủ khả năng
    q = by[364]
    ex[364] = (
        block(
            "D",
            q["options"][3],
            "Thông tư số 79/2025/TT-BTC; Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (quy định về bảo hành đối với liên danh).",
            "Đối với gói thầu mua sắm hàng hóa tổ chức DTRR qua mạng, nhà thầu liên danh chứng minh khả năng thực hiện nghĩa vụ bảo hành bằng cách: cả liên danh (không phải từng thành viên riêng lẻ) cam kết có năng lực TỰ THỰC HIỆN bảo hành theo yêu cầu E-HSMT, HOẶC có hợp đồng nguyên tắc với đơn vị đủ khả năng bảo hành. Điều kiện là 'hoặc', không phải 'và'.",
            "Phương án A sai vì yêu cầu từng thành viên liên danh riêng lẻ phải đồng thời đáp ứng cả hai điều kiện là quá chặt.\n"
            "Phương án B sai vì yêu cầu từng thành viên riêng lẻ đáp ứng một trong hai điều kiện cũng không đúng – nghĩa vụ bảo hành thuộc về cả liên danh.\n"
            "Phương án C sai vì yêu cầu cả liên danh phải đáp ứng đồng thời cả hai điều kiện (và) là quá chặt; chỉ cần đáp ứng một trong hai (hoặc).",
        ),
        "Thông tư số 79/2025/TT-BTC; Mẫu E-HSMT",
    )

    # Q365 – Nhân sự chủ chốt gói HH: B (chỉ dịch vụ liên quan đặc thù) là không phù hợp
    q = by[365]
    ex[365] = (
        block(
            "B",
            q["options"][1],
            "Nghị định số 214/2025/NĐ-CP; Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (yêu cầu nhân sự chủ chốt đối với gói HH).",
            "Phương án B không phù hợp vì nội dung 'chỉ được yêu cầu nhân sự chủ chốt đối với các dịch vụ liên quan có yếu tố đặc thù, phức tạp' là quá hẹp. Thực tế, theo Mẫu E-HSMT, còn được phép yêu cầu nhân sự chủ chốt đối với phần cung cấp hàng hóa có tính đặc thù, cần sự xác nhận của nhà sản xuất hoặc nhà cung cấp để đảm bảo tính khả thi. Phương án C mô tả đúng trường hợp này.",
            "Phương án A phù hợp: không được yêu cầu nhân sự chủ chốt đối với phần cung cấp hàng hóa thông thường.\n"
            "Phương án C phù hợp: được yêu cầu nhân sự chủ chốt với HH đặc thù cần xác nhận của nhà SX/NCC.\n"
            "Phương án D phù hợp: không yêu cầu nhân sự chủ chốt với HH thông dụng, không đòi hỏi trình độ cao.",
        ),
        "Nghị định số 214/2025/NĐ-CP; Mẫu E-HSMT",
    )

    # Q366 – Sai: gói > 1 năm không ghi theo chu kỳ 01 năm hoặc toàn bộ tùy chọn
    q = by[366]
    ex[366] = (
        block(
            "C",
            q["options"][2],
            "Nghị định số 214/2025/NĐ-CP (quy định về lập kế hoạch lựa chọn nhà thầu).",
            "Phương án C không đúng vì theo quy định, đối với gói thầu có thời gian thực hiện dài hơn 01 năm, giá gói thầu trong kế hoạch lựa chọn nhà thầu được ghi trên cơ sở toàn bộ thời gian thực hiện gói thầu – không ghi theo chu kỳ 01 năm. Tùy chọn 'ghi theo chu kỳ 01 năm HOẶC toàn bộ' không phải quy định hiện hành.",
            "Phương án A đúng: KHLCNT lập cho toàn bộ dự án/dự toán; có thể lập cho một hoặc một số gói để thực hiện trước.\n"
            "Phương án B đúng: KHLCNT có thể lập đồng thời với lập dự án hoặc trước quyết định phê duyệt dự án.\n"
            "Phương án D đúng: KHLCNT phải ghi rõ số lượng gói thầu và nội dung từng gói.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    # Q367 – Nghĩa vụ thuế: phương án A hoặc B đều được chấp nhận
    q = by[367]
    ex[367] = (
        block(
            "D",
            q["options"][3],
            "Thông tư số 79/2025/TT-BTC (quy định về chứng minh nghĩa vụ nộp thuế trên Hệ thống).",
            "Trường hợp Hệ thống chưa tự động trích xuất thông tin nghĩa vụ nộp thuế, nhà thầu có thể nộp tài liệu theo một trong hai phương án: (A) Tờ khai thuế/thông báo nộp tiền và giấy nộp tiền in từ Hệ thống thuế điện tử có xác nhận cơ quan thuế; hoặc (B) Tờ khai thuế/thông báo nộp tiền và xác nhận của cơ quan thuế về việc thực hiện nghĩa vụ thuế. Cả hai phương án đều được chấp nhận, không bắt buộc phải cùng lúc.",
            "Phương án A đúng nhưng chưa đủ (chỉ nêu một phương án được chấp nhận).\n"
            "Phương án B đúng nhưng chưa đủ (chỉ nêu một phương án được chấp nhận).\n"
            "Phương án C sai vì yêu cầu cả ba loại tài liệu cùng lúc là quá chặt so với quy định.",
        ),
        "Thông tư số 79/2025/TT-BTC",
    )

    # Q368 – Dự toán tùy chọn mua thêm: phê duyệt trong quá trình TH HĐ, trước khi thực hiện khối lượng thêm
    q = by[368]
    ex[368] = (
        block(
            "C",
            q["options"][2],
            "Nghị định số 214/2025/NĐ-CP (quy định về tùy chọn mua thêm).",
            "Dự toán đối với phần công việc tùy chọn mua thêm không cần phê duyệt ngay từ đầu cùng kế hoạch lựa chọn nhà thầu. Thay vào đó, trong quá trình thực hiện hợp đồng, khi chủ đầu tư có nhu cầu sử dụng khối lượng tùy chọn mua thêm, trước khi thực hiện, chủ đầu tư phê duyệt dự toán cho phần khối lượng mua thêm đó.",
            "Phương án A sai vì không bắt buộc phê duyệt dự toán khối lượng mua thêm trước khi phê duyệt KHLCNT.\n"
            "Phương án B sai vì không phải trình cấp có thẩm quyền – chủ đầu tư tự phê duyệt.\n"
            "Phương án D sai vì phải phê duyệt dự toán trước khi thực hiện khối lượng tùy chọn mua thêm.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    # Q369 – Nhân sự chủ chốt trùng thời gian → bổ sung/thay thế tối đa 02 lần; nếu không có thay thế → bị loại và đánh giá uy tín
    q = by[369]
    ex[369] = (
        block(
            "B",
            q["options"][1],
            "Nghị định số 214/2025/NĐ-CP; Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (xử lý nhân sự chủ chốt trùng thời gian).",
            "Khi phát hiện nhân sự chủ chốt của nhà thầu xếp hạng nhất đang huy động cho hợp đồng khác có thời gian trùng nhau, chủ đầu tư cho phép nhà thầu bổ sung, thay thế nhân sự đó, tối đa hai lần. Nếu sau hai lần nhà thầu vẫn không có nhân sự thay thế đáp ứng yêu cầu E-HSMT thì nhà thầu bị loại và bị đánh giá về uy tín khi tham dự thầu (đăng tải trên Hệ thống).",
            "Phương án A sai vì không loại ngay lập tức mà được phép bổ sung/thay thế tối đa 02 lần.\n"
            "Phương án C sai vì không tiếp tục đánh giá theo cam kết khi đã phát hiện vi phạm về nhân sự trùng thời gian.\n"
            "Phương án D sai vì không bị coi là gian lận nếu đây là nhầm lẫn; chỉ bị loại và đánh giá uy tín nếu không có nhân sự thay thế.",
        ),
        "Nghị định số 214/2025/NĐ-CP; Mẫu E-HSMT",
    )

    # Q370 – 02 công trình cấp III (dù giá trị ≥ 10 tỷ) không đáp ứng yêu cầu 01 công trình cấp II
    q = by[370]
    ex[370] = (
        block(
            "A",
            q["options"][0],
            "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (tiêu chí kinh nghiệm hợp đồng tương tự gói thầu xây lắp).",
            "Yêu cầu E-HSMT là hoàn thành toàn bộ hoặc phần lớn 01 công trình CẤP II. Nhà thầu trường hợp A hoàn thành 02 công trình cấp III (cấp thấp hơn cấp II) dù tổng giá trị lớn cũng không đáp ứng yêu cầu về cấp công trình. Tiêu chí kinh nghiệm về cấp công trình không thể cộng gộp hay thay thế bằng nhiều công trình cấp thấp hơn.",
            "Phương án B đáp ứng: công trình cấp II giá trị 10 tỷ, hoàn thành trong khoảng thời gian 01/01/2022 – thời điểm đóng thầu (ký 2018, hoàn thành 2022 là trong khoảng yêu cầu).\n"
            "Phương án C đáp ứng: công trình cấp II, 10 tỷ, ký 2022, hoàn thành 2025 trong khoảng yêu cầu.\n"
            "Phương án D sai vì A không đáp ứng do cấp công trình không đúng.",
        ),
        "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    # Q371 – Tư vấn lập thiết kế KT được phép: lập HSMT XL/HH, lập KHLCNT, tư vấn GSTC
    q = by[371]
    ex[371] = (
        block(
            "D",
            q["options"][3],
            "Điều 16 VBHN Luật Đấu thầu (các trường hợp cấm tham dự thầu).",
            "Nhà thầu tư vấn lập thiết kế kỹ thuật chỉ bị cấm trực tiếp tham dự thầu (tư cách nhà thầu) trong gói thầu thi công xây dựng của dự án đó. Các hoạt động (A) lập HSMT cho gói XL, HH; (B) lập KHLCNT; và (C) tư vấn giám sát thi công đều là các gói thầu dịch vụ tư vấn độc lập – Luật Đấu thầu không cấm nhà thầu lập thiết kế KT thực hiện các công việc này. Ba phương án đều được phép.",
            "Phương án A được phép: lập HSMT (gói tư vấn) không bị cấm đối với nhà thầu lập thiết kế KT.\n"
            "Phương án B được phép: lập KHLCNT là dịch vụ tư vấn khác, không bị cấm.\n"
            "Phương án C được phép: tư vấn GSTC là gói thầu dịch vụ tư vấn riêng, không phải gói thầu thi công mà nhà thầu lập thiết kế KT bị cấm tham dự.",
        ),
        "Điều 16 VBHN Luật Đấu thầu",
    )

    # Q372 – Lập báo cáo đánh giá HSDT không thuộc trách nhiệm CĐT (thuộc tổ chuyên gia)
    q = by[372]
    ex[372] = (
        block(
            "A",
            q["options"][0],
            "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP (trách nhiệm của chủ đầu tư và tổ chuyên gia).",
            "Lập báo cáo đánh giá hồ sơ dự thầu (E-HSDT) là trách nhiệm của tổ chuyên gia (tổ đánh giá E-HSDT), không phải của chủ đầu tư. Chủ đầu tư thực hiện: phê duyệt E-HSMT (C), thương thảo hợp đồng (B), yêu cầu nhà thầu làm rõ E-HSDT (D) và phê duyệt kết quả LCNT. Việc đánh giá và lập báo cáo đánh giá E-HSDT là nhiệm vụ độc lập của tổ chuyên gia.",
            "Phương án B thuộc trách nhiệm CĐT: thương thảo hợp đồng.\n"
            "Phương án C thuộc trách nhiệm CĐT: phê duyệt E-HSMT.\n"
            "Phương án D thuộc trách nhiệm CĐT: yêu cầu nhà thầu làm rõ E-HSDT (theo đề nghị của tổ chuyên gia).",
        ),
        "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP",
    )

    # Q373 – Tư vấn lập HSMT XL được tham dự tư vấn GSTC gói XL đó
    q = by[373]
    ex[373] = (
        block(
            "C",
            q["options"][2],
            "Khoản 7 Điều 16 VBHN Luật Đấu thầu (cấm tư vấn lập HSMT tham dự thầu gói thầu tương ứng).",
            "Tư vấn lập HSMT gói thầu xây lắp bị cấm tham dự thầu (tư cách nhà thầu xây lắp) trong gói thầu tương ứng đó. Tuy nhiên, tư vấn lập HSMT không bị cấm tham dự đấu thầu các gói thầu dịch vụ tư vấn khác của cùng dự án, như tư vấn giám sát thi công – đây là gói thầu dịch vụ tư vấn độc lập, không phải gói thầu mà mình đã lập HSMT.",
            "Phương án A sai vì tư vấn đánh giá HSDT gói XL mà mình lập HSMT bị cấm theo Khoản 8 Điều 16 (liên quan đến tổ thẩm định và tổ chuyên gia).\n"
            "Phương án B sai vì tư vấn thẩm định KQLCNT gói thầu mà mình lập HSMT cũng nằm trong phạm vi bị cấm theo Điều 16.\n"
            "Phương án D sai vì không phải tất cả đều được phép – A và B bị cấm.",
        ),
        "Khoản 7 Điều 16 VBHN Luật Đấu thầu",
    )

    # Q374 – HSDT khai giá không bao gồm thuế, phí → không được xem xét tiếp
    q = by[374]
    ex[374] = (
        block(
            "A",
            q["options"][0],
            "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (yêu cầu về giá dự thầu phải bao gồm thuế, phí, lệ phí).",
            "E-HSMT quy định giá dự thầu của nhà thầu bắt buộc phải bao gồm toàn bộ thuế, phí, lệ phí theo quy định. Nếu nhà thầu tuyên bố giá dự thầu không bao gồm thuế, phí, lệ phí, điều đó vi phạm yêu cầu cơ bản của E-HSMT → E-HSDT của nhà thầu không được tiếp tục xem xét, đánh giá (bị loại về tính hợp lệ).",
            "Phương án B sai vì không thể ngầm hiểu giá đã bao gồm thuế khi nhà thầu đã tuyên bố rõ là không bao gồm.\n"
            "Phương án C sai vì hiệu chỉnh sai lệch chỉ áp dụng cho sai lệch số học, không áp dụng để 'thêm vào' thuế/phí mà nhà thầu đã tuyên bố loại trừ.\n"
            "Phương án D sai vì giá dự thầu bắt buộc phải bao gồm thuế, phí theo quy định E-HSMT; không chấp nhận giá chưa bao gồm thuế.",
        ),
        "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    # Q375 – Yêu cầu nguồn lực tài chính: tất cả phương án A, B, C đều sai
    q = by[375]
    ex[375] = (
        block(
            "D",
            q["options"][3],
            "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC (yêu cầu về nguồn lực tài chính).",
            "Yêu cầu về nguồn lực tài chính (financial resources) được áp dụng đối với gói thầu mua sắm hàng hóa, xây lắp, dịch vụ phi tư vấn và hỗn hợp – không áp dụng cho gói thầu dịch vụ tư vấn. Do đó: A sai ('tất cả gói thầu' – quá rộng, bao gồm tư vấn); B sai ('chỉ phi tư vấn, mua sắm HH' – thiếu XL và hỗn hợp); C sai ('phi tư vấn, HH, XL' – thiếu hỗn hợp). Không có phương án nào nêu đúng phạm vi đầy đủ.",
            "Phương án A sai vì gói thầu dịch vụ tư vấn không yêu cầu nguồn lực tài chính theo mẫu tiêu chuẩn.\n"
            "Phương án B sai vì thiếu gói thầu xây lắp và hỗn hợp vốn có yêu cầu về nguồn lực tài chính.\n"
            "Phương án C sai vì thiếu gói thầu hỗn hợp trong danh sách.",
        ),
        "Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    # Q376 – Không gia hạn HLHSDT theo đề nghị CĐT → được hoàn trả BDDT
    q = by[376]
    ex[376] = (
        block(
            "C",
            q["options"][2],
            "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP (quy định về gia hạn hiệu lực HSDT và bảo đảm dự thầu).",
            "Khi chủ đầu tư đề nghị gia hạn hiệu lực hồ sơ dự thầu, nhà thầu có quyền từ chối không gia hạn. Trong trường hợp đó, nhà thầu được hoàn trả lại bảo đảm dự thầu (không bị tịch thu), vì đây là quyền của nhà thầu trong khuôn khổ pháp luật – không phải vi phạm. Nhà thầu cũng không bị đánh giá uy tín.",
            "Phương án A sai vì không được hoàn trả bảo đảm dự thầu là trường hợp nhà thầu vi phạm (rút HSDT trong HLHSDT, không ký HĐ sau khi trúng thầu...) – không phải trường hợp này.\n"
            "Phương án B sai vì nhà thầu từ chối gia hạn là quyền hợp pháp, không bị đánh giá uy tín hay đăng tải lên Hệ thống.\n"
            "Phương án D sai vì chỉ C là đúng.",
        ),
        "VBHN Luật Đấu thầu; Nghị định số 214/2025/NĐ-CP",
    )

    # Q377 – Nhà thầu được mời chỉ định thầu thông thường phải hạch toán tài chính độc lập
    q = by[377]
    ex[377] = (
        block(
            "B",
            q["options"][1],
            "Nghị định số 214/2025/NĐ-CP (điều kiện nhà thầu được mời nhận hồ sơ yêu cầu trong chỉ định thầu thông thường).",
            "Một trong những điều kiện để nhà thầu được mời nhận hồ sơ yêu cầu theo hình thức chỉ định thầu quy trình thông thường là nhà thầu phải hạch toán tài chính độc lập. Điều này đảm bảo tính minh bạch tài chính của nhà thầu trong quá trình thực hiện hợp đồng. Đây là điều kiện tiên quyết được quy định cụ thể trong Nghị định 214.",
            "Phương án A sai vì 'được đánh giá về năng lực và kinh nghiệm' là nội dung đánh giá, không phải điều kiện nhà thầu phải đáp ứng trước khi được mời.\n"
            "Phương án C sai vì 'độc lập về pháp lý và độc lập về tài chính với chủ đầu tư' là điều kiện liên quan đến xung đột lợi ích – yêu cầu hạch toán độc lập (B) là điều kiện riêng biệt và cụ thể hơn.\n"
            "Phương án D sai vì không phải tất cả đều đúng; B là điều kiện cụ thể nhất.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    # Q378 – DNNN vốn NSNN 100/1000 tỷ → phải tuân Luật ĐT vì là DNNN
    q = by[378]
    ex[378] = (
        block(
            "C",
            q["options"][2],
            "Khoản 1 Điều 2 VBHN Luật Đấu thầu (phạm vi điều chỉnh đối với doanh nghiệp nhà nước).",
            "Doanh nghiệp nhà nước A (nhà nước nắm giữ vốn chi phối) thực hiện dự án bắt buộc phải tuân thủ Luật Đấu thầu, không phụ thuộc vào tỷ lệ vốn ngân sách nhà nước trong dự án. Luật Đấu thầu quy định rõ DNNN thuộc phạm vi điều chỉnh khi sử dụng vốn của mình thực hiện dự án, bất kể tỷ lệ vốn NSNN là bao nhiêu.",
            "Phương án A sai vì tiêu chí 'vốn NSNN thấp hơn 30%' không phải căn cứ để miễn áp dụng Luật ĐT đối với DNNN.\n"
            "Phương án B sai vì DNNN không được tự do quyết định cách lựa chọn nhà thầu; phải tuân Luật ĐT.\n"
            "Phương án D sai vì chỉ C đúng.",
        ),
        "Khoản 1 Điều 2 VBHN Luật Đấu thầu",
    )

    # Q379 – Công ty B (DNNN A nắm 100% VĐL) → phải tuân Luật ĐT
    q = by[379]
    ex[379] = (
        block(
            "D",
            q["options"][3],
            "Khoản 1 Điều 2 VBHN Luật Đấu thầu (phạm vi điều chỉnh đối với doanh nghiệp do DNNN nắm giữ 100% vốn).",
            "Công ty B do DNNN A nắm giữ 100% vốn điều lệ → Công ty B cũng là doanh nghiệp do Nhà nước sở hữu 100% vốn (gián tiếp qua DNNN A). Theo Luật Đấu thầu, DNNN và các doanh nghiệp do DNNN nắm 100% vốn điều lệ khi thực hiện dự án đều bắt buộc phải tuân thủ Luật Đấu thầu, không phụ thuộc vào nguồn vốn hay tỷ lệ vốn NSNN.",
            "Phương án A sai vì không dựa vào tỷ lệ vốn NSNN để xác định phạm vi áp dụng Luật ĐT với Công ty B.\n"
            "Phương án B sai vì không phải áp dụng quy chế mua sắm của DNNN A mà phải áp dụng Luật ĐT trực tiếp.\n"
            "Phương án C sai vì Công ty B không được tự quyết định – phải tuân Luật ĐT.",
        ),
        "Khoản 1 Điều 2 VBHN Luật Đấu thầu",
    )

    # Q380 – Phương pháp KT+giá, thang 100, min KT 70đ: KN=3, uy tín=0, giải pháp=18, nhân sự=36
    q = by[380]
    ex[380] = (
        block(
            "C",
            q["options"][2],
            "Nghị định số 214/2025/NĐ-CP; Mẫu E-HSMT gói tư vấn kèm Thông tư số 79/2025/TT-BTC (quy định điểm tối thiểu từng nội dung).",
            "Điểm yêu cầu tối thiểu về kỹ thuật đối với từng nội dung đánh giá phải bằng 60% điểm tối đa của nội dung đó, ngoại trừ tiêu chí uy tín có thể quy định tối thiểu là 0 điểm. Tính toán: Kinh nghiệm và năng lực: 5 × 60% = 3 điểm; Uy tín: 0 điểm (không áp dụng tỷ lệ 60%); Giải pháp và phương pháp luận: 30 × 60% = 18 điểm; Nhân sự chủ chốt: 60 × 60% = 36 điểm. Tổng = 3+0+18+36 = 57 điểm < 70 (tổng tối thiểu); điểm tối thiểu từng nội dung được xác định đúng.",
            "Phương án A sai vì điểm tối thiểu uy tín = 3 là sai (uy tín được quy định là 0).\n"
            "Phương án B sai vì điểm tối thiểu uy tín = 3,5 là sai (uy tín = 0) và các mức khác tính theo 70% thay vì 60%.\n"
            "Phương án D sai vì điểm tối thiểu uy tín = 0 đúng nhưng các điểm khác tính theo 70% (3,5; 21; 42) là không đúng quy tắc 60%.",
        ),
        "Nghị định số 214/2025/NĐ-CP; Mẫu E-HSMT kèm Thông tư số 79/2025/TT-BTC",
    )

    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Lot19 filled: {filled}/20")


if __name__ == "__main__":
    main()
