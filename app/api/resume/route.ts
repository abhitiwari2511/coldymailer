import "@/lib/pdf-polyfills"; // Must be first — polyfills DOMMatrix/ImageData/Path2D for serverless
import { NextRequest } from "next/server";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PDFParse } from "pdf-parse";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// pdf bits
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46, 0x2d];

function isRealPDF(buffer: Uint8Array): boolean {
  if (buffer.length < 5) return false;
  return PDF_MAGIC.every((byte, i) => buffer[i] === byte);
}

function normalizeFilename(name: string | undefined) {
  if (!name) return "resume.pdf";
  return name.toLowerCase().endsWith(".pdf") ? name : `${name}.pdf`;
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // document check
    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    // size of pdf upload
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "File must be under 5MB" },
        { status: 400 },
      );
    }

    // if file is empty return it is empty
    if (file.size === 0) {
      return Response.json({ error: "File is empty" }, { status: 400 });
    }

    // read pdf buffer at once and then use
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const fileBuffer = Buffer.from(buffer);

    // check of extension of the filetype
    if (!isRealPDF(buffer)) {
      return Response.json(
        { error: "Invalid file. Please upload a real PDF document." },
        { status: 400 },
      );
    }

    // pdf text
    let resumeText = "";
    try {
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      const result = await parser.getText();
      resumeText = result.text?.trim() ?? "";
      await parser.destroy();
    } catch {
      return Response.json(
        {
          error: "Could not read PDF. Make sure it is not password protected.",
        },
        { status: 400 },
      );
    }

    if (resumeText.length < 50) {
      return Response.json(
        {
          error:
            "Could not extract text. Your PDF may be scanned or image-based. Please use a text-based PDF.",
        },
        { status: 400 },
      );
    }

    // upload to cloudinary
    let uploadResult: { secure_url: string };
    try {
      uploadResult = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "raw",
                folder: "coldmail-resumes",
                filename: normalizeFilename(file.name),
                public_id: `${session.user.id}-${Date.now()}`,
              },
              (err, result) => {
                if (err) {
                  reject(err);
                  return;
                }

                if (!result?.secure_url) {
                  reject(
                    new Error(
                      "Cloudinary upload succeeded without a secure URL",
                    ),
                  );
                  return;
                }

                resolve(result as { secure_url: string });
              },
            )
            .end(fileBuffer);
        },
      );
    } catch (err) {
      console.error("Resume upload error:", {
        err,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        bufferSize: fileBuffer.length,
      });

      return Response.json(
        {
          error:
            "Resume parsed successfully, but file storage failed. Check Cloudinary upload settings.",
        },
        { status: 502 },
      );
    }

    const resumeUrl = uploadResult.secure_url;

    // url save to db
    try {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { resumeUrl, resumeText },
      });
    } catch (err) {
      console.error("Resume DB save error:", err);
      return Response.json(
        { error: "Resume uploaded, but saving it to your account failed." },
        { status: 500 },
      );
    }

    return Response.json({ message: "Resume saved", resumeUrl });
  } catch (err) {
    console.error("Resume error:", err);
    return Response.json(
      { error: "Failed to process resume" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { resumeUrl: true },
  });

  return Response.json({ resumeUrl: user?.resumeUrl ?? null });
}
