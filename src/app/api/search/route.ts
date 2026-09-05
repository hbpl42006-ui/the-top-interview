import { NextRequest } from "next/server";
import { searchSite } from "@/lib/search";
import { handleRoute, ok } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  return handleRoute(async () => {
    const q = request.nextUrl.searchParams.get("q") ?? "";
    const results = await searchSite(q);
    return ok(results);
  });
}
