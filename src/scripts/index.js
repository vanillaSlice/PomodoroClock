/*
 * DOM Elements
 */

const breakLengthElement = document.getElementById('break-length');
const decreaseBreakBtnElement = document.getElementById('decrease-break');
const increaseBreakBtnElement = document.getElementById('increase-break');
const sessionLengthElement = document.getElementById('session-length');
const decreaseSessionBtnElement = document.getElementById('decrease-session');
const increaseSessionBtnElement = document.getElementById('increase-session');
const remainingTimeElement = document.querySelector('.remaining-time');
const modeElement = document.querySelector('.mode');
const fillElement = document.querySelector('.fill');
const startBtnElement = document.getElementById('start');
const stopBtnElement = document.getElementById('stop');
const clearBtnElement = document.getElementById('clear');

/*
 * Helper Functions
 */

function minutesToMilliseconds(minutes) {
  return minutes * 60000;
}

/*
  * Converts milliseconds to formatted string. e.g. 1500000 returns '25:00'.
  */
function formatTime(time) {
  const minutes = parseInt((time / 1000) / 60, 10);
  let seconds = parseInt((time / 1000) % 60, 10);
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

/*
 * All times are stored in milliseconds unless stated otherwise.
 */

let breakLengthInMinutes = 5;
let sessionLengthInMinutes = 25;
let startTime;
let mode = 'Session';
let timerLength = minutesToMilliseconds(sessionLengthInMinutes);
let originalTimerLength = timerLength;
let remainingTime = timerLength;
let isStopped = true;
let timerIntervalId;

/*
 * Initialise DOM elements.
 */

breakLengthElement.innerText = breakLengthInMinutes;
sessionLengthElement.innerText = sessionLengthInMinutes;
remainingTimeElement.innerText = formatTime(timerLength);
modeElement.innerText = 'Pomodoro';

/*
  * Add button event listeners.
  */

function updateTimer() {
  // 1. Switch mode if needed
  if (remainingTime <= 0) {
    if (mode === 'Session') {
      mode = 'Break';
      timerLength = minutesToMilliseconds(breakLengthInMinutes);
    } else {
      mode = 'Session';
      timerLength = minutesToMilliseconds(sessionLengthInMinutes);
    }
    startTime = Date.now();
    originalTimerLength = timerLength;
    remainingTime = timerLength;
    document.body.setAttribute('data-mode', mode);
    modeElement.innerText = mode;
  }

  // 2. Update remaining time
  const elapsedTime = Date.now() - startTime;
  remainingTime = timerLength - elapsedTime;
  remainingTimeElement.innerText = formatTime(remainingTime);

  // 3. Update fill element height in DOM
  const percentageComplete = parseInt(
    (originalTimerLength - remainingTime) / originalTimerLength * 100,
    10,
  );
  fillElement.style.height = `${percentageComplete}%`;
}

startBtnElement.addEventListener('click', () => {
  // already running so don't need to do anything
  if (!isStopped) {
    return;
  }

  isStopped = false;
  startTime = Date.now();
  document.body.setAttribute('data-mode', mode);
  modeElement.innerText = mode;
  timerIntervalId = setInterval(updateTimer, 200);
});

stopBtnElement.addEventListener('click', () => {
  // already stopped so don't need to do anything
  if (isStopped) {
    return;
  }

  clearInterval(timerIntervalId);
  isStopped = true;
  timerLength -= Date.now() - startTime;
});

clearBtnElement.addEventListener('click', () => {
  clearInterval(timerIntervalId);
  isStopped = true;
  mode = 'Session';
  timerLength = minutesToMilliseconds(sessionLengthInMinutes);
  originalTimerLength = timerLength;
  remainingTime = timerLength;
  remainingTimeElement.innerText = formatTime(remainingTime);
  document.body.removeAttribute('data-mode');
  fillElement.style.height = '0%';
  modeElement.innerText = 'Pomodoro';
});

function updateBreakLength(length) {
  // make sure we can't update break to be less than 1
  if (length < 1) {
    return;
  }

  breakLengthInMinutes = length;
  breakLengthElement.innerText = breakLengthInMinutes;

  if (mode === 'Break') {
    startTime = Date.now();
    timerLength = breakLengthInMinutes * 60000;
    originalTimerLength = timerLength;
    remainingTime = timerLength;
    remainingTimeElement.innerText = formatTime(remainingTime);
    fillElement.style.height = '0%';
  }
}

decreaseBreakBtnElement.addEventListener('click', () => {
  updateBreakLength(breakLengthInMinutes - 1);
});

increaseBreakBtnElement.addEventListener('click', () => {
  updateBreakLength(breakLengthInMinutes + 1);
});

function updateSessionLength(length) {
  // make sure we can't update session to be less than 1
  if (length < 1) {
    return;
  }

  sessionLengthInMinutes = length;
  sessionLengthElement.innerText = sessionLengthInMinutes;

  if (mode === 'Session') {
    startTime = Date.now();
    timerLength = sessionLengthInMinutes * 60000;
    originalTimerLength = timerLength;
    remainingTime = timerLength;
    remainingTimeElement.innerText = formatTime(remainingTime);
    fillElement.style.height = '0%';
  }
}

decreaseSessionBtnElement.addEventListener('click', () => {
  updateSessionLength(sessionLengthInMinutes - 1);
});

increaseSessionBtnElement.addEventListener('click', () => {
  updateSessionLength(sessionLengthInMinutes + 1);
});
