import { useState, useEffect, useRef, useCallback } from 'react'
import { MENU, LOCATIONS, SPECIALS, MILL_AVE_COCKTAILS, PRESS, IMG, mapsUrl } from './data/menu'
import { getCart, saveCart, addOrder, addCateringRequest } from './data/store'
import Admin from './pages/Admin'
import MemberPortal from './pages/MemberPortal'

/* ── Reveal ── */
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } }, { threshold: 0.1 }); obs.observe(el); return () => obs.disconnect() }, [])
  return <div ref={ref} style={{ ...style, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>{children}</div>
}

export default function App() {
  const [page, setPage] = useState(window.location.hash === '#admin' ? 'admin' : window.location.hash === '#rewards' ? 'rewards' : 'store')
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
  useEffect(() => { const fn = () => setPage(window.location.hash === '#admin' ? 'admin' : window.location.hash === '#rewards' ? 'rewards' : 'store'); window.addEventListener('hashchange', fn); return () => window.removeEventListener('hashchange', fn) }, [])

  const doAddToCart = useCallback((item) => {
    setCart(prev => { const ex = prev.find(c => c.id === item.id); if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c); return [...prev, { ...item, qty: 1 }] })
    setAddedFlash(item.id); setTimeout(() => setAddedFlash(null), 800)
  }, [])
  const updateQty = useCallback((id, d) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(0, c.qty + d) } : c).filter(c => c.qty > 0)), [])
  const clearCart = useCallback(() => setCart([]), [])
  const cartCount = cart.reduce((s, c) => s + c.qty, 0)
  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const handleCheckout = (form) => { const order = addOrder({ name: form.name, phone: form.phone, email: form.email, items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })), total: cartTotal, type: orderType, location: LOCATIONS[pickupLocation].name, notes: form.notes }); setOrderConfirm(order); clearCart(); setCheckoutOpen(false) }

  if (page === 'admin') return <Admin onBack={() => { window.location.hash = ''; setPage('store') }} />
  if (page === 'rewards') return <MemberPortal onBack={() => { window.location.hash = ''; setPage('store') }} />

  return (
    <div style={{ background: '#fff' }}>
      <Nav cartCount={cartCount} onCartClick={() => setCartOpen(true)} mobileNav={mobileNav} setMobileNav={setMobileNav} />

      {/* Cart drawer */}
      {cartOpen && <div style={drw.backdrop} onClick={() => setCartOpen(false)} />}
      <div style={{ ...drw.panel, transform: cartOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div style={drw.header}>
          <span style={S.heading}>YOUR ORDER</span>
          <button onClick={() => setCartOpen(false)} style={{ fontSize: 20 }}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: 0, borderBottom: B }}>
          {['pickup', 'delivery'].map(t => (
            <button key={t} onClick={() => setOrderType(t)} style={{ flex: 1, padding: '12px 0', fontSize: 14, fontFamily: V.font_display, fontWeight: 700, background: orderType === t ? '#e93d3d' : '#fff', color: orderType === t ? '#fff' : '#000', borderRight: t === 'pickup' ? B : 'none' }}>
              {t === 'pickup' ? 'PICKUP' : 'DELIVERY'}
            </button>
          ))}
        </div>
        <div style={{ padding: '12px 16px', borderBottom: B }}>
          <select value={pickupLocation} onChange={e => setPickupLocation(+e.target.value)} style={{ width: '100%', padding: '10px', border: B, background: '#f5f5f5', fontSize: 13, fontFamily: V.font_body }}>
            {LOCATIONS.map((l, i) => <option key={l.id} value={i}>{l.name}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {cart.length === 0 ? <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Your cart is empty</div> : cart.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: B }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>${item.price} each</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: B }}>
                <button onClick={() => updateQty(item.id, -1)} style={{ width: 32, height: 32, fontSize: 16, fontWeight: 700, borderRight: B }}>−</button>
                <span style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} style={{ width: 32, height: 32, fontSize: 16, fontWeight: 700, borderLeft: B }}>+</button>
              </div>
              <div style={{ fontWeight: 700, color: '#e93d3d', minWidth: 50, textAlign: 'right' }}>${(item.price * item.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: 16, borderTop: '2px solid #000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 18 }}>
              <span style={{ fontFamily: V.font_display, fontWeight: 700 }}>TOTAL</span>
              <span style={{ fontFamily: V.font_display, fontWeight: 700, color: '#e93d3d' }}>${cartTotal.toFixed(2)}</span>
            </div>
            <button onClick={() => { setCartOpen(false); setCheckoutOpen(true) }} style={S.btn}>CHECKOUT →</button>
            <button onClick={clearCart} style={{ width: '100%', padding: 8, color: '#999', fontSize: 12, marginTop: 8 }}>Clear Cart</button>
          </div>
        )}
      </div>

      {checkoutOpen && <CheckoutModal cart={cart} total={cartTotal} orderType={orderType} location={LOCATIONS[pickupLocation]} onClose={() => setCheckoutOpen(false)} onComplete={handleCheckout} />}
      {orderConfirm && <OrderConfirmation order={orderConfirm} onClose={() => setOrderConfirm(null)} />}
      {cateringOpen && <CateringModal onClose={() => setCateringOpen(false)} />}

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#161616' }}>
        <img src={IMG.hero} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(20px)', transition: 'all 0.8s ease 0.3s' }}>
          <img src={IMG.logo} alt="Taco Boy's" style={{ height: 80, margin: '0 auto 24px', filter: 'brightness(10)' }} />
          <h1 style={{ fontFamily: V.font_display, fontSize: 'clamp(48px, 12vw, 120px)', color: '#fff', lineHeight: 0.95, letterSpacing: '0.04em', marginBottom: 16 }}>
            MESQUITE GRILLED<br /><span style={{ color: '#e93d3d' }}>SINCE 2019</span>
          </h1>
          <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 32, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
            Fresh tortillas from Sonora. Carne asada over mesquite charcoal. 6 locations across the Valley.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#menu" style={{ ...S.btn, display: 'inline-block', width: 'auto', padding: '16px 40px' }}>ORDER NOW</a>
            <a href="#menu" style={{ display: 'inline-block', padding: '16px 40px', border: '2px solid #fff', color: '#fff', fontFamily: V.font_display, fontSize: 20, fontWeight: 700 }}>SEE THE MENU</a>
          </div>
        </div>
      </section>

      {/* ═══ PRESS BAR ═══ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, padding: '14px 24px', background: '#161616', borderBottom: '2px solid #000', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: V.font_mono, fontSize: 9, letterSpacing: '0.2em', color: '#666' }}>AS SEEN ON</span>
        {PRESS.map(p => <span key={p.name} style={{ fontFamily: V.font_display, fontSize: 18, color: '#444' }}>{p.name.toUpperCase()}</span>)}
      </div>

      {/* ═══ MARQUEE ═══ */}
      <div style={{ overflow: 'hidden', borderBottom: B, padding: '12px 0', background: '#fff' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 20s linear infinite' }}>
          {[...Array(2)].map((_, ri) => (
            <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: 20, paddingRight: 20 }}>
              {['CARNE ASADA', '🔥', 'AL PASTOR', '🔥', 'VAMPIROS', '🔥', 'BARBACOA', '🔥', 'BURRITOS', '🔥', 'FAMILY PACKS', '🔥', 'CARNITAS', '🔥'].map((t, i) => (
                <span key={i} style={t === '🔥' ? { fontSize: 14 } : { fontFamily: V.font_display, fontSize: 20, color: '#e93d3d', whiteSpace: 'nowrap' }}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ STATS BAR ═══ */}
      <section style={{ display: 'flex', borderBottom: B, flexWrap: 'wrap' }}>
        {[{ val: '6', l: 'LOCATIONS' }, { val: '94K', l: 'FOLLOWERS' }, { val: '2019', l: 'FOUNDED' }, { val: '1K+', l: 'YELP REVIEWS' }].map((s2, i) => (
          <div key={s2.l} style={{ flex: '1 1 25%', minWidth: 150, padding: '24px 20px', textAlign: 'center', borderRight: i < 3 ? B : 'none' }}>
            <div style={{ fontFamily: V.font_display, fontSize: 36, color: '#e93d3d' }}>{s2.val}</div>
            <div style={{ fontFamily: V.font_mono, fontSize: 10, letterSpacing: '0.15em', color: '#999' }}>{s2.l}</div>
          </div>
        ))}
      </section>

      {/* ═══ SPECIALS ═══ */}
      <section style={{ padding: '60px 24px', borderBottom: B }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal><h2 style={S.h2}>SPECIALS & HAPPY HOUR</h2><div style={S.divider} /></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 0, border: B, marginTop: 24 }}>
            {SPECIALS.map((sp, i) => (
              <Reveal key={sp.name} delay={i * 80}>
                <div style={{ padding: 20, borderRight: i < SPECIALS.length - 1 ? B : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontFamily: V.font_display, fontSize: 22, color: '#000' }}>{sp.name.toUpperCase()}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', background: '#e93d3d', color: '#fff' }}>{sp.badge}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>{sp.desc}</div>
                  <div style={{ fontFamily: V.font_mono, fontSize: 11, color: '#999', marginTop: 6 }}>{sp.day}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MENU ═══ */}
      <section id="menu" style={{ padding: '60px 24px', background: '#f5f5f5', borderBottom: B }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal><h2 style={S.h2}>THE MENU</h2><div style={S.divider} /></Reveal>
          <Reveal delay={100}>
            <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', border: B, marginBottom: 24, background: '#fff' }}>
              {MENU.map((c, i) => (
                <button key={c.category} onClick={() => setActiveCategory(c.category)} style={{
                  padding: '10px 16px', fontFamily: V.font_display, fontSize: 16, fontWeight: 700,
                  background: activeCategory === c.category ? '#e93d3d' : '#fff',
                  color: activeCategory === c.category ? '#fff' : '#000',
                  borderRight: i < MENU.length - 1 ? B : 'none',
                  flex: '1 1 auto', textAlign: 'center',
                }}>
                  {c.category.toUpperCase()}
                </button>
              ))}
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 0 }}>
            {MENU.find(c => c.category === activeCategory)?.items.map((item, i) => (
              <Reveal key={item.id} delay={i * 50}>
                <div style={{ border: B, background: '#fff', overflow: 'hidden' }}>
                  {item.img && <div style={{ height: 160, overflow: 'hidden', borderBottom: B }}>
                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>}
                  <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ fontFamily: V.font_display, fontSize: 20, color: '#000' }}>{item.name.toUpperCase()}{item.hot && ' 🔥'}</div>
                      <div style={{ fontFamily: V.font_display, fontSize: 22, color: '#e93d3d' }}>${item.price}</div>
                    </div>
                    <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5, marginBottom: 12 }}>{item.desc}</div>
                    <button onClick={() => doAddToCart(item)} style={{
                      ...S.btn,
                      background: addedFlash === item.id ? '#37ca37' : '#e93d3d',
                      fontSize: 14,
                    }}>
                      {addedFlash === item.id ? '✓ ADDED' : '+ ADD TO ORDER'}
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          {/* Salsa bar */}
          <Reveal delay={200}>
            <div style={{ border: '2px solid #e93d3d', padding: 20, marginTop: 24, display: 'flex', gap: 16, alignItems: 'center', background: '#fff' }}>
              <span style={{ fontSize: 32 }}>🌶️</span>
              <div>
                <div style={{ fontFamily: V.font_display, fontSize: 20, marginBottom: 4 }}>THE SALSA BAR</div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>Every order comes with our legendary self-serve salsa bar — creamy avocado, green tomatillo, fiery red habanero, plus radishes, cucumbers, pico, cilantro, onion, cabbage, and lime.</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ MILL AVE BAR ═══ */}
      <section style={{ padding: '60px 24px', borderBottom: B }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal><h2 style={S.h2}>MILL AVE — BEER WALL & COCKTAILS</h2><div style={S.divider} /></Reveal>
          <Reveal delay={100}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 0, border: B, marginBottom: 24 }}>
              {IMG.beerWall.slice(0, 3).map((src, i) => (
                <div key={i} style={{ height: 200, overflow: 'hidden', borderRight: i < 2 ? B : 'none' }}>
                  <img src={src} alt="Taco Boy's Bar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                </div>
              ))}
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 0, border: B }}>
            {MILL_AVE_COCKTAILS.map((c, i) => (
              <Reveal key={c.name} delay={150 + i * 60}>
                <div style={{ padding: 16, borderRight: (i < MILL_AVE_COCKTAILS.length - 1) ? B : 'none', borderBottom: i < 3 ? B : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: V.font_display, fontSize: 16 }}>{c.name.toUpperCase()}</span>
                    <span style={{ fontFamily: V.font_display, fontSize: 18, color: '#e93d3d' }}>${c.price}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>{c.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OUR STORY ═══ */}
      <section id="story" style={{ background: '#161616', color: '#fff', padding: '80px 24px', borderBottom: B }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Reveal><h2 style={{ ...S.h2, color: '#fff' }}>OUR STORY</h2><div style={{ ...S.divider, background: '#e93d3d' }} /></Reveal>
          <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap', marginTop: 32 }}>
            <Reveal style={{ flex: '1 1 360px', minWidth: 260 }}>
              <div style={{ border: '2px solid #333', overflow: 'hidden' }}>
                <img src={IMG.storefront} alt="Taco Boy's Roosevelt Row" style={{ width: '100%', height: 300, objectFit: 'cover' }} loading="lazy" />
              </div>
            </Reveal>
            <Reveal delay={200} style={{ flex: '1 1 400px', minWidth: 280 }}>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: '#ccc', marginBottom: 16 }}>
                In 2019, Juan Francisco Cornejo Sr. set up a grill outside Mr. Lee's liquor store on Roosevelt Row.
                His son Jr. joined him. Mesquite charcoal, skirt steak from Sonora, handmade tortillas. No restaurant. No building. Just fire, meat, and a dream.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: '#ccc' }}>
                Word spread. Lines formed. Netflix came calling for <span style={{ color: '#e93d3d', fontWeight: 600 }}>Taco Chronicles</span>.
                Now there are 6 locations across the Valley — and <span style={{ color: '#fff', fontWeight: 700 }}>Marisco Boys</span>, their seafood restaurant, opened in 2025.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section style={{ padding: '60px 24px', borderBottom: B }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal><h2 style={S.h2}>WHAT PEOPLE SAY</h2><div style={S.divider} /></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 0, border: B, marginTop: 24 }}>
            {[
              { text: 'Best carne asada in the Valley. Not even close.', src: 'YELP — 5 STARS' },
              { text: 'The mesquite flavor is insane. Salsa bar is legendary.', src: 'GOOGLE REVIEW' },
              { text: 'We go every single week. The vampiros are addictive.', src: 'YELP — 5 STARS' },
              { text: 'If you haven\'t been you\'re missing out on life.', src: 'PHOENIX NEW TIMES' },
            ].map((r, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{ padding: 20, borderRight: i < 3 ? B : 'none' }}>
                  <div style={{ fontSize: 15, color: '#000', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 10 }}>"{r.text}"</div>
                  <div style={{ fontFamily: V.font_mono, fontSize: 10, color: '#999', letterSpacing: '0.1em' }}>{r.src}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATERING ═══ */}
      <section id="catering" style={{ padding: '60px 24px', background: '#f5f5f5', borderBottom: B }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <Reveal><h2 style={S.h2}>CATERING</h2><div style={S.divider} /><p style={{ fontSize: 15, color: '#666', maxWidth: 460, margin: '16px auto 32px', lineHeight: 1.6 }}>Corporate events, birthday parties, game day — we cater everything. Feeds 10 to 500.</p></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 0, border: B, background: '#fff' }}>
            {[
              { name: 'TACO PACK', serves: '10–15', price: '$120', desc: '3 lbs of meat, 30 tortillas, rice, beans, salsa bar' },
              { name: 'PARTY PACK', serves: '25–30', price: '$250', desc: '6 lbs mixed meats, 60 tortillas, rice, beans, chips & guac' },
              { name: 'EVENT PACKAGE', serves: '50+', price: 'CUSTOM', desc: 'Full catering with staff, unlimited meats, sides, drinks' },
            ].map((pkg, i) => (
              <Reveal key={pkg.name} delay={i * 80}>
                <div style={{ padding: 24, borderRight: i < 2 ? B : 'none', textAlign: 'center' }}>
                  <div style={{ fontFamily: V.font_display, fontSize: 36, color: '#e93d3d' }}>{pkg.price}</div>
                  <div style={{ fontFamily: V.font_display, fontSize: 22, marginBottom: 4 }}>{pkg.name}</div>
                  <div style={{ fontSize: 13, color: '#e93d3d', fontWeight: 600, marginBottom: 8 }}>Serves {pkg.serves}</div>
                  <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5, marginBottom: 16 }}>{pkg.desc}</div>
                  <button onClick={() => setCateringOpen(true)} style={{ ...S.btn, fontSize: 14 }}>BOOK CATERING</button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LOYALTY ═══ */}
      <section style={{ padding: '60px 24px', borderBottom: B }}>
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <Reveal><h2 style={S.h2}>REWARDS</h2><div style={S.divider} /></Reveal>
          <Reveal delay={100}>
            <div style={{ border: '2px solid #e93d3d', marginTop: 24 }}>
              <div style={{ background: '#e93d3d', color: '#fff', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: V.font_display, fontSize: 24 }}>TACO BOY'S REWARDS</div>
                <span style={{ fontSize: 28 }}>🌮</span>
              </div>
              <div style={{ padding: 20, background: '#fff' }}>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>Earn 1 point per dollar spent. Redeem for free food.</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, border: B }}>
                  {[{ pts: '50', reward: 'FREE DRINK' }, { pts: '100', reward: 'FREE TACO' }, { pts: '250', reward: 'FREE PLATO' }].map((r, i) => (
                    <div key={r.pts} style={{ padding: 14, borderRight: i < 2 ? B : 'none', textAlign: 'center' }}>
                      <div style={{ fontFamily: V.font_display, fontSize: 24, color: '#e93d3d' }}>{r.pts} PTS</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#000' }}>{r.reward}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ LOCATIONS ═══ */}
      <section id="locations" style={{ padding: '60px 24px', background: '#f5f5f5', borderBottom: B }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Reveal><h2 style={S.h2}>LOCATIONS</h2><div style={S.divider} /></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 0, border: B, background: '#fff', marginTop: 24 }}>
            {LOCATIONS.map((l, i) => (
              <Reveal key={l.id} delay={i * 60}>
                <div style={{ padding: 20, borderRight: i % 2 === 0 ? B : 'none', borderBottom: i < 4 ? B : 'none' }}>
                  {locationImg(i) && <div style={{ height: 120, overflow: 'hidden', border: B, marginBottom: 12 }}><img src={locationImg(i)} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" /></div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontFamily: V.font_display, fontSize: 22 }}>{l.name.toUpperCase()}</span>
                    {l.flag && <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', background: '#e93d3d', color: '#fff' }}>{l.flag}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>{l.addr}</div>
                  <div style={{ fontFamily: V.font_mono, fontSize: 11, color: '#999', marginBottom: 4 }}>{l.hours}</div>
                  <a href={`tel:${l.phone.replace(/[^0-9]/g, '')}`} style={{ fontSize: 13, color: '#e93d3d', fontWeight: 700, display: 'block', marginBottom: 12 }}>{l.phone}</a>
                  <a href={mapsUrl(l.addr)} target="_blank" rel="noopener noreferrer" style={{ ...S.btn, fontSize: 12, display: 'block', textAlign: 'center' }}>GET DIRECTIONS →</a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section style={{ padding: '60px 24px', borderBottom: B }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Reveal><h2 style={S.h2}>THE VIBE</h2><div style={S.divider} /></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 0, border: B, marginTop: 24 }}>
            {[...IMG.gallery.slice(0, 4), ...IMG.food.slice(0, 2), ...IMG.interior.slice(0, 2)].map((src, i) => (
              <div key={i} style={{ height: 200, overflow: 'hidden', borderRight: (i + 1) % 4 !== 0 ? B : 'none', borderBottom: i < 4 ? B : 'none' }}>
                <img src={src} alt="Taco Boy's" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="https://instagram.com/aztacoboys" target="_blank" rel="noopener" style={{ fontFamily: V.font_display, fontSize: 18, color: '#e93d3d' }}>@AZTACOBOYS ON INSTAGRAM →</a>
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section style={{ padding: '48px 24px', background: '#161616', color: '#fff', borderBottom: B }}>
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: V.font_display, fontSize: 28, marginBottom: 8 }}>GET THE DROP</div>
          <div style={{ fontSize: 14, color: '#999', marginBottom: 16 }}>New menu items, promos, and events — straight to your inbox.</div>
          <form onSubmit={e => { e.preventDefault(); alert('Subscribed! 🌮') }} style={{ display: 'flex', gap: 0, border: '2px solid #fff' }}>
            <input type="email" placeholder="your@email.com" required style={{ flex: 1, padding: '12px 16px', border: 'none', background: 'transparent', color: '#fff', fontSize: 14, fontFamily: V.font_body, outline: 'none' }} />
            <button type="submit" style={{ padding: '12px 24px', background: '#e93d3d', color: '#fff', fontFamily: V.font_display, fontSize: 16, fontWeight: 700, border: 'none' }}>SUBSCRIBE</button>
          </form>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '80px 24px', background: '#161616', textAlign: 'center' }}>
        <h2 style={{ fontFamily: V.font_display, fontSize: 'clamp(40px, 8vw, 80px)', color: '#fff', lineHeight: 1 }}>
          STOP SCROLLING.<br /><span style={{ color: '#e93d3d' }}>START EATING.</span>
        </h2>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
          <a href="#menu" style={{ ...S.btn, display: 'inline-block', width: 'auto', padding: '16px 40px' }}>ORDER NOW</a>
          <a href="https://instagram.com/aztacoboys" target="_blank" rel="noopener" style={{ display: 'inline-block', padding: '16px 40px', border: '2px solid #fff', color: '#fff', fontFamily: V.font_display, fontSize: 20, fontWeight: 700 }}>@AZTACOBOYS</a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: '40px 24px', textAlign: 'center', borderTop: B }}>
        <img src={IMG.logo} alt="Taco Boy's" style={{ height: 50, margin: '0 auto 12px' }} />
        <div style={{ fontFamily: V.font_mono, fontSize: 9, letterSpacing: '0.2em', color: '#999', marginBottom: 16 }}>SONORAN STYLE SINCE 2019</div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {[['Menu', '#menu'], ['Catering', '#catering'], ['Locations', '#locations'], ['My Rewards', '#rewards'], ['Instagram', 'https://instagram.com/aztacoboys']].map(([l, h]) => (
            <a key={l} href={h} target={h.startsWith('http') ? '_blank' : undefined} rel={h.startsWith('http') ? 'noopener' : undefined} style={{ fontFamily: V.font_display, fontSize: 16, color: '#000' }}>{l.toUpperCase()}</a>
          ))}
          <a href="#admin" style={{ fontFamily: V.font_display, fontSize: 16, color: '#ccc' }}>ADMIN</a>
        </div>
        <div style={{ fontSize: 12, color: '#999' }}>© 2026 Taco Boy's. All rights reserved. Phoenix, AZ</div>
      </footer>

      {/* Sticky order bar */}
      <StickyOrderBar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
    </div>
  )
}

/* ═══ COMPONENTS ═══ */

function StickyOrderBar({ cartCount, onCartClick }) {
  const [show, setShow] = useState(false)
  useEffect(() => { const fn = () => setShow(window.scrollY > window.innerHeight * 0.7); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn) }, [])
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 190, transform: show ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.3s ease' }}>
      <div style={{ background: '#161616', borderTop: '2px solid #e93d3d', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <span style={{ fontSize: 16 }}>🔥</span>
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Hungry?</span>
        <button onClick={onCartClick} style={{ ...S.btn, width: 'auto', padding: '10px 28px', fontSize: 14 }}>
          {cartCount > 0 ? `VIEW ORDER (${cartCount})` : 'ORDER NOW'}
        </button>
      </div>
    </div>
  )
}

function CheckoutModal({ cart, total, orderType, location, onClose, onComplete }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', email: '', time: '', address: '', notes: '' })
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }))
  return (
    <div style={mod.backdrop} onClick={onClose}><div style={mod.box} onClick={e => e.stopPropagation()}>
      <div style={mod.header}><span style={S.heading}>{step === 1 ? 'YOUR INFO' : 'REVIEW ORDER'}</span><button onClick={onClose} style={{ fontSize: 20 }}>✕</button></div>
      {step === 1 ? (
        <div style={mod.body}>
          <Fld label="NAME" value={form.name} onChange={v => u('name', v)} required />
          <Fld label="PHONE" type="tel" value={form.phone} onChange={v => u('phone', v)} required />
          <Fld label="EMAIL" type="email" value={form.email} onChange={v => u('email', v)} />
          {orderType === 'pickup' ? (
            <div style={mod.field}><label style={mod.label}>PICKUP TIME</label><select value={form.time} onChange={e => u('time', e.target.value)} style={mod.input}><option value="">ASAP</option>{['15 min', '30 min', '45 min', '1 hour'].map(t => <option key={t}>{t}</option>)}</select></div>
          ) : <Fld label="DELIVERY ADDRESS" value={form.address} onChange={v => u('address', v)} required />}
          <Fld label="SPECIAL INSTRUCTIONS" value={form.notes} onChange={v => u('notes', v)} placeholder="No onions, extra salsa..." />
          <button onClick={() => { if (form.name && form.phone) setStep(2) }} style={S.btn}>REVIEW ORDER →</button>
        </div>
      ) : (
        <div style={mod.body}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{orderType === 'pickup' ? `Pickup at ${location.name}` : `Delivery to ${form.address}`}{form.time && ` · ${form.time}`}</div>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: B, fontSize: 14 }}>
              <span>{item.name} ×{item.qty}</span><span style={{ fontWeight: 700, color: '#e93d3d' }}>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontSize: 18 }}>
            <span style={{ fontFamily: V.font_display }}>TOTAL</span><span style={{ fontFamily: V.font_display, color: '#e93d3d' }}>${total.toFixed(2)}</span>
          </div>
          <button onClick={() => onComplete(form)} style={S.btn}>PLACE ORDER</button>
          <button onClick={() => setStep(1)} style={{ width: '100%', padding: 10, color: '#999', fontSize: 12, marginTop: 8 }}>← BACK</button>
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
        <div style={{ fontFamily: V.font_display, fontSize: 36, marginBottom: 4 }}>ORDER PLACED!</div>
        <div style={{ fontFamily: V.font_mono, fontSize: 14, color: '#e93d3d', marginBottom: 12 }}>{order.id}</div>
        <div style={{ color: '#666', fontSize: 14 }}>{order.type === 'pickup' ? `Pick up at ${order.location}` : 'Delivery on its way'}</div>
        <div style={{ fontFamily: V.font_display, fontSize: 32, color: '#e93d3d', margin: '16px 0' }}>${order.total?.toFixed(2)}</div>
        <button onClick={onClose} style={S.btn}>DONE</button>
      </div>
    </div></div>
  )
}

function CateringModal({ onClose }) {
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', guests: '', details: '' })
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }))
  if (done) return <div style={mod.backdrop} onClick={onClose}><div style={mod.box} onClick={e => e.stopPropagation()}><div style={{ textAlign: 'center', padding: 40 }}><div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div><div style={{ fontFamily: V.font_display, fontSize: 36 }}>REQUEST SENT!</div><div style={{ color: '#666', fontSize: 14, marginTop: 8 }}>We'll get back to you within 24 hours.</div><button onClick={onClose} style={{ ...S.btn, marginTop: 24 }}>DONE</button></div></div></div>
  return (
    <div style={mod.backdrop} onClick={onClose}><div style={mod.box} onClick={e => e.stopPropagation()}>
      <div style={mod.header}><span style={S.heading}>BOOK CATERING</span><button onClick={onClose} style={{ fontSize: 20 }}>✕</button></div>
      <form onSubmit={e => { e.preventDefault(); addCateringRequest(form); setDone(true) }} style={mod.body}>
        <Fld label="NAME" value={form.name} onChange={v => u('name', v)} required />
        <Fld label="PHONE" type="tel" value={form.phone} onChange={v => u('phone', v)} required />
        <Fld label="EMAIL" type="email" value={form.email} onChange={v => u('email', v)} required />
        <div style={mod.field}><label style={mod.label}>EVENT DATE</label><input type="date" required value={form.date} onChange={e => u('date', e.target.value)} style={mod.input} /></div>
        <div style={mod.field}><label style={mod.label}>GUESTS</label><select required value={form.guests} onChange={e => u('guests', e.target.value)} style={mod.input}><option value="">Select...</option>{['10–20', '20–40', '40–60', '60–100', '100+'].map(o => <option key={o}>{o}</option>)}</select></div>
        <div style={mod.field}><label style={mod.label}>DETAILS</label><textarea rows={3} value={form.details} onChange={e => u('details', e.target.value)} placeholder="Type of event, preferences..." style={{ ...mod.input, resize: 'vertical' }} /></div>
        <button type="submit" style={S.btn}>SUBMIT REQUEST</button>
      </form>
    </div></div>
  )
}

function Fld({ label, value, onChange, type = 'text', required, placeholder }) {
  return <div style={mod.field}><label style={mod.label}>{label}{required && ' *'}</label><input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} style={mod.input} /></div>
}

function Nav({ cartCount, onCartClick, mobileNav, setMobileNav }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn) }, [])
  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent', borderBottom: scrolled ? B : '1px solid transparent', transition: 'all 0.3s ease' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={IMG.logo} alt="Taco Boy's" style={{ height: 40, objectFit: 'contain', filter: scrolled ? 'none' : 'brightness(10)' }} />
        </a>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }} className="nav-desktop">
          {['Menu', 'Catering', 'Locations'].map(l => <a key={l} href={`#${l.toLowerCase()}`} style={{ fontFamily: V.font_display, fontSize: 18, color: scrolled ? '#000' : '#fff' }}>{l.toUpperCase()}</a>)}
          <a href="#rewards" style={{ fontFamily: V.font_display, fontSize: 18, color: '#F5A623' }}>MY REWARDS</a>
          <button onClick={onCartClick} style={{ padding: '8px 20px', background: '#e93d3d', color: '#fff', fontFamily: V.font_display, fontSize: 16, fontWeight: 700, border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>🌮 {cartCount > 0 ? cartCount : 'ORDER'}</button>
        </div>
        <div className="nav-mobile" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onCartClick} style={{ fontSize: 18, position: 'relative', color: scrolled ? '#000' : '#fff' }}>🌮{cartCount > 0 && <span style={{ position: 'absolute', top: -6, right: -8, background: '#e93d3d', color: '#fff', fontSize: 9, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}</button>
          <button onClick={() => setMobileNav(!mobileNav)} style={{ fontSize: 22, color: scrolled ? '#000' : '#fff' }}>{mobileNav ? '✕' : '☰'}</button>
        </div>
      </nav>
      {mobileNav && <div style={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, zIndex: 199, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        {['Menu', 'Catering', 'Locations'].map(l => <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileNav(false)} style={{ fontFamily: V.font_display, fontSize: 36, color: '#000' }}>{l.toUpperCase()}</a>)}
        <a href="https://instagram.com/aztacoboys" target="_blank" rel="noopener" style={{ fontFamily: V.font_display, fontSize: 20, color: '#e93d3d' }}>@AZTACOBOYS</a>
      </div>}
    </>
  )
}

/* ═══ CONSTANTS ═══ */

function locationImg(i) {
  const imgs = [IMG.storefront, IMG.interior[0], IMG.food[0], IMG.interior[1], IMG.beerWall[0], IMG.interior[2]]
  return imgs[i] || null
}

const B = '2px solid #000'
const V = { font_display: "'Squada One', cursive", font_body: "'Albert Sans', sans-serif", font_mono: "'JetBrains Mono', monospace" }
const S = {
  h2: { fontFamily: V.font_display, fontSize: 'clamp(28px, 5vw, 42px)', color: '#000', textAlign: 'center', marginBottom: 8 },
  heading: { fontFamily: V.font_display, fontSize: 24, fontWeight: 700 },
  divider: { width: 60, height: 3, background: '#000', margin: '8px auto 0' },
  btn: { width: '100%', padding: '15px 20px', background: '#e93d3d', color: '#fff', fontFamily: V.font_display, fontSize: 20, fontWeight: 700, border: '2px solid #fff', cursor: 'pointer' },
}

const drw = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 298 },
  panel: { position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, maxWidth: '100vw', zIndex: 299, background: '#fff', borderLeft: B, display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: B },
}

const mod = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  box: { background: '#fff', border: B, width: '100%', maxWidth: 440, maxHeight: '90vh', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: B },
  body: { padding: 20, display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontFamily: V.font_display, fontSize: 14, color: '#000' },
  input: { padding: '12px 14px', border: '1px solid #cbd5e0', background: '#F7FAFC', color: '#000', fontSize: 14, fontFamily: V.font_body },
}
