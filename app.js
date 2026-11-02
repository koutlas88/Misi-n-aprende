/* Misión Aprende - minijuegos de 1 minuto (se desbloquean con los regalos) */
const MG_BUNDLE = (function () {
  const W = 360;
  const H = 520;
  const rnd = (a, b) => Math.random() * (b - a) + a;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  /* ---------- Utilidades de dibujo ---------- */
  function sky(ctx, top, bottom) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  function sparkle(list, x, y, color) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const s = rnd(60, 140);
      list.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.6, max: 0.6, color });
    }
  }
  function updateParticles(list, dt) {
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) list.splice(i, 1);
    }
  }
  function drawParticles(ctx, list) {
    list.forEach((p) => {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  function drawEgg(ctx, x, y, gold) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 20, 0, 0, Math.PI * 2);
    ctx.fillStyle = gold ? '#ffd23f' : '#fffbe8';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = gold ? '#e0a800' : '#c9b27a';
    ctx.stroke();
    ctx.fillStyle = gold ? '#fff0a0' : '#ff9ec2';
    ctx.beginPath();
    ctx.arc(-4, -4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* ---------- Salva los huevos (dino) ---------- */
  function eggs(env) {
    const ctx = env.ctx;
    let nestX = W / 2;
    let spawn = 0.3;
    let t = 0;
    const list = [];
    const parts = [];
    return {
      update(dt) {
        t += dt;
        spawn -= dt;
        if (spawn <= 0) {
          spawn = Math.max(0.42, 0.95 - t * 0.008);
          list.push({ x: rnd(30, W - 30), y: -30, vy: 150 + t * 2.2 + rnd(0, 60), gold: Math.random() < 0.12 });
        }
        for (let i = list.length - 1; i >= 0; i--) {
          const e = list[i];
          e.y += e.vy * dt;
          if (e.y > H - 84 && e.y < H - 38 && Math.abs(e.x - nestX) < 52) {
            env.addScore(e.gold ? 3 : 1);
            env.sfx('ok');
            sparkle(parts, e.x, e.y, e.gold ? '#ffd23f' : '#ffffff');
            list.splice(i, 1);
          } else if (e.y > H + 30) {
            list.splice(i, 1);
          }
        }
        updateParticles(parts, dt);
      },
      draw() {
        sky(ctx, '#bfe8ff', '#dff5c8');
        ctx.fillStyle = '#7cc66b';
        ctx.fillRect(0, H - 40, W, 40);
        list.forEach((e) => drawEgg(ctx, e.x, e.y, e.gold));
        // nido
        ctx.fillStyle = '#8d5a2b';
        ctx.beginPath();
        ctx.ellipse(nestX, H - 52, 56, 24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#6b3f1d';
        ctx.beginPath();
        ctx.ellipse(nestX, H - 58, 46, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b07a3c';
        ctx.lineWidth = 3;
        for (let i = -3; i <= 3; i++) {
          ctx.beginPath();
          ctx.moveTo(nestX + i * 15 - 8, H - 36);
          ctx.lineTo(nestX + i * 15 + 8, H - 66);
          ctx.stroke();
        }
        drawParticles(ctx, parts);
      },
      pointer(type, x) {
        if (type !== 'up') nestX = clamp(x, 48, W - 48);
      },
    };
  }

  /* ---------- Salto del dino ---------- */
  function runner(env) {
    const ctx = env.ctx;
    const ground = H - 120;
    const dx = 60;
    const dw = 66;
    const dh = 70;
    let t = 0;
    let y = 0;
    let vy = 0;
    let spawn = 1.2;
    let inv = 0;
    let gx = 0;
    const obs = [];
    const clouds = [{ x: 60, y: 80 }, { x: 220, y: 140 }, { x: 330, y: 60 }];
    return {
      update(dt) {
        t += dt;
        const speed = 230 + t * 2.5;
        gx = (gx + speed * dt) % 40;
        spawn -= dt;
        if (spawn <= 0) {
          spawn = rnd(1.3, 2.2) * (230 / speed) + 0.45;
          const cactus = Math.random() < 0.5;
          obs.push({ x: W + 20, w: 34, h: cactus ? 52 : 36, e: cactus ? '🌵' : '🪨', passed: false, hit: false });
        }
        if (y > 0 || vy > 0) {
          vy -= 1800 * dt;
          y += vy * dt;
          if (y <= 0) { y = 0; vy = 0; }
        }
        if (inv > 0) inv -= dt;
        clouds.forEach((c) => { c.x -= 18 * dt; if (c.x < -60) c.x = W + 40; });
        for (let i = obs.length - 1; i >= 0; i--) {
          const o = obs[i];
          o.x -= speed * dt;
          if (!o.hit && inv <= 0 && o.x < dx + dw - 16 && o.x + o.w > dx + 16 && y < o.h - 8) {
            o.hit = true;
            inv = 0.9;
            env.sfx('bad');
          } else if (!o.passed && o.x + o.w < dx) {
            o.passed = true;
            if (!o.hit) { env.addScore(1); env.sfx('tap'); }
          }
          if (o.x < -70) obs.splice(i, 1);
        }
      },
      draw() {
        sky(ctx, '#aee3ff', '#eefaff');
        ctx.fillStyle = '#fff';
        clouds.forEach((c) => {
          ctx.beginPath();
          ctx.ellipse(c.x, c.y, 34, 14, 0, 0, Math.PI * 2);
          ctx.ellipse(c.x + 20, c.y - 8, 22, 12, 0, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.fillStyle = '#7cc66b';
        ctx.fillRect(0, ground, W, H - ground);
        ctx.fillStyle = '#b07a3c';
        ctx.fillRect(0, ground, W, 8);
        ctx.fillStyle = '#6aae5c';
        for (let x = -gx; x < W; x += 40) ctx.fillRect(x, ground + 30, 18, 5);
        ctx.font = '44px ' + EMOJI;
        ctx.textAlign = 'left';
        obs.forEach((o) => ctx.fillText(o.e, o.x - 4, ground + 2));
        if (inv <= 0 || Math.floor(inv * 12) % 2 === 0) {
          const img = env.img;
          if (img && img.complete && img.naturalWidth) ctx.drawImage(img, dx, ground - dh - y + 6, dw, dh);
          else ctx.fillText('🦖', dx, ground - y);
        }
      },
      pointer(type) {
        if (type === 'down' && y === 0) { vy = 640; env.sfx('tap'); }
      },
    };
  }

  /* ---------- Burbujas arcoíris (unicornio) ---------- */
  function bubbles(env) {
    const ctx = env.ctx;
    let t = 0;
    let spawn = 0.1;
    const list = [];
    const parts = [];
    return {
      update(dt) {
        t += dt;
        spawn -= dt;
        if (spawn <= 0) {
          spawn = Math.max(0.3, 0.6 - t * 0.004);
          const r = rnd(26, 46);
          list.push({ x: rnd(r, W - r), y: H + r, r, vy: rnd(50, 100) + t * 0.6, ph: rnd(0, 6.28), h: Math.floor(rnd(0, 360)) });
        }
        for (let i = list.length - 1; i >= 0; i--) {
          const b = list[i];
          b.y -= b.vy * dt;
          b.x += Math.sin(t * 2 + b.ph) * 24 * dt;
          if (b.y < -b.r - 10) list.splice(i, 1);
        }
        updateParticles(parts, dt);
      },
      draw() {
        sky(ctx, '#ffe3f3', '#e4f4ff');
        const cols = ['#ff6b6b', '#ffa94d', '#ffe066', '#69db7c', '#4dabf7', '#b197fc'];
        ctx.lineWidth = 14;
        cols.forEach((c, i) => {
          ctx.globalAlpha = 0.35;
          ctx.strokeStyle = c;
          ctx.beginPath();
          ctx.arc(W / 2, H + 20, 170 - i * 14, Math.PI, 0);
          ctx.stroke();
        });
        ctx.globalAlpha = 1;
        list.forEach((b) => {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = 'hsla(' + b.h + ',90%,75%,0.35)';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'hsl(' + b.h + ',85%,60%)';
          ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,0.75)';
          ctx.beginPath();
          ctx.ellipse(b.x - b.r * 0.35, b.y - b.r * 0.4, b.r * 0.22, b.r * 0.13, -0.6, 0, Math.PI * 2);
          ctx.fill();
        });
        drawParticles(ctx, parts);
      },
      pointer(type, x, y) {
        if (type !== 'down') return;
        for (let i = list.length - 1; i >= 0; i--) {
          const b = list[i];
          if (Math.hypot(b.x - x, b.y - y) < b.r + 10) {
            env.addScore(1);
            env.sfx('tap');
            sparkle(parts, b.x, b.y, 'hsl(' + b.h + ',90%,60%)');
            list.splice(i, 1);
            break;
          }
        }
      },
    };
  }

  /* ---------- Pinta el arcoíris (unicornio) ---------- */
  function paint(env) {
    const ctx = env.ctx;
    const BG = '#fffaf5';
    let color = '#e5484d';
    let mode = 'color';
    let hue = 0;
    let drawing = false;
    let lx = 0;
    let ly = 0;
    function background() {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#eadfea';
      ctx.lineWidth = 6;
      ctx.setLineDash([10, 10]);
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(W / 2, 330, 150 - i * 26, Math.PI, 0);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.ellipse(70, 360, 44, 20, 0, 0, Math.PI * 2);
      ctx.ellipse(290, 360, 44, 20, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    background();
    function stroke(x1, y1, x2, y2) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = mode === 'eraser' ? 34 : 16;
      if (mode === 'rainbow') { hue = (hue + 6) % 360; ctx.strokeStyle = 'hsl(' + hue + ',90%,60%)'; }
      else ctx.strokeStyle = mode === 'eraser' ? BG : color;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    const colors = ['#e5484d', '#ff8a3d', '#ffd23f', '#3fae49', '#2b8cff', '#a855d8', '#ff6fa5'];
    return {
      update() {},
      draw() {},
      pointer(type, x, y) {
        if (type === 'down') { drawing = true; lx = x; ly = y; stroke(x, y, x + 0.1, y + 0.1); }
        else if (type === 'move' && drawing) { stroke(lx, ly, x, y); lx = x; ly = y; }
        else if (type === 'up') drawing = false;
      },
      tool(v) {
        if (v === 'clear') { background(); return false; }
        if (v === 'eraser') mode = 'eraser';
        else if (v === 'rainbow') mode = 'rainbow';
        else { mode = 'color'; color = v; }
        return true;
      },
      toolsHTML: '<div class="paint-tools">'
        + colors.map((c, i) => `<button class="ptool${i === 0 ? ' on' : ''}" data-act="mg-tool" data-v="${c}" style="background:${c}" aria-label="Color"></button>`).join('')
        + '<button class="ptool" data-act="mg-tool" data-v="rainbow" aria-label="Arcoíris">🌈</button>'
        + '<button class="ptool" data-act="mg-tool" data-v="eraser" aria-label="Goma">🧽</button>'
        + '<button class="ptool" data-act="mg-tool" data-v="clear" aria-label="Borrar todo">🗑️</button></div>',
    };
  }

  const DEFS = {
    peque: [
      { id: 'burbujas', title: 'Burbujas arcoíris', icon: '🎈', how: '¡Toca las burbujas para explotarlas!', make: bubbles },
      { id: 'pintar', title: 'Pinta el arcoíris', icon: '🎨', how: '¡Dibuja con el dedo y elige colores!', make: paint, noScore: true, seconds: 90 },
    ],
    explorador: [
      { id: 'huevos', title: 'Salva los huevos', icon: '🥚', how: 'Mueve el nido con el dedo para atrapar los huevos. ¡Los dorados valen más!', make: eggs },
      { id: 'salto', title: 'Salto del dino', icon: '🦖', how: 'Toca la pantalla para saltar los obstáculos.', make: runner, needsImg: true },
    ],
  };

  return { W, H, DEFS };
})();

(function(){try{var st=document.createElement('style');st.id='css-regalos';st.textContent=`/* ===== Regalos, armario y minijuegos ===== */
.gems { display: flex; align-items: center; gap: 6px; margin-top: 8px; font-size: 16px; }
.gems i { width: 18px; height: 18px; border-radius: 50%; background: #e4e6ee; display: inline-block; }
.gems i.on { background: var(--accent); }
.gems small { margin-left: 6px; opacity: .7; font-size: 14px; }
.giftbtn { width: 100%; margin-top: 14px; background: var(--accent); animation: pulse 1.4s infinite; }
.giftbtn.mgbtn { background: var(--primary); }
.row2 { display: flex; gap: 10px; margin-top: 18px; }
.row2 .album-btn { margin-top: 0; flex: 1; font-size: 17px; padding: 12px 8px; }
.gift { text-align: center; margin-top: 18px; }
.egg-btn { border: 0; background: none; width: 190px; padding: 0; margin: 10px auto; display: block; }
.egg-svg { width: 100%; height: auto; display: block; }
.egg-svg .crack { display: none; stroke: #8a5a00; stroke-width: 4; fill: none; stroke-linecap: round; stroke-linejoin: round; }
.egg-btn.t1 .c1, .egg-btn.t2 .c1, .egg-btn.t2 .c2 { display: inline; }
.egg-btn.wob { animation: wob .45s; }
@keyframes wob { 0%,100% { transform: rotate(0); } 20% { transform: rotate(-9deg); } 50% { transform: rotate(9deg); } 80% { transform: rotate(-5deg); } }
.reveal .mascot { width: 170px; margin: 0 auto 6px; }
.reveal .accico { font-size: 60px; animation: pop .6s; }
.reveal h1 { font-size: 26px; margin: 6px 0 10px; }
.reveal .btns { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
.wardrobe { text-align: center; }
.wardrobe .mascot { width: 180px; margin: 0 auto 6px; }
.accs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 12px; }
.acc { border: 0; background: #fff; border-radius: 18px; padding: 10px; display: flex; flex-direction: column; align-items: center; gap: 2px; box-shadow: 0 4px 0 rgba(0,0,0,.12); }
.acc span { font-size: 34px; }
.acc b { font-size: 15px; }
.acc small { font-size: 13px; opacity: .75; }
.acc.on { outline: 4px solid var(--good); }
.acc.locked { opacity: .55; background: #eef0f6; }
.mgchoose { display: flex; flex-direction: column; gap: 14px; margin-top: 10px; }
.mgcard { border: 0; border-radius: 24px; background: #fff; padding: 18px; box-shadow: 0 5px 0 rgba(0,0,0,.14); display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
.mgcard .ico { font-size: 54px; }
.mgcard b { font-size: 22px; }
.mgcard small { font-size: 15px; opacity: .75; }
.mgbar { display: flex; justify-content: space-between; font-weight: 800; font-size: 20px; margin: 2px 4px 8px; max-width: 420px; margin-left: auto; margin-right: auto; }
.mgwrap { position: relative; max-width: 420px; margin: 0 auto; }
#mgc { width: 100%; height: auto; display: block; border-radius: 24px; border: 4px solid #fff; box-shadow: 0 5px 0 rgba(0,0,0,.14); touch-action: none; background: #cfefff; }
.mgover { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,.55); border-radius: 24px; padding: 16px; text-align: center; }
.mgover .card { width: 100%; }
.mgover .btns { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
.paint-tools { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 12px; }
.ptool { width: 46px; height: 46px; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 3px 0 rgba(0,0,0,.2); font-size: 22px; background: #fff; padding: 0; }
.ptool.on { outline: 4px solid var(--ink); }
`;document.head.appendChild(st);}catch(e){}})();
/* Misión Aprende - interfaz, progreso y panel para padres */
(function () {
  'use strict';
  const MG = MG_BUNDLE;

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
    limit: 10,
    unlockAll: false,
    extra: { date: '', n: 0 },
    missions: {},
    stickers: [],
    history: [],
    skills: {},
    gems: 0,
    pending: 0,
    mg: 0,
    accs: [],
    worn: [],
    best: {},
  });
  function normalize(s) {
    s = s && typeof s === 'object' ? s : {};
    s.settings = Object.assign({ sound: true, voice: '', rate: 0.92, rewardEvery: 5 }, s.settings || {});
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
    if (!tag || (run && run.test)) return;
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

  /* ---------- Mascotas (dibujadas con SVG, animadas con CSS) ---------- */
  const UNICORN = `<svg viewBox="0 0 200 210" class="mascot-svg" aria-hidden="true">
    <path d="M146 168 C186 158 192 192 168 202 C176 188 160 184 146 186Z" fill="#ff7eb6"/>
    <path d="M150 178 C176 176 182 192 168 199" stroke="#b983ff" stroke-width="6" fill="none" stroke-linecap="round"/>
    <rect x="68" y="176" width="20" height="28" rx="10" fill="#fff" stroke="#7a4fa3" stroke-width="4"/>
    <rect x="112" y="176" width="20" height="28" rx="10" fill="#fff" stroke="#7a4fa3" stroke-width="4"/>
    <ellipse cx="100" cy="158" rx="50" ry="34" fill="#fff" stroke="#7a4fa3" stroke-width="4"/>
    <circle cx="52" cy="76" r="16" fill="#ff7eb6"/><circle cx="46" cy="100" r="14" fill="#b983ff"/><circle cx="54" cy="123" r="12" fill="#6ec6ff"/>
    <circle cx="148" cy="76" r="16" fill="#ff7eb6"/><circle cx="154" cy="100" r="14" fill="#b983ff"/><circle cx="146" cy="123" r="12" fill="#6ec6ff"/>
    <path d="M60 54 L68 22 L92 46Z" fill="#fff" stroke="#7a4fa3" stroke-width="4" stroke-linejoin="round"/>
    <path d="M66 46 L70 32 L80 44Z" fill="#ffb3d1"/>
    <path d="M140 54 L132 22 L108 46Z" fill="#fff" stroke="#7a4fa3" stroke-width="4" stroke-linejoin="round"/>
    <path d="M134 46 L130 32 L120 44Z" fill="#ffb3d1"/>
    <circle cx="100" cy="98" r="48" fill="#fff" stroke="#7a4fa3" stroke-width="4"/>
    <circle cx="80" cy="58" r="12" fill="#ff7eb6"/><circle cx="120" cy="58" r="12" fill="#b983ff"/><circle cx="100" cy="64" r="10" fill="#6ec6ff"/>
    <path d="M100 2 L88 52 L112 52Z" fill="#ffd23f" stroke="#e0a800" stroke-width="3" stroke-linejoin="round"/>
    <path d="M94 26 L106 28 M91 40 L109 42" stroke="#e0a800" stroke-width="3"/>
    <g class="eo"><ellipse cx="80" cy="100" rx="7" ry="9" fill="#3b2a55"/><ellipse cx="120" cy="100" rx="7" ry="9" fill="#3b2a55"/><circle cx="82" cy="96" r="2.6" fill="#fff"/><circle cx="122" cy="96" r="2.6" fill="#fff"/></g>
    <g class="eh"><path d="M71 102 q9 -11 18 0" stroke="#3b2a55" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M111 102 q9 -11 18 0" stroke="#3b2a55" stroke-width="4" fill="none" stroke-linecap="round"/></g>
    <circle cx="66" cy="114" r="8" fill="#ffb3d1" opacity=".75"/><circle cx="134" cy="114" r="8" fill="#ffb3d1" opacity=".75"/>
    <path class="mc" d="M92 120 q8 8 16 0" stroke="#7a4fa3" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path class="mo" d="M90 118 q10 18 20 0Z" fill="#c2455f"/>
  </svg>`;
  const DINO = `<svg viewBox="0 0 200 210" class="mascot-svg" aria-hidden="true">
    <path d="M146 172 C192 178 198 150 186 132 C182 156 164 158 146 154Z" fill="#4fae5b" stroke="#2f7d3a" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="78" cy="196" rx="22" ry="12" fill="#4fae5b" stroke="#2f7d3a" stroke-width="4"/>
    <ellipse cx="122" cy="196" rx="22" ry="12" fill="#4fae5b" stroke="#2f7d3a" stroke-width="4"/>
    <ellipse cx="100" cy="158" rx="52" ry="42" fill="#5dbb63" stroke="#2f7d3a" stroke-width="4"/>
    <ellipse cx="100" cy="168" rx="32" ry="28" fill="#d6f5b8"/>
    <circle cx="70" cy="142" r="7" fill="#4aa456"/><circle cx="132" cy="146" r="8" fill="#4aa456"/><circle cx="118" cy="132" r="5" fill="#4aa456"/>
    <ellipse cx="50" cy="164" rx="9" ry="14" fill="#5dbb63" stroke="#2f7d3a" stroke-width="4" transform="rotate(20 50 164)"/>
    <ellipse cx="150" cy="164" rx="9" ry="14" fill="#5dbb63" stroke="#2f7d3a" stroke-width="4" transform="rotate(-20 150 164)"/>
    <polygon points="68,56 78,28 90,50" fill="#ff9f43" stroke="#d9731a" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="90,48 100,18 110,48" fill="#ff9f43" stroke="#d9731a" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="110,50 122,28 132,56" fill="#ff9f43" stroke="#d9731a" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="100" cy="92" rx="52" ry="44" fill="#5dbb63" stroke="#2f7d3a" stroke-width="4"/>
    <g class="eo"><circle cx="78" cy="84" r="12" fill="#fff" stroke="#2f7d3a" stroke-width="3"/><circle cx="122" cy="84" r="12" fill="#fff" stroke="#2f7d3a" stroke-width="3"/><circle cx="80" cy="86" r="6.5" fill="#26324f"/><circle cx="120" cy="86" r="6.5" fill="#26324f"/><circle cx="82" cy="83" r="2.3" fill="#fff"/><circle cx="122" cy="83" r="2.3" fill="#fff"/></g>
    <g class="eh"><path d="M66 88 q12 -14 24 0" stroke="#26324f" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M110 88 q12 -14 24 0" stroke="#26324f" stroke-width="4.5" fill="none" stroke-linecap="round"/></g>
    <circle cx="92" cy="106" r="2.6" fill="#2f7d3a"/><circle cx="108" cy="106" r="2.6" fill="#2f7d3a"/>
    <circle cx="62" cy="104" r="8" fill="#ff9ec2" opacity=".75"/><circle cx="138" cy="104" r="8" fill="#ff9ec2" opacity=".75"/>
    <path class="mc" d="M84 114 q16 14 32 0" stroke="#2f7d3a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path class="mo" d="M82 112 q18 24 36 0Z" fill="#c2455f"/><polygon class="mo" points="88,113 93,113 90.5,119" fill="#fff"/><polygon class="mo" points="107,113 112,113 109.5,119" fill="#fff"/>
  </svg>`;
  /* Accesorios que se ganan con los regalos */
  const ACCS = [
    { id: 'gafas', name: 'Gafas de sol', icon: '🕶️' },
    { id: 'corona', name: 'Corona', icon: '👑' },
    { id: 'capa', name: 'Capa de superhéroe', icon: '🦸' },
    { id: 'gorro', name: 'Gorro de fiesta', icon: '🎉' },
    { id: 'pajarita', name: 'Pajarita', icon: '🎀' },
    { id: 'bufanda', name: 'Bufanda', icon: '🧣' },
  ];
  const ACC_BACK = {
    capa: '<path d="M64 138 L136 138 L168 200 Q100 214 32 200Z" fill="#e5484d" stroke="#a3262b" stroke-width="3" stroke-linejoin="round"/>',
  };
  const ACC_FRONT = {
    gafas: (pid) => (pid === 'peque'
      ? '<g><rect x="63" y="88" width="32" height="26" rx="10" fill="#26324f"/><rect x="105" y="88" width="32" height="26" rx="10" fill="#26324f"/><path d="M95 99 L105 99" stroke="#26324f" stroke-width="4"/><path d="M69 94 l8 -2 M111 94 l8 -2" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/></g>'
      : '<g><circle cx="78" cy="84" r="17" fill="#26324f"/><circle cx="122" cy="84" r="17" fill="#26324f"/><path d="M95 84 L105 84" stroke="#26324f" stroke-width="4"/><path d="M68 78 l8 -3 M112 78 l8 -3" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/></g>'),
    corona: (pid) => `<g transform="translate(0 ${pid === 'peque' ? 0 : -2})"><path d="M72 64 L72 44 L86 54 L100 38 L114 54 L128 44 L128 64Z" fill="#ffd23f" stroke="#e0a800" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="48" r="3.5" fill="#e5484d"/></g>`,
    gorro: () => '<g><polygon points="116,58 148,50 140,14" fill="#ff6fa5" stroke="#c2417c" stroke-width="3" stroke-linejoin="round"/><circle cx="140" cy="12" r="6" fill="#ffd23f"/><path d="M122 52 l16 -4 M128 40 l10 -3" stroke="#fff" stroke-width="3" opacity=".7"/></g>',
    pajarita: () => '<g><path d="M100 150 L78 138 L78 162Z" fill="#e5484d" stroke="#a3262b" stroke-width="3" stroke-linejoin="round"/><path d="M100 150 L122 138 L122 162Z" fill="#e5484d" stroke="#a3262b" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="150" r="7" fill="#ff8a8a" stroke="#a3262b" stroke-width="3"/></g>',
    bufanda: () => '<g><rect x="64" y="136" width="72" height="16" rx="8" fill="#2b8cff" stroke="#1456a8" stroke-width="3"/><rect x="118" y="146" width="18" height="34" rx="6" fill="#2b8cff" stroke="#1456a8" stroke-width="3"/><path d="M76 138 v12 M92 138 v12 M108 138 v12 M124 148 v28" stroke="#fff" stroke-width="3" opacity=".7"/></g>',
  };
  function mascotSVG(pid, worn) {
    worn = worn || [];
    const base = pid === 'peque' ? UNICORN : DINO;
    const back = worn.map((id) => ACC_BACK[id] || '').join('');
    const front = worn.map((id) => (ACC_FRONT[id] ? ACC_FRONT[id](pid) : '')).join('');
    return base.replace('aria-hidden="true">', 'aria-hidden="true">' + back).replace(/<\/svg>\s*$/, front + '</svg>');
  }
  const mascotHTML = (pid, cls, id, worn) => `<div class="mascot ${cls || 'idle'}"${id ? ` id="${id}"` : ''}>${mascotSVG(pid, worn !== undefined ? worn : P(pid).worn)}</div>`;
  /* Imagen de la mascota para dibujarla en los minijuegos */
  function mascotImage(pid) {
    const svg = mascotSVG(pid, P(pid).worn)
      .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="210" ')
      .replace(/<g class="eh">[\s\S]*?<\/g>/, '')
      .replace(/<path class="mo"[^>]*\/>/g, '')
      .replace(/<polygon class="mo"[^>]*\/>/g, '');
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return img;
  }
  const mascotMini = (pid) => `<div class="mascot-mini">${mascotHTML(pid, 'idle', 'mm')}</div>`;
  function react(mood) {
    const el = document.getElementById('mm');
    if (!el) return;
    el.classList.remove('happy', 'sad');
    void el.offsetWidth;
    el.classList.add(mood);
    setTimeout(() => { if (el) el.classList.remove(mood); }, 900);
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
      return `<button class="profile ${id}" data-act="profile" data-id="${id}"><span class="em">${mascotHTML(id, 'idle')}</span><span><b>${esc(p.name)}</b><span>${pr.world}</span><span>${rk.icon} ${rk.title} · ⭐ ${totalStars(id)}</span></span></button>`;
    }).join('');
    $app.innerHTML = `<div class="home">${header('', '')}<h1>Misión Aprende</h1><p class="sub">¿Quién juega hoy?</p>${cards}<button class="parent-link" data-act="parent">👨‍👩‍👧 Zona de padres</button></div>`;
  }

  /* ---------- Mapa de la isla ---------- */
  const DECO = {
    peque: ['🌈', '🌸', '☁️', '🌷', '⭐', '🦋'],
    explorador: ['🌋', '🌴', '🦴', '🌿', '🪨', '☁️'],
  };
  const DECO_POS = [[3, 2], [86, 3], [2, 38], [88, 46], [3, 76], [86, 88]];

  function gemsHTML(pid) {
    const every = S.settings.rewardEvery;
    if (!every) return '';
    const g = P(pid).gems || 0;
    return `<div class="gems"><span>🎁</span>${Array.from({ length: every }, (_, k) => `<i class="${k < g ? 'on' : ''}"></i>`).join('')}<small>${every - g} para el regalo</small></div>`;
  }
  function giftButtons(pid) {
    const p = P(pid);
    let h = '';
    if (p.pending > 0) h += `<button class="btn giftbtn" data-act="gift">🎁 ¡Tienes ${p.pending > 1 ? p.pending + ' regalos' : 'un regalo'} para abrir!</button>`;
    if (p.mg > 0 && MG.DEFS[pid].length) h += '<button class="btn giftbtn mgbtn" data-act="mg-choose">🎮 ¡Tienes un minijuego!</button>';
    return h;
  }

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
    const stone = (m, i) => {
      const u = isUnlocked(pid, i);
      const rec = p.missions[m.id];
      const done = rec && rec.done > 0;
      const st = rec ? rec.stars : 0;
      const cls = ['stone', u ? '' : 'locked', done ? 'done' : '', i === firstPending ? 'current' : ''].join(' ');
      return `<button class="${cls}" data-act="mission" data-i="${i}" ${u ? '' : 'disabled'}><span class="disc">${u ? m.icon : '🔒'}<span class="num">${i + 1}</span></span><span class="cap">${esc(m.title)}</span><span class="st">${done ? '★'.repeat(st) + '☆'.repeat(3 - st) : ''}</span></button>`;
    };
    let rows = '';
    for (let i = 0, r = 0; i < ms.length; i += 3, r++) {
      let items = ms.slice(i, i + 3).map((m, k) => stone(m, i + k));
      while (items.length < 3) items.push('<span class="stone ghost"></span>');
      rows += `<div class="maprow ${r % 2 ? 'rev' : ''}">${items.join('')}</div>`;
    }
    const deco = DECO[pid].map((e, k) => `<span class="deco" style="left:${DECO_POS[k][0]}%;top:${DECO_POS[k][1]}%">${e}</span>`).join('');
    $app.innerHTML = `${header(esc(pr.world), 'back-home')}
      <div class="card"><div class="hero"><div class="avatar">${mascotHTML(pid, 'idle')}</div><div class="grow"><b>${esc(p.name)}</b><br>${rk.icon} ${rk.title}</div><div class="stars">⭐ ${totalStars(pid)}</div></div>
      <div class="today">Hoy: ${dots || '∞'} ${allowed === Infinity ? '' : `<span>${Math.min(playedToday(pid), allowed)}/${allowed}</span>`}</div>${gemsHTML(pid)}</div>${giftButtons(pid)}
      <div class="islandmap" id="island"><svg class="path" id="islpath" aria-hidden="true"></svg>${deco}${rows}<div class="map-mascot" id="mapmascot">${mascotHTML(pid, 'idle')}</div></div>
      <div class="row2"><button class="btn album-btn" data-act="album">${pid === 'peque' ? '📒 Pegatinas' : '🦴 Colección'}</button><button class="btn album-btn" data-act="wardrobe">👕 Mi armario</button></div>`;
    requestAnimationFrame(drawMap);
  }

  function drawMap() {
    const map = document.getElementById('island');
    if (!map) return;
    const mr = map.getBoundingClientRect();
    const discs = Array.from(map.querySelectorAll('.disc'));
    if (!discs.length || !mr.width) return;
    const pts = discs.map((d) => {
      const r = d.getBoundingClientRect();
      return [r.left - mr.left + r.width / 2, r.top - mr.top + r.height / 2];
    });
    let d = '';
    pts.forEach((p, i) => {
      if (i === 0) { d += `M${p[0].toFixed(1)} ${p[1].toFixed(1)}`; return; }
      const q = pts[i - 1];
      const my = (q[1] + p[1]) / 2;
      d += ` C${q[0].toFixed(1)} ${my.toFixed(1)} ${p[0].toFixed(1)} ${my.toFixed(1)} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    });
    const svg = document.getElementById('islpath');
    svg.setAttribute('viewBox', `0 0 ${mr.width.toFixed(1)} ${mr.height.toFixed(1)}`);
    svg.innerHTML = `<path d="${d}" fill="none" stroke="rgba(255,255,255,.95)" stroke-width="9" stroke-linecap="round" stroke-dasharray="1 17"/>`;
    const curDisc = map.querySelector('.stone.current .disc') || discs[discs.length - 1];
    const cr = curDisc.getBoundingClientRect();
    const mm = document.getElementById('mapmascot');
    if (mm) {
      mm.style.left = (cr.left - mr.left + cr.width / 2 - 34) + 'px';
      mm.style.top = (cr.top - mr.top - 76) + 'px';
    }
  }
  window.addEventListener('resize', drawMap);

  function renderAlbum(pid) {
    const p = P(pid);
    const all = missionsOf(pid).map((m) => m.sticker);
    const items = all.map((s) => (p.stickers.includes(s) ? `<div>${s}</div>` : '<div class="locked">?</div>')).join('');
    $app.innerHTML = `${header(pid === 'peque' ? 'Mis pegatinas' : 'Mi colección', 'back-map')}<div class="card"><p>Has conseguido <b>${all.filter((s) => p.stickers.includes(s)).length}</b> de ${all.length}. ¡Completa misiones para ganar más!</p></div><div class="album">${items}</div>`;
  }

  function renderDoneToday(pid) {
    stopSpeech();
    const msg = '¡Misión cumplida por hoy! Mañana te esperan más aventuras.';
    $app.innerHTML = `${header('', 'back-map')}<div class="card result">${mascotHTML(pid, 'idle happy', null)}<h1>¡Misión cumplida por hoy!</h1><p class="msg">Has hecho ${playedToday(pid)} misiones. Ahora toca descansar o jugar fuera. ¡Mañana hay más aventuras!</p><div class="btns"><button class="btn" data-act="back-home">Volver al inicio</button></div></div>`;
    rain(['⭐', '🌟', '✨']);
    setTimeout(() => speak(msg), 300);
  }

  /* ---------- Jugar ---------- */
  function playHeader() {
    return header(`${run.m.icon} ${esc(run.m.title)}${run.test ? ' 🧪' : ''}`, run.test ? 'to-parent' : 'back-map');
  }

  function startMission(pid, i, test) {
    const ms = missionsOf(pid);
    if (i >= ms.length) { if (test) renderParent(); else renderMap(pid); return; }
    if (!test && remaining(pid) <= 0) { renderDoneToday(pid); return; }
    const m = ms[i];
    fx.tap();
    run = { pid, i, m, test: !!test, q: 0, errs: 0, units: 0, step: 0, question: null, stepWrong: false, qErr: 0, locked: false, counted: 0, mem: null, rankBefore: rank(pid).title };
    setTheme(pid);
    if (m.kind === 'memory') startMemory(); else nextQuestion();
  }

  function nextQuestion() {
    if (run.q >= run.m.rounds) { finish(); return; }
    run.question = run.m.gen();
    run.step = 0;
    if (run.question.type) renderInteractive(); else renderStep();
  }

  const progressDots = () => Array.from({ length: run.m.rounds }, (_, k) => `<i class="${k < run.q ? 'on' : k === run.q ? 'cur' : ''}"></i>`).join('');

  function renderStep() {
    const { m, question: qu, step } = run;
    const st = qu.steps[step];
    run.stepWrong = false;
    run.qErr = 0;
    run.locked = false;
    run.counted = 0;
    let html = playHeader() + `<div class="progress">${progressDots()}</div>`;
    if (qu.story) {
      html += `<div class="card story"><div class="storyvis">${qu.story.visual || ''}</div><p>${fmtNums(qu.story.text)}</p><button class="speakbtn" data-act="speak" data-t="story" aria-label="Escuchar">🔊</button></div>`;
    }
    if (st.visual) html += `<div class="stvis">${st.visual}</div>`;
    html += `<div class="promptrow"><h2 class="prompt">${st.prompt}</h2><button class="speakbtn" data-act="speak" data-t="step" aria-label="Escuchar">🔊</button></div>`;
    html += `<div class="options ${st.layout}">${st.options.map((o, k) => `<button class="opt" data-act="opt" data-i="${k}">${o.html}</button>`).join('')}</div><div class="hintbox" id="hint"></div>${mascotMini(run.pid)}`;
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
      react('happy');
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
      react('sad');
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

  /* ---------- Juegos interactivos: arrastrar y unir ---------- */
  function dragify(tokens, cb) {
    tokens.forEach((el) => {
      el.addEventListener('pointerdown', (e) => {
        if (el.dataset.locked || (run && run.locked)) return;
        e.preventDefault();
        try { el.setPointerCapture(e.pointerId); } catch (err) { /* nada */ }
        const sx = e.clientX;
        const sy = e.clientY;
        el.classList.add('dragging');
        el.style.transition = 'none';
        const move = (ev) => { el.style.transform = `translate(${ev.clientX - sx}px, ${ev.clientY - sy}px) scale(1.12)`; };
        const up = (ev) => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerup', up);
          el.removeEventListener('pointercancel', up);
          el.classList.remove('dragging');
          el.style.pointerEvents = 'none';
          const under = document.elementFromPoint(ev.clientX, ev.clientY);
          el.style.pointerEvents = '';
          const zone = under && under.closest ? under.closest('[data-zone]') : null;
          const ok = ev.type === 'pointerup' ? cb(el, zone) : false;
          if (!ok) {
            el.style.transition = 'transform .25s';
            el.style.transform = '';
          }
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
      });
    });
  }
  function settle(el, zoneEl) {
    el.dataset.locked = '1';
    el.style.transition = '';
    el.style.transform = '';
    zoneEl.appendChild(el);
  }

  function interactiveError(msg) {
    run.errs++;
    run.qErr++;
    fx.bad();
    react('sad');
    speak(msg || '¡Casi! Inténtalo otra vez.');
    save();
  }
  function completeInteractive() {
    if (run.locked) return;
    run.locked = true;
    noteSkill(run.pid, run.question.tag, run.qErr === 0);
    run.units++;
    fx.ok();
    react('happy');
    speak(pick(PRAISE));
    save();
    setTimeout(() => { run.q++; nextQuestion(); }, 1200);
  }

  function renderInteractive() {
    const q = run.question;
    const m = run.m;
    run.qErr = 0;
    run.locked = false;
    let area = '';
    if (q.type === 'drag-count') {
      area = `<div class="basket" id="basket" data-zone="basket"><span class="big" id="bcount">0</span><div class="bitems" id="bitems"></div><div class="blabel">🧺</div></div>
        <div class="pile" id="pile">${Array.from({ length: q.total }, () => `<div class="token">${q.e}</div>`).join('')}</div>`;
    } else if (q.type === 'drag-sort') {
      area = `<div class="sortzones">${q.zones.map((z) => `<div class="sortzone" data-zone="${z.key}"><h3>${z.e} ${z.label}</h3><div class="zitems"></div></div>`).join('')}</div>
        <div class="pile" id="pile">${q.items.map((it) => `<div class="token" data-key="${it.zone}">${it.e}</div>`).join('')}</div>`;
    } else if (q.type === 'drag-shape') {
      area = `<div class="holes">${q.holes.map((h) => `<div class="hole" data-zone="${h.id}"><span class="sil">${h.sil}</span></div>`).join('')}</div>
        <div class="pile" id="pile">${q.tokens.map((h) => `<div class="token shapetok" data-key="${h.id}">${h.tok}</div>`).join('')}</div>`;
    } else if (q.type === 'drag-order') {
      area = `<div class="slots">${q.sorted.map((_, i) => `<div class="slot" data-zone="${i}"></div>`).join('')}</div>
        <p class="slotsnote">${q.desc ? 'el más grande ➜ el más pequeño' : 'el más pequeño ➜ el más grande'}</p>
        <div class="pile" id="pile">${q.nums.map((n) => `<div class="token numtok" data-key="${n}">${n}</div>`).join('')}</div>`;
    } else if (q.type === 'connect') {
      area = `<div class="connect" id="conn"><svg class="lines" id="clines" aria-hidden="true"></svg>
        <div class="col">${q.left.map((l) => `<div class="cnode left" data-id="${l.id}">${l.html}</div>`).join('')}</div>
        <div class="col">${q.right.map((r) => `<div class="cnode right" data-id="${r.id}">${r.html}</div>`).join('')}</div></div>
        <p class="tiny">Arrastra el dedo desde un punto hasta su pareja</p>`;
    }
    $app.innerHTML = playHeader() + `<div class="progress">${progressDots()}</div>
      <div class="promptrow"><h2 class="prompt">${q.prompt}</h2><button class="speakbtn" data-act="speak" data-t="step" aria-label="Escuchar">🔊</button></div>
      <div class="play-area">${area}</div>${mascotMini(run.pid)}`;
    window.scrollTo(0, 0);
    wireInteractive(q);
    setTimeout(() => speak(q.speak || q.prompt), 250);
  }

  function wireInteractive(q) {
    const tokens = Array.from($app.querySelectorAll('.pile .token'));
    if (q.type === 'drag-count') {
      const items = document.getElementById('bitems');
      const cnt = document.getElementById('bcount');
      let n = 0;
      dragify(tokens, (el, zone) => {
        if (!zone || zone.dataset.zone !== 'basket' || n >= q.n) return false;
        n++;
        settle(el, items);
        cnt.textContent = n;
        speak(String(n));
        fx.tap();
        if (n === q.n) completeInteractive();
        return true;
      });
    } else if (q.type === 'drag-sort') {
      let left = q.items.length;
      dragify(tokens, (el, zone) => {
        if (!zone) return false;
        if (zone.dataset.zone === el.dataset.key) {
          settle(el, zone.querySelector('.zitems'));
          fx.tap();
          left--;
          if (left === 0) completeInteractive();
          return true;
        }
        interactiveError('Ese no va ahí. ¡Prueba en el otro grupo!');
        return false;
      });
    } else if (q.type === 'drag-shape') {
      let left = q.holes.length;
      dragify(tokens, (el, zone) => {
        if (!zone) return false;
        if (zone.dataset.zone === el.dataset.key && !zone.classList.contains('filled')) {
          const sil = zone.querySelector('.sil');
          if (sil) sil.style.display = 'none';
          zone.classList.add('filled');
          settle(el, zone);
          fx.tap();
          left--;
          if (left === 0) completeInteractive();
          return true;
        }
        interactiveError('Esa forma no encaja ahí. ¡Prueba en otro hueco!');
        return false;
      });
    } else if (q.type === 'drag-order') {
      let filled = 0;
      dragify(tokens, (el, zone) => {
        if (!zone || !zone.classList.contains('slot') || zone.classList.contains('filled')) return false;
        const idx = parseInt(zone.dataset.zone, 10);
        if (parseInt(el.dataset.key, 10) === q.sorted[idx]) {
          zone.classList.add('filled');
          settle(el, zone);
          fx.tap();
          filled++;
          if (filled === q.sorted.length) completeInteractive();
          return true;
        }
        interactiveError(q.desc ? 'Ese no va ahí. Busca un número más grande.' : 'Ese no va ahí. Busca un número más pequeño.');
        if (run.qErr >= 2) {
          const firstEmpty = $app.querySelector('.slot:not(.filled)');
          const want = q.sorted[parseInt(firstEmpty.dataset.zone, 10)];
          const tk = tokens.find((t) => parseInt(t.dataset.key, 10) === want && !t.dataset.locked);
          if (tk) tk.classList.add('pulse');
        }
        return false;
      });
    } else if (q.type === 'connect') {
      wireConnect(q);
    }
  }

  function wireConnect(q) {
    const conn = document.getElementById('conn');
    const svg = document.getElementById('clines');
    const colors = ['#e5484d', '#2b8cff', '#3fae49', '#f5a623', '#9b51e0'];
    let matched = 0;
    const NS = 'http://www.w3.org/2000/svg';
    const pointOf = (el, side) => {
      const r = el.getBoundingClientRect();
      const c = conn.getBoundingClientRect();
      return [(side === 'r' ? r.right : r.left) - c.left, r.top - c.top + r.height / 2];
    };
    conn.querySelectorAll('.cnode.left').forEach((node) => {
      node.addEventListener('pointerdown', (e) => {
        if (node.classList.contains('matched') || run.locked) return;
        e.preventDefault();
        try { node.setPointerCapture(e.pointerId); } catch (err) { /* nada */ }
        const [x1, y1] = pointOf(node, 'r');
        const line = document.createElementNS(NS, 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x1);
        line.setAttribute('y2', y1);
        line.setAttribute('stroke', '#26324f');
        line.setAttribute('stroke-width', '8');
        line.setAttribute('stroke-linecap', 'round');
        svg.appendChild(line);
        const move = (ev) => {
          const c = conn.getBoundingClientRect();
          line.setAttribute('x2', ev.clientX - c.left);
          line.setAttribute('y2', ev.clientY - c.top);
        };
        const up = (ev) => {
          node.removeEventListener('pointermove', move);
          node.removeEventListener('pointerup', up);
          node.removeEventListener('pointercancel', up);
          const under = ev.type === 'pointerup' ? document.elementFromPoint(ev.clientX, ev.clientY) : null;
          const target = under && under.closest ? under.closest('.cnode.right') : null;
          if (target && !target.classList.contains('matched')) {
            if (target.dataset.id === node.dataset.id) {
              const [x2, y2] = pointOf(target, 'l');
              line.setAttribute('x2', x2);
              line.setAttribute('y2', y2);
              line.setAttribute('stroke', colors[matched % colors.length]);
              node.classList.add('matched');
              target.classList.add('matched');
              matched++;
              fx.ok();
              burst(target);
              if (matched === q.left.length) completeInteractive();
              return;
            }
            interactiveError('Esa no es su pareja. ¡Inténtalo otra vez!');
          }
          line.remove();
        };
        node.addEventListener('pointermove', move);
        node.addEventListener('pointerup', up);
        node.addEventListener('pointercancel', up);
      });
    });
  }

  /* ---------- Memoria ---------- */
  function startMemory() {
    const pairs = run.m.pairs;
    const an = Games.sample(Games.ANIMALS, pairs);
    const cards = Games.shuffle(an.concat(an)).map((a, id) => ({ id, e: a.e, pl: a.pl, flipped: false, matched: false }));
    run.mem = { cards, open: [], matched: 0, lock: false, pairs };
    run.units = pairs;
    const grid = cards.map((c, i) => `<button class="mcard" data-act="card" data-i="${i}" aria-label="Carta"><span class="inner"><span class="face front">❓</span><span class="face back">${c.e}</span></span></button>`).join('');
    $app.innerHTML = `${playHeader()}<div class="promptrow"><h2 class="prompt">Encuentra las parejas</h2><button class="speakbtn" data-act="speak" data-t="mem">🔊</button></div><div class="mgrid ${cards.length > 6 ? 'c4' : ''}">${grid}</div>${mascotMini(run.pid)}`;
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
          react('happy');
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
  function finishTest() {
    const { pid, i } = run;
    const hasNext = i + 1 < missionsOf(pid).length;
    $app.innerHTML = `${header('', null)}<div class="card result">${mascotHTML(pid, 'idle happy')}<h1>🧪 Misión probada</h1><p class="msg">Modo prueba: no se ha guardado ningún progreso, estrella ni registro.</p><div class="btns">${hasNext ? '<button class="btn" data-act="next">Probar la siguiente ▶</button>' : ''}<button class="btn alt" data-act="again">🔁 Repetir esta misión</button><button class="btn alt" data-act="to-parent">⬅️ Volver a la zona de padres</button></div></div>`;
    window.scrollTo(0, 0);
    setTheme(pid);
    fx.win();
    rain(['⭐', '✨']);
  }

  function finish() {
    if (run.test) { finishTest(); return; }
    const { pid, m, i } = run;
    const p = P(pid);
    const ratio = run.errs / Math.max(1, run.units);
    const stars = m.kind === 'memory'
      ? (run.errs <= run.units ? 3 : run.errs <= run.units * 2 ? 2 : 1)
      : (ratio <= 0.15 ? 3 : ratio <= 0.5 ? 2 : 1);
    const rec = p.missions[m.id] || { stars: 0, done: 0 };
    rec.done++;
    rec.stars = Math.max(rec.stars, stars);
    p.missions[m.id] = rec;
    const every = S.settings.rewardEvery;
    let gotGift = false;
    if (every) {
      p.gems = (p.gems || 0) + 1;
      if (p.gems >= every) { p.gems = 0; p.pending = (p.pending || 0) + 1; gotGift = true; }
    }
    let newSticker = null;
    if (m.sticker && !p.stickers.includes(m.sticker)) { p.stickers.push(m.sticker); newSticker = m.sticker; }
    p.history.push({ d: todayKey(), m: m.id, s: stars, e: run.errs, t: Date.now() });
    if (p.history.length > 300) p.history = p.history.slice(-300);
    save();
    const rankNow = rank(pid);
    const levelUp = rankNow.title !== run.rankBefore;
    const hasNext = i + 1 < missionsOf(pid).length && isUnlocked(pid, i + 1);
    const left = remaining(pid);
    let btns = p.pending > 0 ? '<button class="btn giftbtn" data-act="gift">🎁 ¡Abrir el regalo!</button>' : '';
    if (left > 0) {
      if (hasNext) btns += '<button class="btn" data-act="next">Siguiente misión ▶</button>';
      btns += '<button class="btn alt" data-act="again">🔁 Repetir esta misión</button>';
      btns += '<button class="btn alt" data-act="back-map">🗺️ Volver al mapa</button>';
    } else {
      btns += '<button class="btn" data-act="back-map">🌙 ¡Hasta mañana!</button>';
    }
    const msg = left > 0 ? '¡Buen trabajo! ¿Seguimos?' : '¡Misión cumplida por hoy! Mañana te esperan más aventuras.';
    const giftLine = every ? (gotGift ? '<p class="msg">🎁 ¡Has ganado un regalo!</p>' : `<p class="tiny">🎁 Te faltan ${every - p.gems} misiones para el regalo</p>`) : '';
    const what = pid === 'peque' ? 'pegatina' : 'tesoro';
    $app.innerHTML = `${header('', null)}<div class="card result">${mascotHTML(pid, 'idle happy')}<h1>¡Misión completada!</h1><div class="bigstars">${'⭐'.repeat(stars)}${'<span style="opacity:.25">⭐</span>'.repeat(3 - stars)}</div>${newSticker ? `<p>Nuevo ${what}:</p><div class="sticker-new">${newSticker}</div>` : ''}${levelUp ? `<div class="level-up">${rankNow.icon} ¡Subes de nivel: ${rankNow.title}!</div>` : ''}<p class="msg">${msg}</p>${giftLine}<div class="btns">${btns}</div></div>`;
    window.scrollTo(0, 0);
    setTheme(pid);
    fx.win();
    rain(['⭐', '🎉', '✨', newSticker || '🌟']);
    setTimeout(() => speak(gotGift ? '¡Has ganado un regalo! Ábrelo.' : msg), 500);
  }

  /* ---------- Regalos y armario ---------- */
  let gift = null;
  const EGG_SVG = '<svg viewBox="0 0 120 150" class="egg-svg" aria-hidden="true"><ellipse cx="60" cy="84" rx="46" ry="60" fill="#fff6d6" stroke="#e0a800" stroke-width="4"/><circle cx="40" cy="62" r="8" fill="#ff9ec2"/><circle cx="80" cy="102" r="10" fill="#8fd3ff"/><circle cx="74" cy="54" r="6" fill="#b5e48c"/><circle cx="44" cy="110" r="6" fill="#ffd23f"/><path class="crack c1" d="M26 78 L44 70 L52 86 L68 74"/><path class="crack c2" d="M92 92 L78 100 L84 116 L66 122"/><path class="crack c3" d="M52 40 L60 56 L72 44"/></svg>';

  function renderGift(pid, test) {
    const p = P(pid);
    if (!test && !(p.pending > 0)) { renderMap(pid); return; }
    cur.pid = pid;
    setTheme(pid);
    gift = { pid, test: !!test, taps: 0, opened: false };
    $app.innerHTML = `${header('🎁 ¡Regalo!', test ? 'to-parent' : 'back-map')}<div class="card gift"><p class="msg">¡Toca el huevo para abrirlo!</p><button class="egg-btn" id="egg" data-act="egg" aria-label="Huevo sorpresa">${EGG_SVG}</button><p class="tiny">Toca 3 veces</p></div>`;
    setTimeout(() => speak('¡Toca el huevo para abrirlo!'), 250);
  }

  function tapEgg(btn) {
    if (!gift || gift.opened) return;
    gift.taps++;
    fx.tap();
    btn.classList.remove('wob');
    void btn.offsetWidth;
    btn.classList.add('wob');
    if (gift.taps === 1) btn.classList.add('t1');
    if (gift.taps === 2) btn.classList.add('t2');
    if (gift.taps >= 3) { gift.opened = true; setTimeout(openGift, 450); }
  }

  function openGift() {
    const { pid, test } = gift;
    const p = P(pid);
    const pool = test ? ACCS : ACCS.filter((a) => !p.accs.includes(a.id));
    const acc = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    if (!test) {
      p.pending = Math.max(0, (p.pending || 0) - 1);
      p.mg = (p.mg || 0) + 1;
      if (acc) { p.accs.push(acc.id); p.worn.push(acc.id); }
      save();
    }
    const wornShow = test ? (acc ? [acc.id] : []) : p.worn;
    const title = acc ? `¡Nuevo: ${acc.name}!` : '¡Superpremio! Ya tienes todo el armario';
    let btns = '';
    if (test) {
      btns = '<button class="btn" data-act="to-parent">⬅️ Volver a la zona de padres</button>';
    } else {
      btns = '<button class="btn" data-act="mg-choose">🎮 Jugar un minijuego</button>'
        + (p.pending > 0 ? '<button class="btn alt" data-act="gift">🎁 Abrir otro regalo</button>' : '')
        + '<button class="btn alt" data-act="wardrobe">👕 Mi armario</button><button class="btn alt" data-act="back-map">🗺️ Volver al mapa</button>';
    }
    $app.innerHTML = `${header('🎁 ¡Regalo!', test ? 'to-parent' : 'back-map')}<div class="card gift reveal">${mascotHTML(pid, 'idle happy', null, wornShow)}${acc ? `<div class="accico">${acc.icon}</div>` : ''}<h1>${title}</h1>${test ? '<p class="tiny">Modo prueba: no se guarda</p>' : ''}<div class="btns">${btns}</div></div>`;
    window.scrollTo(0, 0);
    fx.win();
    rain(['⭐', '🎉', '✨', acc ? acc.icon : '🌟']);
    setTimeout(() => speak(acc ? '¡Mira! ¡Has ganado ' + acc.name + '!' : '¡Superpremio!'), 400);
  }

  function renderWardrobe(pid) {
    const p = P(pid);
    const items = ACCS.map((a) => {
      if (!p.accs.includes(a.id)) return '<div class="acc locked"><span>🔒</span><b>???</b><small>Se gana con regalos</small></div>';
      const on = p.worn.includes(a.id);
      return `<button class="acc ${on ? 'on' : ''}" data-act="wear" data-a="${a.id}"><span>${a.icon}</span><b>${a.name}</b><small>${on ? '✅ Puesto' : 'Ponérmelo'}</small></button>`;
    }).join('');
    $app.innerHTML = `${header('Mi armario', 'back-map')}<div class="card wardrobe">${mascotHTML(pid, 'idle')}<p class="tiny">Has conseguido ${p.accs.length} de ${ACCS.length}. ¡Ábrelos con los regalos!</p><div class="accs">${items}</div></div>`;
  }

  /* ---------- Minijuegos ---------- */
  let mg = null;
  const MG_OVERRIDE = (function () {
    try { const v = parseInt(new URLSearchParams(window.location.search).get('mgtime'), 10); return v > 0 ? v : 0; } catch (e) { return 0; }
  })();

  function renderMgChoose(pid) {
    cur.pid = pid;
    setTheme(pid);
    const defs = MG.DEFS[pid];
    $app.innerHTML = `${header('🎮 Elige un minijuego', 'back-map')}<div class="mgchoose">${defs.map((d) => `<button class="mgcard" data-act="mg-pick" data-id="${d.id}"><span class="ico">${d.icon}</span><b>${esc(d.title)}</b><small>${esc(d.how)}</small></button>`).join('')}</div><p class="tiny">Dura 1 minuto</p>`;
    setTimeout(() => speak('Elige un minijuego'), 250);
  }

  function startMinigame(pid, id, opts) {
    const def = MG.DEFS[pid].find((d) => d.id === id);
    if (!def) return;
    cur.pid = pid;
    setTheme(pid);
    const total = MG_OVERRIDE || def.seconds || 60;
    mg = { pid, def, test: !!opts.test, reward: !!opts.reward, score: 0, total, left: total, running: false, game: null };
    $app.innerHTML = `${header(`${def.icon} ${esc(def.title)}${mg.test ? ' 🧪' : ''}`, 'mg-exit')}<div class="mgbar"><span id="mgtime">⏱ ${total}</span><span id="mgscore">${def.noScore ? '🎨' : '⭐ 0'}</span></div><div class="mgwrap"><canvas id="mgc" width="${MG.W}" height="${MG.H}"></canvas><div class="mgover" id="mgover"><div class="card"><h2>${def.icon} ${esc(def.title)}</h2><p>${esc(def.how)}</p><div class="btns"><button class="btn" data-act="mg-go">▶ ¡Jugar!</button></div></div></div></div><div id="mgtools"></div>`;
    window.scrollTo(0, 0);
    setTimeout(() => speak(def.how), 250);
  }

  function beginMinigame() {
    const me = mg;
    const canvas = document.getElementById('mgc');
    if (!me || !canvas || me.running) return;
    const ctx = canvas.getContext('2d');
    const env = {
      ctx,
      pid: me.pid,
      addScore(n) {
        me.score += n;
        const el = document.getElementById('mgscore');
        if (el && !me.def.noScore) el.textContent = '⭐ ' + me.score;
      },
      sfx(n) { (fx[n] || fx.tap)(); },
      img: me.def.needsImg ? mascotImage(me.pid) : null,
    };
    me.game = me.def.make(env);
    document.getElementById('mgover').style.display = 'none';
    if (me.game.toolsHTML) document.getElementById('mgtools').innerHTML = me.game.toolsHTML;
    const pt = (e) => {
      const r = canvas.getBoundingClientRect();
      const sx = r.width ? MG.W / r.width : 1;
      const sy = r.height ? MG.H / r.height : 1;
      return [(e.clientX - r.left) * sx, (e.clientY - r.top) * sy];
    };
    canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* nada */ }
      const [x, y] = pt(e);
      if (me.running) me.game.pointer('down', x, y);
    });
    canvas.addEventListener('pointermove', (e) => { const [x, y] = pt(e); if (me.running) me.game.pointer('move', x, y); });
    const up = (e) => { const [x, y] = pt(e); if (me.running) me.game.pointer('up', x, y); };
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    me.running = true;
    let last = 0;
    const loop = (ts) => {
      if (mg !== me || !me.running || !document.body.contains(canvas)) return;
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      me.left -= dt;
      me.game.update(dt);
      me.game.draw();
      const tm = document.getElementById('mgtime');
      if (tm) tm.textContent = '⏱ ' + Math.max(0, Math.ceil(me.left));
      if (me.left <= 0) { endMinigame(); return; }
      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
  }

  function endMinigame() {
    const me = mg;
    if (!me || !me.running) return;
    me.running = false;
    const p = P(me.pid);
    let record = false;
    if (!me.test) {
      p.best = p.best || {};
      if (!me.def.noScore && me.score > (p.best[me.def.id] || 0)) { p.best[me.def.id] = me.score; record = true; }
      if (me.reward && p.mg > 0) p.mg--;
      save();
    }
    const over = document.getElementById('mgover');
    if (!over) return;
    const msg = me.def.noScore ? '¡Qué dibujo tan bonito!' : `Has conseguido <b>${me.score}</b> ⭐`;
    let btns;
    if (me.test) btns = '<button class="btn" data-act="mg-again">🔁 Jugar otra vez</button><button class="btn alt" data-act="mg-exit">⬅️ Volver a la zona de padres</button>';
    else btns = (p.mg > 0 ? '<button class="btn" data-act="mg-choose">🎮 Otro minijuego</button>' : '') + '<button class="btn alt" data-act="mg-exit">🗺️ Volver al mapa</button>';
    over.style.display = 'flex';
    over.innerHTML = `<div class="card"><h2>⏰ ¡Tiempo!</h2><p class="msg">${msg}${record ? '<br>🏆 ¡Nuevo récord!' : ''}</p><div class="btns">${btns}</div></div>`;
    fx.win();
    rain(['⭐', '✨', '🎉']);
    setTimeout(() => speak(me.def.noScore ? '¡Qué dibujo tan bonito!' : `¡Tiempo! Has conseguido ${me.score}`), 300);
  }

  function exitMinigame() {
    if (mg) mg.running = false;
    stopSpeech();
    if (mg && mg.test) renderParent(); else renderMap(cur.pid);
  }

  /* ---------- Zona de padres ---------- */
  function renderGate() {
    stopSpeech();
    setTheme('home');
    const a = Games.rnd(3, 9);
    const b = Games.rnd(3, 9);
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
        <label>🧪 Probar cualquier misión (no se guarda nada)</label>
        <select id="test-${id}">${missionsOf(id).map((m, k) => `<option value="${k}">${k + 1}. ${esc(m.title)}</option>`).join('')}</select>
        <div class="row"><button class="btn small" data-act="p-test" data-id="${id}">▶ Probar esta misión</button></div>
        <label>🎮 Probar un minijuego o un regalo</label>
        <select id="testmg-${id}">${MG.DEFS[id].map((d) => `<option value="${d.id}">${d.icon} ${esc(d.title)}</option>`).join('')}</select>
        <div class="row"><button class="btn small" data-act="p-minigame" data-id="${id}">▶ Jugar minijuego</button><button class="btn small alt" data-act="p-gift-test" data-id="${id}">🎁 Probar un regalo</button></div>
        <label>Misiones por día</label>
        <select data-act="p-limit" data-id="${id}">${[[3, '3'], [5, '5'], [8, '8'], [10, '10'], [15, '15'], [20, '20'], [0, 'Sin límite']].map(([v, l]) => `<option value="${v}" ${lim === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
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
        <label>🎁 Regalo cada cuántas misiones</label><select data-act="p-reward">${[[3, '3'], [5, '5'], [8, '8'], [0, 'Sin regalos']].map(([v, l]) => `<option value="${v}" ${S.settings.rewardEvery === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
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
        else if (run && run.question && run.question.type) speak(run.question.speak || run.question.prompt);
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
      case 'next': startMission(cur.pid, run.i + 1, run.test); break;
      case 'again': startMission(cur.pid, run.i, run.test); break;
      case 'to-parent': stopSpeech(); renderParent(); break;
      case 'p-test': {
        const sel = document.getElementById('test-' + id);
        cur.pid = id;
        startMission(id, parseInt(sel.value, 10), true);
        break;
      }
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
      case 'gift': renderGift(cur.pid, false); break;
      case 'egg': tapEgg(t); break;
      case 'wardrobe': renderWardrobe(cur.pid); break;
      case 'wear': {
        const pp = P(cur.pid);
        const a = t.dataset.a;
        pp.worn = pp.worn.includes(a) ? pp.worn.filter((x) => x !== a) : pp.worn.concat(a);
        save(); renderWardrobe(cur.pid); break;
      }
      case 'mg-choose': if (P(cur.pid).mg > 0) renderMgChoose(cur.pid); else renderMap(cur.pid); break;
      case 'mg-pick': startMinigame(cur.pid, t.dataset.id, { reward: true }); break;
      case 'mg-go': beginMinigame(); break;
      case 'mg-exit': exitMinigame(); break;
      case 'mg-again': startMinigame(mg.pid, mg.def.id, { test: true }); break;
      case 'mg-tool': {
        if (mg && mg.game && mg.game.tool) {
          const keep = mg.game.tool(t.dataset.v);
          if (keep) { document.querySelectorAll('.ptool').forEach((b) => b.classList.remove('on')); t.classList.add('on'); }
        }
        break;
      }
      case 'p-minigame': {
        const sel = document.getElementById('testmg-' + id);
        cur.pid = id;
        startMinigame(id, sel.value, { test: true });
        break;
      }
      case 'p-gift-test': cur.pid = id; renderGift(id, true); break;
      default: break;
    }
  });

  $app.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.act === 'p-limit') { P(t.dataset.id).limit = parseInt(t.value, 10); save(); renderParent(); }
    if (t.dataset.act === 'p-reward') { S.settings.rewardEvery = parseInt(t.value, 10); save(); renderParent(); }
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
