// ข้อมูลเชิงลึก: ทักษะและระดับความชำนาญ 6 ขั้น 3 กลุ่ม (หน้าต่างเลื่อนขึ้น)

import { SKILLS, SKILL_LEVELS, SKILL_LEVEL_0 } from '../data/skills.js';
import { openSheet } from './overlays.js';

export function levelOf(v) {
  let lv = SKILL_LEVEL_0;
  SKILL_LEVELS.forEach((l) => { if (v >= l.min) { lv = l; } });
  return lv;
}

export function openSkills() {
  let html = '<p>ระดับความชำนาญ 6 ขั้น แบ่งเป็น ต้น (1–2) · กลาง (3–4) · สูง (5–6) เส้นขีดบนแถบคือจุดขึ้นขั้นใหม่</p>';
  let ticks = '';
  SKILL_LEVELS.slice(1).forEach((l) => { ticks += '<span class="tick" style="left:' + l.min + '%"></span>'; });
  SKILLS.slice().sort((a, b) => b[1] - a[1]).forEach((s) => {
    const lv = levelOf(s[1]);
    const label = lv.n === 0 ? lv.name : 'ขั้น ' + lv.n + ' ' + lv.name;
    html += '<div class="skill"><span class="sname">' + s[0] + '</span>' +
      '<div class="bar"><i style="width:' + s[1] + '%;background:var(--blue)"></i>' + ticks + '</div>' +
      '<span class="lv">' + label + (lv.tier ? '<small>ระดับ' + lv.tier + '</small>' : '') + '</span></div>';
  });
  openSheet('ข้อมูลเชิงลึก: ทักษะ', html);
}
