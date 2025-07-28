const crypto = require("crypto");
require("dotenv").config({ path: ".env" });

function base64UrlEncode(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateToken(email, secret) {
  const payload = Buffer.from(email, "utf8").toString("base64url");
  const signature = base64UrlEncode(
    crypto.createHmac("sha256", secret).update(payload).digest().subarray(0, 8)
  );
  return `${payload}.${signature}`;
}

// Get email from command line argument or use default
const email = process.argv[2] || "test@example.com";
const secret = process.env.SECRET_KEY;
const domain = process.env.APP_DOMAIN || "http://localhost:3000";

if (!secret) {
  console.error("ERROR: SECRET_KEY not found in .env");
  process.exit(1);
}

const token = generateToken(email, secret);

console.log("Email:", email);
console.log("Generated token:", token);
console.log("");
console.log("Keep subscription link:");
console.log(`${domain}/k/${token}`);
console.log("");
console.log("Unsubscribe link:");
console.log(`${domain}/u/${token}`);
