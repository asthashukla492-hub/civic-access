import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { MOCK_REPORTS } from '../data/mockData';

const AppContext = createContext(null);

const initialState = {
  reports: MOCK_REPORTS,
  user: {
    id: 'u6',
    name: 'Suresh Babu',
    avatar: 'SB',
    email: 'suresh.babu@example.com',
    city: 'Bangalore',
    reports: 42,
    upvotes: 3200,
    badges: ['Top Contributor', 'Advocate', '100 Reports'],
    joinedAt: '2023-06-01',
  },
  filters: {
    status: 'all',
    category: 'all',
    severity: 'all',
    search: '',
    view: 'table', // 'table' | 'map'
  },
  notifications: [
    { id: 'n1', message: 'Your report CA-2024-0001 has been resolved!', read: false, time: '2h ago', type: 'success' },
    { id: 'n2', message: 'CA-2024-0005 status updated to In Progress', read: false, time: '1d ago', type: 'info' },
    { id: 'n3', message: '189 people upvoted your report', read: true, time: '3d ago', type: 'info' },
  ],
  toast: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_REPORT':
      return { ...state, reports: [action.payload, ...state.reports] };

    case 'UPDATE_REPORT_STATUS':
      return {
        ...state,
        reports: state.reports.map(r =>
          r.id === action.payload.id
            ? { ...r, status: action.payload.status, updatedAt: new Date().toISOString() }
            : r
        ),
      };

    case 'UPVOTE_REPORT':
      return {
        ...state,
        reports: state.reports.map(r =>
          r.id === action.payload ? { ...r, upvotes: r.upvotes + 1 } : r
        ),
      };

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };

    case 'HIDE_TOAST':
      return { ...state, toast: null };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addReport = useCallback((report) => {
    dispatch({ type: 'ADD_REPORT', payload: report });
  }, []);

  const updateReportStatus = useCallback((id, status) => {
    dispatch({ type: 'UPDATE_REPORT_STATUS', payload: { id, status } });
  }, []);

  const upvoteReport = useCallback((id) => {
    dispatch({ type: 'UPVOTE_REPORT', payload: id });
  }, []);

  const setFilter = useCallback((filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3500);
  }, []);

  const markNotificationRead = useCallback((id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  const filteredReports = state.reports.filter(r => {
    const { status, category, severity, search } = state.filters;
    if (status !== 'all' && r.status !== status) return false;
    if (category !== 'all' && r.category !== category) return false;
    if (severity !== 'all' && r.severity !== severity) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) &&
        !r.location.address.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AppContext.Provider value={{
      ...state,
      filteredReports,
      addReport,
      updateReportStatus,
      upvoteReport,
      setFilter,
      resetFilters,
      showToast,
      markNotificationRead,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
