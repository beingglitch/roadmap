import Link from "next/link";

export default function NotFound() {
  return (
    <main className="main">
      <div className="wrap card" style={{ padding: 32, maxWidth: 520 }}>
        <h1 style={{ marginTop: 0 }}>Not on the roadmap</h1>
        <p style={{ color: "var(--muted)" }}>That page does not exist.</p>
        <Link className="btn primary" href="/">Back to all roadmaps</Link>
      </div>
    </main>
  );
}
