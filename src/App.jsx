import { useState, useEffect, useRef, useCallback } from 'react'

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
    items: [
      { name: 'Carne Asada', desc: 'Mesquite-grilled skirt steak, handmade Sonoran tortilla', price: '$3', hot: true },
      { name: 'Al Pastor', desc: 'Marinated pork, pineapple, cilantro, onion', price: '$3' },
      { name: 'Pollo Asado', desc: 'Charcoal-grilled chicken, fresh salsa verde', price: '$3' },
      { name: 'Barbacoa', desc: 'Slow-cooked tender beef, rich and savory', price: '$3' },
      { name: 'Carnitas', desc: 'Braised pork, crispy edges, lime squeeze', price: '$3' },
      { name: 'Cabeza', desc: 'Ultra-tender beef cheek, melt-in-your-mouth', price: '$3', hot: true },
      { name: 'Chorizo', desc: 'Spiced Mexican sausage, charred on the grill', price: '$3' },
      { name: 'Tripa', desc: 'Crispy beef tripe, traditional Sonoran style', price: '$3' },
    ]
  },
  {
    category: 'Vampiros',
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
    items: [
      { name: 'Carne Asada Plato', desc: 'Generous portion of mesquite steak, refried beans, rice, tortillas', price: '$14', hot: true },
      { name: 'Pollo Asado Plato', desc: 'Grilled chicken, refried beans, rice, handmade tortillas', price: '$14' },
    ]
  },
  {
    category: 'Sides & Drinks',
    items: [
      { name: 'Carne Asada Fries', desc: 'Loaded fries with mesquite steak, cheese, and salsa', price: '$10', hot: true },
      { name: 'Chips & Guac', desc: 'Fresh tortilla chips with house-made guacamole', price: '$6' },
      { name: 'Elote', desc: 'Mexican street corn with mayo, cotija, chile, lime', price: '$5' },
      { name: 'Mangonada', desc: 'Frozen mango with Tajin, chamoy, and tamarind straw', price: '$6' },
      { name: 'Horchata', desc: 'Classic Mexican rice drink, sweet and creamy', price: '$4' },
      { name: 'Agua Fresca', desc: 'Fresh fruit water — Jamaica, Tamarindo, or Piña', price: '$4' },
      { name: 'Mexican Coke', desc: 'Glass bottle, real cane sugar', price: '$3' },
    ]
  },
]

const LOCATIONS = [
  { name: 'Roosevelt Row', addr: '620 E Roosevelt St, Phoenix, AZ 85004', flag: 'ORIGINAL', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–1am', phone: '(602) 675-3962' },
  { name: 'North Phoenix', addr: '9016 N Black Canyon Hwy, Phoenix, AZ 85051', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–12am', phone: '(602) 675-3962' },
  { name: '32nd Street', addr: '2949 N 32nd St, Phoenix, AZ 85018', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–12am', phone: '(602) 675-3962' },
  { name: 'West Phoenix', addr: '9055 W Camelback Rd, Phoenix, AZ', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–12am', phone: '(602) 675-3962' },
  { name: 'Tempe — Rural', addr: '1015 S Rural Rd, Tempe, AZ 85281', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–12am', phone: '(602) 675-3962' },
  { name: 'Tempe — Mill Ave', addr: '699 S Mill Ave, Tempe, AZ 85281', flag: '20-TAP BEER WALL', hours: 'Sun–Thu 10am–11pm · Fri–Sat 10am–2am', phone: '(602) 675-3962' },
]

const mapsUrl = (addr) => `https://maps.google.com/?q=${encodeURIComponent(addr)}`

/* ══════════════════════════════════════════════════════
   APP
   ══════════════════════════════════════════════════════ */

export default function App() {
  const [heroVis, setHeroVis] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Tacos')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [orderType, setOrderType] = useState('pickup')
  const [pickupLocation, setPickupLocation] = useState(0)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [cateringOpen, setCateringOpen] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [addedFlash, setAddedFlash] = useState(null)

  useEffect(() => { setTimeout(() => setHeroVis(true), 200) }, [])

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === item.name)
      if (existing) return prev.map(c => c.name === item.name ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...item, qty: 1 }]
    })
    setAddedFlash(item.name)
    setTimeout(() => setAddedFlash(null), 800)
  }, [])

  const updateQty = useCallback((name, delta) => {
    setCart(prev => prev.map(c => c.name === name ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter(c => c.qty > 0))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0)
  const cartTotal = cart.reduce((sum, c) => sum + parseFloat(c.price.replace('$', '')) * c.qty, 0)

  return (
    <>
      <Nav cartCount={cartCount} onCartClick={() => setCartOpen(true)} mobileNav={mobileNav} setMobileNav={setMobileNav} />

      {/* ═══ CART DRAWER ═══ */}
      {cartOpen && <div style={drawer.backdrop} onClick={() => setCartOpen(false)} />}
      <div style={{ ...drawer.panel, transform: cartOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div style={drawer.header}>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: '0.05em' }}>YOUR ORDER</span>
          <button onClick={() => setCartOpen(false)} style={{ fontSize: 20, color: 'var(--text2)', padding: 4 }}>✕</button>
        </div>
        {/* Pickup / Delivery toggle */}
        <div style={drawer.toggleRow}>
          {['pickup', 'delivery'].map(t => (
            <button key={t} onClick={() => setOrderType(t)} style={{ ...drawer.toggleBtn, background: orderType === t ? '#D42B20' : 'var(--surface2)', color: orderType === t ? '#fff' : 'var(--text2)' }}>
              {t === 'pickup' ? '🏃 Pickup' : '🚗 Delivery'}
            </button>
          ))}
        </div>
        {/* Location selector */}
        <div style={{ padding: '0 20px 12px' }}>
          <select value={pickupLocation} onChange={e => setPickupLocation(+e.target.value)} style={drawer.select}>
            {LOCATIONS.map((l, i) => <option key={l.name} value={i}>{l.name} — {l.addr.split(',')[0]}</option>)}
          </select>
        </div>
        {/* Items */}
        <div style={drawer.items}>
          {cart.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--muted)' }}>Your cart is empty</div>
          ) : cart.map(item => (
            <div key={item.name} style={drawer.item}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{item.price} each</div>
              </div>
              <div style={drawer.qtyRow}>
                <button onClick={() => updateQty(item.name, -1)} style={drawer.qtyBtn}>−</button>
                <span style={{ minWidth: 24, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{item.qty}</span>
                <button onClick={() => updateQty(item.name, 1)} style={drawer.qtyBtn}>+</button>
              </div>
              <div style={{ minWidth: 50, textAlign: 'right', fontWeight: 700, color: '#D42B20', fontSize: 14 }}>
                ${(parseFloat(item.price.replace('$', '')) * item.qty).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={drawer.footer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: '#D42B20' }}>${cartTotal.toFixed(2)}</span>
            </div>
            <button onClick={() => { setCartOpen(false); setCheckoutOpen(true) }} style={drawer.checkoutBtn}>
              Checkout — {orderType === 'pickup' ? 'Pickup' : 'Delivery'}
            </button>
            <button onClick={clearCart} style={{ width: '100%', padding: '10px 0', color: 'var(--muted)', fontSize: 12, marginTop: 8 }}>Clear Cart</button>
          </div>
        )}
      </div>

      {/* ═══ CHECKOUT MODAL ═══ */}
      {checkoutOpen && <CheckoutModal cart={cart} total={cartTotal} orderType={orderType} location={LOCATIONS[pickupLocation]} onClose={() => setCheckoutOpen(false)} onComplete={() => { setCheckoutOpen(false); clearCart() }} />}

      {/* ═══ CATERING MODAL ═══ */}
      {cateringOpen && <CateringModal onClose={() => setCateringOpen(false)} />}

      {/* ════ HERO ════ */}
      <section style={hero.wrap}>
        <div style={hero.fireOverlay} />
        <div style={hero.smokeOverlay} />
        <div style={hero.content}>
          <div style={{ ...hero.tag, opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(16px)', transition: 'all 0.9s ease 0.2s' }}>
            SONORAN STYLE · MESQUITE GRILLED · SINCE 2019
          </div>
          <h1 style={{ opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(24px)', transition: 'all 0.8s ease 0.5s' }}>
            <span style={hero.h1}>TACO</span><br />
            <span style={{ ...hero.h1, color: '#D42B20' }}>BOY'S</span>
          </h1>
          <p style={{ ...hero.sub, opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(16px)', transition: 'all 0.8s ease 0.9s' }}>
            Fresh tortillas from Sonora. Carne asada over mesquite charcoal.<br />
            6 locations across the Valley. As seen on Netflix.
          </p>
          <div style={{ ...hero.actions, opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(16px)', transition: 'all 0.8s ease 1.2s' }}>
            <a href="#menu" style={hero.btnPrimary}>Order Now</a>
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
      <section style={abt.wrap}>
        <div style={abt.inner}>
          <Reveal>
            <div style={abt.stats}>
              {[{ val: '6', label: 'LOCATIONS' }, { val: '94K', label: 'FOLLOWERS' }, { val: '2019', label: 'FOUNDED' }, { val: '🔥', label: 'NETFLIX' }].map(s => (
                <div key={s.label} style={abt.stat}>
                  <div style={abt.statVal}>{s.val}</div>
                  <div style={abt.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p style={abt.text}>
              Started in 2019 on Roosevelt Row by father-and-son duo Juan Francisco Cornejo Sr. and Jr.
              What began outside a liquor store became a Phoenix phenomenon — 6 locations, a Netflix feature
              on <em style={{ color: '#D42B20' }}>Taco Chronicles</em>, and the best mesquite-grilled carne asada in Arizona.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════ MENU ════ */}
      <section id="menu" style={mn.wrap}>
        <div style={mn.inner}>
          <Reveal>
            <div style={mn.tag}>THE MENU</div>
            <h2 style={mn.h2}>Mesquite Charcoal. Fresh Tortillas.<br /><span style={{ color: '#D42B20' }}>Real Food.</span></h2>
          </Reveal>
          <Reveal delay={100}>
            <div style={mn.tabs}>
              {MENU.map(cat => (
                <button key={cat.category} onClick={() => setActiveCategory(cat.category)} style={{ ...mn.tab, background: activeCategory === cat.category ? '#D42B20' : 'var(--surface)', color: activeCategory === cat.category ? '#fff' : 'var(--text2)', borderColor: activeCategory === cat.category ? '#D42B20' : 'var(--border)' }}>
                  {cat.category}
                </button>
              ))}
            </div>
          </Reveal>
          <div style={mn.grid}>
            {MENU.find(c => c.category === activeCategory)?.items.map((item, i) => (
              <Reveal key={item.name} delay={i * 60}>
                <div style={{ ...mn.card, borderColor: addedFlash === item.name ? '#D42B20' : 'var(--border)' }}>
                  <div style={mn.cardTop}>
                    <div>
                      <div style={mn.itemName}>{item.name}{item.hot && <span style={{ marginLeft: 6, fontSize: 12 }}>🔥</span>}</div>
                      <div style={mn.itemDesc}>{item.desc}</div>
                    </div>
                    <div style={mn.itemPrice}>{item.price}</div>
                  </div>
                  <button onClick={() => addToCart(item)} style={{ ...mn.addBtn, background: addedFlash === item.name ? 'rgba(212,43,32,0.1)' : 'transparent', color: addedFlash === item.name ? '#D42B20' : 'var(--text2)', borderColor: addedFlash === item.name ? '#D42B20' : 'var(--border)' }}>
                    {addedFlash === item.name ? '✓ Added' : '+ Add to Order'}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div style={mn.salsaBar}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>🌶️</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>The Salsa Bar</div>
                <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>
                  Every order comes with our legendary self-serve salsa bar — creamy avocado, green tomatillo,
                  fiery red habanero, plus radishes, cucumbers, pico de gallo, cilantro, onion, cabbage, and lime.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ CATERING ════ */}
      <section id="catering" style={cat.wrap}>
        <div style={cat.inner}>
          <Reveal>
            <div style={mn.tag}>CATERING</div>
            <h2 style={mn.h2}>Feed Your <span style={{ color: '#D42B20' }}>Whole Crew.</span></h2>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.6, maxWidth: 460, margin: '0 auto 40px', textAlign: 'center' }}>
              Corporate events, birthday parties, game day — we cater everything.
              Mesquite-grilled meats, fresh tortillas, and the full salsa bar. Feeds 10 to 500.
            </p>
          </Reveal>
          <div style={cat.grid}>
            {[
              { name: 'Taco Pack', serves: '10–15', price: '$120', desc: '3 lbs of meat, 30 tortillas, rice, beans, salsa bar setup' },
              { name: 'Party Pack', serves: '25–30', price: '$250', desc: '6 lbs of mixed meats, 60 tortillas, rice, beans, full salsa bar, chips & guac' },
              { name: 'Event Package', serves: '50+', price: 'Custom', desc: 'Full catering setup with staff, unlimited meats, sides, drinks, and dessert' },
            ].map((pkg, i) => (
              <Reveal key={pkg.name} delay={100 + i * 100}>
                <div style={cat.card}>
                  <div style={cat.cardPrice}>{pkg.price}</div>
                  <div style={cat.cardName}>{pkg.name}</div>
                  <div style={{ fontSize: 12, color: '#F5A623', fontWeight: 600, marginBottom: 12 }}>Serves {pkg.serves}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 20 }}>{pkg.desc}</div>
                  <button onClick={() => setCateringOpen(true)} style={cat.cardBtn}>Book Catering</button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ LOYALTY ════ */}
      <section style={loy.wrap}>
        <div style={loy.inner}>
          <Reveal>
            <div style={mn.tag}>LOYALTY</div>
            <h2 style={mn.h2}>Eat Tacos. <span style={{ color: '#F5A623' }}>Earn Points.</span></h2>
          </Reveal>
          <Reveal delay={100}>
            <div style={loy.card}><div style={loy.cardInner}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: '0.05em' }}>TACO BOY'S REWARDS</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>Earn 1 point per dollar spent</div>
                </div>
                <div style={{ fontSize: 36 }}>🌮</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[{ pts: '50 pts', reward: 'Free Drink' }, { pts: '100 pts', reward: 'Free Taco' }, { pts: '250 pts', reward: 'Free Plato' }].map(r => (
                  <div key={r.pts} style={loy.reward}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#F5A623', fontFamily: "'Bebas Neue'", letterSpacing: '0.05em' }}>{r.pts}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>{r.reward}</div>
                  </div>
                ))}
              </div>
            </div></div>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center', maxWidth: 500, margin: '24px auto 0' }}>
              Sign up at any location or order online. Points work across all 6 Valley locations.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════ LOCATIONS ════ */}
      <section id="locations" style={lc.wrap}>
        <div style={lc.inner}>
          <Reveal>
            <div style={mn.tag}>LOCATIONS</div>
            <h2 style={mn.h2}>6 Spots Across <span style={{ color: '#D42B20' }}>The Valley.</span></h2>
          </Reveal>
          <div style={lc.grid}>
            {LOCATIONS.map((l, i) => (
              <Reveal key={l.name} delay={100 + i * 80}>
                <div style={lc.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={lc.cardName}>{l.name}</div>
                    {l.flag && <span style={lc.flag}>{l.flag}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>{l.addr}</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--muted)', marginBottom: 6 }}>{l.hours}</div>
                  <a href={`tel:${l.phone.replace(/[^0-9]/g, '')}`} style={{ fontSize: 13, color: '#D42B20', fontWeight: 600, marginBottom: 14, display: 'block' }}>{l.phone}</a>
                  <a href={mapsUrl(l.addr)} target="_blank" rel="noopener noreferrer" style={lc.dirBtn}>Get Directions →</a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ NEWSLETTER ════ */}
      <section style={{ padding: '60px 24px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <div style={{ fontSize: 24, fontFamily: "'Bebas Neue'", letterSpacing: '0.05em', marginBottom: 8 }}>GET THE DROP</div>
            <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20 }}>New menu items, promos, and events — straight to your inbox.</div>
            <form onSubmit={e => { e.preventDefault(); alert('Subscribed! 🌮') }} style={{ display: 'flex', gap: 8 }}>
              <input type="email" placeholder="your@email.com" required style={{ flex: 1, padding: '12px 16px', borderRadius: 100, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, fontFamily: "'DM Sans'" }} />
              <button type="submit" style={{ padding: '12px 24px', borderRadius: 100, background: '#D42B20', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', flexShrink: 0 }}>Subscribe</button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section style={cta.wrap}>
        <div style={cta.inner}>
          <Reveal>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🔥</div>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(40px, 8vw, 80px)', color: 'var(--text)', letterSpacing: '0.03em', lineHeight: 1 }}>
              STOP SCROLLING.<br /><span style={{ color: '#D42B20' }}>START EATING.</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
              <a href="#menu" style={hero.btnPrimary}>Order Now</a>
              <a href="https://instagram.com/aztacoboys" target="_blank" rel="noopener" style={hero.btnGhost}>@aztacoboys</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer style={foot.wrap}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: '0.1em', color: 'var(--text)', marginBottom: 4 }}>TACO BOY'S</div>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 20 }}>SONORAN STYLE SINCE 2019</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20, fontSize: 13, color: 'var(--text2)' }}>
          {[['Menu', '#menu'], ['Order', '#menu'], ['Catering', '#catering'], ['Locations', '#locations']].map(([label, href]) => (
            <span key={label}><a href={href}>{label}</a> <span style={{ color: 'var(--border)', marginLeft: 12 }}>·</span></span>
          ))}
          <a href="https://instagram.com/aztacoboys" target="_blank" rel="noopener">Instagram</a>
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', opacity: 0.5 }}>© 2026 Taco Boy's. All rights reserved. Phoenix, AZ</div>
      </footer>
    </>
  )
}

/* ══════════════════════════════════════════════════════
   CHECKOUT MODAL
   ══════════════════════════════════════════════════════ */

function CheckoutModal({ cart, total, orderType, location, onClose, onComplete }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', email: '', time: '', address: '', notes: '' })
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  if (step === 3) return (
    <div style={modal.backdrop} onClick={onComplete}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌮</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 32, marginBottom: 8 }}>ORDER PLACED!</div>
          <div style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>
            {orderType === 'pickup' ? `Pick up at ${location.name}` : 'Delivery on its way'}<br />
            We'll text {form.phone} when it's ready.
          </div>
          <button onClick={onComplete} style={{ ...hero.btnPrimary, marginTop: 24 }}>Done</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={modal.backdrop} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        <div style={modal.header}>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: '0.05em' }}>
            {step === 1 ? 'YOUR INFO' : 'REVIEW ORDER'}
          </span>
          <button onClick={onClose} style={{ fontSize: 20, color: 'var(--text2)' }}>✕</button>
        </div>
        {step === 1 ? (
          <div style={modal.body}>
            <Input label="Name" value={form.name} onChange={v => upd('name', v)} required />
            <Input label="Phone" type="tel" value={form.phone} onChange={v => upd('phone', v)} required />
            <Input label="Email" type="email" value={form.email} onChange={v => upd('email', v)} />
            {orderType === 'pickup' ? (
              <div style={modal.field}>
                <label style={modal.label}>Pickup Time</label>
                <select value={form.time} onChange={e => upd('time', e.target.value)} style={modal.input}>
                  <option value="">ASAP</option>
                  {['15 min', '30 min', '45 min', '1 hour'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            ) : (
              <Input label="Delivery Address" value={form.address} onChange={v => upd('address', v)} required />
            )}
            <Input label="Special Instructions" value={form.notes} onChange={v => upd('notes', v)} placeholder="No onions, extra salsa..." />
            <button onClick={() => { if (form.name && form.phone) setStep(2) }} style={{ ...hero.btnPrimary, width: '100%', textAlign: 'center', marginTop: 8 }}>Review Order</button>
          </div>
        ) : (
          <div style={modal.body}>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>
              {orderType === 'pickup' ? `Pickup at ${location.name}` : `Delivery to ${form.address}`}
              {form.time && ` · ${form.time}`}
            </div>
            {cart.map(item => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <span>{item.name} ×{item.qty}</span>
                <span style={{ color: '#D42B20', fontWeight: 600 }}>${(parseFloat(item.price.replace('$', '')) * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 8px', fontWeight: 700, fontSize: 16 }}>
              <span>Total</span>
              <span style={{ color: '#D42B20', fontFamily: "'Bebas Neue'", fontSize: 24 }}>${total.toFixed(2)}</span>
            </div>
            {form.notes && <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 8 }}>Note: {form.notes}</div>}
            <button onClick={() => setStep(3)} style={{ ...hero.btnPrimary, width: '100%', textAlign: 'center', marginTop: 8 }}>Place Order</button>
            <button onClick={() => setStep(1)} style={{ width: '100%', padding: '10px 0', color: 'var(--text2)', fontSize: 12, marginTop: 8 }}>← Back</button>
          </div>
        )}
      </div>
    </div>
  )
}

function Input({ label, value, onChange, type = 'text', required, placeholder }) {
  return (
    <div style={modal.field}>
      <label style={modal.label}>{label}{required && <span style={{ color: '#D42B20' }}> *</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} style={modal.input} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   CATERING MODAL
   ══════════════════════════════════════════════════════ */

function CateringModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false)
  if (submitted) return (
    <div style={modal.backdrop} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 32, marginBottom: 8 }}>REQUEST SENT!</div>
          <div style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>We'll get back to you within 24 hours to confirm your catering order.</div>
          <button onClick={onClose} style={{ ...hero.btnPrimary, marginTop: 24 }}>Done</button>
        </div>
      </div>
    </div>
  )
  return (
    <div style={modal.backdrop} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        <div style={modal.header}>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: '0.05em' }}>BOOK CATERING</span>
          <button onClick={onClose} style={{ fontSize: 20, color: 'var(--text2)' }}>✕</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} style={modal.body}>
          <Input label="Name" onChange={() => {}} required />
          <Input label="Phone" type="tel" onChange={() => {}} required />
          <Input label="Email" type="email" onChange={() => {}} required />
          <div style={modal.field}>
            <label style={modal.label}>Event Date <span style={{ color: '#D42B20' }}>*</span></label>
            <input type="date" required style={modal.input} />
          </div>
          <div style={modal.field}>
            <label style={modal.label}>Estimated Guests <span style={{ color: '#D42B20' }}>*</span></label>
            <select required style={modal.input}>
              <option value="">Select...</option>
              {['10–20', '20–40', '40–60', '60–100', '100+'].map(o => <option key={o} value={o}>{o} guests</option>)}
            </select>
          </div>
          <div style={modal.field}>
            <label style={modal.label}>Tell us about your event</label>
            <textarea rows={3} placeholder="Type of event, preferences, special requests..." style={{ ...modal.input, resize: 'vertical' }} />
          </div>
          <button type="submit" style={{ ...hero.btnPrimary, width: '100%', textAlign: 'center', marginTop: 8 }}>Submit Request</button>
        </form>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   NAV
   ══════════════════════════════════════════════════════ */

function Nav({ cartCount, onCartClick, mobileNav, setMobileNav }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
        background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}>
        <a href="#" style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: '0.08em' }}>
          TACO <span style={{ color: '#D42B20' }}>BOY'S</span>
        </a>
        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }} className="nav-desktop">
          {['Menu', 'Catering', 'Locations'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text2)' }}>{l}</a>
          ))}
          <button onClick={onCartClick} style={{
            padding: '8px 16px', borderRadius: 100, background: '#D42B20', color: '#fff',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            🌮 {cartCount > 0 ? cartCount : 'Order'}
          </button>
        </div>
        {/* Mobile hamburger */}
        <div className="nav-mobile" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onCartClick} style={{ fontSize: 18, position: 'relative' }}>
            🌮{cartCount > 0 && <span style={{ position: 'absolute', top: -6, right: -8, background: '#D42B20', color: '#fff', fontSize: 9, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
          </button>
          <button onClick={() => setMobileNav(!mobileNav)} style={{ fontSize: 22, color: 'var(--text)' }}>
            {mobileNav ? '✕' : '☰'}
          </button>
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileNav && (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, zIndex: 199, background: 'rgba(10,10,10,0.96)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
          {['Menu', 'Catering', 'Locations'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileNav(false)} style={{ fontFamily: "'Bebas Neue'", fontSize: 36, letterSpacing: '0.1em', color: 'var(--text)' }}>{l.toUpperCase()}</a>
          ))}
          <a href="https://instagram.com/aztacoboys" target="_blank" rel="noopener" style={{ fontSize: 14, color: '#D42B20', fontWeight: 600 }}>@aztacoboys</a>
        </div>
      )}
    </>
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
  btnPrimary: { display: 'inline-block', padding: '16px 36px', background: '#D42B20', color: '#fff', fontSize: 14, fontWeight: 700, borderRadius: 100, boxShadow: '0 0 30px rgba(212,43,32,0.3)', letterSpacing: '0.05em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' },
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

const abt = {
  wrap: { padding: '80px 24px', background: 'var(--bg2)' },
  inner: { maxWidth: 900, margin: '0 auto', textAlign: 'center' },
  stats: { display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', marginBottom: 32 },
  stat: { textAlign: 'center' },
  statVal: { fontFamily: "'Bebas Neue'", fontSize: 36, color: 'var(--text)', letterSpacing: '0.05em' },
  statLabel: { fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)' },
  text: { fontSize: 16, lineHeight: 1.8, color: 'var(--text2)', maxWidth: 600, margin: '0 auto' },
}

const mn = {
  wrap: { padding: '100px 24px' },
  inner: { maxWidth: 900, margin: '0 auto' },
  tag: { fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.25em', color: '#D42B20', marginBottom: 12, textAlign: 'center' },
  h2: { fontFamily: "'Bebas Neue'", fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '0.04em', lineHeight: 1.1, color: 'var(--text)', textAlign: 'center', marginBottom: 32 },
  tabs: { display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 },
  tab: { padding: '8px 18px', borderRadius: 100, fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', border: '1px solid', transition: 'all 0.3s ease', fontFamily: "'DM Sans'" },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 },
  card: { background: 'var(--surface)', border: '1px solid', borderRadius: 12, padding: 18, transition: 'border-color 0.3s ease' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  itemName: { fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 },
  itemDesc: { fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 },
  itemPrice: { fontFamily: "'Bebas Neue'", fontSize: 22, color: '#D42B20', letterSpacing: '0.05em', flexShrink: 0 },
  addBtn: { width: '100%', padding: '10px 0', borderRadius: 100, border: '1px solid', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: "'DM Sans'" },
  salsaBar: { display: 'flex', gap: 16, alignItems: 'flex-start', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginTop: 32, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' },
}

const cat = {
  wrap: { padding: '100px 24px', background: 'var(--bg2)' },
  inner: { maxWidth: 1000, margin: '0 auto', textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, textAlign: 'center' },
  cardPrice: { fontFamily: "'Bebas Neue'", fontSize: 36, color: '#D42B20', letterSpacing: '0.05em', marginBottom: 4 },
  cardName: { fontFamily: "'Bebas Neue'", fontSize: 22, color: 'var(--text)', letterSpacing: '0.05em', marginBottom: 4 },
  cardBtn: { padding: '12px 28px', borderRadius: 100, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'border-color 0.3s ease', fontFamily: "'DM Sans'" },
}

const loy = {
  wrap: { padding: '80px 24px' },
  inner: { maxWidth: 600, margin: '0 auto', textAlign: 'center' },
  card: { background: 'linear-gradient(135deg, #D42B20, #F5A623)', borderRadius: 16, padding: 3, marginTop: 32 },
  cardInner: { background: 'var(--surface)', borderRadius: 14, padding: 28 },
  reward: { background: 'var(--surface2)', borderRadius: 10, padding: 14 },
}

const lc = {
  wrap: { padding: '100px 24px', background: 'var(--bg2)' },
  inner: { maxWidth: 1100, margin: '0 auto', textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 22, textAlign: 'left' },
  cardName: { fontFamily: "'Bebas Neue'", fontSize: 22, color: 'var(--text)', letterSpacing: '0.05em' },
  flag: { fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 100, background: 'rgba(212,43,32,0.1)', color: '#D42B20', whiteSpace: 'nowrap' },
  dirBtn: { display: 'block', width: '100%', padding: '10px 20px', borderRadius: 100, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', fontSize: 12, fontWeight: 600, textAlign: 'center', transition: 'border-color 0.3s ease' },
}

const cta = {
  wrap: { padding: '120px 24px', background: 'linear-gradient(180deg, var(--bg) 0%, #1a0a08 50%, var(--bg) 100%)', textAlign: 'center' },
  inner: { maxWidth: 700, margin: '0 auto' },
}

const foot = { wrap: { padding: '48px 24px 32px', textAlign: 'center', borderTop: '1px solid var(--border)' } }

const drawer = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 298, backdropFilter: 'blur(4px)' },
  panel: { position: 'fixed', top: 0, right: 0, bottom: 0, width: 380, maxWidth: '100vw', zIndex: 299, background: 'var(--bg)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', transition: 'transform 0.4s cubic-bezier(.16,1,.3,1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' },
  toggleRow: { display: 'flex', gap: 8, padding: '12px 20px' },
  toggleBtn: { flex: 1, padding: '10px 0', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: "'DM Sans'" },
  select: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13, fontFamily: "'DM Sans'" },
  items: { flex: 1, overflowY: 'auto', padding: '0 20px' },
  item: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border)' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 4 },
  qtyBtn: { width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--text)', background: 'var(--surface)', cursor: 'pointer' },
  footer: { padding: 20, borderTop: '1px solid var(--border)' },
  checkoutBtn: { width: '100%', padding: '16px 0', borderRadius: 100, background: '#D42B20', color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', border: 'none', cursor: 'pointer', textTransform: 'uppercase' },
}

const modal = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' },
  box: { background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, width: '100%', maxWidth: 440, maxHeight: '90vh', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' },
  body: { padding: 24, display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--text)', letterSpacing: '0.05em' },
  input: { padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, fontFamily: "'DM Sans'" },
}
