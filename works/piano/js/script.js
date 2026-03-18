const displayArea = document.querySelector("#displayArea");
const pianoKeys = document.querySelectorAll(".pianoKey");
const button = document.querySelector("#button");
const autoArea = document.querySelector("#autoArea");
const DISPLAY_ERASE_MS = 1000;
let displayTimeoutId = null;
let playTimerId = null;
let isAutoPlaying = false;
let currentSong = null;
let noteIndex = 0;
const REST = "";

const NOTE_TO_FREQUENCY_HZ = {
  ド: 261.63, // C4
  レ: 293.66, // D4
  ミ: 329.63, // E4
  ファ: 349.23, // F4
  ソ: 392.0, // G4
  ラ: 440.0, // A4
  シ: 493.88, // B4
};
const audioConfig = {
  masterVolume: 0.6,
  waveType: "sine",
  attackSec: 0.02,
  releaseSec: 0.08,
  manualDurationMs: 1000,
};
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContextClass();
const masterGain = audioCtx.createGain();
masterGain.gain.value = audioConfig.masterVolume;
masterGain.connect(audioCtx.destination);
async function ensureAudioRunning() {
  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }
}
function playNoteSound(note, durationMs) {
  const freq = NOTE_TO_FREQUENCY_HZ[note];
  if (!freq) return;
  const durationSec = Math.max(0.01, durationMs / 1000);
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = audioConfig.waveType;
  osc.frequency.setValueAtTime(freq, now);
  const attack = Math.max(0.001, audioConfig.attackSec);
  const release = Math.max(0.001, audioConfig.releaseSec);
  const sustainEnd = now + Math.max(durationSec - release, attack);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(1, now + attack);
  gain.gain.setValueAtTime(1, sustainEnd);
  gain.gain.linearRampToValueAtTime(0, now + durationSec);
  osc.connect(gain).connect(masterGain);
  osc.start(now);
  osc.stop(now + durationSec + 0.05);
}

function n(note, durationMs) {
  return { note, durationMs };
}
function r(durationMs) {
  return { note: REST, durationMs };
}
const SONGS = [
  {
    id: "twinkle",
    title: "きらきら星",
    score: [
      n("ド", 500),
      r(500),
      n("ド", 500),
      r(500),
      n("ソ", 500),
      r(500),
      n("ソ", 500),
      r(500),
      n("ラ", 500),
      r(500),
      n("ラ", 500),
      r(500),
      n("ソ", 2000),
      n("ファ", 500),
      r(500),
      n("ファ", 500),
      r(500),
      n("ミ", 500),
      r(500),
      n("ミ", 500),
      r(500),
      n("レ", 500),
      r(500),
      n("レ", 500),
      r(500),
      n("ド", 2000),
      n("ソ", 500),
      r(500),
      n("ソ", 500),
      r(500),
      n("ファ", 500),
      r(500),
      n("ファ", 500),
      r(500),
      n("ミ", 500),
      r(500),
      n("ミ", 500),
      r(500),
      n("レ", 2000),
      n("ソ", 500),
      r(500),
      n("ソ", 500),
      r(500),
      n("ファ", 500),
      r(500),
      n("ファ", 500),
      r(500),
      n("ミ", 500),
      r(500),
      n("ミ", 500),
      r(500),
      n("レ", 2000),
      n("ド", 500),
      r(500),
      n("ド", 500),
      r(500),
      n("ソ", 500),
      r(500),
      n("ソ", 500),
      r(500),
      n("ラ", 500),
      r(500),
      n("ラ", 500),
      r(500),
      n("ソ", 2000),
      n("ファ", 500),
      r(500),
      n("ファ", 500),
      r(500),
      n("ミ", 500),
      r(500),
      n("ミ", 500),
      r(500),
      n("レ", 500),
      r(500),
      n("レ", 500),
      r(500),
      n("ド", 4000),
    ],
  },
  {
    id: "tulip",
    title: "チューリップ",
    score: [
      n("ド", 500),
      n("レ", 500),
      n("ミ", 1000),
      n("ド", 500),
      n("レ", 500),
      n("ミ", 1000),
      n("ソ", 500),
      n("ミ", 500),
      n("レ", 500),
      n("ド", 500),
      n("レ", 500),
      n("ミ", 500),
      n("レ", 1000),
      n("ド", 500),
      n("レ", 500),
      n("ミ", 1000),
      n("ド", 500),
      n("レ", 500),
      n("ミ", 1000),
      n("ソ", 500),
      n("ミ", 500),
      n("レ", 500),
      n("ド", 500),
      n("レ", 500),
      n("ミ", 500),
      n("ド", 1000),
      n("ソ", 250),
      r(250),
      n("ソ", 250),
      r(250),
      n("ミ", 250),
      r(250),
      n("ソ", 250),
      r(250),
      n("ラ", 250),
      r(250),
      n("ラ", 250),
      r(250),
      n("ソ", 1000),
      n("ミ", 250),
      r(250),
      n("ミ", 250),
      r(250),
      n("レ", 250),
      r(250),
      n("レ", 250),
      r(250),
      n("ド", 4000),
    ],
  },
];
function pickRandomSong() {
  const index = Math.floor(Math.random() * SONGS.length);
  return SONGS[index];
}

function clearDisplay() {
  displayArea.textContent = "";
}
function setKeysEnabled(enabled) {
  pianoKeys.forEach((pianoKey) => {
    pianoKey.style.pointerEvents = enabled ? "auto" : "none";
  });
}
function clearKeyHighlights() {
  pianoKeys.forEach((pianoKey) => pianoKey.classList.remove("color"));
}
function setAutoPlayUI(isPlaying, songTitle = "") {
  if (isPlaying) {
    button.value = "演奏中止";
    autoArea.textContent = `自動演奏中です：${songTitle}`;
    setKeysEnabled(false);
  } else {
    button.value = "自動演奏";
    autoArea.textContent = "";
    clearDisplay();
    setKeysEnabled(true);
    clearKeyHighlights();
  }
}
function highlightKeyByNote(note) {
  pianoKeys.forEach((pianoKey) => {
    const isActive = pianoKey.textContent === note && note !== REST;
    pianoKey.classList.toggle("color", isActive);
  });
}

pianoKeys.forEach((pianoKey) => {
  pianoKey.addEventListener("click", async () => {
    if (isAutoPlaying) return;
    await ensureAudioRunning();
    const note = pianoKey.textContent;
    displayArea.textContent = note;
    highlightKeyByNote(note);
    playNoteSound(note, audioConfig.manualDurationMs);
    clearTimeout(displayTimeoutId);
    displayTimeoutId = setTimeout(() => {
      clearDisplay();
      clearKeyHighlights();
    }, DISPLAY_ERASE_MS);
  });
});

async function playCurrentNote() {
  if (!currentSong || noteIndex >= currentSong.score.length) {
    stopAutoPlay();
    return;
  }
  await ensureAudioRunning();
  const { note, durationMs } = currentSong.score[noteIndex];
  displayArea.textContent = note;
  highlightKeyByNote(note);
  playNoteSound(note, durationMs);
  noteIndex++;
  playTimerId = setTimeout(playCurrentNote, durationMs);
}
function startAutoPlay() {
  if (isAutoPlaying) {
    stopAutoPlay();
    return;
  }
  clearTimeout(displayTimeoutId);
  currentSong = pickRandomSong();
  noteIndex = 0;
  isAutoPlaying = true;
  setAutoPlayUI(true, currentSong.title);
  playCurrentNote();
}
function stopAutoPlay() {
  clearTimeout(playTimerId);
  isAutoPlaying = false;
  noteIndex = 0;
  currentSong = null;
  setAutoPlayUI(false);
}
// 自動演奏ボタン
button.addEventListener("click", startAutoPlay);
