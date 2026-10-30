(() => {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  // Admin-controlled honesty notice: visible by default, editable, and hideable.
  try {
    const savedSettings = JSON.parse(localStorage.getItem('msPortfolioSettingsV1') || '{}');
    const notice = document.querySelector('.portfolio-disclaimer');
    if (notice) {
      if (savedSettings.showPreviewNotice === false) notice.hidden = true;
      const heading = notice.querySelector('b');
      const paragraph = notice.querySelector('p');
      if (heading && savedSettings.previewNoticeTitle) heading.textContent = savedSettings.previewNoticeTitle;
      if (paragraph && savedSettings.previewNoticeText) {
        // Preserve the heading and set the remaining message as text, not HTML.
        paragraph.textContent = '';
        if (heading) paragraph.appendChild(heading);
        paragraph.appendChild(document.createTextNode(' ' + savedSettings.previewNoticeText));
      }
    }
  } catch (error) { /* keep the safe default notice */ }
  // Apply portfolio samples uploaded from the local admin panel.
  try {
    const saved = JSON.parse(localStorage.getItem('msPortfolioSettingsV1') || '{}');
    const samples = Array.isArray(saved.samples) ? saved.samples : [];
    const categoryLabels = { social: 'Social Media', product: 'Product Ads', ecommerce: 'E-commerce', banners: 'Banners' };
    samples.forEach((sample, index) => {
      if (!sample || !sample.image || !grid.children[index]) return;
      const card = grid.children[index];
      const title = sample.title || `Portfolio Sample ${index + 1}`;
      const description = sample.description || 'Portfolio design sample uploaded by Muhammad Shahzad.';
      const category = sample.category || 'social';
      card.dataset.uploaded = 'true';
      card.dataset.category = category;
      card.dataset.title = title;
      card.dataset.description = description;
      card.setAttribute('aria-label', `View ${title}`);
      const art = card.querySelector('.project-art');
      if (art) {
        art.replaceChildren();
        art.className = 'project-art project-uploaded-art';
        const image = document.createElement('img');
        image.className = 'uploaded-project-image';
        image.src = sample.image;
        image.alt = title;
        image.loading = 'lazy';
        art.appendChild(image);
      }
      const info = card.querySelector('.project-info');
      if (info) {
        const textWrap = info.querySelector('span');
        if (textWrap) {
          const titleEl = textWrap.querySelector('b');
          const captionEl = textWrap.querySelector('small');
          if (titleEl) titleEl.textContent = title;
          if (captionEl) captionEl.textContent = `${categoryLabels[category] || 'Creative Work'} · Uploaded sample`;
        }
      }
    });
  } catch (error) { /* keep built-in placeholder cards if saved data is unavailable */ }
  // Load online portfolio items from Supabase (if configured). Existing placeholder cards remain as fallback.
  (async()=>{
    try {
      if(!window.portfolioSupabase)return;
      const {data,error}=await window.portfolioSupabase.from('portfolio_items').select('*').eq('is_visible',true).order('sort_order',{ascending:true});
      if(error||!Array.isArray(data)||!data.length)return;
      grid.replaceChildren();
      const labels={social:'Social Media',product:'Product Ads',ecommerce:'E-commerce',banners:'Banners'};
      data.forEach(item=>{
        const card=document.createElement('button');card.type='button';card.className='portfolio-project';card.dataset.category=item.category||'social';card.dataset.title=item.title||'Portfolio design';card.dataset.description=item.caption||'';card.dataset.uploaded='true';card.setAttribute('aria-label','View '+card.dataset.title);
        const art=document.createElement('span');art.className='project-art project-uploaded-art';const img=document.createElement('img');img.className='uploaded-project-image';img.src=item.image_url;img.alt=card.dataset.title;img.loading='lazy';art.appendChild(img);
        const info=document.createElement('span');info.className='project-info';const wrap=document.createElement('span');const b=document.createElement('b');b.textContent=card.dataset.title;const small=document.createElement('small');small.textContent=(labels[item.category]||'Creative Work')+' · Portfolio work';wrap.append(b,small);const arrow=document.createElement('span');arrow.className='work-arrow';arrow.textContent='↗';info.append(wrap,arrow);card.append(art,info);grid.appendChild(card);
      });
      // Newly created cards need the same accessible lightbox behavior as the original cards.
      grid.querySelectorAll('.portfolio-project').forEach(project=>project.addEventListener('click',()=>{previousFocus=project;title.textContent=project.dataset.title||'Portfolio sample';description.textContent=project.dataset.description||'';const note=document.querySelector('.lightbox-note');if(note)note.textContent='Portfolio sample uploaded by Muhammad Shahzad.';modal.hidden=false;document.body.style.overflow='hidden';close.focus();}));
    } catch(e){console.warn('Could not load online portfolio items',e);}
  })();
  const filters = [...document.querySelectorAll('.filter-button')];
  const projects = [...grid.querySelectorAll('.portfolio-project')];
  const empty = document.querySelector('.portfolio-empty');
  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    let shown = 0;
    // Query the current grid each time because Supabase cards are added asynchronously.
    [...grid.querySelectorAll('.portfolio-project')].forEach((project, index) => {
      const visible = filter === 'all' || project.dataset.category === filter;
      project.hidden = !visible;
      if (visible) { shown++; project.style.animation = 'none'; project.offsetHeight; project.style.animation = `portfolioPop .35s ease both`; project.style.animationDelay = `${Math.min(index * 45, 180)}ms`; }
    });
    if (empty) empty.hidden = shown !== 0;
  }));

  const modal = document.querySelector('.project-lightbox');
  const title = document.getElementById('lightbox-title');
  const description = document.querySelector('.lightbox-description');
  const close = document.querySelector('.lightbox-close');
  let previousFocus = null;
  const closeModal = () => { if (!modal) return; modal.hidden = true; document.body.style.overflow = ''; if (previousFocus) previousFocus.focus(); };
  projects.forEach(project => project.addEventListener('click', () => {
    previousFocus = project;
    title.textContent = project.dataset.title || 'Portfolio sample';
    description.textContent = project.dataset.description || 'Placeholder sample; real work coming soon.';
    const note = document.querySelector('.lightbox-note');
    if (note) note.textContent = project.dataset.uploaded === 'true' ? 'Uploaded portfolio sample.' : 'This is a placeholder only—not a completed project or client work.';
    modal.hidden = false; document.body.style.overflow = 'hidden'; close.focus();
  }));
  if (close) close.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal && !modal.hidden) closeModal(); });
})();
