"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { authCallbackUrl } from "@/lib/auth/redirect-url";

export function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "confirm-email">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: authCallbackUrl() } });

      if (error) {
        setStatus("error");
        setErrorMessage(error.message);
        return;
      }

      if (!data.session) {
        // Email confirmation is required before a session exists.
        setStatus("confirm-email");
        return;
      }

      router.push("/onboarding");
    } catch (error: unknown) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Sign up is not available right now.");
    }
  }

  if (status === "confirm-email") {
    return (
      <p className="text-stone-700">
        Check <span className="font-medium">{email}</span> for a confirmation link. Once confirmed, sign
        in and you&apos;ll be taken through onboarding.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-stone-800">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-md border border-stone-300 px-3 py-2 text-stone-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/40"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-stone-800">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-md border border-stone-300 px-3 py-2 text-stone-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/40"
        />
        <p className="text-xs text-stone-500">At least 8 characters. This community is for members 18 and older.</p>
      </div>
      {status === "error" && errorMessage ? (
        <p role="alert" className="text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-amber-700 px-5 py-2.5 font-medium text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
