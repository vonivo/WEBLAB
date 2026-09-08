export interface MongoConfig {
  uri: string;
  user?: string;
  pass?: string;
}
declare const _default: (() => MongoConfig) &
  import("@nestjs/config").ConfigFactoryKeyHost<MongoConfig>;
export default _default;
