# Costume Combat

A Mortal Kombat style browser fighter with a complete best-of-three **1P vs. CPU** match, two selectable fighters, four difficulties, and three stages. Scorpion uses the original recorded animations. Drift combines the supplied fox-mask outfit and Rainbow Smash pickaxe references into 96 generated poses with transparent backgrounds.

## Play locally

On this Windows setup:

```powershell
powershell -ExecutionPolicy Bypass -File .\Start-Game.ps1
```

Open **http://localhost:8080** in Chrome or Edge. Alternatively, serve this directory with `python -m http.server 8080`. JavaScript modules require a local server; double-clicking `index.html` will not load the game correctly. No application build or dependency installation is needed to play.

Choose either Scorpion or Drift for the player and CPU. Click or press a key to unlock browser audio. Sound can be muted from the menu or arena, and the preference persists. `Escape`, the Pause button, or opening the move list pauses active combat and audio. Leaving the window pauses an active fight.

## Combat changes

- Melee reach and body separation follow the rendered fighter size. Active attack frames must visibly reach the opponent's body, preventing damage across empty space. The CPU approaches to the same effective range.
- The original camera-side recordings have corrected horizontal registration. The left-facing side kick now uses the later contact frames in its recording.
- A spear travels before dealing damage. An unblocked hit briefly catches the victim, then pulls them smoothly into close follow-up range while the rope stays attached. Blocking causes chip damage without a pull. The same behavior supports Scorpion's spear and Drift's rift tether, in either direction.
- Hit reactions and knockdowns cannot be cancelled by forced attack, crouch, or block inputs. Grounded Drift knockdowns are protected until recovery.
- Fighter names, the move list, round announcements, results, and rematches follow the selected roster.

## Controls

| Input | Scorpion | Drift |
| --- | --- | --- |
| Left / right arrow | Walk / retreat | Walk / retreat with pickaxe |
| Hold down arrow | Crouch | Crouch guard |
| `A` or `W` | Right hook | Pickaxe handle jab |
| `A`, `A` | Double hook | Reverse hook combo |
| `S` | Kick | Front kick |
| `S`, `S` | Double kick | Kick / roundhouse combo |
| `A` + `D` | Block | Braced pickaxe block |
| Down + `W` | Uppercut | Rising pickaxe |
| Tap right, release, then `S` | Side slash | Reverse head strike |
| Hold right + `S` | Side kick | Braced side kick |
| Hold right + `W` | Blade slash | Overhead chop |
| Tap right twice, release, then `S` | Rope spear | Rift tether |
| `A`, `A`, then `W` | Spirit punch | Heavy pickaxe thrust |
| `F` when prompted | Fatality | Pickaxe finisher |
| `Escape` | Pause / resume | Pause / resume |

Quick sequences use a 285 ms double-tap window and a 520 ms command window. Held-arrow specials retain the existing right-arrow controls. The 2P controller menu remains a preview; playable combat is 1P versus CPU.

## Sprite sheets and preview

Open **http://localhost:8080/sprite-preview.html** to play, pause, scrub, and mirror every Drift animation.

- [Complete 96-pose transparent sheet](sprites/drift/drift-complete.png): 1024 × 6144 PNG, four columns and 24 rows.
- [Movement](sprites/drift/movement.png): idle, walk, retreat, crouch, block, intro.
- [Pickaxe attacks](sprites/drift/attacks.png): jab, reverse hook, rising strike, heavy thrust, chop, tether.
- [Kicks and falls](sprites/drift/kicks-falls.png): front kick, roundhouse, side kick, finisher, uppercut fall, heavy-hit fall.
- [Reactions](sprites/drift/reactions.png): right hook, left hook, body kick, high kick, slash, spear.

Each individual page is 1024 × 1536, four columns and six rows, with 256 × 256 cells. The art faces right and is mirrored for the opposite side. `drift-fighter.js` maps the artwork into all 27 animation states, including distinct timing for each hit reaction. Some related moves reuse poses with different sequences. Repeated contact, downed, and recovery frames make the action readable. Runtime foot registration fits the square cells into the original fighter canvas without stretching the body, with additional lift during knockdowns.

The artwork was created with the built-in imagegen tool. Its opaque preview backgrounds were replaced with a flat key and compiled into actual RGBA transparency with the existing FFmpeg workflow. [The full prompt set is saved here](sprites/drift/generation-prompts.md). Source renders are in the ignored `.source-animations/drift/` directory.

Rebuild those PNGs with FFmpeg available at `C:\ffmpeg\bin`:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\build-drift-sprites.ps1
```

The original 49 recordings remain packed in `sprite-pack.bin` with their byte ranges in `sprite-manifest.js`. To rebuild that original pack from the local cropped footage:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\build-sprites.ps1 -Force
```

## Audio

`sound-engine.js` contains original synthesized arrangements for the main menu, fighter selection, controller preview, Moon Gate, Ember Forge, Neon Rooftop, finish sequence, and results. They differ in melody, tempo, harmony, bass, and percussion. Scene transitions crossfade the music.

Punches, kicks, pickaxe impacts, blocked hits, attack whooshes, and ground impacts have distinct synthesized effects synchronized to the combat timeline. The four existing MP3 slash, spear voice, and fatality cues remain available for Scorpion. Music and synthesized effects use Web Audio and require no external music services or downloads.

## Publish on GitHub Pages

The `Costume-Combat/` copy contains the same deployable game. Upload the **contents of one game directory** to the repository root:

- `index.html`, `styles.css`, `game.js`
- `combat-geometry.js`, `drift-fighter.js`, `sound-engine.js`
- `sprite-manifest.js`, `sprite-pack.bin`
- The `sprites/` and `audio/` directories, preserving their paths
- `.nojekyll`, plus `sprite-preview.html` for the animation viewer
- Optionally `README.md`, `Start-Game.ps1`, and `tools/` for local use and rebuilds

Do not upload `.source-animations/` or `.codex-analysis/`. Enable Pages for the repository's root directory. All runtime asset paths are relative so repository subpath hosting works. This task updates local files; it does not publish them automatically.

## Verification

The automated browser suite covers attack contact and misses in both directions, both spear implementations, blocked pulls, reaction locks, every Drift frame mapping, alpha transparency, screen-size geometry, audio signal and mute behavior, pause/resume, character selection, stage changes, results, and rematches.

```powershell
python -m pip install playwright
python tools/verify-game.py
```

The runner uses installed Chrome or Edge and starts its own temporary local web server. If neither browser is installed, run `python -m playwright install chromium`. Reports and screenshots are written to the ignored `.codex-analysis/` directory. The tested game has no browser runtime dependencies.
