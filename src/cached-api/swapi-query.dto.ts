import { IsString, IsOptional, IsPositive, IsInt } from 'class-validator';

export class SwapiQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  page?: number;
}

export class EmptyQueryDto {}
