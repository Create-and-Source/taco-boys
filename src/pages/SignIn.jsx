import { useState } from 'react'
import { IMG } from '../data/menu'

const B = '2px solid #000'
const V = { font_display: "'Squada One', cursive", font_body: "'Albert Sans', sans-serif", font_mono: "'JetBrains Mono', monospace" }

export default function SignIn({ onSignIn }) {
  const [mode, setMode] = useState('choose') // choose, customer-login, customer-signup, admin
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' })
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }))

  if (mode === 'choose') {
    return (
      <div style={s.wrap}>
        <div style={s.box}>
          <img src={IMG.logo} alt="Taco Boy's" style={{ height: 60, margin: '0 auto 20px' }} />
          <div style={{ fontFamily: V.font_display, fontSize: 32, textAlign: 'center', marginBottom: 4 }}>WELCOME TO TACO BOY'S</div>
          <div style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 32 }}>Sign in to order, earn rewards, and track your tacos.</div>

          <button onClick={() => setMode('customer-login')} style={s.btn}>SIGN IN</button>
          <button onClick={() => setMode('customer-signup')} style={s.btnOutline}>CREATE ACCOUNT</button>

          <div style={{ textAlign: 'center', margin: '24px 0 16px' }}>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 16 }}>— OR CONTINUE AS —</div>
            <button onClick={() => onSignIn('guest')} style={{ ...s.btnGhost, marginBottom: 8 }}>GUEST (SKIP SIGN IN)</button>
          </div>

          <div style={s.dividerLine} />

          <button onClick={() => setMode('admin')} style={{ width: '100%', padding: '10px', fontSize: 12, color: '#999', fontFamily: V.font_display, marginTop: 12 }}>
            STAFF / ADMIN LOGIN →
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'customer-login') {
    return (
      <div style={s.wrap}>
        <div style={s.box}>
          <button onClick={() => setMode('choose')} style={s.back}>← BACK</button>
          <div style={{ fontFamily: V.font_display, fontSize: 28, textAlign: 'center', marginBottom: 4 }}>SIGN IN</div>
          <div style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 }}>Welcome back. Let's get you some tacos.</div>

          <div style={s.field}>
            <label style={s.label}>PHONE NUMBER</label>
            <input type="tel" value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="(480) 555-0142" style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>PASSWORD</label>
            <input type="password" value={form.password} onChange={e => u('password', e.target.value)} placeholder="••••••••" style={s.input} />
          </div>

          <button onClick={() => onSignIn('customer')} style={{ ...s.btn, marginTop: 8 }}>SIGN IN</button>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button style={{ fontSize: 13, color: '#e93d3d', fontFamily: V.font_display }}>FORGOT PASSWORD?</button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <span style={{ fontSize: 13, color: '#999' }}>No account? </span>
            <button onClick={() => setMode('customer-signup')} style={{ fontSize: 13, color: '#e93d3d', fontWeight: 700, fontFamily: V.font_display }}>SIGN UP</button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'customer-signup') {
    return (
      <div style={s.wrap}>
        <div style={s.box}>
          <button onClick={() => setMode('choose')} style={s.back}>← BACK</button>
          <div style={{ fontFamily: V.font_display, fontSize: 28, textAlign: 'center', marginBottom: 4 }}>CREATE ACCOUNT</div>
          <div style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 }}>Join Taco Boy's Rewards. Earn points on every order.</div>

          <div style={s.field}>
            <label style={s.label}>YOUR NAME</label>
            <input type="text" value={form.name} onChange={e => u('name', e.target.value)} placeholder="Marcus T." style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>PHONE NUMBER</label>
            <input type="tel" value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="(480) 555-0142" style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>EMAIL (OPTIONAL)</label>
            <input type="email" value={form.email} onChange={e => u('email', e.target.value)} placeholder="you@email.com" style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>CREATE PASSWORD</label>
            <input type="password" value={form.password} onChange={e => u('password', e.target.value)} placeholder="••••••••" style={s.input} />
          </div>

          <button onClick={() => onSignIn('customer')} style={{ ...s.btn, marginTop: 8 }}>CREATE ACCOUNT & START EARNING</button>

          {/* Perks preview */}
          <div style={{ border: '2px solid #e93d3d', marginTop: 24 }}>
            <div style={{ background: '#e93d3d', color: '#fff', padding: '8px 16px', fontFamily: V.font_display, fontSize: 16 }}>WHAT YOU GET</div>
            <div style={{ padding: 16 }}>
              {[
                '🌮 Earn 1 point per dollar spent',
                '🎁 Redeem for free tacos, drinks, and platos',
                '📱 Track orders and reorder favorites instantly',
                '🔥 Exclusive promos and early access to specials',
                '🏆 Level up to VIP for bonus rewards',
              ].map(perk => (
                <div key={perk} style={{ fontSize: 13, padding: '5px 0', color: '#333' }}>{perk}</div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ fontSize: 13, color: '#999' }}>Already have an account? </span>
            <button onClick={() => setMode('customer-login')} style={{ fontSize: 13, color: '#e93d3d', fontWeight: 700, fontFamily: V.font_display }}>SIGN IN</button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'admin') {
    return (
      <div style={s.wrap}>
        <div style={{ ...s.box, background: '#161616', color: '#fff', border: '2px solid #333' }}>
          <button onClick={() => setMode('choose')} style={{ ...s.back, color: '#666' }}>← BACK</button>
          <img src={IMG.logo} alt="" style={{ height: 40, margin: '0 auto 16px', filter: 'brightness(10)' }} />
          <div style={{ fontFamily: V.font_display, fontSize: 28, textAlign: 'center', marginBottom: 4 }}>STAFF LOGIN</div>
          <div style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 }}>Admin and staff access only.</div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: V.font_display, fontSize: 12, color: '#999', display: 'block', marginBottom: 4 }}>ROLE</label>
            <div style={{ display: 'flex', gap: 0, border: '2px solid #333' }}>
              {[
                { id: 'owner', label: 'OWNER', icon: '👑' },
                { id: 'manager', label: 'MANAGER', icon: '📋' },
                { id: 'staff', label: 'STAFF', icon: '🌮' },
              ].map((role, i) => (
                <button key={role.id} onClick={() => onSignIn('admin')} style={{
                  flex: 1, padding: '14px 8px', background: '#222', color: '#fff',
                  fontFamily: V.font_display, fontSize: 13, borderRight: i < 2 ? '2px solid #333' : 'none',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{role.icon}</div>
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...s.field, marginBottom: 12 }}>
            <label style={{ fontFamily: V.font_display, fontSize: 12, color: '#999' }}>PIN CODE</label>
            <input type="password" placeholder="••••" maxLength={4} style={{ ...s.input, background: '#222', color: '#fff', border: '2px solid #333', textAlign: 'center', fontFamily: V.font_mono, fontSize: 24, letterSpacing: '0.3em' }} />
          </div>

          <button onClick={() => onSignIn('admin')} style={{ ...s.btn, marginTop: 8 }}>ENTER DASHBOARD</button>
        </div>
      </div>
    )
  }

  return null
}

const s = {
  wrap: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24, background: '#f5f5f5',
  },
  box: {
    background: '#fff', border: '2px solid #000', padding: 32,
    width: '100%', maxWidth: 420,
  },
  btn: {
    width: '100%', padding: '16px 20px', background: '#e93d3d', color: '#fff',
    fontFamily: "'Squada One', cursive", fontSize: 20, fontWeight: 700,
    border: '2px solid #fff', cursor: 'pointer',
  },
  btnOutline: {
    width: '100%', padding: '16px 20px', background: '#fff', color: '#000',
    fontFamily: "'Squada One', cursive", fontSize: 20, fontWeight: 700,
    border: '2px solid #000', cursor: 'pointer', marginTop: 8,
  },
  btnGhost: {
    width: '100%', padding: '12px 20px', background: 'transparent', color: '#666',
    fontFamily: "'Squada One', cursive", fontSize: 16, fontWeight: 700,
    border: '1px solid #ddd', cursor: 'pointer',
  },
  back: {
    fontFamily: "'Squada One', cursive", fontSize: 14, color: '#999',
    marginBottom: 16, display: 'block',
  },
  field: { marginBottom: 14 },
  label: {
    fontFamily: "'Squada One', cursive", fontSize: 12, color: '#999',
    display: 'block', marginBottom: 4,
  },
  input: {
    width: '100%', padding: '14px 16px',
    border: '1px solid #cbd5e0', background: '#F7FAFC',
    color: '#000', fontSize: 15, fontFamily: "'Albert Sans', sans-serif",
  },
  dividerLine: {
    height: 1, background: '#eee', margin: '8px 0',
  },
}
