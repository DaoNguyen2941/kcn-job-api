export function generateCodeFromName(name: string): string {
  return name
    .normalize('NFD')                     // tách dấu
    .replace(/[\u0300-\u036f]/g, '')      // xóa dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')         // chỉ giữ chữ, số, khoảng trắng
    .trim()
    .replace(/\s+/g, '_');                // khoảng trắng → _
}