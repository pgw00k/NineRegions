# -*- coding: utf-8 -*-
"""Parse LUA\\LuaScripts\\DataTable\\TableCard_Buffers.lua into JSON + Excel.

The output object maps buffer ID -> buffer fields in the declaration order of
BuffersDefine:

{ID, Desc, Priority, ActiveEffect, Parm1, Parm2, Parm3, ParmList,
 UIInteraction, MyUIInteractionBuilder, OpponentUIInteractionBuilder,
 CanChangeTarget}.

String-typed fields (Desc / MyUIInteractionBuilder / OpponentUIInteractionBuilder)
store a string-table ID in the LUA table; each is resolved via
LUA\\Table\\idToString.json. LUA values written as ``blank`` mean "no value" and
become "" / []. Array-typed fields are emitted as JSON arrays. The ActiveEffect
enum keeps its numeric form in JSON, while the Excel preview annotates it as
``SummonHand(20)``.
"""
import argparse
import json
import os
import re

try:
    from openpyxl import Workbook
    from openpyxl.styles import Font
except ImportError:  # pragma: no cover
    Workbook = None
    Font = None

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEFAULT_LUA_TABLE = os.path.join(
    PROJECT_ROOT, "LUA", "LuaScripts", "DataTable", "TableCard_Buffers.lua"
)
DEFAULT_ID_TO_STRING = os.path.join(PROJECT_ROOT, "LUA", "Table", "idToString.json")
DEFAULT_OUTPUT_DIR = os.path.join(PROJECT_ROOT, "data")
DEFAULT_OUTPUT_NAME = "Buffers.json"
DEFAULT_OUTPUT_EXCEL_NAME = "Buffers.xlsx"

# BuffersDefine field schema: (name, kind) in LUA tuple order.
# kind is one of: number / string / boolean / enum / array / string_array.
BUFFERS_DEFINE_FIELDS = [
    ("ID", "number"),
    ("Desc", "string"),
    ("Priority", "number"),
    ("ActiveEffect", "enum"),
    ("Parm1", "number"),
    ("Parm2", "number"),
    ("Parm3", "number"),
    ("ParmList", "array"),
    ("UIInteraction", "number"),
    ("MyUIInteractionBuilder", "string_array"),
    ("OpponentUIInteractionBuilder", "string_array"),
    ("CanChangeTarget", "boolean"),
]

# ActiveEffect enum: numeric value -> display name (used only for the Excel preview).
ACTIVE_EFFECT_NAMES = {
    0: "None",
    1: "Damage",
    2: "Control",
    3: "AdditionalAttack",
    4: "Devour",
    5: "Draw",
    6: "RestoreHP",
    7: "SpecialSummon",
    8: "GiveAbilities",
    9: "Destroy",
    10: "CreateCard",
    11: "Revive",
    12: "HandChangeCost",
    13: "HandThrow",
    14: "GiveAcitveAbilities",
    15: "Move",
    16: "Change",
    17: "Talk",
    18: "MaxMana",
    19: "TempMana",
    20: "SummonHand",
    21: "BackHand",
    22: "DamageSpecial",
    23: "CopyToHand",
    24: "SummonDeck",
    25: "GetUseCards",
    26: "CancelSkill",
    27: "Silence",
    28: "ChangeCostByField",
    29: "ExplanChange",
    30: "MutiDamage",
    31: "ChageHeroAndSkill",
    32: "ChageExplanByHero",
    33: "ChangeLayer",
    34: "CreateAndSummon",
    35: "BackDeck",
    36: "GetCard",
    37: "SummonCopy",
    38: "GraToDeck",
    39: "Exile",
    40: "CleanGra",
    41: "PlayerHPChange",
    42: "LeaveBattle",
    43: "Reap",
    44: "HandChange",
    45: "HealSpecial",
    46: "DefChange",
    47: "ChangeRevive",
    48: "ChangeBuffTarget",
    49: "HugeExit",
    50: "DestroyPlayer",
    51: "SpecialSpell",
    52: "GiveHaloAbilities",
    53: "HandChangeFromDeck",
    54: "LeaveBattleTrigger",
    55: "DealSameDamage",
    56: "NowManaChange",
    57: "MoveDeckTop",
    58: "Charge",
    59: "MaxTempMana",
    60: "LostTempMana",
    61: "CreateOppHand",
    62: "LeaveSummon",
    63: "TriggerSkill",
    64: "DeckThrow",
    65: "CreateCardToOther",
    66: "HeroSkillCD",
    67: "CopyAndUseSkill",
    68: "CancelDevour",
}

ROW_RE = re.compile(r"^\[(\d+)\]\s*=\s*\{")


def split_top_level(body):
    """Split the inner token stream of a record into tokens at top depth.

    Braces of nested ``{ ... }`` tables are kept as part of the token so the
    caller can tell arrays apart from scalars.
    """
    tokens = []
    cur = []
    depth = 0
    for ch in body:
        if ch == "{":
            cur.append(ch)
            depth += 1
        elif ch == "}":
            depth -= 1
            cur.append(ch)
        elif ch == "," and depth == 0:
            tokens.append("".join(cur).strip())
            cur = []
        else:
            cur.append(ch)
    tail = "".join(cur).strip()
    if tail:
        tokens.append(tail)
    return tokens


def parse_array_items(text):
    """Parse the inner token stream of a LUA ``{ ... }`` array literal."""
    text = text.strip()
    if not text.startswith("{") or not text.endswith("}"):
        raise ValueError("array field should hold {...}, got: " + text)
    inner = text[1:-1].strip()
    if not inner:
        return []
    return split_top_level(inner)


def load_id_to_string(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def parse_buffers(lua_path):
    """Yield (buffer_id, raw_token_list) rows parsed from the LUA data table."""
    with open(lua_path, encoding="utf-8") as fh:
        for line in fh:
            m = ROW_RE.match(line)
            if not m:
                continue
            buffer_id = int(m.group(1))
            inner = line[m.end():].strip()
            if inner.endswith(","):
                inner = inner[:-1]
            if inner.endswith("}"):
                inner = inner[:-1]
            tokens = split_top_level(inner)
            yield buffer_id, tokens


def convert(lua_table, id_to_string, output_path):
    """Run the conversion and return (result, mismatches)."""
    field_names = [name for name, _ in BUFFERS_DEFINE_FIELDS]
    expected = len(field_names)
    kind_by_name = {name: kind for name, kind in BUFFERS_DEFINE_FIELDS}

    def resolve_string_id(raw_id):
        value = id_to_string.get(raw_id)
        return value if value is not None else ""

    def decode_field(raw, kind):
        raw = raw.strip()
        if raw in ("blank", "nil"):
            return "" if kind in ("string", "enum") else []
        if kind in ("array", "string_array"):
            items = [item.strip() for item in parse_array_items(raw)]
            if kind == "string_array":
                return [resolve_string_id(item) for item in items]
            return [int(item) for item in items]
        if kind == "string":
            if raw.lstrip("-").isdigit():
                return resolve_string_id(raw)
            return raw
        if kind == "boolean":
            return raw == "true"
        if raw in ("true", "false"):
            raise ValueError("boolean literal for number field: " + raw)
        if raw.startswith("{") or raw.endswith("}"):
            raise ValueError("table literal for scalar field: " + raw)
        return int(raw)

    result = {}
    mismatches = 0
    for buffer_id, tokens in parse_buffers(lua_table):
        count = len(tokens)
        if count != expected:
            mismatches += 1
        buffer = {}
        for i, name in enumerate(field_names):
            kind = kind_by_name[name]
            if i == 0:
                buffer[name] = buffer_id
                continue
            raw = tokens[i] if i < count else None
            if raw is None:
                buffer[name] = "" if kind == "string" else []
                continue
            buffer[name] = decode_field(raw, kind)
        result[str(buffer_id)] = buffer

    if mismatches:
        print("warning: {} rows had token-count != {}; please verify".format(mismatches, expected))

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as fh:
        json.dump(result, fh, ensure_ascii=False, indent=2)
    return result, mismatches


def write_buffers_excel(result, excel_path):
    """Write the ID->buffer dict into a .xlsx workbook, one row per buffer.

    Columns follow the BuffersDefine field order. ActiveEffect is annotated as
    ``SummonHand(20)`` in the preview (JSON keeps the plain numeric value).
    Array-typed fields are written as JSON array strings so the whole row stays
    lossless.
    """
    if Workbook is None:
        raise SystemExit(
            "excel export requested but 'openpyxl' is not installed; "
            "run: python -m pip install openpyxl"
        )

    field_names = [name for name, _ in BUFFERS_DEFINE_FIELDS]

    wb = Workbook()
    ws = wb.active
    ws.title = "Buffers"
    ws.append(field_names)
    header_font = Font(bold=True)
    for cell in ws[1]:
        cell.font = header_font

    for key in sorted(result, key=lambda k: int(k)):
        buffer = result[key]
        row = []
        for name in field_names:
            value = buffer.get(name)
            if name == "ActiveEffect" and isinstance(value, int):
                label = ACTIVE_EFFECT_NAMES.get(value, str(value))
                row.append("{}({})".format(label, value))
            elif isinstance(value, list):
                row.append(json.dumps(value, ensure_ascii=False, separators=(",", ":")))
            elif value is None:
                row.append("")
            else:
                row.append(value)
        ws.append(row)

    ws.freeze_panes = "A2"
    wb.save(excel_path)
    return len(result)


def main():
    parser = argparse.ArgumentParser(
        description="Convert TableCard_Buffers.lua into Buffers.json and Buffers.xlsx"
    )
    parser.add_argument("--lua", default=DEFAULT_LUA_TABLE)
    parser.add_argument("--idToString", default=DEFAULT_ID_TO_STRING)
    parser.add_argument("--outDir", default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--outName", default=DEFAULT_OUTPUT_NAME)
    parser.add_argument("--outExcelName", default=DEFAULT_OUTPUT_EXCEL_NAME)
    args = parser.parse_args()

    lua_table = args.lua
    id_to_string_path = args.idToString
    output_path = os.path.join(args.outDir, args.outName)
    excel_path = os.path.join(args.outDir, args.outExcelName)

    for path in (lua_table, id_to_string_path):
        if not os.path.isfile(path):
            raise SystemExit("file not found: " + path)

    id_to_string = load_id_to_string(id_to_string_path)
    print("idToString entries:", len(id_to_string))

    result, mismatches = convert(lua_table, id_to_string, output_path)
    print("buffers written: {}{}".format(len(result), " (field-count mismatches: {})".format(mismatches) if mismatches else ""))
    print("output: " + output_path)

    excel_count = write_buffers_excel(result, excel_path)
    print("excel rows written: " + str(excel_count))
    print("output: " + excel_path)


if __name__ == "__main__":
    main()
