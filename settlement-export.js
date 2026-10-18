// Keep original portraits; only promotional background text receives local cleanup patches.
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
/* === KINKY EXPORT CAST V2 START === */

/*
 * 킹키부츠 정산판 배우 사진.
 * 원본 사진은 crop/scale만 사용한다.
 *
 * 개별 좌표로 홍보 문구를 제외한 상반신을 3:4로 crop한다.
 */
const profileCrops = {
  "강홍석.jpg": [
    0.395,
    0.025,
    0.25,
    0.267
  ],
  "공장직원들1.jpg": [
    0.26,
    0.025,
    0.48,
    0.72
  ],
  "공장직원들10.jpg": [
    0.24,
    0.025,
    0.5,
    0.72
  ],
  "공장직원들11.jpg": [
    0.23,
    0.025,
    0.47,
    0.72
  ],
  "공장직원들12.jpg": [
    0.27,
    0.025,
    0.48,
    0.72
  ],
  "공장직원들13.jpg": [
    0.25,
    0.025,
    0.5,
    0.72
  ],
  "공장직원들14.jpg": [
    0.27,
    0.025,
    0.48,
    0.72
  ],
  "공장직원들15.jpg": [
    0.29,
    0.025,
    0.46,
    0.72
  ],
  "공장직원들2.jpg": [
    0.26,
    0.025,
    0.46,
    0.72
  ],
  "공장직원들3.jpg": [
    0.25,
    0.025,
    0.48,
    0.72
  ],
  "공장직원들4.jpg": [
    0.25,
    0.035,
    0.53,
    0.565
  ],
  "공장직원들5.jpg": [
    0.24,
    0.025,
    0.52,
    0.72
  ],
  "공장직원들6.jpg": [
    0.24,
    0.025,
    0.52,
    0.72
  ],
  "공장직원들7.jpg": [
    0.25,
    0.025,
    0.5,
    0.72
  ],
  "공장직원들8.jpg": [
    0.24,
    0.025,
    0.5,
    0.72
  ],
  "공장직원들9.jpg": [
    0.24,
    0.035,
    0.53,
    0.565
  ],
  "김동현.jpg": [
    0.395,
    0.065,
    0.3,
    0.32
  ],
  "김호영.jpg": [
    0.445,
    0.02,
    0.26,
    0.277
  ],
  "백형훈.jpg": [
    0.36,
    0.015,
    0.26,
    0.277
  ],
  "서경수.jpg": [
    0.365,
    0.015,
    0.26,
    0.277
  ],
  "신승환.jpg": [
    0.13,
    0.055,
    0.32,
    0.341
  ],
  "신재범.jpg": [
    0.515,
    0.015,
    0.26,
    0.277
  ],
  "심재현.jpg": [
    0.475,
    0.07,
    0.3,
    0.32
  ],
  "엔젤 1.jpg": [
    0.28,
    0.025,
    0.46,
    0.72
  ],
  "엔젤 2.jpg": [
    0.15,
    0.025,
    0.6,
    0.72
  ],
  "엔젤 3.jpg": [
    0.22,
    0.025,
    0.53,
    0.72
  ],
  "엔젤 4.jpg": [
    0.24,
    0.025,
    0.52,
    0.72
  ],
  "엔젤 5.jpg": [
    0.24,
    0.025,
    0.52,
    0.72
  ],
  "엔젤 6.jpg": [
    0.24,
    0.025,
    0.52,
    0.72
  ],
  "엔젤 7.jpg": [
    0.23,
    0.035,
    0.53,
    0.565
  ],
  "엔젤 8.jpg": [
    0.23,
    0.035,
    0.53,
    0.565
  ],
  "유주연.jpg": [
    0.195,
    0.035,
    0.54,
    0.576
  ],
  "이루원.jpg": [
    0.18,
    0.035,
    0.54,
    0.576
  ],
  "이재환.jpg": [
    0.27,
    0.015,
    0.27,
    0.288
  ],
  "조지.jpg": [
    0.22,
    0.025,
    0.51,
    0.72
  ],
  "한재아.jpg": [
    0.245,
    0.015,
    0.28,
    0.299
  ],
  "허윤슬.jpg": [
    0.26,
    0.035,
    0.29,
    0.309
  ]
};
const kbActor = (name,file=name) => ({name,file:file+'.jpg',crop:profileCrops[file+'.jpg']});

const groups = [
  {role:'찰리',primary:true,x:150,y:170,w:237,pw:60,actors:['김호영','이재환','신재범'].map(name=>kbActor(name))},
  {role:'롤라',primary:true,x:397,y:170,w:237,pw:60,actors:['강홍석','백형훈','서경수'].map(name=>kbActor(name))},
  {role:'로렌',primary:true,x:150,y:350,w:138,pw:45,actors:['한재아','허윤슬'].map(name=>kbActor(name))},
  {role:'돈',primary:true,x:292,y:350,w:198,pw:45,actors:['신승환','심재현','김동현'].map(name=>kbActor(name))},
  {role:'니콜라',primary:true,x:494,y:350,w:140,pw:45,actors:['이루원','유주연'].map(name=>kbActor(name))},
  {role:'엔젤들',bottom:true,hideNames:true,x:150,y:500,w:484,pw:44,actors:Array.from({length:8},(_,i)=>kbActor('엔젤 '+(i+1)))},
  {role:'공장 직원들',bottom:true,hideNames:true,x:150,y:625,w:330,pw:29,columns:8,actors:[kbActor('조지'),...Array.from({length:15},(_,i)=>kbActor('공장직원 '+(i+1),'공장직원들'+(i+1)))]},
  {role:'아역',bottom:true,hideNames:true,x:490,y:625,w:144,pw:32,columns:3,actors:[{"name":"유라현","file":"crops/유라현.png","crop":[0,0,1]},{"name":"여민혁","file":"crops/여민혁.png","crop":[0,0,1]},{"name":"박지호","file":"crops/박지호.png","crop":[0,0,1]},{"name":"이도현","file":"crops/이도현.png","crop":[0,0,1]},{"name":"김민준","file":"crops/김민준.png","crop":[0,0,1]},{"name":"조윤우","file":"crops/조윤우.png","crop":[0,0,1]}]}
];

/* === KINKY EXPORT CAST V2 END === */
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

const exportFonts =
  exportTheme?.fonts;

const exportStylesheet =
  exportTheme?.settlementExportStylesheet;

const exportBackground =
  exportTheme?.settlementExportBackground;

if (!exportFonts) {
  throw new Error(
    `Settlement export fonts are missing for ${WORK.id}`
  );
}

if (!exportStylesheet) {
  throw new Error(
    `Settlement export stylesheet is missing for ${WORK.id}`
  );
}

if (!exportBackground) {
  throw new Error(
    `Settlement export background is missing for ${WORK.id}`
  );
}

const exportThemeFonts =
  document.getElementById(
    'settlementExportThemeFonts'
  );

if (!exportThemeFonts) {
  throw new Error(
    'Settlement export font stylesheet element is missing'
  );
}

loads.push(
  new Promise((resolve, reject) => {
    exportThemeFonts.onload = () => {
      document.fonts.load('16px "Cafe24 Ssurround Air"', '킹키부츠').then(resolve, reject);
    };

    exportThemeFonts.onerror = reject;
    exportThemeFonts.href =
      exportFonts;
  })
);

const exportThemeStylesheet =
  document.getElementById(
    'settlementExportThemeStylesheet'
  );

if (!exportThemeStylesheet) {
  throw new Error(
    'Settlement export stylesheet element is missing'
  );
}

loads.push(
  new Promise((resolve, reject) => {
    exportThemeStylesheet.onload = resolve;
    exportThemeStylesheet.onerror = reject;
    exportThemeStylesheet.href =
      exportStylesheet;
  })
);

const exportBackdrop =
  document.querySelector('.backdrop');

if (!exportBackdrop) {
  throw new Error(
    'Settlement export backdrop element is missing'
  );
}

for (const image of document.querySelectorAll('.resume-logo, .resume-clip-loop, .resume-photo img')) {
  loads.push(image.decode());
}

loads.push(
  new Promise((resolve, reject) => {
    exportBackdrop.onload = resolve;
    exportBackdrop.onerror = reject;
    exportBackdrop.src = exportBackground;
  })
);
const portraitTextPatches={
  "유주연.jpg":[866,135,180,105,8,8],
  "엔젤 1.jpg":[866,135,178,106,200,8],
  "엔젤 2.jpg":[866,135,178,106,392,8],
  "엔젤 3.jpg":[866,135,178,106,584,8],
  "엔젤 4.jpg":[866,135,178,105,776,8],
  "엔젤 5.jpg":[866,135,178,105,968,8],
  "엔젤 6.jpg":[866,135,178,105,8,136],
  "엔젤 7.jpg":[798,135,313,105,200,136],
  "엔젤 8.jpg":[798,135,313,106,392,136],
  "조지.jpg":[860,135,191,106,584,136],
  "공장직원들1.jpg":[847,135,219,107,776,136],
  "공장직원들2.jpg":[842,135,228,107,968,136],
  "공장직원들3.jpg":[866,135,178,105,8,264],
  "공장직원들4.jpg":[786,135,327,105,200,264],
  "공장직원들5.jpg":[866,135,178,106,392,264],
  "공장직원들7.jpg":[866,135,178,106,584,264],
  "공장직원들8.jpg":[866,135,178,105,776,264],
  "공장직원들9.jpg":[755,100,366,151,968,264],
  "공장직원들11.jpg":[789,135,333,105,8,392],
  "공장직원들12.jpg":[866,135,178,106,200,392],
  "공장직원들13.jpg":[866,135,178,106,392,392],
  "공장직원들14.jpg":[866,135,178,105,584,392],
  "공장직원들15.jpg":[866,135,178,106,776,392]
};
const portraitTextReady=loadImage('themes/kinky-boots-2025-2026-7th-lola/assets/settlement/portrait-text-cleanup.png');
loads.push(portraitTextReady);
const cast=document.getElementById('cast');
const portraitDrawers=new Map();
const developerPortraitEditing=['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).get('editPhotos')==='1';
function validPortraitAdjustment(value){
  return value && ['x','y','zoom'].every(key=>typeof value[key]==='number'&&Number.isFinite(value[key]))
    && value.x>=0 && value.x<=1 && value.y>=0 && value.y<=1 && value.zoom>=1 && value.zoom<=8;
}
if(developerPortraitEditing){
window.getSettlementPortraits=()=>[...portraitDrawers].map(([file,entry])=>({file,name:entry.name,aspect:entry.aspect||3/4,defaults:{...entry.defaults}}));
window.setSettlementPortraits=(settings={})=>{
  for(const [file,entry] of portraitDrawers){
    const value=settings?.[file];
    if(validPortraitAdjustment(value))entry.defaults={x:value.x,y:value.y,zoom:value.zoom};
    entry.draw(entry.defaults);
  }
};
window.drawSettlementPortrait=(file,adjustment,canvas)=>{
  const entry=portraitDrawers.get(file);
  if(!entry||!canvas)throw Error('사진을 찾을 수 없습니다.');
  entry.draw(validPortraitAdjustment(adjustment)?adjustment:entry.defaults,canvas);
};
}
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
      loads.push(new Promise((resolve,reject)=>{
        const img=new Image();img.onload=()=>portraitTextReady.then(textAtlas=>{
          const [x,y,w,h]=item.crop;
          const sx=x*img.width,sy=y*img.height;
          const sw=Math.min(w*img.width,img.width-sx);
          const sh=Math.min(h===undefined?sw*4/3:h*img.height,img.height-sy);
          const scale=Math.max(canvas.width/sw,canvas.height/sh);
          const base=Math.max(canvas.width/img.width,canvas.height/img.height);
          const defaults={zoom:scale/base,
            x:Math.max(0,Math.min(1,(sx+(sw-canvas.width/scale)/2)/(img.width-canvas.width/scale)||0)),
            y:Math.max(0,Math.min(1,sy/(img.height-canvas.height/scale)||0))};
          const fixed=window.BollsarPortraitCrops?.[item.file];
          if(validPortraitAdjustment(fixed))Object.assign(defaults,{x:fixed.x,y:fixed.y,zoom:fixed.zoom});
          const draw=(adjustment,target=canvas)=>{
            const factor=Math.max(target.width/img.width,target.height/img.height)*adjustment.zoom;
            const ctx=target.getContext('2d');ctx.imageSmoothingQuality='high';ctx.clearRect(0,0,target.width,target.height);
            ctx.drawImage(img,-(img.width*factor-target.width)*adjustment.x,-(img.height*factor-target.height)*adjustment.y,img.width*factor,img.height*factor);
            const patch=portraitTextPatches[item.file];
            if(patch){
              const [x,y,w,h,ax,ay]=patch;
              const scaleX=textAtlas.width/1152,scaleY=textAtlas.height/512;
              ctx.drawImage(textAtlas,ax*scaleX,ay*scaleY,176*scaleX,112*scaleY,
                x*factor-(img.width*factor-target.width)*adjustment.x,
                y*factor-(img.height*factor-target.height)*adjustment.y,w*factor,h*factor);
            }
          };
          portraitDrawers.set(item.file,{name:item.name,defaults,draw});
          draw(defaults);canvas.dataset.source=item.file;resolve();
        }).catch(reject);
        img.onerror=()=>reject(Error('배우 사진을 불러오지 못했습니다: '+item.file));
        img.src='themes/kinky-boots-2025-2026-7th-lola/assets/boots/'+item.file.split('/').map(encodeURIComponent).join('/');
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
const regionalVenues = [
  ['고양', '고양아람누리 아람극장'],
  ['성남', '성남아트센터 오페라하우스'],
  ['여수', 'GS칼텍스 예울마루 대극장'],
  ['전주', '한국소리문화의전당 모악당'],
  ['용인', '용인포은아트홀'],
  ['광주', '광주예술의전당 대극장'],
  ['대구', '계명아트센터'],
  ['부산', '부산 드림씨어터']
];
const regionalStats = document.getElementById('regional-stats');
for (const [region, venue] of regionalVenues) {
  const row = document.createElement('div');
  row.className = 'regional-stat';
  const label = document.createElement('span');
  label.className = 'regional-name';
  label.textContent = region;
  const count = document.createElement('span');
  count.className = 'regional-count';
  count.dataset.venue = venue;
  row.append(label, count);
  regionalStats.append(row);
}
// Preview-only input boundary: the service can pass its selected visitColors and filtered performances.
window.setSettlementPreview=({visitColors={},records=[],performances=PERFS,includeTour=true}={})=>{
  regionalStats.hidden=!includeTour;
  const palette=Object.fromEntries(SEAT_COLORS.map(c=>[c.id,c.hex]));
  for(const swatch of document.querySelectorAll('.check')){
    const id=visitColors[swatch.dataset.level];
    swatch.style.setProperty('--visit-color',palette[id]||'transparent');
  }
  const visits=new Map();
  for(const item of records){
    const perf=item.perf||item;
    if((perf.venue||WORK.venue)!==SEAT_MAP.venue)continue;
    const seat=item.rec?.seat||item.seat;
    if(seat)visits.set(seat,(visits.get(seat)||0)+1);
  }
  for(const seat of document.querySelectorAll('.seat-cell')){
    const level=Math.min(visits.get(seat.dataset.seat)||0,4);
    const color=level&&palette[visitColors[level]];
    seat.classList.toggle('on',!!level);
    seat.style.background=color||'transparent';
    seat.style.color=color?'#160f1f':'';
    seat.textContent=(level||Number(seat.dataset.number)%5===0)?seat.dataset.number:'';
  }
  document.getElementById('total').textContent=records.length+' / '+performances.length;
  for(const count of regionalStats.querySelectorAll('[data-venue]')){
    const venue=count.dataset.venue;
    const total=performances.filter(perf=>perf.venue===venue).length;
    const watched=records.filter(item=>(item.perf||item).venue===venue).length;
    count.textContent=watched+' / '+total;
  }
  for(const count of document.querySelectorAll('[data-actor]')){
    const id=count.dataset.actor;
    const total=performances.filter(p=>Object.values(p.cast).includes(id)).length;
    const watched=records.filter(p=>Object.values((p.perf||p).cast||{}).includes(id)).length;
    count.textContent=watched+' / '+total;
  }
};
window.setSettlementPreview({visitColors:{1:'plum',2:'rose',3:'gold',4:'moss'}});
window.previewReady=Promise.all([...loads,document.fonts.ready]).then(()=>{
  if(allActors.length!==43||new Set(allActors.map(a=>a.file)).size!==43)throw Error('Cast inventory mismatch');
  if(new URLSearchParams(location.search).has('verify')){
    const assert=(ok,message)=>{if(!ok)throw Error(message);};
    assert([...document.querySelectorAll('.portrait canvas')].every(canvas=>canvas.dataset.source),'Every portrait loaded');
    assert([...document.querySelectorAll('.portrait canvas')].every(canvas=>[[0,0],[canvas.width-1,0],[0,canvas.height-1],[canvas.width-1,canvas.height-1]].every(([x,y])=>canvas.getContext('2d').getImageData(x,y,1,1).data[3]===255)),'Every portrait fills its frame');
    assert(new Set([...document.querySelectorAll('.legend label')].map(label=>label.getBoundingClientRect().top)).size===1,'Visit colors stay on one row');
    const chips=[...document.querySelectorAll('.check')];
    window.setSettlementPreview({visitColors:{1:'moss',2:'plum',3:'rose',4:'gold'},records:[PERFS[0]]});
    assert(chips.every((chip,i)=>getComputedStyle(chip).getPropertyValue('--visit-color').trim()===['#B4D49E','#CBABDD','#EBA0A6','#EFDD97'][i]),'Selected color mapping');
    assert(document.getElementById('total').textContent==='1 / '+PERFS.length,'Watched count');
    window.setSettlementPreview();
    assert(chips.every(chip=>getComputedStyle(chip).getPropertyValue('--visit-color').trim()==='transparent'),'Unselected colors must stay empty');
    assert([...document.querySelectorAll('.count')].every(count=>count.textContent.startsWith('0 / ')),'Unwatched numerators show zero');
    assert(regionalStats.children.length===8,'Eight regional rows');
    assert(regionalStats.querySelector('[data-venue]').textContent==='0 / '+PERFS.filter(perf=>perf.venue===regionalVenues[0][1]).length,'Regional denominator from schedule');
    const testSeat=document.querySelector('.seat-cell');
    window.setSettlementPreview({records:[{perf:PERFS[0],rec:{seat:testSeat.dataset.seat}}]});
    assert(!testSeat.classList.contains('on'),'Regional seat must not mark Seoul seat');
    assert(regionalStats.querySelector('[data-venue]').textContent.startsWith('1 / '),'Regional watched count');
    window.setSettlementPreview();
    const unwanted=['2026 관람 정산판','나의 관람 기록','나의 객석','관람 좌석','배우 출연 회차','SEATING RECORD','DAS MUSICAL','\uFFFD'];
    assert(unwanted.every(text=>!document.getElementById('board').innerText.includes(text)),'Removed text or encoding error');
    assert(document.fonts.check('16px "Cafe24 Ssurround Air"','킹키부츠'),'Service body font');
    assert([...document.querySelectorAll('.group')].filter(group=>['킹키부츠의 측근들','황실 세력가들','어린 루돌프','앙상블','죽음의 천사들'].includes(group.querySelector('.role').textContent)).every(group=>!group.querySelector('.name')),'Lower cast names must stay hidden');
    window.setPairCombinations(Array.from({length:4},()=>({names:['린아','카이'],watched:1,total:3})));
    assert(!pairBox.hidden&&pairList.children.length===4&&pairList.firstElementChild.children.length===2,'Plain pair text and counts');
    const paperContains=element=>{const r=element.getBoundingClientRect();return r.left>=134&&r.right<=1490&&r.top>=94&&r.bottom<=900;};
    assert(paperContains(pairBox),'Pairs stay on white paper');
    assert([...document.querySelectorAll('.group,.portrait,.seat-panel')].every(paperContains),'All profiles and seats stay on white paper');
    assert([...document.querySelectorAll('.group')].map(group=>group.querySelector('.role').textContent).join('|')==='찰리|롤라|로렌|돈|니콜라|엔젤들|공장 직원들|아역','Requested cast order');
    assert(document.querySelectorAll('.group:last-child .portrait').length===6,'Six individual child portraits');
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
  const canvas=await html2canvas(document.getElementById('board'),{
    scale:2,width:1586,height:992,backgroundColor:null,logging:false,useCORS:false
  });
  return await new Promise((resolve,reject)=>
    canvas.toBlob(blob=>blob?resolve(blob):reject(Error('PNG encoding failed')),'image/png')
  );
};
