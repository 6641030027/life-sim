// ข้อมูลเชิงลึก: ทักษะและระดับความชำนาญ (หน้าต่างเลื่อนขึ้น)

import { SKILLS } from '../data/skills.js';
import { openSheet } from './overlays.js';

function levelLabel(v) {
  if (v < 20) { return 'เริ่มต้น'; }
  if (v < 45) { return 'พอใช้'; }
  if (v < 70) { return 'ชำนาญ'; }
  return 'เชี่ยวชาญ';
}

export function openSkills() {
  let html = '<p>ระดับความชำนาญของแต่ละทักษะ</p>';
  SKILLS.slice().sort((a, b) => b[1] - a[1]).forEach((s) => {
    html += '<div class="skill"><span class="sname">' + s[0] + '</span>' +
      '<div class="bar"><i style="width:' + s[1] + '%;background:var(--blue)"></i></div>' +
      '<span class="lv">' + levelLabel(s[1]) + '</span></div>';
  });
  openSheet('ข้อมูลเชิงลึก: ทักษะ', html);
}
