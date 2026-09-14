import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertTriangle, Camera, CheckCircle, ChevronRight, ChevronLeft, Zap, Info } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import './Report.css';

const STEPS = [
  { id: 1, label: 'Location',   icon: MapPin },
  { id: 2, label: 'Category',   icon: Zap },
  { id: 3, label: 'Details',    icon: Info },
  { id: 4, label: 'Evidence',   icon: Camera },
  { id: 5, label: 'Review',     icon: CheckCircle },
];

const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical', desc: 'Life-threatening, immediate danger', color: '#FF6B6B' },
  { value: 'high',     label: 'High',     desc: 'Completely blocks access',          color: '#FFB84C' },
  { value: 'medium',   label: 'Medium',   desc: 'Significantly limits access',       color: '#6C63FF' },
  { value: 'low',      label: 'Low',      desc: 'Minor inconvenience',               color: '#00D4AA' },
];

function generateId() {
  return `CA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000 + 1000))}`;
}

export default function Report() {
  const navigate = useNavigate();
  const { addReport, showToast } = useApp();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const [form, setForm] = useState({
    address: '',
    lat: 12.9716,
    lng: 77.5946,
    category: '',
    severity: '',
    title: '',
    description: '',
    images: [],
    imagePreview: null,
  });

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const canNext = () => {
    if (step === 1) return form.address.trim().length > 0;
    if (step === 2) return form.category !== '';
    if (step === 3) return form.title.trim().length > 0 && form.severity !== '' && form.description.trim().length > 20;
    return true;
  };

  const handleSubmit = () => {
    const id = generateId();
    setReportId(id);
    const newReport = {
      id,
      title: form.title,
      category: form.category,
      location: { address: form.address, lat: form.lat, lng: form.lng },
      status: 'reported',
      severity: form.severity,
      description: form.description,
      reportedBy: 'Suresh B.',
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      comments: 0,
      images: [],
      assignedTo: null,
    };
    addReport(newReport);
    setSubmitted(true);
    showToast(`Report ${id} submitted successfully!`, 'success');
  };

  if (submitted) {
    return (
      <div className="report-page animate-pageEnter">
        <div className="container" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-12))', paddingBottom: 'var(--space-16)', textAlign: 'center' }}>
          <div className="report-success">
            <div className="report-success__icon">
              <CheckCircle size={48} />
            </div>
            <h1>Report Submitted!</h1>
            <p className="report-success__id">Report ID: <strong>{reportId}</strong></p>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto var(--space-8)' }}>
              Your report has been submitted successfully. Our team will review it within 24–48 hours.
              You can track its progress in the Issue Tracker.
            </p>
            <div className="report-success__actions">
              <button className="report-btn report-btn--primary" onClick={() => navigate('/tracker')}>
                Track My Report
              </button>
              <button className="report-btn report-btn--secondary" onClick={() => { setSubmitted(false); setStep(1); setForm({ address:'', lat:12.97, lng:77.59, category:'', severity:'', title:'', description:'', images:[], imagePreview: null }); }}>
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page animate-pageEnter">
      <div className="report-page__bg" aria-hidden="true">
        <div className="report-page__orb" />
      </div>

      <div className="container" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-10))' }}>
        {/* Header */}
        <div className="report-header text-center">
          <div className="section-label" style={{ margin: '0 auto var(--space-4)' }}>
            <AlertTriangle size={13} />
            Report an Issue
          </div>
          <h1>Report Inaccessible <span className="gradient-text-primary">Infrastructure</span></h1>
          <p style={{ maxWidth: 500, margin: 'var(--space-4) auto 0', color: 'var(--text-secondary)' }}>
            Complete the form below to submit a report. Every detail helps authorities respond faster.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator" role="navigation" aria-label="Form steps">
          {STEPS.map((s, i) => {
            const isDone = step > s.id;
            const isActive = step === s.id;
            return (
              <React.Fragment key={s.id}>
                <div className={`step-indicator__item ${isActive ? 'step-indicator__item--active' : ''} ${isDone ? 'step-indicator__item--done' : ''}`}>
                  <div className="step-indicator__circle">
                    {isDone ? <CheckCircle size={16} /> : <s.icon size={16} />}
                  </div>
                  <span className="step-indicator__label">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`step-indicator__line ${isDone ? 'step-indicator__line--done' : ''}`} aria-hidden="true" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="report-form-card glass-card glow-border">

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="report-step animate-fadeInUp">
              <h2 className="report-step__title"><MapPin size={22} /> Where is the issue?</h2>
              <p className="report-step__subtitle">Enter the address or location of the inaccessible infrastructure.</p>
              <div className="report-field">
                <label htmlFor="address-input">Street address or landmark *</label>
                <input
                  id="address-input"
                  type="text"
                  className="report-input"
                  placeholder="e.g. MG Road Metro Station, Exit 3, Bangalore"
                  value={form.address}
                  onChange={e => update('address', e.target.value)}
                  autoFocus
                />
              </div>
              <div className="report-map-placeholder">
                <div className="report-map-placeholder__inner">
                  <MapPin size={32} style={{ color: 'var(--primary)' }} />
                  <p>Interactive map coming soon</p>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Using address field for now</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Category */}
          {step === 2 && (
            <div className="report-step animate-fadeInUp">
              <h2 className="report-step__title"><Zap size={22} /> What type of issue?</h2>
              <p className="report-step__subtitle">Select the category that best describes the accessibility problem.</p>
              <div className="report-category-grid">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    id={`cat-${cat.id}`}
                    className={`report-category-btn ${form.category === cat.id ? 'report-category-btn--selected' : ''}`}
                    style={{ '--cat-color': cat.color }}
                    onClick={() => update('category', cat.id)}
                    aria-pressed={form.category === cat.id}
                  >
                    <span className="report-category-btn__icon">{cat.icon}</span>
                    <span className="report-category-btn__label">{cat.label}</span>
                    {form.category === cat.id && <CheckCircle size={14} className="report-category-btn__check" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="report-step animate-fadeInUp">
              <h2 className="report-step__title"><Info size={22} /> Tell us more</h2>
              <p className="report-step__subtitle">Provide details and select the severity level.</p>

              <div className="report-field">
                <label htmlFor="title-input">Issue title *</label>
                <input
                  id="title-input"
                  type="text"
                  className="report-input"
                  placeholder="Short summary of the issue"
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                  autoFocus
                />
              </div>

              <div className="report-field">
                <label>Severity level *</label>
                <div className="report-severity-grid">
                  {SEVERITY_OPTIONS.map(sv => (
                    <button
                      key={sv.value}
                      id={`severity-${sv.value}`}
                      className={`report-severity-btn ${form.severity === sv.value ? 'report-severity-btn--selected' : ''}`}
                      style={{ '--sev-color': sv.color }}
                      onClick={() => update('severity', sv.value)}
                      aria-pressed={form.severity === sv.value}
                    >
                      <span className="report-severity-dot" style={{ background: sv.color }} />
                      <div>
                        <span className="report-severity-label">{sv.label}</span>
                        <span className="report-severity-desc">{sv.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="report-field">
                <label htmlFor="description-input">Description *</label>
                <textarea
                  id="description-input"
                  className="report-input report-textarea"
                  rows={5}
                  placeholder="Describe the issue in detail. How does it affect access? How long has it been like this?"
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                />
                <span className="report-char-count">{form.description.length} / 1000</span>
              </div>
            </div>
          )}

          {/* Step 4: Evidence */}
          {step === 4 && (
            <div className="report-step animate-fadeInUp">
              <h2 className="report-step__title"><Camera size={22} /> Add photos (optional)</h2>
              <p className="report-step__subtitle">Visual evidence significantly increases resolution speed.</p>
              <div className="report-upload-zone">
                <Camera size={40} style={{ color: 'var(--primary)', marginBottom: 'var(--space-4)' }} />
                <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>Upload Photos</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)' }}>
                  Drag & drop or click to browse. Max 5MB per image.
                </p>
                <label htmlFor="file-upload" className="report-btn report-btn--secondary" style={{ cursor: 'pointer' }}>
                  Choose Files
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => update('imagePreview', ev.target.result);
                      reader.readAsDataURL(file);
                      update('images', [file.name]);
                    }
                  }}
                />
              </div>
              {form.imagePreview && (
                <div className="report-image-preview">
                  <img src={form.imagePreview} alt="Uploaded evidence" style={{ maxHeight: 200, borderRadius: 'var(--radius-lg)', objectFit: 'cover' }} />
                  <span style={{ color: 'var(--accent)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                    <CheckCircle size={14} style={{ display: 'inline', marginRight: 4 }} />
                    Image uploaded
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="report-step animate-fadeInUp">
              <h2 className="report-step__title"><CheckCircle size={22} /> Review & Submit</h2>
              <p className="report-step__subtitle">Please review your report before submitting.</p>
              <div className="report-review">
                <div className="report-review__row">
                  <span className="report-review__label">Location</span>
                  <span className="report-review__value">{form.address}</span>
                </div>
                <div className="report-review__row">
                  <span className="report-review__label">Category</span>
                  <span className="report-review__value">
                    {CATEGORIES.find(c => c.id === form.category)?.icon}{' '}
                    {CATEGORIES.find(c => c.id === form.category)?.label}
                  </span>
                </div>
                <div className="report-review__row">
                  <span className="report-review__label">Title</span>
                  <span className="report-review__value">{form.title}</span>
                </div>
                <div className="report-review__row">
                  <span className="report-review__label">Severity</span>
                  <span className="report-review__value" style={{ textTransform: 'capitalize' }}>{form.severity}</span>
                </div>
                <div className="report-review__row">
                  <span className="report-review__label">Description</span>
                  <span className="report-review__value">{form.description}</span>
                </div>
                <div className="report-review__row">
                  <span className="report-review__label">Photos</span>
                  <span className="report-review__value">{form.images.length > 0 ? form.images.join(', ') : 'None attached'}</span>
                </div>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>
                By submitting, you confirm this information is accurate to the best of your knowledge.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="report-nav">
            <button
              className="report-btn report-btn--secondary"
              onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)}
              id="report-back-btn"
            >
              <ChevronLeft size={16} />
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            {step < 5 ? (
              <button
                className="report-btn report-btn--primary"
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                id="report-next-btn"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className="report-btn report-btn--success"
                onClick={handleSubmit}
                id="report-submit-btn"
              >
                <CheckCircle size={16} />
                Submit Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
