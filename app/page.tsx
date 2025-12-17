
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, HeartHandshake, Building2, Search, ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Lapor Darurat & Pelanggaran",
    description: "Perundungan, kekerasan seksual, pelecehan, dan tindakan serius lainnya.",
    icon: ShieldAlert,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-200 hover:border-red-500",
    link: "/report/create?category=1",
  },
  {
    id: 2,
    title: "Pendampingan & Konseling",
    description: "Kehilangan, tekanan hidup, masalah pribadi, dan kondisi emosional.",
    icon: HeartHandshake,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-200 hover:border-blue-500",
    link: "/report/create?category=2",
  },
  {
    id: 3,
    title: "Masalah Fasilitas & Akademik",
    description: "Fasilitas kampus, layanan akademik, sistem administrasi, dosen.",
    icon: Building2,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-200 hover:border-amber-500",
    link: "/report/create?category=3",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-800 dark:text-slate-100 flex flex-col relative overflow-hidden">
      
      {/* Navbar / Header Lite */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            Z
          </div>
          <span className="font-bold text-xl tracking-tight">Zero Net Complaint</span>
        </div>
        <div className="flex gap-4">
          <Link href="/fai_filantropi">
            <Button variant="ghost" className="text-slate-600 dark:text-slate-300">
              FAI Filantropi
            </Button>
          </Link>
          <Link href="/track">
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              Track Laporan
            </Button>
          </Link>
          {/* Admin Login Link */}
          <Link href="/admin/login">
            <Button variant="ghost" className="hidden md:flex">
              Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mb-12"
        >
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium border border-indigo-100 mb-4 inline-block">
            Layanan Aspirasi Terintegrasi
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 pb-2">
            Suarakan Aspirasi Anda,<br /> Kami Siap Mendengar
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Platform aman dan terpercaya untuk melapor, berkonsultasi, dan menyampaikan aspirasi di lingkungan kampus. Privasi Anda adalah prioritas kami.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={item}>
              <Link href={cat.link} className="block h-full">
                <Card className={`h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border ${cat.border} bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm`}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${cat.bg} flex items-center justify-center mb-4`}>
                      <cat.icon className={`w-6 h-6 ${cat.color}`} />
                    </div>
                    <CardTitle className="text-xl mb-2">{cat.title}</CardTitle>
                    <CardDescription className="text-base">
                      {cat.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <div className={`text-sm font-medium flex items-center gap-1 ${cat.color}`}>
                      Buat Laporan <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-400/20 rounded-full blur-3xl" />
      </div>
    </main>
  );
}
