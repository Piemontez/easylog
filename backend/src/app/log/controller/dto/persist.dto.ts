import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBooleanString, IsOptional } from 'class-validator';

// DTO Opções de percistência disponíveis
@Exclude()
export class LogPersistOptionsDto {
  @ApiProperty({ description: 'Registrar de forma assincrona?' })
  @Expose()
  @IsBooleanString()
  @IsOptional()
  async?: 'true' | 'false';
}

// DTO Opções de percistência disponíveis
export type LogPersistDto = Record<string, any> | string;
