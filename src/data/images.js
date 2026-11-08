// Free-to-use stock photography for the demo storefront.
// Product photos: Unsplash (unsplash.com/license) and Pexels (pexels.com/license).
// These are intentionally generic stock images, not Amazon-owned product photography.

export const PRODUCT_IMAGES = {
  'boat-rockerz-450': '/images/headphones-alt.jpg',
  'sony-wh-ch520': '/images/headphones.jpg',
  'jbl-go-3': '/images/speaker.jpg',
  'noise-colorfit-pro-4': '/images/smartwatch.jpg',
  'canon-eos-1500d': '/images/camera.jpg',
  'amazon-basics-32-tv': '/images/tv.jpg',
  'echo-dot-5': '/images/smart-speaker.jpg',
  'boat-airdopes-141': '/images/earbuds.jpg',
  'redmi-note-13-5g': '/images/smartphone.jpg',
  'samsung-galaxy-m14': '/images/smartphone-2.jpg',
  'iphone-15-128': '/images/iphone.jpg',
  'oneplus-nord-ce-3': '/images/smartphone-3.jpg',
  'realme-narzo-60x': '/images/smartphone-2.jpg',
  'apple-20w-adapter': '/images/charger.jpg',
  'hp-15s-ryzen5': '/images/laptop.jpg',
  'macbook-air-m2': '/images/macbook.jpg',
  'lenovo-ideapad-slim-3': '/images/laptop-2.jpg',
  'logitech-mx-master-3s': '/images/mouse.jpg',
  'samsung-980-1tb': '/images/ssd.jpg',
  'dell-24-monitor': '/images/monitor.jpg',
  'prestige-iris-mixer': '/images/mixer.jpg',
  'pigeon-induction': '/images/cooktop.jpg',
  'milton-thermosteel': '/images/bottle.jpg',
  'wakefit-mattress': '/images/mattress.jpg',
  'solimo-dinner-set': '/images/dinner-set.jpg',
  'philips-air-purifier': '/images/air-purifier.jpg',
  'allen-solly-polo': '/images/tshirt-2.jpg',
  'nike-revolution-7': '/images/shoes.jpg',
  'fastrack-analog-watch': '/images/watch.jpg',
  'levis-slim-jeans': '/images/jeans.jpg',
  'cotton-kurta-set': '/images/kurta.jpg',
  'wildcraft-backpack': '/images/backpack.jpg',
  'lakme-matte-lipstick': '/images/lipstick.jpg',
  'mamaearth-face-wash': '/images/facewash.jpg',
  'maybelline-mascara': '/images/mascara.jpg',
  'nivea-men-facewash': '/images/grooming.jpg',
  'atomic-habits': '/images/book-atomic.jpg',
  'psychology-of-money': '/images/book-psychology.jpg',
  'ikigai': '/images/book-3.jpg',
  'rich-dad-poor-dad': '/images/book-4.jpg',
  'lego-classic-bricks': '/images/lego.jpg',
  'hot-wheels-5-pack': '/images/hotwheels.jpg',
  'funskool-monopoly': '/images/boardgame.jpg',
  'boldfit-yoga-mat': '/images/yoga.jpg',
  'cosco-football': '/images/football.jpg',
  'yonex-badminton-racket': '/images/badminton.jpg',
  'strauss-dumbbell-set': '/images/dumbbells.jpg',
  'tata-tea-premium': '/images/tea.jpg',
  'fortune-sunflower-oil': '/images/oil.jpg',
  'cadbury-celebrations': '/images/chocolate.jpg',
  'amul-butter': '/images/butter.jpg',
  'lg-1-5-ton-ac': '/images/ac.jpg',
  'samsung-7kg-washer': '/images/washing-machine.jpg',
  'whirlpool-265l-fridge': '/images/fridge.jpg',
  'bajaj-ceiling-fan': '/images/fan.jpg',
}

export const CATEGORY_IMAGES = {
  electronics: '/images/headphones.jpg',
  mobiles: '/images/smartphone.jpg',
  computers: '/images/laptop.jpg',
  'home-kitchen': '/images/cooktop.jpg',
  fashion: '/images/tshirt.jpg',
  beauty: '/images/facewash.jpg',
  books: '/images/book-atomic.jpg',
  toys: '/images/lego.jpg',
  sports: '/images/dumbbells.jpg',
  grocery: '/images/tea.jpg',
  appliances: '/images/washing-machine.jpg',
}

export const HERO_IMAGES = {
  festival: '/images/hero-electronics.jpg',
  mobiles: '/images/hero-mobiles.jpg',
  home: '/images/hero-home.jpg',
  fashion: '/images/hero-fashion.jpg',
}

export const MISC_IMAGES = {
  shopping: '/images/misc-shopping.jpg',
  gifts: '/images/misc-gifts.jpg',
  payment: '/images/misc-payment.jpg',
  delivery: '/images/misc-delivery.jpg',
  team: '/images/misc-team.jpg',
  security: '/images/misc-security.jpg',
  community: '/images/misc-community.jpg',
}

export const STATIC_IMAGES = {
  about: MISC_IMAGES.shopping,
  careers: MISC_IMAGES.team,
  privacy: MISC_IMAGES.security,
  conditions: MISC_IMAGES.security,
  'interest-ads': MISC_IMAGES.security,
  accessibility: MISC_IMAGES.community,
  sell: MISC_IMAGES.delivery,
  prime: MISC_IMAGES.gifts,
}

export const GIFT_IMAGES = {
  festive: '/images/gift-festive.jpg',
  birthday: '/images/gift-birthday.jpg',
  thankyou: '/images/gift-thankyou.jpg',
  congrats: '/images/gift-congrats.jpg',
}

const FALLBACK_IMAGE = '/images/misc-shopping.jpg'

export const productImage = (product) => {
  if (!product) return FALLBACK_IMAGE
  return (
    product.image ||
    PRODUCT_IMAGES[product.id] ||
    CATEGORY_IMAGES[product.category] ||
    FALLBACK_IMAGE
  )
}

export const categoryImage = (slug) => CATEGORY_IMAGES[slug] || FALLBACK_IMAGE

export const heroImage = (id) => HERO_IMAGES[id] || HERO_IMAGES.festival
