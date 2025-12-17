
import { z } from "zod";

export const reportSchema = z.object({
  category_column: z.number().int().min(1).max(3),
  report_type: z.enum(['akademik', 'fasilitas', 'kekerasan_perundungan_pelecehan', 'administrasi']),
  reporter_name: z.string().min(2, "Nama lengkap wajib diisi"),
  study_program: z.string().min(2, "Program studi wajib diisi"),
  nim: z.string().min(5, "NIM wajib diisi"),
  incident_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Waktu kejadian tidak valid",
  }),
  whatsapp: z.string().min(9, "Nomor WhatsApp wajib diisi (min 9 digit)"),
  email: z.string().email("Format email tidak valid"),
  chronology: z.string().min(20, "Deskripsikan kronologi kejadian dengan jelas (min 20 karakter)"),
  preferred_feedback_channel: z.enum(['wa', 'dashboard', 'email']),
});

export type ReportFormValues = z.infer<typeof reportSchema>;

export const filantropiSchema = z.object({
    name: z.string().min(2, "Nama wajib diisi"),
    study_program: z.string().min(2, "Program studi wajib diisi"),
    transfer_amount: z.coerce.number().min(1000, "Nominal transfer minimal 1000"),
});
