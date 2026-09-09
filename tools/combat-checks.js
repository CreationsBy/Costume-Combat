async () => {
  const g = costumeCombat;
  g.paused = true;
  g.sound.setEnabled(false);
  g.resetInputs();
  const results = [];
  const check = (name, condition, details = {}) => {
    results.push({name, pass: Boolean(condition), ...details});
  };
  const prepare = async (fighter, move) => {
    const spec = fighter.moves[move];
    const source = fighter.resolveFile(spec).source;
    await g.media.prepareAnimation(source, g.media.getAnimation(source).duration * (spec.startRatio ?? 0.5));
    fighter.play(move);
    await g.media.prepareAnimation(source, fighter.current.time);
    fighter.current.ready = true;
    fighter.render(true);
    return fighter.current;
  };
  const reset = async (a = "scorpion", b = "drift", reverse = false) => {
    g.phase = "active";
    g.player.setCharacter(a); g.cpu.setCharacter(b);
    g.player.health = g.cpu.health = 100;
    g.player.damageScale = g.cpu.damageScale = 1;
    g.player.setPosition(reverse ? 60 : 40);
    g.cpu.setPosition(reverse ? 40 : 60);
    g.updateFacing();
    await prepare(g.player, "idle"); await prepare(g.cpu, "idle");
  };

  for (const character of ["scorpion", "drift"]) {
    for (const reverse of [false, true]) {
      for (const move of ["rightHook", "leftHook", "uppercut", "spiritPunch", "kick", "rightKick", "sideKick", "sideSlash", "slash"]) {
        await reset(character, character === "drift" ? "scorpion" : "drift", reverse);
        const dir = reverse ? -1 : 1;
        g.cpu.setPosition(g.player.x + dir * (g.separation() + 0.4));
        const state = await prepare(g.player, move);
        const [start, end] = state.spec.active;
        for (let t = start; t <= end + 0.001 && !state.didHit; t += 0.035) {
          state.time = state.animation.duration * t;
          await g.media.prepareAnimation(state.source, state.time);
          g.player.render(true);
          g.tryHit(g.player, state);
        }
        check(`${character} ${reverse ? "left" : "right"} ${move} connects`, state.didHit && g.cpu.health < 100, { health: g.cpu.health, gap: Math.abs(g.cpu.x-g.player.x) });
        await reset(character, "scorpion", reverse);
        g.cpu.setPosition(g.player.x + dir * (g.attackRange(g.player, g.player.moves[move]) + 5));
        const whiff = await prepare(g.player, move);
        whiff.time = whiff.animation.duration * 0.5;
        await g.media.prepareAnimation(whiff.source, whiff.time);
        g.player.render(true);
        g.tryHit(g.player, whiff);
        check(`${character} ${move} cannot hit across a gap`, !whiff.didHit && g.cpu.health === 100);
      }
    }
  }

  for (const character of ["scorpion", "drift"]) {
    for (const reverse of [false, true]) {
      await reset(character, character === "drift" ? "scorpion" : "drift", reverse);
      g.player.setPosition(reverse ? 76 : 24); g.cpu.setPosition(reverse ? 24 : 76);
      const state = await prepare(g.player, "spear");
      const before = g.cpu.x;
      g.updateSpear(g.player, state.spec.active[0] + 0.07);
      check(`${character} spear waits for tip contact`, g.cpu.health === 100 && g.cpu.pull === null);
      g.updateSpear(g.player, state.spec.active[0] + 0.15);
      check(`${character} spear hit begins pull`, Boolean(g.cpu.pull) && g.cpu.health === 84);
      for (let i = 0; i < 20; i++) g.cpu.update(0.04);
      const gap = Math.abs(g.cpu.x - g.player.x);
      check(`${character} ${reverse ? "left" : "right"} spear pulls into melee`, gap < g.attackRange(g.player, g.player.moves.rightHook) && gap >= g.separation() - 0.05 && Math.abs(g.cpu.x-before) > 20, {gap, from: before, to: g.cpu.x});
      check("spear reaction cannot be cancelled by forced attacks", !g.cpu.attack("kick", true));

      await reset(character, "drift", reverse);
      await prepare(g.cpu, "block");
      const blockX = g.cpu.x;
      const blocked = await prepare(g.player, "spear");
      g.updateSpear(g.player, blocked.spec.active[0] + 0.15);
      check(`${character} blocked spear chips without pulling`, !g.cpu.pull && g.cpu.x === blockX && g.cpu.health > 96 && g.cpu.health < 100 && g.cpu.current.name === "block", {health:g.cpu.health});
    }
  }

  await reset("drift", "scorpion");
  for (const [name, spec] of Object.entries(g.player.moves)) {
    const state = await prepare(g.player, name);
    for (let i = 0; i < state.animation.frameCount; i++) {
      const frame = g.media.getFrame(state.source, i / state.animation.frameRate);
      await frame.record.promise;
      check(`Drift ${name} frame ${i} exists`, frame.column >= 0 && frame.column < 4 && frame.row >= 0 && frame.row < 6 && frame.record.ready);
    }
  }
  for (const page of ["movement", "attacks", "kicks-falls", "reactions"]) {
    const im = new Image(); im.src = `sprites/drift/${page}.png`; await im.decode();
    const c = document.createElement("canvas"); c.width = im.width; c.height = im.height;
    const ctx = c.getContext("2d"); ctx.drawImage(im, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let transparent = 0, green = 0;
    for(let i=0;i<d.length;i+=4) { if(d[i+3]===0)transparent++; if(d[i+3]>200 && d[i+1]>d[i]+90 && d[i+1]>d[i+2]+90)green++; }
    check(`${page} contains real transparency`, transparent > c.width*c.height*0.45, {transparent: transparent/(c.width*c.height), greenPixels:green});
  }
  const geom = await import("./combat-geometry.js");
  for (const size of [640, 960, 1366, 1920, 2560]) {
    const w = Math.min(390, Math.max(250, size*0.29));
    const a = geom.meleeRange({reach:0.3}, w, w, size);
    check(`reach follows sprite pixels at ${size}px`, Math.abs(a*size/100-w*0.39)<0.001);
    const [left,right] = geom.separatePositions(10,11,geom.bodySeparation(w,w,size));
    check(`corner separation at ${size}px`, left>=10 && right-left>=geom.bodySeparation(w,w,size)-0.001);
  }
  await reset("scorpion", "drift");
  g.player.setPosition(45); g.cpu.setPosition(45+g.separation()+1.2);
  g.updateFacing();
  await prepare(g.player, "idle"); await prepare(g.cpu, "idle");
  g.updateHealth(g.player, true); g.updateHealth(g.cpu, true);
  return {checks:results.length, failures:results.filter(r=>!r.pass), results};
}
