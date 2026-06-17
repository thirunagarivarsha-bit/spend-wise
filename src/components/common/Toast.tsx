import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useExpenses();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  };
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const { id, type, message } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="toast-icon text-success" size={20} />;
      case 'error':
        return <AlertCircle className="toast-icon text-error" size={20} />;
      case 'warning':
        return <AlertTriangle className="toast-icon text-warning" size={20} />;
      case 'info':
      default:
        return <Info className="toast-icon text-info" size={20} />;
    }
  };

  return (
    <div className={`toast-card toast-${type}`}>
      <div className="toast-body">
        {getIcon()}
        <span className="toast-message">{message}</span>
        <button onClick={() => onDismiss(id)} className="toast-close-btn" aria-label="Close toast">
          <X size={16} />
        </button>
      </div>
      <div className="toast-progress-bar">
        <div className={`toast-progress toast-progress-${type}`}></div>
      </div>
    </div>
  );
};
