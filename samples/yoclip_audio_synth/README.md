# yoclip_audio_synth

Proves the offline audio synthesis export path end to end: the scene
synthesizes a 2-second stereo stinger with `jsr.audio.synth`
(`.note('A4')` + a soft `.osc` hit), yoclip saves it as
`assets/audio/generated/demo_stinger.wav` while loading the project, and
`yoclip.yaml` places it on the timeline with a `synth:` audio track so the
rendered MP4 carries the generated soundtrack.

## Render

```bash
cd samples/yoclip_audio_synth
dart run ../../../packages/yoclip_cli/bin/yoclip.dart render -o out.mp4
```

Then check the mix:

```bash
ffprobe out.mp4
```

The exported MP4 must have an `Audio: mp4a / .mp4 / AAC` stream (~2 s), and
`assets/audio/generated/demo_stinger.wav` must exist next to this README.
