const ASSET = "animations";
const AUDIO = "audio";

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

const VIDEO_SOURCES = [...new Set(
  Object.values(MOVES).flatMap((move) => Object.values(move.files).map((file) => (
    typeof file === "string" ? file : file.source
  ))),
)];

const DIFFICULTY = {
  easy: { think: 620, aggression: 0.48, block: 0.07, special: 0.09, damage: 0.72, speed: 8.5 },
  medium: { think: 410, aggression: 0.62, block: 0.15, special: 0.14, damage: 0.88, speed: 10.5 },
  hard: { think: 260, aggression: 0.76, block: 0.25, special: 0.21, damage: 1.05, speed: 12.5 },
  "very-hard": { think: 150, aggression: 0.9, block: 0.38, special: 0.3, damage: 1.18, speed: 14 },
};

// GitHub Pages build clips are already cropped to the performance area.
const SOURCE_CROP = { x: 0, y: 0, width: 460, height: 540 };
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

class VideoAssetCache {
  constructor(sources) {
    this.sources = sources;
    this.objectUrls = new Map();
    this.failures = new Set();
    this.preloadPromise = null;
  }

  resolve(source) {
    return this.objectUrls.get(source) || source;
  }

  preloadAll() {
    if (this.preloadPromise) return this.preloadPromise;
    let nextIndex = 0;
    const loadNext = async () => {
      while (nextIndex < this.sources.length) {
        const source = this.sources[nextIndex++];
        try {
          const response = await fetch(source, { cache: "force-cache" });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const blob = await response.blob();
          this.objectUrls.set(source, URL.createObjectURL(blob));
        } catch {
          // Direct URLs remain a safe fallback if prefetching is unavailable.
          this.failures.add(source);
        }
      }
    };
    this.preloadPromise = Promise.all(Array.from({ length: 5 }, () => loadNext()));
    return this.preloadPromise;
  }
}

class SoundEngine {
  constructor() {
    this.context = null;
    this.enabled = true;
    this.sampleSources = {
      fatality: `${AUDIO}/fatality audio.mp3`,
      getOverHere: `${AUDIO}/get over here.mp3`,
      slash1: `${AUDIO}/slash1.mp3`,
      slash2: `${AUDIO}/slash2.mp3`,
    };
    this.sampleTemplates = new Map();
    this.activeSamples = new Set();
  }

  ensure() {
    if (!this.enabled) return null;
    if (!this.context) this.context = new (window.AudioContext || window.webkitAudioContext)();
    if (this.context.state === "suspended") this.context.resume();
    return this.context;
  }

  tone(frequency, duration = 0.08, type = "square", volume = 0.045, slide = 0) {
    const context = this.ensure();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, frequency + slide), context.currentTime + duration);
    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }

  ui() { this.tone(330, 0.06, "triangle", 0.035, 140); }
  swing() { this.tone(150, 0.09, "sawtooth", 0.025, -80); }
  hit(blocked = false) {
    this.tone(blocked ? 210 : 78, blocked ? 0.08 : 0.14, blocked ? "square" : "sawtooth", 0.065, -40);
    if (!blocked) window.setTimeout(() => this.tone(52, 0.11, "square", 0.035, -15), 25);
  }
  announce() { this.tone(72, 0.3, "sawtooth", 0.045, -30); }

  preloadSamples() {
    for (const name of Object.keys(this.sampleSources)) this.getSampleTemplate(name);
  }

  getSampleTemplate(name) {
    if (this.sampleTemplates.has(name)) return this.sampleTemplates.get(name);
    const source = this.sampleSources[name];
    if (!source) return null;
    const audio = new Audio(source);
    audio.preload = "auto";
    this.sampleTemplates.set(name, audio);
    return audio;
  }

  playSample(name, volume = 0.82) {
    if (!this.enabled) return null;
    this.ensure();
    const template = this.getSampleTemplate(name);
    if (!template) return null;
    const audio = template.cloneNode(true);
    audio.volume = clamp(volume, 0, 1);
    this.activeSamples.add(audio);
    const release = () => this.activeSamples.delete(audio);
    audio.addEventListener("ended", release, { once: true });
    audio.addEventListener("error", release, { once: true });
    audio.play().catch(release);
    return audio;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (enabled) {
      this.ensure();
      return;
    }
    for (const audio of this.activeSamples) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.activeSamples.clear();
  }
}

class Fighter {
  constructor(game, id, element) {
    this.game = game;
    this.id = id;
    this.element = element;
    this.canvas = $("canvas", element);
    this.context = this.canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    this.videos = new Map();
    this.current = null;
    this.currentVideo = null;
    this.facing = id === "player" ? "R" : "L";
    this.x = id === "player" ? 29 : 71;
    this.health = 100;
    this.rounds = 0;
    this.canChromaKey = true;
    this.lastRenderedTime = -1;
    this.moveDirection = 0;
    this.manualReverse = false;
    this.damageScale = 1;
    this.setPosition(this.x);
  }

  preload(moveNames) {
    for (const name of moveNames) {
      const spec = MOVES[name];
      for (const side of ["L", "R"]) this.getVideo(this.resolveFile(spec, side).source);
    }
  }

  prepare(moveNames) {
    for (const name of moveNames) {
      const spec = MOVES[name];
      if (!spec) continue;
      const video = this.getVideo(this.resolveFile(spec).source);
      if (video === this.currentVideo) continue;
      const seekToStart = () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return;
        const start = video.duration * moveStartRatio(spec);
        if (Math.abs(video.currentTime - start) > 0.025) video.currentTime = start;
      };
      if (video.readyState >= 1) seekToStart();
      else video.addEventListener("loadedmetadata", seekToStart, { once: true });
      if (video.readyState < 2) video.load();
    }
  }

  getVideo(source) {
    if (this.videos.has(source)) return this.videos.get(source);
    while (this.videos.size >= 10) {
      const disposable = [...this.videos.entries()].find(([, candidate]) => candidate !== this.currentVideo);
      if (!disposable) break;
      const [oldSource, oldVideo] = disposable;
      oldVideo.pause();
      oldVideo.removeAttribute("src");
      oldVideo.load();
      this.videos.delete(oldSource);
    }
    const video = document.createElement("video");
    const cachedSource = this.game.media.resolve(source);
    video.src = cachedSource;
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.disablePictureInPicture = true;
    video.addEventListener("error", () => {
      const directSource = new URL(source, document.baseURI).href;
      if (video.src !== directSource) {
        video.src = source;
        video.load();
      }
    }, { once: true });
    this.videos.set(source, video);
    return video;
  }

  resolveFile(spec, facing = this.facing) {
    // The recording labels describe the camera side, which is opposite the
    // fighter's in-game facing direction.
    const recordedSide = facing === "R" ? "L" : "R";
    const value = spec.files[recordedSide];
    return typeof value === "string" ? { source: value, mirror: false } : value;
  }

  play(name, options = {}) {
    const spec = MOVES[name];
    if (!spec) return false;
    const facing = options.facing || this.facing;
    const file = this.resolveFile(spec, facing);
    const video = this.getVideo(file.source);

    if (this.currentVideo && this.currentVideo !== video) this.currentVideo.pause();
    video.pause();
    video.loop = Boolean(spec.loop) && !options.reverse;
    const playbackRate = options.playbackRate ?? spec.playbackRate ?? PLAYBACK_SPEED[spec.type] ?? 1.35;
    const startRatio = options.startRatio ?? moveStartRatio(spec);
    video.playbackRate = playbackRate;

    const playbackToken = Symbol(name);
    this.currentVideo = video;
    this.current = {
      name,
      spec,
      facing,
      mirror: Boolean(file.mirror),
      didHit: false,
      playedAudioCues: new Set(),
      playbackRate,
      startRatio,
      reverse: Boolean(options.reverse),
      startedAt: performance.now(),
      playbackToken,
      retriedLoad: false,
      ready: false,
      startRequested: false,
      holdAtStart: Boolean(options.holdAtStart),
      resumeRequested: !options.holdAtStart,
    };
    this.manualReverse = Boolean(options.reverse);
    this.lastRenderedTime = -1;

    const beginPlayback = () => {
      const state = this.current;
      if (state?.playbackToken !== playbackToken || this.currentVideo !== video || state.startRequested) return;
      state.startRequested = true;
      const start = options.reverse && Number.isFinite(video.duration)
        ? Math.max(0, video.duration - 0.04)
        : Number.isFinite(video.duration) ? video.duration * startRatio : 0;
      const startVideo = () => {
        const activeState = this.current;
        if (activeState?.playbackToken !== playbackToken || this.currentVideo !== video) return;
        if (activeState.holdAtStart && !activeState.resumeRequested) {
          video.pause();
          activeState.ready = true;
          this.render();
          return;
        }
        if (options.reverse) {
          activeState.ready = true;
          return;
        }
        video.play().then(() => {
          if (this.current?.playbackToken === playbackToken) this.current.ready = true;
        }).catch(() => {
          if (this.current?.playbackToken === playbackToken) {
            this.current.ready = false;
            this.current.startRequested = false;
          }
        });
      };
      try {
        if (Math.abs(video.currentTime - start) > 0.025 || video.ended) {
          video.addEventListener("seeked", startVideo, { once: true });
          video.currentTime = start;
        } else {
          startVideo();
        }
      } catch {
        startVideo();
      }
    };
    if (video.readyState >= 2) beginPlayback();
    else {
      video.addEventListener("canplay", beginPlayback, { once: true });
      video.load();
    }

    window.setTimeout(() => {
      const state = this.current;
      if (state?.playbackToken !== playbackToken || state.ready) return;
      state.retriedLoad = true;
      state.startRequested = false;
      video.addEventListener("canplay", beginPlayback, { once: true });
      video.load();
    }, 850);

    window.setTimeout(() => {
      const state = this.current;
      if (state?.playbackToken !== playbackToken || state.ready || name === "idle") return;
      this.playIdle(true);
    }, 2400);
    return true;
  }

  releaseHeldAnimation() {
    const state = this.current;
    const video = this.currentVideo;
    if (!state || !video || !state.holdAtStart) return false;
    state.holdAtStart = false;
    state.resumeRequested = true;
    if (!state.ready) return true;
    state.ready = false;
    video.play().then(() => {
      if (this.current === state) state.ready = true;
    }).catch(() => {
      if (this.current === state) state.ready = false;
    });
    return true;
  }

  playIdle(force = false) {
    if (!force && this.current?.name === "idle" && this.current.facing === this.facing) return;
    this.play("idle");
  }

  canAct() {
    return !this.current || ["idle", "movement", "crouch", "block"].includes(this.current.spec.type);
  }

  attack(name, force = false) {
    if (this.game.phase !== "active" || (!force && !this.canAct())) return false;
    this.game.sound.swing();
    const started = this.play(name);
    if (started) queueMicrotask(() => this.game.prepareReaction(this, MOVES[name]));
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
    this.game.sound.hit(blocking);
    this.game.showImpact(this);
    if (!blocking) {
      const knockback = move.projectile ? 1.2 : move.damage * 0.055;
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
    const video = this.currentVideo;
    const state = this.current;
    if (!video || !state) return;

    if (!state.ready) {
      this.render();
      return;
    }

    if (state.holdAtStart && !state.resumeRequested) {
      this.render();
      return;
    }

    if (state.reverse && Number.isFinite(video.duration) && video.readyState >= 2) {
      const next = video.currentTime - deltaSeconds * state.playbackRate;
      video.currentTime = next <= 0 ? Math.max(0, video.duration - 0.05) : next;
    }

    const duration = video.duration;
    const normalized = Number.isFinite(duration) && duration > 0 ? video.currentTime / duration : 0;

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
      if (!state.didHit && normalized >= activeStart && normalized <= activeEnd) this.game.tryHit(this, state);
      if (state.spec.projectile) this.game.updateSpear(this, normalized);
    }

    const endRatio = state.spec.endRatio ?? 0.985;
    const isComplete = video.ended || (Number.isFinite(duration) && normalized >= endRatio);
    if (isComplete && !state.spec.loop) {
      if (state.spec.holdLastFrame) {
        video.pause();
      } else if (this.game.phase === "active") {
        this.playIdle(true);
      }
    }

    this.render();
  }

  render() {
    const video = this.currentVideo;
    if (!video || video.readyState < 2 || video.currentTime === this.lastRenderedTime) return;
    const context = this.context;
    const width = this.canvas.width;
    const height = this.canvas.height;
    context.clearRect(0, 0, width, height);
    context.save();
    if (this.current.mirror) {
      context.translate(width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(
      video,
      SOURCE_CROP.x,
      SOURCE_CROP.y,
      SOURCE_CROP.width,
      SOURCE_CROP.height,
      0,
      0,
      width,
      height,
    );
    context.restore();

    if (this.canChromaKey) {
      try {
        const frame = context.getImageData(0, 0, width, height);
        const pixels = frame.data;
        for (let index = 0; index < pixels.length; index += 4) {
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const peak = Math.max(red, green, blue);
          if (peak <= 16) pixels[index + 3] = 0;
          else if (peak < 46) pixels[index + 3] = Math.round(((peak - 16) / 30) * pixels[index + 3]);
        }
        context.putImageData(frame, 0, 0);
      } catch {
        this.canChromaKey = false;
        this.canvas.classList.add("blend-fallback");
      }
    }
    this.lastRenderedTime = video.currentTime;
  }
}

class CostumeCombat {
  constructor() {
    this.arena = $("#arena");
    this.gameScreen = $("#game-screen");
    this.media = new VideoAssetCache(VIDEO_SOURCES);
    this.player = new Fighter(this, "player", $("#player-fighter"));
    this.cpu = new Fighter(this, "cpu", $("#cpu-fighter"));
    this.sound = new SoundEngine();
    this.keys = new Set();
    this.selectedDifficulty = "medium";
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
    $("#sound-button").addEventListener("click", (event) => {
      this.sound.setEnabled(!this.sound.enabled);
      event.currentTarget.textContent = `Sound: ${this.sound.enabled ? "On" : "Off"}`;
      if (this.sound.enabled) this.sound.ui();
    });
    $("#moves-button").addEventListener("click", () => $("#moves-dialog").showModal());
  }

  bindInput() {
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
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
      if (key === "arrowdown") this.player.play("crouch");
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
      if (this.phase === "active") this.player.playIdle(true);
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
    this.player.play("block");
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
  }

  returnToMenu() {
    this.flowToken += 1;
    this.phase = "menu";
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
    await this.media.preloadAll();
    if (trigger) {
      trigger.disabled = false;
      trigger.textContent = triggerLabel;
    }
    this.isStarting = false;
    if (token !== this.flowToken) return;
    this.showScreen("game-screen");
    this.arena.className = `arena stage-${this.selectedStage}`;
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
    this.primeCombatVideos();
    await this.announce("Fight!", "", "", 640, token);
    if (token !== this.flowToken) return;
    this.phase = "active";
    this.lastFrame = performance.now();
    this.cpuNextThink = 0;
  }

  primeCombatVideos() {
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

  keepFightersSeparated() {
    const distance = Math.abs(this.player.x - this.cpu.x);
    if (distance >= 9) return;
    const center = (this.player.x + this.cpu.x) / 2;
    if (this.player.x <= this.cpu.x) {
      this.player.setPosition(center - 4.5);
      this.cpu.setPosition(center + 4.5);
    } else {
      this.player.setPosition(center + 4.5);
      this.cpu.setPosition(center - 4.5);
    }
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

    const playerThreatening = this.player.current?.spec.type === "attack" && distance <= this.player.current.spec.range + 2;
    if (playerThreatening && Math.random() < profile.block) {
      this.cpu.play("block");
      window.setTimeout(() => {
        if (this.phase === "active" && this.cpu.current?.name === "block") this.cpu.playIdle(true);
      }, 360 + Math.random() * 380);
      return;
    }

    if (distance > 20) {
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
    if (!state.spec.projectile && distance > state.spec.range) return;
    state.didHit = true;
    const connected = target.takeDamage(state.spec, attacker);
    if (connected && state.spec.hitSounds) {
      for (const sound of state.spec.hitSounds) this.sound.playSample(sound);
    }
    if (state.spec.projectile && connected) {
      const towardAttacker = attacker.x < target.x ? -1 : 1;
      target.setPosition(target.x + towardAttacker * 3.2);
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
    if (!attacker.current || attacker.current.name !== "spear") return;
    const target = attacker === this.player ? this.cpu : this.player;
    const start = attacker.current.spec.active[0] - 0.05;
    const peak = attacker.current.spec.active[1];
    let progress = 0;
    if (normalized >= start && normalized < peak) progress = clamp((normalized - start) / (peak - start), 0, 1);
    else if (normalized >= peak && normalized < peak + 0.12) progress = 1;
    else if (normalized >= peak + 0.12 && normalized < peak + 0.24) progress = 1 - (normalized - peak - 0.12) / 0.12;
    if (progress <= 0) {
      this.spearElement.classList.remove("is-active");
      return;
    }

    const arenaBox = this.arena.getBoundingClientRect();
    const attackerBox = attacker.element.getBoundingClientRect();
    const targetBox = target.element.getBoundingClientRect();
    const direction = attacker.facing === "R" ? 1 : -1;
    const originX = attackerBox.left - arenaBox.left + attackerBox.width * (direction > 0 ? 0.58 : 0.42);
    const originY = attackerBox.top - arenaBox.top + attackerBox.height * 0.48;
    const targetX = targetBox.left - arenaBox.left + targetBox.width * 0.5;
    const targetY = targetBox.top - arenaBox.top + targetBox.height * 0.48;
    const fullDistance = Math.hypot(targetX - originX, targetY - originY);
    const angle = Math.atan2(targetY - originY, targetX - originX) * 180 / Math.PI;
    this.spearElement.style.left = `${originX}px`;
    this.spearElement.style.top = `${originY}px`;
    this.spearElement.style.width = `${fullDistance * progress}px`;
    this.spearElement.style.setProperty("--angle", `${angle}deg`);
    this.spearElement.classList.add("is-active");
  }

  showImpact(fighter) {
    const impact = $("#impact");
    impact.style.left = `${fighter.x}%`;
    impact.style.top = "52%";
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
    this.keys.clear();
    this.spearElement.classList.remove("is-active");
    winner.rounds += 1;
    this.updateRoundPips();
    const token = this.flowToken;

    if (winner.rounds >= 2) {
      this.finishWinner = winner;
      this.phase = "finish";
      loser.play(MOVES[loser.current?.name]?.reaction || "rightHookReaction");
      await this.announce("Finish Him!", winner === this.player ? "Press F" : "No mercy", "finish", 1550, token);
      if (token !== this.flowToken || this.phase !== "finish") return;
      this.finishTimer = window.setTimeout(() => this.performFatality(winner, loser), winner === this.player ? 1700 : 550);
      return;
    }

    await wait(500);
    if (token !== this.flowToken) return;
    await this.announce("Scorpion Wins", winner === this.player ? "P1 claims the round" : "CPU claims the round", "", 1200, token);
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
    winner.setPosition(midpoint + (winner.x < loser.x ? -7 : 7));
    loser.setPosition(midpoint + (winner.x < loser.x ? 7 : -7));
    this.updateFacing();
    winner.play("fatality");
    loser.play("fatalityReaction", { holdAtStart: true, startRatio: 0 });
    await wait(4200);
    if (token !== this.flowToken) return;
    await this.announce("Fatality", "", "fatality", 1550, token);
    if (token !== this.flowToken) return;
    await this.announce("Scorpion Wins", winner === this.player ? "P1 victorious" : "CPU victorious", "", 1200, token);
    if (token !== this.flowToken) return;
    this.showResult(winner);
  }

  handleAnimationCue(fighter, event) {
    if (event !== "fatalityCrush" || this.phase !== "fatality" || fighter !== this.fatalityWinner) return;
    this.fatalityVictim?.releaseHeldAnimation();
  }

  showResult(winner) {
    this.phase = "result";
    $("#result-overline").textContent = winner === this.player ? `${this.selectedDifficulty.replace("-", " ")} victory` : "The shadow prevailed";
    $("#result-title").textContent = "Scorpion Wins";
    const panel = $("#result-panel");
    panel.classList.add("is-visible");
    panel.setAttribute("aria-hidden", "false");
  }

  tick(now) {
    const deltaSeconds = clamp((now - this.lastFrame) / 1000, 0, 0.05);
    this.lastFrame = now;

    if (this.gameScreen.classList.contains("is-active")) {
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
