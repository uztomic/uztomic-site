/* ════════════════════════════════════════════════════════════════════
   Uztomic — shared front-end
   Loaded with `defer` by /index.html and /crm/index.html.

   The page supplies, in an inline <script> BEFORE this file:
     window.I18N = { uz:{...}, ru:{...} }     — English lives in the markup
     window.UZ   = { page:'home', lang:'en' } — page id + default language

   No libraries. Everything animates transform/opacity/translate only,
   is throttled through requestAnimationFrame, and switches off entirely
   under prefers-reduced-motion.
   ════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ══════ SETTINGS ══════ */
var WEB3FORMS_KEY = 'a72ae459-19a3-4308-a9c4-b8e4e44a5bbb';
var TELEGRAM_USER = 'uztomic_official';
var EMAIL         = 'uztomic@gmail.com';

var CFG   = window.UZ || {};
var PAGE  = CFG.page || 'home';
var root  = document.documentElement;
var $     = function(s,c){ return (c||document).querySelector(s) };
var $$    = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)) };
var reduced  = matchMedia('(prefers-reduced-motion: reduce)').matches;
var canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

var store = {
  get:function(k){ try{ return localStorage.getItem(k) }catch(e){ return null } },
  set:function(k,v){ try{ localStorage.setItem(k,v) }catch(e){} }
};

/* ══════════════════ THEME ══════════════════ */
var markImg  = $('#markImg');
var footLogo = $('#footLogo');

function paintTheme(t){
  root.dataset.theme = t;
  var m = $('meta[name=theme-color]'); if(m) m.content = t==='dark' ? '#0A0C18' : '#FFFFFF';
  if(markImg)  markImg.src  = '/assets/uztomic-mark-'+(t==='dark'?'light':'dark')+'.png';
  if(footLogo) footLogo.src = '/assets/uztomic-logo-'+(t==='dark'?'light':'dark')+'.png';
}
function applyTheme(t,remember,ev){
  if(remember) store.set('uztomic-theme',t);
  /* circular wipe out of the button, where the browser supports it */
  if(!reduced && ev && document.startViewTransition){
    var x = ev.clientX, y = ev.clientY;
    var r = Math.hypot(Math.max(x,innerWidth-x), Math.max(y,innerHeight-y));
    document.startViewTransition(function(){ paintTheme(t) }).ready.then(function(){
      root.animate({ clipPath:['circle(0px at '+x+'px '+y+'px)',
                               'circle('+r+'px at '+x+'px '+y+'px)'] },
        { duration:520, easing:'cubic-bezier(.16,1,.3,1)',
          pseudoElement:'::view-transition-new(root)' });
    }).catch(function(){});
    return;
  }
  paintTheme(t);
}
paintTheme(root.dataset.theme || 'dark');   /* the inline <head> script already picked it */
var themeBtn = $('#theme');
if(themeBtn) themeBtn.addEventListener('click',function(e){
  applyTheme(root.dataset.theme==='dark'?'light':'dark', true, e);
});
/* follow the system only while the visitor has not chosen for themselves */
matchMedia('(prefers-color-scheme: light)').addEventListener('change',function(e){
  if(!store.get('uztomic-theme')) paintTheme(e.matches?'light':'dark');
});

/* ══════════════════ HEADER · PROGRESS · TOP ══════════════════ */
var hdr = $('#hdr'), bar = $('#bar'), topBtn = $('#top');
var ring = topBtn && topBtn.querySelector('.ring circle');
var RING = 132;                                   /* 2πr, r = 21 */
var ticking = false;

function onScroll(){
  var max = document.documentElement.scrollHeight - innerHeight;
  var p   = max > 0 ? Math.min(scrollY/max,1) : 0;
  if(hdr)    hdr.classList.toggle('stuck', scrollY > 12);
  if(bar)    bar.style.transform = 'scaleX('+p+')';
  if(topBtn) topBtn.classList.toggle('show', scrollY > 700);
  if(ring)   ring.style.strokeDashoffset = RING*(1-p);
  parallax();
  ticking = false;
}
addEventListener('scroll',function(){
  if(!ticking){ ticking = true; requestAnimationFrame(onScroll) }
},{passive:true});
addEventListener('resize',onScroll,{passive:true});
if(topBtn) topBtn.addEventListener('click',function(){
  scrollTo({top:0,behavior:reduced?'auto':'smooth'});
});

/* ══════════════════ MOBILE MENU ══════════════════ */
var burger = $('#burger'), drawer = $('#drawer');
function setMenu(open){
  if(!drawer) return;
  drawer.classList.toggle('open',open);
  if(hdr) hdr.classList.toggle('menu',open);
  if(burger) burger.setAttribute('aria-expanded',open);
  document.body.style.overflow = open ? 'hidden' : '';
}
if(burger) burger.addEventListener('click',function(){
  setMenu(!drawer.classList.contains('open'));
});
if(drawer) drawer.addEventListener('click',function(e){
  if(e.target===drawer || e.target.closest('a')) setMenu(false);
});
addEventListener('keydown',function(e){ if(e.key==='Escape') setMenu(false) });

/* ══════════════════ REVEAL ON SCROLL ══════════════════ */
var revealed = new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(!e.isIntersecting) return;
    e.target.classList.add('in');
    revealed.unobserve(e.target);
  });
},{threshold:.12,rootMargin:'0px 0px -60px 0px'});

$$('[data-rv]').forEach(function(el){
  /* anything already scrolled past — a #hash landing, a restored scroll
     position — is shown at once, so no content can stay invisible */
  if(el.getBoundingClientRect().bottom < 0){ el.classList.add('in'); return }
  /* siblings inside one grid come in one after another */
  var sibs = el.parentElement ? $$('[data-rv]',el.parentElement).filter(function(n){
    return n.parentElement === el.parentElement }) : [el];
  el.style.setProperty('--d',(Math.min(sibs.indexOf(el),5)*70)+'ms');
  revealed.observe(el);
});

/* ══════════════════ HEADLINE — word by word ══════════════════ */
function splitWords(){
  $$('[data-split]').forEach(function(host){
    var targets = $$('[data-i18n]',host);
    if(!targets.length) targets = [host];
    var n = 0;
    targets.forEach(function(el){
      if(el.querySelector('.split')) return;              /* already split */
      var words = el.textContent.split(/\s+/).filter(Boolean);
      if(!words.length) return;
      el.textContent = '';
      words.forEach(function(w,i){
        var s = document.createElement('span'); s.className = 'split';
        var t = document.createElement('i');    t.textContent = w;
        t.style.setProperty('--d',(n*58)+'ms'); n++;
        s.appendChild(t); el.appendChild(s);
        if(i < words.length-1) el.appendChild(document.createTextNode(' '));
      });
    });
    requestAnimationFrame(function(){
      $$('.split',host).forEach(function(s){ s.classList.add('in') });
    });
  });
}

/* ══════════════════ COUNTERS ══════════════════ */
function tween(from,to,ms,step){
  if(reduced){ step(to); return }
  var t0 = performance.now();
  (function frame(now){
    var k = Math.min((now-t0)/ms,1);
    step(from + (to-from) * (1 - Math.pow(1-k,3)));
    if(k < 1) requestAnimationFrame(frame);
  })(t0);
}
var counters = new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(!e.isIntersecting) return;
    counters.unobserve(e.target);
    var el = e.target, to = parseFloat(el.dataset.count) || 0, suf = el.dataset.suffix || '';
    tween(0,to,1300,function(v){ el.textContent = Math.round(v) + suf });
  });
},{threshold:.6});
$$('[data-count]').forEach(function(el){ counters.observe(el) });

/* ══════════════════ POINTER EFFECTS (desktop only) ══════════════════ */
if(canHover && !reduced){
  var fxRaf = 0, fxEl = null, fxX = 0, fxY = 0;

  var runFx = function(){
    fxRaf = 0;
    if(!fxEl) return;
    var r = fxEl.getBoundingClientRect();
    var px = (fxX - r.left) / r.width, py = (fxY - r.top) / r.height;
    fxEl.style.setProperty('--mx',(px*100).toFixed(1)+'%');
    fxEl.style.setProperty('--my',(py*100).toFixed(1)+'%');
    if(fxEl.hasAttribute('data-tilt')){
      fxEl.style.setProperty('--ry',((px-.5)*5).toFixed(2)+'deg');
      fxEl.style.setProperty('--rx',((.5-py)*5).toFixed(2)+'deg');
    }
  };
  var clearFx = function(){
    if(fxEl && fxEl.hasAttribute('data-tilt')){
      fxEl.style.setProperty('--rx','0deg');
      fxEl.style.setProperty('--ry','0deg');
    }
    fxEl = null;
  };
  document.addEventListener('pointermove',function(e){
    if(e.pointerType !== 'mouse') return;
    var el = e.target.closest ? e.target.closest('.crd,.price') : null;
    if(!el){ if(fxEl) clearFx(); return }
    fxEl = el; fxX = e.clientX; fxY = e.clientY;
    if(!fxRaf) fxRaf = requestAnimationFrame(runFx);
  },{passive:true});

  /* magnetic buttons */
  $$('[data-mag]').forEach(function(b){
    var raf = 0, mx = 0, my = 0;
    b.addEventListener('pointermove',function(e){
      if(e.pointerType !== 'mouse') return;
      var r = b.getBoundingClientRect();
      mx = (e.clientX - r.left - r.width/2) * .2;
      my = (e.clientY - r.top - r.height/2) * .3;
      if(!raf) raf = requestAnimationFrame(function(){
        raf = 0;
        b.style.setProperty('--bx',mx.toFixed(1)+'px');
        b.style.setProperty('--by',my.toFixed(1)+'px');
      });
    },{passive:true});
    b.addEventListener('pointerleave',function(){
      b.style.setProperty('--bx','0px'); b.style.setProperty('--by','0px');
    });
  });
}

/* ══════════════════ PARALLAX (data-par="0.05") ══════════════════ */
var parEls = $$('[data-par]');
function parallax(){
  if(reduced || !parEls.length) return;
  var mid = innerHeight/2;
  parEls.forEach(function(el){
    var r = el.getBoundingClientRect();
    if(r.bottom < -240 || r.top > innerHeight + 240) return;
    var d = (r.top + r.height/2 - mid) * parseFloat(el.dataset.par);
    el.style.translate = '0 ' + d.toFixed(1) + 'px';
  });
}

/* ══════════════════ TECH MARQUEE ══════════════════ */
var strip = $('#strip');
if(strip && strip.dataset.items){
  var items = strip.dataset.items.split('|');
  strip.innerHTML = items.concat(items).map(function(t){ return '<span>'+t+'</span>' }).join('');
}

/* ══════════════════ SCROLL SPY ══════════════════ */
var navLinks = $$('.links a').filter(function(a){
  return (a.getAttribute('href')||'').charAt(0) === '#';
});
var spySections = navLinks.map(function(a){ return $(a.getAttribute('href')) }).filter(Boolean);
if(spySections.length){
  var seen = {};
  var spy = new IntersectionObserver(function(es){
    es.forEach(function(e){ seen[e.target.id] = e.isIntersecting });
    var active = spySections.filter(function(s){ return seen[s.id] })[0];
    navLinks.forEach(function(a){
      a.classList.toggle('here', !!active && a.getAttribute('href') === '#'+active.id);
    });
  },{rootMargin:'-45% 0px -50% 0px'});
  spySections.forEach(function(s){ spy.observe(s) });
}

/* hide the mobile action bar while the form is on screen */
var mbar = $('#mbar'), contactSec = $('#contact');
if(mbar && contactSec){
  new IntersectionObserver(function(es){
    es.forEach(function(e){ mbar.classList.toggle('off',e.isIntersecting) });
  },{threshold:.1}).observe(contactSec);
}

/* ══════════════════ FAQ (details stays, so it works without JS) ══════════════════ */
$$('.faq details').forEach(function(d){
  var sum = d.querySelector('summary'), ans = d.querySelector('.ans');
  if(!sum || !ans) return;
  sum.addEventListener('click',function(e){
    if(reduced) return;
    e.preventDefault();
    if(d.open){
      var h = ans.scrollHeight;
      ans.animate([{height:h+'px',opacity:1},{height:'0px',opacity:0}],
        {duration:240,easing:'cubic-bezier(.4,0,.2,1)'}).onfinish = function(){ d.open = false };
    }else{
      d.open = true;
      ans.animate([{height:'0px',opacity:0},{height:ans.scrollHeight+'px',opacity:1}],
        {duration:300,easing:'cubic-bezier(.16,1,.3,1)'});
    }
  });
});

/* ══════════════════ I18N ══════════════════ */
var I18N = window.I18N || {};
I18N.en = I18N.en || {};
var descMeta = $('meta[name=description]');

/* English is the source of truth and lives in the markup */
$$('[data-i18n]').forEach(function(el){ I18N.en[el.dataset.i18n] = el.innerHTML });
$$('[data-i18n-html]').forEach(function(el){ I18N.en[el.dataset.i18nHtml] = el.innerHTML });
$$('[data-i18n-ph]').forEach(function(el){ I18N.en[el.dataset.i18nPh] = el.placeholder });
I18N.en._title = document.title;
I18N.en._desc  = descMeta ? descMeta.content : '';

var EN_FALLBACK = {
  _ok:"Thank you! Your request has been sent. We'll be in touch within 24 hours.",
  _err:"Couldn't send the form. Please reach us directly:",
  _sending:"Sending…", _copied:"Copied:", _uzs:"UZS", _weeks:"weeks",
  _req:"Please fill this in", _phone:"Enter the full phone number",
  _short:"Please write a little more"
};
Object.keys(EN_FALLBACK).forEach(function(k){
  if(I18N.en[k] === undefined) I18N.en[k] = EN_FALLBACK[k];
});

var LANG = 'en';
function T(k){
  var d = I18N[LANG] || {};
  return d[k] !== undefined ? d[k] : (I18N.en[k] !== undefined ? I18N.en[k] : k);
}
function setLang(l){
  var d = I18N[l];
  if(!d) return;
  LANG = l;
  root.lang = l;
  $$('[data-i18n]').forEach(function(el){
    var v = d[el.dataset.i18n]; if(v !== undefined) el.innerHTML = v;
  });
  $$('[data-i18n-html]').forEach(function(el){
    var v = d[el.dataset.i18nHtml]; if(v !== undefined) el.innerHTML = v;
  });
  $$('[data-i18n-ph]').forEach(function(el){
    var v = d[el.dataset.i18nPh]; if(v !== undefined) el.placeholder = v;
  });
  if(d._title) document.title = d._title;
  if(d._desc && descMeta) descMeta.content = d._desc;
  $$('.seg button').forEach(function(b){ b.classList.toggle('on', b.dataset.lang === l) });
  store.set('uztomic-lang',l);
  splitWords();
  refreshCalcs();
}
$$('.seg button').forEach(function(b){
  b.addEventListener('click',function(){ setLang(b.dataset.lang) });
});

/* ══════════════════ COPY TO CLIPBOARD ══════════════════ */
var toast = $('#toast'), toastT = 0;
function say(text){
  if(!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(function(){ toast.classList.remove('show') },2200);
}
document.addEventListener('click',function(e){
  var el = e.target.closest ? e.target.closest('[data-copy]') : null;
  if(!el || !canHover) return;         /* on a phone the tel:/mailto: link wins */
  e.preventDefault();
  var v = el.dataset.copy;
  if(navigator.clipboard) navigator.clipboard.writeText(v)
    .then(function(){ say(T('_copied')+' '+v) })
    .catch(function(){ location.href = el.getAttribute('href') });
});

/* ══════════════════ NUMBERS ══════════════════ */
function money(n){
  /* a non-breaking thousands space keeps "12 480 000" on one line */
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'\u00A0');
}

/* ══════════════════ CALCULATOR 1 — rough project estimate ══════════════════ */
var estForm = $('#est');
function runEstimate(animate){
  if(!estForm) return;
  var picked = estForm.querySelector('input[name=ekind]:checked');
  var kind = picked ? picked.value : 'site';
  var base = { site:[2e6,4e6,1,2], app:[6e6,12e6,4,8], sys:[12e6,25e6,8,14] }[kind];
  var lo = base[0], hi = base[1], w1 = base[2], w2 = base[3];
  $$('input[name=eadd]:checked',estForm).forEach(function(c){
    lo += +c.dataset.lo; hi += +c.dataset.hi; w1 += +c.dataset.w1; w2 += +c.dataset.w2;
  });
  var out = $('#estOut'), wk = $('#estWeeks');
  if(out){
    var p0 = +out.dataset.lo || 0, p1 = +out.dataset.hi || 0;
    out.dataset.lo = lo; out.dataset.hi = hi;
    if(animate === false || reduced){
      out.textContent = money(lo)+' – '+money(hi)+'\u00A0'+T('_uzs');
    }else{
      tween(0,1,520,function(k){
        out.textContent = money(p0+(lo-p0)*k)+' – '+money(p1+(hi-p1)*k)+'\u00A0'+T('_uzs');
      });
    }
  }
  if(wk) wk.textContent = Math.round(w1)+'–'+Math.round(w2)+' '+T('_weeks');
}
if(estForm){
  estForm.addEventListener('change',function(){ runEstimate(true) });
  var estSend = $('#estSend');
  if(estSend) estSend.addEventListener('click',function(){
    var out = $('#estOut'), wk = $('#estWeeks'), msg = $('#message');
    if(msg){
      var pick = estForm.querySelector('input[name=ekind]:checked');
      var kindLabel = pick ? pick.closest('.chip').querySelector('span').textContent.trim() : '';
      var adds = $$('input[name=eadd]:checked',estForm).map(function(c){
        return c.closest('.chip').querySelector('span').textContent.trim();
      }).join(', ');
      msg.value = kindLabel + (adds ? ' + ' + adds : '') + '\n' +
        (out ? out.textContent : '') + ' · ' + (wk ? wk.textContent : '');
    }
    var target = $('#contact');
    if(target) target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
    setTimeout(function(){ var n = $('#name'); if(n) n.focus({preventScroll:true}) },700);
  });
}

/* ══════════════════ CALCULATOR 2 — CRM monthly bill ══════════════════
   Mirrors Subscription.monthlyFor() in the Flutter app, so the number
   here is the number the shop sees inside the app.                     */
var P = { std:150000, pro:400000, branch:100000, incB:2, incU:6,
          proB:3, proU:16, slot1:50000, slotN:45000, step:5 };
function branchSurcharge(branches){
  var extra = branches - P.incB;
  if(extra < 1) return 0;
  var per = extra >= 5 ? P.branch-10000 : extra >= 3 ? P.branch-5000 : P.branch;
  return per * extra;
}
function slotPrice(slots){
  if(slots < 1) return 0;
  return P.slot1 + P.slotN * (Math.ceil(slots/P.step) - 1);
}
function crmMonthly(tier,branches,users){
  branches = Math.max(1,branches);
  if(tier === 'pro'){
    var over = branches - P.proB;
    return { base:P.pro,
             branch: over < 1 ? 0 : branchSurcharge(branches) - branchSurcharge(P.proB),
             slot:  slotPrice(Math.max(0,users-P.proU)) };
  }
  return { base:P.std, branch:branchSurcharge(branches),
           slot:slotPrice(Math.max(0,users-P.incU)) };
}
var crmCalc = $('#crmCalc');
function runCrm(animate){
  if(!crmCalc) return;
  var picked = crmCalc.querySelector('input[name=ctier]:checked');
  var tier = picked ? picked.value : 'std';
  var bEl = $('#cBranch'), uEl = $('#cUsers');
  var b = bEl ? +bEl.dataset.v || 1 : 1;
  var u = uEl ? +uEl.dataset.v || 3 : 3;
  var r = crmMonthly(tier,b,u);
  var total = r.base + r.branch + r.slot;

  var out = $('#crmSum');
  if(out){
    var prev = +out.dataset.v || 0;
    out.dataset.v = total;
    if(animate === false || reduced) out.textContent = money(total)+'\u00A0'+T('_uzs');
    else tween(prev,total,520,function(v){ out.textContent = money(v)+'\u00A0'+T('_uzs') });
  }
  var put = function(id,v){ var e = $(id); if(e) e.textContent = money(v)+'\u00A0'+T('_uzs') };
  put('#crmBase',r.base); put('#crmBranch',r.branch); put('#crmSlot',r.slot);

  var lim = $('#crmLimit');
  if(lim){
    lim.textContent = T('crm.cl.inc')
      .replace('{u}', tier === 'pro' ? P.proU : P.incU)
      .replace('{b}', tier === 'pro' ? P.proB : P.incB);
  }
}
/* +/− steppers */
$$('.step').forEach(function(s){
  var out = s.querySelector('output');
  var min = +s.dataset.min || 1, max = +s.dataset.max || 20;
  var minus = s.querySelector('[data-d="-1"]'), plus = s.querySelector('[data-d="1"]');
  function set(v){
    v = Math.min(Math.max(v,min),max);
    out.dataset.v = v; out.textContent = v;
    if(minus) minus.disabled = v <= min;
    if(plus)  plus.disabled  = v >= max;
    runCrm(true);
  }
  $$('button',s).forEach(function(b){
    b.addEventListener('click',function(){ set((+out.dataset.v || min) + (+b.dataset.d)) });
  });
  set(+out.dataset.v || min);
});
if(crmCalc) crmCalc.addEventListener('change',function(){ runCrm(true) });

function refreshCalcs(){ runEstimate(false); runCrm(false) }

/* ══════════════════ CRM DEMO — rotating phone screens ══════════════════ */
var demo = $('#demo');
if(demo){
  var tabs  = $$('[data-scr]',demo);
  var panes = $$('.pane',demo);
  var fill  = $('#demoFill');
  var idx = 0, timer = 0, paused = false, DUR = 5200;

  var show = function(i){
    idx = (i + panes.length) % panes.length;
    tabs.forEach(function(t,n){ t.classList.toggle('on', n===idx) });
    panes.forEach(function(p,n){ p.classList.toggle('on', n===idx) });
    if(fill && !reduced){
      fill.style.transition = 'none';
      fill.style.transform  = 'scaleX(0)';
      requestAnimationFrame(function(){
        fill.style.transition = 'transform '+DUR+'ms linear';
        fill.style.transform  = 'scaleX(1)';
      });
    }
  };
  var loop = function(){
    clearTimeout(timer);
    if(reduced) return;
    timer = setTimeout(function(){ if(!paused) show(idx+1); loop() },DUR);
  };
  tabs.forEach(function(t,n){ t.addEventListener('click',function(){ show(n); loop() }) });
  demo.addEventListener('pointerenter',function(){ paused = true });
  demo.addEventListener('pointerleave',function(){ paused = false });
  new IntersectionObserver(function(es,ob){
    if(es[0].isIntersecting){ show(0); loop(); ob.disconnect() }
  },{threshold:.3}).observe(demo);
}

/* ══════════════════ FORM ══════════════════ */
var form = $('#orderForm');
if(form){
  var msgBox = $('#formMsg'), btn = $('#submitBtn'), phone = $('#phone');

  /* +998 __ ___ __ __ */
  if(phone) phone.addEventListener('input',function(){
    var d = phone.value.replace(/\D/g,'');
    if(d.indexOf('998') === 0) d = d.slice(3);
    d = d.slice(0,9);
    var out = '';
    if(d.length)     out  = '+998 ' + d.slice(0,2);
    if(d.length > 2) out += ' ' + d.slice(2,5);
    if(d.length > 5) out += ' ' + d.slice(5,7);
    if(d.length > 7) out += ' ' + d.slice(7,9);
    phone.value = out;
  });

  var validate = function(){
    var ok = true, first = null;
    $$('[required]',form).forEach(function(el){
      var f = el.closest('.f');
      var v = el.value.trim(), key = '';
      if(!v) key = '_req';
      else if(el.id === 'phone' && v.replace(/\D/g,'').length < 12) key = '_phone';
      else if(el.tagName === 'TEXTAREA' && v.length < 10) key = '_short';
      if(f) f.classList.toggle('bad',!!key);
      if(key){
        var e = f && f.querySelector('.err');
        if(e) e.textContent = T(key);
        ok = false;
        if(!first) first = el;
      }
    });
    if(first){
      first.scrollIntoView({block:'center',behavior:reduced?'auto':'smooth'});
      first.focus({preventScroll:true});
    }
    return ok;
  };
  /* clear the red state as soon as the visitor fixes the field */
  $$('[required]',form).forEach(function(el){
    el.addEventListener('input',function(){
      var f = el.closest('.f');
      if(f && el.value.trim()) f.classList.remove('bad');
    });
  });

  form.addEventListener('submit',function(e){
    e.preventDefault();
    msgBox.className = 'msg'; msgBox.textContent = '';
    if(!validate()) return;
    if(form.botcheck && form.botcheck.value) return;

    var data = {};
    new FormData(form).forEach(function(v,k){ data[k] = v });
    delete data.botcheck;
    data.page = PAGE;
    data.lang = LANG;

    var label = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = T('_sending');

    var done = function(){
      msgBox.className = 'msg ok';
      msgBox.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 12.5 9.5 18 20 6.5"/></svg>' +
                         '<span>' + T('_ok') + '</span>';
      form.reset();
      if(phone) phone.value = '';
    };
    var oops = function(){
      var t = encodeURIComponent('Uztomic — ' + PAGE +
        '\nName: '    + (data.name    || '') +
        '\nPhone: '   + (data.phone   || '') +
        '\nService: ' + (data.service || '') +
        '\nBudget: '  + (data.budget  || '') + '\n\n' + (data.message || ''));
      msgBox.className = 'msg err';
      msgBox.innerHTML = T('_err') +
        ' <a href="https://t.me/' + TELEGRAM_USER + '" target="_blank" rel="noopener">@' +
        TELEGRAM_USER + '</a> · <a href="mailto:' + EMAIL +
        '?subject=Uztomic&body=' + t + '">' + EMAIL + '</a>';
    };

    fetch('https://api.web3forms.com/submit',{
      method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify(Object.assign({
        access_key:WEB3FORMS_KEY,
        subject:'uztomic.uz (' + PAGE + ') — ' + (data.service || 'request'),
        from_name:'uztomic.uz'
      },data))
    }).then(function(r){ return r.json() })
      .then(function(j){ j && j.success ? done() : oops() })
      .catch(oops)
      .then(function(){ btn.disabled = false; btn.innerHTML = label });
  });
}

/* ══════════════════ LANGUAGE — first visit ══════════════════ */
var qLang = new URLSearchParams(location.search).get('lang');
var saved = qLang || store.get('uztomic-lang');
if(!saved){
  /* only uz and ru are auto-detected from the browser. Anything else falls
     back to the page default (window.UZ.lang): English on the studio page,
     Uzbek on the CRM page, which is written for local shopkeepers. */
  var nav2 = (navigator.language || '').slice(0,2).toLowerCase();
  saved = (nav2 === 'uz' || nav2 === 'ru') ? nav2 : (CFG.lang || 'en');
}
if(saved && I18N[saved]) setLang(saved);
else { splitWords(); refreshCalcs() }

/* ══════════════════ PAGE FADE between / and /crm ══════════════════ */
if(!reduced){
  document.addEventListener('click',function(e){
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if(!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var href = a.getAttribute('href');
    if(!href || href.charAt(0) === '#' || /^(mailto|tel):/.test(href)) return;
    if(a.origin !== location.origin) return;
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(function(){ location.href = a.href },200);
  });
  addEventListener('pageshow',function(){ document.body.classList.remove('leaving') });
}

/* ══════════════════ INTRO — skip controls ══════════════════
   The timeline itself is pure CSS and the inline <head> script already
   guarantees the unlock, so this only makes it dismissible early.       */
var intro = $('#intro');
if(intro && root.classList.contains('intro')){
  var endIntro = function(){ root.classList.remove('intro') };
  intro.addEventListener('click',endIntro);
  intro.addEventListener('animationend',function(e){
    if(e.animationName === 'i-out') endIntro();
  });
  addEventListener('keydown',function(e){
    if(root.classList.contains('intro') &&
       (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) endIntro();
  });
}

var yr = $('#yr');
 if(yr) yr.textContent = new Date().getFullYear();
onScroll();
})();
