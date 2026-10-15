import { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="section bg-gradient-to-b from-brand-50/50 via-brand-50/30 to-white">
      <div className="container-page">
        <SectionHeading
          center
          eyebrow="Help & support"
          title="We're here to help"
          subtitle="Questions? Our team replies within one business day."
        />

        <div className="mt-8 sm:mt-12 grid lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="reveal-stagger lg:col-span-5 space-y-3 sm:space-y-4">
            {[
              { icon: Phone, label: 'Call us', value: '+91 98765 43210', sub: 'Mon–Sat, 9am–7pm', href: 'tel:+919876543210' },
              { icon: Mail, label: 'Email', value: 'support@padasala.in', sub: 'We reply within 24 hours', href: 'mailto:support@padasala.in' },
              { icon: MapPin, label: 'Office', value: 'Coimbatore, Tamil Nadu, India', sub: 'Registered education platform' },
            ].map((c) => {
              const Icon = c.icon;
              const Tag = c.href ? 'a' : 'div';
              return (
                <Tag key={c.label} href={c.href} className="card p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">{c.label}</div>
                    <div className="font-display font-bold text-ink-900">{c.value}</div>
                    <div className="text-sm text-ink-500">{c.sub}</div>
                  </div>
                </Tag>
              );
            })}

            <div className="card p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display font-bold text-ink-900">Grievance officer</div>
                  <div className="text-sm text-ink-500">grievance@padasala.in</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 reveal">
            <div className="glass rounded-[1.75rem] sm:rounded-[2rem] p-5 sm:p-8">
              {sent ? (
                <div className="text-center py-14">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-ink-900">Message sent!</h3>
                  <p className="mt-2 text-ink-500 max-w-sm mx-auto">
                    Thanks for reaching out. Our support team will get back to you shortly.
                  </p>
                  <button onClick={() => setSent(false)} className="btn-outline mt-6">Send another</button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="cname">Name</label>
                    <input id="cname" required className="input" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="label" htmlFor="cphone">Phone</label>
                    <input id="cphone" className="input" placeholder="Optional" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="cemail">Email</label>
                    <input id="cemail" type="email" required className="input" placeholder="you@example.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="ctopic">Topic</label>
                    <select id="ctopic" className="input" defaultValue="admission">
                      <option value="admission">Admission enquiry</option>
                      <option value="listing">School / tuition listing</option>
                      <option value="jobs">Teacher jobs</option>
                      <option value="events">Events</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="cmsg">Message</label>
                    <textarea id="cmsg" required rows={4} className="input resize-none" placeholder="How can we help?" />
                  </div>
                  <button type="submit" className="btn-primary sm:col-span-2">
                    <Send className="h-4 w-4" /> Send message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
