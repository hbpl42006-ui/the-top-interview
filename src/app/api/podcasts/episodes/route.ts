import { getAllEpisodes } from "@/lib/data/podcasts";
import { handleRoute, ok } from "@/lib/api-response";

// Public, lightweight episode list used by the sticky player to cycle
// next/prev across the whole catalogue (not just whatever page is open).
export async function GET() {
  return handleRoute(async () => {
    const episodes = await getAllEpisodes();
    return ok(episodes);
  });
}
