// Interactive apology app script
const screens = [...document.querySelectorAll('.screen')];
const show = id => {
  screens.forEach(s => s.classList.add('hidden'));
  const el = document.getElementById(id);
  if(el) el.classList.remove('hidden');
  
  // Screen specific logic
  if(id === 'screen-3') startHearts(); else stopHearts();
};

// --- Cursor Trail ---
document.addEventListener('mousemove', (e) => createTrail(e.clientX, e.clientY));
document.addEventListener('touchmove', (e) => createTrail(e.touches[0].clientX, e.touches[0].clientY));
function createTrail(x, y){
  if(Math.random()>0.3) return; // limit density
  const t = document.createElement('div');
  t.className = 'trail';
  t.style.left = x + 'px';
  t.style.top = y + 'px';
  t.style.background = `hsl(${Math.random()*360}, 70%, 70%)`;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 800);
}

// --- Screen 1: Wake Me Up ---
const sleepy = document.getElementById('sleepy');
const wakeText = document.getElementById('wakeText');
const next1 = document.getElementById('next1');
sleepy.addEventListener('click', () => wakeUp());
sleepy.addEventListener('keypress', (e)=> { if(e.key==='Enter') wakeUp(); });
function wakeUp(){
  sleepy.classList.remove('sleeping');
  sleepy.classList.add('awake');
  document.querySelector('.face').textContent = '😊';
  wakeText.classList.add('visible'); // Use visible class for transition
  wakeText.classList.remove('hidden');
  setTimeout(()=> next1.classList.remove('hidden'), 400);
}
next1.addEventListener('click', ()=> show('screen-2'));

// --- Screen 2: Slider reveal ---
const slider = document.getElementById('apologySlider');
const apologyText = document.getElementById('apologyText');
const next2 = document.getElementById('next2');
let typed = false;
slider.addEventListener('input', ()=>{
  if(+slider.value >= 100 && !typed){
    typed = true;
    apologyText.classList.add('visible');
    apologyText.classList.remove('hidden');
    typeWriter(apologyText, "Sorry for oversleeping and making you wait, Chinie. I love you — Babi.", 50);
    next2.classList.remove('hidden');
  }
});
function typeWriter(el, text, speed){
  el.textContent = "";
  let i = 0;
  function type(){
    if(i < text.length){
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}
next2.addEventListener('click', ()=> show('screen-3'));

// --- Screen 3: Heart pop game ---
const heartField = document.getElementById('heartField');
const poppedCount = document.getElementById('poppedCount');
const next3 = document.getElementById('next3');
let popped = 0;
function spawnHeart(){
  const h = document.createElement('div');
  h.className = 'heart';
  h.textContent = '💗';
  const left = Math.random()*80 + 5;
  const top = 80 + Math.random()*20;
  h.style.left = left + '%';
  h.style.top = top + '%';
  h.style.transform = `translateY(${0}px)`;
  heartField.appendChild(h);
  // float up
  const travel = 8000 + Math.random()*4000;
  h.animate([{transform:'translateY(0px)'},{transform:`translateY(-${300 + Math.random()*200}px)`}],{duration:travel,iterations:1,fill:'forwards'});
  h.addEventListener('click', ()=>{
    if(h.classList.contains('pop')) return;
    h.classList.add('pop');
    const msgs = ["I care about you.", "You matter to me.", "Thank you for being patient.", "You're my world.", "I'll be better."];
    const m = msgs[Math.floor(Math.random()*msgs.length)];
    const tip = document.createElement('div');
    tip.className='small-msg visible'; tip.textContent = m; // visible immediately
    tip.style.position='absolute'; tip.style.left=h.style.left; tip.style.top=h.style.top;
    heartField.appendChild(tip);
    setTimeout(()=> tip.remove(),1200);
    popped +=1; poppedCount.textContent = popped;
    
    // Wait for animation before removing
    setTimeout(() => { if(h.parentNode) h.remove(); }, 200);
    
    if(popped>=5){ 
      next3.classList.remove('hidden'); 
      // Ensure it's visible by scrolling if needed
      next3.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  });
  // auto remove after a while
  setTimeout(()=>{ if(h.parentNode) h.remove(); }, 14000);
}

// spawn hearts periodically while on screen 3
let heartSpawner;
function startHearts(){
  heartField.innerHTML=''; popped=0; poppedCount.textContent='0'; next3.classList.add('hidden');
  spawnHeart();
  heartSpawner = setInterval(spawnHeart, 900);
}
function stopHearts(){ clearInterval(heartSpawner); }

// Removed MutationObserver in favor of direct calls in show()

next3.addEventListener('click', ()=> show('screen-4'));


// --- Screen 4: Gift box ---
const gift = document.getElementById('gift');
const giftMsg = document.getElementById('giftMsg');
const next4 = document.getElementById('next4');
gift.addEventListener('click', ()=>{
  gift.classList.add('open');
  gift.querySelector('.lid').style.transform = 'translateY(-34px) rotate(-12deg)';
  // confetti hearts
  for(let i=0;i<20;i++){
    const c = document.createElement('div'); c.className='rheart'; c.textContent='💖';
    c.style.left = (40 + Math.random()*20)+'%'; c.style.top='10%'; c.style.fontSize=(10+Math.random()*20)+'px';
    document.body.appendChild(c);
    c.style.position='fixed'; c.style.zIndex=50;
    c.animate([{transform:'translateY(0px)'},{transform:`translateY(${200+Math.random()*600}px) rotate(${Math.random()*360}deg)`}],{duration:1200+Math.random()*1200,fill:'forwards'});
    setTimeout(()=> c.remove(),2200);
  }
  giftMsg.classList.remove('hidden'); next4.classList.remove('hidden');
});
next4.addEventListener('click', ()=> show('screen-5'));

// --- Screen 5: Forgive buttons ---
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const forgiveMsg = document.getElementById('forgiveMsg');
yesBtn.addEventListener('click', ()=>{
  forgiveMsg.classList.remove('hidden'); forgiveMsg.textContent = 'Thank you love. You made my day.';
  // rain hearts
  const container = document.createElement('div'); container.className='raining'; document.body.appendChild(container);
  for(let i=0;i<30;i++){ const r = document.createElement('div'); r.className='rheart'; r.textContent='💗'; r.style.left=(Math.random()*100)+'%'; r.style.top='-10%'; r.style.fontSize=(10+Math.random()*30)+'px'; container.appendChild(r); }
  setTimeout(()=>{ container.remove(); show('screen-6'); }, 2500);
});

noBtn.addEventListener('mouseover', ()=> runAway(noBtn));
noBtn.addEventListener('click', ()=> runAway(noBtn)); // Fallback if they manage to click
noBtn.addEventListener('touchstart', (e)=> { e.preventDefault(); runAway(noBtn); }); // Prevent default click on touch

function runAway(el){
  // Run away within the screen container
  const container = el.closest('.screen');
  if(!container) return;
  
  // Change text randomly
  const texts = ["No?", "Try again!", "Too slow!", "Please?", "Oops!", "Missed!"];
  el.textContent = texts[Math.floor(Math.random()*texts.length)];
  
  const cRect = container.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  
  // Random position within the screen card
  // padding is approx 24px, let's keep it inside
  const pad = 24;
  const maxX = cRect.width - elRect.width - pad;
  const maxY = cRect.height - elRect.height - pad;
  
  const newX = Math.max(pad, Math.random() * maxX);
  const newY = Math.max(pad, Math.random() * maxY);
  
  el.style.position = 'absolute';
  el.style.left = newX + 'px';
  el.style.top = newY + 'px';
  el.style.transition = 'all 0.3s ease-out'; // Smooth movement
}

// --- Screen 6: Shake detection ---
const secretOverlay = document.getElementById('secretOverlay');
const next6 = document.getElementById('next6');
let lastShake=0;
function showSecret(){
  secretOverlay.classList.remove('hidden'); next6.classList.remove('hidden');
}
window.addEventListener('devicemotion', (e)=>{
  const acc = e.accelerationIncludingGravity;
  const magnitude = Math.sqrt((acc.x||0)**2 + (acc.y||0)**2 + (acc.z||0)**2);
  if(magnitude > 18 && Date.now()-lastShake>1000){ lastShake=Date.now(); showSecret(); }
});
window.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='s') showSecret(); });
next6.addEventListener('click', ()=> show('screen-7'));

// --- Screen 7: Hug animation ---
const hugBtn = document.getElementById('hugBtn');
const leftP = document.querySelector('.person.left');
const rightP = document.querySelector('.person.right');
const finalMsg = document.getElementById('finalMsg');
hugBtn.addEventListener('click', ()=>{
  leftP.classList.add('hug-left'); rightP.classList.add('hug-right');
  setTimeout(()=>{ finalMsg.classList.remove('hidden'); }, 700);
});

// Start app at screen 1
show('screen-1');
