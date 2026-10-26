// เหตุการณ์ความใกล้ชิดของคู่รัก (เฉพาะผู้ใหญ่) แยกไฟล์ต่างหาก ตั้งเงื่อนไขอายุ 18 ปีขึ้นไป ทั้งตัวผู้เล่นและแฟน
// ซ่อนไว้ ยังไม่ import จนกว่าจะทำช่วงวัยหนุ่มสาว (young.js) ให้รวม EVENTS นี้ไปในรายการของช่วงวัยนั้น
//   import { EVENTS as INTIMACY } from './intimacy.js';   แล้วใส่ ...INTIMACY ใน EVENTS ของ young/adult/elder
//   (เป็นภาคต่อ free: ไม่นับโควต้า เกิดซ้อนได้ ตรวจโอกาสทุกปีตราบใดที่ยังเป็นแฟนกัน)
//
// เนื้อหาไม่บรรยายฉากตรงๆ เน้นการตัดสินใจและผลที่ตามมา (การป้องกัน ท้อง โรค ความสัมพันธ์)
//
// ใครเป็นฝ่ายขอ: ทั้งสองคนสุ่มของตัวเองทุกปี (ตัวผู้เล่น และแฟน) ถ้าทั้งคู่ผ่านจะสุ่มว่าใครขอ มี 4 แบบ
//   แฟนชายขอเรา / แฟนหญิงขอเรา / เราขอแฟนชาย / เราขอแฟนหญิง
//   โอกาสต่อปีของผู้ขอ X ต่อ Y = ฐานตามเพศ (ชาย 0.30 หญิง 0.14)
//       x (1 + 0.6*(ความสนิท-50)/100 + 0.5*(หน้าตา Y-50)/100 - 0.6*(สมาร์ท X-50)/100)   จำกัด 2%-70%
//   ความสนิท/หน้าตาของอีกฝ่ายเพิ่มโอกาส  ความสมาร์ทของผู้ขอเพิ่มการชั่งใจ (ลดโอกาส)
//   (ค่าประมาณเพื่อเกมจากแนวคิดที่ผู้ใช้ตั้ง ไม่ใช่สถิติจริง)
//
// ถ้าเราเป็นฝ่ายปฏิเสธ ความสัมพันธ์สะเทือนตามค่าของทั้งสองคน:
//   โอกาสเลิก = 0.30 - 0.25*(สมาร์ทเฉลี่ยสองคน-50)/50 - 0.25*(ความสนิท-50)/50 + 0.15*(หน้าตาอีกฝ่ายต่ำ => 0..1 ของ (60-หน้าตา)/60)   จำกัด 5%-70%
//   คนฉลาดเข้าใจเหตุผลกว่า คนสนิทอภัยง่ายกว่า คนที่ไม่มั่นใจในรูปร่างหน้าตาตัวเองรู้สึกถูกปฏิเสธแรงกว่า
//
// ถ้าตกลง (หรืออีกฝ่ายตกลง) จะมี 3 ทาง: ใส่ถุงยาง / ไม่ป้องกัน / อดทนไม่ทำ
//   แฟนชายมีถุงติดตัวด้วยโอกาสประมาณ 55% ส่วนตัวละครผู้เล่นมีถุงได้ก็ต่อเมื่อมีในกระเป๋า (state.flags.condom ซื้อจากร้านค้าในอนาคต)
//   ไม่มีถุงให้ใช้ ตัวเลือกใส่ถุงจะไม่โผล่ ต้องเลือกระหว่างไม่ป้องกันกับอดทน (จำลองสถานการณ์พ่อแม่วัยใสในชีวิตจริง)
//   โอกาสตั้งครรภ์ (เฉพาะคู่ชาย-หญิง) ต่อช่วงเหตุการณ์: ไม่ป้องกัน 15% / ใส่ถุง 2%    โอกาสติดเชื้อทางเพศสัมพันธ์: ไม่ป้องกัน 10% / ใส่ถุง 1%
//   (ค่าประมาณเพื่อเกม เป็นภาพแทนการทำต่อเนื่องหลายครั้งในช่วงนั้น ไม่ใช่ความเสี่ยงต่อครั้ง)

import { state } from '../../state.js';
import { clamp } from '../../util.js';
import { partner } from '../../engine/romance.js';
import { attract } from './love.js';
import { o, ch } from './_kit.js';

const BASE = { m: 0.30, f: 0.14 };

const rel = () => { const p = state.flags.partner; return p && p.rel ? p.rel : null; };

function pAsk(askerGender, askerSt, targetSt, close) {
  const f = 1 + 0.6 * (close - 50) / 100 + 0.5 * (targetSt.looks - 50) / 100 - 0.6 * (askerSt.smarts - 50) / 100;
  return clamp(BASE[askerGender] * f, 0.02, 0.7);
}
const meSt = (c) => ({ looks: c.stat('looks'), smarts: c.stat('smarts') });

// โอกาสที่ปีนี้จะมีคนขอ (ผ่านอย่างน้อยหนึ่งฝ่าย)
export function chanceThisYear(c) {
  const p = partner();
  const r = rel();
  if (!r) { return 0; }
  const a = pAsk(c.male ? 'm' : 'f', meSt(c), p.st, r.v);
  const b = pAsk(p.male ? 'm' : 'f', p.st, meSt(c), r.v);
  return 1 - (1 - a) * (1 - b);
}

// ตัดสินใจครั้งเดียวต่อเหตุการณ์ว่าใครขอ (เก็บไว้ใน flags ชั่วคราว)
function whoAsks(c) {
  if (state.flags.askBy) { return state.flags.askBy; }
  const p = partner(), r = rel();
  const a = pAsk(c.male ? 'm' : 'f', meSt(c), p.st, r.v);
  const b = pAsk(p.male ? 'm' : 'f', p.st, meSt(c), r.v);
  state.flags.askBy = Math.random() < a / (a + b) ? 'me' : 'partner';
  return state.flags.askBy;
}

const pn = () => partner().n;
const pRel = () => partner().male ? 'แฟนชาย' : 'แฟนหญิง';
const canPreg = (c) => partner().male !== !!c.male; // ชาย-หญิงเท่านั้น

// ถุงยาง: แฟนชายมีด้วยโอกาสเดียวต่อเหตุการณ์ ส่วนเราต้องมีในกระเป๋า
function haveCondom(c) {
  if (state.flags.condomChecked !== undefined) { return state.flags.condomChecked; }
  const own = (state.flags.condom || 0) > 0;
  const hers = partner().male && Math.random() < 0.55;
  state.flags.condomChecked = own || hers;
  state.flags.condomOwn = own;
  return state.flags.condomChecked;
}

const done = { flag: { askBy: null, condomChecked: undefined, condomOwn: undefined } };

function resultStage(c, protectedUse) {
  const preg = canPreg(c) && Math.random() < (protectedUse ? 0.02 : 0.15);
  const sti = Math.random() < (protectedUse ? 0.01 : 0.10);
  return preg ? 'preg' : (sti ? 'sti' : 'ok');
}

const pregStage = (c) => ({
  title: 'ความใกล้ชิด',
  desc: c.male ? pn() + ' บอกว่าประจำเดือนไม่มาและตรวจครรภ์ขึ้นสองขีด เราสองคนนั่งนิ่งอยู่ในห้องนาน' : 'ประจำเดือนฉันไม่มา ตรวจครรภ์ขึ้นสองขีด ใจเต้นแรงจนมือสั่น',
  choices: [
    ch('คุยกันและวางแผนรับมือร่วมกัน', [['รับผิดชอบ', 'good']], [
      o(100, 'เราทั้งคู่ตัดสินใจนั่งคุยกับผู้ใหญ่ที่ไว้ใจและไปพบแพทย์ตามนัดเพื่อดูแลครรภ์และวางแผนรับมือด้วยกัน', { stats: { happy: -2 }, flag: { pregnancy: 1 }, skills: { empathy: 0.6 } })
    ]),
    ch('ไปคลินิกให้คำปรึกษาเพื่อรู้ทางเลือก', [['ได้ข้อมูล', 'good']], [
      o(100, 'เราไปรับคำปรึกษาจากคลินิกที่ให้ข้อมูลครบทุกทางเลือกตามกฎหมายและสิทธิ์ ฉันรู้สึกว่าไม่ต้องตัดสินใจอยู่คนเดียว', { stats: { happy: -3 }, flag: { pregnancyCounsel: 1 } })
    ]),
    ch('เก็บเงียบไว้ก่อน', [['ไม่ปรึกษาใคร', 'bad']], [
      o(100, 'ฉันบอกตัวเองว่าอาจไม่เป็นอะไรและไม่เล่าใคร ผ่านไปหลายสัปดาห์ความกังวลกลืนกินทุกอย่าง จนต้องหาทางออกในที่สุด', { stats: { happy: -6, health: -2 }, flag: { pregnancy: 1 } })
    ])
  ]
});

const stiStage = (c) => ({
  title: 'ความใกล้ชิด',
  desc: 'ไม่กี่สัปดาห์ต่อมาฉันมีอาการผิดปกติจนต้องไปหาหมอ ผลตรวจพบการติดเชื้อทางเพศสัมพันธ์ที่รักษาได้เมื่อรู้เร็ว',
  choices: [
    ch('บอกแฟนและรักษาไปพร้อมกัน', [['ซื่อสัตย์', 'good']], [
      o(100, 'เราทั้งคู่ตรวจและรักษาตามที่หมอสั่ง บทสนทนานั้นกระอักกระอ่วนแต่ทำให้เรารู้ว่าเชื่อใจกันได้', { stats: { health: -2, happy: -2 }, flag: { sti: 1 } })
    ]),
    ch('รักษาเงียบๆ ไม่บอกใคร', [['เสี่ยงแพร่', 'bad']], [
      o(100, 'ฉันกินยาและเลี่ยงที่จะอธิบายเหตุผลกับแฟน ความลับนั้นทำให้เรากระอักกระอ่วนต่อกันอีกหลายเดือน', { stats: { health: -3, happy: -4 }, flag: { sti: 1 } })
    ])
  ]
});

const nextOf = (c, use) => () => {
  const r = resultStage(c, use);
  return r === 'preg' ? pregStage(c) : (r === 'sti' ? stiStage(c) : null);
};

// ฉากเลือกวิธีป้องกัน
function protectStage(c) {
  const have = haveCondom(c);
  const who = state.flags.condomOwn ? 'ที่ฉันเตรียมไว้' : 'ที่' + pn() + 'พกมา';
  const list = [];
  if (have) {
    list.push(ch('ใส่ถุงยางอนามัย', [['ป้องกัน', 'good']], [
      o(100, 'ฉันกับ' + pn() + 'ใช้ถุงยางอนามัย' + who + ' ทั้งคู่ตัวเกร็งน้อยลงเมื่อรู้ว่าปลอดภัย คืนนั้นจบลงด้วยรอยยิ้ม', { stats: { happy: 3 }, spend: state.flags.condomOwn ? { condom: 1 } : {}, ...done }, nextOf(c, true))
    ]));
  }
  list.push(ch('ไม่ป้องกัน', [['เสี่ยงท้อง/ติดเชื้อ', 'bad']], [
    o(100, 'เราเลือกไม่ป้องกันเพราะ' + (have ? 'ไม่อยากเสียบรรยากาศ' : 'ไม่มีถุงเลยสักชิ้น') + ' แล้วค่อยกังวลทีหลัง', { stats: { happy: 1 }, ...done }, nextOf(c, false))
  ]));
  list.push(ch('อดทน ยังไม่ทำ', [['ปลอดภัย', 'good']], [
    o(100, (have ? 'ถึงจะมีถุงก็ตาม' : 'เพราะไม่มีอุปกรณ์ป้องกัน') + ' ฉันบอก' + pn() + 'ว่าขอรอให้พร้อมกว่านี้ เขาเงียบไปครู่แล้วพยักหน้า เรากอดกันและจบคืนนั้นด้วยการคุยกันนานกว่าเดิม', { stats: { happy: 1 }, skills: { speaking: 0.5 }, ...done })
  ]));
  return { title: 'ความใกล้ชิด', desc: have ? 'เรากำลังจะไปถึงจุดที่ต้องตัดสินใจ ทั้งคู่ต้องเลือกว่าจะป้องกันอย่างไร' : 'เรากำลังจะไปถึงจุดที่ต้องตัดสินใจ แต่ไม่มีใครมีถุงยางอนามัยติดตัวเลย', choices: list };
}

// ผลของการปฏิเสธต่อความสัมพันธ์ (สุ่มจากค่าของสองคน)
function declineBreakChance(c) {
  const p = partner(), r = rel();
  const smartAvg = (c.stat('smarts') + p.st.smarts) / 2;
  const other = p.st.looks; // คนที่ถูกปฏิเสธ (กรณีเราปฏิเสธเขา) ความมั่นใจในหน้าตา
  return clamp(0.30 - 0.25 * (smartAvg - 50) / 50 - 0.25 * (r.v - 50) / 50 + 0.15 * clamp((60 - other) / 60, 0, 1), 0.05, 0.7);
}
const declineOutcomes = (c, textKeep, textBreak) => [
  o((cc) => (1 - declineBreakChance(cc)) * 100, textKeep, { stats: { happy: 0 }, rel: {}, ...done }),
  o((cc) => declineBreakChance(cc) * 100, textBreak, { stats: { happy: -4 }, love: 'end', flag: { dating: 0, askBy: null, condomChecked: undefined, condomOwn: undefined } })
];

export const EVENTS = [
  {
    id: 'adult-intimacy', free: true, age: [13, 99],
    need: (c) => {
      const p = state.flags.partner;
      return !!(p && p.rel && state.flags.dating && (p.age === undefined || p.age >= 13));
    },
    w: (c) => chanceThisYear(c) * 10,   // free: โอกาส = w/10
    title: 'ความใกล้ชิด',
    desc: (c) => {
      const by = whoAsks(c);
      return by === 'partner'
        ? pn() + ' (' + pRel() + ') เอ่ยขึ้นมาเบาๆ ว่าอยากใกล้ชิดกันมากกว่าเดิม ' + (partner().male ? 'เขา' : 'เธอ') + 'มองฉันรอคำตอบ'
        : 'ช่วงนี้ฉันรู้สึกอยากใกล้ชิด' + pn() + 'มากขึ้นกว่าเดิม และกำลังตัดสินใจว่าจะพูดออกไปดีไหม';
    },
    choices: [
      ch('ตอบรับ / ขอ', [['ตัดสินใจ', 'warn']], [
        // ถ้าเราเป็นฝ่ายขอ อีกฝ่ายต้องตอบรับตามสถานะ (สูตรเดียวกับเรื่องความรัก)
        o((c) => (state.flags.askBy === 'me' ? Math.min(0.9, Math.max(0.15, 0.5 + (attract({ looks: c.stat('looks'), social: c.stat('social'), smarts: c.stat('smarts'), happy: c.stat('happy'), health: c.stat('health') }) - attract(partner().st)) / 50 + (rel().v - 50) / 200)) * 100 : 100),
          'ตกลง บรรยากาศระหว่างเราเปลี่ยนไป', { ...done }, (c) => protectStage(c)),
        o((c) => (state.flags.askBy === 'me' ? 100 - Math.min(0.9, Math.max(0.15, 0.5 + (attract({ looks: c.stat('looks'), social: c.stat('social'), smarts: c.stat('smarts'), happy: c.stat('happy'), health: c.stat('health') }) - attract(partner().st)) / 50 + (rel().v - 50) / 200)) * 100 : 0),
          pn() + 'ขอเวลาก่อน และเราไม่พูดถึงเรื่องนี้อีกพักใหญ่ ฉันเข้าใจแต่ก็เขินอายอยู่ลึกๆ', { stats: { happy: -2 }, ...done })
      ]),
      ch('ปฏิเสธ / ไม่ขอ', [['ถนอมน้ำใจ', 'good']], declineOutcomes(
        null,
        'ฉันอธิบายตรงๆ ว่ายังไม่พร้อม ' + 'อีกฝ่ายเงียบไปครู่แล้วเข้าใจ เรายังคบกันต่อและความไว้ใจกันเพิ่มขึ้น',
        'การปฏิเสธทำให้บรรยากาศเปลี่ยนไป เราสองคนห่างกันและจบลงที่การแยกทางกันด้วยดี'
      ))
    ]
  }
];
