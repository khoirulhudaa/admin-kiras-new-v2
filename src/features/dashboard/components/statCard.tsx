// src/features/student/components/StatCard.tsx
import { motion } from "framer-motion";

export const PremiumCard = ({ children, className = "", delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/5 to-transparent backdrop-blur-md p-4 shadow-2xl ${className}`}
  >
    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl" />
    {children}
  </motion.div>
);

export const StatItem = ({ icon: Icon, label, value, colorClass = "text-white" }: any) => (
  <div className="group flex items-center gap-5 transition-all">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-400 ring-1 ring-blue-400/20">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-[12px] uppercase font-black tracking-[0.2em] text-zinc-500">{label}</p>
      <p className={`text-sm uppercase font-black mt-0.5 tracking-tight ${colorClass}`}>{value ?? "—"}</p>
    </div>
  </div>
);