"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/use-session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading, configError } = useSession();
  const [displayName, setDisplayName] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [charterAcknowledged, setCharterAcknowledged] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setStatus("loading");
    setErrorMessage(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, display_name: displayName, age_confirmed_18: ageConfirmed });

      if (error) {
        setStatus("error");
        setErrorMessage(error.message);
        return;
      }

      router.push("/");
    } catch (error: unknown) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Could not save your profile right now.");
    }
  }

  if (configError) {
    return <p className="p-8 text-red-700">{configError}</p>;
  }

  if (loading) {
    return <p className="p-8 text-stone-600">Loading…</p>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <p className="text-stone-700">You need to sign in before completing onboarding.</p>
        <Link href="/sign-in" className="mt-4 inline-block font-medium text-amber-700 underline">
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Welcome to Tuftlings</h1>
        <p className="mt-2 text-stone-600">
          This community is for members 18 and older. A couple of quick things before you&apos;re in.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="displayName" className="text-sm font-medium text-stone-800">
            Display name
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            minLength={2}
            maxLength={40}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="rounded-md border border-stone-300 px-3 py-2 text-stone-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/40"
          />
        </div>
        <label className="flex items-start gap-3 text-sm text-stone-800">
          <input
            type="checkbox"
            required
            checked={ageConfirmed}
            onChange={(event) => setAgeConfirmed(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-stone-400 text-amber-700 focus:ring-amber-600/40"
          />
          <span>I confirm that I am 18 years of age or older.</span>
        </label>
        <label className="flex items-start gap-3 text-sm text-stone-800">
          <input
            type="checkbox"
            required
            checked={charterAcknowledged}
            onChange={(event) => setCharterAcknowledged(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-stone-400 text-amber-700 focus:ring-amber-600/40"
          />
          <span>
            I have read and agree to the{" "}
            <Link href="/guidelines" className="font-medium text-amber-700 underline" target="_blank">
              Community Charter
            </Link>
            .
          </span>
        </label>
        {status === "error" && errorMessage ? (
          <p role="alert" className="text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status === "loading" || !ageConfirmed || !charterAcknowledged}
          className="rounded-full bg-amber-700 px-5 py-2.5 font-medium text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Saving…" : "Enter Tuftlings"}
        </button>
      </form>
    </div>
  );
}
