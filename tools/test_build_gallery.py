import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import zipfile


class BuildGalleryTest(unittest.TestCase):
    def test_shared_brand_sources_are_bundled_and_rewritten(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            repo = Path(temporary)
            project = repo / "samples" / "demo"
            previews = repo / "previews"
            output = repo / "gallery"
            project.mkdir(parents=True)
            previews.mkdir()
            (repo / "brand" / "fa").mkdir(parents=True)
            (project / "scenes").mkdir()
            (project / "yoclip.yaml").write_text("config: {duration: 1}\n")
            (project / "scenes" / "main.scene.js").write_text("scene = {};\n")
            (project / "project.js").write_text(
                "project = {lib: ['../../brand/fa/fa_kit.js'], "
                "scenes: [{path: 'scenes/main.scene.js'}]};\n"
            )
            (repo / "brand" / "fa" / "fa_kit.js").write_text("// shared kit\n")
            (repo / "gallery.json").write_text(json.dumps({
                "schemaVersion": 1,
                "samples": [{
                    "id": "demo",
                    "title": "Demo",
                    "revision": "r1",
                    "project": "samples/demo",
                }],
            }))
            (previews / "demo.mp4").write_bytes(b"video")
            (previews / "demo.png").write_bytes(b"poster")

            subprocess.run([
                sys.executable,
                str(Path(__file__).with_name("build_gallery.py")),
                "--previews",
                str(previews),
                "--output",
                str(output),
            ], cwd=repo, check=True)

            archive_path = output / "sources" / "demo-r1.zip"
            self.assertTrue(archive_path.is_file())
            with zipfile.ZipFile(archive_path) as archive:
                names = set(archive.namelist())
                self.assertIn("demo/project.js", names)
                self.assertIn("demo/brand/fa/fa_kit.js", names)
                self.assertIn("demo/scenes/main.scene.js", names)
                packaged_project = archive.read("demo/project.js").decode()
                self.assertIn("'brand/fa/fa_kit.js'", packaged_project)
                self.assertNotIn("../../brand", packaged_project)
                self.assertEqual(
                    archive.read("demo/brand/fa/fa_kit.js").decode(),
                    "// shared kit\n",
                )
            manifest = json.loads((output / "samples.json").read_text())
            self.assertEqual(manifest["samples"][0]["archiveBytes"], archive_path.stat().st_size)


if __name__ == "__main__":
    unittest.main()
