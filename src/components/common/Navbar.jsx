import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  MapPin, BarChart3, Users, Shield, User, Bell, Menu, X,
  ChevronDown, Search, Zap, AlertTriangle
} from 'lucide-react';
import './Navbar.css';

const NAV_LINKS = [
  { path: '/',           label: 'Home',      icon: null },
  { path: '/tracker',   label: 'Tracker',   icon: null },
  { path: '/analytics', label: 'Analytics', icon: null },
  { path: '/community', label: 'Community', icon: null },
  { path: '/admin',     label: 'Admin',     icon: null },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, markNotificationRead } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" aria-label="CivicAccess Home">
          <div className="navbar__logo-icon">
            <Zap size={18} />
          </div>
          <span className="navbar__logo-text">
            Civic<span className="navbar__logo-accent">Access</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar__links" role="list">
          {NAV_LINKS.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar__actions">
          {/* Notifications */}
          <div className="navbar__notif-wrap" ref={notifRef}>
            <button
              className="navbar__icon-btn"
              onClick={() => setNotifOpen(v => !v)}
              aria-label={`Notifications, ${unreadCount} unread`}
              id="navbar-notifications-btn"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="navbar__badge" aria-label={`${unreadCount} unread`}>{unreadCount}</span>
              )}
            </button>

            {notifOpen && (
              <div className="navbar__notif-dropdown" role="dialog" aria-label="Notifications">
                <div className="navbar__notif-header">
                  <span>Notifications</span>
                  <span className="navbar__notif-count">{unreadCount} new</span>
                </div>
                {notifications.map(n => (
                  <button
                    key={n.id}
                    className={`navbar__notif-item ${!n.read ? 'navbar__notif-item--unread' : ''}`}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <span className={`navbar__notif-dot navbar__notif-dot--${n.type}`} />
                    <div>
                      <p className="navbar__notif-msg">{n.message}</p>
                      <span className="navbar__notif-time">{n.time}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <Link to="/profile" className="navbar__avatar" aria-label="Your profile" id="navbar-profile-link">
            SB
          </Link>

          {/* Report CTA */}
          <button
            className="navbar__cta"
            onClick={() => navigate('/report')}
            id="navbar-report-btn"
            aria-label="Report an issue"
          >
            <AlertTriangle size={15} />
            Report Issue
          </button>

          {/* Mobile hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            id="navbar-mobile-menu-btn"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile" role="dialog" aria-label="Mobile navigation">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__mobile-link ${location.pathname === link.path ? 'navbar__mobile-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <button className="navbar__cta navbar__cta--mobile" onClick={() => navigate('/report')}>
            <AlertTriangle size={15} />
            Report an Issue
          </button>
        </div>
      )}
    </nav>
  );
}
