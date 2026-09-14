import React from 'react';
import { STATUS_CONFIG, SEVERITY_CONFIG } from '../../data/mockData';
import './StatusPill.css';

export function StatusPill({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.reported;
  return (
    <span
      className="status-pill"
      style={{ color: config.color, background: config.bg, borderColor: `${config.color}33` }}
    >
      <span className="status-pill__dot" style={{ background: config.color }} />
      {config.label}
    </span>
  );
}

export function SeverityPill({ severity }) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.medium;
  return (
    <span
      className="status-pill"
      style={{ color: config.color, background: config.bg, borderColor: `${config.color}33` }}
    >
      {config.label}
    </span>
  );
}
