window.addEventListener('load', function () {

  'use strict';

  /*
   * DOM elements. 
   */
  var breakLengthElement = document.getElementById('break-length'),
    sessionLengthElement = document.getElementById('session-length'),
    remainingTimeElement = document.getElementById('remaining-time'),
    modeElement = document.getElementById('mode'),
    fillElement = document.getElementById('fill');

  /*
   * All times are stored in milliseconds unless stated otherwise.
   */
  var breakLengthInMinutes = 5,
    sessionLengthInMinutes = 25,
    startTime,
    mode = 'Session',
    timerLength = minutesToMilliseconds(sessionLengthInMinutes),
    originalTimerLength = timerLength,
    remainingTime = timerLength,
    isStopped = true,
    timerIntervalId;

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

  document.getElementById('start').addEventListener('click', function () {
    if (isStopped) {
      isStopped = false;
      startTime = Date.now();
      document.body.setAttribute('data-mode', mode);
      modeElement.innerText = mode;
      timerIntervalId = setInterval(updateTimer, 200);
    }
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
    var percentageComplete = parseInt((originalTimerLength - remainingTime) /
      originalTimerLength * 100);
    fillElement.style.height = percentageComplete + '%';
  }

  document.getElementById('stop').addEventListener('click', function () {
    if (!isStopped) {
      clearInterval(timerIntervalId);
      isStopped = true;
      timerLength -= Date.now() - startTime;
    }
  });

  document.getElementById('clear').addEventListener('click', function () {
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

  document.getElementById('decrease-break').addEventListener('click', function () {
    updateBreakLength(breakLengthInMinutes - 1);
  });

  document.getElementById('increase-break').addEventListener('click', function () {
    updateBreakLength(breakLengthInMinutes + 1);
  });

  function updateBreakLength(length) {
    if (length > 0) {
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
  }

  document.getElementById('decrease-session').addEventListener('click', function () {
    updateSessionLength(sessionLengthInMinutes - 1);
  });

  document.getElementById('increase-session').addEventListener('click', function () {
    updateSessionLength(sessionLengthInMinutes + 1);
  });

  function updateSessionLength(length) {
    if (length > 0) {
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
  }

});