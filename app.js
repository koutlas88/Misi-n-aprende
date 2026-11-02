/* Misión Aprende - interfaz, progreso y panel para padres */
(function () {
  'use strict';

  const KEY = 'mision-aprende-v1';
  const $app = document.getElementById('app');
  const PRAISE = ['¡Muy bien!', '¡Genial!', '¡Eso es!', '¡Fantástico!', '¡Lo has conseguido!'];

  /* ---------- Utilidades ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtNums = (s) => esc(s).replace(/\d+/g, '<b>$&</b>');
  const pick = Games.pick;
  const todayKey = (d) => {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  /* ---------- Datos guardados ---------- */
  const defaultProfile = (id) => ({
    name: Games.PROFILES[id].defaultName,
    limit: 3,
    unlockAll: false,
    extra: { date: '', n: 0 },
    missions: {},
    stickers: [],
    history: [],
    skills: {},
  });
  function normalize(s) {
    s = s && typeof s === 'object' ? s : {};
    s.settings = Object.assign({ sound: true, voice: '', rate: 0.92 }, s.settings || {});
    s.profiles = s.profiles || {};
    Object.keys(Games.PROFILES).forEach((id) => {
      s.profiles[id] = Object.assign(defaultProfile(id), s.profiles[id] || {});
    });
    return s;
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return normalize(JSON.parse(raw));
    } catch (e) { /* sin datos */ }
    return normalize({});
  }
  let S = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sin espacio */ }
  }
  const P = (id) => S.profiles[id];
  const missionsOf = (id) => Games.MISSIONS[id];

  function isUnlocked(pid, i) {
    const p = P(pid);
    if (p.unlockAll || i === 0) return true;
    const prev = missionsOf(pid)[i - 1];
    return !!(p.missions[prev.id] && p.missions[prev.id].done > 0);
  }
  const totalStars = (pid) => Object.values(P(pid).missions).reduce((a, m) => a + (m.stars || 0), 0);
  const doneCount = (pid) => Object.values(P(pid).missions).filter((m) => m.done > 0).length;
  const playedToday = (pid) => P(pid).history.filter((h) => h.d === todayKey()).length;
  function allowedToday(pid) {
    const p = P(pid);
    if (!p.limit) return Infinity;
    return p.limit + (p.extra.date === todayKey() ? p.extra.n : 0);
  }
  const remaining = (pid) => allowedToday(pid) - playedToday(pid);
  function rank(pid) {
    const ts = totalStars(pid);
    let r = Games.RANKS[pid][0];
    Games.RANKS[pid].forEach((x) => { if (ts >= x.min) r = x; });
    return r;
  }
  function noteSkill(pid, tag, ok) {
    if (!tag) return;
    const sk = P(pid).skills;
    sk[tag] = sk[tag] || { ok: 0, err: 0 };
    if (ok) sk[tag].ok++; else sk[tag].err++;
  }

  /* ---------- Sonido y voz ---------- */
  let actx = null;
  function beep(seq) {
    if (!S.settings.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      let t = actx.currentTime;
      seq.forEach(([f, d]) => {
        const o = actx.createOscillator();
        const g = actx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g);
        g.connect(actx.destination);
        o.start(t);
        o.stop(t + d + 0.03);
        t += d * 0.9;
      });
    } catch (e) { /* sin audio */ }
  }
  const fx = {
    ok: () => beep([[660, 0.12], [880, 0.18]]),
    bad: () => beep([[240, 0.22]]),
    win: () => beep([[523, 0.12], [659, 0.12], [784, 0.12], [1047, 0.32]]),
    tap: () => beep([[520, 0.05]]),
  };
  let voices = [];
  const hasSpeech = 'speechSynthesis' in window;
  function loadVoices() { if (hasSpeech) voices = window.speechSynthesis.getVoices(); }
  loadVoices();
  if (hasSpeech) window.speechSynthesis.onvoiceschanged = loadVoices;
  function voiceScore(v) {
    const n = v.name || '';
    let s = 0;
    if (/natural|neural|online/i.test(n)) s += 100;
    if (/premium|enhanced|mejorada|siri/i.test(n)) s += 80;
    if (/google/i.test(n)) s += 30;
    if (/elena|alvaro|álvaro|paulina|m[oó]nica|marisol|helena|laura|luc[ií]a|sabina|jorge|diego|ang[eé]lica|mia/i.test(n)) s += 20;
    if (/^es[-_]ES/i.test(v.lang)) s += 5;
    return s;
  }
  const esVoices = () => voices.filter((x) => /^es/i.test(x.lang));
  function bestVoice() {
    if (S.settings.voice) {
      const f = voices.find((x) => x.name === S.settings.voice);
      if (f) return f;
    }
    return esVoices().sort((a, b) => voiceScore(b) - voiceScore(a))[0] || null;
  }
  function speak(text) {
    if (!S.settings.sound || !hasSpeech || !text) return;
    try {
      const clean = String(text).replace(/−/g, ' menos ').replace(/×/g, ' por ').replace(/\+/g, ' más ').replace(/=/g, ' igual a ');
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'es-ES';
      u.rate = S.settings.rate || 0.92;
      u.pitch = 1.05;
      const v = bestVoice();
      if (v) { u.voice = v; u.lang = v.lang; }
      window.speechSynthesis.speak(u);
    } catch (e) { /* sin voz */ }
  }
  const stopSpeech = () => { try { if (hasSpeech) window.speechSynthesis.cancel(); } catch (e) { /* nada */ } };

  /* ---------- Efectos visuales ---------- */
  function burst(el) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const em = ['⭐', '✨', '🎉', '💫'];
    for (let k = 0; k < 8; k++) {
      const s = document.createElement('span');
      s.className = 'pop';
      s.textContent = em[k % 4];
      s.style.left = cx + 'px';
      s.style.top = cy + 'px';
      const ang = (k / 8) * 2 * Math.PI;
      s.style.setProperty('--dx', Math.cos(ang) * 70 + 'px');
      s.style.setProperty('--dy', Math.sin(ang) * 70 + 'px');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }
  }
  function rain(list) {
    for (let k = 0; k < 22; k++) {
      const s = document.createElement('span');
      s.className = 'rain';
      s.textContent = list[k % list.length];
      s.style.left = Math.random() * 95 + 'vw';
      s.style.animationDelay = Math.random() * 0.8 + 's';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 3400);
    }
  }

  /* ---------- Estado de navegación ---------- */
  let cur = { pid: null };
  let run = null;
  let parentOK = false;
  let gateAnswer = 0;
  const setTheme = (t) => { document.body.dataset.theme = t; };

  function header(title, back) {
    return `<header class="top">${back ? `<button class="icon" data-act="${back}" aria-label="Volver">⬅️</button>` : '<span style="width:48px"></span>'}<div class="ttl">${title}</div><button class="icon" data-act="sound" aria-label="Sonido">${S.settings.sound ? '🔊' : '🔇'}</button></header>`;
  }

  /* ---------- Inicio ---------- */
  function renderHome() {
    stopSpeech();
    setTheme('home');
    run = null;
    const cards = Object.keys(Games.PROFILES).map((id) => {
      const pr = Games.PROFILES[id];
      const p = P(id);
      const rk = rank(id);
      return `<button class="profile ${id}" data-act="profile" data-id="${id}"><span class="em">${pr.emoji}</span><span><b>${esc(p.name)}</b><span>${pr.world}</span><span>${rk.icon} ${rk.title} · ⭐ ${totalStars(id)}</span></span></button>`;
    }).join('');
    $app.innerHTML = `<div class="home">${header('', '')}<h1>Misión Aprende</h1><p class="sub">¿Quién juega hoy?</p>${cards}<button class="parent-link" data-act="parent">👨‍👩‍👧 Zona de padres</button></div>`;
  }

  /* ---------- Mapa de misiones ---------- */
  function renderMap(pid) {
    stopSpeech();
    cur.pid = pid;
    run = null;
    setTheme(pid);
    const pr = Games.PROFILES[pid];
    const p = P(pid);
    const ms = missionsOf(pid);
    const rk = rank(pid);
    const allowed = allowedToday(pid);
    let dots = '';
    if (allowed !== Infinity) {
      const done = playedToday(pid);
      dots = Array.from({ length: allowed }, (_, k) => `<i class="${k < done ? 'on' : ''}"></i>`).join('');
    }
    const firstPending = ms.findIndex((m, i) => isUnlocked(pid, i) && !(p.missions[m.id] && p.missions[m.id].done));
    const nodes = ms.map((m, i) => {
      const u = isUnlocked(pid, i);
      const rec = p.missions[m.id];
      const st = rec ? rec.stars : 0;
      return `<button class="node ${u ? '' : 'locked'} ${i === firstPending ? 'current' : ''}" data-act="mission" data-i="${i}" ${u ? '' : 'disabled'}><span class="num">${i + 1}</span><span class="ico">${u ? m.icon : '🔒'}</span><span class="ttl">${esc(m.title)}</span><span class="st">${'★'.repeat(st)}${'☆'.repeat(3 - st)}</span></button>`;
    }).join('');
    $app.innerHTML = `${header(esc(pr.world), 'back-home')}
      <div class="card"><div class="hero"><div class="avatar">${rk.icon}</div><div class="grow"><b>${esc(p.name)}</b><br>${rk.title}</div><div class="stars">⭐ ${totalStars(pid)}</div></div>
      <div class="today">Hoy: ${dots || '∞'} ${allowed === Infinity ? '' : `<span>${Math.min(playedToday(pid), allowed)}/${allowed}</span>`}</div></div>
      <div class="map">${nodes}</div>
      <button class="btn album-btn" data-act="album">${pid === 'peque' ? '📒 Mis pegatinas de animales' : '🏅 Mis insignias de héroe'}</button>`;
  }

  function renderAlbum(pid) {
    const p = P(pid);
    const all = Games.STICKERS[pid].slice(0, missionsOf(pid).length);
    const items = all.map((s) => (p.stickers.includes(s) ? `<div>${s}</div>` : '<div class="locked">?</div>')).join('');
    $app.innerHTML = `${header(pid === 'peque' ? 'Mis pegatinas' : 'Mis insignias', 'back-map')}<div class="card"><p>Has conseguido <b>${p.stickers.length}</b> de ${all.length}. ¡Completa misiones para ganar más!</p></div><div class="album">${items}</div>`;
  }

  function renderDoneToday(pid) {
    stopSpeech();
    const msg = '¡Misión cumplida por hoy! Mañana te esperan más aventuras.';
    $app.innerHTML = `${header('', 'back-map')}<div class="card result"><div class="bigemoji">🌙</div><h1>¡Misión cumplida por hoy!</h1><p class="msg">Has hecho ${playedToday(pid)} misiones. Ahora toca descansar o jugar fuera. ¡Mañana hay más aventuras!</p><div class="btns"><button class="btn" data-act="back-home">Volver al inicio</button></div></div>`;
    rain(['⭐', '🌟', '✨']);
    setTimeout(() => speak(msg), 300);
  }

  /* ---------- Jugar ---------- */
  function startMission(pid, i) {
    const ms = missionsOf(pid);
    if (i >= ms.length) { renderMap(pid); return; }
    if (remaining(pid) <= 0) { renderDoneToday(pid); return; }
    const m = ms[i];
    fx.tap();
    run = { pid, i, m, q: 0, errs: 0, units: 0, step: 0, question: null, stepWrong: false, qErr: 0, locked: false, counted: 0, mem: null, rankBefore: rank(pid).title };
    setTheme(pid);
    if (m.kind === 'memory') startMemory(); else nextQuestion();
  }

  function nextQuestion() {
    if (run.q >= run.m.rounds) { finish(); return; }
    run.question = run.m.gen();
    run.step = 0;
    renderStep();
  }

  function renderStep() {
    const { m, question: qu, step } = run;
    const st = qu.steps[step];
    run.stepWrong = false;
    run.qErr = 0;
    run.locked = false;
    run.counted = 0;
    const dots = Array.from({ length: m.rounds }, (_, k) => `<i class="${k < run.q ? 'on' : k === run.q ? 'cur' : ''}"></i>`).join('');
    let html = header(`${m.icon} ${esc(m.title)}`, 'back-map') + `<div class="progress">${dots}</div>`;
    if (qu.story) {
      html += `<div class="card story"><div class="storyvis">${qu.story.visual || ''}</div><p>${fmtNums(qu.story.text)}</p><button class="speakbtn" data-act="speak" data-t="story" aria-label="Escuchar">🔊</button></div>`;
    }
    if (st.visual) html += `<div class="stvis">${st.visual}</div>`;
    html += `<div class="promptrow"><h2 class="prompt">${st.prompt}</h2><button class="speakbtn" data-act="speak" data-t="step" aria-label="Escuchar">🔊</button></div>`;
    html += `<div class="options ${st.layout}">${st.options.map((o, k) => `<button class="opt" data-act="opt" data-i="${k}">${o.html}</button>`).join('')}</div><div class="hintbox" id="hint"></div>`;
    $app.innerHTML = html;
    window.scrollTo(0, 0);
    const text = step === 0 && qu.story ? qu.story.text + ' ' + (st.speak || st.prompt) : (st.speak || st.prompt);
    setTimeout(() => speak(text), 250);
  }

  function answer(k, btn) {
    if (!run || run.locked) return;
    const st = run.question.steps[run.step];
    const o = st.options[k];
    if (o.correct) {
      run.locked = true;
      btn.classList.add('right');
      if (!run.stepWrong) noteSkill(run.pid, st.tag, true);
      run.units++;
      fx.ok();
      burst(btn);
      speak(pick(PRAISE));
      save();
      setTimeout(() => {
        run.step++;
        if (run.step < run.question.steps.length) renderStep();
        else { run.q++; nextQuestion(); }
      }, 1000);
    } else {
      run.errs++;
      run.qErr++;
      if (!run.stepWrong) noteSkill(run.pid, st.tag, false);
      run.stepWrong = true;
      btn.classList.add('wrong');
      btn.disabled = true;
      fx.bad();
      const hint = document.getElementById('hint');
      if (hint && st.hint && run.pid === 'explorador') {
        hint.textContent = '💡 ' + st.hint;
        speak(st.hint.replace(/[➕➖✖️]/g, ''));
      } else {
        speak('¡Casi! Inténtalo otra vez.');
      }
      if (run.qErr >= 2) {
        const idx = st.options.findIndex((x) => x.correct);
        const good = $app.querySelector(`.opt[data-i="${idx}"]`);
        if (good) good.classList.add('pulse');
      }
      save();
    }
  }

  /* ---------- Memoria ---------- */
  function startMemory() {
    const pairs = run.m.pairs;
    const an = Games.sample(Games.ANIMALS, pairs);
    const cards = Games.shuffle(an.concat(an)).map((a, id) => ({ id, e: a.e, pl: a.pl, flipped: false, matched: false }));
    run.mem = { cards, open: [], matched: 0, lock: false, pairs };
    run.units = pairs;
    const grid = cards.map((c, i) => `<button class="mcard" data-act="card" data-i="${i}" aria-label="Carta"><span class="inner"><span class="face front">❓</span><span class="face back">${c.e}</span></span></button>`).join('');
    $app.innerHTML = `${header(`${run.m.icon} ${esc(run.m.title)}`, 'back-map')}<div class="promptrow"><h2 class="prompt">Encuentra las parejas</h2><button class="speakbtn" data-act="speak" data-t="mem">🔊</button></div><div class="mgrid ${cards.length > 6 ? 'c4' : ''}">${grid}</div>`;
    setTimeout(() => speak('Encuentra las parejas de animales'), 250);
  }

  function flipCard(i) {
    const mem = run && run.mem;
    if (!mem || mem.lock) return;
    const c = mem.cards[i];
    if (c.flipped || c.matched) return;
    c.flipped = true;
    mem.open.push(i);
    const el = $app.querySelector(`.mcard[data-i="${i}"]`);
    el.classList.add('flipped');
    fx.tap();
    if (mem.open.length === 2) {
      mem.lock = true;
      const [a, b] = mem.open;
      setTimeout(() => {
        const ca = mem.cards[a];
        const cb = mem.cards[b];
        const ea = $app.querySelector(`.mcard[data-i="${a}"]`);
        const eb = $app.querySelector(`.mcard[data-i="${b}"]`);
        if (ca.e === cb.e) {
          ca.matched = cb.matched = true;
          ea.classList.add('matched');
          eb.classList.add('matched');
          mem.matched++;
          fx.ok();
          burst(ea);
          speak('¡Pareja de ' + ca.pl + '!');
          if (mem.matched === mem.pairs) setTimeout(finish, 1400);
        } else {
          run.errs++;
          ca.flipped = cb.flipped = false;
          ea.classList.remove('flipped');
          eb.classList.remove('flipped');
          fx.bad();
        }
        mem.open = [];
        mem.lock = false;
      }, 850);
    }
  }

  /* ---------- Final de misión ---------- */
  function finish() {
    const { pid, m, i } = run;
    const p = P(pid);
    const ratio = run.errs / Math.max(1, run.units);
    const stars = m.kind === 'memory'
      ? (run.errs <= run.units ? 3 : run.errs <= run.units * 2 ? 2 : 1)
      : (ratio <= 0.15 ? 3 : ratio <= 0.5 ? 2 : 1);
    const rec = p.missions[m.id] || { stars: 0, done: 0 };
    const firstTime = rec.done === 0;
    rec.done++;
    rec.stars = Math.max(rec.stars, stars);
    p.missions[m.id] = rec;
    const stk = Games.STICKERS[pid][i];
    let newSticker = null;
    if (stk && !p.stickers.includes(stk)) { p.stickers.push(stk); newSticker = stk; }
    p.history.push({ d: todayKey(), m: m.id, s: stars, e: run.errs, t: Date.now() });
    if (p.history.length > 300) p.history = p.history.slice(-300);
    save();
    const rankNow = rank(pid);
    const levelUp = rankNow.title !== run.rankBefore;
    const hasNext = i + 1 < missionsOf(pid).length && isUnlocked(pid, i + 1);
    const left = remaining(pid);
    let btns = '';
    if (left > 0) {
      if (hasNext) btns += `<button class="btn" data-act="next">Siguiente misión ▶</button>`;
      btns += `<button class="btn alt" data-act="again">🔁 Repetir esta misión</button>`;
      btns += `<button class="btn alt" data-act="back-map">🗺️ Volver al mapa</button>`;
    } else {
      btns += `<button class="btn" data-act="back-map">🌙 ¡Hasta mañana!</button>`;
    }
    const msg = left > 0 ? '¡Buen trabajo! ¿Seguimos?' : '¡Misión cumplida por hoy! Mañana te esperan más aventuras.';
    $app.innerHTML = `${header('', null)}<div class="card result"><h1>¡Misión completada!</h1><div class="bigstars">${'⭐'.repeat(stars)}${'<span style="opacity:.25">⭐</span>'.repeat(3 - stars)}</div>${newSticker ? `<p>Nueva ${pid === 'peque' ? 'pegatina' : 'insignia'}:</p><div class="sticker-new">${newSticker}</div>` : ''}${levelUp ? `<div class="level-up">${rankNow.icon} ¡Subes de nivel: ${rankNow.title}!</div>` : ''}<p class="msg">${msg}</p><div class="btns">${btns}</div></div>`;
    window.scrollTo(0, 0);
    setTheme(pid);
    fx.win();
    rain(['⭐', '🎉', '✨', newSticker || '🌟']);
    setTimeout(() => speak(msg), 500);
    void firstTime;
  }

  /* ---------- Zona de padres ---------- */
  function renderGate() {
    stopSpeech();
    setTheme('home');
    const a = Games.rnd(13, 19);
    const b = Games.rnd(4, 9);
    gateAnswer = a * b;
    $app.innerHTML = `${header('Zona de padres', 'back-home')}<div class="card gate parent"><p>Para entrar, resuelve esta cuenta:</p><h2 style="margin-top:10px;font-size:32px">${a} × ${b} = ?</h2><input type="number" inputmode="numeric" id="gate-in" autocomplete="off"><div class="btns"><button class="btn" data-act="gate-go">Entrar</button></div><p class="note" id="gate-msg"></p></div>`;
  }

  function weekRow(pid) {
    const out = [];
    const names = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    for (let k = 6; k >= 0; k--) {
      const d = new Date();
      d.setDate(d.getDate() - k);
      const key = todayKey(d);
      const n = P(pid).history.filter((h) => h.d === key).length;
      out.push(`<div><b class="${n ? 'has' : ''}">${n}</b>${names[d.getDay()]}</div>`);
    }
    return `<div class="week">${out.join('')}</div>`;
  }

  function skillsBlock(pid) {
    const sk = P(pid).skills;
    const rows = Object.keys(sk).filter((t) => sk[t].ok + sk[t].err > 0).map((t) => {
      const tot = sk[t].ok + sk[t].err;
      return { t, tot, pct: Math.round((sk[t].ok / tot) * 100) };
    }).sort((a, b) => a.pct - b.pct);
    if (!rows.length) return '<p class="note">Todavía no hay datos. Aparecerán cuando jueguen.</p>';
    const weak = rows.filter((r) => r.tot >= 4 && r.pct < 70).slice(0, 3);
    let html = weak.length
      ? `<div class="warn">📌 <b>Conviene repasar:</b> ${weak.map((r) => esc(Games.SKILL_NAMES[r.t] || r.t)).join(', ')}</div>`
      : '<p class="note">De momento no hay ninguna habilidad con muchos fallos. ¡Bien!</p>';
    html += rows.map((r) => `<div class="skill">${esc(Games.SKILL_NAMES[r.t] || r.t)} <small>(${r.pct}% a la primera · ${r.tot} intentos)</small><div class="bar"><i class="${r.pct < 50 ? 'low' : r.pct < 75 ? 'mid' : ''}" style="width:${r.pct}%"></i></div></div>`).join('');
    return html;
  }

  function renderParent() {
    const y = window.scrollY;
    loadVoices();
    const vs = esVoices();
    setTheme('home');
    const standalone = window.navigator.standalone || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const sections = Object.keys(Games.PROFILES).map((id) => {
      const pr = Games.PROFILES[id];
      const p = P(id);
      const total = missionsOf(id).length;
      const lim = p.limit;
      return `<div class="card"><h2>${pr.emoji} ${esc(p.name)} <small>(${pr.world})</small></h2>
        <label>Nombre</label><input type="text" maxlength="14" value="${esc(p.name)}" data-act="p-name" data-id="${id}">
        <p class="stat">✅ Misiones completadas: <b>${doneCount(id)}/${total}</b> · ⭐ ${totalStars(id)}</p>
        <p class="stat">📅 Hoy: <b>${playedToday(id)}</b> ${lim ? `de ${allowedToday(id)}` : '(sin límite)'}</p>
        <p class="stat">Últimos 7 días (misiones por día):</p>${weekRow(id)}
        <h3 style="margin-top:14px">Cómo van las habilidades</h3>${skillsBlock(id)}
        <label>Misiones por día</label>
        <select data-act="p-limit" data-id="${id}">${[[2, '2'], [3, '3'], [5, '5'], [8, '8'], [0, 'Sin límite']].map(([v, l]) => `<option value="${v}" ${lim === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
        <div class="row"><button class="btn small alt" data-act="p-extra" data-id="${id}">➕ Una misión más hoy</button>
        <button class="btn small alt" data-act="p-unlock" data-id="${id}">${p.unlockAll ? '🔒 Volver al orden normal' : '🔓 Desbloquear todas'}</button>
        <button class="btn small danger" data-act="p-reset" data-id="${id}">🗑️ Borrar progreso</button></div></div>`;
    }).join('');
    let code = '';
    try { code = btoa(unescape(encodeURIComponent(JSON.stringify(S)))); } catch (e) { code = ''; }
    $app.innerHTML = `${header('Zona de padres', 'back-home')}<div class="parent">${sections}
      <div class="card"><h2>💾 Copia de seguridad</h2>
        <p class="note">El progreso se guarda solo en este dispositivo. Para pasarlo a otro (o por si se borran los datos), copia este código y pégalo en el otro dispositivo.</p>
        <label>Tu código</label><textarea readonly id="bk-out">${code}</textarea>
        <div class="row"><button class="btn small" data-act="p-copy">📋 Copiar código</button></div>
        <label>Restaurar desde un código</label><textarea id="bk-in" placeholder="Pega aquí el código"></textarea>
        <div class="row"><button class="btn small alt" data-act="p-restore">♻️ Restaurar</button></div></div>
      <div class="card"><h2>⚙️ Otros ajustes</h2>
        <label>Voz</label><select data-act="p-voice"><option value="">Automática (la más natural)</option>${vs.map((v) => `<option value="${esc(v.name)}" ${S.settings.voice === v.name ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}</select>
        <label>Velocidad de la voz</label><select data-act="p-rate">${[[0.8, 'Lenta'], [0.92, 'Normal'], [1.05, 'Rápida']].map(([v, l]) => `<option value="${v}" ${Math.abs((S.settings.rate || 0.92) - v) < 0.01 ? 'selected' : ''}>${l}</option>`).join('')}</select>
        <div class="row"><button class="btn small" data-act="p-voice-test">▶ Probar voz</button></div>
        <p class="note">${vs.length ? 'Voz que se usa ahora: <b>' + esc((bestVoice() || {}).name || 'ninguna') + '</b>' : 'Este dispositivo no tiene voces en español instaladas.'}</p>
        <div class="row"><button class="btn small alt" data-act="p-sound">${S.settings.sound ? '🔊 Sonido y voz: activado' : '🔇 Sonido y voz: desactivado'}</button></div>
        ${standalone ? '<p class="note">✅ Estás usando la app instalada.</p>' : (isIOS ? '<div class="warn">📱 En iPhone: abre esta web en <b>Safari</b>, pulsa el botón Compartir y elige <b>"Añadir a pantalla de inicio"</b>. Así se queda instalada y el progreso no se borra por falta de uso.</div>' : '<p class="note">💻 En Windows (Edge o Chrome) puedes instalarla desde el icono de instalar de la barra de direcciones.</p>')}
      </div></div>`;
    window.scrollTo(0, y);
  }

  /* ---------- Eventos ---------- */
  $app.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act]');
    if (!t || t.tagName === 'SELECT' || (t.tagName === 'INPUT')) return;
    const a = t.dataset.act;
    const id = t.dataset.id;
    switch (a) {
      case 'profile': fx.tap(); renderMap(id); break;
      case 'back-home': renderHome(); break;
      case 'back-map': renderMap(cur.pid); break;
      case 'mission': startMission(cur.pid, +t.dataset.i); break;
      case 'album': renderAlbum(cur.pid); break;
      case 'sound':
        S.settings.sound = !S.settings.sound;
        if (!S.settings.sound) stopSpeech();
        save();
        document.querySelectorAll('[data-act="sound"]').forEach((b) => { b.textContent = S.settings.sound ? '🔊' : '🔇'; });
        break;
      case 'speak': {
        if (t.dataset.t === 'mem') speak('Encuentra las parejas de animales');
        else if (run && run.question) {
          const st = run.question.steps[run.step];
          speak(t.dataset.t === 'story' ? run.question.story.text : (st.speak || st.prompt));
        }
        break;
      }
      case 'opt': answer(+t.dataset.i, t); break;
      case 'count':
        if (t.dataset.n) break;
        run.counted++;
        t.dataset.n = run.counted;
        t.classList.add('counted');
        fx.tap();
        speak(String(run.counted));
        break;
      case 'card': flipCard(+t.dataset.i); break;
      case 'next': startMission(cur.pid, run.i + 1); break;
      case 'again': startMission(cur.pid, run.i); break;
      case 'parent': parentOK ? renderParent() : renderGate(); break;
      case 'gate-go': {
        const v = parseInt(document.getElementById('gate-in').value, 10);
        if (v === gateAnswer) { parentOK = true; renderParent(); }
        else { document.getElementById('gate-msg').textContent = 'No es correcto. Inténtalo de nuevo.'; }
        break;
      }
      case 'p-extra': {
        const p = P(id);
        p.extra = { date: todayKey(), n: (p.extra.date === todayKey() ? p.extra.n : 0) + 1 };
        save(); renderParent(); break;
      }
      case 'p-unlock': P(id).unlockAll = !P(id).unlockAll; save(); renderParent(); break;
      case 'p-reset':
        if (window.confirm('¿Seguro que quieres borrar todo el progreso de ' + P(id).name + '? No se puede deshacer.')) {
          const keep = { name: P(id).name, limit: P(id).limit };
          S.profiles[id] = Object.assign(defaultProfile(id), keep);
          save(); renderParent();
        }
        break;
      case 'p-sound': S.settings.sound = !S.settings.sound; save(); renderParent(); break;
      case 'p-voice-test': speak('¡Hola! Vamos a jugar con los animales y a cumplir misiones.'); break;
      case 'p-copy': {
        const ta = document.getElementById('bk-out');
        ta.select();
        const done = () => { t.textContent = '✅ Copiado'; };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(done, () => { document.execCommand('copy'); done(); });
        else { try { document.execCommand('copy'); } catch (err) { /* manual */ } done(); }
        break;
      }
      case 'p-restore': {
        const raw = document.getElementById('bk-in').value.trim();
        try {
          const data = JSON.parse(decodeURIComponent(escape(atob(raw))));
          if (!data || !data.profiles) throw new Error('formato');
          if (window.confirm('Esto reemplazará el progreso actual de este dispositivo. ¿Continuar?')) {
            S = normalize(data); save(); renderParent();
            alert('Progreso restaurado.');
          }
        } catch (err) { alert('El código no es válido. Cópialo entero e inténtalo de nuevo.'); }
        break;
      }
      default: break;
    }
  });

  $app.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.act === 'p-limit') { P(t.dataset.id).limit = parseInt(t.value, 10); save(); renderParent(); }
    if (t.dataset.act === 'p-voice') {
      S.settings.voice = t.value;
      save();
      renderParent();
      speak('¡Hola! Así suena esta voz.');
    }
    if (t.dataset.act === 'p-rate') {
      S.settings.rate = parseFloat(t.value);
      save();
      speak('¡Hola! Así suena esta velocidad.');
    }
    if (t.dataset.act === 'p-name') {
      const v = t.value.trim().slice(0, 14);
      P(t.dataset.id).name = v || Games.PROFILES[t.dataset.id].defaultName;
      save();
    }
  });
  $app.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.id === 'gate-in') {
      const b = $app.querySelector('[data-act="gate-go"]');
      if (b) b.click();
    }
  });

  /* ---------- Arranque ---------- */
  renderHome();
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* nada */ }
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
})();
