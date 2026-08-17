"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/use-session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function SiteHeader() {
  const router = useRouter();
  const { user, loading } = useSession();

  async function handleSignOut() {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch {
      // Supabase not configured — nothing to sign out of.
    }
  }

  return (
    <header className="border-b border-stone-200 bg-stone-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
          Tuftlings
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/guidelines" className="text-stone-600 hover:text-stone-900">
            Community Charter
          </Link>
          {loading ? null : user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-stone-300 px-4 py-1.5 font-medium text-stone-800 hover:bg-stone-100"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link href="/sign-in" className="text-stone-600 hover:text-stone-900">
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-amber-700 px-4 py-1.5 font-medium text-white hover:bg-amber-800"
              >
                Join
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
