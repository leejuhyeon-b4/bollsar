# Anatomical base provenance

- Publisher: Blender Studio and community contributors.
- Asset: `GEO-body_male_realistic`, supplied in Human Base Meshes.
- Download: https://download.blender.org/demo/asset-bundles/human-base-meshes/human-base-meshes-bundle-v1.0.0.zip
- Official listing: https://www.blender.org/download/demo-files/#assets
- License: **CC0**. Verified against the downloaded `.blend`'s embedded `README`, which states all provided assets are public domain under CC0. A verbatim copy is retained as `asset_README.txt`.
- The archive filename is v1.0.0; the embedded README labels the bundle Version 1.01.
- CC0 permits modification and redistribution, including web distribution. https://creativecommons.org/publicdomain/zero/1.0/
- An unrelated legacy text block called `License` refers to the Rain Rig under CC BY 4.0. No Rain rig, animation, or material is imported for this test; only the realistic male mesh covered by the bundle README is used.
- Anatomical form is the supplied human mesh. Changes are uniform placement, display cuts/closure and subdivision of the base cage without multires skin detail. The rejected mannequin deformations are not reused.

Historical baseline: `output/lola-blockout-20260923-02/lola-shape-pass-01.blend`. This intermediate and the previous tests were archived outside the repository during cleanup; they are not dependencies of the retained final source.

The retained native production source is the adjacent `lola-muscular-v2-macro-fiber-20261013.blend`. It requires no external linked library or image. See `README.md` for its relationship to the deployed, subsequently adjusted GLB.
