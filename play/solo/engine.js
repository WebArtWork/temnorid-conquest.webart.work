const TemnoridEngine=(()=>{
const VERSION=3,SAVE='temnorid-solo-v1';
const leaders=[
 {id:'vael',name:{uk:'Елара Вейл',en:'Elara Vale'},passive:{uk:'+1 Мана на початку раунду',en:'+1 Mana each round'},sigil:{uk:'+1 Вплив у найнижчій фракції',en:'+1 Influence in your lowest faction'}},
 {id:'mor',name:{uk:'Морвейн Крицевий',en:'Morvain Steel'},passive:{uk:'Перше найняте Військо щораунду дає ще 1',en:'Your first recruited Troop each round grants +1'},sigil:{uk:'+2 Бойової сили',en:'+2 Combat Strength'}},
 {id:'nyra',name:{uk:'Ніра з Попелястої Ради',en:'Nyra of the Ash Council'},passive:{uk:'Перша карта Ринку коштує на 1 менше',en:'Your first Market card costs 1 less'},sigil:{uk:'Візьми Таємницю',en:'Draw a Secret'}},
 {id:'tor',name:{uk:'Торен Каменяр',en:'Thoren Stonewright'},passive:{uk:'+1 Золото за встановлення Контролю',en:'+1 Gold when you gain Control'},sigil:{uk:'+2 Золота',en:'+2 Gold'}},
 {id:'sera',name:{uk:'Сера Місячна',en:'Sera Moonbound'},passive:{uk:'Перша витрата Мани щораунду дешевша на 1',en:'Your first Mana cost each round is reduced by 1'},sigil:{uk:'+1 Есенція і +1 Мана',en:'+1 Essence and +1 Mana'}},
 {id:'kael',name:{uk:'Каель Безстягий',en:'Kael Unbannered'},passive:{uk:'+1 Авторитет під час Розкриття',en:'+1 Authority when you Reveal'},sigil:{uk:'Найми 2 Війська',en:'Recruit 2 Troops'}}
];
const locations=[
 {id:'council',icon:'⌁',x:48,y:17,name:{uk:'Рада Семивежжя',en:'Council of Seven Towers'},cats:['council'],cost:{gold:0},gain:{gold:2},text:{uk:'+2 Золота',en:'+2 Gold'}},
 {id:'forge',icon:'♜',x:22,y:31,name:{uk:'Чорна Фортеця',en:'Black Fortress'},cats:['combat'],cost:{mana:1},gain:{troops:3},combat:true,control:true,text:{uk:'3 Війська · Битва',en:'3 Troops · Battle'}},
 {id:'wells',icon:'✦',x:72,y:28,name:{uk:'Криниці Есенції',en:'Essence Wells'},cats:['wild'],cost:{},gain:{essence:1},essence:true,text:{uk:'Забрати Есенцію',en:'Collect Essence'}},
 {id:'ruins',icon:'☽',x:37,y:48,name:{uk:'Шепітні Руїни',en:'Whispering Ruins'},cats:['wild'],cost:{mana:1},gain:{secret:1},text:{uk:'Взяти Таємницю',en:'Draw a Secret'}},
 {id:'bastion',icon:'⚔',x:64,y:52,name:{uk:'Бастіон Межі',en:'Frontier Bastion'},cats:['combat'],cost:{gold:2},gain:{troops:4},combat:true,text:{uk:'4 Війська · Битва',en:'4 Troops · Battle'}},
 {id:'fa',icon:'◈',x:18,y:67,name:{uk:'Орден Заліза',en:'Iron Order'},cats:['faction'],faction:0,cost:{},gain:{influence:1},text:{uk:'+1 Вплив',en:'+1 Influence'}},
 {id:'fb',icon:'◈',x:40,y:72,name:{uk:'Смарагдовий Двір',en:'Emerald Court'},cats:['faction'],faction:1,cost:{},gain:{influence:1},text:{uk:'+1 Вплив',en:'+1 Influence'}},
 {id:'fc',icon:'◈',x:62,y:72,name:{uk:'Попелястий Конклав',en:'Ashen Conclave'},cats:['faction'],faction:2,cost:{},gain:{influence:1},text:{uk:'+1 Вплив',en:'+1 Influence'}},
 {id:'fd',icon:'◈',x:83,y:66,name:{uk:'Варта Припливу',en:'Tide Wardens'},cats:['faction'],faction:3,cost:{},gain:{influence:1},text:{uk:'+1 Вплив',en:'+1 Influence'}},
 {id:'market',icon:'◉',x:51,y:88,name:{uk:'Золотий Шлях',en:'Golden Road'},cats:['city'],cost:{},gain:{gold:1,authority:1},text:{uk:'+1 Золото · +1 Авторитет',en:'+1 Gold · +1 Authority'}}
];
const baseCards=[
 ['envoy','Посланець','Envoy',['council','faction'],2,0],['guard','Варта','Guard',['combat'],0,2],['trail','Стежка','Trail',['wild'],1,0],['coin','Податок','Levy',['city','council'],1,0],['blade','Клинок','Blade',['combat'],0,2],['oath','Клятва','Oath',['faction'],2,0],['scout','Розвідник','Scout',['wild','combat'],1,1],['scribe','Літописець','Scribe',['council'],2,0],['march','Похід','March',['combat','city'],0,2],['sigil','Сигіл Лідера','Leader Sigil',['council','faction','wild','combat'],1,1]
].map((c,i)=>({uid:'s'+i,id:c[0],name:{uk:c[1],en:c[2]},cats:c[3],auth:c[4],combat:c[5],cost:0}));
const world=[
 ['captain','Капітан Варти','Guard Captain',['combat'],3,2,3],['oracle','Оракул Руїн','Oracle of Ruins',['wild'],4,3,0],['legate','Легат Двору','Court Legate',['faction'],4,3,1],['merchant','Князь Купців','Merchant Prince',['city','council'],5,4,0],['ranger','Страж Межі','Frontier Ranger',['wild','combat'],3,2,2],['scholar','Учений Сигілів','Sigil Scholar',['council','faction'],5,4,1],['veteran','Ветеран Облоги','Siege Veteran',['combat'],6,2,5],['mystic','Містик Джерел','Well Mystic',['wild'],3,3,0],['banner','Носій Стяга','Banner Bearer',['faction','combat'],4,2,3],['treasurer','Скарбник Ради','Council Treasurer',['council','city'],4,4,0]
].map((c,i)=>({uid:'w'+i,id:c[0],name:{uk:c[1],en:c[2]},cats:c[3],cost:c[4],auth:c[5],combat:c[6]}));
const battles=[
 {tier:'I',name:{uk:'Сутичка біля Брами',en:'Clash at the Gate'},first:{cp:1,control:'forge'},second:{essence:1}},
 {tier:'II',name:{uk:'Облога Чорної Фортеці',en:'Siege of the Black Fortress'},first:{cp:2,control:'forge'},second:{essence:2}},
 {tier:'II',name:{uk:'Війна за Старий Шлях',en:'War for the Old Road'},first:{cp:2,gold:2},second:{gold:2}},
 {tier:'II',name:{uk:'Битва Трьох Стягів',en:'Battle of Three Banners'},first:{cp:2,influence:1},second:{secret:1}},
 {tier:'II',name:{uk:'Штурм Бастіону',en:'Assault on the Bastion'},first:{cp:2,control:'bastion'},second:{troops:2}},
 {tier:'II',name:{uk:'Зламана Угода',en:'The Broken Pact'},first:{cp:2,essence:1},second:{influence:1}},
 {tier:'III',name:{uk:'Остання Брама',en:'The Final Gate'},first:{cp:3,control:'forge'},second:{cp:1}},
 {tier:'III',name:{uk:'Корона Попелу',en:'Crown of Ash'},first:{cp:3,essence:2},second:{cp:1}},
 {tier:'III',name:{uk:'Доля Темнороду',en:'Fate of Temnorid'},first:{cp:4},second:{cp:1}},
 {tier:'III',name:{uk:'Війна Чотирьох Сил',en:'War of Four Powers'},first:{cp:3,influence:2},second:{cp:1}}
];
const IDS=['player','rivalA','rivalB'];
function hash(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}function rng(st){st.rng=(Math.imul(st.rng,1664525)+1013904223)>>>0;return st.rng/4294967296}function shuffle(a,st){a=[...a];for(let i=a.length-1;i;i--){let j=Math.floor(rng(st)*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
// Battle deck: 1 tier I, then 5 tier II, then 4 tier III, shuffled within each tier.
function battleDeck(st){return['I','II','III'].flatMap(t=>shuffle(battles.filter(b=>b.tier===t),st))}
const MAXTROOPS=8;
function power(id,name){return{id,name,cp:0,gold:2,mana:1,essence:0,troops:0,committed:0,battle:0,secrets:0,influence:[0,0,0,0],alliances:[false,false,false,false],heroes:2,maxHeroes:2,maxTroops:MAXTROOPS,control:[],done:false}}
// Recruited Troops go to the Garrison. Morvain: the first recruit each round grants +1.
function recruitTroops(p,n){if(n>0&&p.name==='mor'&&!p.morUsed){n++;p.morUsed=true}let room=Math.max(0,p.maxTroops-(p.troops+(p.committed||0))),add=Math.min(n,room);p.troops+=add;return add}
// No Troops committed to the Battle means strength 0, whatever the cards say.
function strength(p){return p.committed>0?p.committed*2+p.battle:0}
function newGame(opts={}){const seed=opts.seed||'TC-'+Math.random().toString(16).slice(2,10).toUpperCase(),dummy={rng:hash(seed)};let pool=shuffle(leaders,dummy),lead=leaders.find(x=>x.id===opts.leader)||pool[0],rivals=pool.filter(x=>x.id!==lead.id).slice(0,2),p=power('player',lead.id),a=power('rivalA',rivals[0].id),b=power('rivalB',rivals[1].id),difficulty=opts.difficulty||'normal';if(difficulty==='easy'){p.gold++;p.essence++}else{a.troops=b.troops=3;a.secrets=b.secrets=1}let st={version:VERSION,seed,rng:dummy.rng,difficulty,lang:opts.lang||'uk',phase:'ROUND_START',round:1,leader:lead.id,rivalLeaders:rivals.map(x=>x.id),player:p,rivalA:a,rivalB:b,firstPlayer:0,order:[...IDS],turnPtr:0,alliance:[null,null,null,null],hand:[],deck:shuffle(baseCards,dummy),discard:[],played:[],worldDeck:shuffle(world,dummy),market:[],battleDeck:[],battle:null,occupied:{},essence:{wells:1},log:[],winner:null,started:Date.now()};st.battleDeck=battleDeck(st);st.market=st.worldDeck.splice(0,5);startRound(st);return save(st)}
function draw(st,n){while(n--){if(!st.deck.length){st.deck=shuffle(st.discard,st);st.discard=[]}if(st.deck.length)st.hand.push(st.deck.shift())}}
function startRound(st){st.occupied={};for(const id of IDS){let p=st[id];p.heroes=p.maxHeroes;p.battle=0;p.done=false;p.hired=false;p.morUsed=false;p.seraUsed=false}st.player.authority=0;st.player.bought=0;st.revealed=[];st.boughtCards=[];st.battle=st.battleDeck[st.round-1];if(st.leader==='vael')st.player.mana++;draw(st,5-st.hand.length);st.order=IDS.map((_,i)=>IDS[(st.firstPlayer+i)%3]);st.turnPtr=0;log(st,'round',{round:st.round,battle:st.battle.name.en,first:st.order[0]});nextTurn(st)}
// Players take turns in order (starting with the First Player) until everyone has Revealed.
function nextTurn(st){for(let guard=0;guard<100;guard++){if(IDS.every(id=>st[id].done))break;let id=st.order[st.turnPtr%3];if(st[id].done){st.turnPtr++;continue}if(id==='player'){st.phase='HUMAN_HERO_TURN';return}rivalTurn(st,id);st.turnPtr++}st.phase='HUMAN_REVEAL'}
function leader(id){return leaders.find(x=>x.id===id)}function location(id){return locations.find(x=>x.id===id)}function canPlay(st,uid){return st.phase==='HUMAN_HERO_TURN'&&st.player.heroes>0&&st.hand.some(c=>c.uid===uid)}
function costOf(st,p,l){let c={...(l.cost||{})};if(p===st.player&&st.leader==='sera'&&!p.seraUsed&&c.mana>0)c.mana--;return c}
function canVisit(st,uid,lid){if(!canPlay(st,uid))return{ok:false,why:'phase'};let c=st.hand.find(x=>x.uid===uid),l=location(lid);if(st.occupied[lid])return{ok:false,why:'occupied'};if(!c.cats.some(x=>l.cats.includes(x)))return{ok:false,why:'icon'};for(const [k,v] of Object.entries(costOf(st,st.player,l)))if((st.player[k]||0)<v)return{ok:false,why:k};return{ok:true}}
function applyGain(st,p,g,l){for(const [k,v] of Object.entries(g||{})){if(k==='control'||k==='troops')continue;if(k==='influence'){let f=l?.faction??p.influence.indexOf(Math.min(...p.influence));p.influence[f]+=v;checkAlliance(st,f,p)}else if(k==='secret')p.secrets+=v;else p[k]=(p[k]||0)+v}}
// To take an Alliance (from 4 Influence), exceed the current holder's Influence on that track.
function checkAlliance(st,f,p){let owner=st.alliance[f];if(p.influence[f]>=4&&owner!==p.id&&(!owner||p.influence[f]>st[owner].influence[f]))st.alliance[f]=p.id;IDS.forEach(id=>st[id].alliances[f]=st.alliance[f]===id)}
function playHero(st,uid,lid,opts={}){let v=canVisit(st,uid,lid);if(!v.ok)return v;let p=st.player,c=st.hand.find(x=>x.uid===uid),l=location(lid),cost=costOf(st,p,l);for(const[k,n]of Object.entries(cost))p[k]-=n;if((l.cost?.mana||0)>0)p.seraUsed=true;applyGain(st,p,l.gain,l);if(l.essence){p.essence+=(st.essence[l.id]||0);st.essence[l.id]=0}let recruited=l.combat?recruitTroops(p,l.gain.troops):0;p.heroes--;st.occupied[lid]='player';st.hand=st.hand.filter(x=>x.uid!==uid);st.played.push(c);if(c.id==='sigil')recruited+=applySigil(st,p,st.leader);
 // At a Combat location: every Troop recruited this turn plus up to 2 from the Garrison join the Battle.
 if(l.combat){p.troops-=recruited;p.committed+=recruited;let g=Math.max(0,Math.min(2,p.troops,Math.floor(opts.fromGarrison??2)||0));p.troops-=g;p.committed+=g}
 log(st,'hero',{card:c.id,location:lid});st.turnPtr++;if(p.heroes<=0)return reveal(st);nextTurn(st);return save(st)}
function applySigil(st,p,lid){if(lid==='mor')p.battle+=2;else if(lid==='nyra')p.secrets++;else if(lid==='tor')p.gold+=2;else if(lid==='sera'){p.essence++;p.mana++}else if(lid==='kael')return recruitTroops(p,2);else{let i=p.influence.indexOf(Math.min(...p.influence));p.influence[i]++;checkAlliance(st,i,p)}return 0}
function rivalTurn(st,id){let p=st[id];if(p.heroes<=0){p.done=true;return}let open=locations.filter(l=>!st.occupied[l.id]);if(!open.length){p.done=true;return}let priorities=shuffle(open,st),l=priorities.find(x=>x.combat)||priorities[0];st.occupied[l.id]=id;p.heroes--;if(l.faction!=null){p.influence[l.faction]++;checkAlliance(st,l.faction,p)}let recruited=l.combat?recruitTroops(p,2+(rng(st)>.55?1:0)):0;if(l.essence){p.essence+=(st.essence[l.id]||0)+1;st.essence[l.id]=0}if(l.id==='council')p.gold+=2;if(rng(st)>.78)p.secrets++;recruited+=applySigil(st,p,p.name);if(l.combat){p.troops-=recruited;p.committed+=recruited;let g=Math.min(2,p.troops);p.troops-=g;p.committed+=g;if(rng(st)>.65)p.battle+=2}if(p.heroes<=0)p.done=true;log(st,'rival',{actor:id,location:l.id})}
const THIRD_HERO_COST=8,HIRE_COST=2;
function buyThirdHero(st){let p=st.player;if(st.phase!=='HUMAN_HERO_TURN'||p.maxHeroes>=3||p.gold<THIRD_HERO_COST)return{ok:false};p.gold-=THIRD_HERO_COST;p.maxHeroes=3;p.heroes++;log(st,'thirdHero',{});return save(st)}
function hireHero(st){let p=st.player;if(st.phase!=='HUMAN_HERO_TURN'||p.hired||p.gold<HIRE_COST)return{ok:false};p.gold-=HIRE_COST;p.hired=true;p.heroes++;log(st,'hireHero',{});return save(st)}
function reveal(st){if(st.phase!=='HUMAN_HERO_TURN')return{ok:false};let p=st.player,auth=st.hand.reduce((n,c)=>n+c.auth,0)+(st.leader==='kael'?1:0),combat=st.hand.reduce((n,c)=>n+c.combat,0);p.authority=(p.authority||0)+auth;p.battle+=combat;st.revealed=[...st.hand];st.discard.push(...st.hand,...st.played);st.hand=[];st.played=[];p.done=true;log(st,'reveal',{authority:auth,combat});nextTurn(st);return save(st)}
function price(st,c){return Math.max(0,c.cost-(st.leader==='nyra'&&!st.player.bought?1:0))}
function buy(st,uid){if(st.phase!=='HUMAN_REVEAL')return{ok:false};let c=st.market.find(x=>x.uid===uid);if(!c||(st.player.authority||0)<price(st,c))return{ok:false};st.player.authority-=price(st,c);st.player.bought=(st.player.bought||0)+1;st.discard.push(c);(st.boughtCards=st.boughtCards||[]).push(c);st.market=st.market.filter(x=>x.uid!==uid);if(st.worldDeck.length)st.market.push(st.worldDeck.shift());log(st,'buy',{card:c.id});return save(st)}
function finishReveal(st){if(st.phase!=='HUMAN_REVEAL')return{ok:false};st.phase='BATTLE_RESOLVE';resolveBattle(st);return save(st)}
function reward(st,p,r){applyGain(st,p,r);if(r.troops)recruitTroops(p,r.troops);if(r.control){let had=p.control.includes(r.control);IDS.forEach(id=>st[id].control=st[id].control.filter(c=>c!==r.control));p.control.push(r.control);if(!had&&p.name==='tor')p.gold++}}
// Only powers with committed Troops take part. Tied participants drop to the next reward level.
function resolveBattle(st){let ps=IDS.map(id=>st[id]).filter(p=>strength(p)>0).sort((a,b)=>strength(b)-strength(a)),tiers=[st.battle.first,st.battle.second],placed=[];for(let i=0;i<ps.length;){let s=strength(ps[i]),group=ps.filter(p=>strength(p)===s),tier=i+(group.length>1?1:0);group.forEach(p=>{if(tiers[tier])reward(st,p,tiers[tier]);placed.push([p.id,s,tier])});i+=group.length}log(st,'battle',{placed});for(const id of IDS){st[id].committed=0;st[id].battle=0}
 for(const l of locations)if(l.essence&&!st.occupied[l.id])st.essence[l.id]=(st.essence[l.id]||0)+1;
 st.round++;st.firstPlayer=(st.firstPlayer+1)%3;if(st.round>st.battleDeck.length||Math.max(st.player.cp,st.rivalA.cp,st.rivalB.cp)>=10){finish(st);return}if(st.round>=unlockRound(st.difficulty)){st.rivalA.maxHeroes=st.rivalB.maxHeroes=3}startRound(st)}
function unlockRound(d){return d==='easy'?5:d==='normal'?4:3}function finish(st){st.phase='FINISHED';let rank=[st.player,st.rivalA,st.rivalB].sort((a,b)=>b.cp-a.cp||b.essence-a.essence||b.troops-a.troops);st.winner=rank[0].id;localStorage.setItem('temnorid-history',JSON.stringify({date:Date.now(),difficulty:st.difficulty,leader:st.leader,rivals:st.rivalLeaders,rounds:st.round-1,winner:st.winner,scores:[st.player.cp,st.rivalA.cp,st.rivalB.cp]}))}
function log(st,type,data){st.log.unshift({type,round:st.round,phase:st.phase,...data});st.log=st.log.slice(0,40)}function save(st){localStorage.setItem(SAVE,JSON.stringify(st));return st}function load(){try{let s=JSON.parse(localStorage.getItem(SAVE));return s?.version===VERSION?s:null}catch{return null}}function clear(){localStorage.removeItem(SAVE)}
return{leaders,locations,newGame,load,save,clear,leader,location,canPlay,canVisit,costOf,playHero,reveal,buy,price,strength,finishReveal,buyThirdHero,hireHero,THIRD_HERO_COST,HIRE_COST};})();
