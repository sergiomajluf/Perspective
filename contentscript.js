$(document).ready(function() {
  var totalTime = 0;
  var showTimer = false;

  var updateClock = function(millisecs ) {
    var currentHours = Math.floor(millisecs/(60 * 60 * 1000));
    var currentMinutes = Math.floor((millisecs - (currentHours * 60 * 60 * 1000))/(60 * 1000));
    var currentSeconds = Math.floor((millisecs - (currentHours * 60 * 60 * 1000) - (currentMinutes * 60 * 1000))/1000);

    // Pad the minutes and seconds with leading zeros, if required
    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
    currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

    // Compose the string for display
    return currentHours + ":" + currentMinutes + ":" + currentSeconds;
  }

  var addTimer = function () {
    var fbDiv = document.getElementById('contentArea');

    if(fbDiv == undefined)
      fbDiv = document.getElementById('content');

    if (fbDiv.firstChild.id != "my_div" && showTimer)
      $(fbDiv).prepend('<div id="my_div"><p id="my_time"><p></div>');
  }

  window.addEventListener('click', function(event) {
    setTimeout(addTimer, 1000);
  }, false);

  window.addEventListener('popstate', function(event) {
    setTimeout(addTimer, 1000);
  }, false);

  var interval_id;
  window.addEventListener('focus', function(event) {
    console.log('focused');
    interval_id = setInterval(function() {totalTime += 1000; $('#my_time').text(updateClock(totalTime));}, 1000);
  }, false);

  window.addEventListener('blur', function(event) {
    console.log('hello');
    clearInterval(interval_id);
    interval_id = 0;
  }, false);

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if('totalTime' in request)
      totalTime = request.totalTime;

    if('showTimer' in request) {
      showTimer = request.showTimer;
      addTimer();
    }
  });

  var link = document.getElementById('pageNav').getElementsByClassName('navLink')[0].href;
  var personID = link.substring(link.lastIndexOf('/') + 1, link.indexOf('?') != -1 ? link.indexOf('?') : link.length -1);
  chrome.runtime.sendMessage({sendData: "time", personID: personID, showTimer: true}, function(response) {
    totalTime = response.totalTime;
    interval_id = setInterval(function() {totalTime += 1000; $('#my_time').text(updateClock(totalTime));}, 1000);
  });
});