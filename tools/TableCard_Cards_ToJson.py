# -*- coding: utf-8 -*-
"""Parse LUA\\LuaScripts\\DataTable\\TableCard_Cards.lua into JSON.

The output object maps card ID -> card fields in the declaration order of
CardsDefine (GameAssembly/dump.cs, ~line 410322). String-typed fields store a
string-table ID in the LUA table; each is resolved via LUA\\Table\\idToString.json.
LUA values written as ``blank`` mean "no value" and become "" / [].
Array-typed fields are emitted as JSON arrays. Enum typed fields keep the
numeric form used in the LUA table.
"""
import argparse
import json
import os
import re

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEFAULT_LUA_TABLE = os.path.join(
    PROJECT_ROOT, "LUA", "LuaScripts", "DataTable", "TableCard_Cards.lua"
)
DEFAULT_META_FILE = os.path.join(
    PROJECT_ROOT, "LUA", "LuaScripts", "DataTable", "TABLE_META_DEFINE.lua"
)
DEFAULT_ID_TO_STRING = os.path.join(PROJECT_ROOT, "LUA", "Table", "idToString.json")
DEFAULT_OUTPUT_DIR = os.path.join(PROJECT_ROOT, "data")
DEFAULT_OUTPUT_NAME = "Cards.json"

# CardsDefine field schema: (name, meta-type) in LUA tuple order.
# Only string-typed fields need idToString.json resolution; boolean fields use
# true/false; all the rest are numbers. Array-ness lives in the meta definition.
CARDS_DEFINE_FIELDS = [
    ("ID", "number"),
    ("Version", "string"),
    ("IsFormal", "number"),
    ("IsFree", "number"),
    ("IsMagic", "boolean"),
    ("Name", "string"),
    ("Desc", "string"),
    ("Cost", "number"),
    ("Atk", "number"),
    ("Def", "number"),
    ("Rarity", "number"),
    ("Meta", "number"),
    ("Element", "number"),
    ("Race1", "number"),
    ("Race2", "number"),
    ("SkillList", "array"),
    ("PassiveSkilllist", "array"),
    ("AruaList", "array"),
    ("IsHuge", "boolean"),
    ("FlyLayer", "number"),
    ("GroupId", "number"),
    ("UseCondition", "number"),
    ("FobCondition", "number"),
    ("Priority", "number"),
    ("AIClass", "enum"),
    ("AITarget", "number"),
    ("Story", "string"),
    ("Score", "string"),
    ("CompoundItem1", "number"),
    ("CompoundItem1Number", "number"),
    ("CompoundItem2", "number"),
    ("CompoundItem2Number", "number"),
    ("ResolveGetItem1", "number"),
    ("ResolveGetItem1Number", "number"),
    ("ResolveGetItem2", "number"),
    ("ResolveGetItem2Number", "number"),
    ("ChessEffect", "string"),
    ("Painter", "string"),
    ("AttackPlusTime", "number"),
    ("SummonPlusTime", "number"),
    ("DeadPlusTime", "number"),
    ("CardSpeed", "enum"),
    ("CardType1", "number"),
    ("CardType2", "number"),
    ("InfiCardID", "number"),
    ("CardLevel", "number"),
    ("NextLevel", "number"),
    ("Price", "number"),
    ("Keywords", "array"),
    ("Addweight", "number"),
    ("UnitTableIndex", "number"),
    ("BattleShowIndex", "number"),
    ("ResolveOrNot", "number"),
    ("ExtraPriority", "number"),
    ("SkillTags", "enum"),
    ("AIDamageType", "enum"),
    ("AIDamage", "number"),
    ("ItemIcon", "string"),
    ("CameraSet", "number"),
    ("ConditionLight", "array"),
    ("CVName", "string"),
    ("IsToken", "number"),
    ("TokenCard", "number"),
]

META_LINE_RE = re.compile(
    r'^\s*\{"([A-Za-z0-9_]+)"\s*,\s*\d+\s*,\s*"([A-Za-z0-9_]+)"\s*,\s*(true|false)\s*\},?\s*$'
)

# Type markers used inside the CardsDefine meta table of TABLE_META_DEFINE.lua.
META_KIND_NUMBER = {"number"}
META_KIND_BOOL = {"boolean"}
META_KIND_STRING = {"string"}
META_KIND_ENUM = {"AIClass", "CardSpeed", "CardTag", "AIDamageType"}
META_KIND_ARRAY = {
    "SkillList",
    "PassiveSkilllist",
    "AruaList",
    "Keywords",
    "ConditionLight",
    "SkillTags",
}

ROW_RE = re.compile(r"^\[(\d+)\]\s*=\s*\{")


def load_meta_fields(meta_file):
    """Read CardsDefine meta from TABLE_META_DEFINE.lua.

    Returns the list of (name, is_array, kind) fields in declaration order.
    kind is one of: number / boolean / string / enum.
    """
    fields = []
    inside = False
    with open(meta_file, encoding="utf-8") as fh:
        for raw in fh:
            line = raw.strip()
            if not inside:
                if line.startswith("CardsDefine"):
                    inside = True
                continue
            if line in ("{", "}", "meta={", "meta = {", ""):
                continue
            if line.startswith("},") or line == "}":
                break
            m = META_LINE_RE.match(line)
            if m:
                name, kind, is_array = m.group(1), m.group(2), m.group(3) == "true"
                fields.append((name, kind, is_array))
    if not fields:
        raise RuntimeError(
            "CardsDefine meta was not found in {}".format(meta_file)
        )
    return fields


def canonical_kind(kind, name, is_array):
    """Classify a meta entry into: array / boolean / string / enum / number."""
    if is_array:
        return "array"
    if kind == "boolean":
        return "boolean"
    if kind == "string":
        return "string"
    if kind in META_KIND_ENUM:
        return "enum"
    return "number"


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
            if depth > 0:
                cur.append(ch)
            else:
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


def parse_cards(lua_path):
    """Yield (card_id, raw_token_list) rows parsed from the LUA data table."""
    with open(lua_path, encoding="utf-8") as fh:
        for line in fh:
            m = ROW_RE.match(line)
            if not m:
                continue
            card_id = int(m.group(1))
            inner = line[m.end():].strip()
            if inner.endswith(","):
                inner = inner[:-1]
            if inner.endswith("}"):
                inner = inner[:-1]
            tokens = split_top_level(inner)
            yield card_id, tokens


def convert(lua_table, meta_fields, id_to_string, output_path):
    """Run the conversion and return (card_count, mismatches)."""
    field_names = [name for name, _, _ in meta_fields]
    expected = len(field_names)

    def resolve_string_id(raw_id):
        value = id_to_string.get(raw_id)
        return value if value is not None else ""

    def decode_field(raw, kind, is_array, resolve_string_id):
        raw = raw.strip()
        if raw in ("blank", "nil"):
            return "" if kind == "string" else []
        if is_array:
            items = [item.strip() for item in parse_array_items(raw)]
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
    for card_id, tokens in parse_cards(lua_table):
        count = len(tokens)
        if count != expected:
            mismatches += 1
        card = {}
        for i, (name, kind, is_array) in enumerate(meta_fields):
            if i == 0:
                card[name] = card_id
                continue
            raw = tokens[i] if i < count else None
            if raw is None:
                card[name] = "" if kind == "string" else []
                continue
            card[name] = decode_field(raw, kind, is_array, resolve_string_id)
        result[str(card_id)] = card

    if mismatches:
        print("warning: {} rows had token-count != {}; please verify".format(mismatches, expected))

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as fh:
        json.dump(result, fh, ensure_ascii=False, indent=2)
    return len(result), mismatches


def main():
    parser = argparse.ArgumentParser(
        description="Convert TableCard_Cards.lua into Cards.json"
    )
    parser.add_argument("--lua", default=DEFAULT_LUA_TABLE)
    parser.add_argument("--meta", default=DEFAULT_META_FILE)
    parser.add_argument("--idToString", default=DEFAULT_ID_TO_STRING)
    parser.add_argument("--outDir", default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--outName", default=DEFAULT_OUTPUT_NAME)
    args = parser.parse_args()

    lua_table = args.lua
    meta_file = args.meta
    id_to_string_path = args.idToString
    output_path = os.path.join(args.outDir, args.outName)

    for path in (lua_table, meta_file, id_to_string_path):
        if not os.path.isfile(path):
            raise SystemExit("file not found: " + path)

    meta_fields = load_meta_fields(meta_file)
    print("CardsDefine meta fields:", len(meta_fields))

    id_to_string = load_id_to_string(id_to_string_path)
    print("idToString entries:", len(id_to_string))

    card_count, mismatches = convert(lua_table, meta_fields, id_to_string, output_path)
    print("cards written: {}{}".format(card_count, " (field-count mismatches: {})".format(mismatches) if mismatches else ""))
    print("output: " + output_path)


if __name__ == "__main__":
    main()
