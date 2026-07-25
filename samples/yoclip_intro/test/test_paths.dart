import 'dart:io';

/// Returns the absolute path to the yoclip_intro project.
///
/// Prefers the `YOCLIP_PROJECT` environment variable, then searches upward
/// from the current working directory for a `yoclip.yaml` file, and finally
/// falls back to the known sample location so tests can be run either from the
/// sample directory or from the workspace root.
String get yoclipIntroProjectPath {
  final env = Platform.environment['YOCLIP_PROJECT'];
  if (env != null && env.isNotEmpty) return env;

  var dir = Directory.current;
  for (var i = 0; i < 8; i++) {
    final sampleYaml = File('${dir.path}/samples/yoclip_intro/yoclip.yaml');
    if (sampleYaml.existsSync()) return sampleYaml.parent.path;
    final projectYaml = File('${dir.path}/yoclip.yaml');
    if (projectYaml.existsSync()) return dir.path;
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }

  return '/Users/Uladzimir_Klyshevich/git/yoclip/samples/yoclip_intro';
}
