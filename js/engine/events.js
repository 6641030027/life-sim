// ระบบเลือกเหตุการณ์ตามช่วงวัยและต้นกำเนิด แล้วสุ่มผลลัพธ์ (ไม่แตะหน้าจอ)
//
// เหตุการณ์ 1 รายการ (ไฟล์ใน data/events/ ช่วงวัยละไฟล์):
//   id       ไม่ซ้ำ (เกิดได้ครั้งเดียวต่อชีวิต)
//   age      [น้อยสุด, มากสุด] ปีที่เกิดได้
//   country  ['ไทย'] เกิดได้เฉพาะตอนที่ตัวละคร "อาศัยอยู่" ในประเทศเหล่านี้ (me.residence ไม่ใช่ประเทศที่เกิด) ไม่ใส่ = ทุกประเทศ
//            ใช้กับวันสำคัญ/ระบบโรงเรียน/สถิติของไทย  เด็กต่างชาติที่ย้ายมาอยู่ไทยจึงเจอ และคนไทยที่ไปเรียนต่างประเทศจะไม่เจอ
//   born     ['ไทย'] เฉพาะผู้ที่ "เกิด" ในประเทศเหล่านี้ (me.country) เช่น เรื่องวัฒนธรรมที่ติดตัวมาจากประเทศที่เกิด
//   family   ['nuclear', ...] เฉพาะต้นกำเนิดเหล่านี้ (ไม่ใส่ = ทุกคนเจอได้)
//   sub      ชนิดย่อยของ care: 'adopted' | 'foster' | 'institution'
//   reason   เหตุผลของครอบครัว (key ใน data/families.js)
//   need     (c) => true/false เงื่อนไขเพิ่ม เช่น มีสัตว์เลี้ยง มีพี่น้อง (c.friends, c.bf, c.male, c.stat('smarts') ใช้ได้)
//   must     true = ถ้าถึงอายุและเงื่อนไขแล้วต้องเกิดก่อนเรื่องอื่น (เช่น วันแรกที่โรงเรียน)
//   free     true = เหตุการณ์ต่อเนื่อง (ภาคต่อของเรื่องก่อนหน้า) ไม่นับโควต้าของปี เรื่องแรกของสายจะนับโควต้าตามปกติ
//            ภาคต่อจะเกิดเพิ่มซ้อนได้ในปีนั้นด้วยโอกาส min(0.9, w/10) เมื่อ need ผ่าน (ปกติ need ตรวจ flag ที่เรื่องแรกตั้งไว้)
//   w        น้ำหนักโอกาสถูกสุ่ม (ตัวเลข หรือ (c) => ตัวเลข)
//   title, desc  ข้อความ หรือ (c) => ข้อความ
//   choices  [{ label, tags?, auto?, outcomes: [{ p, text, fx }] }]
//            auto = ไม่มีทางเลือกจริง (เช่น ทารก) ปุ่มเดียวแล้วสุ่มผล
//            p = น้ำหนักของผลลัพธ์นี้ (ตัวเลข หรือ (c) => ตัวเลข)
//            next = (c) => ฉากต่อไป {title, desc, choices} ของเหตุการณ์เดียวกัน (หลายฉากต่อเนื่อง ดู data/events/love.js)

import { state } from '../state.js?v=e4d2fc4c';
import { clamp } from '../util.js?v=e4d2fc4c';
import { applyFx } from './effects.js?v=e4d2fc4c';

// ผู้ดูแลหลัก = คนที่ใกล้ชิดที่สุดและอยู่ด้วยกัน เรียงตามความน่าจะเป็นที่เลี้ยงทารก
const CARER_ORDER = ['แม่', 'แม่บุญธรรม', 'แม่อุปถัมภ์', 'พี่เลี้ยง', 'ย่า', 'ยาย', 'ป้า', 'พ่อ', 'พ่อบุญธรรม', 'พ่ออุปถัมภ์', 'ปู่', 'ตา', 'ลุง'];

export function buildCtx() {
  const me = state.me;
  const f = me.family;
  const fam = state.rels[0] ? state.rels[0].items : [];
  const petGroup = state.rels.find((g) => g.sec === 'สัตว์เลี้ยง');
  const frGroup = state.rels.find((g) => g.sec === 'เพื่อน');
  const friends = frGroup ? frGroup.items : [];
  let cg = null;
  for (let i = 0; i < CARER_ORDER.length && !cg; i++) {
    cg = fam.find((p) => p.r === CARER_ORDER[i] && !p.note) || null;
  }
  return {
    age: state.age, me: me, country: me.residence || me.country, born: me.country, id: f.id, sub: f.sub, reason: f.reason, form: f.form, warmth: f.warmth, care: f.care,
    fam: fam, sibs: fam.filter((p) => p.r === 'พี่ชาย' || p.r === 'พี่สาว'),
    pet: petGroup ? petGroup.items[0] : null, cg: cg, cgRole: cg ? cg.r : 'ผู้ดูแล',
    preterm: !!me.preterm, flags: state.flags, skills: state.skills,
    elder: fam.find((p) => ['ย่า', 'ยาย', 'ปู่', 'ตา'].indexOf(p.r) >= 0 && !p.note) || null,
    mom: fam.find((p) => p.r === 'แม่' && !p.note) || null,
    male: !!me.male, friends: friends,
    bf: friends.length ? friends.reduce((a, b) => (b.v > a.v ? b : a)) : null,
    stat: (k) => { const s = state.stats.find((x) => x.k === k); return s ? s.v : 0; }
  };
}

// ค่าที่ไล่ตามการดูแล/ความอบอุ่นของบ้าน: ได้ lo เมื่อต่ำ และ hi เมื่อสูง
export function byCare(c, lo, hi) { return lo + (hi - lo) * clamp((c.care - 40) / 50, 0, 1); }
export function byWarmth(c, lo, hi) { return lo + (hi - lo) * clamp((c.warmth - 40) / 40, 0, 1); }

export const txt = (x, c) => (typeof x === 'function' ? x(c) : x);

function eligible(ev, c) {
  if (state.seen[ev.id]) { return false; }
  if (ev.age && (c.age < ev.age[0] || c.age > ev.age[1])) { return false; }
  if (ev.country && ev.country.indexOf(c.country) < 0) { return false; }
  if (ev.born && ev.born.indexOf(c.born) < 0) { return false; }
  if (ev.family && ev.family.indexOf(c.id) < 0) { return false; }
  if (ev.sub && ev.sub.indexOf(c.sub) < 0) { return false; }
  if (ev.reason && ev.reason.indexOf(c.reason) < 0) { return false; }
  if (ev.need && !ev.need(c)) { return false; }
  return true;
}

function drawWeighted(items, getW) {
  let total = 0;
  const ws = items.map((x) => { const w = Math.max(0, getW(x)); total += w; return w; });
  if (total <= 0) { return items[0]; }
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= ws[i];
    if (r <= 0) { return items[i]; }
  }
  return items[items.length - 1];
}

// เลือกเหตุการณ์ของปีนี้ count รายการ: รายการแรกมีโอกาส 65% ที่จะเป็นเรื่องเฉพาะต้นกำเนิดกลุ่มน้อย (ถ้ามี) ที่เหลือสุ่มตามน้ำหนัก
export function rollEvents(list, count) {
  const c = buildCtx();
  const pool0 = list.filter((ev) => eligible(ev, c));
  const out = [];
  // 1) must: เกิดแน่นอน ไม่นับโควต้า ซ้อนได้
  pool0.filter((e) => e.must).forEach((e) => { out.push(e); });
  // 2) โควต้าของปี: เฉพาะเรื่องปกติ (ไม่ must ไม่ free)
  let pool = pool0.filter((e) => !e.must && !e.free);
  for (let i = 0; i < count && pool.length; i++) {
    let src = pool;
    if (i === 0) {
      // เรื่องเฉพาะต้นกำเนิดที่ "เป็นเอกลักษณ์" (ไม่ใช่ครอบครัวเดี่ยว/ขยายที่คนส่วนใหญ่เป็น) ได้สิทธิ์ก่อน
      const special = pool.filter((e) => e.sub || e.reason ||
        (e.family && e.family.indexOf('nuclear') < 0 && e.family.indexOf('extended') < 0));
      if (special.length && Math.random() < 0.65) { src = special; }
    }
    const ev = drawWeighted(src, (e) => txt(e.w === undefined ? 1 : e.w, c));
    out.push(ev);
    pool = pool.filter((e) => e !== ev);
  }
  // 3) ภาคต่อ (free): ไม่นับโควต้า สุ่มซ้อนตามน้ำหนัก
  pool0.filter((e) => e.free && !e.must).forEach((e) => {
    if (Math.random() < Math.min(0.9, txt(e.w === undefined ? 1 : e.w, c) / 10)) { out.push(e); }
  });
  out.forEach((e) => { state.seen[e.id] = true; });
  return out;
}

// สุ่มผลลัพธ์ของตัวเลือกที่กด แล้วลงผลกับสถานะ
export function resolve(choice) {
  const c = buildCtx();
  const o = drawWeighted(choice.outcomes, (x) => txt(x.p, c));
  const text = txt(o.text, c);
  const tags = applyFx(o.fx || {}, c);
  return { text: text, tags: tags, next: o.next ? o.next(buildCtx()) : null };
}
