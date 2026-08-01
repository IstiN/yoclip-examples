#!/usr/bin/env python3
"""Build GLB space props for 07_space (torus + asteroid cone).

The software scene3d mesh path has no z-buffer, so a torus shows concentric
band artifacts (back side of the tube paints over the front) and low-poly
cones read as paper crafts. On the GPU flame path these render with real
depth + smooth normals — premium look.

Usage: python3 build_space_models.py <out_dir>  (writes torus.glb, asteroid.glb)
"""

import sys

import numpy as np
import trimesh
from PIL import Image


def srgb_to_linear(hex_str):
    c = tuple(int(hex_str[i:i + 2], 16) for i in (1, 3, 5))
    return tuple((v / 255.0) ** 2.2 for v in c)


def solid(mesh, hex_color, roughness=0.5):
    mat = trimesh.visual.material.PBRMaterial(
        baseColorFactor=[*srgb_to_linear(hex_color), 1.0],
        metallicFactor=0.0, roughnessFactor=roughness)
    mesh.visual = trimesh.visual.TextureVisuals(
        uv=np.zeros((len(mesh.vertices), 2)), material=mat)
    return mesh


def main():
    out_dir = sys.argv[1]

    # Torus: matches the software mesh dims (R=1.15, r=0.26), high segment
    # count — the GPU depth pass makes it artifact-free.
    torus = trimesh.creation.torus(
        major_radius=1.15, minor_radius=0.26,
        major_sections=64, minor_sections=32)
    solid(torus, '#22d3ee', roughness=0.45)
    trimesh.Scene(torus).export(f'{out_dir}/torus.glb')

    # Asteroid: a slightly squashed cone (warm orange), smooth shading.
    cone = trimesh.creation.cone(radius=0.8, height=1.4, sections=48)
    cone.apply_transform(
        trimesh.transformations.scale_matrix(0.85, [0, 0, 0], [1, 1, 1]))
    solid(cone, '#fb923c', roughness=0.6)
    trimesh.Scene(cone).export(f'{out_dir}/asteroid.glb')
    print('wrote torus.glb, asteroid.glb')


if __name__ == '__main__':
    main()
