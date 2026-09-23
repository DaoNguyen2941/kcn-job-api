import slugify from 'slugify';
import { customAlphabet } from 'nanoid';

const nanoidSuffix = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6);

/** Generates a URL-safe, near-unique slug: "cong-nhan-san-xuat-a1b2c3". */
export function buildSlug(title: string): string {
  const base = slugify(title, { lower: true, strict: true, locale: 'vi' });
  return `${base}-${nanoidSuffix()}`;
}

/** Generates a labor order code like "LO-20260911-AB12CD". */
export function buildLaborOrderCode(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `LO-${y}${m}${d}-${nanoidSuffix().toUpperCase()}`;
}
