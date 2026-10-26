// วัยเด็กเล็กถึงวัยเด็ก (ทารก/วัยหัดเดิน/วัยเด็ก): สุ่มว่าเด็กทำอะไรจริงในปีที่ผ่านมา
// แล้วคืนผลต่อทักษะ/สถานะ/ความสัมพันธ์ ฟังก์ชันล้วน: ไม่แตะหน้าจอ/state รับ ctx แล้วคืนผลให้ผู้เรียกนำไปใช้
// ctx = { stage, age (ปีที่ผ่านไป), warmth, siblings, genes, selected (จุดเน้นที่เลือก), smarts (ความฉลาดปัจจุบัน) }
// ทารก/วัยหัดเดิน: ผลเป็นโบนัสลับเล็กๆ   วัยเด็ก (direct): แต้มทักษะจริง × ตัวคูณความฉลาดลับ (0.85-1.25)

import { ACTIVITIES, RULES, APTITUDE, SCHOOL } from '../data/activities.js?v=e4d2fc4c';

export function hasYearRules(stage) { return !!ACTIVITIES[stage]; }

// ตัวคูณการเรียนรู้จากความฉลาดปัจจุบัน (ลับ ผู้เล่นไม่เห็น)
export function smartsMultiplier(smarts) { return 0.85 + 0.4 * Math.max(0, Math.min(100, smarts)) / 100; }

// สุ่มจำนวนเต็มจากแต้มที่มีเศษ (เช่น 0.3 = 30% ได้ +1) รองรับค่าติดลบ
function intOf(v, rnd) {
  const sign = v < 0 ? -1 : 1;
  const a = Math.abs(v);
  return sign * (Math.floor(a) + (rnd() < a - Math.floor(a) ? 1 : 0));
}

function skillGain(id, points, ctx, rule) {
  let m = 1;
  if (rule.direct) { m *= smartsMultiplier(ctx.smarts); }
  const g = APTITUDE[id];
  // ความถนัดจากยีนซ่อน (ยีนฉลาดใช้ผ่านตัวคูณความฉลาดแล้วในวัยเด็ก จึงไม่นับซ้ำ)
  if (g && ctx.genes && !(rule.direct && g === 'smarts')) { m *= 0.8 + 0.4 * (ctx.genes[g] / 100); }
  return points * m;
}

export function rollYear(ctx, rand) {
  const rnd = rand || Math.random;
  const acts = ACTIVITIES[ctx.stage];
  const rule = RULES[ctx.stage];
  const names = Object.keys(acts);
  const count = rule.count[0] + Math.floor(rnd() * (rule.count[1] - rule.count[0] + 1));
  const warmW = 0.6 + (ctx.warmth / 100) * 0.8;
  const sibW = 1 + 0.5 * Math.min(2, ctx.siblings || 0);
  const sel = (ctx.selected || []).filter((n) => acts[n]);
  const m = rule.select[ctx.age] || 1;
  const pool = names.map((n) => {
    let w = 1;
    if (acts[n].warm) { w *= warmW; }
    if (acts[n].sib) { w *= sibW; }
    if (sel.indexOf(n) >= 0) { w *= 1 + (m - 1) / sel.length; }   // เลือกหลายอย่าง = เจือจาง
    return { n: n, w: w };
  });
  const chosen = [];
  for (let k = 0; k < count && pool.length; k++) {
    let total = 0;
    pool.forEach((p) => { total += p.w; });
    let r = rnd() * total;
    let idx = pool.length - 1;
    for (let i = 0; i < pool.length; i++) {
      r -= pool[i].w;
      if (r <= 0) { idx = i; break; }
    }
    chosen.push(pool[idx].n);
    pool.splice(idx, 1);
  }
  const skills = {};
  const stats = {};
  const rel = { family: 0, friends: 0 };
  chosen.forEach((n) => {
    const a = acts[n];
    const f = rule.direct ? 0.8 + rnd() * 0.4 : (0.5 + rnd() * 0.5) * rule.scale;
    Object.keys(a.skills).forEach((id) => { skills[id] = (skills[id] || 0) + skillGain(id, a.skills[id] * f, ctx, rule); });
    Object.keys(a.stats).forEach((k) => {
      const d = intOf(a.stats[k], rnd);
      if (d) { stats[k] = (stats[k] || 0) + d; }
    });
    if (a.rel) {
      Object.keys(a.rel).forEach((who) => {
        const lo = a.rel[who][0];
        const hi = a.rel[who][1];
        rel[who] += lo + Math.floor(rnd() * (hi - lo + 1));
      });
    }
  });
  const wanted = chosen.filter((n) => sel.indexOf(n) >= 0 && m > 1);   // สิ่งที่เด็ก "อยากทำเอง" และได้ทำ
  return { chosen: chosen, wanted: wanted, skills: skills, stats: stats, rel: rel };
}

// โบนัสพื้นฐานจากการไปโรงเรียนในปีนั้น (ไม่ขึ้นกับจุดเน้น)
export function schoolYear(ctx, rand) {
  const rnd = rand || Math.random;
  const rule = { direct: true };
  const skills = {};
  const stats = {};
  Object.keys(SCHOOL.skills).forEach((id) => { skills[id] = skillGain(id, SCHOOL.skills[id] * (0.8 + rnd() * 0.4), ctx, rule); });
  Object.keys(SCHOOL.stats).forEach((k) => { const d = intOf(SCHOOL.stats[k], rnd); if (d) { stats[k] = d; } });
  return { skills: skills, stats: stats };
}

export function yearText(stage, chosen, wanted) {
  const acts = ACTIVITIES[stage];
  const parts = chosen.map((n) => acts[n].phrase + (wanted.indexOf(n) >= 0 ? ' ตามใจตัวเอง' : ''));
  return 'ตลอดปีที่ผ่านมา ฉัน' + parts.slice(0, -1).join(' ') + (parts.length > 1 ? ' และ' : '') + parts[parts.length - 1];
}
