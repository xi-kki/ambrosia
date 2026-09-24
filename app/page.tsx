'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

declare global {
  interface HTMLModelViewerElement extends HTMLElement {
    cameraOrbit: string;
    model: any;
    createTexture: (url: string) => Promise<any>;
  }
}

export default function LandingPage() {
  const productModelRef = useRef<HTMLModelViewerElement>(null);
  const berriesFGRef = useRef<HTMLDivElement>(null);
  const berriesBGRef = useRef<HTMLDivElement>(null);
  const leavesBGRef = useRef<HTMLDivElement>(null);
  const berryRefs = useRef<HTMLModelViewerElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [flavor, setFlavor] = useState<'classic' | 'blue'>('classic');
  const isSwitchingRef = useRef(false);
  const switchSpinRef = useRef(0);
  const blueTextureRef = useRef<any>(null);
  const greenTextureRef = useRef<any>(null);
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);

  const flavors = [
    { id: 'classic', name: 'Classic', color: 'ambrosia-teal', bg: 'body' },
    { id: 'blue', name: 'Zero Lime', color: 'ambrosia-blue', bg: 'body blue-theme' },
  ];

  const CHERRY_GLB = 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/cherry.glb';
  const BLUEBERRY_GLB = 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/blueberry.glb';
  const GREEN_BASE_COLOR_JPG = 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/green%20base%20color.jpg';
  const BLUE_BASE_COLOR_JPG = 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/blue%20base%20color.jpg';
  const BUBBLE_PNG = 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/bubble.png';

  // Preload textures & warm up shaders
  useEffect(() => {
    const modelViewer = productModelRef.current;
    if (!modelViewer) return;

    const loadTextures = async () => {
      try {
        blueTextureRef.current = await modelViewer.createTexture(BLUE_BASE_COLOR_JPG);
        greenTextureRef.current = await modelViewer.createTexture(GREEN_BASE_COLOR_JPG);

        if (modelViewer.model) {
          const material = modelViewer.model.materials[0];
          if (material && material.pbrMetallicRoughness.baseColorTexture) {
            material.pbrMetallicRoughness.baseColorTexture.setTexture(blueTextureRef.current);
            await new Promise(r => requestAnimationFrame(r));
            material.pbrMetallicRoughness.baseColorTexture.setTexture(greenTextureRef.current);
          }
        }
      } catch (e) { console.error('Texture preload failed', e); }
    };

    modelViewer.addEventListener('load', loadTextures);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.y = (e.clientY / window.innerHeight) - 0.5;
      mouseRef.current.px = e.clientX;
      mouseRef.current.py = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize berry data attributes
  useEffect(() => {
    berryRefs.current.forEach((berry, i) => {
      if (berry.dataset) {
        berry.dataset.rx = '0';
        berry.dataset.ry = '0';
        berry.dataset.angle = (Math.random() * 360).toString();
        berry.dataset.baseX = '0';
        berry.dataset.baseY = '0';
        berry.dataset.targetRx = '0';
        berry.dataset.targetRy = '0';
      }
    });
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      const time = Date.now() * 0.001;

      // Smooth mouse interpolation
      currentMouseRef.current.x += (mouseRef.current.x - currentMouseRef.current.x) * 0.05;
      currentMouseRef.current.y += (mouseRef.current.y - currentMouseRef.current.y) * 0.05;

      // Tilt the product can + add switch spin
      const modelViewer = productModelRef.current;
      if (modelViewer) {
        modelViewer.cameraOrbit = `${(currentMouseRef.current.x * 40) + switchSpinRef.current}deg ${90 + (currentMouseRef.current.y * 20)}deg 380%`;
      }

      // Parallax containers
      if (berriesFGRef.current) {
        berriesFGRef.current.style.transform = `translate(${currentMouseRef.current.x * 60}px, ${currentMouseRef.current.y * 60}px)`;
      }
      if (berriesBGRef.current) {
        berriesBGRef.current.style.transform = `translate(${currentMouseRef.current.x * -30}px, ${currentMouseRef.current.y * -30}px)`;
      }
      if (leavesBGRef.current) {
        leavesBGRef.current.style.transform = `translate(${currentMouseRef.current.x * -15}px, ${currentMouseRef.current.y * -15}px)`;
      }

      // Update berries with smoothing and float
      if (!isSwitchingRef.current) {
        berryRefs.current.forEach((berry, i) => {
          if (!berry) return;
          const berryRect = berry.getBoundingClientRect();
          const berryX = berryRect.left + berryRect.width / 2;
          const berryY = berryRect.top + berryRect.height / 2;

          const diffX = mouseRef.current.px - berryX;
          const diffY = mouseRef.current.py - berryY;
          const distance = Math.sqrt(diffX * diffX + diffY * diffY);

          let targetRx = 0, targetRy = 0, speedMult = 1;

          if (distance < 400) {
            const force = (400 - distance) / 400;
            targetRx = (diffX / distance) * force * -80;
            targetRy = (diffY / distance) * force * -80;
            speedMult = 1 + force * 5;
          }

          let rx = parseFloat(berry.dataset.rx || '0');
          let ry = parseFloat(berry.dataset.ry || '0');
          let angle = parseFloat(berry.dataset.angle || '0');
          let baseX = parseFloat(berry.dataset.baseX || '0');
          let baseY = parseFloat(berry.dataset.baseY || '0');

          rx += (targetRx - rx) * 0.1;
          ry += (targetRy - ry) * 0.1;
          angle += 0.2 * speedMult;

          berry.dataset.rx = rx.toString();
          berry.dataset.ry = ry.toString();
          berry.dataset.angle = angle.toString();

          const dur = [5, 7, 6, 8, 5.5, 6.5, 9, 11, 10][i % 9];
          const phase = (time + i * 0.7) * (Math.PI * 2 / dur);
          const floatY = Math.sin(phase) * 15;
          const floatAngle = Math.cos(phase) * 6;

          berry.style.transform = `translate(calc(${rx + baseX}px), calc(${ry + baseY}px + ${floatY}px)) rotate(calc(${angle}deg + ${floatAngle}deg))`;
        });
      }

      // Update leaves with float
      if (leavesBGRef.current) {
        leavesBGRef.current.querySelectorAll('.leaf').forEach((leaf: Element, i) => {
          const dur = 10 + i * 2;
          const phase = (time + i * 1.2) * (Math.PI * 2 / dur);
          const floatY = Math.sin(phase) * 20;
          const floatX = Math.cos(phase * 0.5) * 15;
          const floatAngle = Math.sin(phase * 0.3) * 15;
          (leaf as HTMLElement).style.transform = `translate(${floatX}px, ${floatY}px) rotate(${floatAngle}deg)`;
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isSwitchingRef.current]);

  // Bubbles generator
  useEffect(() => {
    const bubblesContainer = document.getElementById('bubbles-container');
    if (!bubblesContainer) return;

    const createBubble = () => {
      const bubble = document.createElement('img');
      bubble.src = BUBBLE_PNG;
      bubble.className = 'bubble-img';
      const size = Math.random() * 20 + 10 + 'px';
      bubble.style.width = size;
      bubble.style.height = 'auto';
      bubble.style.left = Math.random() * 100 + '%';
      bubble.style.bottom = '-50px';
      bubble.style.opacity = (Math.random() * 0.4 + 0.2).toString();

      const duration = Math.random() * 6 + 4;
      bubble.style.animation = `floatUpImg ${duration}s linear forwards`;

      bubblesContainer.appendChild(bubble);
      setTimeout(() => bubble.remove(), duration * 1000);
    };

    const interval = setInterval(createBubble, 400);
    return () => clearInterval(interval);
  }, []);

  // GSAP cleanup on unmount
  useEffect(() => {
    return () => {
      gsap.killTweensOf('*');
      gsap.globalTimeline.clear();
    };
  }, []);

  // Respect reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      if (mediaQuery.matches) {
        gsap.globalTimeline.timeScale(0);
      } else {
        gsap.globalTimeline.timeScale(1);
      }
    };
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Flavor switch handler
  const switchFlavor = async (newFlavor: 'classic' | 'blue') => {
    if (isSwitchingRef.current) return;
    isSwitchingRef.current = true;
    setFlavor(newFlavor);

    const body = document.body;
    const berries = document.querySelectorAll('.berry');
    const heroCenter = document.querySelector('.hero-center') as HTMLElement | null;
    const modelViewer = productModelRef.current;

    const targetColors = newFlavor === 'blue'
      ? { inner: '#0b4f8a', mid: '#04294e', outer: '#010c14' }
      : { inner: '#0b8a78', mid: '#044e3b', outer: '#011411' };

    // Background animation
    gsap.to(body, {
      '--bg-inner': targetColors.inner,
      '--bg-mid': targetColors.mid,
      '--bg-outer': targetColors.outer,
      duration: 1.5,
      ease: 'power2.inOut',
    });

    // Can spin animation
    const spinObj = { val: 0, blur: 0 };
    await gsap.to(spinObj, {
      val: 360,
      blur: 15,
      duration: 0.6,
      ease: 'power2.in',
      onUpdate: () => {
        switchSpinRef.current = spinObj.val;
        if (modelViewer) modelViewer.style.filter = `blur(${spinObj.blur}px)`;
      },
    });

    // Swap texture at peak
    if (newFlavor === 'blue') {
      body.classList.add('blue-theme');
      if (modelViewer?.model && blueTextureRef.current) {
        modelViewer.model.materials.forEach((material: any) => {
          if (material.pbrMetallicRoughness.baseColorTexture) {
            material.pbrMetallicRoughness.baseColorTexture.setTexture(blueTextureRef.current);
          }
        });
      }
    } else {
      body.classList.remove('blue-theme');
      if (modelViewer?.model && greenTextureRef.current) {
        modelViewer.model.materials.forEach((material: any) => {
          if (material.pbrMetallicRoughness.baseColorTexture) {
            material.pbrMetallicRoughness.baseColorTexture.setTexture(greenTextureRef.current);
          }
        });
      }
    }

    await gsap.to(spinObj, {
      val: 720,
      blur: 0,
      duration: 1.5,
      ease: 'back.out(0.7)',
      onUpdate: () => {
        switchSpinRef.current = spinObj.val;
        if (modelViewer) modelViewer.style.filter = `blur(${spinObj.blur}px)`;
      },
    });

    switchSpinRef.current = 0;
    if (modelViewer) modelViewer.style.filter = 'none';

    // Berries implode/explode
    let completedBerries = 0;
    berries.forEach((berry: Element, i) => {
      const berryEl = berry as HTMLElement;
      const bW = berryEl.offsetWidth / 2;
      const bH = berryEl.offsetHeight / 2;
      const centerX = (window.innerWidth / 2 - berryEl.offsetLeft - bW);
      const centerY = (window.innerHeight / 2 - berryEl.offsetTop - bH);

      const startAngle = parseFloat(berryEl.dataset.angle || '0');
      const currentBaseX = parseFloat(berryEl.dataset.baseX || '0');
      const currentBaseY = parseFloat(berryEl.dataset.baseY || '0');

      const nextBaseX = (Math.random() - 0.5) * 200;
      const nextBaseY = (Math.random() - 0.5) * 200;

      gsap.set(berryEl, {
        rotation: startAngle,
        x: currentBaseX,
        y: currentBaseY,
      });

      const berryTl = gsap.timeline();

      berryTl.to(berryEl, {
        x: centerX,
        y: centerY,
        rotation: startAngle + 45,
        scale: 0.1,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          if (berryEl.tagName === 'MODEL-VIEWER') {
            (berryEl as any).src = newFlavor === 'blue' ? BLUEBERRY_GLB : CHERRY_GLB;
          }
          if (heroCenter) heroCenter.style.zIndex = '50';
        },
      })
        .to(berryEl, { duration: 0.3 })
        .to(berryEl, {
          onStart: () => { if (heroCenter) heroCenter.style.zIndex = '1'; },
          x: nextBaseX,
          y: nextBaseY,
          rotation: startAngle + 90,
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: 'back.out(1.5)',
          onComplete: () => {
            berryEl.dataset.angle = (startAngle + 90).toString();
            berryEl.dataset.baseX = nextBaseX.toString();
            berryEl.dataset.baseY = nextBaseY.toString();
            berryEl.dataset.rx = '0';
            berryEl.dataset.ry = '0';

            completedBerries++;
            if (completedBerries === berries.length) {
              isSwitchingRef.current = false;
            }
          },
        });
    });
  };

  // Register berry refs
  const registerBerryRef = (index: number) => (el: HTMLModelViewerElement | null) => {
    berryRefs.current[index] = el!;
  };

  const currentFlavor = flavors.find(f => f.id === flavor)!;

  return (
    <div className={currentFlavor.bg} style={{ minHeight: '100dvh', overflow: 'hidden' }}>
      {/* Bubbles container */}
      <div id="bubbles-container" style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0, overflow: 'hidden'
      }} />

      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '2rem 4%', position: 'fixed', top: 0, width: '100%', zIndex: 100
      }}>
        <div className="logo" style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontWeight: 700, fontSize: '1.2rem', fontFamily: 'var(--font-heading)'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8V16M8 12H16" strokeLinecap="round" />
          </svg>
          <span>Ambrosia</span>
        </div>
        <nav className="nav glass" style={{
          display: 'flex', gap: '0.5rem',
          background: 'rgba(255,255,255,0.08)', padding: '0.4rem',
          borderRadius: 'var(--radius-pill)', border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)'
        }}>
          {['Home', 'Ingredients', 'Taste', 'Eco', 'Reviews'].map((item, i) => (
            <Link key={i} href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`} className="nav-item" style={{
              fontFamily: "'Manrope', sans-serif", color: 'var(--muted-color)',
              textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500,
              padding: '0.5rem 1.2rem', borderRadius: 'var(--radius-pill)', transition: 'all 0.3s ease'
            }}>
              {item}
            </Link>
          ))}
        </nav>
        <button className="contact-btn" style={{
          background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)',
          padding: '0.9rem 2rem', borderRadius: 'var(--radius-pill)', fontWeight: 600,
          fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s ease',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)'
        }}>Contact Us</button>
      </header>

      {/* Hero */}
      <main className="hero" style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 4%', paddingTop: '5rem'
      }}>
        <div className="hero-content" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'stretch',
          width: '100%', maxWidth: '100%', padding: 0, height: '100%', position: 'relative'
        }}>
          {/* Leaves container */}
          <div ref={leavesBGRef} className="leaves-container" style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: -1, transition: 'transform 0.1s ease-out'
          }}>
            {['l1', 'l2', 'l3', 'l4'].map((cls, i) => (
              <model-viewer
                key={cls}
                className={`leaf ${cls}`}
                src="https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/leaves.glb"
                environment-image="neutral" exposure="1.0" interaction-prompt="none"
                camera-orbit={['45deg 75deg 105%', '-30deg 60deg 105%', '120deg 85deg 105%', '10deg 45deg 105%'][i]}
                style={{
                  position: 'absolute', width: '60px', height: '60px',
                  pointerEvents: 'none', zIndex: -1,
                  filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.2))',
                  ...({ l1: { top: '10%', left: '15%' }, l2: { top: '40%', left: '80%', width: '140px', height: '140px', opacity: 0.4 }, l3: { top: '70%', left: '75%', width: '80px', height: '80px' }, l4: { top: '85%', left: '20%', width: '120px', height: '120px', opacity: 0.3 } }[cls])
                }}
              />
            ))}
          </div>

          {/* Left column */}
          <div className="hero-left" style={{
            display: 'flex', flexDirection: 'column', height: '100%',
            padding: '6rem 0', gap: '2rem', zIndex: 100
          }}>
            <h1 className="main-title large-animation-1" style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(3.5rem, 8vw, 7rem)',
              lineHeight: 0.9, fontWeight: 400, textTransform: 'none',
              whiteSpace: 'nowrap', color: 'white', letterSpacing: '-0.02em',
              textShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}>
              Pure Zero<br />
              <span style={{ color: 'var(--ambrosia-pink)' }}>Refreshment</span>
            </h1>
            <p className="description" style={{
              color: 'var(--muted-color)', fontSize: '1.25rem', lineHeight: 1.6, maxWidth: '450px',
              fontWeight: 400
            }}>
              Unleash the crisp taste of zero sugar. <br />
              Refreshment redefined in every bubble &mdash; <br />
              all in one sleek design.
            </p>
            <div className="cta-group">
              <Link href="/formulate" className="primary-btn" style={{
                display: 'flex', alignItems: 'center', gap: '1.5rem',
                background: 'var(--ambrosia-pink)', color: 'var(--ambrosia-dark)', border: 'none',
                padding: '0.4rem 0.4rem 0.4rem 1.5rem', borderRadius: 'var(--radius-pill)',
                fontWeight: 700, cursor: 'pointer', width: 'fit-content',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 20px rgba(251,207,232,0.3)'
              }}>
                Meet Bevis
                <span className="plus-icon" style={{
                  background: 'var(--ambrosia-dark)', color: 'var(--ambrosia-pink)', width: '38px', height: '38px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%', fontSize: '1.4rem', fontWeight: 900,
                  lineHeight: 1, paddingBottom: '2px', border: 'none'
                }}>+</span>
              </Link>
            </div>
            <div className="award-badge" style={{
              display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto'
            }}>
              <div className="award-icon" style={{
                width: '48px', height: '48px', background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15L15 18L19 14" />
                  <path d="M7 10L12 15L17 10" />
                </svg>
              </div>
              <div className="award-text" style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="award-title" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--muted-color)' }}>DESIGN AWARDS</span>
                <span className="award-subtitle" style={{ fontSize: '0.85rem', fontWeight: 600 }}>PREMIUM BEVERAGE 2025</span>
              </div>
            </div>
          </div>

          {/* Background berries */}
          <div ref={berriesBGRef} className="berries-container-bg" style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 0, transition: 'transform 0.1s ease-out'
          }}>
            {['b7', 'b8', 'b9'].map((cls, i) => (
              <model-viewer
                key={cls}
                ref={registerBerryRef(6 + i)}
                className={`berry ${cls}`}
                src="https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/cherry.glb"
                environment-image="neutral" exposure="1.0" interaction-prompt="none"
                camera-orbit={['-20deg 110deg 105%', '160deg 45deg 105%', '45deg 20deg 105%'][i]}
                style={{
                  position: 'absolute', width: '120px', height: '120px', outline: 'none',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                  transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  ...({ b7: { top: '15%', left: '40%', width: '80px', height: '80px', opacity: 0.7 }, b8: { top: '50%', left: '55%', width: '70px', height: '70px', opacity: 0.6 }, b9: { top: '80%', left: '35%', width: '75px', height: '75px', opacity: 0.7 } }[cls])
                }}
              />
            ))}
          </div>

          {/* Center product */}
          <div className="hero-center" style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            zIndex: 1, opacity: 0, pointerEvents: 'none',
            background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
            animation: 'fadeIn 1.5s ease-out 0.3s forwards, float 6s ease-in-out infinite'
          }}>
            <model-viewer
              ref={productModelRef}
              id="product-model"
              src="https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/deit_soda2.glb"
              alt="Ambrosia 3D Model"
              camera-controls disable-zoom shadow-intensity="0"
              environment-image="neutral" exposure="1.5" interaction-prompt="none"
              camera-orbit="0deg 90deg 380%" field-of-view="30deg"
              className="main-product-3d"
              style={{
                width: '80vw', height: '80vh', outline: 'none',
                zIndex: 1, position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%) rotate(25deg)', pointerEvents: 'none'
              }}
            />
          </div>

          {/* Foreground berries */}
          <div ref={berriesFGRef} className="berries-container" style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 110, transition: 'transform 0.1s ease-out'
          }}>
            {['b1', 'b2', 'b3', 'b4', 'b5', 'b6'].map((cls, i) => (
              <model-viewer
                key={cls}
                ref={registerBerryRef(i)}
                className={`berry ${cls}`}
                src="https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/cherry.glb"
                environment-image="neutral" exposure="1.2" interaction-prompt="none"
                camera-orbit={['45deg 120deg 105%', '-120deg 45deg 105%', '200deg 90deg 105%', '10deg 20deg 105%', '-45deg 160deg 105%', '80deg 75deg 105%'][i]}
                style={{
                  position: 'absolute', width: '120px', height: '120px', outline: 'none',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                  transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  ...({ b1: { top: '25%', left: '30%', width: '220px', height: '220px' }, b2: { top: '60%', left: '42%', width: '100px', height: '100px' }, b3: { top: '30%', left: '62%', width: '250px', height: '250px' }, b4: { top: '15%', left: '48%', width: '140px', height: '140px' }, b5: { top: '75%', left: '20%', width: '120px', height: '120px' }, b6: { top: '45%', left: '75%', width: '180px', height: '180px' } }[cls])
                }}
              />
            ))}
          </div>

          {/* Right column */}
          <div className="hero-right" style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            alignItems: 'flex-end', textAlign: 'right', height: '100%',
            padding: '6rem 0', zIndex: 100, width: '450px', pointerEvents: 'none'
          }}>
            <div className="product-carousel" style={{
              display: 'flex', flexDirection: 'column', gap: '1.5rem',
              alignItems: 'flex-end', pointerEvents: 'auto'
            }}>
              <div className="carousel-cards" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                {flavors.map(f => (
                  <div key={f.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      className={`card ${flavor === f.id ? 'active' : ''}`}
                      onClick={() => switchFlavor(f.id as 'classic' | 'blue')}
                      style={{
                        background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                        padding: '1rem', paddingTop: '5rem', borderRadius: 'var(--radius-card)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: '1.5rem', cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        width: '135px', position: 'relative',
                        backdropFilter: 'blur(10px)', textAlign: 'center',
                        borderColor: flavor === f.id ? 'var(--ambrosia-pink)' : 'var(--glass-border)',
                        boxShadow: flavor === f.id ? 'none' : undefined,
                      }}
                    >
                      <img
                        src={`https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/${f.id === 'classic' ? 'Green%20Soda.png' : 'Blue%20Soda.png'}`}
                        alt={f.name === 'Classic' ? 'Ambrosia Classic' : 'Ambrosia Zero Lime'}
                        style={{
                          width: '140px', height: 'auto', marginTop: '-8rem',
                          filter: `drop-shadow(0 20px 35px rgba(0,0,0,0.5)) ${f.id === 'blue' ? 'brightness(0.7)' : ''}`,
                          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          display: 'block', willChange: 'transform', pointerEvents: 'none',
                        }}
                      />
                      <div className="card-info" style={{
                        display: 'flex', flexDirection: 'column', fontSize: '0.7rem',
                        width: '100%', wordWrap: 'break-word'
                      }}>
                        <span style={{ fontWeight: 600 }}>{f.name === 'Classic' ? 'Ambrosia Classic' : 'Zero Lime'}</span>
                        <span style={{ color: 'var(--muted-color)' }}>$2.99</span>
                      </div>
                    </div>
                    {f.id === 'classic' && (
                      <Link href="/shop" style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'var(--ambrosia-pink)', color: 'var(--ambrosia-dark)', border: 'none',
                        padding: '0.35rem 0.35rem 0.35rem 1rem', borderRadius: 'var(--radius-pill)',
                        fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                        textDecoration: 'none', whiteSpace: 'nowrap',
                        boxShadow: '0 8px 20px rgba(251,207,232,0.3)',
                        marginRight: '-1.2rem'
                      }}>
                        Shop Now
                        <span style={{
                          background: 'var(--ambrosia-dark)', color: 'white', width: '28px', height: '28px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: '50%', fontSize: '1rem', fontWeight: 900, lineHeight: 1
                        }}>+</span>
                      </Link>
                    )}
                    {f.id === 'blue' && (
                      <div className="carousel-nav" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button className="nav-arrow" style={{
                          background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                          color: 'white', width: '32px', height: '32px', borderRadius: '50%',
                          cursor: 'pointer', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', transition: 'background 0.3s', fontSize: '0.9rem'
                        }}>←</button>
                        <button className="nav-arrow" style={{
                          background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                          color: 'white', width: '32px', height: '32px', borderRadius: '50%',
                          cursor: 'pointer', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', transition: 'background 0.3s', fontSize: '0.9rem'
                        }}>→</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Hidden frosted filter + preload */}
      <svg style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}>
        <filter id="frosted">
          <feTurbulence type="fractalNoise" baseFrequency="0.0125" numOctaves={3} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={80} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div style={{ display: 'none' }}>
        <model-viewer src={BLUEBERRY_GLB} />
        <model-viewer src={CHERRY_GLB} />
      </div>

      <style jsx global>{`
        @keyframes floatUpImg {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-110vh) translateX(30px) rotate(360deg); opacity: 0; }
        }
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes shine { from { transform: translateX(-100%) rotate(45deg); } to { transform: translateX(200%) rotate(45deg); } }

        .nav-item:hover, .nav-item.active { background: var(--ambrosia-pink); color: var(--ambrosia-dark); }
        .contact-btn:hover { background: rgba(0,0,0,0.7); transform: translateY(-2px); }
        .primary-btn:hover { background: rgba(0,0,0,0.7); transform: translateY(-3px); }
        .nav-arrow:hover { background: rgba(255,255,255,0.1); }
        .card:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.4); }
        .card:hover img { transform: translateY(-30px) rotate(-12deg) scale(1.15) !important; }
        .card.active { border-color: var(--ambrosia-pink); background: var(--glass-bg); box-shadow: none; }
        .berry.no-animation { animation: none !important; }

        @media (max-width: 1200px) {
          .main-product-3d { width: 100vw; height: 60vh; top: 40%; }
          .hero-content { grid-template-columns: 1fr; padding-top: 8rem; }
          .hero-center { order: -1; }
          .main-title, .side-title { font-size: 5rem; }
          .hero-right { align-items: center; text-align: center; }
          .side-title { align-self: center; text-align: center; }
        }

        @media (max-width: 768px) {
          .main-title { font-size: clamp(2.5rem, 12vw, 4rem); }
          .description { font-size: 1rem; max-width: 100%; }
          .hero { padding: 0 1.5rem; padding-top: 4rem; }
          .hero-left { padding: 3rem 0; gap: 1.5rem; }
          .cta-group .primary-btn { padding: 0.5rem 0.5rem 0.5rem 1.5rem; gap: 1rem; }
          .cta-group .plus-icon { width: 32px; height: 32px; font-size: 1.2rem; }
          .nav { padding: 0.3rem; gap: 0.25rem; }
          .nav-item { padding: 0.4rem 0.8rem; font-size: 0.75rem; }
          .contact-btn { padding: 0.7rem 1.5rem; font-size: 0.8rem; }
          .carousel-cards { gap: 0.5rem; }
          .card { width: 110px; padding: 0.75rem; padding-top: 4rem; border-radius: 20px; }
          .card img { width: 110px; margin-top: -6rem; }
          .carousel-nav button { width: 28px; height: 28px; font-size: 0.8rem; }
          .award-badge { gap: 0.5rem; }
          .award-icon { width: 40px; height: 40px; }
          .berry { width: 80px !important; height: 80px !important; }
          .leaf { width: 40px !important; height: 40px !important; }
        }

        @media (max-width: 480px) {
          .main-title { font-size: clamp(2rem, 14vw, 3rem); }
          .hero { padding-top: 3.5rem; }
          .nav { display: none; }
          .contact-btn { display: none; }
          .carousel-cards { justify-content: center; }
        }
      `}</style>
    </div>
  );
}