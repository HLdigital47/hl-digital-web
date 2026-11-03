'use strict';
/* HL Digital - Google Analytics 4: no personal data is sent. */
window.dataLayer=window.dataLayer||[];
function gtag(){window.dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','G-47HC7WZ2TP');
(function(){
  function event(name,detail){if(typeof gtag==='function')gtag('event',name,detail||{});}
  document.addEventListener('click',function(e){
    const a=e.target.closest('a[href]');if(!a)return;
    const href=a.getAttribute('href')||'';
    if(href.startsWith('tel:'))event('phone_click',{link_location:location.pathname});
    else if(href.startsWith('mailto:'))event('email_click',{link_location:location.pathname});
    else if(/(?:wa\.me\/|api\.whatsapp\.com\/)/i.test(href))event('whatsapp_click',{link_location:location.pathname});
  });
  document.addEventListener('hl:form-submitted',function(e){
    event('estimate_request',{form_location:location.pathname});
  });
})();
