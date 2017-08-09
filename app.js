// Initialise application
fetchShowData();

// Fetch data from the API
function fetchShowData(){
  // Variable to hold API endpoint
  let endpoint = "http://marconi.smokeradio.co.uk/api/schedule.php";
  // Set up and make HTTP request
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    // Pass response to the processor function
    processData(xmlHttp.responseText);
  }
  xmlHttp.open("GET", endpoint, true); // true for asynchronous
  xmlHttp.send(null);
}
// Process and display data
function processData(res){
  // Now scroll to the right point in the timetable
  // First, turn the schedule into a JSON object and strip away the success field, leaving an array of days of shows
  var schedule = JSON.parse(res).schedule;
  // Grab the parent list elements;
  var ul = document.getElementsByClassName('day');
  // Fill each schedule day with shows
  for (var i = 0; i < schedule.length; i++) {
    // For each show in a day
    for (var j = 0; j < schedule[i].length; j++) {
      // Calculate left offset from tx_time
      var hour = schedule[i][j].tx_time.substr(0,2);
      var left = ((hour)*140)+90;
      // Create element and fill with content
      var newShow = document.createElement("LI");
      // Add a unique class based on the tx start time
      newShow.classList.add('tx' + schedule[i][j].tx_time.substr(0,2));
      // Add the content
      newShow.innerHTML = `
        <p>${schedule[i][j].tx_time.substr(0,5)}</p>
        <h3>${schedule[i][j].title}</h3>
      `;
      // Apply left offset
      newShow.style.left = left + "px";
      // Add into DOM
      ul[i].appendChild(newShow);
    }
  }
  // Now, trigger the autoscroll and on-now marker
  setScroll();
}

function setScroll(){
  // What time is it?
  var date = new Date();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  // Grab the element to be scrolled
  var schedule = document.querySelector('ul.days');
  // Apply the scroll
  jQuery(schedule).animate({
    scrollLeft: (hour*140)-140
  }, 1000);
  // Put the marker in the right place
  var meridian = document.querySelector('div.meridian');
  meridian.style.left = ((hour*140)+(minutes/60)*140) + "px";
  meridian.style.opacity = 1;

  // Now work out which show is currently playing and add the class 'on-now'

  // Get day as a var where Sunday=0 and Saturday=6
  var today = date.getDay();
  // Re-index the day to start on Monday, not Sunday
  if (today == 0) {
    today = 6;
  } else {
    today--;
  }
  // Add a today class to the correct <ul>
  var allDays = document.getElementsByClassName('day')
  // Remove the class from all
  for (var i = 0; i < allDays.length; i++) {
    allDays[i].classList.remove('today');
  }
  // And re-add the class to the right one
  var todayShows = allDays[today];
  todayShows.classList.add('today');

  // Add the class to the right show <li>, if it exists
  // First, remove from all
  var showHours = document.querySelectorAll('ul.day li').forEach(function(element){
    element.classList.remove('on-now');
  })
  // And re-add to correct one
  if (document.querySelector('ul.day.today li.tx' + hour)) {
    document.querySelector('ul.day.today li.tx' + hour).classList.add('on-now');
  }
}

// Update the meridian and scroll every two minutes
setInterval(function(){
  setScroll();
}, 120000);
