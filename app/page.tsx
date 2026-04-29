// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        ✨ Beam
      </h1>
      <p className="text-slate-300 mb-2 text-lg">
        Digital cosplay cards for the modern creator
      </p>
      <p className="text-slate-400 mb-8 max-w-md">
        Share your craft instantly via QR or NFC. No printing. No waste. 
        Just beam your persona.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/login"
          className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold text-slate-950 transition shadow-lg shadow-cyan-500/25"
        >
          🚀 Create Your Card
        </Link>
        <Link 
          href="/login"
          className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition border border-slate-700"
        >
          Sign In
        </Link>
      </div>
      
      <div className="mt-12 p-6 bg-slate-900/50 rounded-xl border border-slate-800 max-w-md">
        <p className="text-sm text-slate-400 mb-2">🎭 Built for cosplayers, by a cosplayer</p>
        <p className="text-xs text-slate-500">
          Portfolio project · No budget for printing cards? Neither did I.
        </p>
      </div>
      
      <p className="text-xs text-slate-600 mt-12">
        Made with Next.js + Supabase · Open source
      </p>
    </main>
  );
}