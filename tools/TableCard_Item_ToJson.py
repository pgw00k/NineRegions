# -*- coding: utf-8 -*-
"""Parse LUA\\LuaScripts\\DataTable\\TableCard_Item.lua into JSON + Excel.

The output object maps item ID -> item fields in the declaration order:
{ID, Name, BattleFieldRes, ItemType, Element, ItemIcon, MaxNum, isCall,
 Rarity, IsSignDes, ItemSigndes}.

String-typed fields (Name / BattleFieldRes / ItemIcon / ItemSigndes) store a
string-table ID in the LUA table; each is resolved via LUA\\Table\\idToString.json.
LUA values written as ``blank`` mean "no value" and become "".
ItemType keeps its numeric form in JSON, while the Excel preview annotates it
as ``Item(0)`` / ``UseItem(1)`` etc.
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
    PROJECT_ROOT, "LUA", "LuaScripts", "DataTable", "TableCard_Item.lua"
)
DEFAULT_ID_TO_STRING = os.path.join(PROJECT_ROOT, "LUA", "Table", "idToString.json")
DEFAULT_OUTPUT_DIR = os.path.join(PROJECT_ROOT, "data")
DEFAULT_OUTPUT_NAME = "Item.json"
DEFAULT_OUTPUT_EXCEL_NAME = "Item.xlsx"

# Item field schema: (name, kind) in LUA tuple order.
# kind is one of: number / string / boolean.
ITEM_FIELDS = [
    ("ID", "number"),
    ("Name", "string"),
    ("BattleFieldRes", "string"),
    ("ItemType", "number"),
    ("Element", "number"),
    ("ItemIcon", "string"),
    ("MaxNum", "number"),
    ("isCall", "boolean"),
    ("Rarity", "number"),
    ("IsSignDes", "boolean"),
    ("ItemSigndes", "string"),
]

STRING_FIELDS = {"Name", "BattleFieldRes", "ItemIcon", "ItemSigndes"}

# ItemType enum: numeric value -> display name (used only for the Excel preview).
ITEM_TYPE_NAMES = {
    0: "Item",
    1: "UseItem",
    2: "Equip",
    3: "Card",
    4: "Exp",
    5: "Gold",
    6: "ALL",
    7: "Diamond",
    8: "Jade",
    9: "Silver",
    10: "InfiItem",
    11: "FavorItem",
    13: "RPGEquip",
    14: "Ash",
    15: "Recipe",
    16: "CardDeck",
    17: "Portrait",
    18: "PortraitFrame",
    19: "Expression",
    20: "ExpressionBag",
    21: "Appellation",
    22: "AppellationFrame",
    23: "BpEXP",
    24: "HeroSkin",
    25: "ItemGiftBag",
    26: "ForgeItem",
}

ROW_RE = re.compile(r"^\[(\d+)\]\s*=\s*\{")


def load_id_to_string(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def split_top_level(body):
    """Split the inner token stream of a record into tokens at top depth.

    Braces of nested ``{ ... }`` tables are kept as part of the token.
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


def parse_items(lua_path):
    """Yield (item_id, raw_token_list) rows parsed from the LUA data table."""
    with open(lua_path, encoding="utf-8") as fh:
        for line in fh:
            m = ROW_RE.match(line)
            if not m:
                continue
            item_id = int(m.group(1))
            inner = line[m.end():].strip()
            if inner.endswith(","):
                inner = inner[:-1]
            if inner.endswith("}"):
                inner = inner[:-1]
            tokens = split_top_level(inner)
            yield item_id, tokens


def convert(lua_table, id_to_string, output_path):
    """Run the conversion and return (result, mismatches)."""
    expected = len(ITEM_FIELDS)
    field_names = [name for name, _ in ITEM_FIELDS]
    kind_by_name = {name: kind for name, kind in ITEM_FIELDS}

    def resolve_string_id(raw):
        value = id_to_string.get(raw)
        return value if value is not None else ""

    def decode_field(raw, kind):
        raw = raw.strip()
        if raw in ("blank", "nil"):
            return ""
        if kind == "string":
            if raw.lstrip("-").isdigit():
                return resolve_string_id(raw)
            return raw
        if kind == "boolean":
            return raw == "true"
        return int(raw)

    result = {}
    mismatches = 0
    for item_id, tokens in parse_items(lua_table):
        count = len(tokens)
        if count != expected:
            mismatches += 1
        item = {}
        for i, name in enumerate(field_names):
            kind = kind_by_name[name]
            if i == 0:
                item[name] = item_id
                continue
            raw = tokens[i] if i < count else None
            if raw is None:
                item[name] = "" if kind == "string" else None
                continue
            item[name] = decode_field(raw, kind)
        result[str(item_id)] = item

    if mismatches:
        print("warning: {} rows had token-count != {}; please verify".format(mismatches, expected))

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as fh:
        json.dump(result, fh, ensure_ascii=False, indent=2)
    return result, mismatches


def write_items_excel(result, excel_path):
    """Write the ID->item dict into a .xlsx workbook, one row per item.

    ItemType is annotated as ``Item(0)`` / ``UseItem(1)`` ... in the preview;
    JSON keeps the plain numeric value.
    """
    if Workbook is None:
        raise SystemExit(
            "excel export requested but 'openpyxl' is not installed; "
            "run: python -m pip install openpyxl"
        )

    field_names = [name for name, _ in ITEM_FIELDS]

    wb = Workbook()
    ws = wb.active
    ws.title = "Item"
    ws.append(field_names)
    header_font = Font(bold=True)
    for cell in ws[1]:
        cell.font = header_font

    for key in sorted(result, key=lambda k: int(k)):
        item = result[key]
        row = []
        for name in field_names:
            value = item.get(name)
            if name == "ItemType" and isinstance(value, int):
                label = ITEM_TYPE_NAMES.get(value, str(value))
                row.append("{}({})".format(label, value))
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
        description="Convert TableCard_Item.lua into Item.json and Item.xlsx"
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
    print("items written: {}{}".format(len(result), " (field-count mismatches: {})".format(mismatches) if mismatches else ""))
    print("output: " + output_path)

    excel_count = write_items_excel(result, excel_path)
    print("excel rows written: " + str(excel_count))
    print("output: " + excel_path)


if __name__ == "__main__":
    main()