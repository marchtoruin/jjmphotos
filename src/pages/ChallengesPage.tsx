import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Copy, RefreshCw, Share2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { assignmentCode } from '../data/challenges'
import {
  applyPreferences,
  assignmentSearchParams,
  copyText,
  createAssignment,
  formatAssignmentText,
  parseAssignmentFromSearch,
  readPreferences,
  readStoredAssignment,
  shareAssignment,
  withRegeneratedConstraint,
  withRegeneratedLens,
  writePreferences,
  writeStoredAssignment,
  type Assignment,
  type EnginePreferences,
} from '../lib/observationEngine'

type Notice = 'copied' | 'link-copied' | 'shared' | 'unable' | null

export function ChallengesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const reduceMotion = useReducedMotion()
  const [preferences, setPreferences] = useState<EnginePreferences>(readPreferences)
  const [notice, setNotice] = useState<Notice>(null)
  const [pulse, setPulse] = useState(0)

  const requestedId = searchParams.get('id')
  const fromUrl = useMemo(() => parseAssignmentFromSearch(searchParams), [searchParams])
  const storedAssignment = useMemo(
    () => (requestedId ? null : readStoredAssignment()),
    [requestedId],
  )
  const assignment = requestedId ? fromUrl : storedAssignment
  const unknownAssignment = Boolean(requestedId) && !fromUrl
  const status = assignment ? 'IN THE FIELD' : 'AWAITING OBSERVATION'

  useEffect(() => {
    writePreferences(preferences)
  }, [preferences])

  useEffect(() => {
    if (assignment) writeStoredAssignment(assignment)
  }, [assignment])

  useEffect(() => {
    if (requestedId || !storedAssignment) return
    setSearchParams(assignmentSearchParams(storedAssignment), { replace: true })
  }, [requestedId, setSearchParams, storedAssignment])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 1800)
    return () => window.clearTimeout(timer)
  }, [notice])

  function commit(next: Assignment | null, animate = true) {
    if (animate) setPulse((value) => value + 1)
    if (!next) {
      setSearchParams({}, { replace: true })
      return
    }
    setSearchParams(assignmentSearchParams(next), { replace: true })
  }

  function generate() {
    commit(createAssignment(preferences, assignment))
  }

  function updatePreferences(next: EnginePreferences) {
    setPreferences(next)
    if (assignment) commit(applyPreferences(assignment, next), false)
  }

  async function onCopy() {
    if (!assignment) return
    try {
      await copyText(formatAssignmentText(assignment))
      setNotice('copied')
    } catch {
      setNotice('unable')
    }
  }

  async function onShare() {
    if (!assignment) return
    try {
      const result = await shareAssignment(assignment)
      setNotice(result === 'shared' ? 'shared' : 'link-copied')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setNotice('unable')
    }
  }

  const noticeLabel = {
    copied: 'Copied',
    'link-copied': 'Link copied',
    shared: 'Shared',
    unable: 'Unable to copy',
  } as const

  return (
    <>
      <Seo
        title="The Observation Engine — JJM Photography"
        description="An exercise in seeing differently. A hidden generator of photographic assignments."
      />

      <section className="page-shell engine-page pb-16 pt-24 md:pb-20 md:pt-32">
        <header className="mb-6 flex items-end justify-between gap-4 md:mb-8">
          <p className="eyebrow">Obs / Engine</p>
          <p className="plate">{status}</p>
        </header>

        <div className="mb-7 max-w-2xl md:mb-9">
          <h1 className="font-serif text-[clamp(2rem,6vw,3.8rem)] leading-[0.92] tracking-[-0.03em]">
            The Observation Engine
          </h1>
          <p className="mt-3 font-serif text-[1.05rem] italic text-mist md:text-[1.15rem]">
            An exercise in seeing differently.
          </p>
        </div>

        <div className="engine-panel">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={assignment ? `${assignment.challenge.id}-${pulse}` : `idle-${pulse}`}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {assignment ? (
                <AssignmentPanel
                  assignment={assignment}
                  onRefreshLens={() => commit(withRegeneratedLens(assignment), false)}
                  onRefreshConstraint={() => commit(withRegeneratedConstraint(assignment), false)}
                />
              ) : (
                <EmptyPanel unknown={unknownAssignment} preferences={preferences} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button className="engine-generate" type="button" onClick={generate}>
            Generate challenge
          </button>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button className="engine-ghost" type="button" onClick={onCopy} disabled={!assignment}>
              <Copy size={14} strokeWidth={1.5} />
              Copy challenge
            </button>
            <button className="engine-ghost" type="button" onClick={onShare} disabled={!assignment}>
              <Share2 size={14} strokeWidth={1.5} />
              Share challenge
            </button>
          </div>

          <p className="plate min-h-4 text-center" role="status" aria-live="polite">
            {notice ? noticeLabel[notice] : '\u00a0'}
          </p>
        </div>

        <div className="mt-8 border-t border-white/8">
          <PreferenceRow
            label="Lens randomization"
            engaged={preferences.includeLens}
            onToggle={() =>
              updatePreferences({ ...preferences, includeLens: !preferences.includeLens })
            }
          />
          <PreferenceRow
            label="Creative constraint"
            engaged={preferences.includeConstraint}
            onToggle={() =>
              updatePreferences({
                ...preferences,
                includeConstraint: !preferences.includeConstraint,
              })
            }
          />
        </div>

        <p className="mt-10 font-serif text-sm italic text-mist">Go find something worth noticing.</p>
      </section>
    </>
  )
}

function AssignmentPanel({
  assignment,
  onRefreshLens,
  onRefreshConstraint,
}: {
  assignment: Assignment
  onRefreshLens: () => void
  onRefreshConstraint: () => void
}) {
  const { challenge, lens, constraint } = assignment

  return (
    <div aria-live="polite">
      <p className="plate">{assignmentCode(challenge.id)}</p>
      <h2 className="mt-4 font-serif text-[clamp(1.7rem,4vw,2.55rem)] leading-[1.05] tracking-[-0.02em]">
        {challenge.title}
      </h2>
      <p className="mt-4 max-w-2xl text-[1.02rem] leading-8 text-stone/90">{challenge.description}</p>
      {challenge.hint && (
        <p className="mt-5 max-w-2xl text-[0.92rem] leading-7 text-mist">
          <span className="plate mr-3 inline-block translate-y-[-1px]">Hint</span>
          {challenge.hint}
        </p>
      )}
      {(lens || constraint) && (
        <div className="mt-6 grid gap-px border-t border-white/8">
          {lens && (
            <InstrumentRow
              label="Lens"
              value={lens.label}
              onRefresh={onRefreshLens}
              refreshLabel="Regenerate lens"
            />
          )}
          {constraint && (
            <InstrumentRow
              label="Limit"
              value={constraint.label}
              onRefresh={onRefreshConstraint}
              refreshLabel="Regenerate constraint"
            />
          )}
        </div>
      )}
    </div>
  )
}

function EmptyPanel({
  unknown,
  preferences,
}: {
  unknown: boolean
  preferences: EnginePreferences
}) {
  const parts = ['a challenge']
  if (preferences.includeLens) parts.push('a lens')
  if (preferences.includeConstraint) parts.push('a constraint')
  const assembled = parts.length === 1
    ? 'A challenge will assemble itself.'
    : parts.length === 2
      ? `${capitalize(parts[0])} and ${parts[1]} will assemble themselves.`
      : `${capitalize(parts[0])}, ${parts[1]}, and ${parts[2]} will assemble themselves.`

  return (
    <div className="py-2">
      <p className="plate">{unknown ? 'Signal lost' : 'No assignment loaded'}</p>
      <h2 className="mt-4 max-w-xl font-serif text-[clamp(1.5rem,3.6vw,2.2rem)] leading-[1.1] tracking-[-0.02em] text-stone/80">
        {unknown
          ? 'This assignment is no longer in the sequence.'
          : 'Press generate when you are ready to look.'}
      </h2>
      <p className="mt-4 max-w-lg text-[0.95rem] leading-7 text-mist">
        {unknown
          ? 'The identifier may have been removed. Generate a new assignment and continue.'
          : assembled}
      </p>
    </div>
  )
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function InstrumentRow({
  label,
  value,
  onRefresh,
  refreshLabel,
}: {
  label: string
  value: string
  onRefresh: () => void
  refreshLabel: string
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="plate w-[4.8rem] shrink-0">{label}</span>
      <span className="min-w-0 flex-1 text-[0.95rem] leading-6">{value}</span>
      <button
        className="grid size-11 shrink-0 place-items-center text-mist transition-colors hover:text-stone"
        type="button"
        aria-label={refreshLabel}
        onClick={onRefresh}
      >
        <RefreshCw size={15} strokeWidth={1.5} />
      </button>
    </div>
  )
}

function PreferenceRow({
  label,
  engaged,
  onToggle,
}: {
  label: string
  engaged: boolean
  onToggle: () => void
}) {
  return (
    <button
      className="flex min-h-12 w-full items-center justify-between gap-4 border-b border-white/8 py-3 text-left"
      type="button"
      role="switch"
      aria-checked={engaged}
      onClick={onToggle}
    >
      <span className="text-[0.92rem]">{label}</span>
      <span className={`plate ${engaged ? 'text-stone' : 'text-mist'}`}>
        {engaged ? 'Engaged' : 'Disengaged'}
      </span>
    </button>
  )
}
