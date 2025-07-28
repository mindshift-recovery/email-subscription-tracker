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

// Generate a test token
const email = "test@example.com";
const secret = process.env.SECRET_KEY;

if (!secret) {
  console.error("ERROR: SECRET_KEY not found in .env.local");
  process.exit(1);
}

const token = generateToken(email, secret);

console.log("Test email:", email);
console.log("Secret key:", secret);
console.log("Generated token:", token);
console.log("Test URL: http://localhost:3000/k/" + token);
