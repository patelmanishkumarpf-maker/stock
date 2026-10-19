(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const app = $('#app');
  const overlayRoot = $('#overlay-root');
  const iconPaths = {
    dashboard: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/><path d="M9 21v-6h6v6"/>',
    inventory: '<path d="m12 3 9 4.5v9L12 21l-9-4.5v-9z"/><path d="m3.5 7.8 8.5 4.4 8.5-4.4M12 12.2V21"/>',
    alerts: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    recommendations: '<path d="M9 18h6M10 22h4"/><path d="M8 15c-1.5-1.1-3-2.7-3-5.5a7 7 0 1 1 14 0c0 2.8-1.5 4.4-3 5.5-.7.5-1 1.1-1 2h-6c0-.9-.3-1.5-1-2z"/><path d="m10 8 2 2 3-3"/>',
    exchange: '<path d="M4 7h14l-3-3M20 17H6l3 3"/><path d="M18 7v4M6 13v4"/>',
    reports: '<path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 6-7"/><path d="M16 6h4v4"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4L7.3 15a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 2z"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v4h16v-4"/>',
    package: '<path d="m12 3 9 4.5v9L12 21l-9-4.5v-9z"/><path d="m3.5 7.8 8.5 4.4 8.5-4.4M12 12.2V21"/>',
    spark: '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    tag: '<path d="M20 13 11 22l-9-9V4h9z"/><circle cx="7.5" cy="8" r="1"/>',
    chart: '<path d="M4 19V5M4 19h17"/><rect x="8" y="11" width="2.8" height="5" rx=".5"/><rect x="13" y="8" width="2.8" height="8" rx=".5"/><rect x="18" y="5" width="2.8" height="11" rx=".5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    chevron: '<path d="m7 10 5 5 5-5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-1 .9-1.8 1.3-1.8 2.8M12 17h.01"/>',
    location: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    box: '<path d="m12 3 9 4.5v9L12 21l-9-4.5v-9z"/><path d="M8 5 17 10v8M3.5 7.8 12 12"/>',
    filter: '<path d="M4 6h16M7 12h10m-7 6h4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="m9 12 2 2 4-4"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
  };

  const icon = (name, extra = '') => `<span class="icon ${extra}" aria-hidden="true"><svg viewBox="0 0 24 24">${iconPaths[name] || iconPaths.package}</svg></span>`;
  const productSeed = [
    { id: 'p1', name: 'Detergent Powder (1 kg)', category: 'Household', stock: 48, reorder: 24, days: 60, emoji: '🧺', cost: 115 },
    { id: 'p2', name: 'Face Cream (50 g)', category: 'Personal Care', stock: 5, reorder: 12, days: 10, emoji: '🧴', cost: 180 },
    { id: 'p3', name: 'LED Bulb (9W)', category: 'Electronics', stock: 0, reorder: 15, days: 90, emoji: '💡', cost: 95 },
    { id: 'p4', name: 'Notebook (Single)', category: 'Stationery', stock: 120, reorder: 30, days: 2, emoji: '📓', cost: 35 },
    { id: 'p5', name: 'Chocolate Pack', category: 'Food & Beverages', stock: 30, reorder: 18, days: 45, emoji: '🍫', cost: 55 },
  ];
  const marketSeed = [
    { id: 'm1', name: 'Bath Soap (Pack of 4)', category: 'Household', quantity: 100, price: 400, location: 'Chennai', emoji: '🧼', seller: 'Green Basket Stores', condition: 'Sealed', desc: 'New, sealed packs. Best before 2027.' },
    { id: 'm2', name: 'Fruit Juice (200 ml)', category: 'Food & Beverages', quantity: 50, price: 600, location: 'Vellore', emoji: '🧃', seller: 'Fresh Corner Market', condition: 'Sealed', desc: 'Surplus beverage stock stored in a cool, dry place.' },
    { id: 'm3', name: 'Notebook (Single)', category: 'Stationery', quantity: 200, price: 900, location: 'Chennai', emoji: '📓', seller: 'Paper & Pen Co.', condition: 'New', desc: 'Unopened 180-page notebooks, mixed cover colours.' },
    { id: 'm4', name: 'LED Bulb (9W)', category: 'Electronics', quantity: 30, price: 900, location: 'Kanchipuram', emoji: '💡', seller: 'Bright Home Electricals', condition: 'New', desc: 'Tested, boxed bulbs with manufacturer warranty.' },
  ];
  const loadSaved = () => {
    try { return JSON.parse(localStorage.getItem('stockguard-demo') || '{}'); } catch { return {}; }
  };
  const saved = loadSaved();
  const state = {
    route: location.hash.replace('#', '') || 'home',
    products: Array.isArray(saved.products) ? saved.products : productSeed,
    listings: Array.isArray(saved.listings) ? saved.listings : [],
    purchases: Array.isArray(saved.purchases) ? saved.purchases : [],
    profile: saved.profile || { name: 'Ramesh Kumar', store: 'Ramesh Store', email: 'ramesh.store@gmail.com', location: 'Chennai' },
    settings: saved.settings || { emailAlerts: true, weeklySummary: true, reorderAlerts: true, riskThreshold: 45 },
    inventoryFilter: 'All Products',
    alertFilter: 'All (12)',
    recommendationTab: 'Reorder Suggestions',
    exchangeTab: 'Browse Products',
    exchangeCategory: 'All Categories',
    exchangeLocation: 'All Locations',
    dateRange: saved.dateRange || { from: '2026-08-01', to: '2026-08-31' },
    inventorySearch: '',
    exchangeSearch: '',
    modal: null,
    toastTimer: null,
    applied: Array.isArray(saved.applied) ? saved.applied : [],
  };
  const persist = () => {
    try { localStorage.setItem('stockguard-demo', JSON.stringify({ products: state.products, listings: state.listings, purchases: state.purchases, profile: state.profile, settings: state.settings, applied: state.applied, dateRange: state.dateRange })); } catch { /* Private browsing can disable storage. */ }
  };
  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const money = value => `₹ ${Number(value || 0).toLocaleString('en-IN')}`;
  const statusFor = product => product.stock <= 0 ? 'Out of Stock' : product.stock <= product.reorder ? 'Low Stock' : product.days >= 40 ? 'Slow-Moving' : 'In Stock';
  const statusClass = status => ({ 'In Stock': 'in', 'Low Stock': 'low', 'Slow-Moving': 'slow', 'Out of Stock': 'out' }[status] || 'in');
  const routeTitles = { dashboard: 'Dashboard', inventory: 'Inventory', alerts: 'Alerts', recommendations: 'Recommendations', exchange: 'B2B Exchange', reports: 'Reports', settings: 'Settings' };

  function navigate(route) {
    if (route === 'home') {
      if (location.hash) history.pushState({}, '', location.pathname + location.search);
      state.route = 'home'; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return;
    }
    if (!routeTitles[route]) route = 'dashboard';
    state.route = route;
    if (location.hash !== `#${route}`) history.pushState({}, '', `#${route}`);
    render(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const mainNav = [
    ['dashboard', 'Dashboard'], ['inventory', 'Inventory'], ['alerts', 'Alerts'],
    ['recommendations', 'Recommendations'], ['exchange', 'B2B Exchange'], ['reports', 'Reports'], ['settings', 'Settings'],
  ];
  const brand = () => `<a href="#" class="brand" data-route="home" aria-label="StockGuard home"><span class="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m12 2.8 9 4.6v9.2l-9 4.6-9-4.6V7.4z"/><path d="m3.5 7.6 8.5 4.3 8.5-4.3M12 11.9v9.3M8 5l8.5 4.4"/></svg></span><span class="brand-name">StockGuard</span></a>`;
  const pageHeading = (title, subtitle, actions = '') => `<div class="page-heading"><div><h1>${title}</h1><p>${subtitle}</p></div>${actions ? `<div class="heading-actions">${actions}</div>` : ''}</div>`;
  const metricCard = (ico, color, label, value, note) => `<article class="metric-card"><span class="metric-icon ${color}">${icon(ico)}</span><div><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-note">${note}</div></div></article>`;

  function render() {
    if (state.route === 'home') app.innerHTML = renderLanding();
    else app.innerHTML = renderWorkspace();
    renderModal();
  }

  function renderLanding() {
    return `<main class="landing">
      <header class="landing-nav">${brand()}<nav class="landing-links" aria-label="Main navigation"><a href="#features" data-scroll="features">Features</a><a href="#how-it-works" data-scroll="how-it-works">How it works</a><a href="#about" data-scroll="about">About</a><a href="mailto:hello@stockguard.in">Contact</a></nav><div class="landing-actions"><button class="btn btn-secondary btn-sm" data-action="auth" data-mode="login">Log in</button><button class="btn btn-primary btn-sm" data-action="auth" data-mode="signup">Sign up</button></div></header>
      <section class="hero"><div class="hero-copy"><span class="eyebrow">Inventory clarity, from shelf to sale</span><h1>Smarter inventory<br />for a <span>stronger business.</span></h1><p>Spot slow-moving stock early, protect cash flow with clearer decisions, and connect with other retailers when surplus inventory needs a new home.</p><div class="hero-actions"><button class="btn btn-primary" data-route="dashboard">Get started ${icon('arrow')}</button><a class="btn btn-secondary" href="#how-it-works" data-scroll="how-it-works">See how it works</a></div><div class="hero-note">${icon('shield')} Built for small retailers. Clear recommendations, with the reason behind each one.</div><div class="hero-proof"><span class="avatar-stack"><i>RK</i><i>AS</i><i>MP</i><i>+</i></span><span>Designed around the everyday decisions retailers make</span></div></div>
        <div class="hero-art" aria-label="Illustration of organized retail inventory and an early low-stock alert"><div class="art-halo"></div><div class="shelf"></div><i class="box b1"></i><i class="box b2"></i><i class="box b3"></i><i class="box b4"></i><i class="box b5"></i><i class="box b6"></i><i class="box b7"></i><div class="leaf-pot"></div><div class="art-floor"></div><div class="stock-card"><div class="stock-card-top"><span class="alert-dot">${icon('alerts')}</span><span>Low stock watch</span></div><div class="muted small" style="margin:9px 0 0">Face Cream · only 5 left</div><div class="mini-bars"><i></i><i></i><i></i><i></i><i></i></div><div class="small" style="margin-top:9px;color:#3c815d;font-weight:700">Suggested reorder · 12 units</div></div></div></section>
      <div class="feature-strip" id="features"><div class="feature-item"><span class="feature-icon">${icon('inventory')}</span><div><strong>Track inventory simply</strong><small>See stock and movement together</small></div></div><div class="feature-item"><span class="feature-icon">${icon('alerts')}</span><div><strong>Get early alerts</strong><small>Act before slow stock becomes dead stock</small></div></div><div class="feature-item"><span class="feature-icon">${icon('recommendations')}</span><div><strong>Make informed decisions</strong><small>Reorder, discount, or bundle with context</small></div></div><div class="feature-item"><span class="feature-icon">${icon('exchange')}</span><div><strong>Trade surplus stock</strong><small>Find a business buyer on the exchange</small></div></div></div>
      <section class="landing-section" id="how-it-works"><div class="section-heading"><span class="eyebrow">How StockGuard works</span><h2>One clear next step at a time.</h2><p>StockGuard brings your inventory into view, highlights where attention may help, then gives you practical options to consider.</p></div><div class="steps-grid"><article class="step-card"><span class="step-num">01</span><h3>Know what you have</h3><p>Keep product quantities, categories, and recent sales activity together in a simple inventory view.</p></article><article class="step-card"><span class="step-num">02</span><h3>Spot risk sooner</h3><p>See low-stock and slow-moving items with straightforward signals you can review and adjust.</p></article><article class="step-card"><span class="step-num">03</span><h3>Choose an action</h3><p>Review a reorder, plan a markdown or bundle, or offer suitable surplus stock to other retailers.</p></article></div></section>
      <section class="landing-cta" id="about"><div><h2>Inventory decisions, made easier.</h2><p>Explore the StockGuard retailer workspace with sample store data.</p></div><button class="btn btn-primary" data-route="dashboard">Open the demo workspace ${icon('arrow')}</button></section>
      <footer class="landing-footer"><div class="footer-inner"><span>${brand()}</span><span>StockGuard · Smart dead-stock prevention and inventory optimization</span><span>Prototype workspace · Sample data</span></div></footer>
    </main>`;
  }

  function renderWorkspace() {
    const title = routeTitles[state.route] || routeTitles.dashboard;
    return `<main class="workspace"><header class="topbar">${brand()}<button class="btn-icon" aria-label="Toggle navigation" data-action="sidebar-hint">${icon('menu')}</button><label class="global-search">${icon('search')}<input id="global-search" type="search" placeholder="Search products, categories..." aria-label="Search products" /></label><span class="topbar-spacer"></span><button class="topbar-icon" aria-label="View alerts" data-route="alerts">${icon('alerts')}<i class="notification-dot"></i></button><button class="topbar-icon" aria-label="Help" data-action="help">${icon('help')}</button><div class="profile"><span class="profile-avatar">${icon('user')}</span><div class="profile-meta"><div class="profile-name">${escapeHtml(state.profile.store)}</div><div class="profile-email">${escapeHtml(state.profile.email)}</div></div></div></header>
      <div class="app-layout"><aside class="sidebar"><div class="nav-label">Workspace</div><nav class="nav-list" aria-label="Retail workspace">${mainNav.map(([route,label]) => `<a href="#${route}" class="nav-link ${state.route === route ? 'active' : ''}" data-route="${route}" title="${label}">${icon(route)}<span>${label}</span>${route === 'alerts' ? '<i class="nav-count">12</i>' : ''}</a>`).join('')}</nav><div class="sidebar-bottom"><div class="help-card"><strong>Need a hand?</strong><p>Get help setting up your inventory or understanding an alert.</p><button data-action="help">Visit help center →</button></div></div></aside><section class="main-content" aria-label="${title}">${renderRoute()}</section></div></main>`;
  }

  function renderRoute() {
    switch (state.route) {
      case 'inventory': return renderInventory();
      case 'alerts': return renderAlerts();
      case 'recommendations': return renderRecommendations();
      case 'exchange': return renderExchange();
      case 'reports': return renderReports();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  }

  function renderDashboard() {
    const added = Math.max(0, state.products.length - productSeed.length);
    const low = 18 + state.products.filter(p => statusFor(p) === 'Low Stock' && !productSeed.some(seed => seed.id === p.id)).length;
    const slow = 26 + state.products.filter(p => statusFor(p) === 'Slow-Moving' && !productSeed.some(seed => seed.id === p.id)).length;
    const from = new Date(`${state.dateRange.from}T00:00:00`);
    const to = new Date(`${state.dateRange.to}T00:00:00`);
    const formatDate = date => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const alerts = [
      { name: 'Detergent Powder (1 kg)', desc: 'Slow-moving · no sales in 60 days', type: 'slow', date: '28 Aug' },
      { name: 'Face Cream (50 g)', desc: 'Low stock · only 5 units left', type: 'low', date: '27 Aug' },
      { name: 'LED Bulb (9W)', desc: 'Potential dead stock · no sales in 90 days', type: 'dead', date: '25 Aug' },
    ];
    return `${pageHeading('Dashboard', 'A clear view of your inventory and the stock that may need attention.', '<button class="date-control" data-action="date-range">' + icon('calendar') + ` ${formatDate(from)} – ${formatDate(to)} ` + icon('chevron') + '</button>')}
      <div class="metric-grid">${metricCard('inventory','green','Total Products',124 + added,'Across your tracked assortment')}${metricCard('alerts','red','Low Stock',low,'Products below reorder point')}${metricCard('clock','amber','Slow-Moving',slow,'No recent sales activity')}${metricCard('shield','purple','Potential Loss','₹ 12,450','Estimated value at risk')}</div>
      <div class="dashboard-grid"><article class="panel chart-panel"><div class="panel-head"><div><h2 class="panel-title">Inventory Status</h2><p class="panel-subtitle">Stock health across your product range</p></div><button class="btn-icon" aria-label="Inventory details" data-route="inventory">${icon('arrow')}</button></div><div class="chart-body"><div class="donut"><div class="donut-center"><strong>124</strong><span>Total products</span></div></div><div class="legend"><div class="legend-row"><i class="legend-dot green"></i><span>In Stock</span><strong>68</strong></div><div class="legend-row"><i class="legend-dot amber"></i><span>Low Stock</span><strong>18</strong></div><div class="legend-row"><i class="legend-dot blue"></i><span>Slow-Moving</span><strong>26</strong></div><div class="legend-row"><i class="legend-dot red"></i><span>Out of Stock</span><strong>12</strong></div></div></div></article>
        <article class="panel"><div class="panel-head"><div><h2 class="panel-title">Recent Alerts</h2><p class="panel-subtitle">A few items worth a closer look</p></div><button class="text-link" data-route="alerts">View all</button></div><div class="alert-list">${alerts.map(alertRow).join('')}</div></article></div>
      <div class="insight-band"><span class="insight-badge">${icon('spark')}</span><div><strong>A useful next step</strong><p>Changing customer preferences were the most selected reason for unsold stock in your discovery survey. Review slow-moving items before placing the next order.</p></div><button class="btn btn-secondary btn-sm" data-route="recommendations">View suggestions ${icon('arrow')}</button></div>`;
  }

  function alertRow(item, compact = false) {
    return `<div class="alert-row"><span class="alert-symbol ${item.type}">${icon(item.type === 'slow' ? 'clock' : item.type === 'low' ? 'alerts' : 'shield')}</span><div><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.desc)}</p></div><time>${escapeHtml(item.date)}</time>${compact ? '' : ''}</div>`;
  }

  function visibleProducts() {
    const q = state.inventorySearch.toLowerCase().trim();
    return state.products.filter(p => {
      const status = statusFor(p);
      const matchesTab = state.inventoryFilter === 'All Products' ||
        (state.inventoryFilter === 'Low Stock' && status === 'Low Stock') ||
        (state.inventoryFilter === 'Slow-Moving' && status === 'Slow-Moving') ||
        (state.inventoryFilter === 'Out of Stock' && status === 'Out of Stock');
      const matchesSearch = !q || `${p.name} ${p.category}`.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }

  function productTable(products = visibleProducts()) {
    if (!products.length) return `<div class="empty-state"><strong>No products found</strong>Try another filter or add an item to your inventory.</div>`;
    return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Product</th><th>Category</th><th>Current Stock</th><th>Status</th><th>Last Sold</th><th>Actions</th></tr></thead><tbody>${products.map(p => {
      const status = statusFor(p);
      return `<tr><td><div class="product-cell"><span class="product-thumb">${escapeHtml(p.emoji || '📦')}</span><div><div class="product-name">${escapeHtml(p.name)}</div><div class="product-category">SKU ${escapeHtml(p.id.toUpperCase())}</div></div></div></td><td>${escapeHtml(p.category)}</td><td><strong>${Number(p.stock).toLocaleString('en-IN')}</strong></td><td><span class="status ${statusClass(status)}">${status}</span></td><td>${p.days ? `${p.days} days ago` : '—'}</td><td><button class="row-actions" aria-label="Actions for ${escapeHtml(p.name)}" data-action="product-menu" data-id="${escapeHtml(p.id)}">···</button></td></tr>`;
    }).join('')}</tbody></table></div>`;
  }

  function renderInventory() {
    const tabs = ['All Products','Low Stock','Slow-Moving','Out of Stock'];
    return `${pageHeading('Inventory', 'View and manage your product inventory.', `<button class="btn btn-primary" data-action="add-product">${icon('plus')} Add Product</button>`)}
      <div class="toolbar"><label class="search-field">${icon('search')}<input id="inventory-search" type="search" value="${escapeHtml(state.inventorySearch)}" placeholder="Search products..." aria-label="Search inventory" /></label><span class="toolbar-spacer"></span><button class="btn btn-secondary btn-sm" data-action="export-inventory">${icon('download')} Export CSV</button></div>
      <article class="panel"><div class="tab-row">${tabs.map((tab, index) => `<button class="tab-button ${state.inventoryFilter === tab ? 'active' : ''}" data-action="inventory-tab" data-tab="${tab}">${tab}<span class="tab-count">${index === 0 ? state.products.length : state.products.filter(p => statusFor(p) === ({'Low Stock':'Low Stock','Slow-Moving':'Slow-Moving','Out of Stock':'Out of Stock'}[tab])).length}</span></button>`).join('')}</div><div id="inventory-table">${productTable()}</div><div class="panel-head" style="padding:12px 16px;border-top:1px solid var(--line)"><span class="muted small">Showing ${visibleProducts().length} sample ${visibleProducts().length === 1 ? 'product' : 'products'} · demo assortment includes 124 items</span><span class="muted small">Last updated just now</span></div></article>`;
  }

  const alertData = [
    { name:'Detergent Powder (1 kg)', type:'Slow-Moving', message:'No sales in 60 days', date:'28 Aug 2026', productId:'p1' },
    { name:'Face Cream (50 g)', type:'Low Stock', message:'Only 5 units left', date:'27 Aug 2026', productId:'p2' },
    { name:'LED Bulb (9W)', type:'Potential Dead Stock', message:'No sales in 90 days', date:'25 Aug 2026', productId:'p3' },
    { name:'Chocolate Pack', type:'Slow-Moving', message:'Low sales in last 45 days', date:'22 Aug 2026', productId:'p5' },
  ];
  function renderAlerts() {
    const tabs = ['All (12)','Low Stock (5)','Slow-Moving (4)','Potential Dead Stock (3)'];
    let rows = alertData;
    if (state.alertFilter.startsWith('Low')) rows = alertData.filter(a => a.type === 'Low Stock');
    if (state.alertFilter.startsWith('Slow')) rows = alertData.filter(a => a.type === 'Slow-Moving');
    if (state.alertFilter.startsWith('Potential')) rows = alertData.filter(a => a.type === 'Potential Dead Stock');
    return `${pageHeading('Alerts', 'Stay informed about important inventory updates.', '<button class="btn btn-secondary btn-sm" data-action="mark-alerts">' + icon('check') + ' Mark all reviewed</button>')}
      <article class="panel"><div class="tab-row">${tabs.map(tab => `<button class="tab-button ${state.alertFilter === tab ? 'active' : ''}" data-action="alert-tab" data-tab="${tab}">${tab}</button>`).join('')}</div><div class="table-wrap"><table class="data-table"><thead><tr><th>Product</th><th>Alert Type</th><th>Message</th><th>Date</th><th>Action</th></tr></thead><tbody>${rows.map(a => `<tr><td><div class="product-cell"><span class="product-thumb">${escapeHtml((state.products.find(p => p.id === a.productId) || {}).emoji || '📦')}</span><div class="product-name">${escapeHtml(a.name)}</div></div></td><td><span class="status ${a.type === 'Low Stock' ? 'low' : a.type === 'Slow-Moving' ? 'slow' : 'out'}">${escapeHtml(a.type)}</span></td><td>${escapeHtml(a.message)}</td><td>${a.date}</td><td><button class="btn btn-secondary btn-sm" data-action="view-alert" data-id="${a.productId}">View</button></td></tr>`).join('')}</tbody></table></div><div class="panel-head" style="padding:12px 16px;border-top:1px solid var(--line)"><span class="muted small">Showing ${rows.length} of 12 alerts · dates reflect sample prototype data</span><span class="muted small">${icon('shield')} Risk flags are indicators to review</span></div></article>
      <div class="insight-band"><span class="insight-badge">${icon('help')}</span><div><strong>How are these alerts created?</strong><p>StockGuard uses your reorder point and recent sales activity to flag items. The current prototype uses transparent example rules, not predictive AI.</p></div></div>`;
  }

  const recommendations = [
    { id:'r1', type:'reorder', title:'Reorder – Notebook (Single)', body:'Stock is running low. Consider reordering to avoid a stockout.', label:'Suggested Quantity', value:'200 units', productId:'p4', action:'Mark reorder planned' },
    { id:'r2', type:'discount', title:'Discount – Face Cream (50 g)', body:'Slow-moving product. Consider a 10–20% discount to increase sales.', label:'Suggested Discount', value:'15%', productId:'p2', action:'Plan 15% discount' },
    { id:'r3', type:'bundle', title:'Bundle – Detergent Powder + Dishwash Bar', body:'Often purchased together. Create an offer to improve sales.', label:'Bundle idea', value:'Household essentials', productId:'p1', action:'Save bundle idea' },
    { id:'r4', type:'stock', title:'Review – LED Bulb (9W)', body:'No sales in 90 days. Pause new purchases and consider a clearance offer.', label:'Estimated exposure', value:'₹ 1,140', productId:'p3', action:'Mark for review' },
  ];
  function renderRecommendations() {
    const tabs = ['Reorder Suggestions','Discount Suggestions','Bundle Suggestions'];
    const typeForTab = { 'Reorder Suggestions':'reorder', 'Discount Suggestions':'discount', 'Bundle Suggestions':'bundle' };
    const shown = recommendations.filter(r => r.type === typeForTab[state.recommendationTab] && !state.applied.includes(r.id));
    return `${pageHeading('Recommendations', 'Actionable suggestions to support better inventory decisions.', '<button class="btn btn-secondary btn-sm" data-action="recompute">' + icon('spark') + ' Refresh suggestions</button>')}
      <article class="panel"><div class="tab-row">${tabs.map(tab => `<button class="tab-button ${state.recommendationTab === tab ? 'active' : ''}" data-action="recommendation-tab" data-tab="${tab}">${tab}</button>`).join('')}</div><div class="reco-list">${shown.length ? shown.map(r => `<div class="reco-card"><span class="reco-icon ${r.type}">${icon(r.type === 'reorder' ? 'arrow' : r.type === 'discount' ? 'tag' : 'package')}</span><div class="reco-copy"><strong>${r.title}</strong><p>${r.body}</p><p class="small" style="color:#91a098">Based on stock level and recent movement · review before acting</p></div><div class="reco-value"><span>${r.label}</span><strong>${r.value}</strong><small>Suggested action</small></div><button class="btn btn-primary btn-sm" data-action="recommendation-detail" data-id="${r.id}">View details</button></div>`).join('') : `<div class="empty-state"><strong>You're all caught up</strong>No ${state.recommendationTab.toLowerCase()} waiting for review.</div>`}</div></article>
      <div class="survey-note">Recommendations are example rules based on the prototype inventory. Confirm stock, sales context, and margin before acting.</div>`;
  }

  function marketListings() { return [...state.listings, ...marketSeed]; }
  function renderMarketCards() {
    let items = marketListings();
    if (state.exchangeCategory !== 'All Categories') items = items.filter(item => item.category === state.exchangeCategory);
    if (state.exchangeLocation !== 'All Locations') items = items.filter(item => item.location === state.exchangeLocation);
    const query = state.exchangeSearch.toLowerCase().trim();
    if (query) items = items.filter(item => `${item.name} ${item.category} ${item.seller}`.toLowerCase().includes(query));
    return items;
  }
  function renderExchange() {
    const tabs = ['Browse Products','My Listings','My Purchases'];
    const listings = state.exchangeTab === 'Browse Products' ? renderMarketCards() : state.exchangeTab === 'My Listings' ? state.listings : state.purchases;
    const categories = ['All Categories', ...new Set(marketListings().map(item => item.category))];
    const locations = ['All Locations', ...new Set(marketListings().map(item => item.location))];
    return `${pageHeading('B2B Exchange', 'Buy or sell surplus stock with verified business profiles.', '<button class="btn btn-primary" data-action="list-stock">' + icon('plus') + ' List your surplus stock</button>')}
      <article class="panel"><div class="tab-row">${tabs.map(tab => `<button class="tab-button ${state.exchangeTab === tab ? 'active' : ''}" data-action="exchange-tab" data-tab="${tab}">${tab}${tab === 'My Listings' && state.listings.length ? `<span class="tab-count">${state.listings.length}</span>` : ''}${tab === 'My Purchases' && state.purchases.length ? `<span class="tab-count">${state.purchases.length}</span>` : ''}</button>`).join('')}</div>
      ${state.exchangeTab === 'Browse Products' ? `<div class="toolbar" style="padding:13px 16px 0;margin:0"><label class="search-field" style="flex:1"><span class="icon">${icon('search')}</span><input id="exchange-search" type="search" value="${escapeHtml(state.exchangeSearch)}" placeholder="Search products, categories..." aria-label="Search exchange products" /></label><select id="exchange-category" class="select-field" aria-label="Filter by category">${categories.map(c => `<option ${state.exchangeCategory === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}</select><select id="exchange-location" class="select-field" aria-label="Filter by location">${locations.map(c => `<option ${state.exchangeLocation === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}</select></div>` : ''}
      <div id="market-results">${listings.length ? `<div class="exchange-grid">${listings.map(item => marketCard(item, state.exchangeTab === 'My Purchases' ? 'Purchased' : state.exchangeTab === 'My Listings' ? 'Your listing' : 'Available')).join('')}</div>` : `<div class="empty-state"><strong>${state.exchangeTab === 'My Listings' ? 'No listings yet' : 'No purchases yet'}</strong>${state.exchangeTab === 'My Listings' ? 'List suitable surplus stock so another retailer can find it.' : 'Browse the exchange and request products for your store.'}<div style="margin-top:13px"><button class="btn btn-primary btn-sm" data-action="${state.exchangeTab === 'My Listings' ? 'list-stock' : 'exchange-tab'}" ${state.exchangeTab === 'My Purchases' ? 'data-tab="Browse Products"' : ''}>${state.exchangeTab === 'My Listings' ? 'Create a listing' : 'Browse products'}</button></div></div>`}</div>
      <div class="panel-head" style="padding:12px 16px;border-top:1px solid var(--line)"><span class="muted small">Prototype marketplace · listings and purchase requests are saved in this browser</span><span class="muted small">${icon('shield')} Review quality, payment, and delivery before a transaction</span></div></article>`;
  }

  function marketCard(item, actionLabel = 'Available') {
    return `<article class="market-card"><div class="market-image"><span class="market-chip">${escapeHtml(actionLabel)}</span><span class="market-emoji">${escapeHtml(item.emoji || '📦')}</span></div><div class="market-info"><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.category)}</p><div class="market-qty">${Number(item.quantity).toLocaleString('en-IN')} units available</div><div class="market-price">${money(item.price)}</div><div class="market-meta"><span>${icon('location')} ${escapeHtml(item.location || state.profile.location)}</span><span>${escapeHtml(item.condition || 'New')}</span></div>${actionLabel === 'Purchased' ? `<button class="btn btn-secondary btn-sm" disabled>Request sent ${icon('check')}</button>` : actionLabel === 'Your listing' ? `<button class="btn btn-secondary btn-sm" data-action="listing-detail" data-id="${escapeHtml(item.id)}">Manage listing</button>` : `<button class="btn btn-secondary btn-sm" data-action="market-detail" data-id="${escapeHtml(item.id)}">View details</button>`}</div></article>`;
  }

  function renderReports() {
    const signals = [
      ['Experience excess or unsold stock frequently',59,'59%'],
      ['Rate early alerts as useful (4 or 5 / 5)',65.7,'65.7%'],
      ['Find it difficult to identify slow-moving items',31.3,'31.3%'],
      ['Have surplus they may sell to another business',68.8,'68.8%'],
    ];
    return `${pageHeading('Reports', 'Explore early customer discovery signals and inventory health.', '<button class="btn btn-secondary btn-sm" data-action="export-report">' + icon('download') + ' Export summary</button>')}
      <div class="metric-grid">${metricCard('chart','green','Survey responses','32','15 questions · exploratory sample')}${metricCard('alerts','amber','Useful alert ratings','65.7%','Rated early alerts 4 or 5 / 5')}${metricCard('recommendations','purple','Top feature','Reorder','28.1% selected recommendations')}${metricCard('exchange','red','Marketplace interest','68.8%','Frequently or occasionally')}</div>
      <div class="report-grid"><article class="panel"><div class="panel-head"><div><h2 class="panel-title">Customer discovery signals</h2><p class="panel-subtitle">Selected findings from the 32-response survey in the project report</p></div></div><div class="report-bars">${signals.map(([label,value,display]) => `<div class="bar-row"><span>${label}</span><div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div><span class="bar-percent">${display}</span></div>`).join('')}</div></article><article class="panel"><div class="panel-head"><div><h2 class="panel-title">What retailers told us</h2><p class="panel-subtitle">Implications for the StockGuard MVP</p></div></div><div class="report-callout"><div class="signal-row"><span>Most selected unsold-stock reason</span><strong>Changing preferences · 37.5%</strong></div><div class="signal-row"><span>Most common stock-tracking method</span><strong>Spreadsheets · 28.1%</strong></div><div class="signal-row"><span>Top requested feature</span><strong>Reorder ideas · 28.1%</strong></div><div class="signal-row"><span>Most selected price model</span><strong>Monthly · 34.4%</strong></div><div class="survey-note">The survey is a small exploratory sample. Stated usefulness and willingness to pay are not proof of product-market fit or actual purchase behavior.</div></div></article></div>`;
  }

  function renderSettings() {
    return `${pageHeading('Settings', 'Manage your store profile and StockGuard preferences.')}
      <div class="settings-grid"><aside class="panel settings-menu"><button class="settings-option active">${icon('user')} Store profile</button><button class="settings-option" data-action="settings-notifications">${icon('alerts')} Notifications</button><button class="settings-option" data-action="settings-data">${icon('shield')} Demo data</button></aside><div class="panel settings-content"><h2>Store profile</h2><p>These details appear on your retailer workspace and marketplace listings.</p><form id="profile-form"><div class="form-grid"><div class="field"><label for="profile-name">Your name</label><input id="profile-name" name="name" value="${escapeHtml(state.profile.name)}" required /></div><div class="field"><label for="profile-store">Store name</label><input id="profile-store" name="store" value="${escapeHtml(state.profile.store)}" required /></div><div class="field"><label for="profile-email">Email</label><input id="profile-email" name="email" type="email" value="${escapeHtml(state.profile.email)}" required /></div><div class="field"><label for="profile-location">Location</label><input id="profile-location" name="location" value="${escapeHtml(state.profile.location)}" required /></div><div class="field full"><label for="risk-threshold">Slow-moving alert threshold (days)</label><input id="risk-threshold" name="threshold" type="number" min="7" max="180" value="${Number(state.settings.riskThreshold)}" /></div></div><div class="modal-actions"><button class="btn btn-primary" type="submit">Save changes</button></div></form><div class="setting-toggle"><div><strong>Email alerts</strong><p>Receive an email when products need attention.</p></div><label class="switch"><input type="checkbox" data-setting="emailAlerts" ${state.settings.emailAlerts ? 'checked' : ''}><span></span></label></div><div class="setting-toggle"><div><strong>Weekly summary</strong><p>Get a weekly inventory and risk overview.</p></div><label class="switch"><input type="checkbox" data-setting="weeklySummary" ${state.settings.weeklySummary ? 'checked' : ''}><span></span></label></div><div class="setting-toggle"><div><strong>Reorder alerts</strong><p>Notify me when stock falls below its reorder point.</p></div><label class="switch"><input type="checkbox" data-setting="reorderAlerts" ${state.settings.reorderAlerts ? 'checked' : ''}><span></span></label></div><hr style="border:0;border-top:1px solid var(--line);margin:20px 0"><div class="setting-toggle"><div><strong>Reset demo data</strong><p>Restore the original sample products and listings in this browser.</p></div><button class="btn btn-danger btn-sm" data-action="reset-demo">Reset data</button></div></div></div>`;
  }

  function openModal(modal) { state.modal = modal; renderModal(); }
  function closeModal() { state.modal = null; renderModal(); }
  function renderModal() {
    if (!state.modal) { overlayRoot.innerHTML = ''; return; }
    let modal = state.modal;
    let title = '', subtitle = '', body = '', wide = false;
    if (modal.type === 'auth') {
      const signup = modal.mode === 'signup'; title = signup ? 'Create your StockGuard account' : 'Welcome back'; subtitle = signup ? 'Start with a simple view of your store inventory.' : 'Sign in to continue to your retailer workspace.';
      body = `<form id="auth-form"><div class="form-grid">${signup ? `<div class="field full"><label for="auth-name">Your name</label><input id="auth-name" name="name" placeholder="Ramesh Kumar" required /></div><div class="field full"><label for="auth-store">Store name</label><input id="auth-store" name="store" placeholder="Your store" required /></div>` : ''}<div class="field full"><label for="auth-email">Email address</label><input id="auth-email" name="email" type="email" placeholder="you@yourstore.com" required /></div><div class="field full"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" minlength="4" placeholder="At least 4 characters" required /></div></div><div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">${signup ? 'Create account' : 'Log in'}</button></div><p class="survey-note">Prototype sign-in only. Your demo data stays in this browser.</p></form>`;
    } else if (modal.type === 'add-product') {
      title = 'Add a product'; subtitle = 'Add a product record to your store inventory.';
      body = `<form id="product-form"><div class="form-grid"><div class="field full"><label for="product-name">Product name</label><input id="product-name" name="name" placeholder="e.g. Dishwash Bar" required /></div><div class="field"><label for="product-category">Category</label><select id="product-category" name="category"><option>Household</option><option>Food & Beverages</option><option>Personal Care</option><option>Electronics</option><option>Stationery</option><option>Other</option></select></div><div class="field"><label for="product-stock">Current stock</label><input id="product-stock" name="stock" type="number" min="0" value="20" required /></div><div class="field"><label for="product-reorder">Reorder point</label><input id="product-reorder" name="reorder" type="number" min="0" value="10" required /></div><div class="field"><label for="product-cost">Unit cost (₹)</label><input id="product-cost" name="cost" type="number" min="0" value="100" required /></div></div><div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Add to inventory</button></div></form>`;
    } else if (modal.type === 'list-stock') {
      title = 'List surplus stock'; subtitle = 'Share a surplus item with other retailers in the area.';
      body = `<form id="listing-form"><div class="form-grid"><div class="field full"><label for="listing-name">Product name</label><input id="listing-name" name="name" placeholder="e.g. Dishwash Bar (Pack of 3)" required /></div><div class="field"><label for="listing-category">Category</label><select id="listing-category" name="category"><option>Household</option><option>Food & Beverages</option><option>Personal Care</option><option>Electronics</option><option>Stationery</option><option>Other</option></select></div><div class="field"><label for="listing-quantity">Quantity available</label><input id="listing-quantity" name="quantity" type="number" min="1" value="24" required /></div><div class="field"><label for="listing-price">Total asking price (₹)</label><input id="listing-price" name="price" type="number" min="1" value="600" required /></div><div class="field"><label for="listing-condition">Condition</label><select id="listing-condition" name="condition"><option>New</option><option>Sealed</option><option>Good condition</option></select></div><div class="field"><label for="listing-location">Pickup location</label><input id="listing-location" name="location" value="${escapeHtml(state.profile.location)}" required /></div><div class="field full"><label for="listing-desc">Notes for buyers</label><textarea id="listing-desc" name="desc" placeholder="Include expiry or best-before dates, packaging, and pickup details."></textarea></div></div><div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Publish listing</button></div><p class="survey-note">A listing does not complete a transaction. Confirm quality, payment, and delivery directly with the buyer.</p></form>`;
    } else if (modal.type === 'market-detail') {
      const item = marketListings().find(x => x.id === modal.id);
      if (!item) { closeModal(); return; }
      title = item.name; subtitle = `${item.category} · Listed by ${item.seller || state.profile.store}`; wide = true;
      body = `<div style="display:grid;grid-template-columns:140px 1fr;gap:18px;align-items:start"><div class="market-image" style="height:140px;border-radius:10px"><span class="market-emoji">${escapeHtml(item.emoji || '📦')}</span></div><div><div class="eyebrow">${escapeHtml(item.condition || 'New stock')}</div><p style="color:#68776e;font-size:12px;line-height:1.7">${escapeHtml(item.desc || 'Surplus stock available for a local retailer.')}</p><div class="signal-row"><span>Quantity available</span><strong>${Number(item.quantity).toLocaleString('en-IN')} units</strong></div><div class="signal-row"><span>Location</span><strong>${escapeHtml(item.location || state.profile.location)}</strong></div><div class="signal-row"><span>Total asking price</span><strong>${money(item.price)}</strong></div><div class="signal-row"><span>Price per unit</span><strong>${money(Math.round(item.price / Math.max(1, item.quantity)))}</strong></div></div></div><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Close</button><button class="btn btn-primary" data-action="request-purchase" data-id="${escapeHtml(item.id)}">Request purchase ${icon('arrow')}</button></div><p class="survey-note">This demo records a purchase request locally. It does not process payment or arrange delivery.</p>`;
    } else if (modal.type === 'listing-detail') {
      const item = state.listings.find(x => x.id === modal.id);
      if (!item) { closeModal(); return; }
      title = 'Your marketplace listing'; subtitle = 'Review or remove this item from the B2B Exchange.';
      body = `<div class="signal-row"><span>Product</span><strong>${escapeHtml(item.name)}</strong></div><div class="signal-row"><span>Quantity</span><strong>${item.quantity} units</strong></div><div class="signal-row"><span>Asking price</span><strong>${money(item.price)}</strong></div><div class="signal-row"><span>Location</span><strong>${escapeHtml(item.location)}</strong></div><div class="modal-actions"><button class="btn btn-danger" data-action="remove-listing" data-id="${item.id}">Remove listing</button><button class="btn btn-secondary" data-action="close-modal">Done</button></div>`;
    } else if (modal.type === 'product-menu') {
      const item = state.products.find(x => x.id === modal.id);
      if (!item) { closeModal(); return; }
      title = item.name; subtitle = `${item.category} · update current quantity or reorder point.`;
      body = `<form id="product-edit"><input type="hidden" name="id" value="${item.id}"><div class="form-grid"><div class="field"><label for="edit-stock">Current stock</label><input id="edit-stock" name="stock" type="number" min="0" value="${item.stock}" required></div><div class="field"><label for="edit-reorder">Reorder point</label><input id="edit-reorder" name="reorder" type="number" min="0" value="${item.reorder}" required></div></div><div class="modal-actions" style="justify-content:space-between"><button class="btn btn-danger btn-sm" type="button" data-action="delete-product" data-id="${item.id}">Delete product</button><div style="display:flex;gap:8px"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Save changes</button></div></div></form>`;
    } else if (modal.type === 'reset-confirm') {
      title = 'Reset demo data?'; subtitle = 'This restores the original StockGuard sample inventory in this browser.';
      body = `<p style="margin:0;color:#68776e;font-size:12px;line-height:1.7">Your added products, marketplace listings, purchase requests, profile edits, and saved suggestion reviews will be cleared.</p><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Keep my data</button><button class="btn btn-danger" data-action="confirm-reset">Reset demo data</button></div>`;
    } else if (modal.type === 'recommendation') {
      const rec = recommendations.find(x => x.id === modal.id);
      if (!rec) { closeModal(); return; }
      const product = state.products.find(x => x.id === rec.productId);
      title = rec.title; subtitle = 'Review this example suggestion before acting.';
      body = `<div class="insight-band" style="margin:0 0 17px"><span class="insight-badge">${icon('spark')}</span><div><strong>Why this came up</strong><p>${rec.body} The prototype uses simple rules and sample movement data to surface ideas for review.</p></div></div><div class="signal-row"><span>Product</span><strong>${escapeHtml(product?.name || rec.title)}</strong></div><div class="signal-row"><span>Current stock</span><strong>${product ? `${product.stock} units` : '—'}</strong></div><div class="signal-row"><span>Suggested action</span><strong>${rec.value}</strong></div><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Review later</button><button class="btn btn-primary" data-action="apply-recommendation" data-id="${rec.id}">${rec.action} ${icon('check')}</button></div>`;
    } else if (modal.type === 'alert-detail') {
      const item = state.products.find(p => p.id === modal.id);
      title = item ? item.name : 'Inventory alert'; subtitle = 'Review the sample alert and related product record.';
      body = `<div class="signal-row"><span>Current status</span><strong>${item ? statusFor(item) : 'Needs review'}</strong></div><div class="signal-row"><span>Current stock</span><strong>${item ? `${item.stock} units` : '—'}</strong></div><div class="signal-row"><span>Recent sales activity</span><strong>${item?.days ? `Last sale ${item.days} days ago` : 'No recent record'}</strong></div><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Close</button><button class="btn btn-primary" data-action="open-product" data-id="${modal.id}">View in inventory ${icon('arrow')}</button></div>`;
    } else if (modal.type === 'date-range') {
      title = 'Dashboard reporting period'; subtitle = 'Select a date range for the dashboard summary.';
      body = `<form id="date-form"><div class="form-grid"><div class="field"><label for="date-from">From</label><input id="date-from" type="date" value="${state.dateRange.from}" /></div><div class="field"><label for="date-to">To</label><input id="date-to" type="date" value="${state.dateRange.to}" /></div></div><div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Apply range</button></div></form>`;
    } else if (modal.type === 'help') {
      title = 'StockGuard help'; subtitle = 'A few useful things to know about this prototype.';
      body = `<div class="signal-row"><span>Add or update products</span><strong>Inventory → Add Product</strong></div><div class="signal-row"><span>Review risk flags</span><strong>Alerts → View</strong></div><div class="signal-row"><span>Explore actions</span><strong>Recommendations</strong></div><div class="signal-row"><span>Contact the team</span><strong>hello@stockguard.in</strong></div><div class="modal-actions"><button class="btn btn-primary" data-action="close-modal">Got it</button></div>`;
    }
    overlayRoot.innerHTML = `<div class="overlay" data-action="backdrop-close"><section class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-head"><div><h2 id="modal-title">${escapeHtml(title)}</h2><p>${escapeHtml(subtitle)}</p></div><button class="modal-close" aria-label="Close dialog" data-action="close-modal">×</button></header><div class="modal-body">${body}</div></section></div>`;
  }

  function toast(message) {
    let stack = $('.toast-stack');
    if (!stack) { stack = document.createElement('div'); stack.className = 'toast-stack'; document.body.appendChild(stack); }
    const item = document.createElement('div'); item.className = 'toast'; item.innerHTML = `${icon('check')}<span>${escapeHtml(message)}</span>`; stack.appendChild(item);
    setTimeout(() => { item.style.opacity = '0'; item.style.transform = 'translateY(5px)'; setTimeout(() => item.remove(), 180); }, 2900);
  }

  function exportCsv(filename, rows) {
    const csv = rows.map(row => row.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
  }

  document.addEventListener('click', event => {
    const routeLink = event.target.closest('[data-route]');
    if (routeLink) { event.preventDefault(); navigate(routeLink.dataset.route); return; }
    const scrollLink = event.target.closest('[data-scroll]');
    if (scrollLink) { event.preventDefault(); document.getElementById(scrollLink.dataset.scroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const control = event.target.closest('[data-action]');
    if (!control) return;
    const action = control.dataset.action;
    if (action === 'backdrop-close' && event.target === control) { closeModal(); return; }
    if (action === 'close-modal') { closeModal(); return; }
    if (action === 'auth') { openModal({ type: 'auth', mode: control.dataset.mode }); return; }
    if (action === 'add-product') { openModal({ type: 'add-product' }); return; }
    if (action === 'list-stock') { openModal({ type: 'list-stock' }); return; }
    if (action === 'help' || action === 'sidebar-hint') { openModal({ type: 'help' }); return; }
    if (action === 'date-range') { openModal({ type: 'date-range' }); return; }
    if (action === 'inventory-tab') { state.inventoryFilter = control.dataset.tab; render(); return; }
    if (action === 'alert-tab') { state.alertFilter = control.dataset.tab; render(); return; }
    if (action === 'recommendation-tab') { state.recommendationTab = control.dataset.tab; render(); return; }
    if (action === 'exchange-tab') { state.exchangeTab = control.dataset.tab; render(); return; }
    if (action === 'recommendation-detail') { openModal({ type: 'recommendation', id: control.dataset.id }); return; }
    if (action === 'market-detail') { openModal({ type: 'market-detail', id: control.dataset.id }); return; }
    if (action === 'listing-detail') { openModal({ type: 'listing-detail', id: control.dataset.id }); return; }
    if (action === 'view-alert') { openModal({ type: 'alert-detail', id: control.dataset.id }); return; }
    if (action === 'apply-recommendation') { const rec = recommendations.find(x => x.id === control.dataset.id); if (rec && !state.applied.includes(rec.id)) state.applied.push(rec.id); persist(); closeModal(); render(); toast(`${rec?.action || 'Suggestion'} saved for review`); return; }
    if (action === 'request-purchase') { const item = marketListings().find(x => x.id === control.dataset.id); if (item && !state.purchases.some(p => p.id === item.id)) state.purchases.unshift({ ...item }); persist(); state.exchangeTab = 'My Purchases'; closeModal(); render(); toast('Purchase request saved in My Purchases'); return; }
    if (action === 'remove-listing') { state.listings = state.listings.filter(x => x.id !== control.dataset.id); persist(); closeModal(); render(); toast('Listing removed'); return; }
    if (action === 'delete-product') { const name = state.products.find(p => p.id === control.dataset.id)?.name || 'Product'; state.products = state.products.filter(x => x.id !== control.dataset.id); persist(); closeModal(); render(); toast(`${name} removed from inventory`); return; }
    if (action === 'open-product') { const id = control.dataset.id; closeModal(); navigate('inventory'); state.inventorySearch = state.products.find(p => p.id === id)?.name || ''; render(); const input = $('#inventory-search'); if (input) input.focus(); return; }
    if (action === 'product-menu') { openModal({ type: 'product-menu', id: control.dataset.id }); return; }
    if (action === 'mark-alerts') { toast('All visible alerts marked as reviewed'); return; }
    if (action === 'recompute') { state.applied = []; persist(); render(); toast('Suggestions refreshed'); return; }
    if (action === 'export-inventory') { exportCsv('stockguard-inventory.csv', [['Product','Category','Stock','Status','Last sale (days)','Reorder point'], ...state.products.map(p => [p.name,p.category,p.stock,statusFor(p),p.days,p.reorder])]); toast('Inventory CSV downloaded'); return; }
    if (action === 'export-report') { exportCsv('stockguard-discovery-summary.csv', [['Customer discovery signal','Result'],['Survey responses','32'],['Useful alert ratings','65.7%'],['Slow-moving identification difficulty','31.3%'],['Surplus sale interest','68.8%'],['Most selected feature','Reorder recommendations · 28.1%'],['Most selected pricing model','Monthly subscription · 34.4%']]); toast('Survey summary downloaded'); return; }
    if (action === 'reset-demo') { openModal({ type: 'reset-confirm' }); return; }
    if (action === 'settings-notifications') { toast('Notification preferences are available below the profile form'); return; }
    if (action === 'settings-data') { toast('Demo data is stored only in this browser'); return; }
    if (action === 'confirm-reset') { state.products = [...productSeed]; state.listings = []; state.purchases = []; state.applied = []; state.profile = { name: 'Ramesh Kumar', store: 'Ramesh Store', email: 'ramesh.store@gmail.com', location: 'Chennai' }; persist(); closeModal(); render(); toast('Demo data restored'); return; }
  });

  document.addEventListener('input', event => {
    if (event.target.id === 'inventory-search') { state.inventorySearch = event.target.value; const panel = $('#inventory-table'); if (panel) panel.innerHTML = productTable(); const foot = $('.panel-head .muted'); if (foot) foot.textContent = `Showing ${visibleProducts().length} sample ${visibleProducts().length === 1 ? 'product' : 'products'} · demo assortment includes 124 items`; }
    if (event.target.id === 'exchange-search') { state.exchangeSearch = event.target.value; const results = $('#market-results'); const matches = renderMarketCards(); if (results) results.innerHTML = matches.length ? `<div class="exchange-grid">${matches.map(item => marketCard(item)).join('')}</div>` : `<div class="empty-state"><strong>No listings match that search</strong>Try a different product name.</div>`; }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Enter' && event.target.id === 'global-search') {
      event.preventDefault(); state.inventorySearch = event.target.value.trim(); navigate('inventory');
      const input = $('#inventory-search'); if (input) input.focus();
    }
    if (event.key === 'Escape' && state.modal) closeModal();
  });

  document.addEventListener('change', event => {
    if (event.target.id === 'exchange-category') { state.exchangeCategory = event.target.value; render(); }
    if (event.target.id === 'exchange-location') { state.exchangeLocation = event.target.value; render(); }
    if (event.target.matches('[data-setting]')) { state.settings[event.target.dataset.setting] = event.target.checked; persist(); toast('Preference updated'); }
  });

  document.addEventListener('submit', event => {
    event.preventDefault(); const form = event.target; const data = new FormData(form);
    if (form.id === 'product-form') {
      const name = String(data.get('name')).trim();
      state.products.unshift({ id: `p${Date.now()}`, name, category: String(data.get('category')), stock: Math.max(0, Number(data.get('stock'))), reorder: Math.max(0, Number(data.get('reorder'))), days: 0, emoji: '📦', cost: Math.max(0, Number(data.get('cost'))) });
      persist(); closeModal(); render(); toast(`${name} added to inventory`); return;
    }
    if (form.id === 'product-edit') {
      const item = state.products.find(p => p.id === data.get('id'));
      if (item) { item.stock = Math.max(0, Number(data.get('stock'))); item.reorder = Math.max(0, Number(data.get('reorder'))); persist(); closeModal(); render(); toast(`${item.name} updated`); }
      return;
    }
    if (form.id === 'listing-form') {
      const listing = { id: `l${Date.now()}`, name: String(data.get('name')).trim(), category: String(data.get('category')), quantity: Math.max(1, Number(data.get('quantity'))), price: Math.max(1, Number(data.get('price'))), condition: String(data.get('condition')), location: String(data.get('location')).trim(), desc: String(data.get('desc') || '').trim(), emoji: '📦', seller: state.profile.store };
      state.listings.unshift(listing); persist(); state.exchangeTab = 'My Listings'; closeModal(); render(); toast('Your surplus listing is live in this demo'); return;
    }
    if (form.id === 'profile-form') {
      state.profile = { ...state.profile, name: String(data.get('name')).trim(), store: String(data.get('store')).trim(), email: String(data.get('email')).trim(), location: String(data.get('location')).trim() };
      state.settings.riskThreshold = Math.max(7, Math.min(180, Number(data.get('threshold')) || 45)); persist(); render(); toast('Store profile saved'); return;
    }
    if (form.id === 'auth-form') {
      const email = String(data.get('email')).trim(); if (data.get('name')) state.profile.name = String(data.get('name')).trim(); if (data.get('store')) state.profile.store = String(data.get('store')).trim(); state.profile.email = email; persist(); closeModal(); navigate('dashboard'); toast('Welcome to the StockGuard demo'); return;
    }
    if (form.id === 'date-form') { state.dateRange = { from: String($('#date-from').value), to: String($('#date-to').value) }; persist(); closeModal(); render(); toast('Dashboard date range updated'); return; }
  });

  window.addEventListener('popstate', () => { state.route = location.hash.replace('#', '') || 'home'; render(); });
  window.addEventListener('hashchange', () => { state.route = location.hash.replace('#', '') || 'home'; render(); });

  // A short branded loader mirrors the requested entry/loading experience.
  if (state.route === 'home') render(); else render();
  const loader = document.createElement('div');
  loader.className = 'loading-screen';
  loader.innerHTML = `<div><div class="loading-mark">${icon('inventory')}</div><div class="loading-brand">StockGuard</div><div class="loading-line"></div></div>`;
  document.body.appendChild(loader);
  requestAnimationFrame(() => setTimeout(() => { loader.classList.add('done'); setTimeout(() => loader.remove(), 300); }, 420));
})();
