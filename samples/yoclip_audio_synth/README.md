# yoclip_audio_synth

Proves the offline audio synthesis export path end to end: the scene
synthesizes an 8-second stereo showcase with `jsr.audio.synth`, yoclip saves
it as `assets/audio/generated/demo_stinger.wav` while loading the project,
and `yoclip.yaml` places it on the timeline with a `synth:` audio track so
the rendered MP4 carries the generated soundtrack.

NEON DAWN moves through a filtered riser, driven-bass drop, panned arpeggio
and spacious tail. It exercises low/high/band-pass filters, white/pink/brown
noise, vibrato, tremolo, soft-clip drive and drive mix, carrier-relative FM,
and track delay/reverb. The deterministic three.js ocean mirrors every kick
and arpeggio step, with its drop at 2 seconds and a calm fade through 8.

## Render

```bash
cd samples/yoclip_audio_synth
dart run ../../../packages/yoclip_cli/bin/yoclip.dart render -o out.mp4
```

Then check the mix:

```bash
ffprobe out.mp4
```

The exported MP4 must have an `Audio: mp4a / .mp4 / AAC` stream (~8 s), and
`assets/audio/generated/demo_stinger.wav` must exist next to this README.
