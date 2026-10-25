// ลำดับการเล่น: เริ่มชีวิตใหม่ และกดข้ามปี

import { state } from './state.js';
import { rollCharacter } from './engine/character.js';
import { eventFor } from './data/events/index.js';
import { clearLog, addHeading, addLine, scrollLog } from './ui/log.js';
import { renderHeader, renderCharacter } from './ui/header.js';
import { renderFocus } from './ui/focus.js';
import { renderStats } from './ui/stats.js';
import { showEvent } from './ui/event.js';
import { stageOf } from './data/stages.js';
import { hasYearRules, rollYear, yearText } from './engine/growth.js';

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
  addHeading(0);
  c.lines.forEach((t) => addLine(t));

  renderCharacter();
  renderFocus();
  renderStats();
}

export function pressAge() {
  const lived = state.age;                       // ปีที่เพิ่งผ่านไป
  const oldStage = stageOf(lived).name;
  state.age += 1;
  addHeading(state.age);
  if (state.age < 2 && state.focus.length > 0 && !state.infantNote) {
    addLine('เด็กน้อยยังไม่รู้เรื่องหรอก ชีวิตเลยเป็นไปตามที่ผู้ใหญ่จัดให้');
    state.infantNote = true;
  } else if (state.age >= 2 && state.age < 5 && state.focus.length > 0 && !state.toddlerNote) {
    addLine('ฉันเริ่มมีสิ่งที่อยากทำเองแล้ว แต่ยังคุมตัวเองไม่ค่อยได้ สิ่งที่ทำจริงเลยไม่ได้เป็นไปตามใจเสมอไป');
    state.toddlerNote = true;
  }
  if (hasYearRules(oldStage)) { applyYear(oldStage, lived); }
  if (stageOf(state.age).name !== oldStage) {    // เปลี่ยนช่วงวัย: จุดเน้นเปลี่ยนตาม
    state.focus = [];
    renderFocus();
  }
  renderHeader();
  scrollLog();
  showEvent(eventFor(state.age));
}

// วัยเด็กเล็ก: เด็กทำอะไรจริงในปีที่ผ่านมา (สุ่ม สิ่งที่เลือกเพิ่มโอกาสตามอายุ) ได้โบนัสลับเล็กๆ น้อยๆ
function applyYear(stage, lived) {
  const me = state.me;
  let siblings = 0;
  state.rels.forEach((g) => { g.items.forEach((p) => { if (p.r === 'พี่ชาย' || p.r === 'พี่สาว') { siblings += 1; } }); });
  const r = rollYear({
    stage: stage, age: lived, warmth: me.family ? me.family.warmth : 60,
    siblings: siblings, genes: me.genes, selected: state.focus
  });
  addLine(yearText(stage, r.chosen, r.wanted));
  Object.keys(r.skills).forEach((id) => { state.skills[id] = Math.min(100, (state.skills[id] || 0) + r.skills[id]); });
  Object.keys(r.stats).forEach((k) => {
    const s = state.stats.find((x) => x.k === k);
    if (s) { s.v = Math.max(0, Math.min(100, s.v + r.stats[k])); }
  });
  renderStats();
}
