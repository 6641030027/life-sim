// คลังเสื้อ: แขน (short สั้น / long ยาว / none แขนกุด) และลาย (deco)
// ลายที่รองรับ: none, stripe (ริ้วนอน), collar (คอปก), pocket (กระเป๋า), logo (ตรา), vneck (คอวี)

export const TOPS = [
  { id: 'tee',      label: 'เสื้อยืด',     sleeve: 'short', deco: 'none' },
  { id: 'stripe',   label: 'เสื้อลายริ้ว', sleeve: 'short', deco: 'stripe' },
  { id: 'polo',     label: 'เสื้อโปโล',    sleeve: 'short', deco: 'collar' },
  { id: 'logo',     label: 'เสื้อสกรีน',   sleeve: 'short', deco: 'logo' },
  { id: 'tank',     label: 'เสื้อกล้าม',   sleeve: 'none',  deco: 'none' },
  { id: 'long',     label: 'เสื้อแขนยาว',  sleeve: 'long',  deco: 'none' },
  { id: 'hoodie',   label: 'เสื้อฮู้ด',    sleeve: 'long',  deco: 'pocket' },
  { id: 'vneck',    label: 'เสื้อคอวี',    sleeve: 'short', deco: 'vneck' }
];

export const TOP_COLORS = ['#4a7fd1', '#d1584a', '#4aa57a', '#e0a93b', '#8a63c9', '#3fa7b5', '#d9708f', '#e8e8e8', '#5b5f6b', '#e8844a'];
