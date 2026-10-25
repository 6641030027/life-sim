// วัยเด็กเล็ก (ทารก/วัยหัดเดิน): สุ่มว่าเด็กทำอะไรจริงในปีที่ผ่านมา แล้วคืนโบนัสลับเล็กๆ ให้ทักษะ/สถานะ
// ฟังก์ชันล้วน: ไม่แตะหน้าจอ/state รับ ctx แล้วคืนผลให้ผู้เรียกนำไปใช้
// ctx = { stage, age (ปีที่ผ่านไป), warmth, siblings (จำนวนพี่น้อง), genes, selected (จุดเน้นที่เลือก) }

import { ACTIVITIES, RULES, APTITUDE } from '../data/activities.js';

export function hasYearRules(stage) { return !!ACTIVITIES[stage]; }

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
  chosen.forEach((n) => {
    const a = acts[n];
    const f = (0.5 + rnd() * 0.5) * rule.scale;
    Object.keys(a.skills).forEach((id) => {
      let apt = 1;
      if (APTITUDE[id] && ctx.genes) { apt = 0.8 + 0.4 * (ctx.genes[APTITUDE[id]] / 100); }
      skills[id] = (skills[id] || 0) + a.skills[id] * f * apt;
    });
    Object.keys(a.stats).forEach((k) => {
      const v = a.stats[k];
      const d = Math.floor(v) + (rnd() < v - Math.floor(v) ? 1 : 0);
      if (d) { stats[k] = (stats[k] || 0) + d; }
    });
  });
  const wanted = chosen.filter((n) => sel.indexOf(n) >= 0 && m > 1);   // สิ่งที่เด็ก "อยากทำเอง" และได้ทำ
  return { chosen: chosen, wanted: wanted, skills: skills, stats: stats };
}

export function yearText(stage, chosen, wanted) {
  const acts = ACTIVITIES[stage];
  const parts = chosen.map((n) => acts[n].phrase + (wanted.indexOf(n) >= 0 ? ' ตามใจตัวเอง' : ''));
  return 'ตลอดปีที่ผ่านมา ฉัน' + parts.slice(0, -1).join(' ') + (parts.length > 1 ? ' และ' : '') + parts[parts.length - 1];
}
