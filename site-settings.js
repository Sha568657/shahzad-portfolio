(async function(){
  const KEY='msPortfolioSettingsV1'; let s={};
  // Online database is authoritative; local storage is a fallback for offline preview.
  try {
    if (window.portfolioSupabase) {
      const { data, error } = await window.portfolioSupabase.from('site_settings').select('settings').eq('id',1).maybeSingle();
      if (!error && data && data.settings && typeof data.settings === 'object') {
        s = data.settings; localStorage.setItem(KEY, JSON.stringify(s));
      } else { s = JSON.parse(localStorage.getItem(KEY)||'{}')||{}; }
    } else { s = JSON.parse(localStorage.getItem(KEY)||'{}')||{}; }
  } catch(e) { try{s=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(_){} }

  const q=(sel)=>document.querySelector(sel), qa=(sel)=>Array.from(document.querySelectorAll(sel));
  const setText=(el,v)=>{if(el&&typeof v==='string')el.textContent=v;};
  const setAll=(sel,v)=>qa(sel).forEach(el=>setText(el,v));
  const safeUrl=(v)=>{try{const u=new URL(v,location.href);return ['http:','https:','mailto:'].includes(u.protocol)?u.href:'#';}catch(e){return '#';}};
  if(s.name){qa('.visual-name').forEach(el=>setText(el,s.name));qa('.brand:not(.footer-brand) > span:last-child').forEach(el=>{const p=s.name.trim().split(/\s+/),last=p.pop()||'';el.innerHTML=p.map(escapeHtml).join(' ')+(p.length?' ':'')+'<b>'+escapeHtml(last)+'</b>';});qa('.footer-brand > span:last-child').forEach(el=>{const p=s.name.trim().split(/\s+/),last=p.pop()||'';el.innerHTML=p.map(escapeHtml).join(' ')+(p.length?' ':'')+'<b>'+escapeHtml(last)+'</b>';});}
  function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  if(s.headline){const h=q('.hero h1');if(h){const parts=s.headline.trim().split(/\s+/);if(parts.length>1){const first=parts.slice(0,-1).map(escapeHtml).join(' ');const last=escapeHtml(parts[parts.length-1]);h.innerHTML=first+'<br><span class="gradient-text">'+last+'.</span>'; }else{h.innerHTML='<span class="gradient-text">'+escapeHtml(s.headline)+'.</span>';}}}
  if(s.role)setText(q('.hero-copy h2'),s.role);
  if(s.description)setText(q('.hero-description'),s.description);
  if(s.location){const spans=qa('.hero-meta span');if(spans[0]){const svg=spans[0].querySelector('svg');spans[0].textContent=s.location;if(svg)spans[0].prepend(svg);}}
  if(s.education){const spans=qa('.hero-meta span');if(spans[1])setText(spans[1],s.education);}
  if(s.accent)document.documentElement.style.setProperty('--orange',s.accent);
  if(s.blue)document.documentElement.style.setProperty('--blue',s.blue);
  if(s.photo){document.documentElement.style.setProperty('--hero-photo',`url("${s.photo}")`);}
  if(s.photoPosition)document.documentElement.style.setProperty('--hero-photo-position',s.photoPosition);
  if(s.photoOverlay)document.documentElement.style.setProperty('--hero-photo-opacity',s.photoOverlay);
  const aboutPs=qa('.about-copy p'); if(s.aboutText1&&aboutPs[0])setText(aboutPs[0],s.aboutText1);if(s.aboutText2&&aboutPs[1])setText(aboutPs[1],s.aboutText2);
  // The About page uses its own selectors; keep these settings editable there too.
  const aboutLead=qa('.about-hero-copy .about-lead');if(s.aboutText1&&aboutLead[0])setText(aboutLead[0],s.aboutText1);if(s.aboutText2&&aboutLead[1])setText(aboutLead[1],s.aboutText2);
  if(s.aboutHeadline){const h=q('#about .section-heading h2')||q('.about-hero-copy h1');if(h){if(h.matches('.about-hero-copy h1'))h.textContent=s.aboutHeadline;else setText(h,s.aboutHeadline);}}
  const serviceCards=qa('.service-card');[1,2,3].forEach(n=>{const card=serviceCards[n-1];if(!card)return;if(s['service'+n+'Title'])setText(card.querySelector('h3'),s['service'+n+'Title']);if(s['service'+n+'Text'])setText(card.querySelector('p'),s['service'+n+'Text']);if(s['service'+n+'Label'])setText(card.querySelector('.service-count'),s['service'+n+'Label']);});
  const workCards=qa('.work-card');[1,2,3].forEach(n=>{const card=workCards[n-1];if(!card)return;if(s['work'+n+'Title'])setText(card.querySelector('.work-caption h3'),s['work'+n+'Title']);if(s['work'+n+'Text'])setText(card.querySelector('.work-caption p'),s['work'+n+'Text']);});
  const socials={instagram:'Instagram',facebook:'Facebook',youtube:'YouTube',whatsapp:'WhatsApp'};Object.keys(socials).forEach(k=>{if(s[k])qa('.footer-links a').filter(a=>a.textContent.toLowerCase().includes(socials[k].toLowerCase())).forEach(a=>a.href=safeUrl(s[k]));});
  if(s.email){qa('a[href^="mailto:"]').forEach(a=>a.href='mailto:'+s.email);qa('a').forEach(a=>{if(a.textContent.includes('shahzadramzanbhatti@gmail.com'))setText(a,a.textContent.replace('shahzadramzanbhatti@gmail.com',s.email));});}
  if(s.phone){const phone=s.phone.replace(/\D/g,'');qa('a[href*="wa.me/"]').forEach(a=>a.href='https://wa.me/'+phone);}
  // WhatsApp chat buttons must always open a direct one-to-one chat, never a channel.
  const phoneDigits=String(s.phone||'923241741512').replace(/\D/g,'');
  const directChat='https://wa.me/'+phoneDigits;
  qa('[data-whatsapp-chat]').forEach(a=>a.href=directChat);
  // The footer's social WhatsApp link may point to a channel if the owner chooses one.
  if(s.whatsapp){const url=safeUrl(s.whatsapp);qa('.footer-links a').filter(a=>a.textContent.toLowerCase().includes('whatsapp')).forEach(a=>a.href=url);}
  if(s.footerTagline)setText(q('.site-footer>p'),s.footerTagline);
  if(s.copyright){const c=q('.footer-bottom span');if(c)c.textContent='© '+new Date().getFullYear()+' '+s.copyright;}

  // Editable job-only availability and contact-page copy.
  if(s.availabilityText){qa('.profile-open-to, .open-to-value, [data-profile-availability]').forEach(el=>setText(el,s.availabilityText));qa('body *').filter(el=>el.children.length===0 && /Jobs\s*[·•]\s*Internships\s*[·•]\s*Freelance projects/i.test(el.textContent||'')).forEach(el=>setText(el,s.availabilityText));}
  if(s.aboutCTAHeading)setText(q('.contact-cta .cta-content h2'),s.aboutCTAHeading);
  if(s.aboutCTAText)setText(q('.contact-cta .cta-content > p:not(.section-kicker)'),s.aboutCTAText);
  if(s.contactLead)setText(q('.contact-hero-copy .contact-lead'),s.contactLead);
  if(s.contactIntro)setText(q('.contact-hero-copy .contact-note'),s.contactIntro);
  if(s.topic1Title)setText(q('.contact-topic-grid .contact-topic:first-child h3'),s.topic1Title);
  if(s.topic1Text)setText(q('.contact-topic-grid .contact-topic:first-child p'),s.topic1Text);
  [['showAbout','#about'],['showServices','#services'],['showWork','#work'],['showContact','#contact']].forEach(([key,sel])=>{if(s[key]===false){const el=q(sel);if(el)el.hidden=true;}});
})();
