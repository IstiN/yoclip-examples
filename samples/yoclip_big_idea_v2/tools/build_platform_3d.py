#!/usr/bin/env python3
"""Converts the sci-fi teleporter platform GLB into the scene's world:
bakes the GLB's own node transforms (the graph already handles the FBX
Z-up -> Y-up conversion), re-centers the pad on the origin, finds its rim
screens (vertices above the deck) and prints their mount transforms — our
hologram panels stand exactly on those screens.

Outputs: platform.glb into the panels dir + MOUNTS json to stdout.

Run from the repo root:
  /tmp/logo3d_venv/bin/python samples/samples/yoclip_big_idea_v2/tools/build_platform_3d.py \
    /Users/Uladzimir_Klyshevich/Downloads/sci-fi_platform__teleporter_padunity__unreal.glb \
    samples/samples/yoclip_big_idea_v2/assets/models/panels/platform.glb
"""

import json
import math
import sys

import numpy as np
import trimesh

SCALE = 1.0             # pad is ~9.1 x 9 world units already — keep
DECK_Y = 1.0            # rim screens rise above this world height


def main():
    src, out = sys.argv[1], sys.argv[2]
    scene = trimesh.load(src)

    # dump() bakes world transforms per mesh (keeps separate materials).
    geoms = scene.dump()
    b = np.array([g.bounds for g in geoms])
    center = np.array([(b[:, 0, 0].min() + b[:, 1, 0].max()) / 2, 0,
                       (b[:, 0, 2].min() + b[:, 1, 2].max()) / 2])

    new_scene = trimesh.Scene()
    hi_pts = []
    for i, g in enumerate(geoms):
        g = g.copy()
        g.apply_translation(-center)
        g.apply_scale(SCALE)
        new_scene.add_geometry(g, node_name=f'part_{i}')
        hi_pts.append(np.asarray(g.vertices)[np.asarray(g.vertices)[:, 1] > DECK_Y])
    new_scene.export(out)
    print(f'platform.glb <- {out}')

    # Rim-screen mounts: cluster the above-deck vertices by angle.
    pts = np.vstack(hi_pts)
    ang = np.degrees(np.arctan2(pts[:, 2], pts[:, 0]))
    order = np.argsort(ang)
    ang_s = ang[order]
    clusters, start = [], 0
    for i in range(1, len(order)):
        if ang_s[i] - ang_s[i - 1] > 12:
            clusters.append(order[start:i])
            start = i
    clusters.append(order[start:])
    if len(clusters) > 1 and (ang_s[0] + 360) - ang_s[-1] < 12:
        clusters[0] = np.concatenate([clusters[-1], clusters[0]])
        clusters.pop()

    mounts = []
    for c in clusters:
        p = pts[c]
        ctr = p.mean(axis=0)
        yaw = math.degrees(math.atan2(ctr[0], ctr[2]))  # radially OUTWARD
        mounts.append({
            'position': [round(float(ctr[0]), 3), round(float(ctr[1]), 3),
                         round(float(ctr[2]), 3)],
            'yawDeg': round(yaw, 1),
        })
    print(f'{len(mounts)} screens')
    print('MOUNTS = ' + json.dumps(mounts))


if __name__ == '__main__':
    main()
