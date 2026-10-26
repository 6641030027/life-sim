// ลำดับการเล่น: เริ่มชีวิตใหม่ และกดข้ามปี

import { state } from './state.js?v=e4d2fc4c';
import { rollCharacter } from './engine/character.js?v=e4d2fc4c';
import { eventsFor } from './data/events/index.js?v=e4d2fc4c';
import { clearLog, addHeading, addLine, scrollLog } from './ui/log.js?v=e4d2fc4c';
import { renderHeader, renderCharacter } from './ui/header.js?v=e4d2fc4c';
import { renderFocus } from './ui/focus.js?v=e4d2fc4c';
import { renderStats } from './ui/stats.js?v=e4d2fc4c';
import { showEvents } from './ui/event.js?v=e4d2fc4c';
import { setStat, addSkills } from './engine/effects.js?v=e4d2fc4c';
import { stageOf } from './data/stages.js?v=e4d2fc4c';
import { hasYearRules, rollYear, schoolYear, yearText } from './engine/growth.js?v=e4d2fc4c';
import { makeClassmates, socialOf } from './engine/friends.js?v=e4d2fc4c';
import { SCHOOL } from './data/activities.js?v=e4d2fc4c';

export function startNewLife() {
  const c = rollCharacter();
  state.me = c.me;
  state.rels = c.rels;
  state.stats.forEach((s) => {
    if (c.vals[s.k] !== undefined) { s.v = c.vals[s.k]; }
  });

  clearLog();
  state.age = 0;
  state.focus = [];
  state.skills = {};
  state.infantNote = false;
  state.toddlerNote = false;
  state.seen = {};
  state.flags = {};
  state.queue = [];
  addHeading(0);
  c.lines.forEach((t) => addLine(t));

  renderCharacter();
  renderFocus();
  renderStats();
  showEvents(eventsFor(0));      // เหตุการณ์ของขวบปีแรก
}

export function pressAge() {
  const lived = state.age;                       // ปีที่เพิ่งผ่านไป
  const oldStage = stageOf(lived).name;
  state.age += 1;
  state.rels.forEach((g) => { g.items.forEach((p) => { if (p.age !== undefined && !p.dead) { p.age += 1; } }); });   // ทุกคนแก่ขึ้นปีละ 1 (คนที่เสียชีวิตแล้วหยุดนับ)
  addHeading(state.age);
  if (state.age < 2 && state.focus.length > 0 && !state.infantNote) {
    addLine('เด็กน้อยยังไม่รู้เรื่องหรอก ชีวิตเลยเป็นไปตามที่ผู้ใหญ่จัดให้');
    state.infantNote = true;
  } else if (state.age >= 2 && state.age < 5 && state.focus.length > 0 && !state.toddlerNote) {
    addLine('ฉันเริ่มมีสิ่งที่อยากทำเองแล้ว แต่ยังคุมตัวเองไม่ค่อยได้ สิ่งที่ทำจริงเลยไม่ได้เป็นไปตามใจเสมอไป');
    state.toddlerNote = true;
  }
  if (hasYearRules(oldStage)) { applyYear(oldStage, lived); }
  startSchoolYear();
  if (stageOf(state.age).name !== oldStage) {    // เปลี่ยนช่วงวัย: จุดเน้นเปลี่ยนตาม
    state.focus = [];
    renderFocus();
  }
  renderHeader();
  scrollLog();
  showEvents(eventsFor(state.age));
}

// ชั้นเรียนตามอายุ (การศึกษาภาคบังคับเริ่ม 6 ขวบ ป.1-ป.6 แล้วต่อ ม.1)
const GRADES = { 6: 'ป.1', 7: 'ป.2', 8: 'ป.3', 9: 'ป.4', 10: 'ป.5', 11: 'ป.6', 12: 'ม.1', 13: 'ม.2', 14: 'ม.3', 15: 'ม.4', 16: 'ม.5', 17: 'ม.6' };

function friendsSection() { return state.rels.find((g) => g.sec === 'เพื่อน'); }

// สร้างเพื่อนร่วมชั้น ถ้ายังไม่มี (ตอนเข้าเรียน หรือเมื่อข้ามอายุมาจากหน้าตั้งค่า)
function ensureClassmates() {
  if (friendsSection() || state.age < SCHOOL.minAge) { return null; }
  const list = makeClassmates(state.age);
  state.rels.splice(1, 0, { sec: 'เพื่อน', items: list });
  return list;
}

function startSchoolYear() {
  if (!GRADES[state.age]) { return; }
  const first = ensureClassmates();
  if (first && state.age === SCHOOL.minAge) {
    addLine('ฉันเริ่มเข้าเรียนชั้น ' + GRADES[state.age] + ' และได้รู้จักเพื่อนร่วมชั้น: ' + first.map((p) => p.n).join(', '));
  } else {
    addLine('ปีนี้ฉันเรียนอยู่ชั้น ' + GRADES[state.age]);
  }
  setStat('social', () => socialOf(state.rels));
  renderStats();
}

// เด็กทำอะไรจริงในปีที่ผ่านมา (สุ่ม สิ่งที่เลือกเพิ่มโอกาสตามอายุ)
//   ทารก/วัยหัดเดิน: โบนัสลับเล็กๆ   วัยเด็ก: แต้มทักษะจริง × ตัวคูณความฉลาดลับ + โบนัสพื้นฐานจากโรงเรียน
function applyYear(stage, lived) {
  const me = state.me;
  let siblings = 0;
  state.rels.forEach((g) => { g.items.forEach((p) => { if (p.r === 'พี่ชาย' || p.r === 'พี่สาว') { siblings += 1; } }); });
  const smartsStat = state.stats.find((x) => x.k === 'smarts');
  const ctx = {
    stage: stage, age: lived, warmth: me.family ? me.family.warmth : 60,
    siblings: siblings, genes: me.genes, selected: state.focus, smarts: smartsStat ? smartsStat.v : 20
  };
  if (stage === 'วัยเด็ก' && lived >= SCHOOL.minAge) { ensureClassmates(); }
  const r = rollYear(ctx);
  addLine(yearText(stage, r.chosen, r.wanted));
  const skills = Object.assign({}, r.skills);
  const stats = Object.assign({}, r.stats);
  if (stage === 'วัยเด็ก' && lived >= SCHOOL.minAge) {       // ไปโรงเรียน = โบนัสพื้นฐานฟรี
    const sc = schoolYear(ctx);
    Object.keys(sc.skills).forEach((id) => { skills[id] = (skills[id] || 0) + sc.skills[id]; });
    Object.keys(sc.stats).forEach((k) => { stats[k] = (stats[k] || 0) + sc.stats[k]; });
  }
  addSkills(skills);
  Object.keys(stats).forEach((k) => {
    setStat(k, (v) => {
      let nv = v + stats[k];
      if (k === 'smarts' && stats[k] > 0 && me.genes) { nv = Math.min(nv, Math.max(v, me.genes.smarts)); }   // เพดานตามศักยภาพ (ยีนซ่อน)
      return nv;
    });
  });
  // ความสัมพันธ์: กิจกรรมเพิ่มความสนิท ถ้าไม่ได้เล่นกับเพื่อนเลยทั้งปี เพื่อนค่อยๆ ห่างเล็กน้อย
  const fr = friendsSection();
  if (state.rels[0]) { state.rels[0].items.forEach((p) => { p.v = Math.min(100, p.v + r.rel.family); }); }
  if (fr) {
    fr.items.forEach((p) => { p.v = Math.max(15, Math.min(100, p.v + (r.rel.friends > 0 ? r.rel.friends : -2))); });
  }
  setStat('social', () => socialOf(state.rels));
  renderStats();
}
