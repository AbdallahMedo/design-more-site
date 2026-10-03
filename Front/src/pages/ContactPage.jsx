import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, Clock, MapPin, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { contactInfo } from '../config/contactInfo';
import { useLanguage } from '../context/LanguageContext';
import { contactApi } from '../api/contactApi';

export const ContactPage = () => {
  const { language, str } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSent(false);
    setError('');

    const payload = {
      fullName: name.trim(),
      email: email.trim(),
      phoneNumber: phone.replace(/\s+/g, ''),
      subject: subject.trim(),
      message: message.trim(),
    };
    if (Object.values(payload).some((value) => !value)) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول.' : 'Please complete all fields.');
      return;
    }
    if (!/^01[0125][0-9]{8}$/.test(payload.phoneNumber)) {
      setError(language === 'ar' ? 'يرجى إدخال رقم موبايل مصري صحيح من 11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015.' : 'Enter a valid 11-digit Egyptian mobile number starting with 010, 011, 012, or 015.');
      return;
    }

    setSubmitting(true);
    try {
      await contactApi.sendMessage(payload);
      setSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      setError(typeof serverMessage === 'string' && serverMessage.trim()
        ? serverMessage
        : language === 'ar' ? 'تعذر تأكيد إرسال الرسالة. يرجى المحاولة لاحقاً.' : 'Could not confirm your message was sent. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--surface-base)', padding: '4rem 0 6rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '720px', margin: '0 auto 3.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--brand-bronze-dark)', fontWeight: 600 }}>
            Client Concierge & Inquiries
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3rem)', color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '1rem', fontWeight: 400 }}>
            {str('contact')}
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Connect with our architectural directors, schedule a private showroom consultation, or coordinate bespoke project logistics.
          </p>
        </div>

        {/* 2 Columns: Contact Form & Direct Information */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3.5rem' }}>
          {/* Left Column: Inquiry Form (7 cols) */}
          <div style={{ gridColumn: 'span 7' }} className="col-12-tablet">
            <div 
              style={{ 
                backgroundColor: 'var(--surface-raised)', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--border-subtle)',
                padding: 'clamp(2rem, 4vw, 3rem)',
                boxShadow: 'var(--shadow-level-1)'
              }}
            >
              <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {str('sendMessage')}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '2rem' }}>
                We respond to architectural inquiries within 24 hours.
              </p>

              {sent && (
                <div role="status"
                  style={{ 
                    backgroundColor: 'rgba(45, 106, 79, 0.1)', 
                    color: 'var(--color-success)', 
                    padding: '14px', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <CheckCircle2 size={20} />
                  <span>{str('sendSuccess')}</span>
                </div>
              )}

              {error && (
                <div role="alert" style={{ color: 'var(--color-error)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} aria-busy={submitting}>
                <fieldset disabled={submitting} style={{ border: 0, padding: 0, margin: 0, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    {str('fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Eng. Nour El-Din"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nour@example.com"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      {str('phoneNumber')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01001234567"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    {str('subject')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Residential Villa Consultation / Catalog Request"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    {str('message')} *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project requirements, space layout, or materials..."
                  />
                </div>

                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '0.9rem', fontSize: '0.95rem' }}>
                  {submitting ? (language === 'ar' ? 'جارٍ الإرسال...' : 'Sending...') : str('sendMessage')}
                </button>
                </fieldset>
              </form>
            </div>
          </div>

          {/* Right Column: Direct Cards & Showroom Hours (5 cols) */}
          <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="col-12-tablet">
            {/* WhatsApp Quick Concierge */}
            <div 
              style={{ 
                backgroundColor: 'var(--surface-raised)', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--border-subtle)',
                padding: '2rem',
                boxShadow: 'var(--shadow-level-1)'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={18} color="var(--color-success)" />
                <span>{str('whatsAppConcierge')}</span>
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Instant coordination for material finishes, CAD submissions, and logistics updates.
              </p>
              <a
                href={contactInfo.communication.whatsApp.directLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', gap: '0.5rem', backgroundColor: '#25D366', borderColor: '#25D366' }}
              >
                <MessageSquare size={16} />
                <span>Open WhatsApp Chat ({contactInfo.communication.whatsApp.displayNumber})</span>
              </a>
            </div>

            {/* Direct Lines & Hotline */}
            <div 
              style={{ 
                backgroundColor: 'var(--surface-raised)', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--border-subtle)',
                padding: '2rem',
                boxShadow: 'var(--shadow-level-1)'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Direct Communication
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Phone size={16} color="var(--brand-bronze)" />
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block' }}>Primary Sales</span>
                    <a href={`tel:${contactInfo.communication.primaryPhone}`} style={{ fontWeight: 600 }}>{contactInfo.communication.primaryPhone}</a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Phone size={16} color="var(--brand-bronze)" />
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block' }}>Hotline</span>
                    <a href={`tel:${contactInfo.communication.hotline}`} style={{ fontWeight: 600 }}>{contactInfo.communication.hotline}</a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Mail size={16} color="var(--brand-bronze)" />
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block' }}>General Inquiries</span>
                    <a href={`mailto:${contactInfo.communication.emails.info}`} style={{ fontWeight: 600 }}>{contactInfo.communication.emails.info}</a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Mail size={16} color="var(--brand-bronze)" />
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block' }}>Bespoke CAD Specifications</span>
                    <a href={`mailto:${contactInfo.communication.emails.customOrders}`} style={{ fontWeight: 600 }}>{contactInfo.communication.emails.customOrders}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
