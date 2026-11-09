import type { Metadata } from "next";
import Link from "next/link";
import { cv } from "@/content/cv";
import { FourierWave } from "@/components/web/FourierWave";
import { SystemTower } from "@/components/work/SystemTower";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Two shelves: a time-tracking platform in progress, and the projects that did not make it — and why.",
};

function Sub({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <div className="flex items-baseline gap-4">
        <h3 className="font-mono text-[11px] font-semibold tracking-[0.28em] text-dim uppercase">
          {title}
        </h3>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <div className="mt-5 flex flex-col gap-4 text-[15px] leading-[1.75] text-fog/80">
        {children}
      </div>
    </section>
  );
}

function ProjectHeader({
  index,
  title,
  status,
  tone = "active",
}: {
  index: string;
  title: string;
  status: string;
  tone?: "active" | "dormant";
}) {
  return (
    <div className="border-b border-white/10 pb-5">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-ember">
          {index}
        </span>
        <h2 className="text-[clamp(1.7rem,4.4vw,2.6rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
          {title}
        </h2>
      </div>

      <div className="mt-3.5">
        <span
          className={`rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.16em] uppercase ${
            tone === "active"
              ? "border-ember/40 text-ember"
              : "border-white/12 text-fog/55"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function Decision({
  choice,
  children,
}: {
  choice: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-l border-white/10 pl-5">
      <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-ember uppercase">
        {choice}
      </p>
      <p className="mt-2 text-[15px] leading-[1.7] text-fog/75">{children}</p>
    </div>
  );
}

const STACK = [
  "TypeScript",
  "Next.js",
  "Postgres",
  "Redis",
  "Docker",
  "Prometheus",
  "Grafana",
  "Loki",
  "Playwright",
  "k6",
];

export default function WorkPage() {
  return (
    <div className="web-canvas relative min-h-screen text-fog">
      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-night/60 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-[900px] items-center justify-between px-5 sm:px-8">
            <Link href="/" className="group flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded bg-ember font-mono text-[11px] font-bold text-night">
                MT
              </span>
              <span className="hidden font-mono text-[11px] font-medium tracking-[0.2em] text-dim uppercase transition-colors group-hover:text-fog sm:block">
                Mihailo Tomišić
              </span>
            </Link>
            <div className="flex items-center gap-5">
              <a
                href="#ai"
                className="hidden font-mono text-[11px] font-medium tracking-[0.16em] text-dim uppercase transition-colors hover:text-ember sm:inline"
              >
                AI
              </a>
              <Link
                href="/"
                className="font-mono text-[11px] font-medium tracking-[0.16em] text-dim uppercase transition-colors hover:text-ember"
              >
                ← CV
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[820px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="font-mono text-[11px] font-semibold tracking-[0.3em] text-ember uppercase">
            Work
          </p>

          <h1 className="mt-6 text-[clamp(2.4rem,7vw,4rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
            Two shelves.
          </h1>

          <p className="mt-6 max-w-[58ch] text-[16.5px] leading-[1.7] text-fog/75">
            Most portfolios only show the hits. This one has two shelves: what
            made it, and what didn&apos;t. The second shelf is longer — and it
            isn&apos;t closed either.
          </p>

          {/* index — the waveform sits behind the project cards */}
          <div className="relative mt-12 py-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.65] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]"
            >
              <FourierWave />
            </div>

            <nav
              aria-label="Projects"
              className="relative z-10 grid gap-3 sm:grid-cols-2"
            >
            <a
              href="#time-tracking"
              className="group flex flex-col justify-between gap-4 rounded-lg border border-white/10 bg-transparent p-5 transition-colors hover:border-ember/40"
            >
              <span className="font-mono text-[11px] tracking-[0.18em] text-ember">
                01
              </span>
              <span>
                <span className="block text-[15px] leading-snug font-medium text-fog">
                  Time tracking for small teams
                </span>
                <span className="mt-1 block font-mono text-[11px] tracking-[0.14em] text-fog/50 uppercase">
                  In progress
                </span>
              </span>
            </a>

            <a
              href="#not-shipped"
              className="group flex flex-col justify-between gap-4 rounded-lg border border-white/10 bg-transparent p-5 transition-colors hover:border-ember/40"
            >
              <span className="font-mono text-[11px] tracking-[0.18em] text-ember">
                02
              </span>
              <span>
                <span className="block text-[15px] leading-snug font-medium text-fog">
                  Things that didn&apos;t become products
                </span>
                <span className="mt-1 block font-mono text-[11px] tracking-[0.14em] text-fog/50 uppercase">
                  Dormant
                </span>
              </span>
              </a>
            </nav>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* 01 */}
          {/* ---------------------------------------------------------------- */}
          <section id="time-tracking" className="mt-20 scroll-mt-24">
            <ProjectHeader
              index="01"
              title="Time tracking for small teams"
              status="In progress"
            />

            <p className="mt-6 max-w-[62ch] text-[16.5px] leading-[1.7] text-fog/75">
              A platform for recording billable hours against projects and
              clients, with the reporting layer finance needs to trust the
              numbers.
            </p>

            <dl className="mt-7 grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2.5 border-t border-white/10 pt-5 font-mono text-[11px]">
              <dt className="text-fog/60">ROLE</dt>
              <dd className="text-fog/90">
                Sole engineer — architecture, build, operations
              </dd>
              <dt className="text-fog/60">STATUS</dt>
              <dd className="text-fog/90">Running in a private environment</dd>
              <dt className="text-fog/60">YEAR</dt>
              <dd className="text-fog/90">2025 — present</dd>
            </dl>

            <div className="mt-7 flex flex-wrap gap-2">
              {STACK.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] tracking-[0.1em] text-dim uppercase"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-12">
              <Sub title="The problem">
                <p>
                  Small studios bill by the hour, but the systems they use to
                  record those hours are usually a spreadsheet or a form bolted
                  onto a project tool. Month-end becomes a reconciliation
                  exercise: hours are missing, rounding is inconsistent, and
                  nobody can prove what was billed against what was delivered.
                </p>
                <p>
                  The goal is a single place where time is captured at the point
                  of work, and where the numbers are structured enough to report
                  on without a human re-keying them later.
                </p>
              </Sub>

              <Sub title="Constraints">
                <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-ember/60">
                  <li>One engineer, one host, no dedicated operations time.</li>
                  <li>
                    A time entry is a financial record — integrity matters more
                    than feature count.
                  </li>
                  <li>
                    Must stay cheap to run: no per-seat managed services on the
                    critical path.
                  </li>
                  <li>Deployments have to be boring and reversible.</li>
                </ul>
              </Sub>

              <Sub title="Shape of the system">
              <SystemTower />
                <p>
                  One deployable unit, one database, one cache. Everything runs
                  in Docker Compose on a single host, fronted by a tunnel so no
                  origin port is exposed.
                </p>
              </Sub>

              <Sub title="Decisions and trade-offs">
                <div className="mt-1 flex flex-col gap-6">
                  <Decision choice="Postgres over a document store">
                    Time entries relate to projects, clients and rates. That is
                    a join, and reporting is SQL. A document store would push
                    that work into application code and make the numbers harder
                    to audit.
                  </Decision>
                  <Decision choice="Redis as a cache, never as the source of truth">
                    Rate limiting and short-lived lookups live in Redis.
                    Anything that must survive a restart lives in Postgres.
                    Keeping that boundary strict means a Redis flush is an
                    inconvenience, not an incident.
                  </Decision>
                  <Decision choice="Docker Compose over Kubernetes — for now">
                    One host, predictable load, a single deployable. Kubernetes
                    earns its complexity when there are many services, many
                    hosts, or a team that needs a shared deployment contract. At
                    this size it would add ingress, scheduling and secret
                    management without solving a problem the system actually
                    has. The containers are ordinary Docker images, so the move
                    stays available when the scale justifies it.
                  </Decision>
                  <Decision choice="Observability from the first deploy">
                    Container metrics, host metrics, log aggregation and
                    synthetic probes were in place before the second feature. A
                    one-person operation cannot find out about failures from
                    users.
                  </Decision>
                </div>
              </Sub>

              <Sub title="Operations">
                <p>
                  Health endpoints are probed from outside the container, so a
                  hung process and a lost database connection look different.
                  Migrations run as an explicit deploy step rather than on
                  application boot, which keeps restarts fast and failures
                  obvious.
                </p>
                <p>
                  The write path was load tested with k6 before being trusted
                  with real data, and the database is tuned for the queries that
                  actually run — slow-statement logging feeds the same log
                  pipeline as the application.
                </p>
              </Sub>

              <Sub title="What's next">
                <p>
                  Reporting exports, a mobile-first capture flow, and a proper
                  permissions model. The current build is deliberately narrow:
                  get the data model and the operational story right before
                  widening the surface.
                </p>
              </Sub>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* 02 */}
          {/* ---------------------------------------------------------------- */}
          <section id="not-shipped" className="mt-24 scroll-mt-24">
            <ProjectHeader
              index="02"
              title="Things that didn't become products"
              status="Dormant"
              tone="dormant"
            />

            <p className="mt-6 max-w-[58ch] text-[16.5px] leading-[1.7] text-fog/75">
              The second shelf. Some of these ran out of market, some ran out of
              time. Every one of them changed how I build — which is the part
              worth writing down.
            </p>

            <div className="mt-10 rounded-lg border border-white/10 bg-white/[0.02] p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-[22px] font-semibold">renovateIT</h3>
                <span className="font-mono text-[11px] tracking-[0.18em] text-fog/55 uppercase">
                  Not launched
                </span>
              </div>

              <p className="mt-2 text-[15px] leading-[1.7] text-fog/75">
                A marketplace and operations app for small renovation crews: job
                intake, quoting, and crew scheduling in one place.
              </p>

              <p className="mt-3 font-mono text-[11px] tracking-[0.12em] text-dim uppercase">
                NestJS · Next.js · Postgres · Redis
              </p>

              <p className="mt-4 text-[15px] leading-[1.7] text-fog/75">
                <span className="font-medium text-fog/90">Why I stopped:</span>{" "}
                it was close to complete when the supply side turned out to be
                already consolidated by established marketplaces —
                KupujemProdajem, daibau.rs and a few others. Winning would have
                meant buying both sides of a two-sided market, which is not a
                solo-builder budget. The software was never the bottleneck;
                distribution was.
              </p>
            </div>

            <p className="mt-8 max-w-[62ch] text-[15px] leading-[1.75] text-fog/75">
              Before that: a pair of real-estate scrapers and a kanban clone
              built to learn a stack. None of them became products, and none
              were wasted — the scrapers are why I am comfortable making brittle
              external data reliable.
            </p>

            <div className="mt-8 rounded-lg border border-ember/25 bg-ember/[0.04] p-6">
              <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-ember uppercase">
                Dormant, not dead
              </p>
              <p className="mt-3 max-w-[58ch] text-[15px] leading-[1.75] text-fog/80">
                Ideas come back when the timing, the data, or the scope changes.
                renovateIT included — a narrower version, for one niche, is
                still a better bet than the original. I don&apos;t tend to leave
                things alone, and I&apos;d rather retry something with better
                information than pretend it never happened.
              </p>
            </div>
          </section>

          {/* AI practice */}
        <section id="ai" className="mt-24 scroll-mt-24">
          <div className="flex items-baseline gap-4">
            <h2 className="font-mono text-[11px] font-semibold tracking-[0.28em] text-dim uppercase">
              AI, in practice
            </h2>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mt-5 flex flex-col gap-4 text-[15px] leading-[1.75] text-fog/80">
            <p>
              Most of my AI use is in delivery, not in the product. Right now
              I&apos;m riding the DeepSeek wave, harnessing it alongside a bunch of MCPs
              servers to plan and edit across files while I review the diffs and
              run the tests. Ships aren&apos;t built for quiet seas — in two
              months this stack will probably look completely different. The
              tool writes; I decide.
            </p>
            <p>
              That only works because there is a signal for “done”. This
              site’s build fails if the CV PDF is not exactly one page, or if it
              comes back as an image instead of text. Write the check first,
              then let the agent iterate against it — an agent without a
              fitness function is just guessing.
            </p>
            <p>
              Cost and latency get designed rather than measured afterwards:
              cache what repeats, keep the model off the hot path where the
              answer does not need it, and cap or stream what does come back.
            </p>
            <p>
              Where I would not put one: anything that has to be auditable. Time
              entries and money stay deterministic — a model that occasionally
              produces a plausible wrong number is worse than no model. The
              useful places are narrower: summarising a week, extracting a
              project code from free text, drafting a description — each with
              schema validation and a human confirming.
            </p>
            <p>
              I also build for agents as consumers, not only as tools: an{' '}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-fog/90">
                llms.txt
              </code>
              , JSON-LD, and read-only WebMCP tools on this site. Same question
              as an API — what should an agent be allowed to do, and what should
              it be told?
            </p>
          </div>
        </section>

        {/* CTA */}
          <div className="mt-20 border-t border-white/10 pt-8">
            <p className="max-w-[52ch] text-[15px] leading-[1.7] text-fog/70">
              Happy to walk you through the schema, the failure modes, and the
              parts that were wrong the first time — or the post-mortem on the
              ones that didn&apos;t ship.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-5">
              <a
                href={`mailto:${cv.email}?subject=${encodeURIComponent(
                  "Walkthrough — time tracking platform",
                )}`}
                className="rounded-full bg-ember px-5 py-2.5 text-[13.5px] font-semibold text-night transition-opacity hover:opacity-90"
              >
                Request a walkthrough →
              </a>
              <Link
                href="/"
                className="text-[13.5px] text-fog/70 transition-colors hover:text-ember"
              >
                Back to the CV
              </Link>
            </div>
          </div>
  
        <section className="mt-20">
          <div className="flex items-baseline gap-4">
            <h2 className="font-mono text-[11px] font-semibold tracking-[0.28em] text-dim uppercase">
              Colophon
            </h2>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mt-5 flex flex-col gap-4 text-[15px] leading-[1.75] text-fog/80">
            <p>
              Next.js 16 static export, Tailwind 4, served by static-web-server
              behind a Cloudflare Tunnel. No CMS, no database.
            </p>
            <p>
              DeepSeek and OpenCode were coding assistants for scoped tasks.
              Every change was reviewed, and the build fails if the CV PDF is
              not exactly one page or comes back as an image instead of text.
            </p>
            <p>
              The line-sidebar pattern comes from React Bits. The canvas
              animations began as prototypes and were rebuilt for this site.
              Layout and copy are mine.
            </p>
          </div>
        </section>
      </main>
      </div>
    </div>
  );
}
