// ตัวละครเต็มตัวแบบเรียบง่าย (SVG) ที่แถบตัวละครด้านบน
// รูปร่างเปลี่ยนตาม: อายุ (สัดส่วนหัว/ตัว, ความสูง) เพศ (เริ่มต่างชัดช่วงวัยรุ่น) และสุขภาพ (ผอมบาง-แข็งแรง)

import { $ } from '../util.js';
import { state } from '../state.js';

// ตารางความสูงสัมพันธ์ (1 = ผู้ใหญ่) และขนาดหัวต่อความสูง ตามอายุ
const AGE_HEIGHT = [[0, 0.30], [1, 0.38], [3, 0.50], [5, 0.58], [8, 0.68], [12, 0.80], [15, 0.91], [18, 1], [70, 1], [90, 0.95]];
const AGE_HEAD = [[0, 0.27], [1, 0.25], [3, 0.21], [6, 0.18], [12, 0.155], [18, 0.14], [90, 0.14]];

function interp(table, x) {
  if (x <= table[0][0]) { return table[0][1]; }
  for (let i = 1; i < table.length; i++) {
    if (x <= table[i][0]) {
      const a = table[i - 1];
      const b = table[i];
      return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
    }
  }
  return table[table.length - 1][1];
}
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
function f(n) { return Math.round(n * 10) / 10; }

function hairColor(look, age) {
  if (age >= 65) { return '#e6e6e6'; }
  if (age >= 52) { return '#8d8d8d'; }
  return look.hair;
}

// ผมทรงต่างๆ: คืนค่า { back, front } (วาดหลังหัว / ทับหน้าผาก)
function hair(style, cx, cy, r, col) {
  const cap = '<path d="M' + f(cx - r - 0.8) + ' ' + f(cy + r * 0.05) + ' A' + f(r + 0.8) + ' ' + f(r + 0.8) + ' 0 0 1 ' + f(cx + r + 0.8) + ' ' + f(cy + r * 0.05) +
    ' Q' + f(cx) + ' ' + f(cy - r * 0.45) + ' ' + f(cx - r - 0.8) + ' ' + f(cy + r * 0.05) + 'Z" fill="' + col + '"/>';
  const buzz = '<path d="M' + f(cx - r) + ' ' + f(cy - r * 0.2) + ' A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(cx + r) + ' ' + f(cy - r * 0.2) +
    ' Q' + f(cx) + ' ' + f(cy - r * 0.7) + ' ' + f(cx - r) + ' ' + f(cy - r * 0.2) + 'Z" fill="' + col + '"/>';
  let back = '';
  let front = cap;
  if (style === 'buzz') { front = buzz; }
  if (style === 'wavy') {
    front = cap + '<circle cx="' + f(cx - r) + '" cy="' + f(cy - r * 0.15) + '" r="' + f(r * 0.28) + '" fill="' + col + '"/>' +
      '<circle cx="' + f(cx + r) + '" cy="' + f(cy - r * 0.15) + '" r="' + f(r * 0.28) + '" fill="' + col + '"/>' +
      '<circle cx="' + f(cx) + '" cy="' + f(cy - r) + '" r="' + f(r * 0.3) + '" fill="' + col + '"/>';
  }
  if (style === 'long') {
    back = '<rect x="' + f(cx - r - 1.5) + '" y="' + f(cy - r) + '" width="' + f(2 * r + 3) + '" height="' + f(r * 3) + '" rx="' + f(r * 0.9) + '" fill="' + col + '"/>';
  }
  if (style === 'bob') {
    back = '<rect x="' + f(cx - r - 1.5) + '" y="' + f(cy - r) + '" width="' + f(2 * r + 3) + '" height="' + f(r * 2.1) + '" rx="' + f(r * 0.8) + '" fill="' + col + '"/>';
  }
  if (style === 'ponytail') {
    back = '<ellipse cx="' + f(cx + r + r * 0.5) + '" cy="' + f(cy + r * 0.6) + '" rx="' + f(r * 0.38) + '" ry="' + f(r * 0.9) + '" fill="' + col + '"/>';
  }
  return { back: back, front: front };
}

// สร้าง SVG จากค่ารูปลักษณ์ เพศ อายุ สุขภาพ (0-100)
export function figureSVG(look, male, age, health) {
  const GROUND = 152;
  const hf = interp(AGE_HEIGHT, age);
  const H = 140 * hf;
  const d = H * interp(AGE_HEAD, age);
  const r = d / 2;
  const cx = 50;
  const g = clamp((age - 10) / 6, 0, 1);          // ความต่างระหว่างเพศ เริ่มช่วงวัยรุ่น
  const ws = 0.4 + 0.6 * hf;                      // เด็กตัวเล็กแต่ไม่ผอมเกินไป
  const hw = 0.82 + 0.3 * clamp(health, 0, 100) / 100;  // สุขภาพต่ำ = ผอมบาง
  const sh = lerp(34, male ? 40 : 32, g) * ws * hw;
  const wa = lerp(28, male ? 32 : 26, g) * ws * hw;
  const hip = lerp(32, male ? 33 : 38, g) * ws * hw;

  const headTop = GROUND - H;
  const headCy = headTop + r;
  const neckY = headTop + d;
  const rest = H - d;
  const hipY = neckY + rest * 0.46;
  const midY = neckY + rest * 0.24;
  const skin = look.skin;
  const aw = Math.max(2.6, sh * 0.17);
  const lw = hip * 0.45;
  const armEnd = neckY + rest * 0.42;
  const style = age < 2 ? 'buzz' : look.hairStyle;
  const hr = hair(style, cx, headCy, r, hairColor(look, age));
  const pants = '#3a4660';

  let s = '<svg viewBox="0 0 100 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ตัวละคร">';
  s += '<ellipse cx="50" cy="' + GROUND + '" rx="' + f(20 + 10 * hf) + '" ry="3" fill="rgba(0,0,0,0.12)"/>';
  s += hr.back;
  // แขน
  [-1, 1].forEach((k) => {
    s += '<line x1="' + f(cx + k * sh / 2) + '" y1="' + f(neckY + 3) + '" x2="' + f(cx + k * (sh / 2 + aw * 0.4)) + '" y2="' + f(armEnd) +
      '" stroke="' + skin + '" stroke-width="' + f(aw) + '" stroke-linecap="round"/>';
  });
  // ขา
  [-1, 1].forEach((k) => {
    s += '<rect x="' + f(k < 0 ? cx - lw - 0.6 : cx + 0.6) + '" y="' + f(hipY - 2) + '" width="' + f(lw) + '" height="' + f(GROUND - hipY + 2) +
      '" rx="' + f(lw * 0.4) + '" fill="' + pants + '"/>';
  });
  // คอและลำตัว
  s += '<rect x="' + f(cx - d * 0.16) + '" y="' + f(neckY - 3) + '" width="' + f(d * 0.32) + '" height="6" fill="' + skin + '"/>';
  s += '<path d="M' + f(cx - sh / 2) + ' ' + f(neckY + 1) + ' L' + f(cx + sh / 2) + ' ' + f(neckY + 1) + ' L' + f(cx + wa / 2) + ' ' + f(midY) +
    ' L' + f(cx + hip / 2) + ' ' + f(hipY) + ' L' + f(cx - hip / 2) + ' ' + f(hipY) + ' L' + f(cx - wa / 2) + ' ' + f(midY) + 'Z" fill="' + look.shirt +
    '" stroke="' + look.shirt + '" stroke-width="3" stroke-linejoin="round"/>';
  // หัวและหน้า (ใบหน้าเหมือนกันทุกคน)
  s += '<circle cx="' + cx + '" cy="' + f(headCy) + '" r="' + f(r) + '" fill="' + skin + '"/>';
  s += hr.front;
  const ey = headCy + r * 0.12;
  s += '<circle cx="' + f(cx - r * 0.38) + '" cy="' + f(ey) + '" r="' + f(Math.max(0.9, r * 0.1)) + '" fill="#2b2320"/>';
  s += '<circle cx="' + f(cx + r * 0.38) + '" cy="' + f(ey) + '" r="' + f(Math.max(0.9, r * 0.1)) + '" fill="#2b2320"/>';
  s += '<path d="M' + f(cx - r * 0.25) + ' ' + f(headCy + r * 0.5) + ' Q' + cx + ' ' + f(headCy + r * 0.75) + ' ' + f(cx + r * 0.25) + ' ' + f(headCy + r * 0.5) +
    '" fill="none" stroke="#2b2320" stroke-width="1" stroke-linecap="round"/>';
  s += '</svg>';
  return s;
}

export function renderFigure() {
  const health = state.stats.find((x) => x.k === 'health');
  $('figure').innerHTML = figureSVG(state.me.look, state.me.male, state.age, health ? health.v : 70);
}
