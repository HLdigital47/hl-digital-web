'use strict';
(() => {
  const config = window.CATALOG_CONFIG;
  const byId = id => document.getElementById(id);
  const services = new Map(config.services.map(service => [service.id, service]));
  const combinations = {
    google: ['google', 'web'],
    contacto: ['whatsapp', 'automatizaciones']
  };
  const selected = new Map();
  const picker = byId('proposal-service');
  const items = byId('proposal-items');
  const status = byId('proposal-status');
  const summary = byId('proposal-summary');
  const whatsapp = byId('proposal-whatsapp');
  const money = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: config.currency, maximumFractionDigits: 0
  });
  const price = plan => plan.price === null ? 'A cotizar' :
    (plan.startingAt ? 'Desde ' : '') + money.format(plan.price) + (plan.cycle === 'monthly' ? ' al mes' : ' · pago único');

  function element(tag, text) {
    const result = document.createElement(tag);
    if (text !== undefined) result.textContent = text;
    return result;
  }

  function updateSummary() {
    const totals = { once: 0, monthly: 0, quote: 0 };
    let onceStartingAt = false;
    const lines = ['Hola, HL Digital. Quiero una propuesta para estos servicios:', ''];
    for (const [id, index] of selected) {
      const service = services.get(id);
      const plan = service.variants[index];
      if (plan.price === null) totals.quote++;
      else totals[plan.cycle] += plan.price;
      if (plan.cycle === 'once' && plan.startingAt) onceStartingAt = true;
      lines.push(`• ${service.name} · ${plan.name} · ${price(plan)}`);
    }

    const charges = [
      ['Pago único', (onceStartingAt ? 'Desde ' : '') + money.format(totals.once)],
      ['Mensual', money.format(totals.monthly)],
      ['Servicios pendientes de cotizar', String(totals.quote)]
    ];
    byId('proposal-totals').replaceChildren(...charges.map(([label, value]) => {
      const row = element('div');
      row.append(element('dt', label), element('dd', value));
      return row;
    }));
    summary.hidden = selected.size === 0;
    if (summary.hidden) {
      return;
      return;
    }
    lines.push('', ...charges.map(([label, value]) => `${label}: ${value}`));
    whatsapp.dataset.summary = lines.join('\n');
  }

  function render() {
    picker.replaceChildren(new Option('Selecciona un servicio', ''),
      ...config.services.filter(service => !selected.has(service.id))
        .map(service => new Option(service.name, service.id)));
    picker.disabled = selected.size === services.size;
    byId('proposal-form').querySelector('button').disabled = picker.disabled;

    items.replaceChildren(...Array.from(selected, ([id, index]) => {
      const service = services.get(id);
      const row = element('div');
      row.className = 'proposal-item';
      const title = element('label', service.name);
      const variants = element('select');
      variants.dataset.proposalVariant = id;
      variants.append(...service.variants.map((plan, i) =>
        new Option(`${plan.name} · ${price(plan)}`, String(i))));
      variants.value = String(index);
      title.append(variants);
      const remove = element('button', 'Quitar');
      remove.type = 'button';
      remove.className = 'text-button';
      remove.dataset.proposalRemove = id;
      remove.setAttribute('aria-label', 'Quitar ' + service.name);
      row.append(title, remove);
      return row;
    }));
    updateSummary();
  }

  function add(ids) {
    const added = ids.filter(id => services.has(id) && !selected.has(id));
    added.forEach(id => selected.set(id, 0));
    if (added.length) render();
    status.textContent = added.length
      ? 'Añadido a tu propuesta: ' + added.map(id => services.get(id).name).join(', ') + '.'
      : 'Estos servicios ya están en tu propuesta.';
  }


  whatsapp.addEventListener('click',()=>{
    if(selected.size===0)return;
    byId('proposal-request-details').textContent=whatsapp.dataset.summary||'';
    byId('proposal-request-status').textContent='';
    byId('proposal-request-dialog').showModal();
  });
  byId('proposal-request-form').addEventListener('submit',async event=>{
    event.preventDefault();
    const form=event.currentTarget;if(!form.reportValidity())return;
    const fields=new FormData(form),button=form.querySelector('[type="submit"]');
    const sendStatus=byId('proposal-request-status');
    button.disabled=true;button.textContent='Enviando…';sendStatus.textContent='Transmitiendo tu solicitud…';
    try{
      await window.HL_CATALOG_SEND({name:fields.get('name'),business:fields.get('business'),contact:fields.get('email'),service:[...selected].map(([id,index])=>services.get(id).name+' · '+services.get(id).variants[index].name).join(', '),message:(whatsapp.dataset.summary||'')+'\n\nDetalles: '+String(fields.get('notes')||''),website:'',source:'catalogo-propuesta'});
      sendStatus.textContent='Solicitud transmitida. Gracias por contactar a HL Digital; revisaremos los datos recibidos.';
      form.reset();
    }catch(err){sendStatus.textContent='No pudimos transmitir tu solicitud. Intenta de nuevo o escríbenos a support@hldigitalweb.com.';}
    finally{button.disabled=false;button.textContent='Enviar solicitud';}
  });
  byId('proposal-form').addEventListener('submit', event => {
    event.preventDefault();
    if (picker.value) add([picker.value]);
    if (!picker.disabled) picker.focus({preventScroll: true});
  });
  items.addEventListener('change', event => {
    const id = event.target.dataset.proposalVariant;
    if (!selected.has(id)) return;
    selected.set(id, Number(event.target.value));
    updateSummary();
    status.textContent = 'Plan actualizado.';
  });
  document.addEventListener('click', event => {
    const combo = event.target.closest('[data-combination]');
    const card = event.target.closest('[data-proposal-add]');
    const remove = event.target.closest('[data-proposal-remove]');
    if (combo) add(combinations[combo.dataset.combination]);
    if (card) {
      const id = card.dataset.proposalAdd;
      add([id]);
      if (card.hasAttribute('data-variant')) {
        selected.set(id, Number(card.dataset.variant));
        render();
        status.textContent = 'Plan de redes actualizado en tu propuesta.';
      }
      card.closest('dialog[open]')?.close();
      byId('proposal-title').focus({preventScroll: true});
    }
    if (remove && selected.delete(remove.dataset.proposalRemove)) {
      render();
      status.textContent = 'Servicio retirado de la propuesta.';
      picker.focus({preventScroll: true});
    }
  });
  byId('proposal-title').tabIndex = -1;
  render();
})();
