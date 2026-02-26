import { useState } from 'react'
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

  return (
    <main className="min-h-screen bg-ink pb-20 pt-28 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.24em] text-white/55">BATTERY PACK ANALYSIS</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">Analysis</h1>
          <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
            Upload EV battery telemetry as CSV to generate remaining life, safety, and carbon impact insights from the
            S2S analysis engine.
          </p>
        </header>

        <section className="mt-10">
          <UploadCard
            file={file}
            loading={loading}
            error={error}
            onFileSelect={handleFileSelect}
            onRunAnalysis={handleRunAnalysis}
          />
        </section>

        {result && (
          <>
            <section className="mt-12">
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

