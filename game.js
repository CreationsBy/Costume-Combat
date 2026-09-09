import SPRITE_MANIFEST from "./sprite-manifest.js";
import { SoundEngine } from "./sound-engine.js";
import { CHARACTERS, DRIFT_ANIMATIONS, createDriftMoves, DRIFT_MOVE_NAMES } from "./drift-fighter.js";
import { stageUnits, bodySeparation, meleeRange, separatePositions, pullPosition } from "./combat-geometry.js";

const ASSET = "animations";

const sidePair = (left, right) => ({ L: left, R: right });
const mirrored = (source, mirror = true) => ({ source, mirror });

const MOVES = {
  idle: {
    type: "idle",
    loop: true,
    files: sidePair(`${ASSET}/idle/Idle Left_pixelated.mp4`, `${ASSET}/idle/Idle Right_pixelated.mp4`),
  },
  walk: {
    type: "movement",
    loop: true,
    files: sidePair(`${ASSET}/walking/Walking Left_pixelated.mp4`, `${ASSET}/walking/Walking Right_pixelated.mp4`),
  },
  walkReverse: {
    type: "movement",
    loop: true,
    files: sidePair(`${ASSET}/walking/Walking Left Reverse_pixelated.mp4`, `${ASSET}/walking/Walking Right Reverse_pixelated.mp4`),
  },
  intro: {
    type: "cinematic",
    files: sidePair(`${ASSET}/intros/Intro Left_pixelated.mp4`, `${ASSET}/intros/Intro Right_pixelated.mp4`),
  },
  crouch: {
    type: "crouch",
    holdLastFrame: true,
    files: sidePair(`${ASSET}/crouching/Left Crouch_pixelated.mp4`, `${ASSET}/crouching/Right Crouch_pixelated.mp4`),
  },
  block: {
    type: "block",
    holdLastFrame: true,
    endRatio: 0.84,
    files: sidePair(`${ASSET}/blocks/Block L_pixelated.mp4`, `${ASSET}/blocks/Block R_pixelated.mp4`),
  },
  rightHook: {
    type: "attack",
    damage: 7,
    range: 18,
    active: [0.36, 0.64],
    endRatio: 0.82,
    files: sidePair(`${ASSET}/punches/Right Hook L_pixelated.mp4`, `${ASSET}/punches/Right hook R_pixelated.mp4`),
    reaction: "rightHookReaction",
  },
  leftHook: {
    type: "attack",
    damage: 8,
    range: 18,
    active: [0.35, 0.66],
    endRatio: 0.84,
    files: sidePair(`${ASSET}/punches/Left Hook L_pixelated.mp4`, `${ASSET}/punches/Left Hook R_pixelated.mp4`),
    reaction: "leftHookReaction",
  },
  uppercut: {
    type: "attack",
    damage: 14,
    range: 19,
    active: [0.3, 0.63],
    endRatio: 0.92,
    files: sidePair(`${ASSET}/punches/Uppercut L_pixelated.mp4`, `${ASSET}/punches/Uppercut R_pixelated.mp4`),
    reaction: "uppercutReaction",
  },
  spiritPunch: {
    type: "attack",
    damage: 17,
    range: 21,
    active: [0.33, 0.67],
    endRatio: 0.87,
    files: sidePair(`${ASSET}/punches/SP Punch L_pixelated.mp4`, `${ASSET}/punches/SP Punch R_pixelated.mp4`),
    reaction: "spiritPunchReaction",
  },
  kick: {
    type: "attack",
    damage: 9,
    range: 20,
    active: [0.34, 0.67],
    endRatio: 0.82,
    files: { L: `${ASSET}/kicks/Kick L_pixelated.mp4`, R: mirrored(`${ASSET}/kicks/Kick L_pixelated.mp4`) },
    reaction: "kickReaction",
  },
  rightKick: {
    type: "attack",
    damage: 11,
    range: 21,
    active: [0.34, 0.67],
    endRatio: 0.86,
    files: { R: `${ASSET}/kicks/Right Kick R_pixelated.mp4`, L: mirrored(`${ASSET}/kicks/Right Kick R_pixelated.mp4`) },
    reaction: "rightKickReaction",
  },
  sideKick: {
    type: "attack",
    damage: 13,
    range: 23,
    active: [0.31, 0.61],
    endRatio: 0.75,
    files: sidePair(`${ASSET}/kicks/Side Kick L_pixelated.mp4`, `${ASSET}/kicks/Right Side Kick R_pixelated.mp4`),
    reaction: "sideKickReaction",
  },
  sideSlash: {
    type: "attack",
    damage: 12,
    range: 21,
    active: [0.26, 0.62],
    endRatio: 0.88,
    files: sidePair(`${ASSET}/specials/Side Slash L_pixelated.mp4`, `${ASSET}/specials/Side Slash R_pixelated.mp4`),
    reaction: "sideSlashReaction",
    hitSounds: ["slash2"],
  },
  slash: {
    type: "attack",
    damage: 15,
    range: 22,
    active: [0.28, 0.68],
    endRatio: 0.9,
    cancelOnForwardRelease: true,
    files: sidePair(`${ASSET}/specials/Left Slash_pixelated.mp4`, `${ASSET}/specials/Right Slash_pixelated.mp4`),
    reaction: "sideSlashReaction",
    audioCues: [
      { at: 0.38, sound: "slash1" },
      { at: 0.62, sound: "slash2" },
    ],
  },
  spear: {
    type: "attack",
    damage: 16,
    range: 100,
    active: [0.25, 0.58],
    endRatio: 0.82,
    projectile: true,
    files: sidePair(`${ASSET}/specials/Spear L_pixelated.mp4`, `${ASSET}/specials/Spear R_pixelated.mp4`),
    reaction: "spearReaction",
    hitSounds: ["slash1"],
    pullVoice: "getOverHere",
  },
  fatality: {
    type: "cinematic",
    endRatio: 0.42,
    files: sidePair(`${ASSET}/fatality/Fatality L_pixelated.mp4`, `${ASSET}/fatality/Fatality R_pixelated.mp4`),
    audioCues: [{ at: 0.24, sound: "fatality", event: "fatalityCrush" }],
  },

  rightHookReaction: {
    type: "reaction",
    endRatio: 0.62,
    files: sidePair(`${ASSET}/punches/reactions/Right Hook ACT L_pixelated.mp4`, `${ASSET}/punches/reactions/Right Hook ACT R_pixelated.mp4`),
  },
  leftHookReaction: {
    type: "reaction",
    endRatio: 0.62,
    files: sidePair(`${ASSET}/punches/reactions/Left Hook ACT L_pixelated.mp4`, `${ASSET}/punches/reactions/Left Hook ACT R_pixelated.mp4`),
  },
  uppercutReaction: {
    type: "reaction",
    endRatio: 0.8,
    files: sidePair(`${ASSET}/punches/reactions/Uppercut ACT L_pixelated.mp4`, `${ASSET}/punches/reactions/Uppercut ACT R_pixelated.mp4`),
  },
  spiritPunchReaction: {
    type: "reaction",
    endRatio: 0.67,
    files: sidePair(`${ASSET}/punches/reactions/SP Punch ACT L_pixelated.mp4`, `${ASSET}/punches/reactions/SP Punch ACT R_pixelated.mp4`),
  },
  kickReaction: {
    type: "reaction",
    endRatio: 0.56,
    files: { L: `${ASSET}/kicks/reactions/Kick ACT L_pixelated.mp4`, R: mirrored(`${ASSET}/kicks/reactions/Kick ACT L_pixelated.mp4`) },
  },
  rightKickReaction: {
    type: "reaction",
    endRatio: 0.61,
    files: { R: `${ASSET}/kicks/reactions/Right Kick ACT R_pixelated.mp4`, L: mirrored(`${ASSET}/kicks/reactions/Right Kick ACT R_pixelated.mp4`) },
  },
  sideKickReaction: {
    type: "reaction",
    endRatio: 0.57,
    files: {
      L: `${ASSET}/kicks/reactions/Side Kick ACT L_pixelated.mp4`,
      R: `${ASSET}/kicks/reactions/Right Side Kick ACT R_pixelated.mp4`,
    },
  },
  sideSlashReaction: {
    type: "reaction",
    endRatio: 0.76,
    files: sidePair(`${ASSET}/specials/reactions/Side Slash ACT L.mp4`, `${ASSET}/specials/reactions/Side Slash ACT R.mp4`),
  },
  spearReaction: {
    type: "reaction",
    endRatio: 0.66,
    files: sidePair(`${ASSET}/specials/reactions/Spear ACT L_pixelated.mp4`, `${ASSET}/specials/reactions/Spear ACT R_pixelated.mp4`),
  },
  fatalityReaction: {
    type: "cinematic",
    holdLastFrame: true,
    files: {
      L: `${ASSET}/fatality/reactions/Fatality ACT L_pixelated.mp4`,
      R: mirrored(`${ASSET}/fatality/reactions/Fatality ACT L_pixelated.mp4`),
    },
  },
};

for (const [name, move] of Object.entries(MOVES)) {
  if (move.type === "attack") {
    move.reach = ({ rightHook: 0.29, leftHook: 0.3, uppercut: 0.3, spiritPunch: 0.34, kick: 0.35, rightKick: 0.37, sideKick: 0.41, sideSlash: 0.35, slash: 0.38 })[name] ?? 0.3;
    move.soundKind = name.toLowerCase().includes("kick") ? "kick" : "punch";
  }
}
const DRIFT_MOVES = createDriftMoves(MOVES);

const DIFFICULTY = {
  easy: { think: 620, aggression: 0.48, block: 0.07, special: 0.09, damage: 0.72, speed: 8.5 },
  medium: { think: 410, aggression: 0.62, block: 0.15, special: 0.14, damage: 0.88, speed: 10.5 },
  hard: { think: 260, aggression: 0.76, block: 0.25, special: 0.21, damage: 1.05, speed: 12.5 },
  "very-hard": { think: 150, aggression: 0.9, block: 0.38, special: 0.3, damage: 1.18, speed: 14 },
};

const DOUBLE_TAP_MS = 285;
const COMMAND_WINDOW_MS = 520;
const PLAYBACK_SPEED = {
  idle: 1.12,
  movement: 1.55,
  crouch: 1.45,
  block: 1.55,
  attack: 1.65,
  reaction: 1.65,
  cinematic: 1.32,
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
const moveStartRatio = (spec) => spec.startRatio ?? (
  spec.type === "attack" ? Math.max(0, spec.active[0] - 0.1)
    : spec.type === "reaction" ? 0.14
      : spec.type === "block" ? 0.06
        : spec.type === "crouch" ? 0.04
          : 0
);

class SpriteAssetCache {
  constructor(manifest) {
    this.manifest = manifest;
    this.animations = { ...manifest.animations, ...DRIFT_ANIMATIONS };
    this.sources = [manifest.pack];
    this.packBlob = null;
    this.decodedSheets = new Map();
    this.failures = new Set();
    this.preloadPromise = null;
    this.maximumDecodedSheets = 18;
  }

  getAnimation(source) {
    return this.animations[source] || null;
  }

  preloadAll() {
    if (this.preloadPromise) return this.preloadPromise;
    this.preloadPromise = fetch(this.manifest.pack, { cache: "force-cache" }).then(async (response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      if (blob.size !== this.manifest.packBytes) throw new Error(`Expected ${this.manifest.packBytes} bytes, received ${blob.size}`);
      this.packBlob = blob;
      return blob;
    }).catch((error) => {
      this.failures.add(this.manifest.pack);
      throw error;
    });
    this.preloadPromise.catch(() => { this.preloadPromise = null; });
    return this.preloadPromise;
  }

  getSheet(sheet) {
    const key = sheet.src || `${sheet.offset}:${sheet.length}`;
    if (this.decodedSheets.has(key)) {
      const cached = this.decodedSheets.get(key);
      this.decodedSheets.delete(key);
      this.decodedSheets.set(key, cached);
      return cached;
    }

    while (this.decodedSheets.size >= this.maximumDecodedSheets) {
      const [oldKey, oldRecord] = this.decodedSheets.entries().next().value;
      if (oldRecord.objectUrl) URL.revokeObjectURL(oldRecord.objectUrl);
      this.decodedSheets.delete(oldKey);
    }

    const image = new Image();
    image.decoding = "async";
    const record = { key, sheet, image, objectUrl: null, ready: false, failed: false, promise: null };
    record.promise = (sheet.src ? Promise.resolve() : this.preloadAll()).then(() => new Promise((resolve, reject) => {
      if (!sheet.src && (sheet.offset < 0 || sheet.length <= 0 || sheet.offset + sheet.length > this.packBlob.size)) {
        reject(new Error(`Invalid sprite range: ${sheet.name}`));
        return;
      }
      if (!sheet.src) record.objectUrl = URL.createObjectURL(this.packBlob.slice(sheet.offset, sheet.offset + sheet.length, "image/webp"));
      image.addEventListener("load", () => {
        if (sheet.src) {
          const canvas = document.createElement("canvas");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const context = canvas.getContext("2d", { willReadFrequently: true });
          context.drawImage(image, 0, 0);
          const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
          // Register the generated poses to one floor. Standing, crouching and
          // fallen frames retain their actual height; none is stretched to fit.
          record.feet = Array.from({ length: 24 }, (_, cell) => {
            let bottom = 0;
            for (let y = 150; y < 256; y++) {
              let solid = 0;
              for (let x = 12; x < 244; x++) {
                const i = (((Math.floor(cell / 4) * 256 + y) * canvas.width) + (cell % 4) * 256 + x) * 4;
                if (pixels[i + 3] > 220) solid++;
              }
              if (solid >= 8) bottom = y;
            }
            return bottom || 246;
          });
        }
        record.ready = true;
        resolve(record);
      }, { once: true });
      image.addEventListener("error", () => {
        reject(new Error(`Unable to decode packed sprite sheet: ${sheet.name}`));
      }, { once: true });
      image.src = sheet.src || record.objectUrl;
    })).catch((error) => {
      record.failed = true;
      this.failures.add(sheet.name);
      // A subsequent start can retry a transient asset failure.
      if (this.decodedSheets.get(key) === record) this.decodedSheets.delete(key);
      throw error;
    });
    // Preparation is intentionally allowed to continue if a missing asset later
    // falls back to idle; avoid an unhandled rejection in that recovery path.
    record.promise.catch(() => {});
    this.decodedSheets.set(key, record);
    return record;
  }

  getFrame(source, time) {
    const animation = this.getAnimation(source);
    if (!animation) return null;
    const frameIndex = clamp(Math.floor(Math.max(0, time) * (animation.frameRate || this.manifest.frameRate)), 0, animation.frameCount - 1);
    const sheetIndex = clamp(Math.floor(frameIndex / animation.sheetCapacity), 0, animation.sheets.length - 1);
    const sheet = animation.sheets[sheetIndex];
    const localFrame = frameIndex - sheet.startFrame;
    return {
      animation,
      frameIndex,
      sheetIndex,
      sheet,
      localFrame,
      column: (animation.cells?.[frameIndex] ?? localFrame) % animation.columns,
      row: Math.floor((animation.cells?.[frameIndex] ?? localFrame) / animation.columns),
      record: this.getSheet(sheet),
    };
  }

  prepareAnimation(source, time = 0) {
    const frame = this.getFrame(source, time);
    return frame ? frame.record.promise : Promise.reject(new Error(`Missing sprite animation: ${source}`));
  }

  prepareNextSheet(frame) {
    const nextSheet = frame.animation.sheets[frame.sheetIndex + 1];
    if (nextSheet) this.getSheet(nextSheet);
  }
}

class Fighter {
  constructor(game, id, element) {
    this.game = game;
    this.id = id;
    this.character = "scorpion";
    this.moves = MOVES;
    this.pull = null;
    this.pixelData = null;
    this.element = element;
    this.canvas = $("canvas", element);
    this.context = this.canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    this.current = null;
    this.facing = id === "player" ? "R" : "L";
    this.x = id === "player" ? 29 : 71;
    this.health = 100;
    this.rounds = 0;
    this.lastRenderedFrameKey = "";
    this.moveDirection = 0;
    this.damageScale = 1;
    this.setPosition(this.x);
  }

  get name() { return CHARACTERS[this.character].name; }

  setCharacter(character) {
    this.character = CHARACTERS[character] ? character : "scorpion";
    this.moves = this.character === "drift" ? DRIFT_MOVES : MOVES;
    this.current = null;
    this.pull = null;
    this.element.dataset.character = this.character;
    this.element.setAttribute("aria-label", `${this.id === "player" ? "Player one" : "CPU"} ${this.name}`);
    this.playIdle(true);
  }

  preload(moveNames) {
    this.prepare(moveNames);
  }

  prepare(moveNames) {
    for (const name of moveNames) {
      const spec = this.moves[name];
      if (!spec) continue;
      const source = this.resolveFile(spec).source;
      const animation = this.game.media.getAnimation(source);
      if (!animation) continue;
      const startTime = animation.duration * moveStartRatio(spec);
      this.game.media.prepareAnimation(source, startTime).catch(() => {});
    }
  }

  resolveFile(spec, facing = this.facing) {
    // The recording labels describe the camera side, which is opposite the
    // fighter's in-game facing direction.
    const recordedSide = this.character === "drift" ? facing : (facing === "R" ? "L" : "R");
    const value = spec.files[recordedSide];
    return typeof value === "string" ? { source: value, mirror: false } : value;
  }

  play(name, options = {}) {
    const spec = this.moves[name];
    if (!spec) return false;
    const facing = options.facing || this.facing;
    const file = this.resolveFile(spec, facing);
    const animation = this.game.media.getAnimation(file.source);
    if (!animation) return false;
    const playbackRate = options.playbackRate ?? spec.playbackRate ?? PLAYBACK_SPEED[spec.type] ?? 1.35;
    const startRatio = options.startRatio ?? moveStartRatio(spec);
    const playbackToken = Symbol(name);
    const startTime = options.reverse
      ? Math.max(0, animation.duration - (1 / (animation.frameRate || SPRITE_MANIFEST.frameRate)))
      : animation.duration * startRatio;
    this.current = {
      name,
      spec,
      source: file.source,
      animation,
      facing,
      mirror: Boolean(file.mirror),
      didHit: false,
      playedAudioCues: new Set(),
      playbackRate,
      startRatio,
      reverse: Boolean(options.reverse),
      time: startTime,
      playbackToken,
      ready: false,
      completed: false,
      holdAtStart: Boolean(options.holdAtStart),
      resumeRequested: !options.holdAtStart,
    };
    this.lastRenderedFrameKey = "";
    this.pixelData = null;

    const firstFrame = this.game.media.getFrame(file.source, startTime);
    if (firstFrame?.record.ready) {
      this.current.ready = true;
      this.render(true, firstFrame);
    } else {
      this.game.media.prepareAnimation(file.source, startTime).then(() => {
        if (this.current?.playbackToken !== playbackToken) return;
        this.current.ready = true;
        this.render(true);
      }).catch(() => {});
    }

    window.setTimeout(() => {
      const state = this.current;
      if (state?.playbackToken !== playbackToken || state.ready || name === "idle") return;
      this.playIdle(true);
    }, 1500);
    return true;
  }

  releaseHeldAnimation() {
    const state = this.current;
    if (!state || !state.holdAtStart) return false;
    state.holdAtStart = false;
    state.resumeRequested = true;
    return true;
  }

  playIdle(force = false) {
    if (!force && this.current?.name === "idle" && this.current.facing === this.facing) return;
    this.play("idle");
  }

  canAct() {
    return !this.pull && (!this.current || ["idle", "movement", "crouch", "block"].includes(this.current.spec.type));
  }

  attack(name, force = false) {
    if (this.game.phase !== "active" || this.pull || this.current?.spec.type === "reaction" || this.current?.spec.type === "cinematic" || (!force && !this.canAct())) return false;
    const started = this.play(name);
    if (started) queueMicrotask(() => this.game.prepareReaction(this, this.moves[name]));
    return started;
  }

  react(move, blocked = false) {
    if (blocked) {
      this.element.classList.remove("is-hit");
      void this.element.offsetWidth;
      this.element.classList.add("is-hit");
      window.setTimeout(() => this.element.classList.remove("is-hit"), 260);
      return;
    }
    const reaction = move.reaction || "rightHookReaction";
    this.play(reaction);
    this.element.classList.remove("is-hit");
    void this.element.offsetWidth;
    this.element.classList.add("is-hit");
    window.setTimeout(() => this.element.classList.remove("is-hit"), 320);
  }

  takeDamage(move, attacker) {
    const blocking = this.current?.spec.type === "block";
    const rawDamage = move.damage * attacker.damageScale;
    const damage = blocking ? rawDamage * 0.18 : rawDamage;
    this.health = clamp(this.health - damage, 0, 100);
    this.game.updateHealth(this);
    this.react(move, blocking);
    this.game.sound.hit(blocking, move.soundKind, move.damage >= 13);
    this.game.showImpact(this);
    if (!blocking) {
      const knockback = move.projectile ? 0 : stageUnits(move.damage * 0.65, this.game.arena.clientWidth);
      this.setPosition(this.x + (attacker.facing === "R" ? knockback : -knockback));
    }
    return !blocking;
  }

  setPosition(x) {
    this.x = clamp(x, 10, 90);
    this.element.style.left = `${this.x}%`;
  }

  setFacing(facing) {
    if (this.facing === facing) return;
    this.facing = facing;
    if (this.current && ["idle", "movement", "crouch", "block"].includes(this.current.spec.type)) this.play(this.current.name, { reverse: this.current.reverse });
  }

  move(direction, deltaSeconds, speed = 11) {
    this.setPosition(this.x + direction * speed * deltaSeconds);
  }

  update(deltaSeconds) {
    if (this.pull) {
      const pull = this.pull;
      if (this.game.phase !== "active" || pull.attacker.current !== pull.attackState) this.pull = null;
      else {
        pull.elapsed += deltaSeconds;
        this.setPosition(pullPosition(pull.from, pull.destination, pull.elapsed / pull.duration));
        if (pull.elapsed >= pull.duration) this.pull = null;
      }
    }
    const state = this.current;
    if (!state) return;

    const frame = this.game.media.getFrame(state.source, state.time);
    if (!frame?.record.ready) {
      state.ready = false;
      this.render(false, frame);
      return;
    }
    state.ready = true;

    if (state.holdAtStart && !state.resumeRequested) {
      this.render(false, frame);
      return;
    }

    if (state.completed) {
      this.render(false, frame);
      return;
    }

    if (frame.localFrame >= frame.sheet.frameCount - 4) this.game.media.prepareNextSheet(frame);

    const direction = state.reverse ? -1 : 1;
    state.time += deltaSeconds * state.playbackRate * direction;
    const duration = state.animation.duration;
    if (state.spec.loop) {
      if (state.time >= duration) state.time %= duration;
      if (state.time < 0) state.time = Math.max(0, duration + (state.time % duration));
    }
    const normalized = duration > 0 ? clamp(state.time / duration, 0, 1) : 0;

    this.render();
    if (state.spec.landAt && normalized >= state.spec.landAt && !state.landed) {
      state.landed = true;
      this.game.sound.land();
    }
    if (state.spec.audioCues) {
      state.spec.audioCues.forEach((cue, index) => {
        if (normalized >= cue.at && !state.playedAudioCues.has(index)) {
          state.playedAudioCues.add(index);
          this.game.sound.playSample(cue.sound, cue.volume);
          if (cue.event) this.game.handleAnimationCue(this, cue.event);
        }
      });
    }

    if (state.spec.type === "attack") {
      const [activeStart, activeEnd] = state.spec.active;
      if (!state.swung && normalized >= activeStart) {
        state.swung = true;
        this.game.sound.swing(state.spec.soundKind);
      }
      if (state.spec.projectile) this.game.updateSpear(this, normalized);
      else if (!state.didHit && normalized >= activeStart && normalized <= activeEnd) this.game.tryHit(this, state);
    }

    const endRatio = state.spec.endRatio ?? 0.985;
    const isComplete = !state.spec.loop && (state.reverse ? normalized <= 0 : normalized >= endRatio);
    if (isComplete && !state.spec.loop) {
      if (state.spec.holdLastFrame) {
        state.time = duration * endRatio;
        state.completed = true;
      } else if (this.game.phase === "active" && !this.pull) {
        this.playIdle(true);
        return;
      } else {
        state.time = Math.min(state.time, duration);
        state.completed = true;
      }
    }

    this.render();
  }

  render(force = false, suppliedFrame = null) {
    const state = this.current;
    if (!state) return false;
    const frame = suppliedFrame || this.game.media.getFrame(state.source, state.time);
    if (!frame?.record.ready || frame.record.image.naturalWidth === 0) return false;
    const frameKey = `${state.source}:${frame.frameIndex}:${state.mirror}`;
    if (!force && frameKey === this.lastRenderedFrameKey) return true;
    const context = this.context;
    const width = this.canvas.width;
    const height = this.canvas.height;
    context.clearRect(0, 0, width, height);
    context.save();
    if (state.mirror) {
      context.translate(width, 0);
      context.scale(-1, 1);
    }
    // Square generated cells are fitted into the original 360x430 canvas.
    // Keep their feet on the same floor and their body at the same height.
    const drift = this.character === "drift";
    const drawHeight = drift ? width : height;
    const foot = frame.record.feet?.[frame.row * 4 + frame.column] ?? 246;
    const drawTop = drift ? height - 12 - foot / 256 * drawHeight : 0;
    context.drawImage(
      frame.record.image,
      frame.column * frame.animation.frameWidth,
      frame.row * frame.animation.frameHeight,
      frame.animation.frameWidth,
      frame.animation.frameHeight,
      0,
      drawTop,
      width,
      drawHeight,
    );
    context.restore();
    this.lastRenderedFrameKey = frameKey;
    this.pixelData = null;
    return true;
  }
}

class CostumeCombat {
  constructor() {
    this.arena = $("#arena");
    this.gameScreen = $("#game-screen");
    this.media = new SpriteAssetCache(SPRITE_MANIFEST);
    this.player = new Fighter(this, "player", $("#player-fighter"));
    this.cpu = new Fighter(this, "cpu", $("#cpu-fighter"));
    this.sound = new SoundEngine();
    this.keys = new Set();
    this.selectedDifficulty = "medium";
    this.selectedPlayer = "scorpion";
    this.selectedCPU = "drift";
    this.paused = false;
    this.selectedStage = "moon-gate";
    this.phase = "menu";
    this.roundNumber = 1;
    this.roundTime = 90;
    this.lastFrame = performance.now();
    this.flowToken = 0;
    this.pendingPunch = null;
    this.lastPunchAt = 0;
    this.lastPunchKey = "";
    this.spiritReadyUntil = 0;
    this.rightTaps = [];
    this.lastKickAt = 0;
    this.cpuNextThink = 0;
    this.cpuMoveDirection = 0;
    this.cpuMoveUntil = 0;
    this.finishWinner = null;
    this.finishTimer = null;
    this.fatalityWinner = null;
    this.fatalityVictim = null;
    this.isStarting = false;
    this.spearElement = $("#spear");

    this.bindUI();
    this.bindInput();
    this.updateSoundButtons();
    this.player.playIdle(true);
    this.cpu.playIdle(true);
    this.media.preloadAll();
    requestAnimationFrame((time) => this.tick(time));
  }

  bindUI() {
    $("#cpu-mode-button").addEventListener("click", () => { this.sound.ui(); this.showScreen("setup-screen"); });
    $("#two-player-button").addEventListener("click", () => { this.sound.ui(); this.showScreen("controller-screen"); });
    $("#controller-cpu-button").addEventListener("click", () => this.showScreen("setup-screen"));
    $$('[data-back-menu]').forEach((button) => button.addEventListener("click", () => this.returnToMenu()));

    $$("[data-difficulty]").forEach((button) => button.addEventListener("click", () => {
      this.sound.ui();
      this.selectedDifficulty = button.dataset.difficulty;
      $$("[data-difficulty]").forEach((item) => item.classList.toggle("is-selected", item === button));
    }));

    $$("[data-stage]").forEach((button) => button.addEventListener("click", () => {
      this.sound.ui();
      this.selectedStage = button.dataset.stage;
      $$("[data-stage]").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-checked", String(selected));
      });
    }));

    $("#begin-match-button").addEventListener("click", () => this.startMatch());
    $("#rematch-button").addEventListener("click", () => this.startMatch());
    $("#menu-button").addEventListener("click", () => this.returnToMenu());
    $("#exit-button").addEventListener("click", () => this.returnToMenu());
    $$("[data-sound-toggle]").forEach(button => button.addEventListener("click", () => {
      this.sound.setEnabled(!this.sound.enabled);
      this.updateSoundButtons();
    }));
    $$("[data-fighter]").forEach(button => button.addEventListener("click", () => {
      this.sound.ui();
      const side = button.dataset.side;
      if (side === "player") this.selectedPlayer = button.dataset.fighter;
      else this.selectedCPU = button.dataset.fighter;
      $$(`[data-side="${side}"]`).forEach(item => {
        item.classList.toggle("is-selected", item === button);
        item.setAttribute("aria-checked", String(item === button));
      });
    }));
    $("#moves-button").addEventListener("click", () => {
      this.setPaused(true);
      $("#moves-dialog").showModal();
    });
    $("#moves-dialog").addEventListener("close", () => this.setPaused(false));
    $("#pause-button").addEventListener("click", () => this.setPaused(!this.paused));
    $("#resume-button").addEventListener("click", () => this.setPaused(false));
  }

  updateSoundButtons() {
    $$("[data-sound-toggle]").forEach(button => {
      button.textContent = this.sound.enabled ? "Sound: On" : "Sound: Off";
      button.setAttribute("aria-pressed", String(this.sound.enabled));
    });
  }

  setPaused(paused) {
    if (paused && this.phase !== "active") return;
    this.paused = paused;
    this.keys.clear();
    this.lastFrame = performance.now();
    this.sound.setPaused(paused);
    $("#pause-panel").hidden = !paused;
    $("#pause-button").textContent = paused ? "Resume" : "Pause";
  }

  bindInput() {
    window.addEventListener("pointerdown", () => this.sound.unlock(), { once: true });
    window.addEventListener("keydown", (event) => {
      this.sound.unlock();
      const key = event.key.toLowerCase();
      if (key === "escape" && this.phase === "active" && !$("#moves-dialog").open) { this.setPaused(!this.paused); return; }
      if (this.paused || $("#moves-dialog").open || this.phase === "menu" || this.phase === "loading") return;
      if (["arrowleft", "arrowright", "arrowdown", "a", "d", "w", "s", "f"].includes(key)) event.preventDefault();
      if (event.repeat) return;
      this.keys.add(key);
      if (this.phase === "finish" && key === "f" && this.finishWinner === this.player) {
        this.performFatality(this.player, this.cpu);
        return;
      }
      if (this.phase !== "active") return;

      if (key === "arrowright") {
        const now = performance.now();
        this.rightTaps.push(now);
        this.rightTaps = this.rightTaps.filter((stamp) => now - stamp <= COMMAND_WINDOW_MS);
      }
      if (key === "arrowdown" && this.player.canAct()) this.player.play("crouch");
      if (key === "a") this.handleAKey();
      if (key === "d" && this.keys.has("a")) this.startPlayerBlock();
      if (key === "w") this.handlePunch("w");
      if (key === "s") this.handleKick();
    });

    window.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      this.keys.delete(key);
      if (key === "arrowdown" && this.player.current?.spec.type === "crouch") this.player.playIdle(true);
      if ((key === "a" || key === "d") && this.player.current?.spec.type === "block") this.player.playIdle(true);
      if (key === "arrowright" && this.player.current?.spec.cancelOnForwardRelease) this.player.playIdle(true);
    });

    window.addEventListener("blur", () => {
      this.keys.clear();
      if (this.phase === "active") this.setPaused(true);
    });
  }

  handleAKey() {
    if (this.keys.has("d")) {
      this.startPlayerBlock();
      return;
    }
    window.clearTimeout(this.pendingPunch);
    this.pendingPunch = null;
    this.handlePunch("a");
  }

  startPlayerBlock() {
    window.clearTimeout(this.pendingPunch);
    this.pendingPunch = null;
    if (this.player.canAct() || (this.player.current?.spec.type === "attack" && !this.player.current.swung)) this.player.play("block");
  }

  handlePunch(key) {
    const now = performance.now();
    if (key === "w" && this.keys.has("arrowdown")) {
      this.player.attack("uppercut", true);
      this.resetPunchSequence();
      return;
    }
    if (key === "w" && this.keys.has("arrowright")) {
      this.player.attack("slash", true);
      this.resetPunchSequence();
      return;
    }
    if (key === "w" && now <= this.spiritReadyUntil) {
      this.player.attack("spiritPunch", true);
      this.resetPunchSequence();
      return;
    }

    const isDouble = now - this.lastPunchAt <= DOUBLE_TAP_MS;
    if (isDouble) {
      this.player.attack("leftHook", true);
      this.spiritReadyUntil = now + COMMAND_WINDOW_MS;
    } else {
      this.player.attack("rightHook", this.player.current?.spec.type === "attack");
      this.spiritReadyUntil = 0;
    }
    this.lastPunchAt = now;
    this.lastPunchKey = key;
  }

  resetPunchSequence() {
    this.lastPunchAt = 0;
    this.lastPunchKey = "";
    this.spiritReadyUntil = 0;
  }

  handleKick() {
    const now = performance.now();
    const recentRightTaps = this.rightTaps.filter((stamp) => now - stamp <= COMMAND_WINDOW_MS);
    if (this.keys.has("arrowright")) {
      this.player.attack("sideKick", true);
      this.lastKickAt = 0;
      return;
    }
    if (recentRightTaps.length >= 2) {
      this.player.attack("spear", true);
      this.rightTaps = [];
      this.lastKickAt = 0;
      return;
    }
    if (recentRightTaps.length === 1) {
      this.player.attack("sideSlash", true);
      this.rightTaps = [];
      this.lastKickAt = 0;
      return;
    }
    if (now - this.lastKickAt <= DOUBLE_TAP_MS) {
      this.player.attack("rightKick", true);
      this.lastKickAt = 0;
    } else {
      this.player.attack("kick", this.player.current?.spec.type === "attack");
      this.lastKickAt = now;
    }
  }

  showScreen(id) {
    $$(".screen").forEach((screen) => screen.classList.toggle("is-active", screen.id === id));
    this.sound.setScene(({ "menu-screen": "menu", "setup-screen": "setup", "controller-screen": "controller", "game-screen": this.selectedStage })[id]);
  }

  returnToMenu() {
    this.flowToken += 1;
    this.phase = "menu";
    this.setPaused(false);
    this.player.pull = null;
    this.cpu.pull = null;
    this.keys.clear();
    window.clearTimeout(this.finishTimer);
    this.fatalityWinner = null;
    this.fatalityVictim = null;
    this.spearElement.classList.remove("is-active");
    $("#result-panel").classList.remove("is-visible");
    $("#result-panel").setAttribute("aria-hidden", "true");
    this.showScreen("menu-screen");
  }

  async startMatch() {
    if (this.isStarting) return;
    this.isStarting = true;
    const trigger = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null;
    const triggerLabel = trigger?.textContent;
    if (trigger) {
      trigger.disabled = true;
      trigger.textContent = "Loading fighters...";
    }
    this.sound.ensure();
    this.sound.preloadSamples();
    this.sound.ui();
    this.flowToken += 1;
    const token = this.flowToken;
    this.phase = "loading";
    this.fatalityWinner = null;
    this.fatalityVictim = null;
    $("#loading-error").textContent = "";
    this.player.setCharacter(this.selectedPlayer);
    this.cpu.setCharacter(this.selectedCPU);
    this.setPaused(false);
    this.resetInputs();
    try {
      await this.media.preloadAll();
      await Promise.all([this.player, this.cpu].flatMap(fighter => ["idle", "intro"].map(name => this.media.prepareAnimation(fighter.resolveFile(fighter.moves[name]).source))));
    } catch (error) {
      this.isStarting = false;
      if (trigger) { trigger.disabled = false; trigger.textContent = triggerLabel; }
      if (token !== this.flowToken) return;
      this.phase = "menu";
      this.showScreen("setup-screen");
      $("#loading-error").textContent = "Fighters could not load. Check that sprite-pack.bin and sprites/drift are present, then try again.";
      console.error("Fighter loading failed", error);
      return;
    }
    if (trigger) {
      trigger.disabled = false;
      trigger.textContent = triggerLabel;
    }
    this.isStarting = false;
    if (token !== this.flowToken) return;
    this.showScreen("game-screen");
    this.arena.className = `arena stage-${this.selectedStage}`;
    $("#player-name").textContent = this.player.name;
    $("#cpu-name").textContent = this.cpu.name;
    $("#moves-character").textContent = this.player.name;
    $$(".move-grid strong").forEach((label, i) => {
      label.dataset.original ||= label.textContent;
      label.textContent = this.player.character === "drift" ? DRIFT_MOVE_NAMES[i] : label.dataset.original;
    });
    $("#result-panel").classList.remove("is-visible");
    $("#result-panel").setAttribute("aria-hidden", "true");
    this.player.rounds = 0;
    this.cpu.rounds = 0;
    this.player.damageScale = 1;
    this.cpu.damageScale = DIFFICULTY[this.selectedDifficulty].damage;
    this.roundNumber = 1;
    this.updateRoundPips();
    await this.startRound(token);
  }

  async startRound(token = this.flowToken) {
    if (token !== this.flowToken) return;
    this.phase = "intro";
    this.setPaused(false);
    this.resetInputs();
    this.player.pull = null;
    this.cpu.pull = null;
    this.sound.setScene(this.selectedStage);
    this.roundTime = 90;
    this.player.health = 100;
    this.cpu.health = 100;
    this.player.setPosition(29);
    this.cpu.setPosition(71);
    this.updateFacing();
    this.updateHealth(this.player, true);
    this.updateHealth(this.cpu, true);
    $("#round-timer").textContent = "90";
    $("#round-label").textContent = this.roundNumber >= 3 ? "Final Round" : `Round ${this.roundNumber}`;
    this.player.play("intro");
    this.cpu.play("intro");
    await wait(1050);
    if (token !== this.flowToken) return;
    await this.announce(this.roundNumber >= 3 ? "Final Round" : `Round ${this.roundNumber}`, "", "", 1050, token);
    if (token !== this.flowToken) return;
    this.player.playIdle(true);
    this.cpu.playIdle(true);
    this.primeCombatSprites();
    await this.announce("Fight!", "", "", 640, token);
    if (token !== this.flowToken) return;
    this.phase = "active";
    this.lastFrame = performance.now();
    this.cpuNextThink = 0;
  }

  primeCombatSprites() {
    const commonMoves = [
      "rightHook", "kick", "walk", "walkReverse", "block", "crouch",
      "rightHookReaction", "kickReaction",
    ];
    this.player.prepare(commonMoves);
    this.cpu.prepare(commonMoves);
  }

  prepareReaction(attacker, move) {
    const defender = attacker === this.player ? this.cpu : this.player;
    if (move?.reaction) defender.prepare([move.reaction]);
  }

  async announce(text, kicker = "", className = "", hold = 900, token = this.flowToken) {
    const element = $("#announcement");
    element.className = `announcement ${className}`.trim();
    $("#announcement-text").textContent = text;
    $("#announcement-kicker").textContent = kicker;
    void element.offsetWidth;
    element.classList.add("is-visible");
    this.sound.announce();
    await wait(hold);
    if (token !== this.flowToken) return;
    element.classList.add("is-leaving");
    await wait(370);
    if (token === this.flowToken) element.className = "announcement";
  }

  updateFacing() {
    this.player.setFacing(this.player.x <= this.cpu.x ? "R" : "L");
    this.cpu.setFacing(this.cpu.x <= this.player.x ? "R" : "L");
  }

  updateMovement(deltaSeconds) {
    const left = this.keys.has("arrowleft");
    const right = this.keys.has("arrowright");
    const down = this.keys.has("arrowdown");
    const canMove = this.player.canAct() && this.player.current?.spec.type !== "block";
    const direction = left === right ? 0 : (left ? -1 : 1);

    if (canMove && direction && !down) {
      this.player.move(direction, deltaSeconds, 13);
      const backwards = (direction > 0) !== (this.player.facing === "R");
      const walkName = backwards ? "walkReverse" : "walk";
      if (this.player.current?.name !== walkName || this.player.current.facing !== this.player.facing) {
        this.player.play(walkName);
      }
    } else if (canMove && !down && this.player.current?.spec.type === "movement") {
      this.player.playIdle(true);
    }
  }

  resetInputs() {
    this.keys.clear();
    this.resetPunchSequence();
    this.rightTaps = [];
    this.lastKickAt = 0;
    this.cpuMoveDirection = 0;
    this.cpuMoveUntil = 0;
    window.clearTimeout(this.pendingPunch);
    window.clearTimeout(this.finishTimer);
  }

  separation() {
    return bodySeparation(this.player.element.clientWidth, this.cpu.element.clientWidth, this.arena.clientWidth);
  }

  attackRange(attacker, move) {
    const defender = attacker === this.player ? this.cpu : this.player;
    return meleeRange(move, attacker.element.clientWidth, defender.element.clientWidth, this.arena.clientWidth);
  }

  keepFightersSeparated() {
    const positions = separatePositions(this.player.x, this.cpu.x, this.separation());
    this.player.setPosition(positions[0]);
    this.cpu.setPosition(positions[1]);
  }

  visibleContact(attacker, target) {
    const width = attacker.canvas.width;
    const height = attacker.canvas.height;
    attacker.pixelData ||= attacker.context.getImageData(0, 0, width, height).data;
    const forward = attacker.facing === "R" ? 1 : -1;
    const attackerBox = attacker.element.getBoundingClientRect();
    const targetBox = target.element.getBoundingClientRect();
    // Only the defender's body is vulnerable, not an outstretched weapon.
    const targetEdge = targetBox.left + targetBox.width * (forward > 0 ? 0.39 : 0.61);
    let edge = forward > 0 ? 0 : width;
    let edgeY = height / 2;
    for (let y = Math.floor(height * 0.23); y < height * 0.78; y += 3) {
      for (let x = 0; x < width; x += 2) {
        const i = (y * width + x) * 4;
        if (attacker.pixelData[i + 3] < 210) continue;
        if ((x - edge) * forward > 0) { edge = x; edgeY = y; }
      }
    }
    const worldEdge = attackerBox.left + edge / width * attackerBox.width;
    const touches = (worldEdge - targetEdge) * forward >= -3;
    if (touches) this.lastContact = { x: targetEdge - this.arena.getBoundingClientRect().left, y: attackerBox.top + edgeY / height * attackerBox.height - this.arena.getBoundingClientRect().top };
    return touches;
  }

  updateCPU(now, deltaSeconds) {
    const profile = DIFFICULTY[this.selectedDifficulty];
    if (now < this.cpuMoveUntil && this.cpu.canAct()) {
      this.cpu.move(this.cpuMoveDirection, deltaSeconds, profile.speed);
      const backwards = (this.cpuMoveDirection > 0) !== (this.cpu.facing === "R");
      const walkName = backwards ? "walkReverse" : "walk";
      if (this.cpu.current?.name !== walkName || this.cpu.current.facing !== this.cpu.facing) this.cpu.play(walkName);
    } else if (this.cpu.current?.spec.type === "movement") {
      this.cpu.playIdle(true);
    }

    if (now < this.cpuNextThink || !this.cpu.canAct()) return;
    this.cpuNextThink = now + profile.think * (0.72 + Math.random() * 0.6);
    const signedDistance = this.player.x - this.cpu.x;
    const distance = Math.abs(signedDistance);
    const toward = Math.sign(signedDistance) || -1;

    const playerThreatening = this.player.current?.spec.type === "attack" && (this.player.current.spec.projectile || distance <= this.attackRange(this.player, this.player.current.spec) + 1);
    if (playerThreatening && Math.random() < profile.block) {
      this.cpu.play("block");
      window.setTimeout(() => {
        if (this.phase === "active" && this.cpu.current?.name === "block") this.cpu.playIdle(true);
      }, 360 + Math.random() * 380);
      return;
    }

    if (distance > this.attackRange(this.cpu, this.cpu.moves.rightHook) * 0.78) {
      if (Math.random() < profile.special && distance < 52) {
        this.cpu.attack("spear");
      } else {
        this.cpuMoveDirection = toward;
        this.cpuMoveUntil = now + 370 + Math.random() * 650;
      }
      return;
    }

    if (Math.random() > profile.aggression) {
      this.cpuMoveDirection = -toward;
      this.cpuMoveUntil = now + 220 + Math.random() * 320;
      return;
    }

    const roll = Math.random();
    let move = "rightHook";
    if (roll > 0.84) move = "uppercut";
    else if (roll > 0.66) move = "sideKick";
    else if (roll > 0.52) move = "sideSlash";
    else if (roll > 0.32) move = "kick";
    this.cpu.attack(move);
  }

  tryHit(attacker, state) {
    if (state.didHit || this.phase !== "active") return;
    const target = attacker === this.player ? this.cpu : this.player;
    const distance = Math.abs(attacker.x - target.x);
    if ((target.x - attacker.x) * (attacker.facing === "R" ? 1 : -1) <= 0) return;
    if (!state.spec.projectile && (distance > this.attackRange(attacker, state.spec) || !this.visibleContact(attacker, target))) return;
    if (target.pull || (target.current?.spec.type === "reaction" && target.current.spec.landAt && target.current.time / target.current.animation.duration >= target.current.spec.landAt)) return;
    state.didHit = true;
    const connected = target.takeDamage(state.spec, attacker);
    if (connected && state.spec.hitSounds) {
      for (const sound of state.spec.hitSounds) this.sound.playSample(sound);
    }
    state.connected = connected;
    if (state.spec.projectile && connected && target.health > 0) {
      const direction = attacker.x < target.x ? 1 : -1;
      const gap = this.separation() + stageUnits(8, this.arena.clientWidth);
      target.pull = { from: target.x, destination: clamp(attacker.x + direction * gap, 10, 90), elapsed: -0.12, duration: 0.46, attacker, attackState: state };
      if (state.spec.pullVoice) {
        const token = this.flowToken;
        window.setTimeout(() => {
          if (token === this.flowToken && ["active", "round-over"].includes(this.phase)) {
            this.sound.playSample(state.spec.pullVoice, 0.95);
          }
        }, 180);
      }
    }
    if (target.health <= 0) this.endRound(attacker, target);
  }

  updateSpear(attacker, normalized) {
    const state = attacker.current;
    if (!state?.spec.projectile) return;
    const target = attacker === this.player ? this.cpu : this.player;
    const launch = state.spec.active[0];
    const contact = launch + 0.14;
    if (normalized < launch || normalized >= (state.spec.endRatio ?? 0.98)) {
      this.spearElement.classList.remove("is-active");
      return;
    }
    const arenaBox = this.arena.getBoundingClientRect();
    const attackerBox = attacker.element.getBoundingClientRect();
    const targetBox = target.element.getBoundingClientRect();
    const direction = state.facing === "R" ? 1 : -1;
    state.spearAim ??= { x: targetBox.left - arenaBox.left + targetBox.width * 0.5, y: targetBox.top - arenaBox.top + targetBox.height * 0.48, stageX: target.x };
    let progress = clamp((normalized - launch) / (contact - launch), 0, 1);
    if (normalized >= contact && !state.didHit) {
      if (Math.abs(target.x - state.spearAim.stageX) <= stageUnits(targetBox.width * 0.18, arenaBox.width)) {
        this.lastContact = null;
        this.tryHit(attacker, state);
      }
      state.didHit = true;
    }
    const originX = attackerBox.left - arenaBox.left + attackerBox.width * (direction > 0 ? 0.58 : 0.42);
    const originY = attackerBox.top - arenaBox.top + attackerBox.height * 0.48;
    const targetX = state.connected ? targetBox.left - arenaBox.left + targetBox.width * 0.5 : state.spearAim.x;
    const targetY = state.connected ? targetBox.top - arenaBox.top + targetBox.height * 0.48 : state.spearAim.y;
    // During a connected reaction the rope stays attached to the moving chest.
    if (state.didHit && !target.pull) progress = clamp(1 - (normalized - contact - 0.13) / 0.2, 0, 1);
    const fullDistance = Math.hypot(targetX - originX, targetY - originY);
    const angle = Math.atan2(targetY - originY, targetX - originX) * 180 / Math.PI;
    this.spearElement.style.left = `${originX}px`;
    this.spearElement.style.top = `${originY}px`;
    this.spearElement.style.width = `${fullDistance * progress}px`;
    this.spearElement.style.setProperty("--angle", `${angle}deg`);
    this.spearElement.classList.toggle("is-rift", attacker.character === "drift");
    this.spearElement.classList.toggle("is-active", progress > 0);
  }

  showImpact(fighter) {
    const impact = $("#impact");
    const box = fighter.element.getBoundingClientRect();
    const arena = this.arena.getBoundingClientRect();
    impact.style.left = this.lastContact ? `${this.lastContact.x}px` : `${fighter.x}%`;
    impact.style.top = `${this.lastContact?.y ?? (box.top - arena.top + box.height * 0.48)}px`;
    this.lastContact = null;
    impact.classList.remove("is-active");
    void impact.offsetWidth;
    impact.classList.add("is-active");
    window.setTimeout(() => impact.classList.remove("is-active"), 330);
  }

  updateHealth(fighter, immediate = false) {
    const health = $(`#${fighter.id}-health`);
    const damage = $(`#${fighter.id}-damage`);
    const scale = fighter.health / 100;
    if (immediate) damage.style.transition = "none";
    health.style.transform = `scaleX(${scale})`;
    window.setTimeout(() => {
      damage.style.transform = `scaleX(${scale})`;
      if (immediate) window.setTimeout(() => { damage.style.transition = ""; }, 30);
    }, immediate ? 0 : 170);
  }

  updateRoundPips() {
    $$("#player-rounds i").forEach((pip, index) => pip.classList.toggle("is-won", index < this.player.rounds));
    $$("#cpu-rounds i").forEach((pip, index) => pip.classList.toggle("is-won", index < this.cpu.rounds));
  }

  async endRound(winner, loser) {
    if (this.phase !== "active") return;
    this.phase = "round-over";
    this.player.pull = null;
    this.cpu.pull = null;
    this.keys.clear();
    this.spearElement.classList.remove("is-active");
    winner.rounds += 1;
    this.updateRoundPips();
    const token = this.flowToken;

    if (winner.rounds >= 2) {
      this.finishWinner = winner;
      this.phase = "finish";
      this.sound.setScene("finish");
      loser.play("rightHookReaction");
      await this.announce("Finish Him!", winner === this.player ? "Press F" : "No mercy", "finish", 1550, token);
      if (token !== this.flowToken || this.phase !== "finish") return;
      this.finishTimer = window.setTimeout(() => this.performFatality(winner, loser), winner === this.player ? 1700 : 550);
      return;
    }

    await wait(500);
    if (token !== this.flowToken) return;
    await this.announce(`${winner.name} Wins`, winner === this.player ? "P1 claims the round" : "CPU claims the round", "", 1200, token);
    if (token !== this.flowToken) return;
    this.roundNumber += 1;
    await wait(600);
    this.startRound(token);
  }

  async performFatality(winner, loser) {
    if (this.phase !== "finish") return;
    window.clearTimeout(this.finishTimer);
    const token = this.flowToken;
    this.phase = "fatality";
    this.finishWinner = null;
    this.fatalityWinner = winner;
    this.fatalityVictim = loser;
    const midpoint = clamp((winner.x + loser.x) / 2, 32, 68);
    const winnerOnLeft = winner.x < loser.x;
    const halfGap = this.separation() * 0.6;
    winner.setPosition(midpoint + (winnerOnLeft ? -halfGap : halfGap));
    loser.setPosition(midpoint + (winnerOnLeft ? halfGap : -halfGap));
    this.updateFacing();
    winner.play("fatality");
    loser.play("fatalityReaction", { holdAtStart: true, startRatio: 0 });
    await wait(4200);
    if (token !== this.flowToken) return;
    await this.announce("Fatality", "", "fatality", 1550, token);
    if (token !== this.flowToken) return;
    await this.announce(`${winner.name} Wins`, winner === this.player ? "P1 victorious" : "CPU victorious", "", 1200, token);
    if (token !== this.flowToken) return;
    this.showResult(winner);
  }

  handleAnimationCue(fighter, event) {
    if (event !== "fatalityCrush" || this.phase !== "fatality" || fighter !== this.fatalityWinner) return;
    this.fatalityVictim?.releaseHeldAnimation();
  }

  showResult(winner) {
    this.phase = "result";
    this.sound.setScene("result");
    $("#result-overline").textContent = winner === this.player ? `${this.selectedDifficulty.replace("-", " ")} victory` : `${winner.name} prevailed`;
    $("#result-title").textContent = `${winner.name} Wins`;
    const panel = $("#result-panel");
    panel.classList.add("is-visible");
    panel.setAttribute("aria-hidden", "false");
  }

  tick(now) {
    const deltaSeconds = clamp((now - this.lastFrame) / 1000, 0, 0.05);
    this.lastFrame = now;

    if (this.gameScreen.classList.contains("is-active") && !this.paused) {
      if (this.phase === "active") {
        this.updateFacing();
        this.updateMovement(deltaSeconds);
        this.updateCPU(now, deltaSeconds);
        this.keepFightersSeparated();
        this.updateFacing();
        this.roundTime = Math.max(0, this.roundTime - deltaSeconds);
        $("#round-timer").textContent = String(Math.ceil(this.roundTime));
        if (this.roundTime <= 0) {
          const winner = this.player.health >= this.cpu.health ? this.player : this.cpu;
          const loser = winner === this.player ? this.cpu : this.player;
          loser.health = 0;
          this.updateHealth(loser);
          this.endRound(winner, loser);
        }
      }
      this.player.update(deltaSeconds);
      this.cpu.update(deltaSeconds);
      if (this.player.current?.name !== "spear" && this.cpu.current?.name !== "spear") this.spearElement.classList.remove("is-active");
    }
    requestAnimationFrame((time) => this.tick(time));
  }
}

window.costumeCombat = new CostumeCombat();
