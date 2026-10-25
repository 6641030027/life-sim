// ตัวช่วยทั่วไป ไม่ผูกกับเกม

export const $ = (id) => document.getElementById(id);

export function ri(a, b) {
  return a + Math.floor(Math.random() * (b - a + 1));
}

export function pick(arr) {
  return arr[ri(0, arr.length - 1)];
}

// ตัวอักษรแรกของชื่อ (ข้ามสระนำ เ แ โ ใ ไ) ใช้โชว์ในวงกลมแทนรูป
export function initial(name) {
  const s = name.replace(/^[เแโใไ]+/, '');
  return s.charAt(0) || name.charAt(0);
}
