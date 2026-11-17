# Level Up — Direction Revision 2

## Addressed review notes

- Hero presentation now uses close 360° Yoclip and CapCut camera orbits, a fast whip between them, and a circling face-off before the fight.
- Hero names and Pac/WAKA titles occupy the lower third instead of covering the action.
- Fighters use taller adult proportions, articulated upper/lower arms and legs, angular helmets, layered chest/hip armor, darker metallic surfaces, and emissive seams.
- The duel has a readable repeating choreography: boss telegraph, projectiles, Yoclip dodge, volumetric hex shield/parry, then a cyan counter-hit. HUD labels describe the actual phase.
- Overclock is a transformation sequence: both fighters disassemble into shards, arena columns sink, maze walls rise, and Yoclip/CapCut reform as Pac-form/ghost.
- Pac-form keeps Yoclip's cyan visor/ring and violet crest. Its mouth points at the ghost using world-space pursuit direction rather than an incorrect sphere/track assumption.
- Chase distance was increased and maze walls lowered so pursuit remains legible.
- Showdown is explicitly staged as boss charge, Yoclip dash with motion trails, pass-through slash, then voxel K.O. The FINISH title clears before the dash.
- Combat halos were removed, camera framing tightened, and lighting/exposure reduced to avoid washed-out plastic highlights.

## GPU review

Latest review frames are in `build/rework_final/`:

- `film_600.png` — CapCut hero orbit and lower-third identity.
- `film_654.png` — circling face-off.
- `film_870.png` — boss projectile, Yoclip dodge, hex shield and parry HUD.
- `film_1320.png` — city/fighter disassembly into the arcade transformation.
- `film_1560.png` — maze pursuit with Pac mouth facing the ghost.
- `film_2280.png` — pass-through `RENDER BREAK` with separated fighters.
- `film_2970.png` — final podium victory.

These are deliberately stylized armored mecha rendered as actual Three.js 3D geometry, not AI-generated 2D character plates.
