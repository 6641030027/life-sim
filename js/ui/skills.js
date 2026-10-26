// ข้อมูลเชิงลึก: ทักษะแบ่งตามหมวด และระดับความชำนาญ 6 ขั้น 3 กลุ่ม (หน้าต่างเลื่อนขึ้น)
// แสดงเฉพาะทักษะที่ถึงขั้น 1 แล้ว (ค่าต่ำกว่า 1 คือโบนัสลับที่ยังไม่โผล่)

import { state } from '../state.js?v=e4d2fc4c';
import { SKILL_CATEGORIES, SKILL_LEVELS, SKILL_LEVEL_0 } from '../data/skills.js?v=e4d2fc4c';
import { openSheet } from './overlays.js?v=e4d2fc4c';

export function levelOf(v) {
  let lv = SKILL_LEVEL_0;
  SKILL_LEVELS.forEach((l) => { if (v >= l.min) { lv = l; } });
  return lv;
}

export function openSkills() {
  let html = '<p>ระดับความชำนาญ 6 ขั้น แบ่งเป็น ต้น (1–2) · กลาง (3–4) · สูง (5–6) เส้นขีดบนแถบคือจุดขึ้นขั้นใหม่</p>';
  let ticks = '';
  SKILL_LEVELS.slice(1).forEach((l) => { ticks += '<span class="tick" style="left:' + l.min + '%"></span>'; });
  let any = false;
  SKILL_CATEGORIES.forEach((cat) => {
    const rows = cat.skills
      .map((s) => ({ name: s.name, v: state.skills[s.id] || 0 }))
      .filter((s) => s.v >= SKILL_LEVELS[0].min)
      .sort((a, b) => b.v - a.v);
    if (rows.length === 0) { return; }
    any = true;
    html += '<div class="skill-cat">' + cat.name + '</div>';
    rows.forEach((s) => {
      const lv = levelOf(s.v);
      html += '<div class="skill"><span class="sname">' + s.name + '</span>' +
        '<div class="bar"><i style="width:' + s.v + '%;background:var(--blue)"></i>' + ticks + '</div>' +
        '<span class="lv">ขั้น ' + lv.n + ' ' + lv.name + '<small>ระดับ' + lv.tier + '</small></span></div>';
    });
  });
  if (!any) { html += '<p>ยังไม่มีทักษะ ทักษะจะค่อยๆ ปรากฏเมื่อได้ฝึกหรือโตขึ้น</p>'; }
  openSheet('ข้อมูลเชิงลึก: ทักษะ', html);
}
