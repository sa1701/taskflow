# TaskFlow

A full-stack kanban-style task manager built with Next.js 16, Supabase, Prisma, and NextAuth.js.

**Live demo:** (add Vercel URL after deploy)

---

## Features

- **Kanban board** — drag and drop tasks between Todo, In Progress, and Done
- **Priority labels** — Low, Medium, High with color coding
- **Multiple projects** — color-coded project cards with task counts
- **Auth** — email/password registration and login (NextAuth.js v5)
- **Persistent** — all data saved to PostgreSQL via Prisma
- **Responsive** — works on desktop and mobile

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 App Router |
| Database | PostgreSQL (Supabase free tier) |
| ORM | Prisma v5 |
| Auth | NextAuth.js v5 (credentials) |
| Styling | Tailwind CSS v4 |
| Drag & Drop | @dnd-kit |
| Deploy | Vercel |

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/sa1701/taskflow.git
cd taskflow
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Copy the **Connection string** from Project Settings → Database → URI

### 3. Configure environment variables

Edit `.env.local`:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"
AUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Push database schema

```bash
npx prisma db push
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
  (auth)/login, register     # Public auth pages
  (app)/dashboard            # Protected: project grid
  (app)/projects/[id]        # Protected: kanban board
  api/                       # REST API routes
components/
  kanban/                    # KanbanBoard, KanbanColumn, TaskCard
  projects/                  # ProjectCard, NewProjectButton
  tasks/                     # AddTaskInline, EditTaskModal, NewTaskButton
  layout/                    # Sidebar
lib/
  prisma.ts                  # Prisma client singleton
  auth.ts                    # NextAuth config
  utils.ts                   # Helpers and constants
prisma/
  schema.prisma              # DB schema
```

## Deploy to Vercel

1. Push repo to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables: `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`
4. Deploy

---

Built by [Seif Ali](https://github.com/sa1701)
