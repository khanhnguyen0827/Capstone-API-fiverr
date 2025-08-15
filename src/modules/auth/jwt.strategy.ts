import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONFIG } from '../../common/constant/app.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONFIG.secret,
      algorithms: [JWT_CONFIG.algorithm],
    });
  }

  async validate(payload: any) {
    // Trả về thông tin user để sử dụng trong request
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
