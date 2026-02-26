import { useEffect, useMemo, useRef, useState } from 'react'

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
    if (p && typeof p.catch === 'function') p.catch(() => {})
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
      autoPlay
      muted
      loop
      playsInline
      preload={lazy ? 'none' : 'metadata'}
      src={shouldLoad ? src : undefined}
    />
  )
}

function Icon({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5 text-white/70"
      aria-hidden="true"
    >
      <path d={path} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const year = useMemo(() => new Date().getFullYear(), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const features = useMemo(
    () => [
      {
        title: 'AI Remaining Life Prediction',
        description: 'Forecast usable capacity and performance fade with lab-grade confidence.',
        icon: 'M4.5 19.5V5.2c0-.6.5-1.1 1.1-1.1h12.8c.6 0 1.1.5 1.1 1.1v14.3M7 16.5h10M7 13.2h6.5M7 9.9h10',
      },
      {
        title: 'Fire Risk Analysis',
        description: 'Detect thermal instability signals early and quantify safety risk before reuse.',
        icon: 'M12 3.5c2.2 2.1 4 4.3 4 7.2 0 2.7-1.8 4.8-4 4.8s-4-2.1-4-4.8c0-2.9 1.8-5.1 4-7.2ZM6 20.5c1.4-1.1 3.4-1.8 6-1.8s4.6.7 6 1.8',
      },
      {
        title: 'CO₂ Savings Estimation',
        description: 'Model embodied carbon avoided with second-life deployment vs recycling pathways.',
        icon: 'M5 12c0-3.9 3.1-7 7-7s7 3.1 7 7-3.1 7-7 7S5 15.9 5 12Zm3.2.1h7.6M12 8.6v6.8',
      },
    ],
    [],
  )

  return (
    <div className="min-h-screen bg-ink font-sans">
      {/* Navbar */}
      <header
        className={[
          'fixed left-0 right-0 top-0 z-50 transition-colors duration-300',
          scrolled ? 'bg-ink/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent',
        ].join(' ')}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="tracking-wide text-white/90 hover:text-white transition-colors">
            <span className="font-medium">S2S</span>
          </a>
          <div className="hidden items-center gap-6 text-sm text-white/70 sm:flex">
            <a className="hover:text-white transition-colors" href="#features">
              Features
            </a>
            <a className="hover:text-white transition-colors" href="#second-life">
              Second-life
            </a>
            <a className="hover:text-white transition-colors" href="#cta">
              Analysis
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section id="top" className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <BackgroundVideo src="/videos/hero.mp4" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/35" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_20%,rgba(99,184,127,0.10),transparent_60%)]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pt-20 text-center">
          <p
            className="s2s-fade-up text-xs font-medium tracking-[0.28em] text-white/60"
            style={{ animationDelay: '100ms' }}
          >
            CLIMATE-TECH AI • BATTERY INTELLIGENCE
          </p>
          <h1
            className="s2s-fade-up mt-5 text-balance text-5xl font-medium leading-[1.02] tracking-[-0.02em] text-white sm:text-7xl"
            style={{ animationDelay: '220ms' }}
          >
            Scrap to Spark
          </h1>
          <p
            className="s2s-fade-up mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg"
            style={{ animationDelay: '340ms' }}
          >
            Turning Battery Scrap Into Energy Assets With AI
          </p>

          <div className="s2s-fade-up mt-10" style={{ animationDelay: '460ms' }}>
            <a
              href="#cta"
              className="group inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-medium text-ink shadow-[0_18px_50px_-22px_rgba(0,0,0,0.9)] transition-transform duration-300 ease-out hover:scale-[1.02] active:scale-[0.99]"
            >
              Analyze a Battery
              <span className="ml-2 text-ink/70 transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </a>
            <div className="mt-4 text-xs text-white/45">
              Precision decisions for reuse vs recycle — in minutes.
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative border-t border-white/10 bg-ink py-24">
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-medium tracking-[-0.01em] text-white sm:text-3xl">
              Intelligence you can trust
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
              Built for operators, recyclers, and second-life integrators—S2S turns complex battery signals into
              defensible decisions.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <article
                key={f.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl shadow-[0_30px_80px_-45px_rgba(0,0,0,0.9)] transition-transform duration-300 ease-out hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                    <Icon path={f.icon} />
                  </div>
                  <h3 className="text-sm font-medium text-white/90">{f.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/60">{f.description}</p>
                <div className="mt-6 h-px w-full bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
                <div className="mt-5 text-xs text-white/45">
                  Designed for precision, safety, and sustainability.
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic Video Section */}
      <section id="second-life" className="relative overflow-hidden border-t border-white/10 py-28">
        <div className="absolute inset-0">
          <BackgroundVideo src="/videos/section.mp4" lazy zoom />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/70" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
          <p className="text-xs font-medium tracking-[0.28em] text-white/55">SECOND LIFE • NOT LANDFILL</p>
          <h2 className="mt-5 text-balance text-4xl font-medium tracking-[-0.02em] text-white sm:text-5xl">
            From Scrap to Second Life
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-white/65 sm:text-base">
            Make every pack count. S2S weighs value, risk, and carbon impact to route batteries into their highest
            integrity path.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="border-t border-white/10 bg-ink-2 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-12 backdrop-blur-xl shadow-[0_40px_120px_-70px_rgba(0,0,0,0.95)] sm:px-12">
            <div className="grid items-center gap-10 md:grid-cols-[1.4fr_0.6fr]">
              <div>
                <h3 className="text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl">
                  Build the Second-Life Battery Economy
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
                  Upload telemetry. Get AI health &amp; risk analysis. Receive a clear reuse or recycle decision—built
                  to earn trust in the real world.
                </p>
              </div>
              <div className="flex md:justify-end">
                <a
                  href="#top"
                  className="inline-flex w-full items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-medium text-ink transition-transform duration-300 ease-out hover:scale-[1.02] active:scale-[0.99] md:w-auto"
                >
                  Analyze a Battery
                </a>
              </div>
            </div>
          </div>

          <footer className="mt-14 flex flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">
            <div>© {year} Scrap to Spark (S2S)</div>
            <div className="flex items-center gap-4">
              <a className="hover:text-white/70 transition-colors" href="#features">
                Features
              </a>
              <a className="hover:text-white/70 transition-colors" href="#second-life">
                Second-life
              </a>
            </div>
          </footer>
        </div>
      </section>
    </div>
  )
}

export default App
