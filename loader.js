(async()=>{
  const unpackParts=async paths=>{
    if(!('DecompressionStream' in window)) throw new Error('このブラウザはゲームデータの展開に対応していません。Chrome / Edge / Safari の最新版で開いてください。');
    const encoded=await Promise.all(paths.map(async path=>{
      const res=await fetch(path);
      if(!res.ok) throw new Error(`${path}: ${res.status}`);
      return (await res.text()).trim();
    }));
    const chunks=encoded.map(text=>{
      const bin=atob(text);
      const bytes=new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
      return bytes;
    });
    const total=chunks.reduce((n,c)=>n+c.length,0);
    const merged=new Uint8Array(total);
    let offset=0;
    for(const chunk of chunks){ merged.set(chunk,offset); offset+=chunk.length; }
    const stream=new Blob([merged]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text();
  };
  try{
    const css=await unpackParts(['./style.part.0']);
    const style=document.createElement('style');
    style.textContent=css;
    document.head.appendChild(style);
    const code=await unpackParts(['./game.part.0','./game.part.1','./game.part.2','./game.part.3']);
    (0,eval)(code);
  }catch(err){
    console.error(err);
    const app=document.querySelector('#app');
    if(app) app.insertAdjacentHTML('afterbegin',`<div style="margin:12px;padding:12px;background:#f0e9d2;color:#20241b;border-radius:6px">読み込みに失敗しました。ページを再読み込みしてください。<br><small>${String(err.message||err)}</small></div>`);
  }
})();
