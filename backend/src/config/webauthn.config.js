import { registerAs } from "@nestjs/config";
export default registerAs("webauthn", () => ({
  rpName: process.env.WEBAUTHN_RP_NAME ?? "",
  rpID: process.env.WEBAUTHN_RP_ID,
  expectedOrigin: (process.env.WEBAUTHN_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
}));
//# sourceMappingURL=webauthn.config.js.map
