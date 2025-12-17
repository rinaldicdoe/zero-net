
"use client";

import { useState } from "react";
import { getReportStatus } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Search, CheckCircle2, Clock, XCircle, AlertCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function TrackPage() {
  const [ticket, setTicket] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReport(null);
    
    const result = await getReportStatus(ticket, email);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      setReport(result.data);
      toast.success("Laporan ditemukan.");
    }
    setLoading(false);
  };

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-8 mt-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Lacak Status Laporan
          </h1>
          <p className="text-slate-500">
            Masukkan Kode Tiket dan Email yang Anda gunakan saat melapor.
          </p>
        </div>

        {/* Search Form */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="ticket">Kode Tiket</Label>
                <Input 
                  id="ticket" 
                  placeholder="RPT-202X-XXXX" 
                  value={ticket}
                  onChange={(e) => setTicket(e.target.value)}
                  required 
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="email">Email Pelapor</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full md:w-auto gap-2" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Lacak
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Result Area */}
        {report && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Status Banner */}
            <Card className="overflow-hidden border-0 shadow-md">
                <div className={`h-2 w-full ${getStatusColor(report.status)}`} />
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl">Status: <span className={`${getStatusColor(report.status)} bg-opacity-10 text-opacity-100 text-white px-3 py-1 rounded-full text-sm font-semibold ml-2 inline-block`}>{getStatusLabel(report.status)}</span></CardTitle>
                            <CardDescription className="mt-2">Terakhir diperbarui: {new Date(report.updated_at).toLocaleString('id-ID')}</CardDescription>
                        </div>
                        {report.status === 'selesai_tertangani' && <CheckCircle2 className="text-green-500 w-10 h-10" />}
                        {report.status === 'ditolak' && <XCircle className="text-red-500 w-10 h-10" />}
                        {report.status === 'sedang_diproses' && <Loader2 className="text-yellow-500 w-10 h-10 animate-spin-slow" />}
                    </div>
                </CardHeader>
            </Card>

            {/* Admin Feedback */}
            {report.report_feedback && report.report_feedback.length > 0 && (
                <Card className="border-l-4 border-l-indigo-500 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-indigo-500" />
                            Respon Admin
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {report.report_feedback.map((fb: any) => (
                            <div key={fb.id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">{fb.message}</p>
                                <p className="text-xs text-slate-500 text-right">{new Date(fb.created_at).toLocaleString('id-ID')}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Report Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Detail Laporan</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="text-muted-foreground">Pelapor</Label>
                        <p className="font-medium">{report.reporter_name} ({report.nim})</p>
                    </div>
                    <div>
                        <Label className="text-muted-foreground">Program Studi</Label>
                        <p className="font-medium">{report.study_program}</p>
                    </div>
                    <div>
                        <Label className="text-muted-foreground">Kategori</Label>
                        <p className="font-medium capitalize">{report.report_type.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                        <Label className="text-muted-foreground">Waktu Kejadian</Label>
                        <p className="font-medium">{new Date(report.incident_time).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="md:col-span-2">
                        <Label className="text-muted-foreground">Kronologi</Label>
                        <p className="font-medium mt-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-md whitespace-pre-wrap">{report.chronology}</p>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
