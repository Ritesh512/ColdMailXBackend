import crypto from "crypto";

const algorithm = "aes-256-cbc";
let secretKey = process.env.CRYPTO_SECRET_KEY;

// In dev, auto-generate a fallback key if not provided
if (!secretKey) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "⚠️  CRYPTO_SECRET_KEY not found. Using a temporary random key (dev mode only)."
    );
    secretKey = crypto.randomBytes(32).toString("hex"); // 64 hex chars
  } else {
    throw new Error(
      "CRYPTO_SECRET_KEY environment variable must be a 64-character hex string."
    );
  }
} else if (secretKey.length !== 64) {
  throw new Error(
    "CRYPTO_SECRET_KEY environment variable must be a 64-character hex string."
  );
}

const key = Buffer.from(secretKey, "hex");

export const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

export const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(hash.iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
};
