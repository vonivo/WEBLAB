import { registerAs } from "@nestjs/config";

export interface WebAtuhNConfig {
  rpName: string;
  rpID?: string;
  expectedOrigin: string[];
}

export default registerAs("webauthn", (): WebAtuhNConfig => ({
  rpName: process.env.WEBAUTHN_RP_NAME ?? "",
  rpID: process.env.WEBAUTHN_RP_ID,
  expectedOrigin: (process.env.WEBAUTHN_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
}));
