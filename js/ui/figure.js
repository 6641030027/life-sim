// ตัวละครพิกเซลเต็มตัว ประกอบจากชิ้นส่วนในคลัง js/data/parts/ แล้วแสดงที่แถบตัวละครด้านบน
// รูปร่างเปลี่ยนตาม: อายุ (ตัว/ขายาวขึ้น) เพศ (ชายไหล่กว้าง หญิงสะโพกผาย เริ่มช่วงวัยรุ่น) และสุขภาพ (ต่ำ = ผอมบาง, สูง = ล่ำใหญ่)
// ใบหน้าและส่วนสูงเหมือนกันทุกคน (หัวสูง 8 หน่วยเสมอ)

import { $ } from '../util.js?v=e4d2fc4c';
import { state } from '../state.js?v=e4d2fc4c';
import { HAIR_STYLES, BABY_HAIR } from '../data/parts/hair.js?v=e4d2fc4c';
import { TOPS } from '../data/parts/tops.js?v=e4d2fc4c';
import { BOTTOMS } from '../data/parts/bottoms.js?v=e4d2fc4c';

const U = 4;            // 1 หน่วยพิกเซล = 4 หน่วยใน viewBox
const CX = 12;          // กึ่งกลางตัว (หน่วยพิกเซล)
const GROUND = 150;     // พื้น (พิกัด viewBox)
const HEAD = 8;
const EYE = '#2b2320';
const MOUTH = '#a24a4a';

// ความสูงลำตัว (T) และขา (L) ตามอายุ
function sizeFor(age) {
  if (age < 2) { return { T: 3, L: 2 }; }
  if (age < 5) { return { T: 4, L: 4 }; }
  if (age < 9) { return { T: 5, L: 6 }; }
  if (age < 13) { return { T: 6, L: 8 }; }
  if (age < 16) { return { T: 8, L: 10 }; }
  if (age < 18) { return { T: 10, L: 12 }; }
  return { T: 11, L: 12 };
}

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
  return '#' + [c(n >> 16), c((n >> 8) & 255), c(n & 255)].map((v) => (v < 16 ? '0' : '') + v.toString(16)).join('');
}

function hairColorFor(look, age) {
  if (age >= 65) { return '#e6e6e6'; }
  if (age >= 52) { return '#8d8d8d'; }
  return look.hairColor;
}

export function figureSVG(look, male, age, health) {
  const sz = sizeFor(age);
  const T = sz.T;
  const L = sz.L;
  const total = 1 + HEAD + T + L;                // คอ 1 + หัว + ลำตัว + ขา
  const topPx = GROUND - total * U;
  let out = '<svg viewBox="0 0 96 160" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" role="img" aria-label="ตัวละคร">';
  // yu = ตำแหน่งแนวตั้งนับจากขอบบนของหัว (หน่วยพิกเซล)
  const R = (x, yu, w, h, col) => {
    if (w <= 0 || h <= 0) { return; }
    out += '<rect x="' + (x * U) + '" y="' + (topPx + yu * U) + '" width="' + (w * U) + '" height="' + (h * U) + '" fill="' + col + '"/>';
  };
  const RH = (r, ox, oy, col, hang) => {          // วาดชิ้นส่วนจากคลัง (พิกัดกึ่งกลางหัว)
    r.forEach((q) => { R(CX + q[0] + ox, q[1] + oy, q[2], q[3] === 'H' ? hang : q[3], col); });
  };

  const skin = look.skin;
  const top = TOPS.find((t) => t.id === look.top) || TOPS[0];
  const bot = BOTTOMS.find((b) => b.id === look.bottom) || BOTTOMS[0];
  const hairCol = hairColorFor(look, age);
  const ty = HEAD + 1;                            // ลำตัวเริ่มต่อจากคอ
  const ly = ty + T;                              // ขาเริ่ม

  // ความกว้างลำตัว (เลขคู่): ฐานตามอายุ + ชายวัยรุ่นขึ้นไปไหล่กว้าง + สุขภาพ
  let w = age < 5 ? 6 : 8;
  if (male && age >= 14) { w += 2; }
  if (health < 35) { w -= 2; } else if (health >= 80) { w += 2; }
  w = Math.max(6, Math.min(14, w));
  const lw = (w - 2) / 2;                          // ความกว้างขาแต่ละข้าง
  const sx = CX - w / 2;
  const female = !male && age >= 13;

  // เงาพื้น
  out += '<ellipse cx="48" cy="' + (GROUND + 1) + '" rx="' + (w * 2 + 10) + '" ry="3" fill="rgba(0,0,0,.13)"/>';

  // ผมด้านหลัง
  let hairBack = [];
  let hairFront = [];
  if (age < 2) { hairFront = BABY_HAIR.front; } else {
    const hs = HAIR_STYLES.find((h) => h.id === look.hair) || HAIR_STYLES[0];
    hairBack = hs.back; hairFront = hs.front;
  }
  const hang = Math.max(2, Math.min(6, T - 1));
  RH(hairBack, 0, 0, hairCol, hang);

  // ขา + รองเท้า
  const legCol = look.bottomColor;
  const shortsRows = Math.max(1, Math.round(L * 0.45));
  [[CX - 1 - lw, lw], [CX + 1, lw]].forEach((p) => {
    if (bot.type === 'pants') { R(p[0], ly, p[1], L - 1, legCol); }
    if (bot.type === 'shorts') { R(p[0], ly, p[1], shortsRows, legCol); R(p[0], ly + shortsRows, p[1], L - 1 - shortsRows, skin); }
    if (bot.type === 'skirt') { R(p[0], ly, p[1], L - 1, skin); }
    R(p[0], ly + L - 1, p[1], 1, look.shoe);
  });

  // แขน (ปลอกแขนตามชนิดเสื้อ + มือสีผิว)
  const armH = Math.max(2, T - 2);
  const sleeveRows = top.sleeve === 'long' ? armH - 2 : (top.sleeve === 'short' ? Math.min(2, armH - 1) : 0);
  [[sx - 2, 2], [sx + w, 2]].forEach((p) => {
    R(p[0], ty, p[1], armH, skin);
    if (sleeveRows > 0) { R(p[0], ty, p[1], sleeveRows, look.topColor); }
  });

  // ลำตัว + ลายเสื้อ
  R(sx, ty, w, T, look.topColor);
  const dark = shade(look.topColor, 0.8);
  const light = shade(look.topColor, 1.25);
  if (age >= 5) {
    if (top.deco === 'stripe') { for (let i = 1; i < T; i += 2) { R(sx, ty + i, w, 1, dark); } }
    if (top.deco === 'collar') { R(CX - 2, ty, 1, 1, '#f2f2f2'); R(CX + 1, ty, 1, 1, '#f2f2f2'); R(CX - 1, ty, 2, 1, skin); }
    if (top.deco === 'vneck') { R(CX - 1, ty, 2, 1, skin); }
    if (top.deco === 'pocket') { R(CX - 2, ty + T - 3, 4, 2, dark); }
    if (top.deco === 'logo') { R(CX - 1, ty + 2, 2, 2, light); }
  }
  // สะโพกหญิงผาย / กระโปรง
  if (bot.type === 'skirt') {
    R(sx - 1, ly - 1, w + 2, 2, legCol);
    R(sx - 2, ly + 1, w + 4, 2, legCol);
  } else {
    R(sx, ly - 1, w, 1, legCol);                 // เอวกางเกง
    if (female) { R(sx - 1, ly - 1, w + 2, 1, legCol); }
  }

  // คอ หัว หน้า
  R(CX - 1, HEAD, 2, 1, skin);
  R(CX - HEAD / 2, 0, HEAD, HEAD, skin);
  R(CX - 3, 4, 1, 1, EYE); R(CX + 2, 4, 1, 1, EYE);
  R(CX - 1, 6, 2, 1, MOUTH);
  RH(hairFront, 0, 0, hairCol, hang);

  return out + '</svg>';
}

export function renderFigure() {
  const health = state.stats.find((x) => x.k === 'health');
  $('figure').innerHTML = figureSVG(state.me.look, state.me.male, state.age, health ? health.v : 70);
}
