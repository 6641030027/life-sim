// หน้าแต่งตัวละคร: กดที่รูปตัวละครด้านบนเพื่อเปิด
// ลูกศรซ้าย/ขวาของแต่ละส่วนเปลี่ยนชิ้นนั้น มีสวิตช์สลับโหมด "แบบ" / "สี"
// เพิ่มส่วนใหม่ได้โดยเติมแถวใน PARTS (ใช้คลังจาก data/parts/)

import { state } from '../state.js';
import { openSheet } from './overlays.js';
import { renderFigure, figureSVG } from './figure.js';
import { SKINS } from '../data/parts/skin.js';
import { HAIR_STYLES, HAIR_COLORS } from '../data/parts/hair.js';
import { TOPS, TOP_COLORS } from '../data/parts/tops.js';
import { BOTTOMS, BOTTOM_COLORS, SHOE_COLORS } from '../data/parts/bottoms.js';

// แต่ละส่วน: label ชื่อ, styleKey/styles รายการแบบ, colorKey/colors รายการสี (ไม่มี = ปิดโหมดนั้น)
function parts(male) {
  const sex = male ? 'm' : 'f';
  return [
    { label: 'สีผิว', colorKey: 'skin', colors: SKINS.map((x) => x.color) },
    { label: 'ผม', styleKey: 'hair', styles: HAIR_STYLES.filter((h) => h.sex === sex), colorKey: 'hairColor', colors: HAIR_COLORS.map((x) => x.color) },
    { label: 'เสื้อ', styleKey: 'top', styles: TOPS, colorKey: 'topColor', colors: TOP_COLORS },
    { label: 'กางเกง/กระโปรง', styleKey: 'bottom', styles: BOTTOMS.filter((b) => b.sex === 'any' || b.sex === sex), colorKey: 'bottomColor', colors: BOTTOM_COLORS },
    { label: 'รองเท้า', colorKey: 'shoe', colors: SHOE_COLORS }
  ];
}

function health() {
  const h = state.stats.find((x) => x.k === 'health');
  return h ? h.v : 70;
}

export function openEditor() {
  if (!state.me) { return; }
  const look = state.me.look;
  const list = parts(state.me.male);
  let mode = 'style';

  const body = openSheet('แต่งตัวละคร', '<div id="edRoot"></div>');
  const root = body.querySelector('#edRoot');

  function step(p, dir) {
    const items = mode === 'style' ? p.styles : p.colors;
    const key = mode === 'style' ? p.styleKey : p.colorKey;
    if (!items) { return; }
    let i = items.findIndex((x) => (mode === 'style' ? x.id : x) === look[key]);
    if (i < 0) { i = 0; }
    i = (i + dir + items.length) % items.length;
    look[key] = mode === 'style' ? items[i].id : items[i];
    renderFigure();
    draw();
  }

  function draw() {
    let h = '<div class="ed-fig">' + figureSVG(look, state.me.male, state.age, health()) + '</div>';
    h += '<div class="seg" role="group" aria-label="โหมด">' +
      '<button class="seg-btn" data-mode="style" aria-pressed="' + (mode === 'style') + '">แบบ</button>' +
      '<button class="seg-btn" data-mode="color" aria-pressed="' + (mode === 'color') + '">สี</button></div>';
    list.forEach((p, idx) => {
      const items = mode === 'style' ? p.styles : p.colors;
      const off = !items;
      let mid;
      if (off) { mid = '<span class="ed-na">ไม่มี' + (mode === 'style' ? 'ให้เปลี่ยนแบบ' : 'ให้เปลี่ยนสี') + '</span>'; }
      else if (mode === 'style') {
        const cur = items.find((x) => x.id === look[p.styleKey]) || items[0];
        mid = '<span>' + cur.label + '</span>';
      } else {
        mid = '<span class="sw" style="background:' + look[p.colorKey] + '"></span>';
      }
      h += '<div class="ed-row"><button class="ed-arrow" data-i="' + idx + '" data-d="-1" aria-label="ก่อนหน้า"' + (off ? ' disabled' : '') + '><i class="ti ti-chevron-left"></i></button>' +
        '<div class="ed-mid"><b>' + p.label + '</b>' + mid + '</div>' +
        '<button class="ed-arrow" data-i="' + idx + '" data-d="1" aria-label="ถัดไป"' + (off ? ' disabled' : '') + '><i class="ti ti-chevron-right"></i></button></div>';
    });
    if (state.age >= 52) { h += '<p class="ed-hint">ผมเปลี่ยนเป็นสีเทา/ขาวตามวัย จึงยังไม่เห็นสีผมที่เลือกจนกว่าจะอายุน้อยลง</p>'; }
    root.innerHTML = h;
    root.querySelectorAll('.seg-btn').forEach((b) => {
      b.addEventListener('click', () => { mode = b.dataset.mode; draw(); });
    });
    root.querySelectorAll('.ed-arrow').forEach((b) => {
      b.addEventListener('click', () => { step(list[+b.dataset.i], +b.dataset.d); });
    });
  }
  draw();
}
