(()=>{
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const $=id=>document.getElementById(id),cols=30,rows=20,cell=24;
let snake,dir,nextDir,ball,score,best,alive,paused,running,tick=0,sound=true,audio;
best=Number(localStorage.getItem('snakeBallBest')||0);$('best').textContent=best;
function randBall(){let p;do{p={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)}}while(snake.some(s=>s.x===p.x&&s.y===p.y));return p}
function reset(){snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];dir={x:1,y:0};nextDir=dir;score=0;tick=0;ball=randBall();alive=true;paused=false;running=false;updateHud();draw()}
function updateHud(){$('score').textContent=score;$('best').textContent=best;$('length').textContent=snake.length;$('level').textContent=1+Math.floor(score/5)}
function start(){if(!alive)reset();running=true;paused=false;$('overlay').classList.add('hidden');$('pauseBtn').textContent='⏸ إيقاف مؤقت';last=0;requestAnimationFrame(loop)}
function setDirection(d){const map={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};let n=map[d];if(n&&!(n.x===-dir.x&&n.y===-dir.y))nextDir=n;if(!running&&!paused)start()}
function eatSound(){if(!sound)return;try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();let o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=520;g.gain.setValueAtTime(.07,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);o.start();o.stop(audio.currentTime+.12)}catch(e){}}
function step(){dir=nextDir;let head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};head.x=(head.x+cols)%cols;head.y=(head.y+rows)%rows;
const ate=head.x===ball.x&&head.y===ball.y;snake.unshift(head);if(ate){score++;eatSound();ball=randBall();if(score>best){best=score;localStorage.setItem('snakeBallBest',best)}}else snake.pop();
// No collision death: if the head overlaps its body, simply keep moving.
updateHud()}
function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#071522';ctx.fillRect(0,0,720,480);
ctx.strokeStyle='rgba(95,150,180,.09)';ctx.lineWidth=1;for(let x=0;x<=720;x+=cell){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,480);ctx.stroke()}for(let y=0;y<=480;y+=cell){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(720,y);ctx.stroke()}
ctx.save();ctx.shadowColor='#ffcb55';ctx.shadowBlur=20;ctx.font='22px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('⚽',ball.x*cell+12,ball.y*cell+12);ctx.restore();
snake.forEach((s,i)=>{let x=s.x*cell,y=s.y*cell;ctx.save();ctx.shadowColor=i===0?'#42e8c5':'transparent';ctx.shadowBlur=i===0?15:0;let grad=ctx.createLinearGradient(x,y,x+cell,y+cell);grad.addColorStop(0,i===0?'#b5f36b':'#42e8c5');grad.addColorStop(1,i===0?'#42e8c5':'#168f85');ctx.fillStyle=grad;ctx.beginPath();ctx.roundRect(x+2,y+2,cell-4,cell-4,7);ctx.fill();if(i===0){ctx.fillStyle='#09202a';let ex=x+12+(dir.x===1?3:dir.x===-1?-3:0),ey=y+12+(dir.y===1?3:dir.y===-1?-3:0);ctx.beginPath();ctx.arc(ex-4,ey-3,2,0,7);ctx.arc(ex+4,ey-3,2,0,7);ctx.fill()}ctx.restore()})}
let last=0,acc=0;function loop(t){if(!running||paused)return;if(!last)last=t;acc+=t-last;last=t;let interval=Math.max(65,145-Math.floor(score/5)*8);while(acc>=interval){step();acc-=interval}draw();requestAnimationFrame(loop)}
$('startBtn').addEventListener('click',start);$('restartBtn').addEventListener('click',()=>{reset();start()});
$('pauseBtn').addEventListener('click',()=>{if(!running){start();return}paused=!paused;$('pauseBtn').textContent=paused?'▶ استكمال':'⏸ إيقاف مؤقت';if(paused){$('overlayTitle').textContent='استراحة قصيرة';$('overlayText').textContent='خد نفسك… الكورة مستنياك!';$('startBtn').textContent='استكمال';$('overlay').classList.remove('hidden')}else{$('overlay').classList.add('hidden');last=0;requestAnimationFrame(loop)}});
$('soundBtn').addEventListener('click',()=>{sound=!sound;$('soundBtn').textContent=sound?'🔊':'🔇'});
document.querySelectorAll('[data-dir]').forEach(b=>b.addEventListener('click',()=>setDirection(b.dataset.dir)));
window.addEventListener('keydown',e=>{let k={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'}[e.key];if(k){e.preventDefault();setDirection(k)}if(e.code==='Space'){e.preventDefault();$('pauseBtn').click()}});
let touchStart=null;canvas.addEventListener('touchstart',e=>{let p=e.changedTouches[0];touchStart={x:p.clientX,y:p.clientY}},{passive:true});canvas.addEventListener('touchend',e=>{if(!touchStart)return;let p=e.changedTouches[0],dx=p.clientX-touchStart.x,dy=p.clientY-touchStart.y;if(Math.max(Math.abs(dx),Math.abs(dy))>18)setDirection(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));touchStart=null},{passive:true});
reset();
})();