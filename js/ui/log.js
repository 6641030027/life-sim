// บันทึกชีวิต (ข้อความไล่ตามอายุ)

import { $ } from '../util.js?v=e4d2fc4c';

export function clearLog() {
  $('log').innerHTML = '';
}

export function scrollLog() {
  const el = $('log');
  el.scrollTop = el.scrollHeight;
}

export function addHeading(age) {
  const h = document.createElement('div');
  h.className = 'age-h';
  h.textContent = 'อายุ: ' + age + ' ปี';
  $('log').appendChild(h);
}

export function addLine(text, star) {
  const p = document.createElement('p');
  if (star) {
    const i = document.createElement('i');
    i.className = 'ti ti-star';
    p.appendChild(i);
  }
  p.appendChild(document.createTextNode(text));
  $('log').appendChild(p);
}
