// ทักษะแบ่งตามหมวด ค่าทักษะของตัวละครเก็บใน state.skills ({ id: 0-100 } เริ่มที่ 0 ทุกตัว)
// เติมทักษะใหม่ได้โดยเพิ่มแถวในหมวดที่เหมาะสม
export const SKILL_CATEGORIES = [
  { id: 'language', name: 'ภาษาและการสื่อสาร', skills: [
    { id: 'thai', name: 'ภาษาไทย' }, { id: 'english', name: 'ภาษาอังกฤษ' }, { id: 'speaking', name: 'พูดในที่สาธารณะ' }] },
  { id: 'body', name: 'ร่างกายและกีฬา', skills: [
    { id: 'motor', name: 'ความคล่องแคล่ว' }, { id: 'swim', name: 'ว่ายน้ำ' }, { id: 'football', name: 'ฟุตบอล' }] },
  { id: 'social', name: 'สังคม', skills: [
    { id: 'social', name: 'การเข้าสังคม' }, { id: 'empathy', name: 'ความเข้าอกเข้าใจ' }] },
  { id: 'mind', name: 'ความคิดและวิชาการ', skills: [
    { id: 'curiosity', name: 'การสังเกตและช่างสงสัย' }, { id: 'computer', name: 'คอมพิวเตอร์' }] },
  { id: 'art', name: 'ศิลปะและฝีมือ', skills: [
    { id: 'draw', name: 'วาดรูป' }, { id: 'guitar', name: 'เล่นกีตาร์' }, { id: 'craft', name: 'งานฝีมือ' }, { id: 'cook', name: 'ทำอาหาร' }] }
];

// ระดับความชำนาญ 6 ขั้น แบ่งเป็น 3 กลุ่ม (ต้น/กลาง/สูง) กลุ่มละ 2 ขั้น ตามกรอบ CEFR และ Dreyfus
// min = ค่าเริ่มต้นของขั้น (0-100) จุดตัดอิงชั่วโมงฝึกสะสมของ CEFR (ประมาณ 9/18/34/50/68 ของทั้งหมด)
// ขั้นสูงใช้เวลาฝึกนานกว่าขั้นต้นหลายเท่า ค่า 0 = ยังไม่เคยฝึก
export const SKILL_LEVELS = [
  { n: 1, min: 1,  name: 'มือใหม่',      tier: 'ต้น' },
  { n: 2, min: 9,  name: 'พอมีพื้นฐาน',  tier: 'ต้น' },
  { n: 3, min: 18, name: 'ใช้งานได้',     tier: 'กลาง' },
  { n: 4, min: 34, name: 'คล่อง',         tier: 'กลาง' },
  { n: 5, min: 50, name: 'ชำนาญ',         tier: 'สูง' },
  { n: 6, min: 68, name: 'เชี่ยวชาญ',     tier: 'สูง' }
];
export const SKILL_LEVEL_0 = { n: 0, min: 0, name: 'ยังไม่เคยฝึก', tier: '' };
