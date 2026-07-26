import 'package:flutter/material.dart';
import 'package:yoclip_core/yoclip_core.dart';

class IntroExample extends YoclipComposition {
  const IntroExample({super.key});

  @override
  Widget build(BuildContext context) {
    final frame = useCurrentFrame(context);

    return AbsoluteFill(
      color: Colors.black,
      child: Center(
        child: Opacity(
          opacity: rvInterpolate(
            frame,
            inputRange: const [0, 30],
            outputRange: const [0, 1],
            easing: RvEasing.easeInOut,
          ),
          child: const Text(
            'Hello, Yoclip!',
            style: TextStyle(fontSize: 96, color: Colors.white),
          ),
        ),
      ),
    );
  }
}
