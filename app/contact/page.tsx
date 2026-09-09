export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ambrosia-dark text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6">Contact Us</h1>
        <p className="text-ambrosia-pink/80 text-lg mb-8">
          We'd love to hear from you. Email us at hello@ambrosia.example
        </p>
        <a
          href="mailto:hello@ambrosia.example"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ambrosia-pink to-ambrosia-teal text-ambrosia-dark font-medium rounded-full hover:scale-105 transition-transform"
        >
          Send Email
        </a>
      </div>
    </div>
  );
}