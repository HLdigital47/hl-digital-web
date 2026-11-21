'use strict';
(()=>{
 const cfg=window.CATALOG_CONFIG;
 const $=id=>document.getElementById(id);
 const all=(s,r=document)=>[...r.querySelectorAll(s)];
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:cfg.currency,maximumFractionDigits:0}).format(n);
 const cycle=v=>v.cycle==='monthly'?'mes':'pago único';
 const services=new Map(cfg.services.map(s=>[s.id,s]));
 const initialParams=new URLSearchParams(location.search);
 const directService=services.get(initialParams.get('servicio'));
 const initialArea=directService?.group||initialParams.get('area');
 const state={area:cfg.groups.some(g=>g.id===initialArea)?initialArea:cfg.groups[0].id,query:'',service:null,variant:0,addons:new Set(),detail:null,opener:null};
 const priceText=v=>v.price===null?'A cotizar':`${v.startingAt?'Desde ':''}${money(v.price)} / ${cycle(v)}`;
 const base=s=>s.variants[0];
 function renderGroups(){
  let matches=0;
  $('service-groups').innerHTML=cfg.groups.filter(g=>g.id===state.area).map(g=>{
   const list=cfg.services.filter(s=>s.group===g.id&&norm([s.name,s.description,...s.variants.flatMap(v=>v.includes)].join(' ')).includes(norm(state.query)));
   matches+=list.length;
   const cards=list.map((s,i)=>{const v=base(s);return `<article class="plan-card tone-${i%3}" data-service-card="${esc(s.id)}"><div class="plan-image"><img src="${esc(s.image)}" alt="" width="600" height="400" loading="lazy" decoding="async"></div><div class="plan-body"><span class="plan-eyebrow">${esc(s.eyebrow)}</span><h3>${esc(s.name)}</h3><p class="plan-description">${esc(s.description)}</p><div class="plan-price">${v.price===null?'<strong>A cotizar</strong>':`<span>Desde</span><strong>${money(v.price)}</strong><small>/ ${cycle(v)}</small>`}</div><p class="plan-scope">${esc(v.scope)}</p><ul class="plan-includes">${v.includes.slice(0,3).map(t=>`<li>${esc(t)}</li>`).join('')}</ul><div class="plan-actions"><button class="button primary" data-contract="${esc(s.id)}" aria-label="${v.price===null?'Solicitar propuesta':v.cycle==='monthly'?'Contratar Plan':'Adquirir Servicio'}: ${esc(s.name)}">${v.price===null?'Solicitar propuesta':v.cycle==='monthly'?'Contratar Plan':'Adquirir Servicio'}</button><button class="text-button" data-detail="${esc(s.id)}" aria-label="Ver alcance de ${esc(s.name)}">${s.builder?'Personalizar publicaciones y videos':'Ver alcance y opciones'}</button><button class="text-button" data-proposal-add="${esc(s.id)}">Añadir a mi propuesta</button></div></div></article>`;}).join('');
   return `${list.length?`<section class="service-area" id="${esc(g.id)}" aria-labelledby="title-${g.id}"><div class="area-heading"><h2 id="title-${g.id}">${esc(g.name)}</h2><p>${esc(g.description)}</p></div><div class="plan-grid">${cards}</div></section>`:''}`;
  }).join('');
  $('search-status').textContent=state.query?`${matches} ${matches===1?'servicio coincide':'servicios coinciden'} en esta categoría.`:`${matches} ${matches===1?'servicio disponible':'servicios disponibles'} en ${cfg.groups.find(g=>g.id===state.area).name}.`;
  $('empty').hidden=matches>0;
 }
 function renderNav(){
  $('area-filters').innerHTML=cfg.groups.map(g=>`<button class="area-filter ${g.id===state.area?'active':''}" data-area="${g.id}" aria-label="${esc(g.name)}" aria-pressed="${g.id===state.area}"><span>${esc(g.name)}</span><small>${cfg.services.filter(s=>s.group===g.id).length} servicios</small></button>`).join('');
 }
 function renderBonuses(){
  $('bonus-cards').innerHTML=cfg.bonuses.map(b=>`<article class="bonus-card"><img src="${b.image}" alt="${esc(b.name)}" width="600" height="400" loading="lazy"><div><span class="eyebrow">BONO EXCLUSIVO</span><h3>${esc(b.name)}</h3><p>${esc(b.description)}</p><strong>${esc(b.eligibility)}</strong><small>Con otros servicios: complemento de ${money(b.price)} / pago único.</small></div></article>`).join('');
 }
 function open(id,opener=document.activeElement){if($(id).open)return;state.opener=opener;$(id).showModal();}
 function close(id){if($(id).open)$(id).close();}
 function projectExample(example){
  return example?`<div class="service-example">
    ${example.image?`<img src="${esc(example.image)}" alt="Captura de la web de ${esc(example.title)}" width="320" height="570" loading="lazy">`:''}
    <div><h3>${esc(example.title)}</h3><p>${esc(example.text)}</p>
    ${example.url?`<a class="text-button" href="${esc(example.url)}" target="_blank" rel="noopener noreferrer">Ver el proyecto</a>`:''}</div>
  </div>`:'';
 }
 function serviceFacts({materials,delivery,example}){
  return `${materials?`<dl class="service-facts"><dt>Qué necesito de ti</dt><dd>${esc(materials)}</dd><dt>Qué recibes</dt><dd>${esc(delivery)}</dd></dl>`:''}${projectExample(example)}`;
 }
 function socialBuilder(s){
  const {posts,videos,postExtra,videoExtra}=s.builder;
  const options=values=>values.map(n=>`<option value="${n}">${n}</option>`).join('');
  return `<section class="social-builder" aria-labelledby="social-builder-title">
   <h3 id="social-builder-title">Arma tu plan mensual</h3>
   <p>Desde ${priceText(base(s))}. El plan base incluye 8 publicaciones y 2 videos cortos al mes.</p>
   <div class="advisor-fields">
    <label>Publicaciones al mes<select id="social-posts">${options(posts)}</select></label>
    <label>Videos al mes<select id="social-videos">${options(videos)}</select></label>
   </div>
   <p>Publicación adicional: ${money(postExtra)} · Video adicional: ${money(videoExtra)}.</p>
   <ul class="include-list">${base(s).includes.map(text=>`<li>${esc(text)}</li>`).join('')}</ul>
   <p class="scope-note">${esc(base(s).exclusions)}</p>
   <p class="social-total" id="social-total" role="status">${priceText(base(s))}</p>
   <div class="advisor-actions">
    <button type="button" class="button primary" data-contract="${s.id}" data-variant="0">Solicitar este plan</button>
    <button type="button" class="button outline" data-proposal-add="${s.id}" data-variant="0">Añadir a mi propuesta</button>
   </div>
  </section>`;
 }
 function showDetail(id){
  const s=services.get(id);if(!s)return;state.detail=id;
  $('service-detail').innerHTML=`<div class="detail-art"><img src="${esc(s.image)}" alt="" width="600" height="400"></div><div class="detail-copy"><span class="eyebrow">${esc(cfg.groups.find(g=>g.id===s.group).name)}</span><h2 id="service-title">${esc(s.name)}</h2><p class="detail-benefit">${esc(s.benefit)}</p><p>${esc(s.description)}</p>${serviceFacts(s)}${s.builder?socialBuilder(s):`<div class="variant-details">${s.variants.map((v,i)=>`<section><div class="variant-top"><h3>${esc(v.name)}</h3><strong>${priceText(v)}</strong></div><p class="variant-scope">${esc(v.scope)}</p><ul class="include-list">${v.includes.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p class="scope-note">${esc(v.exclusions)}</p>${projectExample(v.example)}<button class="button primary" data-contract="${esc(s.id)}" data-variant="${i}">${v.price===null?'Solicitar propuesta':v.cycle==='monthly'?'Contratar Plan':'Adquirir Servicio'}</button></section>`).join('')}</div>`}</div>`;
  const copy=$('service-detail').querySelector('.detail-copy');
  if(s.builder){
   const builder=copy.querySelector('.social-builder');
   builder.addEventListener('change',()=>{
    const index=s.variants.findIndex(plan=>plan.posts===Number($('social-posts').value)&&plan.videos===Number($('social-videos').value));
    $('social-total').textContent=priceText(s.variants[index]);
    all('[data-variant]',builder).forEach(button=>{button.dataset.variant=String(index);});
   });
   copy.append($('social-samples').content.cloneNode(true));
  }
  copy.append($('service-help-template').content.cloneNode(true));
  const u=new URL(location.href);u.searchParams.set('servicio',s.id);history.replaceState(null,'',u);open('service-dialog');
 }
 function contract(id,variant=0){
  const s=services.get(id);if(!s)return;const opener=document.activeElement;close('service-dialog');state.service=s.id;state.variant=Math.min(s.variants.length-1,Math.max(0,Number(variant)||0));state.addons.clear();
  $('contract-service-name').textContent=s.name;
  $('plan-variant').innerHTML=s.variants.map((v,i)=>`<option value="${i}">${esc(v.name)} · ${priceText(v)}</option>`).join('');$('plan-variant').value=String(state.variant);
  renderContract();open('contract-dialog',opener);
 }
 function renderContract(){
  const s=services.get(state.service);const v=s.variants[state.variant];
  $('contract-plan-price').innerHTML=`<strong>${esc(priceText(v))}</strong>`;
  $('contract-scope').textContent=v.scope;
  $('contract-includes').innerHTML=v.includes.map(t=>`<li>${esc(t)}</li>`).join('');
  $('contract-exclusions').textContent=v.exclusions;
  $('contract-bonuses').innerHTML=cfg.bonuses.map(b=>b.included.includes(s.id)?`<div class="included-bonus"><span>BONO INCLUIDO</span><strong>${esc(b.name)}</strong><small>Se entrega con tu servicio. Sin cargo adicional.</small></div>`:`<label class="addon-option"><input type="checkbox" data-addon="${b.id}" ${state.addons.has(b.id)?'checked':''}><span><strong>${esc(b.name)}</strong><small>Complemento opcional · ${money(b.price)} / pago único</small></span></label>`).join('');
  updateSummary();
 }
 function updateSummary(){
  const s=services.get(state.service);if(!s)return;const v=s.variants[state.variant];const extra=cfg.bonuses.filter(b=>state.addons.has(b.id)&&!b.included.includes(s.id)).reduce((n,b)=>n+b.price,0);
  $('contract-summary').innerHTML=`<span class="step-label">RESUMEN DEL SERVICIO</span><div><span>${esc(v.name)}</span><strong>${priceText(v)}</strong></div>${extra?`<div><span>Complementos elegidos</span><strong>${money(extra)} / pago único</strong></div>`:''}<div class="summary-total"><span>${v.cycle==='monthly'?'Primer mes'+(extra?' + complementos':''):'Base del proyecto'}</span><strong>${v.price===null?'A cotizar':`${v.startingAt?'Desde ':''}${money(v.price+extra)}`}</strong></div>${v.cycle==='monthly'?`<small>Después: ${money(v.price)} al mes según las condiciones que se confirmen.</small>`:''}<small>No incluye costos de proveedores ni impuestos aplicables.</small>`;
  updateMessage();
 }
 function message(){
  const s=services.get(state.service);if(!s)return '';const v=s.variants[state.variant];
  const lines=[`Hola, HL Digital. Quiero iniciar la contratación de ${s.name}.`,'',`Plan: ${v.name}`,`Precio base: ${priceText(v)}`,`Alcance: ${v.scope}`];
  const included=cfg.bonuses.filter(b=>b.included.includes(s.id));if(included.length)lines.push(`Bonos incluidos: ${included.map(b=>b.name).join(', ')}`);
  cfg.bonuses.filter(b=>state.addons.has(b.id)&&!b.included.includes(s.id)).forEach(b=>lines.push(`Complemento: ${b.name} · ${money(b.price)} / pago único`));
  lines.push('',`Nombre: ${$('customer-name').value.trim()}`,`Negocio: ${$('customer-business').value.trim()}`,`Correo: ${$('customer-email').value.trim()}`);
  if($('customer-notes').value.trim())lines.push(`Objetivo: ${$('customer-notes').value.trim()}`);
  lines.push('','Quedo pendiente de confirmar el alcance, la fecha de inicio, los costos externos o impuestos aplicables y la forma de pago.');return lines.join('\n');
 }
 function updateMessage(){$('message-preview').textContent=message();}
 document.addEventListener('click',e=>{
  const contractButton=e.target.closest('[data-contract]');if(contractButton){contract(contractButton.dataset.contract,contractButton.dataset.variant);return;}
  const detail=e.target.closest('[data-detail]');if(detail){showDetail(detail.dataset.detail);return;}
  const c=e.target.closest('[data-close]');if(c){close(c.dataset.close);return;}
  const area=e.target.closest('[data-area]');if(area){state.area=area.dataset.area;state.query='';$('search').value='';const u=new URL(location.href);u.searchParams.set('area',state.area);history.replaceState(null,'',u);renderNav();renderGroups();all('[data-area]').find(b=>b.dataset.area===state.area)?.focus({preventScroll:true});return;}
 });
 document.addEventListener('change',e=>{if(e.target.matches('[data-addon]')){e.target.checked?state.addons.add(e.target.dataset.addon):state.addons.delete(e.target.dataset.addon);updateSummary();}});
 $('plan-variant').addEventListener('change',e=>{state.variant=Number(e.target.value);renderContract();});
 $('search').addEventListener('input',e=>{state.query=e.target.value.trim();renderGroups();});
 $('clear-search').addEventListener('click',()=>{state.query='';$('search').value='';renderGroups();$('search').focus({preventScroll:true});});
 ['customer-name','customer-business','customer-email','customer-notes'].forEach(id=>$(id).addEventListener('input',updateMessage));
 $('message-toggle').addEventListener('click',()=>{const show=$('message-preview').hidden;$('message-preview').hidden=!show;$('message-toggle').setAttribute('aria-expanded',String(show));$('message-toggle').textContent=show?'Ocultar mi solicitud':'Revisar mi solicitud';});
 $('contract-form').addEventListener('submit',e=>{e.preventDefault();const msg=message();if(e.submitter?.value==='email'){location.href=`mailto:${cfg.email}?subject=${encodeURIComponent('Iniciar contratación · '+services.get(state.service).name)}&body=${encodeURIComponent(msg)}`;}else{window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg)}`,'_blank','noopener,noreferrer');}});
 $('privacy-open').addEventListener('click',()=>open('privacy-dialog'));
 all('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close(d.id);}});d.addEventListener('close',()=>{if(d.id==='service-dialog'){const u=new URL(location.href);u.searchParams.delete('servicio');history.replaceState(null,'',u);}if(!all('dialog[open]').length){if(state.opener?.isConnected&&state.opener.getClientRects().length)state.opener.focus({preventScroll:true});else all('[data-contract]').find(b=>b.dataset.contract===state.service)?.focus({preventScroll:true});}});});
 $('advice-link').href=`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent('Hola, HL Digital. Quiero orientación para elegir el servicio adecuado para mi negocio.')}`;$('advice-link').target='_blank';$('advice-link').rel='noopener noreferrer';
 $('catalog-count').textContent=`${cfg.services.length} servicios · ${cfg.groups.length} categorías`;
 const advisor=$('advisor-form');
 const output=$('advisor-result');
 advisor.addEventListener('change',()=>{
  output.hidden=true;
  output.replaceChildren();
 });
 advisor.addEventListener('submit',event=>{
  event.preventDefault();
  const answers=new FormData(advisor);
  const hasWeb=answers.get('web')==='yes';
  const google=answers.get('google');
  const goal=answers.get('goal');
  let id='seo';
  let reason='Empieza con la auditoría inicial para revisar tu presencia local y priorizar las mejoras.';
  if(goal==='social'){
   id='contenido-redes';
   reason='Puedes definir qué publicar y preparar las piezas que necesitas para mostrar tu trabajo.';
  }else if(goal==='followup'){
   id='automatizaciones';
   reason='Organiza dónde llegan tus solicitudes y recibe avisos para darles seguimiento.';
  }else if(goal==='quotes'&&!hasWeb){
   id='web';
   reason='Una web puede reunir tus servicios, tus trabajos y una forma clara de pedir una cotización.';
  }else if(goal==='visibility'&&google==='no'){
   id='google';
   reason='Empieza por configurar la información, los servicios y el contacto de tu negocio en Google.';
  }
  const service=services.get(id);
  output.hidden=false;
  output.innerHTML=`<h3>${esc(service.name)}</h3><p>${esc(reason)}</p><div class="advisor-actions"><button class="button primary" data-contract="${esc(id)}">Solicitar una propuesta</button><button class="button outline" data-detail="${esc(id)}">Ver detalles</button></div>`;
 });
 renderNav();renderGroups();renderBonuses();const direct=new URLSearchParams(location.search).get('servicio');if(services.has(direct))showDetail(direct);
})();
