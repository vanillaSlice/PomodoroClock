window.addEventListener('load', function () {

  'use strict';

  /*
   * DOM elements. 
   */
  var minutesElement = document.getElementById('minutes');
  var secondsElement = document.getElementById('seconds');
  var pauseButton = document.getElementById('pause');
  var resumeButton = document.getElementById('resume');

  /*
   * Note: time calculations are made using milliseconds throughout.
   */

  var breakLength = 300000; // 5 minutes
  var sessionLength = 1500000; // 25 minutes
  var startTime;
  var mode = 'session'; // session or break
  var currentTimerLength = sessionLength;
  var isStopped = true;
  var timerIntervalId;

  /*
   * Initialise DOM elements
   */
  minutesElement.innerText = '25';
  secondsElement.innerText = '00';

  // METHODS
  // start
  // stop
  // clear
  // decrease/increase break length
  // decrease/increase session length

  function updateTime() {
    var currentTimeInMs = Date.now();
    var elapsedTime = currentTimeInMs - startTime;
    var remainingTimeInMs = currentTimerLength - elapsedTime;
    if (remainingTimeInMs <= 0) {
      if (mode === 'session') {
        mode = 'break';
        startTime = Date.now();
        currentTimerLength = breakLength;
      } else if (mode === 'break') {
        mode = 'session';
        startTime = Date.now();
        currentTimerLength = sessionLength;
      }
    } else {
      var minutes = parseInt(remainingTimeInMs / 1000 / 60);
      var seconds = parseInt(remainingTimeInMs / 1000 % 60);
      minutesElement.innerText = minutes;
      secondsElement.innerText = seconds;
    }
  }

  pauseButton.addEventListener('click', function () {
    if (!isStopped) {
      isStopped = true;
      currentTimerLength -= Date.now() - startTime;
      clearInterval(timerIntervalId);
    }
  });

  resumeButton.addEventListener('click', function () {
    if (isStopped) {
      isStopped = false;
      startTime = Date.now();
      timerIntervalId = setInterval(updateTime, 100);
    }
  });

});