
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ClipboardCopy, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SuccessPage() {
  const params = useParams();
  const ticket = params.ticket as string;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ticket);
    toast.success("Kode tiket disalin!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md w-full text-center border-green-200 bg-white/50 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <CardTitle className="text-2xl text-green-700">Laporan Diterima</CardTitle>
            <CardDescription>
              Terima kasih, laporan Anda telah masuk ke sistem kami.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gunakan kode tiket di bawah ini untuk memantau status laporan Anda.
              Simpan kode ini baik-baik.
            </p>
            <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg border border-slate-200 justify-center">
              <span className="font-mono text-xl font-bold tracking-wider text-slate-800">
                {ticket}
              </span>
              <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Salin">
                <ClipboardCopy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Link href="/track" className="w-full">
              <Button className="w-full gap-2" variant="default">
                <Search className="w-4 h-4" />
                Track Laporan Sekarang
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button className="w-full" variant="outline">
                Kembali ke Beranda
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
