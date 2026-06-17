import React from 'react';
import { Edit2, Trash2, CreditCard, Banknote, Landmark, HelpCircle } from 'lucide-react';
import type { Expense } from '../../types';
import { useExpenses } from '../../context/ExpenseContext';

interface ExpenseTableItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
}

const getPaymentIcon = (method: string) => {
  switch (method) {
    case 'Credit Card':
    case 'Debit Card':
      return <CreditCard size={16} className="text-gray-400" />;
    case 'Cash':
      return <Banknote size={16} className="text-green-500" />;
    case 'Bank Transfer':
      return <Landmark size={16} className="text-blue-400" />;
    default:
      return <HelpCircle size={16} className="text-gray-400" />;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'status-draft';
    case 'Pending':
      return 'status-pending';
    case 'Approved':
      return 'status-approved';
    case 'Paid':
      return 'status-paid';
    default:
      return 'status-default';
  }
};

export const ExpenseTableItem: React.FC<ExpenseTableItemProps> = React.memo(({ expense, onEdit }) => {
  const { deleteExpense, categoryColors } = useExpenses();

  const handleEdit = () => {
    onEdit(expense);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${expense.title}"?`)) {
      deleteExpense(expense.id);
    }
  };

  // Format Date Nicely
  const formattedDate = React.useMemo(() => {
    if (!expense.date) return '';
    const dateObj = new Date(expense.date);
    return dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [expense.date]);

  const catColor = categoryColors[expense.category] || '#8395a7';

  return (
    <tr className="expense-row">
      <td className="cell-date">{formattedDate}</td>
      <td className="cell-title">
        <div 
          className="title-text" 
          style={{ cursor: 'pointer', color: 'var(--primary-color)', textDecoration: 'underline' }}
          onClick={() => window.location.hash = `#/log/${expense.id}`}
          title="Click to view details"
        >
          {expense.title}
        </div>
        {expense.description && <div className="desc-text">{expense.description}</div>}
      </td>
      <td className="cell-category">
        <span className="category-badge" style={{ borderColor: catColor, color: catColor }}>
          {expense.category}
        </span>
      </td>
      <td className="cell-payment">
        <div className="payment-wrap">
          {getPaymentIcon(expense.paymentMethod)}
          <span>{expense.paymentMethod}</span>
        </div>
      </td>
      <td className="cell-status">
        <span className={`status-pill ${getStatusClass(expense.status)}`}>
          {expense.status}
        </span>
      </td>
      <td className="cell-amount">Rs. {expense.amount.toFixed(2)}</td>
      <td className="cell-actions">
        <div className="action-buttons">
          <button onClick={handleEdit} className="btn-action edit" title="Edit Expense">
            <Edit2 size={14} />
          </button>
          <button onClick={handleDelete} className="btn-action delete" title="Delete Expense">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
});

ExpenseTableItem.displayName = 'ExpenseTableItem';
