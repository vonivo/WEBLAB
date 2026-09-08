import * as Joi from "joi";
export const envValidationSchema = Joi.object({
  MONGODB_URI: Joi.string().uri().required(),
  MONGODB_USER: Joi.string().optional(),
  MONGODB_PASS: Joi.string().optional(),
  WEBAUTHN_RP_NAME: Joi.string().required(),
  WEBAUTHN_RP_ID: Joi.string().required(),
  WEBAUTHN_ORIGINS: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
});
//# sourceMappingURL=env.validation.js.map
