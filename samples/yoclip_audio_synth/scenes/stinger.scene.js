// Offline audio synthesis — end-to-end sample.
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
      var env = Math.max(0, 1 - t / 2);
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

var stinger = jsr.audio.synth({
  name: 'demo_stinger', // -> assets/audio/generated/demo_stinger.wav
  sampleRate: 44100,
  channels: 2,
  duration: 2,
});

// The A4 lead: soft attack, held sustain, long release tail.
stinger.note('A4', {
  start: 0,
  duration: 1.6,
  gain: 0.8,
  type: 'sine',
  attack: 0.01,
  decay: 0.05,
  sustain: 0.6,
  release: 0.3,
});

// A soft triangle "hit" an octave down, panned slightly left.
stinger.osc({
  type: 'triangle',
  frequency: 220,
  start: 0.02,
  duration: 0.5,
  gain: 0.35,
  attack: 0.005,
  release: 0.2,
  pan: -0.3,
});

// Fire-and-forget: the host saves the WAV during project load and settles
// the promise afterwards — scenes must not gate rendering on it.
stinger.render();
