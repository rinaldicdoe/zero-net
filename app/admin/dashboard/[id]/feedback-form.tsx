
"use client";

import { useState } from "react";
import { sendFeedback } from "../actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FeedbackForm({ 
  reportId, 
  adminUserId,
  preferredChannel 
}: { 
  reportId: string; 
  adminUserId: string;
  preferredChannel: string;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Pesan tidak boleh kosong");
      return;
    }

    setLoading(true);
    const result = await sendFeedback(
      reportId, 
      adminUserId, 
      message, 
      preferredChannel as 'wa' | 'dashboard' | 'email'
    );
    
    if (result.error) {
      toast.error("Gagal mengirim feedback: " + result.error);
    } else {
      toast.success("Feedback berhasil dikirim!");
      setMessage("");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Tulis feedback untuk pelapor..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        className="resize-none"
      />
      <Button 
        onClick={handleSend} 
        disabled={loading || !message.trim()}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mengirim...
          </>
        ) : (
          `Kirim via ${preferredChannel.toUpperCase()}`
        )}
      </Button>
      {preferredChannel === 'wa' && (
        <p className="text-xs text-muted-foreground">
          💡 Feedback akan tersimpan di sistem. Anda perlu mengirim manual via WhatsApp ke: {/* Will show phone number */}
        </p>
      )}
    </div>
  );
}
