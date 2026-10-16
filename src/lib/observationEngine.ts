import {
  assignmentCode,
  challenges,
  constraints,
  getChallengeById,
  getConstraintById,
  getLensById,
  lenses,
  type Constraint,
  type CreativeChallenge,
  type LensOption,
} from '../data/challenges'

export interface Assignment {
  challenge: CreativeChallenge
  lens: LensOption | null
  constraint: Constraint | null
}

export interface EnginePreferences {
  includeLens: boolean
  includeConstraint: boolean
}

export const ENGINE_PREFS_KEY = 'jjm-observation-preferences'
export const ENGINE_ASSIGNMENT_KEY = 'jjm-observation-assignment'

interface StoredAssignment {
  challengeId: string
  lensId: string | null
  constraintId: string | null
}

const defaultPreferences: EnginePreferences = {
  includeLens: true,
  includeConstraint: true,
}

export function pickRandomById<T extends { id: string }>(items: readonly T[], excludeId?: string | null): T {
  const pool = excludeId ? items.filter((item) => item.id !== excludeId) : items
  const source = pool.length > 0 ? pool : items
  return source[Math.floor(Math.random() * source.length)]!
}

export function createAssignment(
  preferences: EnginePreferences,
  previous?: Assignment | null,
): Assignment {
  return {
    challenge: pickRandomById(challenges, previous?.challenge.id),
    lens: preferences.includeLens ? pickRandomById(lenses, previous?.lens?.id) : null,
    constraint: preferences.includeConstraint
      ? pickRandomById(constraints, previous?.constraint?.id)
      : null,
  }
}

export function withRegeneratedLens(assignment: Assignment): Assignment {
  return {
    ...assignment,
    lens: pickRandomById(lenses, assignment.lens?.id),
  }
}

export function withRegeneratedConstraint(assignment: Assignment): Assignment {
  return {
    ...assignment,
    constraint: pickRandomById(constraints, assignment.constraint?.id),
  }
}

export function applyPreferences(assignment: Assignment, preferences: EnginePreferences): Assignment {
  return {
    challenge: assignment.challenge,
    lens: preferences.includeLens
      ? (assignment.lens ?? pickRandomById(lenses))
      : null,
    constraint: preferences.includeConstraint
      ? (assignment.constraint ?? pickRandomById(constraints))
      : null,
  }
}

export function parseAssignmentFromSearch(params: URLSearchParams): Assignment | null {
  const challenge = getChallengeById(params.get('id'))
  if (!challenge) return null

  return {
    challenge,
    lens: getLensById(params.get('lens')),
    constraint: getConstraintById(params.get('constraint')),
  }
}

export function assignmentSearchParams(assignment: Assignment) {
  const params: Record<string, string> = { id: assignment.challenge.id }
  if (assignment.lens) params.lens = assignment.lens.id
  if (assignment.constraint) params.constraint = assignment.constraint.id
  return params
}

export function assignmentUrl(assignment: Assignment, origin = window.location.origin) {
  const params = new URLSearchParams(assignmentSearchParams(assignment))
  return `${origin}/challenges?${params.toString()}`
}

export function formatAssignmentText(assignment: Assignment) {
  const { challenge, lens, constraint } = assignment
  const lines = [
    `${assignmentCode(challenge.id)} — ${challenge.title}`,
    '',
    challenge.description,
  ]

  if (challenge.hint) {
    lines.push('', `Hint: ${challenge.hint}`)
  }

  if (lens) lines.push('', `Lens: ${lens.label}`)
  if (constraint) lines.push(`Constraint: ${constraint.label}`)

  lines.push('', assignmentUrl(assignment))
  return lines.join('\n')
}

export function sharePayload(assignment: Assignment) {
  return {
    title: `${assignment.challenge.title} — ${assignmentCode(assignment.challenge.id)}`,
    text: assignment.challenge.description,
    url: assignmentUrl(assignment),
  }
}

export async function copyText(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return
    }
  } catch {
    // Fall through to the textarea fallback when the Clipboard API is blocked.
  }

  const field = document.createElement('textarea')
  field.value = value
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.appendChild(field)
  field.focus()
  field.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(field)
  if (!copied) throw new Error('Copy failed')
}

export async function shareAssignment(assignment: Assignment): Promise<'shared' | 'copied'> {
  const payload = sharePayload(assignment)

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share(payload)
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error
    }
  }

  await copyText(payload.url)
  return 'copied'
}

export function readPreferences(): EnginePreferences {
  try {
    const raw = localStorage.getItem(ENGINE_PREFS_KEY)
    if (!raw) return defaultPreferences
    const parsed = JSON.parse(raw) as Partial<EnginePreferences>
    return {
      includeLens: parsed.includeLens !== false,
      includeConstraint: parsed.includeConstraint !== false,
    }
  } catch {
    return defaultPreferences
  }
}

export function writePreferences(preferences: EnginePreferences) {
  try {
    localStorage.setItem(ENGINE_PREFS_KEY, JSON.stringify(preferences))
  } catch {
    // Private browsing or blocked storage should not break the generator.
  }
}

function storedId(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : null
}

export function readStoredAssignment(): Assignment | null {
  try {
    const raw = localStorage.getItem(ENGINE_ASSIGNMENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredAssignment> | null
    if (!parsed || typeof parsed !== 'object') return null

    const challenge = getChallengeById(storedId(parsed.challengeId))
    if (!challenge) return null

    return {
      challenge,
      lens: getLensById(storedId(parsed.lensId)),
      constraint: getConstraintById(storedId(parsed.constraintId)),
    }
  } catch {
    return null
  }
}

export function writeStoredAssignment(assignment: Assignment) {
  try {
    const stored: StoredAssignment = {
      challengeId: assignment.challenge.id,
      lensId: assignment.lens?.id ?? null,
      constraintId: assignment.constraint?.id ?? null,
    }
    localStorage.setItem(ENGINE_ASSIGNMENT_KEY, JSON.stringify(stored))
  } catch {
    // Private browsing or blocked storage should not break the generator.
  }
}
