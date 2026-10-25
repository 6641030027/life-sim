// ลำดับการเล่น: เริ่มชีวิตใหม่ และกดข้ามปี

import { state } from './state.js';
import { rollCharacter } from './engine/character.js';
import { eventFor } from './data/events/index.js';
import { clearLog, addHeading, addLine, scrollLog } from './ui/log.js';
import { renderHeader, renderCharacter } from './ui/header.js';
import { renderFocus } from './ui/focus.js';
import { renderStats } from './ui/stats.js';
import { showEvent } from './ui/event.js';

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
  state.infantNote = false;
  addHeading(0);
  c.lines.forEach((t) => addLine(t));

  renderCharacter();
  renderFocus();
  renderStats();
}

export function pressAge() {
  state.age += 1;
  addHeading(state.age);
  if (state.age < 5 && state.focus.length > 0 && !state.infantNote) {
    addLine('เด็กน้อยยังไม่รู้เรื่องหรอก ชีวิตเลยเป็นไปตามที่ผู้ใหญ่จัดให้');
    state.infantNote = true;
  }
  renderHeader();
  scrollLog();
  showEvent(eventFor(state.age));
}
