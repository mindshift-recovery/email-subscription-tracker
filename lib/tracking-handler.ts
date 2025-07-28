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
    console.error("Missing token in request");
    return Response.redirect(UNSUBSCRIBE_URL, 302);
  }

  const token = context.params.token;

  if (typeof token !== "string" || token.trim().length === 0) {
    console.error("Invalid token format");
    return Response.redirect(UNSUBSCRIBE_URL, 302);
  }

  try {
    const email = verifyAndDecodeToken(token, SECRET);

    const { error } = await supabase.from("clicks").insert({ email, action });

    if (error) {
      console.error("Database error:", error);
      return Response.redirect(UNSUBSCRIBE_URL, 302);
    }

    const redirectUrl = action === "keep" ? REDIRECT_URL : UNSUBSCRIBE_URL;

    return Response.redirect(redirectUrl, 302);
  } catch (err) {
    console.error("Token verification failed:", err);
    return Response.redirect(UNSUBSCRIBE_URL, 302);
  }
}
