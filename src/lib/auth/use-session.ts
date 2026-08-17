"use client";

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface SessionState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  configError: string | null;
}

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({
    session: null,
    user: null,
    loading: true,
    configError: null,
  });

  useEffect(() => {
    let isMounted = true;
    let supabase;

    try {
      supabase = getSupabaseBrowserClient();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Supabase is not configured.";
      queueMicrotask(() => {
        if (isMounted) {
          setState({ session: null, user: null, loading: false, configError: message });
        }
      });
      return () => {
        isMounted = false;
      };
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setState({
        session: data.session,
        user: data.session?.user ?? null,
        loading: false,
        configError: null,
      });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setState({ session, user: session?.user ?? null, loading: false, configError: null });
    });
    const unsubscribe = () => listener.subscription.unsubscribe();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return state;
}
