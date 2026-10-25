// สุ่มครอบครัวต้นกำเนิดตามประเภทใน data/families.js (ฟังก์ชันล้วน ไม่แตะหน้าจอ)
// คืนค่า: { type, surname, section, members, lines }
//   surname  นามสกุลของตัวละคร   members  คนในครอบครัว (สำหรับหน้าความสัมพันธ์และค่าสังคม)
//   lines    เรื่องราวตอนเกิด (อายุ 0) แบบข้อความหลายบรรทัด   noPet ไม่มีสัตว์เลี้ยง (เช่น สถานสงเคราะห์)

import { ri, pick } from '../util.js';
import { MALE, FEMALE, SURNAMES, JOBS, JOBS_ELDER } from '../data/names.js';
import { FAMILY_TYPES } from '../data/families.js';

function weighted(list) {
  let total = 0;
  list.forEach((x) => { total += x.w; });
  let r = Math.random() * total;
  for (let i = 0; i < list.length; i++) {
    r -= list[i].w;
    if (r <= 0) { return list[i]; }
  }
  return list[0];
}

// สร้างบุคคล: role บทบาท, male เพศ, age อายุ, surname นามสกุล, w น้ำหนักสังคม
function person(role, male, age, surname, w, extra) {
  const base = {
    n: pick(male ? MALE : FEMALE) + ' ' + surname,
    r: role,
    v: ri(55, 100),
    w: w,
    age: age,
    job: age >= 62 ? pick(JOBS_ELDER) : (age < 20 ? 'นักเรียน' : (male ? pick(JOBS) : pick(JOBS.concat(['แม่บ้าน']))))
  };
  return Object.assign(base, extra || {});
}

function describe(p) {
  let s = p.r + 'ของฉันคือ ' + p.n;
  if (p.job) { s += ' อาชีพ' + p.job; }
  if (p.age !== undefined) { s += ' (อายุ ' + p.age + ' ปี)'; }
  if (p.note) { s += ' ' + p.note; }
  return s;
}

// พี่น้องที่อายุมากกว่า: chances = [โอกาสไม่มี, โอกาสมี 1 คน] ที่เหลือคือ 2 คน
function rollSiblings(parentAge, surname, chances) {
  const sibs = [];
  const roll = Math.random();
  let count = roll < chances[0] ? 0 : (roll < chances[1] ? 1 : 2);
  const sibMax = Math.min(15, parentAge - 18);
  if (sibMax < 2) { count = 0; }
  for (let i = 0; i < count; i++) {
    const sm = Math.random() < 0.5;
    sibs.push({ n: pick(sm ? MALE : FEMALE) + ' ' + surname, r: sm ? 'พี่ชาย' : 'พี่สาว', v: ri(30, 85), w: 2, age: ri(2, sibMax) });
  }
  return sibs;
}

function sibLines(sibs) {
  if (sibs.length === 0) { return ['ฉันเป็นลูกคนเดียว']; }
  return sibs.map((s) => 'ฉันมี' + s.r + ' ชื่อ ' + s.n + ' (อายุ ' + s.age + ' ปี)');
}

function ageOlder(parentAge, lo, hi) { return Math.min(90, parentAge + ri(lo, hi)); }

export function rollFamily() {
  const type = weighted(FAMILY_TYPES);
  const mySurname = pick(SURNAMES);
  const otherSurname = pick(SURNAMES);
  const members = [];
  const lines = [];
  let section = 'ครอบครัว';
  let surname = mySurname;
  let sibs = [];
  let noPet = false;
  const intro = (t) => pick(t.intros);

  if (type.id === 'nuclear' || type.id === 'extended') {
    const momAge = ri(21, 40);
    const dadAge = Math.max(21, momAge + ri(-2, 8));
    const dad = person('พ่อ', true, dadAge, mySurname, 3);
    const mom = person('แม่', false, momAge, otherSurname, 3);
    members.push(dad, mom);
    lines.push(intro(type), describe(dad), describe(mom));
    if (type.id === 'extended') {
      const paternal = Math.random() < 0.5;
      const gsn = paternal ? mySurname : otherSurname;
      const base = paternal ? dadAge : momAge;
      const both = Math.random() < 0.6;
      const gp = [];
      if (paternal) {
        gp.push(person('ย่า', false, ageOlder(base, 22, 32), gsn, 2));
        if (both) { gp.push(person('ปู่', true, ageOlder(base, 22, 34), gsn, 2)); }
      } else {
        gp.push(person('ยาย', false, ageOlder(base, 22, 32), gsn, 2));
        if (both) { gp.push(person('ตา', true, ageOlder(base, 22, 34), gsn, 2)); }
      }
      if (Math.random() < 0.35) {
        const role = pick(paternal ? ['ลุง', 'ป้า', 'อา'] : ['ลุง', 'ป้า', 'น้า']);
        const male = role === 'ลุง' || role === 'อา' || role === 'น้า';
        gp.push(person(role, male, Math.max(18, base + ri(-8, 8)), gsn, 2));
      }
      gp.forEach((g) => { members.push(g); lines.push(describe(g)); });
    }
    sibs = rollSiblings(momAge, mySurname, [0.4, 0.75]);
  } else if (type.id === 'single-mom') {
    const momAge = ri(18, 38);
    surname = mySurname;
    const mom = person('แม่', false, momAge, mySurname, 3);
    members.push(mom);
    lines.push(intro(type), pick(type.reasons), describe(mom));
    sibs = rollSiblings(momAge, mySurname, [0.75, 0.97]);
  } else if (type.id === 'single-dad') {
    const dadAge = ri(22, 45);
    const dad = person('พ่อ', true, dadAge, mySurname, 3);
    members.push(dad);
    lines.push(intro(type), pick(type.reasons), describe(dad));
    sibs = rollSiblings(dadAge, mySurname, [0.75, 0.97]);
  } else if (type.id === 'relatives') {
    const reason = pick(type.reasons);
    const parentAge = reason.alive === 'mom' ? ri(16, 19) : ri(20, 38);
    const form = pick(['ปู่ย่า', 'ตายาย', 'ลุงป้า']);
    const gsn = form === 'ตายาย' ? otherSurname : mySurname;
    const guardians = [];
    if (form === 'ปู่ย่า') {
      guardians.push(person('ย่า', false, ageOlder(parentAge, 22, 32), gsn, 3));
      if (Math.random() < 0.7) { guardians.push(person('ปู่', true, ageOlder(parentAge, 22, 34), gsn, 3)); }
    } else if (form === 'ตายาย') {
      guardians.push(person('ยาย', false, ageOlder(parentAge, 22, 32), gsn, 3));
      if (Math.random() < 0.7) { guardians.push(person('ตา', true, ageOlder(parentAge, 22, 34), gsn, 3)); }
    } else {
      guardians.push(person('ป้า', false, Math.min(60, parentAge + ri(0, 12)), gsn, 3));
      if (Math.random() < 0.6) { guardians.push(person('ลุง', true, Math.min(62, parentAge + ri(0, 14)), gsn, 3)); }
    }
    lines.push(intro(type), reason.text);
    guardians.forEach((g) => { members.push(g); lines.push(describe(g)); });
    if (reason.alive === 'both') {
      const dad = person('พ่อ', true, parentAge + ri(0, 6), mySurname, 2, { note: 'แต่ไม่ได้อยู่ด้วยกัน' });
      const mom = person('แม่', false, parentAge, otherSurname, 2, { note: 'แต่ไม่ได้อยู่ด้วยกัน' });
      members.push(dad, mom);
      lines.push(describe(dad), describe(mom));
    } else if (reason.alive === 'mom') {
      const mom = person('แม่', false, parentAge, otherSurname, 2, { note: 'แต่ไม่ได้อยู่ด้วยกัน' });
      members.push(mom);
      lines.push(describe(mom));
    }
    sibs = rollSiblings(parentAge, mySurname, [0.8, 0.98]);
  } else {
    const sub = weighted(type.subtypes);
    lines.push(pick(sub.intros), 'ฉันไม่รู้ว่าพ่อแม่แท้ๆ ของฉันเป็นใคร');
    if (sub.id === 'adopted') {
      const momAge = ri(28, 48);
      const mom = person('แม่บุญธรรม', false, momAge, otherSurname, 3);
      const dad = person('พ่อบุญธรรม', true, momAge + ri(-3, 6), mySurname, 3);
      members.push(dad, mom);
      lines.push(describe(dad), describe(mom));
    } else if (sub.id === 'foster') {
      const mom = person('แม่อุปถัมภ์', false, ri(30, 55), mySurname, 3);
      members.push(mom);
      lines.push(describe(mom));
      if (Math.random() < 0.5) {
        const dad = person('พ่ออุปถัมภ์', true, ri(32, 58), mySurname, 3);
        members.push(dad);
        lines.push(describe(dad));
      }
    } else {
      section = 'ผู้ดูแลและเพื่อน';
      noPet = true;
      const nanny = person('พี่เลี้ยง', false, ri(28, 55), mySurname, 3);
      members.push(nanny);
      lines.push(describe(nanny));
      const mates = ri(1, 2);
      for (let i = 0; i < mates; i++) {
        const male = Math.random() < 0.5;
        const m = { n: pick(male ? MALE : FEMALE) + ' ' + pick(SURNAMES), r: 'เพื่อนร่วมห้อง', v: ri(35, 90), w: 2, age: ri(0, 3) };
        members.push(m);
        lines.push('เพื่อนร่วมห้องของฉันคือ ' + m.n + ' (อายุ ' + m.age + ' ปี)');
      }
    }
  }

  sibs.forEach((s) => { members.push(s); });
  if (type.id !== 'care') { sibLines(sibs).forEach((t) => { lines.push(t); }); }
  return { type: type, surname: surname, section: section, members: members, lines: lines, noPet: noPet };
}
