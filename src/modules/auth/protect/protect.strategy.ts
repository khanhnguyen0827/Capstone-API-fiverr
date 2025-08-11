import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ACCESS_TOKEN_SECRET } from 'src/common/constant/app.constant';
import { PrismaService } from 'src/modules/prisma/prisma.service';

// google passport: BE gánh hết, redirect FE
// BE 1 nửa, FE 1 nửa
@Injectable()
export class ProtectStrategyStep2 extends PassportStrategy(
  Strategy,
  'protect',
) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ACCESS_TOKEN_SECRET || 'Chưa có token',
    });
  }

  async validate(payload: any) {
    // console.log('validate', { payload });

    const user = await this.prisma.users.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if(!user) throw new UnauthorizedException("Tài khoản không hợp lệ")

    // console.log({ user });

    return user
  }
}
