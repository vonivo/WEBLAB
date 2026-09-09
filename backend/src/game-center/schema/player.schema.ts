import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PlayerDocument = HydratedDocument<Player>;

@Schema()
export class Player {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
