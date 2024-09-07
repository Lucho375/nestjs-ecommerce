import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthUser } from '../interfaces/auth.user.interface';

export const User = createParamDecorator(
  (data: keyof IAuthUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
