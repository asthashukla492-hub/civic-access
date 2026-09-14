import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Award, Star, TrendingUp, Plus, Calendar, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusPill, SeverityPill } from '../components/common/StatusPill';
import './Profile.css';

const BADGE_COLORS = {
  'Top Contributor': '#FFB84C',
  'Pioneer':         '#6C63FF',
  'Verified':        '#00D4AA',
  '100 Reports':     '#FF6B6B',
  '50 Reports':      '#4ECDC4',
  'Advocate':        '#A78BFA',
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Profile() {
  const { user, reports } = useApp();
  const navigate = useNavigate();

  const myReports = reports.filter(r => r.reportedBy === 'Suresh B.' || r.reportedBy.includes('Suresh'));
  const resolvedCount = myReports.filter(r => r.status === 'resolved').length;
  const totalUpvotes = myReports.reduce((sum, r) => sum + r.upvotes, 0);
  const resolveRate = myReports.length > 0 ? Math.round((resolvedCount / myReports.length) * 100) : 0;

  return (
    <div className="profile-page animate-pageEnter">
      <div className="profile-bg" aria-hidden="true">
        <div className="profile-hero-bg" />
      </div>

      <div className="container" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-10))', paddingBottom: 'var(--space-16)', position: 'relative', zIndex: 1 }}>

        {/* Profile Hero */}
        <div className="profile-hero glass-card glow-border">
          <div className="profile-hero__bg" />
          <div className="profile-hero__content">
            <div className="profile-hero__avatar">
              {user.avatar}
              <div className="profile-hero__avatar-ring" aria-hidden="true" />
            </div>
            <div className="profile-hero__info">
              <h1 className="profile-hero__name">{user.name}</h1>
              <div className="profile-hero__city">
                <MapPin size={14} />
                <span>{user.city}</span>
              </div>
              <div className="profile-hero__badges">
                {user.badges.map(b => (
                  <span
                    key={b}
                    className="profile-badge"
                    style={{ '--badge-color': BADGE_COLORS[b] || 'var(--primary)' }}
                  >
                    <Award size={11} />
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div className="profile-hero__quick-stats">
              <div className="profile-quick-stat">
                <span className="profile-quick-stat__value gradient-text-primary">{user.reports}</span>
                <span className="profile-quick-stat__label">Reports Filed</span>
              </div>
              <div className="profile-quick-stat">
                <span className="profile-quick-stat__value gradient-text-accent">{resolvedCount}</span>
                <span className="profile-quick-stat__label">Resolved</span>
              </div>
              <div className="profile-quick-stat">
                <span className="profile-quick-stat__value" style={{ color: 'var(--warning)' }}>{user.upvotes.toLocaleString()}</span>
                <span className="profile-quick-stat__label">Upvotes Received</span>
              </div>
              <div className="profile-quick-stat">
                <span className="profile-quick-stat__value" style={{ color: 'var(--accent)' }}>{resolveRate}%</span>
                <span className="profile-quick-stat__label">Resolution Rate</span>
              </div>
            </div>
          </div>

          <div className="profile-hero__actions">
            <button className="report-btn report-btn--primary" onClick={() => navigate('/report')}>
              <Plus size={16} />
              New Report
            </button>
            <button className="report-btn report-btn--secondary">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="profile-grid">
          {/* Left: Reports */}
          <div>
            <div className="profile-section-header">
              <h2>My Reports</h2>
              <span className="profile-count">{myReports.length}</span>
            </div>

            {myReports.length === 0 ? (
              <div className="profile-empty glass-card">
                <MapPin size={40} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }} />
                <p style={{ color: 'var(--text-muted)' }}>No reports filed yet</p>
                <button className="report-btn report-btn--primary" onClick={() => navigate('/report')}>
                  File Your First Report
                </button>
              </div>
            ) : (
              <div className="profile-reports">
                {myReports.map((r, i) => (
                  <div key={r.id} className="profile-report-card glass-card animate-fadeInUp" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="profile-report-card__top">
                      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                        <span className="tracker-card__id">{r.id}</span>
                        <SeverityPill severity={r.severity} />
                      </div>
                      <StatusPill status={r.status} />
                    </div>
                    <h3 className="profile-report-card__title">{r.title}</h3>
                    <div className="profile-report-card__location">
                      <MapPin size={11} />
                      <span>{r.location.address.split(',').slice(0, 2).join(',')}</span>
                    </div>
                    <div className="profile-report-card__meta">
                      <span><Calendar size={11} /> {formatDate(r.reportedAt)}</span>
                      <span>▲ {r.upvotes}</span>
                      <span>💬 {r.comments}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Stats + Achievements */}
          <div>
            {/* Impact Stats */}
            <div className="profile-card glass-card" style={{ marginBottom: 'var(--space-5)' }}>
              <h3 style={{ marginBottom: 'var(--space-5)', fontSize: 'var(--text-lg)' }}>
                <TrendingUp size={18} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} />
                Your Impact
              </h3>
              <div className="profile-impact">
                {[
                  { label: 'Critical Issues Reported',     value: myReports.filter(r => r.severity === 'critical').length, color: 'var(--danger)' },
                  { label: 'High Severity Issues',         value: myReports.filter(r => r.severity === 'high').length,     color: 'var(--warning)' },
                  { label: 'Issues Resolved',              value: resolvedCount,                                            color: 'var(--accent)' },
                  { label: 'People Upvoted Your Reports',  value: totalUpvotes,                                             color: 'var(--primary)' },
                ].map(stat => (
                  <div key={stat.label} className="profile-impact-row">
                    <span className="profile-impact-label">{stat.label}</span>
                    <span className="profile-impact-value" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="profile-card glass-card">
              <h3 style={{ marginBottom: 'var(--space-5)', fontSize: 'var(--text-lg)' }}>
                <Star size={18} style={{ display: 'inline', marginRight: 8, color: 'var(--warning)' }} />
                Achievements
              </h3>
              <div className="profile-achievements">
                {[
                  { badge: 'Pioneer',         earned: true,  desc: 'Filed your first report' },
                  { badge: 'Verified',         earned: true,  desc: 'Identity verified by platform' },
                  { badge: 'Top Contributor',  earned: true,  desc: 'Top 5% of reporters' },
                  { badge: '100 Reports',      earned: true,  desc: 'Filed 100+ reports' },
                  { badge: 'Advocate',         earned: true,  desc: 'Active for 1+ year' },
                  { badge: 'City Champion',    earned: false, desc: 'Most reports in your city' },
                ].map(ach => (
                  <div key={ach.badge} className={`achievement-row ${!ach.earned ? 'achievement-row--locked' : ''}`}>
                    <div className="achievement-icon" style={{ background: ach.earned ? `${BADGE_COLORS[ach.badge] || 'var(--primary)'}18` : 'var(--bg-base)', opacity: ach.earned ? 1 : 0.4 }}>
                      <Award size={20} style={{ color: ach.earned ? (BADGE_COLORS[ach.badge] || 'var(--primary)') : 'var(--text-disabled)' }} />
                    </div>
                    <div>
                      <span className="achievement-name" style={{ color: ach.earned ? 'var(--text-primary)' : 'var(--text-disabled)' }}>{ach.badge}</span>
                      <span className="achievement-desc">{ach.desc}</span>
                    </div>
                    {ach.earned && <CheckCircle size={16} style={{ color: 'var(--accent)', marginLeft: 'auto' }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
