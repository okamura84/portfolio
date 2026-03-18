const timer = document.getElementById("timer");
const startBt = document.getElementById("start");
const stopBt = document.getElementById("stop");
const resetBt = document.getElementById("reset");

let startTime;
let intervalTimer;
let elapsedTime;
let holdTime = 0;

function pad(num) {
  return String(num).padStart(2, "0");
}

startBt.addEventListener("click", () => {
  startTime = Date.now();

  intervalTimer = setInterval(() => {
    elapsedTime = Date.now() - startTime + holdTime;

    let minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    timer.textContent = `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
  }, 10);

  startBt.disabled = true;
  stopBt.disabled = false;
  resetBt.disabled = true;
});

stopBt.addEventListener("click", () => {
  clearInterval(intervalTimer);
  holdTime += Date.now() - startTime;

  startBt.disabled = false;
  stopBt.disabled = true;
  resetBt.disabled = false;
});

resetBt.addEventListener("click", () => {
  timer.textContent = "00:00.00";
  holdTime = 0;

  startBt.disabled = false;
  stopBt.disabled = true;
  resetBt.disabled = true;
});
