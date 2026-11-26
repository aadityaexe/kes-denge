export function requireJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SECURITY: JWT_SECRET environment variable is not set or is shorter than 32 characters."
    );
  }
  return secret;
}
