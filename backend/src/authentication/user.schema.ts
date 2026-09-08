import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ _id: false })
export class Credential {
  @Prop({ required: true })
  id: string;
  @Prop({ type: Buffer, required: true })
  publicKey: Buffer;
  @Prop({ required: true, default: 0 })
  counter: number;
  @Prop({ type: [String], default: [] })
  transports?: string[];
}
export const CredentialSchema = SchemaFactory.createForClass(Credential);

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ type: [CredentialSchema], default: [] })
  credentials: Credential[];
}
export const UserSchema = SchemaFactory.createForClass(User);
