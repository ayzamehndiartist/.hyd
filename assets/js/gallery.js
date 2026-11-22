AyzaContent.then(({settings,gallery})=>{
  const f=document.getElementById('filters'),g=document.getElementById('grid'),empty=document.getElementById('empty');
  const cats=['All',...settings.galleryCategories];
  const allowedCats=new Set(settings.galleryCategories.map(c=>c.toLowerCase()));
  const visibleGallery=gallery.filter(p=>allowedCats.has(p.category.toLowerCase()));
  f.innerHTML=cats.map(c=>'<button type="button" data-c="'+esc(c)+'" aria-pressed="false">'+esc(c)+'</button>').join('');
  g.innerHTML=visibleGallery.map(p=>'<button type="button" data-c="'+esc(p.category)+'" aria-label="View larger: '+esc(p.alt)+'"><img src="'+p.src+'" alt="'+esc(p.alt)+'"'+(p.w?' width="'+p.w+'" height="'+p.h+'"':'')+' loading="lazy" decoding="async"></button>').join('');
  function filter(c){
    f.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c===c));
    let n=0;[...g.children].forEach(b=>{b.hidden=c!=='All'&&b.dataset.c.toLowerCase()!==c.toLowerCase();if(!b.hidden)n++});
    empty.hidden=n>0;
  }
  f.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;filter(b.dataset.c);history.replaceState(null,'',b.dataset.c==='All'?location.pathname:'#'+b.dataset.c.toLowerCase())});
  const h=decodeURIComponent(location.hash.slice(1)).toLowerCase();
  filter(cats.find(c=>c.toLowerCase()===h)||'All');

  const lb=document.createElement('div');
  lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Photo viewer');
  lb.innerHTML='<button class="lb-x" type="button">Close</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-p" type="button">Previous</button><button class="lb-n" type="button">Next</button>';
  document.body.appendChild(lb);
  const img=lb.querySelector('img'),cap=lb.querySelector('figcaption'),btns=lb.querySelectorAll('button');
  let vis=[],cur=0,opener=null;
  function show(){
    const im=vis[cur].querySelector('img');
    img.style.opacity=0;img.onload=()=>{img.style.opacity=1};
    img.src=im.currentSrc||im.src;img.alt=im.alt;
    if(img.complete)img.style.opacity=1;
    cap.textContent=(cur+1)+' of '+vis.length+': '+im.alt;
  }
  const step=d=>{cur=(cur+d+vis.length)%vis.length;show()};
  function close(){lb.classList.remove('open');document.body.style.overflow='';if(opener)opener.focus()}
  g.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    vis=[...g.children].filter(x=>!x.hidden);cur=vis.indexOf(b);opener=b;
    show();lb.classList.add('open');document.body.style.overflow='hidden';lb.querySelector('.lb-x').focus();
  });
  lb.querySelector('.lb-x').onclick=close;
  lb.querySelector('.lb-p').onclick=()=>step(-1);
  lb.querySelector('.lb-n').onclick=()=>step(1);
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  document.addEventListener('keydown',e=>{
    if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')close();
    else if(e.key==='ArrowLeft')step(-1);
    else if(e.key==='ArrowRight')step(1);
    else if(e.key==='Tab'){const first=btns[0],last=btns[btns.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
  });
  let x0=0;
  lb.addEventListener('touchstart',e=>{x0=e.changedTouches[0].clientX},{passive:true});
  lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>50)step(d<0?1:-1)},{passive:true});
}).catch(()=>{});
