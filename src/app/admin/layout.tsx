import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

// Guards every /admin/* route (requirement #1: RBAC). Anonymous visitors and signed-in
// non-admins (ordinary customers) are redirected to /admin-login — a separate route outside
// this guarded tree, since nesting it under /admin/* would redirect-loop unauthenticated
// visitors trying to reach the login page itself.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin-login?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-brand-pinkLight/10">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <AdminNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
