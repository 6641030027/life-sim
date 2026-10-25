// สุ่มตัวละครและครอบครัวตอนเกิด (ฟังก์ชันล้วน ไม่แตะหน้าจอ)
// คืนค่า: { me, rels, vals, lines }
//   me    ตัวละครของเรา
//   rels  ความสัมพันธ์แบ่งหมวด สำหรับหน้าความสัมพันธ์
//   vals  ค่าสถานะเริ่มต้น { happy, health, smarts, looks, social }
//   lines ข้อความบันทึกวันเกิด (เรื่องราวตอนอายุ 0)

import { ri, pick } from '../util.js';
import { rollLook } from './appearance.js';
import { rollFamily } from './family.js';
import { COUNTRY, MALE, FEMALE, PET_NAMES } from '../data/names.js';

export function rollCharacter() {
  const male = Math.random() < 0.5;
  const first = pick(male ? MALE : FEMALE);
  const fam = rollFamily();
  const me = {
    male, first, name: first + ' ' + fam.surname, surname: fam.surname, country: COUNTRY,
    look: rollLook(male), family: { id: fam.type.id, label: fam.type.label }
  };

  const rels = [{ sec: fam.section, items: fam.members }];
  let pet = null;
  if (!fam.noPet && Math.random() < 0.3) {
    pet = { n: pick(PET_NAMES), r: Math.random() < 0.5 ? 'สุนัข' : 'แมว', v: ri(40, 100), w: 1 };
    rels.push({ sec: 'สัตว์เลี้ยง', items: [pet] });
  }

  const vals = { happy: ri(55, 100), health: ri(45, 100), smarts: ri(5, 45), looks: ri(5, 100) };
  // สังคม = ค่าเฉลี่ยความสัมพันธ์ ถ่วงน้ำหนักตามความสนิท (w)
  let sum = 0;
  let wsum = 0;
  fam.members.concat(pet ? [pet] : []).forEach((p) => { sum += p.v * p.w; wsum += p.w; });
  vals.social = Math.round(sum / wsum);

  const lines = [];
  lines.push('ฉันเกิดเป็น' + (male ? 'ผู้ชาย' : 'ผู้หญิง') + ' ในประเทศ' + COUNTRY);
  lines.push('ชื่อของฉันคือ ' + me.name);
  fam.lines.forEach((t) => { lines.push(t); });
  if (pet) { lines.push('ที่บ้านเลี้ยง' + pet.r + 'ชื่อ ' + pet.n); }

  return { me, rels, vals, lines };
}
