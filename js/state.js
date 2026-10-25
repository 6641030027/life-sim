// สถานะเกมที่เปลี่ยนแปลงระหว่างเล่น (ที่เดียว ทุกโมดูลอ่าน/เขียนจากที่นี่)

import { STAT_DEFS } from './data/stats.js';

export const state = {
  age: 0,
  focus: [],            // จุดเน้นของปีที่เลือกอยู่
  infantNote: false,    // ข้อความหยอกช่วงทารก แสดงครั้งเดียว
  toddlerNote: false,   // ข้อความช่วงวัยหัดเดิน (เริ่มมีความอยากเอง) แสดงครั้งเดียว
  currentEvent: null,
  me: null,             // ตัวละครของเรา
  rels: [],             // ความสัมพันธ์แบ่งหมวด [{ sec, items: [...] }]
  skills: {},           // ค่าทักษะ { id: 0-100 } เริ่มที่ 0 (โบนัสลับสะสมเป็นเศษทศนิยมก่อนแสดงเป็นขั้น)
  stats: STAT_DEFS.map((s) => Object.assign({}, s))
};
