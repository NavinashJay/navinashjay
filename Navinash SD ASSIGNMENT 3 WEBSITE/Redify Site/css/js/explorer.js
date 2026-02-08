// Readify Book Explorer (offline dataset + search/filter + modal)

initNavbar();

var grid = document.getElementById('bookGrid');
var searchBox = document.getElementById('searchBox');
var genreSelect = document.getElementById('genreSelect');
var sortSelect = document.getElementById('sortSelect');

function renderBooks(list){
  grid.innerHTML = '';

  for(var i=0; i<list.length; i++){
    var b = list[i];

    var card = document.createElement('div');
    card.className = 'card book-card';
    card.innerHTML =
      '<div class=\"cover-wrap\"><img src=\"'+b.img+'\" class=\"cover\" alt=\"'+b.title+' cover\"></div>' +
      '<p class="book-meta">'+b.author+' • '+b.genre+' • '+b.length+'</p>';

    card.onclick = (function(book){
      return function(){ openModal(book); };
    })(b);

    grid.appendChild(card);
  }
}

function applyFilters(){
  var text = searchBox.value.toLowerCase();
  var genre = genreSelect.value;

  var filtered = [];

  for(var i=0; i<READIFY_BOOKS.length; i++){
    var b = READIFY_BOOKS[i];

    var matchText =
      b.title.toLowerCase().indexOf(text) !== -1 ||
      b.author.toLowerCase().indexOf(text) !== -1;

    var matchGenre = (genre === 'All' || b.genre === genre);

    if(matchText && matchGenre){
      filtered.push(b);
    }
  }

  var sortBy = sortSelect.value;
  filtered.sort(function(a,b){
    return a[sortBy].localeCompare(b[sortBy]);
  });

  renderBooks(filtered);
}

searchBox.oninput = applyFilters;
genreSelect.onchange = applyFilters;
sortSelect.onchange = applyFilters;

applyFilters();

/* MODAL */
function openModal(book){
  document.getElementById('mTitle').textContent = book.title;
  document.getElementById('mAuthor').textContent = book.author + ' • ' + book.genre + ' • ' + book.length;
  document.getElementById('mImg').src = book.img;
  document.getElementById('mImg').alt = book.title + ' cover';
  document.getElementById('mSynopsis').textContent = book.synopsis;

  // Prequels & Sequels
  var pre = document.getElementById('mPrequels');
  var seq = document.getElementById('mSequels');
  var wrap = document.getElementById('mSeriesWrap');

  pre.innerHTML = '';
  seq.innerHTML = '';

  var hasAny = false;

  if(book.prequels && book.prequels.length){
    hasAny = true;
    for(var i=0;i<book.prequels.length;i++){
      pre.innerHTML += '<li>'+book.prequels[i]+'</li>';
    }
  } else {
    pre.innerHTML = '<li class="small">None</li>';
  }

  if(book.sequels && book.sequels.length){
    hasAny = true;
    for(var j=0;j<book.sequels.length;j++){
      seq.innerHTML += '<li>'+book.sequels[j]+'</li>';
    }
  } else {
    seq.innerHTML = '<li class="small">None</li>';
  }

  // Ratings table
  var table = document.getElementById('mTable');
  table.innerHTML = '<tr><th>Source</th><th>Rating</th><th>Note</th></tr>';
  for(var k=0;k<book.reviews.length;k++){
    table.innerHTML +=
      '<tr><td>'+book.reviews[k].source+'</td><td>'+book.reviews[k].rating+'</td><td>'+book.reviews[k].note+'</td></tr>';
  }

  document.getElementById('modalBg').classList.add('show');
}

function closeModal(){
  document.getElementById('modalBg').classList.remove('show');
}
