window.WM=window.WM||{};
(()=>{
const W=window.WM;
W.VERSION='5.0';
W.DIRS={up:{dx:0,dy:-1,f:'up'},down:{dx:0,dy:1,f:'down'},left:{dx:-1,dy:0,f:'left'},right:{dx:1,dy:0,f:'right'}};
W.DIR_LIST=Object.values(W.DIRS);
W.clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
W.rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
W.pick=a=>a[Math.floor(Math.random()*a.length)];
W.key=(x,y)=>`${x},${y}`;
W.dist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
W.THEMES=[
 {min:1,max:10,name:'風草の遺跡',sub:'風が草を撫でる、旅の入口',floor:'#76694f',wall:'#273d31',wall2:'#38553f',accent:'#c7df91',fog:'#0b120e'},
 {min:11,max:20,name:'碧影洞',sub:'青い鉱石と水音が響く洞窟',floor:'#465b61',wall:'#172f38',wall2:'#225063',accent:'#76d3d7',fog:'#071219'},
 {min:21,max:30,name:'紅月神殿',sub:'赤い月を祀る古い神殿',floor:'#65483f',wall:'#351b23',wall2:'#5a2834',accent:'#ef9c8d',fog:'#17090d'},
 {min:31,max:40,name:'灰燼の奈落',sub:'熱と灰が漂う深層',floor:'#514942',wall:'#261f1c',wall2:'#493429',accent:'#e4a36f',fog:'#120d0a'},
 {min:41,max:50,name:'天裂の聖域',sub:'砕けた空が覗く最深層',floor:'#5a596d',wall:'#29283e',wall2:'#41416a',accent:'#b9b9ff',fog:'#0b0b18'},
 {min:51,max:60,name:'白霧回廊',sub:'距離感を奪う白い迷宮',floor:'#72797d',wall:'#354048',wall2:'#52616b',accent:'#e9f7ff',fog:'#151a1e'},
 {min:61,max:70,name:'黒玻璃宮',sub:'黒い鏡が影を映す宮殿',floor:'#44414c',wall:'#17151d',wall2:'#2e2837',accent:'#c2a9ff',fog:'#08070c'},
 {min:71,max:80,name:'雷鳴尖塔',sub:'雷光が走る天空塔',floor:'#555348',wall:'#25271f',wall2:'#484c31',accent:'#f3df6b',fog:'#111109'},
 {min:81,max:90,name:'星喰い庭園',sub:'星屑の花が咲く異界',floor:'#454e59',wall:'#181f2e',wall2:'#283b59',accent:'#8fd4ff',fog:'#070b12'},
 {min:91,max:99,name:'終風の王座',sub:'風の迷宮、その果て',floor:'#56464d',wall:'#1f1018',wall2:'#4d1f32',accent:'#ffbacf',fog:'#0d0508'}
];
W.themeFor=f=>W.THEMES.find(t=>f>=t.min&&f<=t.max)||W.THEMES.at(-1);
W.SPECIAL_FLOORS={
 dark:{name:'暗闇階',desc:'視界が狭い。音を頼りに進め。',chance:.15},
 trap:{name:'罠密集階',desc:'罠が通常より多い。足元注意。',chance:.12},
 treasury:{name:'宝物庫',desc:'道具が多い代わりに精鋭が守る。',chance:.08},
 rest:{name:'風だまり',desc:'敵がいない休息階。少し回復する。',chance:.07},
 flooded:{name:'水没階',desc:'水路が多く、進路が限られる。',chance:.10}
};
W.STATUS_INFO={poison:['毒','毎ターン1ダメージ'],sleep:['眠り','行動不能。攻撃されると起きる'],confuse:['混乱','移動方向が乱れる'],slow:['鈍足','2回に1回しか行動できない'],seal:['封印','道具を使えない']};
W.MONSTERS=[
 {id:'moss',name:'苔ネズミ',min:1,max:8,hp:10,atk:4,def:0,exp:4,special:'なし',shape:'mouse'},
 {id:'horn',name:'ツノモグラ',min:3,max:14,hp:16,atk:6,def:1,exp:7,special:'ときどき力強い一撃',shape:'mole'},
 {id:'bat',name:'青影コウモリ',min:8,max:22,hp:18,atk:7,def:1,exp:9,special:'低確率で眠り',shape:'bat',status:'sleep'},
 {id:'slime',name:'毒沼スライム',min:10,max:26,hp:24,atk:7,def:2,exp:11,special:'低確率で毒',shape:'slime',status:'poison'},
 {id:'gob',name:'洞窟ゴブリン',min:13,max:30,hp:28,atk:9,def:2,exp:13,special:'道具を拾うことがある',shape:'goblin'},
 {id:'eye',name:'迷い眼',min:16,max:35,hp:22,atk:8,def:2,exp:14,special:'低確率で混乱',shape:'eye',status:'confuse'},
 {id:'cinder',name:'火粉術師',min:18,max:42,hp:25,atk:10,def:2,exp:17,special:'一直線4マスへ火の粉。連射不可',shape:'mage',ranged:true},
 {id:'armor',name:'鉄殻兵',min:22,max:50,hp:42,atk:11,def:5,exp:20,special:'防御が高い',shape:'armor'},
 {id:'ghost',name:'封じ霊',min:25,max:60,hp:30,atk:10,def:3,exp:21,special:'低確率で封印',shape:'ghost',status:'seal'},
 {id:'wolf',name:'疾風狼',min:27,max:70,hp:34,atk:12,def:3,exp:24,special:'たまに2回移動',shape:'wolf',fast:true},
 {id:'ogre',name:'灰角鬼',min:31,max:80,hp:52,atk:15,def:5,exp:30,special:'高威力だが鈍い',shape:'ogre'},
 {id:'witch',name:'霧魔女',min:41,max:90,hp:44,atk:14,def:4,exp:34,special:'眠り・混乱を使う',shape:'witch',status:'confuse'},
 {id:'knight',name:'星喰い騎士',min:51,max:99,hp:62,atk:17,def:7,exp:42,special:'高い攻防',shape:'knight'}
];
W.BOSSES={
 10:{id:'boss10',name:'疾嵐獣ガルム',hp:95,atk:12,def:3,shape:'wolf',boss:true,skill:'charge',desc:'直線突進。赤い予兆線の次ターンに突撃する。'},
 20:{id:'boss20',name:'蒼火の神官',hp:150,atk:15,def:4,shape:'mage',boss:true,skill:'cross',desc:'十字炎と眷属召喚。攻撃範囲が1ターン前に光る。'},
 30:{id:'boss30',name:'紅月の守護者',hp:230,atk:18,def:6,shape:'knight',boss:true,skill:'phase',desc:'HP半分で第二形態。周囲攻撃には予兆が出る。'},
 40:{id:'boss40',name:'灰燼王ベヘム',hp:310,atk:21,def:7,shape:'ogre',boss:true,skill:'quake',desc:'地割れ予兆から広範囲攻撃。'},
 50:{id:'boss50',name:'天裂竜ヴァル',hp:420,atk:24,def:9,shape:'dragon',boss:true,skill:'storm',desc:'風刃と召喚を組み合わせる深層の王。'},
 60:{id:'boss60',name:'白霧の女王',hp:500,atk:26,def:10,shape:'witch',boss:true,skill:'cross',desc:'霧と状態異常を操る。'},
 70:{id:'boss70',name:'黒玻璃の巨像',hp:600,atk:28,def:12,shape:'armor',boss:true,skill:'quake',desc:'重い一撃と反射の構え。'},
 80:{id:'boss80',name:'雷帝グリフォン',hp:720,atk:30,def:12,shape:'wolf',boss:true,skill:'charge',desc:'高速突進と雷撃。'},
 90:{id:'boss90',name:'星喰いの主',hp:850,atk:33,def:14,shape:'eye',boss:true,skill:'storm',desc:'召喚と広範囲攻撃を繰り返す。'},
 99:{id:'boss99',name:'終風王アネモス',hp:1100,atk:36,def:16,shape:'dragon',boss:true,skill:'final',desc:'迷宮の最終存在。すべての攻撃に明確な予兆がある。'}
};
W.WEAPON_NAMES=['旅人の短剣','風切りの剣','洞窟の斧','紅月刀','灰燼の大剣','天裂の細剣','星砕きの刃'];
W.SHIELD_NAMES=['木の盾','風紋の盾','青晶盾','紅月の盾','灰鉄の盾','天裂の鏡盾','星守りの盾'];
W.AFFIXES=[
 {id:'flame',name:'炎刃',type:'weapon',desc:'攻撃時に追加2ダメージ'},
 {id:'leech',name:'吸命',type:'weapon',desc:'敵を倒すとHP3回復'},
 {id:'sure',name:'必中',type:'weapon',desc:'攻撃が外れない'},
 {id:'venomguard',name:'毒守',type:'shield',desc:'毒を無効化'},
 {id:'dreamguard',name:'眠守',type:'shield',desc:'眠りを無効化'},
 {id:'trapguard',name:'軽歩',type:'shield',desc:'罠を50%で回避'},
 {id:'thorns',name:'反響',type:'shield',desc:'近接攻撃を受けると1ダメージ返す'}
];
W.ITEM_DEFS={
 heal:{name:'いやし草',icon:'🌿',kind:'herb',desc:'HPを25回復。投げると敵も回復する。'},
 bigheal:{name:'上いやし草',icon:'🍃',kind:'herb',desc:'HPを55回復。'},
 antidote:{name:'毒消し草',icon:'☘️',kind:'herb',desc:'毒を治す。'},
 wake:{name:'目覚め草',icon:'🌱',kind:'herb',desc:'眠り・混乱を治す。'},
 cleanse:{name:'清風草',icon:'🌾',kind:'herb',desc:'全状態異常を治す。'},
 rice:{name:'おむすび',icon:'🍙',kind:'food',desc:'満腹度を55回復。'},
 bigrice:{name:'大きなおむすび',icon:'🍙',kind:'food',desc:'満腹度を100回復。'},
 warp:{name:'転移の巻物',icon:'📜',kind:'scroll',desc:'同じ階の別の場所へワープ。'},
 blast:{name:'烈風の巻物',icon:'📜',kind:'scroll',desc:'周囲の敵に18ダメージ。'},
 identify:{name:'識別の巻物',icon:'📜',kind:'scroll',desc:'装備の能力を見抜く。'},
 stone:{name:'風石',icon:'◆',kind:'ammo',desc:'投げると8ダメージ。'},
 weapon:{name:'武器',icon:'⚔️',kind:'weapon',desc:'装備して攻撃力を上げる。'},
 shield:{name:'盾',icon:'🛡️',kind:'shield',desc:'装備して防御力を上げる。'}
};
W.makeEquipment=(kind,floor,rareBoost=0)=>{
 const tier=W.clamp(Math.floor((floor-1)/10),0,6);
 const plus=Math.max(0,Math.min(7,Math.floor((floor+W.rand(-8,8))/12)));
 const rare=Math.random()<(.10+rareBoost+floor*.0015);
 const aff=rare?W.pick(W.AFFIXES.filter(a=>a.type===kind)):null;
 if(kind==='weapon') return {type:'weapon',kind:'weapon',name:W.WEAPON_NAMES[tier],icon:'⚔️',power:2+tier*2,plus,affix:aff?.id||null,identified:!rare};
 return {type:'shield',kind:'shield',name:W.SHIELD_NAMES[tier],icon:'🛡️',power:1+tier*2,plus,affix:aff?.id||null,identified:!rare};
};
W.itemLabel=i=>{
 if(!i)return'';
 const aff=i.affix?W.AFFIXES.find(a=>a.id===i.affix):null;
 const plus=i.plus?`+${i.plus}`:'';
 return `${i.icon||''} ${aff&&i.identified?`【${aff.name}】`:''}${i.name}${plus}`.trim();
};
})();
