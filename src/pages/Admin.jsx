import { useState, useEffect } from 'react'
import { getOrders, updateOrderStatus, getCustomers, getCateringRequests, getTodayRevenue, getTodayOrders, getWeekRevenue, getTopItems } from '../data/store'
import { MENU, LOCATIONS, IMG } from '../data/menu'

const B = '1px solid #e5e5e5'
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f2', color: '#1a1a1a' }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 220 : 60, background: '#1a1512', color: '#fff', flexShrink: 0, transition: 'width 0.3s ease', overflow: 'hidden', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 12px', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={IMG.logo} alt="" style={{ height: 28, flexShrink: 0, filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.3))' }} />
          {sidebarOpen && <div>
            <div style={{ fontFamily: V.font_display, fontSize: 16 }}>TACO BOY'S</div>
            <div style={{ fontFamily: V.font_mono, fontSize: 8, color: '#666', letterSpacing: '0.15em' }}>ADMIN</div>
          </div>}
        </div>
        <div style={{ flex: 1, padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SIDEBAR_ITEMS.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', textAlign: 'left', width: '100%',
              background: tab === item.id ? 'rgba(233,61,61,0.15)' : 'transparent',
              color: tab === item.id ? '#D43D2F' : '#999',
              fontSize: 13, fontWeight: tab === item.id ? 700 : 400, whiteSpace: 'nowrap',
              transition: 'all 0.2s', borderLeft: tab === item.id ? '3px solid #D43D2F' : '3px solid transparent',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0, width: 24, textAlign: 'center' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
              {sidebarOpen && item.badge && activeOrders.length > 0 && (
                <span style={{ marginLeft: 'auto', background: '#D43D2F', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 100 }}>{activeOrders.length}</span>
              )}
            </button>
          ))}
        </div>
        <button onClick={onBack} style={{ padding: '14px 12px', borderTop: '1px solid #e5e5e5', fontSize: 12, color: '#666', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>←</span> {sidebarOpen && 'Back to Store'}
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
        {/* KPI Strip */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'TODAY', value: `$${todayRev.toLocaleString()}`, sub: `${todayOrd.length} orders` },
            { label: 'THIS WEEK', value: `$${weekRev.toLocaleString()}`, sub: '' },
            { label: 'ACTIVE', value: activeOrders.length, sub: 'orders now', color: activeOrders.length > 0 ? '#37ca37' : '#999' },
            { label: 'CUSTOMERS', value: customers.length, sub: 'total' },
            { label: 'CATERING', value: catering.filter(c => c.status === 'New').length, sub: 'pending', color: '#D43D2F' },
          ].map((k, i) => (
            <div key={k.label} style={{ flex: '1 1 140px', padding: '16px 12px', textAlign: 'center', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8 }}>
              <div style={{ fontFamily: V.font_mono, fontSize: 9, letterSpacing: '0.15em', color: '#999', marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontFamily: V.font_display, fontSize: 28, color: k.color || '#1a1a1a' }}>{k.value}</div>
              {k.sub && <div style={{ fontSize: 11, color: '#999' }}>{k.sub}</div>}
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
          <div style={{ fontFamily: V.font_display, fontSize: 18, marginBottom: 8, color: '#D43D2F' }}>🔴 ACTIVE ORDERS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {activeOrders.map((o, i) => (
              <OrderCard key={o.id} order={o} onStatus={onStatus}  />
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Top items */}
        <div style={{ border: B, background: '#fff' }}>
          <div style={{ padding: '12px 16px', borderBottom: B, fontFamily: V.font_display, fontSize: 18 }}>TOP SELLERS</div>
          {topItems.map((item, i) => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: i < topItems.length - 1 ? B : 'none', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: V.font_display, fontSize: 16, color: i === 0 ? '#D43D2F' : '#999', minWidth: 28 }}>#{i + 1}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
              </div>
              <span style={{ fontFamily: V.font_mono, fontSize: 12, color: '#999' }}>{item.qty} sold</span>
            </div>
          ))}
        </div>

        {/* Recent customers */}
        <div style={{ border: B, background: '#fff' }}>
          <div style={{ padding: '12px 16px', borderBottom: B, fontFamily: V.font_display, fontSize: 18 }}>TOP CUSTOMERS</div>
          {customers.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5).map((c, i) => (
            <div key={c.phone} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: i < 4 ? B : 'none', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#999' }}>{c.orders} orders · {c.loyaltyPoints} pts</div>
              </div>
              <span style={{ fontFamily: V.font_display, fontSize: 18, color: '#D43D2F' }}>${c.totalSpent}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OrderCard({ order: o, onStatus }) {
  const statusColors = { New: '#D43D2F', Preparing: '#F5A623', Ready: '#37ca37', 'Picked Up': '#999', Delivered: '#999' }
  const next = { New: 'Preparing', Preparing: 'Ready', Ready: 'Picked Up' }
  return (
    <div style={{ padding: 16, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, borderLeft: `3px solid ${statusColors[o.status] || '#e5e5e5'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: V.font_mono, fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{o.id}</span>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', background: statusColors[o.status] || '#999', color: '#fff', borderRadius: 4 }}>{o.status.toUpperCase()}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 2 }}>{o.name}</div>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{o.type} · {o.location} · {timeAgo(o.createdAt)}</div>
      {(o.items || []).map(i => (
        <div key={i.name} style={{ fontSize: 13, color: '#444', padding: '2px 0' }}>{i.name} ×{i.qty} — <span style={{ color: '#888' }}>${(i.price * i.qty).toFixed(2)}</span></div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid #f0f0f0' }}>
        <span style={{ fontFamily: V.font_display, fontSize: 22, color: '#D43D2F' }}>${o.total?.toFixed(2)}</span>
        {next[o.status] && <button onClick={() => onStatus(o.id, next[o.status])} style={{ padding: '8px 16px', background: '#D43D2F', color: '#fff', fontFamily: V.font_display, fontSize: 13, border: 'none', cursor: 'pointer', borderRadius: 6 }}>→ {next[o.status].toUpperCase()}</button>}
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
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {['All', 'New', 'Preparing', 'Ready', 'Picked Up', 'Delivered'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '10px 16px', fontFamily: V.font_display, fontSize: 14, background: filter === f ? '#D43D2F' : '#fff', color: filter === f ? '#fff' : '#1a1a1a', borderRight: '1px solid #e5e5e5', flex: 1 }}>{f.toUpperCase()}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
        {filtered.map((o, i) => <OrderCard key={o.id} order={o} onStatus={onStatus}  />)}
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
      <div style={{ fontSize: 13, color: '#999', marginBottom: 20 }}>Toggle items on/off. Changes appear on the website instantly.</div>
      {MENU.map(cat => (
        <div key={cat.category} style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: V.font_display, fontSize: 20, color: '#D43D2F', marginBottom: 8, borderBottom: B, paddingBottom: 6 }}>{cat.category.toUpperCase()}</div>
          <div style={{ border: B, background: '#fff' }}>
            {cat.items.map((item, i) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: i < cat.items.length - 1 ? B : 'none' }}>
                <div>
                  <span style={{ fontWeight: 600, color: enabled[item.id] ? '#1a1a1a' : '#999' }}>{item.name}</span>
                  <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>${item.price}</span>
                </div>
                <button onClick={() => setEnabled(p => ({ ...p, [item.id]: !p[item.id] }))} style={{ width: 40, height: 22, background: enabled[item.id] ? '#37ca37' : '#ddd', position: 'relative', border: 'none', cursor: 'pointer' }}>
                  <div style={{ width: 18, height: 18, background: '#fff', position: 'absolute', top: 2, left: enabled[item.id] ? 20 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
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
      <div style={{ border: B, background: '#fff' }}>
        <div style={{ display: 'flex', padding: '10px 16px', borderBottom: B, background: '#f0f0ee' }}>
          <span style={{ flex: 2, fontFamily: V.font_mono, fontSize: 10, letterSpacing: '0.1em', color: '#999' }}>NAME</span>
          <span style={{ flex: 1, fontFamily: V.font_mono, fontSize: 10, letterSpacing: '0.1em', color: '#999' }}>PHONE</span>
          <span style={{ flex: 1, fontFamily: V.font_mono, fontSize: 10, letterSpacing: '0.1em', color: '#999', textAlign: 'center' }}>ORDERS</span>
          <span style={{ flex: 1, fontFamily: V.font_mono, fontSize: 10, letterSpacing: '0.1em', color: '#999', textAlign: 'center' }}>SPENT</span>
          <span style={{ flex: 1, fontFamily: V.font_mono, fontSize: 10, letterSpacing: '0.1em', color: '#999', textAlign: 'center' }}>POINTS</span>
        </div>
        {customers.sort((a, b) => b.totalSpent - a.totalSpent).map((c, i) => (
          <div key={c.phone} style={{ display: 'flex', padding: '12px 16px', borderBottom: i < customers.length - 1 ? B : 'none', alignItems: 'center' }}>
            <span style={{ flex: 2, fontWeight: 600, fontSize: 14 }}>{c.name}</span>
            <span style={{ flex: 1, fontFamily: V.font_mono, fontSize: 12, color: '#666' }}>{c.phone}</span>
            <span style={{ flex: 1, textAlign: 'center', fontSize: 14 }}>{c.orders}</span>
            <span style={{ flex: 1, textAlign: 'center', fontFamily: V.font_display, fontSize: 16, color: '#D43D2F' }}>${c.totalSpent}</span>
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
      <div style={{ display: 'flex', gap: 12, background: '#fff', marginBottom: 24 }}>
        {[
          { label: 'TOTAL MEMBERS', value: customers.length },
          { label: 'POINTS ISSUED', value: totalPoints.toLocaleString() },
          { label: 'ACTIVE THIS MONTH', value: customers.filter(c => new Date(c.lastOrder) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length },
          { label: 'AVG POINTS', value: Math.round(totalPoints / customers.length) },
        ].map((k, i) => (
          <div key={k.label} style={{ flex: 1, padding: 16, borderRight: i < 3 ? B : 'none', textAlign: 'center' }}>
            <div style={{ fontFamily: V.font_display, fontSize: 28, color: '#D43D2F' }}>{k.value}</div>
            <div style={{ fontFamily: V.font_mono, fontSize: 9, letterSpacing: '0.1em', color: '#999' }}>{k.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: V.font_display, fontSize: 20, marginBottom: 8 }}>REWARD TIERS</div>
      <div style={{ border: B, background: '#fff' }}>
        {[
          { pts: 50, reward: 'Free Drink', cost: '$4 avg', redeemed: 34 },
          { pts: 100, reward: 'Free Taco', cost: '$3 avg', redeemed: 22 },
          { pts: 250, reward: 'Free Plato', cost: '$14 avg', redeemed: 8 },
          { pts: 500, reward: 'Free Family Pack', cost: '$30 avg', redeemed: 2 },
        ].map((r, i) => (
          <div key={r.pts} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: i < 3 ? B : 'none' }}>
            <span style={{ fontFamily: V.font_display, fontSize: 20, color: '#D43D2F', minWidth: 80 }}>{r.pts} PTS</span>
            <span style={{ flex: 1, fontWeight: 600 }}>{r.reward}</span>
            <span style={{ fontSize: 12, color: '#999', minWidth: 80 }}>Cost: {r.cost}</span>
            <span style={{ fontFamily: V.font_mono, fontSize: 12, color: '#37ca37' }}>{r.redeemed} redeemed</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Catering ── */
function CateringTab({ requests }) {
  const [expanded, setExpanded] = useState(null)
  return (
    <div>
      <SectionTitle>CATERING REQUESTS</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {requests.map((r) => (
          <div key={r.id} onClick={() => setExpanded(expanded === r.id ? null : r.id)} style={{ padding: 20, border: '1px solid #e5e5e5', background: '#fff', borderRadius: 8, cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: expanded === r.id ? '0 4px 20px rgba(0,0,0,0.08)' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: V.font_display, fontWeight: 700, fontSize: 18 }}>{r.name}</span>
                <span style={{ fontFamily: V.font_mono, fontSize: 11, color: '#999' }}>{r.id}</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', background: r.status === 'Confirmed' ? '#37ca37' : r.status === 'New' ? '#D43D2F' : '#999', color: '#fff', borderRadius: 4 }}>{r.status.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: 14, color: '#444', marginBottom: 4 }}>📅 {r.date} · 👥 {r.guests} guests</div>
            <div style={{ fontSize: 13, color: '#666' }}>📞 {r.phone} · ✉️ {r.email || 'No email'}</div>

            {expanded === r.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #eee' }}>
                <div style={{ fontFamily: V.font_display, fontSize: 14, color: '#999', marginBottom: 6 }}>EVENT DETAILS</div>
                <div style={{ fontSize: 14, color: '#333', lineHeight: 1.7, marginBottom: 16 }}>
                  {r.details || 'No additional details provided.'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div style={{ background: '#f5f5f2', borderRadius: 6, padding: 12 }}>
                    <div style={{ fontFamily: V.font_mono, fontSize: 9, color: '#999', letterSpacing: '0.1em', marginBottom: 4 }}>EVENT DATE</div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{r.date}</div>
                  </div>
                  <div style={{ background: '#f5f5f2', borderRadius: 6, padding: 12 }}>
                    <div style={{ fontFamily: V.font_mono, fontSize: 9, color: '#999', letterSpacing: '0.1em', marginBottom: 4 }}>GUEST COUNT</div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{r.guests}</div>
                  </div>
                  <div style={{ background: '#f5f5f2', borderRadius: 6, padding: 12 }}>
                    <div style={{ fontFamily: V.font_mono, fontSize: 9, color: '#999', letterSpacing: '0.1em', marginBottom: 4 }}>CONTACT</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{r.phone}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{r.email || '—'}</div>
                  </div>
                  <div style={{ background: '#f5f5f2', borderRadius: 6, padding: 12 }}>
                    <div style={{ fontFamily: V.font_mono, fontSize: 9, color: '#999', letterSpacing: '0.1em', marginBottom: 4 }}>SUBMITTED</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={e => { e.stopPropagation(); alert('Catering request confirmed! Customer will be notified.') }} style={{ padding: '10px 20px', background: '#37ca37', color: '#fff', fontFamily: V.font_display, fontSize: 14, border: 'none', cursor: 'pointer', borderRadius: 6 }}>CONFIRM</button>
                  <button onClick={e => { e.stopPropagation(); alert(`Calling ${r.phone}...`) }} style={{ padding: '10px 20px', background: '#fff', color: '#1a1a1a', fontFamily: V.font_display, fontSize: 14, border: '1px solid #e5e5e5', cursor: 'pointer', borderRadius: 6 }}>CALL CUSTOMER</button>
                  <button onClick={e => { e.stopPropagation(); alert(`Email sent to ${r.email || r.phone}`) }} style={{ padding: '10px 20px', background: '#fff', color: '#1a1a1a', fontFamily: V.font_display, fontSize: 14, border: '1px solid #e5e5e5', cursor: 'pointer', borderRadius: 6 }}>SEND EMAIL</button>
                </div>
              </div>
            )}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12, background: '#fff' }}>
        {LOCATIONS.map((l, i) => (
          <div key={l.id} style={{ padding: 16, borderRight: i % 2 === 0 ? B : 'none', borderBottom: i < LOCATIONS.length - 2 ? B : 'none' }}>
            <div style={{ fontFamily: V.font_display, fontSize: 20, marginBottom: 4 }}>{l.name.toUpperCase()}</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 2 }}>{l.addr}</div>
            <div style={{ fontFamily: V.font_mono, fontSize: 10, color: '#999', marginBottom: 2 }}>{l.hours}</div>
            <div style={{ fontSize: 13, color: '#D43D2F', fontWeight: 600 }}>{l.phone}</div>
            {l.flag && <div style={{ marginTop: 6, display: 'inline-block', padding: '2px 8px', background: '#D43D2F', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 4 }}>{l.flag}</div>}
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
        <div style={{ border: B, background: '#fff', padding: 20 }}>
          <div style={{ fontFamily: V.font_display, fontSize: 18, marginBottom: 12 }}>REVENUE — ${weekRev.toLocaleString()}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 120 }}>
            {dayRevs.map((rev, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#999', marginBottom: 4 }}>{rev > 0 ? `$${rev}` : ''}</div>
                <div style={{ height: `${Math.max((rev / maxRev) * 80, 4)}px`, background: '#D43D2F', opacity: 0.4 + (rev / maxRev) * 0.6 }} />
                <div style={{ fontSize: 9, color: '#999', marginTop: 4 }}>{days[i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ border: B, background: '#fff', padding: 20 }}>
          <div style={{ fontFamily: V.font_display, fontSize: 18, marginBottom: 12 }}>TOP ITEMS</div>
          {topItems.map((item, i) => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ fontSize: 13 }}><span style={{ fontFamily: V.font_display, color: i === 0 ? '#D43D2F' : '#999', marginRight: 6 }}>#{i + 1}</span>{item.name}</span>
              <span style={{ fontFamily: V.font_mono, fontSize: 12, color: '#999' }}>{item.qty}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ border: B, background: '#fff', padding: 20 }}>
        <div style={{ fontFamily: V.font_display, fontSize: 18, marginBottom: 12 }}>CUSTOMER OVERVIEW</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {[
            { val: customers.length, label: 'TOTAL' },
            { val: `$${customers.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}`, label: 'LIFETIME REV' },
            { val: Math.round(customers.reduce((s, c) => s + c.orders, 0) / customers.length), label: 'AVG ORDERS' },
            { val: `$${Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length)}`, label: 'AVG LTV' },
          ].map((k, i) => (
            <div key={k.label} style={{ padding: 14, borderRight: i < 3 ? B : 'none', textAlign: 'center' }}>
              <div style={{ fontFamily: V.font_display, fontSize: 24, color: '#D43D2F' }}>{k.val}</div>
              <div style={{ fontFamily: V.font_mono, fontSize: 9, color: '#999', letterSpacing: '0.1em' }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Marketing ── */
function MarketingTab() {
  const [mode, setMode] = useState(null) // null, 'email', 'text', 'social', 'promo'
  const [emailStep, setEmailStep] = useState(1)
  const [template, setTemplate] = useState(null)
  const [audience, setAudience] = useState(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)

  const TEMPLATES = [
    { id: 'promo', icon: '🔥', name: 'Taco Tuesday Promo', subject: '$2 Tacos All Day — This Tuesday!', body: 'Hey there,\n\nThis Tuesday is TACO TUESDAY at all 6 Taco Boy\'s locations.\n\n$2 tacos. All proteins. All day.\n\nCarne asada, al pastor, pollo, barbacoa, carnitas, cabeza — all $2.\n\nBring the crew. See you Tuesday.\n\n— Taco Boy\'s' },
    { id: 'special', icon: '🎉', name: 'Happy Hour', subject: 'Happy Hour — Half-Price Drafts & $6 Margs', body: 'Hey there,\n\nHappy Hour is calling.\n\nMon–Fri, 3–6pm at Mill Ave & Roosevelt:\n- Half-price drafts (20 taps at Mill Ave!)\n- $6 margaritas\n- Full menu available\n\nGrab a friend. Grab a marg. We\'ll handle the tacos.\n\n— Taco Boy\'s' },
    { id: 'new', icon: '✨', name: 'New Menu Item', subject: 'NEW: Mixed Grill Family Pack', body: 'Hey there,\n\nNew on the menu: the Mixed Grill Pack.\n\n2 lbs of mixed meats (you pick), 20 handmade tortillas, rice, beans, and our full salsa bar setup. Feeds 4-6.\n\nOnly $45.\n\nOrder online or grab one at any location.\n\n— Taco Boy\'s' },
    { id: 'loyalty', icon: '🌮', name: 'Loyalty Reminder', subject: 'You\'ve Got Points — Redeem for Free Food', body: 'Hey there,\n\nJust a heads up — you\'ve been racking up points.\n\n50 pts = Free drink\n100 pts = Free taco\n250 pts = Free plato\n\nCheck your rewards balance in the app and redeem at any location.\n\nKeep eating. Keep earning.\n\n— Taco Boy\'s' },
    { id: 'blank', icon: '📝', name: 'Start From Scratch', subject: '', body: '' },
  ]

  const AUDIENCES = [
    { id: 'all', name: 'Everyone', desc: 'All customers on your list', count: 847 },
    { id: 'recent', name: 'Recent Customers', desc: 'Ordered in the last 30 days', count: 234 },
    { id: 'loyalty', name: 'Loyalty Members', desc: 'Signed up for rewards', count: 412 },
    { id: 'inactive', name: 'Inactive', desc: 'Haven\'t ordered in 60+ days', count: 156 },
  ]

  if (sent) return (
    <div>
      <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
        <div style={{ fontFamily: V.font_display, fontSize: 32, marginBottom: 8 }}>SENT!</div>
        <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>Email delivered to {AUDIENCES.find(a => a.id === audience)?.count || 0} customers.</div>
        <div style={{ color: '#999', fontSize: 13, marginBottom: 24 }}>Subject: {subject}</div>
        <button onClick={() => { setSent(false); setMode(null); setEmailStep(1); setTemplate(null); setAudience(null); setSubject(''); setBody('') }} style={{ padding: '10px 24px', background: '#D43D2F', color: '#fff', fontFamily: V.font_display, fontSize: 14, border: 'none', cursor: 'pointer', borderRadius: 6 }}>BACK TO MARKETING</button>
      </div>
    </div>
  )

  if (mode === 'text') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <SectionTitle>TEXT BLAST</SectionTitle>
        <button onClick={() => setMode(null)} style={{ fontFamily: V.font_display, fontSize: 14, color: '#999' }}>← BACK</button>
      </div>
      {!sent ? (
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: 24, maxWidth: 600 }}>
          {/* Quick templates */}
          <div style={{ fontFamily: V.font_display, fontSize: 14, color: '#999', marginBottom: 8 }}>QUICK TEMPLATES</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {[
              { label: '🔥 Taco Tuesday', msg: '🌮 TACO TUESDAY! $2 tacos all day at all 6 Taco Boy\'s locations. All proteins. No limits. See you today!' },
              { label: '🍹 Happy Hour', msg: '🍹 Happy Hour 3-6pm! Half-price drafts & $6 margs at Mill Ave & Roosevelt. Tacos + margs = perfection.' },
              { label: '🆕 New Item', msg: '🆕 NEW on the menu: Mixed Grill Pack! 2 lbs of meats, 20 tortillas, full salsa bar. $45. Order now at aztacoboys.com' },
              { label: '🎁 Points', msg: '🌮 You\'ve got points! Redeem for free tacos, drinks, and platos at any Taco Boy\'s. Check your rewards balance now.' },
            ].map(t => (
              <button key={t.label} onClick={() => setBody(t.msg)} style={{ padding: '8px 14px', background: body === t.msg ? '#D43D2F' : '#f5f5f2', color: body === t.msg ? '#fff' : '#1a1a1a', border: '1px solid #e5e5e5', borderRadius: 6, fontSize: 12, fontFamily: V.font_display, cursor: 'pointer' }}>{t.label}</button>
            ))}
          </div>
          {/* Audience */}
          <div style={{ fontFamily: V.font_display, fontSize: 14, color: '#999', marginBottom: 8 }}>SEND TO</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {AUDIENCES.map(a => (
              <button key={a.id} onClick={() => setAudience(a.id)} style={{ padding: '8px 14px', background: audience === a.id ? '#D43D2F' : '#f5f5f2', color: audience === a.id ? '#fff' : '#1a1a1a', border: '1px solid #e5e5e5', borderRadius: 6, fontSize: 12, fontFamily: V.font_display, cursor: 'pointer' }}>{a.name.toUpperCase()} ({a.count})</button>
            ))}
          </div>
          {/* Message */}
          <div style={{ fontFamily: V.font_display, fontSize: 14, color: '#999', marginBottom: 8 }}>MESSAGE ({body.length}/160)</div>
          <textarea value={body} onChange={e => setBody(e.target.value.slice(0, 160))} rows={4} placeholder="Type your text message..." style={{ width: '100%', padding: '14px', border: '1px solid #e5e5e5', borderRadius: 6, fontSize: 15, color: '#1a1a1a', fontFamily: "'Albert Sans'", lineHeight: 1.5, resize: 'none', marginBottom: 16 }} />
          {/* Preview */}
          {body && (
            <div style={{ background: '#f5f5f2', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ fontFamily: V.font_display, fontSize: 12, color: '#999', marginBottom: 6 }}>PREVIEW</div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 14, fontSize: 14, color: '#1a1a1a', lineHeight: 1.5, maxWidth: 280, border: '1px solid #e5e5e5' }}>{body}</div>
            </div>
          )}
          <button onClick={() => { if (body && audience) setSent(true); else alert('Pick an audience and write a message first.') }} style={{ padding: '12px 32px', background: '#D43D2F', color: '#fff', fontFamily: V.font_display, fontSize: 16, border: 'none', cursor: 'pointer', borderRadius: 6 }}>SEND TEXT TO {AUDIENCES.find(a => a.id === audience)?.count || '—'} CUSTOMERS</button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📱</div>
          <div style={{ fontFamily: V.font_display, fontSize: 32, marginBottom: 8 }}>TEXT SENT!</div>
          <div style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>Delivered to {AUDIENCES.find(a => a.id === audience)?.count || 0} customers.</div>
          <button onClick={() => { setSent(false); setMode(null); setBody(''); setAudience(null) }} style={{ padding: '10px 24px', background: '#D43D2F', color: '#fff', fontFamily: V.font_display, fontSize: 14, border: 'none', cursor: 'pointer', borderRadius: 6 }}>BACK TO MARKETING</button>
        </div>
      )}
    </div>
  )

  if (mode === 'email') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <SectionTitle>CREATE EMAIL</SectionTitle>
        <button onClick={() => { setMode(null); setEmailStep(1) }} style={{ fontFamily: V.font_display, fontSize: 14, color: '#999' }}>← BACK</button>
      </div>
      {/* Steps */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['Template', 'Audience', 'Write', 'Send'].map((s, i) => (
          <div key={s} style={{ flex: 1, padding: '8px 0', textAlign: 'center', fontFamily: V.font_display, fontSize: 13, background: emailStep > i ? '#D43D2F' : emailStep === i + 1 ? '#fff' : '#f0f0ee', color: emailStep > i ? '#fff' : '#1a1a1a', border: '1px solid #e5e5e5', borderRadius: 4 }}>{i + 1}. {s}</div>
        ))}
      </div>

      {emailStep === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {TEMPLATES.map(t => (
            <button key={t.id} onClick={() => { setTemplate(t.id); setSubject(t.subject); setBody(t.body); setEmailStep(2) }} style={{ padding: 20, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontFamily: V.font_display, fontSize: 16, color: '#1a1a1a', marginBottom: 4 }}>{t.name.toUpperCase()}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{t.subject || 'Empty template'}</div>
            </button>
          ))}
        </div>
      )}

      {emailStep === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {AUDIENCES.map(a => (
            <button key={a.id} onClick={() => { setAudience(a.id); setEmailStep(3) }} style={{ padding: 20, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ fontFamily: V.font_display, fontSize: 16, color: '#1a1a1a', marginBottom: 4 }}>{a.name.toUpperCase()}</div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{a.desc}</div>
              <div style={{ fontFamily: V.font_display, fontSize: 20, color: '#D43D2F' }}>{a.count}</div>
            </button>
          ))}
        </div>
      )}

      {emailStep === 3 && (
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: V.font_display, fontSize: 12, color: '#999', display: 'block', marginBottom: 4 }}>SUBJECT LINE</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e5e5', borderRadius: 6, fontSize: 15, color: '#1a1a1a', fontFamily: "'Albert Sans'" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: V.font_display, fontSize: 12, color: '#999', display: 'block', marginBottom: 4 }}>EMAIL BODY</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={12} style={{ width: '100%', padding: '14px', border: '1px solid #e5e5e5', borderRadius: 6, fontSize: 14, color: '#1a1a1a', fontFamily: "'Albert Sans'", lineHeight: 1.6, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setEmailStep(2)} style={{ fontFamily: V.font_display, fontSize: 14, color: '#999' }}>← BACK</button>
            <button onClick={() => setEmailStep(4)} style={{ padding: '10px 24px', background: '#D43D2F', color: '#fff', fontFamily: V.font_display, fontSize: 14, border: 'none', cursor: 'pointer', borderRadius: 6 }}>PREVIEW & SEND →</button>
          </div>
        </div>
      )}

      {emailStep === 4 && (
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: 24 }}>
          <div style={{ fontFamily: V.font_display, fontSize: 18, marginBottom: 16 }}>REVIEW & SEND</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: '#f5f5f2', borderRadius: 6, padding: 12 }}>
              <div style={{ fontFamily: V.font_mono, fontSize: 9, color: '#999', letterSpacing: '0.1em', marginBottom: 4 }}>AUDIENCE</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{AUDIENCES.find(a => a.id === audience)?.name} ({AUDIENCES.find(a => a.id === audience)?.count})</div>
            </div>
            <div style={{ background: '#f5f5f2', borderRadius: 6, padding: 12 }}>
              <div style={{ fontFamily: V.font_mono, fontSize: 9, color: '#999', letterSpacing: '0.1em', marginBottom: 4 }}>TEMPLATE</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{TEMPLATES.find(t => t.id === template)?.name}</div>
            </div>
          </div>
          <div style={{ background: '#f5f5f2', borderRadius: 6, padding: 16, marginBottom: 16 }}>
            <div style={{ fontFamily: V.font_display, fontSize: 14, color: '#999', marginBottom: 4 }}>SUBJECT</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{subject}</div>
          </div>
          <div style={{ background: '#f5f5f2', borderRadius: 6, padding: 16, marginBottom: 20 }}>
            <div style={{ fontFamily: V.font_display, fontSize: 14, color: '#999', marginBottom: 8 }}>PREVIEW</div>
            <div style={{ fontSize: 14, color: '#333', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{body}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setEmailStep(3)} style={{ fontFamily: V.font_display, fontSize: 14, color: '#999' }}>← EDIT</button>
            <button onClick={() => setSent(true)} style={{ padding: '12px 32px', background: '#D43D2F', color: '#fff', fontFamily: V.font_display, fontSize: 16, border: 'none', cursor: 'pointer', borderRadius: 6 }}>SEND TO {AUDIENCES.find(a => a.id === audience)?.count} CUSTOMERS</button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div>
      <SectionTitle>MARKETING</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
        {[
          { id: 'email', icon: '📧', title: 'EMAIL BLAST', desc: 'Pick a template, choose your audience, write your message, send.', btn: 'CREATE EMAIL' },
          { id: 'text', icon: '📱', title: 'TEXT BLAST', desc: 'SMS specials and promos to your customer list.', btn: 'CREATE TEXT' },
          { id: 'social', icon: '📸', title: 'SOCIAL POST', desc: 'Create branded posts for Instagram and Facebook.', btn: 'CREATE POST' },
          { id: 'promo', icon: '🎫', title: 'PROMO CODE', desc: 'Generate discount codes for online orders.', btn: 'CREATE CODE' },
        ].map((m) => (
          <div key={m.id} style={{ padding: 24, textAlign: 'center', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{m.icon}</div>
            <div style={{ fontFamily: V.font_display, fontSize: 18, marginBottom: 6, color: '#1a1a1a' }}>{m.title}</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 16, lineHeight: 1.5 }}>{m.desc}</div>
            <button onClick={() => (m.id === 'email' || m.id === 'text') ? setMode(m.id) : alert(`${m.title} — coming soon!`)} style={{ padding: '10px 24px', background: '#D43D2F', color: '#fff', fontFamily: V.font_display, fontSize: 14, border: 'none', cursor: 'pointer', borderRadius: 6 }}>{m.btn}</button>
          </div>
        ))}
      </div>

      {/* Sent history */}
      <div style={{ marginTop: 32 }}>
        <div style={{ fontFamily: V.font_display, fontSize: 20, marginBottom: 12 }}>RECENT CAMPAIGNS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { subject: '$2 Tacos All Day — This Tuesday!', date: 'Mar 15', audience: 'Everyone', opens: '42%', clicks: '12%' },
            { subject: 'New: Mixed Grill Family Pack', date: 'Mar 8', audience: 'Loyalty Members', opens: '56%', clicks: '18%' },
            { subject: 'Happy Hour — Half-Price Drafts', date: 'Mar 1', audience: 'Recent Customers', opens: '38%', clicks: '9%' },
          ].map(c => (
            <div key={c.subject} style={{ padding: 16, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{c.subject}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{c.date} · {c.audience}</div>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                <span style={{ color: '#37ca37', fontWeight: 600 }}>{c.opens} opens</span>
                <span style={{ color: '#D43D2F', fontWeight: 600 }}>{c.clicks} clicks</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Settings ── */
function SettingsTab() {
  return (
    <div>
      <SectionTitle>SETTINGS</SectionTitle>
      <div style={{ border: B, background: '#fff' }}>
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
            <span style={{ fontFamily: V.font_display, fontSize: 14, color: '#999' }}>{s.label.toUpperCase()}</span>
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
