import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <span className="inline-flex w-fit items-center rounded-full border border-amber-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
        Prototype — early access build
      </span>

      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
          A craft community, not an attention marketplace.
        </h1>
        <p className="max-w-xl text-lg text-stone-600">
          Tuftlings is being built around an original, modular pocket-creature craft pattern —
          crochet and sewn versions from one component system — supported by a members-only
          community for structured Make Logs, remix lineage, and hands-on pattern testing.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/sign-up"
          className="rounded-full bg-amber-700 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-800"
        >
          Create an account
        </Link>
        <Link
          href="/guidelines"
          className="rounded-full border border-stone-300 px-6 py-3 font-medium text-stone-800 transition-colors hover:bg-stone-100"
        >
          Read the Community Charter
        </Link>
      </div>

      <div className="grid gap-6 border-t border-stone-200 pt-10 sm:grid-cols-3">
        <div>
          <h2 className="font-semibold text-stone-900">Structured Make Logs</h2>
          <p className="mt-1 text-sm text-stone-600">
            Yarn or fabric, hook or needle size, modifications, and lessons learned — recorded
            alongside your finished project, not buried in a comment thread.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-stone-900">Remix lineage, explicit permission</h2>
          <p className="mt-1 text-sm text-stone-600">
            Every project states one of four remix permissions. No licence choice means showcase
            only — permission is never assumed.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-stone-900">Finite, chronological feeds</h2>
          <p className="mt-1 text-sm text-stone-600">
            No infinite scroll, no public follower counts, no streaks. Projects and useful help
            come first.
          </p>
        </div>
      </div>

      <p className="border-t border-stone-200 pt-6 text-sm text-stone-500">
        The pattern itself is still in prototype status and has not yet completed physical
        testing by independent testers. Nothing on this site represents real community activity
        until real members are here.
      </p>
    </main>
  );
}
