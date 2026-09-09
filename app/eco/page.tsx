export default function EcoPage() {
  return (
    <div className="min-h-screen bg-ambrosia-dark text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6">Eco</h1>
        <p className="text-ambrosia-pink/80 text-lg mb-8">
          Sustainability commitment coming soon. Better for you, better for the planet.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ambrosia-pink to-ambrosia-teal text-ambrosia-dark font-medium rounded-full hover:scale-105 transition-transform"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
}