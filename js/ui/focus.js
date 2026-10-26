// แถบจุดเน้นของปี (เลื่อนซ้าย-ขวา เลือกได้หลายอัน) และข้อความสถานะที่เลือก

import { $ } from '../util.js?v=e4d2fc4c';
import { state } from '../state.js?v=e4d2fc4c';
import { FOCUS, stageOf } from '../data/stages.js?v=e4d2fc4c';

export function renderFocus() {
  const s = stageOf(state.age);
  const wrap = $('chips');
  wrap.innerHTML = '';
  FOCUS[s.name].forEach((f) => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.setAttribute('aria-pressed', state.focus.indexOf(f[0]) >= 0 ? 'true' : 'false');
    const i = document.createElement('i');
    i.className = 'ti ' + f[1];
    i.setAttribute('aria-hidden', 'true');
    b.appendChild(i);
    b.appendChild(document.createTextNode(f[0]));
    b.addEventListener('click', () => {
      const idx = state.focus.indexOf(f[0]);
      if (idx >= 0) { state.focus.splice(idx, 1); } else { state.focus.push(f[0]); }
      renderFocus();
    });
    wrap.appendChild(b);
  });
  wrap.scrollLeft = 0;
  const st = $('focusStatus');
  if (state.focus.length === 0) {
    st.textContent = 'ยังไม่ได้เลือก · ไม่เลือก = ปล่อยให้ชีวิตสุ่ม';
  } else {
    st.innerHTML = 'เลือกแล้ว <b>' + state.focus.length + ' อย่าง</b>: ' + state.focus.join(', ');
  }
}
