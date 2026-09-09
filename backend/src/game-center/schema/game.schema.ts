import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Player, PlayerSchema } from "./player.schema.js";
import { Types } from "mongoose";

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
export class Game {
  @Prop({ required: true, type: GameTeamSchema })
  homeTeam: GameTeam;
  @Prop({ required: true, type: GameTeamSchema })
  awayTeam: GameTeam;
  @Prop({ required: true })
  startDate: Date;
  @Prop()
  endDate: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
