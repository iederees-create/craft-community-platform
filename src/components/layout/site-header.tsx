"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/lib/auth/use-session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const links = [["/explore", "Explore"], ["/pattern-lab", "Pattern Lab"], ["/guidelines", "Charter"]] as const;

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useSession();
  const [open, setOpen] = useState(false);

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
    <header className="site-header">
      <div className="nav-wrap">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-face">•ᴗ•</span><span>Tuftlings</span>
        </Link>
        <button className="menu-button" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>
        <nav className={open ? "nav-links nav-open" : "nav-links"} aria-label="Primary navigation">
          {links.map(([href, label]) => <Link key={href} href={href} className={pathname === href ? "active" : ""} onClick={() => setOpen(false)}>{label}</Link>)}
          {loading ? null : user ? (
            <button type="button" onClick={handleSignOut}>Sign out</button>
          ) : (
            <>
              <Link href="/sign-in" onClick={() => setOpen(false)}>Sign in</Link>
              <Link href="/sign-up" className="nav-join" onClick={() => setOpen(false)}>Join the community</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
