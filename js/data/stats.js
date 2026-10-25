// แถบสถานะ (ค่าเริ่มต้น) ตัวที่ hidden จะโผล่เมื่อปลดล็อก
// state.js จะทำสำเนาไปใช้ ไม่แก้ค่าในไฟล์นี้

export const STAT_DEFS = [
  { k: 'happy', label: 'ความสุข', icon: 'ti-mood-smile', v: 61 },
  { k: 'health', label: 'สุขภาพ', icon: 'ti-heartbeat', v: 82 },
  { k: 'smarts', label: 'สติปัญญา', icon: 'ti-brain', v: 34 },
  { k: 'looks', label: 'หน้าตา', icon: 'ti-sparkles', v: 57 },
  { k: 'social', label: 'สังคม', icon: 'ti-users', v: 68 },
  { k: 'fame', label: 'ชื่อเสียง', icon: 'ti-speakerphone', v: 15, hidden: true }
];
