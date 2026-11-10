(()=>{
  const h=document.querySelector('#header');
  const set=()=>document.documentElement.style.setProperty('--deck-header',(h?Math.max(0,h.getBoundingClientRect().bottom):0)+'px');
  set();addEventListener('scroll',set,{passive:true});addEventListener('resize',set);addEventListener('load',set);
})();
(()=>{
  const CARD=1,HOLD=.4,SMOOTH=.12,FILL=.94;
  const SCATTER=1,TILT=10,IMGZOOM=.15;
  const STICKER_SIZE=1,STICKER_POP=.12,STICKER_SPREAD=.7;
  const REST=[{x:-3,y:-1,r:-2},{x:3,y:.5,r:1.5},{x:-.5,y:1,r:-.75},{x:2,y:-.5,r:1.25},{x:-2,y:.75,r:-1.5}];
  const SLOTS=[
    {x:3,y:6,w:12,r:-8},{x:83,y:5,w:11,r:6},{x:2,y:70,w:12,r:5},{x:85,y:68,w:11,r:-6},
    {x:24,y:3,w:9,r:3},{x:63,y:4,w:9,r:-5},{x:9,y:38,w:9,r:9},{x:89,y:36,w:9,r:-10},
    {x:28,y:82,w:10,r:-4},{x:60,y:83,w:9,r:6},{x:44,y:2,w:8,r:-3},{x:45,y:86,w:8,r:4}
  ];
  const clamp=(v,a=0,b=1)=>Math.min(Math.max(v,a),b);
  const ease=x=>1-Math.pow(1-x,3);
  const strip=h=>{const d=document.createElement('div');d.innerHTML=h||'';return d.textContent.trim()};
  const list=v=>(v||'').split(',').map(s=>s.trim()).filter(Boolean);
  const imgUrl=(u,w)=>/\.(gif|webp)($|\?)/i.test(u)?u:u+'?format='+w+'w';
  const getItems=async url=>{
    if(!url)return [];
    try{const r=await fetch(url+'?format=json');return (await r.json()).items||[]}catch(e){return []}
  };
  document.querySelectorAll('.deck').forEach(async el=>{
    const sec=el.closest('section');
    if(!sec||sec.querySelector('.deck-track'))return;
    const items=await getItems(el.dataset.collection);
    if(!items.length)return;
    const scraps=(await getItems(el.dataset.scatter)).filter(i=>i.assetUrl);
    const btnStyles=list(el.dataset.buttons||'primary').map(s=>s.toLowerCase());
    const ds=el.dataset;
    const bgColors=list(ds.cardColors),txtColors=list(ds.cardTextColors);
    const glowOn=(ds.glow||'on').trim().toLowerCase()!=='off';
    const GLOW=glowOn?(parseFloat(ds.glowStrength)||1):0;
    const COVER=(ds.cover||'off').trim().toLowerCase()==='on';

    const track=document.createElement('div');
    track.className='deck-track';
    if(ds.glowColor)track.style.setProperty('--glow-color',ds.glowColor.trim());
    if(ds.glowSize)track.style.setProperty('--glow-size',(parseFloat(ds.glowSize)||50)+'px');
    if(ds.mobileImage)track.style.setProperty('--m-img',(parseFloat(ds.mobileImage)||16)+'vh');
    if(ds.mobileText)track.style.setProperty('--m-text',parseFloat(ds.mobileText)||1);
    const fontName=(ds.fontName||'').trim().replace(/["']/g,'');
    const fontUrl=(ds.fontUrl||'').trim().replace(/\/+$/,'');
    if(fontName)track.style.setProperty('--deck-font','"'+fontName+'", var(--heading-font-font-family, sans-serif)');
    if(ds.fontWeight)track.style.setProperty('--deck-weight',ds.fontWeight.trim());
    if(ds.headlineColor)track.style.setProperty('--deck-word-color',ds.headlineColor.trim());
    if(btnStyles[0]==='off')track.classList.add('deck-nobtn');
    if(ds.nudge)sec.style.setProperty('--deck-nudge',parseFloat(ds.nudge)+'px');
    const stage=document.createElement('div');
    stage.className='deck-stage';
    const src=el.querySelector('h1,h2,h3');
    const word=src?src.cloneNode(true):document.createElement('h2');
    if(!src)word.textContent=ds.headline||'';
    word.classList.add('deck-word');
    const fit=document.createElement('span');
    fit.append(...word.childNodes);
    word.append(fit);
    stage.append(word);
    track.append(stage);

    /* card text: your site's Paragraph 3 by default; data-text-style="p1"/"p2", or data-text-size for an exact size */
    const kvP=(cls,host)=>{const w=document.createElement('div');w.className='sqs-block html-block sqs-block-html';w.style.cssText='position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;width:300px';
    w.innerHTML='<div class="sqs-block-content"><div class="sqs-html-content"><p class="'+cls+'">x</p></div></div>';(host||document.body).append(w);
    const cs=getComputedStyle(w.querySelector('p')),r=[cs.fontSize,cs.lineHeight];w.remove();return r};
    const dcls={p1:'sqsrte-large',p2:'',p3:'sqsrte-small'}[(ds.textStyle||'p3').toLowerCase()];
    const setDeckText=()=>{if(ds.textSize){track.style.setProperty('--deck-p',ds.textSize);return}if(dcls===undefined)return;
      const [f,l]=kvP(dcls,(el.closest('.page-section')||document.body).querySelector('.content-wrapper'));track.style.setProperty('--deck-p',f);track.style.setProperty('--deck-p-lh',l)};
    setDeckText();addEventListener('resize',setDeckText);if(document.fonts)document.fonts.ready.then(setDeckText);
    const cards=items.map((it,n)=>{
      const c=document.createElement('article');
      c.className='deck-card deck-card-'+(n+1);
      if(bgColors.length)c.style.setProperty('--deck-card-bg',bgColors[n%bgColors.length]);
      if(txtColors.length)c.style.setProperty('--deck-card-text',txtColors[n%txtColors.length]);
      const ex=strip(it.excerpt);
      c.innerHTML='<div class="deck-img"><img alt="" loading="lazy"></div><div class="deck-txt"><small></small><h3></h3>'+(ex?'<p></p>':'')+'<a></a></div>';
      const img=c.querySelector('img');
      if(it.assetUrl&&(ds.images||'on')!=='off'){img.src=imgUrl(it.assetUrl,1500);img.alt=it.title||'';}
      else c.querySelector('.deck-img').remove();
      c.querySelector('small').textContent=String(n+1).padStart(2,'0');
      c.querySelector('h3').textContent=it.title||'';
      if((ds.titleCase||'upper')==='upper')c.querySelector('h3').style.textTransform='uppercase';
      if(ex)c.querySelector('p').textContent=ex;
      const a=c.querySelector('a');
      const style=btnStyles[n%btnStyles.length]||'primary';
      a.className='deck-btn sqs-block-button-element sqs-block-button-element--medium sqs-button-element--'+style;
      a.href=it.sourceUrl||it.fullUrl||'#';
      a.textContent=(it.tags&&it.tags[0])||ds.button||'Find out more';
      if(it.title)a.setAttribute('aria-label',a.textContent+': '+it.title);
      stage.append(c);
      return {c,img,r:REST[n%REST.length]};
    });

    const span=cards.length*CARD;
    const pieces=scraps.map((it,k)=>{
      const s=SLOTS[k%SLOTS.length];
      const tags=(it.tags||[]).map(t=>t.toLowerCase());
      const d=document.createElement('div');
      d.className='deck-scrap '+(tags.includes('photo')?'photo':'sticker')+(tags.includes('front')?' front':'');
      d.setAttribute('aria-hidden','true');
      d.style.cssText='--x:'+s.x+';--y:'+s.y+';--w:'+(s.w*STICKER_SIZE).toFixed(2);
      const im=document.createElement('img');
      im.alt='';
      im.src=imgUrl(it.assetUrl,1000);
      d.append(im);
      stage.append(d);
      return {d,s,at:k/Math.max(scraps.length,1)*span*STICKER_SPREAD,sp:[-30,-70,-50][k%3]};
    });

    sec.classList.add('deck-section');
    sec.append(track);

    const fitWord=()=>{
      if(track.classList.contains('deck-static'))return;
      const w=stage.clientWidth;
      if(!w)return;
      word.style.setProperty('font-size','100px','important');
      const tw=fit.getBoundingClientRect().width;
      if(tw)word.style.setProperty('font-size',(100*w*FILL/tw).toFixed(1)+'px','important');
    };

    if(fontName&&fontUrl&&window.FontFace){
      new FontFace(fontName,'url("'+fontUrl+'")').load().then(f=>{document.fonts.add(f);fitWord()}).catch(()=>{});
    }

    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return track.classList.add('deck-static');

    if(COVER){
      let n=sec.nextElementSibling,first=true;
      while(n){
        if(n.matches('section')){
          n.classList.add('deck-cover-after');
          if(first){n.classList.add('deck-cover-first');first=false;}
          if(ds.coverColor)n.style.setProperty('--deck-cover-bg',ds.coverColor.trim());
        }
        n=n.nextElementSibling;
      }
    }

    const total=span+HOLD;
    const size=()=>track.style.height=(innerHeight*(1+total+(COVER?1:0)))+'px';
    let cur=0,tgt=0,raf=null;

    const render=()=>{
      const p=cur/CARD;
      const landed=cards.map((o,i)=>ease(clamp((p-i)/.6)));
      cards.forEach((o,i)=>{
        const local=p-i;
        let sw=landed[i];
        if(i===0)sw=Math.max(sw,.22);
        const x=o.r.x*SCATTER*sw,y=(1-sw)*95+o.r.y*SCATTER*sw,rot=(1-sw)*-TILT+o.r.r*SCATTER*sw;
        o.c.style.transform='translate(-50%,-50%) translate('+x.toFixed(2)+'%,'+y.toFixed(2)+'%) rotate('+rot.toFixed(2)+'deg)';
        o.c.style.visibility=(i>0&&local<-.05)?'hidden':'visible';
        o.img.style.transform='scale('+(1+IMGZOOM-IMGZOOM*ease(clamp((local-.5)/.5))).toFixed(3)+')';
        const glow=landed[i]*(1-(landed[i+1]||0))*GLOW;
        o.c.style.setProperty('--glow',glow.toFixed(3));
      });
      pieces.forEach(o=>{
        const q=ease(clamp((cur-o.at)/STICKER_POP));
        const drift=Math.max(cur-o.at,0)*o.sp;
        o.d.style.opacity=q.toFixed(3);
        o.d.style.transform='translateY('+((1-q)*-30+drift).toFixed(1)+'px) rotate('+(o.s.r+(1-q)*12).toFixed(2)+'deg) scale('+(.7+.3*q).toFixed(3)+')';
      });
    };
    const tick=()=>{
      cur+=(tgt-cur)*SMOOTH;
      if(Math.abs(tgt-cur)<.0005)cur=tgt;
      render();
      raf=cur!==tgt?requestAnimationFrame(tick):null;
    };
    const update=()=>{
      tgt=clamp(-track.getBoundingClientRect().top/innerHeight,0,total);
      if(!raf)raf=requestAnimationFrame(tick);
    };
    addEventListener('scroll',update,{passive:true});
    addEventListener('resize',()=>{size();fitWord();update()});
    addEventListener('load',()=>{size();fitWord();update()});
    if(document.fonts)document.fonts.ready.then(fitWord);
    size();fitWord();update();render();
  });
})();
