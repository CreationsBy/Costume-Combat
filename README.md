# Costume Combat

Costume Combat is a dependency-free browser fighting game built around the supplied MP4 performance clips. The current playable slice is a complete best-of-three **1P vs. CPU** match with four difficulty levels, three original stages, directional animations, reaction clips, combos, a rope-spear projectile, and a fatality finish.

## Run it

The canvas renderer needs the videos to come from the same web origin, so run the folder through a small local server instead of double-clicking `index.html`.

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080` in Chrome or Edge. No install or build step is required.

## Controls

| Input | Move |
| --- | --- |
| `←` / `→` | Walk; the clip reverses while retreating |
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
- `game.js` is data-driven: every animation has direction-specific sources, damage, range, active frames, cutoff timing, and its matching ACT reaction.
- Each MP4 is drawn into a fighter canvas. Pixels close to pure black are made transparent in real time, with a feathered edge that keeps the subject's dark costume intact. The central source crop avoids processing unused Full HD background pixels.
- Missing opposite-direction recordings use a horizontal mirror fallback. Retreating walking clips are stepped backward manually because HTML video does not reliably support negative playback rates.
- The CPU uses the same fighter state machine as the player. Difficulty changes its reaction interval, aggression, defense chance, move selection, movement speed, and damage.
- Combat uses normalized stage coordinates, active-frame hit checks, health-gated round transitions, matching reactions, and a synchronized DOM rope-spear that extends when the performer's arm reaches the throw pose.

The **1P vs. 2P** button is wired to a controller-mode preview screen. Full gamepad combat is intentionally left for the next pass so this version can concentrate on the requested 1P-vs-CPU mode.
