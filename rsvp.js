/* =========================================================
   GOOGLE SHEET LINK — PASTE YOUR DEPLOYED APPS SCRIPT URL HERE
   (Deploy the code.gs provided separately as a Web App,
   then paste the resulting /exec URL below)
========================================================= */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxpcxzDipUZEOJIkqXm7Mi5DeeXkUC8dl58HhOGg2sSzsMCfpkNAPAlVIMSkxK7dH_n/exec";

/* ---------------- floating decor: petals, confetti, roses ---------------- */
(function(){
  const decor = document.getElementById('decor');
  const roseSVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g>
      <circle cx="12" cy="12" r="5.4" fill="#8a3b3b"/>
      <circle cx="12" cy="12" r="3.6" fill="#b5524f"/>
      <circle cx="12" cy="12" r="1.8" fill="#d97b6f"/>
    </g>
  </svg>`;
  const total = 22;
  for(let i=0;i<total;i++){
    const el = document.createElement('div');
    const kind = i % 5 === 0 ? 'rose' : (i % 2 === 0 ? 'petal' : 'confetti');
    el.className = kind;
    if(kind === 'rose'){ el.innerHTML = roseSVG; }
    const left = Math.random()*100;
    const duration = 12 + Math.random()*14;
    const delay = Math.random()*-20;
    const drift = (Math.random()*80 - 40) + 'px';
    el.style.left = left + 'vw';
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = delay + 's';
    el.style.setProperty('--drift', drift);
    if(kind === 'confetti'){
      el.style.background = ['#c9a866','#b9926a','#e6cd94','#93aecb'][i % 4];
    }
    decor.appendChild(el);
  }
})();

/* ---------------- form submit ---------------- */
const form = document.getElementById('rsvpForm');
const submitBtn = document.getElementById('submitBtn');
const statusMsg = document.getElementById('statusMsg');
const successOverlay = document.getElementById('successOverlay');

function showStatus(text, type){
  statusMsg.textContent = text;
  statusMsg.className = 'status-msg show ' + type;
}

form.addEventListener('submit', function(e){
  e.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const numGuests = document.getElementById('numGuests').value;
  const attending = document.getElementById('attending').value;
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const diet = document.getElementById('diet').value.trim();
  const message = document.getElementById('message').value.trim();

  if(!fullName || !numGuests || !attending){
    showStatus('Please complete all required fields marked with *.', 'err');
    return;
  }

  const payload = {
    fullName, numGuests, attending, email, phone, diet, message,
    timestamp: new Date().toISOString()
  };

  if(!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.indexOf('PASTE_YOUR') === 0){
    showStatus('Setup needed: paste your Google Apps Script URL in the code.', 'err');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  showStatus('', '');

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function(){
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send My RSVP';
    successOverlay.classList.add('show');
    form.reset();
  })
  .catch(function(err){
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send My RSVP';
    showStatus('Something went wrong. Please try again.', 'err');
  });
});

document.getElementById('closeSuccess').addEventListener('click', function(){
  successOverlay.classList.remove('show');
  statusMsg.className = 'status-msg';
});

/* ================================================================
   PRENUP CIRCULAR GALLERY
   ================================================================ */
const prenupPhotos = [
  {src:'QR Code/GCash.jpg', name:'Prenup 1'},
  {src:'QR Code/MariBank.jpg', name:'Prenup 2'},
  {src:'QR Code/BPI.jpg', name:'Prenup 3'},
  {src:'QR Code/BDO.jpg', name:'Prenup 4'},
  {src:'QR Code/GCash.jpg', name:'Prenup 5'},
];
const stage = document.getElementById('prenupStage');
let order = [0,1,2,3,4]; // order[0] = front photo index

function renderPrenup(){
  stage.innerHTML = '';
  const n = order.length;
  order.forEach((photoIdx, pos)=>{
    const wrap = document.createElement('div');
    wrap.className = 'prenup-photo';
    const img = document.createElement('img');
    img.src = prenupPhotos[photoIdx].src;
    img.alt = prenupPhotos[photoIdx].name;
    wrap.appendChild(img);

    // layout: pos 0 = front & centered; others fan out behind, blurred
    const spread = 40; // px horizontal spread per step back
    const scaleStep = 0.09;
    const blurStep = 2.2;
    const x = pos === 0 ? 0 : (pos % 2 === 1 ? 1 : -1) * (Math.ceil(pos/2)) * spread;
    const y = pos * 10;
    const scale = 1 - pos*scaleStep;
    const blur = pos===0 ? 0 : Math.min(pos*blurStep, 8);
    const z = n - pos;
    const rotate = pos === 0 ? 0 : (pos % 2 === 1 ? -1 : 1) * (4+pos*1.5);

    wrap.style.transform = `translate(-50%,-50%) translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
    wrap.style.filter = `blur(${blur}px)`;
    wrap.style.opacity = pos===0 ? 1 : Math.max(0.45, 1 - pos*0.13);
    wrap.style.zIndex = z;

    wrap.addEventListener('click', ()=>{
      if(pos === 0){
        openLightbox(prenupPhotos[photoIdx].src);
      } else {
        // bring clicked photo to front
        order = order.filter(i=>i!==photoIdx);
        order.unshift(photoIdx);
        renderPrenup();
      }
    });
    stage.appendChild(wrap);
  });
}
renderPrenup();

// auto-rotate gently every few seconds
setInterval(()=>{
  const last = order.pop();
  order.unshift(last);
  renderPrenup();
}, 4500);

/* Lightbox */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
function openLightbox(src){ lightboxImg.src = src; lightbox.classList.add('open'); }
document.getElementById('lightboxClose').addEventListener('click', ()=>lightbox.classList.remove('open'));
lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) lightbox.classList.remove('open'); });
