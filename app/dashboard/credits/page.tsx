import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserCredits } from "@/lib/credits";
import { CreditsClient } from "@/components/dashboard/creditsClient";

export default async function CreditsPage() {
  const session = await getServerSession(authOptions);
  const credits = await getUserCredits(session!.user.id);

  return <CreditsClient initialCredits={credits} />;
}
