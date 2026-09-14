import React, { useState } from 'react';
import {
  Shield, AlertTriangle, CheckCircle, Clock, Users,
  Bell, ChevronDown, ArrowRight, Loader, Flag, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusPill, SeverityPill } from '../components/common/StatusPill';
import { IMPACT_STATS } from '../data/mockData';
import './Admin.css';

const STATUS_FLOW = ['reported', 'under_review', 'in_progress', 'resolved', 'closed'];

export default function Admin() {
  const { reports, updateReportStatus, showToast } = useApp();
  const [selected, setSelected] = useState(null);
  const [assignee, setAssignee] = useState('');

  const criticalCount  = reports.filter(r => r.severity === 'critical' && r.status !== 'resolved').length;
  const inProgressCount = reports.filter(r => r.status === 'in_progress').length;
  const unreviewedCount = reports.filter(r => r.status === 'reported').length;
  const resolvedThisMonth = reports.filter(r => r.status === 'resolved').length;

  const handleStatusChange = (report, newStatus) => {
    updateReportStatus(report.id, newStatus);
    showToast(`Status updated to "${newStatus.replace('_', ' ')}"`, 'success');
    setSelected(r => r ? { ...r, status: newStatus } : null);
  };

  const sortedReports = [...reports].sort((a, b) => {
    const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (sevOrder[a.severity] ?? 9) - (sevOrder[b.severity] ?? 9);
  });

  return (
    <div className="admin-page animate-pageEnter">
      <div className="admin-bg" aria-hidden="true">
        <div className="admin-orb" />
      </div>

      <div className="container" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-10))', paddingBottom: 'var(--space-16)', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="admin-header">
          <div>
            <div className="section-label"><Shield size={13} />Admin Portal</div>
            <h1>Municipal <span className="gradient-text-primary">Command Centre</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage, assign, and resolve accessibility issue reports</p>
          </div>
          <div className="admin-header__badge">
            <Shield size={16} />
            Government Access
          </div>
        </div>

        {/* KPIs */}
        <div className="admin-kpis">
          {[
            { label: 'Critical Alerts',    value: criticalCount,      icon: AlertTriangle, color: 'var(--danger)',   bg: 'var(--danger-subtle)' },
            { label: 'Under Review',       value: unreviewedCount,    icon: Flag,          color: 'var(--warning)',  bg: 'var(--warning-subtle)' },
            { label: 'In Progress',        value: inProgressCount,    icon: Loader,        color: 'var(--primary)',  bg: 'var(--primary-subtle)' },
            { label: 'Resolved Total',     value: resolvedThisMonth,  icon: CheckCircle,   color: 'var(--accent)',   bg: 'var(--accent-subtle)' },
          ].map((kpi, i) => (
            <div key={kpi.label} className="admin-kpi glass-card animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="admin-kpi__icon" style={{ background: kpi.bg, color: kpi.color }}>
                <kpi.icon size={20} />
              </div>
              <div className="admin-kpi__value" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="admin-kpi__label">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Main Grid: Table + Detail */}
        <div className="admin-main">
          {/* Report Table */}
          <div className="admin-table-wrap glass-card">
            <div className="admin-table-header">
              <h3>All Reports <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 'var(--text-sm)' }}>({sortedReports.length})</span></h3>
              <div className="admin-table-legend">
                <span style={{ color: 'var(--danger)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>● CRITICAL first</span>
              </div>
            </div>
            <div className="admin-table-scroll">
              <table className="admin-table" role="table" aria-label="Reports table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Issue</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Upvotes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReports.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`admin-table__row ${selected?.id === r.id ? 'admin-table__row--selected' : ''} animate-fadeInUp`}
                      style={{ animationDelay: `${i * 0.04}s`, cursor: 'pointer' }}
                      onClick={() => setSelected(r)}
                      role="row"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && setSelected(r)}
                    >
                      <td className="admin-table__id">{r.id}</td>
                      <td className="admin-table__title">{r.title.slice(0, 45)}{r.title.length > 45 ? '…' : ''}</td>
                      <td><SeverityPill severity={r.severity} /></td>
                      <td><StatusPill status={r.status} /></td>
                      <td className="admin-table__upvotes">▲ {r.upvotes}</td>
                      <td>
                        <select
                          className="admin-status-select"
                          value={r.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => handleStatusChange(r, e.target.value)}
                          aria-label={`Change status for ${r.id}`}
                        >
                          {STATUS_FLOW.map(s => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="admin-detail glass-card">
            {!selected ? (
              <div className="admin-detail__empty">
                <Shield size={40} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }} />
                <p style={{ color: 'var(--text-muted)' }}>Select a report to view details</p>
              </div>
            ) : (
              <div className="admin-detail__content animate-fadeInUp">
                <div className="admin-detail__top">
                  <span className="admin-detail__id">{selected.id}</span>
                  <button onClick={() => setSelected(null)} className="admin-detail__close" aria-label="Close">
                    <X size={16} />
                  </button>
                </div>

                <h3 className="admin-detail__title">{selected.title}</h3>
                <p className="admin-detail__loc" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-5)' }}>
                  📍 {selected.location.address}
                </p>

                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
                  <SeverityPill severity={selected.severity} />
                  <StatusPill status={selected.status} />
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                  {selected.description}
                </p>

                <div className="admin-detail__section">
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
                    Change Status
                  </label>
                  <div className="admin-status-flow">
                    {STATUS_FLOW.map((s, i) => (
                      <button
                        key={s}
                        className={`admin-status-step ${selected.status === s ? 'admin-status-step--active' : ''} ${STATUS_FLOW.indexOf(selected.status) > i ? 'admin-status-step--done' : ''}`}
                        onClick={() => handleStatusChange(selected, s)}
                      >
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="admin-detail__section" style={{ marginTop: 'var(--space-5)' }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
                    Assign To Department
                  </label>
                  <input
                    type="text"
                    className="report-input"
                    placeholder="e.g. BBMP Infrastructure Dept"
                    value={assignee || selected.assignedTo || ''}
                    onChange={e => setAssignee(e.target.value)}
                  />
                  {(assignee || selected.assignedTo) && (
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', marginTop: 'var(--space-2)' }}>
                      Currently: {selected.assignedTo || assignee}
                    </p>
                  )}
                </div>

                <div className="admin-detail__meta" style={{ marginTop: 'var(--space-5)' }}>
                  <div className="tracker-modal__field">
                    <span className="tracker-modal__label">Reported by</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{selected.reportedBy}</span>
                  </div>
                  <div className="tracker-modal__field">
                    <span className="tracker-modal__label">Upvotes</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--primary-light)', fontWeight: 700 }}>▲ {selected.upvotes}</span>
                  </div>
                  <div className="tracker-modal__field">
                    <span className="tracker-modal__label">Comments</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>💬 {selected.comments}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
