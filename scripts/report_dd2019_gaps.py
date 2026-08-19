import importlib.util
import json
from pathlib import Path

spec = importlib.util.spec_from_file_location("p", "scripts/parse_dd2019.py")
p = importlib.util.module_from_spec(spec)
spec.loader.exec_module(p)

text = Path("tmp-dd-2019-bank.txt").read_text(encoding="utf-8")
law = p.parse_section(text[: text.find("PHẦN II.")], 80, "LAW")
skill = p.parse_part2(text)

bad_law = [q for q in law if q["answer"] < 0 or not all(q["options"])]
bad_skill = [q for q in skill if q["answer"] < 0 or not all(q["options"])]

out = Path("tmp-gaps.json")
out.write_text(
    json.dumps(
        {
            "bad_law": bad_law,
            "bad_skill": bad_skill,
        },
        ensure_ascii=False,
        indent=2,
    ),
    encoding="utf-8",
)
print("bad law", [q["num"] for q in bad_law])
print("bad skill", [q["num"] for q in bad_skill])
print("written", out)
