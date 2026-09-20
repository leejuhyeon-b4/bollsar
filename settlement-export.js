// Only crop and scale original photos. No filters, retouching, or generated faces.
// Crop: source x, y, width as fractions; height is derived to keep an exact 3:4 ratio.
const crop = {
  '린아':[.09,0,.79], '박지연':[.20,.025,.65], '이지혜':[.12,0,.79], '이지수':[.12,0,.79],
  '카이':[.265,0,.365], '김준수':[.21,.13,.42], '서경수':[.34,.03,.46], '고은성':[.33,.08,.46],
  '박은태':[.13,.015,.68], '강홍석':[.08,0,.77], '노윤':[.19,0,.72],
  '민영기':[.32,.03,.40], '박민성':[.28,.025,.42], '주아':[.29,.015,.43], '서지영':[.26,.055,.48],
  '김우성':[.24,.025,.44], '장윤석':[.26,.025,.44], '김대호':[.21,.025,.44], '장예원':[.31,.025,.46]
};
const actor = (name, file=name) => ({name,file:file+'.jpg',crop:crop[name]||[.26,.045,.48]});
const named = (prefix,names) => names.map((name,i)=>actor(name,prefix+(i+1)));
const groups = [
  {role:'엘리자벳',primary:true,x:32,y:229,w:327,pw:72,actors:['린아','박지연','이지혜','이지수'].map(n=>actor(n))},
  {role:'죽음',primary:true,x:348,y:229,w:319,pw:72,actors:['카이','김준수','서경수','고은성'].map(n=>actor(n))},
  {role:'루이지 루케니',primary:true,centered:true,compact:true,x:32,y:431,w:327,pw:64,actors:['박은태','강홍석','노윤'].map(n=>actor(n))},
  {role:'프란츠 요제프',primary:true,centered:true,compact:true,x:348,y:431,w:319,pw:64,actors:['민영기','박민성'].map(n=>actor(n))},
  {role:'소피 대공비',primary:true,centered:true,compact:true,x:32,y:625,w:200,pw:64,actors:['주아','서지영'].map(n=>actor(n))},
  {role:'루돌프',primary:true,centered:true,compact:true,x:245,y:625,w:200,pw:64,actors:['김우성','장윤석'].map(n=>actor(n))},
  {role:'막스 공작',bottom:true,hideNames:true,x:20,y:785,w:55,pw:24,actors:[actor('김대호')]},
  {role:'루도비카 · 볼프 부인',bottom:true,hideNames:true,x:85,y:785,w:110,pw:24,actors:[actor('장예원')]},
  {role:'엘리자벳의 측근들',bottom:true,hideNames:true,x:205,y:785,w:80,pw:24,actors:named('엘리자벳의 측근들',['서예림','박선정'])},
  {role:'황실 세력가들',bottom:true,hideNames:true,x:310,y:785,w:212,pw:24,actors:['유철호','이도경','김낙현','채성욱','안준혁','이동윤'].map((n,i)=>actor(n,i===1?'황실세력가들2':'황실 세력가들'+(i+1)))},
  {role:'어린 루돌프',bottom:true,hideNames:true,x:540,y:785,w:104,pw:24,actors:named('어린 루돌프',['박지호','박태온','한라온'])},
  {role:'앙상블',bottom:true,hideNames:true,x:20,y:850,w:370,pw:24,columns:8,actors:named('앙상블',['전선진','김경태','송주영','장여진','김요한','오태희','오민석','이슬아','전주일','곽동기','한수인','홍유진','김동훈','정인서','박찬희'])},
  {role:'죽음의 천사들',bottom:true,hideNames:true,x:410,y:850,w:235,pw:24,columns:4,actors:named('죽천',['박세형','박상봉','함승윤','조승민','김규범','배형빈','정규진'])}
];
const allActors=groups.flatMap(g=>g.actors);
const loads=[];
const loadImage=src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src;});
const themeRegistry =
  window.BollsarThemeRegistry;

if (!themeRegistry) {
  throw new Error(
    'Theme registry is unavailable'
  );
}

const selectedThemeId =
  themeRegistry.selectedThemeId(WORK.id);

const exportTheme =
  themeRegistry
    .listForProduction(WORK.id)
    .find(
      theme =>
        theme.id === selectedThemeId
    );

const exportBackground =
  exportTheme?.settlementExportBackground;

if (!exportBackground) {
  throw new Error(
    `Settlement export background is missing for ${WORK.id}`
  );
}

const exportBackdrop =
  document.querySelector('.backdrop');

if (!exportBackdrop) {
  throw new Error(
    'Settlement export backdrop element is missing'
  );
}

loads.push(
  new Promise((resolve, reject) => {
    exportBackdrop.onload = resolve;
    exportBackdrop.onerror = reject;
    exportBackdrop.src =
      exportBackground;
  })
);
const cast=document.getElementById('cast');
for(const group of groups){
  const section=document.createElement('section');section.className='group'+(group.primary?' primary':'')+(group.centered?' centered':'')+(group.compact?' compact':'')+(group.bottom?' bottom':'');
  Object.assign(section.style,{left:group.x+'px',top:group.y+'px',width:group.w+'px'});
  const title=document.createElement('h2');title.className='role';title.textContent=group.role;section.append(title);
  const columns=group.columns||group.actors.length;
  for(let start=0;start<group.actors.length;start+=columns){
    const row=document.createElement('div');row.className='actors';
    if(start){row.style.marginTop='6px';}
    for(const item of group.actors.slice(start,start+columns)){
      const card=document.createElement('div');card.className='actor';card.style.width=group.w/columns-6+'px';
      const frame=document.createElement('div');frame.className='portrait';frame.style.width=group.pw+8+'px';frame.style.height=group.pw*4/3+8+'px';
      const canvas=document.createElement('canvas');canvas.width=group.pw*4;canvas.height=group.pw*4/3*4;canvas.setAttribute('aria-label',item.name+' 원본 사진');frame.append(canvas);card.append(frame);
      if(!group.hideNames){const label=document.createElement('div');label.className='name';label.textContent=item.name;card.append(label);}
      const id=Object.keys(ACTORS).find(id=>ACTORS[id].name===item.name);
      if(id){const count=document.createElement('div');count.className='count';count.dataset.actor=id;card.append(count);}
      row.append(card);
      loads.push(new Promise(resolve=>{
        const img=new Image();img.onload=()=>{
          const [x,y,w]=item.crop;
          const sx=Math.max(0,Math.min(x*img.width,img.width-1));
          const sy=Math.max(0,Math.min(y*img.height,img.height-1));
          const requestedW=w*img.width;
          const maxW=Math.min(img.width-sx,(img.height-sy)*3/4);
          const sw=Math.max(1,Math.min(requestedW,maxW));
          const sh=sw*4/3;
          const ctx=canvas.getContext('2d');ctx.imageSmoothingQuality='high';
          ctx.drawImage(img,sx,sy,sw,sh,0,0,canvas.width,canvas.height);canvas.dataset.source=item.file;resolve();
        };
        img.onerror=()=>{console.warn('[정산판 이미지] 사진을 불러오지 못했습니다:',item.file);resolve();};
        img.src='productions/elisabeth-2026-6th/cast/'+encodeURIComponent(item.file);
      }));
    }section.append(row);
  }cast.append(section);
}
const pairList=document.getElementById('pair-list');
const pairBox=document.getElementById('pair-box');
window.setPairCombinations=(pairs=[])=>{
  pairBox.hidden=!pairs.length;
  pairList.replaceChildren();
  for(const pair of pairs.slice(0,4)){
    const row=document.createElement('div');row.className='pair-row';
    const names=Array.isArray(pair)?pair:(pair.names||[]);
    const name=document.createElement('span');name.className='pair-name';name.textContent=names.slice(0,4).join(' ');row.append(name);
    const count=document.createElement('span');count.className='pair-count';
    if(!Array.isArray(pair))count.textContent=(pair.watched||'　')+' / '+pair.total;
    row.append(count);
    pairList.append(row);
  }
};
window.setPairCombinations();
const seatFloors=document.getElementById('seat-floors');
for(const floor of SEAT_MAP.floors){
  const meta=floorGrid(floor),wrap=document.createElement('section');wrap.className='seat-floor';
  const occupied=new Set(floor.rows.flatMap(row=>seatRowCells(floor,row).map(cell=>cell.gc)));
  const aisleCols=new Set(meta.labelGc.slice(1,-1).flatMap(gc=>Array.from({length:AISLE_W},(_,i)=>gc+i)));
  const tracks=Array.from({length:meta.cols},(_,i)=>occupied.has(i+1)?'16px':aisleCols.has(i+1)?'10px':'0px').join(' ');
  wrap.innerHTML=`<div class="seat-floor-title">${floor.label}</div><div class="seat-rows"></div>`;
  const rowsEl=wrap.querySelector('.seat-rows');
  for(let ri=0;ri<floor.rows.length;ri++){
    const row=floor.rows[ri];
    const currentCols=new Set(seatRowCells(floor,row).map(cell=>cell.gc));
    const belowRow=floor.rows[ri+1];
    const belowCols=belowRow
      ? new Set(seatRowCells(floor,belowRow).map(cell=>cell.gc))
      : null;
    const line=document.createElement('div');line.className='seat-row';line.style.gridTemplateColumns=tracks;
    for(const gc of meta.labelGc.slice(1,-1)){
      const label=document.createElement('span');label.className='row-label';label.style.gridColumn=`${gc}/span ${AISLE_W}`;label.textContent=row.r;line.append(label);
    }
    for(const cell of seatRowCells(floor,row)){
      const seat=document.createElement('span');seat.className='seat-cell';seat.dataset.seat=cell.id;seat.dataset.number=cell.no;seat.style.gridColumn=cell.gc;seat.textContent=Number(cell.no)%5===0?cell.no:'';seat.setAttribute('aria-label',`${floor.label} ${row.r}열 ${cell.no}번`);
      if(!currentCols.has(cell.gc+1))seat.classList.add('edge-r');
      if(!belowCols?.has(cell.gc))seat.classList.add('edge-b');
      line.append(seat);
    }
    rowsEl.append(line);
  }
  seatFloors.append(wrap);
}
// Preview-only input boundary: the service can pass its selected visitColors and filtered performances.
window.setSettlementPreview=({visitColors={},records=[],performances=PERFS}={})=>{
  const palette=Object.fromEntries(SEAT_COLORS.map(c=>[c.id,c.hex]));
  for(const swatch of document.querySelectorAll('.check')){
    const id=visitColors[swatch.dataset.level];
    swatch.style.setProperty('--visit-color',palette[id]||'transparent');
  }
  const visits=new Map();
  for(const item of records){
    const seat=item.rec?.seat||item.seat;
    if(seat)visits.set(seat,(visits.get(seat)||0)+1);
  }
  for(const seat of document.querySelectorAll('.seat-cell')){
    const level=Math.min(visits.get(seat.dataset.seat)||0,4);
    const color=level&&palette[visitColors[level]];
    seat.classList.toggle('on',!!level);
    seat.style.background=color||'rgba(32,21,43,.9)';
    seat.style.color=color?'#160f1f':'#e5d7c3';
    seat.textContent=(level||Number(seat.dataset.number)%5===0)?seat.dataset.number:'';
  }
  document.getElementById('total').textContent=(records.length||'　')+' / '+performances.length;
  for(const count of document.querySelectorAll('[data-actor]')){
    const id=count.dataset.actor;
    const total=performances.filter(p=>Object.values(p.cast).includes(id)).length;
    const watched=records.filter(p=>Object.values((p.perf||p).cast||{}).includes(id)).length;
    count.textContent=(watched||'　')+' / '+total;
  }
};
window.setSettlementPreview({visitColors:{1:'plum',2:'rose',3:'gold',4:'moss'}});
window.previewReady=Promise.all([...loads,document.fonts.ready]).then(()=>{
  if(allActors.length!==52||new Set(allActors.map(a=>a.file)).size!==52)throw Error('Cast inventory mismatch');
  if(new URLSearchParams(location.search).has('verify')){
    const assert=(ok,message)=>{if(!ok)throw Error(message);};
    const chips=[...document.querySelectorAll('.check')];
    window.setSettlementPreview({visitColors:{1:'moss',2:'plum',3:'rose',4:'gold'},records:[PERFS[0]]});
    assert(chips.every((chip,i)=>getComputedStyle(chip).getPropertyValue('--visit-color').trim()===['#B4D49E','#CBABDD','#EBA0A6','#EFDD97'][i]),'Selected color mapping');
    assert(document.getElementById('total').textContent==='1 / '+PERFS.length,'Watched count');
    window.setSettlementPreview();
    assert(chips.every(chip=>getComputedStyle(chip).getPropertyValue('--visit-color').trim()==='transparent'),'Unselected colors must stay empty');
    assert([...document.querySelectorAll('.count')].every(count=>count.textContent.trim().startsWith('/')),'Unwatched numerators must stay blank');
    const unwanted=['2026 관람 정산판','나의 관람 기록','나의 객석','관람 좌석','배우 출연 회차','SEATING RECORD','DAS MUSICAL','\uFFFD'];
    assert(unwanted.every(text=>!document.getElementById('board').innerText.includes(text)),'Removed text or encoding error');
    assert(document.fonts.check('16px "Cafe24 Ssurround Air"','엘리자벳'),'Service body font');
    assert([...document.querySelectorAll('.group')].filter(group=>['엘리자벳의 측근들','황실 세력가들','어린 루돌프','앙상블','죽음의 천사들'].includes(group.querySelector('.role').textContent)).every(group=>!group.querySelector('.name')),'Lower cast names must stay hidden');
    window.setPairCombinations(Array.from({length:4},()=>({names:['린아','카이'],watched:1,total:3})));
    assert(!pairBox.hidden&&pairList.children.length===4&&pairList.firstElementChild.children.length===2,'Plain pair text and counts');
    const pairRect=pairBox.getBoundingClientRect(),separatorRect=document.querySelector('.separator').getBoundingClientRect();
    const primaryGroups=[...document.querySelectorAll('.group.primary')];
    const rudolfGroup=primaryGroups.find(group=>group.querySelector('.role')?.textContent==='루돌프');
    const rudolfRect=rudolfGroup.getBoundingClientRect();
    assert(pairRect.left>=rudolfRect.right&&pairRect.right<=separatorRect.left+2,'Pairs fit after Sophie and Rudolf');
    assert([...document.querySelectorAll('.group.bottom')].every(group=>group.getBoundingClientRect().right<=document.querySelector('.seat-panel').getBoundingClientRect().left),'Lower actors stay left of seats');
    window.setPairCombinations();
    assert(pairBox.hidden&&!document.getElementById('board').innerText.includes('페어 조합'),'Empty pair section must be absent');
    const expectedSeats=SEAT_MAP.floors.reduce((sum,floor)=>sum+floor.rows.reduce((n,row)=>n+seatRowCells(floor,row).length,0),0);
    assert(document.querySelectorAll('.seat-cell').length===expectedSeats,'Every seat must render from service data');
    assert([...document.querySelectorAll('.seat-cell')].every(seat=>/층 .+열 .+번/.test(seat.getAttribute('aria-label'))),'Seat row and number labels');
    assert([...document.querySelectorAll('.row-label')].every(label=>Math.abs(label.getBoundingClientRect().top-label.closest('.seat-row').getBoundingClientRect().top)<.5),'Row labels align with their own seat row');
    assert([...document.querySelectorAll('.seat-row')].every(row=>Math.abs(row.getBoundingClientRect().top-row.querySelector('.seat-cell').getBoundingClientRect().top)<.5),'Seats stay on the labeled row');
    assert(document.querySelector('.stage-vector').textContent==='STAGE','Stage label');
    assert([...document.querySelectorAll('.group.bottom .portrait')].every(frame=>getComputedStyle(frame).borderTopWidth==='0px'),'Lower gold frames removed');
    assert(['김대호','장예원'].every(name=>![...document.querySelectorAll('.group.bottom .name')].some(label=>label.textContent===name)),'Bottom actor names removed');
    window.setSettlementPreview({visitColors:{1:'plum',2:'rose',3:'gold',4:'moss'}});
  }
  document.body.dataset.verified='PASS: photos; crops; font; pairs; sharp seats; row and seat labels; stage; lower frames and names';
}).catch(error=>{document.body.dataset.verified='FAIL: '+error.message;throw error;});

window.exportSettlementPng=async()=>{
  await window.previewReady;
  window.SeatLines?.renderExport(document);
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const canvas=await html2canvas(document.getElementById('board'),{
    scale:2,width:1586,height:992,backgroundColor:null,logging:false,useCORS:false
  });
  return await new Promise((resolve,reject)=>
    canvas.toBlob(blob=>blob?resolve(blob):reject(Error('PNG encoding failed')),'image/png')
  );
};
