export const AUTH = {
  BCRYPT_SALT_ROUNDS: 10,
  COOKIE_MAX_AGE_MS: 1000 * 60 * 60 * 24 * 7,
} as const;

export const UPLOAD = {
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
} as const;

export const OCR = {
  MIN_TEXT_LENGTH: 50,
  LOG_PREVIEW_LENGTH: 50,
} as const;

export const VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 6,
} as const;

export const SERVER = {
  DEFAULT_PORT: 3001,
} as const;
