// A megjelenítés kizárólag az állapotból dolgozik.
import { LEVELS } from "./state.js";

const canvas = document.querySelector("#rail-canvas");
const ctx = canvas.getContext("2d");

function line(a, b, color, width) {
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = "round"; ctx.stroke();
}
function drawTrack(a, b) {
  line(a,b,"#263449",12); line(a,b,"#71829a",6); line(a,b,"#34445b",2);
}
function drawSignal(signal, level) {
  const a = level.nodes.find(n => n.id === signal.edge[0]);
  const b = level.nodes.find(n => n.id === signal.edge[1]);
  const angle = Math.atan2(b.y-a.y,b.x-a.x);
  const x = a.x + (b.x-a.x)*.45, y = a.y + (b.y-a.y)*.45;
  ctx.save(); ctx.translate(x,y); ctx.rotate(angle + Math.PI/2);
  ctx.fillStyle="#101b2a"; ctx.strokeStyle="#65758c"; ctx.lineWidth=2;
  ctx.fillRect(-9,-19,18,38); ctx.strokeRect(-9,-19,18,38);
  ctx.fillStyle=signal.green?"#34404d":"#f04d5b";
  ctx.beginPath(); ctx.arc(0,-8,5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=signal.green?"#2ce0a0":"#34404d";
  ctx.beginPath(); ctx.arc(0,8,5,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
function drawSwitch(sw, node, level) {
  const next = level.nodes.find(n => n.id === sw.options[sw.selected]);
  ctx.save(); ctx.beginPath(); ctx.arc(node.x,node.y,19,0,Math.PI*2);
  ctx.fillStyle="#101b2b"; ctx.fill(); ctx.strokeStyle="#4ec9f4"; ctx.lineWidth=3; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(node.x,node.y); ctx.lineTo(node.x + (next.x-node.x)*.28,node.y + (next.y-node.y)*.28);
  ctx.strokeStyle="#f5c84b"; ctx.lineWidth=4; ctx.lineCap="round"; ctx.stroke();
  ctx.restore();
}
function drawTrain(train, danger, elapsed) {
  ctx.save(); ctx.translate(train.x,train.y);
  if (danger) {
    const pulse = (Math.sin(elapsed * 7) + 1) / 2;
    ctx.beginPath(); ctx.arc(0, 0, 24 + pulse * 10, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(245,200,75,${0.35 + pulse * 0.65})`;
    ctx.lineWidth = 2 + pulse * 2;
    ctx.setLineDash([5,5]); ctx.stroke(); ctx.setLineDash([]);
  }
  ctx.shadowColor=train.color; ctx.shadowBlur=12;
  ctx.fillStyle=train.color; ctx.strokeStyle=train.stopped?"#ff4055":"#f4f7ff"; ctx.lineWidth=train.stopped?4:2;
  ctx.beginPath(); ctx.roundRect(-13,-9,26,18,5); ctx.fill(); ctx.stroke();
  ctx.shadowBlur=0; ctx.fillStyle="#0c1523"; ctx.fillRect(-7,-5,5,4); ctx.fillRect(2,-5,5,4);
  if (train.brake) { ctx.fillStyle="#f5c84b"; ctx.font="bold 13px sans-serif"; ctx.textAlign="center"; ctx.fillText("FÉK",0,-18); }
  if (train.stopped) { ctx.fillStyle="#ff5965"; ctx.font="bold 11px sans-serif"; ctx.fillText("TILOS",0,27); }
  ctx.restore();
}
export function renderGame(state) {
  const level=LEVELS[state.levelId];
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#080d17"; ctx.fillRect(0,0,canvas.width,canvas.height);
  // Halvány háttérrács.
  ctx.strokeStyle="#111c2b"; ctx.lineWidth=1;
  for(let x=25;x<canvas.width;x+=50){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
  for(let y=25;y<canvas.height;y+=50){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
  for(const edge of level.edges) drawTrack(level.nodes.find(n=>n.id===edge[0]),level.nodes.find(n=>n.id===edge[1]));
  // Belépési nyilak és célperonok.
  for(const node of level.nodes){
    if(node.type==="entry"){ctx.fillStyle="#9db0c7";ctx.font="12px sans-serif";ctx.fillText("TODOS SANTOS →",Math.max(5,node.x-18),node.y-17);}
    if(node.type==="platform"){ctx.fillStyle=node.color;ctx.fillRect(node.x-5,node.y-24,10,48);ctx.fillStyle="#e9f1ff";ctx.font="bold 12px sans-serif";const names = { red: "NOTRE DAME", blue: "BOONE", outA: "NOTRE DAME", outB: "BOONE", outC: "NEW YORK", p1: "1. PERON – NOTRE DAME", p2: "2. PERON – BOONE", p3: "3. PERON – NEW YORK", p4: "4. PERON – CARLISLE" };
      ctx.textAlign="right";ctx.fillText(names[node.id] || node.id.toUpperCase(),node.x-13,node.y-29);ctx.textAlign="left";}
  }
  for(const sw of state.switches) drawSwitch(sw,level.nodes.find(n=>n.id===sw.id),level);
  for(const signal of state.signals) drawSignal(signal,level);
  const trains=state.trains.filter(t=>t.active);
  const dangerIds=new Set();
  for(let i=0;i<trains.length;i++) for(let j=i+1;j<trains.length;j++) if(Math.hypot(trains[i].x-trains[j].x,trains[i].y-trains[j].y)<75){dangerIds.add(trains[i].id);dangerIds.add(trains[j].id);}
  for(const train of state.trains) if(train.active) drawTrain(train,dangerIds.has(train.id),state.elapsed);
  if (state.failed && state.collision) {
    // Robbanásikon az ütközés tényleges helyén.
    const x = state.collision.x, y = state.collision.y;
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "#ffce42"; ctx.strokeStyle = "#f05260"; ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const a = i * Math.PI / 8;
      const r = i % 2 === 0 ? 38 : 19;
      const px = Math.cos(a) * r, py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#7c2734"; ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center"; ctx.fillText("!", 0, 9);
    ctx.restore();
  }
  if(state.failed){ctx.fillStyle="#ef5360";ctx.font="bold 42px sans-serif";ctx.textAlign="center";ctx.fillText("ÜTKÖZÉS",canvas.width/2,canvas.height/2);}

  ctx.textAlign="left";
}
export function renderHud(state) {
  document.querySelector("#game-level-title").textContent=`${state.levelId}. szint · ${state.levelTitle}`;
  document.querySelector("#game-player").textContent=`Diszpécser: ${state.player}`;
  const seconds=Math.floor(state.elapsed);
  document.querySelector("#timer").textContent=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
  document.querySelector("#arrived").textContent=`${state.arrived} / ${LEVELS[state.levelId].total}`;
  document.querySelector("#errors").textContent=`${state.errors} / ${state.delays}`;
  document.querySelector("#run-state").textContent=state.failed?"Baleset – szimuláció leállítva":state.finished?"Menet befejezve":state.running?"Forgalom folyamatban": "Szüneteltetve";
  const log=document.querySelector("#event-log");
  log.replaceChildren();
  if(!state.events.length){const p=document.createElement("p");p.className="log-muted";p.textContent="A szimuláció eseményei itt jelennek meg.";log.append(p);}
  for(const event of state.events.slice(0,12)){const p=document.createElement("p");p.className=`log-entry ${event.type}`;const time=document.createElement("span");time.className="log-time";time.textContent=`${String(Math.floor(event.time/60)).padStart(2,"0")}:${String(event.time%60).padStart(2,"0")}`;p.append(time,document.createTextNode(event.message));log.append(p);}
}
export function getCanvas() { return canvas; }
