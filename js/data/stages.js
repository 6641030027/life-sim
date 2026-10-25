// ช่วงวัย และจุดเน้นของปีที่เลือกได้ในแต่ละช่วงวัย (รูปแบบ: [ชื่อ, ไอคอน])

export const STAGES = [
  { min: 0, name: 'ทารก', icon: 'ti-baby-carriage' },
  { min: 2, name: 'วัยหัดเดิน', icon: 'ti-walk' },
  { min: 5, name: 'วัยเด็ก', icon: 'ti-backpack' },
  { min: 13, name: 'วัยรุ่น', icon: 'ti-school' },
  { min: 18, name: 'วัยหนุ่มสาว', icon: 'ti-flame' },
  { min: 30, name: 'ผู้ใหญ่', icon: 'ti-briefcase' },
  { min: 60, name: 'ผู้สูงอายุ', icon: 'ti-armchair' }
];

export const FOCUS = {
  'ทารก': [['นอนหลับ', 'ti-moon'], ['มองหน้าคนรอบตัว', 'ti-eye'], ['อ้อแอ้ส่งเสียง', 'ti-message-circle'], ['ร้องเรียกความสนใจ', 'ti-mood-cry'], ['พลิกตัว/คลาน', 'ti-rotate'], ['หยิบจับและอมของเล่น', 'ti-hand-grab']],
  'วัยหัดเดิน': [['เดิน วิ่ง ปีนป่าย', 'ti-run'], ['พูดและถามทำไม', 'ti-message-circle'], ['เล่นสมมติ', 'ti-wand'], ['ขีดเขียนระบายสี', 'ti-palette'], ['เล่นกับเด็กคนอื่น', 'ti-users'], ['ฟังเพลงและดูการ์ตูน', 'ti-music'], ['ต่อบล็อกและของเล่น', 'ti-puzzle'], ['ทำเอง', 'ti-shirt']],
  'วัยเด็ก': [['เรียน', 'ti-book'], ['กีฬา', 'ti-ball-football'], ['เพื่อน', 'ti-users'], ['ครอบครัว', 'ti-home'], ['งานอดิเรก', 'ti-palette'], ['เล่นเกม', 'ti-device-gamepad-2']],
  'วัยรุ่น': [['เรียน', 'ti-book'], ['กีฬา', 'ti-ball-football'], ['เพื่อน', 'ti-users'], ['ครอบครัว', 'ti-home'], ['งานพาร์ตไทม์', 'ti-briefcase'], ['ความรัก', 'ti-heart'], ['งานอดิเรก', 'ti-palette']],
  'วัยหนุ่มสาว': [['เรียนต่อ/ทำงาน', 'ti-briefcase'], ['เพื่อน', 'ti-users'], ['ความรัก', 'ti-heart'], ['ครอบครัว', 'ti-home'], ['สุขภาพ', 'ti-heartbeat'], ['ค้นหาตัวเอง', 'ti-compass']],
  'ผู้ใหญ่': [['งาน', 'ti-briefcase'], ['ครอบครัว', 'ti-home'], ['สุขภาพ', 'ti-heartbeat'], ['เพื่อน', 'ti-users'], ['พัฒนาตัวเอง', 'ti-bulb'], ['พักผ่อน', 'ti-zzz']],
  'ผู้สูงอายุ': [['สุขภาพ', 'ti-heartbeat'], ['ครอบครัว/ลูกหลาน', 'ti-home'], ['เพื่อนเก่า', 'ti-users'], ['งานอดิเรก', 'ti-palette'], ['ธรรมะ/ทำบุญ', 'ti-lotus'], ['พักผ่อน', 'ti-zzz']]
};

export function stageOf(age) {
  let s = STAGES[0];
  for (let i = 0; i < STAGES.length; i++) {
    if (age >= STAGES[i].min) { s = STAGES[i]; }
  }
  return s;
}
