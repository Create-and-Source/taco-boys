import { useState, useEffect, useRef } from 'react'

/* ── Reveal ── */
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{
      ...style,
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.8s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}ms`,
    }}>{children}</div>
  )
}

/* ══════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════ */

const MENU = [
  {
    category: 'Tacos',
    tag: '$3 EACH',
    items: [
      { name: 'Carne Asada', desc: 'Mesquite-grilled skirt steak, handmade Sonoran tortilla', hot: true },
      { name: 'Al Pastor', desc: 'Marinated pork, pineapple, cilantro, onion' },
      { name: 'Pollo Asado', desc: 'Charcoal-grilled chicken, fresh salsa verde' },
      { name: 'Barbacoa', desc: 'Slow-cooked tender beef, rich and savory' },
      { name: 'Carnitas', desc: 'Braised pork, crispy edges, lime squeeze' },
      { name: 'Cabeza', desc: 'Ultra-tender beef cheek, melt-in-your-mouth', hot: true },
      { name: 'Chorizo', desc: 'Spiced Mexican sausage, charred on the grill' },
      { name: 'Tripa', desc: 'Crispy beef tripe, traditional Sonoran style' },
    ]
  },
  {
    category: 'Vampiros',
    tag: 'CRISPY',
    items: [
      { name: 'Carne Asada Vampiro', desc: 'Griddle-crisped flour tortilla, melted cheese, mesquite steak', price: '$5' },
      { name: 'Al Pastor Vampiro', desc: 'Crispy tortilla, melted cheese, marinated pork, pineapple', price: '$5' },
      { name: 'Pollo Vampiro', desc: 'Crispy tortilla, melted cheese, grilled chicken', price: '$5' },
    ]
  },
  {
    category: 'Burritos',
    items: [
      { name: 'Carne Asada Burrito', desc: 'Mesquite steak, frijoles charros with chorizo, melted cheese', price: '$10', hot: true },
      { name: 'Al Pastor Burrito', desc: 'Marinated pork, rice, beans, pineapple salsa', price: '$10' },
      { name: 'Pollo Burrito', desc: 'Grilled chicken, rice, beans, fresh salsa', price: '$10' },
    ]
  },
  {
    category: 'Quesadillas',
    items: [
      { name: 'Carne Asada Quesadilla', desc: 'Flour tortilla, melted cheese, mesquite steak', price: '$10' },
      { name: 'Pollo Quesadilla', desc: 'Flour tortilla, melted cheese, grilled chicken', price: '$10' },
    ]
  },
  {
    category: 'Platos',
    tag: 'PLATES',
    items: [
      { name: 'Carne Asada Plato', desc: 'Generous portion of mesquite steak, refried beans, rice, handmade tortillas', price: '$14', hot: true },
      { name: 'Pollo Asado Plato', desc: 'Grilled chicken, refried beans, rice, handmade tortillas', price: '$14' },
    ]
  },
  {
    category: 'Sides & More',
    items: [
      { name: 'Carne Asada Fries', desc: 'Loaded fries with mesquite steak, cheese, and your choice of salsa', price: '$10', hot: true },
      { name: 'Chips & Guac', desc: 'Fresh tortilla chips with house-made guacamole', price: '$6' },
      { name: 'Elote', desc: 'Mexican street corn with mayo, cotija, chile, lime', price: '$5' },
      { name: 'Mangonada', desc: 'Frozen mango with Tajin, chamoy, and tamarind straw', price: '$6' },
    ]
  },
]

const LOCATIONS = [
  { name: 'Roosevelt Row', addr: '620 E Roosevelt St, Phoenix 85004', flag: 'ORIGINAL', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–1am', phone: '(602) 675-3962' },
  { name: 'North Phoenix', addr: '9016 N Black Canyon Hwy, Phoenix 85051', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–12am', phone: '(602) 675-3962' },
  { name: '32nd Street', addr: '2949 N 32nd St, Phoenix 85018', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–12am', phone: '(602) 675-3962' },
  { name: 'West Phoenix', addr: '9055 W Camelback Rd, Phoenix', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–12am', phone: '(602) 675-3962' },
  { name: 'Tempe — Rural', addr: '1015 S Rural Rd, Tempe 85281', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–12am', phone: '(602) 675-3962' },
  { name: 'Tempe — Mill Ave', addr: '699 S Mill Ave, Tempe 85281', flag: '20-TAP BEER WALL', hours: 'Sun–Thu 10am–11pm · Fri–Sat 10am–2am', phone: '(602) 675-3962' },
]

/* ══════════════════════════════════════════════════════
   APP
   ══════════════════════════════════════════════════════ */

export default function App() {
  const [heroVis, setHeroVis] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Tacos')
  const [cart, setCart] = useState([])

  useEffect(() => { setTimeout(() => setHeroVis(true), 200) }, [])

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === item.name)
      if (existing) return prev.map(c => c.name === item.name ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0)
  const cartTotal = cart.reduce((sum, c) => {
    const price = parseFloat((c.price || '$3').replace('$', ''))
    return sum + price * c.qty
  }, 0)

  return (
    <>
      <Nav cartCount={cartCount} />

      {/* ════ HERO ════ */}
      <section style={hero.wrap}>
        <div style={hero.fireOverlay} />
        <div style={hero.smokeOverlay} />
        <div style={hero.content}>
          <div style={{ ...hero.tag, opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(16px)', transition: 'all 0.9s ease 0.2s' }}>
            SONORAN STYLE · MESQUITE GRILLED · SINCE 2019
          </div>
          <h1 style={{ opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(24px)', transition: 'all 0.8s ease 0.5s' }}>
            <span style={hero.h1}>TACO</span>
            <br />
            <span style={{ ...hero.h1, color: '#D42B20' }}>BOY'S</span>
          </h1>
          <p style={{ ...hero.sub, opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(16px)', transition: 'all 0.8s ease 0.9s' }}>
            Fresh tortillas from Sonora. Carne asada over mesquite charcoal.<br />
            6 locations across the Valley. As seen on Netflix.
          </p>
          <div style={{ ...hero.actions, opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(16px)', transition: 'all 0.8s ease 1.2s' }}>
            <a href="#order" style={hero.btnPrimary}>Order Now</a>
            <a href="#menu" style={hero.btnGhost}>See the Menu</a>
          </div>
        </div>
        <div style={{ ...hero.scrollHint, opacity: heroVis ? 1 : 0, transition: 'opacity 1s ease 2s' }}>
          <div style={hero.scrollLine} />
        </div>
      </section>

      {/* ════ MARQUEE ════ */}
      <div style={marq.wrap}>
        <div style={marq.track}>
          {[...Array(2)].map((_, ri) => (
            <div key={ri} style={marq.set}>
              {['Carne Asada', '🔥', 'Al Pastor', '🔥', 'Vampiros', '🔥', 'Barbacoa', '🔥', 'Carnitas', '🔥', 'Cabeza', '🔥', 'Quesadillas', '🔥', 'Burritos', '🔥'].map((t, i) => (
                <span key={i} style={t === '🔥' ? marq.dot : marq.item}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ════ ABOUT STRIP ════ */}
      <section style={about.wrap}>
        <div style={about.inner}>
          <Reveal>
            <div style={about.stats}>
              {[
                { val: '6', label: 'LOCATIONS' },
                { val: '94K', label: 'FOLLOWERS' },
                { val: '2019', label: 'FOUNDED' },
                { val: '🔥', label: 'NETFLIX' },
              ].map(s => (
                <div key={s.label} style={about.stat}>
                  <div style={about.statVal}>{s.val}</div>
                  <div style={about.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p style={about.text}>
              Started in 2019 on Roosevelt Row by father-and-son duo Juan Francisco Cornejo Sr. and Jr.
              What began outside a liquor store became a Phoenix phenomenon — 6 locations, a Netflix feature
              on <em style={{ color: '#D42B20' }}>Taco Chronicles</em>, and the best mesquite-grilled carne asada in Arizona.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════ MENU ════ */}
      <section id="menu" style={menu.wrap}>
        <div style={menu.inner}>
          <Reveal>
            <div style={menu.tag}>THE MENU</div>
            <h2 style={menu.h2}>Mesquite Charcoal. Fresh Tortillas.<br /><span style={{ color: '#D42B20' }}>Real Food.</span></h2>
          </Reveal>

          {/* Category tabs */}
          <Reveal delay={100}>
            <div style={menu.tabs}>
              {MENU.map(cat => (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(cat.category)}
                  style={{
                    ...menu.tab,
                    background: activeCategory === cat.category ? '#D42B20' : 'var(--surface)',
                    color: activeCategory === cat.category ? '#fff' : 'var(--text2)',
                    borderColor: activeCategory === cat.category ? '#D42B20' : 'var(--border)',
                  }}
                >
                  {cat.category}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Items */}
          <div style={menu.grid}>
            {MENU.find(c => c.category === activeCategory)?.items.map((item, i) => (
              <Reveal key={item.name} delay={i * 60}>
                <div style={menu.card}>
                  <div style={menu.cardTop}>
                    <div>
                      <div style={menu.itemName}>
                        {item.name}
                        {item.hot && <span style={menu.hotBadge}>🔥</span>}
                      </div>
                      <div style={menu.itemDesc}>{item.desc}</div>
                    </div>
                    <div style={menu.itemPrice}>{item.price || '$3'}</div>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    style={menu.addBtn}
                  >
                    + Add to Order
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Salsa bar callout */}
          <Reveal delay={200}>
            <div style={menu.salsaBar}>
              <div style={menu.salsaIcon}>🌶️</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>The Salsa Bar</div>
                <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>
                  Every order comes with access to our legendary self-serve salsa bar — creamy avocado, green tomatillo,
                  fiery red habanero, plus radishes, cucumbers, pico de gallo, cilantro, onion, cabbage, and lime.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ ORDER DIRECT ════ */}
      <section id="order" style={order.wrap}>
        <div style={order.inner}>
          <Reveal>
            <div style={menu.tag}>ORDER DIRECT</div>
            <h2 style={{ ...menu.h2, marginBottom: 8 }}>Skip the Apps.<br /><span style={{ color: '#D42B20' }}>Order From Us.</span></h2>
            <p style={order.sub}>No DoorDash fees. No middleman. Order pickup or delivery straight from Taco Boy's.</p>
          </Reveal>

          {/* Mini cart */}
          <Reveal delay={100}>
            <div style={order.cart}>
              <div style={order.cartHeader}>
                <span style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: '0.05em' }}>YOUR ORDER</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, color: 'var(--text2)' }}>{cartCount} items</span>
              </div>
              {cart.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                  Add items from the menu above ↑
                </div>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.name} style={order.cartItem}>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{item.name}</span>
                        <span style={{ color: 'var(--muted)', marginLeft: 8 }}>×{item.qty}</span>
                      </div>
                      <span style={{ fontWeight: 600, color: '#D42B20' }}>
                        ${(parseFloat((item.price || '$3').replace('$', '')) * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div style={order.cartTotal}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
                    <span style={{ fontSize: 22, fontWeight: 700, color: '#D42B20', fontFamily: "'Bebas Neue'" }}>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button style={order.checkoutBtn}>Checkout — Pickup or Delivery</button>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ CATERING ════ */}
      <section id="catering" style={cater.wrap}>
        <div style={cater.inner}>
          <Reveal>
            <div style={menu.tag}>CATERING</div>
            <h2 style={menu.h2}>Feed Your <span style={{ color: '#D42B20' }}>Whole Crew.</span></h2>
            <p style={{ ...order.sub, marginBottom: 40 }}>
              Corporate events, birthday parties, game day — we cater everything.
              Mesquite-grilled meats, fresh tortillas, and the full salsa bar. Feeds 10 to 500.
            </p>
          </Reveal>
          <div style={cater.grid}>
            {[
              { name: 'Taco Pack', serves: '10–15', price: '$120', desc: '3 lbs of meat, 30 tortillas, rice, beans, salsa bar setup' },
              { name: 'Party Pack', serves: '25–30', price: '$250', desc: '6 lbs of mixed meats, 60 tortillas, rice, beans, full salsa bar, chips & guac' },
              { name: 'Event Package', serves: '50+', price: 'Custom', desc: 'Full catering setup with staff, unlimited meats, sides, drinks, and dessert' },
            ].map((pkg, i) => (
              <Reveal key={pkg.name} delay={100 + i * 100}>
                <div style={cater.card}>
                  <div style={cater.cardPrice}>{pkg.price}</div>
                  <div style={cater.cardName}>{pkg.name}</div>
                  <div style={cater.cardServes}>Serves {pkg.serves}</div>
                  <div style={cater.cardDesc}>{pkg.desc}</div>
                  <button style={cater.cardBtn}>Book Catering</button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ LOYALTY ════ */}
      <section style={loyal.wrap}>
        <div style={loyal.inner}>
          <Reveal>
            <div style={menu.tag}>LOYALTY</div>
            <h2 style={menu.h2}>Eat Tacos. <span style={{ color: '#F5A623' }}>Earn Points.</span></h2>
          </Reveal>
          <Reveal delay={100}>
            <div style={loyal.card}>
              <div style={loyal.cardInner}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: '0.05em' }}>TACO BOY'S REWARDS</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>Earn 1 point per dollar spent</div>
                  </div>
                  <div style={{ fontSize: 36 }}>🌮</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {[
                    { pts: '50 pts', reward: 'Free Drink' },
                    { pts: '100 pts', reward: 'Free Taco' },
                    { pts: '250 pts', reward: 'Free Plato' },
                  ].map(r => (
                    <div key={r.pts} style={loyal.reward}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#F5A623', fontFamily: "'Bebas Neue'", letterSpacing: '0.05em' }}>{r.pts}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)' }}>{r.reward}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center', maxWidth: 500, margin: '24px auto 0' }}>
              Sign up at any location or order online. Points work across all 6 Valley locations.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════ LOCATIONS ════ */}
      <section id="locations" style={loc.wrap}>
        <div style={loc.inner}>
          <Reveal>
            <div style={menu.tag}>LOCATIONS</div>
            <h2 style={menu.h2}>6 Spots Across <span style={{ color: '#D42B20' }}>The Valley.</span></h2>
          </Reveal>
          <div style={loc.grid}>
            {LOCATIONS.map((l, i) => (
              <Reveal key={l.name} delay={100 + i * 80}>
                <div style={loc.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={loc.cardName}>{l.name}</div>
                    {l.flag && <span style={loc.flag}>{l.flag}</span>}
                  </div>
                  <div style={loc.cardAddr}>{l.addr}</div>
                  <div style={loc.cardHours}>{l.hours}</div>
                  <div style={loc.cardPhone}>{l.phone}</div>
                  <button style={loc.dirBtn}>Get Directions</button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section style={cta.wrap}>
        <div style={cta.inner}>
          <Reveal>
            <div style={cta.fire}>🔥</div>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(40px, 8vw, 80px)', color: 'var(--text)', letterSpacing: '0.03em', lineHeight: 1 }}>
              STOP SCROLLING.<br /><span style={{ color: '#D42B20' }}>START EATING.</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
              <a href="#order" style={hero.btnPrimary}>Order Now</a>
              <a href="https://instagram.com/aztacoboys" target="_blank" rel="noopener" style={hero.btnGhost}>@aztacoboys</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer style={foot.wrap}>
        <div style={foot.brand}>TACO BOY'S</div>
        <div style={foot.tagline}>SONORAN STYLE SINCE 2019</div>
        <div style={foot.links}>
          <a href="#menu">Menu</a>
          <span style={{ color: 'var(--border)' }}>·</span>
          <a href="#order">Order</a>
          <span style={{ color: 'var(--border)' }}>·</span>
          <a href="#catering">Catering</a>
          <span style={{ color: 'var(--border)' }}>·</span>
          <a href="#locations">Locations</a>
          <span style={{ color: 'var(--border)' }}>·</span>
          <a href="https://instagram.com/aztacoboys" target="_blank" rel="noopener">Instagram</a>
        </div>
        <div style={foot.copy}>© 2026 Taco Boy's. All rights reserved. Phoenix, AZ</div>
      </footer>
    </>
  )
}

/* ══════════════════════════════════════════════════════
   NAV
   ══════════════════════════════════════════════════════ */

function Nav({ cartCount }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
      background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.4s ease',
    }}>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: '0.08em' }}>
        TACO <span style={{ color: '#D42B20' }}>BOY'S</span>
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {['Menu', 'Order', 'Catering', 'Locations'].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text2)', transition: 'color 0.2s' }}>{l}</a>
        ))}
        <a href="#order" style={{
          padding: '8px 16px', borderRadius: 100, background: '#D42B20', color: '#fff',
          fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          🌮 {cartCount > 0 && <span>{cartCount}</span>}
          {cartCount === 0 && 'Order'}
        </a>
      </div>
    </nav>
  )
}

/* ══════════════════════════════════════════════════════
   STYLES
   ══════════════════════════════════════════════════════ */

const hero = {
  wrap: { position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a0a08 40%, #2a0f0a 60%, #0a0a0a 100%)' },
  fireOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'radial-gradient(ellipse at center bottom, rgba(212,43,32,0.15) 0%, transparent 70%)', pointerEvents: 'none', animation: 'firePulse 4s ease-in-out infinite', zIndex: 1 },
  smokeOverlay: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(245,166,35,0.04) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 1 },
  content: { position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' },
  tag: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.25em', color: '#D42B20', marginBottom: 24 },
  h1: { fontFamily: "'Bebas Neue'", fontSize: 'clamp(60px, 14vw, 160px)', letterSpacing: '0.06em', lineHeight: 0.9, color: 'var(--text)', display: 'inline-block' },
  sub: { fontFamily: "'DM Sans'", fontWeight: 300, fontSize: 'clamp(14px, 2vw, 18px)', lineHeight: 1.7, color: 'var(--text2)', margin: '24px 0 40px' },
  actions: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: { display: 'inline-block', padding: '16px 36px', background: '#D42B20', color: '#fff', fontSize: 14, fontWeight: 700, borderRadius: 100, boxShadow: '0 0 30px rgba(212,43,32,0.3)', letterSpacing: '0.05em', textTransform: 'uppercase' },
  btnGhost: { display: 'inline-block', padding: '16px 36px', background: 'transparent', color: '#D42B20', fontSize: 14, fontWeight: 600, borderRadius: 100, border: '1px solid rgba(212,43,32,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase' },
  scrollHint: { position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 2 },
  scrollLine: { width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, #D42B20, transparent)', animation: 'float 2s ease-in-out infinite' },
}

const marq = {
  wrap: { overflow: 'hidden', borderTop: '1px solid rgba(212,43,32,0.15)', borderBottom: '1px solid rgba(212,43,32,0.15)', background: 'rgba(212,43,32,0.03)', padding: '14px 0' },
  track: { display: 'flex', width: 'max-content', animation: 'marquee 25s linear infinite' },
  set: { display: 'flex', alignItems: 'center', gap: 24, paddingRight: 24 },
  item: { fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: '0.1em', color: '#D42B20', whiteSpace: 'nowrap' },
  dot: { fontSize: 14, opacity: 0.5 },
}

const about = {
  wrap: { padding: '80px 24px', background: 'var(--bg2)' },
  inner: { maxWidth: 900, margin: '0 auto', textAlign: 'center' },
  stats: { display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', marginBottom: 32 },
  stat: { textAlign: 'center' },
  statVal: { fontFamily: "'Bebas Neue'", fontSize: 36, color: 'var(--text)', letterSpacing: '0.05em' },
  statLabel: { fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)' },
  text: { fontSize: 16, lineHeight: 1.8, color: 'var(--text2)', maxWidth: 600, margin: '0 auto' },
}

const menu = {
  wrap: { padding: '100px 24px' },
  inner: { maxWidth: 900, margin: '0 auto' },
  tag: { fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.25em', color: '#D42B20', marginBottom: 12, textAlign: 'center' },
  h2: { fontFamily: "'Bebas Neue'", fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '0.04em', lineHeight: 1.1, color: 'var(--text)', textAlign: 'center', marginBottom: 32 },
  tabs: { display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 },
  tab: { padding: '8px 18px', borderRadius: 100, fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', border: '1px solid', transition: 'all 0.3s ease', fontFamily: "'DM Sans'" },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, transition: 'border-color 0.3s ease' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  itemName: { fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 },
  hotBadge: { marginLeft: 6, fontSize: 12 },
  itemDesc: { fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 },
  itemPrice: { fontFamily: "'Bebas Neue'", fontSize: 22, color: '#D42B20', letterSpacing: '0.05em', flexShrink: 0 },
  addBtn: { width: '100%', padding: '10px 0', borderRadius: 100, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: "'DM Sans'" },
  salsaBar: { display: 'flex', gap: 16, alignItems: 'flex-start', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginTop: 32, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' },
  salsaIcon: { fontSize: 28, flexShrink: 0 },
}

const order = {
  wrap: { padding: '80px 24px', background: 'var(--bg2)' },
  inner: { maxWidth: 600, margin: '0 auto', textAlign: 'center' },
  sub: { fontSize: 15, color: 'var(--text2)', lineHeight: 1.6, maxWidth: 460, margin: '0 auto 32px' },
  cart: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, textAlign: 'left' },
  cartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' },
  cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 },
  cartTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginTop: 8 },
  checkoutBtn: { width: '100%', padding: '16px 0', borderRadius: 100, background: '#D42B20', color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', border: 'none', cursor: 'pointer', marginTop: 16, textTransform: 'uppercase' },
}

const cater = {
  wrap: { padding: '100px 24px' },
  inner: { maxWidth: 1000, margin: '0 auto', textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, textAlign: 'center' },
  cardPrice: { fontFamily: "'Bebas Neue'", fontSize: 36, color: '#D42B20', letterSpacing: '0.05em', marginBottom: 4 },
  cardName: { fontFamily: "'Bebas Neue'", fontSize: 22, color: 'var(--text)', letterSpacing: '0.05em', marginBottom: 4 },
  cardServes: { fontSize: 12, color: '#F5A623', fontWeight: 600, marginBottom: 12 },
  cardDesc: { fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 20 },
  cardBtn: { padding: '12px 28px', borderRadius: 100, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
}

const loyal = {
  wrap: { padding: '80px 24px', background: 'var(--bg2)' },
  inner: { maxWidth: 600, margin: '0 auto', textAlign: 'center' },
  card: { background: 'linear-gradient(135deg, #D42B20, #F5A623)', borderRadius: 16, padding: 3, marginTop: 32 },
  cardInner: { background: 'var(--surface)', borderRadius: 14, padding: 28 },
  reward: { background: 'var(--surface2)', borderRadius: 10, padding: 14 },
}

const loc = {
  wrap: { padding: '100px 24px' },
  inner: { maxWidth: 1100, margin: '0 auto', textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 22, textAlign: 'left' },
  cardName: { fontFamily: "'Bebas Neue'", fontSize: 22, color: 'var(--text)', letterSpacing: '0.05em' },
  flag: { fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 100, background: 'rgba(212,43,32,0.1)', color: '#D42B20', whiteSpace: 'nowrap' },
  cardAddr: { fontSize: 13, color: 'var(--text2)', marginBottom: 6 },
  cardHours: { fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--muted)', marginBottom: 6 },
  cardPhone: { fontSize: 13, color: '#D42B20', fontWeight: 600, marginBottom: 14 },
  dirBtn: { padding: '10px 20px', borderRadius: 100, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', width: '100%' },
}

const cta = {
  wrap: { padding: '120px 24px', background: 'linear-gradient(180deg, var(--bg) 0%, #1a0a08 50%, var(--bg) 100%)', textAlign: 'center' },
  inner: { maxWidth: 700, margin: '0 auto' },
  fire: { fontSize: 48, marginBottom: 20 },
}

const foot = {
  wrap: { padding: '48px 24px 32px', textAlign: 'center', borderTop: '1px solid var(--border)' },
  brand: { fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: '0.1em', color: 'var(--text)', marginBottom: 4 },
  tagline: { fontFamily: "'JetBrains Mono'", fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 20 },
  links: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20, fontSize: 13, color: 'var(--text2)' },
  copy: { fontSize: 11, color: 'var(--muted)', opacity: 0.5 },
}
