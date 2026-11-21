// 2D XY model widget (Metropolis, periodic boundary). Embed in a post with: <div data-widget="xy"></div>
//
// Each spin is an angle θ_i, drawn as a hue. Energy: H = -sum_{<i,j>} cos(θ_i - θ_j).
// Vortices show up as points where every color meets.
const N = 256;
const TKT = 0.893; // Kosterlitz–Thouless temperature for J = 1
const HUES = 360;

// Hue wheel lookup: angle bucket -> rgb.
const wheel = new Uint8Array(HUES * 3);
for (let k = 0; k < HUES; k++) {
  const h = (k / HUES) * 6, x = 1 - Math.abs((h % 2) - 1);
  const [r, g, b] = h < 1 ? [1, x, 0] : h < 2 ? [x, 1, 0] : h < 3 ? [0, 1, x] : h < 4 ? [0, x, 1] : h < 5 ? [x, 0, 1] : [1, 0, x];
  // Slightly muted so it sits well on the page.
  wheel.set([40 + 190 * r, 40 + 190 * g, 40 + 190 * b], 3 * k);
}

export function mountXY(root: HTMLElement) {
  root.classList.add('widget', 'xy');
  root.innerHTML = `
    <canvas width="${N}" height="${N}" aria-label="XY model simulation: each square's color is its spin angle; vortices are points where all colors meet"></canvas>
    <label class="widget-control">
      <span><i>T</i> = <output></output></span>
      <input type="range" min="0.05" max="2" step="0.01" value="0.30" />
    </label>
    <p class="widget-row"><span class="widget-hint">Color = spin angle.</span><button type="button">Randomize</button></p>`;
  const canvas = root.querySelector('canvas')!;
  const input = root.querySelector('input')!;
  const out = root.querySelector('output')!;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(N, N);

  // Keep cos θ and sin θ per site so each update needs only one new cos/sin.
  const theta = new Float64Array(N * N), c = new Float64Array(N * N), s = new Float64Array(N * N);
  const randomize = () => {
    for (let i = 0; i < N * N; i++) {
      theta[i] = Math.random() * 2 * Math.PI;
      c[i] = Math.cos(theta[i]);
      s[i] = Math.sin(theta[i]);
    }
  };
  randomize();

  let T = 0, step = 0;
  const update = () => {
    T = +input.value;
    step = Math.min(2 * Math.PI, 4 * T); // proposal width: small moves at low T keep acceptance reasonable
    out.innerHTML = T.toFixed(2) + (Math.abs(T - TKT) < 0.02 ? ' ≈ <i>T</i><sub>KT</sub>' : '');
  };
  input.addEventListener('input', update);
  update();

  const sweep = () => {
    for (let k = 0; k < N * N; k++) {
      const i = (Math.random() * N * N) | 0;
      const x = i % N, y = (i / N) | 0;
      const r = y * N + ((x + 1) % N), l = y * N + ((x + N - 1) % N);
      const d = ((y + 1) % N) * N + x, u = ((y + N - 1) % N) * N + x;
      // Local field from the neighbours; the site's energy is -(cos θ_i hx + sin θ_i hy).
      const hx = c[r] + c[l] + c[d] + c[u], hy = s[r] + s[l] + s[d] + s[u];
      const t = theta[i] + (Math.random() - 0.5) * step;
      const ct = Math.cos(t), st = Math.sin(t);
      const dE = -((ct - c[i]) * hx + (st - s[i]) * hy);
      if (dE <= 0 || Math.random() < Math.exp(-dE / T)) {
        theta[i] = t; c[i] = ct; s[i] = st;
      }
    }
  };

  const paint = () => {
    for (let i = 0; i < N * N; i++) {
      let a = theta[i] % (2 * Math.PI);
      if (a < 0) a += 2 * Math.PI;
      const k = 3 * (((a / (2 * Math.PI)) * HUES) | 0) % (3 * HUES);
      img.data[4 * i] = wheel[k]; img.data[4 * i + 1] = wheel[k + 1]; img.data[4 * i + 2] = wheel[k + 2]; img.data[4 * i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  };

  root.querySelector('button')!.addEventListener('click', () => { randomize(); paint(); });

  // Only run while on screen.
  let visible = false, frame = 0;
  const tick = () => {
    if (!visible) return;
    // XY coarsening is slow, so spend ~8 ms of each frame sweeping (at least one sweep).
    const start = performance.now();
    do sweep(); while (performance.now() - start < 8);
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

for (const el of document.querySelectorAll<HTMLElement>('[data-widget="xy"]')) mountXY(el);
