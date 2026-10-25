// รวมเหตุการณ์ทุกช่วงวัย และเลือกเหตุการณ์ตามอายุ
// ตอนนี้ยังมีช่วงละ 1 เหตุการณ์ (ตัวอย่าง) ภายหลังเปลี่ยนเป็นระบบสุ่ม/เงื่อนไขได้ที่นี่ที่เดียว

import { EV_SMALL } from './small.js';
import { EV_CHILD } from './child.js';
import { EV_TEEN } from './teen.js';
import { EV_ADULT } from './adult.js';

export function eventFor(age) {
  if (age < 5) { return EV_SMALL; }
  if (age < 13) { return EV_CHILD; }
  if (age < 18) { return EV_TEEN; }
  return EV_ADULT;
}
