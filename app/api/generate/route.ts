import { NextRequest } from "next/server";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const { campaignId } = await req.json();

    if (!campaignId) {
      return Response.json(
        { error: "campaignId is required" },
        { status: 400 },
      );
    }

    // get data like campaign, resume and all
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        userId: session.user.id,
      },
      include: {
        recipients: true,
        user: {
          select: { resumeText: true, name: true },
        },
      },
    });

    if (!campaign) {
      return Response.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (!campaign.user.resumeText) {
      return Response.json(
        { error: "No resume found for this user" },
        { status: 400 },
      );
    }

    // Generate email for each recipient
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const results = await Promise.all(
      campaign.recipients.map(async (recipient) => {
        try {
          const prompt = `You are helping a student write a professional cold email for job/internship outreach.

Resume:
${campaign.user.resumeText}

Goal: ${campaign.context}

Recipient email: ${recipient.email}
Sender name: ${campaign.user.name ?? "the sender"}

Write a concise, professional cold email. Rules:
- 3-4 short paragraphs max
- No fluff or filler phrases
- Sound human, not AI-generated
- Do not include a subject line
- Do not include placeholders like [Your Name] or [Company Name]
- End with a simple call to action
- Sign off with just the sender's first name`;

          const result = await model.generateContent(prompt);
          const generatedContent = result.response.text();

          // Save generated content to recipient
          await prisma.recipient.update({
            where: { id: recipient.id },
            data: { generatedContent },
          });

          return {
            recipientId: recipient.id,
            email: recipient.email,
            generatedContent,
            success: true,
          };
        } catch (genErr) {
          console.error(`Generation failed for ${recipient.email}:`, genErr);
          return {
            recipientId: recipient.id,
            email: recipient.email,
            generatedContent: null,
            success: false,
          };
        }
      }),
    );

    return Response.json({ results });
  } catch (err) {
    console.error("Generation error:", err);
    return Response.json(
      { error: "Failed to generate emails" },
      { status: 500 },
    );
  }
}
