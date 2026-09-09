// Combat distances are measured in rendered fighter pixels, then converted to
// arena coordinates. Resizing the stage must never create longer arms.
export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function stageUnits(pixels, arenaWidth) {
  return pixels * 100 / Math.max(1, arenaWidth);
}

export function bodySeparation(aWidth, bWidth, arenaWidth) {
  return stageUnits((aWidth + bWidth) * 0.105, arenaWidth);
}

export function meleeRange(move, attackerWidth, defenderWidth, arenaWidth) {
  return stageUnits(attackerWidth * (move.reach ?? 0.29) + defenderWidth * 0.09, arenaWidth);
}

export function separatePositions(a, b, minimum, min = 10, max = 90) {
  if (Math.abs(a - b) >= minimum) return [a, b];
  const sign = a <= b ? 1 : -1;
  const center = clamp((a + b) / 2, min + minimum / 2, max - minimum / 2);
  return [center - sign * minimum / 2, center + sign * minimum / 2];
}

export function pullPosition(from, destination, progress) {
  const t = clamp(progress, 0, 1);
  return from + (destination - from) * (1 - (1 - t) ** 3);
}
