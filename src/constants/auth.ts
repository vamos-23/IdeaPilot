export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export const PASSWORD_MESSAGE =
  "Password must contain at least 8 characters, one uppercase letter, one number and one special character.";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
