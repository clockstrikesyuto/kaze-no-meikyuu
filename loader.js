(async()=>{
  const unpack=async path=>{
    const res=await fetch(path);
    if(!res.ok) throw new Error(`${path}: ${res.status}`);
    if(!('DecompressionStream' in window)) throw new Error('このブラウザはゲームデータの展開に対応していません。Chrome / Edge / Safari の最新版で開いてください。');
    const stream=res.body.pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text();
  };
  try{
    const css=await unpack('./style.css.gz');
    const style=document.createElement('style');
    style.textContent=css;
    document.head.appendChild(style);
    const code=await unpack('./game.js.gz');
    (0,eval)(code);
  }catch(err){
    console.error(err);
    const app=document.querySelector('#app');
    if(app) app.insertAdjacentHTML('afterbegin',`<div style="margin:12px;padding:12px;background:#f0e9d2;color:#20241b;border-radius:6px">読み込みに失敗しました。ページを再読み込みしてください。<br><small>${String(err.message||err)}</small></div>`);
  }
})();
