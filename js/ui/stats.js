// แถบสถานะ (เขียวเมื่อค่า >= 50 ส้มเมื่อต่ำกว่า) ตัวที่ hidden จะยังไม่แสดง

import { $ } from '../util.js?v=e4d2fc4c';
import { state } from '../state.js?v=e4d2fc4c';

export function renderStats(newKey) {
  const wrap = $('stats');
  wrap.innerHTML = '';
  state.stats.forEach((s) => {
    if (s.hidden) { return; }
    const row = document.createElement('div');
    row.className = 'stat' + (s.k === newKey ? ' new' : '');
    const color = s.v >= 50 ? 'var(--green)' : 'var(--orange)';
    row.innerHTML =
      '<span class="lab"><i class="ti ' + s.icon + '" aria-hidden="true"></i>' + s.label + '</span>' +
      '<div class="bar"><i style="width:' + s.v + '%;background:' + color + '"></i><span>' + s.v + '%</span></div>';
    wrap.appendChild(row);
  });
}
