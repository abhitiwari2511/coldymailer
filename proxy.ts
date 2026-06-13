import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/campaigns/:path*",
    "/settings/:path*",
    "/api/campaigns/:path*",
    "/api/resume/:path*",
    "/api/gmail/:path*",
  ],
}