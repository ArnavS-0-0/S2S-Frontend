type MetricsGridProps = {
  rulYears: number
  fireRiskScore: number
  suitabilityGrade: string
  co2SavingsKg: number
}

export function MetricsGrid({ rulYears, fireRiskScore, suitabilityGrade, co2SavingsKg }: MetricsGridProps) {
  const formattedRul = Number.isFinite(rulYears) ? rulYears.toFixed(1) : '–'
  const formattedFireRisk = Number.isFinite(fireRiskScore) ? `${fireRiskScore.toFixed(0)}%` : '–'
  const formattedCo2 = Number.isFinite(co2SavingsKg) ? co2SavingsKg.toFixed(0) : '–'

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-white/12 bg-white/5 p-4 sm:p-5">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-white/55">Remaining useful life</div>
        <div className="mt-3 flex items-baseline gap-1">
          <div className="text-2xl font-semibold text-white sm:text-3xl">{formattedRul}</div>
          <div className="text-xs text-white/60">years</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/12 bg-white/5 p-4 sm:p-5">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-white/55">Fire risk score</div>
        <div className="mt-3 flex items-baseline gap-1">
          <div className="text-2xl font-semibold text-white sm:text-3xl">{formattedFireRisk}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/12 bg-white/5 p-4 sm:p-5">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-white/55">Suitability grade</div>
        <div className="mt-3">
          <span className="inline-flex items-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-200">
            {suitabilityGrade}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/12 bg-white/5 p-4 sm:p-5">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-white/55">CO₂ savings</div>
        <div className="mt-3 flex items-baseline gap-1">
          <div className="text-2xl font-semibold text-white sm:text-3xl">{formattedCo2}</div>
          <div className="text-xs text-white/60">kg</div>
        </div>
      </div>
    </div>
  )
}

