(async()=>{
  const unpackParts=async paths=>{
    if(!('DecompressionStream' in window)) throw new Error('このブラウザはゲームデータの展開に対応していません。Safari / Chrome / Edge の最新版で開いてください。');
    const encoded=(await Promise.all(paths.map(async path=>{
      const r=await fetch(path,{cache:'no-store'});
      if(!r.ok) throw new Error(`${path}: ${r.status}`);
      return (await r.text()).trim();
    }))).join('');
    const bin=atob(encoded);
    const bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text();
  };
  try{
    const css=await unpackParts(['./style.v4.part.0']);
    const st=document.createElement('style');
    st.textContent=css;
    document.head.appendChild(st);
    const js=await unpackParts([
      './game.v4.p0.0','./game.v4.p0.1','./game.v4.p0.2','./game.v4.p0.3',
      './game.v4.part.1',
      './game.v4.p2.0','./game.v4.p2.1','./game.v4.p2.2','./game.v4.p2.3',
      './game.v4.part.3'
    ]);
    (0,eval)(js);
  }catch(err){
    console.error(err);
    document.querySelector('#app')?.insertAdjacentHTML('afterbegin',`<div style="margin:12px;padding:12px;background:#f0e9d2;color:#20241b;border-radius:6px">読み込みに失敗しました。ページを再読み込みしてください。<br><small>${String(err.message||err)}</small></div>`);
  }
})();
