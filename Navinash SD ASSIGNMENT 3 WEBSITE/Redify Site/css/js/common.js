// ===== Readify: Common JS (reusable) =====
// Shared helpers for all pages.

// Small helper: get element by id
function $(id){
  return document.getElementById(id);
}

// Initialize navbar behaviour (used in page scripts)
function initNavbar(){
  setupHamburger();
}

// Hamburger menu toggle (works on all pages)
function setupHamburger() {
  var btn = document.querySelector('.hamburger');
  var links = document.querySelector('.nav-links');
  if(!btn || !links) return;

  // Avoid binding the click handler multiple times (common.js auto-runs + page scripts call initNavbar()).
  if(btn.dataset && btn.dataset.hamburgerBound === '1') return;
  if(btn.dataset) btn.dataset.hamburgerBound = '1';

  btn.addEventListener('click', function(){
    links.classList.toggle('show');
  });
}

// Save to localStorage (reusable)
function saveLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Load from localStorage (reusable)
function loadLS(key, fallback) {
  var raw = localStorage.getItem(key);
  if(!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch(e) {
    return fallback;
  }
}

// Backwards-compatible aliases (older scripts used these names)
function saveToLS(key, value){
  saveLS(key, value);
}

function loadFromLS(key, fallback){
  return loadLS(key, fallback);
}

// PWA: register service worker (safe no-op if unsupported)
function registerServiceWorker(){
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(function(){
      // ignore (offline / local dev)
    });
  }
}

// Auto-run common setup
document.addEventListener('DOMContentLoaded', function(){
  setupHamburger();
  registerServiceWorker();
});
