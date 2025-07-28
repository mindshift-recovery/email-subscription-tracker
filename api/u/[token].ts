import handler from "../../lib/tracking-handler";

export const GET = (req: Request) => {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const token = pathSegments[pathSegments.length - 1];

  return handler(req, { params: { token } }, "unsubscribe");
};
