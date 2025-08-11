import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SaveTotpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  secret: string;
}

export class DisableTotpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class VerifyTotpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}
