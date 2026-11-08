// A szimuláció adatai és a játékszabályok. Ebben a modulban nincs DOM-kezelés.
export const SAVE_KEY = "elte-rail-dispatcher-save-v6";

export const LEVELS = {
  1: {
    id: 1, title: "1. szint – Könnyű", difficulty: "Könnyű", total: 4,
    nodes: [
      { id: "in", x: 55, y: 285, type: "entry" }, { id: "sw1", x: 330, y: 285, type: "switch" },
      { id: "top", x: 520, y: 145 }, { id: "bot", x: 520, y: 405, type: "switch" },
      { id: "top2", x: 760, y: 145 }, { id: "bot2", x: 760, y: 405 },
      { id: "spur", x: 760, y: 500 },
      { id: "red", x: 920, y: 145, type: "platform", color: "#f36caf" },
      { id: "blue", x: 920, y: 405, type: "platform", color: "#2878e8" }
    ],
    edges: [["in","sw1"],["sw1","top"],["top","top2"],["top2","red"],["sw1","bot"],["bot","bot2"],["bot2","blue"],["bot","spur"]],
    switches: [{ id: "sw1", options: ["top","bot"], selected: 0 }, { id: "bot", options: ["bot2","spur"], selected: 0 }],
    signals: [{ id: "sigEntry", x: 190, y: 285, edge: ["in","sw1"], green: false }, { id: "sigTop", x: 520, y: 145, edge: ["top","top2"], green: false }, { id: "sigBot", x: 520, y: 405, edge: ["bot","bot2"], green: false }],
    schedule: [
      { id:"T1", color:"#f36caf", destination:"red", spawn:0, speed:78 },
      { id:"T2", color:"#2878e8", destination:"blue", spawn:7, speed:72 },
      { id:"T3", color:"#f36caf", destination:"red", spawn:15, speed:86 },
      { id:"T4", color:"#2878e8", destination:"blue", spawn:23, speed:76 }
    ]
  },
  2: {
    id: 2, title: "2. szint – Közepes", difficulty: "Közepes", total: 5,
    nodes: [
      {id:"inA",x:45,y:175,type:"entry"},{id:"inB",x:45,y:430,type:"entry"},
      {id:"s1",x:270,y:175,type:"switch"},{id:"s2",x:270,y:430,type:"switch"},
      {id:"midA",x:500,y:175},{id:"midB",x:500,y:300},{id:"midC",x:500,y:430},
      {id:"s3",x:730,y:300,type:"switch"},{id:"outA",x:950,y:130,type:"platform",color:"#f36caf"},
      {id:"outB",x:950,y:300,type:"platform",color:"#2878e8"},{id:"outC",x:950,y:470,type:"platform",color:"#aa7be6"}
    ],
    edges:[["inA","s1"],["s1","midA"],["s1","midB"],["inB","s2"],["s2","midB"],["s2","midC"],["midA","outA"],["midB","s3"],["midC","s3"],["s3","outB"],["s3","outC"]],
    switches:[{id:"s1",options:["midA","midB"],selected:0},{id:"s2",options:["midB","midC"],selected:1},{id:"s3",options:["outB","outC"],selected:0}],
    signals:[
      {id:"sigA",edge:["inA","s1"],green:false},
      {id:"sigB",edge:["inB","s2"],green:false},
      {id:"sigC",edge:["midB","s3"],green:false},
      {id:"sigD",edge:["midC","s3"],green:false}
    ],
    schedule:[
      {id:"T1",color:"#f36caf",destination:"outA",spawn:0,speed:80,entry:"inA"},
      {id:"T2",color:"#2878e8",destination:"outB",spawn:5,speed:92,entry:"inB"},
      {id:"T3",color:"#aa7be6",destination:"outC",spawn:10,speed:75,entry:"inA"},
      {id:"T4",color:"#2878e8",destination:"outB",spawn:14,speed:105,entry:"inB"},
      {id:"T5",color:"#f36caf",destination:"outA",spawn:19,speed:84,entry:"inA"}
    ]
  },
  3: {
    id: 3, title: "3. szint – Nehéz", difficulty: "Nehéz", total: 6,
    nodes:[
      {id:"inA",x:35,y:145,type:"entry"},{id:"inB",x:35,y:445,type:"entry"},
      {id:"s1",x:235,y:145,type:"switch"},{id:"s2",x:235,y:445,type:"switch"},
      {id:"a",x:440,y:145},{id:"b",x:440,y:245},{id:"c",x:440,y:345},{id:"d",x:440,y:445},
      {id:"s3",x:650,y:245,type:"switch"},{id:"s4",x:650,y:345,type:"switch"},
      {id:"p1",x:950,y:95,type:"platform",color:"#f36caf"},{id:"p2",x:950,y:220,type:"platform",color:"#2878e8"},
      {id:"p3",x:950,y:365,type:"platform",color:"#aa7be6"},{id:"p4",x:950,y:490,type:"platform",color:"#f2c54e"}
    ],
    edges:[["inA","s1"],["s1","a"],["s1","b"],["inB","s2"],["s2","c"],["s2","d"],["a","p1"],["b","s3"],["c","s4"],["d","s4"],["s3","p2"],["s3","p3"],["s4","p3"],["s4","p4"]],
    switches:[{id:"s1",options:["a","b"],selected:0},{id:"s2",options:["c","d"],selected:1},{id:"s3",options:["p2","p3"],selected:0},{id:"s4",options:["p3","p4"],selected:1}],
    signals:[
      {id:"g1",edge:["inA","s1"],green:false},
      {id:"g2",edge:["inB","s2"],green:false},
      {id:"g3",edge:["b","s3"],green:false},
      {id:"g4",edge:["c","s4"],green:false},
      {id:"g5",edge:["d","s4"],green:false}
    ],
    schedule:[
      {id:"T1",color:"#f36caf",destination:"p1",spawn:0,speed:90,entry:"inA"},
      {id:"T2",color:"#f2c54e",destination:"p4",spawn:5,speed:105,entry:"inB"},
      {id:"T3",color:"#2878e8",destination:"p2",spawn:10,speed:115,entry:"inA"},
      {id:"T4",color:"#aa7be6",destination:"p3",spawn:13,speed:95,entry:"inB"},
      {id:"T5",color:"#f36caf",destination:"p1",spawn:17,speed:110,entry:"inA"},
      {id:"T6",color:"#f2c54e",destination:"p4",spawn:21,speed:100,entry:"inB"}
    ]
  }
};

// A pályák irányított, körmentes gráfok: nem jöhet létre olyan
// körkörös függés, amelyben vonatok egymás visszaútjára várnak.
// A piros jelzőnél vagy vészféknél álló vonatot a játékos feloldhatja.
export function isAcyclic(level) {
  const visiting = new Set();
  const visited = new Set();
  function visit(id) {
    if (visiting.has(id)) return false;
    if (visited.has(id)) return true;
    visiting.add(id);
    for (const edge of level.edges) {
      if (edge[0] === id && !visit(edge[1])) return false;
    }
    visiting.delete(id);
    visited.add(id);
    return true;
  }
  return level.nodes.every(node => visit(node.id));
}

export function createGame(levelId, player) {
  const level = LEVELS[levelId];
  if (!isAcyclic(level)) throw new Error("A pálya vágányhálózata körkörös útvonalat tartalmaz.");
  return {
    levelId: Number(levelId), levelTitle: level.title, player, elapsed: 0, running: false,
    started: false, finished: false, failed: false, arrived: 0, errors: 0, delays: 0,
    switches: structuredClone(level.switches), signals: structuredClone(level.signals),
    trains: [], scheduleIndex: 0, events: [], lastWarning: 0, collision: null, standstillSince: null, deadlockWarned: false
  };
}

export function addEvent(state, message, type = "info") {
  state.events.unshift({ message, type, time: Math.floor(state.elapsed) });
  state.events = state.events.slice(0, 35);
}

function nodeById(level, id) { return level.nodes.find(node => node.id === id); }
function edgeExists(level, a, b) { return level.edges.some(edge => (edge[0] === a && edge[1] === b) || (edge[1] === a && edge[0] === b)); }

// A sínek irányítottak: a vonat nem keres automatikusan kerülőutat.
function nextNode(state, current) {
  const level = LEVELS[state.levelId];
  const outgoing = level.edges.filter(edge => edge[0] === current).map(edge => edge[1]);
  const sw = state.switches.find(item => item.id === current);
  if (sw) {
    const chosen = sw.options[sw.selected];
    return outgoing.includes(chosen) ? chosen : null;
  }
  return outgoing.length === 1 ? outgoing[0] : null;
}

export function updateGame(state, dt) {
  if (!state.running || state.finished || state.failed) return;
  const level = LEVELS[state.levelId];
  state.elapsed += dt;
  while (state.scheduleIndex < level.schedule.length && state.elapsed >= level.schedule[state.scheduleIndex].spawn) {
    const spec = level.schedule[state.scheduleIndex];
    const entry = spec.entry || "in";
    const entryNode = nodeById(level, entry);
    // Foglalt belépési pontnál a következő vonat még nem léphet be.
    if (state.trains.some(train => train.active && Math.hypot(train.x - entryNode.x, train.y - entryNode.y) < 45)) break;
    state.scheduleIndex++;
    const first = nextNode(state, entry);
    if (!first) { state.errors++; addEvent(state, `${spec.id}: nincs kijelölt útvonal.`, "danger"); continue; }
    state.trains.push({ ...spec, x: nodeById(level, entry).x, y: nodeById(level, entry).y, from: entry, to: first, progress: 0, brake: false, stopped: false, active: true, waitLogged: false, passedSignal: false, waitSince: null, delayCounted: false });
    addEvent(state, `${spec.id} szerelvény belépett a hálózatba.`, "info");
  }

  let moved = false;
  for (const train of state.trains) {
    if (!train.active || train.brake) continue;
    const from = nodeById(level, train.from), to = nodeById(level, train.to);
    if (!from || !to) { derail(state, train, "Hiányzó vágányszakasz"); continue; }
    const signal = state.signals.find(item =>
      item.edge[0] === train.from && item.edge[1] === train.to);
    const length = Math.max(1, Math.hypot(to.x-from.x, to.y-from.y));
    const nextProgress = Math.min(1, train.progress + train.speed * dt / length);
    // Nincs automatikus követésitávolság-tartás: a forgalomirányító felelőssége,
    // hogy ne engedjen két szerelvényt egymásnak. Az ütközést a lentebbi
    // távolságvizsgálat észleli, és azonnal Game Overt eredményez.
    // A jelző a szakasz 45%-án áll, a vonat előtte 20 pixellel megáll.
    // Áthaladás után automatikusan visszavált pirosra, így minden vonatnak
    // külön szabad jelzést kell adni.
    if (signal && !train.passedSignal) {
      const signalAt = .45;
      const stopAt = Math.max(0, signalAt - 20 / length);
      if (!signal.green && nextProgress >= stopAt) {
        train.progress = Math.min(train.progress, stopAt);
        train.x = from.x + (to.x-from.x)*train.progress;
        train.y = from.y + (to.y-from.y)*train.progress;
        train.stopped = true;
        if (train.waitSince === null || train.waitSince === undefined) train.waitSince = state.elapsed;
        if (!train.delayCounted && state.elapsed - train.waitSince >= 3) {
          state.delays++;
          train.delayCounted = true;
          addEvent(state, `${train.id}: késés (legalább 3 másodperc várakozás).`, "warn");
        }
        if (!train.waitLogged) {
          addEvent(state, `${train.id}: megállás vörös jelző előtt.`, "warn");
          train.waitLogged = true;
        }
        continue;
      }
      if (signal.green && nextProgress >= signalAt) {
        train.passedSignal = true;
        signal.green = false;
        addEvent(state, `${train.id}: jelző meghaladva, automatikus visszaállítás.`, "info");
      }
    }
    train.stopped = false;
    train.waitLogged = false;
    train.waitSince = null;
    train.delayCounted = false;
    if (nextProgress > train.progress) moved = true;
    train.progress = nextProgress;
    if (train.progress >= 1) {
      train.x = to.x; train.y = to.y; train.from = train.to; train.progress = 0; train.passedSignal = false;
      if (to.type === "platform") {
        train.active = false;
        if (train.from === train.destination && train.color === to.color) {
          state.arrived++;
          addEvent(state, `${train.id}: sikeresen befutott a peronra.`, "good");
        } else {
          state.errors++;
          addEvent(state, `${train.id}: téves peronra érkezett!`, "danger");
        }
      } else {
        const next = nextNode(state, train.from);
        if (!next || !edgeExists(level, train.from, next)) { derail(state, train, "Nincs továbbhaladási útvonal"); }
        else { train.to = next; }
      }
    } else {
      train.x = from.x + (to.x - from.x) * train.progress;
      train.y = from.y + (to.y - from.y) * train.progress;
    }
  }

  // Ütközésvizsgálat: két aktív vonat veszélyes közelsége ugyanazon pályarészen.
  const active = state.trains.filter(train => train.active);
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i], b = active[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 24) {
        state.failed = true; state.running = false;
        state.collision = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        a.active = false; b.active = false;
        a.destroyed = true; b.destroyed = true;
        addEvent(state, `ÜTKÖZÉS! ${a.id} és ${b.id} szerelvény összeütközött.`, "danger");
        return;
      }
      if (distance < 75 && state.elapsed - state.lastWarning > 1.5) {
        addEvent(state, `Ütközésveszély: ${a.id} és ${b.id} túl közel haladt egymáshoz.`, "warn");
        state.lastWarning = state.elapsed;
      }
    }
  }
  // Ha minden vonat tartósan áll, a forgalomirányító figyelmeztetést kap.
  // A játék nem kapcsol át automatikusan zöldre: a jelzők kezelése a játékos feladata.
  // A jelző előtti állás feloldható, így nem tekintjük azonnal végleges holtpontnak.
  if (active.length && state.elapsed >= level.schedule[level.schedule.length - 1].spawn && !moved) {
    if (state.standstillSince === null) state.standstillSince = state.elapsed;
    if (!state.deadlockWarned && state.elapsed - state.standstillSince >= 10) {
      addEvent(state, "Forgalmi holtpont veszélye: minden vonat áll. Ellenőrizd a piros jelzőket és a vészfékeket!", "warn");
      state.deadlockWarned = true;
    }
  } else {
    state.standstillSince = null;
    state.deadlockWarned = false;
  }
  if (state.scheduleIndex >= level.schedule.length && !state.trains.some(train => train.active)) {
    state.finished = true; state.running = false;
  }
}

function derail(state, train, reason) {
  train.active = false; state.errors++;
  addEvent(state, `${train.id}: kisiklás – ${reason}.`, "danger");
}

export function toggleSwitch(state, id) {
  const sw = state.switches.find(item => item.id === id);
  if (sw) { sw.selected = (sw.selected + 1) % sw.options.length; addEvent(state, `Váltó átállítva: ${id}.`, "info"); }
}
export function toggleSignal(state, id) {
  const signal = state.signals.find(item => item.id === id);
  if (signal) { signal.green = !signal.green; addEvent(state, `${id}: ${signal.green ? "SZABAD" : "TILOS"} jelzés.`, signal.green ? "good" : "warn"); }
}
export function toggleBrake(state, trainId) {
  const train = state.trains.find(item => item.id === trainId && item.active);
  if (train) { train.brake = !train.brake; addEvent(state, `${train.id}: ${train.brake ? "vészfék behúzva" : "vészfék feloldva"}.`, "warn"); }
}


// Mentett állapot ellenőrzése: a hibás JSON nem kerülhet a futó játékba.
export function validateSavedGame(saved) {
  const fail = () => { throw new Error("A mentett játékállás hiányos vagy érvénytelen."); };
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) fail();
  const level = LEVELS[saved.levelId];
  if (!level || !Number.isInteger(Number(saved.levelId))) fail();
  if (typeof saved.player !== "string" || !saved.player.trim()) fail();
  for (const key of ["elapsed", "arrived", "errors", "delays", "scheduleIndex"]) {
    if (!Number.isFinite(saved[key]) || saved[key] < 0) fail();
  }
  if (!Number.isInteger(saved.scheduleIndex) || saved.scheduleIndex > level.schedule.length) fail();
  if (saved.arrived + saved.errors > level.total) fail();
  for (const key of ["running", "started", "finished", "failed"]) {
    if (typeof saved[key] !== "boolean") fail();
  }
  if (!Array.isArray(saved.switches) || saved.switches.length !== level.switches.length ||
      !Array.isArray(saved.signals) || saved.signals.length !== level.signals.length ||
      !Array.isArray(saved.trains) || saved.trains.length > level.schedule.length ||
      !Array.isArray(saved.events)) fail();
  for (const original of level.switches) {
    const sw = saved.switches.find(item => item.id === original.id);
    if (!sw || !Array.isArray(sw.options) || sw.options.join("|") !== original.options.join("|") ||
        !Number.isInteger(sw.selected) || sw.selected < 0 || sw.selected >= original.options.length) fail();
  }
  for (const original of level.signals) {
    const sig = saved.signals.find(item => item.id === original.id);
    if (!sig || typeof sig.green !== "boolean" || !Array.isArray(sig.edge) ||
        sig.edge.join("|") !== original.edge.join("|")) fail();
  }
  const seen = new Set();
  for (const train of saved.trains) {
    const spec = level.schedule.find(item => item.id === train.id);
    if (!spec || seen.has(train.id)) fail();
    seen.add(train.id);
    if (train.destination !== spec.destination || train.color !== spec.color || train.speed !== spec.speed) fail();
    if (![train.x, train.y, train.progress].every(Number.isFinite) ||
        train.progress < 0 || train.progress > 1) fail();
    if (!level.nodes.some(node => node.id === train.from) ||
        !level.nodes.some(node => node.id === train.to) ||
        !level.edges.some(edge => edge[0] === train.from && edge[1] === train.to)) {
      // A már célba ért vonat a peron csomópontján áll.
      if (!(train.active === false && train.from === train.to &&
            level.nodes.some(node => node.id === train.from))) fail();
    }
    for (const key of ["active", "brake", "passedSignal"]) {
      if (typeof train[key] !== "boolean") fail();
    }
  }
  if (saved.finished && saved.running || saved.failed && saved.running) fail();
  return saved;
}
