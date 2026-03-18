import { useState } from 'react'
import { IMG } from '../data/menu'

const B = '1px solid #e5e5e5'
const V = { font_display: "'Squada One', cursive", font_body: "'Albert Sans', sans-serif", font_mono: "'JetBrains Mono', monospace" }

// Demo member data
const MEMBER = {
  name: 'Marcus T.',
  phone: '(480) 555-0142',
  email: 'marcus@email.com',
  since: 'June 2024',
  points: 412,
  tier: 'REGULAR',
  nextTier: { name: 'VIP', at: 500 },
  favoriteLocation: 'Roosevelt Row',
  favorites: ['Carne Asada', 'Carne Asada Fries', 'Horchata'],
  rewards: [
    { name: 'Free Drink', pts: 50, redeemed: true },
    { name: 'Free Taco', pts: 100, redeemed: true },
    { name: 'Free Taco', pts: 100, redeemed: true },
    { name: 'Free Plato', pts: 250, redeemed: false, available: true },
  ],
  orders: [
    { id: 'TB-1047', date: 'Mar 17, 2026', items: 'Carne Asada ×4, Al Pastor ×2, Horchata ×2', total: 26, location: 'Roosevelt Row', status: 'Ready' },
    { id: 'TB-1038', date: 'Mar 10, 2026', items: 'Carne Asada Fries, Carne Asada ×3, Mexican Coke ×2', total: 25, location: 'Roosevelt Row', status: 'Picked Up' },
    { id: 'TB-1024', date: 'Mar 3, 2026', items: 'Taco Family Pack (12), Chips & Guac', total: 36, location: 'Roosevelt Row', status: 'Picked Up' },
    { id: 'TB-1011', date: 'Feb 22, 2026', items: 'Carne Asada Burrito ×2, Mangonada ×2', total: 32, location: 'Tempe — Mill Ave', status: 'Picked Up' },
    { id: 'TB-0998', date: 'Feb 15, 2026', items: 'Al Pastor ×6, Elote ×2, Agua Fresca ×3', total: 40, location: 'Roosevelt Row', status: 'Picked Up' },
  ],
}

const TABS = ['Dashboard', 'Orders', 'Rewards', 'Favorites', 'Profile']

export default function MemberPortal({ onBack }) {
  const [tab, setTab] = useState('Dashboard')
  const [member] = useState(MEMBER)

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Header */}
      <div style={{ borderBottom: B, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={IMG.logo} alt="Taco Boy's" style={{ height: 32 }} />
          <span style={{ fontFamily: V.font_display, fontSize: 14, color: '#999' }}>REWARDS</span>
        </div>
        <button onClick={onBack} style={{ fontFamily: V.font_display, fontSize: 14, color: 'var(--red)' }}>← BACK TO MENU</button>
      </div>

      {/* Welcome */}
      <div style={{ background: '#1a1512', color: '#fff', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 28, fontFamily: V.font_display }}>{member.name.charAt(0)}</div>
        <div style={{ fontFamily: V.font_display, fontSize: 32 }}>WELCOME BACK, {member.name.split(' ')[0].toUpperCase()}</div>
        <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Member since {member.since} · {member.favoriteLocation}</div>
        <div style={{ display: 'inline-flex', gap: 0, border: '1px solid #D43D2F', marginTop: 20 }}>
          <div style={{ padding: '12px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: V.font_display, fontSize: 36, color: 'var(--red)' }}>{member.points}</div>
            <div style={{ fontSize: 10, color: '#999', letterSpacing: '0.1em' }}>POINTS</div>
          </div>
          <div style={{ padding: '12px 24px', borderLeft: '1px solid #D43D2F', textAlign: 'center' }}>
            <div style={{ fontFamily: V.font_display, fontSize: 36, color: '#fff' }}>{member.tier}</div>
            <div style={{ fontSize: 10, color: '#999', letterSpacing: '0.1em' }}>TIER</div>
          </div>
        </div>
        {/* Progress to next tier */}
        <div style={{ maxWidth: 300, margin: '16px auto 0' }}>
          <div style={{ height: 8, background: '#333', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(member.points / member.nextTier.at) * 100}%`, background: 'var(--red)', transition: 'width 1s ease' }} />
          </div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{member.nextTier.at - member.points} pts to {member.nextTier.name}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: B, background: '#f5f5f5', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '14px 20px', fontFamily: V.font_display, fontSize: 16, fontWeight: 700, whiteSpace: 'nowrap',
            background: tab === t ? '#fff' : 'transparent',
            color: tab === t ? 'var(--red)' : '#666',
            borderBottom: tab === t ? '3px solid var(--red)' : '3px solid transparent',
            borderRight: '1px solid #ddd',
          }}>{t.toUpperCase()}</button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        {tab === 'Dashboard' && <DashboardTab member={member} />}
        {tab === 'Orders' && <OrdersTab orders={member.orders} />}
        {tab === 'Rewards' && <RewardsTab member={member} />}
        {tab === 'Favorites' && <FavoritesTab favorites={member.favorites} />}
        {tab === 'Profile' && <ProfileTab member={member} />}
      </div>
    </div>
  )
}

function DashboardTab({ member }) {
  return (
    <div>
      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 0, border: B, marginBottom: 24 }}>
        {[
          { icon: '🌮', label: 'REORDER LAST', sub: member.orders[0]?.items.split(',')[0] },
          { icon: '🎁', label: 'REDEEM REWARD', sub: `${member.points} pts available` },
          { icon: '📍', label: 'FIND LOCATION', sub: '6 spots in the Valley' },
          { icon: '📋', label: 'ORDER HISTORY', sub: `${member.orders.length} orders` },
        ].map((a, i) => (
          <div key={a.label} style={{ padding: 20, borderRight: i < 3 ? B : 'none', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontFamily: V.font_display, fontSize: 16 }}>{a.label}</div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{a.sub}</div>
          </div>
        ))}
      </div>

      {/* Available rewards */}
      <div style={{ fontFamily: V.font_display, fontSize: 22, marginBottom: 12 }}>AVAILABLE REWARDS</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 0, border: B, marginBottom: 24 }}>
        {[
          { pts: 50, reward: 'FREE DRINK', available: member.points >= 50 },
          { pts: 100, reward: 'FREE TACO', available: member.points >= 100 },
          { pts: 250, reward: 'FREE PLATO', available: member.points >= 250 },
        ].map((r, i) => (
          <div key={r.pts} style={{ padding: 16, borderRight: i < 2 ? B : 'none', textAlign: 'center', opacity: r.available ? 1 : 0.4 }}>
            <div style={{ fontFamily: V.font_display, fontSize: 28, color: r.available ? 'var(--red)' : '#999' }}>{r.pts} PTS</div>
            <div style={{ fontFamily: V.font_display, fontSize: 14, marginBottom: 8 }}>{r.reward}</div>
            {r.available && <button style={{ padding: '8px 16px', background: 'var(--red)', color: '#fff', fontFamily: V.font_display, fontSize: 12, border: 'none', cursor: 'pointer' }}>REDEEM</button>}
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{ fontFamily: V.font_display, fontSize: 22, marginBottom: 12 }}>RECENT ORDERS</div>
      <div style={{ border: B }}>
        {member.orders.slice(0, 3).map((o, i) => (
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: i < 2 ? B : 'none' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{o.items.split(',').slice(0, 2).join(', ')}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{o.date} · {o.location}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: V.font_display, fontSize: 18, color: 'var(--red)' }}>${o.total}</div>
              <button style={{ fontSize: 11, color: 'var(--red)', fontFamily: V.font_display }}>REORDER</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrdersTab({ orders }) {
  return (
    <div>
      <div style={{ fontFamily: V.font_display, fontSize: 22, marginBottom: 16 }}>ALL ORDERS</div>
      <div style={{ border: B }}>
        {orders.map((o, i) => (
          <div key={o.id} style={{ padding: 16, borderBottom: i < orders.length - 1 ? B : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: V.font_mono, fontSize: 13, fontWeight: 600 }}>{o.id}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: o.status === 'Ready' ? '#37ca37' : o.status === 'Picked Up' ? '#f5f5f5' : 'var(--red)', color: o.status === 'Picked Up' ? '#999' : '#fff' }}>{o.status.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{o.items}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#999' }}>{o.date} · {o.location}</span>
              <span style={{ fontFamily: V.font_display, fontSize: 18, color: 'var(--red)' }}>${o.total}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button style={{ padding: '6px 16px', background: 'var(--red)', color: '#fff', fontFamily: V.font_display, fontSize: 12, border: 'none', cursor: 'pointer' }}>REORDER</button>
              <button style={{ padding: '6px 16px', border: B, fontFamily: V.font_display, fontSize: 12, cursor: 'pointer' }}>RECEIPT</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RewardsTab({ member }) {
  const totalEarned = member.orders.reduce((s, o) => s + o.total, 0)
  const totalRedeemed = member.rewards.filter(r => r.redeemed).length

  return (
    <div>
      <div style={{ fontFamily: V.font_display, fontSize: 22, marginBottom: 16 }}>YOUR REWARDS</div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 0, border: B, marginBottom: 24 }}>
        {[
          { val: member.points, label: 'CURRENT PTS' },
          { val: totalEarned, label: 'LIFETIME PTS' },
          { val: totalRedeemed, label: 'REDEEMED' },
          { val: member.orders.length, label: 'TOTAL ORDERS' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: 16, borderRight: i < 3 ? B : 'none', textAlign: 'center' }}>
            <div style={{ fontFamily: V.font_display, fontSize: 28, color: 'var(--red)' }}>{s.val}</div>
            <div style={{ fontSize: 10, color: '#999', letterSpacing: '0.1em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Reward tiers */}
      <div style={{ fontFamily: V.font_display, fontSize: 18, marginBottom: 12 }}>REWARD TIERS</div>
      <div style={{ border: B, marginBottom: 24 }}>
        {[
          { pts: 50, reward: 'Free Drink', desc: 'Any drink on the menu — Horchata, Agua Fresca, Jarritos, Mexican Coke' },
          { pts: 100, reward: 'Free Taco', desc: 'Any taco — Carne Asada, Al Pastor, Pollo, Barbacoa, whatever you want' },
          { pts: 250, reward: 'Free Plato', desc: 'Full plate with rice, beans, tortillas. Carne Asada or Pollo Asado' },
          { pts: 500, reward: 'Free Family Pack', desc: 'Taco Family Pack (12) with your choice of 2 proteins' },
        ].map((r, i) => (
          <div key={r.pts} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: i < 3 ? B : 'none', gap: 16 }}>
            <div style={{ fontFamily: V.font_display, fontSize: 24, color: member.points >= r.pts ? 'var(--red)' : '#ccc', minWidth: 80, textAlign: 'center' }}>{r.pts} PTS</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: V.font_display, fontSize: 16, color: member.points >= r.pts ? '#000' : '#999' }}>{r.reward.toUpperCase()}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{r.desc}</div>
            </div>
            {member.points >= r.pts && <button style={{ padding: '6px 14px', background: 'var(--red)', color: '#fff', fontFamily: V.font_display, fontSize: 12, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>REDEEM</button>}
          </div>
        ))}
      </div>

      {/* Points history */}
      <div style={{ fontFamily: V.font_display, fontSize: 18, marginBottom: 12 }}>POINTS HISTORY</div>
      <div style={{ border: B }}>
        {member.orders.map((o, i) => (
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: i < member.orders.length - 1 ? B : 'none', fontSize: 13 }}>
            <span style={{ color: '#666' }}>{o.date} — Order {o.id}</span>
            <span style={{ color: '#37ca37', fontWeight: 700 }}>+{o.total} pts</span>
          </div>
        ))}
        {member.rewards.filter(r => r.redeemed).map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: B, fontSize: 13 }}>
            <span style={{ color: '#666' }}>Redeemed — {r.name}</span>
            <span style={{ color: 'var(--red)', fontWeight: 700 }}>−{r.pts} pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FavoritesTab({ favorites }) {
  return (
    <div>
      <div style={{ fontFamily: V.font_display, fontSize: 22, marginBottom: 16 }}>YOUR FAVORITES</div>
      <div style={{ border: B }}>
        {favorites.map((f, i) => (
          <div key={f} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: i < favorites.length - 1 ? B : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>🌮</span>
              <span style={{ fontFamily: V.font_display, fontSize: 18 }}>{f.toUpperCase()}</span>
            </div>
            <button style={{ padding: '8px 20px', background: 'var(--red)', color: '#fff', fontFamily: V.font_display, fontSize: 14, border: 'none', cursor: 'pointer' }}>ORDER</button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, padding: 20, border: '1px solid #D43D2F', textAlign: 'center' }}>
        <div style={{ fontFamily: V.font_display, fontSize: 20, marginBottom: 4 }}>QUICK REORDER</div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Order all your favorites in one tap</div>
        <button style={{ padding: '12px 32px', background: 'var(--red)', color: '#fff', fontFamily: V.font_display, fontSize: 18, border: '2px solid #fff', cursor: 'pointer' }}>ORDER ALL FAVORITES</button>
      </div>
    </div>
  )
}

function ProfileTab({ member }) {
  return (
    <div>
      <div style={{ fontFamily: V.font_display, fontSize: 22, marginBottom: 16 }}>YOUR PROFILE</div>
      <div style={{ border: B, marginBottom: 24 }}>
        {[
          { label: 'NAME', value: member.name },
          { label: 'PHONE', value: member.phone },
          { label: 'EMAIL', value: member.email },
          { label: 'MEMBER SINCE', value: member.since },
          { label: 'FAVORITE LOCATION', value: member.favoriteLocation },
          { label: 'TIER', value: member.tier },
        ].map((f, i) => (
          <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < 5 ? B : 'none' }}>
            <span style={{ fontFamily: V.font_display, fontSize: 14, color: '#999' }}>{f.label}</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{f.value}</span>
          </div>
        ))}
      </div>

      {/* Preferences */}
      <div style={{ fontFamily: V.font_display, fontSize: 18, marginBottom: 12 }}>PREFERENCES</div>
      <div style={{ border: B }}>
        {[
          { label: 'Order notifications (text)', on: true },
          { label: 'Promo alerts', on: true },
          { label: 'Email receipts', on: false },
          { label: 'Birthday reward', on: true },
        ].map((p, i) => (
          <div key={p.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: i < 3 ? B : 'none' }}>
            <span style={{ fontSize: 14 }}>{p.label}</span>
            <div style={{ width: 40, height: 22, background: p.on ? '#37ca37' : '#ddd', position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: 18, height: 18, background: '#fff', position: 'absolute', top: 2, left: p.on ? 20 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
