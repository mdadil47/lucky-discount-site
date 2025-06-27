/* ==== configuration ==== */
const LOCK_MS   = 43_200_000;  // 12 h
const SPIN_ROUNDS = 5;         // extra full turns
const KEY = 'lastSpinTime';

/* ==== prize table – 10 slices ==== */
const prizes = [
  { text:"Better luck next time!",        amt:0,   wt:350 }, // 0
  { text:"₹5 off",                        amt:5,   wt:250 }, // 1
  { text:"₹10 off",                       amt:10,  wt:150 }, // 2
  { text:"₹15 off",                       amt:15,  wt:90  }, // 3
  { text:"₹20 off",                       amt:20,  wt:60  }, // 4
  { text:"Better luck next time!",        amt:0,   wt:250 }, // 5
  { text:"Better luck next time!",        amt:0,   wt:200 }, // 6
  { text:"🎉 ₹50 off – JACKPOT!",         amt:50,  wt:8   }, // 7
  { text:"Better luck next time!",        amt:0,   wt:150 }, // 8
  { text:"🎉🎉 ₹100 off – MEGA JACKPOT!", amt:100, wt:1   }  // 9
];

/* ==== weighted picker (pre-compute cumulative weights) ==== */
const cum = []; let total = 0;
prizes.forEach(p => { total += p.wt; cum.push(total); });
function pickIndex(){
  const r = Math.floor(Math.random()*total)+1;
  let lo = 0, hi = cum.length-1;
  while (lo < hi){ const m = (lo+hi)>>1; r <= cum[m] ? hi = m : lo = m+1; }
  return lo;
}

/* ==== lock helpers ==== */
const spunRecently = () => Date.now() - (+localStorage.getItem(KEY)||0) < LOCK_MS;
const saveSpinTime = () => localStorage.setItem(KEY, Date.now());

/* ==== DOM refs ==== */
const wheel  = document.getElementById('wheel');
const result = document.getElementById('result');

/* ==== paint labels on wheel (runs once) ==== */
(function renderLabels(){
  if (!wheel.dataset.labels) return;           // guard double-run
  const R = wheel.offsetWidth / 2;             // radius in px
  prizes.forEach((p,i)=>{
    const label = document.createElement('span');
    label.className = 'label';

    // strip emoji from label text, keep it compact
    const txt = p.text.replace(/🎉+/g,'').trim();
    label.innerHTML = txt.replace(' – ','<br>');   // break on dash

    const angle = i*36+18;                          // slice centre
    label.style.transform =
      `rotate(${angle}deg) translate(${R-26}px) rotate(${-angle}deg)`;
    wheel.appendChild(label);
  });
  delete wheel.dataset.labels;                     // mark done
})();

/* ==== spin behaviour with 1-minute timer ==== */
wheel.addEventListener('click', () => {

  if (spunRecently()){
    result.textContent = "⚠️ Spin again after 12 h";
    return;
  }

  /* pick prize & compute rotation */
  const idx   = pickIndex();
  const slice = 36;
  const deg   = SPIN_ROUNDS*360 + idx*slice + slice/2;

  wheel.style.pointerEvents = 'none';
  wheel.style.transform = `rotate(-${deg}deg)`;   // CW spin

  wheel.addEventListener('transitionend', () => {
    result.textContent = prizes[idx].text;
    saveSpinTime();

    /* ---------- 60-second countdown ---------- */
    const timerEl = document.getElementById('timer');
    let secs = 60;
    timerEl.textContent = `Page closes in ${secs}s`;

    const tick = setInterval(() => {
      secs--;
      timerEl.textContent = `Page closes in ${secs}s`;
      if (secs === 0){
        clearInterval(tick);

        /* try to close tab, else redirect */
        window.open('','_self'); window.close();
        setTimeout(()=> location.href='thankyou.html',250);
      }
    }, 1000);
  }, { once:true });
});
