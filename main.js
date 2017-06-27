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
  var mode = 'session'; // session or break
  var currentTimerLength = sessionLengthInMinutes * 60000;
  var isStopped = true;
  var timerIntervalId;

  /*
   * Initialise DOM elements.
   */
  breakLengthElement.innerText = breakLengthInMinutes;
  sessionLengthElement.innerText = sessionLengthInMinutes;
  remainingTimeElement.innerText = '0:00';
  modeElement.innerText = 'Pomodoro';

  /*
   * Main function to do all calculations and countdown.
   */
  function updateTime() {
    var currentTimeInMs = Date.now();
    var elapsedTime = currentTimeInMs - startTime;
    var remainingTimeInMs = currentTimerLength - elapsedTime;
    if (remainingTimeInMs <= 0) {
      if (mode === 'session') {
        mode = 'break';
        startTime = Date.now();
        currentTimerLength = breakLengthInMinutes * 60000;
      } else if (mode === 'break') {
        mode = 'session';
        startTime = Date.now();
        currentTimerLength = sessionLengthInMinutes * 60000;
      }
    } else {
      var minutes = parseInt(remainingTimeInMs / 1000 / 60);
      var seconds = parseInt(remainingTimeInMs / 1000 % 60);
      remainingTimeElement.innerText = minutes + ':' + seconds;
    }
  }

  /*
   * Add button event listeners.
   */

  document.getElementById('start').addEventListener('click', function () {
    if (isStopped) {
      isStopped = false;
      startTime = Date.now();
      timerIntervalId = setInterval(updateTime, 100);
      document.body.classList.add(mode);
    }
  });

  document.getElementById('stop').addEventListener('click', function () {
    if (!isStopped) {
      isStopped = true;
      currentTimerLength -= Date.now() - startTime;
      clearInterval(timerIntervalId);
    }
  });

  document.getElementById('clear').addEventListener('click', function () {
    document.body.classList.remove('session', 'break');
  });

  document.getElementById('decrease-break').addEventListener('click', function () {
    updateBreakLength(breakLengthInMinutes - 1);
  });

  document.getElementById('increase-break').addEventListener('click', function () {
    updateBreakLength(breakLengthInMinutes + 1);
  });

  function updateBreakLength(length) {
    if (length < 1) return;
    breakLengthInMinutes = length;
    breakLengthElement.innerText = breakLengthInMinutes;

    // extra functionality
  }

  document.getElementById('decrease-session').addEventListener('click', function () {
    updateSessionLength(sessionLengthInMinutes - 1);
  });

  document.getElementById('increase-session').addEventListener('click', function () {
    updateSessionLength(sessionLengthInMinutes + 1);
  });

  function updateSessionLength(length) {
    if (length < 1) return;
    sessionLengthInMinutes = length;
    sessionLengthElement.innerText = sessionLengthInMinutes;

    // look at this
    if (mode === 'session') {
      startTime = Date.now();
      currentTimerLength = sessionLengthInMinutes * 60000;
    }
  }

});