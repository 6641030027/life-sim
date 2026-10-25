// ตั้งค่า: โหมดทดสอบ UI (ข้ามไปอายุที่ต้องการ) และกลับหน้าแรก

import { state } from '../state.js';
import { closeOverlay, openSheet, toast } from './overlays.js';
import { addHeading, scrollLog } from './log.js';
import { renderHeader } from './header.js';
import { renderFocus } from './focus.js';

const JUMPS = [[0, 'ทารก'], [3, 'วัยหัดเดิน'], [8, 'วัยเด็ก'], [15, 'วัยรุ่น'], [25, 'ผู้ใหญ่']];

export function openSettings() {
  const body = openSheet(
    'ตั้งค่า',
    '<p>โหมดทดสอบ UI: ข้ามไปอายุที่ต้องการเพื่อดูจุดเน้นของแต่ละช่วงวัย</p>' +
    '<div class="btn-row" id="jumpRow"></div>' +
    '<div class="btn-row"><button class="btn" id="btnReset">กลับหน้าแรก (สุ่มใหม่)</button></div>'
  );
  const row = body.querySelector('#jumpRow');
  JUMPS.forEach((j) => {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = j[1] + ' (' + j[0] + ')';
    b.addEventListener('click', () => {
      state.age = j[0];
      state.focus = [];
      addHeading(state.age);
      renderHeader();
      renderFocus();
      scrollLog();
      closeOverlay('sheetOverlay');
      toast('ข้ามไปอายุ ' + j[0] + ' ปี');
    });
    row.appendChild(b);
  });
  body.querySelector('#btnReset').addEventListener('click', () => { location.reload(); });
}
