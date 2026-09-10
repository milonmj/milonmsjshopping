import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LogoutButton from "./LogoutButton";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">My Account</h1>

      <div className="border rounded-lg p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-base font-medium">{user.name || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="text-base font-medium">{user.phone}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-base font-medium">{user.email || "N/A"}</p>
        </div>

        <div className="pt-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
