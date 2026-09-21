const unpackParts = async (paths) => {
  if (!('DecompressionStream' in window)) {
    throw new Error('このブラウザはゲームデータの展開に対応していません。Safari / Chrome / Edge の最新版で開いてください。');
  }
  const encoded = (await Promise.all(paths.map(async (path) => {
    const r = await fetch(path, { cache: 'no-store' });
    if (!r.ok) throw new Error(`${path}: ${r.status}`);
    return (await r.text()).trim();
  }))).join('');
  const bin = atob(encoded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
};

const loadText = async (path) => {
  const r = await fetch(path, { cache: 'no-store' });
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return r.text();
};

try {
  const css = await unpackParts(['./v5-css.gz.part.00?v=5']);
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  (0, eval)(await loadText('./v5-data.js?v=5'));

  const world = await unpackParts([
    './v5-world.gz.part.00?v=5',
    './v5-world.gz.part.01?v=5'
  ]);
  (0, eval)(world);

  const ui = await unpackParts([
    './v5-ui.gz.part.00?v=5',
    './v5-ui.gz.part.01?v=5'
  ]);
  (0, eval)(ui);

  (0, eval)(await loadText('./v5-patch.js?v=5'));
} catch (err) {
  console.error(err);
  const app = document.querySelector('#app');
  app?.insertAdjacentHTML('afterbegin',
    `<div style="margin:12px;padding:12px;background:#f0e9d2;color:#20241b;border-radius:8px">v5の読み込みに失敗しました。ページを再読み込みしてください。<br><small>${String(err?.message || err)}</small></div>`
  );
}