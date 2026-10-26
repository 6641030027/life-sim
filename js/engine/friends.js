// เพื่อนและค่าสังคม (ฟังก์ชันล้วน ไม่แตะหน้าจอ)

import { ri, pick, rn, clamp } from '../util.js';
import { MALE, FEMALE, SURNAMES } from '../data/names.js';

// สร้างเพื่อนร่วมชั้น 3-5 คน ตอนเริ่มเข้าโรงเรียน
export function makeClassmates(age) {
  const count = ri(3, 5);
  const list = [];
  for (let i = 0; i < count; i++) {
    const male = Math.random() < 0.5;
    list.push({
      n: pick(male ? MALE : FEMALE) + ' ' + pick(SURNAMES), r: 'เพื่อนร่วมชั้น',
      v: Math.round(clamp(rn(55, 15), 15, 95)), w: 2, age: age + ri(0, 1)
    });
  }
  return list;
}

// ค่าสังคม = ค่าเฉลี่ยความสัมพันธ์ ถ่วงน้ำหนักตามความสนิท (w)
export function socialOf(rels) {
  let sum = 0;
  let wsum = 0;
  rels.forEach((g) => { g.items.forEach((p) => { if (p.dead) { return; } sum += p.v * p.w; wsum += p.w; }); });
  return wsum ? Math.round(sum / wsum) : 0;
}
