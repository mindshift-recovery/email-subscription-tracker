import { verifyAndDecodeToken } from "./hmac-verifier";
import { supabase } from "./supabase";
import type { Context } from "../types/global";

const SECRET = process.env.SECRET_KEY!;
const REDIRECT_URL = process.env.REDIRECT_URL!;
const UNSUBSCRIBE_URL = process.env.UNSUBSCRIBE_URL!;

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

    const { error } = await supabase.from("clicks").insert({ email, action });

    if (error) {
      console.error("Database error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }

    const redirectUrl = action === "keep" ? REDIRECT_URL : UNSUBSCRIBE_URL;

    return Response.redirect(redirectUrl, 302);
  } catch {
    return new Response("Invalid token", { status: 403 });
  }
}
