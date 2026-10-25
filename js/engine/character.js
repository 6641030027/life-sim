// สุ่มตัวละครและครอบครัวตอนเกิด (ฟังก์ชันล้วน ไม่แตะหน้าจอ)
// คืนค่า: { me, rels, vals, lines }
//   me    ตัวละครของเรา
//   rels  ความสัมพันธ์แบ่งหมวด สำหรับหน้าความสัมพันธ์
//   vals  ค่าสถานะเริ่มต้น { happy, health, smarts, looks, social }
//   lines ข้อความบันทึกวันเกิด

import { ri, pick } from '../util.js';
import { PLACE, MALE, FEMALE, SURNAMES, JOBS, PET_NAMES } from '../data/names.js';

export function rollCharacter() {
  const male = Math.random() < 0.5;
  const surname = pick(SURNAMES);
  const first = pick(male ? MALE : FEMALE);
  const me = { male, first, name: first + ' ' + surname, surname };

  const momSurname = pick(SURNAMES);
  const momAge = ri(21, 40);
  const dadAge = Math.max(21, momAge + ri(-2, 8));
  const dad = { n: pick(MALE) + ' ' + surname, r: 'พ่อ', v: ri(55, 100), w: 3, job: pick(JOBS), age: dadAge };
  const mom = { n: pick(FEMALE) + ' ' + momSurname, r: 'แม่', v: ri(55, 100), w: 3, job: pick(JOBS.concat(['แม่บ้าน'])), age: momAge };
  const family = [dad, mom];
  const sibs = [];

  const roll = Math.random();
  let sibCount = roll < 0.4 ? 0 : (roll < 0.75 ? 1 : 2);
  const sibMax = Math.min(15, momAge - 18);
  if (sibMax < 2) { sibCount = 0; }
  for (let i = 0; i < sibCount; i++) {
    const sm = Math.random() < 0.5;
    const sib = { n: pick(sm ? MALE : FEMALE) + ' ' + surname, r: sm ? 'พี่ชาย' : 'พี่สาว', v: ri(30, 85), w: 2, age: ri(2, sibMax) };
    sibs.push(sib);
    family.push(sib);
  }

  const rels = [{ sec: 'ครอบครัว', items: family }];
  let pet = null;
  if (Math.random() < 0.3) {
    pet = { n: pick(PET_NAMES), r: Math.random() < 0.5 ? 'สุนัข' : 'แมว', v: ri(40, 100), w: 1 };
    rels.push({ sec: 'สัตว์เลี้ยง', items: [pet] });
  }

  const vals = { happy: ri(55, 100), health: ri(45, 100), smarts: ri(5, 45), looks: ri(5, 100) };
  // สังคม = ค่าเฉลี่ยความสัมพันธ์ ถ่วงน้ำหนักตามความสนิท (w)
  let sum = 0;
  let wsum = 0;
  family.concat(pet ? [pet] : []).forEach((p) => { sum += p.v * p.w; wsum += p.w; });
  vals.social = Math.round(sum / wsum);

  const lines = [];
  lines.push('ฉันเกิดเป็น' + (male ? 'ผู้ชาย' : 'ผู้หญิง') + ' ที่' + PLACE);
  lines.push('ชื่อของฉันคือ ' + me.name);
  lines.push('พ่อของฉันคือ ' + dad.n + ' อาชีพ' + dad.job + ' (อายุ ' + dad.age + ' ปี)');
  lines.push('แม่ของฉันคือ ' + mom.n + ' อาชีพ' + mom.job + ' (อายุ ' + mom.age + ' ปี)');
  if (sibs.length === 0) {
    lines.push('ฉันเป็นลูกคนเดียว');
  } else {
    sibs.forEach((s) => { lines.push('ฉันมี' + s.r + ' ชื่อ ' + s.n + ' (อายุ ' + s.age + ' ปี)'); });
  }
  if (pet) { lines.push('ที่บ้านเลี้ยง' + pet.r + 'ชื่อ ' + pet.n); }

  return { me, rels, vals, lines };
}
