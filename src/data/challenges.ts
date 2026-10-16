/**
 * Assignments for The Observation Engine.
 *
 * Add new entries at the bottom with the next unused id, padded to 3 digits.
 * Never reuse or renumber existing ids — shared links depend on them.
 */

export interface CreativeChallenge {
  id: string
  title: string
  description: string
  hint?: string
}

export interface LensOption {
  id: string
  label: string
}

export interface Constraint {
  id: string
  label: string
}

export const challenges: CreativeChallenge[] = [
  {
    id: '001',
    title: 'The Accidental Film Still',
    description:
      'Make an ordinary moment look like a frame from a movie nobody has seen.',
    hint: 'Look for light that feels slightly too dramatic for the situation.',
  },
  {
    id: '002',
    title: 'Evidence of Someone',
    description: 'Tell a story about a person without showing the person.',
    hint: 'A chair, a coat, a lit window, a half-finished errand.',
  },
  {
    id: '003',
    title: 'Almost Nothing',
    description: 'Create a compelling photograph using extreme negative space.',
    hint: 'Let the empty area do most of the talking.',
  },
  {
    id: '004',
    title: 'The Disappearance',
    description: 'Photograph something entering, leaving, fading, or becoming obscured.',
    hint: 'Fog, a closing door, a figure at the edge of the frame.',
  },
  {
    id: '005',
    title: 'Beautifully Wrong',
    description: 'Make something ugly, mundane, or industrial genuinely beautiful.',
    hint: 'Stay with the subject until the light or angle starts to forgive it.',
  },
  {
    id: '006',
    title: 'A Moment Before',
    description: 'Photograph a scene that feels like something is about to happen.',
    hint: 'Tension lives in pauses, not in the event itself.',
  },
  {
    id: '007',
    title: 'The Unreliable Reflection',
    description: 'Use a reflection to create an image that is difficult to interpret.',
    hint: 'Puddles, glass, polished metal, wet pavement.',
  },
  {
    id: '008',
    title: 'The Invisible Character',
    description: 'Create a photograph where someone feels present without being visible.',
    hint: 'Occupation can be implied by wear, warmth, or interruption.',
  },
  {
    id: '009',
    title: 'Light Is the Event',
    description: 'Photograph a scene where the light itself is the subject.',
    hint: 'Forget the object. Follow the beam, the spill, the burn.',
  },
  {
    id: '010',
    title: 'A Quiet Absurdity',
    description: 'Find something unintentionally strange or funny and photograph it seriously.',
    hint: 'Deadpan framing makes the oddness louder.',
  },
  {
    id: '011',
    title: 'After the Weather',
    description: 'Photograph the residue of weather rather than the weather itself.',
    hint: 'Puddles, salt, steam, flattened grass, a sidewalk still drying.',
  },
  {
    id: '012',
    title: 'The Wrong Distance',
    description: 'Stand too close or too far from a subject that usually has a correct distance.',
    hint: 'Let the awkwardness of scale become the picture.',
  },
  {
    id: '013',
    title: 'Threshold',
    description: 'Photograph a doorway, edge, fence, shoreline, or other boundary as if it were a decision.',
    hint: 'Place the divide where the eye has to choose a side.',
  },
  {
    id: '014',
    title: 'Borrowed Color',
    description: 'Let one unexpected color dominate an otherwise muted scene.',
    hint: 'A sign, a taillight, a jacket, a sodium lamp.',
  },
  {
    id: '015',
    title: 'The Last Useful Hour',
    description: 'Photograph a place as it is shutting down, emptying, or being put away.',
    hint: 'Look for lights being switched, chairs stacked, lots going vacant.',
  },
  {
    id: '016',
    title: 'Geometry in the Wild',
    description: 'Find a rigid shape or pattern that nature or neglect has started to undo.',
    hint: 'Straight lines losing their argument with weather.',
  },
  {
    id: '017',
    title: 'Something Left Behind',
    description: 'Make an abandoned or leftover object feel briefly important.',
    hint: 'Give it the kind of space usually reserved for a portrait.',
  },
  {
    id: '018',
    title: 'The Sound of a Place',
    description: 'Photograph as if you were trying to record noise, silence, or a specific frequency.',
    hint: 'Ask what this location would look like if it were audible.',
  },
  {
    id: '019',
    title: 'Incomplete Information',
    description: 'Compose an image that withholds the most important part of the scene.',
    hint: 'Crop out the obvious. Leave a question in the frame.',
  },
  {
    id: '020',
    title: 'A Private Public',
    description: 'Photograph a public space as if it were intimate and unobserved.',
    hint: 'Quieter corners. Smaller gestures. Less spectacle.',
  },
  {
    id: '021',
    title: 'Vertical Weather',
    description: 'Look up. Make the sky, wires, trees, or architecture feel like weather happening overhead.',
    hint: 'The ground does not need to exist in this picture.',
  },
  {
    id: '022',
    title: 'The Second Subject',
    description: 'Include something in the frame that quietly steals attention from what seemed important.',
    hint: 'Let the distraction win, but only barely.',
  },
  {
    id: '023',
    title: 'Soft Machinery',
    description: 'Photograph an industrial or mechanical subject as if it were organic.',
    hint: 'Look for curves, stains, warmth, or a kind of breathing.',
  },
  {
    id: '024',
    title: 'Hard Nature',
    description: 'Photograph something natural as if it were built, manufactured, or designed.',
    hint: 'Emphasize edges, repetition, and material.',
  },
  {
    id: '025',
    title: 'Corridor of Time',
    description: 'Find a repeating element that makes the frame feel longer than it is.',
    hint: 'Columns, windows, parked cars, trees, painted lines.',
  },
  {
    id: '026',
    title: 'Occupied Emptiness',
    description: 'Photograph an empty scene that still feels inhabited.',
    hint: 'Recent heat. A light left on. A door not quite closed.',
  },
  {
    id: '027',
    title: 'The Color of Night That Isn’t Black',
    description: 'Photograph darkness with enough remaining light to keep it from collapsing into silhouette alone.',
    hint: 'Blue hour, sodium vapor, wet asphalt, window glow.',
  },
  {
    id: '028',
    title: 'A Map of Wear',
    description: 'Photograph surfaces that show use, repair, or time passing through them.',
    hint: 'Scratches, patches, rust, handprints, tired paint.',
  },
  {
    id: '029',
    title: 'False Horizon',
    description: 'Create a photograph where the viewer is unsure which way is up, or where the ground actually is.',
    hint: 'Reflections, steep angles, fog, and stacked planes help.',
  },
  {
    id: '030',
    title: 'Interrupted Pattern',
    description: 'Find a repeating visual rhythm and photograph the place it breaks.',
    hint: 'The break is the subject. The pattern is only context.',
  },
  {
    id: '031',
    title: 'The Distance Between Two Things',
    description: 'Make the relationship between two objects more important than either object.',
    hint: 'Space is the story. Keep both parties in tension.',
  },
  {
    id: '032',
    title: 'Weathered Signal',
    description: 'Photograph a sign, marking, or instruction that has started to fail at its job.',
    hint: 'Faded paint, blocked letters, lights that no longer mean what they did.',
  },
  {
    id: '033',
    title: 'Through Something',
    description: 'Shoot through glass, fence, foliage, steam, or another obstruction so the barrier becomes part of the picture.',
    hint: 'Do not pretend the obstruction is not there.',
  },
  {
    id: '034',
    title: 'A Room Without Walls',
    description: 'Find an outdoor space that behaves like an interior.',
    hint: 'Overpasses, alcoves, bus shelters, courtyards, parked-truck canyons.',
  },
  {
    id: '035',
    title: 'Interior Weather',
    description: 'Find indoor light that feels like a climate.',
    hint: 'A cold fluorescent. A humid window. Late sun across a hallway.',
  },
  {
    id: '036',
    title: 'The Ordinary Monument',
    description: 'Photograph a mundane object with the gravity usually reserved for statues.',
    hint: 'Low angle, patient framing, no irony in the composition.',
  },
  {
    id: '037',
    title: 'Half a Gesture',
    description: 'Catch a movement that is unfinished: a turn, a reach, a closing door, a pause mid-stride.',
    hint: 'The picture should feel slightly too early or slightly too late.',
  },
  {
    id: '038',
    title: 'The Color That Shouldn’t Be There',
    description: 'Find a hue that feels slightly wrong for the scene and let it lead.',
    hint: 'Do not correct it. Let the wrongness remain.',
  },
  {
    id: '039',
    title: 'Overnight Architecture',
    description: 'Photograph a building or street as if it only exists after hours.',
    hint: 'Fewer people. More electricity. Longer shadows.',
  },
  {
    id: '040',
    title: 'Small Violence of Light',
    description: 'Photograph a hard shadow, glare, or blown highlight as an aggressive event.',
    hint: 'Let the light injure the rest of the frame a little.',
  },
  {
    id: '041',
    title: 'The Inventory',
    description: 'Photograph objects as if cataloguing evidence for a story you refuse to explain.',
    hint: 'Straight-on. Even. Slightly too careful.',
  },
  {
    id: '042',
    title: 'Peripheral Vision',
    description: 'Compose as though the real subject is just outside the frame.',
    hint: 'Everyone in the picture should seem to be looking elsewhere.',
  },
  {
    id: '043',
    title: 'Slow Water, Fast World',
    description: 'Contrast something still with something that implies speed.',
    hint: 'A puddle and a highway. A parked chair and a passing train.',
  },
  {
    id: '044',
    title: 'A Place That Forgot Its Purpose',
    description: 'Photograph infrastructure or architecture that no longer does what it was made for.',
    hint: 'Closed booths, unused ramps, signs to nowhere.',
  },
  {
    id: '045',
    title: 'Double Life',
    description: 'Make a single scene readable in two contradictory ways.',
    hint: 'Reflection plus reality, or scale that refuses to settle.',
  },
  {
    id: '046',
    title: 'The Temperature of a Color',
    description: 'Photograph as if you were trying to show whether a place is cold or warm without relying on weather cues alone.',
    hint: 'Let white balance, materials, and light carry the climate.',
  },
  {
    id: '047',
    title: 'Anonymous Monumentality',
    description: 'Photograph a large, impressive thing while denying the viewer a complete view of it.',
    hint: 'Fragment the giant. Keep the scale, lose the postcard.',
  },
  {
    id: '048',
    title: 'Trace Heat',
    description: 'Photograph the suggestion of recent activity: lights left on, a chair out of place, a wet sidewalk, an open gate.',
    hint: 'You arrived slightly after the scene finished happening.',
  },
  {
    id: '049',
    title: 'The Wrong Lens for the Job',
    description: 'Use your assigned focal length against its usual purpose.',
    hint: 'Wide for a detail. Long for a space. Stay with the mismatch.',
  },
  {
    id: '050',
    title: 'Quiet Spectacle',
    description: 'Find something dramatic happening at a scale or volume that most people would walk past.',
    hint: 'Do not make it bigger than it is. Make it exact.',
  },
  {
    id: '051',
    title: 'Folded Space',
    description: 'Use framing, reflection, or overlap to make the scene feel spatially impossible or collapsed.',
    hint: 'Stack two planes until they argue about which is closer.',
  },
  {
    id: '052',
    title: 'One Honest Light Source',
    description: 'Build the entire photograph around a single practical light: a window, a lamp, a sign, a phone, a garage.',
    hint: 'Everything else can fall away.',
  },
  {
    id: '053',
    title: 'The Season Underneath',
    description: 'Photograph the current season as residue rather than scenery: salt, pollen, heat shimmer, wet leaves, long shadows.',
    hint: 'Avoid the obvious postcard of the season.',
  },
  {
    id: '054',
    title: 'Unfinished Business',
    description: 'Photograph a scene that looks paused, interrupted, or waiting to be completed.',
    hint: 'Construction, a half-erased sign, an open trunk, a conversation just out of frame.',
  },
  {
    id: '055',
    title: 'The Civic Still Life',
    description: 'Find a public arrangement of objects that accidentally looks composed.',
    hint: 'Barriers, bins, benches, cones — already a sculpture, briefly.',
  },
]

export const lenses: LensOption[] = [
  { id: '16mm', label: '16mm' },
  { id: '28-70mm', label: '28–70mm' },
  { id: '50mm', label: '50mm' },
  { id: '70-200mm', label: '70–200mm' },
  { id: 'choice', label: "Photographer's choice" },
]

export const constraints: Constraint[] = [
  { id: 'bw', label: 'Black and white only.' },
  { id: 'no-crop', label: 'No cropping afterward.' },
  { id: 'negative-space', label: 'Use negative space.' },
  { id: 'ground-level', label: 'Shoot from ground level.' },
  { id: 'no-faces', label: 'No recognizable faces.' },
  { id: 'reflection', label: 'Include a reflection.' },
  { id: 'motion-blur', label: 'Use intentional motion blur.' },
  { id: 'five-exposures', label: 'Maximum five exposures.' },
  { id: 'unconventional-framing', label: 'Use unconventional framing.' },
  { id: 'none', label: 'No additional constraint.' },
  { id: 'one-exposure', label: 'One exposure only.' },
  { id: 'no-horizon', label: 'Keep the horizon out of the frame.' },
  { id: 'human-edge', label: 'Include a human-made edge: curb, wire, wall, or railing.' },
  { id: 'highlights', label: 'Expose for the highlights.' },
  { id: 'fill-frame', label: 'Fill the frame. No breathing room.' },
  { id: 'from-above', label: 'Shoot from above.' },
  { id: 'incidental-text', label: 'Include text or signage, but not as the subject.' },
  { id: 'no-sky', label: 'No sky.' },
  { id: 'wait', label: 'Wait for a person to enter or leave the frame.' },
  { id: 'available-light', label: 'Available light only.' },
  { id: 'vertical', label: 'Vertical orientation only.' },
  { id: 'shadow-primary', label: 'Include a shadow as a primary element.' },
  { id: 'one-block', label: 'Stay on one corner or one block.' },
  { id: 'threshold', label: 'Photograph through a threshold.' },
  { id: 'off-center', label: 'Do not center the subject.' },
]

const challengeById = new Map(challenges.map((challenge) => [challenge.id, challenge]))
const lensById = new Map(lenses.map((lens) => [lens.id, lens]))
const constraintById = new Map(constraints.map((constraint) => [constraint.id, constraint]))

export function getChallengeById(id: string | null | undefined) {
  if (!id) return null
  return challengeById.get(normalizeChallengeId(id)) ?? null
}

export function getLensById(id: string | null | undefined) {
  if (!id) return null
  const normalized = id.replaceAll('–', '-').toLowerCase()
  return lensById.get(normalized) ?? null
}

export function getConstraintById(id: string | null | undefined) {
  if (!id) return null
  return constraintById.get(id) ?? null
}

export function normalizeChallengeId(raw: string) {
  const trimmed = raw.trim()
  const prefixed = trimmed.match(/^(?:CHALLENGE_|ASSIGNMENT_)(.+)$/i)
  const value = prefixed ? prefixed[1] : trimmed
  if (/^\d+$/.test(value)) return value.padStart(3, '0')
  return value
}

export function assignmentCode(id: string) {
  return `ASSIGNMENT_${id}`
}

export function challengeCode(id: string) {
  return `CHALLENGE_${id}`
}
