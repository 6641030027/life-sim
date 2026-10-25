// ป็อปอัปเหตุการณ์ + ตัวเลือก (เลือกแล้วผลลงบันทึกชีวิต)

import { $ } from '../util.js';
import { state } from '../state.js';
import { openOverlay, closeOverlay, toast } from './overlays.js';
import { addLine, scrollLog } from './log.js';
import { renderFocus } from './focus.js';
import { renderStats } from './stats.js';

export function showEvent(ev) {
  state.currentEvent = ev;
  $('evTitle').textContent = ev.title;
  $('evDesc').textContent = ev.desc;
  const box = $('evChoices');
  box.innerHTML = '';
  ev.choices.forEach((c) => {
    const b = document.createElement('button');
    b.className = 'choice';
    const t = document.createElement('b');
    t.textContent = c.label;
    b.appendChild(t);
    c.tags.forEach((tg) => {
      const s = document.createElement('span');
      s.className = 'tag ' + tg[1];
      s.textContent = tg[0];
      b.appendChild(s);
    });
    b.addEventListener('click', () => { choose(ev, c); });
    box.appendChild(b);
  });
  $('evOverlay').querySelector('.card').scrollTop = 0;
  openOverlay('evOverlay');
}

function choose(ev, c) {
  closeOverlay('evOverlay');
  addLine(ev.title + ': ฉันเลือก "' + c.label + '"');
  state.focus = [];
  renderFocus();
  if (c.fame) {
    const fame = state.stats.find((s) => s.k === 'fame');
    if (fame && !fame.shown) {
      fame.hidden = false;
      fame.shown = true;
      renderStats('fame');
      toast('ปลดล็อกแถบชื่อเสียงแล้ว');
    }
  }
  scrollLog();
}
