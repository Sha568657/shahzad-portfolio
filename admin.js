(()=>{
const SETTINGS='msPortfolioSettingsV1', AUTH='msPortfolioAdminAuthV1';
const $=id=>document.getElementById(id);let settings={};
try{settings=JSON.parse(localStorage.getItem(SETTINGS)||'{}')||{};}catch(e){}
const sb=window.portfolioSupabase; const getAuth=async()=>sb?await sb.auth.getSession():{data:{session:null}};
const setStatus=(msg,error=false)=>{const el=$('status');if(el){el.textContent=msg;el.className=error?'status error':'status';}};
function showSetup(){ $('setup').classList.add('hidden');$('login').classList.remove('hidden');$('dashboard').classList.add('hidden'); }
function showLogin(){ $('setup').classList.add('hidden');$('login').classList.remove('hidden');$('dashboard').classList.add('hidden'); }
function showDashboard(){ $('setup').classList.add('hidden');$('login').classList.add('hidden');$('dashboard').classList.remove('hidden');fillForm(); }
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16)}
function fillForm(){Object.keys(defaults).forEach(k=>{if($(k)){if($(k).type==='checkbox')$(k).checked=settings[k]!==undefined?!!settings[k]:!!defaults[k];else $(k).value=settings[k]!==undefined?settings[k]:defaults[k];}});if(settings.photo){$('photoPreview').src=settings.photo;$('photoPreview').classList.remove('hidden');}for(let i=1;i<=6;i++){const sample=(settings.samples||[])[i-1]||{};const title=$('sampleTitle'+i),category=$('sampleCategory'+i),description=$('sampleDescription'+i),preview=$('samplePreview'+i),state=$('sampleState'+i);if(title)title.value=sample.title||'';if(category)category.value=sample.category||'social';if(description)description.value=sample.description||'';if(preview){if(sample.image){preview.src=sample.image;preview.classList.remove('hidden');}else{preview.removeAttribute('src');preview.classList.add('hidden');}}if(state)state.textContent=sample.image?'Image saved':'No image yet';}document.querySelectorAll('[data-preset]').forEach(b=>b.classList.toggle('active',b.dataset.preset===(settings.preset||'orange')));}
const defaults={name:'Muhammad Shahzad',headline:'Muhammad Shahzad.',role:'Office Administration & Travel Operations | Developing Graphic Designer',description:'I bring together office support, travel-related documentation, customer service, and a growing passion for AI-assisted graphic design.',location:'Multan, Pakistan',education:'BS Mathematics · 4th Semester',email:'shahzadramzanbhatti@gmail.com',phone:'923241741512',accent:'#ff8a3d',blue:'#52a8ff',photoPosition:'center 27%',photoOverlay:'0.92',aboutHeadline:'Reliable support. Creative curiosity.',aboutText1:'I’m a motivated, adaptable professional from Multan, Pakistan, with experience supporting travel-related tasks, documentation, customer communication, and day-to-day office administration.',aboutText2:'I’m pursuing a BS in Mathematics at Government Graduate College, Civil Lines, Multan. My degree will be awarded by Bahauddin Zakariya University (BZU). Alongside my studies and office experience, I’m building practical skills in graphic design and AI-assisted creative work.',service1Title:'Graphic & AI-Assisted Design',service1Label:'01 / CREATIVE',service1Text:'Social media posts, product advertisements, e-commerce creatives, and promotional banners.',service2Title:'Office & Documentation',service2Label:'02 / DOCUMENTS',service2Text:'Document formatting, data entry, basic spreadsheets, and organized digital records.',service3Title:'Travel-Related Support',service3Label:'03 / OPERATIONS',service3Text:'Administrative assistance with travel-related documentation and customer communication.',work1Title:'Social Media Post',work1Text:'Sample area · real work coming soon',work2Title:'Product Advertisement',work2Text:'Sample area · real work coming soon',work3Title:'E-commerce Creative',work3Text:'Sample area · real work coming soon',instagram:'https://www.instagram.com/shahzadfinds/',facebook:'https://facebook.com/ShahzadFinds',youtube:'https://www.youtube.com/@ShahzadFinds',whatsapp:'https://wa.me/923241741512',footerTagline:'Building skills. Creating opportunities.',copyright:'Muhammad Shahzad. All rights reserved.',availabilityText:'Jobs · Full-time roles',aboutCTAHeading:'Open to job opportunities.',aboutCTAText:'I’m looking for suitable job opportunities related to office support, documentation, customer service, and entry-level creative work.',contactLead:'I’m looking for suitable job opportunities in office administration, documentation, computer operations, customer support, and travel-related administration.',contactIntro:'The easiest way to reach me is WhatsApp. Please share the job title, organization, location, salary range, and eligibility requirements.',topic1Title:'Job Opportunity',topic1Text:'Share the job title, organization, location, salary range, and basic eligibility requirements.',showAbout:true,showServices:true,showWork:true,showContact:true,preset:'orange'};
async function loadRemoteSettings(){
  if(!sb) throw new Error('Supabase library load nahi hui. Internet connection check karein.');
  const {data,error}=await sb.from('site_settings').select('settings').eq('id',1).maybeSingle();
  if(error) throw error;
  settings=(data&&data.settings&&typeof data.settings==='object')?data.settings:{};
  localStorage.setItem(SETTINGS,JSON.stringify(settings));
}
async function boot(){
  if(!sb){$('loginStatus').textContent='Supabase load nahi hua. Internet connection check karke page refresh karein.';return;}
  const {data:{session}}=await sb.auth.getSession();
  if(session){try{await loadRemoteSettings();showDashboard();setStatus('Signed in. Online settings loaded.');}catch(e){showLogin();$('loginStatus').textContent='Settings load nahi ho sakin: '+e.message;}}
  else showLogin();
}
boot();
$('loginForm').addEventListener('submit',async e=>{e.preventDefault();$('loginStatus').textContent='Signing in…';const email=$('adminEmail').value.trim();const password=$('password').value;const {data,error}=await sb.auth.signInWithPassword({email,password});if(error){$('loginStatus').textContent='Login failed: '+error.message;return;}try{await loadRemoteSettings();showDashboard();setStatus('Login successful. Online settings loaded.');}catch(err){$('loginStatus').textContent='Login ho gaya, lekin settings load nahi huin: '+err.message;}});
async function uploadDataUrl(dataUrl,path){
  if(!dataUrl||!dataUrl.startsWith('data:'))return dataUrl;
  const res=await fetch(dataUrl);const blob=await res.blob();const ext=(blob.type.split('/')[1]||'webp').replace('jpeg','jpg');
  const objectPath=path+'.'+ext;
  const {error}=await sb.storage.from('portfolio-images').upload(objectPath,blob,{upsert:true,contentType:blob.type,cacheControl:'3600'});
  if(error)throw error;
  const {data}=sb.storage.from('portfolio-images').getPublicUrl(objectPath);return data.publicUrl;
}
async function saveOnlineSettings(next){
  if(!sb)throw new Error('Supabase client available nahi hai.');
  const {data:{session}}=await sb.auth.getSession();if(!session)throw new Error('Session expire ho gaya. Dobara login karein.');
  if(next.photo&&next.photo.startsWith('data:'))next.photo=await uploadDataUrl(next.photo,'profile/profile-photo');
  if(Array.isArray(next.samples)){
    for(let i=0;i<next.samples.length;i++){
      const item=next.samples[i];if(item&&item.image&&item.image.startsWith('data:'))item.image=await uploadDataUrl(item.image,'samples/sample-'+(i+1));
    }
  }
  const {error}=await sb.from('site_settings').upsert({id:1,settings:next,updated_at:new Date().toISOString()},{onConflict:'id'});
  if(error)throw error;
  // Keep the dedicated portfolio_items table in sync with the six admin sample slots.
  // Only samples with uploaded images become public portfolio rows.
  if(Array.isArray(next.samples)){
    const rows=next.samples
      .map((item,index)=>({item,index}))
      .filter(({item})=>item && typeof item.image==='string' && /^https?:\/\//i.test(item.image))
      .map(({item,index})=>({
        title:String(item.title||('Portfolio Sample '+(index+1))).slice(0,200),
        category:['social','product','ecommerce','banners'].includes(item.category)?item.category:'social',
        caption:String(item.description||'Portfolio design sample uploaded by Muhammad Shahzad.').slice(0,2000),
        image_url:item.image,
        sort_order:index+1,
        is_visible:true
      }));
    // These rows are owned by the portfolio admin and represent the six fixed sample slots.
    const {error:deleteError}=await sb.from('portfolio_items').delete().gte('sort_order',1);
    if(deleteError)throw new Error('Settings save ho gayi hain, lekin purane portfolio items sync nahi hue: '+deleteError.message);
    if(rows.length){
      const {error:insertError}=await sb.from('portfolio_items').insert(rows);
      if(insertError)throw new Error('Settings save ho gayi hain, lekin portfolio samples table mein save nahi hue: '+insertError.message);
    }
  }
  settings=next;localStorage.setItem(SETTINGS,JSON.stringify(settings));
}
$('settingsForm').addEventListener('submit',async e=>{e.preventDefault();const next={...settings};Object.keys(defaults).forEach(k=>{if($(k)){next[k]=$(k).type==='checkbox'?$(k).checked:$(k).value.trim();}});if(settings.photo)next.photo=settings.photo;next.samples=Array.from({length:6},(_,idx)=>{const i=idx+1,oldSample=(settings.samples||[])[idx]||{};return {image:oldSample.image||'',title:$('sampleTitle'+i).value.trim()||('Portfolio Sample '+i),category:$('sampleCategory'+i).value||'social',description:$('sampleDescription'+i).value.trim()||'Portfolio design sample uploaded by Muhammad Shahzad.'};});setStatus('Saving settings and images online…');try{await saveOnlineSettings(next);fillForm();setStatus('Saved online! Public website par changes dikhane ke liye pages refresh karein.');}catch(err){setStatus('Online save failed: '+err.message,true);}});
document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{const p=b.dataset.preset;const palettes={orange:['#ff8a3d','#52a8ff'],purple:['#b79cff','#55d6be'],green:['#9fca78','#e8bd77']};$('accent').value=palettes[p][0];$('blue').value=palettes[p][1];$('photoPosition').value='center 27%';$('photoOverlay').value='0.92';settings.preset=p;document.querySelectorAll('[data-preset]').forEach(x=>x.classList.toggle('active',x===b));setStatus('Preset selected. Save Changes dabayein to apply.');}));
$('exportSettings').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(settings,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='muhammad-shahzad-portfolio-settings.json';a.click();URL.revokeObjectURL(a.href);});
$('importSettings').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('invalid');settings={...defaults,...data};await saveOnlineSettings(settings);fillForm();setStatus('Backup imported and saved online.');}catch(err){setStatus('Backup file valid JSON settings nahi hai.',true)}e.target.value='';});
$('photoInput').addEventListener('change',async()=>{const f=$('photoInput').files[0];if(!f)return;if(!f.type.startsWith('image/')){setStatus('JPG, PNG ya WebP image select karein.',true);return}if(f.size>10*1024*1024){setStatus('Original photo 10 MB se chhoti honi chahiye.',true);return}setStatus('Photo compress ho rahi hai…');try{const image=await new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Photo open nahi ho saki.'));im.src=URL.createObjectURL(f);});const scale=Math.min(1,1400/Math.max(image.naturalWidth,image.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);URL.revokeObjectURL(image.src);let data=canvas.toDataURL('image/webp',0.82);if(data.length>1500000)data=canvas.toDataURL('image/jpeg',0.72);settings.photo=data;$('photoPreview').src=data;$('photoPreview').classList.remove('hidden');setStatus('Photo ready aur compress ho gayi hai. Ab Save Changes dabayein, phir homepage refresh karein.');}catch(err){setStatus(err.message||'Photo process nahi ho saki.',true)}$('photoInput').value='';});
async function compressSampleImage(file){if(!file.type.startsWith('image/'))throw new Error('Image file select karein.');if(file.size>8*1024*1024)throw new Error('Har image 8 MB se chhoti honi chahiye.');const img=await new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Image open nahi ho saki.'));im.src=URL.createObjectURL(file);});const scale=Math.min(1,1200/Math.max(img.naturalWidth,img.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);URL.revokeObjectURL(img.src);return canvas.toDataURL('image/webp',0.84);}
for(let i=1;i<=6;i++){const input=$('sampleImage'+i);if(input)input.addEventListener('change',async()=>{const file=input.files&&input.files[0];if(!file)return;const state=$('sampleState'+i);state.textContent='Processing image…';try{const data=await compressSampleImage(file);const samples=[...(settings.samples||[])];while(samples.length<6)samples.push({});samples[i-1]={...(samples[i-1]||{}),image:data,title:$('sampleTitle'+i).value.trim()||file.name.replace(/\.[^.]+$/,''),category:$('sampleCategory'+i).value||'social',description:$('sampleDescription'+i).value.trim()};settings.samples=samples;$('samplePreview'+i).src=data;$('samplePreview'+i).classList.remove('hidden');$('sampleTitle'+i).value=samples[i-1].title;state.textContent='Image ready — Save Changes';setStatus('Sample '+i+' image ready. Save Changes dabayein.');}catch(err){state.textContent='Upload failed';setStatus(err.message||'Image upload nahi ho saki.',true);}input.value='';});}
document.querySelectorAll('[data-remove-sample]').forEach(btn=>btn.addEventListener('click',()=>{const idx=Number(btn.dataset.removeSample),i=idx+1,samples=[...(settings.samples||[])];while(samples.length<6)samples.push({});samples[idx]={...(samples[idx]||{}),image:'',title:$('sampleTitle'+i).value.trim(),category:$('sampleCategory'+i).value||'social',description:$('sampleDescription'+i).value.trim()};settings.samples=samples;$('samplePreview'+i).removeAttribute('src');$('samplePreview'+i).classList.add('hidden');$('sampleState'+i).textContent='Image removed — Save Changes';setStatus('Sample image removed. Save Changes dabayein.');}));
$('removePhoto').addEventListener('click',()=>{delete settings.photo;$('photoPreview').removeAttribute('src');$('photoPreview').classList.add('hidden');$('photoInput').value='';setStatus('Custom photo remove kar di. Save Changes dabayein.');});
$('resetSettings').addEventListener('click',async()=>{if(confirm('Website settings defaults par reset karke online save kar dein?')){try{settings={...defaults};await saveOnlineSettings(settings);fillForm();setStatus('Default settings online save ho gayi hain.');}catch(e){setStatus('Reset save nahi hua: '+e.message,true);}}});
$('changePassword').addEventListener('click',async()=>{const next=$('changeNewPassword').value,confirmPass=$('changeConfirmPassword').value;if(next.length<8){setStatus('Naya password kam az kam 8 characters ka ho.',true);return}if(next!==confirmPass){setStatus('Naye passwords match nahi karte.',true);return}const {error}=await sb.auth.updateUser({password:next});if(error){setStatus('Password update nahi hua: '+error.message,true);return}$('currentPassword').value=$('changeNewPassword').value=$('changeConfirmPassword').value='';setStatus('Supabase account password update ho gaya.');});
$('logout').addEventListener('click',async()=>{await sb.auth.signOut();showLogin();$('password').value='';});
$('previewSite').addEventListener('click',()=>window.open('index.html','_blank'));
})();
