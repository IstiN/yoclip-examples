import 'package:flutter/material.dart';
import 'package:yoclip_core/yoclip_core.dart';

class SlideshowExample extends YoclipComposition {
  const SlideshowExample({super.key});

  @override
  Widget build(BuildContext context) {
    final frame = useCurrentFrame(context);

    return AbsoluteFill(
      color: Colors.black,
      child: Stack(
        children: [
          Sequence(
            from: 0,
            duration: 60,
            child: _Slide(
              color: Colors.red,
              frame: frame,
              label: 'Slide 1',
            ),
          ),
          Sequence(
            from: 45,
            duration: 60,
            child: _Slide(
              color: Colors.green,
              frame: frame - 45,
              label: 'Slide 2',
            ),
          ),
        ],
      ),
    );
  }
}

class _Slide extends StatelessWidget {
  const _Slide({
    required this.color,
    required this.frame,
    required this.label,
  });

  final Color color;
  final int frame;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: rvInterpolate(
        frame,
        inputRange: const [0, 15],
        outputRange: const [0, 1],
        easing: RvEasing.easeInOut,
      ),
      child: ColoredBox(
        color: color,
        child: Center(
          child: Text(
            label,
            style: const TextStyle(fontSize: 72, color: Colors.white),
          ),
        ),
      ),
    );
  }
}
