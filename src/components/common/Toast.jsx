import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import './Toast.css';

const ICONS = {
  success: <CheckCircle size={18} />,
  info:    <Info size={18} />,
  warning: <AlertTriangle size={18} />,
  error:   <XCircle size={18} />,
};

export default function Toast() {
  const { toast, showToast } = useApp();

  if (!toast) return null;

  return (
    <div className={`toast toast--${toast.type}`} role="alert" aria-live="polite">
      <span className="toast__icon">{ICONS[toast.type] || ICONS.info}</span>
      <p className="toast__msg">{toast.message}</p>
    </div>
  );
}
