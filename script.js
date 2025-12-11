/* script.js — Versión definitiva (final)
   - No "expert mode"
   - Language selector visually integrated
   - Full features: i18n, theme, reveal, anchors, contact, newsletter, pricing, search, favorites, stats, magnet
*/

(function () {
  'use strict';

  const LS = {
    THEME: 'np_theme',
    LANG: 'np_lang',
    NEWSLETTER: 'np_newsletter',
    CONTACT_DRAFT: 'np_contact_draft',
    CONTACT_SUBS: 'np_contact_subs',
    PRICING_MODE: 'np_pricing_mode',
    FAVORITES: 'np_favorites',
    STATS: 'np_stats'
  };

  const $ = (sel, ctx = document) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function safeJSONParse(raw, fallback) { try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
  function safeJSONSet(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
  function safeJSONGet(key, fallback) { return safeJSONParse(localStorage.getItem(key), fallback); }
  function debounce(fn, ms = 120) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

  /* Translations map (es, en, pt) */
  const T = {
    es: {
      'meta.title': 'NovaPulse — Gestión inteligente',
      'meta.description': 'Landing page mobile-first, tema oscuro/claro, animaciones y microinteracciones.',
      'brand.name': 'NovaPulse',
      'nav.home': 'Inicio',
      'nav.features': 'Características',
      'nav.pricing': 'Precios',
      'nav.cta': 'Probar',
      'search.placeholder': 'Buscar...',
      'ui.stats': 'Estadísticas',
      'ui.theme': 'Cambiar Tema',
      'favorite.toggle': 'Marcar favorito',
      'hero.kicker': 'NUEVO · Lanzamiento',
      'hero.title': 'Gestiona proyectos con inteligencia, no con estrés',
      'hero.sub': 'NovaPulse combina automatización e insights en tiempo real para que tu equipo entregue más, con menos fricción.',
      'hero.cta_primary': 'Prueba gratis · 14 días',
      'hero.cta_secondary': 'Ver características',
      'hero.trust.1': 'Integración con Slack',
      'hero.trust.2': 'Sincronización en tiempo real',
      'hero.trust.3': 'Seguridad empresarial',
      'kpi.label1': 'Usuarios activos',
      'kpi.label2': 'Uptime',
      'kpi.label3': 'Soporte',
      'kpi.label4': 'Empresas confían',
      'features.title': 'Diseñado para equipos que quieren avanzar',
      'features.lead': 'Automatiza tareas repetitivas, visualiza el progreso y obtén recomendaciones impulsadas por IA.',
      'features.automation.title': 'Automatización',
      'features.automation.body': 'Reglas y flujos que reducen el trabajo manual.',
      'features.security.title': 'Seguridad',
      'features.security.body': 'Cifrado, SSO y control de acceso.',
      'features.analytics.title': 'Analítica',
      'features.analytics.body': 'Dashboards y recomendaciones accionables.',
      'testimonials.title': 'Lo que dicen nuestros clientes',
      'testimonials.1': '"NovaPulse redujo las reuniones semanales y nos dio visibilidad real."',
      'testimonials.2': '"Automatizar flujos nos ahorró horas diarias."',
      'testimonials.3': '"La visibilidad y recomendaciones de IA nos ayudaron a priorizar mejor."',
      'pricing.title': 'Precios simples',
      'pricing.lead': 'Planes claros, sin letras pequeñas.',
      'pricing.toggle_label': 'Precio anual',
      'pricing.badge': 'Recomendado ⭐',
      'pricing.pro.title': 'Pro',
      'pricing.pro.feature1': 'Automatizaciones ilimitadas',
      'pricing.pro.feature2': 'Soporte prioritario',
      'pricing.pro.feature3': 'SSO y auditoría',
      'pricing.pro.cta': 'Comenzar',
      'pricing.ess.title': 'Essentials',
      'pricing.ess.feature1': 'Tableros colaborativos',
      'pricing.ess.feature2': 'Integraciones básicas',
      'pricing.ess.feature3': 'Soporte por email',
      'pricing.ess.cta': 'Probar gratis',
      'cta.title': 'Empieza hoy. Escala mañana.',
      'cta.lead': 'Únete a equipos que ya redujeron el tiempo de entrega en un 30% con NovaPulse.',
      'cta.primary': 'Crear cuenta gratuita',
      'cta.secondary': 'Solicitar demo',
      'footer.product': 'Producto',
      'footer.company': 'Empresa',
      'footer.about': 'Sobre nosotros',
      'footer.blog': 'Blog',
      'contact.title': 'Contacto',
      'contact.placeholder.name': 'Tu nombre',
      'contact.placeholder.email': 'Tu correo',
      'contact.placeholder.message': 'Tu mensaje',
      'contact.submit': 'Enviar mensaje',
      'newsletter.title': 'Newsletter',
      'newsletter.placeholder': 'Tu correo',
      'newsletter.subscribe': 'Suscribir',
      'newsletter.export': 'Exportar',
      'newsletter.clear': 'Limpiar'
    },
    en: {
      'meta.title': 'NovaPulse — Smart Project Management',
      'meta.description': 'Mobile-first landing, light/dark theme, animations and micro-interactions.',
      'brand.name': 'NovaPulse',
      'nav.home': 'Home',
      'nav.features': 'Features',
      'nav.pricing': 'Pricing',
      'nav.cta': 'Try',
      'search.placeholder': 'Search...',
      'ui.stats': 'Stats',
      'ui.theme': 'Toggle theme',
      'favorite.toggle': 'Toggle favorite',
      'hero.kicker': 'NEW · Launch',
      'hero.title': 'Manage projects with intelligence, not stress',
      'hero.sub': 'NovaPulse combines automation and realtime insights so your team delivers more with less friction.',
      'hero.cta_primary': 'Free trial · 14 days',
      'hero.cta_secondary': 'See features',
      'hero.trust.1': 'Slack integration',
      'hero.trust.2': 'Realtime sync',
      'hero.trust.3': 'Enterprise security',
      'kpi.label1': 'Active users',
      'kpi.label2': 'Uptime',
      'kpi.label3': 'Support',
      'kpi.label4': 'Trusted companies',
      'features.title': 'Built for teams that want to move faster',
      'features.lead': 'Automate repetitive tasks, visualize progress and get AI-powered recommendations.',
      'features.automation.title': 'Automation',
      'features.automation.body': 'Rules and flows that reduce manual work.',
      'features.security.title': 'Security',
      'features.security.body': 'Encryption, SSO and access controls.',
      'features.analytics.title': 'Analytics',
      'features.analytics.body': 'Clear dashboards and actionable recommendations.',
      'testimonials.title': 'What our customers say',
      'testimonials.1': '"NovaPulse reduced our weekly meetings and gave us real visibility."',
      'testimonials.2': '"Automating simple flows saved us hours every day."',
      'testimonials.3': '"AI recommendations helped us prioritize better."',
      'pricing.title': 'Simple pricing',
      'pricing.lead': 'Clear plans, no surprises.',
      'pricing.toggle_label': 'Annual pricing',
      'pricing.badge': 'Recommended ⭐',
      'pricing.pro.title': 'Pro',
      'pricing.pro.feature1': 'Unlimited automations',
      'pricing.pro.feature2': 'Priority support',
      'pricing.pro.feature3': 'SSO & audit logs',
      'pricing.pro.cta': 'Get started',
      'pricing.ess.title': 'Essentials',
      'pricing.ess.feature1': 'Collaborative boards',
      'pricing.ess.feature2': 'Basic integrations',
      'pricing.ess.feature3': 'Email support',
      'pricing.ess.cta': 'Start free',
      'cta.title': 'Start today. Scale tomorrow.',
      'cta.lead': 'Join teams that reduced delivery time by 30% with NovaPulse.',
      'cta.primary': 'Create free account',
      'cta.secondary': 'Request demo',
      'footer.product': 'Product',
      'footer.company': 'Company',
      'footer.about': 'About us',
      'footer.blog': 'Blog',
      'contact.title': 'Contact',
      'contact.placeholder.name': 'Your name',
      'contact.placeholder.email': 'Your email',
      'contact.placeholder.message': 'Your message',
      'contact.submit': 'Send message',
      'newsletter.title': 'Newsletter',
      'newsletter.placeholder': 'Your email',
      'newsletter.subscribe': 'Subscribe',
      'newsletter.export': 'Export',
      'newsletter.clear': 'Clear'
    },
    pt: {
      'meta.title': 'NovaPulse — Gestão inteligente',
      'meta.description': 'Landing mobile-first, tema claro/escuro, animações e micro-interações.',
      'brand.name': 'NovaPulse',
      'nav.home': 'Início',
      'nav.features': 'Recursos',
      'nav.pricing': 'Preços',
      'nav.cta': 'Testar',
      'search.placeholder': 'Pesquisar...',
      'ui.stats': 'Estatísticas',
      'ui.theme': 'Mudar tema',
      'favorite.toggle': 'Marcar favorito',
      'hero.kicker': 'NOVO · Lançamento',
      'hero.title': 'Gerencie projetos com inteligência, não estresse',
      'hero.sub': 'NovaPulse combina automação e insights em tempo real para que sua equipe entregue mais com menos atrito.',
      'hero.cta_primary': 'Teste grátis · 14 dias',
      'hero.cta_secondary': 'Ver recursos',
      'hero.trust.1': 'Integração com Slack',
      'hero.trust.2': 'Sincronização em tempo real',
      'hero.trust.3': 'Segurança empresarial',
      'kpi.label1': 'Usuários ativos',
      'kpi.label2': 'Uptime',
      'kpi.label3': 'Suporte',
      'kpi.label4': 'Empresas confiam',
      'features.title': 'Projetado para equipes que querem avançar',
      'features.lead': 'Automatize tarefas repetitivas, visualize o progresso e obtenha recomendações acionáveis por IA.',
      'features.automation.title': 'Automação',
      'features.automation.body': 'Regras e fluxos que reduzem o trabalho manual.',
      'features.security.title': 'Segurança',
      'features.security.body': 'Criptografia, SSO e controle de acesso.',
      'features.analytics.title': 'Analítica',
      'features.analytics.body': 'Dashboards claros e recomendações acionáveis.',
      'testimonials.title': 'O que nossos clientes dizem',
      'testimonials.1': '"NovaPulse reduziu nossas reuniões semanais e nos deu visibilidade real."',
      'testimonials.2': '"Automatizar fluxos simples nos economizou horas diariamente."',
      'testimonials.3': '"As recomendações de IA nos ajudaram a priorizar melhor."',
      'pricing.title': 'Preços simples',
      'pricing.lead': 'Planos claros, sem letras miúdas.',
      'pricing.toggle_label': 'Preço anual',
      'pricing.badge': 'Recomendado ⭐',
      'pricing.pro.title': 'Pro',
      'pricing.pro.feature1': 'Automatizações ilimitadas',
      'pricing.pro.feature2': 'Suporte prioritário',
      'pricing.pro.feature3': 'SSO e auditoria',
      'pricing.pro.cta': 'Começar',
      'pricing.ess.title': 'Essentials',
      'pricing.ess.feature1': 'Quadros colaborativos',
      'pricing.ess.feature2': 'Integrações básicas',
      'pricing.ess.feature3': 'Suporte por email',
      'pricing.ess.cta': 'Teste grátis',
      'cta.title': 'Comece hoje. Escale amanhã.',
      'cta.lead': 'Junte-se a equipes que reduziram o tempo de entrega em 30% com NovaPulse.',
      'cta.primary': 'Criar conta gratuita',
      'cta.secondary': 'Solicitar demo',
      'footer.product': 'Produto',
      'footer.company': 'Empresa',
      'footer.about': 'Sobre nós',
      'footer.blog': 'Blog',
      'contact.title': 'Contato',
      'contact.placeholder.name': 'Seu nome',
      'contact.placeholder.email': 'Seu email',
      'contact.placeholder.message': 'Sua mensagem',
      'contact.submit': 'Enviar mensagem',
      'newsletter.title': 'Newsletter',
      'newsletter.placeholder': 'Seu email',
      'newsletter.subscribe': 'Inscrever',
      'newsletter.export': 'Exportar',
      'newsletter.clear': 'Limpar'
    }
  };

  /* i18n apply (text + html + attr) */
  function translatePage(lang) {
    const dict = T[lang] || T.es;
    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n; if (key && dict[key] !== undefined) el.textContent = dict[key];
    });
    $$('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml; if (key && dict[key] !== undefined) el.innerHTML = dict[key];
    });
    $$('[data-i18n-attr]').forEach(el => {
      const map = el.dataset.i18nAttr; if (!map) return;
      map.split(';').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s && s.trim()); if (!attr || !key) return;
        if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
      });
    });
    if (dict['meta.title']) document.title = dict['meta.title'];
    if (dict['meta.description']) {
      const md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', dict['meta.description']);
    }
    try { localStorage.setItem(LS.LANG, lang); } catch {}
  }

  function initI18n() {
    const select = $('#lang-select');
    const saved = (function(){ try { return localStorage.getItem(LS.LANG) || 'es'; } catch { return 'es'; } })();
    if (select) { select.value = saved; translatePage(saved); select.addEventListener('change', () => translatePage(select.value)); }
    else translatePage(saved);
  }

  /* Theme init */
  function initTheme() {
    const body = document.body;
    const btn = $('#btnTema');
    const checkbox = $('#theme-toggle');
    const saved = (function(){ try { return localStorage.getItem(LS.THEME); } catch { return null; } })();
    const systemLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const useLight = saved ? saved === 'light' : systemLight;
    body.classList.toggle('light', useLight);
    if (checkbox) checkbox.checked = useLight;
    if (btn) btn.setAttribute('aria-pressed', useLight ? 'true' : 'false');
    const setSaved = (isLight) => { try { localStorage.setItem(LS.THEME, isLight ? 'light' : 'dark'); } catch {} };
    if (btn) btn.addEventListener('click', () => {
      const isLight = body.classList.toggle('light');
      setSaved(isLight);
      if (checkbox) checkbox.checked = isLight;
      btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    });
    if (checkbox) checkbox.addEventListener('change', () => {
      const isLight = checkbox.checked;
      body.classList.toggle('light', isLight);
      setSaved(isLight);
      if (btn) btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    });
    try {
      if (saved === null && window.matchMedia) {
        const m = window.matchMedia('(prefers-color-scheme: light)');
        const handler = (e) => body.classList.toggle('light', e.matches);
        if (m.addEventListener) m.addEventListener('change', handler);
        else if (m.addListener) m.addListener(handler);
      }
    } catch {}
  }

  /* Smooth anchors */
  function initAnchors() {
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', function (e) {
      const href = this.getAttribute('href'); if (!href || href === '#') return;
      const t = document.querySelector(href); if (!t) return;
      e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const nt = $('#nav-toggle'); if (nt) nt.checked = false;
      const navLabel = document.querySelector('.nav-toggle-label'); if (navLabel) navLabel.setAttribute('aria-expanded', 'false');
    }));
  }

  /* Reveal */
  function initReveal() {
    const reveals = $$('.reveal'); if (!reveals.length) return;
    if (prefersReducedMotion) { reveals.forEach(r => r.classList.add('visible')); return; }
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const children = el.querySelectorAll('.card, .kpi-card, .testi-card, .price-card');
            if (children.length) children.forEach((c,i) => c.style.animation = `fadeIn 520ms ${i * 70}ms both`);
            el.classList.add('visible'); obs.unobserve(el);
          }
        });
      }, { threshold: 0.12 });
      reveals.forEach(r => io.observe(r));
    } else reveals.forEach(r => r.classList.add('visible'));
  }

  /* Contact form */
  function initContactForm() {
    const form = $('#form-contacto'); if (!form) return;
    const alertEl = $('#alerta');
    const LIMITS = { name: 60, email: 254, message: 1000 };
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const draft = safeJSONParse(localStorage.getItem(LS.CONTACT_DRAFT), null);
    if (draft) { if (draft.nombre) form.nombre.value = draft.nombre; if (draft.correo) form.correo.value = draft.correo; if (draft.mensaje) form.mensaje.value = draft.mensaje; }
    let t; form.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { try { localStorage.setItem(LS.CONTACT_DRAFT, JSON.stringify({ nombre: form.nombre.value, correo: form.correo.value, mensaje: form.mensaje.value })); } catch {} }, 400); });
    function showAlert(msg, type='error'){ if (!alertEl) { alert(msg); return; } alertEl.textContent = msg; alertEl.className = `alerta ${type} show`; setTimeout(()=>alertEl.classList.remove('show'),3500); }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = String(form.nombre.value || '').trim();
      const correo = String(form.correo.value || '').trim();
      const mensaje = String(form.mensaje.value || '').trim();
      const errors = [];
      if (!nombre) errors.push('El nombre es requerido.'); else if (nombre.length < 3) errors.push('El nombre es muy corto.'); else if (nombre.length > LIMITS.name) errors.push('Nombre demasiado largo.');
      if (!correo) errors.push('El correo es requerido.'); else if (!emailRx.test(correo)) errors.push('Formato de correo inválido.'); else if (correo.length > LIMITS.email) errors.push('Correo demasiado largo.');
      if (!mensaje) errors.push('El mensaje es requerido.'); else if (mensaje.length < 10) errors.push('Mensaje demasiado corto.'); else if (mensaje.length > LIMITS.message) errors.push('Mensaje demasiado largo.');
      if (errors.length) { showAlert(errors.join(' '), 'error'); return; }
      const subs = safeJSONParse(localStorage.getItem(LS.CONTACT_SUBS), []); subs.push({ nombre, correo, mensaje, at: new Date().toISOString() }); try { localStorage.setItem(LS.CONTACT_SUBS, JSON.stringify(subs)); } catch {}
      try { localStorage.removeItem(LS.CONTACT_DRAFT); } catch {}
      showAlert('¡Mensaje enviado correctamente!', 'exito'); form.reset();
    });
  }

  /* Newsletter */
  function initNewsletter() {
    const input = $('#newsletter-email'), btn = $('#subscribe-btn'), list = $('#subs-list'), exportBtn = $('#export-subs'), clearBtn = $('#clear-subs');
    if (!input || !btn) return;
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const render = () => { if (!list) return; const subs = safeJSONParse(localStorage.getItem(LS.NEWSLETTER), []); list.innerHTML = subs.length ? subs.map(s => `<li>${s}</li>`).join('') : '<li class="muted">Sin suscriptores</li>'; };
    btn.addEventListener('click', () => {
      const email = String(input.value || '').trim();
      if (!emailRx.test(email)) { input.classList.add('invalid'); setTimeout(()=>input.classList.remove('invalid'),1200); return; }
      const subs = safeJSONParse(localStorage.getItem(LS.NEWSLETTER), []); if (!subs.includes(email)) subs.push(email); try { localStorage.setItem(LS.NEWSLETTER, JSON.stringify(subs)); } catch {}
      input.value = ''; render();
    });
    if (exportBtn) exportBtn.addEventListener('click', () => {
      const subs = safeJSONParse(localStorage.getItem(LS.NEWSLETTER), []); const blob = new Blob([subs.join('\n')], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'subscribers.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    });
    if (clearBtn) clearBtn.addEventListener('click', () => { if (!confirm('Borrar suscriptores locales?')) return; try { localStorage.setItem(LS.NEWSLETTER, JSON.stringify([])); } catch {}; render(); });
    render();
  }

  /* Pricing */
  function initPricing() {
    const toggle = $('#price-toggle'), cards = $$('.price-card'); if (!cards.length) return;
    const formatMoney = n => Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
    const update = annual => { cards.forEach(card => {
      const month = card.dataset.month ? Number(card.dataset.month) : null;
      const year = card.dataset.year ? Number(card.dataset.year) : null;
      const priceEl = card.querySelector('.price'), savingsEl = card.querySelector('.savings');
      if (!priceEl) return;
      if (annual && year != null) { priceEl.textContent = `$${formatMoney(year)}/año`; if (savingsEl && month != null) { const saved = Math.max(0,(month*12)-year); savingsEl.textContent = saved>0 ? `Ahorra $${formatMoney(saved)}` : ''; } }
      else if (!annual && month != null) { priceEl.textContent = `$${formatMoney(month)}/mes`; if (savingsEl && year != null) { const saved = Math.max(0,(month*12)-year); savingsEl.textContent = saved>0 ? `Ahorro anual $${formatMoney(saved)}` : ''; } }
    }); };
    const saved = (function(){ try { return localStorage.getItem(LS.PRICING_MODE); } catch { return null; } })();
    const annual = saved === 'year';
    if (toggle) toggle.checked = annual;
    update(annual);
    if (toggle) toggle.addEventListener('change', () => { const a = !!toggle.checked; try { localStorage.setItem(LS.PRICING_MODE, a ? 'year' : 'month'); } catch {} update(a); });
  }

  /* Search */
  function initSearch() {
    const input = $('#search-input'); if (!input) return;
    const targets = $$('.feature-grid .card, .testi-grid .testi-card, .pricing-grid .price-card');
    const doFilter = () => { const q = input.value.trim().toLowerCase(); targets.forEach(t => { const ok = !q || (t.textContent||'').toLowerCase().includes(q); t.style.display = ok ? '' : 'none'; }); };
    input.addEventListener('input', debounce(doFilter, 120));
  }

  /* Favorites */
  function initFavorites() {
    const favEls = $$('.favorite-toggle'); const stored = safeJSONParse(localStorage.getItem(LS.FAVORITES), {});
    favEls.forEach(el => {
      const id = el.dataset.id; if (!id) return;
      if (stored[id]) el.classList.add('is-fav');
      el.addEventListener('click', () => {
        const s = safeJSONParse(localStorage.getItem(LS.FAVORITES), {});
        s[id] = !s[id];
        try { localStorage.setItem(LS.FAVORITES, JSON.stringify(s)); } catch {}
        el.classList.toggle('is-fav', s[id]);
        el.setAttribute('aria-pressed', s[id] ? 'true' : 'false');
      });
    });
  }

  /* Stats */
  function initStats() {
    const st = safeJSONParse(localStorage.getItem(LS.STATS), { visits:0, cta_clicks:0, sections:[] }); st.visits = (st.visits||0) + 1; try { localStorage.setItem(LS.STATS, JSON.stringify(st)); } catch {}
    const update = (k, v) => { const cur = safeJSONParse(localStorage.getItem(LS.STATS), { visits:0, cta_clicks:0, sections:[] }); if (k === 'section') { if (!cur.sections) cur.sections = []; if (!cur.sections.includes(v)) cur.sections.push(v); } else cur[k] = (cur[k]||0) + (v || 1); try { localStorage.setItem(LS.STATS, JSON.stringify(cur)); } catch {} };
    $$('.btn-primary').forEach(b => b.addEventListener('click', () => update('cta_clicks', 1)));
    const sections = $$('main section[id]');
    if (sections.length && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => { entries.forEach(en => { if (en.isIntersecting) { update('section', en.target.id); obs.unobserve(en.target); } }); }, { threshold: .5 });
      sections.forEach(s => io.observe(s));
    } else sections.forEach(s => update('section', s.id));
    const panel = $('#stats-panel'), toggle = $('#stats-toggle');
    if (!panel) return;
    const render = () => { const s = safeJSONParse(localStorage.getItem(LS.STATS), { visits:0, cta_clicks:0, sections:[] }); panel.innerHTML = `<div><strong>Visitas</strong>: ${s.visits||0}</div><div><strong>Clicks CTA</strong>: ${s.cta_clicks||0}</div><div><strong>Secciones vistas</strong>: ${(s.sections||[]).length}</div><div style="margin-top:.6rem"><em>${(s.sections||[]).join(', ')}</em></div>`; };
    if (toggle) toggle.addEventListener('click', () => { panel.classList.toggle('open'); toggle.setAttribute('aria-expanded', panel.classList.contains('open') ? 'true' : 'false'); render(); });
  }

  /* Magnet effect */
  function initMagnet() {
    const elms = [...$$('.btn-magnet'), ...$$('[data-magnet]')].filter(Boolean);
    elms.forEach(btn => {
      const strength = parseFloat(btn.dataset.magnet) || 30;
      btn.style.transition = 'transform 220ms ease, box-shadow 220ms ease';
      const onMove = (e) => {
        if (e.touches) return;
        const r = btn.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, cx = r.width/2, cy = r.height/2;
        const dx = (mx - cx)/cx, dy = (my - cy)/cy;
        btn.style.transform = `translate(${dx * strength * 0.15}px, ${dy * strength * 0.12}px) scale(1.02)`;
        btn.style.boxShadow = '0 18px 48px rgba(2,6,23,0.28)';
      };
      const onLeave = () => { btn.style.transform = ''; btn.style.boxShadow = ''; };
      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);
      btn.addEventListener('touchstart', () => { btn.style.transform = 'scale(1.02)'; }, { passive: true });
      btn.addEventListener('touchend', onLeave, { passive: true });
    });
  }

  /* Init sequence */
  document.addEventListener('DOMContentLoaded', () => {
    try { initI18n(); } catch (e) { console.warn('i18n init failed', e); }
    try { initTheme(); } catch (e) { console.warn('theme init failed', e); }
    try { initAnchors(); } catch (e) { console.warn('anchors init failed', e); }
    try { initReveal(); } catch (e) { console.warn('reveal init failed', e); }
    try { initContactForm(); } catch (e) { console.warn('contact init failed', e); }
    try { initNewsletter(); } catch (e) { console.warn('newsletter init failed', e); }
    try { initPricing(); } catch (e) { console.warn('pricing init failed', e); }
    try { initSearch(); } catch (e) { console.warn('search init failed', e); }
    try { initFavorites(); } catch (e) { console.warn('favorites init failed', e); }
    try { initStats(); } catch (e) { console.warn('stats init failed', e); }
    try { initMagnet(); } catch (e) { console.warn('magnet init failed', e); }

    // Close mobile menu on link click
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
      const nt = $('#nav-toggle'); if (nt) nt.checked = false;
      const navLabel = document.querySelector('.nav-toggle-label'); if (navLabel) navLabel.setAttribute('aria-expanded', 'false');
    }));
  });

})();