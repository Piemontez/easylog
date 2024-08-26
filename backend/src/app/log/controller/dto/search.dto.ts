import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import LogRawData from 'src/commons/type/lograwdata';
import { FilterQuery } from 'src/commons/type/whereoperator';

// DTO para busca de dados
@Exclude()
export class LogJsonDataSearchDto {
  @ApiProperty({ description: 'Filtros' })
  @Expose()
  @IsOptional()
  where?: FilterQuery<LogRawData>;

  @ApiProperty({ description: 'Página' })
  @Expose()
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Quantidade por página' })
  @Expose()
  @IsNumber()
  @IsOptional()
  perPage?: number;
}

@Exclude()
export class LogPlainDataSearchDto {
  @ApiProperty({ description: 'Filtros' })
  @Expose()
  @IsOptional()
  where?: string | string[];

  @ApiProperty({ description: 'Página' })
  @Expose()
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Quantidade por página' })
  @Expose()
  @IsNumber()
  @IsOptional()
  perPage?: number;
}
