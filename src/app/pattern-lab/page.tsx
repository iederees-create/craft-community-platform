import Link from "next/link";

const stages = [
  ["01", "Draft", "Component instructions, assembly order, and safety notes are written."],
  ["02", "Internal sample", "Both crochet and sewn versions are physically made and discrepancies recorded."],
  ["03", "Independent cohort", "Selected testers follow the pattern without live author intervention."],
  ["04", "Revision", "Confusing steps, sizing variance, and known issues are documented and corrected."],
  ["05", "Tested release", "A versioned release is published with scope, tester count, and remaining limitations."],
];

export default function PatternLabPage() {
  return (
    <main className="page-shell">
      <section className="page-intro lab-intro"><p className="overline">Pattern Lab</p><h1>No pattern earns “tested” by saying so.</h1><p>The Lab makes release status, evidence, revisions, and known limitations visible. Tuftlings Pattern 001 is still a prototype and is not available as a tested product.</p></section>
      <section className="lab-status"><div><span>Current release</span><strong>Pattern 001</strong></div><div><span>Status</span><strong className="status-pill">Prototype</strong></div><div><span>Independent tests</span><strong>0 completed</strong></div><div><span>Next gate</span><strong>Internal samples</strong></div></section>
      <section className="roadmap">
        {stages.map(([number, title, text], index) => <article key={title} className={index === 0 ? "current" : ""}><span>{number}</span><div><h2>{title}</h2><p>{text}</p></div><b>{index === 0 ? "In progress" : "Pending"}</b></article>)}
      </section>
      <section className="testing-note"><p className="section-index">Tester principles</p><h2>Evidence before launch.</h2><div className="testing-columns"><p>Testers receive the same versioned instructions, record completion context, and can report safety or clarity concerns privately.</p><p>Participation never requires public praise. Critical findings are kept in the record and publication waits for the defined approval gate.</p></div><Link href="/guidelines" className="text-link">Read the community commitments →</Link></section>
    </main>
  );
}
