// Readify Feedback (validated form + localStorage + FAQ accordion)

initNavbar();

var form = document.getElementById('feedbackForm');
var nameEl = document.getElementById('name');
var emailEl = document.getElementById('email');
var msgEl = document.getElementById('msg');

var nameErr = document.getElementById('nameErr');
var emailErr = document.getElementById('emailErr');
var msgErr = document.getElementById('msgErr');
var fbMsg = document.getElementById('fbMsg');

function clearErrors(){
  nameErr.textContent = '';
  emailErr.textContent = '';
  msgErr.textContent = '';
  fbMsg.textContent = '';
}

function isValidEmail(email){
  // Simple email check (first-year friendly)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(){
  clearErrors();
  var ok = true;

  var name = nameEl.value.trim();
  var email = emailEl.value.trim();
  var msg = msgEl.value.trim();

  if(name.length < 2){
    nameErr.textContent = 'Please enter your name.';
    ok = false;
  }

  if(!isValidEmail(email)){
    emailErr.textContent = 'Please enter a valid email address.';
    ok = false;
  }

  if(msg.length < 10){
    msgErr.textContent = 'Message should be at least 10 characters.';
    ok = false;
  }

  return ok;
}

form.addEventListener('submit', function(e){
  e.preventDefault();

  if(!validate()) return;

  var list = loadFromLS('readify_feedback', []);
  list.push({
    name: nameEl.value.trim(),
    email: emailEl.value.trim(),
    message: msgEl.value.trim(),
    date: new Date().toISOString()
  });

  saveToLS('readify_feedback', list);

  form.reset();
  fbMsg.textContent = 'Thank you for your feedback 🙌 (saved locally)';
});

// FAQ accordion (JS)
var qs = document.querySelectorAll('.faq-q');
for(var i=0;i<qs.length;i++){
  qs[i].addEventListener('click', function(){
    var parent = this.parentElement;
    parent.classList.toggle('open');
  });
}
