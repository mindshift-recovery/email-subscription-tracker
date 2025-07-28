import crypto from "crypto";

export function verifyAndDecodeToken(token: string, secret: string): string {
  if (!token.includes(".")) {
    throw new Error("Invalid token structure");
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    throw new Error("Invalid token format: expected 2 parts");
  }

  const [payload, sig] = parts;
  if (!payload || !sig || payload.length === 0 || sig.length === 0) {
    throw new Error("Malformed token: missing components");
  }

  const expected = base64UrlEncode(
    crypto.createHmac("sha256", secret).update(payload).digest().subarray(0, 8)
  );
  if (sig !== expected) throw new Error("Invalid signature");

  return Buffer.from(payload, "base64url").toString("utf8");
}

export function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
