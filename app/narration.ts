/* Narration.
   Two paths: a server text-to-speech voice when one is configured, and the
   browser's own speech synthesis otherwise. The browser path used to sound bad
   for two fixable reasons — voices load asynchronously (so the first call
   picked nothing and got the default robotic voice), and the whole script was
   pushed through as one utterance with no phrasing. Both are handled here, and
   either path reports which sentence is being spoken so the UI can follow along. */

export function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“'(])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const GOOD_VOICE = [
  /natural/i,
  /neural/i,
  /enhanced/i,
  /premium/i,
  /google\s+(us|uk)\s+english/i,
  /\bsamantha\b/i,
  /\bava\b/i,
  /\ballison\b/i,
  /\bjenny\b/i,
  /\baria\b/i,
  /\bsonia\b/i,
  /\blibby\b/i,
  /\bserena\b/i,
  /\bdaniel\b/i,
];
const POOR_VOICE = /espeak|festival|pico|eloquence|compact|robosoft|zarvox|albert|bad news|bells|trinoids|whisper/i;

let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null;

/** Voices populate asynchronously; resolve once the list is actually there. */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve([]);
  }
  if (voicesReady) return voicesReady;
  voicesReady = new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length) {
      resolve(existing);
      return;
    }
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    // Safari sometimes never fires the event; poll briefly as a backstop.
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (window.speechSynthesis.getVoices().length || tries > 20) {
        window.clearInterval(timer);
        done();
      }
    }, 100);
  });
  return voicesReady;
}

export function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const english = voices.filter((v) => /^en(-|_|$)/i.test(v.lang));
  const pool = english.length ? english : voices;
  if (!pool.length) return null;
  const score = (v: SpeechSynthesisVoice) => {
    let n = 0;
    if (GOOD_VOICE.some((re) => re.test(v.name))) n += 60;
    if (POOR_VOICE.test(v.name)) n -= 200;
    if (!v.localService) n += 25;
    if (/^en-(US|GB)/i.test(v.lang)) n += 10;
    if (v.default) n += 4;
    return n;
  };
  return [...pool].sort((a, b) => score(b) - score(a))[0] ?? null;
}

type NarratorEvents = {
  onSentence?: (index: number) => void;
  onStateChange?: (playing: boolean) => void;
};

export class Narrator {
  private sentences: string[] = [];
  private index = 0;
  private rate = 1;
  private audio: HTMLAudioElement | null = null;
  private audioUrl: string | null = null;
  private timer: number | null = null;
  private stopped = true;
  private events: NarratorEvents;

  constructor(events: NarratorEvents = {}) {
    this.events = events;
  }

  get playing() {
    return !this.stopped;
  }

  setRate(rate: number) {
    this.rate = rate;
    if (this.audio) this.audio.playbackRate = rate;
    if (!this.audio && !this.stopped) {
      // Browser speech cannot change rate mid-utterance; restart from the
      // current sentence at the new rate.
      const from = this.index;
      const lines = this.sentences;
      this.stop();
      void this.speak(lines, from);
    }
  }

  stop() {
    this.stopped = true;
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.events.onStateChange?.(false);
  }

  async speak(sentences: string[], startAt = 0) {
    this.stop();
    if (!sentences.length) return;
    this.sentences = sentences;
    this.index = startAt;
    this.stopped = false;
    this.events.onStateChange?.(true);
    this.events.onSentence?.(startAt);

    const remaining = sentences.slice(startAt);
    const served = await this.trySpokenAudio(remaining, startAt);
    if (served) return;
    if (this.stopped) return;
    this.speakWithBrowser(remaining, startAt);
  }

  /** Server voice: one request, then follow along by proportional timing. */
  private async trySpokenAudio(sentences: string[], offset: number): Promise<boolean> {
    try {
      const response = await fetch("/api/narration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sentences.join(" ") }),
      });
      if (!response.ok) return false;
      const blob = await response.blob();
      if (!blob.size || this.stopped) return false;
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.playbackRate = this.rate;
      this.audio = audio;
      this.audioUrl = url;

      const weights = sentences.map((s) => Math.max(s.length, 12));
      const total = weights.reduce((a, b) => a + b, 0);
      audio.onended = () => this.finish();
      audio.onerror = () => {
        this.audio = null;
        if (!this.stopped) this.speakWithBrowser(sentences, offset);
      };
      this.timer = window.setInterval(() => {
        if (!this.audio || !this.audio.duration) return;
        const progress = this.audio.currentTime / this.audio.duration;
        let acc = 0;
        for (let i = 0; i < weights.length; i++) {
          acc += weights[i] / total;
          if (progress <= acc) {
            if (this.index !== offset + i) {
              this.index = offset + i;
              this.events.onSentence?.(this.index);
            }
            return;
          }
        }
      }, 220);
      await audio.play();
      return true;
    } catch {
      return false;
    }
  }

  /** Browser voice: one utterance per sentence, so phrasing and highlighting work. */
  private speakWithBrowser(sentences: string[], offset: number) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.finish();
      return;
    }
    void loadVoices().then((voices) => {
      if (this.stopped) return;
      const voice = pickVoice(voices);
      const speakAt = (i: number) => {
        if (this.stopped || i >= sentences.length) {
          if (!this.stopped) this.finish();
          return;
        }
        this.index = offset + i;
        this.events.onSentence?.(this.index);
        const utterance = new SpeechSynthesisUtterance(sentences[i]);
        if (voice) utterance.voice = voice;
        utterance.lang = voice?.lang ?? "en-US";
        utterance.rate = 0.98 * this.rate;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.onend = () => {
          if (this.stopped) return;
          // A short gap between sentences reads as phrasing rather than a rush.
          window.setTimeout(() => speakAt(i + 1), 140);
        };
        utterance.onerror = () => {
          if (!this.stopped) speakAt(i + 1);
        };
        window.speechSynthesis.speak(utterance);
      };
      speakAt(0);
    });
  }

  private finish() {
    this.stop();
    this.events.onSentence?.(-1);
  }
}
