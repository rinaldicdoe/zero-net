
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Mail, Phone, FileText, Paperclip } from "lucide-react";
import Link from "next/link";
import StatusUpdateForm from "./status-update-form";
import FeedbackForm from "./feedback-form";

export const dynamic = 'force-dynamic';

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminClient();
  const authSupabase = await createClient();
  
  // Await params in Next.js 15
  const { id } = await params;
  
  // Get current admin user
  const { data: { user } } = await authSupabase.auth.getUser();
  
  // Fetch report with attachments and feedback
  const { data: report, error } = await supabase
    .from("reports")
    .select(`
      *,
      report_attachments (*),
      report_feedback (*)
    `)
    .eq("id", id)
    .single();

  if (error || !report) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'masuk': return 'bg-blue-500';
        case 'sedang_diproses': return 'bg-yellow-500';
        case 'terverifikasi': return 'bg-indigo-500';
        case 'selesai_tertangani': return 'bg-green-500';
        case 'ditolak': return 'bg-red-500';
        default: return 'bg-slate-500';
    }
  };

  const getStatusLabel = (status: string) => {
      return status.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Detail Laporan</h1>
              <p className="text-muted-foreground">Kode Tiket: {report.ticket_code}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(report.status)} text-white px-4 py-2 text-sm`}>
            {getStatusLabel(report.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Details */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pelapor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nama</p>
                      <p className="font-medium">{report.reporter_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">NIM</p>
                      <p className="font-medium">{report.nim}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{report.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <p className="font-medium">{report.whatsapp}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Waktu Kejadian</p>
                      <p className="font-medium">{new Date(report.incident_time).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Program Studi</p>
                      <p className="font-medium">{report.study_program}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chronology */}
            <Card>
              <CardHeader>
                <CardTitle>Kronologi Kejadian</CardTitle>
                <CardDescription>
                  Tipe: <span className="font-semibold capitalize">{report.report_type.replace(/_/g, ' ')}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.chronology}</p>
              </CardContent>
            </Card>

            {/* Attachments */}
            {report.report_attachments && report.report_attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paperclip className="w-5 h-5" />
                    Lampiran ({report.report_attachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {report.report_attachments.map((attachment: any) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <span className="text-sm font-medium">{attachment.file_name}</span>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/attachments/${attachment.file_path}`} target="_blank" rel="noopener noreferrer">
                            Lihat
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feedback History */}
            {report.report_feedback && report.report_feedback.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {report.report_feedback.map((feedback: any) => (
                    <div key={feedback.id} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm mb-2">{feedback.message}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Via: {feedback.sent_via.toUpperCase()}</span>
                        <span>{new Date(feedback.created_at).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Update Status */}
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusUpdateForm reportId={report.id} currentStatus={report.status} />
              </CardContent>
            </Card>

            {/* Send Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Kirim Feedback</CardTitle>
                <CardDescription>Channel: {report.preferred_feedback_channel.toUpperCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <FeedbackForm 
                  reportId={report.id} 
                  adminUserId={user?.id || ''} 
                  preferredChannel={report.preferred_feedback_channel}
                />
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Dibuat</p>
                  <p className="font-medium">{new Date(report.created_at).toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Terakhir Update</p>
                  <p className="font-medium">{new Date(report.updated_at).toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Kategori</p>
                  <p className="font-medium">Kolom {report.category_column}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
