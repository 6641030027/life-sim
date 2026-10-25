// สุ่มรูปลักษณ์ตอนเกิด (ฟังก์ชันล้วน ไม่แตะหน้าจอ)
// ใบหน้าและส่วนสูงใช้แบบเดียวกันทุกคน ต่างกันที่สีผิว สีผม ทรงผม และสีเสื้อ
// รูปร่างจริงคำนวณตอนวาด จากเพศ อายุ และสุขภาพ (ดู ui/figure.js)

import { pick } from '../util.js';

// เฉดสีผิว เรียงจากขาวไปเข้ม พร้อมน้ำหนักการสุ่ม (เน้นเฉดกลางที่พบบ่อยในไทย)
const SKINS = [
  ['#f6dcc4', 10], ['#ecc7a0', 22], ['#dcab80', 28], ['#c68f62', 22], ['#a86f45', 12], ['#7e4d2e', 6]
];
// สีผมธรรมชาติ
const HAIRS = [['#1c1a1a', 82], ['#33241b', 14], ['#4a3424', 4]];
const SHIRTS = ['#4a7fd1', '#d1584a', '#4aa57a', '#e0a93b', '#8a63c9', '#3fa7b5', '#d9708f'];

export const HAIR_STYLES_MALE = ['short', 'buzz', 'wavy'];
export const HAIR_STYLES_FEMALE = ['long', 'bob', 'ponytail'];

function weighted(list) {
  let total = 0;
  list.forEach((x) => { total += x[1]; });
  let r = Math.random() * total;
  for (let i = 0; i < list.length; i++) {
    r -= list[i][1];
    if (r <= 0) { return list[i][0]; }
  }
  return list[0][0];
}

export function rollLook(male) {
  return {
    skin: weighted(SKINS),
    hair: weighted(HAIRS),
    hairStyle: pick(male ? HAIR_STYLES_MALE : HAIR_STYLES_FEMALE),
    shirt: pick(SHIRTS)
  };
}
