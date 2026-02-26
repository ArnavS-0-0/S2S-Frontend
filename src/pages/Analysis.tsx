import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { UploadCard } from '../components/UploadCard'
import { MetricsGrid } from '../components/MetricsGrid'
import { DegradationChart } from '../components/DegradationChart'
import { TemperatureChart } from '../components/TemperatureChart'

export type DegradationPoint = {
  cycle: number
  capacity: number
}

export type TemperaturePoint = {
  cycle: number
  temp: number
}

export type AnalysisResponse = {
  rul_years: number
  fire_risk_score: number
  suitability_grade: string
  co2_savings_kg: number
  degradation_data: DegradationPoint[]
  temperature_data: TemperaturePoint[]
}

export function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResponse | null>(null)
  const resultsRef = useRef<HTMLDivElement | null>(null)

  const handleFileSelect = (nextFile: File | null) => {
    if (!nextFile) {
      setFile(null)
      return
    }

    if (!nextFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a .csv file.')
      setFile(null)
      return
    }

    setError(null)
    setFile(nextFile)
  }

  const handleRunAnalysis = async () => {
    if (!file) {
      setError('Please upload a CSV file before running analysis.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post<AnalysisResponse>('http://localhost:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setResult(response.data)
    } catch (err) {
      setError('Unable to run analysis. Please ensure the backend is running and the file format is valid.')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!result || !resultsRef.current) return

    window.scrollTo({
      top: resultsRef.current.offsetTop,
      behavior: 'smooth',
    })
  }, [result])

  return (
    <main className="min-h-screen bg-ink text-white">
      {/* Full-screen hero with background video */}
      <section className="relative min-h-screen overflow-hidden">
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover -z-20"
          src="/videos/video3.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.75),rgba(0,0,0,0.9))] -z-10" />

        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 pt-28 pb-16">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[rgba(20,25,30,0.6)] p-10 text-left shadow-[0_30px_120px_rgba(0,0,0,0.85)] backdrop-blur-xl">
            <h1 className="text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
              Analyze Battery Telemetry
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Upload a CSV file to generate remaining useful life, fire risk, and reuse recommendations from the S2S
              analysis engine.
            </p>

            <div className="mt-7">
              <UploadCard
                file={file}
                loading={loading}
                error={error}
                onFileSelect={handleFileSelect}
                onRunAnalysis={handleRunAnalysis}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results dashboard */}
      <div ref={resultsRef} className="mx-auto max-w-6xl px-6 pb-20">
        {result && (
          <>
            <section className="mt-16">
              <MetricsGrid
                rulYears={result.rul_years}
                fireRiskScore={result.fire_risk_score}
                suitabilityGrade={result.suitability_grade}
                co2SavingsKg={result.co2_savings_kg}
              />
            </section>

            <section className="mt-12 grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/12 bg-ink-2 p-4 sm:p-6">
                <h2 className="text-sm font-semibold text-white/90">Degradation Curve</h2>
                <p className="mt-2 text-xs text-white/60">
                  Remaining capacity across duty cycles based on uploaded telemetry.
                </p>
                <div className="mt-4 h-64 sm:h-72">
                  <DegradationChart data={result.degradation_data} />
                </div>
              </div>

              <div className="rounded-2xl border border-white/12 bg-ink-2 p-4 sm:p-6">
                <h2 className="text-sm font-semibold text-white/90">Temperature Trend</h2>
                <p className="mt-2 text-xs text-white/60">
                  Pack temperature profile over the same cycles to highlight thermal behaviour.
                </p>
                <div className="mt-4 h-64 sm:h-72">
                  <TemperatureChart data={result.temperature_data} />
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

