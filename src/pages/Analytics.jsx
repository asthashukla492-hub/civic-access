import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, TrendingUp, CheckCircle, Globe, Clock, Users, AlertTriangle, Zap } from 'lucide-react';
import { MONTHLY_DATA, CATEGORY_DATA, TOP_CITIES } from '../data/mockData';
import { usePlatformMetrics } from '../hooks/usePlatformMetrics';
import './Analytics.css';

const DONUT_DATA = [
  { name: 'Resolved',     value: 61, color: '#00D4AA' },
  { name: 'In Progress',  value: 18, color: '#6C63FF' },
  { name: 'Under Review', value: 12, color: '#FFB84C' },
  { name: 'Reported',     value: 7,  color: '#A0A0CC' },
  { name: 'Closed',       value: 2,  color: '#606090' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', boxShadow: 'var(--shadow-lg)' }}>
      {label && <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: 4 }}>{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color || 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
};

function KPICard({ icon: Icon, label, value, suffix = '', color, delay }) {
  const displayValue = typeof value === 'number'
    ? (value === 0 && suffix !== '%' ? '0' : `${value.toLocaleString()}${suffix}`)
    : (value ?? '—');

  return (
    <div className="kpi-card glass-card animate-fadeInUp" style={{ animationDelay: `${delay}s` }}>
      <div className="kpi-card__icon" style={{ background: `${color}18`, color }}>
        <Icon size={22} />
      </div>
      <div className="kpi-card__value" style={{ color }}>
        {displayValue}
      </div>
      <div className="kpi-card__label">{label}</div>
    </div>
  );
}

export default function Analytics() {
  const metrics = usePlatformMetrics();
  const resolveRate = metrics.totalReports > 0
    ? Math.round((metrics.resolved / metrics.totalReports) * 100)
    : 0;

  return (
    <div className="analytics-page animate-pageEnter">
      <div className="analytics-bg" aria-hidden="true">
        <div className="analytics-orb analytics-orb--1" />
        <div className="analytics-orb analytics-orb--2" />
      </div>

      <div className="container" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-10))', paddingBottom: 'var(--space-16)', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="analytics-header text-center">
          <div className="section-label" style={{ margin: '0 auto var(--space-4)' }}>
            <BarChart3 size={13} />
            Analytics & Impact
          </div>
          <h1>Platform <span className="gradient-text-primary">Impact Dashboard</span></h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: 'var(--space-4) auto 0' }}>
            Real-time data on accessibility issue resolution across India.
          </p>
        </div>

        {/* KPI Row */}
        <div className="kpi-grid">
          <KPICard icon={AlertTriangle} label="Total Reports"    value={metrics.totalReports} color="#FF6B6B" delay={0}   />
          <KPICard icon={CheckCircle}   label="Resolved"         value={metrics.resolved}     color="#00D4AA" delay={0.1} />
          <KPICard icon={Globe}         label="Cities Active"    value={metrics.citiesCovered} color="#6C63FF" delay={0.2} />
          <KPICard icon={Clock}         label="Avg Resolution"   value={metrics.avgResolutionDays > 0 ? metrics.avgResolutionDays : 0} suffix={metrics.avgResolutionDays > 0 ? " days" : ""} color="#FFB84C" delay={0.3} />
          <KPICard icon={Users}         label="Advocates"        value={metrics.activeAdvocates} color="#4ECDC4" delay={0.4} />
          <KPICard icon={Zap}           label="Resolution Rate"  value={resolveRate} suffix="%" color="#A78BFA" delay={0.5} />
        </div>

        {/* Charts Row 1 */}
        <div className="analytics-charts-row">
          {/* Line Chart - Monthly Trend */}
          <div className="analytics-chart-card glass-card animate-fadeInUp">
            <div className="analytics-chart-header">
              <div>
                <h3>Monthly Trend</h3>
                <p>Reports filed vs resolved over last 6 months</p>
              </div>
              <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12, color: 'var(--text-muted)' }} />
                  <Line type="monotone" dataKey="reports"  name="Reports"  stroke="#6C63FF" strokeWidth={3} dot={{ fill: '#6C63FF', r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#00D4AA" strokeWidth={3} dot={{ fill: '#00D4AA', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart - Status Distribution */}
          <div className="analytics-chart-card glass-card animate-fadeInUp delay-200">
            <div className="analytics-chart-header">
              <div>
                <h3>Status Distribution</h3>
                <p>Current breakdown of all reports</p>
              </div>
              <CheckCircle size={20} style={{ color: 'var(--accent)' }} />
            </div>
            <div style={{ height: 280, display: 'flex', alignItems: 'center' }}>
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie data={DONUT_DATA} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                    {DONUT_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DONUT_DATA.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{d.name}</span>
                    <span style={{ color: d.color, fontWeight: 700 }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="analytics-charts-row">
          {/* Bar Chart - By Category */}
          <div className="analytics-chart-card glass-card animate-fadeInUp">
            <div className="analytics-chart-header">
              <div>
                <h3>Reports by Category</h3>
                <p>Total reports filed per accessibility category</p>
              </div>
              <BarChart3 size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CATEGORY_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="category" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} angle={-35} textAnchor="end" axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Reports" radius={[6, 6, 0, 0]}>
                    {CATEGORY_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Cities */}
          <div className="analytics-chart-card glass-card animate-fadeInUp delay-200">
            <div className="analytics-chart-header">
              <div>
                <h3>Top Cities</h3>
                <p>Most active cities by report volume</p>
              </div>
              <Globe size={20} style={{ color: 'var(--warning)' }} />
            </div>
            <div className="cities-list">
              {TOP_CITIES.map((city, i) => {
                const pct = Math.round((city.resolved / city.reports) * 100);
                return (
                  <div key={city.city} className="city-row animate-fadeInUp" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="city-row__rank">{i + 1}</div>
                    <div className="city-row__info">
                      <div className="city-row__name-row">
                        <span className="city-row__name">{city.city}</span>
                        <span className="city-row__stats">{city.reports.toLocaleString()} reports · {pct}% resolved</span>
                      </div>
                      <div className="city-row__bar">
                        <div className="city-row__bar-fill" style={{ width: `${pct}%`, background: pct > 70 ? 'var(--accent)' : pct > 50 ? 'var(--primary)' : 'var(--warning)' }} />
                      </div>
                    </div>
                    <span className="city-row__pct" style={{ color: pct > 70 ? 'var(--accent)' : pct > 50 ? 'var(--primary-light)' : 'var(--warning)' }}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
