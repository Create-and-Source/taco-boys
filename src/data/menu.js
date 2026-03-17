// ── Images ──
const CDN = 'https://assets.cdn.filesafe.space/aoYizwC8bJwUBPdQmsg5/media/'
const PHXRAIL = 'https://phxrailfood.com/wp-content/uploads/'
const IPOURIT = 'https://ipouritinc.com/wp-content/uploads/2022/02/'

export const IMG = {
  logo: CDN + '66840e345f04f20a354f5f55.png',
  hero: CDN + '668410a44918dc88e5f443e4.jpeg',
  storefront: 'https://vivaphoenix.com/wp-content/uploads/2021/06/313c3a3cbb77827978989df2e8ad381f_-united-states-arizona-maricopa-county-phoenix-evans-churchill-east-roosevelt-street-620-taco-boys-602-675-3962.jpg',
  gallery: [
    CDN + '6685565e5a85131f4cf3c6f1.jpeg',
    CDN + '668416281d120c7d05d0b357.jpeg',
    CDN + '66855551222ca0d6f9590b3d.jpeg',
    CDN + '668555867376714dc733ebe8.jpeg',
    CDN + '66855586ea0cced3ac1ebe4a.jpeg',
    CDN + '668555db5a85131f74f3c67d.jpeg',
    CDN + '668555dbea0ccefcc11ebe7b.jpeg',
    CDN + '668555dbea0cce96051ebe7a.jpeg',
  ],
  food: [
    PHXRAIL + '2024/01/7f1f8d22-504d-43f2-8251-f649cd34ddbb_1_105_c.jpeg',
    PHXRAIL + '2023/12/671faaeb-0f82-4a22-81ef-85319c8dc510_1_102_a.jpeg',
    PHXRAIL + '2023/12/55bb09a0-daed-4491-b520-eb4387f90349_1_105_c.jpeg',
    PHXRAIL + '2023/12/67dffba3-cbd5-4aba-b9f8-b378f5440e4c_1_105_c.jpeg',
    PHXRAIL + '2023/12/9f16c4e1-ac4f-41e7-ad75-6859e6b9b29d_1_105_c.jpeg',
    PHXRAIL + '2023/12/7420d668-0a05-4c63-a501-6123259854fc_1_201_a.jpeg',
    PHXRAIL + '2023/12/fd2f5ec8-d581-4fd5-a775-224d6a90ac3a_1_105_c.jpeg',
  ],
  interior: [
    CDN + '6684190a33f4aa41c46ee6ab.jpeg',
    CDN + '6684190ab8d71053a06f8177.jpeg',
    CDN + '6684190ab5df664f3bb8f96a.jpeg',
    CDN + '6684190a2e1a026a9faf4123.jpeg',
  ],
  beerWall: [
    IPOURIT + 'TacoBoys1.jpg',
    IPOURIT + 'TacoBoys2.jpg',
    IPOURIT + 'TacoBoys4.jpg',
    IPOURIT + 'TacoBoys5.jpg',
  ],
  badge: CDN + '66855e51ea0cce19251ec4ac.png',
}

export const MENU = [
  {
    category: 'Tacos',
    items: [
      { id: 't1', name: 'Carne Asada', desc: 'Mesquite-grilled skirt steak, handmade Sonoran tortilla', price: 3, hot: true },
      { id: 't2', name: 'Al Pastor', desc: 'Marinated pork, pineapple, cilantro, onion', price: 3 },
      { id: 't3', name: 'Pollo Asado', desc: 'Charcoal-grilled chicken, fresh salsa verde', price: 3 },
      { id: 't4', name: 'Barbacoa', desc: 'Slow-cooked tender beef, rich and savory', price: 3 },
      { id: 't5', name: 'Carnitas', desc: 'Braised pork, crispy edges, lime squeeze', price: 3 },
      { id: 't6', name: 'Cabeza', desc: 'Ultra-tender beef cheek, melt-in-your-mouth', price: 3, hot: true },
      { id: 't7', name: 'Chorizo', desc: 'Spiced Mexican sausage, charred on the grill', price: 3 },
      { id: 't8', name: 'Tripa', desc: 'Crispy beef tripe, traditional Sonoran style', price: 3 },
    ]
  },
  {
    category: 'Vampiros',
    items: [
      { id: 'v1', name: 'Carne Asada Vampiro', desc: 'Griddle-crisped flour tortilla, melted cheese, mesquite steak', price: 5 },
      { id: 'v2', name: 'Al Pastor Vampiro', desc: 'Crispy tortilla, melted cheese, marinated pork, pineapple', price: 5 },
      { id: 'v3', name: 'Pollo Vampiro', desc: 'Crispy tortilla, melted cheese, grilled chicken', price: 5 },
    ]
  },
  {
    category: 'Burritos',
    items: [
      { id: 'b1', name: 'Carne Asada Burrito', desc: 'Mesquite steak, frijoles charros with chorizo, melted cheese', price: 10, hot: true },
      { id: 'b2', name: 'Al Pastor Burrito', desc: 'Marinated pork, rice, beans, pineapple salsa', price: 10 },
      { id: 'b3', name: 'Pollo Burrito', desc: 'Grilled chicken, rice, beans, fresh salsa', price: 10 },
    ]
  },
  {
    category: 'Quesadillas',
    items: [
      { id: 'q1', name: 'Carne Asada Quesadilla', desc: 'Flour tortilla, melted cheese, mesquite steak', price: 10 },
      { id: 'q2', name: 'Pollo Quesadilla', desc: 'Flour tortilla, melted cheese, grilled chicken', price: 10 },
    ]
  },
  {
    category: 'Platos',
    items: [
      { id: 'p1', name: 'Carne Asada Plato', desc: 'Generous portion of mesquite steak, refried beans, rice, tortillas', price: 14, hot: true },
      { id: 'p2', name: 'Pollo Asado Plato', desc: 'Grilled chicken, refried beans, rice, handmade tortillas', price: 14 },
    ]
  },
  {
    category: 'Family Packs',
    items: [
      { id: 'f1', name: 'Taco Family Pack (12)', desc: '12 tacos, choice of 2 proteins, rice, beans, salsa', price: 30, hot: true },
      { id: 'f2', name: 'Burrito Family Pack (4)', desc: '4 burritos, choice of 2 proteins, chips & guac', price: 36 },
      { id: 'f3', name: 'Mixed Grill Pack', desc: '2 lbs mixed meats, 20 tortillas, rice, beans, full salsa bar', price: 45 },
    ]
  },
  {
    category: 'Sides & Drinks',
    items: [
      { id: 's1', name: 'Carne Asada Fries', desc: 'Loaded fries with mesquite steak, cheese, and salsa', price: 10, hot: true },
      { id: 's2', name: 'Chips & Guac', desc: 'Fresh tortilla chips with house-made guacamole', price: 6 },
      { id: 's3', name: 'Elote', desc: 'Mexican street corn with mayo, cotija, chile, lime', price: 5 },
      { id: 's4', name: 'Mangonada', desc: 'Frozen mango with Tajin, chamoy, and tamarind straw', price: 6 },
      { id: 's5', name: 'Horchata', desc: 'Classic Mexican rice drink, sweet and creamy', price: 4 },
      { id: 's6', name: 'Agua Fresca', desc: 'Fresh fruit water — Jamaica, Tamarindo, or Piña', price: 4 },
      { id: 's7', name: 'Mexican Coke', desc: 'Glass bottle, real cane sugar', price: 3 },
      { id: 's8', name: 'Jarritos', desc: 'Mexican soda — Mandarina, Tamarindo, Lime, Fruit Punch', price: 3 },
    ]
  },
]

export const LOCATIONS = [
  { id: 'roosevelt', name: 'Roosevelt Row', addr: '620 E Roosevelt St, Phoenix, AZ 85004', flag: 'ORIGINAL', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–1am', phone: '(602) 675-3962', coords: '33.4582,-112.0633' },
  { id: 'north', name: 'North Phoenix', addr: '9016 N Black Canyon Hwy, Phoenix, AZ 85051', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–12am', phone: '(602) 675-3962', coords: '33.5608,-112.0959' },
  { id: '32nd', name: '32nd Street', addr: '2949 N 32nd St, Phoenix, AZ 85018', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–12am', phone: '(602) 675-3962', coords: '33.4810,-111.9867' },
  { id: 'west', name: 'West Phoenix', addr: '9055 W Camelback Rd, Phoenix, AZ', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–12am', phone: '(602) 675-3962', coords: '33.5092,-112.2570' },
  { id: 'tempe-rural', name: 'Tempe — Rural', addr: '1015 S Rural Rd, Tempe, AZ 85281', hours: 'Sun–Thu 10am–10pm · Fri–Sat 10am–12am', phone: '(602) 675-3962', coords: '33.4128,-111.9268' },
  { id: 'tempe-mill', name: 'Tempe — Mill Ave', addr: '699 S Mill Ave, Tempe, AZ 85281', flag: '20-TAP BEER WALL', hours: 'Sun–Thu 10am–11pm · Fri–Sat 10am–2am', phone: '(602) 675-3962', coords: '33.4174,-111.9400' },
]

export const SPECIALS = [
  { name: 'Taco Tuesday', desc: '$2 tacos all day, every Tuesday. All proteins.', day: 'Tuesday', badge: '$2 TACOS' },
  { name: 'Happy Hour', desc: 'Half-price drafts and $6 margs. Mill Ave & Roosevelt only.', day: 'Mon–Fri 3–6pm', badge: 'HALF PRICE' },
  { name: 'Family Sunday', desc: 'Free kids meal with every adult plato purchase.', day: 'Sunday', badge: 'KIDS FREE' },
]

export const MILL_AVE_COCKTAILS = [
  { name: 'Let That Man Go', desc: 'Mango margarita with Tajin rim', price: 12 },
  { name: 'Fuego Rita', desc: 'Spicy jalapeño margarita, fresh lime, agave', price: 13 },
  { name: 'Horchata Blanca', desc: 'Horchata with Rumchata and cinnamon', price: 11 },
  { name: 'Michelada', desc: 'Mexican beer, Clamato, lime, hot sauce, Tajin', price: 9 },
  { name: 'Paloma', desc: '3 Amigos tequila, grapefruit soda, lime, salt', price: 11 },
]

export const PRESS = [
  { name: 'Netflix', show: 'Taco Chronicles S3' },
  { name: 'Phoenix New Times', show: 'Best Tacos' },
  { name: 'ABC15', show: 'Featured' },
  { name: 'Axios Phoenix', show: 'Featured' },
  { name: 'Phoenix Magazine', show: 'Review' },
]

export const mapsUrl = (addr) => `https://maps.google.com/?q=${encodeURIComponent(addr)}`
