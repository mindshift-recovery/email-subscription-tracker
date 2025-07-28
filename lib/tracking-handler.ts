import { Pool } from "pg";
import { verifyAndDecodeToken } from "./hmac-verifier";
import type { Context } from "../types/global";

const SECRET = process.env.SECRET_KEY!;
const REDIRECT_URL = process.env.REDIRECT_URL!;
const UNSUBSCRIBE_URL = process.env.UNSUBSCRIBE_URL!;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(
  _req: Request,
  context: Context,
  action: "keep" | "unsubscribe"
) {
  if (!context?.params?.token) {
    return new Response("Bad Request: Missing token", { status: 400 });
  }

  const token = context.params.token;

  if (typeof token !== "string" || token.trim().length === 0) {
    return new Response("Bad Request: Invalid token format", { status: 400 });
  }

  try {
    const email = verifyAndDecodeToken(token, SECRET);

    await pool.query("INSERT INTO clicks (email, action) VALUES ($1, $2)", [
      email,
      action,
    ]);

    const redirectUrl = action === "keep" ? REDIRECT_URL : UNSUBSCRIBE_URL;

    return Response.redirect(redirectUrl, 302);
  } catch {
    return new Response("Invalid token", { status: 403 });
  }
}
