import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Player, PlayerSchema } from "./player.schema.js";
import { Types } from "mongoose";

export enum GameSide {
  HOME = "HOME",
  AWAY = "AWAY",
}

export enum GameEventType {
  GOAL = "GOAL",
  HALF_TIME = "HALF_TIME",
  PERIOD_END = "PERIOD_END",
  PERIOD_START = "PERIOD_START",
  KICKOFF = "KICKOFF",
  GAME_END = "GAME_END",
  OVERTIME_START = "OVERTIME_START",
}

@Schema()
export class GameTeam {
  @Prop({
    type: Types.ObjectId,
    ref: "Team",
    required: true,
  })
  team: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  logoUrl: string;

  @Prop({ type: [PlayerSchema] })
  players: Player[];
}

export const GameTeamSchema = SchemaFactory.createForClass(GameTeam);

@Schema()
export class GameEvent {
  @Prop({ required: true, min: 0 })
  minute: number;
  @Prop({ min: 0, default: 0 })
  minuteExtra: number;
  @Prop({ required: true, type: String, enum: GameEventType })
  type: GameEventType;
  @Prop({ type: String, enum: GameSide })
  team: GameSide | null;
  @Prop({ type: Types.ObjectId })
  primaryPlayerId?: Types.ObjectId;
  @Prop({ type: Types.ObjectId })
  secondaryPlayerId?: Types.ObjectId;
  @Prop({ type: Date, default: Date.now })
  timeStamp: Date;
}

export const GameEventSchema = SchemaFactory.createForClass(GameEvent);

@Schema()
export class Game {
  @Prop({ required: true, type: GameTeamSchema })
  homeTeam: GameTeam;
  @Prop({ required: true, type: GameTeamSchema })
  awayTeam: GameTeam;
  @Prop({ required: true })
  startDate: Date;
  @Prop()
  endDate: Date;
  @Prop({ type: [GameEventSchema], default: [] })
  events: GameEvent[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
