import { LEVELS, SAVE_KEY, createGame, updateGame, addEvent, toggleSwitch, toggleSignal, toggleBrake, validateSavedGame } from "./state.js";
import { renderGame, renderHud, getCanvas } from "./render.js";

const $ = selector => document.querySelector(selector);
const BOARD_KEY = "elte-rail-dispatcher-board-v1";
// A böngészős tárolás kizárólag a vezérlő modul feladata.
function getBoard(levelId) {
  try {
    const board = JSON.parse(localStorage.getItem(BOARD_KEY) || "{}");
    return Array.isArray(board[levelId]) ? board[levelId] : [];
  } catch (error) {
    console.error("Ranglista olvasási hiba:", error);
    return [];
  }
}
function saveResult(state) {
  try {
    const board = JSON.parse(localStorage.getItem(BOARD_KEY) || "{}");
    const rows = Array.isArray(board[state.levelId]) ? board[state.levelId] : [];
    rows.push({ player: state.player, time: state.elapsed, errors: state.errors, date: new Date().toLocaleDateString("hu-HU") });
    rows.sort((a, b) => a.errors - b.errors || a.time - b.time);
    board[state.levelId] = rows.slice(0, 10);
    localStorage.setItem(BOARD_KEY, JSON.stringify(board));
  } catch (error) { console.error("Ranglista mentési hiba:", error); }
}
// A kattintási pozíciók a rögzített pályaadatokból számolhatók,
// így a renderelőnek nem kell módosítania a játék állapotát.
function signalPosition(signal, level) {
  const from = level.nodes.find(node => node.id === signal.edge[0]);
  const to = level.nodes.find(node => node.id === signal.edge[1]);
  return { x: from.x + (to.x - from.x) * 0.45, y: from.y + (to.y - from.y) * 0.45 };
}

const menuScreen=$("#menu-screen"), gameScreen=$("#game-screen"), modal=$("#result-modal");
let game=null, frameId=0, lastFrame=0, boardLevel=1;

function updatePauseCover() {
  const paused = Boolean(game && !game.running && !game.finished && !game.failed);
  $("#pause-cover").classList.toggle("hidden", !paused);
  gameScreen.classList.toggle("is-paused", paused);
  $("#pause-btn").textContent = paused ? "▶ Folytatás" : "Ⅱ Szünet";
}
function showMenu() {
  cancelAnimationFrame(frameId); gameScreen.classList.add("hidden"); menuScreen.classList.remove("hidden"); modal.classList.add("hidden"); gameScreen.classList.remove("is-paused"); renderBoard(boardLevel);
}
function showGame() { menuScreen.classList.add("hidden"); gameScreen.classList.remove("hidden"); modal.classList.add("hidden"); }
function start(levelId, player) {
  cancelAnimationFrame(frameId);
  game=createGame(levelId,player); game.running=true; game.started=true;
  addEvent(game,`A ${game.levelTitle} pálya megnyitva. Jó szolgálatot!`,"good");
  showGame(); lastFrame=performance.now(); renderAll(); frameId=requestAnimationFrame(loop);
}
function loop(now) {
  const dt=Math.min((now-lastFrame)/1000,.05); lastFrame=now;
  try {
    updateGame(game,dt); renderAll();
    if(game.finished || game.failed) { finishGame(); return; }
    frameId=requestAnimationFrame(loop);
  } catch(error) {
    console.error("Szimulációs hiba:",error); game.running=false; addEvent(game,"Váratlan programhiba történt. Nyisd meg az F12 konzolt a részletekért.","danger"); renderAll();
  }
}
function renderAll(){ if(game){renderGame(game);renderHud(game);updatePauseCover();} }
function finishGame() {
  cancelAnimationFrame(frameId);
  const won=!game.failed && game.errors===0 && game.arrived===LEVELS[game.levelId].total;
  if(won) saveResult(game);
  $("#result-symbol").textContent=won?"✓":game.failed?"💥":"!";
  $("#result-symbol").classList.toggle("fail",!won);
  $("#result-title").textContent=won?"Hibátlan szolgálat!":game.failed?"GAME OVER – Ütközés!":"Menet lezárva";
  $("#result-message").textContent=won?"Minden szerelvény a megfelelő peronra érkezett. Kiváló forgalomirányítás!":"A menet nem teljesült hibátlanul. A forgalmi naplóban megtalálod az eseményeket.";
  $("#result-stats").innerHTML=`<div><b>${formatTime(game.elapsed)}</b><span>MENETIDŐ</span></div><div><b>${game.arrived}/${LEVELS[game.levelId].total}</b><span>CÉLBA ÉRT</span></div><div><b>${game.errors}</b><span>HIBA</span></div>`;
  modal.classList.remove("hidden");
}
function formatTime(seconds){const n=Math.floor(seconds);return `${String(Math.floor(n/60)).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`;}
function renderBoard(levelId) {
  boardLevel=Number(levelId);
  document.querySelectorAll(".tab").forEach(tab=>tab.classList.toggle("active",Number(tab.dataset.board)===boardLevel));
  const rows=getBoard(boardLevel), target=$("#leaderboard"); target.replaceChildren();
  if(!rows.length){const p=document.createElement("p");p.textContent="Még nincs rögzített eredmény ezen a pályán. Teljesíts egy hibátlan menetet!";target.append(p);return;}
  rows.forEach((row,index)=>{const div=document.createElement("div");div.className="leader-row";const rank=document.createElement("strong");rank.textContent=`#${index+1}`;const name=document.createElement("b");name.textContent=row.player;const time=document.createElement("span");time.textContent=formatTime(row.time);const errors=document.createElement("span");errors.textContent=`${row.errors} hiba`;div.append(rank,name,time,errors);target.append(div);});
}
function saveGame() {
  if(!game)return;
  try { localStorage.setItem(SAVE_KEY,JSON.stringify(game)); addEvent(game,"Játékállás sikeresen elmentve.","good"); renderAll(); }
  catch(error){console.error("Mentési hiba:",error);addEvent(game,"A mentés nem sikerült. Ellenőrizd a böngésző tárhelyét.","danger");renderAll();}
}
function loadGame() {
  try {
    const raw=localStorage.getItem(SAVE_KEY);
    if(!raw){$("#save-status").textContent="Nincs elérhető mentett játékállás.";return;}
    // Előbb mindent ellenőrzünk, csak utána cseréljük le a játékállapotot.
    const saved=validateSavedGame(JSON.parse(raw));
    cancelAnimationFrame(frameId);
    game=saved;
    addEvent(game,"A mentett játékállás betöltve.","good");
    showGame(); lastFrame=performance.now(); renderAll();
    if(game.finished || game.failed){finishGame();return;}
    // A szüneteltetett mentés szüneteltetve marad.
    if(game.running)frameId=requestAnimationFrame(loop);
  } catch(error){console.error("Betöltési hiba:",error);$("#save-status").textContent="A mentés sérült vagy nem olvasható.";}
}
$("#start-form").addEventListener("submit",event=>{
  event.preventDefault();
  const player=$("#player-name").value.trim(), level=Number($("#level-select").value);
  if(!player){$("#player-name").focus();return;}
  start(level,player);
});
$("#load-menu").addEventListener("click",loadGame);
$("#pause-btn").addEventListener("click",()=>{
  if(!game || game.finished || game.failed)return;
  game.running=!game.running;
  if(game.running){lastFrame=performance.now();frameId=requestAnimationFrame(loop);}else cancelAnimationFrame(frameId);
  renderAll();
});
$("#reset-btn").addEventListener("click",()=>{if(game)start(game.levelId,game.player);});
$("#save-btn").addEventListener("click",saveGame);
$("#home-btn").addEventListener("click",showMenu);
$("#modal-home-btn").addEventListener("click",showMenu);
$("#again-btn").addEventListener("click",()=>{if(game)start(game.levelId,game.player);});
document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>renderBoard(tab.dataset.board)));

const canvas=getCanvas();
canvas.addEventListener("contextmenu",event=>event.preventDefault());
canvas.addEventListener("pointerdown",event=>{
  if(!game || !game.running)return;
  const rect=canvas.getBoundingClientRect();
  const x=(event.clientX-rect.left)*canvas.width/rect.width, y=(event.clientY-rect.top)*canvas.height/rect.height;
  if(event.button===2){
    const train=game.trains.find(item=>item.active && Math.hypot(item.x-x,item.y-y)<25);
    if(train)toggleBrake(game,train.id);
  } else if(event.button===0){
    const level = LEVELS[game.levelId];
    const sw = game.switches.find(item => {
      const node = level.nodes.find(node => node.id === item.id);
      return node && Math.hypot(node.x - x, node.y - y) < 24;
    });
    const signal = game.signals.find(item => {
      const position = signalPosition(item, level);
      return Math.hypot(position.x - x, position.y - y) < 24;
    });
    if(sw)toggleSwitch(game,sw.id); else if(signal)toggleSignal(game,signal.id);
  }
  renderAll();
});
document.addEventListener("keydown",event=>{
  if(event.code==="Space" && !gameScreen.classList.contains("hidden") && modal.classList.contains("hidden")){event.preventDefault();$("#pause-btn").click();}
});
window.addEventListener("beforeunload",()=>{if(game && !game.finished && !game.failed){try{localStorage.setItem(SAVE_KEY,JSON.stringify(game));}catch(error){console.warn(error);}}});
renderBoard(1);
