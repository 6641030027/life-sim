// ผลลัพธ์ของเหตุการณ์ที่ลงกับสถานะ ทักษะ และความสัมพันธ์ (ใช้ร่วมกับ game.js)
//
// รูปแบบ fx (ใส่เฉพาะที่ต้องการ):
//   stats  { happy: -2, health: +3 }     เปลี่ยนแถบสถานะ
//   skills { motor: 0.5 }                เพิ่มแต้มทักษะ
//   family 2        ทุกคนในครอบครัวที่อยู่ด้วยกัน (ไม่นับคนที่ไม่ได้อยู่ด้วย)
//   carer  3        ผู้ดูแลหลัก          sibs 2  พี่น้อง          elder 2  ญาติผู้ใหญ่
//   pet    2        สัตว์เลี้ยง          rel { 'แม่': 3 }  ระบุตามบทบาท
//   flag   { vaxLate: 1 }               จดไว้ให้เหตุการณ์ถัดไปใช้
//   swapCarer 'แม่อุปถัมภ์'              เปลี่ยนตัวผู้ดูแลคนนั้นเป็นคนใหม่
// คืนค่า: แท็กสรุปผล [[ข้อความ, 'good'|'bad']] ไว้โชว์ท้ายเหตุการณ์

import { state } from '../state.js';
import { addLine } from '../ui/log.js';
import { levelOf } from '../ui/skills.js';
import { SKILL_NAME } from '../data/skills.js';
import { MALE, FEMALE, SURNAMES } from '../data/names.js';
import { pick, ri, clamp } from '../util.js';
import { socialOf } from './friends.js';

export function setStat(k, fn) {
  const s = state.stats.find((x) => x.k === k);
  if (s) { s.v = Math.max(0, Math.min(100, Math.round(fn(s.v)))); }
}

// เพิ่มแต้มทักษะ และเล่าในบันทึกเมื่อทักษะขึ้นขั้นใหม่
export function addSkills(gain) {
  const ups = [];
  Object.keys(gain).forEach((id) => {
    const before = levelOf(state.skills[id] || 0);
    state.skills[id] = Math.max(0, Math.min(100, (state.skills[id] || 0) + gain[id]));
    const after = levelOf(state.skills[id]);
    if (after.n > before.n) { ups.push(SKILL_NAME[id] + ' ขั้น ' + after.n + ' ' + after.name); }
  });
  if (ups.length) { addLine('ทักษะที่ก้าวหน้า: ' + ups.join(' · ')); }
}

const ELDER_ROLES = ['ย่า', 'ยาย', 'ปู่', 'ตา', 'ลุง', 'ป้า', 'อา', 'น้า'];

function bump(list, d, acc) {
  list.forEach((p) => { p.v = clamp(Math.round(p.v + d), 0, 100); });
  if (list.length && d !== 0) { acc.push(d); }
}

export function applyFx(fx, c) {
  const tags = [];
  const stats = fx.stats || {};
  Object.keys(stats).forEach((k) => {
    const s = state.stats.find((x) => x.k === k);
    if (!s) { return; }
    const before = s.v;
    setStat(k, (v) => v + stats[k]);
    if (s.v !== before) { tags.push([s.label + (s.v > before ? 'เพิ่มขึ้น' : 'ลดลง'), s.v > before ? 'good' : 'bad']); }
  });
  if (fx.skills) { addSkills(fx.skills); }

  const rel = [];
  const home = (state.rels[0] ? state.rels[0].items : []).filter((p) => !p.note);
  if (fx.family) { bump(home, fx.family, rel); }
  if (fx.carer && c.cg) { bump([c.cg], fx.carer, rel); }
  if (fx.sibs) { bump(c.sibs, fx.sibs, rel); }
  if (fx.elder) { bump(c.fam.filter((p) => ELDER_ROLES.indexOf(p.r) >= 0 && !p.note), fx.elder, rel); }
  if (fx.pet && c.pet) { bump([c.pet], fx.pet, rel); }
  if (fx.rel) {
    Object.keys(fx.rel).forEach((role) => { bump(c.fam.filter((p) => p.r === role), fx.rel[role], rel); });
  }
  if (rel.length) {
    const net = rel.reduce((a, b) => a + b, 0);
    if (net !== 0) { tags.push(['ความสัมพันธ์' + (net > 0 ? 'ดีขึ้น' : 'แย่ลง'), net > 0 ? 'good' : 'bad']); }
  }

  if (fx.flag) { Object.keys(fx.flag).forEach((k) => { state.flags[k] = fx.flag[k]; }); }

  if (fx.swapCarer) {
    const old = c.fam.find((p) => p.r === fx.swapCarer);
    if (old) {
      old.n = pick(FEMALE) + ' ' + pick(SURNAMES);
      old.v = 38;
      old.age = ri(30, 55);
      addLine('ผู้ดูแลคนใหม่ของฉันคือ ' + old.n + ' (อายุ ' + old.age + ' ปี)');
    }
  }
  setStat('social', () => socialOf(state.rels));
  return tags;
}
