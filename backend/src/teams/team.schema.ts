import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TeamDocument = HydratedDocument<Team>;

@Schema()
export class Team {
  @Prop()
  name: string;

  @Prop()
  logoUrl: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
