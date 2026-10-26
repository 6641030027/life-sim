#!/usr/bin/env python3
# ใส่เลขเวอร์ชัน ?v=... ท้ายทุก import ของ js และลิงก์ใน index.html เพื่อกันเบราว์เซอร์เอาไฟล์เก่า/ใหม่มาปนกัน
# (อาการ: "Importing a module script failed" ปุ่มกดไม่ติดหลัง deploy) รันก่อน commit ทุกครั้ง: python3 tools/stamp.py
import hashlib, os, re
files = []
for root, _, fs in os.walk('js'):
    for f in sorted(fs):
        if f.endswith('.js'):
            files.append(os.path.join(root, f))
files.sort()
IMP = re.compile(r"((?:from\s+|import\()\s*')(\.[^'?]+?)(?:\?v=[0-9a-f]+)?(')")
def strip(s): return IMP.sub(lambda m: m.group(1) + m.group(2) + m.group(3), s)
h = hashlib.sha1()
for p in files + ['css/style.css']:
    h.update(strip(open(p, encoding='utf-8').read()).encode())
v = h.hexdigest()[:8]
for p in files:
    s = open(p, encoding='utf-8').read()
    n = IMP.sub(lambda m: m.group(1) + m.group(2) + '?v=' + v + m.group(3), s)
    if n != s: open(p, 'w', encoding='utf-8').write(n)
p = 'index.html'
s = open(p, encoding='utf-8').read()
s = re.sub(r"import\('\./js/main\.js(?:\?v=[0-9a-f]+)?'\)", "import('./js/main.js?v=%s')" % v, s)
s = re.sub(r'href="css/style\.css(?:\?v=[0-9a-f]+)?"', 'href="css/style.css?v=%s"' % v, s)
open(p, 'w', encoding='utf-8').write(s)
print('stamped', v)
