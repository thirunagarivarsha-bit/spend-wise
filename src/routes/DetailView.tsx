import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Card } from '../components/common/Card';
import { ExpenseForm } from '../components/entry/ExpenseForm';
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  Tag, 
  Activity, 
  Trash2, 
  Edit2, 
  X,
  Banknote,
  Landmark,
  HelpCircle
} from 'lucide-react';
import type { Expense } from '../types';

export const DetailView: React.FC = () => {
  const { expenses, deleteExpense, categoryColors } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Extract ID from hash: e.g. #/log/12345
  const expenseId = React.useMemo(() => {
    const parts = window.location.hash.split('/');
    return parts[parts.length - 1] || '';
  }, []);

  const expense = React.useMemo(() => {
    return expenses.find(e => e.id === expenseId);
  }, [expenses, expenseId]);

  const handleBack = () => {
    window.location.hash = '#/log';
  };

  const handleDelete = async () => {
    if (!expense) return;
    if (confirm(`Are you sure you want to delete "${expense.title}"?`)) {
      const success = await deleteExpense(expense.id);
      if (success) {
        window.location.hash = '#/log';
      }
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'Credit Card':
      case 'Debit Card':
        return <CreditCard size={18} className="text-gray-400" />;
      case 'Cash':
        return <Banknote size={18} className="text-green-500" />;
      case 'Bank Transfer':
        return <Landmark size={18} className="text-blue-400" />;
      default:
        return <HelpCircle size={18} className="text-gray-400" />;
    }
  };

  if (!expense) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <Card title="Error" subtitle="Expense Record Not Found" style={{ textAlign: 'center', padding: '32px' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            The requested expense record does not exist or has been deleted.
          </p>
          <button onClick={handleBack} className="btn-secondary">
            <ArrowLeft size={16} /> Back to Expense Log
          </button>
        </Card>
      </div>
    );
  }

  const catColor = categoryColors[expense.category] || '#8395a7';

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '10px' }}>
      <button onClick={handleBack} className="btn-secondary" style={{ marginBottom: '16px' }}>
        <ArrowLeft size={16} /> Back to Logs
      </button>

      <Card 
        title="Expense Details" 
        subtitle={`Transaction ID: ${expense.id}`} 
        style={{ padding: '32px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Title and Amount */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>{expense.title}</h2>
              <span 
                className="category-badge" 
                style={{ 
                  borderColor: catColor, 
                  color: catColor,
                  marginTop: '8px',
                  display: 'inline-block' 
                }}
              >
                {expense.category}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block' }}>Amount</span>
              <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary-color)' }}>
                Rs. {expense.amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'var(--bg-card-hover)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <Calendar size={18} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Date</span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                  {new Date(expense.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'var(--bg-card-hover)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {getPaymentIcon(expense.paymentMethod)}
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Payment Method</span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{expense.paymentMethod}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'var(--bg-card-hover)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <Activity size={18} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Workflow Status</span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                  <span className={`status-pill status-${expense.status.toLowerCase()}`}>
                    {expense.status}
                  </span>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'var(--bg-card-hover)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <Tag size={18} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Category Channel</span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{expense.category}</span>
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Description & Notes</h4>
            <p style={{ 
              background: 'var(--bg-card-hover)', 
              border: '1px solid var(--border-color)',
              padding: '16px', 
              borderRadius: '8px', 
              fontSize: '14px', 
              lineHeight: '1.5',
              fontStyle: expense.description ? 'normal' : 'italic',
              color: expense.description ? 'var(--text-primary)' : 'var(--text-muted)'
            }}>
              {expense.description || 'No description provided for this transaction.'}
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '8px' }}>
            <button onClick={() => setEditingExpense(expense)} className="btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <Edit2 size={16} /> Edit Expense
            </button>
            <button onClick={handleDelete} className="btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px', color: 'var(--error-color)', borderColor: 'var(--error-color)' }}>
              <Trash2 size={16} /> Delete Record
            </button>
          </div>

        </div>
      </Card>

      {/* Edit Modal Overlay */}
      {editingExpense && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="modal-close" 
              onClick={() => setEditingExpense(null)}
              aria-label="Close Modal"
            >
              <X size={20} />
            </button>
            <ExpenseForm 
              initialData={editingExpense} 
              onSuccess={() => setEditingExpense(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailView;
