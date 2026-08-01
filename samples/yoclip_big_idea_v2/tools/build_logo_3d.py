#!/usr/bin/env python3
"""Build extruded 3D GLB models of the yoclip logo from branding/yoclip_logo.svg.

The SVG is fully path-based (no live text). Stroked paths (C-arc, letters,
"Yo") are outlined via shapely buffer with round caps/joins; filled shapes
(bubble, tail, i-dot, white squares) are polygonized directly. Each part is
extruded and exported as a separate GLB so the video scene can animate the
parts independently (declarative scene3d `models:` per-model transforms).

Colors follow the LIGHT theme logo: near-black #13131a letters/arc, white
"Yo" marks, violet→blue brand gradient on the bubble + i-dot. Gradient is
baked into small PNG textures with per-vertex UVs (pre-linearized pow 2.2 —
the flame_3d shader pipeline has no sRGB decode).

Usage:
  python3 build_logo_3d.py <repo_root> <out_dir>
Outputs: arc.glb bubble.glb l.glb i.glb p.glb + prints layout JSON.
"""

import json
import math
import re
import sys

import numpy as np
import trimesh
from PIL import Image
from shapely.affinity import affine_transform
from shapely.geometry import LineString, Polygon
from shapely.ops import unary_union
from svgpathtools import parse_path

INK = (0xFF, 0xFF, 0xFF)      # dark-theme logo: letters/arc in white
WHITE = (0xFF, 0xFF, 0xFF)
GRAD_STOPS = [(0.0, (139, 92, 246)), (0.55, (99, 102, 241)), (1.0, (59, 130, 246))]
DEPTH_OUTER = 30.0              # extrusion depth in outer SVG units
TARGET_WIDTH = 7.5              # world units for the whole logo
RES = 48                        # samples per path segment


# ---------------------------------------------------------------- SVG utils

def load_svg_paths(svg_file):
    text = open(svg_file).read()
    return re.findall(r'\bd="([^"]+)"', text)


def sample_path(d, n=RES):
    """Sample an svg path (any segments) to a list of subpaths of (x, y)."""
    path = parse_path(d)
    subs = []
    for sub in path.continuous_subpaths():
        pts = []
        for seg in sub:
            for i in range(n + 1):
                p = seg.point(i / n)
                pts.append((p.real, p.imag))
        subs.append(pts)
    return subs


def xf(geom, m):
    """Apply an SVG matrix(a,b,c,d,e,f) to a shapely geometry."""
    a, b, c, d, e, f = m
    return affine_transform(geom, [a, c, b, d, e, f])


def stroke_outline(subpaths, width):
    geoms = []
    for pts in subpaths:
        geoms.append(LineString(pts).buffer(
            width / 2.0, cap_style=1, join_style=1, resolution=32))
    return unary_union(geoms)


def fill_polygon(subpaths):
    return Polygon(subpaths[0])


def ring(cx, cy, rx, ry, width, n=96):
    outer = [(cx + (rx + width / 2) * math.cos(2 * math.pi * i / n),
              cy + (ry + width / 2) * math.sin(2 * math.pi * i / n)) for i in range(n)]
    inner = [(cx + (rx - width / 2) * math.cos(2 * math.pi * i / n),
              cy + (ry - width / 2) * math.sin(2 * math.pi * i / n)) for i in range(n)]
    return Polygon(outer, [inner])


def disc(cx, cy, r, n=64):
    return Polygon([(cx + r * math.cos(2 * math.pi * i / n),
                     cy + r * math.sin(2 * math.pi * i / n)) for i in range(n)])


# ------------------------------------------------------------- UV / texture

def srgb_to_linear(c):
    return tuple((v / 255.0) ** 2.2 for v in c)


def make_gradient_tex(path, radial=False):
    # Raw sRGB values — the logo parts render through UnlitMaterial (no tone
    # mapping / no gamma decode), so the texture must carry the display
    # values directly. (The old lit pipeline needed pow-2.2 pre-linearizing.)
    w = 256
    img = np.zeros((2, w, 3), dtype=np.uint8)
    for x in range(w):
        t = x / (w - 1)
        for i in range(len(GRAD_STOPS) - 1):
            t0, c0 = GRAD_STOPS[i]
            t1, c1 = GRAD_STOPS[i + 1]
            if t0 <= t <= t1:
                u = (t - t0) / (t1 - t0)
                c = tuple(c0[k] + (c1[k] - c0[k]) * u for k in range(3))
                break
        img[:, x, :] = [round(v) for v in c]
    Image.fromarray(img).save(path)


# ------------------------------------------------------------------- meshes

def extrude(geom, z0, z1, color=None, uv_fn=None, grad_tex=None, emissive=None,
            boost=1.0, wall_tint=0.7):
    """Extrude a shapely (Multi)Polygon; returns list of Trimesh.

    Two construction details:
    - The caps are separate meshes inset by 0.2% from the side wall — a stock
      extrusion shares the exact cap/wall boundary, which z-fights into dark
      sawtooth triangles on curved silhouettes at closeups.
    - The side wall gets a TINTED material (wall_tint × cap color) — a
      deterministic fake-shading that reads as 3D depth on unlit parts,
      without depending on the scene light rig.
    Wall and caps are returned as separate meshes so they keep their own
    materials in the GLB scene.
    """
    polys = list(geom.geoms) if hasattr(geom, 'geoms') else [geom]
    meshes = []

    def cap_visual():
        if uv_fn is not None:
            return None
        return trimesh.visual.material.PBRMaterial(
            baseColorFactor=[*[v * boost for v in srgb_to_linear(color)], 1.0],
            metallicFactor=0.0, roughnessFactor=0.55,
            emissiveFactor=(list(emissive) if emissive else None))

    def wall_visual():
        if uv_fn is not None:
            # Textured wall: same gradient texture, darkened via albedo tint.
            mat = trimesh.visual.material.PBRMaterial(
                baseColorTexture=Image.open(grad_tex),
                baseColorFactor=[0.72, 0.72, 0.72, 1.0],
                metallicFactor=0.0, roughnessFactor=0.55)
            return mat
        # Tinted wall WITHOUT the cap's boost/emissive — the caps stay full
        # white, the walls go slightly grey: deterministic 3D volume on
        # unlit parts. (boost used to cancel the tint to pure white.)
        c = [min(1.0, v * wall_tint) for v in srgb_to_linear(color)]
        return trimesh.visual.material.PBRMaterial(
            baseColorFactor=[*c, 1.0],
            metallicFactor=0.0, roughnessFactor=0.55)

    for poly in polys:
        if poly.is_empty or poly.area < 1e-6:
            continue
        from shapely.affinity import scale as shp_scale
        inset = shp_scale(poly, xfact=0.998, yfact=0.998, origin='centroid')

        # Side wall: stock extrusion with the cap faces removed.
        wall = trimesh.creation.extrude_polygon(poly, height=z1 - z0)
        wall.apply_translation([0, 0, z0])
        fn = np.asarray(wall.face_normals)
        wall.update_faces(np.where(np.abs(fn[:, 2]) < 0.9)[0])
        if uv_fn is not None:
            wall.visual = trimesh.visual.TextureVisuals(
                uv=np.array([uv_fn(v[0], v[1]) for v in wall.vertices]),
                material=wall_visual())
        else:
            wall.visual = trimesh.visual.TextureVisuals(
                uv=np.zeros((len(wall.vertices), 2)), material=wall_visual())
        meshes.append(wall)

        # Inset caps (front + back), full color.
        from trimesh.creation import triangulate_polygon
        for p in (list(inset.geoms) if hasattr(inset, 'geoms') else [inset]):
            if p.is_empty or p.area < 1e-6:
                continue
            v2d, faces = triangulate_polygon(p, engine='earcut')
            for zc, flip in ((z0, True), (z1, False)):
                v3d = np.column_stack([v2d, np.full(len(v2d), zc)])
                cap = trimesh.Trimesh(
                    vertices=v3d,
                    faces=faces[:, ::-1] if flip else faces,
                    process=False)
                if uv_fn is not None:
                    uv = np.array([uv_fn(v[0], v[1]) for v in cap.vertices])
                    mat = trimesh.visual.material.PBRMaterial(
                        baseColorTexture=Image.open(grad_tex),
                        metallicFactor=0.0, roughnessFactor=0.55)
                    cap.visual = trimesh.visual.TextureVisuals(
                        uv=uv, material=mat)
                else:
                    cap.visual = trimesh.visual.TextureVisuals(
                        uv=np.zeros((len(cap.vertices), 2)),
                        material=cap_visual())
                meshes.append(cap)
    return meshes


def main():
    repo, out_dir = sys.argv[1], sys.argv[2]
    svg = f'{repo}/branding/yoclip_logo.svg'
    grad_tex = f'{out_dir}/_grad.png'
    make_gradient_tex(grad_tex)

    d = load_svg_paths(svg)
    # Path order in branding/yoclip_logo.svg:
    # 0 C-arc (stroke 80) · 1 bubble (fill) · 2 tail (fill) ·
    # 3 white square top · 4 white square bottom · 5 "Y" (stroke 52) ·
    # 6 "l" (stroke 32) · 7 "i" stem (stroke 32) · 8 "p" stem (stroke 32)
    G0 = (0.5, 0, 0, 0.5, 0, 10)
    G1 = (1.125, 0, 0, 1, -108.625, 24)
    G2 = (1.125, 0, 0, 1, -108.625, 12)
    G3 = (1.0, 0, 0, 1, 360, 385)
    G4 = (0.914286, 0, 0, 1.066667, 61, -21.266667)

    # ---- parts in OUTER svg coords (y down) -------------------------------
    arc = xf(stroke_outline(sample_path(d[0]), 80), G0)
    bubble = xf(fill_polygon(sample_path(d[1])), G0)
    tail = xf(fill_polygon(sample_path(d[2])), G0)
    sq1 = xf(xf(fill_polygon(sample_path(d[3])), G1), G0)
    sq2 = xf(xf(fill_polygon(sample_path(d[4])), G2), G0)
    yo_y = xf(xf(stroke_outline(sample_path(d[5]), 52), G3), G0)
    yo_o = xf(xf(ring(230, 105, 65, 65, 52), G3), G0)
    stem_l = stroke_outline(sample_path(d[6]), 32)
    stem_i = stroke_outline(sample_path(d[7]), 32)
    stem_p = stroke_outline(sample_path(d[8]), 32)
    bowl_p = xf(ring(665, 244, 70, 60, 32), G4)
    idot = disc(545, 184, 20)
    idot_ring = ring(545, 184, 22, 22, 4)  # violet frame: r24 outer, r20 inner

    # ---- normalization: y-flip, baseline, center, scale -------------------
    all_geoms = [arc, bubble, tail, sq1, sq2, yo_y, yo_o,
                 stem_l, stem_i, stem_p, bowl_p, idot, idot_ring]
    minx = min(g.bounds[0] for g in all_geoms)
    maxx = max(g.bounds[2] for g in all_geoms)
    maxy = max(g.bounds[3] for g in all_geoms)   # lowest point (y down)
    cx = (minx + maxx) / 2.0
    scale = TARGET_WIDTH / (maxx - minx)

    def norm(geom):
        # y-flip first (svg y-down -> GL y-up), then center/baseline/scale.
        g = affine_transform(geom, [1, 0, 0, -1, 0, 0])
        return affine_transform(g, [scale, 0, 0, scale, -cx * scale, maxy * scale])

    depth = DEPTH_OUTER * scale
    z0, z1 = -depth / 2, depth / 2
    # White inlays (Yo marks, squares, i-dot center) are coplanar with the
    # surface they sit on — extrude them PROUD of it or the faces z-fight
    # (scanline stripes). Z values here are already world units.
    wp0, wp1 = z1 - 0.01, z1 + 0.08   # proud of the bubble face
    wd0, wd1 = z1 - 0.01, z1 + 0.05   # proud of the i-dot face

    # Gradient UVs follow the SVG linear gradient direction. The gradient is
    # defined in INNER icon coords: line (340,330) -> (390,1160); we map
    # outer-normalized coords back through the same t parameter.
    p0 = np.array(xf_point((340, 330), G0))
    p1 = np.array(xf_point((390, 1160), G0))
    dirv = p1 - p0

    def grad_uv(x, y):
        # undo the scene normalization to get outer svg coords
        ox, oy = x / scale + cx, -(y / scale - maxy)
        t = float(np.dot(np.array([ox, oy]) - p0, dirv) / np.dot(dirv, dirv))
        return (min(max(t, 0.0), 1.0), 0.5)

    def idot_uv(x, y):
        ox, oy = x / scale + cx, -(y / scale - maxy)
        t = math.hypot(ox - 545, oy - 184) / 24.0
        return (min(max(t, 0.0), 1.0), 0.5)

    parts = {
        'arc': (extrude(norm(arc), z0, z1, color=INK, boost=1.7)),
        'bubble': (extrude(norm(bubble), z0, z1, uv_fn=grad_uv, grad_tex=grad_tex) +
                   extrude(norm(tail), z0, z1, uv_fn=grad_uv, grad_tex=grad_tex) +
                   extrude(norm(sq1), wp0, wp1, color=WHITE, boost=1.7) +
                   extrude(norm(sq2), wp0, wp1, color=WHITE, boost=1.7) +
                   extrude(norm(yo_y), wp0, wp1, color=WHITE, boost=1.7) +
                   extrude(norm(yo_o), wp0, wp1, color=WHITE, boost=1.7)),
        'l': (extrude(norm(stem_l), z0, z1, color=INK, boost=1.7)),
        'lgrad': (extrude(norm(stem_l), z0, z1, uv_fn=grad_uv, grad_tex=grad_tex)),
        'i': (extrude(norm(stem_i), z0, z1, color=INK, boost=1.7)),
        'idot': (# The dot is the portal the camera dives into: a WHITE disc
                 # (the dive target) framed by a thin violet-gradient ring —
                 # the tiny white inlay of the flat logo read as matte grey.
                 extrude(norm(idot), z0, z1, color=WHITE, emissive=(1, 1, 1),
                         boost=2.0) +
                 extrude(norm(idot_ring), z0, z1 + 0.02, uv_fn=idot_uv,
                         grad_tex=grad_tex)),
        'p': (extrude(norm(stem_p), z0, z1, color=INK, boost=1.7) +
              extrude(norm(bowl_p), z0, z1, color=INK, boost=1.7)),
    }

    layout = {}
    for name, meshes in parts.items():
        scene = trimesh.Scene()
        for j, m in enumerate(meshes):
            scene.add_geometry(m, node_name=f'{name}_{j}')
        scene.export(f'{out_dir}/{name}.glb')
        layout[name] = {
            'center': [round(float(v), 4) for v in scene.bounds.mean(axis=0)],
            'extents': [round(float(v), 4) for v in (scene.bounds[1] - scene.bounds[0])],
        }

    # Extra anchors for the scene: i-dot center, l-stem center.
    idot_c = norm(disc(545, 184, 1)).centroid
    l_c = norm(stem_l).centroid
    layout['_anchors'] = {
        'iDot': [round(float(idot_c.x), 4), round(float(idot_c.y), 4)],
        'lStem': [round(float(l_c.x), 4), round(float(l_c.y), 4)],
        'baseline': 0.0,
        'totalWidth': TARGET_WIDTH,
        'depth': round(depth, 4),
    }
    print(json.dumps(layout, indent=2))


def xf_point(p, m):
    a, b, c, d, e, f = m
    x, y = p
    return (a * x + c * y + e, b * x + d * y + f)


if __name__ == '__main__':
    main()
