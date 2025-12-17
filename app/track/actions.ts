
'use server'

import { createAdminClient } from "@/lib/supabase/admin";

export async function getReportStatus(ticket: string, email: string) {
  // Simple validation
  if (!ticket || !email) {
    return { error: "Tiket dan Email wajib diisi." };
  }

  const supabase = createAdminClient();

  try {
    const { data: report, error } = await supabase
      .from("reports")
      .select("*, report_feedback(*)")
      .eq("ticket_code", ticket)
      .eq("email", email)
      .single();

    if (error) {
      // Supabase returns error if no rows found for single()
      if (error.code === 'PGRST116') { 
          return { error: "Laporan tidak ditemukan. Cek kembali Kode Tiket dan Email Anda." };
      }
      return { error: "Terjadi kesalahan: " + error.message };
    }

    return { data: report };
  } catch (err: any) {
    return { error: "Internal Server Error: " + err.message };
  }
}
