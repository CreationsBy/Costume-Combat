# Costume Combat

Costume Combat is a dependency-free browser fighting game built from transparent sprite sheets converted from the supplied performance recordings. The current playable slice is a complete best-of-three **1P vs. CPU** match with four difficulty levels, three original stages, directional animations, reactions, combos, a rope-spear projectile, and a fatality finish.

## Run it

Because the game uses JavaScript modules, run the folder through a small local server instead of double-clicking `index.html`.

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080` in Chrome or Edge. No install or application build step is required.

## Publish on GitHub Pages

The 49 recordings have been converted into 109 transparent WebP atlas pages and bundled into the single **20.31 MB** `sprite-pack.bin` file. The entire site contains only **14 uploadable files**, avoiding GitHub's “fewer than 100 at a time” web-upload limit while remaining safely below GitHub's per-file size limit.

1. Upload `index.html`, `styles.css`, `game.js`, `sprite-manifest.js`, `sprite-pack.bin`, `README.md`, `.nojekyll`, the `tools/` folder, and the four files in `audio/`.
2. Open the repository's **Settings → Pages**.
3. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Wait for the Pages deployment to finish and open the URL GitHub provides.

The source recordings and conversion-ready cropped clips are retained locally in `.source-animations/` and excluded by `.gitignore`. Do not upload that backup folder; the deployed game no longer downloads or plays MP4 files.

To rebuild the sprites after changing source footage, place the cropped clips in `.source-animations/deploy-clips/` and run:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\build-sprites.ps1 -Force
```

## Controls

| Input | Move |
| --- | --- |
| `←` / `→` | Walk; use the matching forward or retreat sprite animation |
| Hold `↓` | Crouch and hold the final pose |
| `A` or `W` | Right hook |
| `A`, `A` | Right hook into left hook |
| `S` | Kick |
| `S`, `S` | Kick into right kick |
| `A` + `D` | Block |
| `↓` + `W` | Uppercut |
| Tap `→`, then `S` | Side slash |
| Hold `→` + `S` | Side kick |
| Hold `→` + `W` | Blade slash; releasing `→` cancels it |
| Tap `→`, `→`, then `S` | Rope spear |
| `A`, `A`, then `W` | Spirit punch |
| `F` | Fatality when **Finish Him!** appears |

Quick sequences use a 285 ms double-tap window and a 520 ms command window.

## How the code works

- `index.html` contains the menu, match setup, HUD, arena layers, move list, and result UI.
- `styles.css` creates the Moon Gate, Ember Forge, and Neon Rooftop stages entirely with original CSS art. It also handles the arcade menu, HUD, responsive arena, CPU grayscale treatment, spear, and impact effects.
- `game.js` is data-driven: every animation has direction-specific sprite IDs, damage, range, active frames, cutoff timing, and its matching ACT reaction.
- `sprite-manifest.js` records every animation's duration, frame count, atlas layout, and byte range inside `sprite-pack.bin`. The renderer advances frames from the game clock, so attacks and reactions never wait for video seeking or a media `play()` promise.
- The build step crops and scales every source frame, removes its black background, and stores the result in alpha-enabled WebP sheets. Runtime rendering is a single sprite-cell draw with no per-frame chroma-key loop.
- Missing opposite-direction recordings use a horizontal mirror fallback. Retreating has dedicated reversed walking sprite sheets.
- Recording-side labels are resolved opposite the in-game facing direction, keeping both fighters turned toward one another. Playback speed is normalized by animation type, and attack/reaction animations skip inactive lead-in frames while hit and audio cues stay locked to normalized timing.
- The single pack is fetched once. Individual WebP pages are sliced from it in memory only when needed, and an 18-page decoded LRU pool bounds memory. Common combat sprites are warmed during the round intro, each matching reaction is prepared when its attack starts, and the next atlas page is prepared before an animation crosses its current page.
- `tools/build-sprites.ps1` reproducibly converts the local source footage, packs every generated atlas into one binary asset, and regenerates the byte-offset manifest.
- The CPU uses the same fighter state machine as the player. Difficulty changes its reaction interval, aggression, defense chance, move selection, movement speed, and damage.
- Combat uses normalized stage coordinates, active-frame hit checks, health-gated round transitions, matching reactions, and a synchronized DOM rope-spear that extends when the performer's arm reaches the throw pose.
- Audio cues share the move timelines: the regular slash has separate first/final strike sounds, side-slash and spear effects require a confirmed hit, the spear pull triggers its voice line, and the fatality cue follows the arm-extension frame. The victim's fatality reaction holds on its opening frame until that cue fires, then resumes immediately. P1 and CPU use the same cue system, and any future 2P fighter instance inherits it automatically.

The **1P vs. 2P** button is wired to a controller-mode preview screen. Full gamepad combat is intentionally left for the next pass so this version can concentrate on the requested 1P-vs-CPU mode.
