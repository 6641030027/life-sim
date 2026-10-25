// แถบตัวละคร (รูป ชื่อ ช่วงวัย เงิน) และชื่อช่วงวัยบนปุ่มเมนู

import { $ } from '../util.js';
import { renderFigure } from './figure.js';
import { state } from '../state.js';
import { stageOf } from '../data/stages.js';

export function renderHeader() {
  const s = stageOf(state.age);
  $('subline').textContent = s.name + ' · อายุ ' + state.age + ' ปี · ' + state.me.country;
  $('stageLabel').textContent = s.name;
  $('stageIcon').className = 'ti ' + s.icon;
  renderFigure();
}

// ใส่ข้อมูลตัวละครใหม่ลงหน้าจอ (ตอนเริ่มชีวิต)
export function renderCharacter() {
  $('charName').textContent = state.me.name;
  const gi = $('genderIcon');
  gi.textContent = state.me.male ? '♂' : '♀';
  gi.className = 'gender ' + (state.me.male ? 'male' : 'female');
  gi.setAttribute('aria-label', state.me.male ? 'ชาย' : 'หญิง');
  $('money').textContent = '฿0';
  renderHeader();
}
