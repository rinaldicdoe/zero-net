
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { HandCoins, Loader2, Upload } from "lucide-react";
import { filantropiSchema } from "@/lib/schemas";

type FilantropiValues = z.infer<typeof filantropiSchema>;

export default function FaiFilantropiPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<FilantropiValues>({
    resolver: zodResolver(filantropiSchema),
    defaultValues: {
      name: "",
      study_program: "",
      transfer_amount: 0,
    },
  });

  async function onSubmit(data: FilantropiValues) {
    if (!file) {
      toast.error("Mohon upload bukti transfer.");
      return;
    }
    
    setIsSubmitting(true);
    const supabase = createClient();

    try {
        // Upload proof
        const fileExt = file.name.split(".").pop();
        const fileName = `filantropi/${Date.now()}_${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
            .from("attachments") // Using same bucket for simplicity or use 'filantropi'
            .upload(fileName, file);
        
        if (uploadError) throw uploadError;

        const { error: insertError } = await supabase.from('fai_filantropi').insert({
            name: data.name,
            study_program: data.study_program,
            transfer_amount: data.transfer_amount,
            transfer_proof_path: fileName
        });

        if (insertError) throw insertError;

        toast.success("Donasi Filantropi berhasil dikirim! Terima kasih.");
        form.reset();
        setFile(null);
    } catch (error: any) {
        toast.error("Gagal mengirim data: " + error.message);
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-2xl border-emerald-100">
        <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                <HandCoins className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-800">FAI Filantropi</CardTitle>
            <CardDescription>Salurkan bantuan Anda untuk kemajuan bersama.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nama Donatur</FormLabel>
                        <FormControl><Input placeholder="Nama Lengkap" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="study_program"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Program Studi / Instansi</FormLabel>
                        <FormControl><Input placeholder="Asal Prodi" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="transfer_amount"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Jumlah Transfer (Rp)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormItem>
                    <FormLabel>Bukti Transfer</FormLabel>
                    <div className="flex items-center gap-2 border rounded-md p-2 bg-slate-50">
                        <Input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="border-0 shadow-none bg-transparent" />
                    </div>
                </FormItem>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                    Kirim Donasi
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
