// วัยทารก: สุ่มว่าเด็กทำอะไรจริงในปีที่ผ่านมา และเพิ่มโบนัสลับเล็กๆ ให้ทักษะ/สถานะ
// ฟังก์ชันล้วน: รับ (warmth, rng) คืนผลที่ต้องนำไปใช้ ไม่แตะหน้าจอ/state

import { INFANT_ACTIVITIES } from '../data/activities.js';

// เลือก count กิจกรรมแบบไม่ซ้ำ ถ่วงน้ำหนัก (บ้านอบอุ่น = กิจกรรมที่มีคนคุยด้วยทำบ่อยขึ้น)
export function rollInfantYear(warmth, rand) {
  const rnd = rand || Math.random;
  const names = Object.keys(INFANT_ACTIVITIES);
  const count = rnd() < 0.5 ? 2 : 3;
  const warmW = 0.6 + (warmth / 100) * 0.8;
  const pool = names.map((n) => ({ n: n, w: INFANT_ACTIVITIES[n].warm ? warmW : 1 }));
  const chosen = [];
  for (let k = 0; k < count && pool.length; k++) {
    let total = 0;
    pool.forEach((p) => { total += p.w; });
    let r = rnd() * total;
    let idx = 0;
    for (let i = 0; i < pool.length; i++) {
      r -= pool[i].w;
      if (r <= 0) { idx = i; break; }
    }
    chosen.push(pool[idx].n);
    pool.splice(idx, 1);
  }
  const skills = {};
  const stats = {};
  chosen.forEach((n) => {
    const a = INFANT_ACTIVITIES[n];
    const f = 0.35 + rnd() * 0.3;
    Object.keys(a.skills).forEach((id) => { skills[id] = (skills[id] || 0) + a.skills[id] * f; });
    Object.keys(a.stats).forEach((k) => { stats[k] = (stats[k] || 0) + a.stats[k]; });
  });
  return { chosen: chosen, skills: skills, stats: stats };
}

export function infantYearText(chosen) {
  const parts = chosen.map((n) => INFANT_ACTIVITIES[n].phrase);
  return 'ตลอดปีที่ผ่านมา ฉัน' + parts.slice(0, -1).join(' ') + (parts.length > 1 ? ' และ' : '') + parts[parts.length - 1];
}
