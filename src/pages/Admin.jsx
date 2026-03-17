import { useState, useEffect } from 'react'
import { getOrders, updateOrderStatus, getCustomers, getCateringRequests, getTodayRevenue, getTodayOrders, getWeekRevenue, getTopItems } from '../data/store'
import { MENU, LOCATIONS, IMG } from '../data/menu'

const B = '1px solid var(--border)'
const V = { font_display: "'Squada One', cursive", font_mono: "'JetBrains Mono', monospace" }

const SIDEBAR_ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'orders', icon: '📋', label: 'Orders', badge: true },
  { id: 'menu', icon: '📝', label: 'Menu' },
  { id: 'customers', icon: '👥', label: 'Customers' },
  { id: 'loyalty', icon: '🎁', label: 'Loyalty' },
  { id: 'catering', icon: '🎉', label: 'Catering' },
  { id: 'locations', icon: '📍', label: 'Locations' },
  { id: 'analytics', icon: '📈', label: 'Analytics' },
  { id: 'marketing', icon: '📣', label: 'Marketing' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
]

export default function Admin({ onBack }) {
  const [tab, setTab] = useState('dashboard')
  const [orders, setOrders] = useState(getOrders())
  const [customers] = useState(getCustomers())
  const [catering] = useState(getCateringRequests())
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => { const iv = setInterval(() => setOrders(getOrders()), 5000); return () => clearInterval(iv) }, [])

  const todayRev = getTodayRevenue()
  const todayOrd = getTodayOrders()
  const weekRev = getWeekRevenue()
  const topItems = getTopItems()
  const activeOrders = orders.filter(o => ['New', 'Preparing', 'Ready'].includes(o.status))

  const handleStatus = (id, status) => { updateOrderStatus(id, status); setOrders(getOrders()) }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg2)' }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 220 : 60, background: 'var(--bg)', color: '#fff', flexShrink: 0, transition: 'width 0.3s ease', overflow: 'hidden', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 12px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={IMG.logo} alt="" style={{ height: 28, filter: 'brightness(10)', flexShrink: 0 }} />
          {sidebarOpen && <div>
            <div style={{ fontFamily: V.font_display, fontSize: 16 }}>TACO BOY'S</div>
            <div style={{ fontFamily: V.font_mono, fontSize: 8, color: 'var(--text2)', letterSpacing: '0.15em' }}>ADMIN</div>
          </div>}
        </div>
        <div style={{ flex: 1, padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SIDEBAR_ITEMS.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', textAlign: 'left', width: '100%',
              background: tab === item.id ? 'rgba(233,61,61,0.15)' : 'transparent',
              color: tab === item.id ? 'var(--red)' : '#999',
              fontSize: 13, fontWeight: tab === item.id ? 700 : 400, whiteSpace: 'nowrap',
              transition: 'all 0.2s', borderLeft: tab === item.id ? '3px solid var(--red)' : '3px solid transparent',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0, width: 24, textAlign: 'center' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
              {sidebarOpen && item.badge && activeOrders.length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--red)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 100 }}>{activeOrders.length}</span>
              )}
            </button>
          ))}
        </div>
        <button onClick={onBack} style={{ padding: '14px 12px', borderTop: '1px solid #333', fontSize: 12, color: 'var(--text2)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>←</span> {sidebarOpen && 'Back to Store'}
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
        {/* KPI Strip */}
        <div style={{ display: 'flex', gap: 0, border: B, marginBottom: 24, background: 'var(--surface)' }}>
          {[
            { label: 'TODAY', value: `$${todayRev.toLocaleString()}`, sub: `${todayOrd.length} orders` },
            { label: 'THIS WEEK', value: `$${weekRev.toLocaleString()}`, sub: '' },
            { label: 'ACTIVE', value: activeOrders.length, sub: 'orders now', color: activeOrders.length > 0 ? '#37ca37' : '#999' },
            { label: 'CUSTOMERS', value: customers.length, sub: 'total' },
            { label: 'CATERING', value: catering.filter(c => c.status === 'New').length, sub: 'pending', color: 'var(--red)' },
          ].map((k, i) => (
            <div key={k.label} style={{ flex: 1, padding: '16px 12px', borderRight: i < 4 ? B : 'none', textAlign: 'center' }}>
              <div style={{ fontFamily: V.font_mono, fontSize: 9, letterSpacing: '0.15em', color: 'var(--muted)', marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontFamily: V.font_display, fontSize: 28, color: k.color || '#000' }}>{k.value}</div>
              {k.sub && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{k.sub}</div>}
            </div>
          ))}
        </div>

        {tab === 'dashboard' && <DashboardTab orders={orders} topItems={topItems} activeOrders={activeOrders} onStatus={handleStatus} customers={customers} />}
        {tab === 'orders' && <OrdersTab orders={orders} onStatus={handleStatus} />}
        {tab === 'menu' && <MenuTab />}
        {tab === 'customers' && <CustomersTab customers={customers} />}
        {tab === 'loyalty' && <LoyaltyTab customers={customers} />}
        {tab === 'catering' && <CateringTab requests={catering} />}
        {tab === 'locations' && <LocationsTab />}
        {tab === 'analytics' && <AnalyticsTab orders={orders} topItems={topItems} weekRev={weekRev} customers={customers} />}
        {tab === 'marketing' && <MarketingTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  )
}

function SectionTitle({ children }) {
  return <div style={{ fontFamily: V.font_display, fontSize: 28, marginBottom: 16 }}>{children}</div>
}

/* ── Dashboard ── */
function DashboardTab({ orders, topItems, activeOrders, onStatus, customers }) {
  return (
    <div>
      <SectionTitle>COMMAND CENTER</SectionTitle>

      {/* Active orders */}
      {activeOrders.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: V.font_display, fontSize: 18, marginBottom: 8, color: 'var(--red)' }}>🔴 ACTIVE ORDERS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 0, border: B }}>
            {activeOrders.map((o, i) => (
              <OrderCard key={o.id} order={o} onStatus={onStatus} borderRight={i < activeOrders.length - 1} />
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Top items */}
        <div style={{ border: B, background: 'var(--surface)' }}>
          <div style={{ padding: '12px 16px', borderBottom: B, fontFamily: V.font_display, fontSize: 18 }}>TOP SELLERS</div>
          {topItems.map((item, i) => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: i < topItems.length - 1 ? B : 'none', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: V.font_display, fontSize: 16, color: i === 0 ? 'var(--red)' : '#ccc', minWidth: 28 }}>#{i + 1}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
              </div>
              <span style={{ fontFamily: V.font_mono, fontSize: 12, color: 'var(--muted)' }}>{item.qty} sold</span>
            </div>
          ))}
        </div>

        {/* Recent customers */}
        <div style={{ border: B, background: 'var(--surface)' }}>
          <div style={{ padding: '12px 16px', borderBottom: B, fontFamily: V.font_display, fontSize: 18 }}>TOP CUSTOMERS</div>
          {customers.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5).map((c, i) => (
            <div key={c.phone} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: i < 4 ? B : 'none', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.orders} orders · {c.loyaltyPoints} pts</div>
              </div>
              <span style={{ fontFamily: V.font_display, fontSize: 18, color: 'var(--red)' }}>${c.totalSpent}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OrderCard({ order: o, onStatus, borderRight }) {
  const statusColors = { New: 'var(--red)', Preparing: '#F5A623', Ready: '#37ca37' }
  const next = { New: 'Preparing', Preparing: 'Ready', Ready: 'Picked Up' }
  return (
    <div style={{ padding: 16, borderRight: borderRight ? B : 'none', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: V.font_mono, fontSize: 13, fontWeight: 600 }}>{o.id}</span>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: statusColors[o.status], color: '#fff' }}>{o.status.toUpperCase()}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{o.name}</div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{o.type} · {o.location} · {timeAgo(o.createdAt)}</div>
      {(o.items || []).map(i => (
        <div key={i.name} style={{ fontSize: 12, color: 'var(--text2)', padding: '1px 0' }}>{i.name} ×{i.qty}</div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <span style={{ fontFamily: V.font_display, fontSize: 22, color: 'var(--red)' }}>${o.total?.toFixed(2)}</span>
        {next[o.status] && <button onClick={() => onStatus(o.id, next[o.status])} style={{ padding: '6px 14px', background: 'var(--red)', color: '#fff', fontFamily: V.font_display, fontSize: 12, border: 'none', cursor: 'pointer' }}>→ {next[o.status].toUpperCase()}</button>}
      </div>
    </div>
  )
}

/* ── Orders ── */
function OrdersTab({ orders, onStatus }) {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter)
  return (
    <div>
      <SectionTitle>ORDERS</SectionTitle>
      <div style={{ display: 'flex', gap: 0, border: B, marginBottom: 16 }}>
        {['All', 'New', 'Preparing', 'Ready', 'Picked Up', 'Delivered'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '10px 16px', fontFamily: V.font_display, fontSize: 14, background: filter === f ? 'var(--red)' : '#fff', color: filter === f ? '#fff' : '#000', borderRight: B, flex: 1 }}>{f.toUpperCase()}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 0, border: B }}>
        {filtered.map((o, i) => <OrderCard key={o.id} order={o} onStatus={onStatus} borderRight={i % 2 === 0} />)}
      </div>
    </div>
  )
}

/* ── Menu ── */
function MenuTab() {
  const [enabled, setEnabled] = useState(() => { const m = {}; MENU.forEach(c => c.items.forEach(i => { m[i.id] = true })); return m })
  return (
    <div>
      <SectionTitle>MENU MANAGEMENT</SectionTitle>
      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Toggle items on/off. Changes appear on the website instantly.</div>
      {MENU.map(cat => (
        <div key={cat.category} style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: V.font_display, fontSize: 20, color: 'var(--red)', marginBottom: 8, borderBottom: B, paddingBottom: 6 }}>{cat.category.toUpperCase()}</div>
          <div style={{ border: B, background: 'var(--surface)' }}>
            {cat.items.map((item, i) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: i < cat.items.length - 1 ? B : 'none' }}>
                <div>
                  <span style={{ fontWeight: 600, color: enabled[item.id] ? '#000' : '#ccc' }}>{item.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 8 }}>${item.price}</span>
                </div>
                <button onClick={() => setEnabled(p => ({ ...p, [item.id]: !p[item.id] }))} style={{ width: 40, height: 22, background: enabled[item.id] ? '#37ca37' : '#ddd', position: 'relative', border: 'none', cursor: 'pointer' }}>
                  <div style={{ width: 18, height: 18, background: 'var(--surface)', position: 'absolute', top: 2, left: enabled[item.id] ? 20 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Customers ── */
function CustomersTab({ customers }) {
  return (
    <div>
      <SectionTitle>CUSTOMERS ({customers.length})</SectionTitle>
      <div style={{ border: B, background: 'var(--surface)' }}>
        <div style={{ display: 'flex', padding: '10px 16px', borderBottom: B, background: 'var(--bg2)' }}>
          <span style={{ flex: 2, fontFamily: V.font_mono, fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted)' }}>NAME</span>
          <span style={{ flex: 1, fontFamily: V.font_mono, fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted)' }}>PHONE</span>
          <span style={{ flex: 1, fontFamily: V.font_mono, fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted)', textAlign: 'center' }}>ORDERS</span>
          <span style={{ flex: 1, fontFamily: V.font_mono, fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted)', textAlign: 'center' }}>SPENT</span>
          <span style={{ flex: 1, fontFamily: V.font_mono, fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted)', textAlign: 'center' }}>POINTS</span>
        </div>
        {customers.sort((a, b) => b.totalSpent - a.totalSpent).map((c, i) => (
          <div key={c.phone} style={{ display: 'flex', padding: '12px 16px', borderBottom: i < customers.length - 1 ? B : 'none', alignItems: 'center' }}>
            <span style={{ flex: 2, fontWeight: 600, fontSize: 14 }}>{c.name}</span>
            <span style={{ flex: 1, fontFamily: V.font_mono, fontSize: 12, color: 'var(--text2)' }}>{c.phone}</span>
            <span style={{ flex: 1, textAlign: 'center', fontSize: 14 }}>{c.orders}</span>
            <span style={{ flex: 1, textAlign: 'center', fontFamily: V.font_display, fontSize: 16, color: 'var(--red)' }}>${c.totalSpent}</span>
            <span style={{ flex: 1, textAlign: 'center', fontFamily: V.font_display, fontSize: 16, color: '#F5A623' }}>{c.loyaltyPoints}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Loyalty ── */
function LoyaltyTab({ customers }) {
  const totalPoints = customers.reduce((s, c) => s + c.loyaltyPoints, 0)
  return (
    <div>
      <SectionTitle>LOYALTY PROGRAM</SectionTitle>
      <div style={{ display: 'flex', gap: 0, border: B, background: 'var(--surface)', marginBottom: 24 }}>
        {[
          { label: 'TOTAL MEMBERS', value: customers.length },
          { label: 'POINTS ISSUED', value: totalPoints.toLocaleString() },
          { label: 'ACTIVE THIS MONTH', value: customers.filter(c => new Date(c.lastOrder) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length },
          { label: 'AVG POINTS', value: Math.round(totalPoints / customers.length) },
        ].map((k, i) => (
          <div key={k.label} style={{ flex: 1, padding: 16, borderRight: i < 3 ? B : 'none', textAlign: 'center' }}>
            <div style={{ fontFamily: V.font_display, fontSize: 28, color: 'var(--red)' }}>{k.value}</div>
            <div style={{ fontFamily: V.font_mono, fontSize: 9, letterSpacing: '0.1em', color: 'var(--muted)' }}>{k.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: V.font_display, fontSize: 20, marginBottom: 8 }}>REWARD TIERS</div>
      <div style={{ border: B, background: 'var(--surface)' }}>
        {[
          { pts: 50, reward: 'Free Drink', cost: '$4 avg', redeemed: 34 },
          { pts: 100, reward: 'Free Taco', cost: '$3 avg', redeemed: 22 },
          { pts: 250, reward: 'Free Plato', cost: '$14 avg', redeemed: 8 },
          { pts: 500, reward: 'Free Family Pack', cost: '$30 avg', redeemed: 2 },
        ].map((r, i) => (
          <div key={r.pts} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: i < 3 ? B : 'none' }}>
            <span style={{ fontFamily: V.font_display, fontSize: 20, color: 'var(--red)', minWidth: 80 }}>{r.pts} PTS</span>
            <span style={{ flex: 1, fontWeight: 600 }}>{r.reward}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)', minWidth: 80 }}>Cost: {r.cost}</span>
            <span style={{ fontFamily: V.font_mono, fontSize: 12, color: '#37ca37' }}>{r.redeemed} redeemed</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Catering ── */
function CateringTab({ requests }) {
  return (
    <div>
      <SectionTitle>CATERING REQUESTS</SectionTitle>
      <div style={{ border: B, background: 'var(--surface)' }}>
        {requests.map((r, i) => (
          <div key={r.id} style={{ padding: 16, borderBottom: i < requests.length - 1 ? B : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: r.status === 'Confirmed' ? '#37ca37' : 'var(--red)', color: '#fff' }}>{r.status.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>📅 {r.date} · 👥 {r.guests} guests · 📞 {r.phone}</div>
            {r.details && <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', marginTop: 4 }}>{r.details}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Locations ── */
function LocationsTab() {
  return (
    <div>
      <SectionTitle>LOCATIONS</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 0, border: B, background: 'var(--surface)' }}>
        {LOCATIONS.map((l, i) => (
          <div key={l.id} style={{ padding: 16, borderRight: i % 2 === 0 ? B : 'none', borderBottom: i < LOCATIONS.length - 2 ? B : 'none' }}>
            <div style={{ fontFamily: V.font_display, fontSize: 20, marginBottom: 4 }}>{l.name.toUpperCase()}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 2 }}>{l.addr}</div>
            <div style={{ fontFamily: V.font_mono, fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>{l.hours}</div>
            <div style={{ fontSize: 13, color: 'var(--red)', fontWeight: 600 }}>{l.phone}</div>
            {l.flag && <div style={{ marginTop: 6, display: 'inline-block', padding: '2px 8px', background: 'var(--red)', color: '#fff', fontSize: 10, fontWeight: 700 }}>{l.flag}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Analytics ── */
function AnalyticsTab({ orders, topItems, weekRev, customers }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dayRevs = days.map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return orders.filter(o => new Date(o.createdAt).toDateString() === d.toDateString()).reduce((s, o) => s + (o.total || 0), 0) })
  const maxRev = Math.max(...dayRevs, 1)
  return (
    <div>
      <SectionTitle>ANALYTICS</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ border: B, background: 'var(--surface)', padding: 20 }}>
          <div style={{ fontFamily: V.font_display, fontSize: 18, marginBottom: 12 }}>REVENUE — ${weekRev.toLocaleString()}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 120 }}>
            {dayRevs.map((rev, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 4 }}>{rev > 0 ? `$${rev}` : ''}</div>
                <div style={{ height: `${Math.max((rev / maxRev) * 80, 4)}px`, background: 'var(--red)', opacity: 0.4 + (rev / maxRev) * 0.6 }} />
                <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 4 }}>{days[i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ border: B, background: 'var(--surface)', padding: 20 }}>
          <div style={{ fontFamily: V.font_display, fontSize: 18, marginBottom: 12 }}>TOP ITEMS</div>
          {topItems.map((item, i) => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ fontSize: 13 }}><span style={{ fontFamily: V.font_display, color: i === 0 ? 'var(--red)' : '#ccc', marginRight: 6 }}>#{i + 1}</span>{item.name}</span>
              <span style={{ fontFamily: V.font_mono, fontSize: 12, color: 'var(--muted)' }}>{item.qty}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ border: B, background: 'var(--surface)', padding: 20 }}>
        <div style={{ fontFamily: V.font_display, fontSize: 18, marginBottom: 12 }}>CUSTOMER OVERVIEW</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 0, border: B }}>
          {[
            { val: customers.length, label: 'TOTAL' },
            { val: `$${customers.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}`, label: 'LIFETIME REV' },
            { val: Math.round(customers.reduce((s, c) => s + c.orders, 0) / customers.length), label: 'AVG ORDERS' },
            { val: `$${Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length)}`, label: 'AVG LTV' },
          ].map((k, i) => (
            <div key={k.label} style={{ padding: 14, borderRight: i < 3 ? B : 'none', textAlign: 'center' }}>
              <div style={{ fontFamily: V.font_display, fontSize: 24, color: 'var(--red)' }}>{k.val}</div>
              <div style={{ fontFamily: V.font_mono, fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Marketing ── */
function MarketingTab() {
  return (
    <div>
      <SectionTitle>MARKETING</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 0, border: B, background: 'var(--surface)' }}>
        {[
          { icon: '📧', title: 'EMAIL BLAST', desc: 'Send promos and updates to all customers', btn: 'CREATE EMAIL' },
          { icon: '📱', title: 'TEXT BLAST', desc: 'SMS specials to your customer list', btn: 'CREATE TEXT' },
          { icon: '📸', title: 'SOCIAL POST', desc: 'Create branded Instagram/Facebook posts', btn: 'CREATE POST' },
          { icon: '🎫', title: 'PROMO CODE', desc: 'Generate discount codes for online orders', btn: 'CREATE CODE' },
        ].map((m, i) => (
          <div key={m.title} style={{ padding: 20, borderRight: i % 2 === 0 ? B : 'none', borderBottom: i < 2 ? B : 'none', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontFamily: V.font_display, fontSize: 18, marginBottom: 4 }}>{m.title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>{m.desc}</div>
            <button style={{ padding: '8px 20px', background: 'var(--red)', color: '#fff', fontFamily: V.font_display, fontSize: 14, border: 'none', cursor: 'pointer' }}>{m.btn}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Settings ── */
function SettingsTab() {
  return (
    <div>
      <SectionTitle>SETTINGS</SectionTitle>
      <div style={{ border: B, background: 'var(--surface)' }}>
        {[
          { label: 'Restaurant Name', value: "Taco Boy's" },
          { label: 'Phone', value: '(602) 675-3962' },
          { label: 'Website', value: 'aztacoboys.com' },
          { label: 'Instagram', value: '@aztacoboys' },
          { label: 'Tax Rate', value: '8.6%' },
          { label: 'Delivery Fee', value: '$4.99' },
          { label: 'Minimum Order (Delivery)', value: '$15.00' },
          { label: 'Online Ordering', value: 'Enabled' },
          { label: 'Loyalty Program', value: 'Active — 1 pt / $1' },
        ].map((s, i) => (
          <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < 8 ? B : 'none' }}>
            <span style={{ fontFamily: V.font_display, fontSize: 14, color: 'var(--muted)' }}>{s.label.toUpperCase()}</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
