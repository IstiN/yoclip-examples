import 'dart:io';

/// Absolute path to the yoclip_motion_shapes sample project.
///
/// Walks upward from the CWD like the other samples' [test_paths], so tests
/// run from the sample dir or the workspace root alike.
String get motionShapesProjectPath {
  final env = Platform.environment['YOCLIP_PROJECT'];
  if (env != null && env.isNotEmpty) return env;

  var dir = Directory.current;
  for (var i = 0; i < 10; i++) {
    final candidate =
        Directory('${dir.path}/samples/samples/yoclip_motion_shapes');
    if (candidate.existsSync() &&
        File('${candidate.path}/yoclip.yaml').existsSync()) {
      return candidate.path;
    }
    final projectYaml = File('${dir.path}/yoclip.yaml');
    if (projectYaml.existsSync() &&
        dir.path.endsWith('yoclip_motion_shapes')) {
      return dir.path;
    }
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  throw StateError('yoclip_motion_shapes project not found from CWD');
}
