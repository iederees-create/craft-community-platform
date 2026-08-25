import Link from "next/link";

const principles = [
  ["Make logs over metrics", "Record materials, modifications, mistakes, and what you would do differently. The useful details stay attached to the project."],
  ["Permission before remixing", "Every maker chooses clear remix terms. If permission is not given, the project remains showcase-only."],
  ["Small feeds with an end", "Chronological pages, finite results, and no public follower counts. The work gets the attention—not a popularity score."],
];

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="overline">A slower, kinder craft community</p>
          <h1>Little creatures.<br/><em>Big maker energy.</em></h1>
          <p className="hero-lede">
            Tuftlings is a home for modular pocket-creature patterns, thoughtful Make Logs,
            permission-aware remixes, and the people who bring them to life.
          </p>
          <div className="button-row">
            <Link href="/explore" className="button button-primary">Explore the concept</Link>
            <Link href="/sign-up" className="button button-secondary">Join early access</Link>
          </div>
          <p className="prototype-note"><span>●</span> Honest prototype: community features are being built and no activity shown is presented as real.</p>
        </div>
        <div className="hero-creatures" aria-label="Abstract Tuftlings character family illustration">
          <div className="creature creature-tall"><i/><b/><span/></div>
          <div className="creature creature-small"><i/><b/><span/></div>
          <div className="thread-line" />
          <p>One modular system<br/>Endless personalities</p>
        </div>
      </section>

      <section className="ticker" aria-label="Platform values">
        <span>MAKE SLOWLY</span><b>✦</b><span>SHARE GENEROUSLY</span><b>✦</b><span>REMIX WITH PERMISSION</span><b>✦</b><span>LEARN OUT LOUD</span>
      </section>

      <section className="home-section intro-section">
        <p className="section-index">01 / Why Tuftlings</p>
        <div>
          <h2>The internet has enough places to perform. This is a place to make.</h2>
          <p className="section-lede">Built around craft documentation instead of engagement tricks, Tuftlings helps makers preserve the story behind each object and learn from one another without turning creativity into a contest.</p>
        </div>
      </section>

      <section className="principles-grid">
        {principles.map(([title, text], index) => (
          <article key={title}>
            <span>0{index + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="home-section process-section">
        <div className="process-art" aria-hidden="true">
          <div className="stitch-grid" />
          <span>hook</span><span>make</span><span>note</span><span>share</span>
        </div>
        <div>
          <p className="section-index">02 / The making loop</p>
          <h2>A project page that remembers more than the final photo.</h2>
          <ol className="process-list">
            <li><b>Choose a pattern</b><span>Start from a tested release or join a clearly labelled test cohort.</span></li>
            <li><b>Keep a Make Log</b><span>Capture materials, tools, timing, changes, and lessons as you go.</span></li>
            <li><b>Set remix permission</b><span>Choose exactly how others may learn from or adapt your work.</span></li>
            <li><b>Ask and answer</b><span>Keep useful pattern help connected to the place it belongs.</span></li>
          </ol>
        </div>
      </section>

      <section className="home-section lab-callout">
        <div>
          <p className="section-index">03 / Pattern Lab</p>
          <h2>Patterns earn trust through testing—not hype.</h2>
          <p>Version history, tester evidence, known issues, and release status are visible by design. The first Tuftlings pattern remains a prototype until independent physical testing is complete.</p>
        </div>
        <Link href="/pattern-lab" className="round-link" aria-label="See the Pattern Lab roadmap">↗</Link>
      </section>

      <section className="closing-cta">
        <p className="overline">Early access</p>
        <h2>Help shape a community worth making for.</h2>
        <p>Join the prototype, read the charter, and tell us what thoughtful craft software should feel like.</p>
        <div className="button-row centered">
          <Link href="/sign-up" className="button button-light">Create an account</Link>
          <Link href="/guidelines" className="button button-outline-light">Read the charter</Link>
        </div>
      </section>
    </main>
  );
}
