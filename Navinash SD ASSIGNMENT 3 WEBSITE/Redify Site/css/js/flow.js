// Readify Reading Flow (cozy sounds + completed books tracker)

initNavbar();

// ---- Cozy sounds ----
var audio = document.getElementById('sound');
var playing = false;
var soundBtn = document.getElementById('soundBtn');
var soundStatus = document.getElementById('soundStatus');

function setSoundStatus(){
  soundStatus.textContent = playing ? 'Sound: Playing ✅' : 'Sound: Off';
}

function toggleSound(){
  if(!audio) return;

  if(playing){
    audio.pause();
    playing = false;
  }else{
    // Some browsers block auto play unless user clicked... this button counts as user interaction.
    audio.play();
    playing = true;
  }
  setSoundStatus();
}

soundBtn.addEventListener('click', toggleSound);
setSoundStatus();

// ---- Completed books (localStorage) ----
var select = document.getElementById('completedSelect');
var completeBtn = document.getElementById('completeBtn');
var completeMsg = document.getElementById('completeMsg');
var listWrap = document.getElementById('completedList');

function fillSelect(){
  select.innerHTML = '';
  for(var i=0;i<READIFY_BOOKS.length;i++){
    var b = READIFY_BOOKS[i];
    var opt = document.createElement('option');
    opt.value = b.id;
    opt.textContent = b.title + ' — ' + b.author;
    select.appendChild(opt);
  }
}

function renderCompleted(){
  var done = loadFromLS('readify_completed_books', []);

  if(done.length === 0){
    listWrap.innerHTML = '<div class="card" style="padding:16px;"><p class="small">No completed books yet. Mark one above.</p></div>';
    return;
  }

  listWrap.innerHTML = '';

  for(var i=0;i<done.length;i++){
    var b = done[i];
    var card = document.createElement('div');
    card.className = 'card book-list-card';
    card.innerHTML =
      '<img src="'+b.img+'" class="cover" alt="'+b.title+' cover">' +
      '<p class="book-meta">'+b.author+'</p>' +
      '<button class="btn-secondary" type="button" data-id="'+b.id+'" style="width:100%; margin-top:10px;">Remove</button>';
    listWrap.appendChild(card);
  }

  var btns = listWrap.querySelectorAll('button[data-id]');
  for(var j=0;j<btns.length;j++){
    btns[j].addEventListener('click', function(){
      removeCompleted(this.getAttribute('data-id'));
    });
  }
}

function addCompleted(){
  completeMsg.textContent = '';
  var id = select.value;

  // Find book object
  var found = null;
  for(var i=0;i<READIFY_BOOKS.length;i++){
    if(READIFY_BOOKS[i].id === id){
      found = READIFY_BOOKS[i];
      break;
    }
  }
  if(!found) return;

  var done = loadFromLS('readify_completed_books', []);

  for(var k=0;k<done.length;k++){
    if(done[k].id === found.id){
      completeMsg.textContent = 'Already marked as completed ✅';
      return;
    }
  }

  done.push({
    id: found.id,
    title: found.title,
    author: found.author,
    img: found.img
  });

  saveToLS('readify_completed_books', done);
  completeMsg.textContent = 'Marked as completed 🎉';
  renderCompleted();
}

function removeCompleted(id){
  var done = loadFromLS('readify_completed_books', []);
  var out = [];
  for(var i=0;i<done.length;i++){
    if(done[i].id !== id) out.push(done[i]);
  }
  saveToLS('readify_completed_books', out);
  renderCompleted();
}

completeBtn.addEventListener('click', addCompleted);

fillSelect();
renderCompleted();
