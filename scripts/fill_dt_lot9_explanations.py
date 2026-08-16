# -*- coding: utf-8 -*-
"""Điền explanation Lô 9 (STT 161–180) theo mẫu 4 khối, căn cứ CSPL local."""
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

    # Fix truncated prompt Q168 (đối chiếu source cũ + Điều 16/133)
    by[168]["prompt"] = (
        "Nhà thầu liên danh A-B gồm 2 thành viên là nhà thầu A và nhà thầu B. "
        "Nhà thầu A thực hiện hành vi dàn xếp, thỏa thuận, ép buộc để một hoặc các bên chuẩn bị hồ sơ dự thầu "
        "hoặc rút hồ sơ dự thầu để một bên trúng thầu thì việc cấm tham gia hoạt động đấu thầu được xử lý như thế nào?"
    )

    q = by[161]
    ex[161] = (
        block(
            "D",
            q["options"][3],
            "Khoản 4 Điều 16 VBHN Luật Đấu thầu; Điểm a Khoản 1 Điều 133 Nghị định số 214/2025/NĐ-CP.",
            "Gian lận thuộc Khoản 4 Điều 16. Theo Điểm a Khoản 1 Điều 133 NĐ 214, vi phạm các khoản 1, 2, 4 và điểm a khoản 3 Điều 16 bị cấm từ 03 năm đến 05 năm.",
            "Phương án A sai vì mức 06 tháng–01 năm áp dụng nhóm hành vi khác (điểm a–e khoản 6, khoản 7).\n"
            "Phương án B sai vì không có mức cố định 02 năm.\n"
            "Phương án C sai vì 01–02 năm/01–03 năm không khớp mức cấm gian lận.",
        ),
        "Khoản 4 Điều 16 VBHN Luật Đấu thầu; Điểm a Khoản 1 Điều 133 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[162]
    ex[162] = (
        block(
            "C",
            q["options"][2],
            "Khoản 5 Điều 16 VBHN Luật Đấu thầu; Điểm b Khoản 1 Điều 133 Nghị định số 214/2025/NĐ-CP.",
            "Cản trở thuộc Khoản 5 Điều 16. Theo Điểm b Khoản 1 Điều 133, vi phạm khoản 5 Điều 16 bị cấm từ 01 năm đến 03 năm.",
            "Phương án A sai vì không có mức cố định 06 tháng.\n"
            "Phương án B sai vì không khớp khung 01–03 năm.\n"
            "Phương án D sai vì không có mức cố định 05 năm cho cản trở.",
        ),
        "Khoản 5 Điều 16 VBHN Luật Đấu thầu; Điểm b Khoản 1 Điều 133 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[163]
    ex[163] = (
        block(
            "A",
            q["options"][0],
            "Điểm a Khoản 4 Điều 16 VBHN Luật Đấu thầu; Điểm a Khoản 1 và đoạn về nhà thầu liên danh Điều 133 Nghị định số 214/2025/NĐ-CP.",
            "Làm giả/sai lệch thông tin, hồ sơ, tài liệu là gian lận (điểm a khoản 4 Điều 16) → cấm 03–05 năm. Với liên danh, khoản 4 thuộc trường hợp chỉ cấm thành viên vi phạm, không cấm các thành viên còn lại.",
            "Phương án B sai vì mức 01–dưới 03 năm không đúng với gian lận.\n"
            "Phương án C sai vì không cấm cả liên danh khi chỉ một thành viên làm giả tài liệu.\n"
            "Phương án D sai vì vừa sai mức vừa sai phạm vi liên danh.",
        ),
        "Điểm a Khoản 4 Điều 16 VBHN Luật Đấu thầu; Điều 133 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[164]
    ex[164] = (
        block(
            "B",
            q["options"][1],
            "Điểm a Khoản 1 Điều 18 VBHN Luật Đấu thầu.",
            "Đình chỉ cuộc thầu được thực hiện trong quá trình tổ chức lựa chọn nhà thầu cho đến trước khi phê duyệt kết quả lựa chọn nhà thầu.",
            "Phương án A sai vì khoảng thời gian nêu không khớp quy định đình chỉ.\n"
            "Phương án C sai vì sau phê duyệt kết quả không còn là phạm vi đình chỉ cuộc thầu.\n"
            "Phương án D sai vì đình chỉ không áp dụng trong quá trình thực hiện hợp đồng.",
        ),
        "Điểm a Khoản 1 Điều 18 VBHN Luật Đấu thầu",
    )

    q = by[165]
    ex[165] = (
        block(
            "C",
            q["options"][2],
            "Điểm b Khoản 1 Điều 18 VBHN Luật Đấu thầu.",
            "Không công nhận kết quả lựa chọn nhà thầu được thực hiện trong quá trình tổ chức lựa chọn nhà thầu và trong quá trình thực hiện hợp đồng. Hủy thầu và đình chỉ cuộc thầu không phải biện pháp thực hiện trong giai đoạn thực hiện hợp đồng theo cách nêu ở câu hỏi.",
            "Phương án A sai vì hủy thầu không phải biện pháp áp dụng trong quá trình thực hiện hợp đồng theo Điểm b Khoản 1 Điều 18.\n"
            "Phương án B sai vì đình chỉ chỉ đến trước khi phê duyệt kết quả.\n"
            "Phương án D sai vì A và B đều không đúng.",
        ),
        "Điểm b Khoản 1 Điều 18 VBHN Luật Đấu thầu",
    )

    q = by[166]
    ex[166] = (
        block(
            "C",
            q["options"][2],
            "Điểm g Khoản 6 Điều 16 VBHN Luật Đấu thầu; Điểm b Khoản 1 Điều 133 Nghị định số 214/2025/NĐ-CP.",
            "Nhà thầu tư vấn giám sát đồng thời thực hiện tư vấn kiểm định đối với gói thầu do mình giám sát là hành vi bị cấm tại điểm g khoản 6 Điều 16. Theo Điểm b Khoản 1 Điều 133, điểm g khoản 6 bị cấm từ 01 năm đến 03 năm. Không kèm nghĩa vụ nộp bảo đảm dự thầu gấp 03 lần như phương án A/B.",
            "Phương án A sai vì ghép thêm chế tài bảo đảm dự thầu gấp 03 lần không đúng với hành vi này.\n"
            "Phương án B sai vì không chỉ xử lý bằng bảo đảm dự thầu gấp 03 lần.\n"
            "Phương án D sai vì đây là hành vi bị cấm, phải xử lý.",
        ),
        "Điểm g Khoản 6 Điều 16 VBHN Luật Đấu thầu; Điểm b Khoản 1 Điều 133 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[167]
    ex[167] = (
        block(
            "D",
            q["options"][3],
            "Điểm b Khoản 6 Điều 16 VBHN Luật Đấu thầu; Điểm c Khoản 1 Điều 133 Nghị định số 214/2025/NĐ-CP.",
            "Tham gia lập đồng thời thẩm định HSMT đối với cùng một gói thầu thuộc điểm b khoản 6 Điều 16. Theo Điểm c Khoản 1 Điều 133, các điểm a–e khoản 6 bị cấm từ 06 tháng đến 01 năm.",
            "Phương án A sai vì không có mức cố định 02 năm.\n"
            "Phương án B sai vì không khớp khung 06 tháng–01 năm.\n"
            "Phương án C sai vì không khớp khung 06 tháng–01 năm.",
        ),
        "Điểm b Khoản 6 Điều 16 VBHN Luật Đấu thầu; Điểm c Khoản 1 Điều 133 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[168]
    ex[168] = (
        block(
            "B",
            q["options"][1],
            "Điểm a Khoản 3 Điều 16 VBHN Luật Đấu thầu; Điểm a Khoản 1 Điều 133 Nghị định số 214/2025/NĐ-CP (quy định về nhà thầu liên danh).",
            "Hành vi dàn xếp/thỏa thuận/ép buộc để chuẩn bị hoặc rút HSDT nhằm một bên trúng thầu là thông thầu (điểm a khoản 3 Điều 16) → cấm 03–05 năm. Điểm a khoản 3 không thuộc các trường hợp chỉ cấm thành viên vi phạm → cấm tất cả thành viên liên danh A-B.",
            "Phương án A sai vì không chỉ cấm riêng thành viên A.\n"
            "Phương án C sai vì vừa sai mức vừa sai phạm vi.\n"
            "Phương án D sai vì mức 01–03 năm không đúng với điểm a khoản 3.",
        ),
        "Điểm a Khoản 3 Điều 16 VBHN Luật Đấu thầu; Điều 133 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[169]
    ex[169] = (
        block(
            "A",
            q["options"][0],
            "Điểm a Khoản 4 Điều 16 VBHN Luật Đấu thầu; Điều 133 Nghị định số 214/2025/NĐ-CP (ngoại lệ liên danh).",
            "Làm giả thông tin/hồ sơ về hợp đồng tương tự là gian lận (điểm a khoản 4) → cấm 03–05 năm; khoản 4 thuộc ngoại lệ chỉ cấm thành viên vi phạm → chỉ cấm A.",
            "Phương án B sai vì không cấm cả liên danh trong trường hợp này.\n"
            "Phương án C sai vì mức không đúng.\n"
            "Phương án D sai vì vừa sai mức vừa sai phạm vi.",
        ),
        "Điểm a Khoản 4 Điều 16 VBHN Luật Đấu thầu; Điều 133 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[170]
    ex[170] = (
        block(
            "B",
            q["options"][1],
            "Khoản 2 Điều 20 Nghị định số 214/2025/NĐ-CP.",
            "Khi nhà thầu bị đánh giá về uy tín (gồm không hoàn thiện/ký hợp đồng sau trúng thầu): với gói tư vấn, thông tin uy tín được dùng để đánh giá về kỹ thuật; với các gói còn lại phải nộp bảo đảm dự thầu gấp 03 lần trong 02 năm và không bị xem xét đánh giá kỹ thuật theo hướng bất lợi như C. Phương án A sai vì nêu 03 năm thay vì 02 năm.",
            "Phương án A sai vì thời hạn là 02 năm, không phải 03 năm.\n"
            "Phương án C sai vì gói HH/XL/PTV/hỗn hợp không đưa uy tín vào đánh giá kỹ thuật theo cách nêu.\n"
            "Phương án D sai vì C không đúng.",
        ),
        "Khoản 2 Điều 20 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[171]
    ex[171] = (
        block(
            "C",
            q["options"][2],
            "Khoản 2 Điều 20 Nghị định số 214/2025/NĐ-CP.",
            "Đối với gói thầu dịch vụ tư vấn, thông tin về uy tín trong việc tham dự thầu được sử dụng để đánh giá về kỹ thuật (nếu có).",
            "Phương án A sai vì không dùng để đánh giá NLKN theo quy định này.\n"
            "Phương án B sai vì không dùng để đánh giá tư cách hợp lệ.\n"
            "Phương án D sai vì không đương nhiên loại nhà thầu chỉ vì đã bị đánh giá về uy tín.",
        ),
        "Khoản 2 Điều 20 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[172]
    ex[172] = (
        block(
            "A",
            q["options"][0],
            "Khoản 1 Điều 89 VBHN Luật Đấu thầu; Khoản 1 Điều 138 Nghị định số 214/2025/NĐ-CP.",
            "Kiến nghị về các vấn đề trước khi có thông báo kết quả lựa chọn nhà thầu do chủ đầu tư, người có thẩm quyền giải quyết theo quy trình tương ứng (không qua Hội đồng giải quyết kiến nghị như với kiến nghị về kết quả).",
            "Phương án B sai vì Hội đồng không phải chủ thể giải quyết kiến nghị trước kết quả.\n"
            "Phương án C sai vì thiếu chủ đầu tư / thừa Hội đồng.\n"
            "Phương án D sai vì tổ chuyên gia không giải quyết kiến nghị.",
        ),
        "Điều 89 VBHN Luật Đấu thầu; Điều 138 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[173]
    ex[173] = (
        block(
            "B",
            q["options"][1],
            "Khoản 4 Điều 89 VBHN Luật Đấu thầu; Khoản 2 Điều 138 Nghị định số 214/2025/NĐ-CP.",
            "Kiến nghị về kết quả lựa chọn nhà thầu do chủ đầu tư và Hội đồng giải quyết kiến nghị thực hiện (theo hai nhánh quy trình gửi CĐT hoặc gửi bộ phận thường trực/Hội đồng).",
            "Phương án A sai vì người có thẩm quyền không phải cặp chủ thể giải quyết kiến nghị về kết quả theo Khoản 4 Điều 89.\n"
            "Phương án C sai vì thiếu chủ đầu tư.\n"
            "Phương án D sai vì tên đúng là Hội đồng giải quyết kiến nghị, không phải Hội đồng tư vấn.",
        ),
        "Khoản 4 Điều 89 VBHN Luật Đấu thầu; Điều 138 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[174]
    ex[174] = (
        block(
            "B",
            q["options"][1],
            "Khoản 2 Điều 89 VBHN Luật Đấu thầu.",
            "Đang giải quyết kiến nghị mà nhà thầu gửi đơn khiếu nại (hoặc tố cáo, khởi kiện) thì việc giải quyết kiến nghị được chấm dứt ngay.",
            "Phương án A sai vì không tiếp tục giải quyết kiến nghị.\n"
            "Phương án C sai vì không tạm dừng chờ khiếu nại.\n"
            "Phương án D sai vì B đúng.",
        ),
        "Khoản 2 Điều 89 VBHN Luật Đấu thầu",
    )

    q = by[175]
    ex[175] = (
        block(
            "B",
            q["options"][1],
            "Điểm đ Khoản 2 Điều 137 Nghị định số 214/2025/NĐ-CP.",
            "Chi phí giải quyết kiến nghị do nhà thầu nộp cho bộ phận thường trực giúp việc cho Chủ tịch Hội đồng giải quyết kiến nghị.",
            "Phương án A sai vì không nộp trực tiếp cho Chủ tịch Hội đồng.\n"
            "Phương án C sai vì không nộp cho chủ đầu tư.\n"
            "Phương án D sai vì không nộp cho người có thẩm quyền.",
        ),
        "Điểm đ Khoản 2 Điều 137 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[176]
    ex[176] = (
        block(
            "D",
            q["options"][3],
            "Khoản 3 Điều 15 Nghị định số 214/2025/NĐ-CP.",
            "Nhà thầu không được hoàn trả chi phí đã nộp khi: một hoặc các nội dung kiến nghị kết luận là không đúng; hoặc nhà thầu rút đơn kiến nghị trong quá trình giải quyết. Cả B và C đều đúng → chọn D. Khi kiến nghị đúng thì được hoàn trả (A).",
            "Phương án A sai vì kiến nghị đúng thì được hoàn trả.\n"
            "Phương án B đúng nhưng chưa đủ.\n"
            "Phương án C đúng nhưng chưa đủ.",
        ),
        "Khoản 3 Điều 15 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[177]
    ex[177] = (
        block(
            "B",
            q["options"][1],
            "Khoản 2 Điều 138 Nghị định số 214/2025/NĐ-CP.",
            "Đối với kiến nghị về kết quả lựa chọn nhà thầu, Hội đồng giải quyết kiến nghị phải có văn bản giải quyết kiến nghị trong thời hạn 30 ngày kể từ ngày Hội đồng được thành lập.",
            "Phương án A sai vì không phải 25 ngày.\n"
            "Phương án C sai vì không phải 35 ngày.\n"
            "Phương án D sai vì không phải 20 ngày.",
        ),
        "Khoản 2 Điều 138 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[178]
    ex[178] = (
        block(
            "C",
            q["options"][2],
            "Phần quy định về giải quyết kiến nghị đối với tổ chức, đơn vị, doanh nghiệp nhà nước tại Điều 138 Nghị định số 214/2025/NĐ-CP.",
            "Người đứng đầu tổ chức, đơn vị, doanh nghiệp nhà nước tự ban hành điều kiện, quy trình về giải quyết kiến nghị trong đơn vị mình (áp dụng với gói thầu sử dụng vốn sản xuất kinh doanh của DNNN theo quy định này).",
            "Phương án A sai vì không mặc định giao Sở Tài chính.\n"
            "Phương án B sai vì không mặc định giao Bộ trưởng Bộ Tài chính.\n"
            "Phương án D sai vì C đúng.",
        ),
        "Điều 138 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[179]
    ex[179] = (
        block(
            "B",
            q["options"][1],
            "Khoản 1 Điều 138 Nghị định số 214/2025/NĐ-CP.",
            "Kiến nghị trước khi có thông báo kết quả: nếu nhà thầu gửi đơn đồng thời đến người có thẩm quyền và chủ đầu tư thì trách nhiệm giải quyết kiến nghị thuộc chủ đầu tư.",
            "Phương án A sai vì không ưu tiên người có thẩm quyền khi gửi đồng thời.\n"
            "Phương án C sai vì bộ phận thường trực không giải quyết kiến nghị trước kết quả.\n"
            "Phương án D sai vì Hội đồng không giải quyết kiến nghị trước kết quả.",
        ),
        "Khoản 1 Điều 138 Nghị định số 214/2025/NĐ-CP",
    )

    q = by[180]
    ex[180] = (
        block(
            "D",
            q["options"][3],
            "Khoản 2 Điều 138 Nghị định số 214/2025/NĐ-CP.",
            "Kiến nghị về kết quả: nếu nhà thầu gửi đơn đồng thời đến bộ phận thường trực và chủ đầu tư thì trách nhiệm giải quyết kiến nghị thuộc Hội đồng giải quyết kiến nghị.",
            "Phương án A sai vì không thuộc người có thẩm quyền trong tình huống gửi đồng thời này.\n"
            "Phương án B sai vì khi gửi đồng thời thì không giao chủ đầu tư.\n"
            "Phương án C sai vì bộ phận thường trực là đầu mối nhận/hỗ trợ, trách nhiệm giải quyết thuộc Hội đồng.",
        ),
        "Khoản 2 Điều 138 Nghị định số 214/2025/NĐ-CP",
    )

    # Verify Điều 18 number for đình chỉ
    filled = 0
    for stt, (explanation, source) in ex.items():
        qq = by[stt]
        qq["explanation"] = explanation
        qq["source"] = source
        filled += 1

    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Lot9 filled: {filled}/20; Q168 prompt fixed")


if __name__ == "__main__":
    main()
