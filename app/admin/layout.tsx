
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika belum login, redirect ke halaman login
  if (!user) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
