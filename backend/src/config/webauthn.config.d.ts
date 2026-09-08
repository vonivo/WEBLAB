export interface WebAtuhNConfig {
  rpName: string;
  rpID?: string;
  expectedOrigin: string[];
}
declare const _default: (() => WebAtuhNConfig) &
  import("@nestjs/config").ConfigFactoryKeyHost<WebAtuhNConfig>;
export default _default;
