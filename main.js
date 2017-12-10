window.addEventListener('load', function() {

  'use strict';

  /*
   * DOM elements. 
   */
  var breakLengthElement = document.getElementById('break-length');
  var decreaseBreakBtnElement = document.getElementById('decrease-break');
  var increaseBreakBtnElement = document.getElementById('increase-break');
  var sessionLengthElement = document.getElementById('session-length');
  var decreaseSessionBtnElement = document.getElementById('decrease-session');
  var increaseSessionBtnElement = document.getElementById('increase-session');
  var remainingTimeElement = document.querySelector('.remaining-time');
  var modeElement = document.querySelector('.mode');
  var fillElement = document.querySelector('.fill');
  var startBtnElement = document.getElementById('start');
  var stopBtnElement = document.getElementById('stop');
  var clearBtnElement = document.getElementById('clear');

  /*
   * All times are stored in milliseconds unless stated otherwise.
   */
  var breakLengthInMinutes = 5;
  var sessionLengthInMinutes = 25;
  var startTime;
  var mode = 'Session';
  var timerLength = minutesToMilliseconds(sessionLengthInMinutes);
  var originalTimerLength = timerLength;
  var remainingTime = timerLength;
  var isStopped = true;
  var timerIntervalId;

  /*
   * Initialise DOM elements.
   */
  breakLengthElement.innerText = breakLengthInMinutes;
  sessionLengthElement.innerText = sessionLengthInMinutes;
  remainingTimeElement.innerText = formatTime(timerLength);
  modeElement.innerText = 'Pomodoro';

  /*
   * Helper functions.
   */

  function minutesToMilliseconds(minutes) {
    return minutes * 60000;
  }

  /*
   * Converts milliseconds to formatted string. e.g. 1500000 returns '25:00'.
   */
  function formatTime(time) {
    var minutes = parseInt(time / 1000 / 60);
    var seconds = parseInt(time / 1000 % 60);
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
  }

  /*
   * Add button event listeners.
   */

  startBtnElement.addEventListener('click', function () {
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
    var elapsedTime = Date.now() - startTime;
    remainingTime = timerLength - elapsedTime;
    remainingTimeElement.innerText = formatTime(remainingTime);

    // 3. Update fill element height in DOM
    var percentageComplete = parseInt((originalTimerLength - remainingTime) / originalTimerLength * 100);
    fillElement.style.height = percentageComplete + '%';
  }

  stopBtnElement.addEventListener('click', function () {
    // already stopped so don't need to do anything
    if (isStopped) {
      return;
    }

    clearInterval(timerIntervalId);
    isStopped = true;
    timerLength -= Date.now() - startTime;
  });

  clearBtnElement.addEventListener('click', function () {
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

  decreaseBreakBtnElement.addEventListener('click', function () {
    updateBreakLength(breakLengthInMinutes - 1);
  });

  increaseBreakBtnElement.addEventListener('click', function () {
    updateBreakLength(breakLengthInMinutes + 1);
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

  decreaseSessionBtnElement.addEventListener('click', function () {
    updateSessionLength(sessionLengthInMinutes - 1);
  });

  increaseSessionBtnElement.addEventListener('click', function () {
    updateSessionLength(sessionLengthInMinutes + 1);
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

});