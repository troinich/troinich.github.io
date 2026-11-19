/**
 * A short, quiet sleigh-bell jingle made with the Web Audio API,
 * so there is no audio file to download.
 */
import { JINGLE_SOUND } from './config'

const MUTE_KEY = 'meet-me:muted'

let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  ctx ??= new Ctor()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function isMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

export function setMuted(muted: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
  } catch {
    // ignore
  }
}

let noiseBuffer: AudioBuffer | null = null
function noise(ac: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer
  const buf = ac.createBuffer(1, ac.sampleRate * 0.3, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return (noiseBuffer = buf)
}

/**
 * One small sleigh bell being hit: a metallic "tsching" made of a short
 * filtered noise burst (the rattle of the ball) plus a few high, inharmonic
 * ringing partials (the shell).
 */
function sleighBell(ac: AudioContext, out: AudioNode, at: number, base: number, volume: number) {
  // the ball rattling
  const src = ac.createBufferSource()
  src.buffer = noise(ac)
  const bp = ac.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = base * 1.6
  bp.Q.value = 6
  const ng = ac.createGain()
  ng.gain.setValueAtTime(volume * 0.9, at)
  ng.gain.exponentialRampToValueAtTime(0.0001, at + 0.06)
  src.connect(bp).connect(ng).connect(out)
  src.start(at, Math.random() * 0.2, 0.08)

  // the shell ringing (inharmonic, so it sounds like metal rather than a note)
  for (const [ratio, decay, level] of [
    [1, 0.22, 1],
    [1.47, 0.16, 0.7],
    [2.09, 0.12, 0.5],
    [2.56, 0.09, 0.35],
  ]) {
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = 'triangle'
    osc.frequency.value = base * ratio * (1 + (Math.random() - 0.5) * 0.01)
    g.gain.setValueAtTime(0.0001, at)
    g.gain.exponentialRampToValueAtTime(volume * level * 0.5, at + 0.003)
    g.gain.exponentialRampToValueAtTime(0.0001, at + decay)
    osc.connect(g).connect(out)
    osc.start(at)
    osc.stop(at + decay + 0.02)
  }
}

/** A sleigh-bell strap shaken twice: "jingle-jingle". */
function synthJingle(ac: AudioContext, volume: number) {
  const out = ac.createGain()
  const hp = ac.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 1800
  out.connect(hp).connect(ac.destination)
  out.gain.value = 1

  const bells = [3950, 4420, 4870, 5230, 5710, 6180] // a strap of slightly different bells
  const now = ac.currentTime + 0.01
  const shakes = [0, 0.16, 0.34]
  shakes.forEach((shakeAt, s) => {
    const strength = s === 2 ? 0.6 : 1
    // every bell on the strap rings a little out of sync with the others
    for (let i = 0; i < 10; i++) {
      const bell = bells[Math.floor(Math.random() * bells.length)]
      const t = now + shakeAt + Math.random() * 0.07
      sleighBell(ac, out, t, bell, volume * strength * (0.5 + Math.random() * 0.5))
    }
  })
}

let recording: HTMLAudioElement | null = null

/** A subtle jingle-bell shake. Uses the recording from config if one is set. */
export function jingle({ volume = 0.05 }: { volume?: number } = {}) {
  if (isMuted()) return
  if (JINGLE_SOUND) {
    try {
      recording ??= new Audio(`${import.meta.env.BASE_URL}${JINGLE_SOUND}`)
      recording.volume = Math.min(1, volume * 6)
      recording.currentTime = 0
      void recording.play()?.catch(() => {})
    } catch {
      // audio not available
    }
    return
  }
  const ac = audio()
  if (!ac) return
  synthJingle(ac, volume)
}
