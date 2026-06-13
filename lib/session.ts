import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      error: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { session, error: null };
}
