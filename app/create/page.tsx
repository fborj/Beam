"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient as supabase } from "@/lib/supabase/client";


const randomSlug = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

export default function CreatePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    display_name: "",
    character_name: "",
    instagram: "",
    tiktok: "",
    twitter: "",
    photo: null as File | null,
  });

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserId(user.id);
    };
    loadUser();
  }, [router]);

  const handleChange = (field: string, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId || !form.photo) {
      setError("Please sign in and select a photo.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const filename = `${userId}-${Date.now()}-${form.photo.name}`;
    // Upload image file to Supabase Storage bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("card-photos")
      .upload(filename, form.photo, { upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setSubmitting(false);
      return;
    }

    // Retrieve public URL for uploaded image
    const { data: publicUrlData } = supabase.storage
      .from("card-photos")
      .getPublicUrl(uploadData.path);

    const slug = randomSlug();
    // Insert the new card entry into the cards table
    const { error: insertError } = await supabase.from("cards").insert({
      slug,
      user_id: userId,
      display_name: form.display_name,
      character_name: form.character_name,
      photo_url: publicUrlData.publicUrl,
      instagram: form.instagram,
      tiktok: form.tiktok,
      twitter: form.twitter,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    router.push(`/beam/${slug}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="mx-auto max-w-xl rounded-3xl bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
        <h1 className="text-3xl font-semibold">Create your beam card</h1>
        <p className="mt-2 text-sm text-slate-400">Add your info, upload a photo, and publish your card.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-200">Display name</label>
            <input
              value={form.display_name}
              onChange={(e) => handleChange("display_name", e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">Character name</label>
            <input
              value={form.character_name}
              onChange={(e) => handleChange("character_name", e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange("photo", e.target.files?.[0] ?? null)}
              className="mt-2 w-full text-slate-200"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-200">Instagram</label>
              <input
                value={form.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200">TikTok</label>
              <input
                value={form.tiktok}
                onChange={(e) => handleChange("tiktok", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">Twitter</label>
            <input
              value={form.twitter}
              onChange={(e) => handleChange("twitter", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !userId}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Publishing..." : "Publish beam card"}
          </button>
        </form>
      </div>
    </main>
  );
}
