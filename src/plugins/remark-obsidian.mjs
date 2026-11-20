// Lets Obsidian drafts render as-is:
//   [[Note title]] / [[Note title|shown text]]  -> link to the post with that title or file name
//                                                  (plain text if no such post exists yet)
//   > [!type] Title  (callouts, with -/+ for collapsible) -> <div class="callout callout-type">
// Plain blockquotes are left alone and styled as asides in CSS.
import { readdirSync, readFileSync } from 'node:fs';

const postsDir = './src/content/posts';

function postIndex() {
  const index = new Map();
  for (const f of readdirSync(postsDir).filter((f) => /\.mdx?$/.test(f))) {
    const slug = f.replace(/\.mdx?$/, '');
    const front = readFileSync(`${postsDir}/${f}`, 'utf8').split(/^---$/m)[1] ?? '';
    const title = front.match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1];
    index.set(slug.toLowerCase(), slug);
    if (title) index.set(title.toLowerCase(), slug);
  }
  return index;
}

function walk(node, fn, parent = null) {
  fn(node, parent);
  if (node.children) for (const child of [...node.children]) walk(child, fn, node);
}

function wikilinks(tree, index) {
  walk(tree, (node) => {
    if (!node.children) return;
    node.children = node.children.flatMap((child) => {
      if (child.type !== 'text' || !child.value.includes('[[')) return [child];
      const out = [];
      let last = 0;
      for (const m of child.value.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g)) {
        if (m.index > last) out.push({ type: 'text', value: child.value.slice(last, m.index) });
        const target = m[1].trim();
        const label = (m[2] ?? target).trim();
        const slug = index.get(target.toLowerCase());
        out.push(slug ? { type: 'link', url: `/posts/${slug}/`, children: [{ type: 'text', value: label }] } : { type: 'text', value: label });
        last = m.index + m[0].length;
      }
      if (last < child.value.length) out.push({ type: 'text', value: child.value.slice(last) });
      return out;
    });
  });
}

function callouts(tree) {
  walk(tree, (node) => {
    if (node.type !== 'blockquote') return;
    const first = node.children[0];
    const head = first?.type === 'paragraph' && first.children[0];
    const m = head?.type === 'text' && head.value.match(/^\[!([^\]]+)\]([+-]?)[ \t]*/);
    if (!m) return;
    const rawType = m[1].trim();
    const type = rawType.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fold = m[2];
    head.value = head.value.slice(m[0].length);

    // The title is whatever is on the tag's line; anything after the first newline is body text.
    const title = [];
    const rest = [];
    let inTitle = true;
    for (const child of first.children) {
      if (inTitle && child.type === 'text' && child.value.includes('\n')) {
        const i = child.value.indexOf('\n');
        title.push({ type: 'text', value: child.value.slice(0, i) });
        rest.push({ type: 'text', value: child.value.slice(i + 1) });
        inTitle = false;
      } else (inTitle ? title : rest).push(child);
    }
    const hasTitle = title.some((c) => c.type !== 'text' || c.value.trim());
    // "> [!Theorem] Some title" -> title "Theorem: Some title"; with no title, just "Theorem".
    const typeName = rawType[0].toUpperCase() + rawType.slice(1);
    const titleChildren = hasTitle
      ? [{ type: 'calloutLabel', data: { hName: 'span', hProperties: { className: ['callout-label'] } }, children: [{ type: 'text', value: `${typeName}:` }] }, { type: 'text', value: ' ' }, ...title]
      : [{ type: 'text', value: typeName }];

    const body = node.children.slice(1);
    if (rest.some((c) => c.type !== 'text' || c.value.trim())) body.unshift({ type: 'paragraph', children: rest });

    node.type = 'callout';
    node.data = { hName: fold ? 'details' : 'div', hProperties: { className: ['callout', `callout-${type}`], ...(fold === '+' ? { open: true } : {}) } };
    node.children = [
      { type: 'calloutTitle', data: { hName: fold ? 'summary' : 'div', hProperties: { className: ['callout-title'] } }, children: titleChildren },
      { type: 'calloutBody', data: { hName: 'div', hProperties: { className: ['callout-body'] } }, children: body },
    ];
  });
}

// remark-math only treats $$ as display math when the $$ are on their own lines; `$$ x $$` written
// on one line (or mid-sentence) becomes inline math. Obsidian shows those as display math, so match it
// by splitting the paragraph around them.
function displayMath(tree, source) {
  const isDouble = (n) => n.type === 'inlineMath' && n.position && source.startsWith('$$', n.position.start.offset);
  walk(tree, (node) => {
    if (!node.children?.some((c) => c.type === 'paragraph' && c.children.some(isDouble))) return;
    node.children = node.children.flatMap((child) => {
      if (child.type !== 'paragraph' || !child.children.some(isDouble)) return [child];
      const out = [];
      let run = [];
      const flush = () => {
        // Trim the whitespace/newlines left at the edges of each split piece.
        if (run.length && run[0].type === 'text') run[0] = { ...run[0], value: run[0].value.replace(/^\s+/, '') };
        const l = run.length - 1;
        if (l >= 0 && run[l].type === 'text') run[l] = { ...run[l], value: run[l].value.replace(/\s+$/, '') };
        if (run.some((c) => c.type !== 'text' || c.value)) out.push({ type: 'paragraph', children: run });
        run = [];
      };
      for (const c of child.children) {
        if (isDouble(c)) {
          flush();
          out.push({ type: 'math', value: c.value, data: { hName: 'pre', hChildren: [{ type: 'element', tagName: 'code', properties: { className: ['language-math', 'math-display'] }, children: [{ type: 'text', value: c.value }] }] } });
        } else run.push(c);
      }
      flush();
      return out;
    });
  });
}

// Obsidian shows a single newline as a line break (its default "strict line breaks: off").
function lineBreaks(tree) {
  walk(tree, (node) => {
    if (!node.children || node.type === 'code' || node.type === 'math') return;
    node.children = node.children.flatMap((child) => {
      if (child.type !== 'text' || !child.value.includes('\n')) return [child];
      return child.value.split('\n').flatMap((v, i) => (i ? [{ type: 'break' }] : []).concat(v ? [{ type: 'text', value: v }] : []));
    });
  });
}

export default function remarkObsidian() {
  return (tree, file) => {
    displayMath(tree, String(file.value));
    wikilinks(tree, postIndex());
    callouts(tree);
    lineBreaks(tree);
  };
}
