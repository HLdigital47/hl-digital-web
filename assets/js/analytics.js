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

/* Let the initial document and its images finish before downloading GA.
   Calls above stay queued in dataLayer, including early contact events. */
(function(){
  let started=false;
  function loadAnalytics(){
    if(started||document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js"]'))return;
    started=true;
    const script=document.createElement('script');
    script.async=true;
    script.src='https://www.googletagmanager.com/gtag/js?id=G-47HC7WZ2TP';
    document.head.appendChild(script);
  }
  function afterLoad(){
    if('requestIdleCallback' in window)window.requestIdleCallback(loadAnalytics,{timeout:1500});
    else loadAnalytics();
  }
  if(document.readyState==='complete')afterLoad();
  else window.addEventListener('load',afterLoad,{once:true});
})();
