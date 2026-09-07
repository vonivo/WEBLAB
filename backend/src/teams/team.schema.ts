import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PlayerDocument = HydratedDocument<Player>;

@Schema()
export class Player {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

export type TeamDocument = HydratedDocument<Team>;

@Schema()
export class Team {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  logoUrl: string;

  @Prop({ type: [PlayerSchema] })
  players: Player[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
