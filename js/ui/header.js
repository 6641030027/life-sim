// แถบตัวละคร (รูป ชื่อ ช่วงวัย เงิน) และชื่อช่วงวัยบนปุ่มเมนู

import { $, initial } from '../util.js';
import { state } from '../state.js';
import { stageOf } from '../data/stages.js';
import { PLACE } from '../data/names.js';

export function renderHeader() {
  const s = stageOf(state.age);
  $('subline').textContent = s.name + ' · อายุ ' + state.age + ' ปี · ' + PLACE;
  $('stageLabel').textContent = s.name;
  $('stageIcon').className = 'ti ' + s.icon;
}

// ใส่ข้อมูลตัวละครใหม่ลงหน้าจอ (ตอนเริ่มชีวิต)
export function renderCharacter() {
  $('avatar').textContent = initial(state.me.first);
  $('charName').textContent = state.me.name;
  $('money').textContent = '฿0';
  renderHeader();
}
