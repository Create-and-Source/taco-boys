import { useState, useEffect } from 'react'
import { getOrders, updateOrderStatus, getCustomers, getCateringRequests, getTodayRevenue, getTodayOrders, getWeekRevenue, getTopItems } from '../data/store'

const TABS = ['Orders', 'Customers', 'Catering', 'Menu', 'Analytics']

export default function Admin({ onBack }) {
  const [tab, setTab] = useState('Orders')
  const [orders, setOrders] = useState(getOrders())
  const [customers] = useState(getCustomers())
  const [catering] = useState(getCateringRequests())
  const [tick, setTick] = useState(0)

  // Refresh orders every 5s
  useEffect(() => {
    const iv = setInterval(() => { setOrders(getOrders()); setTick(t => t + 1) }, 5000)
    return () => clearInterval(iv)
  }, [])

  const todayRev = getTodayRevenue()
  const todayOrd = getTodayOrders()
  const weekRev = getWeekRevenue()
  const topItems = getTopItems()
  const activeOrders = orders.filter(o => o.status === 'New' || o.status === 'Preparing' || o.status === 'Ready')
  const totalCustomers = customers.length

  const handleStatus = (id, status) => {
    updateOrderStatus(id, status)
    setOrders(getOrders())
  }

  return (
    <div style={s.wrap}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <button onClick={onBack} style={s.backBtn}>← Store</button>
        <div style={s.sidebarBrand}>TACO <span style={{ color: '#D42B20' }}>BOY'S</span></div>
        <div style={s.sidebarSub}>ADMIN</div>
        <div style={s.sidebarNav}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...s.sidebarLink, background: tab === t ? 'rgba(212,43,32,0.1)' : 'transparent', color: tab === t ? '#D42B20' : '#8a8078' }}>
              {t === 'Orders' && `📋 ${t}`}
              {t === 'Customers' && `👥 ${t}`}
              {t === 'Catering' && `🎉 ${t}`}
              {t === 'Menu' && `📝 ${t}`}
              {t === 'Analytics' && `📊 ${t}`}
              {t === 'Orders' && activeOrders.length > 0 && <span style={s.badge}>{activeOrders.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={s.main}>
        {/* KPI Bar */}
        <div style={s.kpiBar}>
          {[
            { label: 'Today Revenue', value: `$${todayRev.toLocaleString()}`, color: '#D42B20' },
            { label: 'Today Orders', value: todayOrd.length, color: '#F5A623' },
            { label: 'Week Revenue', value: `$${weekRev.toLocaleString()}`, color: '#D42B20' },
            { label: 'Active Orders', value: activeOrders.length, color: activeOrders.length > 0 ? '#4ADE80' : '#5a5450' },
            { label: 'Customers', value: totalCustomers, color: '#F5A623' },
          ].map(k => (
            <div key={k.label} style={s.kpiCard}>
              <div style={{ fontSize: 11, color: '#5a5450', marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: k.color, fontFamily: "'Bebas Neue'" }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'Orders' && <OrdersTab orders={orders} onStatus={handleStatus} />}
        {tab === 'Customers' && <CustomersTab customers={customers} />}
        {tab === 'Catering' && <CateringTab requests={catering} />}
        {tab === 'Menu' && <MenuTab />}
        {tab === 'Analytics' && <AnalyticsTab orders={orders} topItems={topItems} weekRev={weekRev} customers={customers} />}
      </div>
    </div>
  )
}

/* ── Orders Tab ── */
function OrdersTab({ orders, onStatus }) {
  const statusColors = { New: '#D42B20', Preparing: '#F5A623', Ready: '#4ADE80', 'Picked Up': '#5a5450', Delivered: '#5a5450' }
  const nextStatus = { New: 'Preparing', Preparing: 'Ready', Ready: 'Picked Up' }

  return (
    <div>
      <h2 style={s.tabTitle}>Live Orders</h2>
      <div style={s.orderGrid}>
        {orders.map(o => (
          <div key={o.id} style={{ ...s.orderCard, borderLeftColor: statusColors[o.status] || '#2a2a2a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 600, color: '#F5F0E8' }}>{o.id}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: `${statusColors[o.status]}20`, color: statusColors[o.status] }}>{o.status}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#F5F0E8', marginBottom: 2 }}>{o.name}</div>
            <div style={{ fontSize: 12, color: '#5a5450', marginBottom: 8 }}>{o.type} · {o.location} · {timeAgo(o.createdAt)}</div>
            <div style={{ marginBottom: 10 }}>
              {(o.items || []).map(i => (
                <div key={i.name} style={{ fontSize: 12, color: '#8a8078', padding: '2px 0' }}>{i.name} ×{i.qty} — ${(i.price * i.qty).toFixed(2)}</div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: '#D42B20' }}>${o.total?.toFixed(2)}</span>
              {nextStatus[o.status] && (
                <button onClick={() => onStatus(o.id, nextStatus[o.status])} style={s.statusBtn}>
                  Mark {nextStatus[o.status]} →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Customers Tab ── */
function CustomersTab({ customers }) {
  return (
    <div>
      <h2 style={s.tabTitle}>Customers ({customers.length})</h2>
      <div style={s.table}>
        <div style={s.tableHeader}>
          <span style={{ ...s.th, flex: 2 }}>Name</span>
          <span style={s.th}>Phone</span>
          <span style={s.th}>Orders</span>
          <span style={s.th}>Total Spent</span>
          <span style={s.th}>Points</span>
        </div>
        {customers.sort((a, b) => b.totalSpent - a.totalSpent).map(c => (
          <div key={c.phone} style={s.tableRow}>
            <span style={{ ...s.td, flex: 2, fontWeight: 600, color: '#F5F0E8' }}>{c.name}</span>
            <span style={{ ...s.td, fontFamily: "'JetBrains Mono'", fontSize: 12 }}>{c.phone}</span>
            <span style={s.td}>{c.orders}</span>
            <span style={{ ...s.td, color: '#D42B20', fontWeight: 600 }}>${c.totalSpent}</span>
            <span style={{ ...s.td, color: '#F5A623' }}>{c.loyaltyPoints} pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Catering Tab ── */
function CateringTab({ requests }) {
  const statusColors = { New: '#D42B20', Confirmed: '#4ADE80', Completed: '#5a5450' }
  return (
    <div>
      <h2 style={s.tabTitle}>Catering Requests</h2>
      {requests.map(r => (
        <div key={r.id} style={s.caterCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, color: '#F5F0E8' }}>{r.name}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: `${statusColors[r.status] || '#5a5450'}20`, color: statusColors[r.status] || '#5a5450' }}>{r.status}</span>
          </div>
          <div style={{ fontSize: 13, color: '#8a8078', lineHeight: 1.6 }}>
            📅 {r.date} · 👥 {r.guests} guests · 📞 {r.phone}<br />
            {r.details && <span style={{ fontStyle: 'italic' }}>{r.details}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Menu Tab ── */
function MenuTab() {
  const { MENU } = require('../data/menu')
  const [enabled, setEnabled] = useState(() => {
    const map = {}
    MENU.forEach(cat => cat.items.forEach(i => { map[i.id] = true }))
    return map
  })

  return (
    <div>
      <h2 style={s.tabTitle}>Menu Management</h2>
      <div style={{ fontSize: 13, color: '#5a5450', marginBottom: 20 }}>Toggle items on/off. Changes appear on the storefront instantly.</div>
      {MENU.map(cat => (
        <div key={cat.category} style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, color: '#D42B20', letterSpacing: '0.08em', marginBottom: 8 }}>{cat.category}</div>
          {cat.items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1e1e1e' }}>
              <div>
                <span style={{ fontWeight: 600, color: enabled[item.id] ? '#F5F0E8' : '#5a5450' }}>{item.name}</span>
                <span style={{ fontSize: 12, color: '#5a5450', marginLeft: 8 }}>${item.price}</span>
              </div>
              <button onClick={() => setEnabled(p => ({ ...p, [item.id]: !p[item.id] }))} style={{ ...s.toggle, background: enabled[item.id] ? '#D42B20' : '#2a2a2a' }}>
                <div style={{ ...s.toggleKnob, transform: enabled[item.id] ? 'translateX(18px)' : 'translateX(2px)' }} />
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ── Analytics Tab ── */
function AnalyticsTab({ orders, topItems, weekRev, customers }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dayRevs = days.map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return orders.filter(o => new Date(o.createdAt).toDateString() === d.toDateString()).reduce((sum, o) => sum + (o.total || 0), 0)
  })
  const maxRev = Math.max(...dayRevs, 1)

  return (
    <div>
      <h2 style={s.tabTitle}>Analytics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Revenue chart */}
        <div style={s.analyticsCard}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F0E8', marginBottom: 16 }}>This Week — ${weekRev.toLocaleString()}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
            {dayRevs.map((rev, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 9, color: '#5a5450' }}>{rev > 0 ? `$${rev}` : ''}</div>
                <div style={{ width: '100%', height: `${(rev / maxRev) * 80}%`, minHeight: 4, background: '#D42B20', borderRadius: '3px 3px 0 0', opacity: 0.4 + (rev / maxRev) * 0.6 }} />
                <div style={{ fontSize: 9, color: '#5a5450' }}>{days[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top items */}
        <div style={s.analyticsCard}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F0E8', marginBottom: 16 }}>Top Items</div>
          {topItems.map((item, i) => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? '#D42B20' : '#5a5450', minWidth: 20 }}>#{i + 1}</span>
                <span style={{ fontSize: 13, color: '#F5F0E8' }}>{item.name}</span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: '#8a8078' }}>{item.qty} sold</span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer stats */}
      <div style={s.analyticsCard}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F0E8', marginBottom: 12 }}>Customer Overview</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          <div style={{ background: '#1e1e1e', borderRadius: 8, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#F5A623', fontFamily: "'Bebas Neue'" }}>{customers.length}</div>
            <div style={{ fontSize: 11, color: '#5a5450' }}>Total Customers</div>
          </div>
          <div style={{ background: '#1e1e1e', borderRadius: 8, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#D42B20', fontFamily: "'Bebas Neue'" }}>${customers.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}</div>
            <div style={{ fontSize: 11, color: '#5a5450' }}>Lifetime Revenue</div>
          </div>
          <div style={{ background: '#1e1e1e', borderRadius: 8, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#4ADE80', fontFamily: "'Bebas Neue'" }}>{Math.round(customers.reduce((s, c) => s + c.orders, 0) / customers.length)}</div>
            <div style={{ fontSize: 11, color: '#5a5450' }}>Avg Orders/Customer</div>
          </div>
          <div style={{ background: '#1e1e1e', borderRadius: 8, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#F5A623', fontFamily: "'Bebas Neue'" }}>${Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length)}</div>
            <div style={{ fontSize: 11, color: '#5a5450' }}>Avg Lifetime Value</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Helpers ── */
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

/* ── Styles ── */
const s = {
  wrap: { display: 'flex', minHeight: '100vh', background: '#0a0a0a' },
  sidebar: { width: 220, background: '#0e0e0e', borderRight: '1px solid #1e1e1e', padding: '20px 0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column' },
  backBtn: { padding: '8px 20px', fontSize: 12, color: '#5a5450', textAlign: 'left', marginBottom: 16 },
  sidebarBrand: { fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: '0.08em', padding: '0 20px', color: '#F5F0E8' },
  sidebarSub: { fontFamily: "'JetBrains Mono'", fontSize: 9, letterSpacing: '0.2em', color: '#5a5450', padding: '0 20px', marginBottom: 24 },
  sidebarNav: { display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' },
  sidebarLink: { padding: '10px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, textAlign: 'left', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  badge: { background: '#D42B20', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 100 },
  main: { flex: 1, padding: 24, overflowY: 'auto' },
  kpiBar: { display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' },
  kpiCard: { flex: '1 1 150px', background: '#151515', border: '1px solid #1e1e1e', borderRadius: 10, padding: '14px 16px' },
  tabTitle: { fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: '0.05em', color: '#F5F0E8', marginBottom: 16 },
  orderGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 },
  orderCard: { background: '#151515', border: '1px solid #1e1e1e', borderLeft: '3px solid', borderRadius: 10, padding: 16 },
  statusBtn: { padding: '8px 14px', borderRadius: 100, background: '#D42B20', color: '#fff', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer' },
  table: { },
  tableHeader: { display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid #1e1e1e' },
  th: { flex: 1, fontSize: 10, fontWeight: 600, color: '#5a5450', textTransform: 'uppercase', letterSpacing: '0.1em' },
  tableRow: { display: 'flex', gap: 8, padding: '12px 0', borderBottom: '1px solid #1e1e1e', alignItems: 'center' },
  td: { flex: 1, fontSize: 13, color: '#8a8078' },
  caterCard: { background: '#151515', border: '1px solid #1e1e1e', borderRadius: 10, padding: 16, marginBottom: 12 },
  toggle: { width: 40, height: 22, borderRadius: 11, position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease', border: 'none' },
  toggleKnob: { width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, transition: 'transform 0.3s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' },
  analyticsCard: { background: '#151515', border: '1px solid #1e1e1e', borderRadius: 10, padding: 20 },
}
