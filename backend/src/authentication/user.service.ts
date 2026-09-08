import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema.js";
import { WebAuthnCredential } from "@simplewebauthn/server";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username });
  }

  async findByUsernameOrThrow(username: string): Promise<UserDocument> {
    const user = await this.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`User "${username}" not found`);
    }
    return user;
  }

  async findOrCreate(username: string): Promise<User> {
    let user = await this.findByUsername(username);
    if (!user) {
      user = await this.userModel.create({ username, credentials: [] });
    }
    return user;
  }

  async addCredential(
    username: string,
    credential: WebAuthnCredential,
  ): Promise<void> {
    const user = await this.findByUsernameOrThrow(username);

    const alreadyExists = user.credentials.some((c) => c.id === credential.id);
    if (alreadyExists) return;

    user.credentials.push({
      id: credential.id,
      publicKey: Buffer.from(credential.publicKey),
      counter: credential.counter,
      transports: credential.transports ?? [],
    } as any);

    await user.save();
  }

  async findCredential(username: string, credentialId: string) {
    const user = await this.findByUsernameOrThrow(username);
    return user.credentials.find((c) => c.id === credentialId);
  }

  async updateCredentialCounter(
    username: string,
    credentialId: string,
    newCounter: number,
  ): Promise<void> {
    const user = await this.findByUsernameOrThrow(username);
    const credential = user.credentials.find((c) => c.id === credentialId);
    if (credential) {
      credential.counter = newCounter;
      await user.save();
    }
  }
}
