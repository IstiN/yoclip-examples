// Promo scene 7 — the Studio itself. We drop in a real screenshot of the
// YoClip Studio app, turn it in 3D and push in, so the viewer sees the actual
// product (not a schematic mock) glide onto the stage and settle.

scene = {
  id: 'studio',
  duration: 360,
  from: 0,
  timeline: {
    label: yoclipT('studio').timeline || 'Studio',
    color: yoclipTheme.colors.primary,
    lane: 'video',
  },
  render: function(frame) {
    var life = presence(frame, 16, 312, 18);
    // Portrait variants (e.g. shorts 1080x1920) shrink the app card so it
    // fits the narrow canvas with margins, keeping the screenshot aspect,
    // and lift it a touch above center for better vertical rhythm.
    var portrait = yoclipIsPortrait();
    var cardW = portrait ? 960 : 1680;
    var cardH = portrait ? 564 : 986;
    var cardY = portrait ? -60 : 30;

    // 3D turn-in: the card starts tilted and rotates to flat.
    var turn = eo3(seg(frame, 4, 64));
    var rotY = lerp(-18, 0, turn);
    var rotX = lerp(6, 0, turn);

    // Zoom: quick settle 1.18 -> 1.0, then a slow Ken-Burns push (+ a hint of
    // sideways pan) so the frame never feels static.
    var settle = eo3(seg(frame, 0, 70));
    var zoom = lerp(1.18, 1.0, settle);
    var drift = lerp(1.0, 1.05, seg(frame, 70, 340));
    var sc = zoom * drift;
    var panX = lerp(0, -26, seg(frame, 70, 340));

    var inT = ease(frame, 0, 30, eo3);

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        {
          type: 'container',
          width: cardW,
          height: cardH,
          borderRadius: 28,
          color: yoclipTheme.colors.background,
          borderColor: yoclipColor('panel', '#2a2a36'),
          borderWidth: 1.5,
          shadow: { color: yoclipColorA('primary', 0x90), blur: 90, offsetY: 46 },
          clip: true,
          alignment: 'center',
          offsetX: panX,
          offsetY: cardY,
          opacity: inT,
          rotateX: rotX,
          rotateY: rotY,
          scale: sc,
          child: {
            type: 'image',
            source: 'external:studio',
            fit: 'cover',
            width: cardW,
            height: cardH,
          },
        },
      ],
    };
  },
};
