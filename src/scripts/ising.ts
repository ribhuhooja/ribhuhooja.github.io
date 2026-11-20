// Preliminary sketch: 2D Ising model (Metropolis, periodic boundary) with a temperature slider.
// Embed in a post with: <div data-widget="ising"></div>
const N = 512;
const UP: [number, number, number] = [43, 108, 176]; // blue, spin +1
const DOWN: [number, number, number] = [197, 48, 48]; // red, spin -1
const TC = 2 / Math.log(1 + Math.SQRT2); // ≈ 2.269

export function mountIsing(root: HTMLElement) {
  root.classList.add('widget', 'ising');
  root.innerHTML = `
    <canvas width="${N}" height="${N}" aria-label="Ising model simulation: blue and red squares are up and down spins"></canvas>
    <label class="widget-control">
      <span><i>T</i> = <output></output></span>
      <input type="range" min="0.5" max="5" step="0.01" value="${TC.toFixed(2)}" />
    </label>`;
  const canvas = root.querySelector('canvas')!;
  const slider = root.querySelector('input')!;
  const out = root.querySelector('output')!;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(N, N);

  const s = new Int8Array(N * N).map(() => (Math.random() < 0.5 ? 1 : -1));
  let T = +slider.value;
  // Flipping spin i changes the energy by dE = 2 s_i (sum of neighbours) ∈ {-8,-4,0,4,8}; accept with prob min(1, e^{-dE/T}).
  let accept4 = 0, accept8 = 0;
  const setT = () => {
    T = +slider.value;
    accept4 = Math.exp(-4 / T);
    accept8 = Math.exp(-8 / T);
    out.innerHTML = T.toFixed(2) + (Math.abs(T - TC) < 0.02 ? ' ≈ <i>T</i><sub>c</sub>' : '');
  };
  slider.addEventListener('input', setT);
  setT();

  const sweep = () => {
    for (let k = 0; k < N * N; k++) {
      const i = (Math.random() * N * N) | 0;
      const x = i % N, y = (i / N) | 0;
      const nb = s[y * N + ((x + 1) % N)] + s[y * N + ((x + N - 1) % N)] + s[((y + 1) % N) * N + x] + s[((y + N - 1) % N) * N + x];
      const dE = 2 * s[i] * nb;
      if (dE <= 0 || Math.random() < (dE === 4 ? accept4 : accept8)) s[i] = -s[i] as -1 | 1;
    }
  };

  const draw = () => {
    for (let i = 0; i < N * N; i++) {
      const [r, g, b] = s[i] > 0 ? UP : DOWN;
      img.data[4 * i] = r; img.data[4 * i + 1] = g; img.data[4 * i + 2] = b; img.data[4 * i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  };

  // Only run while on screen.
  let visible = false, frame = 0;
  const tick = () => {
    if (!visible) return;
    sweep();
    draw();
    frame = requestAnimationFrame(tick);
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(frame);
    if (visible) tick();
  }).observe(canvas);
  draw();
}

for (const el of document.querySelectorAll<HTMLElement>('[data-widget="ising"]')) mountIsing(el);
