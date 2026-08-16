# -*- coding: utf-8 -*-
"""Điền explanation Lô 8 (STT 141–160) theo mẫu 4 khối, căn cứ CSPL local."""
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

    q = by[141]
    ex[141] = (
        block(
            "A",
            q["options"][0],
            "Quy định về thông tin kết quả thực hiện hợp đồng Nghị định số 214/2025/NĐ-CP (chủ đầu tư hoặc đơn vị có nhu cầu mua sắm trong mua sắm tập trung đăng tải thông tin).",
            "Với gói thầu mua sắm tập trung, việc đăng tải/cung cấp thông tin về kết quả thực hiện hợp đồng của nhà thầu do đơn vị có nhu cầu mua sắm thực hiện (cùng vai trò tương ứng chủ đầu tư trong mua sắm thông thường).",
            "Phương án B sai vì bên mời thầu không phải chủ thể đăng tải kết quả thực hiện hợp đồng theo quy định nêu trên.\n"
            "Phương án C sai vì đơn vị tư vấn làm bên mời thầu không thay thế trách nhiệm này.\n"
            "Phương án D sai vì vẫn phải đăng tải thông tin về kết quả thực hiện hợp đồng.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[142]
    ex[142] = (
        block(
            "C",
            q["options"][2],
            "Khoản 3 quy định mua sắm tập trung Nghị định số 214/2025/NĐ-CP; Khoản 1 Điều 24 VBHN Luật Đấu thầu (chào hàng cạnh tranh).",
            "Mua sắm tập trung thực hiện qua đấu thầu rộng rãi; nếu hàng hóa thuộc danh mục MSTT đáp ứng điều kiện chào hàng cạnh tranh thì được áp dụng CHCT. Điều hòa thông dụng, sẵn có trên thị trường, giá gói 03 tỷ đồng phù hợp điều kiện CHCT → có thể chọn đấu thầu rộng rãi hoặc chào hàng cạnh tranh.",
            "Phương án A sai vì mua sắm trực tiếp không phải hình thức mặc định kèm MSTT trong tình huống này.\n"
            "Phương án B sai vì không mặc định ghép chỉ định thầu theo hạn mức như đáp án.\n"
            "Phương án D sai vì đàm phán giá/chỉ định thầu không phải cặp hình thức đúng cho tình huống điều hòa thông dụng 03 tỷ.",
        ),
        "Nghị định số 214/2025/NĐ-CP; Điều 24 VBHN Luật Đấu thầu",
    )

    q = by[143]
    ex[143] = (
        block(
            "B",
            q["options"][1],
            "Khoản 1 Điều 90 Nghị định số 214/2025/NĐ-CP.",
            "Đơn vị mua sắm tập trung thực hiện trách nhiệm của chủ đầu tư theo quy định tại Điều 78 Luật Đấu thầu, không phải trách nhiệm của người có thẩm quyền, bên mời thầu hay tổ chuyên gia.",
            "Phương án A sai vì không thực hiện trách nhiệm của người có thẩm quyền.\n"
            "Phương án C sai vì không xác định là trách nhiệm bên mời thầu theo cách nêu.\n"
            "Phương án D sai vì không phải trách nhiệm của tổ chuyên gia.",
        ),
        "Khoản 1 Điều 90 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[144]
    ex[144] = (
        block(
            "B",
            q["options"][1],
            "Quy định hoàn thiện, ký kết hợp đồng trong mua sắm tập trung Nghị định số 214/2025/NĐ-CP.",
            "Nhà thầu đã ký thỏa thuận khung, được đơn vị có nhu cầu yêu cầu ký hợp đồng nhưng không ký hợp đồng, không thực hiện bảo đảm thực hiện hợp đồng (trừ bất khả kháng) sẽ bị khóa tài khoản trên Hệ thống trong 06 tháng kể từ ngày đơn vị mua sắm tập trung công khai tên nhà thầu trên Hệ thống.",
            "Phương án A sai vì mốc công khai là đơn vị mua sắm tập trung, không phải đơn vị có nhu cầu.\n"
            "Phương án C sai vì không phải 03 tháng và không lấy mốc từ Bộ Tài chính nhận văn bản đề nghị.\n"
            "Phương án D sai vì không lấy mốc từ Bộ Tài chính nhận văn bản đề nghị.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[145]
    ex[145] = (
        block(
            "C",
            q["options"][2],
            "Quy định lựa chọn nhà thầu căn cứ khả năng cung cấp trong mua sắm tập trung Nghị định số 214/2025/NĐ-CP.",
            "Khi áp dụng khả năng cung cấp và phương pháp giá thấp nhất: danh sách nhà thầu trúng thầu phải bảo đảm tổng số lượng hàng hóa các nhà thầu trúng thầu chào bằng số lượng nêu trong HSMT, đồng thời tổng giá đề nghị trúng thầu của gói thầu thấp nhất (và không vượt giá gói thầu).",
            "Phương án A sai vì không dùng điểm tổng hợp cao nhất khi áp dụng giá thấp nhất.\n"
            "Phương án B sai vì phải thấp nhất chứ không phải cao nhất về tổng giá đề nghị trúng thầu.\n"
            "Phương án D sai vì tổng giá đánh giá thấp nhất áp dụng khi dùng phương pháp giá đánh giá, không phải giá thấp nhất.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[146]
    ex[146] = (
        block(
            "A",
            q["options"][0],
            "Quy định lựa chọn nhà thầu căn cứ khối lượng mời thầu trong mua sắm tập trung Nghị định số 214/2025/NĐ-CP.",
            "Khi lựa chọn theo khối lượng mời thầu, danh sách phê duyệt nhà thầu trúng thầu gồm danh sách chính (nhà thầu xếp thứ nhất) và danh sách dự bị (nhà thầu xếp thứ 2 trở đi).",
            "Phương án B sai vì danh sách dự bị không phải danh sách nhà thầu không đáp ứng.\n"
            "Phương án C sai vì không chỉ là danh sách đạt NLKN.\n"
            "Phương án D sai vì danh sách chính chỉ gồm nhà thầu xếp thứ nhất, không gồm cả xếp thứ 2.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[147]
    ex[147] = (
        block(
            "B",
            q["options"][1],
            "Khoản 5 Điều 53 VBHN Luật Đấu thầu.",
            "Hàng hóa, dịch vụ không thuộc danh mục mua sắm tập trung nhưng nhiều cơ quan, tổ chức, đơn vị có nhu cầu cùng loại thì có thể gộp thành một gói thầu để một trong các đơn vị mua sắm hoặc để đơn vị có chức năng mua sắm tập trung thực hiện.",
            "Phương án A sai vì không có thỏa thuận khung sẵn của UBND để bắt buộc mua theo cách đó.\n"
            "Phương án C sai vì không mặc định giao Sở Tài chính thực hiện.\n"
            "Phương án D sai vì không bắt buộc phải phê duyệt KHLCNT theo hình thức MSTT cho trường hợp ngoài danh mục theo cách nêu.",
        ),
        "Khoản 5 Điều 53 VBHN Luật Đấu thầu",
    )

    q = by[148]
    ex[148] = (
        block(
            "C",
            q["options"][2],
            "Điều 79 Nghị định số 214/2025/NĐ-CP (quy trình chỉ định thầu thông thường).",
            "Quy trình chỉ định thầu thông thường gồm lập–thẩm định–phê duyệt hồ sơ yêu cầu; xác định nhà thầu dự kiến được mời nhận hồ sơ yêu cầu (phát hành cho nhà thầu dự kiến chỉ định); đánh giá hồ sơ đề xuất và thương thảo về các đề xuất của nhà thầu; phê duyệt/công khai kết quả; hoàn thiện, ký kết hợp đồng. Bước “đánh giá HSDX và thương thảo đề xuất” là một bước đúng. Không có bước bắt buộc mời tối thiểu 03 nhà thầu như A, B.",
            "Phương án A sai vì quy trình thông thường không yêu cầu tối thiểu 03 nhà thầu nhận hồ sơ yêu cầu.\n"
            "Phương án B sai vì không gửi dự thảo hợp đồng cho tối thiểu 03 nhà thầu để đàm phán theo cách nêu.\n"
            "Phương án D sai vì A không đúng.",
        ),
        "Điều 79 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[149]
    ex[149] = (
        block(
            "C",
            q["options"][2],
            "Quy định mua sắm tập trung Nghị định số 214/2025/NĐ-CP (trường hợp đơn vị mua sắm tập trung không đủ năng lực thì thuê tư vấn đấu thầu).",
            "Nếu đơn vị được giao/đơn vị mua sắm tập trung không đủ năng lực, kinh nghiệm tổ chức lựa chọn nhà thầu thì được thuê tư vấn đấu thầu có kinh nghiệm để thực hiện việc lựa chọn nhà thầu.",
            "Phương án A sai vì không được bỏ yêu cầu năng lực tổ chuyên gia.\n"
            "Phương án B sai vì vẫn được thuê tư vấn khi không đủ năng lực.\n"
            "Phương án D sai vì A không đúng.",
        ),
        "Nghị định số 214/2025/NĐ-CP",
    )

    q = by[150]
    ex[150] = (
        block(
            "B",
            q["options"][1],
            "Ghi chú quy mô hợp đồng tương tự Mẫu E-HSMT hàng hóa (4A) kèm theo Thông tư số 79/2025/TT-BTC.",
            "Với mua sắm tập trung hoặc mua sắm hàng hóa có số lượng, khối lượng mời thầu lớn, có thể điều chỉnh giảm yêu cầu quy mô hợp đồng tương tự xuống còn Y/1,25 (Y thường khoảng 50% giá trị gói thầu) và/hoặc chia gói thành các phần (lô) để tăng cạnh tranh. Không phải Y/1,5; không bắt buộc mọi trường hợp; không bắt buộc báo cáo người có thẩm quyền theo cách nêu ở D.",
            "Phương án A sai vì không phải “trong mọi trường hợp” và không phải Y/1,5.\n"
            "Phương án C sai vì hệ số đúng là Y/1,25 chứ không phải Y/1,5.\n"
            "Phương án D sai vì mẫu không bắt buộc phải báo cáo người có thẩm quyền để giảm xuống Y/1,25 theo cách nêu.",
        ),
        "Mẫu E-HSMT hàng hóa (4A) kèm theo Thông tư số 79/2025/TT-BTC",
    )

    q = by[151]
    ex[151] = (
        block(
            "A",
            q["options"][0],
            "Khoản 1 Điều 77 VBHN Luật Đấu thầu; Điều 36 VBHN Luật Đấu thầu.",
            "Người có thẩm quyền phê duyệt kế hoạch tổng thể lựa chọn nhà thầu. Chủ đầu tư/người đứng đầu đơn vị chuẩn bị dự án không thay thế thẩm quyền này đối với kế hoạch tổng thể.",
            "Phương án B sai vì chủ đầu tư không phải chủ thể phê duyệt kế hoạch tổng thể.\n"
            "Phương án C sai vì người đứng đầu đơn vị chuẩn bị dự án không phê duyệt kế hoạch tổng thể.\n"
            "Phương án D sai vì bên mời thầu không có thẩm quyền này.",
        ),
        "Khoản 1 Điều 77 VBHN Luật Đấu thầu",
    )

    q = by[152]
    ex[152] = (
        block(
            "D",
            q["options"][3],
            "Điểm c Khoản 1 Điều 19 VBHN Luật Đấu thầu.",
            "Khi thuê tư vấn để lập hồ sơ mời quan tâm/sơ tuyển/mời thầu/yêu cầu và đánh giá hồ sơ tương ứng, tổ chuyên gia do đơn vị tư vấn thành lập (đơn vị tư vấn được chủ đầu tư lựa chọn).",
            "Phương án A sai vì người có thẩm quyền không thành lập tổ chuyên gia trong trường hợp này.\n"
            "Phương án B sai vì chủ đầu tư thành lập tổ chuyên gia khi không thuê tư vấn (Điểm a / Điều 78).\n"
            "Phương án C sai vì bên mời thầu không phải chủ thể thành lập tổ chuyên gia lựa chọn nhà thầu trong trường hợp thuê tư vấn.",
        ),
        "Điểm c Khoản 1 Điều 19 VBHN Luật Đấu thầu",
    )

    q = by[153]
    ex[153] = (
        block(
            "A",
            q["options"][0],
            "Điều 77 và Điểm a Khoản 1 Điều 78 VBHN Luật Đấu thầu.",
            "Phê duyệt kế hoạch lựa chọn nhà thầu thuộc trách nhiệm của chủ đầu tư (Điều 78), không thuộc trách nhiệm của người có thẩm quyền. Người có thẩm quyền phê duyệt kế hoạch tổng thể, giải quyết kiến nghị/xử lý vi phạm, hủy thầu/đình chỉ/không công nhận kết quả trong các trường hợp quy định.",
            "Phương án B thuộc trách nhiệm của người có thẩm quyền.\n"
            "Phương án C thuộc trách nhiệm hủy thầu của người có thẩm quyền khi thay đổi mục tiêu đầu tư.\n"
            "Phương án D thuộc trách nhiệm của người có thẩm quyền khi có hành vi vi phạm.",
        ),
        "Điều 77 và Điều 78 VBHN Luật Đấu thầu",
    )

    q = by[154]
    ex[154] = (
        block(
            "B",
            q["options"][1],
            "Khoản 2 Điều 40 và Điểm a Khoản 1 Điều 78 VBHN Luật Đấu thầu.",
            "Chủ đầu tư tổ chức lập và phê duyệt kế hoạch lựa chọn nhà thầu. Trường hợp chưa xác định được chủ đầu tư (đấu thầu trước/gói cần thực hiện trước khi phê duyệt dự án) thì người đứng đầu đơn vị được giao chuẩn bị dự án lập và phê duyệt. Do đó CĐT có trách nhiệm phê duyệt KHLCNT, trừ khi chưa xác định được CĐT.",
            "Phương án A sai vì chủ đầu tư có trách nhiệm phê duyệt KHLCNT.\n"
            "Phương án C sai vì đó chính là trường hợp chưa xác định CĐT — không thuộc trách nhiệm phê duyệt của CĐT.\n"
            "Phương án D sai vì không chỉ khi được ủy quyền.",
        ),
        "Điều 40 và Điều 78 VBHN Luật Đấu thầu",
    )

    q = by[155]
    ex[155] = (
        block(
            "B",
            q["options"][1],
            "Khoản 13a Điều 78 VBHN Luật Đấu thầu.",
            "Chủ đầu tư chấp thuận hoặc không chấp thuận việc điều chuyển khối lượng, phạm vi công việc của nhà thầu phụ cho tổ chức, đơn vị khác khi cần đáp ứng tiến độ, chất lượng gói thầu theo đề xuất của nhà thầu chính.",
            "Phương án A sai vì không thuộc thẩm quyền tổ chuyên gia.\n"
            "Phương án C sai vì không thuộc thẩm quyền người có thẩm quyền theo khoản này.\n"
            "Phương án D sai vì không thuộc thẩm quyền tổ thẩm định.",
        ),
        "Khoản 13a Điều 78 VBHN Luật Đấu thầu",
    )

    q = by[156]
    ex[156] = (
        block(
            "B",
            q["options"][1],
            "Điều 83 VBHN Luật Đấu thầu.",
            "Nội dung quản lý nhà nước về đấu thầu gồm ban hành VBQPPL, tổng kết đánh giá, quản lý hệ thống thông tin/CSDL, giám sát–thanh tra–kiểm tra, đào tạo bồi dưỡng, hợp tác quốc tế… Lập hồ sơ mời quan tâm/sơ tuyển/mời thầu/yêu cầu là công việc của chủ đầu tư/tổ chuyên gia trong lựa chọn nhà thầu, không phải nội dung quản lý nhà nước.",
            "Phương án A thuộc nội dung quản lý nhà nước (Khoản 3 Điều 83).\n"
            "Phương án C thuộc nội dung quản lý nhà nước (Khoản 5 Điều 83).\n"
            "Phương án D thuộc nội dung quản lý nhà nước (Khoản 6 Điều 83).",
        ),
        "Điều 83 VBHN Luật Đấu thầu",
    )

    q = by[157]
    ex[157] = (
        block(
            "D",
            q["options"][3],
            "Điểm a Khoản 2 Điều 86 VBHN Luật Đấu thầu.",
            "Kiểm tra hoạt động đấu thầu được thực hiện theo kế hoạch định kỳ hoặc đột xuất theo quyết định của người đứng đầu cơ quan có thẩm quyền kiểm tra. “Kiểm tra trực tiếp” và “báo cáo bằng văn bản” là phương thức kiểm tra theo Nghị định, không phải hình thức phân loại theo Luật ở câu hỏi này.",
            "Phương án A sai vì kiểm tra trực tiếp là phương thức, không phải hình thức định kỳ/đột xuất theo Luật.\n"
            "Phương án B sai vì báo cáo bằng văn bản là phương thức.\n"
            "Phương án C sai vì kết hợp hai phương thức không phải câu trả lời đúng theo cách hỏi về hình thức định kỳ/đột xuất.",
        ),
        "Điểm a Khoản 2 Điều 86 VBHN Luật Đấu thầu",
    )

    q = by[158]
    ex[158] = (
        block(
            "A",
            q["options"][0],
            "Khoản 3 Điều 133 Nghị định số 214/2025/NĐ-CP.",
            "Thời hiệu áp dụng biện pháp cấm tham gia hoạt động đấu thầu là 10 năm tính từ ngày xảy ra hành vi vi phạm (không phải từ ngày phát hiện; không phải 05 năm).",
            "Phương án B sai vì không tính từ ngày phát hiện.\n"
            "Phương án C sai vì không phải 05 năm từ ngày phát hiện.\n"
            "Phương án D sai vì không phải 05 năm từ ngày xảy ra hành vi.",
        ),
        "Khoản 3 Điều 133 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[159]
    ex[159] = (
        block(
            "B",
            q["options"][1],
            "Khoản 3 Điều 87 VBHN Luật Đấu thầu.",
            "Thẩm quyền cấm tham gia hoạt động đấu thầu thuộc: người có thẩm quyền (phạm vi quản lý); Bộ trưởng/Thủ trưởng cơ quan ngang Bộ, cơ quan thuộc Chính phủ, cơ quan khác ở Trung ương, Chủ tịch UBND cấp tỉnh; Bộ trưởng Bộ Tài chính. Chủ đầu tư không có quyền ban hành quyết định cấm tham gia hoạt động đấu thầu.",
            "Phương án A có quyền cấm trong phạm vi quản lý.\n"
            "Phương án C có quyền cấm trong phạm vi Bộ, ngành, địa phương.\n"
            "Phương án D có quyền cấm trong phạm vi địa phương.",
        ),
        "Khoản 3 Điều 87 VBHN Luật Đấu thầu",
    )

    q = by[160]
    ex[160] = (
        block(
            "C",
            q["options"][2],
            "Khoản 2 Điều 133 Nghị định số 214/2025/NĐ-CP.",
            "Nếu tổ chức, cá nhân có từ 02 hành vi vi phạm trở lên thuộc cùng phạm vi quản lý của người có thẩm quyền và các hành vi chưa bị cấm thì thời gian cấm bằng tổng thời gian cấm của các hành vi nhưng tối đa không quá 05 năm.",
            "Phương án A sai vì không quy định tối thiểu trên 05 năm.\n"
            "Phương án B sai vì trần là 05 năm, không phải 03 năm.\n"
            "Phương án D sai vì không lấy theo hành vi có mức cấm cao nhất mà lấy tổng (có trần 05 năm).",
        ),
        "Khoản 2 Điều 133 Nghị định số 214/2025/NĐ-CP",
    )

    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Lot8 filled: {filled}/20")


if __name__ == "__main__":
    main()
