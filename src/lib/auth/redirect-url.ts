export function authCallbackUrl(next = "/onboarding") {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const origin = configured || window.location.origin;
  const base = process.env.NODE_ENV === "production" ? "/craft-community-platform" : "";
  return `${origin}${base}/auth/callback/?next=${encodeURIComponent(next)}`;
}
