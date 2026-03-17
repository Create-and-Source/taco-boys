// localStorage-backed store for cart, orders, customers, and loyalty

const KEYS = {
  cart: 'tb_cart',
  orders: 'tb_orders',
  customers: 'tb_customers',
  loyalty: 'tb_loyalty',
  catering: 'tb_catering',
  specials: 'tb_specials_active',
}

function get(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback }
  catch { return fallback }
}
function set(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

// ── Cart ──
export function getCart() { return get(KEYS.cart, []) }
export function saveCart(cart) { set(KEYS.cart, cart) }

// ── Orders ──
export function getOrders() { return get(KEYS.orders, seedOrders()) }
export function addOrder(order) {
  const orders = getOrders()
  const newOrder = {
    id: `TB-${String(orders.length + 1001).padStart(4, '0')}`,
    ...order,
    status: 'New',
    createdAt: new Date().toISOString(),
  }
  set(KEYS.orders, [newOrder, ...orders])
  // Add customer if new
  if (order.phone) addCustomer({ name: order.name, phone: order.phone, email: order.email })
  return newOrder
}
export function updateOrderStatus(id, status) {
  set(KEYS.orders, getOrders().map(o => o.id === id ? { ...o, status } : o))
}

// ── Customers ──
export function getCustomers() { return get(KEYS.customers, seedCustomers()) }
export function addCustomer({ name, phone, email }) {
  const customers = getCustomers()
  const existing = customers.find(c => c.phone === phone)
  if (existing) {
    set(KEYS.customers, customers.map(c => c.phone === phone ? { ...c, orders: c.orders + 1, lastOrder: new Date().toISOString(), totalSpent: c.totalSpent + 0 } : c))
  } else {
    set(KEYS.customers, [...customers, { name, phone, email, orders: 1, totalSpent: 0, loyaltyPoints: 0, joined: new Date().toISOString(), lastOrder: new Date().toISOString() }])
  }
}

// ── Catering ──
export function getCateringRequests() { return get(KEYS.catering, seedCatering()) }
export function addCateringRequest(req) {
  set(KEYS.catering, [{ id: `CAT-${Date.now()}`, ...req, status: 'New', createdAt: new Date().toISOString() }, ...getCateringRequests()])
}

// ── Seed data ──
function seedOrders() {
  const orders = [
    { id: 'TB-1047', name: 'Marcus T.', phone: '(480) 555-0142', items: [{ name: 'Carne Asada', qty: 4, price: 3 }, { name: 'Al Pastor', qty: 2, price: 3 }, { name: 'Horchata', qty: 2, price: 4 }], total: 26, type: 'pickup', location: 'Roosevelt Row', status: 'Ready', createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
    { id: 'TB-1046', name: 'Sophia R.', phone: '(602) 555-0198', items: [{ name: 'Carne Asada Burrito', qty: 2, price: 10 }, { name: 'Carne Asada Fries', qty: 1, price: 10 }], total: 30, type: 'delivery', location: 'Tempe — Mill Ave', status: 'Preparing', createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    { id: 'TB-1045', name: 'Jake W.', phone: '(480) 555-0231', items: [{ name: 'Taco Family Pack (12)', qty: 1, price: 30 }, { name: 'Chips & Guac', qty: 2, price: 6 }], total: 42, type: 'pickup', location: 'North Phoenix', status: 'Picked Up', createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: 'TB-1044', name: 'Diana M.', phone: '(602) 555-0177', items: [{ name: 'Pollo Vampiro', qty: 3, price: 5 }, { name: 'Elote', qty: 2, price: 5 }, { name: 'Mangonada', qty: 3, price: 6 }], total: 43, type: 'pickup', location: 'Roosevelt Row', status: 'Picked Up', createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
    { id: 'TB-1043', name: 'Chris L.', phone: '(480) 555-0265', items: [{ name: 'Mixed Grill Pack', qty: 1, price: 45 }], total: 45, type: 'pickup', location: '32nd Street', status: 'Picked Up', createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    { id: 'TB-1042', name: 'Maria G.', phone: '(602) 555-0314', items: [{ name: 'Carne Asada Plato', qty: 2, price: 14 }, { name: 'Agua Fresca', qty: 2, price: 4 }], total: 36, type: 'delivery', location: 'West Phoenix', status: 'Delivered', createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
    { id: 'TB-1041', name: 'Alex K.', phone: '(480) 555-0092', items: [{ name: 'Carne Asada', qty: 6, price: 3 }, { name: 'Cabeza', qty: 2, price: 3 }, { name: 'Mexican Coke', qty: 4, price: 3 }], total: 36, type: 'pickup', location: 'Tempe — Rural', status: 'Picked Up', createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
  ]
  set(KEYS.orders, orders)
  return orders
}

function seedCustomers() {
  const customers = [
    { name: 'Marcus T.', phone: '(480) 555-0142', email: 'marcus@email.com', orders: 23, totalSpent: 412, loyaltyPoints: 412, joined: '2024-06-15', lastOrder: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
    { name: 'Sophia R.', phone: '(602) 555-0198', email: 'sophia@email.com', orders: 15, totalSpent: 287, loyaltyPoints: 287, joined: '2024-08-22', lastOrder: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    { name: 'Jake W.', phone: '(480) 555-0231', email: '', orders: 8, totalSpent: 156, loyaltyPoints: 156, joined: '2025-01-10', lastOrder: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { name: 'Diana M.', phone: '(602) 555-0177', email: 'diana@email.com', orders: 31, totalSpent: 589, loyaltyPoints: 589, joined: '2024-03-05', lastOrder: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
    { name: 'Chris L.', phone: '(480) 555-0265', email: 'chris@email.com', orders: 12, totalSpent: 234, loyaltyPoints: 234, joined: '2024-11-18', lastOrder: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    { name: 'Maria G.', phone: '(602) 555-0314', email: 'maria@email.com', orders: 45, totalSpent: 890, loyaltyPoints: 890, joined: '2023-09-01', lastOrder: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  ]
  set(KEYS.customers, customers)
  return customers
}

function seedCatering() {
  const reqs = [
    { id: 'CAT-001', name: 'Sarah K.', phone: '(480) 555-0188', email: 'sarah@company.com', date: '2026-04-05', guests: '40–60', details: 'Corporate lunch for tech company. Need vegetarian options.', status: 'Confirmed', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    { id: 'CAT-002', name: 'David R.', phone: '(602) 555-0244', email: 'david@email.com', date: '2026-03-29', guests: '20–40', details: 'Birthday party. Mostly carne asada and pastor.', status: 'New', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  ]
  set(KEYS.catering, reqs)
  return reqs
}

// ── Analytics helpers ──
export function getTodayRevenue() {
  const today = new Date().toDateString()
  return getOrders().filter(o => new Date(o.createdAt).toDateString() === today).reduce((sum, o) => sum + (o.total || 0), 0)
}
export function getTodayOrders() {
  const today = new Date().toDateString()
  return getOrders().filter(o => new Date(o.createdAt).toDateString() === today)
}
export function getWeekRevenue() {
  const week = Date.now() - 7 * 24 * 60 * 60 * 1000
  return getOrders().filter(o => new Date(o.createdAt).getTime() > week).reduce((sum, o) => sum + (o.total || 0), 0)
}
export function getTopItems() {
  const counts = {}
  getOrders().forEach(o => (o.items || []).forEach(i => { counts[i.name] = (counts[i.name] || 0) + i.qty }))
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty }))
}
