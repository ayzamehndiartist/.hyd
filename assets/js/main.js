(function(){
  const pages=[['index.html','Home'],['about.html','About'],['services.html','Services'],['gallery.html','Gallery'],['contact.html','Contact']];
  const cur=location.pathname.split('/').pop()||'index.html';
  const hdr=document.getElementById('site-header');
  hdr.className='hdr';
  hdr.innerHTML='<div class="wrap"><a class="brand" href="index.html">AYZA HENNA ARTIST</a>'+
    '<button class="burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="Open menu"><span></span><span></span><span></span></button>'+
    '<nav class="nav" id="nav" aria-label="Main">'+pages.map(([u,t])=>'<a href="'+u+'"'+(u===cur?' class="on" aria-current="page"':'')+'>'+t+'</a>').join('')+
    '<a class="btn" data-booking href="#">Book Now</a></nav></div>';
  const btn=hdr.querySelector('.burger'),nav=hdr.querySelector('.nav');
  const toggle=o=>{nav.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Close menu':'Open menu')};
  btn.addEventListener('click',()=>toggle(!nav.classList.contains('open')));
  nav.addEventListener('click',e=>{if(e.target.closest('a'))toggle(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')toggle(false)});

  document.getElementById('site-footer').innerHTML='<div class="wrap foot"><div><p class="brand">AYZA HENNA ARTIST</p><p data-s="location">Hyderabad, Telangana, India</p></div>'+
    '<div class="flinks">'+pages.map(([u,t])=>'<a href="'+u+'">'+t+'</a>').join('')+'<a data-ig href="https://www.instagram.com/_ayza_khann/" target="_blank" rel="noopener">Instagram</a></div></div>'+
    '<p class="wrap copy">&copy; '+new Date().getFullYear()+' Ayza Henna Artist</p>';

  AyzaContent.then(({settings,services,gallery})=>{
    document.querySelectorAll('[data-s]').forEach(el=>{if(settings[el.dataset.s])el.textContent=settings[el.dataset.s]});
    document.querySelectorAll('[data-ig]').forEach(el=>el.href=settings.instagram);
    let bookingUrl='';
    if(settings.googleFormUrl){
      try{
        const url=new URL(settings.googleFormUrl);
        if(url.protocol==='https:'||url.protocol==='http:')bookingUrl=url.href;
        else throw new Error('Google Form URL must use HTTP or HTTPS.');
      }catch(err){
        console.error('Invalid Google Form URL in content/settings.json.',err);
      }
    }
    const updateBookingLinks=()=>{
      document.querySelectorAll('[data-booking]').forEach(el=>{
        if(bookingUrl){
          el.href=bookingUrl;
          el.target='_blank';
          el.rel='noopener';
        }else{
          const placeholder=document.createElement('span');
          placeholder.className=el.className;
          placeholder.textContent='Book Now';
          placeholder.setAttribute('aria-disabled','true');
          el.replaceWith(placeholder);
        }
      });
    };
    const feat=document.getElementById('featured');
    if(feat){
      let list=gallery.filter(g=>g.featured);if(!list.length)list=gallery;
      feat.innerHTML=list.slice(0,6).map(p=>'<img src="'+p.src+'" alt="'+esc(p.alt)+'" loading="lazy" decoding="async">').join('');
    }
    const box=document.getElementById('services');
    if(box){
      box.innerHTML=services.map(s=>'<article class="svc"><img src="'+s.image+'" alt="'+esc(s.alt)+'" loading="lazy" decoding="async"><div><h3>'+esc(s.name)+'</h3><p>'+esc(s.description)+'</p><p class="price">'+esc(s.price||'Contact for pricing')+'</p>'+
        '<a class="btn ghost" data-booking href="#">Book Now</a></div></article>').join('');
    }
    updateBookingLinks();
  }).catch(err=>{
    console.error(err);
    document.body.insertAdjacentHTML('afterbegin','<p class="note">Content could not load. If you opened this file directly, run a local server instead (see README).</p>');
  });
})();
