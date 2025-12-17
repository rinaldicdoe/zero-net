
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { reportSchema, ReportFormValues } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

function CreateReportForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      category_column: categoryParam ? parseInt(categoryParam) : 1,
      report_type: "akademik",
      reporter_name: "",
      study_program: "",
      nim: "",
      incident_time: "",
      whatsapp: "",
      email: "",
      chronology: "",
      preferred_feedback_channel: "dashboard", 
    },
  });

  const generateTicket = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `RPT-${date}-${random}`;
  };

  async function onSubmit(data: ReportFormValues) {
    setIsSubmitting(true);
    const supabase = createClient();
    const ticketCode = generateTicket();

    try {
      // 1. Insert Report
      const { data: reportData, error: reportError } = await supabase
        .from("reports")
        .insert({
          ticket_code: ticketCode,
          category_column: data.category_column,
          report_type: data.report_type,
          reporter_name: data.reporter_name,
          study_program: data.study_program,
          nim: data.nim,
          incident_time: new Date(data.incident_time).toISOString(),
          whatsapp: data.whatsapp,
          email: data.email,
          chronology: data.chronology,
          preferred_feedback_channel: data.preferred_feedback_channel,
          status: "masuk",
        })
        .select()
        .single();

      if (reportError) throw reportError;

      // 2. Upload Files if any
      if (files && files.length > 0 && reportData) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileExt = file.name.split(".").pop();
          const fileName = `${reportData.id}/${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("attachments")
            .upload(filePath, file);

          if (uploadError) {
            console.error("Upload failed", uploadError);
            toast.error(`Gagal upload file ${file.name}`);
            continue; 
          }

          await supabase.from("report_attachments").insert({
            report_id: reportData.id,
            file_path: filePath,
            file_name: file.name,
          });
        }
      }

      toast.success("Laporan berhasil dikirim!");
      router.push(`/success/${ticketCode}`);
    } catch (error: any) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
          Formulir Pelaporan Baru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reporter_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIM</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor Induk Mahasiswa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="study_program"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Studi</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Teknik Informatika" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="08xxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="report_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Laporan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="akademik">Akademik</SelectItem>
                        <SelectItem value="fasilitas">Fasilitas</SelectItem>
                        <SelectItem value="kekerasan_perundungan_pelecehan">
                          Kekerasan / Perundungan
                        </SelectItem>
                        <SelectItem value="administrasi">Administrasi</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="incident_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu Kejadian</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="chronology"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kronologi Kejadian</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ceritakan detail kejadian..."
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferred_feedback_channel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih Channel Feedback</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="wa">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="dashboard">Dashboard Web (Track)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Kami akan menghubungi Anda melalui channel ini.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Lampiran Bukti (Opsional)</FormLabel>
              <div className="flex items-center gap-2">
                <Input 
                  type="file" 
                  multiple 
                  onChange={(e) => setFiles(e.target.files)} 
                  className="cursor-pointer"
                />
                <Upload className="w-4 h-4 text-muted-foreground" />
              </div>
              <FormDescription>Bisa upload foto atau dokumen pendukung.</FormDescription>
            </FormItem>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Kirim Laporan"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function CreateReportPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-center">Loading form...</div>}>
         <CreateReportForm />
      </Suspense>
    </div>
  );
}
