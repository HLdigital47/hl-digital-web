/* Configuración local: no solicitudes de red ni almacenamiento de datos personales. */
(() => {
  'use strict';
  const R = window.HL_RATES;
  const money = n => '$' + n.toLocaleString('en-US');
  const initialState = () => ({mode:'custom', package:null, web:'none', gbp:false, seo:false, extras:[], monthly:'none'});
  function calculate(s) {
    const pack = s.mode === 'package' ? R.packages[s.package] : null;
    const lines = [];
    if (pack) lines.push({name:pack.name,price:pack.price,detail:pack.included.join(' · ')});
    else {
      if (s.web !== 'none') lines.push(R.web[s.web]);
      if (s.gbp) lines.push(R.gbp);
      if (s.seo) lines.push(R.seo);
    }
    if (pack && s.seo && !pack.seo) lines.push({...R.seo,name:R.seo.name+" (extra)"});
    s.extras.forEach(id => {if (id === 'logo' && s.extras.includes('identity')) return; if (id === 'automation' && s.package === 'crecimiento' && pack) return; lines.push(R.extras[id]);});
    const monthly = R.monthly[pack?.monthly || s.monthly];
    const hasWeb = pack ? pack.web !== 'none' : s.web !== 'none';
    const hasGbp = pack ? pack.gbp : s.gbp;
    const warnings = [];
    if (monthly.price && (!hasWeb || !hasGbp)) warnings.push('Si ya tienes web o perfil de Google, revisaremos su acceso y estado. Las tareas de cada canal solo se aplican cuando exista y sea elegible. Si falta alguno, solicita una propuesta personalizada; su creación no está incluida en la mensualidad.');
    const matching = !pack && s.gbp ? (s.web==='landing'&&!s.seo?'impulso':s.web==='web'?(s.seo?'crecimiento':'profesional'):null) : null;
    return {lines,initial:lines.reduce((sum,item)=>sum+item.price,0),monthly,warnings,pack,matching,valid:lines.length>0||monthly.price>0};
  }
  function buildMessage(state, details) {
    const r=calculate(state), v=name=>String(details[name]||'').trim();
    return ['Hola, HL Digital.','Me gustaría solicitar una propuesta para mi negocio.',`Negocio: ${v('business')}`,`Contacto: ${v('contact')}`,`Correo: ${v('email')}`,`Teléfono: ${v('phone')}`,`Ciudad y estado: ${v('city')}`,r.pack?`Paquete: ${r.pack.name}`:'Plan personalizado','Servicios seleccionados:',...r.lines.map(item=>`${item.name}: ${item.from?'Desde ':''}${money(item.price)}${item.detail?' ('+item.detail+')':''}`),`Inversión inicial estimada: ${money(r.initial)} USD`,`Mantenimiento mensual: ${r.monthly.name} — ${money(r.monthly.price)}/mes`,...r.warnings,'Gastos de terceros no incluidos. Alcance sujeto a confirmación.',v('comment')?`Comentarios: ${v('comment')}`:'','Quisiera recibir información sobre los siguientes pasos.'].filter(Boolean).join('\n\n');
  }
  window.HLQuote = {calculate,initialState,buildMessage};
  if (typeof document === 'undefined') return;
  const form = document.querySelector('#quote-form');
  if (!form) return;
  let state = initialState();
  const el = id => document.getElementById(id);
  function choice(name,value,title,price,detail='',type='radio',extra='') {
    return `<label class="choice"><input type="${type}" name="${name}" value="${value}" ${extra}><span>${title}${detail?`<small>${detail}</small>`:''}</span><strong>${price}</strong></label>`;
  }
  el('package-choices').innerHTML = Object.entries(R.packages).map(([id,p])=>choice('package',id,p.name,money(p.price),id==='crecimiento'?`Incluye gestión mensual obligatoria de ${money(R.monthly.crecimiento.price)}/mes.`:'Mantenimiento opcional, seleccionado por separado.')).join('');
  el('web-choices').innerHTML = Object.entries(R.web).map(([id,p])=>choice('web',id,id==='none'?'No necesito página web':p.name,money(p.price),id==='landing'?'Una página · Diseño responsive · Contacto · SEO básico · Formulario':id==='web'?'Hasta cinco páginas · Diseño personalizado · SEO técnico inicial · Formulario · Analítica y buscadores':'', 'radio',id==='none'?'checked':'')).join('');
  el('gbp-choices').innerHTML=choice('gbp','no','No necesito este servicio','$0','','radio','checked')+choice('gbp','yes',R.gbp.name,money(R.gbp.price));
  el('seo-choices').innerHTML=choice('seo','no','No por ahora','$0','','radio','checked')+choice('seo','yes',R.seo.name,money(R.seo.price));
  el('extra-choices').innerHTML=Object.entries(R.extras).map(([id,p])=>choice('extras',id,p.name,(p.from?'Desde ':'')+money(p.price)+(p.external?' + proveedor':''),'','checkbox')).join('');
  const details={none:'Recibe tu proyecto inicial sin contratar un plan mensual.',impulso:'Revisión web · 30 minutos totales · Actualización básica de Google Business cuando corresponda.',profesional:'Revisión web · 60 minutos totales · 2 publicaciones en Google Business · Resumen mensual.',crecimiento:'2,5 horas totales · 4 publicaciones en Google Business · Mejoras SEO local · Search Console · Informe.'};
  el('monthly-choices').innerHTML=Object.entries(R.monthly).map(([id,p])=>choice('monthly',id,p.name,money(p.price)+'/mes',details[id],'radio',id==='none'?'checked':'')).join('');
  // Keep catalog amounts synchronized with the same tariffs.
  document.querySelectorAll('[data-rate]').forEach(node=>{let value=R;node.dataset.rate.split('.').forEach(key=>value=value[key]);node.textContent=money(value);});
  function render() {
    const pack=state.mode==='package'?R.packages[state.package]:null;
    el('package-choices').hidden=state.mode!=='package';el('package-note').hidden=!pack;
    form.querySelectorAll('input[name=mode]').forEach(i=>i.checked=i.value===state.mode);
    form.querySelectorAll('input[name=package]').forEach(i=>i.checked=i.value===state.package);
    ['web','gbp','seo'].forEach(name=>form.querySelectorAll(`input[name=${name}]`).forEach(input=>{
      const value=pack?(name==='web'?pack.web:(name==='seo'?state.seo:pack[name])?'yes':'no'):(name==='web'?state.web:state[name]?'yes':'no');
      input.checked=input.value===value;
      // An audit may be added to packages which do not include it.
      input.disabled=!!pack&&(name!=='seo'||pack.seo);
      const amount=input.closest('label').querySelector('strong');
      const selected=pack&&(name==='web'?input.value===pack.web:input.value==='yes'&&pack[name]);
      amount.textContent=selected?'Incluido en el paquete':money(name==='web'?R.web[input.value].price:input.value==='yes'?R[name].price:0);
    }));
    form.querySelectorAll('input[name=extras]').forEach(i=>{i.checked=state.extras.includes(i.value);i.disabled=!!pack&&state.package==='crecimiento'&&i.value==='automation';
      const rate=R.extras[i.value];i.closest('label').querySelector('strong').textContent=i.disabled?'Incluido en el paquete':(rate.from?'Desde ':'')+money(rate.price)+(rate.external?' + proveedor':'');});
    form.querySelectorAll('input[name=monthly]').forEach(i=>{i.checked=i.value===(pack?.monthly||state.monthly);i.disabled=!!pack?.monthly;});
    let result=calculate(state);
    // Added audit is an extra to the approved package, not a replacement price.
    const lines=el('quote-lines');lines.replaceChildren();
    if (!result.lines.length) {const p=document.createElement('p');p.className='helper';p.textContent='Tu selección aparecerá aquí.';lines.append(p);}
    result.lines.forEach(item=>{const row=document.createElement('div');row.className='summary-line';const name=document.createElement('span');name.textContent=item.name;const price=document.createElement('strong');price.textContent=(item.from?'Desde ':'')+money(item.price);row.append(name,price);if(item.detail){const detail=document.createElement('small');detail.textContent=item.detail;row.append(detail);}lines.append(row);});
    el('initial-total').textContent=money(result.initial);el('monthly-total').textContent=money(result.monthly.price)+'/mes';el('monthly-label').textContent=result.monthly.name;
    el('monthly-warning').hidden=!result.warnings.length;el('monthly-warning').textContent=result.warnings.join(' ');
    el('match-note').textContent=result.matching?`También puedes revisar ${R.packages[result.matching].name} (${money(R.packages[result.matching].price)}). Su alcance es distinto; el cotizador mantiene tus precios individuales hasta que elijas el paquete.`:result.pack?'El precio del paquete se mantiene. Los conceptos adicionales se suman por separado.':'';
    el('proposal-button').disabled=!result.valid;el('empty-note').hidden=result.valid;
    el('quote-status').textContent=`Inversión inicial ${money(result.initial)}. Mantenimiento ${money(result.monthly.price)} al mes.`;
  }
  function selectPackage(id) {
    state={...initialState(),mode:'package',package:id,web:R.packages[id].web,gbp:true,seo:R.packages[id].seo,monthly:R.packages[id].monthly||'none'};render();
  }
  form.addEventListener('change',event=>{
    const i=event.target;if(!['mode','package','web','gbp','seo','extras','monthly'].includes(i.name))return;
    if(i.name==='mode') {if(i.value==='package')selectPackage('profesional');else {state={...state,mode:'custom',package:null};render();}return;}
    if(i.name==='package'){selectPackage(i.value);return;}
    if(i.name==='extras'){
      state.extras=state.extras.filter(id=>id!==i.value);
      if(i.checked){if(i.value==='identity')state.extras=state.extras.filter(id=>id!=='logo');if(i.value==='logo')state.extras=state.extras.filter(id=>id!=='identity');state.extras.push(i.value);}
    }else state[i.name]=['gbp','seo'].includes(i.name)?i.value==='yes':i.value;
    render();
  });
  form.addEventListener('reset',event=>{event.preventDefault();form.querySelectorAll('.client-fields input,.client-fields textarea').forEach(input=>input.value='');state=initialState();render();});
  document.querySelectorAll('[data-pick-package]').forEach(button=>button.addEventListener('click',()=>{selectPackage(button.dataset.pickPackage);el('cotizador').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});form.querySelector('input[name=package]:checked').focus({preventScroll:true});}));
  form.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const r=calculate(state);if(!r.valid)return;
    const data=new FormData(form),v=name=>String(data.get(name)||'').trim();
    if(['business','contact','city'].some(name=>!v(name))){alert('Completa el negocio, contacto y ciudad con información válida.');return;}
    const text=buildMessage(state,Object.fromEntries(data));
    window.open('https://wa.me/13465412861?text='+encodeURIComponent(text),'_blank','noopener,noreferrer');
  });
  el('quote-app').hidden=false;render();
})();
