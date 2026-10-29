(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const app = $('#app');
  const overlayRoot = $('#overlay-root');
  const DAY_MS = 86400000;
  const NOW = Date.now();
  const STORAGE_KEY = 'stockguard_inventory_data';
  const STORAGE_VERSION = 2;

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
  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const money = value => `₹ ${Number(value || 0).toLocaleString('en-IN')}`;

  function formatDateTime(dateInput) {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ', ' +
      d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  function formatDate(dateInput) {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // 50 realistic, distinct retail products across 5 categories
  const productSeed = [
    // Household (10)
    { id: 'p1', name: 'Detergent Powder (1 kg)', category: 'Household', stock: 48, reorder: 24, cost: 115, emoji: '🧺', createdAt: NOW - 120 * DAY_MS },
    { id: 'p2', name: 'Dishwash Liquid (500 ml)', category: 'Household', stock: 35, reorder: 15, cost: 85, emoji: '🧽', createdAt: NOW - 90 * DAY_MS },
    { id: 'p3', name: 'Floor Cleaner Citrus (1 L)', category: 'Household', stock: 22, reorder: 12, cost: 140, emoji: '🧹', createdAt: NOW - 80 * DAY_MS },
    { id: 'p4', name: 'Garbage Bags Medium (Pack of 30)', category: 'Household', stock: 8, reorder: 15, cost: 75, emoji: '🗑️', createdAt: NOW - 60 * DAY_MS },
    { id: 'p5', name: 'Microfiber Cleaning Cloth (Pack of 4)', category: 'Household', stock: 0, reorder: 10, cost: 120, emoji: '🧼', createdAt: NOW - 70 * DAY_MS },
    { id: 'p6', name: 'Air Freshener Lavender (250 ml)', category: 'Household', stock: 40, reorder: 15, cost: 110, emoji: '🌸', createdAt: NOW - 100 * DAY_MS },
    { id: 'p7', name: 'Laundry Soap Bar (Pack of 3)', category: 'Household', stock: 55, reorder: 20, cost: 45, emoji: '🧼', createdAt: NOW - 85 * DAY_MS },
    { id: 'p8', name: 'Stainless Steel Scrubber (Pack of 6)', category: 'Household', stock: 6, reorder: 12, cost: 50, emoji: '🧽', createdAt: NOW - 75 * DAY_MS },
    { id: 'p9', name: 'Cotton Floor Mop Refill', category: 'Household', stock: 18, reorder: 8, cost: 130, emoji: '🧹', createdAt: NOW - 65 * DAY_MS },
    { id: 'p10', name: 'Food Storage Containers (Set of 3)', category: 'Household', stock: 28, reorder: 10, cost: 220, emoji: '🍱', createdAt: NOW - 70 * DAY_MS },

    // Personal Care (10)
    { id: 'p11', name: 'Face Cream (50 g)', category: 'Personal Care', stock: 5, reorder: 12, cost: 180, emoji: '🧴', createdAt: NOW - 110 * DAY_MS },
    { id: 'p12', name: 'Herbal Shampoo (340 ml)', category: 'Personal Care', stock: 42, reorder: 18, cost: 210, emoji: '🧴', createdAt: NOW - 95 * DAY_MS },
    { id: 'p13', name: 'Bath Soap (Pack of 4)', category: 'Personal Care', stock: 64, reorder: 25, cost: 145, emoji: '🧼', createdAt: NOW - 90 * DAY_MS },
    { id: 'p14', name: 'Toothpaste Total Care (150 g)', category: 'Personal Care', stock: 11, reorder: 20, cost: 95, emoji: '🪥', createdAt: NOW - 60 * DAY_MS },
    { id: 'p15', name: 'Hand Sanitizer Gel (500 ml)', category: 'Personal Care', stock: 50, reorder: 15, cost: 125, emoji: '🧴', createdAt: NOW - 120 * DAY_MS },
    { id: 'p16', name: 'Moisturizing Body Lotion (200 ml)', category: 'Personal Care', stock: 26, reorder: 10, cost: 195, emoji: '🧴', createdAt: NOW - 80 * DAY_MS },
    { id: 'p17', name: 'Sunscreen Lotion SPF 50 (100 ml)', category: 'Personal Care', stock: 0, reorder: 8, cost: 280, emoji: '☀️', createdAt: NOW - 60 * DAY_MS },
    { id: 'p18', name: 'Ayurvedic Hair Oil (200 ml)', category: 'Personal Care', stock: 38, reorder: 15, cost: 160, emoji: '🧴', createdAt: NOW - 85 * DAY_MS },
    { id: 'p19', name: 'Shaving Gel Sensitive (200 ml)', category: 'Personal Care', stock: 4, reorder: 10, cost: 150, emoji: '🪒', createdAt: NOW - 70 * DAY_MS },
    { id: 'p20', name: 'Refreshing Wet Wipes (Pack of 80)', category: 'Personal Care', stock: 30, reorder: 12, cost: 85, emoji: '🧻', createdAt: NOW - 20 * DAY_MS },

    // Electronics (10)
    { id: 'p21', name: 'LED Bulb (9W)', category: 'Electronics', stock: 0, reorder: 15, cost: 95, emoji: '💡', createdAt: NOW - 150 * DAY_MS },
    { id: 'p22', name: 'USB-C Fast Charging Cable (1 m)', category: 'Electronics', stock: 32, reorder: 12, cost: 149, emoji: '🔌', createdAt: NOW - 70 * DAY_MS },
    { id: 'p23', name: 'AAA Alkaline Batteries (Pack of 4)', category: 'Electronics', stock: 7, reorder: 16, cost: 110, emoji: '🔋', createdAt: NOW - 65 * DAY_MS },
    { id: 'p24', name: 'Extension Board 4-Way (2 m)', category: 'Electronics', stock: 18, reorder: 8, cost: 340, emoji: '🔌', createdAt: NOW - 80 * DAY_MS },
    { id: 'p25', name: 'Wireless Optical Mouse', category: 'Electronics', stock: 15, reorder: 6, cost: 399, emoji: '🖱️', createdAt: NOW - 75 * DAY_MS },
    { id: 'p26', name: 'Power Bank 10000 mAh', category: 'Electronics', stock: 3, reorder: 6, cost: 799, emoji: '🔋', createdAt: NOW - 50 * DAY_MS },
    { id: 'p27', name: 'In-Ear Wired Earphones (3.5 mm)', category: 'Electronics', stock: 25, reorder: 10, cost: 199, emoji: '🎧', createdAt: NOW - 110 * DAY_MS },
    { id: 'p28', name: 'High Speed HDMI Cable (2 m)', category: 'Electronics', stock: 20, reorder: 8, cost: 180, emoji: '📺', createdAt: NOW - 60 * DAY_MS },
    { id: 'p29', name: 'Surge Protector Socket', category: 'Electronics', stock: 0, reorder: 5, cost: 450, emoji: '⚡', createdAt: NOW - 80 * DAY_MS },
    { id: 'p30', name: 'Smart Wi-Fi Plug (10A)', category: 'Electronics', stock: 14, reorder: 5, cost: 599, emoji: '🔌', createdAt: NOW - 75 * DAY_MS },

    // Stationery (10)
    { id: 'p31', name: 'Notebook (Single)', category: 'Stationery', stock: 120, reorder: 30, cost: 35, emoji: '📓', createdAt: NOW - 100 * DAY_MS },
    { id: 'p32', name: 'Ballpoint Pens Blue (Pack of 10)', category: 'Stationery', stock: 85, reorder: 25, cost: 60, emoji: '🖊️', createdAt: NOW - 90 * DAY_MS },
    { id: 'p33', name: 'Sticky Notes Neon (3x3 inch)', category: 'Stationery', stock: 9, reorder: 18, cost: 40, emoji: '📝', createdAt: NOW - 60 * DAY_MS },
    { id: 'p34', name: 'Permanent Marker Black (Pack of 2)', category: 'Stationery', stock: 44, reorder: 15, cost: 45, emoji: '🖊️', createdAt: NOW - 75 * DAY_MS },
    { id: 'p35', name: 'White Synthetic Craft Glue (100 ml)', category: 'Stationery', stock: 5, reorder: 12, cost: 30, emoji: '🧴', createdAt: NOW - 70 * DAY_MS },
    { id: 'p36', name: 'A4 Copy Paper Ream (500 Sheets)', category: 'Stationery', stock: 24, reorder: 10, cost: 240, emoji: '📄', createdAt: NOW - 65 * DAY_MS },
    { id: 'p37', name: 'Pastel Highlighter Set (4 Colors)', category: 'Stationery', stock: 35, reorder: 12, cost: 95, emoji: '🖍️', createdAt: NOW - 105 * DAY_MS },
    { id: 'p38', name: 'Desktop Stapler & Pins Set', category: 'Stationery', stock: 16, reorder: 8, cost: 110, emoji: '📎', createdAt: NOW - 60 * DAY_MS },
    { id: 'p39', name: 'Stainless Steel Craft Scissors (6 inch)', category: 'Stationery', stock: 0, reorder: 6, cost: 65, emoji: '✂️', createdAt: NOW - 80 * DAY_MS },
    { id: 'p40', name: 'Metal Mesh Desk Pen Organizer', category: 'Stationery', stock: 22, reorder: 8, cost: 135, emoji: '📁', createdAt: NOW - 30 * DAY_MS },

    // Food & Beverages (10)
    { id: 'p41', name: 'Chocolate Pack', category: 'Food & Beverages', stock: 30, reorder: 18, cost: 55, emoji: '🍫', createdAt: NOW - 90 * DAY_MS },
    { id: 'p42', name: 'Pure Green Tea (25 Tea Bags)', category: 'Food & Beverages', stock: 28, reorder: 12, cost: 120, emoji: '🍵', createdAt: NOW - 60 * DAY_MS },
    { id: 'p43', name: 'Classic Instant Coffee Jar (100 g)', category: 'Food & Beverages', stock: 6, reorder: 14, cost: 175, emoji: '☕', createdAt: NOW - 50 * DAY_MS },
    { id: 'p44', name: 'Roasted Salted Almonds (200 g)', category: 'Food & Beverages', stock: 18, reorder: 8, cost: 210, emoji: '🥜', createdAt: NOW - 60 * DAY_MS },
    { id: 'p45', name: 'Mixed Fruit Juice (1 L)', category: 'Food & Beverages', stock: 8, reorder: 15, cost: 90, emoji: '🧃', createdAt: NOW - 40 * DAY_MS },
    { id: 'p46', name: 'Whole Rolled Oats (500 g)', category: 'Food & Beverages', stock: 36, reorder: 15, cost: 85, emoji: '🌾', createdAt: NOW - 70 * DAY_MS },
    { id: 'p47', name: 'Artisan Dark Chocolate Bar (80 g)', category: 'Food & Beverages', stock: 25, reorder: 10, cost: 80, emoji: '🍫', createdAt: NOW - 115 * DAY_MS },
    { id: 'p48', name: 'Digestive Wheat Biscuits (Pack of 2)', category: 'Food & Beverages', stock: 50, reorder: 20, cost: 40, emoji: '🍪', createdAt: NOW - 75 * DAY_MS },
    { id: 'p49', name: 'Pure Organic Honey (250 g)', category: 'Food & Beverages', stock: 2, reorder: 8, cost: 165, emoji: '🍯', createdAt: NOW - 80 * DAY_MS },
    { id: 'p50', name: 'Sparkling Mineral Water (500 ml)', category: 'Food & Beverages', stock: 40, reorder: 15, cost: 45, emoji: '🥤', createdAt: NOW - 130 * DAY_MS }
  ];

  // Seeded sales ages in days (items without an entry, like p10, p20, p30, p40, have never been sold)
  const initialSaleAges = {
    p1: 60, p2: 3, p3: 1, p4: 2, p5: 14, p6: 75, p7: 4, p8: 5, p9: 12,
    p11: 10, p12: 2, p13: 0, p14: 1, p15: 80, p16: 5, p17: 20, p18: 6, p19: 8,
    p21: 90, p22: 0, p23: 3, p24: 7, p25: 4, p26: 9, p27: 65, p28: 15, p29: 40,
    p31: 2, p32: 0, p33: 4, p34: 6, p35: 11, p36: 1, p37: 70, p38: 14, p39: 35,
    p41: 65, p42: 3, p43: 2, p44: 1, p45: 0, p46: 4, p47: 85, p48: 2, p49: 7, p50: 95
  };

  const seedSales = [];
  const seedMovements = [];
  productSeed.forEach(p => {
    const intakeTime = p.createdAt || (NOW - 90 * DAY_MS);
    seedMovements.push({
      id: `m_seed_in_${p.id}`,
      productId: p.id,
      productName: p.name,
      type: 'restock',
      quantity: p.stock + (initialSaleAges[p.id] !== undefined ? (p.id === 'p1' ? 4 : 2) : 0),
      balance: p.stock + (initialSaleAges[p.id] !== undefined ? (p.id === 'p1' ? 4 : 2) : 0),
      timestamp: intakeTime,
      dateStr: formatDateTime(intakeTime),
      note: 'Initial store intake'
    });

    if (initialSaleAges[p.id] !== undefined) {
      const days = initialSaleAges[p.id];
      const saleTime = days === 0 ? (NOW - 2 * 3600000) : (NOW - days * DAY_MS);
      const saleQty = p.id === 'p1' ? 4 : 2;
      seedSales.push({
        id: `s_seed_${p.id}`,
        productId: p.id,
        productName: p.name,
        quantity: saleQty,
        timestamp: saleTime,
        dateStr: formatDateTime(saleTime),
        unitCost: p.cost
      });
      seedMovements.push({
        id: `m_seed_sale_${p.id}`,
        productId: p.id,
        productName: p.name,
        type: 'sale',
        quantity: -saleQty,
        balance: p.stock,
        timestamp: saleTime,
        dateStr: formatDateTime(saleTime),
        note: 'Customer purchase'
      });
    }
  });

  const marketSeed = [
    { id: 'm1', name: 'Bath Soap (Pack of 4)', category: 'Personal Care', quantity: 100, price: 400, location: 'Chennai', emoji: '🧼', seller: 'Green Basket Stores', condition: 'Sealed', desc: 'New, sealed packs. Best before 2027.' },
    { id: 'm2', name: 'Fruit Juice (200 ml)', category: 'Food & Beverages', quantity: 50, price: 600, location: 'Vellore', emoji: '🧃', seller: 'Fresh Corner Market', condition: 'Sealed', desc: 'Surplus beverage stock stored in a cool, dry place.' },
    { id: 'm3', name: 'Notebook (Single)', category: 'Stationery', quantity: 200, price: 900, location: 'Chennai', emoji: '📓', seller: 'Paper & Pen Co.', condition: 'New', desc: 'Unopened 180-page notebooks, mixed cover colours.' },
    { id: 'm4', name: 'LED Bulb (9W)', category: 'Electronics', quantity: 30, price: 900, location: 'Kanchipuram', emoji: '💡', seller: 'Bright Home Electricals', condition: 'New', desc: 'Tested, boxed bulbs with manufacturer warranty.' },
  ];

  const loadSaved = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === STORAGE_VERSION && Array.isArray(parsed.products) && parsed.products.length >= 40) {
          return parsed;
        }
      }
    } catch { /* Private browsing can disable storage. */ }
    return null;
  };

  const saved = loadSaved();
  const state = {
    route: location.hash.replace('#', '') || 'home',
    products: saved && Array.isArray(saved.products) ? saved.products : JSON.parse(JSON.stringify(productSeed)),
    sales: saved && Array.isArray(saved.sales) ? saved.sales : JSON.parse(JSON.stringify(seedSales)),
    movements: saved && Array.isArray(saved.movements) ? saved.movements : JSON.parse(JSON.stringify(seedMovements)),
    listings: saved && Array.isArray(saved.listings) ? saved.listings : [],
    purchases: saved && Array.isArray(saved.purchases) ? saved.purchases : [],
    profile: saved?.profile || { name: 'Ramesh Kumar', store: 'Ramesh Store', email: 'ramesh.store@gmail.com', location: 'Chennai' },
    settings: saved?.settings || { emailAlerts: true, weeklySummary: true, reorderAlerts: true, riskThreshold: 60 },
    inventoryFilter: 'All Products',
    inventoryCategory: 'All Categories',
    alertFilter: 'All',
    recommendationTab: 'Reorder Suggestions',
    exchangeTab: 'Browse Products',
    exchangeCategory: 'All Categories',
    exchangeLocation: 'All Locations',
    dateRange: saved?.dateRange || { from: '2026-08-01', to: '2026-08-31' },
    inventorySearch: '',
    exchangeSearch: '',
    modal: null,
    toastTimer: null,
    applied: saved && Array.isArray(saved.applied) ? saved.applied : [],
  };

  const persist = () => {
    try {
      const payload = {
        version: STORAGE_VERSION,
        products: state.products,
        sales: state.sales,
        movements: state.movements,
        listings: state.listings,
        purchases: state.purchases,
        profile: state.profile,
        settings: state.settings,
        applied: state.applied,
        dateRange: state.dateRange
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch { /* Storage unavailable */ }
  };

  // If this is initial run or upgrade, persist immediately
  if (!saved) persist();

  function getProductSales(productId) {
    return (state.sales || []).filter(s => s.productId === productId);
  }

  function getLatestSale(productId) {
    const sales = getProductSales(productId);
    if (!sales.length) return null;
    return sales.reduce((latest, s) => (s.timestamp > latest.timestamp ? s : latest), sales[0]);
  }

  function getLastSoldDays(productId) {
    const latest = getLatestSale(productId);
    if (!latest) return null;
    const diffMs = Date.now() - Number(latest.timestamp);
    return Math.max(0, Math.floor(diffMs / DAY_MS));
  }

  function formatLastSold(product) {
    const latest = getLatestSale(product.id);
    if (!latest) return 'Never sold';
    const days = getLastSoldDays(product.id);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  }

  // Centralized stock status logic with strict priority:
  // Out of Stock -> Low Stock -> Slow-Moving -> In Stock
  function statusFor(product) {
    const threshold = Number(state.settings?.riskThreshold) || 60;
    if (product.stock <= 0) return 'Out of Stock';
    if (product.stock <= product.reorder) return 'Low Stock';

    const days = getLastSoldDays(product.id);
    if (days !== null) {
      if (days >= threshold) return 'Slow-Moving';
    } else {
      // Products with no sales history
      const ageDays = product.createdAt ? Math.floor((Date.now() - product.createdAt) / DAY_MS) : 65;
      if (ageDays >= threshold) return 'Slow-Moving';
    }
    return 'In Stock';
  }

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

  function getDonutGradient(inStock, lowStock, slowMoving, outOfStock, total) {
    if (!total) return 'conic-gradient(#50a879 0% 100%)';
    const pIn = ((inStock / total) * 100).toFixed(1);
    const pLow = (((inStock + lowStock) / total) * 100).toFixed(1);
    const pSlow = (((inStock + lowStock + slowMoving) / total) * 100).toFixed(1);
    return `conic-gradient(#50a879 0% ${pIn}%, #e1b44c ${pIn}% ${pLow}%, #5a83d1 ${pLow}% ${pSlow}%, #dd6558 ${pSlow}% 100%)`;
  }

  function getAlerts() {
    const alerts = [];
    state.products.forEach(p => {
      const status = statusFor(p);
      const days = getLastSoldDays(p.id);
      const lastSoldStr = formatLastSold(p);

      if (status === 'Out of Stock') {
        alerts.push({
          id: `alt-out-${p.id}`,
          productId: p.id,
          name: p.name,
          type: 'Out of Stock',
          message: `Stock is 0 units (reorder point: ${p.reorder} units).`,
          date: 'Needs replenishment',
          priority: 1
        });
      } else if (status === 'Low Stock') {
        alerts.push({
          id: `alt-low-${p.id}`,
          productId: p.id,
          name: p.name,
          type: 'Low Stock',
          message: `Only ${p.stock} units left (below reorder point of ${p.reorder}).`,
          date: days !== null ? lastSoldStr : 'Needs replenishment',
          priority: 2
        });
      } else if (status === 'Slow-Moving') {
        const isDead = days !== null && days >= 90;
        alerts.push({
          id: `alt-slow-${p.id}`,
          productId: p.id,
          name: p.name,
          type: isDead ? 'Potential Dead Stock' : 'Slow-Moving',
          message: days !== null ? `No recorded sales for ${days} days (${p.stock} units in stock).` : `No recorded sales since intake (${p.stock} units on hand).`,
          date: lastSoldStr,
          priority: isDead ? 3 : 4
        });
      }
    });
    return alerts.sort((a, b) => a.priority - b.priority);
  }

  function getRecommendations() {
    const list = [];

    // 1. Reorder Suggestions (Urgent out-of-stock first, then low-stock)
    state.products
      .filter(p => p.stock <= 0)
      .forEach(p => {
        const suggestedQty = Math.max(20, (p.reorder || 10) * 2);
        list.push({
          id: `rec-out-${p.id}`,
          productId: p.id,
          type: 'reorder',
          title: `Restock – ${p.name}`,
          body: `${p.name} is out of stock. Review recent demand and decide whether to replenish.`,
          label: 'Suggested Restock',
          value: `${suggestedQty} units`,
          action: 'Plan replenishment order',
          priority: 1
        });
      });

    state.products
      .filter(p => p.stock > 0 && p.stock <= p.reorder)
      .forEach(p => {
        const suggestedQty = Math.max(p.reorder, (p.reorder * 2) - p.stock);
        list.push({
          id: `rec-low-${p.id}`,
          productId: p.id,
          type: 'reorder',
          title: `Reorder – ${p.name}`,
          body: `${p.name} has ${p.stock} units remaining, below its reorder point of ${p.reorder}. Consider replenishing stock.`,
          label: 'Suggested Quantity',
          value: `${suggestedQty} units`,
          action: 'Mark reorder planned',
          priority: 2
        });
      });

    // 2. Discount & Clearance Suggestions
    state.products
      .filter(p => {
        const days = getLastSoldDays(p.id);
        return p.stock > 0 && (days !== null && days >= 90);
      })
      .forEach(p => {
        const days = getLastSoldDays(p.id);
        list.push({
          id: `rec-dead-${p.id}`,
          productId: p.id,
          type: 'discount',
          title: `Clearance – ${p.name}`,
          body: `This product has had no recorded sales for ${days} days. Review discounting, returns, or surplus-stock options.`,
          label: 'Estimated exposure',
          value: money((p.cost || 50) * p.stock),
          action: 'Plan clearance review',
          priority: 3
        });
      });

    state.products
      .filter(p => {
        const days = getLastSoldDays(p.id);
        if (p.stock <= p.reorder) return false;
        if (days !== null) return days >= 60 && days < 90;
        const ageDays = p.createdAt ? Math.floor((NOW - p.createdAt) / DAY_MS) : 65;
        return ageDays >= 60;
      })
      .forEach(p => {
        const days = getLastSoldDays(p.id);
        const daysText = days !== null ? `for ${days} days` : 'since added';
        list.push({
          id: `rec-slow-${p.id}`,
          productId: p.id,
          type: 'discount',
          title: `Discount – ${p.name}`,
          body: `${p.name} has had no recorded sales ${daysText}. Review demand before reordering.`,
          label: 'Suggested Markdown',
          value: '10% – 15%',
          action: 'Plan 15% discount',
          priority: 4
        });
      });

    // Excess Stock items (stock > 3 * reorder point, where stock >= 30)
    state.products
      .filter(p => p.stock > 3 * p.reorder && p.stock >= 30)
      .forEach(p => {
        list.push({
          id: `rec-excess-${p.id}`,
          productId: p.id,
          type: 'discount',
          title: `Surplus – ${p.name}`,
          body: `${p.name} inventory is high relative to recent sales. Review future purchasing requirements.`,
          label: 'Excess Units',
          value: `${p.stock - p.reorder * 2} surplus units`,
          action: 'Review surplus stock',
          priority: 5
        });
      });

    // 3. Bundle Suggestions
    const categories = ['Household', 'Personal Care', 'Electronics', 'Stationery', 'Food & Beverages'];
    categories.forEach(cat => {
      const catProducts = state.products.filter(p => p.category === cat && p.stock > 0);
      if (catProducts.length >= 2) {
        const p1 = catProducts[0];
        const p2 = catProducts[1];
        list.push({
          id: `rec-bundle-${cat.toLowerCase().replace(/[^a-z]/g, '')}`,
          type: 'bundle',
          productId: p1.id,
          title: `Bundle – ${p1.name} + ${p2.name}`,
          body: `Often purchased together. Create a promotional combo offer to improve inventory turnover.`,
          label: 'Bundle concept',
          value: `${cat} essentials`,
          action: 'Save bundle idea',
          priority: 6
        });
      }
    });

    return list.sort((a, b) => a.priority - b.priority);
  }

  function getDashboardInsight() {
    const outOfStock = state.products.find(p => p.stock <= 0);
    if (outOfStock) {
      return {
        title: 'Urgent stockout replenishment',
        body: `${outOfStock.name} is out of stock. Review recent demand and decide whether to replenish.`,
        btnText: 'View reorder suggestions'
      };
    }
    const lowStock = state.products.find(p => p.stock > 0 && p.stock <= p.reorder);
    if (lowStock) {
      return {
        title: 'Low stock replenishment priority',
        body: `${lowStock.name} has only ${lowStock.stock} units remaining, below its reorder point of ${lowStock.reorder}. Consider replenishing stock.`,
        btnText: 'View reorder suggestions'
      };
    }
    const slowItem = state.products.find(p => statusFor(p) === 'Slow-Moving');
    if (slowItem) {
      const days = getLastSoldDays(slowItem.id);
      const daysStr = days !== null ? `for ${days} days` : 'since intake';
      return {
        title: 'Slow-moving stock review',
        body: `${slowItem.name} has had no recorded sales ${daysStr}. Review demand before reordering.`,
        btnText: 'View suggestions'
      };
    }
    return {
      title: 'Healthy inventory velocity',
      body: `Your current stock is above the reorder point and recent sales activity is healthy across all tracked items.`,
      btnText: 'View suggestions'
    };
  }

  function render() {
    if (state.route === 'home') app.innerHTML = renderLanding();
    else app.innerHTML = renderWorkspace();
    renderModal();
  }

  function renderLanding() {
    return `<main class="landing">
      <header class="landing-nav">${brand()}<nav class="landing-links" aria-label="Main navigation"><a href="#features" data-scroll="features">Features</a><a href="#how-it-works" data-scroll="how-it-works">How it works</a><a href="#about" data-scroll="about">About</a><a href="mailto:hello@stockguard.in">Contact</a></nav><div class="landing-actions"><button class="btn btn-secondary btn-sm" data-action="auth" data-mode="login">Log in</button><button class="btn btn-primary btn-sm" data-action="auth" data-mode="signup">Sign up</button></div></header>
      <section class="hero"><div class="hero-copy"><span class="eyebrow">Inventory clarity, from shelf to sale</span><h1>Smarter inventory<br />for a <span>stronger business.</span></h1><p>Spot slow-moving stock early, protect cash flow with clearer decisions, and connect with other retailers when surplus inventory needs a new home.</p><div class="hero-actions"><button class="btn btn-primary" data-route="dashboard">Get started ${icon('arrow')}</button><a class="btn btn-secondary" href="#how-it-works" data-scroll="how-it-works">See how it works</a></div><div class="hero-note">${icon('shield')} Built for independent retailers. Clear recommendations, with the reason behind each one.</div><div class="hero-proof"><span class="avatar-stack"><i>RK</i><i>AS</i><i>MP</i><i>+</i></span><span>Designed around everyday retail inventory decisions</span></div></div>
        <div class="hero-art" aria-label="Illustration of organized retail inventory and an early low-stock alert"><div class="art-halo"></div><div class="shelf"></div><i class="box b1"></i><i class="box b2"></i><i class="box b3"></i><i class="box b4"></i><i class="box b5"></i><i class="box b6"></i><i class="box b7"></i><div class="leaf-pot"></div><div class="art-floor"></div><div class="stock-card"><div class="stock-card-top"><span class="alert-dot">${icon('alerts')}</span><span>Low stock watch</span></div><div class="muted small" style="margin:9px 0 0">Face Cream · only 5 left</div><div class="mini-bars"><i></i><i></i><i></i><i></i><i></i></div><div class="small" style="margin-top:9px;color:#3c815d;font-weight:700">Suggested reorder · 12 units</div></div></div></section>
      <div class="feature-strip" id="features"><div class="feature-item"><span class="feature-icon">${icon('inventory')}</span><div><strong>Track inventory simply</strong><small>See stock and movement together</small></div></div><div class="feature-item"><span class="feature-icon">${icon('alerts')}</span><div><strong>Get early alerts</strong><small>Act before slow stock becomes dead stock</small></div></div><div class="feature-item"><span class="feature-icon">${icon('recommendations')}</span><div><strong>Make informed decisions</strong><small>Reorder, discount, or bundle with context</small></div></div><div class="feature-item"><span class="feature-icon">${icon('exchange')}</span><div><strong>Trade surplus stock</strong><small>Find a business buyer on the exchange</small></div></div></div>
      <section class="landing-section" id="how-it-works"><div class="section-heading"><span class="eyebrow">How StockGuard works</span><h2>One clear next step at a time.</h2><p>StockGuard brings your inventory into view, highlights where attention may help, then gives you practical options to consider.</p></div><div class="steps-grid"><article class="step-card"><span class="step-num">01</span><h3>Know what you have</h3><p>Keep product quantities, categories, and recent sales activity together in a simple inventory view.</p></article><article class="step-card"><span class="step-num">02</span><h3>Spot risk sooner</h3><p>See low-stock and slow-moving items with straightforward signals you can review and adjust.</p></article><article class="step-card"><span class="step-num">03</span><h3>Choose an action</h3><p>Review a reorder, plan a markdown or bundle, or offer suitable surplus stock to other retailers.</p></article></div></section>
      <section class="landing-cta" id="about"><div><h2>Inventory decisions, made easier.</h2><p>Explore the StockGuard retailer workspace with your store inventory.</p></div><button class="btn btn-primary" data-route="dashboard">Open the workspace ${icon('arrow')}</button></section>
      <footer class="landing-footer"><div class="footer-inner"><span>${brand()}</span><span>StockGuard · Smart dead-stock prevention and inventory optimization</span><span>StockGuard Workspace · Active Inventory Management</span></div></footer>
    </main>`;
  }

  function renderWorkspace() {
    const title = routeTitles[state.route] || routeTitles.dashboard;
    const allAlerts = getAlerts();
    return `<main class="workspace"><header class="topbar">${brand()}<button class="btn-icon" aria-label="Toggle navigation" data-action="sidebar-hint">${icon('menu')}</button><label class="global-search">${icon('search')}<input id="global-search" type="search" placeholder="Search products, categories..." aria-label="Search products" /></label><span class="topbar-spacer"></span><button class="topbar-icon" aria-label="View alerts" data-route="alerts">${icon('alerts')}${allAlerts.length ? '<i class="notification-dot"></i>' : ''}</button><button class="topbar-icon" aria-label="Help" data-action="help">${icon('help')}</button><div class="profile"><span class="profile-avatar">${icon('user')}</span><div class="profile-meta"><div class="profile-name">${escapeHtml(state.profile.store)}</div><div class="profile-email">${escapeHtml(state.profile.email)}</div></div></div></header>
      <div class="app-layout"><aside class="sidebar"><div class="nav-label">Workspace</div><nav class="nav-list" aria-label="Retail workspace">${mainNav.map(([route,label]) => `<a href="#${route}" class="nav-link ${state.route === route ? 'active' : ''}" data-route="${route}" title="${label}">${icon(route)}<span>${label}</span>${route === 'alerts' && allAlerts.length ? `<i class="nav-count">${allAlerts.length}</i>` : ''}</a>`).join('')}</nav><div class="sidebar-bottom"><div class="help-card"><strong>Need a hand?</strong><p>Get help setting up your inventory or understanding an alert.</p><button data-action="help">Visit help center →</button></div></div></aside><section class="main-content" aria-label="${title}">${renderRoute()}</section></div></main>`;
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
    const totalCount = state.products.length;
    const inCount = state.products.filter(p => statusFor(p) === 'In Stock').length;
    const lowCount = state.products.filter(p => statusFor(p) === 'Low Stock').length;
    const slowCount = state.products.filter(p => statusFor(p) === 'Slow-Moving').length;
    const outCount = state.products.filter(p => statusFor(p) === 'Out of Stock').length;

    const potentialLoss = state.products
      .filter(p => statusFor(p) === 'Slow-Moving')
      .reduce((acc, p) => acc + (p.cost || 50) * p.stock, 0);

    const from = new Date(`${state.dateRange.from}T00:00:00`);
    const to = new Date(`${state.dateRange.to}T00:00:00`);
    const alerts = getAlerts().slice(0, 4);
    const insight = getDashboardInsight();

    return `${pageHeading('Dashboard', 'A clear view of your inventory and the stock that may need attention.', '<button class="date-control" data-action="date-range">' + icon('calendar') + ` ${formatDate(from)} – ${formatDate(to)} ` + icon('chevron') + '</button>')}
      <div class="metric-grid">
        ${metricCard('inventory','green','Total Products', totalCount, 'Across your tracked assortment')}
        ${metricCard('alerts','red','Low Stock', lowCount, 'Products below reorder point')}
        ${metricCard('clock','amber','Slow-Moving', slowCount, 'No recent sales activity')}
        ${metricCard('shield','purple','Potential Loss', money(potentialLoss), 'Estimated value at risk')}
      </div>
      <div class="dashboard-grid">
        <article class="panel chart-panel">
          <div class="panel-head">
            <div><h2 class="panel-title">Inventory Status</h2><p class="panel-subtitle">Stock health across your product range</p></div>
            <button class="btn-icon" aria-label="Inventory details" data-route="inventory">${icon('arrow')}</button>
          </div>
          <div class="chart-body">
            <div class="donut" style="background: ${getDonutGradient(inCount, lowCount, slowCount, outCount, totalCount)}">
              <div class="donut-center">
                <strong>${totalCount}</strong>
                <span>Total products</span>
              </div>
            </div>
            <div class="legend">
              <div class="legend-row"><i class="legend-dot green"></i><span>In Stock</span><strong>${inCount}</strong></div>
              <div class="legend-row"><i class="legend-dot amber"></i><span>Low Stock</span><strong>${lowCount}</strong></div>
              <div class="legend-row"><i class="legend-dot blue"></i><span>Slow-Moving</span><strong>${slowCount}</strong></div>
              <div class="legend-row"><i class="legend-dot red"></i><span>Out of Stock</span><strong>${outCount}</strong></div>
            </div>
          </div>
        </article>
        <article class="panel">
          <div class="panel-head">
            <div><h2 class="panel-title">Recent Alerts</h2><p class="panel-subtitle">A few items worth a closer look</p></div>
            <button class="text-link" data-route="alerts">View all</button>
          </div>
          <div class="alert-list">
            ${alerts.length ? alerts.map(alertRow).join('') : '<div class="empty-state">No active inventory alerts</div>'}
          </div>
        </article>
      </div>
      <div class="insight-band">
        <span class="insight-badge">${icon('spark')}</span>
        <div>
          <strong>${insight.title}</strong>
          <p>${insight.body}</p>
        </div>
        <button class="btn btn-secondary btn-sm" data-route="recommendations">${insight.btnText} ${icon('arrow')}</button>
      </div>`;
  }

  function alertRow(item) {
    return `<div class="alert-row"><span class="alert-symbol ${item.type === 'Slow-Moving' ? 'slow' : item.type === 'Low Stock' ? 'low' : 'dead'}">${icon(item.type === 'Slow-Moving' ? 'clock' : item.type === 'Low Stock' ? 'alerts' : 'shield')}</span><div><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.message)}</p></div><time>${escapeHtml(item.date)}</time></div>`;
  }

  function visibleProducts() {
    const q = state.inventorySearch.toLowerCase().trim();
    const selectedCat = state.inventoryCategory || 'All Categories';
    return state.products.filter(p => {
      const status = statusFor(p);
      const matchesTab = state.inventoryFilter === 'All Products' || status === state.inventoryFilter;
      const matchesCategory = selectedCat === 'All Categories' || p.category === selectedCat;
      const matchesSearch = !q || `${p.name} ${p.category} ${p.id}`.toLowerCase().includes(q);
      return matchesTab && matchesCategory && matchesSearch;
    });
  }

  function productTable(products = visibleProducts()) {
    if (!products.length) return `<div class="empty-state"><strong>No products found</strong>Try another category, filter, or add an item to your inventory.</div>`;
    return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Product</th><th>Category</th><th>Current Stock</th><th>Status</th><th>Last Sold</th><th>Actions</th></tr></thead><tbody>${products.map(p => {
      const status = statusFor(p);
      return `<tr><td><div class="product-cell"><span class="product-thumb">${escapeHtml(p.emoji || '📦')}</span><div><div class="product-name">${escapeHtml(p.name)}</div><div class="product-category">SKU ${escapeHtml(p.id.toUpperCase())}</div></div></div></td><td>${escapeHtml(p.category)}</td><td><strong>${Number(p.stock).toLocaleString('en-IN')}</strong></td><td><span class="status ${statusClass(status)}">${status}</span></td><td>${formatLastSold(p)}</td><td><button class="row-actions" aria-label="Actions for ${escapeHtml(p.name)}" data-action="product-menu" data-id="${escapeHtml(p.id)}">···</button></td></tr>`;
    }).join('')}</tbody></table></div>`;
  }

  function renderInventory() {
    const tabs = ['All Products', 'Low Stock', 'Slow-Moving', 'Out of Stock'];
    const categories = ['All Categories', 'Household', 'Personal Care', 'Electronics', 'Stationery', 'Food & Beverages'];
    return `${pageHeading('Inventory', 'View and manage your product inventory.', `<button class="btn btn-primary" data-action="add-product">${icon('plus')} Add Product</button>`)}
      <div class="toolbar">
        <label class="search-field">${icon('search')}<input id="inventory-search" type="search" value="${escapeHtml(state.inventorySearch)}" placeholder="Search products, SKUs..." aria-label="Search inventory" /></label>
        <select id="inventory-category" class="select-field" aria-label="Filter by category">${categories.map(c => `<option ${state.inventoryCategory === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}</select>
        <span class="toolbar-spacer"></span>
        <button class="btn btn-secondary btn-sm" data-action="export-inventory">${icon('download')} Export CSV</button>
      </div>
      <article class="panel">
        <div class="tab-row">${tabs.map((tab, index) => `<button class="tab-button ${state.inventoryFilter === tab ? 'active' : ''}" data-action="inventory-tab" data-tab="${tab}">${tab}<span class="tab-count">${index === 0 ? state.products.length : state.products.filter(p => statusFor(p) === tab).length}</span></button>`).join('')}</div>
        <div id="inventory-table">${productTable()}</div>
        <div class="panel-head" style="padding:12px 16px;border-top:1px solid var(--line)"><span id="inventory-count-foot" class="muted small">Showing ${visibleProducts().length} of ${state.products.length} products · Tracked inventory overview</span><span class="muted small">Last updated just now</span></div>
      </article>`;
  }

  function renderAlerts() {
    const allAlerts = getAlerts();
    const lowAlerts = allAlerts.filter(a => a.type === 'Low Stock');
    const slowAlerts = allAlerts.filter(a => a.type === 'Slow-Moving');
    const deadAlerts = allAlerts.filter(a => a.type === 'Potential Dead Stock' || a.type === 'Out of Stock');
    const tabDefs = [
      { id: 'All', label: `All (${allAlerts.length})` },
      { id: 'Low Stock', label: `Low Stock (${lowAlerts.length})` },
      { id: 'Slow-Moving', label: `Slow-Moving (${slowAlerts.length})` },
      { id: 'Dead & Out', label: `Out of Stock & Dead Stock (${deadAlerts.length})` }
    ];

    let rows = allAlerts;
    if (state.alertFilter === 'Low Stock') rows = lowAlerts;
    else if (state.alertFilter === 'Slow-Moving') rows = slowAlerts;
    else if (state.alertFilter === 'Dead & Out') rows = deadAlerts;

    return `${pageHeading('Alerts', 'Stay informed about important inventory updates.', '<button class="btn btn-secondary btn-sm" data-action="mark-alerts">' + icon('check') + ' Mark all reviewed</button>')}
      <article class="panel">
        <div class="tab-row">${tabDefs.map(t => `<button class="tab-button ${state.alertFilter === t.id ? 'active' : ''}" data-action="alert-tab" data-tab="${t.id}">${t.label}</button>`).join('')}</div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Product</th><th>Alert Type</th><th>Message</th><th>Last Movement</th><th>Action</th></tr></thead>
            <tbody>${rows.length ? rows.map(a => `<tr><td><div class="product-cell"><span class="product-thumb">${escapeHtml((state.products.find(p => p.id === a.productId) || {}).emoji || '📦')}</span><div class="product-name">${escapeHtml(a.name)}</div></div></td><td><span class="status ${a.type === 'Low Stock' ? 'low' : a.type === 'Slow-Moving' ? 'slow' : 'out'}">${escapeHtml(a.type)}</span></td><td>${escapeHtml(a.message)}</td><td>${a.date}</td><td><button class="btn btn-secondary btn-sm" data-action="view-alert" data-id="${a.productId}">View</button></td></tr>`).join('') : `<tr><td colspan="5" class="empty-state">No alerts in this category</td></tr>`}</tbody>
          </table>
        </div>
        <div class="panel-head" style="padding:12px 16px;border-top:1px solid var(--line)"><span class="muted small">Showing ${rows.length} of ${allAlerts.length} alerts · Tracked inventory alerts</span><span class="muted small">${icon('shield')} Risk flags are indicators to review</span></div>
      </article>
      <div class="insight-band"><span class="insight-badge">${icon('help')}</span><div><strong>How are these alerts created?</strong><p>StockGuard uses your reorder point and recorded sales activity to flag low-stock, out-of-stock, and slow-moving items in real time.</p></div></div>`;
  }

  function renderRecommendations() {
    const tabs = ['Reorder Suggestions', 'Discount Suggestions', 'Bundle Suggestions'];
    const typeForTab = { 'Reorder Suggestions': 'reorder', 'Discount Suggestions': 'discount', 'Bundle Suggestions': 'bundle' };
    const allRecs = getRecommendations();
    const shown = allRecs.filter(r => r.type === typeForTab[state.recommendationTab] && !state.applied.includes(r.id));

    return `${pageHeading('Recommendations', 'Actionable suggestions to support better inventory decisions.', '<button class="btn btn-secondary btn-sm" data-action="recompute">' + icon('spark') + ' Refresh suggestions</button>')}
      <article class="panel">
        <div class="tab-row">${tabs.map(tab => `<button class="tab-button ${state.recommendationTab === tab ? 'active' : ''}" data-action="recommendation-tab" data-tab="${tab}">${tab}</button>`).join('')}</div>
        <div class="reco-list">${shown.length ? shown.map(r => `<div class="reco-card"><span class="reco-icon ${r.type}">${icon(r.type === 'reorder' ? 'arrow' : r.type === 'discount' ? 'tag' : 'package')}</span><div class="reco-copy"><strong>${escapeHtml(r.title)}</strong><p>${escapeHtml(r.body)}</p><p class="small" style="color:#91a098">Based on stock level and recent movement · review before acting</p></div><div class="reco-value"><span>${escapeHtml(r.label)}</span><strong>${escapeHtml(r.value)}</strong><small>Suggested action</small></div><button class="btn btn-primary btn-sm" data-action="recommendation-detail" data-id="${r.id}">View details</button></div>`).join('') : `<div class="empty-state"><strong>You're all caught up</strong>No ${state.recommendationTab.toLowerCase()} waiting for review.</div>`}</div>
      </article>
      <div class="survey-note">Recommendations are calculated from current stock levels, reorder points, and recorded sales velocity. Confirm stock, sales context, and margin before acting.</div>`;
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
      <div class="panel-head" style="padding:12px 16px;border-top:1px solid var(--line)"><span class="muted small">B2B Exchange · listings and purchase requests are saved in your local store workspace</span><span class="muted small">${icon('shield')} Review quality, payment, and delivery before a transaction</span></div></article>`;
  }

  function marketCard(item, actionLabel = 'Available') {
    return `<article class="market-card"><div class="market-image"><span class="market-chip">${escapeHtml(actionLabel)}</span><span class="market-emoji">${escapeHtml(item.emoji || '📦')}</span></div><div class="market-info"><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.category)}</p><div class="market-qty">${Number(item.quantity).toLocaleString('en-IN')} units available</div><div class="market-price">${money(item.price)}</div><div class="market-meta"><span>${icon('location')} ${escapeHtml(item.location || state.profile.location)}</span><span>${escapeHtml(item.condition || 'New')}</span></div>${actionLabel === 'Purchased' ? `<button class="btn btn-secondary btn-sm" disabled>Request sent ${icon('check')}</button>` : actionLabel === 'Your listing' ? `<button class="btn btn-secondary btn-sm" data-action="listing-detail" data-id="${escapeHtml(item.id)}">Manage listing</button>` : `<button class="btn btn-secondary btn-sm" data-action="market-detail" data-id="${escapeHtml(item.id)}">View details</button>`}</div></article>`;
  }

  function renderReports() {
    const totalItems = state.products.length;
    const lowCount = state.products.filter(p => statusFor(p) === 'Low Stock').length;
    const slowCount = state.products.filter(p => statusFor(p) === 'Slow-Moving').length;
    const totalStockUnits = state.products.reduce((acc, p) => acc + p.stock, 0);
    const potentialLoss = state.products.filter(p => statusFor(p) === 'Slow-Moving').reduce((acc, p) => acc + (p.cost || 50) * p.stock, 0);

    const signals = [
      ['Experience excess or unsold stock frequently', 59, '59%'],
      ['Rate early alerts as useful (4 or 5 / 5)', 65.7, '65.7%'],
      ['Find it difficult to identify slow-moving items', 31.3, '31.3%'],
      ['Have surplus they may sell to another business', 68.8, '68.8%'],
    ];
    return `${pageHeading('Reports', 'Explore inventory health and customer discovery insights.', '<button class="btn btn-secondary btn-sm" data-action="export-report">' + icon('download') + ' Export summary</button>')}
      <div class="metric-grid">
        ${metricCard('inventory','green','Tracked Assortment', totalItems, `${totalStockUnits.toLocaleString('en-IN')} total units in store`)}
        ${metricCard('alerts','red','Low Stock Items', lowCount, 'Items requiring replenishment')}
        ${metricCard('clock','amber','Slow-Moving Items', slowCount, 'Items with low sales velocity')}
        ${metricCard('shield','purple','Potential Exposure', money(potentialLoss), 'Capital tied in slow inventory')}
      </div>
      <div class="report-grid">
        <article class="panel">
          <div class="panel-head"><div><h2 class="panel-title">Customer discovery signals</h2><p class="panel-subtitle">Selected findings from the 32-response survey in the project report</p></div></div>
          <div class="report-bars">${signals.map(([label,value,display]) => `<div class="bar-row"><span>${label}</span><div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div><span class="bar-percent">${display}</span></div>`).join('')}</div>
        </article>
        <article class="panel">
          <div class="panel-head"><div><h2 class="panel-title">Retailer feedback findings</h2><p class="panel-subtitle">Key opportunities for inventory optimization</p></div></div>
          <div class="report-callout">
            <div class="signal-row"><span>Most selected unsold-stock reason</span><strong>Changing preferences · 37.5%</strong></div>
            <div class="signal-row"><span>Most common stock-tracking method</span><strong>Spreadsheets · 28.1%</strong></div>
            <div class="signal-row"><span>Top requested feature</span><strong>Reorder ideas · 28.1%</strong></div>
            <div class="signal-row"><span>Most selected price model</span><strong>Monthly · 34.4%</strong></div>
            <div class="survey-note">Customer survey findings from verified independent retailers. Findings highlight inventory challenges and demand for automated reorder alerts.</div>
          </div>
        </article>
      </div>`;
  }

  function renderSettings() {
    return `${pageHeading('Settings', 'Manage your store profile and StockGuard preferences.')}
      <div class="settings-grid">
        <aside class="panel settings-menu">
          <button class="settings-option active">${icon('user')} Store profile</button>
          <button class="settings-option" data-action="settings-notifications">${icon('alerts')} Notifications</button>
          <button class="settings-option" data-action="settings-data">${icon('shield')} Reset inventory</button>
        </aside>
        <div class="panel settings-content">
          <h2>Store profile</h2>
          <p>These details appear on your retailer workspace and marketplace listings.</p>
          <form id="profile-form">
            <div class="form-grid">
              <div class="field"><label for="profile-name">Your name</label><input id="profile-name" name="name" value="${escapeHtml(state.profile.name)}" required /></div>
              <div class="field"><label for="profile-store">Store name</label><input id="profile-store" name="store" value="${escapeHtml(state.profile.store)}" required /></div>
              <div class="field"><label for="profile-email">Email</label><input id="profile-email" name="email" type="email" value="${escapeHtml(state.profile.email)}" required /></div>
              <div class="field"><label for="profile-location">Location</label><input id="profile-location" name="location" value="${escapeHtml(state.profile.location)}" required /></div>
              <div class="field full"><label for="risk-threshold">Slow-moving alert threshold (days)</label><input id="risk-threshold" name="threshold" type="number" min="7" max="180" value="${Number(state.settings.riskThreshold)}" /></div>
            </div>
            <div class="modal-actions"><button class="btn btn-primary" type="submit">Save changes</button></div>
          </form>
          <div class="setting-toggle"><div><strong>Email alerts</strong><p>Receive an email when products need attention.</p></div><label class="switch"><input type="checkbox" data-setting="emailAlerts" ${state.settings.emailAlerts ? 'checked' : ''}><span></span></label></div>
          <div class="setting-toggle"><div><strong>Weekly summary</strong><p>Get a weekly inventory and risk overview.</p></div><label class="switch"><input type="checkbox" data-setting="weeklySummary" ${state.settings.weeklySummary ? 'checked' : ''}><span></span></label></div>
          <div class="setting-toggle"><div><strong>Reorder alerts</strong><p>Notify me when stock falls below its reorder point.</p></div><label class="switch"><input type="checkbox" data-setting="reorderAlerts" ${state.settings.reorderAlerts ? 'checked' : ''}><span></span></label></div>
          <hr style="border:0;border-top:1px solid var(--line);margin:20px 0">
          <div class="setting-toggle"><div><strong>Reset inventory data</strong><p>Restore the default StockGuard inventory dataset and reset local changes in this browser.</p></div><button class="btn btn-danger btn-sm" data-action="reset-inventory">Reset inventory</button></div>
        </div>
      </div>`;
  }

  function openModal(modal) { state.modal = modal; renderModal(); }
  function closeModal() { state.modal = null; renderModal(); }

  function renderModal() {
    if (!state.modal) { overlayRoot.innerHTML = ''; return; }
    const modal = state.modal;
    let title = '', subtitle = '', body = '', wide = false;

    if (modal.type === 'auth') {
      const signup = modal.mode === 'signup';
      title = signup ? 'Create your StockGuard account' : 'Welcome back';
      subtitle = signup ? 'Start with a simple view of your store inventory.' : 'Sign in to continue to your retailer workspace.';
      body = `<form id="auth-form"><div class="form-grid">${signup ? `<div class="field full"><label for="auth-name">Your name</label><input id="auth-name" name="name" placeholder="Ramesh Kumar" required /></div><div class="field full"><label for="auth-store">Store name</label><input id="auth-store" name="store" placeholder="Your store" required /></div>` : ''}<div class="field full"><label for="auth-email">Email address</label><input id="auth-email" name="email" type="email" placeholder="you@yourstore.com" required /></div><div class="field full"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" minlength="4" placeholder="At least 4 characters" required /></div></div><div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">${signup ? 'Create account' : 'Log in'}</button></div><p class="survey-note">Sign in to manage your store inventory. Data is saved in this browser workspace.</p></form>`;
    } else if (modal.type === 'add-product') {
      title = 'Add a product';
      subtitle = 'Add a product record to your store inventory.';
      body = `<form id="product-form"><div class="form-grid"><div class="field full"><label for="product-name">Product name</label><input id="product-name" name="name" placeholder="e.g. Dishwash Bar" required /></div><div class="field"><label for="product-category">Category</label><select id="product-category" name="category"><option>Household</option><option>Food & Beverages</option><option>Personal Care</option><option>Electronics</option><option>Stationery</option><option>Other</option></select></div><div class="field"><label for="product-stock">Current stock</label><input id="product-stock" name="stock" type="number" min="0" value="20" required /></div><div class="field"><label for="product-reorder">Reorder point</label><input id="product-reorder" name="reorder" type="number" min="0" value="10" required /></div><div class="field"><label for="product-cost">Unit cost (₹)</label><input id="product-cost" name="cost" type="number" min="0" value="100" required /></div></div><div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Add to inventory</button></div></form>`;
    } else if (modal.type === 'list-stock') {
      title = 'List surplus stock';
      subtitle = 'Share a surplus item with other retailers in the area.';
      body = `<form id="listing-form"><div class="form-grid"><div class="field full"><label for="listing-name">Product name</label><input id="listing-name" name="name" placeholder="e.g. Dishwash Bar (Pack of 3)" required /></div><div class="field"><label for="listing-category">Category</label><select id="listing-category" name="category"><option>Household</option><option>Food & Beverages</option><option>Personal Care</option><option>Electronics</option><option>Stationery</option><option>Other</option></select></div><div class="field"><label for="listing-quantity">Quantity available</label><input id="listing-quantity" name="quantity" type="number" min="1" value="24" required /></div><div class="field"><label for="listing-price">Total asking price (₹)</label><input id="listing-price" name="price" type="number" min="1" value="600" required /></div><div class="field"><label for="listing-condition">Condition</label><select id="listing-condition" name="condition"><option>New</option><option>Sealed</option><option>Good condition</option></select></div><div class="field"><label for="listing-location">Pickup location</label><input id="listing-location" name="location" value="${escapeHtml(state.profile.location)}" required /></div><div class="field full"><label for="listing-desc">Notes for buyers</label><textarea id="listing-desc" name="desc" placeholder="Include expiry or best-before dates, packaging, and pickup details."></textarea></div></div><div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Publish listing</button></div><p class="survey-note">A listing does not complete a transaction. Confirm quality, payment, and delivery directly with the buyer.</p></form>`;
    } else if (modal.type === 'market-detail') {
      const item = marketListings().find(x => x.id === modal.id);
      if (!item) { closeModal(); return; }
      title = item.name;
      subtitle = `${item.category} · Listed by ${item.seller || state.profile.store}`;
      wide = true;
      body = `<div style="display:grid;grid-template-columns:140px 1fr;gap:18px;align-items:start"><div class="market-image" style="height:140px;border-radius:10px"><span class="market-emoji">${escapeHtml(item.emoji || '📦')}</span></div><div><div class="eyebrow">${escapeHtml(item.condition || 'New stock')}</div><p style="color:#68776e;font-size:12px;line-height:1.7">${escapeHtml(item.desc || 'Surplus stock available for a local retailer.')}</p><div class="signal-row"><span>Quantity available</span><strong>${Number(item.quantity).toLocaleString('en-IN')} units</strong></div><div class="signal-row"><span>Location</span><strong>${escapeHtml(item.location || state.profile.location)}</strong></div><div class="signal-row"><span>Total asking price</span><strong>${money(item.price)}</strong></div><div class="signal-row"><span>Price per unit</span><strong>${money(Math.round(item.price / Math.max(1, item.quantity)))}</strong></div></div></div><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Close</button><button class="btn btn-primary" data-action="request-purchase" data-id="${escapeHtml(item.id)}">Request purchase ${icon('arrow')}</button></div><p class="survey-note">Purchase requests are recorded in your workspace. Contact the seller directly to arrange payment and delivery.</p>`;
    } else if (modal.type === 'listing-detail') {
      const item = state.listings.find(x => x.id === modal.id);
      if (!item) { closeModal(); return; }
      title = 'Your marketplace listing';
      subtitle = 'Review or remove this item from the B2B Exchange.';
      body = `<div class="signal-row"><span>Product</span><strong>${escapeHtml(item.name)}</strong></div><div class="signal-row"><span>Quantity</span><strong>${item.quantity} units</strong></div><div class="signal-row"><span>Asking price</span><strong>${money(item.price)}</strong></div><div class="signal-row"><span>Location</span><strong>${escapeHtml(item.location)}</strong></div><div class="modal-actions"><button class="btn btn-danger" data-action="remove-listing" data-id="${item.id}">Remove listing</button><button class="btn btn-secondary" data-action="close-modal">Done</button></div>`;
    } else if (modal.type === 'product-menu') {
      const item = state.products.find(x => x.id === modal.id);
      if (!item) { closeModal(); return; }
      const status = statusFor(item);
      title = item.name;
      subtitle = `${item.category} · SKU ${item.id.toUpperCase()}`;
      body = `
        <div class="signal-row"><span>Current Stock</span><strong>${item.stock} units (${status})</strong></div>
        <div class="signal-row"><span>Reorder Point</span><strong>${item.reorder} units</strong></div>
        <div class="signal-row"><span>Last Sold</span><strong>${formatLastSold(item)}</strong></div>
        <div class="action-menu-grid">
          <button class="btn btn-primary" data-action="open-record-sale" data-id="${item.id}" ${item.stock <= 0 ? 'disabled title="Out of stock"' : ''}>${icon('spark')} Record Sale</button>
          <button class="btn btn-secondary" data-action="open-add-stock" data-id="${item.id}">${icon('plus')} Add Stock</button>
          <button class="btn btn-secondary" data-action="open-edit-product" data-id="${item.id}">${icon('package')} Edit Details</button>
          <button class="btn btn-secondary" data-action="open-product-history" data-id="${item.id}">${icon('clock')} View History</button>
        </div>
        <div class="modal-actions" style="justify-content:space-between;border-top:1px solid var(--line);padding-top:14px;margin-top:16px">
          <button class="btn btn-danger btn-sm" type="button" data-action="open-delete-product" data-id="${item.id}">Delete product</button>
          <button class="btn btn-secondary btn-sm" type="button" data-action="close-modal">Close</button>
        </div>`;
    } else if (modal.type === 'record-sale') {
      const item = state.products.find(x => x.id === modal.id);
      if (!item) { closeModal(); return; }
      title = `Record Sale — ${item.name}`;
      subtitle = `Available Stock: ${item.stock} units · SKU ${item.id.toUpperCase()}`;
      body = `
        <form id="record-sale-form">
          <input type="hidden" name="productId" value="${item.id}">
          <div class="signal-row" style="margin-bottom:14px">
            <span>Current Available Stock</span>
            <strong>${item.stock} units</strong>
          </div>
          <div class="form-grid">
            <div class="field full">
              <label for="sale-quantity">Quantity Sold</label>
              <input id="sale-quantity" name="quantity" type="number" min="1" max="${item.stock}" value="1" required autofocus />
              <small class="muted" style="font-size:10px;margin-top:2px">Enter a positive integer up to available stock (${item.stock}).</small>
            </div>
          </div>
          <div id="sale-error" class="form-error" style="display:none;"></div>
          <div class="modal-actions" style="justify-content:space-between;margin-top:18px">
            <button class="btn btn-secondary" type="button" data-action="product-menu" data-id="${item.id}">Back</button>
            <button class="btn btn-primary" type="submit">${icon('check')} Record Sale</button>
          </div>
        </form>`;
    } else if (modal.type === 'add-stock') {
      const item = state.products.find(x => x.id === modal.id);
      if (!item) { closeModal(); return; }
      title = `Add Stock — ${item.name}`;
      subtitle = `Current Stock: ${item.stock} units · SKU ${item.id.toUpperCase()}`;
      body = `
        <form id="add-stock-form">
          <input type="hidden" name="productId" value="${item.id}">
          <div class="signal-row" style="margin-bottom:14px">
            <span>Current Stock</span>
            <strong>${item.stock} units</strong>
          </div>
          <div class="form-grid">
            <div class="field full">
              <label for="restock-quantity">Quantity Received / Restocked</label>
              <input id="restock-quantity" name="quantity" type="number" min="1" value="10" required autofocus />
              <small class="muted" style="font-size:10px;margin-top:2px">Accepts only positive integers. Receiving stock does not change Last Sold.</small>
            </div>
          </div>
          <div id="restock-error" class="form-error" style="display:none;"></div>
          <div class="modal-actions" style="justify-content:space-between;margin-top:18px">
            <button class="btn btn-secondary" type="button" data-action="product-menu" data-id="${item.id}">Back</button>
            <button class="btn btn-primary" type="submit">${icon('plus')} Add to Stock</button>
          </div>
        </form>`;
    } else if (modal.type === 'edit-product') {
      const item = state.products.find(x => x.id === modal.id);
      if (!item) { closeModal(); return; }
      title = `Edit Product — ${item.name}`;
      subtitle = `SKU ${item.id.toUpperCase()} · Update product details`;
      const categories = ['Household', 'Personal Care', 'Electronics', 'Stationery', 'Food & Beverages', 'Other'];
      body = `
        <form id="product-edit-full">
          <input type="hidden" name="productId" value="${item.id}">
          <div class="form-grid">
            <div class="field full">
              <label for="edit-name">Product Name</label>
              <input id="edit-name" name="name" value="${escapeHtml(item.name)}" required />
            </div>
            <div class="field">
              <label for="edit-category">Category</label>
              <select id="edit-category" name="category">
                ${categories.map(cat => `<option ${item.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
              </select>
            </div>
            <div class="field">
              <label for="edit-stock">Current Stock</label>
              <input id="edit-stock" name="stock" type="number" min="0" value="${item.stock}" required />
            </div>
            <div class="field">
              <label for="edit-reorder">Reorder Point</label>
              <input id="edit-reorder" name="reorder" type="number" min="0" value="${item.reorder}" required />
            </div>
            <div class="field">
              <label for="edit-cost">Unit Cost (₹)</label>
              <input id="edit-cost" name="cost" type="number" min="0" value="${item.cost || 50}" required />
            </div>
          </div>
          <div id="edit-error" class="form-error" style="display:none;"></div>
          <div class="modal-actions" style="justify-content:space-between;margin-top:18px">
            <button class="btn btn-secondary" type="button" data-action="product-menu" data-id="${item.id}">Back</button>
            <button class="btn btn-primary" type="submit">Save Changes</button>
          </div>
        </form>`;
    } else if (modal.type === 'delete-confirm') {
      const item = state.products.find(x => x.id === modal.id);
      if (!item) { closeModal(); return; }
      title = `Delete ${item.name}?`;
      subtitle = `Confirm removal of product from active inventory`;
      body = `
        <p style="margin:0 0 14px;color:var(--muted);font-size:12px;line-height:1.6">
          Are you sure you want to delete <strong>${escapeHtml(item.name)}</strong> (SKU ${escapeHtml(item.id.toUpperCase())}) from your active inventory?
          Historical transactions and movement records will be safely preserved.
        </p>
        <div class="signal-row"><span>Category</span><strong>${escapeHtml(item.category)}</strong></div>
        <div class="signal-row"><span>Current Stock</span><strong>${item.stock} units</strong></div>
        <div class="signal-row"><span>Reorder Point</span><strong>${item.reorder} units</strong></div>
        <div class="modal-actions" style="justify-content:space-between;margin-top:20px">
          <button class="btn btn-secondary" type="button" data-action="product-menu" data-id="${item.id}">Cancel</button>
          <button class="btn btn-danger" type="button" data-action="confirm-delete-product" data-id="${item.id}">Delete Product</button>
        </div>`;
    } else if (modal.type === 'product-history') {
      const item = state.products.find(x => x.id === modal.id);
      if (!item) { closeModal(); return; }
      const status = statusFor(item);
      const productSales = getProductSales(item.id);
      const productMovements = (state.movements || []).filter(m => m.productId === item.id).sort((a, b) => b.timestamp - a.timestamp);
      const totalSold = productSales.reduce((acc, s) => acc + (Number(s.quantity) || 0), 0);
      const totalRestocked = productMovements.filter(m => m.type === 'restock').reduce((acc, m) => acc + (Number(m.quantity) || 0), 0);

      title = `History — ${item.name}`;
      subtitle = `SKU ${item.id.toUpperCase()} · ${item.category}`;
      body = `
        <div class="signal-row"><span>Current Stock</span><strong>${item.stock} units</strong></div>
        <div class="signal-row"><span>Status</span><strong class="status ${statusClass(status)}">${status}</strong></div>
        <div class="signal-row"><span>Last Sold</span><strong>${formatLastSold(item)}</strong></div>
        <div class="signal-row"><span>Total Units Sold</span><strong>${totalSold} units</strong></div>
        <div class="signal-row"><span>Total Restocked</span><strong>${totalRestocked} units</strong></div>

        <h3 style="margin:18px 0 8px;font-size:12px;font-weight:700">Movement & Sales History</h3>
        <div class="history-list">
          ${productMovements.length ? productMovements.map(m => `
            <div class="history-item">
              <div style="display:flex;align-items:center;gap:8px">
                <span class="status ${m.type === 'sale' ? 'low' : 'in'}" style="font-size:9px">${m.type === 'sale' ? 'Sale' : 'Restock'}</span>
                <strong>${m.type === 'sale' ? `${m.quantity} units` : `+${m.quantity} units`}</strong>
              </div>
              <div class="history-meta">
                <time class="history-date">${escapeHtml(m.dateStr || '—')}</time>
                ${m.note ? `<span class="history-note">${escapeHtml(m.note)}</span>` : ''}
              </div>
            </div>
          `).join('') : '<div style="padding:22px;text-align:center;color:var(--muted);font-size:11px">No recorded movements yet.</div>'}
        </div>

        <div class="modal-actions" style="justify-content:space-between;margin-top:18px">
          <div style="display:flex;gap:8px">
            <button class="btn btn-secondary btn-sm" type="button" data-action="open-record-sale" data-id="${item.id}" ${item.stock <= 0 ? 'disabled' : ''}>Record Sale</button>
            <button class="btn btn-secondary btn-sm" type="button" data-action="open-add-stock" data-id="${item.id}">Add Stock</button>
          </div>
          <button class="btn btn-secondary btn-sm" type="button" data-action="product-menu" data-id="${item.id}">Back</button>
        </div>`;
    } else if (modal.type === 'reset-confirm') {
      title = 'Reset inventory data?';
      subtitle = 'This restores the default 50-product StockGuard inventory in this browser.';
      body = `<p style="margin:0;color:#68776e;font-size:12px;line-height:1.7">Your custom sales records, stock updates, added products, marketplace listings, and profile edits will be reset to default values.</p><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Keep my data</button><button class="btn btn-danger" data-action="confirm-reset">Reset inventory</button></div>`;
    } else if (modal.type === 'recommendation') {
      const rec = getRecommendations().find(x => x.id === modal.id);
      if (!rec) { closeModal(); return; }
      const product = state.products.find(x => x.id === rec.productId);
      title = rec.title;
      subtitle = 'Review this recommendation before acting.';
      body = `<div class="insight-band" style="margin:0 0 17px"><span class="insight-badge">${icon('spark')}</span><div><strong>Why this came up</strong><p>${rec.body} StockGuard analyzes stock levels and recorded sales velocity to surface actionable suggestions.</p></div></div><div class="signal-row"><span>Product</span><strong>${escapeHtml(product?.name || rec.title)}</strong></div><div class="signal-row"><span>Current stock</span><strong>${product ? `${product.stock} units` : '—'}</strong></div><div class="signal-row"><span>Suggested action</span><strong>${rec.value}</strong></div><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Review later</button><button class="btn btn-primary" data-action="apply-recommendation" data-id="${rec.id}">${rec.action} ${icon('check')}</button></div>`;
    } else if (modal.type === 'alert-detail') {
      const item = state.products.find(p => p.id === modal.id);
      title = item ? item.name : 'Inventory alert';
      subtitle = 'Review the inventory alert and related product record.';
      body = `<div class="signal-row"><span>Current status</span><strong>${item ? statusFor(item) : 'Needs review'}</strong></div><div class="signal-row"><span>Current stock</span><strong>${item ? `${item.stock} units` : '—'}</strong></div><div class="signal-row"><span>Recent sales activity</span><strong>${item ? formatLastSold(item) : 'No recent record'}</strong></div><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Close</button><button class="btn btn-primary" data-action="open-product" data-id="${modal.id}">View in inventory ${icon('arrow')}</button></div>`;
    } else if (modal.type === 'date-range') {
      title = 'Dashboard reporting period';
      subtitle = 'Select a date range for the dashboard summary.';
      body = `<form id="date-form"><div class="form-grid"><div class="field"><label for="date-from">From</label><input id="date-from" type="date" value="${state.dateRange.from}" /></div><div class="field"><label for="date-to">To</label><input id="date-to" type="date" value="${state.dateRange.to}" /></div></div><div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Apply range</button></div></form>`;
    } else if (modal.type === 'help') {
      title = 'StockGuard help';
      subtitle = 'A few useful guides for managing your inventory with StockGuard.';
      body = `<div class="signal-row"><span>Add or update products</span><strong>Inventory → Add Product or ··· menu</strong></div><div class="signal-row"><span>Record sales & restock</span><strong>Inventory → ··· Action menu</strong></div><div class="signal-row"><span>Review risk flags</span><strong>Alerts → View</strong></div><div class="signal-row"><span>Explore actions</span><strong>Recommendations</strong></div><div class="signal-row"><span>Contact the team</span><strong>hello@stockguard.in</strong></div><div class="modal-actions"><button class="btn btn-primary" data-action="close-modal">Got it</button></div>`;
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
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
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
    if (action === 'apply-recommendation') {
      const rec = getRecommendations().find(x => x.id === control.dataset.id);
      if (rec && !state.applied.includes(rec.id)) state.applied.push(rec.id);
      persist(); closeModal(); render(); toast(`${rec?.action || 'Suggestion'} marked as reviewed`); return;
    }
    if (action === 'request-purchase') {
      const item = marketListings().find(x => x.id === control.dataset.id);
      if (item && !state.purchases.some(p => p.id === item.id)) state.purchases.unshift({ ...item });
      persist(); state.exchangeTab = 'My Purchases'; closeModal(); render(); toast('Purchase request saved in My Purchases'); return;
    }
    if (action === 'remove-listing') { state.listings = state.listings.filter(x => x.id !== control.dataset.id); persist(); closeModal(); render(); toast('Listing removed'); return; }

    // Product actions
    if (action === 'product-menu') { openModal({ type: 'product-menu', id: control.dataset.id }); return; }
    if (action === 'open-record-sale') { openModal({ type: 'record-sale', id: control.dataset.id }); return; }
    if (action === 'open-add-stock') { openModal({ type: 'add-stock', id: control.dataset.id }); return; }
    if (action === 'open-edit-product') { openModal({ type: 'edit-product', id: control.dataset.id }); return; }
    if (action === 'open-product-history') { openModal({ type: 'product-history', id: control.dataset.id }); return; }
    if (action === 'open-delete-product') { openModal({ type: 'delete-confirm', id: control.dataset.id }); return; }
    if (action === 'confirm-delete-product') {
      const item = state.products.find(p => p.id === control.dataset.id);
      const name = item ? item.name : 'Product';
      state.products = state.products.filter(p => p.id !== control.dataset.id);
      // Historical sales and stock movement records are preserved in state.sales and state.movements
      persist(); closeModal(); render(); toast(`${name} removed from inventory`); return;
    }

    if (action === 'open-product') {
      const id = control.dataset.id;
      closeModal();
      navigate('inventory');
      state.inventorySearch = state.products.find(p => p.id === id)?.name || '';
      render();
      const input = $('#inventory-search');
      if (input) input.focus();
      return;
    }
    if (action === 'mark-alerts') { toast('All visible alerts marked as reviewed'); return; }
    if (action === 'recompute') { state.applied = []; persist(); render(); toast('Suggestions refreshed'); return; }
    if (action === 'export-inventory') {
      exportCsv('stockguard-inventory.csv', [
        ['Product Name', 'Category', 'Current Stock', 'Status', 'Last Sold', 'Reorder Point', 'Unit Cost (₹)'],
        ...state.products.map(p => [
          p.name,
          p.category,
          p.stock,
          statusFor(p),
          formatLastSold(p),
          p.reorder,
          p.cost || 0
        ])
      ]);
      toast('Inventory CSV downloaded');
      return;
    }
    if (action === 'export-report') {
      exportCsv('stockguard-discovery-summary.csv', [
        ['Customer discovery signal', 'Result'],
        ['Survey responses', '32'],
        ['Useful alert ratings', '65.7%'],
        ['Slow-moving identification difficulty', '31.3%'],
        ['Surplus sale interest', '68.8%'],
        ['Most selected feature', 'Reorder recommendations · 28.1%'],
        ['Most selected pricing model', 'Monthly subscription · 34.4%']
      ]);
      toast('Survey summary downloaded');
      return;
    }
    if (action === 'reset-inventory') { openModal({ type: 'reset-confirm' }); return; }
    if (action === 'settings-notifications') { toast('Notification preferences are available below the profile form'); return; }
    if (action === 'settings-data') { openModal({ type: 'reset-confirm' }); return; }
    if (action === 'confirm-reset') {
      state.products = JSON.parse(JSON.stringify(productSeed));
      state.sales = JSON.parse(JSON.stringify(seedSales));
      state.movements = JSON.parse(JSON.stringify(seedMovements));
      state.listings = [];
      state.purchases = [];
      state.applied = [];
      state.profile = { name: 'Ramesh Kumar', store: 'Ramesh Store', email: 'ramesh.store@gmail.com', location: 'Chennai' };
      persist();
      closeModal();
      render();
      toast('Default inventory restored');
      return;
    }
  });

  document.addEventListener('input', event => {
    if (event.target.id === 'inventory-search') {
      state.inventorySearch = event.target.value;
      const panel = $('#inventory-table');
      if (panel) panel.innerHTML = productTable();
      const foot = $('#inventory-count-foot');
      if (foot) foot.textContent = `Showing ${visibleProducts().length} of ${state.products.length} products · Tracked inventory overview`;
    }
    if (event.target.id === 'exchange-search') {
      state.exchangeSearch = event.target.value;
      const results = $('#market-results');
      const matches = renderMarketCards();
      if (results) results.innerHTML = matches.length ? `<div class="exchange-grid">${matches.map(item => marketCard(item)).join('')}</div>` : `<div class="empty-state"><strong>No listings match that search</strong>Try a different product name.</div>`;
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Enter' && event.target.id === 'global-search') {
      event.preventDefault();
      state.inventorySearch = event.target.value.trim();
      navigate('inventory');
      const input = $('#inventory-search');
      if (input) input.focus();
    }
    if (event.key === 'Escape' && state.modal) closeModal();
  });

  document.addEventListener('change', event => {
    if (event.target.id === 'inventory-category') {
      state.inventoryCategory = event.target.value;
      const panel = $('#inventory-table');
      if (panel) panel.innerHTML = productTable();
      const foot = $('#inventory-count-foot');
      if (foot) foot.textContent = `Showing ${visibleProducts().length} of ${state.products.length} products · Tracked inventory overview`;
    }
    if (event.target.id === 'exchange-category') { state.exchangeCategory = event.target.value; render(); }
    if (event.target.id === 'exchange-location') { state.exchangeLocation = event.target.value; render(); }
    if (event.target.matches('[data-setting]')) { state.settings[event.target.dataset.setting] = event.target.checked; persist(); toast('Preference updated'); }
  });

  document.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.target;
    const formId = (typeof form.getAttribute === 'function' ? form.getAttribute('id') : form.id) || form.id;
    const data = new FormData(form);

    if (formId === 'record-sale-form') {
      const id = data.get('productId') || data.get('id');
      const item = state.products.find(p => p.id === id);
      if (!item) { closeModal(); return; }
      const qty = Number(data.get('quantity'));
      const errBox = $('#sale-error');
      if (!Number.isInteger(qty) || qty <= 0) {
        if (errBox) { errBox.textContent = 'Please enter a valid positive integer quantity.'; errBox.style.display = 'block'; }
        return;
      }
      if (qty > item.stock) {
        if (errBox) { errBox.textContent = `Cannot sell ${qty} units. Only ${item.stock} units available in stock.`; errBox.style.display = 'block'; }
        return;
      }
      item.stock -= qty;
      const now = Date.now();
      state.sales.unshift({
        id: `sale_${now}`,
        productId: item.id,
        productName: item.name,
        quantity: qty,
        timestamp: now,
        dateStr: formatDateTime(now),
        unitCost: item.cost || 0
      });
      state.movements.unshift({
        id: `mov_${now}`,
        productId: item.id,
        productName: item.name,
        type: 'sale',
        quantity: -qty,
        balance: item.stock,
        timestamp: now,
        dateStr: formatDateTime(now),
        note: 'Customer sale recorded'
      });
      persist();
      closeModal();
      render();
      toast(`Sale of ${qty} units recorded for ${item.name}. Remaining stock: ${item.stock}.`);
      return;
    }

    if (formId === 'add-stock-form') {
      const id = data.get('productId') || data.get('id');
      const item = state.products.find(p => p.id === id);
      if (!item) { closeModal(); return; }
      const qty = Number(data.get('quantity'));
      const errBox = $('#restock-error');
      if (!Number.isInteger(qty) || qty <= 0) {
        if (errBox) { errBox.textContent = 'Please enter a valid positive integer quantity.'; errBox.style.display = 'block'; }
        return;
      }
      item.stock += qty;
      const now = Date.now();
      state.movements.unshift({
        id: `mov_${now}`,
        productId: item.id,
        productName: item.name,
        type: 'restock',
        quantity: qty,
        balance: item.stock,
        timestamp: now,
        dateStr: formatDateTime(now),
        note: 'Stock replenishment'
      });
      // Do not update Last Sold or state.sales
      persist();
      closeModal();
      render();
      toast(`Added ${qty} units to ${item.name}. New stock: ${item.stock}.`);
      return;
    }

    if (formId === 'product-edit-full') {
      const id = data.get('productId') || data.get('id');
      const item = state.products.find(p => p.id === id);
      if (!item) { closeModal(); return; }
      const name = String(data.get('name') || '').trim();
      const category = String(data.get('category') || '').trim();
      const stock = Number(data.get('stock'));
      const reorder = Number(data.get('reorder'));
      const cost = Number(data.get('cost'));
      const errBox = $('#edit-error');

      if (!name) {
        if (errBox) { errBox.textContent = 'Product name cannot be empty.'; errBox.style.display = 'block'; }
        return;
      }
      if (!Number.isInteger(stock) || stock < 0 || !Number.isInteger(reorder) || reorder < 0) {
        if (errBox) { errBox.textContent = 'Stock and reorder point must be non-negative integers.'; errBox.style.display = 'block'; }
        return;
      }

      item.name = name;
      item.category = category;
      item.stock = stock;
      item.reorder = reorder;
      item.cost = Math.max(0, cost);
      // Keep product ID stable. Last Sold is unchanged.
      persist();
      closeModal();
      render();
      toast(`${item.name} updated successfully`);
      return;
    }

    if (formId === 'product-form') {
      const name = String(data.get('name')).trim();
      const category = String(data.get('category'));
      const stock = Math.max(0, Number(data.get('stock')) || 0);
      const reorder = Math.max(0, Number(data.get('reorder')) || 0);
      const cost = Math.max(0, Number(data.get('cost')) || 0);
      const now = Date.now();
      const newProduct = {
        id: `p${now}`,
        name,
        category,
        stock,
        reorder,
        cost,
        emoji: category === 'Household' ? '🧺' : category === 'Personal Care' ? '🧴' : category === 'Electronics' ? '💡' : category === 'Stationery' ? '📓' : category === 'Food & Beverages' ? '🍫' : '📦',
        createdAt: now
      };
      state.products.unshift(newProduct);
      state.movements.unshift({
        id: `mov_${now}`,
        productId: newProduct.id,
        productName: newProduct.name,
        type: 'restock',
        quantity: stock,
        balance: stock,
        timestamp: now,
        dateStr: formatDateTime(now),
        note: 'Initial inventory intake'
      });
      persist();
      closeModal();
      render();
      toast(`${name} added to inventory`);
      return;
    }

    if (formId === 'listing-form') {
      const listing = {
        id: `l${Date.now()}`,
        name: String(data.get('name')).trim(),
        category: String(data.get('category')),
        quantity: Math.max(1, Number(data.get('quantity'))),
        price: Math.max(1, Number(data.get('price'))),
        condition: String(data.get('condition')),
        location: String(data.get('location')).trim(),
        desc: String(data.get('desc') || '').trim(),
        emoji: '📦',
        seller: state.profile.store
      };
      state.listings.unshift(listing);
      persist();
      state.exchangeTab = 'My Listings';
      closeModal();
      render();
      toast('Your surplus listing is live on B2B Exchange');
      return;
    }

    if (formId === 'profile-form') {
      state.profile = {
        ...state.profile,
        name: String(data.get('name')).trim(),
        store: String(data.get('store')).trim(),
        email: String(data.get('email')).trim(),
        location: String(data.get('location')).trim()
      };
      state.settings.riskThreshold = Math.max(7, Math.min(180, Number(data.get('threshold')) || 60));
      persist();
      render();
      toast('Store profile saved');
      return;
    }

    if (formId === 'auth-form') {
      const email = String(data.get('email')).trim();
      if (data.get('name')) state.profile.name = String(data.get('name')).trim();
      if (data.get('store')) state.profile.store = String(data.get('store')).trim();
      state.profile.email = email;
      persist();
      closeModal();
      navigate('dashboard');
      toast('Welcome to StockGuard');
      return;
    }

    if (formId === 'date-form') {
      state.dateRange = { from: String($('#date-from').value), to: String($('#date-to').value) };
      persist();
      closeModal();
      render();
      toast('Dashboard date range updated');
      return;
    }
  });

  window.addEventListener('popstate', () => { state.route = location.hash.replace('#', '') || 'home'; render(); });
  window.addEventListener('hashchange', () => { state.route = location.hash.replace('#', '') || 'home'; render(); });

  if (state.route === 'home') render(); else render();

  const loader = document.createElement('div');
  loader.className = 'loading-screen';
  loader.innerHTML = `<div><div class="loading-mark">${icon('inventory')}</div><div class="loading-brand">StockGuard</div><div class="loading-line"></div></div>`;
  document.body.appendChild(loader);
  requestAnimationFrame(() => setTimeout(() => { loader.classList.add('done'); setTimeout(() => loader.remove(), 300); }, 420));
})();
