import Link from "next/link";
import { CheckSquare, Zap, Users, ArrowRight, Kanban, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Kanban className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900">TaskFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
            <Star className="w-3.5 h-3.5" />
            Built with Next.js 16 + Supabase
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
            Ship faster.
            <br />
            <span className="text-indigo-600">Stay organized.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            TaskFlow is a clean, kanban-style project manager. Create projects,
            track tasks across Todo → In Progress → Done, and keep your team
            moving.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors text-base"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 font-medium px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors text-base"
            >
              Log in
            </Link>
          </div>
        </section>

        {/* Feature cards */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
                <Kanban className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Kanban Boards
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Drag and drop tasks between columns. Visualize your workflow
                and spot bottlenecks instantly.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Priority Labels
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Mark tasks as Low, Medium, or High priority. Focus on what
                matters most and never miss a deadline.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                <CheckSquare className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Multiple Projects
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Manage unlimited projects, each with its own board. Color-code
                them for instant recognition.
              </p>
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="bg-indigo-600 py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to get organized?
            </h2>
            <p className="text-indigo-200 mb-8 text-lg">
              Free forever. No credit card required.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Create your account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 py-6 text-center text-sm text-slate-400">
        Built by Seif Ali · Next.js 16 · Supabase · Prisma
      </footer>
    </div>
  );
}
