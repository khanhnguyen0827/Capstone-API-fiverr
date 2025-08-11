import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from 'generated/prisma';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import {
  DisableTotpDto,
  SaveTotpDto,
  VerifyTotpDto,
} from './dto/totp.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TotpService {
  constructor(private readonly prisma: PrismaService) {}

  async totpGenerate(user: Users) {
    if (user.totpSecret) {
      throw new BadRequestException('Tài khoản đã bật Google Authenticator');
    }

    const secret = authenticator.generateSecret();

    const keyUri = authenticator.keyuri(user.email, 'Cyber Community', secret);

    const qrCode = await toDataURL(keyUri);

    return { secret, qrCode };
  }

  async totpSave(saveDto: SaveTotpDto, user: Users) {
    if (user.totpSecret) {
      throw new BadRequestException('Tài khoản đã bật Google Authenticator');
    }

    const isCheck = authenticator.check(saveDto.token, saveDto.secret);
    if (!isCheck) throw new BadRequestException('Token không hợp lệ');

    await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        totpSecret: saveDto.secret,
      },
    });

    return true;
  }

  async totpDisable(disableDto: DisableTotpDto, user: Users) {
    if (!user.totpSecret) {
      throw new BadRequestException('Tài khoản chưa bật Google Authenticator');
    }

    const isCheck = authenticator.check(disableDto.token, user.totpSecret);
    if (!isCheck) throw new BadRequestException('Token không hợp lệ');

    await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        totpSecret: null,
      },
    });

    return true;
  }

  async totpVerify(verifyDto: VerifyTotpDto, user: Users) {
    if (!user.totpSecret) {
      throw new BadRequestException('Tài khoản chưa bật Google Authenticator');
    }

    const isCheck = authenticator.check(verifyDto.token, user.totpSecret);
    if (!isCheck) throw new BadRequestException('Token không hợp lệ');

    return true;
  }
}
