# -*- coding: utf-8 -*-
"""Điền explanation Lô 17 (STT 321–340) theo mẫu 4 khối, căn cứ CSPL FTA + local."""
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

    # Q321 – RCEP không có quy định về chỉ định thầu
    q = by[321]
    ex[321] = (
        block(
            "D",
            q["options"][3],
            "Nghị định số 95/2020/NĐ-CP (quy định chỉ định thầu theo CPTPP, EVFTA, UKVFTA).",
            "CPTPP (Điều 13.10), EVFTA (Chương 9) và UKVFTA đều có quy định về chỉ định thầu (single source procurement) trong các trường hợp ngoại lệ. Hiệp định Đối tác Kinh tế Toàn diện Khu vực (RCEP) không có chương riêng về mua sắm chính phủ và không quy định các trường hợp chỉ định thầu.",
            "Phương án A sai vì CPTPP có quy định về chỉ định thầu.\n"
            "Phương án B sai vì EVFTA có quy định về chỉ định thầu.\n"
            "Phương án C sai vì cả EVFTA lẫn UKVFTA đều có quy định về chỉ định thầu.",
        ),
        "Nghị định số 95/2020/NĐ-CP về đấu thầu theo CPTPP, EVFTA, UKVFTA",
    )

    # Q322 – Thuê quyền sử dụng đất không thuộc phạm vi NĐ 95
    q = by[322]
    ex[322] = (
        block(
            "C",
            q["options"][2],
            "Khoản 1, Khoản 2 Điều 1 Nghị định số 95/2020/NĐ-CP.",
            "Nghị định 95 điều chỉnh hoạt động mua sắm hàng hóa, dịch vụ (kể cả tư vấn, phi tư vấn), xây lắp và hỗn hợp sử dụng ngân sách nhà nước thuộc phạm vi các hiệp định FTA mà Việt Nam đã cam kết mở cửa thị trường mua sắm chính phủ. Thuê quyền sử dụng đất là hoạt động dân sự/hành chính đất đai, không phải mua sắm hàng hóa hay dịch vụ, nên không thuộc phạm vi điều chỉnh của Nghị định 95.",
            "Phương án A sai vì mua sắm thiết bị văn phòng là mua sắm hàng hóa, thuộc phạm vi NĐ 95.\n"
            "Phương án B sai vì thuê dịch vụ tư vấn thuộc phạm vi NĐ 95 khi đáp ứng điều kiện.\n"
            "Phương án D sai vì mua sắm vật tư y tế là mua sắm hàng hóa, thuộc phạm vi NĐ 95.",
        ),
        "Khoản 1, Khoản 2 Điều 1 Nghị định số 95/2020/NĐ-CP",
    )

    # Q323 – Nhà thầu nước ngoài tham gia khi gói thầu thuộc phạm vi hiệp định
    q = by[323]
    ex[323] = (
        block(
            "C",
            q["options"][2],
            "Khoản 1 Điều 4 Nghị định số 95/2020/NĐ-CP.",
            "Nhà thầu nước ngoài (nội khối hoặc quốc tế) được phép tham gia đấu thầu tại Việt Nam khi gói thầu thuộc phạm vi điều chỉnh của hiệp định (đáp ứng ngưỡng giá trị, loại hình mua sắm, loại cơ quan mua sắm theo Phụ lục NĐ 95). Không phải tất cả gói thầu, không chỉ ODA, và không phụ thuộc vào độ phức tạp.",
            "Phương án A sai vì không phải tất cả gói thầu mà chỉ gói thầu thuộc phạm vi hiệp định.\n"
            "Phương án B sai vì ODA không phải tiêu chí xác định phạm vi NĐ 95.\n"
            "Phương án D sai vì không phụ thuộc vào giá trị lớn hay độ phức tạp mà phụ thuộc vào phạm vi cam kết.",
        ),
        "Khoản 1 Điều 4 Nghị định số 95/2020/NĐ-CP",
    )

    # Q324 – Đấu thầu nội khối = chỉ nhà thầu nội khối được tham dự
    q = by[324]
    ex[324] = (
        block(
            "A",
            q["options"][0],
            "Khoản 1 Điều 4 Nghị định số 95/2020/NĐ-CP.",
            "Đấu thầu nội khối (intra-bloc procurement) là hình thức tổ chức đấu thầu chỉ cho phép nhà thầu của các nước thành viên trong khối (CPTPP, EVFTA hoặc UKVFTA) tham dự, không mở cửa cho nhà thầu ngoài khối.",
            "Phương án B sai vì đấu thầu nội khối không phải là đấu thầu cho dự án thuộc trong khối.\n"
            "Phương án C sai vì không phân biệt theo EVFTA/UKVFTA riêng.\n"
            "Phương án D sai vì đấu thầu nội khối khác với đấu thầu trong nước (trong nước chỉ mời nhà thầu VN).",
        ),
        "Khoản 1 Điều 4 Nghị định số 95/2020/NĐ-CP",
    )

    # Q325 – Ngoại lệ đấu thầu nội khối: NCTQ xét thấy cần đấu thầu quốc tế
    q = by[325]
    ex[325] = (
        block(
            "C",
            q["options"][2],
            "Khoản 3 Điều 1 Nghị định số 09/2022/NĐ-CP (sửa đổi Nghị định số 95/2020/NĐ-CP).",
            "Quy tắc chung là cơ quan mua sắm phải tổ chức đấu thầu nội khối. Tuy nhiên, người có thẩm quyền có thể quyết định tổ chức đấu thầu quốc tế nếu xét thấy cần thiết để mang lại hiệu quả cao hơn cho dự án hoặc gói thầu. Đây là căn cứ ngoại lệ duy nhất do pháp luật quy định.",
            "Phương án A sai vì không có quy định tự động chuyển sang ĐTQT khi không có nhà thầu trong nước.\n"
            "Phương án B sai vì giá trị gói thầu không phải căn cứ ngoại lệ theo NĐ 09/2022.\n"
            "Phương án D sai vì phải do NCTQ quyết định, không phải do hàng hóa phức tạp hay nhà thầu trong nước không đáp ứng.",
        ),
        "Khoản 3 Điều 1 Nghị định số 09/2022/NĐ-CP",
    )

    # Q326 – TT 21/2022: nhân sự chủ chốt phi tư vấn chỉ khi đặc thù phức tạp
    q = by[326]
    ex[326] = (
        block(
            "C",
            q["options"][2],
            "Điểm a Khoản 2 Điều 4 Thông tư số 21/2022/TT-BKHĐT.",
            "Đối với gói thầu dịch vụ phi tư vấn thuộc phạm vi các hiệp định FTA, hồ sơ mời thầu chỉ được đưa ra yêu cầu về nhân sự chủ chốt khi dịch vụ có yếu tố đặc thù, phức tạp mà cần thiết phải có nhân sự có hiểu biết sâu, nhiều kinh nghiệm đảm nhận. Không được áp đặt yêu cầu nhân sự chủ chốt một cách tùy tiện.",
            "Phương án A sai vì không thể yêu cầu nhân sự chủ chốt trong mọi trường hợp.\n"
            "Phương án B sai vì giá trị gói thầu không phải điều kiện để yêu cầu nhân sự chủ chốt theo TT 21.\n"
            "Phương án D sai vì nhà thầu không phải đơn vị quyết định có cần nhân sự chủ chốt hay không.",
        ),
        "Điểm a Khoản 2 Điều 4 Thông tư số 21/2022/TT-BKHĐT",
    )

    # Q327 – EVFTA có hiệu lực từ 01/8/2020 (câu hỏi bị cắt phần cuối)
    q = by[327]
    ex[327] = (
        block(
            "B",
            q["options"][1],
            "Hiệp định Thương mại Tự do Việt Nam – EU (EVFTA), thông tin chính thức.",
            "Hiệp định Thương mại Tự do giữa Cộng hòa xã hội chủ nghĩa Việt Nam và Liên minh Châu Âu (EVFTA) được Quốc hội Việt Nam phê chuẩn ngày 08/6/2020 và chính thức có hiệu lực từ ngày 01 tháng 8 năm 2020. Đây là mốc quan trọng mở ra nghĩa vụ mở cửa thị trường mua sắm chính phủ theo EVFTA đối với Việt Nam.",
            "Phương án A sai vì 01/7/2020 là ngày Quốc hội châu Âu phê chuẩn EVFTA, không phải ngày có hiệu lực.\n"
            "Phương án C sai vì 01/9/2020 không phải ngày có hiệu lực của EVFTA.\n"
            "Phương án D sai vì 01/10/2020 không phải ngày có hiệu lực của EVFTA.",
        ),
        "Hiệp định EVFTA; Nghị định số 09/2022/NĐ-CP",
    )

    # Q328 – Gói thầu UKVFTA HH dùng TT 12/2022/TT-BKHĐT
    q = by[328]
    ex[328] = (
        block(
            "B",
            q["options"][1],
            "Điều 1 Thông tư số 12/2022/TT-BKHĐT; Điểm a Khoản 1 Điều 36 Nghị định số 95/2020/NĐ-CP.",
            "Thông tư số 12/2022/TT-BKHĐT ban hành mẫu hồ sơ mời thầu mua sắm hàng hóa thuộc phạm vi Hiệp định CPTPP và UKVFTA. Tại thời điểm tháng 9/2025, đây vẫn là thông tư hiện hành áp dụng cho gói thầu mua sắm hàng hóa nội khối UKVFTA.",
            "Phương án A sai vì TT 09/2020/TT-BKHĐT là mẫu HSMT mua sắm HH cho đấu thầu rộng rãi trong nước, không phải FTA.\n"
            "Phương án C sai vì TT 15/2022/TT-BKHĐT áp dụng cho gói thầu dịch vụ phi tư vấn theo CPTPP/UKVFTA.\n"
            "Phương án D sai vì không có TT 20/2022/TT-BKHĐT về mẫu HSMT UKVFTA mua sắm HH.",
        ),
        "Thông tư số 12/2022/TT-BKHĐT; Nghị định số 95/2020/NĐ-CP",
    )

    # Q329 – Đấu thầu thuốc EVFTA do Bộ Y tế hướng dẫn (câu hỏi bị cắt phần cuối)
    q = by[329]
    ex[329] = (
        block(
            "B",
            q["options"][1],
            "Khoản 1 Điều 2 Nghị định số 09/2022/NĐ-CP (sửa đổi, bổ sung Nghị định 95/2020/NĐ-CP).",
            "Nghị định 09/2022 quy định việc đấu thầu thuốc theo Hiệp định EVFTA thuộc thẩm quyền hướng dẫn của Bộ Y tế (đối với lĩnh vực dược phẩm). Bộ Y tế ban hành các quy định đặc thù về đấu thầu thuốc phù hợp với cam kết mở cửa thị trường dược phẩm trong EVFTA.",
            "Phương án A sai vì Bộ Tư pháp không có thẩm quyền hướng dẫn đấu thầu thuốc theo EVFTA.\n"
            "Phương án C sai vì Bộ Tài chính hướng dẫn về thanh toán, không hướng dẫn đặc thù đấu thầu thuốc EVFTA.\n"
            "Phương án D sai vì Bộ Công Thương không có thẩm quyền hướng dẫn đấu thầu thuốc EVFTA.",
        ),
        "Khoản 1 Điều 2 Nghị định số 09/2022/NĐ-CP",
    )

    # Q330 – Việt Nam chưa phải thành viên GPA (câu hỏi bị cắt phần cuối)
    q = by[330]
    ex[330] = (
        block(
            "D",
            q["options"][3],
            "Thông tin chính thức từ WTO về danh sách thành viên Hiệp định GPA.",
            "Tính đến thời điểm hiện tại, Việt Nam chưa phải là thành viên chính thức của Hiệp định Mua sắm Chính phủ (Government Procurement Agreement – GPA) của WTO. Việt Nam đã có quan sát viên tại Ủy ban GPA nhưng chưa hoàn tất đàm phán và gia nhập. Mở cửa thị trường đấu thầu của Việt Nam hiện thực hiện qua các FTA song phương/đa phương (CPTPP, EVFTA, UKVFTA).",
            "Phương án A sai vì 2018 là thời điểm CPTPP được ký kết, không liên quan GPA.\n"
            "Phương án B sai vì 2019 là năm CPTPP có hiệu lực với Việt Nam, không liên quan GPA.\n"
            "Phương án C sai vì 2020 là năm EVFTA có hiệu lực, không liên quan GPA.",
        ),
        "Thông tin WTO về Hiệp định GPA",
    )

    # Q331 – "Nước thành viên" không bao gồm ASEAN chưa gia nhập CPTPP
    q = by[331]
    ex[331] = (
        block(
            "D",
            q["options"][3],
            "Điều 4 Nghị định số 17/2025/NĐ-CP (sửa đổi Nghị định 95/2020/NĐ-CP).",
            "Theo định nghĩa tại Nghị định 95 được sửa đổi bởi NĐ 17/2025, khái niệm 'Nước thành viên' trong phạm vi Nghị định chỉ bao gồm: các nước thành viên Hiệp định CPTPP, các nước thành viên EU (trong phạm vi EVFTA), và Vương quốc Anh và Bắc Ai-len (trong phạm vi UKVFTA). Các nước ASEAN chưa gia nhập CPTPP không được coi là nước thành viên trong phạm vi Nghị định 95.",
            "Phương án A sai vì nước thành viên CPTPP được bao gồm.\n"
            "Phương án B sai vì nước thành viên EU (phạm vi EVFTA) được bao gồm.\n"
            "Phương án C sai vì Vương quốc Anh và Bắc Ai-len (phạm vi UKVFTA) được bao gồm.",
        ),
        "Điều 4 Nghị định số 17/2025/NĐ-CP",
    )

    # Q332 – Ngôn ngữ CPTPP: tiếng Việt hoặc tiếng Việt và tiếng Anh
    q = by[332]
    ex[332] = (
        block(
            "C",
            q["options"][2],
            "Khoản 1 Điều 11 Nghị định số 95/2020/NĐ-CP.",
            "Đối với gói thầu thuộc phạm vi CPTPP, ngôn ngữ sử dụng trong đấu thầu nội khối là tiếng Việt; hoặc tiếng Việt và tiếng Anh. Cơ quan mua sắm lựa chọn ngôn ngữ phù hợp, đảm bảo nhà thầu nội khối có thể tiếp cận thông tin.",
            "Phương án A sai vì không bắt buộc chỉ tiếng Việt (nhà thầu nội khối cần hiểu được).\n"
            "Phương án B sai vì không dùng chỉ tiếng Anh (tiếng Việt là bắt buộc).\n"
            "Phương án D sai vì không cho phép bất kỳ ngôn ngữ nào của nước thành viên – phải có tiếng Việt.",
        ),
        "Khoản 1 Điều 11 Nghị định số 95/2020/NĐ-CP",
    )

    # Q333 – TT 21/2022: không yêu cầu kinh nghiệm ở quốc gia cụ thể
    q = by[333]
    ex[333] = (
        block(
            "C",
            q["options"][2],
            "Điểm b Khoản 1 Điều 4 Thông tư số 21/2022/TT-BKHĐT.",
            "Để bảo đảm cạnh tranh bình đẳng và nguyên tắc không phân biệt đối xử của các hiệp định FTA, hồ sơ mời thầu gói thầu dịch vụ phi tư vấn không được yêu cầu nhà thầu phải có kinh nghiệm cung cấp dịch vụ trong lãnh thổ của một quốc gia cụ thể nào. Điều kiện đó sẽ hạn chế sự tham gia của nhà thầu nước ngoài.",
            "Phương án A sai vì yêu cầu về năng lực là hợp lệ theo TT 21.\n"
            "Phương án B sai vì yêu cầu về kinh nghiệm (không gắn với lãnh thổ cụ thể) là hợp lệ.\n"
            "Phương án D sai vì yêu cầu về chất lượng dịch vụ là hợp lệ theo TT 21.",
        ),
        "Điểm b Khoản 1 Điều 4 Thông tư số 21/2022/TT-BKHĐT",
    )

    # Q334 – CPTPP: ưu đãi trong nước chỉ trong thời gian chuyển tiếp
    q = by[334]
    ex[334] = (
        block(
            "C",
            q["options"][2],
            "Khoản 3 Điều 5 Nghị định số 95/2020/NĐ-CP.",
            "Theo cam kết trong Hiệp định CPTPP, Việt Nam được phép áp dụng biện pháp ưu đãi nhà thầu/hàng hóa trong nước trong thời gian chuyển tiếp (transition period) được quy định cụ thể trong Phụ lục của Nghị định 95. Sau khi hết thời gian chuyển tiếp, không được tiếp tục áp dụng ưu đãi này.",
            "Phương án A sai vì không được áp dụng ưu đãi trong nước vĩnh viễn – chỉ trong thời gian chuyển tiếp.\n"
            "Phương án B sai vì CPTPP vẫn cho phép ưu đãi trong thời gian chuyển tiếp.\n"
            "Phương án D sai vì không phụ thuộc quy mô hay tính chất gói thầu mà phụ thuộc vào thời hạn chuyển tiếp.",
        ),
        "Khoản 3 Điều 5 Nghị định số 95/2020/NĐ-CP",
    )

    # Q335 – CPTPP hình thức LCNT: đấu thầu rộng rãi và chỉ định thầu
    q = by[335]
    ex[335] = (
        block(
            "C",
            q["options"][2],
            "Điều 20 và Điều 21 Nghị định số 95/2020/NĐ-CP.",
            "Theo Nghị định 95, đối với gói thầu thuộc phạm vi CPTPP, hai hình thức lựa chọn nhà thầu được áp dụng là: (1) Đấu thầu rộng rãi (open tendering) – hình thức mặc định; và (2) Chỉ định thầu (single source procurement) – áp dụng trong trường hợp ngoại lệ theo quy định. Không có hình thức đấu thầu hạn chế riêng theo CPTPP.",
            "Phương án A sai vì đấu thầu hạn chế không phải hình thức được quy định cho CPTPP.\n"
            "Phương án B sai vì không chỉ có chỉ định thầu – đấu thầu rộng rãi là hình thức chính.\n"
            "Phương án D sai vì còn có hình thức chỉ định thầu theo quy định ngoại lệ.",
        ),
        "Điều 20, Điều 21 Nghị định số 95/2020/NĐ-CP",
    )

    # Q336 – CPTPP: khuyến khích đấu thầu qua mạng
    q = by[336]
    ex[336] = (
        block(
            "C",
            q["options"][2],
            "Khoản 3 Điều 3 Nghị định số 95/2020/NĐ-CP.",
            "Nghị định 95 quy định CPTPP khuyến khích nhưng không bắt buộc các cơ quan mua sắm áp dụng đấu thầu điện tử (qua mạng) trong quá trình tổ chức lựa chọn nhà thầu. Đây là xu hướng minh bạch hóa và hiện đại hóa quy trình mua sắm mà các bên thành viên cam kết nỗ lực thực hiện.",
            "Phương án A sai vì CPTPP không cấm đấu thầu qua mạng.\n"
            "Phương án B sai vì CPTPP không bắt buộc phải áp dụng đấu thầu qua mạng.\n"
            "Phương án D sai vì việc khuyến khích không phụ thuộc vào quy mô hay tính chất từng gói thầu.",
        ),
        "Khoản 3 Điều 3 Nghị định số 95/2020/NĐ-CP",
    )

    # Q337 – Mua thuốc = gói thầu mua sắm hàng hóa
    q = by[337]
    ex[337] = (
        block(
            "A",
            q["options"][0],
            "Khoản 17 Điều 4 VBHN Luật Đấu thầu.",
            "Theo định nghĩa tại Luật Đấu thầu, gói thầu mua sắm hàng hóa bao gồm việc mua sắm máy móc, thiết bị, vật tư, hàng hóa thông thường, hàng hóa đặc thù (trong đó có thuốc, vắc xin, sinh phẩm y tế). Mua thuốc không phải là cung cấp dịch vụ, không phải xây lắp và không phải hỗn hợp.",
            "Phương án B sai vì mua thuốc là mua sắm hàng hóa, không phải cung cấp dịch vụ phi tư vấn.\n"
            "Phương án C sai vì gói thầu hỗn hợp kết hợp thiết kế, cung cấp hàng hóa và xây lắp; mua thuốc đơn thuần không phải hỗn hợp.\n"
            "Phương án D sai vì mua thuốc không liên quan đến xây dựng công trình.",
        ),
        "Khoản 17 Điều 4 VBHN Luật Đấu thầu",
    )

    # Q338 – Đàm phán giá: thuốc/TBYT/VTXN chỉ có 01 hoặc 02 hãng
    q = by[338]
    ex[338] = (
        block(
            "B",
            q["options"][1],
            "Điểm b Khoản 1 Điều 28 VBHN Luật Đấu thầu.",
            "Hình thức đàm phán giá được áp dụng đặc thù đối với gói thầu mua thuốc, thiết bị y tế, vật tư xét nghiệm mà trên thị trường chỉ có một hoặc hai hãng sản xuất. Quy định này nhằm đảm bảo nguồn cung y tế trong khi vẫn đàm phán để có giá hợp lý nhất có thể.",
            "Phương án A sai vì mua vật tư tiêu hao thông thường không phải căn cứ áp dụng đàm phán giá.\n"
            "Phương án C sai vì phạm vi hẹp hơn: không phải mọi hàng hóa 01 hãng mà đặc thù với thuốc/TBYT/VTXN.\n"
            "Phương án D sai vì đàm phán giá không áp dụng với mọi hàng hóa 01 hoặc 02 hãng, chỉ với thuốc, TBYT, VTXN.",
        ),
        "Điểm b Khoản 1 Điều 28 VBHN Luật Đấu thầu",
    )

    # Q339 – Luật 90/2025/QH15 hiệu lực từ 01/7/2025
    q = by[339]
    ex[339] = (
        block(
            "A",
            q["options"][0],
            "Điều 9 Luật số 90/2025/QH15.",
            "Luật số 90/2025/QH15 (sửa đổi, bổ sung một số điều của Luật Đấu thầu và các luật liên quan) quy định tại Điều 9 rằng Luật này có hiệu lực thi hành từ ngày 01 tháng 7 năm 2025. Đây là thời điểm có hiệu lực chính thức của luật sửa đổi.",
            "Phương án B sai vì 04/8/2025 không phải ngày hiệu lực của Luật 90.\n"
            "Phương án C sai vì 08/8/2025 là ngày hiệu lực của Thông tư 80/2025/TT-BTC, không phải Luật 90.\n"
            "Phương án D sai vì có đáp án đúng là A.",
        ),
        "Điều 9 Luật số 90/2025/QH15",
    )

    # Q340 – Thông tư 80/2025/TT-BTC hiệu lực từ 08/8/2025
    q = by[340]
    ex[340] = (
        block(
            "A",
            q["options"][0],
            "Khoản 1 Điều 6 Thông tư số 80/2025/TT-BTC.",
            "Thông tư số 80/2025/TT-BTC quy định chi tiết mẫu hồ sơ yêu cầu, báo cáo đánh giá, báo cáo thẩm định, kiểm tra và báo cáo tình hình thực hiện hoạt động đấu thầu, có hiệu lực từ ngày 08 tháng 8 năm 2025 theo quy định tại Khoản 1 Điều 6 của Thông tư này.",
            "Phương án B sai vì 04/8/2025 không phải ngày hiệu lực của TT 80.\n"
            "Phương án C sai vì 01/8/2025 là mốc khác, không phải ngày hiệu lực TT 80.\n"
            "Phương án D sai vì 01/7/2025 là ngày hiệu lực của Luật 90/2025/QH15, không phải TT 80.",
        ),
        "Khoản 1 Điều 6 Thông tư số 80/2025/TT-BTC",
    )

    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Lot17 filled: {filled}/20")


if __name__ == "__main__":
    main()
