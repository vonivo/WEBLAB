import { GameEventType, GameSide } from "../schema/game.schema.js";
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateGameDto {
  @IsMongoId()
  homeTeamId: string;
  @IsMongoId()
  awayTeamId: string;
  @Type(() => Date)
  @IsDate()
  startDate: Date;
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  lineupHomeTeam: string[];
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  lineupAwayTeam: string[];
}

export class GameEventDto {
  @IsInt()
  @Min(0)
  minute: number;
  @IsInt()
  @Min(0)
  @IsOptional()
  minuteExtra?: number;
  @IsNotEmpty()
  @IsEnum(GameEventType)
  type: GameEventType;
  @IsEnum(GameSide)
  @IsOptional()
  team?: GameSide;
  @IsMongoId()
  @IsOptional()
  primaryPlayerId?: string;
  @IsMongoId()
  @IsOptional()
  secondaryPlayerId?: string;
}
