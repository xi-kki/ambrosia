'use client';

import { useState } from 'react';
import { ShoppingCart, Mail, Check, Truck, Shield, Sparkles, Leaf, Zap, Heart, Star, AlertCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

const products = [
  {
    id: 'classic-12pack',
    name: 'Ambrosia Classic Zero',
    subtitle: '12-Pack × 250ml',
    description: 'The original zero-sugar ambrosia — clean, crisp, refreshing. Zero sugar, zero calories, full flavor.',
    price: 34.99,
    originalPrice: 39.99,
    badge: 'Best Seller',
    badgeColor: 'bg-ambrosia-pink text-ambrosia-dark',
    image: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/Green%20Soda.png',
    flavor: 'Classic',
    nutrition: { sugar: 0, calories: 0, carbs: 0 },
    tags: ['Vegan', 'Keto', 'Gluten-Free', 'Diabetic-Friendly'],
    benefits: ['Zero sugar', 'Natural lime essence', 'Electrolyte enhanced', 'BPA-free liner'],
    inStock: true,
    subscriptionDiscount: 15,
  },
  {
    id: 'lime-12pack',
    name: 'Ambrosia Zero Lime',
    subtitle: '12-Pack × 250ml',
    description: 'Bright lime twist on the classic — zero sugar, zero calories, vibrant citrus zing.',
    price: 36.99,
    originalPrice: 41.99,
    badge: 'New',
    badgeColor: 'bg-ambrosia-teal text-white',
    image: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/Blue%20Soda.png',
    flavor: 'Zero Lime',
    nutrition: { sugar: 0, calories: 0, carbs: 0 },
    tags: ['Vegan', 'Keto', 'Gluten-Free', 'Diabetic-Friendly'],
    benefits: ['Zero sugar', 'Cold-pressed lime oil', 'Monk fruit sweetened', 'BPA-free liner'],
    inStock: true,
    subscriptionDiscount: 15,
  },
  {
    id: 'variety-24pack',
    name: 'Discovery Variety Pack',
    subtitle: '24-Pack × 250ml (12 Classic + 12 Lime)',
    description: 'Can\'t decide? Get both flagship flavors. Perfect for sharing, gifting, or stocking up.',
    price: 64.99,
    originalPrice: 79.99,
    badge: 'Best Value',
    badgeColor: 'bg-amber-500 text-white',
    image: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/Green%20Soda.png',
    flavor: 'Classic + Lime',
    nutrition: { sugar: 0, calories: 0, carbs: 0 },
    tags: ['Vegan', 'Keto', 'Gluten-Free', 'Diabetic-Friendly'],
    benefits: ['Both flavors', 'Save 18%', 'Free shipping', 'Gift-ready box'],
    inStock: true,
    subscriptionDiscount: 20,
  },
  {
    id: 'functional-12pack',
    name: 'Focus & Flow',
    subtitle: '12-Pack × 250ml',
    description: 'Adaptogenic sparkler with L-Theanine, Lion\'s Mane & B-vitamins. Calm energy without the crash.',
    price: 44.99,
    originalPrice: 49.99,
    badge: 'Functional',
    badgeColor: 'bg-blue-500 text-white',
    image: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/Blue%20Soda.png',
    flavor: 'Dragon Fruit + Yuzu',
    nutrition: { sugar: 1.8, calories: 28, carbs: 3.2 },
    tags: ['Vegan', 'Gluten-Free', 'Adaptogenic', 'Nootropic'],
    benefits: ['L-Theanine 100mg', 'Lion\'s Mane 200mg', 'B-Complex', 'Natural caffeine-free'],
    inStock: true,
    subscriptionDiscount: 15,
  },
  {
    id: 'botanical-12pack',
    name: 'Botanical Blush',
    subtitle: '12-Pack × 250ml',
    description: 'Elegant floral spritz with hibiscus, butterfly pea & rose. Color-changing magic in every pour.',
    price: 42.99,
    originalPrice: 47.99,
    badge: 'Limited',
    badgeColor: 'bg-purple-500 text-white',
    image: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/Green%20Soda.png',
    flavor: 'Hibiscus + Rose + Butterfly Pea',
    nutrition: { sugar: 0.3, calories: 12, carbs: 1.5 },
    tags: ['Vegan', 'Gluten-Free', 'Keto', 'Color-Changing'],
    benefits: ['Hibiscus antioxidants', 'Butterfly pea pH magic', 'Rose water', 'Instagram-worthy'],
    inStock: false,
    subscriptionDiscount: 15,
    restockDate: '2025-02-15',
  },
  {
    id: 'spicy-12pack',
    name: 'Spicy Ginger Lime',
    subtitle: '12-Pack × 250ml',
    description: 'Fiery ginger meets bright lime — invigorating, bold, and completely sugar-free.',
    price: 38.99,
    originalPrice: 43.99,
    badge: 'Spicy',
    badgeColor: 'bg-red-500 text-white',
    image: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/Blue%20Soda.png',
    flavor: 'Ginger + Lime',
    nutrition: { sugar: 0, calories: 0, carbs: 0 },
    tags: ['Vegan', 'Keto', 'Gluten-Free', 'Diabetic-Friendly'],
    benefits: ['Ginger oleoresin', 'Metabolism support', 'Digestive aid', 'Warming finish'],
    inStock: true,
    subscriptionDiscount: 15,
  },
];

const faqs = [
  {
    q: 'What sweetener do you use?',
    a: 'We use a proprietary blend of monk fruit extract, allulose, and stevia Reb-M — zero sugar, zero artificial sweeteners, no aftertaste.',
  },
  {
    q: 'Are Ambrosia drinks keto-friendly?',
    a: 'Yes! All our flagship flavors have 0g sugar and 0g net carbs per serving. Functional flavors have <2g net carbs.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Currently US only. Canada and UK coming Q2 2025. Join the waitlist for your country!',
  },
  {
    q: 'What\'s the subscription benefit?',
    a: 'Save 15-20% on every order, free shipping, pause/cancel anytime, early access to limited editions.',
  },
  {
    q: 'Are cans BPA-free?',
    a: 'Absolutely. All our cans use BPA-NI (non-intent) liners — the highest safety standard in the industry.',
  },
  {
    q: 'How long do they last?',
    a: '12 months from production. Best enjoyed chilled within 6 months for optimal flavor.',
  },
];

export default function ShopPage() {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || emailStatus === 'loading') return;
    setEmailStatus('loading');
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setEmailStatus('success');
    setEmail('');
    setTimeout(() => setEmailStatus('idle'), 3000);
  };

  const addToCart = (productId: string) => {
    setSelectedProduct(productId);
    setCartCount((c) => c + 1);
    setShowCart(true);
    setTimeout(() => setShowCart(false), 3000);
  };

  return (
    <div className="min-h-screen bg-ambrosia-dark text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-ambrosia-dark/95 backdrop-blur border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-ambrosia-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8V16M8 12H16" />
            </svg>
            <span className="font-heading text-xl font-bold">Ambrosia</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href="/" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Home</a>
            <a href="/formulate" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">AI Formulate</a>
            <a href="/ingredients" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Ingredients</a>
            <a href="/taste" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Taste</a>
            <a href="/eco" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Eco</a>
            <a href="/shop" className="nav-item font-manrope text-sm bg-ambrosia-pink text-ambrosia-dark px-4 py-1.5 rounded-full font-medium">Shop</a>
            <a href="/contact" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-white/70 hover:text-white transition" onClick={() => setShowCart(!showCart)}>
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-ambrosia-pink text-ambrosia-dark text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Cart Sidebar */}
      {showCart && selectedProduct && (
        <CartSidebar
          product={products.find(p => p.id === selectedProduct)!}
          onClose={() => { setShowCart(false); setSelectedProduct(null); }}
          onAddToCart={() => { setShowCart(false); setSelectedProduct(null); }}
        />
      )}

      <main className="pt-24 pb-12">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">Shop Ambrosia</h1>
            <p className="text-ambrosia-pink/80 text-lg max-w-2xl mx-auto mb-8">
              Zero sugar. Zero compromise. Delivered to your door.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-white/70">
                <Truck className="w-5 h-5 text-ambrosia-pink" />
                <span>Free shipping on $50+</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Shield className="w-5 h-5 text-green-400" />
                <span>30-day satisfaction guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Subscribe & save 15-20%</span>
              </div>
            </div>
          </div>

          {/* Email Capture */}
          <div className="max-w-md mx-auto mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="text-center mb-6">
                <Mail className="w-10 h-10 mx-auto text-ambrosia-pink/50 mb-3" />
                <h3 className="font-heading text-xl font-bold mb-1">Join the Waitlist</h3>
                <p className="text-white/60 text-sm">Get 15% off your first order + early access to limited drops</p>
              </div>
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={emailStatus === 'loading' || emailStatus === 'success'}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-ambrosia-pink focus:ring-2 focus:ring-ambrosia-pink/20"
                  />
                  {emailStatus === 'loading' && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ambrosia-pink animate-spin" />
                  )}
                  {emailStatus === 'success' && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                  )}
                </div>
                <button
                  type="submit"
                  disabled={emailStatus === 'loading' || emailStatus === 'success' || !email}
                  className={clsx(
                    'w-full py-3 px-4 rounded-xl font-bold text-lg transition',
                    'bg-gradient-to-r from-ambrosia-pink to-ambrosia-teal text-ambrosia-dark',
                    'hover:scale-[1.02] hover:shadow-lg hover:shadow-ambrosia-pink/30',
                    'disabled:opacity-50 disabled:hover:scale-100'
                  )}
                >
                  {emailStatus === 'success' ? 'Subscribed! 🎉' : emailStatus === 'loading' ? 'Subscribing...' : 'Get 15% Off'}
                </button>
                <p className="text-center text-xs text-white/40">No spam. Unsubscribe anytime.</p>
              </form>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl font-bold">Our Flavors</h2>
            <div className="flex items-center gap-2 text-white/60 font-manrope text-sm">
              <span>6 flavors</span>
              <span className="px-2 py-0.5 bg-ambrosia-pink/20 text-ambrosia-pink rounded-full">4 in stock</span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">1 limited</span>
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">1 restocking</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </section>

        {/* Subscription Upsell */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-gradient-to-br from-ambrosia-pink/10 to-ambrosia-teal/10 border border-ambrosia-pink/20 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-ambrosia-pink/20 text-ambrosia-pink rounded-full text-sm font-manrope mb-4">
                  <Sparkles className="w-4 h-4" />
                  Subscribe & Save
                </div>
                <h3 className="font-heading text-3xl md:text-4xl font-bold mb-4">Never Run Out. Always Save.</h3>
                <p className="text-white/70 mb-6">
                  Set your delivery schedule (2, 4, or 8 weeks), save 15-20% on every order, and get free shipping. Pause, swap flavors, or cancel anytime.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    '15-20% off every shipment',
                    'Free shipping always',
                    'Priority access to limited editions',
                    'Pause, skip, or cancel anytime',
                    'Swap flavors between deliveries',
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/80">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <a href="#email" className="inline-flex items-center gap-2 px-6 py-3 bg-ambrosia-pink text-ambrosia-dark font-bold rounded-full hover:scale-105 transition">
                  Start Subscription
                  <Sparkles className="w-5 h-5" />
                </a>
              </div>
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-ambrosia-pink/20 to-ambrosia-teal/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="font-heading text-5xl font-bold text-ambrosia-pink mb-2">15-20%</div>
                    <div className="text-white/70 font-manrope">Off Every Order</div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 w-32 h-32 bg-ambrosia-pink/30 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="font-heading text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </div>
        </section>

        {/* Shipping Info */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard icon={Truck} title="Fast Shipping" text="Orders ship within 24hrs. Free on $50+. 2-5 business days delivery." />
            <InfoCard icon={Shield} title="Satisfaction Guaranteed" text="Love it or we\'ll refund you. 30-day no-questions-asked policy." />
            <InfoCard icon={Leaf} title="Sustainable Packaging" text="70% recycled aluminum, plant-based sleeves, carbon-neutral shipping." />
          </div>
        </section>
      </main>
    </div>
  );
}

function ProductCard({ product, onAddToCart }: { product: typeof products[0]; onAddToCart: (id: string) => void }) {
  return (
    <article className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-ambrosia-pink/50 hover:shadow-xl hover:shadow-ambrosia-pink/10 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ambrosia-dark/80 to-transparent" />
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <span className={clsx('px-2 py-1 rounded-full text-xs font-manrope font-medium', product.badgeColor)}>
            {product.badge}
          </span>
          {!product.inStock && (
            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-manrope">
              Restocking {product.restockDate ? `~${new Date(product.restockDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Soon'}
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-white/10 text-white/70 rounded text-[10px] font-manrope">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-bold group-hover:text-ambrosia-pink transition-colors">{product.name}</h3>
            <p className="font-manrope text-xs text-white/50">{product.subtitle}</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-white/40 line-through text-sm">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>

        <p className="text-white/60 text-sm line-clamp-2">{product.description}</p>

        <div className="grid grid-cols-3 gap-2 p-3 bg-white/5 rounded-xl">
          <div className="text-center">
            <div className="font-bold text-white text-lg">{product.nutrition.sugar}g</div>
            <div className="text-[10px] text-white/50 font-manrope">Sugar</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-white text-lg">{product.nutrition.calories}</div>
            <div className="text-[10px] text-white/50 font-manrope">Calories</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-white text-lg">{product.nutrition.carbs}g</div>
            <div className="text-[10px] text-white/50 font-manrope">Net Carbs</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {product.benefits.slice(0, 3).map((benefit) => (
            <span key={benefit} className="px-2 py-0.5 bg-white/10 text-white/60 rounded text-[10px] font-manrope">
              {benefit}
            </span>
          ))}
          {product.benefits.length > 3 && (
            <span className="px-2 py-0.5 bg-white/10 text-white/40 rounded text-[10px] font-manrope">
              +{product.benefits.length - 3} more
            </span>
          )}
        </div>

        <button
          onClick={() => onAddToCart(product.id)}
          disabled={!product.inStock}
          className={clsx(
            'w-full py-3 px-4 rounded-xl font-bold text-base transition',
            'focus:outline-none focus:ring-2 focus:ring-ambrosia-pink/40 focus:ring-offset-2 focus:ring-offset-ambrosia-dark',
            product.inStock
              ? 'bg-gradient-to-r from-ambrosia-pink to-ambrosia-teal text-ambrosia-dark hover:scale-[1.02] hover:shadow-lg hover:shadow-ambrosia-pink/30'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          )}
        >
          {product.inStock ? 'Add to Cart' : 'Notify When Available'}
        </button>

        {product.subscriptionDiscount > 0 && (
          <div className="text-center text-sm text-ambrosia-pink/80 font-manrope">
            <Sparkles className="w-4 h-4 inline mr-1" />
            Subscribe & save {product.subscriptionDiscount}% — ${(product.price * (1 - product.subscriptionDiscount / 100)).toFixed(2)}/pack
          </div>
        )}
      </div>
    </article>
  );
}

function CartSidebar({ product, onClose, onAddToCart }: { product: typeof products[0]; onClose: () => void; onAddToCart: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-ambrosia-dark border-l border-white/10 animate-slide-in">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold">Added to Cart</h3>
            <button onClick={onClose} className="p-1 text-white/50 hover:text-white transition">✕</button>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex gap-4 mb-6">
              <img src={product.image} alt={product.name} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1">
                <h4 className="font-heading font-bold">{product.name}</h4>
                <p className="font-manrope text-sm text-white/60">{product.subtitle}</p>
                <div className="font-heading text-xl font-bold text-ambrosia-pink mt-2">${product.price.toFixed(2)}</div>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <label className="flex items-center justify-between">
                <span className="font-manrope text-sm text-white/70">One-time purchase</span>
                <span className="font-bold">${product.price.toFixed(2)}</span>
              </label>
              <label className="flex items-center justify-between text-ambrosia-pink">
                <span className="font-manrope text-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Subscribe & save {product.subscriptionDiscount}%
                </span>
                <span className="font-bold">${(product.price * (1 - product.subscriptionDiscount / 100)).toFixed(2)}/delivery</span>
              </label>
            </div>
            <button
              onClick={onAddToCart}
              className="w-full py-3 px-4 bg-gradient-to-r from-ambrosia-pink to-ambrosia-teal text-ambrosia-dark font-bold rounded-xl hover:scale-[1.02] transition"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={onClose}
              className="w-full mt-3 py-3 px-4 bg-white/5 border border-white/10 text-white/70 font-medium rounded-xl hover:bg-white/10 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function FAQItem({ faq }: { faq: typeof faqs[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <details className={clsx('group bg-white/5 border border-white/10 rounded-xl overflow-hidden transition', open && 'border-ambrosia-pink/50')}>
      <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
        <span className="font-manrope text-white/90">{faq.q}</span>
        <AlertCircle className={clsx('w-5 h-5 text-ambrosia-pink transition-transform duration-300', open && 'rotate-45')} />
      </summary>
      <div className="px-5 pb-5 text-white/60 text-sm leading-relaxed animate-slide-up">
        {faq.a}
      </div>
    </details>
  );
}

function InfoCard({ icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  const Icon = icon;
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-ambrosia-pink/50 transition">
      <div className="w-12 h-12 rounded-xl bg-ambrosia-pink/20 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-ambrosia-pink" />
      </div>
      <h3 className="font-heading text-lg font-bold mb-2">{title}</h3>
      <p className="font-manrope text-sm text-white/60">{text}</p>
    </div>
  );
}