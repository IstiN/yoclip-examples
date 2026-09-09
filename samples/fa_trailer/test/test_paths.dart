import 'dart:io';

/// Absolute path to the fa_trailer sample project.
///
/// Walks upward from the CWD like the other samples' [test_paths], so tests
/// run from the sample dir or the workspace root alike.
String get faTrailerProjectPath {
  final env = Platform.environment['YOCLIP_PROJECT'];
  if (env != null && env.isNotEmpty) return env;

  var dir = Directory.current;
  for (var i = 0; i < 10; i++) {
    final candidate = Directory('${dir.path}/samples/samples/fa_trailer');
    if (candidate.existsSync() &&
        File('${candidate.path}/yoclip.yaml').existsSync()) {
      return candidate.path;
    }
    final projectYaml = File('${dir.path}/yoclip.yaml');
    if (projectYaml.existsSync()) {
      final inSamples = dir.path.endsWith('samples') ||
          dir.path.contains('/samples/samples');
      if (!inSamples) break;
    }
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  throw StateError(
    'Could not locate the fa_trailer sample from ${Directory.current.path}',
  );
}
