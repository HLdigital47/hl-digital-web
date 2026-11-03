'use strict';
const dialog=document.getElementById('project-dialog');let opener=null;
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const data=projects[button.dataset.project];if(!data)return;opener=button;document.getElementById('dialog-title').textContent=data.title;document.getElementById('dialog-category').textContent=data.category;const img=document.getElementById('dialog-img');img.src='assets/'+data.image;img.alt='Proyecto de '+data.title;document.getElementById('dialog-idea').textContent=data.idea;document.getElementById('dialog-work').replaceChildren(...data.work.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));const link=document.getElementById('dialog-link');link.hidden=!data.url;if(data.url)link.href=data.url;else link.removeAttribute('href');dialog.showModal();dialog.scrollTop=0;}));
document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
const tools={
'Canva':'Canva: diseño de piezas visuales y materiales de marca.',
'Illustrator':'Adobe Illustrator: diseño y edición vectorial de logotipos e identidad visual.',
'Visual Studio Code':'Visual Studio Code: creación y edición del código de páginas web.',
'GitHub':'GitHub: organización de archivos y versiones de los sitios web.',
'Cloudflare':'Cloudflare: publicación de sitios y configuración de dominios.',
'Search Console':'Google Search Console: consultas de búsqueda, indexación y rendimiento en Google.',
'Google Analytics':'Google Analytics: medición de visitas y acciones de contacto.',
'PageSpeed Insights':'PageSpeed Insights: revisión de velocidad, rendimiento y experiencia de carga.',
'Bing Webmaster Tools':'Bing Webmaster Tools: seguimiento de indexación y presencia en Bing.',
'Local Dominator':'Local Dominator: análisis de visibilidad local por ubicación.',
'Ahrefs':'Ahrefs: investigación de palabras clave, búsquedas y análisis de competencia.',
'n8n':'n8n: exploración y diseño de automatizaciones sencillas.'
};
Object.assign(tools,{"Google Business Profile": "Google Business Profile: optimización y administración de perfiles de negocios.", "Local Falcon": "Local Falcon: visualización de posiciones en Google Maps por zonas.", "Screaming Frog SEO Spider": "Screaming Frog SEO Spider: revisión de errores técnicos de sitios web.", "Microsoft Clarity": "Microsoft Clarity: análisis de cómo navegan los visitantes por una página.", "Google Looker Studio": "Google Looker Studio: creación de informes visuales para clientes.", "Google Apps Script": "Google Apps Script: automatizaciones de formularios, correos y tareas de Google.", "Google Sheets": "Google Sheets: organización de datos, solicitudes y seguimiento de información.", "Notion": "Notion: organización de proyectos, tareas, documentación y contenidos."});
document.querySelectorAll('[data-tool]').forEach(button=>button.addEventListener('click',()=>{document.getElementById('tool-note').textContent=tools[button.dataset.tool];}));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches;const motion=document.getElementById('motion-toggle');function updateMotion(){document.body.classList.toggle('motion-paused',paused);motion.textContent=paused?'Activar movimiento':'Pausar movimiento';motion.setAttribute('aria-pressed',String(paused));}updateMotion();motion.addEventListener('click',()=>{paused=!paused;updateMotion();});reduced.addEventListener('change',e=>{paused=e.matches;updateMotion();});
if('IntersectionObserver' in window){const observe=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('in-view',e.isIntersecting)),{threshold:.08});document.querySelectorAll('.project,.cartoon-card').forEach(p=>observe.observe(p));}
document.querySelectorAll('.project-image,.cartoon-card,.metal-tray,.logo-note').forEach(p=>p.classList.add('tilt-piece'));
