// 2D Ising model widgets (Metropolis, periodic boundary). Embed in a post with one of:
//   <div data-widget="ising"></div>        temperature slider
//   <div data-widget="ising-field"></div>  temperature + magnetic field sliders
//   <div data-widget="ising-draw"></div>   temperature slider; draw on the grid to make couplings -1
//
// Energy: H = -sum_{<i,j>} J_ij s_i s_j - h sum_i s_i, with J_ij = +1, except J_ij = -1 on every bond
// that touches a drawn (yellow) tile.
const N = 512;
const UP: [number, number, number] = [43, 108, 176]; // blue, spin +1
const DOWN: [number, number, number] = [197, 48, 48]; // red, spin -1
const DRAWN: [number, number, number] = [236, 196, 64]; // yellow, tiles whose bonds are -1
const TC = 2 / Math.log(1 + Math.SQRT2); // ≈ 2.269
const BRUSH = 6; // drawing radius, in cells

type Variant = 'ising' | 'ising-field' | 'ising-draw';

function slider(name: string, min: number, max: number, value: number) {
  return `<label class="widget-control">
      <span>${name} = <output></output></span>
      <input type="range" min="${min}" max="${max}" step="0.01" value="${value.toFixed(2)}" />
    </label>`;
}

export function mountIsing(root: HTMLElement, variant: Variant) {
  const field = variant === 'ising-field';
  const draw = variant === 'ising-draw';
  root.classList.add('widget', 'ising');
  root.innerHTML = `
    <canvas width="${N}" height="${N}" aria-label="Ising model simulation: blue and red squares are up and down spins${draw ? '; drag to draw yellow tiles whose couplings are -1' : ''}"></canvas>
    ${slider('<i>T</i>', 0.5, 5, TC)}
    ${field ? slider('<i>h</i>', -1, 1, 0) : ''}
    ${draw ? '<p class="widget-row"><span class="widget-hint">Drag on the grid to draw. Shift-drag erases.</span><button type="button">Clear</button></p>' : ''}`;
  const canvas = root.querySelector('canvas')!;
  const [tInput, hInput] = root.querySelectorAll('input');
  const [tOut, hOut] = root.querySelectorAll('output');
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(N, N);

  const s = new Int8Array(N * N).map(() => (Math.random() < 0.5 ? 1 : -1));
  const drawn = new Uint8Array(N * N); // 1 = yellow tile: all four of its bonds have J = -1

  // Flipping s_i changes the energy by dE = 2 s_i (local + h), where local = sum_j J_ij s_j ∈ {-4,-2,0,2,4}.
  // accept[(s_i > 0 ? 9 : 0) + local + 4] = min(1, e^{-dE/T}).
  const accept = new Float64Array(18);
  const update = () => {
    const T = +tInput.value;
    const h = hInput ? +hInput.value : 0;
    for (const si of [-1, 1]) {
      for (let local = -4; local <= 4; local++) accept[(si > 0 ? 9 : 0) + local + 4] = Math.min(1, Math.exp((-2 * si * (local + h)) / T));
    }
    tOut.innerHTML = T.toFixed(2) + (Math.abs(T - TC) < 0.02 ? ' ≈ <i>T</i><sub>c</sub>' : '');
    if (hOut) hOut.textContent = h.toFixed(2);
  };
  tInput.addEventListener('input', update);
  hInput?.addEventListener('input', update);
  update();

  const sweep = () => {
    for (let k = 0; k < N * N; k++) {
      const i = (Math.random() * N * N) | 0;
      const x = i % N, y = (i / N) | 0;
      const r = y * N + ((x + 1) % N), l = y * N + ((x + N - 1) % N);
      const d = ((y + 1) % N) * N + x, u = ((y + N - 1) % N) * N + x;
      let local;
      if (drawn[i]) local = -(s[r] + s[l] + s[d] + s[u]);
      else local = (drawn[r] ? -s[r] : s[r]) + (drawn[l] ? -s[l] : s[l]) + (drawn[d] ? -s[d] : s[d]) + (drawn[u] ? -s[u] : s[u]);
      const p = accept[(s[i] > 0 ? 9 : 0) + local + 4];
      if (p >= 1 || Math.random() < p) s[i] = -s[i];
    }
  };

  const paint = () => {
    for (let i = 0; i < N * N; i++) {
      const [r, g, b] = drawn[i] ? DRAWN : s[i] > 0 ? UP : DOWN;
      img.data[4 * i] = r; img.data[4 * i + 1] = g; img.data[4 * i + 2] = b; img.data[4 * i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  };

  if (draw) {
    canvas.style.touchAction = 'none';
    canvas.style.cursor = 'crosshair';
    const cell = (e: PointerEvent): [number, number] => {
      const rect = canvas.getBoundingClientRect();
      return [((e.clientX - rect.left) / rect.width) * N, ((e.clientY - rect.top) / rect.height) * N];
    };
    const disc = (cx: number, cy: number, value: number) => {
      for (let dy = -BRUSH; dy <= BRUSH; dy++) {
        for (let dx = -BRUSH; dx <= BRUSH; dx++) {
          if (dx * dx + dy * dy > BRUSH * BRUSH) continue;
          const x = Math.floor(cx + dx), y = Math.floor(cy + dy);
          if (x >= 0 && x < N && y >= 0 && y < N) drawn[y * N + x] = value;
        }
      }
    };
    let last: [number, number] | null = null;
    const stroke = (e: PointerEvent) => {
      const value = e.shiftKey ? 0 : 1;
      const [x, y] = cell(e);
      const [x0, y0] = last ?? [x, y];
      // Fill in between pointer events so fast strokes stay continuous.
      const steps = Math.max(1, Math.ceil(Math.hypot(x - x0, y - y0) / (BRUSH / 2)));
      for (let t = 1; t <= steps; t++) disc(x0 + ((x - x0) * t) / steps, y0 + ((y - y0) * t) / steps, value);
      last = [x, y];
      paint();
    };
    let drawing = false;
    canvas.addEventListener('pointerdown', (e) => {
      drawing = true;
      last = null;
      try { canvas.setPointerCapture(e.pointerId); } catch {}
      stroke(e);
    });
    canvas.addEventListener('pointermove', (e) => { if (drawing) stroke(e); });
    const end = () => { drawing = false; last = null; };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    root.querySelector('button')!.addEventListener('click', () => { drawn.fill(0); paint(); });
  }

  // Only run while on screen.
  let visible = false, frame = 0;
  const tick = () => {
    if (!visible) return;
    sweep();
    paint();
    frame = requestAnimationFrame(tick);
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(frame);
    if (visible) tick();
  }).observe(canvas);
  paint();
}

for (const el of document.querySelectorAll<HTMLElement>('[data-widget^="ising"]')) {
  const v = el.dataset.widget as Variant;
  if (v === 'ising' || v === 'ising-field' || v === 'ising-draw') mountIsing(el, v);
}
