// แถบตัวละคร (รูป ชื่อ ช่วงวัย เงิน) และชื่อช่วงวัยบนปุ่มเมนู

import { $ } from '../util.js?v=e4d2fc4c';
import { renderFigure } from './figure.js?v=e4d2fc4c';
import { state } from '../state.js?v=e4d2fc4c';
import { stageOf } from '../data/stages.js?v=e4d2fc4c';

export function renderHeader() {
  const s = stageOf(state.age);
  $('subline').textContent = s.name + ' · อายุ ' + state.age + ' ปี · ' + (state.me.residence || state.me.country);
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
