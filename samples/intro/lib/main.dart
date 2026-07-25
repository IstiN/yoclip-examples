import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';
import 'package:yoclip_core/yoclip_core.dart';
import 'package:yoclip_player/yoclip_player.dart';

void main() {
  runApp(const YoclipAppLoader());
}

/// Loads external assets and then launches the preview app.
class YoclipAppLoader extends StatefulWidget {
  /// Creates a [YoclipAppLoader].
  const YoclipAppLoader({super.key});

  @override
  State<YoclipAppLoader> createState() => _YoclipAppLoaderState();
}

class _YoclipAppLoaderState extends State<YoclipAppLoader> {
  ResolvedExternalAssets? _resolved;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final yamlString = await rootBundle.loadString('yoclip.yaml');
      final fullConfig = loadYoclipConfigFromString(yamlString);
      final externalAssets =
          fullConfig['external_assets'] as Map<dynamic, dynamic>?;

      if (externalAssets != null && externalAssets.isNotEmpty) {
        final appDir = await getApplicationDocumentsDirectory();
        final resolver = ExternalAssetResolver(cacheRoot: appDir.path);
        final resolved = await resolver.resolve(
          externalAssets,
          fps: 30,
          width: 1920,
          height: 1080,
        );
        setState(() => _resolved = resolved);
      } else {
        setState(() => _resolved = const ResolvedExternalAssets());
      }
    } on Object catch (e) {
      setState(() => _error = e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_error != null) {
      return MaterialApp(
        home: Scaffold(
          body: Center(child: Text('Failed to load external assets: $_error')),
        ),
      );
    }
    if (_resolved == null) {
      return const MaterialApp(
        home: Scaffold(
          body: Center(child: CircularProgressIndicator()),
        ),
      );
    }
    return YoclipApp(externalAssets: _resolved!);
  }
}

/// Root application widget for the Yoclip Intro preview.
class YoclipApp extends StatelessWidget {
  /// Creates a [YoclipApp].
  const YoclipApp({
    required this.externalAssets,
    super.key,
  });

  /// Resolved external assets for video/image inserts.
  final ResolvedExternalAssets externalAssets;

  @override
  Widget build(BuildContext context) {
    return YoclipExternalAssets(
      files: externalAssets.files,
      frameDirs: externalAssets.frameDirs,
      child: MaterialApp(
        title: 'Yoclip Intro',
        theme: ThemeData.dark(useMaterial3: true).copyWith(
          scaffoldBackgroundColor: Colors.transparent,
          textTheme: ThemeData.dark().textTheme.apply(
            fontFamily: yoclipHeadlessFontFamily,
            decoration: TextDecoration.none,
          ),
        ),
        home: const _PreviewScaffold(),
      ),
    );
  }
}

class _PreviewScaffold extends StatefulWidget {
  const _PreviewScaffold();

  @override
  State<_PreviewScaffold> createState() => _PreviewScaffoldState();
}

class _PreviewScaffoldState extends State<_PreviewScaffold> {
  var _preset = YoclipExportPreset.youtube1080;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: _GlassContainer(
          child: YoclipPlayer(
            config: _preset.toConfig(
              duration: 90,
              fps: 30,
            ),
            composition: Composition(
              config: _preset.toConfig(
                duration: 90,
                fps: 30,
              ),
              audio: const IntroVideo().audio,
              child: const Intro(),
            ),
            tracks: const [
              TimelineTrack(
                id: 'video-1',
                label: 'Video 1',
                color: Color(0xFF3B82F6),
                icon: Icons.videocam,
                clips: [
                  TimelineClip(
                    id: 'intro',
                    label: 'Intro scene',
                    start: 0,
                    duration: 90,
                  ),
                  TimelineClip(
                    id: 'laptop',
                    label: 'Laptop clip',
                    start: 15,
                    duration: 60,
                  ),
                ],
              ),
              TimelineTrack(
                id: 'image-1',
                label: 'Image 1',
                color: Color(0xFFF59E0B),
                icon: Icons.image,
                clips: [
                  TimelineClip(
                    id: 'logo',
                    label: 'Logo overlay',
                    start: 0,
                    duration: 90,
                  ),
                ],
              ),
              TimelineTrack(
                id: 'audio-1',
                label: 'Audio 1',
                color: Color(0xFF10B981),
                icon: Icons.audiotrack,
                clips: [
                  TimelineClip(
                    id: 'music',
                    label: 'Background music',
                    start: 0,
                    duration: 90,
                  ),
                ],
              ),
            ],
            onPresetChanged: (preset) => setState(() => _preset = preset),
          ),
        ),
      ),
    );
  }
}

class _GlassContainer extends StatelessWidget {
  const _GlassContainer({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.black.withAlpha((0.35 * 255).round()),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: Colors.white.withAlpha((0.12 * 255).round()),
        ),
        boxShadow: const [
          BoxShadow(
            color: Color.fromARGB(89, 0, 0, 0),
            blurRadius: 40,
            offset: Offset(0, 16),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
          child: child,
        ),
      ),
    );
  }
}

/// The canonical intro composition root, including audio tracks.
class IntroVideo extends Composition {
  /// Creates an [IntroVideo].
  const IntroVideo({super.key})
      : super(
          config: const VideoConfig(
            duration: 90,
            fps: 30,
            width: 1920,
            height: 1080,
          ),
          audio: const [
            AudioTrack.asset(
              'assets/audio/click_loop_drive.mp3',
              start: 0,
              volume: 0.8,
            ),
          ],
          child: const Intro(),
        );
}

/// The canonical intro composition for Yoclip.
class Intro extends YoclipComposition {
  /// Creates an [Intro] composition.
  const Intro({super.key});

  @override
  Widget build(BuildContext context) {
    final frame = useCurrentFrame(context);

    return AbsoluteFill(
      color: Colors.black,
      child: Stack(
        fit: StackFit.expand,
        children: [
          const Sequence(
            from: 15,
            duration: 60,
            child: AnimVideo(
              source: 'external:laptop_open',
            ),
          ),
          const Align(
            alignment: Alignment.topRight,
            child: Padding(
              padding: EdgeInsets.all(32),
              child: SizedBox(
                width: 240,
                height: 135,
                child: AnimImage(
                  source: 'external:logo',
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ),
          Center(
            child: Opacity(
              opacity: rvInterpolate(
                frame,
                inputRange: const [0, 30],
                outputRange: const [0, 1],
                easing: RvEasing.easeInOut,
              ),
              child: Text(
                'Hello, Yoclip!',
                style: TextStyle(
                  fontSize: 96,
                  color: Colors.white,
                  fontFamily: yoclipHeadlessFontFamily,
                  decoration: TextDecoration.none,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
