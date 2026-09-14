import React, { useState } from 'react';
import { Users, ThumbsUp, MessageSquare, Trophy, Star, MapPin, Award } from 'lucide-react';
import { MOCK_REPORTS, MOCK_USERS } from '../data/mockData';
import { StatusPill, SeverityPill } from '../components/common/StatusPill';
import { useApp } from '../context/AppContext';
import './Community.css';

const BADGE_COLORS = {
  'Top Contributor': '#FFB84C',
  'Pioneer':         '#6C63FF',
  'Verified':        '#00D4AA',
  '100 Reports':     '#FF6B6B',
  '50 Reports':      '#4ECDC4',
  'Advocate':        '#A78BFA',
};

function BadgeChip({ label }) {
  return (
    <span className="badge-chip" style={{ '--badge-color': BADGE_COLORS[label] || 'var(--primary)' }}>
      <Award size={11} />
      {label}
    </span>
  );
}

export default function Community() {
  const { filteredReports, upvoteReport, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('discussions');

  const topReports = [...filteredReports]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 8);

  const sortedUsers = [...MOCK_USERS].sort((a, b) => b.reports - a.reports);

  const handleUpvote = (id) => {
    upvoteReport(id);
    showToast('Upvoted! Thank you for your support.', 'success');
  };

  return (
    <div className="community-page animate-pageEnter">
      <div className="community-bg" aria-hidden="true">
        <div className="community-orb" />
      </div>

      <div className="container" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-10))', paddingBottom: 'var(--space-16)', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="community-header text-center">
          <div className="section-label" style={{ margin: '0 auto var(--space-4)' }}>
            <Users size={13} />
            Community Hub
          </div>
          <h1>The <span className="gradient-text">Advocate Community</span></h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 520, margin: 'var(--space-4) auto 0' }}>
            Join thousands of disability advocates, caregivers, and allies working to make public spaces accessible for everyone.
          </p>
        </div>

        {/* Tabs */}
        <div className="community-tabs" role="tablist">
          {[
            { id: 'discussions', label: 'Top Reports', icon: MessageSquare },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          ].map(tab => (
            <button
              key={tab.id}
              className={`community-tab ${activeTab === tab.id ? 'community-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              id={`community-tab-${tab.id}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Discussions / Top Reports */}
        {activeTab === 'discussions' && (
          <div className="community-grid">
            {/* Main Feed */}
            <div className="community-feed">
              {topReports.map((report, i) => (
                <div key={report.id} className="community-card glass-card animate-fadeInUp" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="community-card__header">
                    <div className="community-card__author">
                      <div className="community-card__avatar">
                        {report.reportedBy.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div>
                        <span className="community-card__name">{report.reportedBy}</span>
                        <span className="community-card__time">
                          {new Date(report.reportedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                      <SeverityPill severity={report.severity} />
                      <StatusPill status={report.status} />
                    </div>
                  </div>

                  <h3 className="community-card__title">{report.title}</h3>

                  <div className="community-card__location">
                    <MapPin size={12} />
                    <span>{report.location.address.split(',').slice(0, 2).join(',')}</span>
                  </div>

                  <p className="community-card__desc">{report.description.slice(0, 130)}…</p>

                  <div className="community-card__footer">
                    <button
                      className="community-upvote"
                      onClick={() => handleUpvote(report.id)}
                      id={`community-upvote-${report.id}`}
                      aria-label={`Upvote: ${report.upvotes} current votes`}
                    >
                      <ThumbsUp size={14} />
                      {report.upvotes} Support
                    </button>
                    <span className="community-comments">
                      <MessageSquare size={14} />
                      {report.comments} Comments
                    </span>
                    <span className="community-rank">#{i + 1} trending</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar: Top Advocates */}
            <div className="community-sidebar">
              <div className="community-sidebar-card glass-card">
                <h3 style={{ marginBottom: 'var(--space-5)', fontSize: 'var(--text-lg)' }}>
                  <Star size={18} style={{ display: 'inline', marginRight: 8, color: 'var(--warning)' }} />
                  Top Advocates
                </h3>
                {sortedUsers.slice(0, 5).map((user, i) => (
                  <div key={user.id} className="sidebar-user animate-fadeInRight" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="sidebar-user__rank">#{i + 1}</div>
                    <div className="sidebar-user__avatar">{user.avatar}</div>
                    <div className="sidebar-user__info">
                      <span className="sidebar-user__name">{user.name}</span>
                      <span className="sidebar-user__city">
                        <MapPin size={10} /> {user.city}
                      </span>
                    </div>
                    <div className="sidebar-user__score">{user.reports} <span>reports</span></div>
                  </div>
                ))}
              </div>

              <div className="community-sidebar-card glass-card" style={{ marginTop: 'var(--space-5)' }}>
                <h3 style={{ marginBottom: 'var(--space-5)', fontSize: 'var(--text-lg)' }}>
                  <Award size={18} style={{ display: 'inline', marginRight: 8, color: 'var(--primary-light)' }} />
                  Available Badges
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {Object.entries(BADGE_COLORS).map(([badge, color]) => (
                    <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <BadgeChip label={badge} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="leaderboard animate-fadeInUp">
            <div className="leaderboard-podium">
              {sortedUsers.slice(0, 3).map((user, i) => {
                const order = [1, 0, 2][i];
                const heights = ['140px', '180px', '110px'];
                const medals = ['🥈', '🥇', '🥉'];
                return (
                  <div key={user.id} className="podium-slot" style={{ order, '--podium-height': heights[order] }}>
                    <div className="podium-slot__avatar" style={{ background: ['#C0C0C0', 'var(--warning)', '#CD7F32'][order] }}>
                      {user.avatar}
                    </div>
                    <div className="podium-slot__medal">{medals[order]}</div>
                    <div className="podium-slot__name">{user.name.split(' ')[0]}</div>
                    <div className="podium-slot__score">{user.reports} reports</div>
                    <div className="podium-slot__base" />
                  </div>
                );
              })}
            </div>

            <div className="leaderboard-table glass-card">
              {sortedUsers.map((user, i) => (
                <div key={user.id} className={`leaderboard-row animate-fadeInUp ${i === 0 ? 'leaderboard-row--top' : ''}`} style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="leaderboard-row__rank" style={{ color: ['var(--warning)', 'var(--text-muted)', '#CD7F32', 'var(--text-disabled)'][Math.min(i, 3)] }}>
                    {['🥇','🥈','🥉'][i] || `#${i + 1}`}
                  </div>
                  <div className="leaderboard-row__avatar" style={{ background: i === 0 ? 'var(--gradient-hero)' : 'var(--gradient-primary)' }}>
                    {user.avatar}
                  </div>
                  <div className="leaderboard-row__info">
                    <span className="leaderboard-row__name">{user.name}</span>
                    <div className="leaderboard-row__badges">
                      {user.badges.map(b => <BadgeChip key={b} label={b} />)}
                    </div>
                  </div>
                  <div className="leaderboard-row__city">
                    <MapPin size={12} /> {user.city}
                  </div>
                  <div className="leaderboard-row__stats">
                    <div className="leaderboard-row__stat">
                      <span>{user.reports}</span>
                      <span>Reports</span>
                    </div>
                    <div className="leaderboard-row__stat">
                      <span>{user.upvotes.toLocaleString()}</span>
                      <span>Upvotes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
