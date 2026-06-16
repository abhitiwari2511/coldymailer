This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


structure

src/
├── app/
│   ├── page.tsx                    → Landing (Server Component)
│   ├── login/
│   │   └── page.tsx                → already exists, will restyle
│   ├── dashboard/
│   │   ├── layout.tsx              → sidebar + session check
│   │   ├── page.tsx                → Overview
│   │   ├── campaigns/
│   │   │   ├── page.tsx            → list
│   │   │   ├── new/page.tsx        → create campaign
│   │   │   └── [id]/page.tsx       → details
│   │   └── settings/page.tsx
│   └── api/                        → ✅ already built
│
├── components/
│   ├── ui/                         → shadcn components
│   ├── landing/
│   │   ├── navbar.tsx
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── pricing.tsx
│   │   └── footer.tsx
│   ├── layout/
│   │   └── sidebar.tsx
│   ├── dashboard/
│   │   ├── stats-cards.tsx
│   │   ├── campaign-list.tsx
│   │   └── resume-card.tsx
│   ├── campaign/
│   │   ├── campaign-form.tsx       → Client
│   │   ├── recipient-input.tsx     → Client
│   │   ├── email-preview.tsx       → Client
│   │   └── resume-upload.tsx       → Client (already built logic)
│   └── auth/
│       └── login-button.tsx
│
├── lib/
│   ├── prisma.ts                   → ✅ exists
│   ├── auth.ts                     → ✅ exists
│   ├── session.ts                  → ✅ exists
│   ├── cloudinary.ts               → ✅ exists
│   └── utils.ts                    → shadcn util (cn function)
│
├── hooks/
│   ├── use-campaigns.ts
│   └── use-resume.ts
│
└── types/
    └── index.ts
