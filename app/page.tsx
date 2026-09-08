'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const ASSETS = {
  leaves: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/leaves.glb',
  cherry: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/cherry.glb',
  blueberry: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/blueberry.glb',
  can: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/deit_soda2.glb',
  greenSoda: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/Green%20Soda.png',
  blueSoda: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/Blue%20Soda.png',
  greenTex: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/green%20base%20color.jpg',
  blueTex: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/blue%20base%20color.jpg',
  bubble: 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/bubble.png',
};

const berryPositions = [
  { id: 'b1', top: '25%', left: '30%', w: 220, h: 220, orbit: '45deg 120deg 105%', exp: 1.2 },
  { id: 'b2', top: '60%', left: '42%', w: 100, h: 100, orbit: '-120deg 45deg 105%', exp: 1.2 },
  { id: 'b3', top: '30%', left: '62%', w: 250, h: 250, orbit: '200deg 90deg 105%', exp: 1.2 },
  { id: 'b4', top: '15%', left: '48%', w: 140, h: 140, orbit: '10deg 20deg 105%', exp: 1.2 },
  { id: 'b5', top: '75%', left: '20%', w: 120, h: 120, orbit: '-45deg 160deg 105%', exp: 1.2 },
  { id: 'b6', top: '45%', left: '75%', w: 180, h: 180, orbit: '80deg 75deg 105%', exp: 1.2 },
];

const bgBerryPositions = [
  { id: 'b7', top: '15%', left: '40%', w: 80, h: 80, orbit: '-20deg 110deg 105%', exp: 1.0, op: 0.7 },
  { id: 'b8', top: '50%', left: '55%', w: 70, h: 70, orbit: '160deg 45deg 105%', exp: 1.0, op: 0.6 },
  { id: 'b9', top: '80%', left: '35%', w: 75, h: 75, orbit: '45deg 20deg 105%', exp: 1.0, op: 0.7 },
];

const leafPositions = [
  { id: 'l1', top: '10%', left: '15%', w: 60, h: 60, orbit: '45deg 75deg 105%' },
  { id: 'l2', top: '40%', left: '80%', w: 140, h: 140, orbit: '-30deg 60deg 105%', op: 0.4 },
  { id: 'l3', top: '70%', left: '75%', w: 80, h: 80, orbit: '120deg 85deg 105%' },
  { id: 'l4', top: '85%', left: '20%', w: 120, h: 120, orbit: '10deg 45deg 105%', op: 0.3 },
];

const durations = [5, 7, 6, 8, 5.5, 6.5, 9, 11, 10];

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [blueTex, setBlueTex] = useState<HTMLImageElement | null>(null);
  const [greenTex, setGreenTex] = useState<HTMLImageElement | null>(null);
  const productModel = useRef<any>(null);
  const berriesFG = useRef<HTMLDivElement>(null);
  const berriesBG = useRef<HTMLDivElement>(null);
  const leavesContainer = useRef<HTMLDivElement>(null);
  const bubblesContainer = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, px: 0, py: 0 });
  const [currentMouse, setCurrentMouse] = useState({ x: 0, y: 0 });
  const [switchSpin, setSwitchSpin] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);
  const [theme, setTheme] = useState<'classic'|'blue'>('classic');
  const berryRefs = useRef<(HTMLModelElement | null)[]>([]);
  const leafRefs = useRef<(HTMLModelElement | null)[]>([]);
  const berryData = useRef<Array<{angle:number,baseX:number,baseY:number,rx:number,ry:number}>>([]);
  let animId: number;

  useEffect(() => {
    // Preload textures
    const bt = new Image(); bt.src = ASSETS.blueTex; bt.onload = () => setBlueTex(bt);
    const gt = new Image(); gt.src = ASSETS.greenTex; gt.onload = () => setGreenTex(gt);

    // Initialize berry data
    berryData.current = Array.from({length: 9}, () => ({
      angle: Math.random() * 360, baseX: 0, baseY: 0, rx: 0, ry: 0
    }));

    // Bubbles
    const bubbleInterval = setInterval(() => {
      if (!bubblesContainer.current) return;
      const b = document.createElement('img');
      b.src = ASSETS.bubble;
      b.className = 'bubble-img';
      const size = Math.random() * 20 + 10;
      b.style.width = size + 'px';
      b.style.height = 'auto';
      b.style.left = Math.random() * 100 + '%';
      b.style.bottom = '-50px';
      b.style.opacity = (Math.random() * 0.4 + 0.2).toString();
      const dur = Math.random() * 6 + 4;
      b.style.animation = `floatUpImg ${dur}s linear forwards`;
      bubblesContainer.current.appendChild(b);
      setTimeout(() => b.remove(), dur * 1000);
    }, 400);

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      setCurrentMouse(cm => ({
        x: cm.x + (mouse.x - cm.x) * 0.05,
        y: cm.y + (mouse.y - cm.y) * 0.05
      }));

      if (productModel.current) {
        productModel.current.cameraOrbit = `${(currentMouse.x * 40) + switchSpin}deg ${90 + (currentMouse.y * 20)}deg 380%`;
      }
      if (berriesFG.current) berriesFG.current.style.transform = `translate(${currentMouse.x * 60}px, ${currentMouse.y * 60}px)`;
      if (berriesBG.current) berriesBG.current.style.transform = `translate(${currentMouse.x * -30}px, ${currentMouse.y * -30}px)`;
      if (leavesContainer.current) leavesContainer.current.style.transform = `translate(${currentMouse.x * -15}px, ${currentMouse.y * -15}px)`;

      if (!isSwitching) {
        berryRefs.current.forEach((berry, i) => {
          if (!berry) return;
          const rect = berry.getBoundingClientRect();
          const bx = rect.left + rect.width / 2;
          const by = rect.top + rect.height / 2;
          const dx = mouse.px - bx;
          const dy = mouse.py - by;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let trx = 0, tryy = 0, sm = 1;
          if (dist < 400) {
            const force = (400 - dist) / 400;
            trx = (dx / dist) * force * -80;
            tryy = (dy / dist) * force * -80;
            sm = 1 + force * 5;
          }
          const d = berryData.current[i];
          d.rx += (trx - d.rx) * 0.1;
          d.ry += (tryy - d.ry) * 0.1;
          d.angle += 0.2 * sm;
          const dur = durations[i % 9];
          const phase = (time + i * 0.7) * (Math.PI * 2 / dur);
          const fy = Math.sin(phase) * 15;
          const fa = Math.cos(phase) * 6;
          berry.style.transform = `translate(calc(${d.rx + d.baseX}px), calc(${d.ry + d.baseY}px + ${fy}px)) rotate(calc(${d.angle}deg + ${fa}deg))`;
        });
      }

      leafRefs.current.forEach((leaf, i) => {
        if (!leaf) return;
        const dur = 10 + i * 2;
        const phase = (time + i * 1.2) * (Math.PI * 2 / dur);
        const fy = Math.sin(phase) * 20;
        const fx = Math.cos(phase * 0.5) * 15;
        const fa = Math.sin(phase * 0.3) * 15;
        leaf.style.transform = `translate(${fx}px, ${fy}px) rotate(${fa}deg)`;
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    setIsLoaded(true);
    return () => { clearInterval(bubbleInterval); cancelAnimationFrame(animId); };
  }, [isSwitching, switchSpin, currentMouse, mouse]);

  const handleSwitch = async (flavor: 'classic' | 'blue') => {
    if (isSwitching) return;
    setIsSwitching(true);
    setTheme(flavor);
    document.body.classList.toggle('blue-theme', flavor === 'blue');

    // Animate background
    gsap.to(document.body, {
      '--bg-inner': flavor === 'blue' ? '#0b4f8a' : '#0b8a78',
      '--bg-mid': flavor === 'blue' ? '#04294e' : '#044e3b',
      '--bg-outer': flavor === 'blue' ? '#010c14' : '#011411',
      duration: 1.5, ease: 'power2.inOut'
    });

    // Can spin
    const spinObj = { val: 0, blur: 0 };
    await gsap.to(spinObj, { val: 360, blur: 15, duration: 0.6, ease: 'power2.in',
      onUpdate: () => { setSwitchSpin(spinObj.val); if (productModel.current) productModel.current.style.filter = `blur(${spinObj.blur}px)`; },
      onComplete: async () => {
        // Swap texture
        if (productModel.current && productModel.current.model) {
          const tex = flavor === 'blue' ? blueTex : greenTex;
          if (tex) productModel.current.model.materials.forEach((m: any) => m.pbrMetallicRoughness?.baseColorTexture?.setTexture(tex));
        }
        await gsap.to(spinObj, { val: 720, blur: 0, duration: 1.5, ease: 'back.out(0.7)',
          onUpdate: () => { setSwitchSpin(spinObj.val); if (productModel.current) productModel.current.style.filter = `blur(${spinObj.blur}px)`; },
          onComplete: () => { setSwitchSpin(0); if (productModel.current) productModel.current.style.filter = 'none'; }
        });
      }
    });

    // Berries implode/explode
    const berries = document.querySelectorAll('.berry');
    let done = 0;
    berries.forEach((berry: Element, i) => {
      const el = berry as HTMLElement;
      const bW = el.offsetWidth / 2, bH = el.offsetHeight / 2;
      const cx = window.innerWidth / 2 - el.offsetLeft - bW;
      const cy = window.innerHeight / 2 - el.offsetTop - bH;
      const startA = berryData.current[i].angle;
      const baseX = berryData.current[i].baseX;
      const baseY = berryData.current[i].baseY;
      const nextX = (Math.random() - 0.5) * 200;
      const nextY = (Math.random() - 0.5) * 200;

      gsap.set(el, { rotation: startA, x: baseX, y: baseY });
      const tl = gsap.timeline();
      tl.to(el, { x: cx, y: cy, rotation: startA + 45, scale: 0.1, opacity: 0, duration: 0.5, ease: 'power2.in',
        onComplete: () => {
          if (el.tagName === 'MODEL-VIEWER') (el as any).src = flavor === 'blue' ? ASSETS.blueberry : ASSETS.cherry;
        }})
        .to(el, { duration: 0.3 })
        .to(el, { x: nextX, y: nextY, rotation: startA + 90, scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.5)',
          onComplete: () => {
            berryData.current[i] = { angle: startA + 90, baseX: nextX, baseY: nextY, rx: 0, ry: 0 };
            if (++done === berries.length) setIsSwitching(false);
          }});
    });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    setMouse({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5, px: e.clientX, py: e.clientY });
  };

  return (
    <div className="fixed inset-0 z-0" onMouseMove={onMouseMove}>
      {/* Bubbles */}
      <div ref={bubblesContainer} id="bubbles-container" className="fixed inset-0 pointer-events-none overflow-hidden" />

      {/* Header */}
      <header className="fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-soda-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8V16M8 12H16"/></svg>
            <span className="font-heading text-xl font-bold">Soda</span>
          </div>
          <nav className="flex items-center gap-2 glass px-2 rounded-full">
            <a href="/" className="nav-item active">Home</a>
            <a href="/soda-ai" className="nav-item">AI Formulate</a>
            <a href="#" className="nav-item">Ingredients</a>
            <a href="#" className="nav-item">Taste</a>
            <a href="#" className="nav-item">Eco</a>
            <a href="#" className="nav-item">Reviews</a>
          </nav>
          <button className="px-6 py-3 rounded-full bg-black/50 text-white font-semibold hover:bg-black/70 transition">Contact Us</button>
        </div>
      </header>

      {/* Hero */}
      <main className="h-screen flex items-center justify-center px-4 pt-20 relative">
        <div className="w-full max-w-none h-full relative" style={{ perspective: '1000px' }}>

          {/* Leaves */}
          <div ref={leavesContainer} className="absolute inset-0 pointer-events-none z-[-1] transition-transform duration-100">
            {leafPositions.map(l => (
              <model-viewer key={l.id} ref={el => leafRefs.current[parseInt(l.id.slice(1))-1] = el}
                src={ASSETS.leaves} environment-image="neutral" exposure={1.0}
                interaction-prompt="none" camera-orbit={l.orbit}
                className="leaf absolute" style={{ top: l.top, left: l.left, width: l.w, height: l.h, opacity: l.op || 1 }} />
            ))}
          </div>

          {/* Left Column */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 max-w-xs">
            <h1 className="font-heading text-5xl md:text-7xl lg:text-9xl leading-[0.8] font-normal">
              <span className="text-white">Pure</span><br/>Zero
            </h1>
            <p className="mt-6 text-white/70 text-lg leading-relaxed max-w-xs">
              Unleash the crisp taste of zero sugar.<br/>
              Refreshment redefined in every bubble —<br/>
              all in one sleek design.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <a href="/soda-ai" className="primary-btn group">
                Shop Now
                <span className="plus-icon group-hover:rotate-90 transition-transform">+</span>
              </a>
              <a href="/soda-ai" className="primary-btn bg-gradient-to-r from-soda-pink to-soda-teal text-soda-dark justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Formulate with AI
              </a>
            </div>
            <div className="award-badge mt-auto">
              <div className="award-icon"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15L15 18L19 14"/><path d="M7 10L12 15L17 10"/></svg></div>
              <div><span className="text-xs text-white/50 tracking-wider">DESIGN AWARDS</span><br/><span className="font-semibold text-sm">PREMIUM BEVERAGE 2025</span></div>
            </div>
          </div>

          {/* Background Berries */}
          <div ref={berriesBG} className="absolute inset-0 pointer-events-none z-0 transition-transform duration-100">
            {bgBerryPositions.map(b => (
              <model-viewer key={b.id} src={ASSETS.cherry} environment-image="neutral" exposure={b.exp}
                interaction-prompt="none" camera-orbit={b.orbit}
                className="berry absolute" style={{ top: b.top, left: b.left, width: b.w, height: b.h, opacity: b.op }} />
            ))}
          </div>

          {/* Center Can */}
          <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 animate-fade-in animate-float" style={{ animationDelay: '0.3s' }}>
            <div className="relative" style={{ width: '80vw', height: '80vh', maxWidth: '800px', maxHeight: '600px' }}>
              <model-viewer ref={productModel} src={ASSETS.can} alt="Diet Soda 3D Model"
                camera-controls disable-zoom shadow-intensity="0" environment-image="neutral" exposure={1.5}
                interaction-prompt="none" camera-orbit="0deg 90deg 380%" field-of-view="30deg"
                className="w-full h-full" style={{ transform: 'translate(-50%, -50%) rotate(25deg)', position: 'fixed', top: '50%', left: '50%', zIndex: 1, pointerEvents: 'auto' }} />
            </div>
          </div>

          {/* Foreground Berries */}
          <div ref={berriesFG} className="absolute inset-0 pointer-events-none z-20 transition-transform duration-100">
            {berryPositions.map((b, i) => (
              <model-viewer key={b.id} ref={el => berryRefs.current[i] = el}
                src={ASSETS.cherry} environment-image="neutral" exposure={b.exp}
                interaction-prompt="none" camera-orbit={b.orbit}
                className="berry absolute" style={{ top: b.top, left: b.left, width: b.w, height: b.h }} />
            ))}
          </div>

          {/* Right Column */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-[450px] flex flex-col justify-between items-end text-right">
            <div className="flex flex-col gap-6 items-end pointer-events-auto">
              <div className="flex gap-4">
                <div className={`card ${theme === 'classic' ? 'active' : ''}`} onClick={() => handleSwitch('classic')}>
                  <img src={ASSETS.greenSoda} alt="Diet Classic" />
                  <div className="card-info"><span>Diet Classic</span><span>$2.99</span></div>
                </div>
                <div className={`card ${theme === 'blue' ? 'active' : ''}`} onClick={() => handleSwitch('blue')}>
                  <img src={ASSETS.blueSoda} alt="Zero Lime" style={{ filter: 'brightness(0.7)' }} />
                  <div className="card-info"><span>Zero Lime</span><span>$2.99</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="nav-arrow w-9 h-9 rounded-full glass flex items-center justify-center">←</button>
                <button className="nav-arrow w-9 h-9 rounded-full glass flex items-center justify-center">→</button>
              </div>
            </div>
            <h2 className="font-heading text-5xl md:text-7xl leading-[0.8] font-normal text-right">
              <span className="text-white">Refreshingly</span><br/>Clean
            </h2>
          </div>
        </div>
      </main>
    </div>
  );
}