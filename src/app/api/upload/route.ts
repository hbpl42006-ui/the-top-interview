import { auth } from "@/auth";
import { uploadToCloudinary, cloudinaryConfigured } from "@/lib/cloudinary";
import { handleRoute, ok, unauthorized, RouteError } from "@/lib/api-response";

const ADMIN_ROLES = new Set(["SUPER_ADMIN", "ADMIN", "EDITOR", "REPORTER", "VIDEO_EDITOR", "PODCAST_MANAGER"]);

// Server-side media upload proxy: the browser sends the file here, this
// route forwards it to Cloudinary using the server-only API secret, and
// returns just the resulting URL for the admin form to save on the record.
export async function POST(request: Request) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user || !ADMIN_ROLES.has(session.user.role)) {
      return unauthorized("Sign in with an editorial account to upload media.");
    }

    if (!cloudinaryConfigured) {
      throw new RouteError(
        "Media uploads are not configured on this server. Set CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.",
        503
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "misc").replace(/[^a-z0-9-]/gi, "");

    if (!(file instanceof File)) {
      throw new RouteError("No file provided.", 400);
    }

    const result = await uploadToCloudinary(file, folder || "misc");
    return ok(result, 201);
  });
}
