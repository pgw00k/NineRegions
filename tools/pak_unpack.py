# -*- coding: utf-8 -*-
"""完整解包 File/dat/Pak/*.pak (调 xlua.dll PakInit/PakGetFilePath/PakGetFileSize/PakLoadFile).
32位 python 运行: D:/Paths/py2718_x86/python.exe pak_unpack.py
输出: pak_out/<PAK名>/<文件路径>
"""
import ctypes, os, sys

XLUA = u'D:/Project/NineRegions/LUA/xlua.dll'
PAK_DIR = u'I:/SteamLibrary/steamapps/common/The Nine Regions/File/dat/Pak'
OUT = u'D:/Project/NineRegions/LUA'
KEY = u'2E6C0F69-3263-4BED-B73A-324E9B5D2788'
PAKS = [u'LuaScripts.pak', u'Message.pak', u'Config.pak', u'Table.pak', u'Rec.pak', u'iFix.pak']

dll = ctypes.CDLL(XLUA)
dll.PakInit.restype = ctypes.c_int
dll.PakInit.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_char_p]
dll.PakGetFilePath.restype = ctypes.c_int
dll.PakGetFilePath.argtypes = [ctypes.c_char_p, ctypes.c_int, ctypes.c_char_p, ctypes.POINTER(ctypes.c_int)]
dll.PakGetFileSize.restype = ctypes.c_int
dll.PakGetFileSize.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int]
dll.PakLoadFile.restype = ctypes.c_int
dll.PakLoadFile.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int, ctypes.c_void_p, ctypes.c_int]

u = lambda s: s.encode('utf-8')

def makedirs(p):
    if not os.path.exists(p):
        os.makedirs(p)

total = 0
for pak in PAKS:
    pak_path = os.path.join(PAK_DIR, pak)
    rc = dll.PakInit(u(pak), u(pak_path), u(KEY))
    print('[%s] PakInit rc=%d' % (pak.encode('utf-8'), rc))
    if rc < 0:
        continue
    idx = 0
    n = 0
    while True:
        size = ctypes.c_int(8192)
        buf = ctypes.create_string_buffer(8192)
        r = dll.PakGetFilePath(u(pak), idx, buf, ctypes.byref(size))
        if r != 0 or size.value <= 0:
            break
        name = buf.raw[:size.value].decode('utf-8', 'replace')
        fsz = dll.PakGetFileSize(u(pak), u(name), len(u(name)))
        if fsz < 0:
            print('  [warn] size<0 for %r' % name)
            idx += 1
            continue
        fbuf = ctypes.create_string_buffer(max(fsz, 1))
        r2 = dll.PakLoadFile(u(pak), u(name), len(u(name)),
                             ctypes.cast(fbuf, ctypes.c_void_p), fsz)
        outpath = os.path.join(OUT, pak.replace(u'.pak', u''), name)
        makedirs(os.path.dirname(outpath))
        with open(outpath, 'wb') as f:
            f.write(fbuf.raw[:max(fsz, 0)])
        n += 1
        total += 1
        idx += 1
    print('  -> %d files' % n)
print('TOTAL %d files -> %s' % (total, OUT.encode('utf-8')))
