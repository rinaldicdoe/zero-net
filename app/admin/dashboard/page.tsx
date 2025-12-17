
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import Link from "next/link"; // Correct import

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = createAdminClient();
  
  // Fetch reports
  const { data: reports, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500">Error loading data: {error.message}</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "masuk": return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Masuk</Badge>;
      case "sedang_diproses": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Proses</Badge>;
      case "selesai_tertangani": return <Badge variant="secondary" className="bg-green-100 text-green-700">Selesai</Badge>;
      case "ditolak": return <Badge variant="destructive">Ditolak</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500">Overview Laporan Masuk</p>
        </div>
        <div className="flex gap-2">
            <form action="/api/auth/logout" method="POST">
              <Button type="submit" variant="outline">Logout</Button>
            </form>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Laporan</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{reports?.length || 0}</div></CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Perlu Tindakan</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{reports?.filter((r: any) => r.status === 'masuk').length || 0}</div></CardContent>
        </Card>
        {/* More stats... */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Laporan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Tiket</TableHead>
                <TableHead>Pelapor</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports?.map((report: any) => (
                <TableRow key={report.id}>
                  <TableCell>{new Date(report.created_at).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell className="font-mono text-xs">{report.ticket_code}</TableCell>
                  <TableCell>
                    <div className="font-medium">{report.reporter_name}</div>
                    <div className="text-xs text-muted-foreground">{report.study_program}</div>
                  </TableCell>
                  <TableCell>{report.report_type}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/dashboard/${report.id}`}>
                      <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Detail
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {reports?.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Belum ada laporan masuk</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
