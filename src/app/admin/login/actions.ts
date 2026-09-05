"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function authenticate(_prevState: string | undefined, formData: FormData): Promise<string | undefined> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const callbackUrl = String(formData.get("callbackUrl") || "/admin");

  try {
    await signIn("credentials", { email, password, redirectTo: callbackUrl });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Something went wrong. Please try again.";
      }
    }
    // signIn's redirect throws a special Next.js redirect error — let it propagate.
    throw err;
  }
}
