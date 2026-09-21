'use client';

import { useState } from 'react';
import { Leaf, Recycle, Truck, Zap, Droplet, Shield, Award, Target, TrendingUp, Clock, Globe, Sprout, Factory, Wind, Sun } from 'lucide-react';
import { clsx } from 'clsx';

const pillars = [
  {
    id: 'ingredients',
    title: 'Regenerative Ingredients',
    icon: Sprout,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400',
    current: [
      '100% non-GMO verified ingredients',
      'Organic-certified botanicals (hibiscus, butterfly pea, rose)',
      'Fair-trade tropical purees (passion fruit, mango)',
      'Upcycled citrus oils from juice industry byproducts',
    ],
    targets: [
      { label: 'Regenerative agriculture sourcing', year: 2026, progress: 40 },
      { label: '100% upcycled citrus program', year: 2025, progress: 80 },
      { label: 'Biodiversity-positive farms', year: 2027, progress: 15 },
    ],
    metrics: [
      { label: 'Organic ingredients', value: '78%' },
      { label: 'Fair-trade certified', value: '65%' },
      { label: 'Upcycled content', value: '23%' },
    ],
  },
  {
    id: 'packaging',
    title: 'Circular Packaging',
    icon: Recycle,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    current: [
      'Aluminum cans: infinitely recyclable, 70% recycled content',
      'Plant-based shrink sleeves (PLA, compostable)',
      'Water-based inks, zero VOC emissions',
      'Minimalist design: 40% less material vs. standard',
    ],
    targets: [
      { label: '100% recycled aluminum', year: 2026, progress: 70 },
      { label: 'Refill/return program pilot', year: 2025, progress: 30 },
      { label: 'Home-compostable multipacks', year: 2026, progress: 50 },
    ],
    metrics: [
      { label: 'Recycled content', value: '70%' },
      { label: 'Recyclability rate', value: '98%' },
      { label: 'Material reduction', value: '40%' },
    ],
  },
  {
    id: 'carbon',
    title: 'Carbon Negative Operations',
    icon: Wind,
    color: 'from-sky-400 to-blue-400',
    bgColor: 'bg-sky-500/20',
    borderColor: 'border-sky-500/30',
    textColor: 'text-sky-400',
    current: [
      'Solar-powered production facility (85% renewable)',
      'Electric delivery fleet for last-mile (12 vehicles)',
      'Carbon offset: 2x emissions via mangrove restoration',
      'Lightweight can design: 18% less transport emissions',
    ],
    targets: [
      { label: '100% renewable energy', year: 2025, progress: 85 },
      { label: 'Net-zero scope 1 & 2', year: 2026, progress: 60 },
      { label: 'Carbon negative (scope 3)', year: 2028, progress: 25 },
    ],
    metrics: [
      { label: 'Renewable energy', value: '85%' },
      { label: 'Emissions reduced', value: '42%' },
      { label: 'Carbon offset ratio', value: '2.1x' },
    ],
  },
  {
    id: 'water',
    title: 'Water Stewardship',
    icon: Droplet,
    color: 'from-teal-400 to-cyan-400',
    bgColor: 'bg-teal-500/20',
    borderColor: 'border-teal-500/30',
    textColor: 'text-teal-400',
    current: [
      'Closed-loop water system: 92% reuse rate',
      'Rainwater harvesting: 500K gal/year capacity',
      'Wastewater treatment exceeds EPA standards',
      'Water-risk assessment for all ingredient sources',
    ],
    targets: [
      { label: '95% water reuse', year: 2025, progress: 92 },
      { label: 'Water-positive operations', year: 2027, progress: 35 },
      { label: 'Watershed restoration projects', year: 2026, progress: 40 },
    ],
    metrics: [
      { label: 'Water reuse rate', value: '92%' },
      { label: 'Rainwater captured', value: '480K gal/yr' },
      { label: 'Efficiency vs. industry', value: '3.2x' },
    ],
  },
];

const certifications = [
  { name: 'B Corp Certified', logo: 'B', color: 'bg-red-500', year: 2024, description: 'Highest verified social & environmental performance' },
  { name: 'Climate Neutral', logo: 'CN', color: 'bg-green-500', year: 2024, description: 'Measured, reduced, offset 100% of carbon footprint' },
  { name: '1% for the Planet', logo: '1%', color: 'bg-blue-500', year: 2023, description: '1% of revenue to environmental nonprofits' },
  { name: 'USDA Organic', logo: 'USDA', color: 'bg-amber-500', year: 2024, description: 'Organic ingredient certification' },
  { name: 'Fair Trade', logo: 'FT', color: 'bg-orange-500', year: 2023, description: 'Fair wages & safe conditions for farmers' },
  { name: 'Leaping Bunny', logo: 'LB', color: 'bg-pink-500', year: 2024, description: 'Cruelty-free, no animal testing' },
];

const timeline = [
  { year: 2023, title: 'Foundation', items: ['Launched with 70% recycled aluminum', 'Partnered with 3 organic farms', 'Achieved Climate Neutral certification'] },
  { year: 2024, title: 'Acceleration', items: ['B Corp certification', 'Solar array installation (2.4 MW)', 'Upcycled citrus program launch'] },
  { year: 2025, title: 'Scale', items: ['100% renewable energy target', 'Refill pilot in 3 cities', 'Home-compostable multipacks'] },
  { year: 2026, title: 'Leadership', items: ['Net-zero scope 1 & 2', '100% recycled aluminum', 'Water-positive roadmap'] },
  { year: 2027, title: 'Regeneration', items: ['Carbon negative (scope 3)', 'Regenerative agriculture 50%', 'Watershed restoration active'] },
  { year: 2028, title: 'Legacy', items: ['Fully circular system', 'Nature-positive portfolio', 'Industry transformation'] },
];

export default function EcoPage() {
  const [activePillar, setActivePillar] = useState<string | null>('ingredients');

  return (
    <div className="min-h-screen bg-ambrosia-dark text-white">
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
            <a href="/eco" className="nav-item font-manrope text-sm bg-ambrosia-pink text-ambrosia-dark px-4 py-1.5 rounded-full font-medium">Eco</a>
            <a href="/shop" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Shop</a>
            <a href="/contact" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Contact</a>
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-12">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6">
              <Leaf className="w-4 h-4 text-green-400" />
              <span className="font-manrope text-sm text-green-400">Sustainability Report 2024</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">Better for You, Better for the Planet</h1>
            <p className="text-ambrosia-pink/80 text-lg max-w-2xl mx-auto mb-8">
              We believe great beverages shouldn&apos;t cost the Earth. Every can of Ambrosia is engineered for circularity &mdash; from regenerative ingredients to carbon-negative operations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-white/70">
                <Shield className="w-5 h-5 text-green-400" />
                <span>B Corp Certified</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Award className="w-5 h-5 text-ambrosia-pink" />
                <span>Climate Neutral</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Globe className="w-5 h-5 text-blue-400" />
                <span>1% for the Planet</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <MetricCard icon={Leaf} label="Organic Ingredients" value="78%" target="100% by 2026" color="text-green-400" />
            <MetricCard icon={Recycle} label="Recycled Aluminum" value="70%" target="100% by 2026" color="text-blue-400" />
            <MetricCard icon={Wind} label="Renewable Energy" value="85%" target="100% by 2025" color="text-sky-400" />
            <MetricCard icon={Droplet} label="Water Reuse Rate" value="92%" target="95% by 2025" color="text-teal-400" />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="font-heading text-3xl font-bold text-center mb-10">Our Four Pillars</h2>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {pillars.map((pillar) => (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(pillar.id)}
                className={clsx(
                  'flex items-center gap-2 px-5 py-3 rounded-xl font-manrope text-sm transition-all duration-300',
                  activePillar === pillar.id
                    ? 'bg-white/10 border-2 text-white shadow-lg'
                    : 'bg-white/5 border text-white/70 hover:text-white hover:border-ambrosia-pink/50',
                  pillar.borderColor
                )}
              >
                <pillar.icon className="w-5 h-5" />
                {pillar.title}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {pillars.map((pillar) => (
                <PillarDetail key={pillar.id} pillar={pillar} isActive={activePillar === pillar.id} />
              ))}
            </div>

            <div className="space-y-4">
              {pillars.map((pillar) => (
                <PillarMetricsCard key={pillar.id} pillar={pillar} isActive={activePillar === pillar.id} />
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="font-heading text-3xl font-bold text-center mb-10">Certifications & Standards</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {certifications.map((cert) => (
              <CertificationCard key={cert.name} cert={cert} />
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="font-heading text-3xl font-bold text-center mb-10">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-ambrosia-pink to-ambrosia-teal" />
            {timeline.map((entry, i) => (
              <TimelineEntry key={entry.year} entry={entry} isLast={i === timeline.length - 1} />
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-10">Your Impact Calculator</h2>
          <ImpactCalculator />
        </section>
      </main>
    </div>
  );
}

function MetricCard({ icon, label, value, target, color }: {
  icon: React.ElementType;
  label: string;
  value: string;
  target: string;
  color: string;
}) {
  const Icon = icon;
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-ambrosia-pink/50 transition">
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 {color}" />
      </div>
      <div className="font-heading text-3xl font-bold mb-1 {color}">{value}</div>
      <div className="font-manrope text-sm text-white/60 mb-1">{label}</div>
      <div className="font-manrope text-xs text-white/40">{target}</div>
    </div>
  );
}

function PillarDetail({ pillar, isActive }: { pillar: typeof pillars[0]; isActive: boolean }) {
  const Icon = pillar.icon;
  if (!isActive) return null;

  return (
    <div className="animate-slide-up space-y-6">
      <div className={clsx('flex items-center gap-4 p-6 rounded-2xl border', pillar.borderColor, pillar.bgColor)}>
        <div className={clsx('w-14 h-14 rounded-xl flex items-center justify-center', pillar.bgColor)}>
          <Icon className="w-7 h-7 {pillar.textColor}" />
        </div>
        <div>
          <h3 className="font-heading text-2xl font-bold">{pillar.title}</h3>
          <p className="text-white/60 font-manrope">Our commitments and progress toward a regenerative future</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-manrope font-medium text-white/80 flex items-center gap-2">
            <Target className="w-4 h-4 {pillar.textColor}" />
            Current Initiatives
          </h4>
          <ul className="space-y-3">
            {pillar.current.map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className={clsx('w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', pillar.bgColor)}>
                  <Icon className="w-4 h-4 {pillar.textColor}" />
                </div>
                <span className="text-white/80 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-manrope font-medium text-white/80 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 {pillar.textColor}" />
            2025-2028 Targets
          </h4>
          <div className="space-y-4">
            {pillar.targets.map((target) => (
              <div key={target.label} className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-manrope text-sm text-white">{target.label}</span>
                  <span className="font-manrope text-xs {pillar.textColor}">{target.year} Target: {target.progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: target.progress + '%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PillarMetricsCard({ pillar, isActive }: { pillar: typeof pillars[0]; isActive: boolean }) {
  const Icon = pillar.icon;
  return (
    <div className={clsx(
      'p-4 rounded-2xl border transition-all duration-300',
      isActive
        ? 'bg-white/10 border-2 shadow-lg'
        : 'bg-white/5 border hover:border-ambrosia-pink/50',
      pillar.borderColor
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', pillar.bgColor)}>
          <Icon className="w-5 h-5 {pillar.textColor}" />
        </div>
        <div>
          <h4 className="font-manrope font-medium text-white">{pillar.title}</h4>
          <p className="font-manrope text-xs text-white/50">{pillar.metrics.length} key metrics</p>
        </div>
      </div>
      <div className="space-y-3">
        {pillar.metrics.map((metric) => (
          <div key={metric.label} className="flex items-center justify-between">
            <span className="font-manrope text-xs text-white/60">{metric.label}</span>
            <span className="font-bold text-white {pillar.textColor}">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificationCard({ cert }: { cert: typeof certifications[0] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:border-ambrosia-pink/50 transition group">
      <div className={clsx('w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-white text-lg', cert.color)}>
        {cert.logo}
      </div>
      <h4 className="font-manrope font-medium text-white mb-1">{cert.name}</h4>
      <p className="font-manrope text-xs text-white/50 mb-2">Since {cert.year}</p>
      <p className="font-manrope text-[11px] text-white/40">{cert.description}</p>
    </div>
  );
}

function TimelineEntry({ entry, isLast }: { entry: typeof timeline[0]; isLast: boolean }) {
  return (
    <div className="relative pl-20 pb-12">
      <div className="absolute left-8 top-0 w-4 h-4 rounded-full bg-ambrosia-pink border-4 border-ambrosia-dark z-10" />
      {!isLast && (
        <div className="absolute left-9 top-10 bottom-0 w-0.5 bg-gradient-to-b from-ambrosia-pink to-ambrosia-teal" />
      )}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-ambrosia-pink/50 transition">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-heading text-xl font-bold text-ambrosia-pink">{entry.year}</span>
          <span className="px-3 py-1 bg-ambrosia-pink/20 text-ambrosia-pink rounded-full text-xs font-manrope font-medium">{entry.title}</span>
        </div>
        <ul className="space-y-2">
          {entry.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-ambrosia-pink mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ImpactCalculator() {
  const [cansPerWeek, setCansPerWeek] = useState(7);
  const [years, setYears] = useState(1);

  const aluminumSaved = (cansPerWeek * 52 * years * 13.5) / 1000;
  const carbonSaved = cansPerWeek * 52 * years * 0.042;
  const waterSaved = cansPerWeek * 52 * years * 0.85;
  const energySaved = cansPerWeek * 52 * years * 0.18;

  return (
    <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <label className="block">
            <span className="font-manrope text-sm text-white/60 mb-1 block">Cans per week</span>
            <input
              type="range"
              min="1"
              max="50"
              value={cansPerWeek}
              onChange={(e) => setCansPerWeek(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none accent-ambrosia-pink"
            />
            <div className="flex justify-between text-sm">
              <span className="text-white/50">1 can</span>
              <span className="font-bold text-ambrosia-pink text-2xl">{cansPerWeek}</span>
              <span className="text-white/50">50 cans</span>
            </div>
          </label>
          <label className="block">
            <span className="font-manrope text-sm text-white/60 mb-1 block">Years</span>
            <input
              type="range"
              min="1"
              max="10"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none accent-ambrosia-teal"
            />
            <div className="flex justify-between text-sm">
              <span className="text-white/50">1 year</span>
              <span className="font-bold text-ambrosia-teal text-2xl">{years}</span>
              <span className="text-white/50">10 years</span>
            </div>
          </label>
        </div>
        <div className="bg-ambrosia-dark/50 rounded-xl p-6 border border-white/10">
          <h4 className="font-manrope font-medium text-white/70 mb-4">vs. Single-Use Plastic</h4>
          <div className="space-y-3 text-sm">
            <ImpactRow label="Aluminum saved" value={aluminumSaved.toFixed(1) + ' kg'} icon={Recycle} color="text-blue-400" />
            <ImpactRow label="CO\u2082e avoided" value={carbonSaved.toFixed(1) + ' kg'} icon={Leaf} color="text-green-400" />
            <ImpactRow label="Water saved" value={waterSaved.toFixed(0) + ' L'} icon={Droplet} color="text-teal-400" />
            <ImpactRow label="Energy saved" value={energySaved.toFixed(0) + ' kWh'} icon={Zap} color="text-yellow-400" />
          </div>
        </div>
      </div>
      <p className="text-center text-white/50 text-sm">
        Based on: 13.5g aluminum/can, 42g CO\u2082e/can vs. PET, 85% recycled content, closed-loop water system
      </p>
    </div>
  );
}

function ImpactRow({ label, value, icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-3">
      <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', color + '/20')}>
        <Icon className="w-4 h-4 {color}" />
      </div>
      <span className="font-manrope text-white/70 flex-1">{label}</span>
      <span className="font-bold text-white {color}">{value}</span>
    </div>
  );
}