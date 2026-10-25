// ตัวช่วยทั่วไป ไม่ผูกกับเกม

export const $ = (id) => document.getElementById(id);

export function ri(a, b) {
  return a + Math.floor(Math.random() * (b - a + 1));
}

// ตัวเลขสุ่มแบบระฆังคว่ำ (ค่ากลางพบบ่อย ค่าสุดโต่งพบน้อย) mean ค่ากลาง sd ส่วนเบี่ยงเบน
export function rn(mean, sd) {
  const u = 1 - Math.random();
  const v = Math.random();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

export function pick(arr) {
  return arr[ri(0, arr.length - 1)];
}

// ตัวอักษรแรกของชื่อ (ข้ามสระนำ เ แ โ ใ ไ) ใช้โชว์ในวงกลมแทนรูป
export function initial(name) {
  const s = name.replace(/^[เแโใไ]+/, '');
  return s.charAt(0) || name.charAt(0);
}
