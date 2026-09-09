export const CHARACTERS = {
  scorpion: { name: "Scorpion", description: "Rope spear · martial arts", color: "#f0b638" },
  drift: { name: "Drift", description: "Rainbow Smash · pickaxe combat", color: "#ff5dbb" },
};

// Page, row, displayed frame sequence, duration in seconds. Repeated contact and
// ground frames supply readable anticipation, hit stop, and knockdown recovery.
const CLIPS = {
  idle: ["movement", 0, [0, 1, 2, 3, 2, 1], 1.0],
  walk: ["movement", 1, [0, 1, 2, 3], 0.52],
  walkReverse: ["movement", 2, [0, 1, 2, 3], 0.62],
  crouch: ["movement", 3, [0, 1, 2, 3], 0.28],
  block: ["movement", 4, [0, 1, 2, 3], 0.22],
  intro: ["movement", 5, [0, 1, 2, 3], 1.25],
  rightHook: ["attacks", 0, [0, 1, 2, 2, 3], 0.42],
  leftHook: ["attacks", 1, [0, 1, 2, 2, 3], 0.46],
  uppercut: ["attacks", 2, [0, 1, 2, 2, 3], 0.64],
  spiritPunch: ["attacks", 3, [0, 1, 2, 2, 3], 0.68],
  slash: ["attacks", 4, [0, 1, 2, 2, 3], 0.65],
  sideSlash: ["attacks", 1, [1, 0, 2, 2, 3], 0.53],
  spear: ["attacks", 5, [0, 1, 2, 2, 2, 3, 3, 3], 1.35],
  kick: ["kicks-falls", 0, [0, 1, 2, 2, 3], 0.48],
  rightKick: ["kicks-falls", 1, [0, 1, 2, 2, 3], 0.55],
  sideKick: ["kicks-falls", 2, [0, 1, 2, 2, 3], 0.62],
  fatality: ["kicks-falls", 3, [0, 1, 1, 2, 3, 3], 1.5],
  rightHookReaction: ["reactions", 0, [1, 2, 2, 3], 0.43],
  leftHookReaction: ["reactions", 1, [1, 2, 2, 3], 0.46],
  kickReaction: ["reactions", 2, [1, 2, 2, 3], 0.53],
  rightKickReaction: ["reactions", 3, [1, 2, 2, 3], 0.57],
  sideSlashReaction: ["reactions", 4, [1, 2, 2, 3], 0.58],
  spearReaction: ["reactions", 5, [0, 1, 2, 2, 3, 3], 1.25],
  uppercutReaction: ["kicks-falls", 4, [0, 1, 2, 3, 3, 3, 2, 0], 1.18],
  spiritPunchReaction: ["kicks-falls", 5, [0, 1, 2, 3, 3, 3, 2, 0], 1.12],
  sideKickReaction: ["kicks-falls", 5, [1, 1, 2, 3, 3, 3, 2, 0], 1.06],
  fatalityReaction: ["kicks-falls", 4, [0, 1, 2, 3, 3, 3], 1.25],
};

export const DRIFT_ANIMATIONS = Object.fromEntries(Object.entries(CLIPS).map(([name, [page, row, frames, duration]]) => [
  `drift/${name}`,
  { duration, frameRate: frames.length / duration, frameCount: frames.length,
    frameWidth: 256, frameHeight: 256, columns: 4, rows: 6, sheetCapacity: frames.length,
    cells: frames.map(column => row * 4 + column),
    sheets: [{ src: `sprites/drift/${page}.png`, name: `drift-${page}`, startFrame: 0, frameCount: frames.length }],
  },
]));

export function createDriftMoves(base) {
  return Object.fromEntries(Object.entries(base).map(([name, move]) => {
    const spec = { ...move, startRatio: 0, endRatio: 0.999, playbackRate: 1,
      files: { R: `drift/${name}`, L: { source: `drift/${name}`, mirror: true } } };
    if (move.type === "attack") {
      spec.active = move.projectile ? [0.25, 0.64] : [0.4, 0.78];
      spec.reach = ["kick", "rightKick", "sideKick"].includes(name) ? 0.4 : 0.43;
      spec.soundKind = ["kick", "rightKick", "sideKick"].includes(name) ? "kick" : "pickaxe";
      spec.audioCues = [];
      spec.hitSounds = [];
      spec.pullVoice = null;
    }
    if (name === "fatality") spec.audioCues = [{ at: 0.5, sound: "slash2", event: "fatalityCrush" }];
    if (["uppercutReaction", "spiritPunchReaction", "sideKickReaction", "fatalityReaction"].includes(name)) spec.landAt = 0.42;
    return [name, spec];
  }));
}

export const DRIFT_MOVE_NAMES = ["Handle jab", "Reverse hook combo", "Double kick", "Rising pickaxe", "Reverse head strike", "Braced side kick", "Overhead chop", "Rift tether", "Heavy pickaxe thrust", "Pickaxe finisher"];
