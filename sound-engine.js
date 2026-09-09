const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const midi = (note) => 440 * 2 ** ((note - 69) / 12);

// Original, locally synthesized arrangements. Each scene has its own melody,
// harmony, tempo, instrumentation and percussion; no music downloads required.
export const SCORES = {
  menu: { bpm: 88, root: 38, wave: "triangle", notes: [0, null, 7, null, 10, 7, 3, null, 0, null, 12, 10, 7, null, 3, null], chords: [0, -2, -5, -2], drums: 0.45 },
  setup: { bpm: 106, root: 45, wave: "sine", notes: [0, 7, 12, 7, 3, 10, 15, 10, 5, 12, 17, 12, 7, 10, 14, 10], chords: [0, 3, 5, -2], drums: 0.35 },
  controller: { bpm: 94, root: 43, wave: "triangle", notes: [0, null, 3, 7, null, 10, 7, null, 5, null, 8, 12, null, 10, 7, null], chords: [0, 5, 3, -2], drums: 0.3 },
  "moon-gate": { bpm: 112, root: 38, wave: "sine", notes: [12, null, 7, 10, null, 7, 3, null, 0, 3, 7, null, 10, 7, 3, null], chords: [0, -2, 3, -5], drums: 0.75 },
  "ember-forge": { bpm: 138, root: 33, wave: "sawtooth", notes: [0, 0, 12, null, 1, 0, 7, 0, 0, 12, 10, 7, 1, 0, 7, null], chords: [0, 0, 1, -2], drums: 1 },
  "neon-rooftop": { bpm: 124, root: 42, wave: "triangle", notes: [0, 7, 12, 15, 10, 7, 12, 7, 3, 10, 15, 19, 12, 10, 7, 10], chords: [0, 3, -2, -5], drums: 0.85 },
  finish: { bpm: 76, root: 32, wave: "sawtooth", notes: [0, null, null, 1, null, null, 0, null, 7, null, null, 6, null, null, 1, null], chords: [0, 1, 0, -1], drums: 0.6 },
  result: { bpm: 100, root: 45, wave: "triangle", notes: [0, 4, 7, null, 12, null, 7, null, 9, 7, 4, null, 7, null, 12, null], chords: [0, 5, 7, 0], drums: 0.4 },
};

export class SoundEngine {
  constructor() {
    this.context = null;
    this.enabled = true;
    this.unlocked = false;
    this.paused = false;
    this.scene = "menu";
    this.musicVolume = 0.36;
    this.effectsVolume = 0.8;
    this.sampleSources = { fatality: "audio/fatality audio.mp3", getOverHere: "audio/get over here.mp3", slash1: "audio/slash1.mp3", slash2: "audio/slash2.mp3" };
    this.sampleTemplates = new Map();
    this.activeSamples = new Set();
    this.voices = new Set();
    this.musicBus = null;
    this.step = 0;
    this.nextNote = 0;
    try { this.enabled = localStorage.getItem("costume-combat-sound") !== "off"; } catch { /* Storage can be disabled. */ }
  }

  ensure() {
    if (!this.enabled || this.paused) return null;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.8;
      const compressor = this.context.createDynamicsCompressor();
      this.master.connect(compressor).connect(this.context.destination);
      this.effects = this.context.createGain();
      this.effects.gain.value = this.effectsVolume;
      this.effects.connect(this.master);
      this.noiseBuffer = this.context.createBuffer(1, this.context.sampleRate, this.context.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.context.state === "suspended") this.context.resume().catch(() => {});
    return this.context;
  }

  unlock() {
    this.unlocked = true;
    if (this.ensure() && !this.musicBus) this.setScene(this.scene, true);
  }

  voice(source, gain, destination, at, duration) {
    source.connect(gain).connect(destination);
    this.voices.add(source);
    source.onended = () => { this.voices.delete(source); source.disconnect(); gain.disconnect(); };
    source.start(at);
    source.stop(at + duration + 0.02);
  }

  note(frequency, duration, wave, volume, at, destination, endFrequency = frequency) {
    const context = this.context;
    if (!context || !this.enabled || this.paused) return;
    const source = context.createOscillator();
    const gain = context.createGain();
    source.type = wave;
    source.frequency.setValueAtTime(frequency, at);
    source.frequency.exponentialRampToValueAtTime(Math.max(24, endFrequency), at + duration);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), at + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    this.voice(source, gain, destination, at, duration);
  }

  noise(duration, volume, frequency, at, destination, type = "bandpass") {
    const context = this.context;
    if (!context || !this.enabled || this.paused) return;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = this.noiseBuffer;
    filter.type = type;
    filter.frequency.setValueAtTime(frequency, at);
    filter.Q.value = 0.65;
    source.connect(filter);
    gain.gain.setValueAtTime(volume, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    filter.connect(gain).connect(destination);
    this.voices.add(source);
    source.onended = () => { this.voices.delete(source); source.disconnect(); filter.disconnect(); gain.disconnect(); };
    source.start(at, Math.random() * 0.5);
    source.stop(at + duration);
  }

  tone(frequency, duration = 0.08, type = "square", volume = 0.045, slide = 0) {
    const context = this.ensure();
    if (context) this.note(frequency, duration, type, volume, context.currentTime, this.effects, frequency + slide);
  }
  ui() { this.unlock(); this.tone(330, 0.07, "triangle", 0.08, 140); }
  announce() { this.tone(72, 0.32, "sawtooth", 0.08, -30); }
  swing(kind = "punch") {
    const context = this.ensure();
    if (context) this.noise(kind === "pickaxe" ? 0.19 : 0.11, 0.08, kind === "kick" ? 1100 : 2100, context.currentTime, this.effects);
  }
  hit(blocked = false, kind = "punch", heavy = false) {
    const context = this.ensure();
    if (!context) return;
    const at = context.currentTime;
    if (blocked) {
      this.noise(0.09, 0.21, 1900, at, this.effects);
      this.note(310, 0.08, "triangle", 0.13, at, this.effects, 150);
      return;
    }
    const kick = kind === "kick";
    this.noise(kick ? 0.18 : 0.11, 0.34, kick ? 650 : 1550, at, this.effects);
    this.note(kick ? 105 : 160, heavy ? 0.23 : 0.14, "sine", 0.36, at, this.effects, 38);
    if (kind === "pickaxe") this.note(620, 0.14, "triangle", 0.16, at, this.effects, 140);
  }
  land() {
    const context = this.ensure();
    if (!context) return;
    this.noise(0.23, 0.3, 360, context.currentTime, this.effects);
    this.note(78, 0.25, "sine", 0.3, context.currentTime, this.effects, 28);
  }

  setScene(scene, force = false) {
    if (!SCORES[scene]) scene = "menu";
    if (this.scene === scene && this.musicBus && !force) return;
    this.scene = scene;
    if (!this.unlocked || !this.ensure()) return;
    const context = this.context;
    const previous = this.musicBus;
    if (previous) {
      previous.gain.cancelScheduledValues(context.currentTime);
      previous.gain.setTargetAtTime(0, context.currentTime, 0.12);
      window.setTimeout(() => previous.disconnect(), 1000);
    }
    this.musicBus = context.createGain();
    this.musicBus.gain.value = 0;
    this.musicBus.gain.setTargetAtTime(this.musicVolume, context.currentTime, 0.2);
    this.musicBus.connect(this.master);
    this.step = 0;
    this.nextNote = context.currentTime + 0.04;
    clearInterval(this.scheduler);
    this.scheduler = window.setInterval(() => this.schedule(), 40);
    this.schedule();
  }

  schedule() {
    if (!this.enabled || this.paused || !this.musicBus || this.context.state !== "running") return;
    const score = SCORES[this.scene];
    const seconds = 60 / score.bpm / 2;
    if (this.nextNote < this.context.currentTime) this.nextNote = this.context.currentTime + 0.02;
    while (this.nextNote < this.context.currentTime + 0.16) {
      const i = this.step % 16;
      const bar = Math.floor(this.step / 16) % score.chords.length;
      const root = score.root + score.chords[bar];
      const at = this.nextNote;
      const bus = this.musicBus;
      const note = score.notes[i];
      if (note !== null) this.note(midi(root + note + 12), seconds * 1.4, score.wave, 0.1, at, bus);
      if (i % 4 === 0) {
        this.note(midi(root), seconds * 3.2, "triangle", 0.18, at, bus);
        this.note(115, 0.17, "sine", score.drums * 0.28, at, bus, 35);
      }
      if (i === 4 || i === 12) this.noise(0.13, score.drums * 0.15, 1500, at, bus);
      if (i % 2 === 1) this.noise(0.04, score.drums * 0.06, 7000, at, bus, "highpass");
      if (i === 0) for (const interval of [12, this.scene === "result" ? 16 : 15, 19]) this.note(midi(root + interval), seconds * 14, "sine", 0.035, at, bus);
      this.nextNote += seconds;
      this.step++;
    }
  }

  preloadSamples() { for (const name of Object.keys(this.sampleSources)) this.getSampleTemplate(name); }
  getSampleTemplate(name) {
    if (this.sampleTemplates.has(name)) return this.sampleTemplates.get(name);
    if (!this.sampleSources[name]) return null;
    const audio = new Audio(this.sampleSources[name]);
    audio.preload = "auto";
    this.sampleTemplates.set(name, audio);
    return audio;
  }
  playSample(name, volume = 0.82) {
    if (!this.enabled || this.paused) return null;
    const template = this.getSampleTemplate(name);
    if (!template) return null;
    const audio = template.cloneNode(true);
    audio.volume = clamp(volume * this.effectsVolume, 0, 1);
    this.activeSamples.add(audio);
    const release = () => this.activeSamples.delete(audio);
    audio.addEventListener("ended", release, { once: true });
    audio.addEventListener("error", release, { once: true });
    audio.play().catch(release);
    return audio;
  }
  silence() {
    clearInterval(this.scheduler);
    for (const voice of this.voices) { try { voice.stop(); } catch { /* Already ended. */ } }
    for (const audio of this.activeSamples) { audio.pause(); audio.currentTime = 0; }
    this.activeSamples.clear();
    if (this.musicBus) this.musicBus.disconnect();
    this.musicBus = null;
  }
  setPaused(paused) {
    this.paused = paused;
    if (paused) { this.silence(); this.context?.suspend().catch(() => {}); }
    else if (this.enabled && this.unlocked) this.setScene(this.scene, true);
  }
  setEnabled(enabled) {
    this.enabled = enabled;
    try { localStorage.setItem("costume-combat-sound", enabled ? "on" : "off"); } catch { /* Optional persistence. */ }
    if (enabled) this.unlock();
    else this.silence();
  }
}
