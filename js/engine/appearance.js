// สุ่มรูปลักษณ์ตอนเกิดโดยหยิบชิ้นส่วนจากคลัง js/data/parts/ (ฟังก์ชันล้วน ไม่แตะหน้าจอ)
// look เก็บ id/สี ของแต่ละชิ้น ส่วนการประกอบเป็นภาพอยู่ที่ ui/figure.js
// เพิ่มความหลากหลายได้โดยเติมแถวในไฟล์คลัง ไม่ต้องแก้ไฟล์นี้

import { pick } from '../util.js';
import { SKINS } from './../data/parts/skin.js';
import { HAIR_COLORS, HAIR_STYLES } from './../data/parts/hair.js';
import { TOPS, TOP_COLORS } from './../data/parts/tops.js';
import { BOTTOMS, BOTTOM_COLORS, SHOE_COLORS } from './../data/parts/bottoms.js';
import { ACCESSORIES } from './../data/parts/accessories.js';

function weighted(list) {
  let total = 0;
  list.forEach((x) => { total += x.w; });
  let r = Math.random() * total;
  for (let i = 0; i < list.length; i++) {
    r -= list[i].w;
    if (r <= 0) { return list[i]; }
  }
  return list[0];
}

export function rollLook(male) {
  const sex = male ? 'm' : 'f';
  const bottom = pick(BOTTOMS.filter((b) => b.sex === 'any' || b.sex === (male ? 'm' : 'f')));
  return {
    skin: weighted(SKINS).color,
    hairColor: weighted(HAIR_COLORS).color,
    hair: pick(HAIR_STYLES.filter((h) => h.sex === sex)).id,
    top: pick(TOPS).id,
    topColor: pick(TOP_COLORS),
    bottom: bottom.id,
    bottomColor: pick(BOTTOM_COLORS),
    shoe: pick(SHOE_COLORS),
    acc: weighted(ACCESSORIES).id
  };
}
