import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';

export class QueryDto {
  @Optional()
  @Transform((value) => {
    console.log('Pipes');
    return Number(value);
  })
  page: number;
}
