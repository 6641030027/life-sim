// ป็อปอัปเหตุการณ์ + ตัวเลือก (เลือกแล้วผลลงบันทึกชีวิต)
// เหตุการณ์ใหม่ (choice.outcomes): กดแล้วสุ่มผล โชว์ผลในป็อปอัปเดิมพร้อมสรุปที่เปลี่ยนไป แล้วค่อยไปเหตุการณ์ถัดไป
// เหตุการณ์ตัวอย่างเก่า (ยังไม่มี outcomes): กดแล้วปิด บันทึกว่าเลือกอะไร

import { $ } from '../util.js?v=e4d2fc4c';
import { state } from '../state.js?v=e4d2fc4c';
import { openOverlay, closeOverlay, toast } from './overlays.js?v=e4d2fc4c';
import { addLine, scrollLog } from './log.js?v=e4d2fc4c';
import { renderFocus } from './focus.js?v=e4d2fc4c';
import { renderStats } from './stats.js?v=e4d2fc4c';
import { renderHeader } from './header.js?v=e4d2fc4c';
import { buildCtx, resolve, txt } from '../engine/events.js?v=e4d2fc4c';

// แสดงเหตุการณ์ของปีนี้ต่อกันทีละรายการ
export function showEvents(list) {
  state.queue = list.slice();
  const first = state.queue.shift();
  if (first) { showEvent(first); }
}

function fillChoice(button, label, tags) {
  const t = document.createElement('b');
  t.textContent = label;
  button.appendChild(t);
  (tags || []).forEach((tg) => {
    const s = document.createElement('span');
    s.className = 'tag ' + tg[1];
    s.textContent = tg[0];
    button.appendChild(s);
  });
}

export function showEvent(ev) {
  const c = buildCtx();
  state.currentEvent = ev;
  $('evTitle').textContent = txt(ev.title, c);
  $('evDesc').textContent = txt(ev.desc, c);
  const box = $('evChoices');
  box.innerHTML = '';
  ev.choices.forEach((ch) => {
    const b = document.createElement('button');
    b.className = 'choice';
    fillChoice(b, ch.label, ch.tags);
    b.addEventListener('click', () => { choose(ev, ch); });
    box.appendChild(b);
  });
  $('evOverlay').querySelector('.card').scrollTop = 0;
  openOverlay('evOverlay');
}

function finish() {
  const next = state.queue.shift();
  if (next) { showEvent(next); return; }
  closeOverlay('evOverlay');
  state.focus = [];
  renderFocus();
  scrollLog();
}

function choose(ev, ch) {
  const title = txt(ev.title, buildCtx());
  if (ch.outcomes) {
    const r = resolve(ch);
    addLine(ch.auto ? title + ': ' + r.text : title + ': ฉันเลือก "' + ch.label + '" ' + r.text);
    renderStats();
    renderHeader();
    $('evDesc').textContent = r.text;
    const box = $('evChoices');
    box.innerHTML = '';
    const b = document.createElement('button');
    b.className = 'choice';
    fillChoice(b, 'ต่อไป', r.tags);
    b.addEventListener('click', r.next ? () => { showEvent(r.next); } : finish);
    box.appendChild(b);
    $('evOverlay').querySelector('.card').scrollTop = 0;
    scrollLog();
    return;
  }
  addLine(title + ': ฉันเลือก "' + ch.label + '"');
  if (ch.fame) {
    const fame = state.stats.find((s) => s.k === 'fame');
    if (fame && !fame.shown) {
      fame.hidden = false;
      fame.shown = true;
      renderStats('fame');
      toast('ปลดล็อกแถบชื่อเสียงแล้ว');
    }
  }
  finish();
}
