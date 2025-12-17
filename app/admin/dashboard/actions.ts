
'use server'

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateReportStatus(reportId: string, newStatus: string) {
  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from('reports')
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', reportId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath(`/admin/dashboard/${reportId}`);
  return { success: true };
}

export async function sendFeedback(
  reportId: string, 
  adminUserId: string,
  message: string, 
  sentVia: 'wa' | 'dashboard' | 'email'
) {
  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from('report_feedback')
    .insert({
      report_id: reportId,
      admin_user_id: adminUserId,
      message,
      sent_via: sentVia,
      visible_to_reporter: true
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/dashboard/${reportId}`);
  return { success: true };
}
