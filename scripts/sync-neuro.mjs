// Import the comp-neuro Obsidian drafts that were copied into the repo root.
//   node scripts/sync-neuro.mjs
// For each known file in the root: add front matter, replace a "(widget)" line with the Ising widget,
// write src/content/posts/<slug>.md, and remove the root copy. Unknown .md files are reported, not touched.
import { existsSync, readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs';

// Obsidian file name -> post. `order` sets the order on the series page.
const posts = {
  'Exploring Hopfield networks': { slug: 'exploring-hopfield-networks', order: 0 },
  'What is a spin glass network?': { slug: 'spin-glass-networks', order: 1 },
  'Hopfield networks': { slug: 'hopfield-networks', order: 2 },
  'Modern Hopfield networks': { slug: 'modern-hopfield-networks', order: 3 },
};
// A line containing only one of these markers becomes that widget.
const widgets = {
  '(widget)': '<div data-widget="ising"></div>',
  '(widget: ising)': '<div data-widget="ising"></div>',
  '(widget: field)': '<div data-widget="ising-field"></div>',
  '(widget: draw)': '<div data-widget="ising-draw"></div>',
};
const ignore = new Set(['README.md', 'WEBSITE_BRIEF.md', 'CLAUDE.md', 'CLAUDE.local.md']);

const date = new Date().toISOString().slice(0, 10);
for (const [name, { slug, order, title = name }] of Object.entries(posts)) {
  const src = `${name}.md`;
  if (!existsSync(src)) continue;
  const dest = `src/content/posts/${slug}.md`;
  // Keep the original date if the post already exists.
  const oldDate = existsSync(dest) && readFileSync(dest, 'utf8').match(/^date:\s*(\S+)/m)?.[1];
  const body = readFileSync(src, 'utf8')
    .split('\n')
    .map((line) => widgets[line.trim()] ?? line)
    .join('\n')
    .replace(/^\s*\n/, '');
  const front = ['---', `title: ${JSON.stringify(title)}`, `date: ${oldDate || date}`, 'unlisted: true', 'series: comp-neuro', `order: ${order}`, '---', ''];
  writeFileSync(dest, front.join('\n') + body + (body.endsWith('\n') ? '' : '\n'));
  rmSync(src);
  console.log(`${src} -> ${dest}`);
}
for (const f of readdirSync('.').filter((f) => f.endsWith('.md') && !ignore.has(f) && !(f.slice(0, -3) in posts))) {
  console.log(`not imported (add it to scripts/sync-neuro.mjs): ${f}`);
}
