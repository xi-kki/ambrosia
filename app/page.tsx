'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const canRef = useRef<HTMLElement>(null);
  const [flavor, setFlavor] = useState<'classic' | 'blue'>('classic');
  const [isLoaded, setIsLoaded] = useState(false);

  const flavors = [
    { id: 'classic', name: 'Classic', color: 'ambrosia-teal', bg: 'body' },
    { id: 'blue', name: 'Zero Lime', color: 'ambrosia-blue', bg: 'body blue-theme' },
  ];

  useEffect(() => {
    const modelViewer = canRef.current;
    if (!modelViewer) return;

    modelViewer.addEventListener('load', () => setIsLoaded(true));

    const handleMouseMove = (e: MouseEvent) => {
      if (!modelViewer) return;
      const rect = modelViewer.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -30;
      modelViewer.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    };

    const handleMouseLeave = () => {
      if (modelViewer) {
        modelViewer.style.transform = 'rotateY(0deg) rotateX(0deg)';
      }
    };

    modelViewer.addEventListener('mousemove', handleMouseMove);
    modelViewer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      modelViewer.removeEventListener('mousemove', handleMouseMove);
      modelViewer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from('.main-title', { y: 100, opacity: 0, duration: 1, ease: 'power3.out' })
      .from('.side-title', { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from('.hero-desc', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .from('.cta-group', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 }, '-=0.3')
      .from('.nav-item', { y: -20, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 }, '-=0.5')
      .from('.flavor-carousel', { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3');

    const bubbles = document.querySelectorAll('.bubble-img');
    bubbles.forEach((bubble, i) => {
      gsap.to(bubble, {
        y: -110 * window.innerHeight / 100,
        x: gsap.utils.random(-50, 50),
        rotation: 360,
        duration: gsap.utils.random(8, 15),
        delay: gsap.utils.random(0, 5),
        repeat: -1,
        ease: 'none',
      });
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [flavor]);

  const switchFlavor = (newFlavor: 'classic' | 'blue') => {
    if (newFlavor === flavor) return;
    setFlavor(newFlavor);
    document.body.className = flavors.find(f => f.id === newFlavor)?.bg || 'body';

    gsap.to(canRef.current, {
      rotationY: 720,
      duration: 1.5,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.set(canRef.current, { rotationY: 0 });
      },
    });
  };

  const currentFlavor = flavors.find(f => f.id === flavor)!;

  return (
    <div className={currentFlavor.bg} style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <header className="fixed top-0 w-full z-50 bg-ambrosia-dark/95 backdrop-blur border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-ambrosia-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8V16M8 12H16" />
            </svg>
            <span className="font-heading text-xl font-bold">Ambrosia</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="nav-item font-manrope text-sm text-white/70 hover:text-white transition">Home</Link>
            <Link href="/formulate" className="nav-item font-manrope text-sm bg-ambrosia-pink text-ambrosia-dark px-4 py-2 rounded-full font-medium">AI Formulate</Link>
            <Link href="/shop" className="nav-item font-manrope text-sm text-white/70 hover:text-white transition">Shop</Link>
            <Link href="/ingredients" className="nav-item font-manrope text-sm text-white/70 hover:text-white transition">Ingredients</Link>
            <Link href="/contact" className="nav-item font-manrope text-sm text-white/70 hover:text-white transition">Contact</Link>
          </div>
        </nav>
      </header>

      <main className="pt-16 min-h-screen relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {['cherry.glb', 'blueberry.glb'].map((berry, i) => (
            <model-viewer
              key={berry}
              src={`https://getlayers.ai/models/${berry}`}
              alt={`${berry} floating`}
              className="berry"
              style={{
                width: '80px',
                height: '80px',
                top: `${gsap.utils.random(10, 80)}%`,
                left: `${gsap.utils.random(5, 90)}%`,
                animationDuration: `${gsap.utils.random(8, 15)}s`,
              }}
              auto-rotate
              camera-controls
              disable-pan
              disable-zoom
            />
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <model-viewer
              key={`leaves-${i}`}
              src="https://getlayers.ai/models/leaves.glb"
              alt="Leaves floating"
              className="leaf"
              style={{
                width: '120px',
                height: '120px',
                top: `${gsap.utils.random(20, 70)}%`,
                left: `${gsap.utils.random(5, 90)}%`,
                opacity: 0.3,
              }}
              auto-rotate
              camera-controls
              disable-pan
              disable-zoom
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <img
              key={`bubble-${i}`}
              src="https://getlayers.ai/images/bubble.png"
              alt="Bubble"
              className="bubble-img"
              style={{
                width: `${gsap.utils.random(20, 60)}px`,
                height: `${gsap.utils.random(20, 60)}px`,
                top: `${gsap.utils.random(60, 100)}%`,
                left: `${gsap.utils.random(5, 90)}%`,
                opacity: gsap.utils.random(0.1, 0.4),
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="hero-left text-center lg:text-left">
              <h1 className="main-title font-heading text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight">
                Pure <span className="text-ambrosia-pink">Zero</span> Refreshment
              </h1>
              <p className="side-title font-manrope text-lg sm:text-xl text-white/70 mt-6 max-w-md mx-auto lg:mx-0">
                Crisp. Clean. Zero compromise. Experience the future of beverage formulation.
              </p>
              <p className="hero-desc font-manrope text-base text-white/50 mt-6 max-w-lg mx-auto lg:mx-0">
                Ambrosia combines immersive 3D brand experience with Dr. Bev — your AI formulation partner for creating the next generation of functional beverages.
              </p>
              <div className="cta-group flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-10">
                <Link
                  href="/formulate"
                  className="primary-btn group"
                >
                  <span>Start Formulating</span>
                  <span className="plus-icon group-hover:rotate-90 transition-transform">+</span>
                </Link>
                <Link
                  href="/shop"
                  className="flex items-center gap-3 bg-white/5 text-white px-6 py-3 rounded-full font-medium cursor-pointer transition hover:bg-white/10 border border-white/10"
                >
                  Explore Flavors
                </Link>
              </div>
            </div>

            <div className="hero-right flex flex-col items-center gap-8 relative">
              <div className="relative" style={{ width: '350px', height: '350px' }}>
                <model-viewer
                  src="https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/deit_soda2.glb"
                  alt="Ambrosia Classic Can"
                  className="w-full h-full"
                  auto-rotate
                  camera-controls
                  disable-pan
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  environment-image="neutral"
                  exposure="1"
                  shadow-intensity="1"
                  shadow-softness="0.5"
                  tone-mapping="aces"
                  interaction-prompt="none"
                  loading="lazy"
                >
                  <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-ambrosia-dark">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-ambrosia-pink border-t-transparent" />
                  </div>
                </model-viewer>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex gap-2">
                  {flavors.map(f => (
                    <button
                      key={f.id}
                      onClick={() => switchFlavor(f.id as 'classic' | 'blue')}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        flavor === f.id
                          ? `border-${f.color} bg-${f.color}`
                          : 'border-white/30 hover:border-white/50'
                      }`}
                      aria-label={f.name}
                      title={f.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flavor-carousel flex items-center gap-4">
                <button
                  onClick={() => switchFlavor('classic')}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition text-white/70 hover:text-white"
                  aria-label="Previous flavor"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex gap-4">
                  {flavors.map(f => (
                    <div
                      key={f.id}
                      className={`card ${flavor === f.id ? 'active' : ''}`}
                      onClick={() => switchFlavor(f.id as 'classic' | 'blue')}
                    >
                      <img
                        src={`https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/${f.id === 'classic' ? 'Green%20Soda.png' : 'Blue%20Soda.png'}`}
                        alt={f.name}
                      />
                      <div className="card-info">
                        <span className="font-heading">{f.name}</span>
                        <span className="font-manrope">Zero Sugar</span>
                      </div>
                      <div className="award-badge">
                        <div className="award-icon">
                          <svg className="w-6 h-6 text-ambrosia-pink" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        </div>
                        <span className="font-manrope text-xs text-white/70">Best in Class</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => switchFlavor('blue')}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition text-white/70 hover:text-white"
                  aria-label="Next flavor"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>

          <section className="mt-24 grid md:grid-cols-3 gap-8">
            {[
              { icon: '🧪', title: 'AI Formulation', desc: 'Dr. Bev creates custom recipes with nutrition, cost & regulatory analysis', href: '/formulate' },
              { icon: '🔬', title: 'Ingredient Science', desc: 'Search 500+ ingredients with flavor profiles, compatibility & compliance data', href: '/ingredients' },
              { icon: '🌱', title: 'Sustainable Sourcing', desc: 'Trace ingredients from supplier to shelf with carbon & water footprints', href: '/eco' },
            ].map((feature, i) => (
              <Link key={i} href={feature.href} className="glass rounded-2xl p-6 hover:border-ambrosia-pink/50 transition-all group">
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="font-heading text-xl font-bold mb-2 group-hover:text-ambrosia-pink transition">{feature.title}</h3>
                <p className="font-manrope text-white/60">{feature.desc}</p>
              </Link>
            ))}
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-ambrosia-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8V16M8 12H16" />
            </svg>
            <span className="font-heading text-lg font-bold">Ambrosia</span>
          </div>
          <p className="font-manrope text-sm text-white/50">© 2024 Ambrosia. Crafted for food-tech founders.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="font-manrope text-sm text-white/50 hover:text-white transition">Contact</Link>
            <Link href="/taste" className="font-manrope text-sm text-white/50 hover:text-white transition">Taste Profiles</Link>
            <Link href="/reviews" className="font-manrope text-sm text-white/50 hover:text-white transition">Reviews</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}