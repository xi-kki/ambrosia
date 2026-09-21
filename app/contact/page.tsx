'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle, AlertCircle, MessageSquare, Building, User, Globe, Star } from 'lucide-react';
import { clsx } from 'clsx';

const formFields = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'John' },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Doe' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'john@company.com' },
  { name: 'company', label: 'Company (optional)', type: 'text', required: false, placeholder: 'Vitality Brands' },
  { name: 'role', label: 'Your Role', type: 'select', required: true, placeholder: 'Select your role', options: [
    { value: '', label: 'Select your role' },
    { value: 'founder', label: 'Founder / CEO' },
    { value: 'product', label: 'Product / R&D' },
    { value: 'marketing', label: 'Marketing / Brand' },
    { value: 'operations', label: 'Operations / Supply Chain' },
    { value: 'investor', label: 'Investor / Advisor' },
    { value: 'other', label: 'Other' },
  ]},
  { name: 'inquiry', label: 'Inquiry Type', type: 'select', required: true, placeholder: 'Select inquiry type', options: [
    { value: '', label: 'Select inquiry type' },
    { value: 'partnership', label: 'Partnership / Distribution' },
    { value: 'formulation', label: 'Custom Formulation' },
    { value: 'enterprise', label: 'Enterprise / API Access' },
    { value: 'investment', label: 'Investment Inquiry' },
    { value: 'press', label: 'Press / Media' },
    { value: 'careers', label: 'Careers' },
    { value: 'other', label: 'Other' },
  ]},
  { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Tell us about your project, timeline, and how we can help...', rows: 5 },
];

const contactInfo = [
  { icon: Mail, title: 'Email Us', details: ['hello@ambrosia.example', 'partnerships@ambrosia.example', 'press@ambrosia.example'], color: 'text-ambrosia-pink' },
  { icon: MapPin, title: 'Headquarters', details: ['San Francisco, CA', 'New York, NY', 'Remote-first team'], color: 'text-ambrosia-teal' },
  { icon: Phone, title: 'Call Us', details: ['+1 (555) 123-4567', 'Mon-Fri 9am-6pm PST', 'Schedule a call below'], color: 'text-green-400' },
  { icon: Globe, title: 'Social', details: ['@drinkambrosia (IG)', '@ambrosia_ai (Twitter)', 'Ambrosia AI (LinkedIn)'], color: 'text-blue-400' },
];

const testimonials = [
  {
    quote: 'The team responded within 2 hours with a detailed formulation proposal. We had samples in hand within a week.',
    author: 'Sarah Chen',
    role: 'Founder, Vitality Brands',
    avatar: 'SC',
  },
  {
    quote: 'Best partnership experience in 15 years of beverage. Transparent, fast, and technically brilliant.',
    author: 'Marcus Rodriguez',
    role: 'Head of Product, Tropical Sip Co.',
    avatar: 'MR',
  },
  {
    quote: 'Their regulatory team saved us 6 months on EU novel food approval. Worth every penny.',
    author: 'James Okonkwo',
    role: 'Co-Founder, AfroBev',
    avatar: 'JO',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    formFields.forEach((field) => {
      const value = formData[field.name] || '';
      if (field.required && !value.trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (field.name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field.name] = 'Invalid email address';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setSubmitError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setStatus('success');
      setFormData({});
    } catch (err) {
      setStatus('error');
      setSubmitError('Something went wrong. Please try again or email us directly at hello@ambrosia.example');
    }
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
            <a href="/shop" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Shop</a>
            <a href="/reviews" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Reviews</a>
            <a href="/contact" className="nav-item font-manrope text-sm bg-ambrosia-pink text-ambrosia-dark px-4 py-1.5 rounded-full font-medium">Contact</a>
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-12">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">Let's Create Together</h1>
            <p className="text-ambrosia-pink/80 text-lg max-w-2xl mx-auto mb-8">
              Whether you&apos;re launching a new brand, scaling production, or need custom formulation — we&apos;re here to help.
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-ambrosia-pink/20 border border-ambrosia-pink/30 rounded-full">
              <Star className="w-4 h-4 text-ambrosia-pink" />
              <span className="font-manrope text-sm text-ambrosia-pink">Average response time: <strong>2 hours</strong></span>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {contactInfo.map((info, i) => (
              <ContactCard key={i} info={info} />
            ))}
          </div>
        </section>

        {/* Form & Testimonials */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                <h2 className="font-heading text-2xl font-bold mb-6">Send Us a Message</h2>

                {status === 'success' && (
                  <SuccessMessage onReset={() => setStatus('idle')} />
                )}

                {status === 'error' && (
                  <ErrorMessage error={submitError} onRetry={() => setStatus('idle')} />
                )}

                {status !== 'success' && (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {formFields.map((field) => (
                      <FormField
                        key={field.name}
                        field={field}
                        value={formData[field.name] || ''}
                        error={errors[field.name]}
                        onChange={handleChange}
                      />
                    ))}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className={clsx(
                        'w-full py-4 px-6 rounded-xl font-bold text-lg transition',
                        'focus:outline-none focus:ring-2 focus:ring-ambrosia-pink/40 focus:ring-offset-2 focus:ring-offset-ambrosia-dark',
                        status === 'loading'
                          ? 'bg-white/10 text-white/50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-ambrosia-pink to-ambrosia-teal text-ambrosia-dark hover:scale-[1.02] hover:shadow-lg hover:shadow-ambrosia-pink/30'
                      )}
                    >
                      {status === 'loading' ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Send Message
                          <Send className="w-5 h-5" />
                        </span>
                      )}
                    </button>

                    <p className="text-center text-xs text-white/40">
                      By submitting, you agree to our Privacy Policy. We never share your data.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <h3 className="font-heading text-xl font-bold">Trusted by Founders</h3>
              <div className="space-y-4">
                {testimonials.map((t, i) => (
                  <TestimonialCard key={i} testimonial={t} />
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-8 p-5 bg-white/5 border border-white/10 rounded-2xl">
                <h4 className="font-manrope font-medium text-white mb-4">Quick Links</h4>
                <div className="grid grid-cols-2 gap-3">
                  <QuickLink href="/formulate" icon={MessageSquare} label="Try Dr. Bev" desc="AI formulation" />
                  <QuickLink href="/ingredients" icon={Building} label="Ingredient DB" desc="29+ ingredients" />
                  <QuickLink href="/shop" icon={Star} label="Shop Ambrosia" desc="Zero sugar drinks" />
                  <QuickLink href="/eco" icon={Globe} label="Sustainability" desc="Carbon negative" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map / Office Hours */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="font-heading text-xl font-bold mb-6">Office Hours</h3>
              <div className="space-y-4">
                {[
                  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM PST', available: true },
                  { day: 'Saturday', hours: '10:00 AM - 2:00 PM PST', available: true },
                  { day: 'Sunday', hours: 'Closed', available: false },
                ].map((day, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={clsx('w-2 h-2 rounded-full', day.available ? 'bg-green-400' : 'bg-red-400')} />
                      <span className="font-manrope font-medium">{day.day}</span>
                    </div>
                    <span className={clsx('font-manrope text-sm', day.available ? 'text-white/70' : 'text-white/40')}>{day.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-ambrosia-pink/10 border border-ambrosia-pink/20 rounded-xl">
                <p className="font-manrope text-sm text-ambrosia-pink">
                  <strong>Prefer a call?</strong> Book a 15-min discovery call with our formulation team.
                </p>
                <a href="https://calendly.com/ambrosia-example" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-ambrosia-pink text-ambrosia-dark font-bold rounded-full text-sm hover:scale-105 transition">
                  Schedule Call
                  <Send className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="font-heading text-xl font-bold mb-6">Find Us</h3>
              <div className="aspect-video bg-white/5 rounded-xl relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808e8f8f8f8f%3A0x8f8f8f8f8f8f8f8f!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1234567890"
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ambrosia HQ - San Francisco"
                />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="font-heading text-2xl font-bold text-ambrosia-pink">2</div>
                  <div className="font-manrope text-xs text-white/60">Offices</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="font-heading text-2xl font-bold text-ambrosia-teal">12</div>
                  <div className="font-manrope text-xs text-white/60">Team Members</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="font-heading text-2xl font-bold text-green-400">34</div>
                  <div className="font-manrope text-xs text-white/60">Countries Served</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ContactCard({ info }: { info: typeof contactInfo[0] }) {
  const Icon = info.icon;
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-ambrosia-pink/50 transition group">
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-ambrosia-pink/20 transition-transform">
        <Icon className="w-6 h-6 {info.color}" />
      </div>
      <h3 className="font-manrope font-medium text-white mb-2">{info.title}</h3>
      <ul className="space-y-1">
        {info.details.map((detail, i) => (
          <li key={i} className="font-manrope text-sm text-white/60">{detail}</li>
        ))}
      </ul>
    </div>
  );
}

function FormField({ field, value, error, onChange }: {
  field: typeof formFields[0];
  value: string;
  error?: string;
  onChange: (name: string, value: string) => void;
}) {
  const hasError = !!error;

  if (field.type === 'select') {
    return (
      <div>
        <label className="block font-manrope text-sm text-white/70 mb-1.5">{field.label} {field.required && <span className="text-ambrosia-pink">*</span>}</label>
        <select
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={clsx(
            'w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ambrosia-pink/20 appearance-none',
            hasError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-ambrosia-pink'
          )}
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block font-manrope text-sm text-white/70 mb-1.5">{field.label} {field.required && <span className="text-ambrosia-pink">*</span>}</label>
        <textarea
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          rows={field.rows || 4}
          className={clsx(
            'w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-ambrosia-pink/20 resize-y min-h-[100px]',
            hasError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-ambrosia-pink'
          )}
          placeholder={field.placeholder}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <label className="block font-manrope text-sm text-white/70 mb-1.5">{field.label} {field.required && <span className="text-ambrosia-pink">*</span>}</label>
      <input
        type={field.type}
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        className={clsx(
          'w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-ambrosia-pink/20',
          hasError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-ambrosia-pink'
        )}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="mb-6 p-5 bg-green-500/20 border border-green-500/30 rounded-xl animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-green-400">Message Sent!</h3>
          <p className="font-manrope text-sm text-white/70">Thanks for reaching out. We&apos;ll get back to you within 2 hours.</p>
        </div>
      </div>
      <button onClick={onReset} className="mt-4 text-sm text-ambrosia-pink font-manrope hover:underline">Send another message</button>
    </div>
  );
}

function ErrorMessage({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="mb-6 p-5 bg-red-500/20 border border-red-500/30 rounded-xl animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-500/30 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-red-400">Something Went Wrong</h3>
          <p className="font-manrope text-sm text-white/70">{error}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={onRetry} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl font-manrope text-sm hover:bg-red-500/30 transition">Try Again</button>
        <a href="mailto:hello@ambrosia.example" className="px-4 py-2 bg-white/5 text-white/70 rounded-xl font-manrope text-sm hover:bg-white/10 transition">Email Directly</a>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-ambrosia-pink/50 transition">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ambrosia-pink to-ambrosia-teal flex items-center justify-center font-heading font-bold text-white flex-shrink-0">
          {testimonial.avatar}
        </div>
        <div>
          <p className="font-manrope text-sm font-medium text-white">{testimonial.author}</p>
          <p className="font-manrope text-xs text-white/50">{testimonial.role}</p>
        </div>
      </div>
      <p className="text-white/80 text-sm leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
    </div>
  );
}

function QuickLink({ href, icon, label, desc }: { href: string; icon: React.ElementType; label: string; desc: string }) {
  const Icon = icon;
  return (
    <a href={href} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-ambrosia-pink/50 hover:bg-white/10 transition group">
      <div className="w-10 h-10 rounded-lg bg-ambrosia-pink/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-ambrosia-pink" />
      </div>
      <p className="font-manrope font-medium text-white text-sm">{label}</p>
      <p className="font-manrope text-xs text-white/50">{desc}</p>
    </a>
  );
}