/* ============ DATOS DEL PORTAFOLIO (edita aquí) ============
 Para añadir material real a un proyecto, llena su arreglo "shots":
   {src:'assets/archivo.png', type:'desktop'|'phone'|'flat', caption:'texto corto'}
 - Mientras "shots" esté vacío, el proyecto se muestra como logo + enlace + QR.
 - Cuando tenga capturas, pasa a ser una composición con mockups.
 - "qr" solo se pone cuando la URL está verificada.                     */
window.HL={sections:[
{id:'01',title:['Web','Design'],sub:'& Development',theme:{bg:'#581C32',fg:'#FAF8F7',gh:'#A05A72'},projects:[
 {name:'AV Roofing & Gutter Guy',logo:'assets/avr.png',url:'https://avroofinggutterguy.com/',qr:'assets/qr_avr.png',shots:[{src:'assets/av-tablet.webp',type:'flat',caption:'Vista en tablet'},{src:'assets/av-mobile.webp',type:'flat',caption:'Vista móvil'}]},
 {name:'La Roca Cleaning Services',logo:'assets/roca.png',url:'https://larocacleaningservices.com/',qr:'assets/qr_roca.png',shots:[]},
 {name:'New Era Painting & Construction',logo:'assets/newera.png',url:'https://newerapaintingnc.com/',qr:'assets/qr_newera.png',shots:[]},
 {name:'Divas Junk Removal Services',logo:'assets/divas.png',url:'https://divasjunkremovalservices.com/',qr:'assets/qr_divas.png',shots:[]},
 {name:'ALL PRO Home Solutions',logo:'assets/allpro.png',url:'https://allprohomesolutionsga.com/',shots:[]},
 {name:'Straight Line Painting',logo:'assets/line.png',url:'https://straightlinepaintingsc.com/',shots:[]}]},
{id:'02',title:['Google','Business','Profile'],sub:'',theme:{bg:'#A69AB6',fg:'#581C32',gh:'#FAF8F7'},projects:[
 {name:'Cunin Construction',shots:[]},
 {name:'Sequoia Builders',shots:[]},
 {name:'New Era Painting & Construction',logo:'assets/newera.png',shots:[{src:'assets/newera-profile.webp',type:'flat',caption:'Perfil comercial · Servicios'}]},
 {name:'Divas Junk Removal Services',logo:'assets/divas.png',shots:[]},
 {name:'FFF Junk Removal',shots:[]},
 {name:'La Roca Cleaning Services',logo:'assets/roca.png',shots:[]}]},
{id:'03',title:['Local','SEO &','Analytics'],sub:'',theme:{bg:'#303039',fg:'#FAF8F7',gh:'#A05A72'},
 words:['Search Console','Google Analytics','Indexación Google y Bing','Auditorías SEO','Páginas por servicio y ciudad','Datos estructurados'],projects:[]},
{id:'04',title:['Branding','& Visual','Identity'],sub:'',theme:{bg:'#A05A72',fg:'#FAF8F7',gh:'#581C32'},
 words:['Logotipos','Tarjetas de presentación','Identidad HL Digital','Material publicitario','Códigos QR','Tarjetas NFC','Catálogos digitales'],projects:[]},
{id:'05',title:['Digital','Advertising'],sub:'',theme:{bg:'#FAF8F7',fg:'#581C32',gh:'#A69AB6'},
 words:['Diseños comerciales','Materiales promocionales','Campañas Google Ads'],projects:[
 {name:'New Era Painting & Construction',logo:'assets/newera.png',shots:[]}]},
{id:'06',title:['Automation','& Lead','Gen'],sub:'',theme:{bg:'#581C32',fg:'#FAF8F7',gh:'#A69AB6'},
 words:['Formularios de cotización','Registro de prospectos','Notificaciones por correo','Google Sheets','WhatsApp Business','Páginas con QR','Medición de conversiones'],projects:[]}
]};
