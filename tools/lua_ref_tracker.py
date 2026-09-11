#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
lua_ref_tracker.py - 静态分析 Lua 代码中某个函数/变量的定义、调用、引用。

不需要 Lua 运行环境，纯文本静态分析。

用法示例:
  python lua_ref_tracker.py -p d:/Project/NineRegions/LUA -n UpdateRechargeInfoByNet
  python lua_ref_tracker.py -p d:/Project/NineRegions/LUA -n RechargeMgr.UpdateRechargeInfoByNet --exact
  python lua_ref_tracker.py -p xxx.lua -n someVar --context 2
  python lua_ref_tracker.py -p d:/Project/NineRegions/LUA -n GetRechargeDataByID --no-recursive

说明:
  - 默认是"模糊标识符"匹配: 目标名 UpdateRechargeInfoByNet 会同时匹配
    RechargeMgr.UpdateRechargeInfoByNet、a.b.UpdateRechargeInfoByNet(...) 等出现位置。
  - 加 --exact 后只匹配完整标识符: 前置必须是空白/符号(不能是 . 或字母数字下划线)。
  - 分类规则:
      定义  = function 目标 或 目标 = function
      调用  = 目标 后紧跟 "(" (允许换行, 最多跨 3 行)
      引用  = 其余所有出现(变量读取、传参、table 索引等)
  - 注释(--, --[[ ]] )和字符串(' " [[ ]] [=[ ]=])中的出现不会被统计。
  - 动态调用(通过 table[名字] / loadstring / _G[...])无法静态分析, 报告中会提示。
"""

import argparse
import os
import re
import sys

IDENT_CHARS = frozenset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_")
WHITESPACE = frozenset(" \t\r\n")
MAX_CALL_LINES = 3  # 调用跨行上限: 目标后最多跳过 MAX_CALL_LINES 个换行去判断 "("


def read_file_smart(path):
    encodings = ["utf-8-sig", "utf-8", "gbk", "latin-1"]
    with open(path, "rb") as f:
        raw = f.read()
    for enc in encodings:
        try:
            return raw.decode(enc)
        except (UnicodeDecodeError, LookupError):
            continue
    return raw.decode("latin-1", errors="replace")


def find_long_bracket(text, i):
    """text[i] 为 '[' 时, 尝试解析长括号 [=*[ ; 成功返回 (equals_count, 结束位置)"""
    j = i + 1
    while j < len(text) and text[j] == "=":
        j += 1
    if j < len(text) and text[j] == "[":
        return j - i - 1, j
    return None, None


def mask_code(text):
    """返回与 text 等长的 bytearray: 1=代码, 0=注释/字符串。
    默认按代码处理, 只有明确进入注释/字符串才置 0, 避免漏报。"""
    n = len(text)
    mask = bytearray(b"\x01") * n
    i = 0
    while i < n:
        c = text[i]
        if c == '"' or c == "'":
            j = i + 1
            while j < n:
                if text[j] == "\\" and j + 1 < n:
                    j += 2
                    continue
                if text[j] == c:
                    break
                j += 1
            for k in range(i, min(j + 1, n)):
                mask[k] = 0
            i = j + 1
        elif c == "-" and i + 1 < n and text[i + 1] == "-":
            if i + 2 < n and text[i + 2] == "[":
                eq, _ = find_long_bracket(text, i + 2)
                if eq is not None:
                    close = "]" + "=" * eq + "]"
                    end = text.find(close, i + 3 + eq)
                    if end == -1:
                        end = n
                    else:
                        end += len(close)
                    for k in range(i, min(end, n)):
                        mask[k] = 0
                    i = end
                    continue
            line_end = text.find("\n", i)
            if line_end == -1:
                line_end = n
            for k in range(i, line_end):
                mask[k] = 0
            i = line_end + 1
            continue
        elif c == "[":
            eq, _ = find_long_bracket(text, i)
            if eq is not None:
                close = "]" + "=" * eq + "]"
                end = text.find(close, i + 2 + eq)
                if end == -1:
                    end = n
                else:
                    end += len(close)
                for k in range(i, min(end, n)):
                    mask[k] = 0
                i = end
                continue
        i += 1
    return mask


def build_code_stream(text, mask):
    """返回 (code_chars, orig_pos):
    code_chars: 全部代码字符拼接的字符串
    orig_pos:   每个 code 字符对应的 (行号, 列号), 均从 1 开始
    """
    code_chars = []
    orig_pos = []
    line = 1
    col = 1
    for i, ch in enumerate(text):
        if ch == "\n":
            if mask[i]:
                code_chars.append(ch)
                orig_pos.append((line, col))
            line += 1
            col = 1
            continue
        if mask[i]:
            code_chars.append(ch)
            orig_pos.append((line, col))
        col += 1
    return "".join(code_chars), orig_pos


def split_lines(text):
    lines = text.splitlines()
    if not text.endswith("\n") and text.endswith(("\r",)) is False:
        pass
    return lines


def analyze(text, target, exact):
    """返回 dict: {"def": [...], "call": [...], "ref": [...], "def_lines": set}
    每个匹配项: {"line": int, "col": int, "src": str, "text": str}
    """
    mask = mask_code(text)
    code, pos = build_code_stream(text, mask)
    esc = re.escape(target)

    if exact:
        pat = r"(?<![A-Za-z0-9_.])" + esc + r"(?![A-Za-z0-9_])"
    else:
        pat = r"(?<![A-Za-z0-9_])" + esc + r"(?![A-Za-z0-9_])"

    matches = [m for m in re.finditer(pat, code)]

    def_lines = set()
    for m in re.finditer(r"\bfunction\s*" + esc + r"(?![A-Za-z0-9_])", code):
        def_lines.add(pos[m.start()][0])
    for m in re.finditer(esc + r"\s*=\s*function\b", code):
        start = m.start()
        if exact:
            if start > 0 and (code[start - 1] in IDENT_CHARS or code[start - 1] == "."):
                continue
        elif start > 0 and code[start - 1] in IDENT_CHARS:
            continue
        def_lines.add(pos[start][0])

    result = {"def": [], "call": [], "ref": [], "def_lines": def_lines}
    lines = split_lines(text)

    for m in matches:
        start = m.start()
        line, col = pos[start]
        item = {"line": line, "col": col, "src": "%d:%d" % (line, col), "text": ""}
        if line - 1 < len(lines):
            item["text"] = lines[line - 1].strip()

        if line in def_lines:
            result["def"].append(item)
            continue

        newlines = 0
        j = m.end()
        while j < len(code) and newlines <= MAX_CALL_LINES:
            ch = code[j]
            if ch in WHITESPACE:
                if ch == "\n":
                    newlines += 1
                j += 1
                continue
            break
        if j < len(code) and code[j] == "(" and newlines <= MAX_CALL_LINES:
            result["call"].append(item)
        else:
            result["ref"].append(item)

    return result


def walk_lua_files(path, recursive):
    if os.path.isfile(path):
        yield path
        return
    if recursive:
        for root, dirs, files in os.walk(path):
            for name in sorted(files):
                if name.lower().endswith(".lua"):
                    yield os.path.join(root, name)
    else:
        for name in sorted(os.listdir(path)):
            full = os.path.join(path, name)
            if os.path.isfile(full) and name.lower().endswith(".lua"):
                yield full


def fmt_path(path, base):
    try:
        return os.path.relpath(path, base)
    except ValueError:
        return path


def run_search(args):
    """字符串/正则查找模式: 不做定义/调用/引用分类, 直接列出所有出现位置。"""
    if args.regex:
        flags = 0
        if args.ignore_case:
            flags |= re.IGNORECASE
        if args.multiline:
            flags |= re.MULTILINE
        try:
            pattern = re.compile(args.name, flags)
        except re.error as e:
            print("[正则错误] %s : %s" % (args.name, e), file=sys.stderr)
            return 1
        mode_label = "正则"
    else:
        flags = re.IGNORECASE if args.ignore_case else 0
        pattern = re.compile(re.escape(args.name), flags)
        mode_label = "字符串"

    base = args.path if os.path.isdir(args.path) else os.path.dirname(args.path) or "."
    files = list(walk_lua_files(args.path, not args.no_recursive))

    total = 0
    per_file = {}
    hits = []

    for path in files:
        try:
            text = read_file_smart(path)
        except OSError as e:
            print("[跳过] %s : %s" % (path, e), file=sys.stderr)
            continue
        if args.code_only:
            mask = mask_code(text)
        else:
            mask = bytearray(b"\x01") * len(text)
        code, pos = build_code_stream(text, mask)
        lines = text.splitlines()
        fpath = fmt_path(path, base)
        count = 0
        for m in pattern.finditer(code):
            line, col = pos[m.start()]
            line_text = (lines[line - 1] if line - 1 < len(lines) else "").strip()
            hits.append((fpath, line, col, line_text))
            count += 1
        total += count
        if count:
            per_file[fpath] = count

    print("=" * 72)
    print("[查找模式] 目标: %s (%s)" % (args.name, mode_label))
    print("选项      : 仅代码(剔除注释/字符串)=%s  忽略大小写=%s  跨行=%s"
          % ("是" if args.code_only else "否",
             "是" if args.ignore_case else "否",
             "是" if args.multiline else "否"))
    print("扫描范围  : %s (%d 个 .lua 文件)" % (args.path, len(files)))
    print("总匹配    : %d 处, 涉及 %d 个文件" % (total, len(per_file)))
    print("=" * 72)
    if not hits:
        print("(无匹配)")
    else:
        cur_file = None
        for fpath, line, col, line_text in hits:
            if fpath != cur_file:
                n = per_file.get(fpath, 0)
                print("%s (本文件 %d 处)" % (fpath, n))
                cur_file = fpath
            print("    %d:%d | %s" % (line, col, line_text[:150]))
    print("=" * 72)
    return 0


def main():
    parser = argparse.ArgumentParser(
        description="静态分析 Lua 文件中函数/变量的定义、调用与引用",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="示例:\n"
               "  python lua_ref_tracker.py -p LUA -n UpdateRechargeInfoByNet\n"
               "  python lua_ref_tracker.py -p LUA -n RechargeMgr.UpdateRechargeInfoByNet --exact\n"
               "  python lua_ref_tracker.py -p a.lua -n someVar --context 2\n"
               "  python lua_ref_tracker.py -p LUA -n payInfo --search\n"
               "  python lua_ref_tracker.py -p LUA -n '装备[dD]+' --search --regex --multiline",
    )
    parser.add_argument("-p", "--path", default=".", help="目标文件或目录(默认当前目录)")
    parser.add_argument("-n", "--name", required=True, help="要查找的函数/变量名, 可带点号如 RechargeMgr.UpdateRechargeInfoByNet")
    parser.add_argument("--exact", action="store_true", help="精确匹配: 前面不能是点号或字母数字下划线")
    parser.add_argument("--no-recursive", action="store_true", help="目录下不递归子目录")
    parser.add_argument("--context", type=int, default=0, help="每个匹配点额外显示前后 N 行(默认0)")
    parser.add_argument("--search", action="store_true", help="字符串/正则查找模式: 不做定义/调用分类, 直接列出所有出现位置")
    parser.add_argument("--regex", action="store_true", help="配合 --search: 把 -n 的值当作正则表达式")
    parser.add_argument("--code-only", action="store_true", help="配合 --search: 只在代码(剔除注释/字符串)中查找")
    parser.add_argument("--ignore-case", action="store_true", help="配合 --search: 忽略大小写")
    parser.add_argument("--multiline", action="store_true", help="配合 --search: 正则跨行模式(^ $ 匹配行首尾)")
    args = parser.parse_args()

    if args.search:
        return run_search(args)

    base = args.path if os.path.isdir(args.path) else os.path.dirname(args.path) or "."
    files = list(walk_lua_files(args.path, not args.no_recursive))

    total = {"def": 0, "call": 0, "ref": 0}
    records = {"def": [], "call": [], "ref": []}
    call_sites = set()

    for path in files:
        try:
            text = read_file_smart(path)
        except OSError as e:
            print("[跳过] %s : %s" % (path, e), file=sys.stderr)
            continue
        res = analyze(text, args.name, args.exact)
        for kind in ("def", "call", "ref"):
            for item in res[kind]:
                fpath = fmt_path(path, base)
                item["file"] = fpath
                records[kind].append(item)
                total[kind] += 1
                if kind == "call":
                    call_sites.add(fpath + ":" + str(item["line"]))

    print("=" * 70)
    print("目标      : %s" % args.name)
    print("匹配模式  : %s" % ("精确标识符" if args.exact else "模糊标识符(允许模块前缀)"))
    print("扫描范围  : %s (%d 个 .lua 文件)" % (args.path, len(files)))
    print("=" * 70)
    print("统计: 定义 %d  |  调用 %d  |  引用 %d" % (total["def"], total["call"], total["ref"]))
    if call_sites:
        print("调用位置(去重 %d 处):" % len(call_sites))
        for s in sorted(call_sites):
            print("    %s" % s)
    print("-" * 70)

    labels = {"def": "定义", "call": "调用", "ref": "引用"}
    for kind in ("def", "call", "ref"):
        items = records[kind]
        if not items:
            print("[%s] (无)" % labels[kind])
            continue
        print("[%s] 共 %d 处:" % (labels[kind], len(items)))
        seen_files = set()
        for it in items:
            tag = "  "
            if it["file"] not in seen_files:
                tag = "> "
                seen_files.add(it["file"])
            print("  %s%s:%s" % (tag, it["file"], it["src"]))
            if it["text"]:
                print("      | %s" % it["text"][:120])
            if args.context > 0:
                fpath = os.path.join(base, it["file"]) if not os.path.isabs(it["file"]) else it["file"]
                try:
                    lines = split_lines(read_file_smart(fpath))
                except OSError:
                    lines = []
                lo = max(0, it["line"] - 1 - args.context)
                hi = min(len(lines), it["line"] + args.context)
                for ln in range(lo, hi):
                    marker = ">>" if (ln + 1) == it["line"] else "  "
                    print("      %s %4d | %s" % (marker, ln + 1, lines[ln][:150]))
        print()

    print("=" * 70)
    print("提示: 动态调用(如 _G['%s'] / table[%s] / loadstring)无法静态发现,"
          % (args.name, args.name))
    print("      如需确认请检查网络协议分发层(C# 侧)是否按字符串映射回调。")
    print("=" * 70)


if __name__ == "__main__":
    main()
