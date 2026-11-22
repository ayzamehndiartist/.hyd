/* Loads the three JSON files in /content and shares them with the other scripts. */
window.esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
(function(){
  const get=u=>fetch(u).then(r=>{if(!r.ok)throw new Error(u);return r.json()});
  window.AyzaContent=Promise.all([get('content/settings.json'),get('content/services.json'),get('content/gallery.json')])
    .then(([settings,services,gallery])=>({settings,services,gallery}));
})();
