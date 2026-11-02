/* Misión Aprende - minijuegos de 1 minuto (se desbloquean con los regalos) */
const MiniGames = (function () {
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

if (typeof module !== 'undefined') module.exports = MiniGames;
