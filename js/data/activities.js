// สิ่งที่เด็กทำจริงในแต่ละปีของวัยเด็กเล็ก และผลลับเล็กๆ น้อยๆ ต่อทักษะ/สถานะ
// เกมสุ่มว่าเด็กทำอะไรจริงแต่ละปี (ถ่วงน้ำหนักตามครอบครัว) การกดเลือกจุดเน้นเพิ่มโอกาสตามอายุ (RULES.select)
// phrase = ข้อความในบันทึก  skills = { id ทักษะ: คะแนน }  stats = { รหัสสถานะ: คะแนน (เศษ = โอกาสได้ +1) }
// warm: true = ทำบ่อยขึ้นในบ้านที่อบอุ่น  sib: true = ทำบ่อยขึ้นถ้ามีพี่น้อง
// ชื่อ key ต้องตรงกับชื่อจุดเน้นใน data/stages.js

export const ACTIVITIES = {
  'ทารก': {
    'นอนหลับ': { phrase: 'นอนหลับเป็นส่วนใหญ่ของวัน', skills: {}, stats: { health: 1 } },
    'มองหน้าคนรอบตัว': { phrase: 'จ้องหน้าคนรอบตัวไม่วางตา', warm: true, skills: { social: 0.7, curiosity: 0.4, empathy: 0.3 }, stats: {} },
    'อ้อแอ้ส่งเสียง': { phrase: 'เริ่มอ้อแอ้ส่งเสียงโต้ตอบ', warm: true, skills: { thai: 0.8, english: 0.2, speaking: 0.3 }, stats: {} },
    'ร้องเรียกความสนใจ': { phrase: 'ร้องเรียกความสนใจทุกครั้งที่หิวหรืออยากให้อุ้ม', skills: { social: 0.4, speaking: 0.2 }, stats: {} },
    'พลิกตัว/คลาน': { phrase: 'หัดพลิกตัวและคลาน', skills: { motor: 0.9, football: 0.2, swim: 0.2 }, stats: {} },
    'หยิบจับและอมของเล่น': { phrase: 'คว้าของเล่นมาอมและสำรวจ', skills: { craft: 0.5, draw: 0.3, curiosity: 0.5, guitar: 0.2 }, stats: {} }
  },
  'วัยหัดเดิน': {
    'เดิน วิ่ง ปีนป่าย': { phrase: 'วิ่งเล่นและปีนป่ายไปทั่วบ้าน', skills: { motor: 1.0, football: 0.4, swim: 0.2 }, stats: { health: 0.3 } },
    'พูดและถามทำไม': { phrase: 'พูดเป็นประโยคและถามว่า "ทำไม" ไม่หยุด', warm: true, skills: { thai: 1.0, curiosity: 0.6, speaking: 0.4, english: 0.2 }, stats: {} },
    'เล่นสมมติ': { phrase: 'เล่นสมมติเป็นพ่อครัวและหมอตามที่เห็นผู้ใหญ่ทำ', skills: { empathy: 0.6, cook: 0.4, social: 0.4 }, stats: {} },
    'ขีดเขียนระบายสี': { phrase: 'คว้าสีเทียนขีดเขียนไปทั่ว', skills: { draw: 1.0, craft: 0.5, motor: 0.3 }, stats: {} },
    'เล่นกับเด็กคนอื่น': { phrase: 'ผลัดกันเล่นกับเด็กคนอื่นและเริ่มรู้จักปลอบเพื่อน', sib: true, skills: { social: 1.0, empathy: 0.6 }, stats: { happy: 0.3 } },
    'ฟังเพลงและดูการ์ตูน': { phrase: 'ท่องเพลงและเลียนเสียงจากการ์ตูน', skills: { thai: 0.5, english: 0.3, guitar: 0.15 }, stats: {} },
    'ต่อบล็อกและของเล่น': { phrase: 'ต่อบล็อกและซ้อนของเล่นสูงขึ้นเรื่อยๆ', skills: { curiosity: 0.8, craft: 0.5 }, stats: {} },
    'ทำเอง': { phrase: 'ยืนกรานจะกินเองและใส่เสื้อเอง', skills: { motor: 0.5, cook: 0.3, craft: 0.3 }, stats: {} }
  },
  // วัยเด็ก: แต้มทักษะจริง (ไม่ใช่โบนัสลับ) stats เป็นแต้มสถานะ (เศษ = โอกาส, ลบได้)
  // rel = เพิ่มค่าความสัมพันธ์ { family | friends: [น้อยสุด, มากสุด] }
  'วัยเด็ก': {
    'ตั้งใจเรียน': { phrase: 'ตั้งใจเรียนและทำการบ้านทุกวัน', skills: { thai: 2.5, english: 1.5, computer: 1.0, curiosity: 1.0 }, stats: { smarts: 1.5, happy: -0.3 } },
    'อ่านหนังสือ': { phrase: 'อ่านหนังสือทุกวันจนติดนิสัย', skills: { thai: 2.0, english: 1.0, curiosity: 1.5, speaking: 0.5 }, stats: { smarts: 1.2 } },
    'เล่นกีฬา': { phrase: 'เล่นกีฬากับเพื่อนและปั่นจักรยานทุกเย็น', skills: { motor: 2.5, football: 2.0, swim: 1.5 }, stats: { health: 0.8, happy: 0.2 } },
    'เล่นกับเพื่อน': { phrase: 'เล่นกับเพื่อนๆ จนค่ำ', skills: { social: 3.0, empathy: 1.5 }, stats: { happy: 0.6 }, rel: { friends: [2, 6] } },
    'ช่วยงานบ้านและทำอาหาร': { phrase: 'ช่วยงานบ้านและหัดทำอาหาร', skills: { cook: 2.5, craft: 1.0, empathy: 0.5 }, stats: {}, rel: { family: [1, 3] } },
    'วาดรูปและงานศิลปะ': { phrase: 'วาดรูปและทำงานประดิษฐ์เป็นประจำ', skills: { draw: 3.0, craft: 1.5 }, stats: {} },
    'เรียนดนตรี': { phrase: 'ซ้อมดนตรีและร้องเพลงทุกสัปดาห์', skills: { guitar: 3.0, curiosity: 0.3 }, stats: {} },
    'เล่นเกมและดูจอ': { phrase: 'เล่นเกมและดูคลิปเป็นชั่วโมงๆ', skills: { computer: 2.0 }, stats: { happy: 0.8, health: -0.4 } },
    'ใช้เวลากับครอบครัว': { phrase: 'ใช้เวลากับครอบครัว กินข้าวและไปเที่ยวด้วยกัน', skills: { empathy: 1.0, social: 0.5 }, stats: { happy: 0.6 }, rel: { family: [2, 5] } }
  }
};

// การไปโรงเรียน: ได้โบนัสพื้นฐานฟรีทุกปีที่เรียน (การศึกษาภาคบังคับเริ่ม 6 ขวบ) ไม่ขึ้นกับจุดเน้น
export const SCHOOL = {
  minAge: 6,
  skills: { thai: 1.5, english: 0.8, computer: 0.3, curiosity: 0.8, speaking: 0.3 },
  stats: { smarts: 1.0 }
};

// กติกาต่อช่วงวัย: count = กิจกรรมที่เกิดต่อปี [น้อยสุด, มากสุด]  scale = ตัวคูณขนาดโบนัส
// select = ตัวคูณน้ำหนักของสิ่งที่เลือก ตามอายุปีที่ผ่านไป (เด็กยิ่งโตยิ่งควบคุมตัวเองได้ แต่ไม่ถึงกับเลือกแล้วได้เลย)
export const RULES = {
  'ทารก': { count: [2, 3], scale: 0.5, select: {} },
  'วัยหัดเดิน': { count: [3, 3], scale: 0.45, select: { 2: 1.3, 3: 1.7, 4: 2.2 } },
  // direct = แต้มทักษะจริงที่เห็นได้ (คูณด้วยตัวคูณความฉลาดลับ 0.85-1.25) เด็กยิ่งโตยิ่งคุมตัวเองได้
  'วัยเด็ก': { count: [4, 4], scale: 1, direct: true, select: { 5: 2.5, 6: 2.5, 7: 2.5, 8: 3.2, 9: 3.2, 10: 3.2, 11: 4, 12: 4 } }
};

// ทักษะที่ได้รับผลจากความถนัดตามยีนซ่อน: ทักษะ -> ยีน (0.8-1.2 เท่า)
export const APTITUDE = { thai: 'smarts', english: 'smarts', curiosity: 'smarts', speaking: 'smarts', motor: 'health' };
