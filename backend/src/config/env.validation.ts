import Joi from "joi";

export const envValidationSchema = Joi.object({
  // Mongo
  MONGODB_URI: Joi.string().uri().required(),
  MONGODB_USER: Joi.string().optional(),
  MONGODB_PASS: Joi.string().optional(),

  // WebAuthn
  WEBAUTHN_RP_NAME: Joi.string().required(),
  WEBAUTHN_RP_ID: Joi.string().required(),
  WEBAUTHN_ORIGINS: Joi.string().required(), // comma-separated list, at least one

  // Good practice to validate NODE_ENV too, since a typo here silently
  // breaks env-specific behavior elsewhere
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),

  // JWT
  JWT_ACCESS_TOKEN_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_TOKEN_EXPIRATION: Joi.string().default("1m"),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_TOKEN_EXPIRATION: Joi.string().default("1m"),
});
