import type { APIRoute } from "astro";

export const GET: APIRoute = async (ctx) => {
  if (!ctx.locals.user) return new Response("Unauthorized", { status: 401 });

  const path = new URL(ctx.request.url).pathname
    .replace("/thumbnail/", "")
    .replace(".png", "");
  const file = await ctx.locals.runtime.env.R2_BUCKET.get(`${path}-thumbnail`);

  if (!file) return new Response("Could not find file", { status: 404 });

  return new Response(file.body, {
    headers: { "Content-Type": file.httpMetadata?.contentType ?? "" },
  });
};
