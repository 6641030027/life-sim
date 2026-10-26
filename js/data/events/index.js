// เลือกเหตุการณ์ของปีตามอายุ: ช่วงวัยที่เขียนจริงแล้วใช้ระบบสุ่มตามเงื่อนไข (engine/events.js)
// skill-events.js (เหตุจากทักษะ) ซ่อนไว้ ยังไม่ import จนกว่าจะทำระบบอาชีพเสร็จ
// ช่วงวัยที่ยังไม่ได้เขียน ใช้เหตุการณ์ตัวอย่างชั่วคราวไฟล์ละ 1 รายการ
import { EVENTS as TODDLER, PER_YEAR as TODDLER_N } from './toddler.js';
import { EVENTS as CHILD, PER_YEAR as CHILD_N } from './child.js';
import { EVENTS as TEEN, PER_YEAR as TEEN_N } from './teen.js';
import { EV_YOUNG } from './young.js';
import { EV_ADULT } from './adult.js';
import { EV_ELDER } from './elder.js';
import { EVENTS as INFANT, PER_YEAR as INFANT_N } from './infant.js';
import { rollEvents } from '../../engine/events.js';

export function eventsFor(age) {
  if (age < 2) { return rollEvents(INFANT, INFANT_N); }
  if (age < 5) { return rollEvents(TODDLER, TODDLER_N); }
  if (age < 13) { return rollEvents(CHILD, CHILD_N); }
  if (age < 18) { return rollEvents(TEEN, TEEN_N); }
  if (age < 30) { return [EV_YOUNG]; }
  if (age < 60) { return [EV_ADULT]; }
  return [EV_ELDER];
}
