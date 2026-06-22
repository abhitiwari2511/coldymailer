import { requireSession } from "@/lib/session";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const { paramsToSign } = await req.json();

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return Response.json({
    signature,
    timestamp: paramsToSign.timestamp,
  });
}