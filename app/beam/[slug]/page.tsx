import { Metadata } from "next";

interface BeamPageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: BeamPageProps): Metadata {
  return {
    title: `Beam ${params.slug}`,
  };
}

export default function BeamPage({ params }: BeamPageProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/40">
        <h1 className="text-4xl font-semibold">Beam: {params.slug}</h1>
        <p className="mt-4 text-slate-300">Dynamic beam detail page.</p>
      </div>
    </main>
  );
}
