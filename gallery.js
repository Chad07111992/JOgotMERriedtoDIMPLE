const photos = [
  {src:'Gallery/prenup1.jpg', label:'The First Look',       caption:'The moment before everything changed',       transition:'fade'},
  {src:'Gallery/prenup2.jpg', label:'A Quiet Walk',         caption:'Just the two of us, unhurried',              transition:'kenburns'},
  {src:'Gallery/prenup3.jpg', label:'Golden Hour',          caption:'Chasing the last light together',            transition:'wipe'},
  {src:'Gallery/prenup4.jpg', label:'Stolen Laughter',      caption:'The joke only we understood',                transition:'flip'},
  {src:'Gallery/prenup5.jpg', label:'Promises',             caption:'Whispered, before the vows',                 transition:'rise'},
  {src:'Gallery/prenup6.jpg', label:'Forever, Almost',      caption:'On the eve of forever',                      transition:'fade'},
  {src:'Gallery/prenup7.jpg', label:'We did',               caption:'Congrats on being stuck with me forever',    transition:'kenburns'},
  {src:'Gallery/prenup8.jpg', label:'Hard launch',          caption:'And so the adventure begins',                transition:'wipe'},
  {src:'Gallery/prenup9.jpg', label:'They did the thing',   caption:'Forever looks good on these two',            transition:'flip'},
  {src:'Gallery/prenup10.jpg', label:'Locked in',           caption:'My Forever',                                 transition:'rise'},
  {src:'Gallery/prenup11.jpg', label:'Real!!',              caption:'Who said fairytales were not real?',         transition:'fade'},
  {src:'Gallery/prenup12.jpg', label:'Together forever',    caption:'The best is yet to come',                    transition:'kenburns'},
  {src:'Gallery/prenup13.jpg', label:'Toi et moi',          caption:'You and Me',                                 transition:'wipe'},
  {src:'Gallery/prenup14.jpg', label:'Te quiero',           caption:'I love you',                                 transition:'flip'},
  {src:'Gallery/prenup15.jpg', label:'Together',            caption:'With my whole heart and for my whole life',  transition:'rise'},
  {src:'Gallery/prenup16.jpg', label:'Marriage',            caption:'New level unlocked',                         transition:'fade'},
  {src:'Gallery/prenup17.jpg', label:'Ups and Downs',       caption:'I will choose you always',                   transition:'kenburns'},
  {src:'Gallery/prenup18.jpg', label:'First I said "Yes"',  caption:'Now I am saying "I do"',                     transition:'wipe'},
  {src:'Gallery/prenup19.jpg', label:'United as ONE',       caption:'Devided by NONE',                            transition:'flip'},
  {src:'Gallery/prenup20.jpg', label:'Finally',             caption:'Wife Mode activated',                        transition:'rise'},
];

const stage = document.getElementById('stage');
const dotsWrap = document.getElementById('dots');
const filmstrip = document.getElementById('filmstrip');
const stageWrap = document.getElementById('stageWrap');
let current = 0;
let autoplayId = null;
const AUTOPLAY_MS = 4200;

photos.forEach((p, i)=>{
  const slide = document.createElement('div');
  slide.className = 'slide';
  slide.dataset.transition = p.transition;
  slide.innerHTML = `
    <img src="${p.src}" alt="${p.label}">
    <div class="caption-bar">
      <div class="event-label">${p.label}</div>
      <div class="event-caption">${p.caption}</div>
    </div>`;
  stage.insertBefore(slide, document.getElementById('prevBtn'));

  const dot = document.createElement('span');
  dot.className = 'dot';
  dot.addEventListener('click', ()=>goTo(i));
  dotsWrap.appendChild(dot);

  const thumb = document.createElement('button');
  thumb.innerHTML = `<img src="${p.src}" alt="${p.label} thumbnail">`;
  thumb.addEventListener('click', ()=>goTo(i));
  filmstrip.appendChild(thumb);
});

const slideEls = document.querySelectorAll('.slide');
const dotEls = document.querySelectorAll('.dot');
const thumbEls = document.querySelectorAll('.filmstrip button');

function render(){
  slideEls.forEach((s,i)=> s.classList.toggle('active', i===current));
  dotEls.forEach((d,i)=> d.classList.toggle('active', i===current));
  thumbEls.forEach((t,i)=> t.classList.toggle('active', i===current));

  // enable the 3D flip effect only when this slide actually uses it,
  // so other transitions aren't affected by the added perspective state
  stageWrap.dataset.flip = photos[current].transition === 'flip' ? 'on' : 'off';
}

function goTo(i){
  current = (i + photos.length) % photos.length;
  render();
  restartAutoplay();
}
function next(){ goTo(current+1); }
function prev(){ goTo(current-1); }

document.getElementById('nextBtn').addEventListener('click', next);
document.getElementById('prevBtn').addEventListener('click', prev);

document.addEventListener('keydown', (e)=>{
  if(e.key==='ArrowLeft') prev();
  if(e.key==='ArrowRight') next();
});

// touch swipe
let touchStartX = null;
stage.addEventListener('touchstart', (e)=>{ touchStartX = e.touches[0].clientX; }, {passive:true});
stage.addEventListener('touchend', (e)=>{
  if(touchStartX===null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if(dx > 40) prev();
  if(dx < -40) next();
  touchStartX = null;
});

function startAutoplay(){
  autoplayId = setInterval(next, AUTOPLAY_MS);
}
function stopAutoplay(){
  clearInterval(autoplayId);
  autoplayId = null;
}
function restartAutoplay(){
  if(autoplayId !== null){ stopAutoplay(); startAutoplay(); }
}

const playToggle = document.getElementById('playToggle');
const playBtnIcon = document.getElementById('playBtnIcon');
playToggle.addEventListener('click', ()=>{
  if(autoplayId){
    stopAutoplay();
    playToggle.textContent = 'Play';
    playBtnIcon.innerHTML = '&#9654;';
  } else {
    startAutoplay();
    playToggle.textContent = 'Pause';
    playBtnIcon.innerHTML = '&#10073;&#10073;';
  }
});

render();
startAutoplay();