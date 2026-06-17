"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const navItems = [
  { label: "About Us", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const projects = [
  {
    title: "The Palm Meridian",
    type: "Waterfront Residences",
    location: "Palm Jumeirah",
    year: "2026",
    tone: "from-[#d7b275]/28 via-transparent to-transparent",
  },
  {
    title: "Al Wasl Civic Tower",
    type: "Mixed-Use High-Rise",
    location: "Sheikh Zayed Road",
    year: "2025",
    tone: "from-[#8cb9c7]/24 via-transparent to-transparent",
  },
  {
    title: "Nad Al Sheba Atrium",
    type: "Hospitality & Wellness",
    location: "Meydan District",
    year: "2026",
    tone: "from-[#c88968]/24 via-transparent to-transparent",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const renderY = useTransform(scrollYProgress, [0, 0.55], [40, -95]);
  const renderScale = useTransform(scrollYProgress, [0, 0.55], [0.92, 1.08]);
  const renderOpacity = useTransform(scrollYProgress, [0, 0.35, 0.7], [0.55, 1, 0.72]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#050505] text-[#f7f1e6]">
      <style jsx global>{`
        .site-header,
        .footer {
          display: none !important;
        }
      `}</style>

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#050505]/72 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="group flex items-center gap-3" aria-label="Arcluxe Studio home">
            <span className="grid h-10 w-10 place-items-center border border-[#c9a86a]/45 bg-white/[0.03] text-sm font-semibold text-[#d8b877]">
              AS
            </span>
            <span className="leading-none">
              <span className="block text-base font-semibold tracking-[0.16em] text-white">ARCLUXE</span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.32em] text-white/45">Studio Dubai</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                className="text-sm text-white/65 transition hover:text-[#d8b877]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/70 transition hover:border-[#d8b877]/60 hover:text-white">
              EN / عربي
            </button>
            <a
              href="#contact"
              className="hidden rounded-full bg-[#d8b877] px-5 py-2.5 text-sm font-semibold text-[#080705] transition hover:bg-[#f0cf89] sm:inline-flex"
            >
              Start a Brief
            </a>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative min-h-screen px-5 pt-32 sm:px-8 lg:pt-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(216,184,119,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%)]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050505] to-transparent" />

          <div className="relative mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[1.03fr_0.97fr] lg:items-end">
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.12 }}
              className="pb-8"
            >
              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="mb-7 text-xs font-semibold uppercase tracking-[0.34em] text-[#d8b877]"
              >
                Structural elegance for Dubai landmarks
              </motion.p>
              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-5xl text-6xl font-semibold leading-[0.92] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl xl:text-9xl"
              >
                Engineering towers with cinematic precision.
              </motion.h1>
              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="mt-8 max-w-xl text-base leading-8 text-white/62 sm:text-lg"
              >
                Arcluxe Studio is a fictional Dubai-based engineering consultancy shaping resilient
                structures, premium interiors, and high-performance building systems for ambitious clients.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#projects"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#050505] transition hover:bg-[#d8b877]"
                >
                  View Projects
                </a>
                <a
                  href="#about"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white/80 transition hover:border-white/45 hover:text-white"
                >
                  About the Studio
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              style={{ y: renderY, scale: renderScale, opacity: renderOpacity }}
              className="relative min-h-[460px] overflow-hidden border border-white/10 bg-[#101010] shadow-2xl shadow-black/50 sm:min-h-[560px] lg:min-h-[650px]"
              aria-label="Abstract scroll-driven architectural building render placeholder"
            >
              <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_70%_10%,rgba(216,184,119,0.22),transparent_26%)]" />
              <div className="absolute inset-x-10 bottom-0 top-16 border-x border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02]" />
              <div className="absolute bottom-0 left-[19%] h-[72%] w-[19%] border-x border-t border-white/12 bg-white/[0.035]" />
              <div className="absolute bottom-0 left-[40%] h-[86%] w-[23%] border-x border-t border-[#d8b877]/30 bg-[#d8b877]/[0.035]" />
              <div className="absolute bottom-0 right-[15%] h-[61%] w-[18%] border-x border-t border-white/12 bg-white/[0.025]" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/65 to-transparent" />
              <div className="absolute left-6 top-6 rounded-full border border-white/12 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/55">
                Scroll Render / 01
              </div>
              <div className="absolute bottom-8 left-6 right-6 grid grid-cols-3 gap-3">
                {["Wind Load", "Facade Logic", "MEP Flow"].map((metric) => (
                  <div className="border border-white/10 bg-black/35 p-4 backdrop-blur" key={metric}>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">{metric}</span>
                    <strong className="mt-2 block text-lg text-white">Optimized</strong>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0,transparent_12%,rgba(255,255,255,0.06)_12.2%,transparent_12.5%),linear-gradient(0deg,transparent_0,transparent_11%,rgba(255,255,255,0.045)_11.2%,transparent_11.5%)] bg-[length:76px_76px]" />
            </motion.div>
          </div>
        </section>

        <section id="about" className="relative px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d8b877]">About Us</p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                Dubai engineering consultancy for architecture that performs.
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="grid gap-6 text-white/62"
            >
              <p className="max-w-3xl text-lg leading-8">
                We partner with developers, architects, and hospitality groups across the UAE to translate
                bold concepts into buildable, efficient, and memorable environments.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["18+", "Concept schemes"],
                  ["7", "Dubai districts"],
                  ["24h", "Brief response"],
                ].map(([value, label]) => (
                  <div className="border border-white/10 bg-white/[0.035] p-5" key={label}>
                    <strong className="block text-3xl text-white">{value}</strong>
                    <span className="mt-2 block text-sm text-white/50">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="projects" className="px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d8b877]">Projects</p>
                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                  Selected premium commissions.
                </h2>
              </div>
              <p className="max-w-md text-white/55">
                Mock portfolio concepts exploring vertical living, civic hospitality, and climate-aware
                luxury across Dubai.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.article
                  initial={{ opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.65, delay: index * 0.12 }}
                  className="group overflow-hidden border border-white/10 bg-[#0d0d0d]"
                  key={project.title}
                >
                  <div className={`relative h-80 bg-gradient-to-br ${project.tone}`}>
                    <div className="absolute inset-8 border border-white/12 bg-white/[0.025]" />
                    <div className="absolute bottom-0 left-10 h-[76%] w-20 border-x border-t border-white/15 bg-black/25 transition duration-500 group-hover:translate-y-[-10px]" />
                    <div className="absolute bottom-0 left-32 h-[58%] w-28 border-x border-t border-[#d8b877]/25 bg-[#d8b877]/[0.04] transition duration-500 group-hover:translate-y-[-18px]" />
                    <div className="absolute right-8 top-8 rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/45">
                      {project.year}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#d8b877]">{project.type}</p>
                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">{project.title}</h3>
                    <p className="mt-4 text-sm text-white/50">{project.location}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="px-5 py-24 sm:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="mx-auto grid max-w-7xl gap-10 border border-[#d8b877]/25 bg-[#d8b877]/[0.06] p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d8b877]">Contact</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                Let&apos;s shape the next landmark brief.
              </h2>
              <p className="mt-5 max-w-2xl text-white/58">
                Send a project note, consultation request, or early-stage development idea. This is a mock
                WhatsApp CTA for the portfolio landing page.
              </p>
            </div>
            <a
              href="https://wa.me/971500000000"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#25d366] px-7 text-sm font-bold text-[#03120a] transition hover:bg-[#52e186]"
            >
              WhatsApp Arcluxe
            </a>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
