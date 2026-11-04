const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const context={window:{}};
vm.createContext(context);
for(const file of ['tarifas.js','cotizador.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../paquetes',file),'utf8'),context);
const R=context.window.HL_RATES,Q=context.window.HLQuote;
const custom=values=>({...Q.initialState(),...values});
test('preserves all approved prices',()=>{
 assert.equal(R.packages.impulso.price,449);assert.equal(R.packages.profesional.price,799);assert.equal(R.packages.crecimiento.price,999);
 assert.equal(R.web.landing.price,349);assert.equal(R.web.web.price,749);
});
test('empty, individual-only and cheaper selections never become a package',()=>{
 for(const s of [custom({}),custom({web:'web'}),custom({gbp:true}),custom({seo:true}),custom({extras:['identity']})])assert.equal(Q.calculate(s).recommendation,null);
 assert.equal(Q.calculate(custom({})).valid,false);
});
test('equivalent professional web and GBP recommend the cheaper package',()=>{
 const r=Q.calculate(custom({web:'web',gbp:true}));
 assert.equal(r.initial,878);assert.equal(r.recommendation.id,'profesional');assert.equal(r.recommendation.total,799);assert.equal(r.recommendation.saving,79);assert.equal(r.monthly.price,0);
 assert(r.recommendation.additional.includes('SEO local inicial'));
});
test('audit remains a separately priced extra; basic SEO is not an audit',()=>{
 const r=Q.calculate(custom({web:'web',gbp:true,seo:true}));assert.equal(r.initial,957);assert.equal(r.recommendation.total,878);assert.equal(r.recommendation.id,'profesional');assert.equal(r.recommendation.lines.filter(x=>x.id==='audit').length,1);
 const accepted=Q.calculate(custom({mode:'package',package:'profesional',web:'web',gbp:true,seo:true}));assert.equal(accepted.initial,878);
});
test('unknown landing form equivalence does not generate misleading savings',()=>{
 const r=Q.calculate(custom({web:'landing',gbp:true}));assert.equal(r.initial,478);assert.equal(r.recommendation,null);assert(R.comparison.packages.impulso.requiresConfirmation.includes('landing'));
});
test('extras survive recommendation acceptance without double billing',()=>{
 const state=custom({web:'web',gbp:true,seo:true,extras:['logo','logo','identity','automation','email','catalog']});
 const r=Q.calculate(state),offer=r.recommendation;assert(offer);
 const accepted=Q.calculate({...state,mode:'package',package:offer.id});assert.equal(accepted.initial,offer.total);
 assert.equal(accepted.lines.filter(x=>x.id==='identity').length,1);assert.equal(accepted.lines.filter(x=>x.id==='logo').length,0);assert.equal(accepted.lines.filter(x=>x.id==='automation').length,1);
});
test('monthly SEO is independent of audit and initial setup',()=>{
 const s=custom({web:'web',gbp:true,monthly:'crecimiento'}),r=Q.calculate(s);assert.equal(r.initial,878);assert.equal(r.monthly.price,199);assert.equal(r.lines.some(x=>x.id==='audit'),false);assert.equal(r.recommendation.total,799);assert.equal(r.recommendation.monthly.price,199);
 const pack=Q.calculate(custom({mode:'package',package:'crecimiento',seo:true,extras:['automation']}));assert.equal(pack.initial,1098);assert.equal(pack.monthly.price,199);assert.equal(pack.lines.filter(x=>x.id==='audit').length,0);
});
test('package recommendations never impose a new recurring commitment',()=>{
 for(const monthly of ['none','impulso','profesional','crecimiento']){const r=Q.calculate(custom({web:'web',gbp:true,seo:true,extras:['automation'],monthly}));assert.equal(r.recommendation.id,'profesional');assert.equal(r.recommendation.monthly.price,R.monthly[monthly].price);}
});
test('all 6144 combinations: lowest eligible recommendation, item sums and WhatsApp parity',()=>{
 const extras=Object.keys(R.extras);
 let count=0;
 for(const web of ['none','landing','web'])for(const gbp of [false,true])for(const seo of [false,true])for(const monthly of Object.keys(R.monthly))for(let mask=0;mask<128;mask++){
  const s=custom({web,gbp,seo,monthly,extras:extras.filter((_,i)=>mask&(1<<i))});const r=Q.calculate(s);count++;
  assert.equal(r.initial,r.lines.reduce((n,l)=>n+l.price,0));
  const amounts=Q.quoteAmounts(r),text=Q.buildMessage(s,{business:'Prueba & Hijos',contact:'María',comment:'Diseño + SEO'});
  const u=new URL('https://wa.me/13465412861?text='+encodeURIComponent(text));assert.equal(u.searchParams.get('text'),text);
  assert(text.includes(`Inversión inicial estimada: ${amounts.initial} USD`));assert(text.includes(`— ${amounts.monthly}`));
  if(r.recommendation){assert(r.recommendation.total<r.initial);assert.equal(r.recommendation.total+r.recommendation.saving,r.initial);const accepted=Q.calculate({...s,mode:'package',package:r.recommendation.id});assert.equal(accepted.initial,r.recommendation.total);assert.equal(accepted.monthly.price,r.monthly.price);const out=Q.buildMessage({...s,mode:'package',package:r.recommendation.id},{});assert(out.includes(`Inversión inicial estimada: ${Q.quoteAmounts(accepted).initial} USD`));}
 }
 assert.equal(count,6144);
});
