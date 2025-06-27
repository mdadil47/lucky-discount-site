/* ==== configuration ==== */
const LOCK_MS   = 43_200_000;    // 12 hours
const EXIT_SECS = 30;            // auto-exit countdown
const SPIN_ROUNDS = 5;           // extra turns for drama
const KEY = 'lastSpinTime';

const SLICE   = 36;              // degrees per slice (10 slices)
const CENTER  = SLICE / 2;       // 18°
const POINTER = 90;              // arrow points to 90° (12 o’clock)

/* ==== prize table (weights give rarity) ==== */
const prizes = [
  { text:"Better luck next time!", wt:350 },
  { text:"₹5 off",                 wt:250 },
  { text:"₹10 off",                wt:150 },
  { text:"₹15 off",                wt:90  },
  { text:"₹20 off",                wt:60  },
  { text:"Better luck next time!", wt:250 },
  { text:"Better luck next time!", wt:200 },
  { text:"🎉 ₹50 off – JACKPOT!",  wt:8   },
  { text:"Better luck next time!", wt:150 },
  { text:"🎉🎉 ₹100 off – MEGA JACKPOT!", wt:1 }
];

/* weighted random picker */
const cum=[]; let total=0;
prizes.forEach(p=>{total+=p.wt;cum.push(total);});
function pickIndex(){
  const r=Math.floor(Math.random()*total)+1;
  let lo=0,hi=cum.length-1;
  while(lo<hi){const m=(lo+hi)>>1; r<=cum[m]?hi=m:lo=m+1;}
  return lo;
}

/* spin-lock helpers */
const spunRecently = () => Date.now() - (+localStorage.getItem(KEY)||0) < LOCK_MS;
const saveSpinTime = () => localStorage.setItem(KEY, Date.now());

/* DOM refs */
const wheel   = document.getElementById('wheel');
const result  = document.getElementById('result');
const timer   = document.getElementById('timer');
const spinBtn = document.getElementById('spinBtn');

/* 30-second countdown then exit */
function startExitCountdown(){
  let s=EXIT_SECS;
  timer.textContent=`Page closes in ${s}s`;
  const id=setInterval(()=>{
    s--; timer.textContent=`Page closes in ${s}s`;
    if(!s){
      clearInterval(id);
      window.open('','_self'); window.close();
      setTimeout(()=>location.href='thankyou.html',250);
    }
  },1000);
}

/* main spin logic */
function spin(){
  if(spunRecently()){
    result.textContent="⚠️ Spin again after 12 h";
    return;
  }

  const idx=pickIndex();
  const sliceCenter = idx*SLICE + CENTER;
  const needCW = (POINTER - sliceCenter + 360) % 360; // angle to move slice to arrow
  const deg = SPIN_ROUNDS*360 + needCW;

  wheel.style.pointerEvents='none';
  spinBtn.disabled=true;
  wheel.style.transform=`rotate(-${deg}deg)`;   // CW spin

  wheel.addEventListener('transitionend',()=>{
    result.textContent = prizes[idx].text;
    saveSpinTime();
    startExitCountdown();
  },{once:true});
}

/* hooks */
wheel.addEventListener('click', spin);
spinBtn.addEventListener('click', spin);
