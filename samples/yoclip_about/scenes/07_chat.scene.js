// Promo scene 6 — chat typing / send. A messenger-style input types a brief,
// the send button presses, and the message lifts off as a delivered bubble.
// Shows text, layout, timing and interaction in one beat.

scene = {
  id: 'chat',
  duration: 270,
  from: 0,
  timeline: {
    label: yoclipT('chat').timeline || 'Chat',
    color: yoclipTheme.colors.primary,
    lane: 'video',
  },
  render: function(frame) {
    var T = yoclipT('chat');
    var life = presence(frame, 14, 226, 16);
    var titleIn = ease(frame, 0, 26, eo3);
    // Portrait variants re-compose: smaller title that clears the watermark,
    // and the bubble/input bar spread out over the tall canvas.
    var portrait = yoclipIsPortrait();

    var message = T.message || 'Make videos from code and scenes.';
    var typed = typewriter(message, frame, 40, 46);
    var sent = frame >= 196;
    var showCursor = !sent && frame >= 40 && blink(frame, 12) === 1;
    var hasText = typed.length > 0;

    var sendPressed = frame >= 188 && frame < 202;
    var sendScale = sendPressed ? 0.9 : 1.0;

    // Sent bubble lifts up after the press.
    var bubbleIn = ease(frame, 200, 228, eo3);
    var bubbleY = (1 - bubbleIn) * 40;

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        {
          type: 'text',
          text: T.title || 'Automate the boring parts',
          style: {
            fontSize: portrait ? 48 : yoclipSize('h6', 68),
            color: yoclipTheme.colors.text,
            fontFamily: yoclipFont(),
            fontWeight: 700,
          },
          alignment: 'topCenter',
          offsetY: (portrait ? 150 : 110) + riseIn(frame, 26, -24),
          opacity: titleIn,
        },
        {
          type: 'text',
          text: T.sub || 'script interactions once, replay forever',
          style: {
            fontSize: yoclipSize('captionLg', 30),
            color: yoclipTheme.colors.textMuted,
            fontFamily: yoclipFont(),
          },
          alignment: 'topCenter',
          offsetY: portrait ? 222 : 192,
          opacity: titleIn,
        },
        // Delivered bubble.
        {
          type: 'container',
          width: 620,
          borderRadius: 28,
          gradient: {
            colors: [yoclipTheme.colors.primary, yoclipColor('violetDeep', '#5b21b6')],
            begin: 'topLeft',
            end: 'bottomRight',
          },
          shadow: { color: yoclipColorA('primary', 0x80), blur: 34, offsetY: 16 },
          alignment: 'center',
          offsetY: (portrait ? 0 : -120) - bubbleY,
          opacity: bubbleIn,
          scale: 0.9 + 0.1 * bubbleIn,
          child: {
            type: 'text',
            text: message,
            style: {
              fontSize: yoclipSize('caption', 28),
              color: yoclipColor('white', '#ffffff'),
              fontFamily: yoclipFont(),
            },
            padding: 18,
          },
        },
        // Input bar.
        {
          type: 'container',
          width: 920,
          height: 96,
          color: yoclipTheme.colors.surface,
          borderColor: yoclipColorA('primary', 0x66),
          borderWidth: 2,
          borderRadius: 32,
          alignment: 'center',
          offsetY: portrait ? 340 : 150,
          child: {
            type: 'row',
            mainAxisAlignment: 'spaceBetween',
            crossAxisAlignment: 'center',
            children: [
              {
                type: 'row',
                crossAxisAlignment: 'center',
                children: [
                  { type: 'container', width: 28 },
                  {
                    type: 'text',
                    text: sent ? '' : (hasText ? typed : T.placeholder || 'Type a message...'),
                    style: {
                      fontSize: yoclipSize('captionXl', 32),
                      color: hasText && !sent
                        ? yoclipTheme.colors.text
                        : yoclipTheme.colors.textMuted,
                      fontFamily: yoclipFont(),
                    },
                    textAlign: 'left',
                  },
                  {
                    type: 'container',
                    width: 3,
                    height: 32,
                    color: yoclipTheme.colors.primaryLight || yoclipColor('lavender', '#a78bfa'),
                    opacity: showCursor ? 1 : 0,
                    offsetX: 4,
                  },
                ],
              },
              {
                type: 'row',
                crossAxisAlignment: 'center',
                children: [
                  {
                    type: 'container',
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    color: yoclipTheme.colors.primary || yoclipColor('primary', '#7c3aed'),
                    alignment: 'center',
                    scale: sendScale,
                    child: {
                      type: 'stack',
                      fit: 'expand',
                      children: [
                        {
                          type: 'path',
                          path: 'M 8 6 L 18 14 L 8 22',
                          color: yoclipColor('white', '#ffffff'),
                          strokeWidth: 2.8,
                          width: 22,
                          height: 22,
                          alignment: 'center',
                        },
                      ],
                    },
                  },
                  { type: 'container', width: 24 },
                ],
              },
            ],
          },
        },
      ],
    };
  },
};
