import { Body, Controller, Post } from '@nestjs/common';
import { TotpService } from './totp.service';
import { User } from 'src/common/decorator/user.decorator';
import { Users } from 'generated/prisma';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DisableTotpDto, SaveTotpDto, VerifyTotpDto } from './dto/totp.dto';

@Controller('totp')
export class TotpController {
  constructor(private readonly totpService: TotpService) {}

  @ApiBearerAuth()
  @Post('generate')
  async totpGenerate(@User() user: Users) {
    return await this.totpService.totpGenerate(user);
  }

  @ApiBearerAuth()
  @Post('save')
  async totpSave(@Body() saveDto: SaveTotpDto, @User() user: Users) {
    return await this.totpService.totpSave(saveDto, user);
  }

  @ApiBearerAuth()
  @Post('disable')
  async totpDisable(@Body() disableDto: DisableTotpDto, @User() user: Users) {
    return await this.totpService.totpDisable(disableDto, user);
  }

  @ApiBearerAuth()
  @Post('vefify')
  async totpVerify(@Body() verifyDto: VerifyTotpDto, @User() user: Users) {
    return await this.totpService.totpVerify(verifyDto, user);
  }
}
