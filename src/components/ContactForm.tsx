import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';

export const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <div className="rounded-3xl bg-ivory p-8 ring-1 ring-line sm:p-10 md:p-14">
      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12 text-center"
          role="status"
        >
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center border border-gold-deep text-gold-deep">
            <Check size={28} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h3 className="text-3xl text-navy">Message sent</h3>
          <p className="mx-auto mt-4 max-w-sm text-muted">Thank you for reaching out. Our team will contact you shortly.</p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="link-arrow mt-10"
          >
            <span>Send another message</span>
          </button>
        </motion.div>
      ) : (
        <>
          <p className="eyebrow mb-5">Enquiry</p>
          <h3 className="text-3xl text-navy md:text-4xl">Send us a message</h3>
          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <label htmlFor="cf-name" className="field-label">Full Name</label>
                <input id="cf-name" name="name" required type="text" autoComplete="name" placeholder="John Doe" className="field" />
              </div>
              <div>
                <label htmlFor="cf-email" className="field-label">Email Address</label>
                <input id="cf-email" name="email" required type="email" autoComplete="email" placeholder="john@example.com" className="field" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <label htmlFor="cf-phone" className="field-label">Phone Number</label>
                <input id="cf-phone" name="phone" required type="tel" autoComplete="tel" placeholder="+91 98765 43210" className="field" />
              </div>
              <div>
                <label htmlFor="cf-interest" className="field-label">Interested In</label>
                <select id="cf-interest" name="interest" className="field cursor-pointer">
                  <option>Residential Project</option>
                  <option>Commercial Space</option>
                  <option>Investment Opportunity</option>
                  <option>Others</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="cf-message" className="field-label">Your Message</label>
              <textarea
                id="cf-message"
                name="message"
                required
                rows={4}
                placeholder="Tell us about your requirements..."
                className="field resize-none"
              ></textarea>
            </div>

            <button
              disabled={status === 'sending'}
              type="submit"
              className="btn btn-navy group w-full sm:w-auto"
            >
              {status === 'sending' ? 'Sending…' : (
                <>
                  Send Message
                  <ArrowRight size={16} className="text-gold transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
};
