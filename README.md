# Ambrosia - Pure Zero Refreshment

Ambrosia is a cutting-edge beverage formulation platform and marketing site built with **Next.js 14** (App Router). It features high-fidelity 3D interactive models, smooth GSAP animations, and an AI-powered beverage formulation chat agent (Dr Bevis).

## Features

- **Interactive 3D UI:** Utilizes Google's `<model-viewer>` for realistic, interactive product rendering.
- **GSAP Parallax & Animations:** Smooth, mouse-tracking parallax effects for background elements.
- **Dr Bevis AI Agent:** A smart formulation assistant built using the Vercel AI SDK and Groq models, capable of crafting recipes, analyzing nutrition, and verifying regulatory compliance.
- **Database Integrated:** Uses Drizzle ORM and PostgreSQL to manage products, recipes, and user reviews.

## Tech Stack

- **Framework:** Next.js 14
- **UI & Styling:** React, Tailwind CSS, Lucide React
- **Animations:** GSAP
- **Database:** PostgreSQL, Drizzle ORM
- **AI Integration:** Vercel AI SDK, Groq (llama-3.1-70b-versatile)
- **Authentication:** next-auth (v5 beta)
- **Emails:** Resend
- **Package Manager:** Bun

## Local Development Setup

To run this project locally, ensure you have [Bun](https://bun.sh/) installed.

1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   bun install
   ```
3. **Environment Setup:**
   Copy the `.env.example` file to `.env.local` and fill in your credentials.
   ```bash
   cp .env.example .env.local
   ```
   *Required Keys:*
   - `DATABASE_URL` (Your PostgreSQL connection string)
   - `GROQ_API_KEY` (Your Groq API key)
   - `AUTH_SECRET` (A random string for next-auth)
   - `RESEND_API_KEY` (Optional for emails, falls back gracefully)
   - `NEXT_PUBLIC_APP_URL` (The public URL of the application, defaults to http://localhost:3000)

4. **Run the development server:**
   ```bash
   bun run dev
   ```
   The site will be running at `http://localhost:3000`.

## Database Schema & Migrations

To generate and push database schemas using Drizzle:

```bash
bun run db:generate
bun run db:push
bun run db:seed
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
