window.addEventListener('load', function () {

  'use strict';

  /*
   * DOM elements. 
   */
  var breakLengthElement = document.getElementById('break-length');
  var sessionLengthElement = document.getElementById('session-length');
  var remainingTimeElement = document.getElementById('remaining-time');
  var modeElement = document.getElementById('mode');

  /*
   * All times are stored in milliseconds unless stated otherwise.
   */
  var breakLengthInMinutes = 5;
  var sessionLengthInMinutes = 25;
  var startTime;
  var mode = 'session'; // will be 'session' or 'break'
  var currentTimerLength = sessionLengthInMinutes * 60000;
  var remainingTime = currentTimerLength;
  var isStopped = true;
  var timerIntervalId;

  /*
   * Initialise DOM elements.
   */
  breakLengthElement.innerText = breakLengthInMinutes;
  sessionLengthElement.innerText = sessionLengthInMinutes;
  remainingTimeElement.innerText = formatTime(remainingTime);
  modeElement.innerText = 'Pomodoro';

  /*
   * Converts milliseconds to formatted string. e.g. 1500000 returns '25:00'
   */
  function formatTime(time) {
    var minutes = parseInt(time / 1000 / 60);
    var seconds = parseInt(time / 1000 % 60);
    if (seconds < 10) {
      return minutes + ':0' + seconds;
    } else {
      return minutes + ':' + seconds;
    }
  }

  /*
   * Performs relevant timer updates when called by setInterval() function.
   */
  function updateTimer() {
    // 1. Update remaining time
    var elapsedTime = Date.now() - startTime;
    remainingTime = currentTimerLength - elapsedTime;
    remainingTimeElement.innerText = formatTime(remainingTime);

    // 2. Switch mode if needed
    if (remainingTime <= 0) {
      if (mode === 'session') {
        mode = 'break';
        currentTimerLength = breakLengthInMinutes * 60000;
        modeElement.innerText = 'Break';
      } else if (mode === 'break') {
        mode = 'session';
        currentTimerLength = sessionLengthInMinutes * 60000;
        modeElement.innerText = 'Session';
      }
      startTime = Date.now();
      remainingTime = currentTimerLength;
      document.body.setAttribute('data-mode', mode);
    }
  }

  /*
   * Add button event listeners.
   */

  document.getElementById('start').addEventListener('click', function () {
    if (isStopped) {
      isStopped = false;
      startTime = Date.now();
      document.body.setAttribute('data-mode', mode);
      modeElement.innerText = (mode === 'session') ? 'Session' : 'Break';
      timerIntervalId = setInterval(updateTimer, 100);
    }
  });

  document.getElementById('stop').addEventListener('click', function () {
    if (!isStopped) {
      clearInterval(timerIntervalId);
      isStopped = true;
      currentTimerLength -= Date.now() - startTime;
    }
  });

  document.getElementById('clear').addEventListener('click', function () {
    clearInterval(timerIntervalId);
    isStopped = true;
    mode = 'session';
    currentTimerLength = sessionLengthInMinutes * 60000
    remainingTime = currentTimerLength;
    remainingTimeElement.innerText = formatTime(remainingTime);
    document.body.removeAttribute('data-mode');
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

      if (mode === 'break') {
        startTime = Date.now();
        currentTimerLength = breakLengthInMinutes * 60000;
        remainingTime = currentTimerLength;
        remainingTimeElement.innerText = formatTime(remainingTime);
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

      if (mode === 'session') {
        startTime = Date.now();
        currentTimerLength = sessionLengthInMinutes * 60000;
        remainingTime = currentTimerLength;
        remainingTimeElement.innerText = formatTime(remainingTime);
      }
    }
  }

});