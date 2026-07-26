import 'package:flutter/material.dart';
import 'package:yoclip_core/yoclip_core.dart';

class TextAnimationExample extends YoclipComposition {
  const TextAnimationExample({super.key});

  @override
  Widget build(BuildContext context) {
    final frame = useCurrentFrame(context);

    return AbsoluteFill(
      color: Colors.black,
      child: Center(
        child: Transform.translate(
          offset: Offset(
            rvInterpolate(
              frame,
              inputRange: const [0, 30],
              outputRange: const [-300.0, 0],
              easing: RvEasing.easeOut,
            ),
            0,
          ),
          child: const Text(
            'Slide In',
            style: TextStyle(fontSize: 72, color: Colors.white),
          ),
        ),
      ),
    );
  }
}
