#!/usr/bin/env python3
"""Builds the 3D assets for 02_kaleido's galaxy-orbit beat.

Outputs (into assets/models/panels/):
  panel_<name>.glb  — thin dark-glass box with the golden screenshot textured
                      onto its front face (the orbiting "3D panels")
  ring_<color>.glb  — elliptical torus lying flat in the XZ plane (the 3D
                      orbit rings: cyan / pink / orange)
  orb_<color>.glb   — small sphere for comet heads/trails
                      (white / cyan / pink / orange)

Materials follow tools/build_logo_3d.py EXACTLY: every mesh gets
TextureVisuals + PBRMaterial (baseColorFactor pre-linearized pow 2.2 for
solid colors; baseColorTexture with raw sRGB pixels for the panel face).
The flame_3d GLB loader does not handle ColorVisuals — it renders those
meshes as a red fallback.

Run from the repo root:
  /tmp/logo3d_venv/bin/python samples/samples/yoclip_big_idea_v2/tools/build_panels_3d.py \
    samples/samples/yoclip_big_idea_v2 samples/samples/yoclip_big_idea_v2/assets/models/panels
"""

import math
import os
import sys

import numpy as np
import trimesh
from PIL import Image, ImageFilter

PANELS = [
    'monolith', 'kaleido', 'endcard', 'space', 'tunnel',
    'prompt', 'deck', 'chat', 'website', 'polish',
]
# Hologram accent per panel (cycles).
ACCENTS = [
    (0x22, 0xd3, 0xee), (0xa7, 0x8b, 0xfa), (0xec, 0x48, 0x99),
    (0x7d, 0xd3, 0xfc), (0xc4, 0xb5, 0xfd),
]

PANEL_W = 2.3
PANEL_H = PANEL_W * 9 / 16          # 1.29375 (goldens are 1920x1080)
PANEL_D = 0.09
BODY_RGB = (0x16, 0x16, 0x2e)       # #16162e dark glass

RINGS = {
    'cyan': (0x22, 0xd3, 0xee),
    'pink': (0xec, 0x48, 0x99),
    'orange': (0xfb, 0xbf, 0x24),
}
RING_RADII = {'cyan': (4.6, 3.7), 'pink': (3.5, 2.8), 'orange': (2.4, 1.9)}
RING_TUBE = 0.016

ORB_COLORS = {
    'white': (255, 255, 255),
    'cyan': (0x22, 0xd3, 0xee),
    'pink': (0xec, 0x48, 0x99),
    'orange': (0xfb, 0xbf, 0x24),
    'violet': (0xa7, 0x8b, 0xfa),
    'blue': (0x3b, 0x82, 0xf6),
    'green': (0x34, 0xd3, 0x99),
}
ORB_R = 0.09


def build_globe():
    """A smooth deep-ocean sphere for 07_space's globe (dots orbit it)."""
    globe = trimesh.creation.icosphere(subdivisions=3, radius=1.6)
    return solid(globe, (0x16, 0x30, 0x7a))


def srgb_to_linear(c):
    return tuple((v / 255.0) ** 2.2 for v in c)


def solid_material(rgb):
    return trimesh.visual.material.PBRMaterial(
        baseColorFactor=[*srgb_to_linear(rgb), 1.0],
        metallicFactor=0.0, roughnessFactor=0.55)


def solid(mesh, rgb):
    mesh.visual = trimesh.visual.TextureVisuals(
        uv=np.zeros((len(mesh.vertices), 2)), material=solid_material(rgb))
    return mesh


def holoize(img_path, accent_rgb, out_size=(512, 288)):
    """Turn a golden screenshot into a HOLOGRAM texture (RGB on black):
    flat areas (white OR black background) go near-black — the panel reads
    as glass on the dark starfield — while DETAILS (text, borders, graphics)
    glow in the accent color with a white-hot core and a soft bloom. The
    detail signal is local contrast |lum − blur(lum)|, so dark text on a
    light bg glows just like bright art on a dark bg."""
    img = Image.open(img_path).convert('RGB').resize(out_size, Image.LANCZOS)
    lum = np.asarray(img.convert('L'), dtype=np.float32) / 255.0

    base = np.asarray(
        Image.fromarray((lum * 255).astype(np.uint8)).filter(
            ImageFilter.GaussianBlur(10)), dtype=np.float32) / 255.0
    detail = np.clip(np.abs(lum - base) * 6.0, 0, 1)

    ar, ag, ab = [v / 255.0 for v in accent_rgb]
    accent = np.array([ar, ag, ab])
    hot = (detail ** 2)[..., None] * 0.55          # white-hot cores
    rgb = accent * (0.35 + 0.65 * detail[..., None]) * detail[..., None] + hot

    # Bloom of the DETAIL signal — the hologram halo around glowing parts.
    bloom = np.asarray(
        Image.fromarray((detail * 255).astype(np.uint8)).filter(
            ImageFilter.GaussianBlur(6)), dtype=np.float32) / 255.0
    rgb += bloom[..., None] * accent * 0.9

    # A whisper of ice-blue across the whole face so the glass plane stays
    # visible even where there is no content.
    rgb += np.array([0.020, 0.028, 0.055])

    return Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8), 'RGB')


def build_panel(img_path, accent_rgb):
    """Ice-glass screen: a slim glowing FRAME (4 edge bars), a near-black
    'ice' back plate and the hologram texture on the front quad. (No alpha
    blending — unsupported by the loader; glass is faked with black.)"""
    hw, hh = PANEL_W / 2, PANEL_H / 2
    e = 0.035                     # frame bar thickness
    fd = PANEL_D                  # frame depth

    scene = trimesh.Scene()

    # Glowing frame: 4 slim bars, near-white (unlit -> reads as a light edge).
    frame_rgb = (225, 235, 255)
    for (w, h, x, y) in [
        (PANEL_W + 2 * e, e, 0, hh + e / 2),
        (PANEL_W + 2 * e, e, 0, -hh - e / 2),
        (e, PANEL_H, -hw - e / 2, 0),
        (e, PANEL_H, hw + e / 2, 0),
    ]:
        bar = solid(trimesh.creation.box(extents=(w, h, fd)), frame_rgb)
        bar.apply_translation([x, y, 0])
        scene.add_geometry(bar, node_name='frame')

    # Ice back plate: near-black with a blue tint — reads as dark glass.
    plate = solid(trimesh.creation.box(extents=(PANEL_W, PANEL_H, 0.02)),
                  (10, 14, 30))
    scene.add_geometry(plate, node_name='ice')

    # Hologram front quad.
    img = holoize(img_path, accent_rgb)
    z = PANEL_D / 2 + 0.004
    verts = np.array([
        [-hw, -hh, z], [hw, -hh, z], [hw, hh, z], [-hw, hh, z],
    ])
    faces = np.array([[0, 1, 2], [0, 2, 3]])
    # glTF texture coords: (0,0) is the image's TOP-LEFT — so the left quad
    # vertex (-hw) takes u=0. (Flipping U here mirrors the screenshot.)
    uv = np.array([[0, 1], [1, 1], [1, 0], [0, 0]], dtype=float)
    # Double-sided: from behind, the panel shows the mirrored hologram —
    # reads as looking THROUGH a glass screen instead of a black void.
    mat = trimesh.visual.material.PBRMaterial(
        baseColorTexture=img,
        metallicFactor=0.0, roughnessFactor=0.55,
        doubleSided=True)
    front = trimesh.Trimesh(vertices=verts, faces=faces, process=False)
    front.visual = trimesh.visual.TextureVisuals(uv=uv, material=mat)
    scene.add_geometry(front, node_name='front')

    # BACK quad with the same hologram (flipped winding to face -Z): the
    # loader culls backfaces, so a see-through screen needs its own face —
    # from behind, the panel shows the (mirrored) hologram instead of a
    # black void.
    zb = -(PANEL_D / 2 + 0.004)
    verts_b = np.array([
        [hw, -hh, zb], [-hw, -hh, zb], [-hw, hh, zb], [hw, hh, zb],
    ])
    back = trimesh.Trimesh(vertices=verts_b, faces=faces, process=False)
    back.visual = trimesh.visual.TextureVisuals(uv=uv, material=mat)
    scene.add_geometry(back, node_name='back')
    return scene


def build_ring(rx, rz, rgb):
    torus = trimesh.creation.torus(
        major_radius=1.0, minor_radius=RING_TUBE,
        major_sections=160, minor_sections=8)
    # Torus lies in the XY plane by default — lay it flat into XZ.
    torus.apply_transform(trimesh.transformations.rotation_matrix(
        math.pi / 2, [1, 0, 0]))
    torus.apply_scale([rx, 1.0, rz])
    return solid(torus, rgb)


def build_orb(rgb):
    return solid(trimesh.creation.icosphere(subdivisions=2, radius=ORB_R), rgb)


def main():
    proj, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)

    for pi, name in enumerate(PANELS):
        img = os.path.join(proj, 'assets/goldens', f'{name}.png')
        build_panel(img, ACCENTS[pi % len(ACCENTS)]).export(
            os.path.join(out_dir, f'panel_{name}.glb'))
        print(f'panel_{name}.glb')

    for cname, rgb in RINGS.items():
        rx, rz = RING_RADII[cname]
        build_ring(rx, rz, rgb).export(
            os.path.join(out_dir, f'ring_{cname}.glb'))
        print(f'ring_{cname}.glb')

    for cname, rgb in ORB_COLORS.items():
        build_orb(rgb).export(os.path.join(out_dir, f'orb_{cname}.glb'))
        print(f'orb_{cname}.glb')

    build_globe().export(os.path.join(out_dir, 'globe.glb'))
    print('globe.glb')


if __name__ == '__main__':
    main()
