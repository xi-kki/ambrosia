import { ChatInterface } from '@/components/chat/ChatInterface';

export default function FormulatePage() {
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
          <div className="flex items-center gap-4">
            <a href="/" className="nav-item font-manrope text-sm text-white/70 hover:text-white transition">Home</a>
            <a href="/formulate" className="nav-item font-manrope text-sm bg-ambrosia-pink text-ambrosia-dark px-4 py-2 rounded-full font-medium">AI Formulate</a>
            <a href="/shop" className="nav-item font-manrope text-sm text-white/70 hover:text-white transition">Shop</a>
            <a href="/ingredients" className="nav-item font-manrope text-sm text-white/70 hover:text-white transition">Ingredients</a>
            <a href="/contact" className="nav-item font-manrope text-sm text-white/70 hover:text-white transition">Contact</a>
          </div>
        </nav>
      </header>
      <main className="pt-16 min-h-screen">
        <ChatInterface />
      </main>
    </div>
  );
}