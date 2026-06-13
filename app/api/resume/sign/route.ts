import { requireSession } from "@/lib/session"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function GET() {
    // only if user is logged in then can get signature for upload
  const { error } = await requireSession()
  if (error) return error

  const timestamp = Math.round(new Date().getTime() / 1000)

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: "coldmail-resumes",
    },
    process.env.CLOUDINARY_API_SECRET!
  )

  return Response.json({
    timestamp,
    signature,
    apiKey:    process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder:    "coldmail-resumes",
  })
}