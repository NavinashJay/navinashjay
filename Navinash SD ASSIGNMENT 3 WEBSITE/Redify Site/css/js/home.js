// js/home.js
initNavbar();

var quotes = [
  { text: "Books are a uniquely portable magic.", by: "Stephen King" },
  { text: "A reader lives a thousand lives before he dies.", by: "George R.R. Martin" },
  { text: "Reading is to the mind what exercise is to the body.", by: "Joseph Addison" },
  { text: "Once you learn to read, you will be forever free.", by: "Frederick Douglass" }
];

var authors = [
  { name: "Agatha Christie", desc: "Perfect if you love mysteries and clever twists." },
  { name: "J.K. Rowling", desc: "Great for magical stories and comfort reads." },
  { name: "Arthur C. Clarke", desc: "Sci-fi ideas that feel realistic and exciting." },
  { name: "Jane Austen", desc: "Classic stories with strong characters." },
  { name: "Brandon Sanderson", desc: "Epic fantasy with interesting systems." },
  { name: "George Orwell", desc: "Books that make you think deeper." }
];

var quoteIndex = 0;

function showQuote(i){
  var q = quotes[i];
  var box = $("quoteBox");
  box.textContent = '"' + q.text + '"';
  var span = document.createElement("span");
  span.textContent = "— " + q.by;
  box.appendChild(span);
}

function nextQuote(){
  quoteIndex = quoteIndex + 1;
  if(quoteIndex >= quotes.length) quoteIndex = 0;
  showQuote(quoteIndex);
}

$("nextQuoteBtn").addEventListener("click", nextQuote);

// Auto rotate
showQuote(quoteIndex);
setInterval(nextQuote, 5500);

// Author of the day (simple date logic)
var day = new Date().getDate();
var pick = authors[day % authors.length];
$("authorName").textContent = pick.name;
$("authorDesc").textContent = pick.desc;

// Home book images (show all 6)
function renderHomeBooks(){
  var holder = $("homeBooks");
  holder.innerHTML = "";

  for(var i=0; i<READIFY_BOOKS.length; i++){
    var b = READIFY_BOOKS[i];
    var card = document.createElement("div");
    card.className = "card book-mini";
    card.innerHTML =
      '<div class=\"cover-wrap\"><img src=\"'+ b.img +'\" alt=\"'+ b.title +' cover\"></div>' +
      '<p class="small">'+ b.author +'</p>' +
      '<a class="btn-secondary" href="explorer.html">View in Explorer</a>';

    holder.appendChild(card);
  }
}
renderHomeBooks();

// Newsletter (simple validation, no hard regex)
$("newsletterForm").addEventListener("submit", function(e){
  e.preventDefault();

  var email = $("newsletterEmail").value.trim();
  var msg = $("newsletterMsg");

  if(email.indexOf("@") === -1 || email.indexOf(".") === -1){
    msg.textContent = "Please enter a valid email.";
    msg.className = "err";
    return;
  }

  var list = loadFromLS("readify_newsletter", []);
  list.push(email);
  saveToLS("readify_newsletter", list);

  msg.textContent = "Subscribed! Saved to localStorage ✅";
  msg.className = "ok";
  $("newsletterEmail").value = "";
});
