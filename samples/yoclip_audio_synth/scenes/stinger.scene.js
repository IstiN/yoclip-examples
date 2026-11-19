// Offline audio synthesis — end-to-end sample ("NEON DAWN" full-API showcase).
//
// The scene SYNTHESIZES its own soundtrack with the js_widget_runtime
// offline synthesis API (no audio files in the repo):
//
//   1. `jsr.audio.synth({...})` builds a named track,
//   2. `.note()` / `.osc()` add envelope-shaped oscillators,
//   3. `.render()` hands the interleaved Float32 PCM to the yoclip host,
//      which saves it to `assets/audio/generated/demo_stinger.wav`
//      while the project loads,
//   4. `yoclip.yaml` places it on the timeline via `audio.tracks:
//      [{synth: demo_stinger, ...}]` and the MP4 mixdown picks it up.
//
// Call `track.render()` fire-and-forget at module level: the envelope
// crosses to the host synchronously, so the WAV exists before the first
// frame renders or any export mixes audio.

scene = {
  id: 'synth_stinger',
  duration: 240,
  from: 0,
  timeline: {
    label: 'Full audio API showcase',
    color: '#22d3ee',
    lane: 'video',
  },
  render: function (frame) {
    var t = frame / 30; // seconds
    var titleIn = Math.min(1, Math.max(0, (t - 0.05) / 0.45));

    return {
      type: 'stack',
      fit: 'expand',
      children: [
        {
          // Persistent native Three.js world. All wave, particle, ring and
          // camera motion is derived from this exact frame in three/waves.js.
          type: 'three_scene',
          source: 'three/waves.js',
          frame: frame,
          fps: 30,
          width: 1920,
          height: 1080,
          params: { soundtrack: 'NEON DAWN' },
        },
        {
          type: 'align',
          alignment: 'center',
          child: {
            type: 'column',
            mainAxisSize: 'min',
            crossAxisAlignment: 'center',
            offsetY: -315 + (1 - titleIn) * 24,
            children: [
              {
                type: 'text',
                text: 'OFFLINE AUDIO SYNTHESIS',
                opacity: titleIn,
                style: {
                  fontSize: 96,
                  fontFamily: 'Geneva',
                  fontWeight: '800',
                  color: '#f4f6ff',
                  letterSpacing: 10,
                  shadows: [
                    { color: '#8022d3ee', blur: 24, offsetX: 0, offsetY: 0 },
                  ],
                },
              },
              {
                type: 'text',
                text: 'FILTERS / COLORED NOISE / LFO / DRIVE / FM / FX',
                opacity: titleIn,
                offsetY: (1 - titleIn) * 30,
                style: {
                  fontSize: 34,
                  fontFamily: 'Geneva',
                  color: '#8a90b8',
                  letterSpacing: 3,
                },
              },
            ],
          },
        },
      ],
    };
  },
};

// --- The synthesized soundtrack -------------------------------------------
// "NEON DAWN" — an 8-second, four-section full-API showcase. The original
// drone/riser/impact/arpeggio/bell arrangement grows into filtered colored
// noise, pitch and gain LFOs, driven bass, FM bells and track delay/reverb.

var stinger = jsr.audio.synth({
  name: 'demo_stinger', // -> assets/audio/generated/demo_stinger.wav
  sampleRate: 44100,
  channels: 2,
  duration: 8, // Explicit length: effect tails fit inside, never extend it.
  effects: [
    { type: 'delay', time: 0.28, feedback: 0.45, mix: 0.22 },
    { type: 'reverb', decay: 1.4, mix: 0.18 },
  ],
});

// 1. RISER (0 -> 2 s): the original detuned sub-drone and octave climb now
// open through a geometric low-pass sweep. A high-passed white-noise bed
// adds an airy top; a short pink-noise grain accents the approach to 2 s.
stinger.note('A1', {
  start: 0, duration: 2.05, gain: 0.14, type: 'sine',
  attack: 0.35, decay: 0.35, sustain: 0.8, release: 0.45, detune: -5,
});
stinger.note('A1', {
  start: 0, duration: 2.05, gain: 0.10, type: 'sine',
  attack: 0.35, decay: 0.35, sustain: 0.8, release: 0.45, detune: 7,
});
stinger.osc({
  type: 'sawtooth', frequency: 110, frequencyEnd: 880,
  start: 0, duration: 1.95, gain: 0.18,
  attack: 0.65, decay: 0.3, sustain: 0.85, release: 0.18, pan: -0.12,
  filter: { type: 'lowpass', frequency: 400, frequencyEnd: 4000, q: 2 },
});
stinger.osc({
  type: 'noise', noiseColor: 'white',
  start: 0, duration: 1.95, gain: 0.09,
  attack: 1.1, decay: 0.25, sustain: 0.7, release: 0.25, pan: 0.25,
  filter: { type: 'highpass', frequency: 500, frequencyEnd: 4500, q: 0.8 },
});
stinger.osc({
  type: 'noise', noiseColor: 'pink',
  start: 1.9, duration: 0.002, gain: 0.01,
  attack: 0.0002, decay: 0.0002, sustain: 0.7, release: 0.0002, pan: 0.25,
  filter: { type: 'highpass', frequency: 4500, q: 0.8 },
});

// 2. DROP (2 s): sub-drop, white crash and a band-passed brown-noise thud.
// Two softly clipped saws then hold an A1/A2 floor under the groove. Drive
// is post-filter/pre-envelope; driveMix keeps 20% of the clean oscillator.
stinger.osc({
  type: 'sine', frequency: 220, frequencyEnd: 55,
  start: 2.0, duration: 0.38, gain: 0.30,
  attack: 0.003, decay: 0.16, sustain: 0.35, release: 0.3,
});
stinger.osc({
  type: 'noise', noiseColor: 'white',
  start: 2.0, duration: 0.42, gain: 0.14,
  attack: 0.002, decay: 0.12, sustain: 0.25, release: 0.35, pan: -0.1,
  filter: { type: 'highpass', frequency: 180, frequencyEnd: 6500, q: 0.7 },
});
stinger.osc({
  type: 'noise', noiseColor: 'brown',
  start: 2.0, duration: 0.5, gain: 0.15,
  attack: 0.003, decay: 0.16, sustain: 0.3, release: 0.4,
  filter: { type: 'bandpass', frequency: 140, q: 1.1 },
});
stinger.note('A1', {
  start: 2.0, duration: 3.45, gain: 0.13, type: 'sawtooth',
  attack: 0.008, decay: 0.22, sustain: 0.58, release: 0.55, pan: -0.08,
  filter: { type: 'lowpass', frequency: 700, q: 1.1 },
  drive: 4, driveMix: 0.8,
});
stinger.note('A2', {
  start: 2.0, duration: 3.45, gain: 0.06, type: 'sawtooth',
  attack: 0.008, decay: 0.22, sustain: 0.58, release: 0.55, detune: 5,
  filter: { type: 'lowpass', frequency: 900, q: 0.9 },
  drive: 3, driveMix: 0.8, pan: 0.08,
});

// Four groove kicks, then one softer tail kick at 6 s. These exact times
// also drive the expanding ocean ripples in three/waves.js.
[2.0, 3.0, 4.0, 5.0, 6.0].forEach(function (t) {
  stinger.osc({
    type: 'sine', frequency: 120, frequencyEnd: 50,
    start: t, duration: 0.12, gain: t === 6.0 ? 0.19 : 0.28,
    attack: 0.002, decay: 0.05, sustain: 0.3, release: 0.09,
  });
});

// 3. GROOVE (2 -> 5.5 s): a 14-step A-major run at 0.25 s intervals.
// Triangle leads use centered 7 Hz tremolo, detuned squares retain the
// original grit, and quiet ratio-3.5 FM sines add metallic bell overtones.
var arp = [
  ['A4', 2.00, -0.55], ['C#5', 2.25, 0.50], ['E5', 2.50, -0.40],
  ['A5', 2.75, 0.40], ['C#6', 3.00, -0.25], ['E6', 3.25, 0.25],
  ['A5', 3.50, -0.50], ['E5', 3.75, 0.50], ['C#5', 4.00, -0.35],
  ['A5', 4.25, 0.35], ['E6', 4.50, -0.20], ['C#6', 4.75, 0.20],
  ['A5', 5.00, -0.45], ['E5', 5.25, 0.45],
];
arp.forEach(function (step) {
  var name = step[0], t = step[1], pan = step[2];
  stinger.note(name, {
    start: t, duration: 0.20, gain: 0.15, type: 'triangle',
    attack: 0.004, decay: 0.06, sustain: 0.42, release: 0.12, pan: pan,
    tremolo: { rate: 7, depth: 0.5 },
  });
  stinger.note(name, {
    start: t, duration: 0.20, gain: 0.035, type: 'square',
    attack: 0.004, decay: 0.06, sustain: 0.35, release: 0.12,
    detune: 8, pan: pan,
  });
  stinger.note(name, {
    start: t, duration: 0.16, gain: 0.039, type: 'sine',
    attack: 0.003, decay: 0.07, sustain: 0.22, release: 0.38, pan: -pan * 0.6,
    fm: { ratio: 3.5, index: 3 },
  });
});

// A held lead floats above the run with 35-cent pitch vibrato. Its gentle
// cutoff sweep is independent of the riser and driven-bass filters.
stinger.note('A5', {
  start: 3.75, duration: 1.35, gain: 0.075, type: 'sawtooth',
  attack: 0.08, decay: 0.18, sustain: 0.65, release: 0.55, pan: 0.1,
  filter: { type: 'lowpass', frequency: 1600, frequencyEnd: 900, q: 1.2 },
  vibrato: { rate: 5.5, depth: 35 },
});

// 4. TAIL (5.5 -> 8 s): a ratio-2 FM bell and two high sine sparkles ring
// through the track-wide delay/reverb while the ocean settles. The explicit
// 8 s duration leaves room for their releases and the 1.4 s reverb tail.
stinger.note('A6', {
  start: 5.5, duration: 0.75, gain: 0.11, type: 'sine',
  attack: 0.004, decay: 0.3, sustain: 0.25, release: 1.65,
  fm: { ratio: 2, index: 2.5 },
});
stinger.note('E7', {
  start: 6.05, duration: 0.55, gain: 0.055, type: 'sine',
  attack: 0.01, decay: 0.2, sustain: 0.25, release: 1.35, pan: 0.45,
});
stinger.note('C#7', {
  start: 6.35, duration: 0.4, gain: 0.04, type: 'sine',
  attack: 0.01, decay: 0.2, sustain: 0.25, release: 1.1, pan: -0.45,
});

// Fire-and-forget: the host saves the WAV during project load and settles
// the promise afterwards — scenes must not gate rendering on it.
stinger.render();
