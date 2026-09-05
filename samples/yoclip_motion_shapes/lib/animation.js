// Shared helper lib for the motion & shapes playground.
//
// Declared via project.js `lib` so every scene can use it. The canonical
// (much richer) version lives in samples/samples/yoclip_about/lib/animation.js;
// this copy keeps only what the playground needs: the Motion-Canvas-style
// chained-entrance helper built on the runtime's jsr.motion builtins
// (js_widget_runtime 0.4.114+).

/// Run a chain of tweened steps against the frame clock.
///
/// `steps` is a list of `{ at, dur, from, to, easing?, apply? }` where
/// `at`/`dur` are FRAMES on the current scene's clock and `easing` is the
/// string name of a jsr.ease entry (or a normalized easing function).
/// Returns the eased values in step order; when a step declares `apply(v)`,
/// it is called with the eased value as well.
///
///   var [titleY, card1, card2] = sequence(frame, fps, [
///     { at: 0,  dur: 20, from: 40, to: 0, easing: 'easeInOutCubic' },
///     { at: 15, dur: 20, from: 0,  to: 1 },
///     { at: 30, dur: 20, from: 0,  to: 1 },
///   ]);
function sequence(frame, fps, steps) {
  var ms = frame * 1000 / fps;
  var out = [];
  for (var i = 0; i < steps.length; i++) {
    var s = steps[i];
    var v = jsr.motion.tween(
      ms,
      s.at * 1000 / fps,
      s.dur * 1000 / fps,
      s.from,
      s.to,
      s.easing,
    );
    out.push(v);
    if (s.apply) s.apply(v);
  }
  return out;
}

/// Scene-local elapsed milliseconds — the unit jsr.motion speaks natively.
function elapsedMs(frame, fps) {
  return frame * 1000 / fps;
}
