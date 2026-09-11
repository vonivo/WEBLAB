import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class TeamDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  logoUrl: string;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerDto)
  players: PlayerDto[];
}

export class PlayerDto {
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
}
