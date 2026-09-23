import { serialize, SerializeOptions } from 'cookie';

export function createCookie(
  name: string,
  value: string,
  path?: string,
  maxAge?: number,
  sameSite: SerializeOptions['sameSite'] = 'lax', // mặc định 'lax', truyền 'none' khi thực sự cross-site
): string {
  // const domain = process.env.FRONTEND_DOMAIN;

  const cookieOptions: SerializeOptions = {
    httpOnly: true,                          // chỉ truy cập qua HTTP(S), JS phía client không đọc được
    secure: process.env.NODE_ENV === 'production',    // cookie chỉ gửi qua HTTPS
    sameSite,                                // 'lax' mặc định, cho phép override khi cần cross-site ('none')
    maxAge: maxAge !== undefined ? maxAge : undefined, // giữ được maxAge = 0 để xóa cookie khi logout
    path: path || '/',                       // mặc định path = "/"
    // ...(domain
    //   ? { domain: domain.startsWith('.') ? domain : `.${domain}` }
    //   : {}),
  };

  return serialize(name, value, cookieOptions);
}