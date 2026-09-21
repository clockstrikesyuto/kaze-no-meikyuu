(() => {
  const W = window.WM;
  if (!W) return;

  const discoveredCount = () => W.MONSTERS.filter(m => W.meta?.seen?.[m.id]).length;
  const syncDex = () => {
    const el = document.querySelector('#metaDex');
    if (el) el.textContent = `${discoveredCount()}/${W.MONSTERS.length}`;
    const sum = document.querySelector('#bestiarySummary');
    if (sum) sum.textContent = `発見 ${discoveredCount()} / ${W.MONSTERS.length}種`;
  };

  const originalOpenTitle = W.openTitle;
  W.openTitle = (...args) => {
    const out = originalOpenTitle?.(...args);
    syncDex();
    return out;
  };

  const originalAdvance = W.advanceTurn;
  W.advanceTurn = (...args) => {
    const out = originalAdvance(...args);
    const s = W.state;
    if (s) {
      const boss = s.monsters?.find(m => m.boss && m.id === 'boss30');
      if (boss && boss.hp > 0 && boss.phase === 1 && boss.hp <= boss.maxHp * 0.5) {
        boss.phase = 2;
        boss.atk += 3;
        boss.skill = 'cross';
        boss.hp = Math.min(boss.maxHp, boss.hp + Math.ceil(boss.maxHp * 0.12));
        boss.telegraph = null;
        W.log('紅月の守護者が第二形態へ！ 攻撃範囲が十字に変化した。', 'danger');
        W.saveGame?.();
        W.render?.();
      }
    }
    return out;
  };

  const originalResult = W.showResult;
  W.showResult = (s, cause, clear) => {
    const out = originalResult?.(s, cause, clear);
    const retry = document.querySelector('#retryBtn');
    if (retry) {
      retry.textContent = s.mode === 'deep' ? '深層50Fへもう一度' : s.mode === 'abyss' ? '奈落99Fへもう一度' : '30Fへもう一度';
      retry.onclick = () => W.startRun(s.mode || 'standard');
    }
    syncDex();
    return out;
  };

  document.addEventListener('DOMContentLoaded', () => {
    syncDex();
    ['#bestiaryBtn','#mobileBestiary','#monsterBookBtn','#bestiaryFloor'].forEach(sel => {
      document.querySelector(sel)?.addEventListener('click', () => setTimeout(syncDex, 0));
      document.querySelector(sel)?.addEventListener('change', () => setTimeout(syncDex, 0));
    });
  });
})();