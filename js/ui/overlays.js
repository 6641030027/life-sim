// หน้าต่างซ้อนทับ: เปิด/ปิด, แผ่นเลื่อนขึ้น (sheet), ข้อความแจ้งสั้นๆ (toast)

import { $ } from '../util.js?v=e4d2fc4c';

export function openOverlay(id) { $(id).classList.add('open'); }
export function closeOverlay(id) { $(id).classList.remove('open'); }

let toastTimer = null;
export function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.remove('show'); }, 1800);
}

// เปิด sheet ด้วยชื่อและเนื้อหา HTML คืนค่าเป็น element เนื้อหาให้ใส่ตัวจัดการเพิ่มได้
export function openSheet(title, html) {
  $('sheetTitle').textContent = title;
  $('sheetBody').innerHTML = html;
  openOverlay('sheetOverlay');
  return $('sheetBody');
}

export function placeholder(title) {
  openSheet(title, '<p>ส่วนนี้ยังไม่ได้ทำ จะออกแบบทีละขั้นตามที่คุยกัน</p>');
}
