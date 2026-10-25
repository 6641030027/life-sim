// ช่วงวัย และจุดเน้นของปีที่เลือกได้ในแต่ละช่วงวัย (รูปแบบ: [ชื่อ, ไอคอน])

export const STAGES = [
  { min: 0, name: 'ทารก', icon: 'ti-baby-carriage' },
  { min: 2, name: 'วัยหัดเดิน', icon: 'ti-walk' },
  { min: 5, name: 'วัยเด็ก', icon: 'ti-backpack' },
  { min: 13, name: 'วัยรุ่น', icon: 'ti-school' },
  { min: 18, name: 'ผู้ใหญ่', icon: 'ti-briefcase' }
];

export const FOCUS = {
  'ทารก': [['นอนหลับ', 'ti-moon'], ['กินนม', 'ti-baby-bottle'], ['เล่นกับพ่อแม่', 'ti-heart'], ['สำรวจรอบตัว', 'ti-compass']],
  'วัยหัดเดิน': [['หัดเดินและพูด', 'ti-walk'], ['เล่นของเล่น', 'ti-puzzle'], ['เล่นกับพี่น้อง', 'ti-users'], ['ดูการ์ตูน', 'ti-device-tv']],
  'วัยเด็ก': [['เรียน', 'ti-book'], ['กีฬา', 'ti-ball-football'], ['เพื่อน', 'ti-users'], ['ครอบครัว', 'ti-home'], ['งานอดิเรก', 'ti-palette'], ['เล่นเกม', 'ti-device-gamepad-2']],
  'วัยรุ่น': [['เรียน', 'ti-book'], ['กีฬา', 'ti-ball-football'], ['เพื่อน', 'ti-users'], ['ครอบครัว', 'ti-home'], ['งานพาร์ตไทม์', 'ti-briefcase'], ['ความรัก', 'ti-heart'], ['งานอดิเรก', 'ti-palette']],
  'ผู้ใหญ่': [['งาน', 'ti-briefcase'], ['ครอบครัว', 'ti-home'], ['สุขภาพ', 'ti-heartbeat'], ['เพื่อน', 'ti-users'], ['พัฒนาตัวเอง', 'ti-bulb'], ['พักผ่อน', 'ti-zzz']]
};

export function stageOf(age) {
  let s = STAGES[0];
  for (let i = 0; i < STAGES.length; i++) {
    if (age >= STAGES[i].min) { s = STAGES[i]; }
  }
  return s;
}
