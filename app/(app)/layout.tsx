import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      <Sidebar user={{ name: session.user?.name ?? "", email: session.user?.email ?? "" }} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
