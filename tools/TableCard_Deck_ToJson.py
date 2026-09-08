# -*- coding: utf-8 -*-
"""Parse LUA\\LuaScripts\\DataTable\\TableCard_Decks.lua into JSON and Excel.

Each row of TableDatas.Decks has the format { id, name, hero, skill, cards[], job }.
``name`` is a string-table ID resolved via LUA\\Table\\idToString.json; LUA values
written as ``blank`` mean "no value" and become "" / []. The JSON result maps
deck ID -> deck fields; the Excel sheet mirrors the same columns for preview.
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
    PROJECT_ROOT, "LUA", "LuaScripts", "DataTable", "TableCard_Decks.lua"
)
DEFAULT_ID_TO_STRING = os.path.join(PROJECT_ROOT, "LUA", "Table", "idToString.json")
DEFAULT_OUTPUT_DIR = os.path.join(PROJECT_ROOT, "data")
DEFAULT_OUTPUT_NAME = "Deck.json"
DEFAULT_OUTPUT_EXCEL_NAME = "Deck_Mod.xlsx"

# DecksDefine field schema: (name, kind) in LUA tuple order.
# Only the string-typed ``name`` field needs idToString.json resolution.
DECKS_DEFINE_FIELDS = [
    ("id", "number"),
    ("name", "string"),
    ("hero", "number"),
    ("skill", "number"),
    ("cards", "array"),
    ("job", "number"),
]

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


def parse_decks(lua_path):
    """Yield (deck_id, raw_token_list) rows parsed from the LUA data table."""
    with open(lua_path, encoding="utf-8") as fh:
        for line in fh:
            m = ROW_RE.match(line)
            if not m:
                continue
            deck_id = int(m.group(1))
            inner = line[m.end():].strip()
            if inner.endswith(","):
                inner = inner[:-1]
            if inner.endswith("}"):
                inner = inner[:-1]
            tokens = split_top_level(inner)
            yield deck_id, tokens


def convert(lua_table, id_to_string, output_path):
    """Run the conversion and return (result, mismatches)."""
    field_names = [name for name, _ in DECKS_DEFINE_FIELDS]
    expected = len(field_names)

    def resolve_string_id(raw_id):
        value = id_to_string.get(raw_id)
        return value if value is not None else ""

    def decode_field(raw, kind):
        raw = raw.strip()
        if raw in ("blank", "nil"):
            return "" if kind == "string" else []
        if kind == "array":
            items = [item.strip() for item in parse_array_items(raw)]
            return [int(item) for item in items]
        if kind == "string":
            if raw.lstrip("-").isdigit():
                return resolve_string_id(raw)
            return raw
        if raw in ("true", "false"):
            raise ValueError("boolean literal for number field: " + raw)
        if raw.startswith("{") or raw.endswith("}"):
            raise ValueError("table literal for scalar field: " + raw)
        return int(raw)

    result = {}
    mismatches = 0
    for deck_id, tokens in parse_decks(lua_table):
        count = len(tokens)
        if count != expected:
            mismatches += 1
        deck = {}
        for i, (name, kind) in enumerate(DECKS_DEFINE_FIELDS):
            if i == 0:
                deck[name] = deck_id
                continue
            raw = tokens[i] if i < count else None
            if raw is None:
                deck[name] = "" if kind == "string" else []
                continue
            deck[name] = decode_field(raw, kind)
        result[str(deck_id)] = deck

    if mismatches:
        print("warning: {} rows had token-count != {}; please verify".format(mismatches, expected))

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as fh:
        json.dump(result, fh, ensure_ascii=False, indent=2)
    return result, mismatches


def write_decks_excel(result, excel_path):
    """Write the ID->deck dict into a .xlsx workbook, one row per deck.

    Columns follow the DecksDefine field order. Array-typed fields are written
    as JSON array strings so the whole row stays lossless.
    """
    if Workbook is None:
        raise SystemExit(
            "excel export requested but 'openpyxl' is not installed; "
            "run: python -m pip install openpyxl"
        )

    field_names = [name for name, _ in DECKS_DEFINE_FIELDS]

    wb = Workbook()
    ws = wb.active
    ws.title = "Decks"
    ws.append(field_names)
    header_font = Font(bold=True)
    for cell in ws[1]:
        cell.font = header_font

    for key in sorted(result, key=lambda k: int(k)):
        deck = result[key]
        row = []
        for name in field_names:
            value = deck.get(name)
            if isinstance(value, list):
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
        description="Convert TableCard_Decks.lua into Deck.json and Deck_Mod.xlsx"
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
    print("decks written: {}{}".format(len(result), " (field-count mismatches: {})".format(mismatches) if mismatches else ""))
    print("output: " + output_path)

    excel_count = write_decks_excel(result, excel_path)
    print("excel rows written: " + str(excel_count))
    print("output: " + excel_path)


if __name__ == "__main__":
    main()
