// สุ่มตัวละครและครอบครัวตอนเกิด (ฟังก์ชันล้วน ไม่แตะหน้าจอ)
// คืนค่า: { me, rels, vals, lines }
//   me    ตัวละครของเรา
//   rels  ความสัมพันธ์แบ่งหมวด สำหรับหน้าความสัมพันธ์
//   vals  ค่าสถานะเริ่มต้น { happy, health, smarts, looks, social }
//   lines ข้อความบันทึกวันเกิด (เรื่องราวตอนอายุ 0)

import { ri, pick, rn, clamp } from '../util.js';
import { rollLook } from './appearance.js';
import { rollFamily, POP, POP_SD } from './family.js';
import { COUNTRY, MALE, FEMALE, PET_NAMES } from '../data/names.js';

// ขยายส่วนเบี่ยงเบนจากค่ากลาง (ค่าที่ถ่วงน้ำหนักหลายส่วนแล้วแคบเกินจริง)
function spread(x, mean, k) { return mean + k * (x - mean); }

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
    pet = { n: pick(PET_NAMES), r: Math.random() < 0.5 ? 'สุนัข' : 'แมว', v: Math.round(clamp(rn(75, 14), 20, 100)), w: 1 };
    rels.push({ sec: 'สัตว์เลี้ยง', items: [pet] });
  }

  // ยีนซ่อนของตัวละคร: สืบจากพ่อแม่แท้ๆ ครึ่งหนึ่ง ที่เหลือดึงเข้าหาค่ากลางประชากรและมีส่วนสุ่ม
  // (ใช้ต่อเมื่อเล่นเป็นลูก: ยีนของตัวละครนี้ + คู่ จะสืบต่อไป)
  const genes = {};
  Object.keys(POP).forEach((k) => {
    const mid = (fam.momGenes[k] + fam.dadGenes[k]) / 2;
    genes[k] = Math.round(clamp(POP[k] + 0.5 * (mid - POP[k]) + rn(0, POP_SD[k] * 0.85), 5, 95));
  });
  me.genes = genes;

  // ค่าเริ่มต้นที่เห็น = ส่วนของยีน + สภาพแวดล้อมของบ้าน + ดวง (สุ่มแบบระฆังคว่ำ ไม่ใช่สุ่มเท่ากัน)
  // ความฉลาดตอนเกิดต่ำเหมือนกันทุกคน ศักยภาพจริง (genes.smarts) ซ่อนไว้ แล้วค่อยปรากฏเมื่อโตขึ้น
  let complication = false;
  let health = 0.4 * genes.health + 0.3 * fam.care + 0.3 * rn(70, 15);
  if (fam.bioMomAge !== null && (fam.bioMomAge < 20 || fam.bioMomAge > 35)) { health -= 5; }
  if (Math.random() < 0.05) { complication = true; health -= 25; }
  const vals = {
    happy: Math.round(clamp(spread(0.35 * genes.happy + 0.35 * fam.warmth + 0.3 * rn(60, 15), 60, 1.7), 15, 100)),
    health: Math.round(clamp(spread(health, 65, 1.5), 10, 100)),
    smarts: Math.round(clamp(rn(12, 3) + (fam.warmth - 60) * 0.05, 5, 25)),
    looks: Math.round(clamp(genes.looks + rn(0, 5), 5, 100))
  };
  // สังคม = ค่าเฉลี่ยความสัมพันธ์ ถ่วงน้ำหนักตามความสนิท (w)
  let sum = 0;
  let wsum = 0;
  fam.members.concat(pet ? [pet] : []).forEach((p) => { sum += p.v * p.w; wsum += p.w; });
  vals.social = Math.round(sum / wsum);

  const lines = [];
  lines.push('ฉันเกิดเป็น' + (male ? 'ผู้ชาย' : 'ผู้หญิง') + ' ในประเทศ' + COUNTRY);
  lines.push('ชื่อของฉันคือ ' + me.name);
  fam.lines.forEach((t) => { lines.push(t); });
  if (complication) { lines.push('ฉันเกิดก่อนกำหนดและตัวเล็กกว่าปกติ ต้องอยู่ในตู้อบที่โรงพยาบาลหลายสัปดาห์'); }
  if (pet) { lines.push('ที่บ้านเลี้ยง' + pet.r + 'ชื่อ ' + pet.n); }

  return { me, rels, vals, lines };
}
