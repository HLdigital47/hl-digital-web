'use strict';

const reviewForm = document.getElementById('revision-form');
reviewForm.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(reviewForm);
  const message = [
    'Hola, Sara. Quiero solicitar la revisión gratis de mi Perfil de Google.',
    'Nombre: ' + fields.get('nombre').trim(),
    'Negocio: ' + fields.get('negocio').trim(),
    'Ciudad: ' + fields.get('ciudad').trim(),
    'WhatsApp: ' + fields.get('whatsapp').trim(),
    'Perfil de Google: ' + (fields.get('perfil').trim() || 'Sin enlace'),
    '¿Ya tengo página web? ' + fields.get('web')
  ].join('\n');
  const link = new URL('https://wa.me/13465412861');
  link.searchParams.set('text', message);
  window.location.assign(link.href);
});
reviewForm.querySelector('button[type="submit"]').disabled = false;
