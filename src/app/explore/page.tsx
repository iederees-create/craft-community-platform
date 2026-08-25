import Link from "next/link";

const concepts = [
  ["Pip", "Crochet · Pocket size", "Moss, oat & tomato", "Short ears / round feet", "mint"],
  ["Momo", "Sewn · Desk companion", "Plum, blush & ink", "Wide ears / tiny tail", "plum"],
  ["Tuck", "Crochet · Bag charm", "Ochre, cream & cocoa", "Leaf ears / long arms", "ochre"],
  ["Nell", "Sewn · Pocket size", "Sky, clay & oat", "Round ears / patch belly", "sky"],
];

export default function ExplorePage() {
  return (
    <main className="page-shell">
      <section className="page-intro">
        <p className="overline">Concept gallery</p>
        <h1>Meet the shape of things to come.</h1>
        <p>These are clearly labelled design examples—not uploads from real members. They demonstrate how future project pages could preserve materials, modifications, and remix permissions.</p>
      </section>
      <div className="status-banner"><strong>Prototype preview</strong><span>Real community projects will only appear after consented member uploads and moderation checks.</span></div>
      <section className="concept-grid">
        {concepts.map(([name, kind, palette, mods, color], index) => (
          <article className="concept-card" key={name}>
            <div className={`concept-figure figure-${color}`}><div className="mini-creature"><i/><b/><span/></div><small>EXAMPLE 0{index + 1}</small></div>
            <div className="concept-copy"><div><p>{kind}</p><h2>{name}</h2></div><dl><div><dt>Palette</dt><dd>{palette}</dd></div><div><dt>Modifications</dt><dd>{mods}</dd></div><div><dt>Remix status</dt><dd>Example: attribution required</dd></div></dl></div>
          </article>
        ))}
      </section>
      <section className="inline-cta"><div><p className="overline">Your version belongs here eventually</p><h2>Join before the first community cohort opens.</h2></div><Link className="button button-primary" href="/sign-up">Request early access</Link></section>
    </main>
  );
}
