import { ChatInterface } from '@/components/chat/ChatInterface';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function FormulatePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/formulate', label: 'AI Formulate', active: true },
    { href: '/shop', label: 'Shop' },
    { href: '/ingredients', label: 'Ingredients' },
    { href: '/contact', label: 'Contact' },
  ];
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
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-item font-manrope text-sm transition ${item.active ? 'bg-ambrosia-pink text-ambrosia-dark px-4 py-2 rounded-full font-medium' : 'text-white/70 hover:text-white px-3 py-1.5'}`}
              >
                {item.label}
              </a>
            ))}
          </div>
          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="md:hidden py-4 px-4 border-t border-white/10 bg-ambrosia-dark/95 backdrop-blur">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`font-manrope text-base py-2 px-3 rounded-xl transition ${item.active ? 'bg-ambrosia-pink text-ambrosia-dark font-medium' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
      <main className="pt-16 min-h-screen">
        <ChatInterface />
      </main>
    </div>
  );
}