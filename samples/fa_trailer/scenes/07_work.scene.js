// 07 — Work / Studio — The YoClip Timeline: SDK FIRST. YOCLIP INTEGRATED.
//
// Mirroring Apple Mac Studio M5 (3uAIqqg8ZHo) 22.8s–25.5s:
//   ·   0–35   The headline slams in: `SDK FIRST.` / `YOCLIP INTEGRATED.`
//   ·  25–150  The authentic multi-track YoClip Studio timeline materializes:
//              - Video tracks with scene sequence blocks
//              - Overlay tracks with AnimVideo / AnimImage
//              - Audio soundtrack and SFX tracks with live waveforms
//              - Neon violet playhead needle scrubs smoothly across the timeline

scene = {
  id: '07_work',
  duration: 150,
  from: 1230,
  timeline: {
    label: 'Studio Timeline',
    color: '#8F6BFF',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var C = yoclipTheme.colors;

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    var silverGrad = {
      type: 'linear',
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#FFFFFF', '#ECECEF', '#9E9EA8'],
      stops: [0.0, 0.45, 1.0],
    };

    var purpleGrad = {
      type: 'linear',
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#E6C4FF', '#A368FF', '#6222D6'],
      stops: [0.0, 0.45, 1.0],
    };

    var kids = [];

    // Deep void
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#05070D',
      positioned: { left: 0, top: 0 },
    });

    // Ambient backlight
    kids.push({
      type: 'circle',
      size: 960,
      fill: '#5B61F6',
      opacity: 0.14,
      blur: 120,
      positioned: { left: 960 - 480, top: 600 - 480 },
    });

    // ---- Headline: SDK FIRST. / YOCLIP INTEGRATED. -------------------------
    var headIn1 = tw(0, 30, 0, 1, 'easeOutExpo');
    var headIn2 = tw(6, 30, 0, 1, 'easeOutExpo');
    var fadeOut = tw(132, 18, 0, 1, 'easeInOutCubic');

    kids.push({
      type: 'text',
      text: 'SDK FIRST.',
      width: 1920,
      opacity: headIn1 * (1 - fadeOut),
      offsetY: 25 * (1 - headIn1),
      style: {
        fontSize: 140,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        textAlign: 'center',
        gradient: silverGrad,
        letterSpacing: 2,
        shadows: [{ color: '#8F6BFF', blur: 36, offset: { x: 0, y: 6 } }],
      },
      positioned: { left: 0, top: 35 },
    });

    kids.push({
      type: 'text',
      text: 'YOCLIP INTEGRATED.',
      width: 1920,
      opacity: headIn2 * (1 - fadeOut),
      offsetY: 25 * (1 - headIn2),
      style: {
        fontSize: 74,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        textAlign: 'center',
        gradient: purpleGrad,
        letterSpacing: 2,
        shadows: [{ color: '#000000', blur: 24, offset: { x: 0, y: 8 } }],
      },
      positioned: { left: 0, top: 175 },
    });

    // ---- Multi-Track Studio Timeline ---------------------------------------
    var timeIn = tw(24, 28, 0, 1, 'easeOutCubic');
    if (timeIn > 0.01) {
      var TL_X = 160;
      var TL_W = 1600;
      var TL_TOP = 290;

      // Timeline background panel
      kids.push({
        type: 'rect',
        width: TL_W,
        height: 640,
        radius: 18,
        fill: '#0B101E',
        stroke: '#24324F',
        strokeWidth: 2,
        opacity: timeIn * (1 - fadeOut),
        positioned: { left: TL_X, top: TL_TOP },
      });

      // ---- Time Ruler (Top of Timeline) ------------------------------------
      kids.push({
        type: 'rect',
        width: TL_W,
        height: 44,
        fill: '#10162A',
        opacity: timeIn * (1 - fadeOut),
        positioned: { left: TL_X, top: TL_TOP },
      });

      var RULER_STEPS = ['00:00', '00:05', '00:10', '00:15', '00:20', '00:25', '00:30', '00:35', '00:40', '00:45', '00:50'];
      for (var r = 0; r < RULER_STEPS.length; r++) {
        var rx = TL_X + 40 + r * (TL_W - 80) / (RULER_STEPS.length - 1);
        kids.push({
          type: 'rect',
          width: 1.5,
          height: 12,
          fill: '#485672',
          opacity: timeIn * (1 - fadeOut),
          positioned: { left: rx, top: TL_TOP + 32 },
        });
        kids.push({
          type: 'text',
          text: RULER_STEPS[r],
          opacity: timeIn * (1 - fadeOut),
          style: {
            fontSize: 12,
            fontFamily: 'monospace',
            color: '#6A7D9E',
            fontWeight: '600',
          },
          positioned: { left: rx - 18, top: TL_TOP + 12 },
        });
      }

      // ---- Track Lanes -----------------------------------------------------
      var lanes = [
        { name: 'VIDEO 1 · SCENES', top: TL_TOP + 60, h: 110 },
        { name: 'VIDEO 2 · OVERLAYS', top: TL_TOP + 190, h: 90 },
        { name: 'AUDIO 1 · SOUNDTRACK', top: TL_TOP + 300, h: 100 },
        { name: 'AUDIO 2 · SFX STEMS', top: TL_TOP + 420, h: 90 },
      ];

      for (var l = 0; l < lanes.length; l++) {
        var lane = lanes[l];
        // Lane background
        kids.push({
          type: 'rect',
          width: TL_W - 40,
          height: lane.h,
          radius: 10,
          fill: '#080C16',
          stroke: '#182236',
          strokeWidth: 1,
          opacity: timeIn * (1 - fadeOut),
          positioned: { left: TL_X + 20, top: lane.top },
        });
        // Lane label
        kids.push({
          type: 'text',
          text: lane.name,
          opacity: 0.75 * timeIn * (1 - fadeOut),
          style: {
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#506380',
            fontWeight: '700',
          },
          positioned: { left: TL_X + 32, top: lane.top + 8 },
        });
      }

      // ---- Lane 1: Video Scene Blocks --------------------------------------
      var sceneClips = [
        { name: '01_dark', dur: '7.0s', x: TL_X + 40, w: 230, col: '#1E2340', stroke: '#5B61F6' },
        { name: '02_alive', dur: '6.0s', x: TL_X + 280, w: 210, col: '#2A1F48', stroke: '#8F6BFF' },
        { name: '03_hardware', dur: '6.0s', x: TL_X + 500, w: 220, col: '#162C42', stroke: '#48C7E8' },
        { name: '04_core', dur: '7.0s', x: TL_X + 730, w: 240, col: '#1C2038', stroke: '#6B7AFF' },
        { name: '05_everywhere', dur: '8.0s', x: TL_X + 980, w: 270, col: '#142C38', stroke: '#2EBD9E' },
        { name: '06_power', dur: '7.0s', x: TL_X + 1260, w: 240, col: '#2B1A42', stroke: '#A368FF' },
      ];

      for (var sc = 0; sc < sceneClips.length; sc++) {
        var clip = sceneClips[sc];
        kids.push({
          type: 'rect',
          width: clip.w,
          height: 72,
          radius: 8,
          fill: clip.col,
          stroke: clip.stroke,
          strokeWidth: 1.5,
          opacity: timeIn * (1 - fadeOut),
          positioned: { left: clip.x, top: TL_TOP + 88 },
        });
        kids.push({
          type: 'text',
          text: clip.name,
          opacity: timeIn * (1 - fadeOut),
          style: {
            fontSize: 13,
            fontFamily: 'monospace',
            color: '#FFFFFF',
            fontWeight: '700',
          },
          positioned: { left: clip.x + 12, top: TL_TOP + 102 },
        });
        kids.push({
          type: 'text',
          text: clip.dur,
          opacity: 0.7 * timeIn * (1 - fadeOut),
          style: {
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#8A99B0',
          },
          positioned: { left: clip.x + 12, top: TL_TOP + 128 },
        });
      }

      // ---- Lane 2: Video Overlay Blocks ------------------------------------
      var overlayClips = [
        { name: 'AnimVideo: laptop_open', x: TL_X + 180, w: 320, col: '#16223A', stroke: '#3A5078' },
        { name: 'CodeStream_Rush', x: TL_X + 560, w: 420, col: '#241638', stroke: '#8F6BFF' },
        { name: 'NodeGraph_Bezier', x: TL_X + 1040, w: 380, col: '#142832', stroke: '#2EBD9E' },
      ];
      for (var oc = 0; oc < overlayClips.length; oc++) {
        var oclip = overlayClips[oc];
        kids.push({
          type: 'rect',
          width: oclip.w,
          height: 52,
          radius: 6,
          fill: oclip.col,
          stroke: oclip.stroke,
          strokeWidth: 1.2,
          opacity: timeIn * (1 - fadeOut),
          positioned: { left: oclip.x, top: TL_TOP + 218 },
        });
        kids.push({
          type: 'text',
          text: oclip.name,
          opacity: timeIn * (1 - fadeOut),
          style: {
            fontSize: 12,
            fontFamily: 'monospace',
            color: '#D0DCF0',
            fontWeight: '600',
          },
          positioned: { left: oclip.x + 12, top: TL_TOP + 234 },
        });
      }

      // ---- Lane 3: Audio Soundtrack with Waveforms -------------------------
      kids.push({
        type: 'rect',
        width: TL_W - 80,
        height: 64,
        radius: 8,
        fill: '#241242',
        stroke: '#8F6BFF',
        strokeWidth: 1.5,
        opacity: timeIn * (1 - fadeOut),
        positioned: { left: TL_X + 40, top: TL_TOP + 326 },
      });
      kids.push({
        type: 'text',
        text: 'soundtrack.mp3 [44.1kHz · Stereo · AAC 128k]',
        opacity: timeIn * (1 - fadeOut),
        style: {
          fontSize: 12,
          fontFamily: 'monospace',
          color: '#E6C4FF',
          fontWeight: '700',
        },
        positioned: { left: TL_X + 54, top: TL_TOP + 334 },
      });

      // Waveform vertical bars across soundtrack
      var WAVE_BARS = 75;
      for (var wb = 0; wb < WAVE_BARS; wb++) {
        var barX = TL_X + 54 + wb * 20;
        var barH = 10 + 26 * Math.abs(Math.sin((wb * 0.28) + (frame * 0.05)));
        kids.push({
          type: 'rect',
          width: 3.5,
          height: barH,
          radius: 1.5,
          fill: '#A368FF',
          opacity: 0.85 * timeIn * (1 - fadeOut),
          positioned: { left: barX, top: TL_TOP + 376 - barH / 2 },
        });
      }

      // ---- Lane 4: SFX Stems -----------------------------------------------
      var sfxClips = [
        { name: 'whoosh.wav', x: TL_X + 120, w: 160 },
        { name: 'spark_wink.wav', x: TL_X + 420, w: 140 },
        { name: 'chip_laser.wav', x: TL_X + 680, w: 190 },
        { name: 'slam_bass.wav', x: TL_X + 980, w: 150 },
        { name: 'pulse_wire.wav', x: TL_X + 1240, w: 180 },
      ];
      for (var sf = 0; sf < sfxClips.length; sf++) {
        var sclip = sfxClips[sf];
        kids.push({
          type: 'rect',
          width: sclip.w,
          height: 52,
          radius: 6,
          fill: '#102430',
          stroke: '#48C7E8',
          strokeWidth: 1.2,
          opacity: timeIn * (1 - fadeOut),
          positioned: { left: sclip.x, top: TL_TOP + 448 },
        });
        kids.push({
          type: 'text',
          text: sclip.name,
          opacity: timeIn * (1 - fadeOut),
          style: {
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#48C7E8',
            fontWeight: '600',
          },
          positioned: { left: sclip.x + 10, top: TL_TOP + 466 },
        });
      }

      // ---- Scrubbing Playhead Needle ---------------------------------------
      // Scrubs smoothly across the timeline from left to right as frame advances
      var playheadT = Math.min(1.0, frame / 150);
      var playheadX = TL_X + 40 + playheadT * (TL_W - 80);

      // Playhead vertical needle glow
      kids.push({
        type: 'rect',
        width: 10,
        height: 610,
        fill: '#8F6BFF',
        opacity: 0.35 * timeIn * (1 - fadeOut),
        blur: 8,
        positioned: { left: playheadX - 5, top: TL_TOP + 20 },
      });

      // Playhead crisp core line
      kids.push({
        type: 'rect',
        width: 2.5,
        height: 610,
        fill: '#FFFFFF',
        opacity: 0.95 * timeIn * (1 - fadeOut),
        positioned: { left: playheadX - 1.2, top: TL_TOP + 20 },
      });

      // Playhead marker badge on top
      kids.push({
        type: 'rect',
        width: 32,
        height: 22,
        radius: 4,
        fill: '#8F6BFF',
        opacity: timeIn * (1 - fadeOut),
        positioned: { left: playheadX - 16, top: TL_TOP + 4 },
      });
      kids.push({
        type: 'text',
        text: 'F' + (frame < 10 ? '0' : '') + frame,
        opacity: timeIn * (1 - fadeOut),
        style: {
          fontSize: 10,
          fontFamily: 'monospace',
          color: '#FFFFFF',
          fontWeight: '700',
        },
        positioned: { left: playheadX - 13, top: TL_TOP + 8 },
      });
    }

    // Outer subtle vignette
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#000000',
      opacity: 0.28,
      positioned: { left: 0, top: 0 },
    });

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
