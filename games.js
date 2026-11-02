/* Misión Aprende - misiones y generadores de preguntas */
const Games = (function () {
  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = (arr) => arr[rnd(0, arr.length - 1)];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = rnd(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const sample = (arr, n) => shuffle(arr).slice(0, n);

  /* ---------- Datos ---------- */
  const ANIMALS = [
    { e: '🐮', sg: 'vaca', pl: 'vacas', g: 'f' },
    { e: '🐷', sg: 'cerdito', pl: 'cerditos', g: 'm' },
    { e: '🐔', sg: 'gallina', pl: 'gallinas', g: 'f' },
    { e: '🐑', sg: 'oveja', pl: 'ovejas', g: 'f' },
    { e: '🐴', sg: 'caballo', pl: 'caballos', g: 'm' },
    { e: '🐶', sg: 'perrito', pl: 'perritos', g: 'm' },
    { e: '🐱', sg: 'gatito', pl: 'gatitos', g: 'm' },
    { e: '🐰', sg: 'conejito', pl: 'conejitos', g: 'm' },
    { e: '🦆', sg: 'patito', pl: 'patitos', g: 'm' },
    { e: '🐸', sg: 'rana', pl: 'ranas', g: 'f' },
    { e: '🐘', sg: 'elefante', pl: 'elefantes', g: 'm' },
    { e: '🦁', sg: 'león', pl: 'leones', g: 'm' },
    { e: '🐒', sg: 'mono', pl: 'monos', g: 'm' },
    { e: '🐢', sg: 'tortuga', pl: 'tortugas', g: 'f' },
    { e: '🐻', sg: 'oso', pl: 'osos', g: 'm' },
    { e: '🦒', sg: 'jirafa', pl: 'jirafas', g: 'f' },
  ];
  const FRUITS = [
    { e: '🍎', sg: 'manzana', pl: 'manzanas' },
    { e: '🍌', sg: 'plátano', pl: 'plátanos' },
    { e: '🍓', sg: 'fresa', pl: 'fresas' },
    { e: '🍊', sg: 'naranja', pl: 'naranjas' },
    { e: '🍐', sg: 'pera', pl: 'peras' },
    { e: '🍇', sg: 'uva', pl: 'uvas' },
  ];
  const COLORS = [
    { n: 'rojo', h: '#e53935' },
    { n: 'azul', h: '#1e88e5' },
    { n: 'verde', h: '#43a047' },
    { n: 'amarillo', h: '#fdd835' },
    { n: 'naranja', h: '#fb8c00' },
    { n: 'morado', h: '#8e24aa' },
    { n: 'rosa', h: '#ec407a' },
    { n: 'marrón', h: '#6d4c41' },
  ];
  const COLOR_THINGS = [
    { e: '🍎', c: 'rojo' },
    { e: '🍌', c: 'amarillo' },
    { e: '🐸', c: 'verde' },
    { e: '🍊', c: 'naranja' },
    { e: '🍇', c: 'morado' },
    { e: '🐳', c: 'azul' },
    { e: '🐷', c: 'rosa' },
  ];
  const SHAPES = [
    { n: 'círculo', art: 'el', svg: (c) => `<circle cx="50" cy="50" r="40" fill="${c}"/>` },
    { n: 'cuadrado', art: 'el', svg: (c) => `<rect x="12" y="12" width="76" height="76" fill="${c}"/>` },
    { n: 'triángulo', art: 'el', svg: (c) => `<polygon points="50,10 92,88 8,88" fill="${c}"/>` },
    { n: 'estrella', art: 'la', svg: (c) => `<polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38" fill="${c}"/>` },
    { n: 'corazón', art: 'el', svg: (c) => `<path d="M50 88 C10 58 6 30 28 20 C40 15 50 24 50 32 C50 24 60 15 72 20 C94 30 90 58 50 88Z" fill="${c}"/>` },
    { n: 'rectángulo', art: 'el', svg: (c) => `<rect x="4" y="26" width="92" height="48" fill="${c}"/>` },
  ];
  const SHADOW_ANIMALS = ['🐘', '🦒', '🐢', '🦆', '🐔', '🐑', '🐟', '🦋', '🐙', '🐌', '🐝', '🦀'];
  const SORT_SETS = [
    { key: 'animales', label: 'Animales', e: '🐾', items: ['🐶', '🐱', '🐰', '🐮', '🐷', '🐸'] },
    { key: 'frutas', label: 'Frutas', e: '🧺', items: ['🍎', '🍌', '🍓', '🍐', '🍊', '🍇'] },
    { key: 'transportes', label: 'Transportes', e: '🛣️', items: ['🚗', '🚌', '🚲', '✈️', '🚂', '🚁'] },
  ];

  /* ---------- Utilidades de opciones ---------- */
  function numOptions(correct, extras, o) {
    extras = extras || [];
    o = o || {};
    const n = o.n || 3;
    const min = o.min !== undefined ? o.min : 0;
    const max = o.max !== undefined ? o.max : Infinity;
    const ex = o.exclude || [];
    const set = [correct];
    const ok = (c) => Number.isInteger(c) && c >= min && c <= max && !ex.includes(c) && !set.includes(c);
    for (const e of extras) if (set.length < n && ok(e)) set.push(e);
    const deltas = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 10, -10];
    for (const d of deltas) {
      if (set.length >= n) break;
      if (ok(correct + d)) set.push(correct + d);
    }
    return shuffle(set).map((v) => ({ html: String(v), value: v, correct: v === correct }));
  }

  /* ---------- Juegos de pulsar para la peque (4 años) ---------- */
  function countQ(max) {
    const n = rnd(1, max);
    const a = pick(ANIMALS);
    const items = Array.from({ length: n }, () => `<button class="countable" type="button" data-act="count">${a.e}</button>`).join('');
    const q = `¿Cuánt${a.g === 'f' ? 'as' : 'os'} ${a.pl} hay?`;
    return {
      tag: 'contar',
      steps: [{
        tag: 'contar',
        visual: `<div class="count-grid">${items}</div><p class="tiny">Toca cada animal para contarlo</p>`,
        prompt: q,
        speak: q + ' Toca cada uno para contarlos.',
        layout: 'num',
        options: numOptions(n, [], { min: 1, max: Math.max(max, 3) }),
      }],
    };
  }

  function groupQ(max) {
    const n = rnd(1, max);
    const a = pick(ANIMALS);
    const counts = numOptions(n, [], { min: 1, max: Math.max(max, 3) }).map((o) => o.value);
    const prompt = `Toca el grupo que tiene ${n} ${n === 1 ? a.sg : a.pl}`;
    return {
      tag: 'grupos',
      steps: [{
        tag: 'grupos',
        visual: `<div class="bignum">${n}</div>`,
        prompt,
        speak: prompt,
        layout: 'groups',
        options: counts.map((c) => ({ html: `<span class="group">${a.e.repeat(c)}</span>`, value: c, correct: c === n })),
      }],
    };
  }

  function colorQ(pool) {
    const cols = COLORS.slice(0, pool);
    const t = pick(cols);
    const others = sample(cols.filter((c) => c !== t), 2);
    const options = shuffle([t, ...others]).map((c) => ({
      html: `<span class="swatch" style="background:${c.h}"></span>`,
      correct: c === t,
    }));
    // Dibujo de UN solo color (sin detalles de otros colores) para que no haya dudas
    if (Math.random() < 0.4) {
      const sh = pick(SHAPES.filter((s) => s.n !== 'rectángulo'));
      const de = sh.art === 'la' ? 'de la' : 'del';
      return {
        tag: 'colores',
        steps: [{
          tag: 'colores',
          visual: `<div class="bigshape"><svg viewBox="0 0 100 100" class="shape">${sh.svg(t.h)}</svg></div>`,
          prompt: `Toca el color ${de} ${sh.n}`,
          speak: `Toca el color ${de} ${sh.n}`,
          layout: 'swatch',
          options,
        }],
      };
    }
    return {
      tag: 'colores',
      steps: [{
        tag: 'colores',
        prompt: `Toca el color ${t.n.toUpperCase()}`,
        speak: `Toca el color ${t.n}`,
        layout: 'swatch',
        options,
      }],
    };
  }

  function shapeQ() {
    // Sin rectángulo: se parece demasiado al cuadrado y confunde a los más pequeños
    const pool = SHAPES.filter((s) => s.n !== 'rectángulo');
    const t = pick(pool);
    const others = sample(pool.filter((s) => s !== t), 2);
    const cols = sample(COLORS, 3);
    const all = shuffle([t, ...others]);
    return {
      tag: 'formas',
      steps: [{
        tag: 'formas',
        prompt: `Toca ${t.art} ${t.n}`,
        speak: `Toca ${t.art} ${t.n}`,
        layout: 'shapes',
        options: all.map((s, i) => ({
          html: `<svg viewBox="0 0 100 100" class="shape">${s.svg(cols[i].h)}</svg>`,
          correct: s === t,
        })),
      }],
    };
  }

  function sumVisualQ(max) {
    const a = rnd(1, max - 1);
    const b = rnd(1, max - a);
    const f = pick(FRUITS);
    const prompt = `Juntamos ${a} ${a === 1 ? f.sg : f.pl} con ${b} ${b === 1 ? f.sg : f.pl}. ¿Cuántas frutas hay en total?`;
    return {
      tag: 'sumas-visual',
      steps: [{
        tag: 'sumas-visual',
        visual: `<div class="sumvis"><span class="grp">${f.e.repeat(a)}</span><span class="op">➕</span><span class="grp">${f.e.repeat(b)}</span></div>`,
        prompt,
        speak: prompt,
        layout: 'num',
        options: numOptions(a + b, [a, b], { min: 1, max: Math.max(max, 3) + 1 }),
      }],
    };
  }

  /* ---------- Juegos de arrastrar ---------- */
  function dragCountQ(max) {
    const n = rnd(1, max);
    const f = pick(FRUITS);
    const total = Math.min(10, n + rnd(2, 4));
    const prompt = `Mete ${n} ${n === 1 ? f.sg : f.pl} en el cesto`;
    return { type: 'drag-count', tag: 'contar', n, e: f.e, total, prompt, speak: `Arrastra ${n} ${n === 1 ? f.sg : f.pl} al cesto` };
  }

  function dragSortQ() {
    const [a, b] = sample(SORT_SETS, 2);
    const items = shuffle([
      ...sample(a.items, rnd(2, 3)).map((e) => ({ e, zone: a.key })),
      ...sample(b.items, rnd(2, 3)).map((e) => ({ e, zone: b.key })),
    ]);
    return {
      type: 'drag-sort',
      tag: 'clasificar',
      prompt: 'Lleva cada dibujo a su grupo',
      speak: `Lleva cada dibujo a su grupo: ${a.label.toLowerCase()} o ${b.label.toLowerCase()}`,
      zones: [{ key: a.key, label: a.label, e: a.e }, { key: b.key, label: b.label, e: b.e }],
      items,
    };
  }

  function dragShapeQ() {
    const shapes = sample(SHAPES.filter((s) => s.n !== 'rectángulo'), 3);
    const cols = sample(COLORS, 3);
    const items = shapes.map((s, i) => ({
      id: i,
      sil: `<svg viewBox="0 0 100 100" class="shape">${s.svg('#d6d9e6')}</svg>`,
      tok: `<svg viewBox="0 0 100 100" class="shape">${s.svg(cols[i].h)}</svg>`,
    }));
    return {
      type: 'drag-shape',
      tag: 'formas',
      prompt: 'Pon cada forma en su hueco',
      speak: 'Arrastra cada forma a su hueco',
      holes: shuffle(items),
      tokens: shuffle(items),
    };
  }

  function dragOrderQ(max, desc) {
    const nums = sample(Array.from({ length: max }, (_, i) => i + 1), 4);
    const sorted = nums.slice().sort((a, b) => (desc ? b - a : a - b));
    return {
      type: 'drag-order',
      tag: 'orden',
      prompt: desc ? 'Ordena de MAYOR a MENOR' : 'Ordena de MENOR a MAYOR',
      speak: desc ? 'Ordena los números de mayor a menor' : 'Ordena los números de menor a mayor',
      nums,
      sorted,
      desc,
    };
  }

  /* ---------- Juegos de unir con líneas ---------- */
  function connectNumGroupQ(max, pairs) {
    const nums = sample(Array.from({ length: max }, (_, i) => i + 1), pairs).sort((a, b) => a - b);
    const animals = sample(ANIMALS, pairs);
    return {
      type: 'connect',
      tag: 'unir-numeros',
      prompt: 'Une cada número con su grupo',
      speak: 'Une cada número con el grupo que tiene esa cantidad',
      left: nums.map((n, i) => ({ id: i, html: `<span class="cnum">${n}</span>` })),
      right: shuffle(nums.map((n, i) => ({ id: i, html: `<span class="cgroup">${animals[i].e.repeat(n)}</span>` }))),
    };
  }

  function connectShadowQ(pairs) {
    // Solo animales con silueta muy distinta (las caras redondas se confunden entre sí)
    const an = sample(SHADOW_ANIMALS, pairs).map((e) => ({ e }));
    return {
      type: 'connect',
      tag: 'unir-sombras',
      prompt: 'Une cada animal con su sombra',
      speak: 'Une cada animal con su sombra',
      left: an.map((a, i) => ({ id: i, html: `<span class="cemoji">${a.e}</span>` })),
      right: shuffle(an.map((a, i) => ({ id: i, html: `<span class="cemoji shadow">${a.e}</span>` }))),
    };
  }

  function connectMathQ(max, pairs, tag) {
    const used = new Set();
    const exprs = [];
    for (let t = 0; t < 200 && exprs.length < pairs; t++) {
      let expr, res;
      if (Math.random() < 0.5) {
        const a = rnd(2, max - 2);
        const b = rnd(2, max - a);
        expr = `${a} + ${b}`;
        res = a + b;
      } else {
        const a = rnd(6, max);
        const b = rnd(2, a - 2);
        expr = `${a} − ${b}`;
        res = a - b;
      }
      if (!used.has(res)) { used.add(res); exprs.push({ expr, res }); }
    }
    return {
      type: 'connect',
      tag,
      prompt: 'Une cada cuenta con su resultado',
      speak: 'Une cada cuenta con su resultado',
      left: exprs.map((x, i) => ({ id: i, html: `<span class="cexpr">${x.expr}</span>` })),
      right: shuffle(exprs.map((x, i) => ({ id: i, html: `<span class="cexpr">${x.res}</span>` }))),
    };
  }

  function connectTablesQ(list, pairs) {
    const used = new Set();
    const exprs = [];
    for (let t = 0; t < 200 && exprs.length < pairs; t++) {
      const a = pick(list);
      const b = rnd(2, 10);
      const res = a * b;
      if (!used.has(res)) { used.add(res); exprs.push({ expr: `${a} × ${b}`, res }); }
    }
    return {
      type: 'connect',
      tag: 'unir-tablas',
      prompt: 'Une cada tabla con su resultado',
      speak: 'Une cada multiplicación con su resultado',
      left: exprs.map((x, i) => ({ id: i, html: `<span class="cexpr">${x.expr}</span>` })),
      right: shuffle(exprs.map((x, i) => ({ id: i, html: `<span class="cexpr">${x.res}</span>` }))),
    };
  }

  /* ---------- Juegos de pulsar para el explorador (7 años) ---------- */
  function sumQ(max, carry) {
    let a, b;
    for (let t = 0; t < 300; t++) {
      if (max > 20) {
        a = rnd(11, 89);
        b = rnd(11, Math.max(11, 100 - a));
      } else {
        a = rnd(2, max - 2);
        b = rnd(2, max - a);
      }
      if (!carry || a % 10 + b % 10 >= 10) {
        if (a + b <= max) break;
      }
    }
    const ans = a + b;
    return {
      tag: 'sumas',
      steps: [{
        tag: 'sumas',
        prompt: `${a} + ${b} = ?`,
        speak: `${a} más ${b}. ¿Cuánto es?`,
        layout: 'num',
        options: numOptions(ans, [ans + 10, ans - 10, ans + 1, ans - 1], { min: 0 }),
      }],
    };
  }

  function subQ(max, borrow) {
    let a, b;
    for (let t = 0; t < 300; t++) {
      a = rnd(max > 20 ? 21 : 6, max);
      b = rnd(2, a - 2);
      if (!borrow || (a % 10 < b % 10 && a - b >= 5)) break;
    }
    const ans = a - b;
    return {
      tag: 'restas',
      steps: [{
        tag: 'restas',
        prompt: `${a} − ${b} = ?`,
        speak: `${a} menos ${b}. ¿Cuánto es?`,
        layout: 'num',
        options: numOptions(ans, [ans + 10, ans - 10, ans + 1, ans - 1], { min: 0 }),
      }],
    };
  }

  function missingQ(max) {
    const a = rnd(2, max - 3);
    const s = rnd(a + 2, max);
    const ans = s - a;
    const useAdd = Math.random() < 0.5;
    const prompt = useAdd ? `${a} + ? = ${s}` : `${s} − ? = ${a}`;
    const sp = useAdd ? `${a} más qué número es igual a ${s}` : `${s} menos qué número es igual a ${a}`;
    return {
      tag: 'sumas-faltantes',
      steps: [{
        tag: 'sumas-faltantes',
        prompt,
        speak: sp,
        layout: 'num',
        options: numOptions(ans, [s + a, ans + 1, ans - 1], { min: 0 }),
      }],
    };
  }

  function tablesQ(list) {
    const a = pick(list);
    const b = rnd(1, 10);
    const ans = a * b;
    return {
      tag: 'tablas',
      steps: [{
        tag: 'tablas',
        prompt: `${a} × ${b} = ?`,
        speak: `${a} por ${b}. ¿Cuánto es?`,
        layout: 'num',
        options: numOptions(ans, [a * (b + 1), a * (b - 1), ans + 1, ans - 1], { min: 0 }),
      }],
    };
  }

  function seriesQ(steps, allowDesc) {
    const s = pick(steps);
    const desc = allowDesc && Math.random() < 0.4;
    const start = desc ? s * rnd(5, 9) : s * rnd(0, 4);
    const seq = Array.from({ length: 5 }, (_, i) => (desc ? start - i * s : start + i * s));
    const k = rnd(1, 4);
    const ans = seq[k];
    const chips = seq.map((v, i) => (i === k ? '<span class="chip blank">?</span>' : `<span class="chip">${v}</span>`)).join('');
    return {
      tag: 'series',
      steps: [{
        tag: 'series',
        visual: `<div class="series">${chips}</div>`,
        prompt: '¿Qué número falta?',
        speak: '¿Qué número falta en la serie?',
        layout: 'num',
        options: numOptions(ans, [ans + 1, ans - 1, ans + 2], { min: 0, exclude: seq.filter((v) => v !== ans) }),
      }],
    };
  }

  function clockSVG(h, m) {
    const hand = (deg, len, w, col) => {
      const r = (deg * Math.PI) / 180;
      return `<line x1="50" y1="50" x2="${(50 + len * Math.sin(r)).toFixed(2)}" y2="${(50 - len * Math.cos(r)).toFixed(2)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
    };
    let nums = '';
    for (let n = 1; n <= 12; n++) {
      const r = (n * 30 * Math.PI) / 180;
      nums += `<text x="${(50 + 36 * Math.sin(r)).toFixed(2)}" y="${(50 - 36 * Math.cos(r) + 3.2).toFixed(2)}" text-anchor="middle" font-size="9" font-weight="700" fill="#2b3a67">${n}</text>`;
    }
    return `<svg viewBox="0 0 100 100" class="clock"><circle cx="50" cy="50" r="48" fill="#fff" stroke="#2b3a67" stroke-width="3"/>${nums}${hand((h % 12) * 30 + m * 0.5, 22, 4.5, '#e53935')}${hand(m * 6, 32, 3, '#2b3a67')}<circle cx="50" cy="50" r="3" fill="#2b3a67"/></svg>`;
  }

  function clockQ(level) {
    const mins = level === 1 ? [0, 30] : [0, 15, 30, 45];
    const h = rnd(1, 12);
    const m = pick(mins);
    const fmt = (hh, mm) => `${hh}:${String(mm).padStart(2, '0')}`;
    const next = h === 12 ? 1 : h + 1;
    const prev = h === 1 ? 12 : h - 1;
    const otherMin = pick(mins.filter((x) => x !== m));
    const cands = [fmt(h, otherMin), fmt(next, m), fmt(prev, m), fmt(next, otherMin)];
    const wrong = [];
    for (const c of shuffle(cands)) if (c !== fmt(h, m) && !wrong.includes(c) && wrong.length < 2) wrong.push(c);
    const correct = fmt(h, m);
    return {
      tag: 'reloj',
      steps: [{
        tag: 'reloj',
        visual: `<div class="clockwrap">${clockSVG(h, m)}</div>`,
        prompt: '¿Qué hora marca el reloj?',
        speak: '¿Qué hora marca el reloj?',
        layout: 'times',
        options: shuffle([correct, ...wrong]).map((t) => ({ html: `<span class="digital">${t}</span>`, correct: t === correct })),
      }],
    };
  }

  /* ---------- Problemas guiados ---------- */
  const SCENARIOS = [
    { e: '🦴', add: (a, b) => `El perro tiene ${a} huesos. Su amigo le regala ${b} más. ¿Cuántos huesos tiene ahora?`, sub: (a, b) => `El perro tenía ${a} huesos. Se comió ${b}. ¿Cuántos huesos le quedan?` },
    { e: '🍌', add: (a, b) => `El mono recoge ${a} plátanos por la mañana y ${b} por la tarde. ¿Cuántos plátanos recoge en total?`, sub: (a, b) => `El mono tenía ${a} plátanos y regaló ${b} a su amigo. ¿Cuántos plátanos le quedan?` },
    { e: '🐟', add: (a, b) => `El gato pesca ${a} peces y luego pesca ${b} más. ¿Cuántos peces tiene?`, sub: (a, b) => `El gato tenía ${a} peces. Se le escaparon ${b}. ¿Cuántos peces le quedan?` },
    { e: '🥕', add: (a, b) => `El conejo tiene ${a} zanahorias y encuentra ${b} más en el huerto. ¿Cuántas zanahorias tiene ahora?`, sub: (a, b) => `El conejo tenía ${a} zanahorias y se come ${b}. ¿Cuántas zanahorias le quedan?` },
    { e: '🐝', add: (a, b) => `Hay ${a} abejas en una flor. Llegan ${b} abejas más. ¿Cuántas abejas hay ahora?`, sub: (a, b) => `Había ${a} abejas en una flor. Se van volando ${b}. ¿Cuántas abejas quedan?` },
    { e: '🥚', add: (a, b) => `Rexi el dinosaurio tiene ${a} huevos en su nido y encuentra ${b} más. ¿Cuántos huevos tiene ahora?`, sub: (a, b) => `Rexi el dinosaurio tenía ${a} huevos y regala ${b} a su amiga Tric. ¿Cuántos huevos le quedan?` },
    { e: '🌿', add: (a, b) => `Tric el dinosaurio come ${a} hojas por la mañana y ${b} por la tarde. ¿Cuántas hojas come en total?`, sub: (a, b) => `Tric el dinosaurio tenía ${a} hojas y se come ${b}. ¿Cuántas hojas le quedan?` },
    { e: '⭐', add: (a, b) => `Luna tiene ${a} estrellas de premio y gana ${b} más. ¿Cuántas estrellas tiene ahora?`, sub: (a, b) => `Luna tenía ${a} estrellas de premio y regala ${b} a su hermano. ¿Cuántas estrellas le quedan?` },
  ];
  // "Dar a otro": se resta, sin el concepto de "cuántos más"
  const CMP = [
    { e: '🌟', f: (a, b) => `Luna tiene ${a} pegatinas y le da ${b} a su amigo Leo. ¿Cuántas pegatinas le quedan a Luna?` },
    { e: '🦴', f: (a, b) => `Rexi tiene ${a} huesos y le da ${b} a su amiga Tric. ¿Cuántos huesos le quedan a Rexi?` },
    { e: '🍪', f: (a, b) => `Leo tiene ${a} galletas y le da ${b} a su hermana. ¿Cuántas galletas le quedan a Leo?` },
    { e: '🐮', f: (a, b) => `El granjero tiene ${a} vacas y vende ${b} a otro granjero. ¿Cuántas vacas le quedan?` },
  ];
  // "Entre los dos / en total": se suma
  const TOT = [
    { e: '🌟', f: (a, b) => `Luna tiene ${a} pegatinas y Leo tiene ${b}. ¿Cuántas pegatinas tienen entre los dos?` },
    { e: '🦴', f: (a, b) => `Rexi encontró ${a} huesos y Tric encontró ${b}. ¿Cuántos huesos tienen entre los dos?` },
    { e: '🦁', f: (a, b) => `En el zoo hay ${a} leones y ${b} tigres. ¿Cuántos felinos hay en total?` },
    { e: '✏️', f: (a, b) => `En la caja hay ${a} lápices rojos y ${b} lápices azules. ¿Cuántos lápices hay en total?` },
    { e: '🍎', f: (a, b) => `Luna tiene ${a} manzanas y Leo le regala ${b}. ¿Cuántas manzanas tiene Luna en total?` },
  ];
  const OPHINT = {
    add: 'Juntar o añadir cosas = SUMAR ➕',
    sub: 'Quitar o perder cosas = RESTAR ➖',
    cmp: 'Dar o regalar a otro = perder = RESTAR ➖',
    tot: '"En total" o "entre los dos" = juntar todo = SUMAR ➕',
    mul: 'Grupos iguales = MULTIPLICAR ✖️',
  };
  const SYM = { add: '+', sub: '−', cmp: '−', tot: '+', mul: '×' };
  const SAY = { '+': 'más', '−': 'menos', '×': 'por' };

  function problemQ(level) {
    // La multiplicación ('mul') está preparada pero desactivada hasta que la estudie
    const kinds = level <= 2 ? ['add', 'sub'] : ['add', 'sub', 'cmp', 'tot'];
    const kind = pick(kinds);
    const rng = level === 1 ? [5, 10] : level === 2 ? [6, 20] : level === 3 ? [10, 40] : [15, 99];
    let a, b, ans, text, e;
    if (kind === 'add' || kind === 'tot') {
      const sum = rnd(rng[0], rng[1]);
      a = rnd(2, sum - 2);
      b = sum - a;
      ans = a + b;
    } else if (kind === 'sub' || kind === 'cmp') {
      for (let t = 0; t < 300; t++) {
        a = rnd(rng[0], rng[1]);
        b = rnd(2, a - 2);
        // Por encima de 20: que la resta no necesite "llevada" (las unidades de b no superan a las de a)
        if (rng[1] <= 20 || b % 10 <= a % 10) break;
      }
      ans = a - b;
    } else {
      a = rnd(2, 5);
      b = pick([2, 3, 4, 5, 10]);
      ans = a * b;
    }
    if (kind === 'add' || kind === 'sub') {
      const sc = pick(SCENARIOS);
      text = sc[kind](a, b);
      e = sc.e;
    } else {
      const sc = pick(kind === 'cmp' ? CMP : kind === 'tot' ? TOT : MUL);
      text = sc.f(a, b);
      e = sc.e;
    }
    let visual = `<div class="bigemoji">${e}</div>`;
    if (level === 1 && (kind === 'add' || kind === 'sub') && a <= 12 && b <= 12) {
      visual = kind === 'add'
        ? `<div class="sumvis"><span class="grp">${e.repeat(a)}</span><span class="op">➕</span><span class="grp">${e.repeat(b)}</span></div>`
        : `<div class="sumvis"><span class="grp">${e.repeat(a - b)}</span><span class="grp crossed">${e.repeat(b)}</span></div>`;
    }
    const sym = SYM[kind];
    const steps = [];
    if (level === 1 && (kind === 'add' || kind === 'sub')) {
      steps.push({
        tag: 'prob-masomenos',
        prompt: 'Al final, ¿habrá MÁS o MENOS?',
        speak: 'Al final, ¿habrá más o menos?',
        layout: 'text',
        options: [
          { html: '📈 MÁS', correct: kind === 'add' },
          { html: '📉 MENOS', correct: kind === 'sub' },
        ],
        hint: kind === 'add' ? 'Le dan o juntan cosas, así que al final hay MÁS.' : 'Le quitan cosas o se van, así que al final hay MENOS.',
      });
    }
    const symOptions = kind === 'mul' ? ['+', '−', '×'] : ['+', '−'];
    const opSet = symOptions.includes(sym) ? symOptions : [sym, ...symOptions.slice(0, 2)];
    steps.push({
      tag: 'prob-operacion',
      prompt: '¿Qué cuenta hay que hacer?',
      speak: '¿Qué cuenta hay que hacer?',
      layout: 'text',
      options: shuffle(opSet).map((s) => ({ html: `${a} ${s} ${b}`, correct: s === sym })),
      hint: OPHINT[kind],
    });
    let wrongRes;
    if (sym === '+') wrongRes = a - b;
    else if (sym === '−') wrongRes = a + b;
    else wrongRes = a + b;
    steps.push({
      tag: 'prob-resultado',
      prompt: `${a} ${sym} ${b} = ?`,
      speak: `${a} ${SAY[sym]} ${b}. ¿Cuánto es?`,
      layout: 'num',
      options: numOptions(ans, [wrongRes, ans + 1, ans - 1, ans + 10, ans - 10], { min: 0 }),
    });
    return { tag: 'problemas', story: { text, visual }, steps };
  }

  /* ---------- Perfiles y misiones ---------- */
  const PROFILES = {
    peque: { id: 'peque', defaultName: 'Peque', emoji: '🦄', world: 'El Reino del Unicornio', age: 4 },
    explorador: { id: 'explorador', defaultName: 'Explorador', emoji: '🦖', world: 'La Isla de los Dinos', age: 7 },
  };

  const MISSIONS = {
    peque: [
      { id: 'p1', title: 'Cuenta los animales', icon: '🐮', sticker: '🦄', rounds: 5, gen: () => countQ(3) },
      { id: 'p2', title: 'Busca el grupo', icon: '🐷', sticker: '🐮', rounds: 5, gen: () => groupQ(3) },
      { id: 'p13', title: 'Mete en el cesto', icon: '🧺', sticker: '🐷', rounds: 4, gen: () => dragCountQ(3) },
      { id: 'p3', title: 'Los colores', icon: '🌈', sticker: '🐔', rounds: 5, gen: () => colorQ(4) },
      { id: 'p14', title: 'Une números y animales', icon: '🔗', sticker: '🐑', rounds: 3, gen: () => connectNumGroupQ(3, 3) },
      { id: 'p4', title: 'Cuenta hasta 5', icon: '🐔', sticker: '🐴', rounds: 5, gen: () => countQ(5) },
      { id: 'p5', title: 'Junta las frutas', icon: '🍎', sticker: '🐶', rounds: 5, gen: () => sumVisualQ(4) },
      { id: 'p6', title: 'Parejas de animales', icon: '🧠', sticker: '🐱', kind: 'memory', pairs: 3 },
      { id: 'p15', title: 'Cada cosa en su sitio', icon: '📦', sticker: '🐰', rounds: 3, gen: () => dragSortQ() },
      { id: 'p7', title: 'Las formas', icon: '🔺', sticker: '🦆', rounds: 5, gen: () => shapeQ() },
      { id: 'p16', title: 'Une las sombras', icon: '🌑', sticker: '🐸', rounds: 3, gen: () => connectShadowQ(3) },
      { id: 'p17', title: 'Cesto grande', icon: '🧺', sticker: '🐘', rounds: 4, gen: () => dragCountQ(6) },
      { id: 'p18', title: 'Encaja las formas', icon: '🧩', sticker: '🦁', rounds: 3, gen: () => dragShapeQ() },
      { id: 'p8', title: 'Grupos hasta 5', icon: '🐑', sticker: '🐒', rounds: 5, gen: () => groupQ(5) },
      { id: 'p9', title: 'Más frutas', icon: '🍌', sticker: '🐢', rounds: 5, gen: () => sumVisualQ(6) },
      { id: 'p10', title: 'Parejas grandes', icon: '🃏', sticker: '🐻', kind: 'memory', pairs: 4 },
      { id: 'p11', title: 'Cuenta hasta 10', icon: '🐘', sticker: '🦒', rounds: 5, gen: () => countQ(10) },
      { id: 'p12', title: 'Fiesta de frutas', icon: '🍓', sticker: '🌈', rounds: 5, gen: () => sumVisualQ(10) },
    ],
    explorador: [
      { id: 'h1', title: 'Sumas hasta 20', icon: '➕', sticker: '🦖', rounds: 6, gen: () => sumQ(20, false) },
      { id: 'h2', title: 'Restas hasta 20', icon: '➖', sticker: '🦕', rounds: 6, gen: () => subQ(20, false) },
      { id: 'h3', title: 'Problemas: ¿más o menos?', icon: '🔍', sticker: '🥚', rounds: 4, gen: () => problemQ(1) },
      { id: 'h15', title: 'Ordena los números', icon: '📶', sticker: '🌋', rounds: 4, gen: () => dragOrderQ(20, false) },
      { id: 'h4', title: 'El número escondido', icon: '🕵️', sticker: '🦴', rounds: 6, gen: () => missingQ(20) },
      { id: 'h5', title: 'Problemas: ¿qué cuenta?', icon: '🧩', sticker: '🌴', rounds: 4, gen: () => problemQ(2) },
      { id: 'h16', title: 'Une cuentas y resultados', icon: '🔗', sticker: '🪨', rounds: 3, gen: () => connectMathQ(20, 4, 'unir-cuentas') },
      { id: 'h6', title: 'Sumas con llevada', icon: '🚀', sticker: '🔥', rounds: 6, gen: () => sumQ(100, true) },
      { id: 'h7', title: 'Series de números', icon: '🔢', sticker: '⭐', rounds: 6, gen: () => seriesQ([2, 5, 10], false) },
      { id: 'h8', title: 'Problemas: comparar y total', icon: '⚖️', sticker: '🏆', rounds: 4, gen: () => problemQ(3) },
      { id: 'h10', title: 'El reloj', icon: '⏰', sticker: '🪐', rounds: 6, gen: () => clockQ(1) },
      { id: 'h17', title: 'Ordena de mayor a menor', icon: '📉', sticker: '👑', rounds: 4, gen: () => dragOrderQ(100, true) },
      { id: 'h12', title: 'Problemas de dino', icon: '🦖', sticker: '🦎', rounds: 4, gen: () => problemQ(4) },
      { id: 'h14', title: 'El reloj experto', icon: '🕰️', sticker: '🚀', rounds: 6, gen: () => clockQ(2) },
    ],
  };

  const RANKS = {
    peque: [
      { min: 0, icon: '✨', title: 'Brillito' },
      { min: 6, icon: '🌈', title: 'Arcoíris' },
      { min: 14, icon: '🌸', title: 'Flor mágica' },
      { min: 26, icon: '🦄', title: 'Unicornio' },
    ],
    explorador: [
      { min: 0, icon: '🥚', title: 'Huevito' },
      { min: 6, icon: '🦎', title: 'Dinito' },
      { min: 14, icon: '🦕', title: 'Dino joven' },
      { min: 24, icon: '🦖', title: 'Dino fuerte' },
      { min: 34, icon: '👑', title: 'Rey de los dinos' },
    ],
  };

  const SKILL_NAMES = {
    contar: 'Contar objetos',
    grupos: 'Relacionar número y cantidad',
    colores: 'Colores',
    formas: 'Formas',
    'sumas-visual': 'Juntar cantidades',
    clasificar: 'Clasificar y agrupar',
    'unir-numeros': 'Unir número y cantidad',
    'unir-sombras': 'Unir animales y sombras',
    sumas: 'Sumas',
    restas: 'Restas',
    'sumas-faltantes': 'Número escondido (sumas y restas)',
    orden: 'Ordenar números',
    'unir-cuentas': 'Unir cuentas y resultados',
    'unir-tablas': 'Unir tablas y resultados',
    tablas: 'Tablas de multiplicar',
    series: 'Series de números',
    reloj: 'Reloj',
    'prob-masomenos': 'Problemas: saber si habrá más o menos',
    'prob-operacion': 'Problemas: elegir suma o resta',
    'prob-resultado': 'Problemas: calcular el resultado',
  };

  return { PROFILES, MISSIONS, RANKS, SKILL_NAMES, ANIMALS, rnd, pick, shuffle, sample };
})();

if (typeof module !== 'undefined') module.exports = Games;
