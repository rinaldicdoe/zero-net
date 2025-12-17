
"use client";

import { useState } from "react";
import { updateReportStatus } from "../actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StatusUpdateForm({ 
  reportId, 
  currentStatus 
}: { 
  reportId: string; 
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    if (status === currentStatus) {
      toast.info("Status tidak berubah");
      return;
    }

    setLoading(true);
    const result = await updateReportStatus(reportId, status);
    
    if (result.error) {
      toast.error("Gagal update status: " + result.error);
    } else {
      toast.success("Status berhasil diupdate!");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="masuk">Masuk</SelectItem>
          <SelectItem value="sedang_diproses">Sedang Diproses</SelectItem>
          <SelectItem value="terverifikasi">Terverifikasi</SelectItem>
          <SelectItem value="selesai_tertangani">Selesai Tertangani</SelectItem>
          <SelectItem value="ditolak">Ditolak</SelectItem>
        </SelectContent>
      </Select>
      <Button 
        onClick={handleUpdate} 
        disabled={loading || status === currentStatus}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Update Status"
        )}
      </Button>
    </div>
  );
}
