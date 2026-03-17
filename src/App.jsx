import { useState, useEffect, useRef, useCallback } from 'react'
import { MENU, LOCATIONS, SPECIALS, MILL_AVE_COCKTAILS, PRESS, IMG, mapsUrl } from './data/menu'
import { getCart, saveCart, addOrder, addCateringRequest } from './data/store'
import Admin from './pages/Admin'

/* ── Reveal ── */
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return <div ref={ref} style={{ ...style, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.8s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>{children}</div>
}

export default function App() {
  const [page, setPage] = useState(window.location.hash === '#admin' ? 'admin' : 'store')
  const [heroVis, setHeroVis] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Tacos')
  const [cart, setCart] = useState(getCart)
  const [cartOpen, setCartOpen] = useState(false)
  const [orderType, setOrderType] = useState('pickup')
  const [pickupLocation, setPickupLocation] = useState(0)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [cateringOpen, setCateringOpen] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [addedFlash, setAddedFlash] = useState(null)
  const [orderConfirm, setOrderConfirm] = useState(null)

  useEffect(() => { setTimeout(() => setHeroVis(true), 200) }, [])
  useEffect(() => { saveCart(cart) }, [cart])
  useEffect(() => { const fn = () => setPage(window.location.hash === '#admin' ? 'admin' : 'store'); window.addEventListener('hashchange', fn); return () => window.removeEventListener('hashchange', fn) }, [])

  const doAddToCart = useCallback((item) => {
    setCart(prev => { const ex = prev.find(c => c.id === item.id); if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c); return [...prev, { ...item, qty: 1 }] })
    setAddedFlash(item.id); setTimeout(() => setAddedFlash(null), 800)
  }, [])
  const updateQty = useCallback((id, d) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(0, c.qty + d) } : c).filter(c => c.qty > 0)), [])
  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = cart.reduce((s, c) => s + c.qty, 0)
  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0)

  const handleCheckout = (form) => {
    const order = addOrder({ name: form.name, phone: form.phone, email: form.email, items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })), total: cartTotal, type: orderType, location: LOCATIONS[pickupLocation].name, notes: form.notes })
    setOrderConfirm(order)
    clearCart()
    setCheckoutOpen(false)
  }

  if (page === 'admin') return <Admin onBack={() => { window.location.hash = ''; setPage('store') }} />

  return (
    <>
      <Nav cartCount={cartCount} onCartClick={() => setCartOpen(true)} mobileNav={mobileNav} setMobileNav={setMobileNav} />

      {/* Cart drawer */}
      {cartOpen && <div style={drw.backdrop} onClick={() => setCartOpen(false)} />}
      <div style={{ ...drw.panel, transform: cartOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div style={drw.header}>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: '0.05em' }}>YOUR ORDER</span>
          <button onClick={() => setCartOpen(false)} style={{ fontSize: 20, color: 'var(--text2)', padding: 4 }}>✕</button>
        </div>
        <div style={drw.toggleRow}>
          {['pickup', 'delivery'].map(t => (
            <button key={t} onClick={() => setOrderType(t)} style={{ ...drw.toggleBtn, background: orderType === t ? '#C4371A' : '#3A2C22', color: orderType === t ? '#fff' : '#BFA98E' }}>{t === 'pickup' ? '🏃 Pickup' : '🚗 Delivery'}</button>
          ))}
        </div>
        <div style={{ padding: '0 20px 12px' }}>
          <select value={pickupLocation} onChange={e => setPickupLocation(+e.target.value)} style={drw.select}>
            {LOCATIONS.map((l, i) => <option key={l.id} value={i}>{l.name}</option>)}
          </select>
        </div>
        <div style={drw.items}>
          {cart.length === 0 ? <div style={{ padding: '48px 20px', textAlign: 'center', color: '#8A7460' }}>Your cart is empty</div> : cart.map(item => (
            <div key={item.id} style={drw.item}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#FFF8F0', fontSize: 14 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#8A7460' }}>${item.price} each</div>
              </div>
              <div style={drw.qtyRow}>
                <button onClick={() => updateQty(item.id, -1)} style={drw.qtyBtn}>−</button>
                <span style={{ minWidth: 24, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} style={drw.qtyBtn}>+</button>
              </div>
              <div style={{ minWidth: 50, textAlign: 'right', fontWeight: 700, color: '#C4371A', fontSize: 14 }}>${(item.price * item.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={drw.footer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: '#C4371A' }}>${cartTotal.toFixed(2)}</span>
            </div>
            <button onClick={() => { setCartOpen(false); setCheckoutOpen(true) }} style={drw.checkoutBtn}>Checkout — {orderType === 'pickup' ? 'Pickup' : 'Delivery'}</button>
            <button onClick={clearCart} style={{ width: '100%', padding: '10px 0', color: '#8A7460', fontSize: 12, marginTop: 8 }}>Clear Cart</button>
          </div>
        )}
      </div>

      {/* Checkout modal */}
      {checkoutOpen && <CheckoutModal cart={cart} total={cartTotal} orderType={orderType} location={LOCATIONS[pickupLocation]} onClose={() => setCheckoutOpen(false)} onComplete={handleCheckout} />}
      {/* Order confirmation */}
      {orderConfirm && <OrderConfirmation order={orderConfirm} onClose={() => setOrderConfirm(null)} />}
      {/* Catering modal */}
      {cateringOpen && <CateringModal onClose={() => setCateringOpen(false)} />}

      {/* ═══ HERO ═══ */}
      <section style={hero.wrap}>
        <img src={IMG.hero} alt="" style={hero.bgImg} />
        <div style={hero.darkOverlay} />
        <div style={hero.fireOverlay} /><div style={hero.smokeOverlay} />
        <div style={hero.content}>
          <div style={{ ...hero.tag, opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(16px)', transition: 'all 0.9s ease 0.2s' }}>SONORAN STYLE · MESQUITE GRILLED · SINCE 2019</div>
          <h1 style={{ opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(24px)', transition: 'all 0.8s ease 0.5s' }}>
            <span style={hero.h1}>TACO</span><br /><span style={{ ...hero.h1, color: '#C4371A' }}>BOY'S</span>
          </h1>
          <p style={{ ...hero.sub, opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(16px)', transition: 'all 0.8s ease 0.9s' }}>
            Fresh tortillas from Sonora. Carne asada over mesquite charcoal.<br />6 locations across the Valley. As seen on Netflix.
          </p>
          <div style={{ ...hero.actions, opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(16px)', transition: 'all 0.8s ease 1.2s' }}>
            <a href="#menu" style={hero.btnPrimary}>Order Now</a>
            <a href="#menu" style={hero.btnGhost}>See the Menu</a>
          </div>
        </div>
        <div style={{ ...hero.scrollHint, opacity: heroVis ? 1 : 0, transition: 'opacity 1s ease 2s' }}><div style={hero.scrollLine} /></div>
      </section>

      {/* ═══ PRESS BAR ═══ */}
      <div style={press.wrap}>
        <span style={press.label}>AS SEEN ON</span>
        {PRESS.map(p => <span key={p.name} style={press.item}>{p.name}</span>)}
      </div>

      {/* ═══ MARQUEE ═══ */}
      <div style={marq.wrap}><div style={marq.track}>
        {[...Array(2)].map((_, ri) => (
          <div key={ri} style={marq.set}>
            {['Carne Asada', '🔥', 'Al Pastor', '🔥', 'Vampiros', '🔥', 'Barbacoa', '🔥', 'Carnitas', '🔥', 'Cabeza', '🔥', 'Family Packs', '🔥', 'Burritos', '🔥'].map((t, i) => (
              <span key={i} style={t === '🔥' ? marq.dot : marq.item}>{t}</span>
            ))}
          </div>
        ))}
      </div></div>

      {/* ═══ ABOUT ═══ */}
      <section style={{ padding: '80px 24px', background: '#241A14' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', marginBottom: 32 }}>
              {[{ val: '6', l: 'LOCATIONS' }, { val: '94K', l: 'FOLLOWERS' }, { val: '2019', l: 'FOUNDED' }, { val: '1K+', l: 'YELP REVIEWS' }].map(s2 => (
                <div key={s2.l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: '#FFF8F0', letterSpacing: '0.05em' }}>{s2.val}</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.2em', color: '#8A7460' }}>{s2.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#BFA98E', maxWidth: 600, margin: '0 auto' }}>
              Started in 2019 on Roosevelt Row by father-and-son duo Juan Francisco Cornejo Sr. and Jr.
              What began outside a liquor store became a Phoenix phenomenon — 6 locations, a Netflix feature
              on <em style={{ color: '#C4371A' }}>Taco Chronicles</em>, and the best mesquite-grilled carne asada in Arizona.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ SPECIALS ═══ */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal><div style={tag}>SPECIALS & HAPPY HOUR</div><h2 style={h2}>Deals That <span style={{ color: '#F5A623' }}>Hit Different.</span></h2></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginTop: 24 }}>
            {SPECIALS.map((sp, i) => (
              <Reveal key={sp.name} delay={100 + i * 100}>
                <div style={{ background: '#2E221A', border: '1px solid #4A3828', borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: '#FFF8F0', letterSpacing: '0.05em' }}>{sp.name}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: 'rgba(245,166,35,0.1)', color: '#F5A623' }}>{sp.badge}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#BFA98E', lineHeight: 1.5, marginBottom: 6 }}>{sp.desc}</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: '#8A7460' }}>{sp.day}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MENU ═══ */}
      <section id="menu" style={{ padding: '100px 24px', background: '#241A14' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal><div style={tag}>THE MENU</div><h2 style={h2}>Mesquite Charcoal. Fresh Tortillas.<br /><span style={{ color: '#C4371A' }}>Real Food.</span></h2></Reveal>
          <Reveal delay={100}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
              {MENU.map(c => (
                <button key={c.category} onClick={() => setActiveCategory(c.category)} style={{ padding: '8px 18px', borderRadius: 100, fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', border: '1px solid', transition: 'all 0.3s ease', fontFamily: "'DM Sans'", background: activeCategory === c.category ? '#C4371A' : '#2E221A', color: activeCategory === c.category ? '#fff' : '#BFA98E', borderColor: activeCategory === c.category ? '#C4371A' : '#4A3828' }}>
                  {c.category}
                </button>
              ))}
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
            {MENU.find(c => c.category === activeCategory)?.items.map((item, i) => (
              <Reveal key={item.id} delay={i * 60}>
                <div style={{ background: '#2E221A', border: `1px solid ${addedFlash === item.id ? '#C4371A' : '#4A3828'}`, borderRadius: 12, padding: 18, transition: 'border-color 0.3s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#FFF8F0', marginBottom: 4 }}>{item.name}{item.hot && <span style={{ marginLeft: 6, fontSize: 12 }}>🔥</span>}</div>
                      <div style={{ fontSize: 13, color: '#BFA98E', lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: '#C4371A', letterSpacing: '0.05em', flexShrink: 0 }}>${item.price}</div>
                  </div>
                  <button onClick={() => doAddToCart(item)} style={{ width: '100%', padding: '10px 0', borderRadius: 100, border: `1px solid ${addedFlash === item.id ? '#C4371A' : '#4A3828'}`, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: "'DM Sans'", background: addedFlash === item.id ? 'rgba(212,43,32,0.1)' : 'transparent', color: addedFlash === item.id ? '#C4371A' : '#BFA98E' }}>
                    {addedFlash === item.id ? '✓ Added' : '+ Add to Order'}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#2E221A', border: '1px solid #4A3828', borderRadius: 12, padding: 20, marginTop: 32, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>🌶️</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#FFF8F0', marginBottom: 4 }}>The Salsa Bar</div>
                <div style={{ fontSize: 14, color: '#BFA98E', lineHeight: 1.6 }}>Every order comes with our legendary self-serve salsa bar — creamy avocado, green tomatillo, fiery red habanero, plus radishes, cucumbers, pico de gallo, cilantro, onion, cabbage, and lime.</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ MILL AVE BAR ═══ */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal><div style={tag}>TEMPE — MILL AVE</div><h2 style={h2}>20-Tap Beer Wall. <span style={{ color: '#F5A623' }}>Craft Cocktails.</span></h2></Reveal>
          <Reveal delay={100}>
            <p style={{ fontSize: 15, color: '#BFA98E', textAlign: 'center', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.6 }}>
              Our Mill Ave location features a self-pour beer wall with 20 taps — including draft margaritas with 3 Amigos Tequila — plus a full cocktail menu.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, marginBottom: 32 }}>
              {IMG.beerWall.slice(0, 3).map((src, i) => (
                <div key={i} style={{ borderRadius: 10, overflow: 'hidden', height: 180, background: '#2E221A' }}>
                  <img src={src} alt="Taco Boy's Bar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                </div>
              ))}
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {MILL_AVE_COCKTAILS.map((c, i) => (
              <Reveal key={c.name} delay={150 + i * 80}>
                <div style={{ background: '#2E221A', border: '1px solid #4A3828', borderRadius: 12, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#FFF8F0' }}>{c.name}</span>
                    <span style={{ fontFamily: "'Bebas Neue'", fontSize: 18, color: '#F5A623' }}>${c.price}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#BFA98E', lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATERING ═══ */}
      <section id="catering" style={{ padding: '100px 24px', background: '#241A14' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <Reveal><div style={tag}>CATERING</div><h2 style={h2}>Feed Your <span style={{ color: '#C4371A' }}>Whole Crew.</span></h2>
          <p style={{ fontSize: 15, color: '#BFA98E', lineHeight: 1.6, maxWidth: 460, margin: '0 auto 40px' }}>Corporate events, birthday parties, game day — we cater everything. Mesquite-grilled meats, fresh tortillas, and the full salsa bar.</p></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { name: 'Taco Pack', serves: '10–15', price: '$120', desc: '3 lbs of meat, 30 tortillas, rice, beans, salsa bar setup' },
              { name: 'Party Pack', serves: '25–30', price: '$250', desc: '6 lbs of mixed meats, 60 tortillas, rice, beans, full salsa bar, chips & guac' },
              { name: 'Event Package', serves: '50+', price: 'Custom', desc: 'Full catering setup with staff, unlimited meats, sides, drinks, and dessert' },
            ].map((pkg, i) => (
              <Reveal key={pkg.name} delay={100 + i * 100}>
                <div style={{ background: '#2E221A', border: '1px solid #4A3828', borderRadius: 16, padding: 28, textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: '#C4371A', letterSpacing: '0.05em', marginBottom: 4 }}>{pkg.price}</div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: '#FFF8F0', letterSpacing: '0.05em', marginBottom: 4 }}>{pkg.name}</div>
                  <div style={{ fontSize: 12, color: '#F5A623', fontWeight: 600, marginBottom: 12 }}>Serves {pkg.serves}</div>
                  <div style={{ fontSize: 13, color: '#BFA98E', lineHeight: 1.6, marginBottom: 20 }}>{pkg.desc}</div>
                  <button onClick={() => setCateringOpen(true)} style={{ padding: '12px 28px', borderRadius: 100, background: 'transparent', border: '1px solid #4A3828', color: '#FFF8F0', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Book Catering</button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LOYALTY ═══ */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <Reveal><div style={tag}>LOYALTY</div><h2 style={h2}>Eat Tacos. <span style={{ color: '#F5A623' }}>Earn Points.</span></h2></Reveal>
          <Reveal delay={100}>
            <div style={{ background: 'linear-gradient(135deg, #C4371A, #F5A623)', borderRadius: 16, padding: 3, marginTop: 32 }}>
              <div style={{ background: '#2E221A', borderRadius: 14, padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div><div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: '0.05em' }}>TACO BOY'S REWARDS</div><div style={{ fontSize: 12, color: '#BFA98E' }}>Earn 1 point per dollar spent</div></div>
                  <div style={{ fontSize: 36 }}>🌮</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {[{ pts: '50 pts', reward: 'Free Drink' }, { pts: '100 pts', reward: 'Free Taco' }, { pts: '250 pts', reward: 'Free Plato' }].map(r => (
                    <div key={r.pts} style={{ background: '#3A2C22', borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#F5A623', fontFamily: "'Bebas Neue'", letterSpacing: '0.05em' }}>{r.pts}</div>
                      <div style={{ fontSize: 12, color: '#BFA98E' }}>{r.reward}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ LOCATIONS ═══ */}
      <section id="locations" style={{ padding: '100px 24px', background: '#241A14' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <Reveal><div style={tag}>LOCATIONS</div><h2 style={h2}>6 Spots Across <span style={{ color: '#C4371A' }}>The Valley.</span></h2></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {LOCATIONS.map((l, i) => (
              <Reveal key={l.id} delay={100 + i * 80}>
                <div style={{ background: '#2E221A', border: '1px solid #4A3828', borderRadius: 14, overflow: 'hidden', textAlign: 'left' }}>
                  {i === 0 && <div style={{ height: 120, overflow: 'hidden' }}><img src={IMG.storefront} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" /></div>}
                  <div style={{ padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: '#FFF8F0', letterSpacing: '0.05em' }}>{l.name}</div>
                    {l.flag && <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 100, background: 'rgba(212,43,32,0.1)', color: '#C4371A', whiteSpace: 'nowrap' }}>{l.flag}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: '#BFA98E', marginBottom: 6 }}>{l.addr}</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: '#8A7460', marginBottom: 6 }}>{l.hours}</div>
                  <a href={`tel:${l.phone.replace(/[^0-9]/g, '')}`} style={{ fontSize: 13, color: '#C4371A', fontWeight: 600, marginBottom: 14, display: 'block' }}>{l.phone}</a>
                  <a href={mapsUrl(l.addr)} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', padding: '10px 20px', borderRadius: 100, background: 'transparent', border: '1px solid #4A3828', color: '#BFA98E', fontSize: 12, fontWeight: 600, textAlign: 'center' }}>Get Directions →</a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal><div style={tag}>THE VIBE</div><h2 style={h2}>Mesquite Smoke. <span style={{ color: '#C4371A' }}>Good Times.</span></h2></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 8, marginTop: 32 }}>
            {[...IMG.gallery.slice(0, 4), ...IMG.food.slice(0, 2), ...IMG.interior.slice(0, 2)].map((src, i) => (
              <Reveal key={i} delay={i * 60}>
                <div style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: i % 3 === 0 ? '4/5' : '1/1', background: '#2E221A' }}>
                  <img src={src} alt="Taco Boy's" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} loading="lazy" />
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <a href="https://instagram.com/aztacoboys" target="_blank" rel="noopener" style={{ fontSize: 14, color: '#C4371A', fontWeight: 600 }}>See more on Instagram → @aztacoboys</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <div style={{ fontSize: 24, fontFamily: "'Bebas Neue'", letterSpacing: '0.05em', marginBottom: 8 }}>GET THE DROP</div>
            <div style={{ fontSize: 14, color: '#BFA98E', marginBottom: 20 }}>New menu items, promos, and events — straight to your inbox.</div>
            <form onSubmit={e => { e.preventDefault(); alert('Subscribed! 🌮') }} style={{ display: 'flex', gap: 8 }}>
              <input type="email" placeholder="your@email.com" required style={{ flex: 1, padding: '12px 16px', borderRadius: 100, border: '1px solid #4A3828', background: '#2E221A', color: '#FFF8F0', fontSize: 14, fontFamily: "'DM Sans'" }} />
              <button type="submit" style={{ padding: '12px 24px', borderRadius: 100, background: '#C4371A', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', flexShrink: 0 }}>Subscribe</button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '120px 24px', background: 'linear-gradient(180deg, #1C1410 0%, #3A2215 50%, #1C1410 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <Reveal>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🔥</div>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(40px, 8vw, 80px)', color: '#FFF8F0', letterSpacing: '0.03em', lineHeight: 1 }}>STOP SCROLLING.<br /><span style={{ color: '#C4371A' }}>START EATING.</span></h2>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
              <a href="#menu" style={hero.btnPrimary}>Order Now</a>
              <a href="https://instagram.com/aztacoboys" target="_blank" rel="noopener" style={hero.btnGhost}>@aztacoboys</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: '48px 24px 32px', textAlign: 'center', borderTop: '1px solid #4A3828' }}>
        <img src={IMG.logo} alt="Taco Boy's" style={{ height: 48, objectFit: 'contain', margin: '0 auto 12px', opacity: 0.7 }} />
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, letterSpacing: '0.2em', color: '#8A7460', marginBottom: 20 }}>SONORAN STYLE SINCE 2019</div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16, fontSize: 13, color: '#BFA98E' }}>
          <a href="#menu">Menu</a><a href="#catering">Catering</a><a href="#locations">Locations</a>
          <a href="https://instagram.com/aztacoboys" target="_blank" rel="noopener">Instagram</a>
          <a href="#admin" style={{ color: '#8A7460' }}>Admin</a>
        </div>
        <div style={{ fontSize: 11, color: '#8A7460', opacity: 0.5 }}>© 2026 Taco Boy's. All rights reserved. Phoenix, AZ</div>
      </footer>
    </>
  )
}

/* ═══ MODALS ═══ */

function CheckoutModal({ cart, total, orderType, location, onClose, onComplete }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', email: '', time: '', address: '', notes: '' })
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }))
  return (
    <div style={mod.backdrop} onClick={onClose}><div style={mod.box} onClick={e => e.stopPropagation()}>
      <div style={mod.header}>
        <span style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: '0.05em' }}>{step === 1 ? 'YOUR INFO' : 'REVIEW ORDER'}</span>
        <button onClick={onClose} style={{ fontSize: 20, color: '#BFA98E' }}>✕</button>
      </div>
      {step === 1 ? (
        <div style={mod.body}>
          <Field label="Name *" value={form.name} onChange={v => u('name', v)} />
          <Field label="Phone *" type="tel" value={form.phone} onChange={v => u('phone', v)} />
          <Field label="Email" type="email" value={form.email} onChange={v => u('email', v)} />
          {orderType === 'pickup' ? (
            <div style={mod.field}><label style={mod.label}>Pickup Time</label><select value={form.time} onChange={e => u('time', e.target.value)} style={mod.input}><option value="">ASAP</option>{['15 min', '30 min', '45 min', '1 hour'].map(t => <option key={t}>{t}</option>)}</select></div>
          ) : <Field label="Delivery Address *" value={form.address} onChange={v => u('address', v)} />}
          <Field label="Special Instructions" value={form.notes} onChange={v => u('notes', v)} placeholder="No onions, extra salsa..." />
          <button onClick={() => { if (form.name && form.phone) setStep(2) }} style={{ ...hero.btnPrimary, width: '100%', textAlign: 'center', marginTop: 8 }}>Review Order</button>
        </div>
      ) : (
        <div style={mod.body}>
          <div style={{ fontSize: 12, color: '#BFA98E', marginBottom: 8 }}>{orderType === 'pickup' ? `Pickup at ${location.name}` : `Delivery to ${form.address}`}{form.time && ` · ${form.time}`}</div>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #4A3828', fontSize: 14 }}>
              <span>{item.name} ×{item.qty}</span><span style={{ color: '#C4371A', fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 8px', fontWeight: 700, fontSize: 16 }}>
            <span>Total</span><span style={{ color: '#C4371A', fontFamily: "'Bebas Neue'", fontSize: 24 }}>${total.toFixed(2)}</span>
          </div>
          <button onClick={() => onComplete(form)} style={{ ...hero.btnPrimary, width: '100%', textAlign: 'center', marginTop: 8 }}>Place Order</button>
          <button onClick={() => setStep(1)} style={{ width: '100%', padding: '10px 0', color: '#BFA98E', fontSize: 12, marginTop: 8 }}>← Back</button>
        </div>
      )}
    </div></div>
  )
}

function OrderConfirmation({ order, onClose }) {
  return (
    <div style={mod.backdrop} onClick={onClose}><div style={mod.box} onClick={e => e.stopPropagation()}>
      <div style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌮</div>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 32, marginBottom: 4 }}>ORDER PLACED!</div>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, color: '#C4371A', marginBottom: 12 }}>{order.id}</div>
        <div style={{ color: '#BFA98E', fontSize: 14, lineHeight: 1.6, marginBottom: 4 }}>{order.type === 'pickup' ? `Pick up at ${order.location}` : 'Delivery on its way'}</div>
        <div style={{ color: '#8A7460', fontSize: 13 }}>We'll text you when it's ready.</div>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: '#C4371A', margin: '16px 0' }}>${order.total?.toFixed(2)}</div>
        <button onClick={onClose} style={{ ...hero.btnPrimary, marginTop: 8 }}>Done</button>
      </div>
    </div></div>
  )
}

function CateringModal({ onClose }) {
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', guests: '', details: '' })
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }))
  if (done) return (
    <div style={mod.backdrop} onClick={onClose}><div style={mod.box} onClick={e => e.stopPropagation()}>
      <div style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 32, marginBottom: 8 }}>REQUEST SENT!</div>
        <div style={{ color: '#BFA98E', fontSize: 14, lineHeight: 1.6 }}>We'll get back to you within 24 hours.</div>
        <button onClick={onClose} style={{ ...hero.btnPrimary, marginTop: 24 }}>Done</button>
      </div>
    </div></div>
  )
  return (
    <div style={mod.backdrop} onClick={onClose}><div style={mod.box} onClick={e => e.stopPropagation()}>
      <div style={mod.header}><span style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: '0.05em' }}>BOOK CATERING</span><button onClick={onClose} style={{ fontSize: 20, color: '#BFA98E' }}>✕</button></div>
      <form onSubmit={e => { e.preventDefault(); addCateringRequest(form); setDone(true) }} style={mod.body}>
        <Field label="Name *" value={form.name} onChange={v => u('name', v)} required />
        <Field label="Phone *" type="tel" value={form.phone} onChange={v => u('phone', v)} required />
        <Field label="Email *" type="email" value={form.email} onChange={v => u('email', v)} required />
        <div style={mod.field}><label style={mod.label}>Event Date *</label><input type="date" required value={form.date} onChange={e => u('date', e.target.value)} style={mod.input} /></div>
        <div style={mod.field}><label style={mod.label}>Guests *</label><select required value={form.guests} onChange={e => u('guests', e.target.value)} style={mod.input}><option value="">Select...</option>{['10–20', '20–40', '40–60', '60–100', '100+'].map(o => <option key={o}>{o}</option>)}</select></div>
        <div style={mod.field}><label style={mod.label}>Details</label><textarea rows={3} value={form.details} onChange={e => u('details', e.target.value)} placeholder="Type of event, preferences..." style={{ ...mod.input, resize: 'vertical' }} /></div>
        <button type="submit" style={{ ...hero.btnPrimary, width: '100%', textAlign: 'center', marginTop: 8 }}>Submit Request</button>
      </form>
    </div></div>
  )
}

function Field({ label, value, onChange, type = 'text', required, placeholder }) {
  return <div style={mod.field}><label style={mod.label}>{label}</label><input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} style={mod.input} /></div>
}

function Nav({ cartCount, onCartClick, mobileNav, setMobileNav }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn) }, [])
  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid #4A3828' : '1px solid transparent', transition: 'all 0.4s ease' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={IMG.logo} alt="Taco Boy's" style={{ height: 36, objectFit: 'contain' }} />
        </a>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }} className="nav-desktop">
          {['Menu', 'Catering', 'Locations'].map(l => <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#BFA98E' }}>{l}</a>)}
          <button onClick={onCartClick} style={{ padding: '8px 16px', borderRadius: 100, background: '#C4371A', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6, border: 'none' }}>🌮 {cartCount > 0 ? cartCount : 'Order'}</button>
        </div>
        <div className="nav-mobile" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onCartClick} style={{ fontSize: 18, position: 'relative' }}>🌮{cartCount > 0 && <span style={{ position: 'absolute', top: -6, right: -8, background: '#C4371A', color: '#fff', fontSize: 9, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}</button>
          <button onClick={() => setMobileNav(!mobileNav)} style={{ fontSize: 22, color: '#FFF8F0' }}>{mobileNav ? '✕' : '☰'}</button>
        </div>
      </nav>
      {mobileNav && <div style={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, zIndex: 199, background: 'rgba(10,10,10,0.96)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
        {['Menu', 'Catering', 'Locations'].map(l => <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileNav(false)} style={{ fontFamily: "'Bebas Neue'", fontSize: 36, letterSpacing: '0.1em', color: '#FFF8F0' }}>{l.toUpperCase()}</a>)}
        <a href="https://instagram.com/aztacoboys" target="_blank" rel="noopener" style={{ fontSize: 14, color: '#C4371A', fontWeight: 600 }}>@aztacoboys</a>
      </div>}
    </>
  )
}

/* ═══ STYLES ═══ */

const tag = { fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.25em', color: '#C4371A', marginBottom: 12, textAlign: 'center' }
const h2 = { fontFamily: "'Bebas Neue'", fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '0.04em', lineHeight: 1.1, color: '#FFF8F0', textAlign: 'center', marginBottom: 16 }

const hero = {
  wrap: { position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'linear-gradient(180deg, #1C1410 0%, #2A1A10 60%, #1C1410 100%)' },
  bgImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 },
  darkOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(28,20,16,0.4) 0%, rgba(28,20,16,0.55) 40%, rgba(28,20,16,0.9) 100%)', zIndex: 1 },
  fireOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'radial-gradient(ellipse at center bottom, rgba(232,168,64,0.2) 0%, rgba(196,55,26,0.1) 30%, transparent 70%)', pointerEvents: 'none', animation: 'firePulse 4s ease-in-out infinite', zIndex: 1 },
  smokeOverlay: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(245,192,74,0.06) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 1 },
  content: { position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' },
  tag: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.25em', color: '#C4371A', marginBottom: 24 },
  h1: { fontFamily: "'Bebas Neue'", fontSize: 'clamp(60px, 14vw, 160px)', letterSpacing: '0.06em', lineHeight: 0.9, color: '#FFF8F0', display: 'inline-block' },
  sub: { fontFamily: "'DM Sans'", fontWeight: 300, fontSize: 'clamp(14px, 2vw, 18px)', lineHeight: 1.7, color: '#BFA98E', margin: '24px 0 40px' },
  actions: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: { display: 'inline-block', padding: '16px 36px', background: '#C4371A', color: '#fff', fontSize: 14, fontWeight: 700, borderRadius: 100, boxShadow: '0 0 30px rgba(212,43,32,0.3)', letterSpacing: '0.05em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' },
  btnGhost: { display: 'inline-block', padding: '16px 36px', background: 'transparent', color: '#C4371A', fontSize: 14, fontWeight: 600, borderRadius: 100, border: '1px solid rgba(212,43,32,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase' },
  scrollHint: { position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 2 },
  scrollLine: { width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, #C4371A, transparent)', animation: 'float 2s ease-in-out infinite' },
}

const press = {
  wrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '16px 24px', background: '#241A14', borderBottom: '1px solid #3A2C22', flexWrap: 'wrap' },
  label: { fontFamily: "'JetBrains Mono'", fontSize: 9, letterSpacing: '0.2em', color: '#8A7460' },
  item: { fontFamily: "'Bebas Neue'", fontSize: 16, letterSpacing: '0.08em', color: '#3a3530', transition: 'color 0.3s' },
}

const marq = {
  wrap: { overflow: 'hidden', borderTop: '1px solid rgba(212,43,32,0.15)', borderBottom: '1px solid rgba(212,43,32,0.15)', background: 'rgba(212,43,32,0.03)', padding: '14px 0' },
  track: { display: 'flex', width: 'max-content', animation: 'marquee 25s linear infinite' },
  set: { display: 'flex', alignItems: 'center', gap: 24, paddingRight: 24 },
  item: { fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: '0.1em', color: '#C4371A', whiteSpace: 'nowrap' },
  dot: { fontSize: 14, opacity: 0.5 },
}

const drw = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 298, backdropFilter: 'blur(4px)' },
  panel: { position: 'fixed', top: 0, right: 0, bottom: 0, width: 380, maxWidth: '100vw', zIndex: 299, background: '#1C1410', borderLeft: '1px solid #4A3828', display: 'flex', flexDirection: 'column', transition: 'transform 0.4s cubic-bezier(.16,1,.3,1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 16px', borderBottom: '1px solid #4A3828' },
  toggleRow: { display: 'flex', gap: 8, padding: '12px 20px' },
  toggleBtn: { flex: 1, padding: '10px 0', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: "'DM Sans'" },
  select: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #4A3828', background: '#2E221A', color: '#FFF8F0', fontSize: 13, fontFamily: "'DM Sans'" },
  items: { flex: 1, overflowY: 'auto', padding: '0 20px' },
  item: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #4A3828' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 4 },
  qtyBtn: { width: 28, height: 28, borderRadius: '50%', border: '1px solid #4A3828', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#FFF8F0', background: '#2E221A', cursor: 'pointer' },
  footer: { padding: 20, borderTop: '1px solid #4A3828' },
  checkoutBtn: { width: '100%', padding: '16px 0', borderRadius: 100, background: '#C4371A', color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', border: 'none', cursor: 'pointer', textTransform: 'uppercase' },
}

const mod = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' },
  box: { background: '#1C1410', border: '1px solid #4A3828', borderRadius: 16, width: '100%', maxWidth: 440, maxHeight: '90vh', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #4A3828' },
  body: { padding: 24, display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: '#FFF8F0', letterSpacing: '0.05em' },
  input: { padding: '10px 14px', borderRadius: 8, border: '1px solid #4A3828', background: '#2E221A', color: '#FFF8F0', fontSize: 14, fontFamily: "'DM Sans'" },
}
