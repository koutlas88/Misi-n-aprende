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

  /* ---------- Idioma: L(español, inglés) devuelve el texto del idioma activo ---------- */
  let LANG = 'es';
  const L = (es, en) => (LANG === 'en' ? en : es);
  const nm = (x, plural) => (LANG === 'en' ? x.en[plural ? 1 : 0] : (plural ? x.pl : x.sg));

  /* ---------- Datos ---------- */
  const ANIMALS = [
    { e: '🐮', sg: 'vaca', pl: 'vacas', g: 'f', en: ['cow', 'cows'] },
    { e: '🐷', sg: 'cerdito', pl: 'cerditos', g: 'm', en: ['pig', 'pigs'] },
    { e: '🐔', sg: 'gallina', pl: 'gallinas', g: 'f', en: ['hen', 'hens'] },
    { e: '🐑', sg: 'oveja', pl: 'ovejas', g: 'f', en: ['sheep', 'sheep'] },
    { e: '🐴', sg: 'caballo', pl: 'caballos', g: 'm', en: ['horse', 'horses'] },
    { e: '🐶', sg: 'perrito', pl: 'perritos', g: 'm', en: ['dog', 'dogs'] },
    { e: '🐱', sg: 'gatito', pl: 'gatitos', g: 'm', en: ['cat', 'cats'] },
    { e: '🐰', sg: 'conejito', pl: 'conejitos', g: 'm', en: ['rabbit', 'rabbits'] },
    { e: '🦆', sg: 'patito', pl: 'patitos', g: 'm', en: ['duck', 'ducks'] },
    { e: '🐸', sg: 'rana', pl: 'ranas', g: 'f', en: ['frog', 'frogs'] },
    { e: '🐘', sg: 'elefante', pl: 'elefantes', g: 'm', en: ['elephant', 'elephants'] },
    { e: '🦁', sg: 'león', pl: 'leones', g: 'm', en: ['lion', 'lions'] },
    { e: '🐒', sg: 'mono', pl: 'monos', g: 'm', en: ['monkey', 'monkeys'] },
    { e: '🐢', sg: 'tortuga', pl: 'tortugas', g: 'f', en: ['turtle', 'turtles'] },
    { e: '🐻', sg: 'oso', pl: 'osos', g: 'm', en: ['bear', 'bears'] },
    { e: '🦒', sg: 'jirafa', pl: 'jirafas', g: 'f', en: ['giraffe', 'giraffes'] },
  ];
  const FRUITS = [
    { e: '🍎', sg: 'manzana', pl: 'manzanas', en: ['apple', 'apples'] },
    { e: '🍌', sg: 'plátano', pl: 'plátanos', en: ['banana', 'bananas'] },
    { e: '🍓', sg: 'fresa', pl: 'fresas', en: ['strawberry', 'strawberries'] },
    { e: '🍊', sg: 'naranja', pl: 'naranjas', en: ['orange', 'oranges'] },
    { e: '🍐', sg: 'pera', pl: 'peras', en: ['pear', 'pears'] },
    { e: '🍇', sg: 'uva', pl: 'uvas', en: ['grape', 'grapes'] },
  ];
  const COLORS = [
    { n: 'rojo', en: 'red', h: '#e53935' },
    { n: 'azul', en: 'blue', h: '#1e88e5' },
    { n: 'verde', en: 'green', h: '#43a047' },
    { n: 'amarillo', en: 'yellow', h: '#fdd835' },
    { n: 'naranja', en: 'orange', h: '#fb8c00' },
    { n: 'morado', en: 'purple', h: '#8e24aa' },
    { n: 'rosa', en: 'pink', h: '#ec407a' },
    { n: 'marrón', en: 'brown', h: '#6d4c41' },
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
    { n: 'círculo', en: 'circle', art: 'el', svg: (c) => `<circle cx="50" cy="50" r="40" fill="${c}"/>` },
    { n: 'cuadrado', en: 'square', art: 'el', svg: (c) => `<rect x="12" y="12" width="76" height="76" fill="${c}"/>` },
    { n: 'triángulo', en: 'triangle', art: 'el', svg: (c) => `<polygon points="50,10 92,88 8,88" fill="${c}"/>` },
    { n: 'estrella', en: 'star', art: 'la', svg: (c) => `<polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38" fill="${c}"/>` },
    { n: 'corazón', en: 'heart', art: 'el', svg: (c) => `<path d="M50 88 C10 58 6 30 28 20 C40 15 50 24 50 32 C50 24 60 15 72 20 C94 30 90 58 50 88Z" fill="${c}"/>` },
    { n: 'rectángulo', en: 'rectangle', art: 'el', svg: (c) => `<rect x="4" y="26" width="92" height="48" fill="${c}"/>` },
  ];
  const SHADOW_ANIMALS = ['🐘', '🦒', '🐢', '🦆', '🐔', '🐑', '🐟', '🦋', '🐙', '🐌', '🐝', '🦀'];
  const SORT_SETS = [
    { key: 'animales', label: 'Animales', en: 'Animals', e: '🐾', items: ['🐶', '🐱', '🐰', '🐮', '🐷', '🐸'] },
    { key: 'frutas', label: 'Frutas', en: 'Fruit', e: '🧺', items: ['🍎', '🍌', '🍓', '🍐', '🍊', '🍇'] },
    { key: 'transportes', label: 'Transportes', en: 'Transport', e: '🛣️', items: ['🚗', '🚌', '🚲', '✈️', '🚂', '🚁'] },
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
    const q = L(`¿Cuánt${a.g === 'f' ? 'as' : 'os'} ${a.pl} hay?`, `How many ${nm(a, true)} are there?`);
    return {
      tag: 'contar',
      steps: [{
        tag: 'contar',
        visual: `<div class="count-grid">${items}</div><p class="tiny">${L('Toca cada animal para contarlo', 'Tap each animal to count it')}</p>`,
        prompt: q,
        speak: q + L(' Toca cada uno para contarlos.', ' Tap each one to count them.'),
        layout: 'num',
        options: numOptions(n, [], { min: 1, max: Math.max(max, 3) }),
      }],
    };
  }

  function groupQ(max) {
    const n = rnd(1, max);
    const a = pick(ANIMALS);
    const counts = numOptions(n, [], { min: 1, max: Math.max(max, 3) }).map((o) => o.value);
    const prompt = L(`Toca el grupo que tiene ${n} ${n === 1 ? a.sg : a.pl}`, `Tap the group with ${n} ${nm(a, n !== 1)}`);
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
      const pq = L(`Toca el color ${de} ${sh.n}`, `Tap the colour of the ${sh.en}`);
      return {
        tag: 'colores',
        steps: [{
          tag: 'colores',
          visual: `<div class="bigshape"><svg viewBox="0 0 100 100" class="shape">${sh.svg(t.h)}</svg></div>`,
          prompt: pq,
          speak: pq,
          layout: 'swatch',
          options,
        }],
      };
    }
    return {
      tag: 'colores',
      steps: [{
        tag: 'colores',
        prompt: L(`Toca el color ${t.n.toUpperCase()}`, `Tap the colour ${t.en.toUpperCase()}`),
        speak: L(`Toca el color ${t.n}`, `Tap the colour ${t.en}`),
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
        prompt: L(`Toca ${t.art} ${t.n}`, `Tap the ${t.en}`),
        speak: L(`Toca ${t.art} ${t.n}`, `Tap the ${t.en}`),
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
    const prompt = L(`Juntamos ${a} ${a === 1 ? f.sg : f.pl} con ${b} ${b === 1 ? f.sg : f.pl}. ¿Cuántas frutas hay en total?`, `We put ${a} ${nm(f, a !== 1)} together with ${b} ${nm(f, b !== 1)}. How many pieces of fruit are there altogether?`);
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
    const prompt = L(`Mete ${n} ${n === 1 ? f.sg : f.pl} en el cesto`, `Put ${n} ${nm(f, n !== 1)} in the basket`);
    return { type: 'drag-count', tag: 'contar', n, e: f.e, total, prompt, speak: L(`Arrastra ${n} ${n === 1 ? f.sg : f.pl} al cesto`, `Drag ${n} ${nm(f, n !== 1)} into the basket`) };
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
      prompt: L('Lleva cada dibujo a su grupo', 'Take each picture to its group'),
      speak: L(`Lleva cada dibujo a su grupo: ${a.label.toLowerCase()} o ${b.label.toLowerCase()}`, `Take each picture to its group: ${a.en.toLowerCase()} or ${b.en.toLowerCase()}`),
      zones: [{ key: a.key, label: L(a.label, a.en), e: a.e }, { key: b.key, label: L(b.label, b.en), e: b.e }],
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
      prompt: L('Pon cada forma en su hueco', 'Fit each shape into its hole'),
      speak: L('Arrastra cada forma a su hueco', 'Drag each shape into its hole'),
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
      prompt: desc ? L('Ordena de MAYOR a MENOR', 'Put them in order: BIGGEST to SMALLEST') : L('Ordena de MENOR a MAYOR', 'Put them in order: SMALLEST to BIGGEST'),
      speak: desc ? L('Ordena los números de mayor a menor', 'Put the numbers in order from biggest to smallest') : L('Ordena los números de menor a mayor', 'Put the numbers in order from smallest to biggest'),
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
      prompt: L('Une cada número con su grupo', 'Match each number with its group'),
      speak: L('Une cada número con el grupo que tiene esa cantidad', 'Match each number with the group that has that many'),
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
      prompt: L('Une cada animal con su sombra', 'Match each animal with its shadow'),
      speak: L('Une cada animal con su sombra', 'Match each animal with its shadow'),
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
      prompt: L('Une cada cuenta con su resultado', 'Match each sum with its answer'),
      speak: L('Une cada cuenta con su resultado', 'Match each sum with its answer'),
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
      prompt: L('Une cada tabla con su resultado', 'Match each times table with its answer'),
      speak: L('Une cada multiplicación con su resultado', 'Match each multiplication with its answer'),
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
        speak: L(`${a} más ${b}. ¿Cuánto es?`, `${a} plus ${b}. What is the answer?`),
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
        speak: L(`${a} menos ${b}. ¿Cuánto es?`, `${a} minus ${b}. What is the answer?`),
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
    const sp = useAdd ? L(`${a} más qué número es igual a ${s}`, `${a} plus what number equals ${s}`) : L(`${s} menos qué número es igual a ${a}`, `${s} minus what number equals ${a}`);
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
        speak: L(`${a} por ${b}. ¿Cuánto es?`, `${a} times ${b}. What is the answer?`),
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
        prompt: L('¿Qué número falta?', 'Which number is missing?'),
        speak: L('¿Qué número falta en la serie?', 'Which number is missing in the pattern?'),
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
        prompt: L('¿Qué hora marca el reloj?', 'What time does the clock show?'),
        speak: L('¿Qué hora marca el reloj?', 'What time does the clock show?'),
        layout: 'times',
        options: shuffle([correct, ...wrong]).map((t) => ({ html: `<span class="digital">${t}</span>`, correct: t === correct })),
      }],
    };
  }

  /* ---------- Problemas guiados ---------- */
  const SCENARIOS = [
    { e: '🦴',
      add: (a, b) => L(`El perro tiene ${a} huesos. Su amigo le regala ${b} más. ¿Cuántos huesos tiene ahora?`, `The dog has ${a} bones. His friend gives him ${b} more. How many bones does he have now?`),
      sub: (a, b) => L(`El perro tenía ${a} huesos. Se comió ${b}. ¿Cuántos huesos le quedan?`, `The dog had ${a} bones. He ate ${b}. How many bones are left?`) },
    { e: '🍌',
      add: (a, b) => L(`El mono recoge ${a} plátanos por la mañana y ${b} por la tarde. ¿Cuántos plátanos recoge en total?`, `The monkey picks ${a} bananas in the morning and ${b} in the afternoon. How many bananas does the monkey pick altogether?`),
      sub: (a, b) => L(`El mono tenía ${a} plátanos y regaló ${b} a su amigo. ¿Cuántos plátanos le quedan?`, `The monkey had ${a} bananas and gave ${b} to a friend. How many bananas are left?`) },
    { e: '🐟',
      add: (a, b) => L(`El gato pesca ${a} peces y luego pesca ${b} más. ¿Cuántos peces tiene?`, `The cat catches ${a} fish and then catches ${b} more. How many fish does the cat have?`),
      sub: (a, b) => L(`El gato tenía ${a} peces. Se le escaparon ${b}. ¿Cuántos peces le quedan?`, `The cat had ${a} fish. ${b} swam away. How many fish are left?`) },
    { e: '🥕',
      add: (a, b) => L(`El conejo tiene ${a} zanahorias y encuentra ${b} más en el huerto. ¿Cuántas zanahorias tiene ahora?`, `The rabbit has ${a} carrots and finds ${b} more in the garden. How many carrots does the rabbit have now?`),
      sub: (a, b) => L(`El conejo tenía ${a} zanahorias y se come ${b}. ¿Cuántas zanahorias le quedan?`, `The rabbit had ${a} carrots and eats ${b}. How many carrots are left?`) },
    { e: '🐝',
      add: (a, b) => L(`Hay ${a} abejas en una flor. Llegan ${b} abejas más. ¿Cuántas abejas hay ahora?`, `There are ${a} bees on a flower. ${b} more bees arrive. How many bees are there now?`),
      sub: (a, b) => L(`Había ${a} abejas en una flor. Se van volando ${b}. ¿Cuántas abejas quedan?`, `There were ${a} bees on a flower. ${b} fly away. How many bees are left?`) },
    { e: '🥚',
      add: (a, b) => L(`Rexi el dinosaurio tiene ${a} huevos en su nido y encuentra ${b} más. ¿Cuántos huevos tiene ahora?`, `Rexi the dinosaur has ${a} eggs in the nest and finds ${b} more. How many eggs does Rexi have now?`),
      sub: (a, b) => L(`Rexi el dinosaurio tenía ${a} huevos y regala ${b} a su amiga Tric. ¿Cuántos huevos le quedan?`, `Rexi the dinosaur had ${a} eggs and gives ${b} to his friend Tric. How many eggs are left?`) },
    { e: '🌿',
      add: (a, b) => L(`Tric el dinosaurio come ${a} hojas por la mañana y ${b} por la tarde. ¿Cuántas hojas come en total?`, `Tric the dinosaur eats ${a} leaves in the morning and ${b} in the afternoon. How many leaves does Tric eat altogether?`),
      sub: (a, b) => L(`Tric el dinosaurio tenía ${a} hojas y se come ${b}. ¿Cuántas hojas le quedan?`, `Tric the dinosaur had ${a} leaves and eats ${b}. How many leaves are left?`) },
    { e: '⭐',
      add: (a, b) => L(`Luna tiene ${a} estrellas de premio y gana ${b} más. ¿Cuántas estrellas tiene ahora?`, `Luna has ${a} prize stars and wins ${b} more. How many stars does Luna have now?`),
      sub: (a, b) => L(`Luna tenía ${a} estrellas de premio y regala ${b} a su hermano. ¿Cuántas estrellas le quedan?`, `Luna had ${a} prize stars and gives ${b} to her brother. How many stars are left?`) },
  ];
  // "Dar a otro": se resta, sin el concepto de "cuántos más"
  const CMP = [
    { e: '🌟', f: (a, b) => L(`Luna tiene ${a} pegatinas y le da ${b} a su amigo Leo. ¿Cuántas pegatinas le quedan a Luna?`, `Luna has ${a} stickers and gives ${b} to her friend Leo. How many stickers does Luna have left?`) },
    { e: '🦴', f: (a, b) => L(`Rexi tiene ${a} huesos y le da ${b} a su amiga Tric. ¿Cuántos huesos le quedan a Rexi?`, `Rexi has ${a} bones and gives ${b} to his friend Tric. How many bones does Rexi have left?`) },
    { e: '🍪', f: (a, b) => L(`Leo tiene ${a} galletas y le da ${b} a su hermana. ¿Cuántas galletas le quedan a Leo?`, `Leo has ${a} biscuits and gives ${b} to his sister. How many biscuits does Leo have left?`) },
    { e: '🐮', f: (a, b) => L(`El granjero tiene ${a} vacas y vende ${b} a otro granjero. ¿Cuántas vacas le quedan?`, `The farmer has ${a} cows and sells ${b} to another farmer. How many cows does the farmer have left?`) },
  ];
  // "Entre los dos / en total": se suma
  const TOT = [
    { e: '🌟', f: (a, b) => L(`Luna tiene ${a} pegatinas y Leo tiene ${b}. ¿Cuántas pegatinas tienen entre los dos?`, `Luna has ${a} stickers and Leo has ${b}. How many stickers do they have between them?`) },
    { e: '🦴', f: (a, b) => L(`Rexi encontró ${a} huesos y Tric encontró ${b}. ¿Cuántos huesos tienen entre los dos?`, `Rexi found ${a} bones and Tric found ${b}. How many bones do they have between them?`) },
    { e: '🦁', f: (a, b) => L(`En el zoo hay ${a} leones y ${b} tigres. ¿Cuántos felinos hay en total?`, `At the zoo there are ${a} lions and ${b} tigers. How many big cats are there altogether?`) },
    { e: '✏️', f: (a, b) => L(`En la caja hay ${a} lápices rojos y ${b} lápices azules. ¿Cuántos lápices hay en total?`, `In the box there are ${a} red pencils and ${b} blue pencils. How many pencils are there altogether?`) },
    { e: '🍎', f: (a, b) => L(`Luna tiene ${a} manzanas y Leo le regala ${b}. ¿Cuántas manzanas tiene Luna en total?`, `Luna has ${a} apples and Leo gives her ${b} more. How many apples does Luna have altogether?`) },
  ];
  const OPHINT = {
    get add() { return L('Juntar o añadir cosas = SUMAR ➕', 'Putting things together or adding more = ADD ➕'); },
    get sub() { return L('Quitar o perder cosas = RESTAR ➖', 'Taking things away or losing them = SUBTRACT ➖'); },
    get cmp() { return L('Dar o regalar a otro = perder = RESTAR ➖', 'Giving something to someone else = losing it = SUBTRACT ➖'); },
    get tot() { return L('"En total" o "entre los dos" = juntar todo = SUMAR ➕', '"Altogether" or "between them" = putting it all together = ADD ➕'); },
    get mul() { return L('Grupos iguales = MULTIPLICAR ✖️', 'Equal groups = MULTIPLY ✖️'); },
  };
  const SYM = { add: '+', sub: '−', cmp: '−', tot: '+', mul: '×' };
  const SAY = { get '+'() { return L('más', 'plus'); }, get '−'() { return L('menos', 'minus'); }, get '×'() { return L('por', 'times'); } };

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
        prompt: L('Al final, ¿habrá MÁS o MENOS?', 'At the end, will there be MORE or FEWER?'),
        speak: L('Al final, ¿habrá más o menos?', 'At the end, will there be more or fewer?'),
        layout: 'text',
        options: [
          { html: L('📈 MÁS', '📈 MORE'), correct: kind === 'add' },
          { html: L('📉 MENOS', '📉 FEWER'), correct: kind === 'sub' },
        ],
        hint: kind === 'add' ? L('Le dan o juntan cosas, así que al final hay MÁS.', 'Things are added or put together, so at the end there are MORE.') : L('Le quitan cosas o se van, así que al final hay MENOS.', 'Things are taken away or go away, so at the end there are FEWER.'),
      });
    }
    const symOptions = kind === 'mul' ? ['+', '−', '×'] : ['+', '−'];
    const opSet = symOptions.includes(sym) ? symOptions : [sym, ...symOptions.slice(0, 2)];
    steps.push({
      tag: 'prob-operacion',
      prompt: L('¿Qué cuenta hay que hacer?', 'Which sum do we need to do?'),
      speak: L('¿Qué cuenta hay que hacer?', 'Which sum do we need to do?'),
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
      speak: L(`${a} ${SAY[sym]} ${b}. ¿Cuánto es?`, `${a} ${SAY[sym]} ${b}. What is the answer?`),
      layout: 'num',
      options: numOptions(ans, [wrongRes, ans + 1, ans - 1, ans + 10, ans - 10], { min: 0 }),
    });
    return { tag: 'problemas', story: { text, visual }, steps };
  }

  /* ---------- Generadores nuevos (más variedad para los mundos largos) ---------- */
  // Suma con rango: carry 'no' = sin llevada, 'si' = con llevada, 'mix' = cualquiera
  function sumNQ(max, carry) {
    let a, b;
    const lo = max <= 20 ? 2 : 11;
    for (let t = 0; t < 400; t++) {
      a = rnd(lo, Math.max(lo, max - lo));
      b = rnd(lo, Math.max(lo, max - a));
      const c = (a % 10) + (b % 10) >= 10;
      if (a + b > max) continue;
      if (max > 20 && carry === 'no' && c) continue;
      if (carry === 'si' && !c) continue;
      break;
    }
    const ans = a + b;
    return {
      tag: 'sumas',
      steps: [{ tag: 'sumas', prompt: `${a} + ${b} = ?`, speak: L(`${a} más ${b}. ¿Cuánto es?`, `${a} plus ${b}. What is the answer?`), layout: 'num', options: numOptions(ans, [ans + 10, ans - 10, ans + 1, ans - 1], { min: 0 }) }],
    };
  }
  // Resta sin llevadas (el niño aún no las ha estudiado)
  function subNQ(max) {
    let a, b;
    for (let t = 0; t < 400; t++) {
      a = rnd(max > 20 ? 21 : 6, max);
      b = rnd(2, a - 2);
      if (max <= 20 || b % 10 <= a % 10) break;
    }
    const ans = a - b;
    return {
      tag: 'restas',
      steps: [{ tag: 'restas', prompt: `${a} − ${b} = ?`, speak: L(`${a} menos ${b}. ¿Cuánto es?`, `${a} minus ${b}. What is the answer?`), layout: 'num', options: numOptions(ans, [ans + 10, ans - 10, ans + 1, ans - 1], { min: 0 }) }],
    };
  }
  function sum3Q(max) {
    let a, b, c;
    for (let t = 0; t < 300; t++) {
      a = rnd(2, Math.floor(max / 2));
      b = rnd(2, Math.floor(max / 3));
      c = rnd(2, Math.floor(max / 3));
      if (a + b + c <= max) break;
    }
    const ans = a + b + c;
    return {
      tag: 'sumas',
      steps: [{ tag: 'sumas', prompt: `${a} + ${b} + ${c} = ?`, speak: L(`${a} más ${b} más ${c}. ¿Cuánto es?`, `${a} plus ${b} plus ${c}. What is the answer?`), layout: 'num', options: numOptions(ans, [ans + 1, ans - 1, ans + 10, ans - 10], { min: 0 }) }],
    };
  }
  function compareQ(max) {
    const a = rnd(1, max);
    let b = rnd(1, max);
    while (b === a) b = rnd(1, max);
    const big = Math.random() < 0.5;
    const ans = big ? Math.max(a, b) : Math.min(a, b);
    const w = big ? L('MAYOR', 'BIGGER') : L('MENOR', 'SMALLER');
    return {
      tag: 'comparar',
      steps: [{
        tag: 'comparar',
        prompt: L(`¿Qué número es ${w}?`, `Which number is ${w}?`),
        speak: L(`¿Qué número es ${big ? 'mayor' : 'menor'}?`, `Which number is ${big ? 'bigger' : 'smaller'}?`),
        layout: 'num',
        options: shuffle([a, b]).map((v) => ({ html: String(v), correct: v === ans })),
      }],
    };
  }
  function doubleQ(max) {
    const half = Math.random() < 0.5;
    const n = rnd(2, max);
    const ans = half ? n : n * 2;
    const q = half ? L(`La mitad de ${n * 2}`, `Half of ${n * 2}`) : L(`El doble de ${n}`, `Double ${n}`);
    return {
      tag: 'dobles',
      steps: [{
        tag: 'dobles',
        prompt: L(`${q} es...`, `${q} is...`),
        speak: L(`${q} es... `, `${q} is... `),
        layout: 'num',
        options: numOptions(ans, [ans + 1, ans - 1, half ? n * 2 : n], { min: 1 }),
      }],
    };
  }
  function placeQ(max) {
    const n = rnd(11, max);
    const tens = Math.random() < 0.5;
    const ans = tens ? Math.floor(n / 10) : n % 10;
    const q = tens ? L(`En el número ${n}, ¿cuántas DECENAS hay?`, `In the number ${n}, how many TENS are there?`) : L(`En el número ${n}, ¿cuántas UNIDADES hay?`, `In the number ${n}, how many ONES are there?`);
    return {
      tag: 'decenas',
      steps: [{
        tag: 'decenas',
        prompt: q,
        speak: tens ? L(`En el número ${n}, ¿cuántas decenas hay?`, `In the number ${n}, how many tens are there?`) : L(`En el número ${n}, ¿cuántas unidades hay?`, `In the number ${n}, how many ones are there?`),
        layout: 'num',
        options: numOptions(ans, [tens ? n % 10 : Math.floor(n / 10), ans + 1, ans - 1], { min: 0 }),
      }],
    };
  }
  function neighborQ(max) {
    const n = rnd(2, max - 1);
    const kind = pick(['antes', 'despues', 'entre']);
    let prompt, ans, visual = '';
    if (kind === 'antes') { prompt = L(`¿Qué número va ANTES del ${n}?`, `Which number comes BEFORE ${n}?`); ans = n - 1; }
    else if (kind === 'despues') { prompt = L(`¿Qué número va DESPUÉS del ${n}?`, `Which number comes AFTER ${n}?`); ans = n + 1; }
    else { prompt = L('¿Qué número va en medio?', 'Which number goes in the middle?'); ans = n; visual = `<div class="series"><span class="chip">${n - 1}</span><span class="chip blank">?</span><span class="chip">${n + 1}</span></div>`; }
    return {
      tag: 'vecinos',
      steps: [{ tag: 'vecinos', visual, prompt, speak: LANG === 'en' ? prompt : prompt.replace(/[¿?]/g, '') + '?', layout: 'num', options: numOptions(ans, [ans + 1, ans - 1, ans + 2, ans - 2], { min: 0 }) }],
    };
  }
  function moneyQ(max) {
    const pool = [1, 2, 5, 10, 20];
    const items = [];
    let total = 0;
    const n = rnd(2, 4);
    for (let i = 0; i < n; i++) {
      const opts = pool.filter((x) => total + x <= max);
      const v = opts.length ? pick(opts) : 1;
      items.push(v);
      total += v;
    }
    const chips = items.map((v) => `<span class="chip coin">${L(`${v} €`, `£${v}`)}</span>`).join('');
    return {
      tag: 'dinero',
      steps: [{
        tag: 'dinero',
        visual: `<div class="series">${chips}</div>`,
        prompt: L('¿Cuánto dinero hay en total?', 'How much money is there altogether?'),
        speak: L('¿Cuánto dinero hay en total?', 'How much money is there altogether?'),
        layout: 'num',
        options: numOptions(total, [total + 1, total - 1, total + 5, total - 5], { min: 1 }),
      }],
    };
  }
  // Para la peque: reconocer el número y comparar cantidades
  function bigNumQ(max) {
    const n = rnd(1, max);
    return {
      tag: 'numeros',
      steps: [{
        tag: 'numeros',
        visual: `<div class="bignum">${n}</div>`,
        prompt: L('¿Qué número es este?', 'Which number is this?'),
        speak: L('¿Qué número es este?', 'Which number is this?'),
        layout: 'num',
        options: numOptions(n, [n + 1, n - 1, n + 2], { min: 0, max: max + 2 }),
      }],
    };
  }
  function moreQ(max) {
    const a = rnd(1, max);
    let b = rnd(1, max);
    while (b === a) b = rnd(1, max);
    const f = pick(ANIMALS);
    const more = Math.random() < 0.6;
    const side = more ? (a > b ? 'a' : 'b') : (a < b ? 'a' : 'b');
    const w = more ? L('MÁS', 'MORE') : L('MENOS', 'FEWER');
    return {
      tag: 'comparar-visual',
      steps: [{
        tag: 'comparar-visual',
        prompt: L(`¿Dónde hay ${w}?`, `Where are there ${w}?`),
        speak: L(`¿Dónde hay ${more ? 'más' : 'menos'}?`, `Where are there ${more ? 'more' : 'fewer'}?`),
        layout: 'groups',
        options: [
          { html: `<span class="grp">${f.e.repeat(a)}</span>`, correct: side === 'a' },
          { html: `<span class="grp">${f.e.repeat(b)}</span>`, correct: side === 'b' },
        ],
      }],
    };
  }
  const PAT_SETS = [['🔴', '🔵'], ['🟡', '🟢'], ['🍎', '🍌'], ['🐶', '🐱'], ['⭐', '🌙'], ['🌸', '🌿']];
  function patternQ(abc) {
    const set = shuffle(pick(PAT_SETS).concat(abc ? ['🟣'] : [])).slice(0, abc ? 3 : 2);
    const seq = [];
    for (let i = 0; i < (abc ? 6 : 5); i++) seq.push(set[i % set.length]);
    const k = seq.length - 1;
    const ans = seq[k];
    const chips = seq.map((v, i) => (i === k ? '<span class="chip blank">?</span>' : `<span class="chip">${v}</span>`)).join('');
    const others = set.filter((x) => x !== ans);
    return {
      tag: 'patrones',
      steps: [{
        tag: 'patrones',
        visual: `<div class="series">${chips}</div>`,
        prompt: L('¿Qué viene después?', 'What comes next?'),
        speak: L('¿Qué sigue en la fila?', 'What comes next in the row?'),
        layout: 'num',
        options: shuffle([ans, ...others.slice(0, 2)]).map((v) => ({ html: `<span class="grp">${v}</span>`, correct: v === ans })),
      }],
    };
  }

  /* ---------- Perfiles, mundos y misiones ---------- */
  // Cada mundo es un "perfil" propio (progreso, ropa y regalos propios) que pertenece a un niño (kid)
  const PROFILES = {
    peque: { id: 'peque', kid: 'peque', hero: 'unicorn', family: 'peque', defaultName: 'Peque', emoji: '🦄', world: 'El Reino del Unicornio', age: 4, w: 0 },
    gatito: { id: 'gatito', kid: 'peque', hero: 'cat', family: 'peque', defaultName: 'Gatita', emoji: '🐱', world: 'El Bosque de los Gatitos', age: 4, w: 1, unlockAfter: 50 },
    explorador: { id: 'explorador', kid: 'explorador', hero: 'dino', family: 'explorador', defaultName: 'Explorador', emoji: '🦖', world: 'La Isla de los Dinos', age: 7, w: 0 },
    dragon: { id: 'dragon', kid: 'explorador', hero: 'dragon', family: 'explorador', defaultName: 'Explorador', emoji: '🐲', world: 'El Reino de los Dragones', age: 7, w: 1, unlockAfter: 50 },
  };
  const KIDS = ['peque', 'explorador'];
  const WORLD_EN = { peque: 'The Unicorn Kingdom', gatito: 'The Kitten Woods', explorador: 'Dino Island', dragon: 'The Dragon Kingdom' };
  const NAME_EN = { peque: 'Little one', gatito: 'Kitty', explorador: 'Explorer', dragon: 'Explorer' };
  Object.keys(PROFILES).forEach((id) => {
    const pr = PROFILES[id];
    const wes = pr.world;
    const nes = pr.defaultName;
    Object.defineProperty(pr, 'world', { get: () => L(wes, WORLD_EN[id]), enumerable: true });
    Object.defineProperty(pr, 'defaultName', { get: () => L(nes, NAME_EN[id]), enumerable: true });
    pr.defaultNames = [nes, NAME_EN[id]];
  });

  const EMOJI_POOL = ['🦄', '🐮', '🐷', '🐔', '🐑', '🐴', '🐶', '🐱', '🐰', '🦆', '🐸', '🐘', '🦁', '🐒', '🐢', '🐻', '🦒', '🌈', '🦖', '🦕', '🥚', '🌋', '🦴', '🌴', '🪨', '🔥', '⭐', '🏆', '🪐', '👑', '🦎', '🚀',
    '🐯', '🐨', '🐼', '🐧', '🐦', '🦉', '🦋', '🐝', '🐞', '🐌', '🐙', '🐬', '🐳', '🦈', '🐊', '🦓', '🦘', '🦔', '🦦', '🦥', '🦩', '🦜', '🦢', '🐿️', '🍎', '🍌', '🍓', '🍇', '🍉', '🍒', '🥕', '🌽',
    '🍄', '🌻', '🌷', '🌸', '🌵', '🌲', '🍀', '🌙', '☀️', '☁️', '⚡', '❄️', '🔔', '🎈', '🎁', '🎨', '🎸', '🥁', '🎺', '⚽', '🏀', '🎯', '🧩', '🚂', '🚗', '🚒', '✈️', '⛵', '🏰', '🗻', '💎', '🧲',
    '🔮', '🪄', '📚', '🔭', '🧭', '🗝️', '🪁', '🎠', '🍦', '🧁', '🍪', '🥐', '🍕', '🍩', '🍯', '🥝', '🍍', '🥭', '🍑', '🍋', '🐉', '🪺', '🦚', '🦀'];
  const stickerFor = (w, n) => EMOJI_POOL[(n + w * 37) % EMOJI_POOL.length];

  const at = (arr, T) => arr[Math.min(T, arr.length - 1)];
  const T20 = (head, last) => head.concat(Array(20 - head.length).fill(last));

  const ZONE_TXT = {
    explorador: [['Playa de huevos', 'Egg Beach'], ['Selva verde', 'Green Jungle'], ['Cueva de huesos', 'Bone Cave'], ['Valle de helechos', 'Fern Valley'], ['Pantano burbujeante', 'Bubbling Swamp'], ['Volcán dormido', 'Sleepy Volcano'], ['Cañón rojo', 'Red Canyon'], ['Nubes altas', 'High Clouds'], ['Cima del volcán', 'Volcano Top'], ['Nido del Rey', "The King's Nest"]],
    dragon: [['Aldea de los dragoncitos', 'Baby Dragon Village'], ['Bosque encantado', 'Enchanted Forest'], ['Montañas de hielo', 'Ice Mountains'], ['Lago de fuego', 'Fire Lake'], ['Cueva del tesoro', 'Treasure Cave'], ['Castillo de piedra', 'Stone Castle'], ['Cielo de tormenta', 'Stormy Sky'], ['Isla flotante', 'Floating Island'], ['Torre del mago', "The Wizard's Tower"], ['Trono del dragón', "The Dragon's Throne"]],
    peque: [['Prado de flores', 'Flower Meadow'], ['Bosque de colores', 'Colourful Forest'], ['Lago de cristal', 'Crystal Lake'], ['Colina del arcoíris', 'Rainbow Hill'], ['Jardín de mariposas', 'Butterfly Garden'], ['Nube de algodón', 'Cotton Cloud'], ['Valle de estrellas', 'Valley of Stars'], ['Cascada mágica', 'Magic Waterfall'], ['Castillo de caramelo', 'Candy Castle'], ['Cima del unicornio', 'Unicorn Peak']],
    gatito: [['Jardín de la casita', 'Little House Garden'], ['Bosque de hojas', 'Leaf Forest'], ['Colina de luciérnagas', 'Firefly Hill'], ['Estanque de peces', 'Fish Pond'], ['Granja de ovillos', 'Yarn Farm'], ['Tejados de la luna', 'Moonlit Rooftops'], ['Cueva de las estrellas', 'Starry Cave'], ['Playa de conchas', 'Shell Beach'], ['Parque de juegos', 'Playground'], ['Palacio de los gatitos', 'Kitten Palace']],
  };
  const ZONES = {};
  Object.keys(ZONE_TXT).forEach((k) => { Object.defineProperty(ZONES, k, { get: () => ZONE_TXT[k].map(([es, en]) => L(es, en)), enumerable: true }); });
  const BOSS_TXT = { explorador: ['¡Jefe!', 'Boss:'], dragon: ['¡Jefe!', 'Boss:'], peque: ['¡Gran premio!', 'Big prize:'], gatito: ['¡Gran premio!', 'Big prize:'] };
  const BOSS = {};
  Object.keys(BOSS_TXT).forEach((k) => { Object.defineProperty(BOSS, k, { get: () => L(BOSS_TXT[k][0], BOSS_TXT[k][1]), enumerable: true }); });

  // Misiones del niño mayor (7 años): sumas, restas, problemas, reloj...
  function buildBoy(pid) {
    const w = PROFILES[pid].w;
    const list = [];
    for (let z = 0; z < 10; z++) {
      const T = w * 10 + z;
      const sMax = at(T20([20, 20, 30, 30, 50, 50, 100], 100), T);
      const carry = T < 5 ? 'no' : 'mix';
      const pl = at(T20([1, 1, 2, 2, 2, 3, 3, 3, 4, 4], 4), T);
      const pl2 = Math.max(1, pl - (T % 2 ? 1 : 0));
      const mMax = at(T20([10, 20, 20, 30, 50, 50, 100], 100), T);
      const oMax = at(T20([20, 20, 30, 50, 50, 100, 100, 100, 200, 500], 1000), T);
      const steps = at([[2, 5, 10], [2, 5, 10], [2, 3, 5, 10], [2, 3, 4, 5, 10], [2, 3, 4, 5, 10]], T);
      const cm = Math.min(sMax, 20);
      const varieties = [
        { t: L('El número escondido', 'The hidden number'), i: '🕵️', g: () => missingQ(mMax) },
        { t: L('Sumas de tres números', 'Adding three numbers'), i: '3️⃣', g: () => sum3Q(Math.min(sMax, 50)) },
        { t: L('¿Cuál es mayor o menor?', 'Which is bigger or smaller?'), i: '⚖️', g: () => compareQ(Math.min(oMax, 100)) },
        { t: L('Dobles y mitades', 'Doubles and halves'), i: '✌️', g: () => doubleQ(Math.min(5 + T * 2, 25)) },
        { t: L('Decenas y unidades', 'Tens and ones'), i: '🔟', g: () => placeQ(Math.min(sMax, 99)) },
        { t: L('Antes, después y en medio', 'Before, after and in between'), i: '↔️', g: () => neighborQ(Math.min(oMax, 100)) },
        { t: L('Monedas y euros', 'Coins and pounds'), i: '💶', g: () => moneyQ(Math.min(10 + T * 3, 50)) },
        { t: L('Series de números', 'Number patterns'), i: '🔢', g: () => seriesQ(steps, T >= 3) },
      ];
      const vA = varieties[(z + w * 3) % 8];
      const vB = varieties[(z + w * 3 + 4) % 8];
      const slots = [
        { t: L(`Sumas hasta ${sMax}`, `Adding up to ${sMax}`), i: '➕', g: () => sumNQ(sMax, carry) },
        { t: L(`Restas hasta ${sMax}`, `Subtracting up to ${sMax}`), i: '➖', g: () => subNQ(sMax) },
        { t: pl <= 1 ? L('Problemas: ¿más o menos?', 'Problems: more or fewer?') : pl === 2 ? L('Problemas: ¿qué cuenta?', 'Problems: which sum?') : L('Problemas: comparar y total', 'Problems: giving and totals'), i: '🔍', g: () => problemQ(pl), r: 4 },
        { t: vA.t, i: vA.i, g: vA.g },
        z % 2 ? { t: L('Ordena los números', 'Put the numbers in order'), i: '📶', g: () => dragOrderQ(Math.min(oMax, 100), T % 2 === 1), r: 4 } : { t: L('Une cuentas y resultados', 'Match sums and answers'), i: '🔗', g: () => connectMathQ(cm, 3 + (T > 4 ? 1 : 0), 'unir-cuentas'), r: 3 },
        { t: L('Problemas de aventura', 'Adventure problems'), i: '🧩', g: () => problemQ(pl2), r: 4 },
        { t: vB.t, i: vB.i, g: vB.g },
        z >= 2 ? { t: z >= 6 ? L('El reloj experto', 'Expert clock') : L('El reloj', 'The clock'), i: z >= 6 ? '🕰️' : '⏰', g: () => clockQ(z >= 5 ? 2 : 1) } : { t: L('Sumas y restas', 'Adding and subtracting'), i: '🧮', g: () => (Math.random() < 0.5 ? sumNQ(sMax, carry) : subNQ(sMax)) },
        { t: L('Sumas y restas mezcladas', 'Mixed adding and subtracting'), i: '🧮', g: () => (Math.random() < 0.5 ? sumNQ(sMax, carry) : subNQ(sMax)), r: 8 },
      ];
      const gens = slots.map((x) => x.g).concat([() => problemQ(pl)]);
      slots.forEach((x, k) => list.push({ title: x.t, icon: x.i, rounds: x.r || 6, gen: x.g, zone: z }));
      list.push({ title: `${BOSS[pid]} ${ZONES[pid][z]}`, icon: '🏆', rounds: 8, gen: () => pick(gens)(), zone: z, boss: true });
    }
    return list;
  }

  // Misiones de la peque (4 años): contar, colores, formas, arrastrar, unir, memoria
  function buildLittle(pid) {
    const w = PROFILES[pid].w;
    const list = [];
    for (let z = 0; z < 10; z++) {
      const T = w * 10 + z;
      const cMax = at(T20([3, 3, 5, 5, 5, 8, 8, 10, 10, 10], 20), T);
      const gMax = at(T20([3, 3, 5, 5, 5, 6, 8, 10, 10, 10], 12), T);
      const dMax = at(T20([3, 4, 5, 6, 6, 8, 8, 10, 10, 10], 12), T);
      const sMax = at(T20([4, 4, 5, 6, 6, 8, 8, 10, 10, 10], 12), T);
      const pairs = at(T20([3, 3, 4, 4, 4, 5, 5, 6, 6, 6], 6), T);
      const cp = at([3, 3, 4, 4, 5], T);
      const colors = at(T20([4, 4, 5, 6, 6, 7, 8], 8), T);
      const varieties = [
        { t: L('Los colores', 'The colours'), i: '🌈', g: () => colorQ(colors) },
        { t: L('Las formas', 'The shapes'), i: '🔺', g: () => shapeQ() },
        { t: L('Cada cosa en su sitio', 'Everything in its place'), i: '📦', g: () => dragSortQ(), r: 3 },
        { t: L('Encaja las formas', 'Fit the shapes'), i: '🧩', g: () => dragShapeQ(), r: 3 },
        { t: L('Une las sombras', 'Match the shadows'), i: '🌑', g: () => connectShadowQ(Math.min(3 + (T > 4 ? 1 : 0) + (T > 11 ? 1 : 0), 5)), r: 3 },
        { t: L('¿Dónde hay más o menos?', 'Where are there more or fewer?'), i: '👀', g: () => moreQ(Math.min(cMax, 8)) },
        { t: L('Sigue el patrón', 'Follow the pattern'), i: '🧶', g: () => patternQ(T >= 6) },
        { t: L('¿Qué número es?', 'Which number is it?'), i: '🔢', g: () => bigNumQ(Math.min(cMax, 12)) },
      ];
      const vA = varieties[(z + w * 3) % 8];
      const vB = varieties[(z + w * 3 + 4) % 8];
      const slots = [
        { t: L(`Cuenta hasta ${cMax}`, `Count up to ${cMax}`), i: '🐮', g: () => countQ(cMax) },
        { t: L('Busca el grupo', 'Find the group'), i: '🐷', g: () => groupQ(gMax) },
        { t: L('Mete en el cesto', 'Put them in the basket'), i: '🧺', g: () => dragCountQ(dMax), r: 4 },
        { t: vA.t, i: vA.i, g: vA.g, r: vA.r },
        { t: L('Junta las frutas', 'Put the fruit together'), i: '🍎', g: () => sumVisualQ(sMax) },
        { t: L('Une números y animales', 'Match numbers and animals'), i: '🔗', g: () => connectNumGroupQ(Math.min(cMax, 10), cp), r: 3 },
        { t: L('Parejas de animales', 'Animal pairs'), i: '🧠', pairs },
        { t: vB.t, i: vB.i, g: vB.g, r: vB.r },
      ];
      const gens = slots.filter((x) => x.g).map((x) => x.g);
      slots.forEach((x) => list.push(x.pairs ? { title: x.t, icon: x.i, kind: 'memory', pairs: x.pairs, zone: z } : { title: x.t, icon: x.i, rounds: x.r || 5, gen: x.g, zone: z }));
      list.push({ title: L(`Mezcla de ${ZONES[pid][z]}`, `Mix: ${ZONES[pid][z]}`), icon: '🎲', rounds: 6, gen: () => pick(gens)(), zone: z });
      list.push({ title: `${BOSS[pid]} ${ZONES[pid][z]}`, icon: '🎁', rounds: 6, gen: () => pick(gens)(), zone: z, boss: true });
    }
    return list;
  }

  const MISSIONS = {};
  const PREFIX = { peque: 'q', gatito: 'g', explorador: 'e', dragon: 'd' };
  function buildMissions() {
    Object.keys(PROFILES).forEach((pid) => {
      const pr = PROFILES[pid];
      const base = pr.family === 'peque' ? buildLittle(pid) : buildBoy(pid);
      MISSIONS[pid] = base.map((m, i) => Object.assign(m, { id: PREFIX[pid] + (i + 1), sticker: stickerFor(pr.w, i) }));
    });
  }
  buildMissions();

  // Rangos por estrellas totales (hay 3 por misión: unas 300 por mundo)
  const RANK_TXT = {
    peque: [[0, '✨', 'Brillito', 'Sparkle'], [12, '🌈', 'Arcoíris', 'Rainbow'], [36, '🌸', 'Flor mágica', 'Magic Flower'], [80, '⭐', 'Estrella', 'Star'], [140, '🦄', 'Unicornio', 'Unicorn'], [220, '👑', 'Reina del reino', 'Queen of the Kingdom']],
    gatito: [[0, '🧶', 'Ovillito', 'Little Yarn Ball'], [12, '🐾', 'Patitas', 'Little Paws'], [36, '🐱', 'Gatita', 'Kitten'], [80, '🌙', 'Gata de luna', 'Moon Cat'], [140, '✨', 'Gata mágica', 'Magic Cat'], [220, '👑', 'Reina de los gatitos', 'Queen of the Kittens']],
    explorador: [[0, '🥚', 'Huevito', 'Little Egg'], [12, '🦎', 'Dinito', 'Baby Dino'], [36, '🦕', 'Dino joven', 'Young Dino'], [80, '🦖', 'Dino fuerte', 'Strong Dino'], [140, '🌋', 'Dino del volcán', 'Volcano Dino'], [220, '👑', 'Rey de los dinos', 'King of the Dinos']],
    dragon: [[0, '🥚', 'Huevo de dragón', 'Dragon Egg'], [12, '🐲', 'Dragoncito', 'Little Dragon'], [36, '🔥', 'Dragón de fuego', 'Fire Dragon'], [80, '⚡', 'Dragón de tormenta', 'Storm Dragon'], [140, '🏰', 'Guardián del castillo', 'Castle Guardian'], [220, '👑', 'Rey de los dragones', 'King of the Dragons']],
  };
  const RANKS = {};
  Object.keys(RANK_TXT).forEach((k) => { Object.defineProperty(RANKS, k, { get: () => RANK_TXT[k].map(([min, icon, es, en]) => ({ min, icon, title: L(es, en) })), enumerable: true }); });

  const SKILL_TXT = {
    contar: ['Contar objetos', 'Counting objects'],
    grupos: ['Relacionar número y cantidad', 'Matching number and quantity'],
    colores: ['Colores', 'Colours'],
    formas: ['Formas', 'Shapes'],
    'sumas-visual': ['Juntar cantidades', 'Putting quantities together'],
    clasificar: ['Clasificar y agrupar', 'Sorting and grouping'],
    'unir-numeros': ['Unir número y cantidad', 'Joining number and quantity'],
    'unir-sombras': ['Unir animales y sombras', 'Joining animals and shadows'],
    sumas: ['Sumas', 'Addition'],
    restas: ['Restas', 'Subtraction'],
    'sumas-faltantes': ['Número escondido (sumas y restas)', 'Hidden number (adding and subtracting)'],
    orden: ['Ordenar números', 'Ordering numbers'],
    'unir-cuentas': ['Unir cuentas y resultados', 'Joining sums and answers'],
    'unir-tablas': ['Unir tablas y resultados', 'Joining times tables and answers'],
    tablas: ['Tablas de multiplicar', 'Times tables'],
    series: ['Series de números', 'Number patterns'],
    reloj: ['Reloj', 'Clock'],
    'prob-masomenos': ['Problemas: saber si habrá más o menos', 'Problems: knowing if there will be more or fewer'],
    'prob-operacion': ['Problemas: elegir suma o resta', 'Problems: choosing add or subtract'],
    'prob-resultado': ['Problemas: calcular el resultado', 'Problems: working out the answer'],
    comparar: ['Mayor y menor', 'Bigger and smaller'],
    dobles: ['Dobles y mitades', 'Doubles and halves'],
    decenas: ['Decenas y unidades', 'Tens and ones'],
    vecinos: ['Antes y después', 'Before and after'],
    dinero: ['Dinero', 'Money'],
    numeros: ['Reconocer números', 'Recognising numbers'],
    'comparar-visual': ['Más y menos (dibujos)', 'More and fewer (pictures)'],
    patrones: ['Patrones', 'Patterns'],
  };
  const SKILL_NAMES = {};
  Object.keys(SKILL_TXT).forEach((k) => { Object.defineProperty(SKILL_NAMES, k, { get: () => L(SKILL_TXT[k][0], SKILL_TXT[k][1]), enumerable: true }); });

  function setLang(l) {
    LANG = l === 'en' ? 'en' : 'es';
    buildMissions();
  }
  const getLang = () => LANG;

  return { PROFILES, KIDS, ZONES, MISSIONS, RANKS, SKILL_NAMES, ANIMALS, rnd, pick, shuffle, sample, setLang, getLang, L };
})();

if (typeof module !== 'undefined') module.exports = Games;
