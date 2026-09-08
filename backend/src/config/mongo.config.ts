import { registerAs } from "@nestjs/config";

export interface MongoConfig {
  uri: string;
  user?: string;
  pass?: string;
}

export default registerAs("mongo", (): MongoConfig => ({
  uri: process.env.MONGODB_URI!,
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASS,
}));
