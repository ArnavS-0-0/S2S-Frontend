import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { AnalysisPage } from './pages/Analysis'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mql) return

    const onChange = () => setReduced(mql.matches)
    onChange()

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    }

    const legacy = mql as unknown as { addListener?: (cb: () => void) => void; removeListener?: (cb: () => void) => void }
    if (typeof legacy.addListener === 'function') {
      legacy.addListener(onChange)
      return () => legacy.removeListener?.(onChange)
    }
  }, [])

  return reduced
}

function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      setInView(Boolean(entry?.isIntersecting))
    }, options)

    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return { ref, inView }
}

type BackgroundVideoProps = {
  src: string
  lazy?: boolean
  zoom?: boolean
  className?: string
}

function BackgroundVideo({ src, lazy = false, zoom = false, className }: BackgroundVideoProps) {
  const reducedMotion = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLVideoElement>({
    root: null,
    threshold: 0.15,
    rootMargin: '120px',
  })
  const [shouldLoad, setShouldLoad] = useState(!lazy)
  const [canUseVideo, setCanUseVideo] = useState(true)

  useEffect(() => {
    const saveData = Boolean((navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData)

    const mql = window.matchMedia?.('(min-width: 640px)')
    const decide = () => setCanUseVideo(!reducedMotion && !saveData && (mql ? mql.matches : true))
    decide()

    if (!mql) return
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', decide)
      return () => mql.removeEventListener('change', decide)
    }

    const legacy = mql as unknown as { addListener?: (cb: () => void) => void; removeListener?: (cb: () => void) => void }
    if (typeof legacy.addListener === 'function') {
      legacy.addListener(decide)
      return () => legacy.removeListener?.(decide)
    }
  }, [reducedMotion])

  useEffect(() => {
    if (!lazy) return
    if (inView) setShouldLoad(true)
  }, [inView, lazy])

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (!shouldLoad) return
    if (!canUseVideo) return

    if (!inView) {
      video.pause()
      return
    }

    const p = video.play()
    if (p && typeof p.catch === 'function') p.catch(() => { })
  }, [canUseVideo, inView, ref, shouldLoad])

  if (!canUseVideo) return null

  return (
    <video
      ref={ref}
      className={[
        'absolute inset-0 h-full w-full object-cover',
        zoom ? 'scale-[1.05]' : '',
        className ?? '',
      ].join(' ')}
      style={{ backgroundColor: '#0b0f0e' }}
      autoPlay
      muted
      loop
      playsInline
      preload={lazy ? 'none' : 'metadata'}
      src={shouldLoad ? src : undefined}
    />
  )
}

function HomePage() {
  const year = useMemo(() => new Date().getFullYear(), [])
  const navigate = useNavigate()

  const platformBlocks = useMemo(
    () => [
      {
        title: 'Remaining Useful Life Modeling',
        description:
          'Quantifies pack and module-level degradation under real operating conditions to support reuse and warranty decisions.',
      },
      {
        title: 'Thermal Risk Classification',
        description:
          'Surfaces abnormal thermal behaviour and flags assets that breach operational safety thresholds before deployment.',
      },
    ],
    [],
  )

  const capabilities = useMemo(
    () => [
      {
        title: 'Telemetry Ingestion Engine',
        description:
          'Ingests heterogeneous pack and BMS telemetry at scale with schema normalization, validation, and quality controls.',
      },
      {
        title: 'AI Health Modeling',
        description:
          'Combines physics-informed and data-driven models to estimate state-of-health, degradation trajectory, and failure modes.',
      },
      {
        title: 'Safety & Risk Classification',
        description:
          'Classifies operational risk to support enforceable safety policies, audit trails, and regulatory documentation.',
      },
      {
        title: 'Circularity Impact Scoring',
        description:
          'Scores economic and carbon outcomes to route batteries toward second-life, remanufacture, or recycling.',
      },
    ],
    [],
  )

  return (
    <>
      {/* Hero */}
      <section id="top" className="relative min-h-screen overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <BackgroundVideo src="/videos/hero.mp4" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/35" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_20%,rgba(99,184,127,0.06),transparent_60%)]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-start justify-center px-6 pt-24 pb-20">
          <p
            className="s2s-fade-up text-xs font-medium tracking-[0.28em] text-white/60"
            style={{ animationDelay: '100ms' }}
          >
            BATTERY LIFECYCLE INTELLIGENCE SYSTEM
          </p>
          <h1
            className="s2s-fade-up mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-6xl"
            style={{ animationDelay: '220ms' }}
          >
            Operational Decision Support for EV Battery Reuse and Recycling
            <br className="hidden sm:block" />

          </h1>
          <p
            className="s2s-fade-up mt-6 max-w-xl text-pretty text-sm leading-relaxed text-white/70 sm:text-base"
            style={{ animationDelay: '340ms' }}
          >
            AI-powered evaluation platform that transforms raw battery telemetry into defensible reuse or recycle
            determinations.
          </p>

          <div className="s2s-fade-up mt-10" style={{ animationDelay: '460ms' }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <button
                type="button"
                onClick={() => navigate('/analysis')}
                className="inline-flex items-center justify-center rounded-[10px] bg-[radial-gradient(circle_at_0%_0%,#1b2a23,#0f1714)] px-8 py-3.5 text-sm font-medium text-white shadow-[0_18px_50px_rgba(0,0,0,0.65)] transition transform duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                Analyze Battery Data
              </button>
              <p className="max-w-md text-xs text-white/60">
                Upload CSV. Get RUL, Fire Risk &amp; Reuse Decision in Minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section id="platform" className="border-top border-white/10 bg-ink py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.24em] text-white/55">PLATFORM OVERVIEW</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">Platform Overview</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
              S2S is a battery asset intelligence platform built for recyclers, fleet operators, OEMs, and second-life
              integrators. Our system evaluates performance degradation, thermal stability, and embodied carbon to determine
              optimal end-of-life pathways.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
            {platformBlocks.map((block) => (
              <article key={block.title} className="h-full rounded-2xl border border-white/12 bg-white/5 p-6 text-left">
                <h3 className="text-sm font-semibold text-white/90">{block.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{block.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="border-t border-white/10 bg-ink-2 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.24em] text-white/55">CAPABILITIES</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">Capabilities</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
              Infrastructure-grade analytics that connect EV battery telemetry to reuse, safety, and circularity outcomes.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {capabilities.map((capability) => (
              <article key={capability.title} className="h-full rounded-2xl border border-white/12 bg-white/5 p-6">
                <h3 className="text-sm font-semibold text-white/90">{capability.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{capability.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic Video Section */}
      <section id="second-life" className="relative overflow-hidden border-t border-white/10 bg-ink py-28">
        <div className="absolute inset-0">
          <BackgroundVideo src="/videos/section.mp4" lazy zoom />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/70" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
          <p className="text-xs font-medium tracking-[0.28em] text-white/55">SECOND LIFE • NOT LANDFILL</p>
          <h2 className="mt-5 text-balance text-4xl font-medium tracking-[-0.02em] text-white sm:text-5xl">
            Operating the Second-Life Battery Layer
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-white/65 sm:text-base">
            S2S evaluates every incoming pack on value, risk, and carbon impact to determine whether it should be reused,
            remanufactured, or recycled—before it touches the field.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="border-t border-white/10 bg-ink-2 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-12 backdrop-blur-xl shadow-[0_40px_120px_-70px_rgba(0,0,0,0.95)] sm:px-12">
            <div className="grid items-center gap-10 md:grid-cols-[1.4fr_0.6fr]">
              <div>
                <h3 className="text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl">
                  Start a Battery Analysis
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
                  Connect your telemetry, configure policies, and receive clear reuse or recycle recommendations with the
                  rigor needed for OEM, fleet, and recycling partners.
                </p>
              </div>
              <div className="flex md:justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/analysis')}
                  className="inline-flex w-full items-center justify-center rounded-[10px] bg-[radial-gradient(circle_at_0%_0%,#1b2a23,#0f1714)] px-7 py-3 text-sm font-medium text-white shadow-[0_18px_50px_rgba(0,0,0,0.65)] transition transform duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 md:w-auto"
                >
                  Analyze Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-white/10 bg-ink py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs font-medium tracking-[0.24em] text-white/55">CONTACT</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">
                Contact S2S Technologies
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
                For pilots, commercial discussions, and technical evaluations, connect with our team using the details
                alongside.
              </p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/5 p-6 text-sm text-white/80 sm:p-7">
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">Email</div>
                  <a
                    href="mailto:contact@s2s-technologies.com"
                    className="mt-1 inline-block text-sm text-white/90 hover:text-white"
                  >
                    contact@s2s-technologies.com
                  </a>
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">Phone</div>
                  <div className="mt-1 text-sm text-white/90">+91 80 4567 8901</div>
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">Address</div>
                  <div className="mt-1 space-y-1 text-sm text-white/90">
                    <div>S2S Technologies Pvt. Ltd.</div>
                    <div>3rd Floor, Innovation Tower</div>
                    <div>Whitefield Tech Park</div>
                    <div>Bengaluru, Karnataka 560066</div>
                    <div>India</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-ink-2">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-6 text-xs text-white/45 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div>© {year} S2S Technologies</div>
            <div className="text-white/55">Battery Intelligence Infrastructure</div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a className="hover:text-white/70 transition-colors" href="/#platform">
              Platform
            </a>
            <a className="hover:text-white/70 transition-colors" href="/#capabilities">
              Capabilities
            </a>
            <a className="hover:text-white/70 transition-colors" href="/#second-life">
              Second-Life
            </a>
            <a className="hover:text-white/70 transition-colors" href="/#contact">
              Contact
            </a>
            <Link className="hover:text-white/70 transition-colors" to="/analysis">
              Analysis
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}

function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-ink font-sans">
      <header
        className={[
          'fixed left-0 right-0 top-0 z-50 transition-colors duration-300',
          scrolled ? 'bg-ink/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent',
        ].join(' ')}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-white hover:text-white transition-colors">
            <span className="flex flex-col leading-tight">
              <span className="text-2xl font-semibold tracking-tight sm:text-3xl">S2S</span>
              <span className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/70 sm:text-xs">
                Scrap to Spark
              </span>
            </span>
          </Link>
          <div className="hidden items-center gap-6 text-sm text-white/70 sm:flex">
            <a className="hover:text-white transition-colors" href="/#platform">
              Platform
            </a>
            <a className="hover:text-white transition-colors" href="/#capabilities">
              Capabilities
            </a>
            <a className="hover:text-white transition-colors" href="/#second-life">
              Second-life
            </a>
            <Link className="hover:text-white transition-colors" to="/analysis">
              Analysis
            </Link>
            <a className="hover:text-white transition-colors" href="/#contact">
              Contact
            </a>
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
    </div>
  )
}

export default App
