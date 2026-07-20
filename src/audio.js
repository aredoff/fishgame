class SoundManager {
  constructor() {
    this.ctx = null;
    this.unlocked = false;
  }

  unlock() {
    if (this.unlocked) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.unlocked = true;
    } catch {
      this.ctx = null;
    }
  }

  play(name) {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    switch (name) {
      case 'flap':
        this.tone(320, 0.08, 'sine', 0.12);
        break;
      case 'collect':
        this.tone(520, 0.07, 'sine', 0.15);
        setTimeout(() => this.tone(780, 0.09, 'sine', 0.12), 60);
        break;
      case 'hurt':
        this.tone(180, 0.15, 'triangle', 0.18);
        break;
      case 'gameOver':
        this.tone(330, 0.12, 'sine', 0.14);
        setTimeout(() => this.tone(260, 0.14, 'sine', 0.12), 100);
        setTimeout(() => this.tone(200, 0.18, 'sine', 0.1), 220);
        break;
      case 'newRecord':
        [440, 554, 659, 880].forEach((freq, i) => {
          setTimeout(() => this.tone(freq, 0.1, 'sine', 0.13), i * 90);
        });
        break;
      default:
        break;
    }
  }

  tone(freq, duration, type, volume) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
}

export const sound = new SoundManager();
