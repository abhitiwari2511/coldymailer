import { requireSession } from "@/lib/session";
import { getUserCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;

  const credits = await getUserCredits(session.user.id);

  // Get recent transactions
  const transactions = await prisma.creditTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return Response.json({ credits, transactions });
}
