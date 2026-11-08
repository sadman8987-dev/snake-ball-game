(()=>{'use strict';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d'),$=id=>document.getElementById(id);
const W=720,H=480,C=24,COLS=W/C,ROWS=H/C;
let snake,dir,next,ball,score,best=Number(localStorage.getItem('snakeBallBest')||0),running=false,paused=false,last=0,acc=0,sound=true,audio;
$('best').textContent=best;
function newBall(){let p;do{p={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)}}while(snake.some(s=>s.x===p.x&&s.y===p.y));return p}
function reset(){snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];dir={x:1,y:0};next={...dir};score=0;ball=newBall();running=false;paused=false;acc=0;hud();draw()}
function hud(){$('score').textContent=score;$('best').textContent=best;$('length').textContent=snake.length;$('level').textContent=1+Math.floor(score/5)}
function start(){if(!running){running=true;paused=false;$('overlay').classList.add('hidden');$('pauseBtn').textContent='⏸ إيقاف مؤقت';last=0;requestAnimationFrame(loop)}}
function change(d){const v={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[d];if(!v)return;if(v.x!==-dir.x||v.y!==-dir.y)next=v;if(!running&&!paused)start()}
function step(){dir=next;const h={x:(snake[0].x+dir.x+COLS)%COLS,y:(snake[0].y+dir.y+ROWS)%ROWS},ate=h.x===ball.x&&h.y===ball.y;snake.unshift(h);if(ate){score++;ball=newBall();if(score>best){best=score;localStorage.setItem('snakeBallBest',best)}beep()}else snake.pop();hud()}
function beep(){if(!sound)return;try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=560;g.gain.setValueAtTime(.06,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.13);o.start();o.stop(audio.currentTime+.13)}catch(e){}}
function draw(){ctx.fillStyle='#071522';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(95,150,180,.09)';for(let x=0;x<=W;x+=C){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}for(let y=0;y<=H;y+=C){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}ctx.font='22px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('⚽',ball.x*C+C/2,ball.y*C+C/2);snake.forEach((s,i)=>{const x=s.x*C,y=s.y*C;ctx.fillStyle=i===0?'#b5f36b':'#27cbb0';ctx.beginPath();ctx.roundRect(x+2,y+2,C-4,C-4,7);ctx.fill();if(i===0){ctx.fillStyle='#102638';ctx.beginPath();ctx.arc(x+9,y+9,2,0,7);ctx.arc(x+16,y+9,2,0,7);ctx.fill()}})}
function loop(t){if(!running)return;if(!last)last=t;acc+=Math.min(t-last,100);last=t;const speed=Math.max(65,145-score*2);while(acc>=speed){step();acc-=speed}draw();requestAnimationFrame(loop)}
$('startBtn').addEventListener('click',start);$('restartBtn').addEventListener('click',()=>{reset();start()});
$('pauseBtn').addEventListener('click',()=>{if(!running)return;running=false;paused=true;$('overlayTitle').textContent='اللعب متوقف';$('overlayText').textContent='اضغط متابعة عشان تكمل.';$('startBtn').textContent='متابعة';$('overlay').classList.remove('hidden')});
$('soundBtn').addEventListener('click',()=>{sound=!sound;$('soundBtn').textContent=sound?'🔊':'🔇'});
document.querySelectorAll('[data-dir]').forEach(b=>b.addEventListener('click',()=>change(b.dataset.dir)));
addEventListener('keydown',e=>{const m={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};if(m[e.key]){e.preventDefault();change(m[e.key])}if(e.key===' '){e.preventDefault();$('pauseBtn').click()}});
let touch=null;canvas.addEventListener('touchstart',e=>{touch={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}},{passive:true});canvas.addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.max(Math.abs(dx),Math.abs(dy))>18)change(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));touch=null},{passive:true});
reset();
})();