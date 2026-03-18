import { useState } from 'react'
import { IMG } from '../data/menu'

const V = { font_display: "'Squada One', cursive", font_body: "'Albert Sans', sans-serif" }

export default function SignIn({ onSignIn }) {
  const [mode, setMode] = useState('choose')
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }))

  if (mode === 'choose') {
    return (
      <Wrap>
        <Box>
          <img src={IMG.logo} alt="Taco Boy's" style={{ height: 60, margin: '0 auto 20px' }} />
          <div style={{ fontFamily: V.font_display, fontSize: 32, textAlign: 'center', color: '#1a1a1a', marginBottom: 4 }}>WELCOME TO TACO BOY'S</div>
          <div style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 32 }}>Sign in to order, earn rewards, and track your tacos.</div>

          <Btn onClick={() => onSignIn('customer')}>SIGN IN</Btn>
          <BtnOutline onClick={() => setMode('signup')}>CREATE ACCOUNT</BtnOutline>

          <div style={{ textAlign: 'center', margin: '24px 0 16px' }}>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>— or —</div>
            <BtnGhost onClick={() => onSignIn('guest')}>CONTINUE AS GUEST</BtnGhost>
          </div>

          <div style={{ height: 1, background: '#e5e5e5', margin: '16px 0' }} />

          <div style={{ display: 'flex', gap: 0, border: '1px solid #e5e5e5', borderRadius: '8px', overflow: 'hidden', marginTop: 8 }}>
            {[
              { id: 'owner', label: 'OWNER', icon: '👑' },
              { id: 'manager', label: 'MANAGER', icon: '📋' },
              { id: 'staff', label: 'STAFF', icon: '🌮' },
            ].map((role, i) => (
              <button key={role.id} onClick={() => onSignIn('admin')} style={{
                flex: 1, padding: '14px 8px', background: '#f5f5f2', color: '#1a1a1a',
                fontFamily: V.font_display, fontSize: 13, borderRight: i < 2 ? '1px solid #e5e5e5' : 'none',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{role.icon}</div>
                {role.label}
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', fontSize: 11, color: '#999', marginTop: 8 }}>Staff / Admin Access</div>
        </Box>
      </Wrap>
    )
  }

  if (mode === 'signup') {
    return (
      <Wrap>
        <Box>
          <button onClick={() => setMode('choose')} style={{ fontFamily: V.font_display, fontSize: 14, color: '#999', marginBottom: 16 }}>← BACK</button>
          <div style={{ fontFamily: V.font_display, fontSize: 28, textAlign: 'center', color: '#1a1a1a', marginBottom: 4 }}>CREATE ACCOUNT</div>
          <div style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 }}>Join Taco Boy's Rewards. Earn points on every order.</div>

          <Field label="YOUR NAME" value={form.name} onChange={v => u('name', v)} placeholder="Marcus T." />
          <Field label="PHONE NUMBER" value={form.phone} onChange={v => u('phone', v)} placeholder="(480) 555-0142" type="tel" />
          <Field label="EMAIL (OPTIONAL)" value={form.email} onChange={v => u('email', v)} placeholder="you@email.com" type="email" />

          <Btn onClick={() => onSignIn('customer')} style={{ marginTop: 8 }}>CREATE ACCOUNT & START EARNING</Btn>

          {/* Perks */}
          <div style={{ border: '1px solid #D43D2F', borderRadius: '8px', overflow: 'hidden', marginTop: 24 }}>
            <div style={{ background: '#D43D2F', color: '#fff', padding: '10px 16px', fontFamily: V.font_display, fontSize: 16 }}>WHAT YOU GET</div>
            <div style={{ padding: 16, background: '#f5f5f2' }}>
              {[
                '🌮 Earn 1 point per dollar spent',
                '🎁 Redeem for free tacos, drinks, and platos',
                '📱 Track orders and reorder favorites instantly',
                '🔥 Exclusive promos and early access to specials',
                '🏆 Level up to VIP for bonus rewards',
              ].map(perk => (
                <div key={perk} style={{ fontSize: 13, padding: '5px 0', color: '#666' }}>{perk}</div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ fontSize: 13, color: '#999' }}>Already have an account? </span>
            <button onClick={() => onSignIn('customer')} style={{ fontSize: 13, color: '#D43D2F', fontWeight: 700, fontFamily: V.font_display }}>SIGN IN</button>
          </div>
        </Box>
      </Wrap>
    )
  }

  return null
}

function Wrap({ children }) {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#f5f5f2' }}>{children}</div>
}

function Box({ children }) {
  return <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: 32, width: '100%', maxWidth: 420 }}>{children}</div>
}

function Btn({ children, onClick, style = {} }) {
  return <button onClick={onClick} style={{ width: '100%', padding: '16px 20px', background: '#D43D2F', color: '#fff', fontFamily: "'Squada One', cursive", fontSize: 20, fontWeight: 700, border: 'none', cursor: 'pointer', borderRadius: '8px', ...style }}>{children}</button>
}

function BtnOutline({ children, onClick }) {
  return <button onClick={onClick} style={{ width: '100%', padding: '16px 20px', background: 'transparent', color: '#1a1a1a', fontFamily: "'Squada One', cursive", fontSize: 20, fontWeight: 700, border: '1px solid #e5e5e5', cursor: 'pointer', borderRadius: '8px', marginTop: 8 }}>{children}</button>
}

function BtnGhost({ children, onClick }) {
  return <button onClick={onClick} style={{ width: '100%', padding: '12px 20px', background: 'transparent', color: '#999', fontFamily: "'Squada One', cursive", fontSize: 16, fontWeight: 700, border: '1px solid #e5e5e5', cursor: 'pointer', borderRadius: '8px' }}>{children}</button>
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontFamily: "'Squada One', cursive", fontSize: 12, color: '#999', display: 'block', marginBottom: 4 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e5e5', background: '#f5f5f2', color: '#1a1a1a', fontSize: 15, fontFamily: "'Albert Sans', sans-serif", borderRadius: '8px' }} />
    </div>
  )
}
