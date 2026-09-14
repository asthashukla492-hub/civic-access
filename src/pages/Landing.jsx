import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Shield, TrendingUp, Users, CheckCircle, AlertTriangle, Zap, ChevronRight, Star, Globe } from 'lucide-react';
import { IMPACT_STATS, MOCK_REPORTS, CATEGORIES } from '../data/mockData';
import { StatusPill, SeverityPill } from '../components/common/StatusPill';
import './Landing.css';

// Animated counter hook
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({ value, label, suffix = '', icon: Icon, color, delay }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  const count = useCounter(value, 2200, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stat-card glass-card animate-fadeInUp" style={{ animationDelay: `${delay}s` }} ref={ref}>
      <div className="stat-card__icon" style={{ background: `${color}20`, color }}>
        <Icon size={22} />
      </div>
      <div className="stat-card__number" style={{ color }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

const TESTIMONIALS = [
  {
    quote: "CivicAccess helped me finally get the broken elevator at my local metro station fixed after 8 months of frustration. Within 3 weeks of reporting it here, the repair was underway.",
    name: "Priya Sharma", role: "Wheelchair user, Bangalore", initials: "PS"
  },
  {
    quote: "As a blind person, the missing tactile strips near my office made my commute dangerous. CivicAccess brought the issue to the right authorities. It's now resolved.",
    name: "Rajan Mehta", role: "Accessibility Advocate, Mumbai", initials: "RM"
  },
  {
    quote: "This platform gave our disability rights NGO a powerful tool to document and escalate systemic infrastructure failures. The analytics are incredibly useful for advocacy.",
    name: "Anita Rao", role: "NGO Director, Delhi", initials: "AR"
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Report an Issue",
    desc: "Pin the location on our map, select the category (ramp, elevator, audio signal, etc.), add photos and a description.",
    icon: MapPin, color: "#FF6B6B"
  },
  {
    step: "02",
    title: "Community Amplifies",
    desc: "Others upvote your report, adding social proof and urgency. The more support, the faster the response from authorities.",
    icon: Users, color: "#6C63FF"
  },
  {
    step: "03",
    title: "Track Resolution",
    desc: "Follow real-time status updates as your report moves from Filed → Under Review → In Progress → Resolved.",
    icon: TrendingUp, color: "#00D4AA"
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  const featuredReports = MOCK_REPORTS.slice(0, 3);

  return (
    <div className="landing">
      {/* ─── HERO ─── */}
      <section className="hero" aria-label="Hero section">
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
          <div className="hero__grid" />
        </div>

        <div className="container">
          <div className={`hero__content ${heroVisible ? 'hero__content--visible' : ''}`}>
            <div className="section-label animate-fadeInDown">
              <Zap size={13} />
              Disability Infrastructure Platform
            </div>

            <h1 className="hero__title animate-fadeInUp delay-100">
              Making Public Spaces<br />
              <span className="gradient-text">Accessible for Everyone</span>
            </h1>

            <p className="hero__subtitle animate-fadeInUp delay-200">
              Report inaccessible infrastructure. Track resolution progress.
              Hold governments accountable. Join{' '}
              <strong style={{ color: 'var(--accent)' }}>8,300+ advocates</strong>{' '}
              building a more inclusive world.
            </p>

            <div className="hero__actions animate-fadeInUp delay-300">
              <button className="hero__btn hero__btn--primary" onClick={() => navigate('/report')} id="hero-report-btn">
                <AlertTriangle size={18} />
                Report an Issue
                <ArrowRight size={16} />
              </button>
              <button className="hero__btn hero__btn--secondary" onClick={() => navigate('/tracker')} id="hero-tracker-btn">
                <MapPin size={18} />
                View Issue Map
              </button>
            </div>

            <div className="hero__trust animate-fadeInUp delay-400">
              <div className="hero__trust-item">
                <CheckCircle size={14} style={{ color: 'var(--accent)' }} />
                <span>WCAG 2.1 AA Compliant</span>
              </div>
              <div className="hero__trust-item">
                <Shield size={14} style={{ color: 'var(--primary-light)' }} />
                <span>Government Verified</span>
              </div>
              <div className="hero__trust-item">
                <Globe size={14} style={{ color: 'var(--warning)' }} />
                <span>142 Cities</span>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hero__visual animate-scaleIn delay-300">
            <div className="hero__card-stack">
              {featuredReports.map((r, i) => (
                <div key={r.id} className="hero__report-card glass-card" style={{ '--i': i }}>
                  <div className="hero__report-card-top">
                    <span className="hero__report-id">{r.id}</span>
                    <StatusPill status={r.status} />
                  </div>
                  <p className="hero__report-title">{r.title}</p>
                  <div className="hero__report-meta">
                    <MapPin size={11} />
                    <span>{r.location.address.split(',')[0]}</span>
                  </div>
                  <div className="hero__report-bottom">
                    <SeverityPill severity={r.severity} />
                    <span className="hero__report-upvotes">▲ {r.upvotes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="section landing-stats" aria-label="Impact statistics">
        <div className="container">
          <div className="landing-stats__grid">
            <StatCard value={IMPACT_STATS.totalReports} label="Issues Reported"    suffix=""    icon={AlertTriangle} color="#FF6B6B" delay={0}   />
            <StatCard value={IMPACT_STATS.resolved}     label="Issues Resolved"    suffix=""    icon={CheckCircle}   color="#00D4AA" delay={0.1} />
            <StatCard value={IMPACT_STATS.citiesCovered} label="Cities Covered"   suffix="+"   icon={Globe}         color="#6C63FF" delay={0.2} />
            <StatCard value={IMPACT_STATS.volunteers}   label="Active Advocates"  suffix="+"   icon={Users}         color="#FFB84C" delay={0.3} />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="section how-it-works" aria-label="How it works">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
            <div className="section-label" style={{ margin: '0 auto var(--space-4)' }}>
              <TrendingUp size={13} />
              Simple Process
            </div>
            <h2>How <span className="gradient-text-primary">CivicAccess</span> Works</h2>
            <p style={{ maxWidth: 560, margin: '16px auto 0' }}>
              From a single report to government action — our platform streamlines the entire
              accessibility issue resolution lifecycle.
            </p>
          </div>

          <div className="how-it-works__steps">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="how-it-works__step glass-card animate-fadeInUp" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="how-it-works__step-num" style={{ color: step.color }}>{step.step}</div>
                <div className="how-it-works__icon" style={{ background: `${step.color}15`, color: step.color }}>
                  <step.icon size={24} />
                </div>
                <h3 className="how-it-works__title">{step.title}</h3>
                <p className="how-it-works__desc">{step.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="how-it-works__arrow" aria-hidden="true">
                    <ChevronRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="section landing-categories" aria-label="Issue categories">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-10)' }}>
            <div className="section-label" style={{ margin: '0 auto var(--space-4)' }}>
              <Shield size={13} />
              Coverage Areas
            </div>
            <h2>What We <span className="gradient-text-accent">Track & Fix</span></h2>
          </div>
          <div className="landing-categories__grid">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.id}
                className="category-chip glass-card animate-fadeInUp"
                style={{ animationDelay: `${i * 0.07}s`, '--cat-color': cat.color }}
                onClick={() => navigate('/tracker')}
              >
                <span className="category-chip__icon">{cat.icon}</span>
                <span className="category-chip__label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED REPORTS ─── */}
      <section className="section featured-reports" aria-label="Featured reports">
        <div className="container">
          <div className="featured-reports__header">
            <div>
              <div className="section-label"><MapPin size={13} />Live Reports</div>
              <h2>Recent <span className="gradient-text-primary">Issues</span></h2>
            </div>
            <button className="featured-reports__view-all" onClick={() => navigate('/tracker')}>
              View All Reports <ArrowRight size={16} />
            </button>
          </div>
          <div className="featured-reports__grid">
            {MOCK_REPORTS.slice(0, 6).map((report, i) => (
              <div key={report.id} className="report-card glass-card animate-fadeInUp" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="report-card__top">
                  <span className="report-card__id">{report.id}</span>
                  <SeverityPill severity={report.severity} />
                </div>
                <h3 className="report-card__title">{report.title}</h3>
                <div className="report-card__location">
                  <MapPin size={12} />
                  <span>{report.location.address.split(',').slice(0, 2).join(',')}</span>
                </div>
                <p className="report-card__desc">{report.description.slice(0, 100)}…</p>
                <div className="report-card__footer">
                  <StatusPill status={report.status} />
                  <div className="report-card__meta">
                    <span>▲ {report.upvotes}</span>
                    <span>💬 {report.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="section testimonials" aria-label="Testimonials">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
            <div className="section-label" style={{ margin: '0 auto var(--space-4)' }}>
              <Star size={13} />
              Real Impact
            </div>
            <h2>Stories of <span className="gradient-text">Change</span></h2>
          </div>
          <div className="testimonials__grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card glass-card glow-border animate-fadeInUp" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="testimonial-card__quote">"</div>
                <p className="testimonial-card__text">{t.quote}</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">{t.initials}</div>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="section cta-banner" aria-label="Call to action">
        <div className="container">
          <div className="cta-banner__card glow-border">
            <div className="cta-banner__glow" aria-hidden="true" />
            <div className="section-label" style={{ margin: '0 auto var(--space-5)' }}>
              <Zap size={13} />
              Take Action Now
            </div>
            <h2 className="cta-banner__title">
              See an Accessibility Issue?<br />
              <span className="gradient-text">Report It in 2 Minutes.</span>
            </h2>
            <p className="cta-banner__subtitle">
              Every report counts. Your voice can drive real infrastructure change
              for millions of people with disabilities across India.
            </p>
            <button className="cta-banner__btn" onClick={() => navigate('/report')} id="cta-report-btn">
              <AlertTriangle size={18} />
              Start Reporting
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
