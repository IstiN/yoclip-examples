import 'package:flutter/material.dart';
import 'package:yoclip_core/yoclip_core.dart';

class LogoRevealExample extends YoclipComposition {
  const LogoRevealExample({super.key});

  @override
  Widget build(BuildContext context) {
    final frame = useCurrentFrame(context);

    return AbsoluteFill(
      color: Colors.black,
      child: Center(
        child: Transform.scale(
          scale: rvInterpolate(
            frame,
            inputRange: const [0, 30],
            outputRange: const [0, 1],
            easing: RvEasing.easeOut,
          ),
          child: Container(
            width: 200,
            height: 200,
            decoration: const BoxDecoration(
              color: Colors.blue,
              shape: BoxShape.circle,
            ),
          ),
        ),
      ),
    );
  }
}
