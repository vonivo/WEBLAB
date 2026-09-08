import { registerAs } from "@nestjs/config";
export default registerAs("mongo", () => ({
  uri: process.env.MONGODB_URI,
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASS,
}));
//# sourceMappingURL=mongo.config.js.map
