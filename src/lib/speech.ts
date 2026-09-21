export type SpeakStatus = "playing" | "idle" | "error";

let currentAudio: HTMLAudioElement | null = null;
let token = 0;

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
  window.speechSynthesis.getVoices();
}

function audioUrls(text: string) {
  const q = encodeURIComponent(text);
  return [
    `https://dict.youdao.com/dictvoice?audio=${q}&type=2`,
    `https://fanyi.baidu.com/gettts?lan=zh&text=${q}&spd=3&source=web`,
  ];
}

function chineseVoice() {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  return (
    voices.find((v) => /^zh([-_]|$)/i.test(v.lang) && /cn|hans|xiaoxiao|huihui|yaoyao/i.test(`${v.lang} ${v.name}`)) ??
    voices.find((v) => /^zh([-_]|$)/i.test(v.lang))
  );
}

function speakWithSynth(
  text: string,
  times: number,
  mine: number,
  onStatus?: (status: SpeakStatus, message?: string) => void,
) {
  const synth = window.speechSynthesis;
  if (!synth) {
    onStatus?.("error", "Audio could not play in this browser.");
    return;
  }
  const voice = chineseVoice();
  const say = (left: number) => {
    if (mine !== token) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.86;
    if (voice) utterance.voice = voice;
    utterance.onstart = () => {
      if (mine === token) onStatus?.("playing");
    };
    utterance.onerror = () => {
      if (mine === token) onStatus?.("error", "Audio could not play. Check the volume and try again.");
    };
    utterance.onend = () => {
      if (mine !== token) return;
      if (left > 1) setTimeout(() => say(left - 1), 320);
      else onStatus?.("idle");
    };
    synth.resume();
    synth.speak(utterance);
  };
  // Chromium drops speech that starts in the same turn as cancel().
  setTimeout(() => say(times), 80);
}

export function stopSpeak() {
  token += 1;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
  window.speechSynthesis?.cancel();
}

export function speak(
  text: string,
  times = 1,
  onStatus?: (status: SpeakStatus, message?: string) => void,
) {
  const trimmed = text.trim();
  if (!trimmed) return;
  stopSpeak();
  const mine = token;
  const urls = audioUrls(trimmed);

  const tryUrl = (index: number) => {
    if (mine !== token) return;
    if (index >= urls.length) {
      speakWithSynth(trimmed, times, mine, onStatus);
      return;
    }
    const audio = new Audio();
    currentAudio = audio;
    audio.preload = "auto";
    audio.src = urls[index];
    let left = times;
    let settled = false;
    const fail = () => {
      if (settled || mine !== token || currentAudio !== audio) return;
      settled = true;
      audio.pause();
      tryUrl(index + 1);
    };
    audio.onplaying = () => {
      settled = true;
      if (mine === token) onStatus?.("playing");
    };
    audio.onended = () => {
      if (mine !== token || currentAudio !== audio) return;
      left -= 1;
      if (left > 0) {
        audio.currentTime = 0;
        void audio.play().catch(fail);
      } else {
        onStatus?.("idle");
      }
    };
    audio.onerror = fail;
    void audio.play().catch(fail);
  };

  tryUrl(0);
}
