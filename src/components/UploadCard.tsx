type UploadCardProps = {
  file: File | null
  loading: boolean
  error: string | null
  onFileSelect: (file: File | null) => void
  onRunAnalysis: () => void
}

export function UploadCard({ file, loading, error, onFileSelect, onRunAnalysis }: UploadCardProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null
    onFileSelect(nextFile)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const nextFile = event.dataTransfer.files?.[0] ?? null
    onFileSelect(nextFile)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const disabled = !file || loading

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/20 px-6 py-10 text-center shadow-[0_0_0_1px_rgba(148,163,184,0.1)] transition-shadow duration-200 hover:border-accent/60 hover:shadow-[0_0_0_1px_rgba(148,163,184,0.4),0_0_24px_rgba(99,184,127,0.18)] sm:px-10"
      >
        <p className="text-sm font-medium text-white/85">Upload CSV telemetry</p>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-white/60">
          Drag and drop a .csv file or browse from your machine. Only structured pack-level telemetry is supported.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/25 px-4 py-2 text-xs font-medium text-white/85 hover:border-white/40">
            <span>Choose file</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleInputChange}
            />
          </label>
          <span className="text-white/45">or drag and drop</span>
        </div>

        <div className="mt-4 min-h-[1.5rem] text-xs text-white/70">
          {file ? <span className="truncate">Selected: {file.name}</span> : <span>No file selected</span>}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-white/55">Accepted format: .csv</div>
        <button
          type="button"
          onClick={onRunAnalysis}
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-xs font-medium text-ink transition-colors duration-150 hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/40"
        >
          {loading && (
            <span className="mr-2 h-3 w-3 animate-spin rounded-full border border-ink/30 border-t-ink" />
          )}
          Run AI Analysis
        </button>
      </div>

      {error && (
        <div className="mt-4 text-xs text-red-300">
          {error}
        </div>
      )}
    </div>
  )
}

