// Offline audio synthesis — end-to-end sample ("NEON DAWN" stinger).
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
  duration: 90,
  from: 0,
  timeline: {
    label: 'Synth stinger',
    color: '#22d3ee',
    lane: 'video',
  },
  render: function (frame) {
    var t = frame / 30; // seconds
    // Title rises in over the attack of the note (first ~0.5s).
    var titleIn = Math.min(1, Math.max(0, (t - 0.05) / 0.45));
    // Ring pulses decaying like the note's envelope, one ring per beat.
    var ringT = (t % 0.5) / 0.5;
    var ring = 120 + ringT * 340;
    var ringFade = Math.max(0, 1 - ringT);

    var bars = [];
    for (var i = 0; i < 48; i++) {
      // Waveform-flavored bars: decaying amplitude across the 2s note.
      var env = Math.max(0, 1 - t / 3);
      var h = 24 + Math.abs(Math.sin(i * 0.55 + t * 9)) * 210 * env;
      bars.push({
        type: 'container',
        width: 16,
        height: h,
        radius: 8,
        color: i % 2 === 0 ? '#22d3ee' : '#7c3aed',
        opacity: 0.85,
      });
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: [
        {
          type: 'align',
          alignment: 'center',
          child: {
            type: 'column',
            mainAxisSize: 'min',
            crossAxisAlignment: 'center',
            children: [
              {
                type: 'text',
                text: 'OFFLINE AUDIO SYNTHESIS',
                opacity: titleIn,
                style: {
                  fontSize: 96,
                  fontWeight: '800',
                  color: '#f4f6ff',
                  letterSpacing: 10,
                },
              },
              {
                type: 'text',
                text: 'jsr.audio.synth -> WAV -> MP4 mixdown',
                opacity: titleIn,
                offsetY: (1 - titleIn) * 30,
                style: { fontSize: 34, color: '#8a90b8', letterSpacing: 3 },
              },
            ],
          },
        },
        {
          // Pulse ring behind the title, synced to the synthesized beat.
          type: 'container',
          width: ring * 2,
          height: ring * 2,
          radius: ring,
          borderColor: '#22d3ee',
          borderWidth: 3,
          opacity: ringFade * 0.5,
          positioned: { left: 960 - ring, top: 540 - ring },
        },
        {
          type: 'row',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'end',
          positioned: { left: 0, top: 760 },
          children: bars,
        },
      ],
    };
  },
};

// --- The synthesized soundtrack -------------------------------------------
// "NEON DAWN" — 3-second sci-fi stinger in five layers: sub-drone, riser,
// impact, panned arpeggio and a bell sparkle tail. Everything below is
// pure JS oscillators/ADSR — no audio files in the repo.

var stinger = jsr.audio.synth({
  name: 'demo_stinger', // -> assets/audio/generated/demo_stinger.wav
  sampleRate: 44100,
  channels: 2,
  duration: 3,
});

// 1. Sub-drone bed (0 -> 3.0 s): two slightly detuned low sines beat
// against each other, giving the whole stinger a moving floor.
stinger.note('A1', {
  start: 0, duration: 3.0, gain: 0.35, type: 'sine',
  attack: 0.25, decay: 0.3, sustain: 0.9, release: 0.4,
});
stinger.note('A1', {
  start: 0, duration: 3.0, gain: 0.25, type: 'sine',
  attack: 0.25, decay: 0.3, sustain: 0.9, release: 0.4, detune: 7,
});

// 2. Riser (0 -> 1.2 s): sawtooth sweeping up three octaves into the
// impact, plus an airy noise build panned right.
stinger.osc({
  type: 'sawtooth', frequency: 110, frequencyEnd: 880,
  start: 0, duration: 1.2, gain: 0.28,
  attack: 0.6, decay: 0.4, sustain: 0.9, release: 0.15,
});
stinger.osc({
  type: 'noise', start: 0, duration: 1.2, gain: 0.12,
  attack: 0.9, decay: 0.2, sustain: 0.8, release: 0.1, pan: 0.2,
});

// 3. Impact at 1.2 s (title lands): sub-drop + noise crash + kick pulse.
stinger.osc({
  type: 'sine', frequency: 220, frequencyEnd: 55,
  start: 1.2, duration: 0.35, gain: 0.8,
  attack: 0.005, decay: 0.15, sustain: 0.4, release: 0.3,
});
stinger.osc({
  type: 'noise', start: 1.2, duration: 0.35, gain: 0.35,
  attack: 0.002, decay: 0.1, sustain: 0.3, release: 0.2,
});
[1.2, 1.8].forEach(function (t) {
  stinger.osc({
    type: 'sine', frequency: 120, frequencyEnd: 50,
    start: t, duration: 0.12, gain: 0.6,
    attack: 0.002, decay: 0.05, sustain: 0.3, release: 0.08,
  });
});

// 4. Arpeggio motif (1.2 -> 2.4 s): A-major run climbing two octaves,
// each step = triangle body + detuned square grit, stereo hops L/R.
var arp = [
  ['A4', 1.2, -0.5], ['C#5', 1.4, 0.5], ['E5', 1.6, -0.3],
  ['A5', 1.8, 0.3], ['C#6', 2.0, -0.15], ['E6', 2.2, 0.15],
];
arp.forEach(function (step) {
  var name = step[0], t = step[1], pan = step[2];
  stinger.note(name, {
    start: t, duration: 0.2, gain: 0.45, type: 'triangle',
    attack: 0.004, decay: 0.06, sustain: 0.4, release: 0.12, pan: pan,
  });
  stinger.note(name, {
    start: t, duration: 0.2, gain: 0.18, type: 'square',
    attack: 0.004, decay: 0.06, sustain: 0.4, release: 0.12,
    detune: 8, pan: pan,
  });
});

// 5. Bell sparkle tail (1.8 -> 3.0 s): three quiet high sines ringing
// out across the fade — right, left, then centre.
stinger.note('E7', {
  start: 1.9, duration: 0.6, gain: 0.10, type: 'sine',
  attack: 0.005, decay: 0.2, sustain: 0.2, release: 0.9, pan: 0.4,
});
stinger.note('A6', {
  start: 2.2, duration: 0.5, gain: 0.14, type: 'sine',
  attack: 0.005, decay: 0.2, sustain: 0.2, release: 0.8, pan: -0.4,
});
stinger.note('C#6', {
  start: 2.5, duration: 0.4, gain: 0.10, type: 'sine',
  attack: 0.005, decay: 0.2, sustain: 0.2, release: 0.5,
});

// Fire-and-forget: the host saves the WAV during project load and settles
// the promise afterwards — scenes must not gate rendering on it.
stinger.render();
