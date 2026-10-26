// ตัวช่วยเขียนเหตุการณ์ที่ใช้ร่วมกันหลายช่วงวัย (วัยเด็ก วัยรุ่น ...)
//   o(p, text, fx)        ผลลัพธ์หนึ่งแบบ   auto(outcomes)  ปุ่มเดียวแล้วสุ่มผล   ch(label, tags, outcomes)  ตัวเลือกหนึ่งอัน
//   G(c)                  ชื่อเรียกผู้ปกครองตามต้นกำเนิด   t('...{G}...')  ข้อความที่แทน {G} ด้วยผู้ปกครอง
//   sk(c, id)             ค่าทักษะ   LV2 = ทักษะขั้น 2 ขึ้นไป (พอมีพื้นฐาน)

export const o = (p, text, fx) => ({ p: p, text: text, fx: fx || {} });
export const auto = (outcomes) => [{ label: 'ดูว่าเกิดอะไรขึ้น', auto: true, outcomes: outcomes }];
export const ch = (label, tags, outcomes) => ({ label: label, tags: tags, outcomes: outcomes });

export const G = (c) => {
  if (c.id === 'single-mom') { return 'แม่'; }
  if (c.id === 'single-dad') { return 'พ่อ'; }
  if (c.id === 'relatives') { return c.cgRole; }
  if (c.id === 'care') {
    if (c.sub === 'adopted') { return 'พ่อแม่บุญธรรม'; }
    if (c.sub === 'foster') { return 'แม่อุปถัมภ์'; }
    return 'พี่เลี้ยง';
  }
  return 'พ่อแม่';
};
export const t = (s) => (c) => s.split('{G}').join(G(c));
export const sk = (c, k) => c.skills[k] || 0;
export const LV2 = 9;
