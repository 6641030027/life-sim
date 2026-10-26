// คนที่ชอบ/แฟนของผู้เล่น: สร้างตัวละคร จดไว้ใน state.flags.partner และย้ายเข้า-ออกหมวด "แฟน" ในหน้าความสัมพันธ์ (ไม่แตะหน้าจอ)
//
// คนที่ชอบมี 50% ที่เป็นเพื่อนที่รู้จักอยู่แล้วในรายชื่อ (ถ้ามี) ความสนิท (v) ของเพื่อนคนนั้นจะเพิ่มโอกาสสำเร็จ (ดู love.js)

import { state } from '../state.js';
import { MALE, FEMALE, SURNAMES } from '../data/names.js';
import { rn, ri, clamp, pick } from '../util.js';

const isMale = (full) => MALE.indexOf(String(full).split(' ')[0]) >= 0;

export const STAT_KEYS = ['looks', 'social', 'smarts', 'happy', 'health'];

const section = (name) => state.rels.find((g) => g.sec === name);
const drop = (g, p) => { if (g) { g.items = g.items.filter((x) => x !== p); } };

export function partner() {
  let p = state.flags.partner;
  if (p) { return p; }
  const st = {};
  STAT_KEYS.forEach((k) => { st[k] = clamp(Math.round(rn(55, 14)), 5, 98); });
  const fr = section('เพื่อน');
  const pool = fr ? fr.items.filter((x) => !x.dead) : [];
  if (pool.length && Math.random() < 0.5) {
    const f = pick(pool);
    p = { n: f.n.split(' ')[0], full: f.n, st: st, friend: f, age: f.age, male: isMale(f.n) };
  } else {
    const male = Math.random() < 0.5;
    const n = pick(male ? MALE : FEMALE);
    p = { n: n, full: n + ' ' + pick(SURNAMES), st: st, friend: null, age: state.age + ri(-1, 1), male: male };
  }
  state.flags.partner = p;
  return p;
}

// เริ่มคบกัน: ย้ายเข้าหมวด "แฟน"
export function startDating() {
  const p = partner();
  let g = section('แฟน');
  if (!g) {
    g = { sec: 'แฟน', items: [] };
    state.rels.splice(Math.min(2, state.rels.length), 0, g);
  }
  if (p.friend) { drop(section('เพื่อน'), p.friend); p.friend.r = 'แฟน'; p.friend.v = clamp(p.friend.v + 15, 0, 100); p.friend.w = 3; p.rel = p.friend; } else {
    p.rel = { n: p.full, r: 'แฟน', v: 70, w: 3, age: p.age };
  }
  g.items.push(p.rel);
}

// เลิกกัน: ออกจากหมวด "แฟน" กลับไปอยู่ในเพื่อนเป็นแฟนเก่า (ความสนิทลดลง)
export function endDating() {
  const p = state.flags.partner;
  if (!p || !p.rel) { return; }
  drop(section('แฟน'), p.rel);
  p.rel.r = 'แฟนเก่า';
  p.rel.v = clamp(Math.round(p.rel.v * 0.45), 0, 100);
  p.rel.w = 1;
  const fr = section('เพื่อน');
  if (fr) { fr.items.push(p.rel); }
  p.rel = null;
  delete state.flags.partner;
}
