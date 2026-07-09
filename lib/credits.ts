import { prisma } from "./prisma";

// get user present credit
export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  return user?.credits ?? 0;
}

// use credits and if not show not sufficient msg
export async function consumeCredit(
  userId: string,
  amount: number,
  reason: string,
): Promise<number> {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { credits: true },
    });

    if (user.credits < amount) {
      throw new InsufficientCreditsError(user.credits, amount);
    }

    const newBalance = user.credits - amount;

    await tx.user.update({
      where: { id: userId },
      data: { credits: newBalance },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        type: "debit",
        amount,
        reason,
        balanceAfter: newBalance,
      },
    });

    return newBalance;
  });
}

/**
 * Add credits to a user's balance. Returns the new balance.
 */
export async function addCredits(
  userId: string,
  amount: number,
  reason: string,
): Promise<number> {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { credits: true },
    });

    const newBalance = user.credits + amount;

    await tx.user.update({
      where: { id: userId },
      data: { credits: newBalance },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        type: "credit",
        amount,
        reason,
        balanceAfter: newBalance,
      },
    });

    return newBalance;
  });
}

/**
 * Custom error for insufficient credits — lets API routes
 * distinguish "not enough credits" from other errors.
 */
export class InsufficientCreditsError extends Error {
  public readonly available: number;
  public readonly required: number;

  constructor(available: number, required: number) {
    super(
      `Insufficient credits: ${available} available, ${required} required`,
    );
    this.name = "InsufficientCreditsError";
    this.available = available;
    this.required = required;
  }
}
