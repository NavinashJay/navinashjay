// Readify Random Recommender (genre + length + reading list)

initNavbar();

var currentPick = null;

function getFilteredBooks(){
  var genre = document.getElementById('recGenre').value;
  var length = document.getElementById('recLength').value;
  var list = [];

  for(var i=0;i<READIFY_BOOKS.length;i++){
    var b = READIFY_BOOKS[i];
    var okGenre = (genre === 'All' || b.genre === genre);
    var okLength = (length === 'All' || b.length === length);
    if(okGenre && okLength){
      list.push(b);
    }
  }
  return list;
}

function showPick(book, animate){
  currentPick = book;

  var box = document.getElementById('recResult');
  if(animate){
    box.classList.add('shake');
    setTimeout(function(){ box.classList.remove('shake'); }, 400);
  }

  box.innerHTML =
    '<img src="'+book.img+'" class="cover" alt="'+book.title+' cover">' +
    '<p class="small">'+book.author+' • '+book.genre+' • '+book.length+'</p>' +
    '<p class="small">'+book.synopsis+'</p>';
}

function pickRandom(animate){
  var list = getFilteredBooks();
  if(list.length === 0){
    document.getElementById('recResult').innerHTML = '<p class="small">No books match your selection. Try another filter.</p>';
    currentPick = null;
    return;
  }

  var pick = list[Math.floor(Math.random()*list.length)];
  showPick(pick, animate);
}

function renderReadingList(){
  var wrap = document.getElementById('readingList');
  var saved = loadFromLS('readify_reading_list', []);

  if(saved.length === 0){
    wrap.innerHTML = '<div class="card" style="padding:16px;"><p class="small">No saved books yet. Pick one and press “Save to Reading List”.</p></div>';
    return;
  }

  wrap.innerHTML = '';
  for(var i=0;i<saved.length;i++){
    var b = saved[i];
    var card = document.createElement('div');
    card.className = 'card book-list-card';
    card.innerHTML =
      '<img src="'+b.img+'" class="cover" alt="'+b.title+' cover">' +
      '<p class="book-meta">'+b.author+'</p>' +
      '<button class="btn-secondary" type="button" data-id="'+b.id+'" style="width:100%; margin-top:10px;">Remove</button>';

    wrap.appendChild(card);
  }

  // remove buttons
  var btns = wrap.querySelectorAll('button[data-id]');
  for(var j=0;j<btns.length;j++){
    btns[j].addEventListener('click', function(){
      var id = this.getAttribute('data-id');
      removeFromList(id);
    });
  }
}

function saveCurrent(){
  var msg = document.getElementById('saveMsg');
  msg.textContent = '';

  if(!currentPick){
    msg.textContent = 'Pick a book first.';
    return;
  }

  var saved = loadFromLS('readify_reading_list', []);

  // Avoid duplicates
  for(var i=0;i<saved.length;i++){
    if(saved[i].id === currentPick.id){
      msg.textContent = 'Already in your reading list.';
      return;
    }
  }

  saved.push({
    id: currentPick.id,
    title: currentPick.title,
    author: currentPick.author,
    genre: currentPick.genre,
    length: currentPick.length,
    img: currentPick.img
  });

  saveToLS('readify_reading_list', saved);
  msg.textContent = 'Saved to your reading list ✅';
  renderReadingList();
}

function removeFromList(id){
  var saved = loadFromLS('readify_reading_list', []);
  var out = [];
  for(var i=0;i<saved.length;i++){
    if(saved[i].id !== id){
      out.push(saved[i]);
    }
  }
  saveToLS('readify_reading_list', out);
  renderReadingList();
}

// Bind UI
var pickBtn = document.getElementById('pickBtn');
var againBtn = document.getElementById('againBtn');
var saveBtn = document.getElementById('saveBtn');

pickBtn.addEventListener('click', function(){ pickRandom(true); });
againBtn.addEventListener('click', function(){ pickRandom(true); });
saveBtn.addEventListener('click', saveCurrent);

// Re-pick when filters change
document.getElementById('recGenre').addEventListener('change', function(){ pickRandom(false); });
document.getElementById('recLength').addEventListener('change', function(){ pickRandom(false); });

renderReadingList();
