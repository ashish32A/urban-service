import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearToast, selectToast } from '../../store/slices/uiSlice';

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const STYLES = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
};

export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector(selectToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => dispatch(clearToast()), 4000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl text-white shadow-lg animate-slide-up
        ${STYLES[toast.type] || STYLES.info}`}
    >
      <span className="text-lg font-bold">{ICONS[toast.type]}</span>
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => dispatch(clearToast())}
        className="ml-2 text-white/80 hover:text-white"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
