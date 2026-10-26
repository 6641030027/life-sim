// หน้าความสัมพันธ์ (ซ้อนทับ แบ่งหมวด) และรายละเอียดรายคน

import { $, initial } from '../util.js?v=e4d2fc4c';
import { state } from '../state.js?v=e4d2fc4c';
import { openOverlay, openSheet, toast } from './overlays.js?v=e4d2fc4c';

function relBar(v) {
  const color = v >= 50 ? 'var(--green)' : 'var(--orange)';
  return '<div class="bar"><i style="width:' + v + '%;background:' + color + '"></i></div>';
}

function personDetail(p) {
  const bits = [];
  if (p.job) { bits.push('อาชีพ' + p.job); }
  if (p.age !== undefined) { bits.push('อายุ ' + p.age + ' ปี'); }
  if (p.dead) { bits.push('เสียชีวิตแล้ว'); }
  return bits.join(' · ');
}

function openPerson(p) {
  const body = openSheet(p.n, '');
  const detail = personDetail(p);
  body.innerHTML =
    '<div class="person-head"><div class="avatar">' + initial(p.n) + '</div>' +
    '<div><div class="name">' + p.n + '</div><div class="sub">' + p.r + (detail ? ' · ' + detail : '') + '</div></div></div>' +
    '<div class="rbar" style="display:flex;align-items:center;gap:8px;margin-bottom:14px;color:var(--blue)">ความสัมพันธ์ ' + relBar(p.v) + ' <b>' + p.v + '%</b></div>' +
    '<div class="btn-row"><button class="btn" data-act="1">คุยกัน</button><button class="btn" data-act="1">ใช้เวลาด้วยกัน</button><button class="btn" data-act="1">ให้ของขวัญ</button></div>';
  Array.prototype.forEach.call(body.querySelectorAll('[data-act]'), (b) => {
    b.addEventListener('click', () => { toast('ยังไม่เปิดใช้งาน'); });
  });
}

export function openRelations() {
  const list = $('relList');
  list.innerHTML = '';
  state.rels.forEach((g) => {
    const sec = document.createElement('div');
    sec.className = 'sec';
    sec.textContent = g.sec;
    list.appendChild(sec);
    g.items.forEach((p) => {
      const b = document.createElement('button');
      b.className = 'rel';
      b.innerHTML =
        '<div class="avatar">' + initial(p.n) + '</div>' +
        '<div class="info"><div class="rname">' + p.n + ' <span>(' + p.r + (p.dead ? ' · เสียชีวิตแล้ว' : '') + ')</span></div>' +
        '<div class="rbar">ความสัมพันธ์ ' + relBar(p.v) + '</div></div>' +
        '<i class="ti ti-chevron-right" aria-hidden="true"></i>';
      b.addEventListener('click', () => { openPerson(p); });
      list.appendChild(b);
    });
  });
  list.scrollTop = 0;
  openOverlay('relOverlay');
}
