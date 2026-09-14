import React, { useState } from 'react';
import { Search, Filter, MapPin, List, SlidersHorizontal, X, ChevronDown, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusPill, SeverityPill } from '../components/common/StatusPill';
import { CATEGORIES, STATUS_CONFIG, SEVERITY_CONFIG } from '../data/mockData';
import './Tracker.css';

const STATUSES = ['all', 'reported', 'under_review', 'in_progress', 'resolved', 'closed'];
const SEVERITIES = ['all', 'critical', 'high', 'medium', 'low'];
const PER_PAGE = 6;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Tracker() {
  const { filteredReports, filters, setFilter, upvoteReport, showToast } = useApp();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const totalPages = Math.ceil(filteredReports.length / PER_PAGE);
  const paginated = filteredReports.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleUpvote = (id, e) => {
    e.stopPropagation();
    upvoteReport(id);
    showToast('Upvoted! Thank you for your support.', 'success');
  };

  const handleFilter = (key, val) => {
    setFilter({ [key]: val });
    setPage(1);
  };

  const activeFilterCount = [
    filters.status !== 'all',
    filters.category !== 'all',
    filters.severity !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="tracker-page animate-pageEnter">
      <div className="container" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-10))', paddingBottom: 'var(--space-16)' }}>

        {/* Header */}
        <div className="tracker-header">
          <div>
            <div className="section-label"><MapPin size={13} />Issue Tracker</div>
            <h1>Track <span className="gradient-text-primary">All Reports</span></h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
              {filteredReports.length} issues found across all cities
            </p>
          </div>
          <div className="tracker-header__stats">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                className={`tracker-status-tab ${filters.status === key ? 'tracker-status-tab--active' : ''}`}
                style={{ '--tab-color': cfg.color }}
                onClick={() => handleFilter('status', key)}
              >
                <span className="tracker-status-tab__dot" style={{ background: cfg.color }} />
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Filter Bar */}
        <div className="tracker-toolbar">
          <div className="tracker-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by title or location…"
              value={filters.search}
              onChange={e => handleFilter('search', e.target.value)}
              className="tracker-search__input"
              id="tracker-search-input"
              aria-label="Search reports"
            />
            {filters.search && (
              <button onClick={() => handleFilter('search', '')} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>

          <button
            className={`tracker-filter-toggle ${filtersOpen ? 'tracker-filter-toggle--open' : ''}`}
            onClick={() => setFiltersOpen(v => !v)}
            id="tracker-filter-toggle-btn"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && <span className="tracker-filter-badge">{activeFilterCount}</span>}
          </button>
        </div>

        {/* Filter Panel */}
        {filtersOpen && (
          <div className="tracker-filters glass-card animate-fadeInDown">
            <div className="tracker-filter-group">
              <label>Category</label>
              <div className="tracker-filter-chips">
                <button className={`tracker-chip ${filters.category === 'all' ? 'tracker-chip--active' : ''}`} onClick={() => handleFilter('category', 'all')}>All</button>
                {CATEGORIES.map(c => (
                  <button key={c.id} className={`tracker-chip ${filters.category === c.id ? 'tracker-chip--active' : ''}`} onClick={() => handleFilter('category', c.id)}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="tracker-filter-group">
              <label>Severity</label>
              <div className="tracker-filter-chips">
                {SEVERITIES.map(s => (
                  <button key={s} className={`tracker-chip ${filters.severity === s ? 'tracker-chip--active' : ''}`} onClick={() => handleFilter('severity', s)}>
                    {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Report Cards */}
        <div className="tracker-grid">
          {paginated.length === 0 ? (
            <div className="tracker-empty">
              <Search size={40} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }} />
              <h3>No reports found</h3>
              <p>Try adjusting your filters or search query.</p>
            </div>
          ) : paginated.map((report, i) => (
            <div
              key={report.id}
              className="tracker-card glass-card animate-fadeInUp"
              style={{ animationDelay: `${i * 0.06}s`, cursor: 'pointer' }}
              onClick={() => setSelected(report)}
              role="button"
              tabIndex={0}
              aria-label={`View report: ${report.title}`}
              onKeyDown={e => e.key === 'Enter' && setSelected(report)}
            >
              <div className="tracker-card__top">
                <div className="tracker-card__ids">
                  <span className="tracker-card__id">{report.id}</span>
                  <SeverityPill severity={report.severity} />
                </div>
                <StatusPill status={report.status} />
              </div>

              <h3 className="tracker-card__title">{report.title}</h3>

              <div className="tracker-card__location">
                <MapPin size={12} />
                <span>{report.location.address}</span>
              </div>

              <p className="tracker-card__desc">{report.description.slice(0, 100)}…</p>

              <div className="tracker-card__footer">
                <div className="tracker-card__meta">
                  <span>{CATEGORIES.find(c => c.id === report.category)?.icon}</span>
                  <span>{formatDate(report.reportedAt)}</span>
                </div>
                <div className="tracker-card__actions">
                  <button
                    className="tracker-upvote"
                    onClick={e => handleUpvote(report.id, e)}
                    aria-label={`Upvote report, currently ${report.upvotes} upvotes`}
                    id={`upvote-${report.id}`}
                  >
                    ▲ {report.upvotes}
                  </button>
                  <span className="tracker-comments">💬 {report.comments}</span>
                </div>
              </div>

              {report.assignedTo && (
                <div className="tracker-card__assigned">
                  Assigned to: <strong>{report.assignedTo}</strong>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="tracker-pagination">
            <button
              className="tracker-page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`tracker-page-btn ${p === page ? 'tracker-page-btn--active' : ''}`}
                onClick={() => setPage(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
              >{p}</button>
            ))}
            <button
              className="tracker-page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >Next →</button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="tracker-modal-overlay" onClick={() => setSelected(null)} role="dialog" aria-modal="true" aria-label="Report details">
          <div className="tracker-modal glass-card" onClick={e => e.stopPropagation()} role="document">
            <button className="tracker-modal__close" onClick={() => setSelected(null)} aria-label="Close">
              <X size={20} />
            </button>

            <div className="tracker-modal__header">
              <span className="tracker-modal__id">{selected.id}</span>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <SeverityPill severity={selected.severity} />
                <StatusPill status={selected.status} />
              </div>
            </div>

            <h2 className="tracker-modal__title">{selected.title}</h2>

            <div className="tracker-modal__location">
              <MapPin size={14} />
              <span>{selected.location.address}</span>
            </div>

            <p className="tracker-modal__desc">{selected.description}</p>

            <div className="tracker-modal__grid">
              <div className="tracker-modal__field">
                <span className="tracker-modal__label">Category</span>
                <span>{CATEGORIES.find(c => c.id === selected.category)?.icon} {CATEGORIES.find(c => c.id === selected.category)?.label}</span>
              </div>
              <div className="tracker-modal__field">
                <span className="tracker-modal__label">Reported by</span>
                <span>{selected.reportedBy}</span>
              </div>
              <div className="tracker-modal__field">
                <span className="tracker-modal__label">Filed on</span>
                <span>{formatDate(selected.reportedAt)}</span>
              </div>
              <div className="tracker-modal__field">
                <span className="tracker-modal__label">Last updated</span>
                <span>{formatDate(selected.updatedAt)}</span>
              </div>
              {selected.assignedTo && (
                <div className="tracker-modal__field">
                  <span className="tracker-modal__label">Assigned to</span>
                  <span>{selected.assignedTo}</span>
                </div>
              )}
              {selected.resolvedAt && (
                <div className="tracker-modal__field">
                  <span className="tracker-modal__label">Resolved on</span>
                  <span style={{ color: 'var(--accent)' }}>{formatDate(selected.resolvedAt)}</span>
                </div>
              )}
            </div>

            <div className="tracker-modal__actions">
              <button className="report-btn report-btn--primary" onClick={() => { upvoteReport(selected.id); showToast('Upvoted!', 'success'); }}>
                ▲ Upvote ({selected.upvotes})
              </button>
              <button className="report-btn report-btn--secondary" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
