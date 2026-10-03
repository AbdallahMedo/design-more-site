import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, FileText, X, AlertCircle, Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import { customOrdersApi } from '../api/customOrdersApi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const CustomOrderPage = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { language, isRTL, str } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [whatsAppNumber, setWhatsAppNumber] = useState(user?.whatsAppNumber || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      setError(language === 'ar' ? 'حجم الملف يجب ألا يتجاوز 5 ميجابايت.' : 'File size cannot exceed 5 MB.');
      return;
    }

    setFile(selected);
    setError('');

    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Phone validation
    const egRegex = /^01[0125][0-9]{8}$/;
    if (!egRegex.test(whatsAppNumber.replace(/\s+/g, ''))) {
      setError(language === 'ar' ? 'يرجى إدخال رقم هاتف مصري صحيح (11 رقم يبدأ بـ 01).' : 'Please enter a valid 11-digit Egyptian phone number starting with 01.');
      return;
    }

    if (!isAuthenticated) {
      setError(language === 'ar' ? 'يرجى تسجيل الدخول أو إنشاء حساب لربط طلبك بحسابك.' : 'Please sign in or create an account to link your custom order.');
      openAuthModal('login');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('Name', name);
      formData.append('name', name);
      formData.append('Email', email);
      formData.append('email', email);
      formData.append('WhatsAppNumber', whatsAppNumber);
      formData.append('whatsAppNumber', whatsAppNumber);
      const fullDescription = [title.trim(), description.trim()].filter(Boolean).join('\n\n');
      formData.append('Description', fullDescription);
      formData.append('description', fullDescription);
      formData.append('Notes', notes || '');
      formData.append('notes', notes || '');
      if (file) {
        formData.append('image', file);
      }

      const result = await customOrdersApi.submitCustomOrder(formData);
      setSubmittedOrder(result);
    } catch (err) {
      if (err.response?.status === 401) {
        setError(language === 'ar' ? 'جلسة الدخول منتهية. يرجى تسجيل الدخول مجدداً.' : 'Your session expired. Please sign in again.');
        openAuthModal('login');
      } else {
        setError(err.response?.data?.message || 'Failed to submit enquiry. Please check your data.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedOrder) {
    return (
      <div style={{ backgroundColor: 'var(--surface-base)', padding: '5rem 0 8rem', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div 
            style={{ 
              backgroundColor: 'var(--surface-raised)', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border-subtle)',
              padding: 'clamp(2rem, 5vw, 4rem)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-level-2)'
            }}
          >
            <div 
              style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: 'var(--radius-full)', 
                backgroundColor: 'rgba(45, 106, 79, 0.1)', 
                color: 'var(--color-success)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              {str('customSubmitted')}
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {str('customSubmittedMsg')}
            </p>

            <div 
              style={{ 
                backgroundColor: 'var(--surface-subtle)', 
                padding: '1.25rem', 
                borderRadius: 'var(--radius-sm)',
                marginBottom: '2rem',
                fontSize: '0.85rem'
              }}
            >
              <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: '4px' }}>
                Enquiry Tracking Reference
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-bronze-dark)' }}>
                {submittedOrder.id}
              </span>
            </div>

            <button 
              onClick={() => { setSubmittedOrder(null); setTitle(''); setDescription(''); handleRemoveFile(); }}
              className="btn btn-primary"
            >
              Submit Another Commission
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--surface-base)', padding: '3.5rem 0 6rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <Compass size={18} color="var(--brand-bronze)" />
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--brand-bronze-dark)', fontWeight: 600 }}>
              {language === 'ar' ? 'تصنيع حسب الطلب وقص بالليزر وأكثر' : 'Custom Order & Laser Fabrication & More'}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            {str('customStudioTitle')}
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '680px', margin: '0 auto' }}>
            {str('customStudioSubtitle')}
          </p>
        </div>

        {error && (
          <div 
            style={{ 
              backgroundColor: 'rgba(158, 58, 43, 0.08)', 
              color: 'var(--color-error)', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.88rem',
              marginBottom: '2rem',
              border: '1px solid rgba(158, 58, 43, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Custom Order Form */}
        <form 
          onSubmit={handleSubmit}
          style={{ 
            backgroundColor: 'var(--surface-raised)', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border-subtle)',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            boxShadow: 'var(--shadow-level-1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem'
          }}
        >
          {/* Client Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                {str('fullName')} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eng. Yasmine Mansour"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yasmine.arch@studio.eg"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                {str('whatsAppNumber')} *
              </label>
              <input
                type="tel"
                required
                value={whatsAppNumber}
                onChange={(e) => setWhatsAppNumber(e.target.value)}
                placeholder="01229876543"
              />
            </div>
          </div>

          {/* Project Title */}
          <div>
            <label htmlFor="custom-order-title" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              {language === 'ar' ? 'عنوان المشروع' : 'Project Title'} *
            </label>
            <input
              id="custom-order-title"
              type="text"
              required
              pattern=".*\S.*"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: فاصل غرفة بقص ليزر' : 'e.g. Laser-cut room divider'}
            />
          </div>
          {/* Specifications Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              {str('specificationsDesc')} *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: قاطع جداري مفرغ بالليزر بنقشة هندسية مقاس 200سم × 120سم، دهان إلكتروستاتيك أسود مطفي مع تثبيت مخفي لفيلا سكنية.' : 'e.g. Laser-cut sheet metal wall art / room divider with geometric pattern. Dimensions: 200cm x 120cm. Matte black electrostatic finish with hidden wall fixings.'}
            />
          </div>

          {/* Drag & Drop File Upload */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              {str('uploadDrawings')}
            </label>

            {!file ? (
              <label 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  border: '2px dashed var(--border-strong)', 
                  borderRadius: 'var(--radius-sm)',
                  padding: '2.5rem 1.5rem',
                  cursor: 'pointer',
                  backgroundColor: 'var(--surface-subtle)',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                <UploadCloud size={32} color="var(--brand-bronze)" style={{ marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Click to browse or drop drawing file here
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  Supported: JPEG, PNG, WebP (Max 5 MB)
                </span>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp" 
                  onChange={handleFileChange}
                  style={{ display: 'none' }} 
                />
              </label>
            ) : (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: 'var(--surface-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {filePreview ? (
                    <img src={filePreview} alt="Preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  ) : (
                    <FileText size={24} color="var(--brand-bronze)" />
                  )}
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{file.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={handleRemoveFile} 
                  style={{ color: 'var(--text-tertiary)', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Project Timeline & Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Project Notes & Target Delivery Deadline
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Project in Zamalek renovation. Need fabrication within 4 weeks."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', gap: '0.6rem', marginTop: '0.5rem' }}
          >
            <span>{submitting ? 'Transmitting Architectural Spec...' : str('submitCustomOrder')}</span>
            {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomOrderPage;
