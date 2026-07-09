import { NextRequest } from "next/server";
import { requireSession } from "@/lib/session";
import { addCredits } from "@/lib/credits";

// Credit packs available for purchase
const CREDIT_PACKS = [
  { id: "starter",      credits: 25,  price: 499,   label: "Starter Pack" },
  { id: "growth",       credits: 100, price: 1499,  label: "Growth Pack" },
  { id: "professional", credits: 500, price: 4999,  label: "Professional Pack" },
] as const;

export type CreditPack = (typeof CREDIT_PACKS)[number];

export async function GET() {
  return Response.json({ packs: CREDIT_PACKS });
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const { packId } = await req.json();

    const pack = CREDIT_PACKS.find((p) => p.id === packId);
    if (!pack) {
      return Response.json({ error: "Invalid pack" }, { status: 400 });
    }

    // TODO: Integrate payment gateway (Stripe/Razorpay) here
    
    // // For now, directly add credits (this will be gated behind payment later)
    // const newBalance = await addCredits(
    //   session.user.id,
    //   pack.credits,
    //   `purchase_${pack.id}`,
    // );
return Response.json(
    { error: "Payments not yet enabled. Coming soon." },
    { status: 503 }
  )
    // return Response.json({
    //   success: true,
    //   creditsAdded: pack.credits,
    //   newBalance,
    // });
  } catch (err) {
    console.error("Buy credits error:", err);
    return Response.json(
      { error: "Failed to process purchase" },
      { status: 500 },
    );
  }
}
