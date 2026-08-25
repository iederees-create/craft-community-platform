import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div><Link href="/" className="footer-brand"><span>•ᴗ•</span> Tuftlings</Link><p>A slower, kinder home for pocket-creature makers.</p></div>
      <div><strong>Discover</strong><Link href="/explore">Explore</Link><Link href="/pattern-lab">Pattern Lab</Link></div>
      <div><strong>Community</strong><Link href="/guidelines">Charter</Link><Link href="/sign-up">Early access</Link></div>
      <div><strong>Status</strong><p>Prototype build<br/>No fabricated activity<br/>18+ community</p></div>
      <small>© 2026 Tuftlings. Built with care, tested in public.</small>
    </footer>
  );
}
