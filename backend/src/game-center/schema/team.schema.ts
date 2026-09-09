import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Player, PlayerSchema } from "./player.schema.js";

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
