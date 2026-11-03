/**
 * Audio Synthesizer for Buddhist Temple Experience
 * Uses Web Audio API for zero-latency, realistic acoustic sounds without external network dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private ambientGain: GainNode | null = null;
  private ambientNoiseSource: AudioNode | null = null;
  private isAmbientPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(muted ? 0 : this.volume * 0.15, this.ctx?.currentTime || 0);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && !this.isMuted) {
      this.ambientGain.gain.setValueAtTime(this.volume * 0.15, this.ctx?.currentTime || 0);
    }
  }

  public getVolume() {
    return this.volume;
  }

  /**
   * Play realistic Wooden Fish (Mõ Gỗ) sound
   */
  public playWoodenFish(pitchVariance = 0.05) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const baseFreq = 650 * (1 + (Math.random() - 0.5) * pitchVariance);

      // 1. Initial click / impact transient (high frequency strike)
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(1400, now);
      clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

      clickGain.gain.setValueAtTime(0.6 * this.volume, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);

      clickOsc.start(now);
      clickOsc.stop(now + 0.03);

      // 2. Hollow wood body resonance
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(baseFreq, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.12);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq, now);
      filter.Q.setValueAtTime(4.5, now);

      bodyGain.gain.setValueAtTime(0.8 * this.volume, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      bodyOsc.connect(filter);
      filter.connect(bodyGain);
      bodyGain.connect(this.ctx.destination);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.16);

      // 3. Sub-harmonic body thump
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(baseFreq * 0.45, now);
      subGain.gain.setValueAtTime(0.4 * this.volume, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + 0.09);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  /**
   * Play deep resonant Buddhist Temple Bell (Chuông Chùa / Đại Hồng Chung)
   */
  public playBell() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Authentic temple bell harmonics
      const partials = [
        { freq: 216, gain: 0.7, decay: 4.5 },
        { freq: 434, gain: 0.5, decay: 3.8 },
        { freq: 652, gain: 0.35, decay: 2.8 },
        { freq: 870, gain: 0.25, decay: 2.0 },
        { freq: 1308, gain: 0.15, decay: 1.2 },
        { freq: 1740, gain: 0.08, decay: 0.8 },
      ];

      const masterBellGain = this.ctx.createGain();
      masterBellGain.gain.setValueAtTime(0.55 * this.volume, now);
      masterBellGain.connect(this.ctx.destination);

      // Strike transient
      const strikeOsc = this.ctx.createOscillator();
      const strikeGain = this.ctx.createGain();
      strikeOsc.type = 'triangle';
      strikeOsc.frequency.setValueAtTime(580, now);
      strikeGain.gain.setValueAtTime(0.4 * this.volume, now);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      strikeOsc.connect(strikeGain);
      strikeGain.connect(this.ctx.destination);
      strikeOsc.start(now);
      strikeOsc.stop(now + 0.06);

      partials.forEach((partial) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();

        // Subtle detune for metallic chorus warmth
        osc.type = 'sine';
        osc.frequency.setValueAtTime(partial.freq + (Math.random() - 0.5) * 2, now);

        g.gain.setValueAtTime(partial.gain, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + partial.decay);

        osc.connect(g);
        g.connect(masterBellGain);

        osc.start(now);
        osc.stop(now + partial.decay);
      });
    } catch {
      // Audio context error guard
    }
  }

  /**
   * Sound of shaking wooden fortune sticks (Lắc ống xăm)
   */
  public playBambooShake() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const tapTime = now + i * 0.045 + Math.random() * 0.015;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        const freq = 1200 + Math.random() * 600;
        osc.frequency.setValueAtTime(freq, tapTime);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq, tapTime);
        filter.Q.setValueAtTime(8, tapTime);

        g.gain.setValueAtTime(0.25 * this.volume, tapTime);
        g.gain.exponentialRampToValueAtTime(0.001, tapTime + 0.035);

        osc.connect(filter);
        filter.connect(g);
        g.connect(this.ctx.destination);

        osc.start(tapTime);
        osc.stop(tapTime + 0.04);
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Sound of coin dropping in Merit Box (Hòm Công Đức)
   */
  public playCoinDrop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const coinFreqs = [2400, 3100, 3800];

      coinFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();

        const hitTime = now + idx * 0.06;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, hitTime);

        g.gain.setValueAtTime(0.3 * this.volume, hitTime);
        g.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.25);

        osc.connect(g);
        g.connect(this.ctx.destination);

        osc.start(hitTime);
        osc.stop(hitTime + 0.28);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Play peaceful Singing Bowl chime
   */
  public playSingingBowl() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now); // 528Hz Solfeggio frequency for healing & peace

      g.gain.setValueAtTime(0.4 * this.volume, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(g);
      g.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 3.6);
    } catch {
      // Ignore
    }
  }

  /**
   * Gentle Zen Ambient generator (Harmonic drone + soothing stream noise)
   */
  public toggleAmbient(): boolean {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  public isAmbientActive(): boolean {
    return this.isAmbientPlaying;
  }

  public startAmbient() {
    if (this.isAmbientPlaying) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.12, now);
      this.ambientGain.connect(this.ctx.destination);

      // Warm continuous harmonic chords (D major - D3, A3, F#4)
      const chord = [146.83, 220.00, 369.99];
      chord.forEach((freq) => {
        if (!this.ctx || !this.ambientGain) return;
        const osc = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        const oscGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        // Slow subtle breathing pulsation
        lfo.frequency.value = 0.15 + Math.random() * 0.1;
        lfoGain.gain.value = 0.04;
        lfo.connect(lfoGain);

        oscGain.gain.value = 0.08;
        lfoGain.connect(oscGain.gain);

        osc.connect(oscGain);
        oscGain.connect(this.ambientGain);

        lfo.start();
        osc.start();
      });

      this.isAmbientPlaying = true;
    } catch {
      // Ignore
    }
  }

  public stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          this.ambientGain?.disconnect();
          this.ambientGain = null;
          this.isAmbientPlaying = false;
        }, 500);
      } catch {
        this.ambientGain = null;
        this.isAmbientPlaying = false;
      }
    } else {
      this.isAmbientPlaying = false;
    }
  }
}

export const soundEngine = new SoundEngine();
