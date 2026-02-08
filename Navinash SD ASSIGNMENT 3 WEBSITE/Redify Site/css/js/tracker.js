// Readify Progress Tracker (calculations + localStorage)

initNavbar();

var totalEl = document.getElementById('totalPages');
var readEl = document.getElementById('pagesRead');
var speedEl = document.getElementById('speed');
var barFill = document.getElementById('barFill');
var resultEl = document.getElementById('result');

function clamp(n, min, max){
  return Math.max(min, Math.min(max, n));
}

function calculate(){
  var total = Number(totalEl.value);
  var read = Number(readEl.value);
  var speed = Number(speedEl.value);

  if(total <= 0 || read < 0 || speed <= 0){
    alert('Please enter valid numbers');
    return;
  }

  if(read > total) read = total;

  var percent = Math.floor((read / total) * 100);
  percent = clamp(percent, 0, 100);

  var remaining = total - read;
  var daysLeft = Math.ceil(remaining / speed);

  barFill.style.width = percent + '%';
  resultEl.textContent = percent + '% completed • Approx ' + daysLeft + ' day(s) left';

  saveToLS('readify_progress', { total: total, read: read, speed: speed });
}

// Load saved progress
(function loadSaved(){
  var saved = loadFromLS('readify_progress', null);
  if(!saved) return;

  totalEl.value = saved.total;
  readEl.value = saved.read;
  speedEl.value = saved.speed;

  // Render without alerts
  var percent = Math.floor((saved.read / saved.total) * 100);
  percent = clamp(percent, 0, 100);
  barFill.style.width = percent + '%';

  var daysLeft = Math.ceil((saved.total - saved.read) / saved.speed);
  resultEl.textContent = percent + '% completed • Approx ' + daysLeft + ' day(s) left (loaded)';
})();
