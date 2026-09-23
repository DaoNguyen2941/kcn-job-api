import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentAdminData {
  id: string;
  username: string;
  fullName: string;
}

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentAdminData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
