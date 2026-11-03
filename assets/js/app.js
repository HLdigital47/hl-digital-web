'use strict';
(()=>{
 const cfg=window.HL_CONFIG;
 const $=id=>document.getElementById(id);
 const all=(q,root=document)=>[...root.querySelectorAll(q)];
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const serviceMap=new Map(cfg.services.map(s=>[s.id,s]));
 const key='hl_digital_agency_selection';
 let selected=new Set(),area='Todos',lastFocus=null;
 try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))selected=new Set(saved.filter(x=>serviceMap.has(x)));}catch{}
 function persist(){try{localStorage.setItem(key,JSON.stringify([...selected]));}catch{}updateSelection();}
 function updateSelection(){
  all('[data-count]').forEach(el=>el.textContent=String(selected.size));
  $('catalog-count').textContent=`${selected.size} ${selected.size===1?'servicio seleccionado':'servicios seleccionados'}.`;
  const box=$('selected-summary');
  if(box)box.innerHTML=selected.size?[...selected].map(id=>`<div class="selected-chip"><span>${esc(serviceMap.get(id).title)}</span><button type="button" data-remove="${id}" aria-label="Quitar ${esc(serviceMap.get(id).title)}">Quitar</button></div>`).join(''):'<p class="selected-empty">Puedes elegir servicios o contarnos tu idea en el mensaje.</p>';
  all('[data-service-choice]').forEach(el=>el.checked=selected.has(el.value));
 }
 function openDialog(id){lastFocus=document.activeElement;const d=$(id);if(d.open)return;d.showModal();document.body.classList.add('modal-open');}
 function closeDialog(id){const d=$(id);if(d.open)d.close();}
 function renderFilters(){
  const groups=['Todos',...new Set(cfg.services.map(s=>s.group))];
  $('catalog-filters').innerHTML=groups.map(g=>`<button type="button" data-catalog-filter="${g}" class="${area===g?'active':''}" aria-pressed="${area===g}">${g}</button>`).join('');
 }
 function renderCatalog(){
  $('catalog-items').innerHTML=cfg.services.filter(s=>area==='Todos'||s.group===area).map(s=>`<label class="catalog-item"><input type="checkbox" data-service-choice value="${s.id}" ${selected.has(s.id)?'checked':''}><span><strong>${esc(s.title)}</strong><small>${esc(s.desc)}</small></span></label>`).join('');
 }
 function bindForm(){
  const form=$('project-form');if(!form)return;
  let status=$('form-status');
  if(!status){status=document.createElement('p');status.id='form-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');form.querySelector('.form-bottom')?.appendChild(status);}
  form.addEventListener('submit',async e=>{
   e.preventDefault();if(!form.reportValidity())return;
   const button=form.querySelector('[type="submit"]'),label=button.textContent,values=new FormData(form);
   const data=new URLSearchParams();
   data.set('name',String(values.get('name')||'').trim());
   data.set('business',String(values.get('business')||'').trim());
   data.set('contact',String(values.get('contact')||'').trim());
   data.set('service',[...selected].map(id=>serviceMap.get(id).title).join(', ')||'Consulta general');
   data.set('message',String(values.get('message')||'').trim());
   data.set('website',String(values.get('website')||'').trim());
   status.textContent='Enviando tu solicitud…';status.className='form-status';
   button.disabled=true;button.textContent='Enviando…';
   try{
    // Google Apps Script doesn't permit reading browser cross-origin responses.
    // This confirms transmission, not that Google Sheets saved it.
    await fetch(cfg.formEndpoint,{method:'POST',mode:'no-cors',body:data,redirect:'follow'});
    status.textContent='Su solicitud se envió exitosamente. Nos pondremos en contacto contigo. Si necesitas ayuda inmediata, utiliza el botón de WhatsApp o llámanos.';
    status.className='form-status is-sent';
    document.dispatchEvent(new CustomEvent('hl:form-submitted'));
    form.reset();selected.clear();persist();
   }catch(error){
    status.textContent='No fue posible enviar el formulario. Inténtalo de nuevo o contáctanos por teléfono.';
    status.className='form-status is-error';
   }finally{button.disabled=false;button.textContent=label;}
  });
 }

 document.addEventListener('click',e=>{
  const motion=e.target.closest('[data-motion-toggle]');
  if(motion){
   const scene=motion.closest('.motion-scene');const paused=scene.classList.toggle('is-paused');
   motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'Reanudar':'Pausar';
   motion.setAttribute('aria-label',`${paused?'Reanudar':'Pausar'} animación de ${scene.querySelector('h3').textContent}`);return;
  }
  const c=e.target.closest('[data-open-catalog]');if(c){renderCatalog();openDialog('catalog-dialog');return;}
  if(e.target.closest('[data-open-menu]')){openDialog('menu-dialog');return;}
  const close=e.target.closest('[data-close]');if(close){closeDialog(close.dataset.close);return;}
  const filter=e.target.closest('[data-catalog-filter]');if(filter){area=filter.dataset.catalogFilter;renderFilters();renderCatalog();all('[data-catalog-filter]').find(b=>b.dataset.catalogFilter===area)?.focus({preventScroll:true});return;}
  const remove=e.target.closest('[data-remove]');if(remove){selected.delete(remove.dataset.remove);persist();$('selected-summary')?.querySelector('button')?.focus({preventScroll:true});return;}
  const pf=e.target.closest('[data-filter]');if(pf){
   all('[data-filter]').forEach(b=>{const active=b===pf;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
   let count=0;all('[data-category]').forEach(card=>{card.hidden=pf.dataset.filter!=='Todos'&&pf.dataset.filter!==card.dataset.category;if(!card.hidden)count++;});
   if($('filter-status'))$('filter-status').textContent=`${count} ${count===1?'proyecto disponible':'proyectos disponibles'}.`;return;
  }
  if(!e.target.closest('.nav-services'))all('.nav-services[open]').forEach(el=>el.open=false);
 });
 document.addEventListener('change',e=>{if(e.target.matches('[data-service-choice]')){e.target.checked?selected.add(e.target.value):selected.delete(e.target.value);persist();}});
 all('dialog').forEach(d=>{
  d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d.id);}});
  d.addEventListener('close',()=>{if(!all('dialog[open]').length){document.body.classList.remove('modal-open');if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});}});
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape')all('.nav-services[open]').forEach(d=>d.open=false);});
 function setupProjectMotion(){
  const scenes=all('.motion-scene');if(!scenes.length||!('IntersectionObserver' in window)||!('ResizeObserver' in window))return;
  const visible=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-visible',entry.isIntersecting)),{threshold:.12});
  const pending=new Set();let measurementFrame=0;
  const scheduleMeasure=scene=>{pending.add(scene);if(measurementFrame)return;measurementFrame=requestAnimationFrame(()=>{measurementFrame=0;const measurements=[...pending].map(scene=>{const frame=scene.querySelector('.project-shot'),img=frame.querySelector('img');return {scene,frame,travel:img.naturalWidth?Math.max(0,frame.clientWidth*img.naturalHeight/img.naturalWidth-frame.clientHeight):0};});pending.clear();measurements.forEach(({scene,frame,travel})=>{frame.style.setProperty('--preview-travel',`${-travel}px`);frame.style.setProperty('--preview-duration',`${Math.max(26,Math.min(64,travel/16*2+8))}s`);scene.classList.toggle('is-scrollable',travel>1);});});};
  const resized=new ResizeObserver(entries=>entries.forEach(entry=>scheduleMeasure(entry.target.closest('.motion-scene'))));
  scenes.forEach(scene=>{
   const img=scene.querySelector('.project-shot img');
   scene.classList.add('motion-ready');visible.observe(scene);resized.observe(scene.querySelector('.project-shot'));
   if(img.complete)scheduleMeasure(scene);else img.addEventListener('load',()=>scheduleMeasure(scene),{once:true});
  });
  const tabVisibility=()=>document.body.classList.toggle('previews-background',document.hidden);
  document.addEventListener('visibilitychange',tabVisibility);tabVisibility();
 }
 setupProjectMotion();
 const requested=new URLSearchParams(location.search).get('servicio');if(serviceMap.has(requested)){selected.add(requested);persist();}
 renderFilters();renderCatalog();updateSelection();bindForm();
})();
