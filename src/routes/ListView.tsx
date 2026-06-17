import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { FilterPanel } from '../components/list/FilterPanel';
import { ExpenseTableItem } from '../components/list/ExpenseTableItem';
import { ExpenseForm } from '../components/entry/ExpenseForm';
import { 
  Download, 
  X
} from 'lucide-react';
import type { Expense } from '../types';

export const ListView: React.FC = () => {
  const { 
    filteredExpenses
  } = useExpenses();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Pagination State (only used in List view)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Calculate paginated items
  const paginatedExpenses = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(start, start + itemsPerPage);
  }, [filteredExpenses, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  // CSV Export utility
  const exportToCSV = () => {
    if (filteredExpenses.length === 0) return;
    
    const headers = 'ID,Date,Title,Category,Payment Method,Status,Amount,Description\n';
    const rows = filteredExpenses.map(e => 
      `"${e.id}","${e.date}","${e.title.replace(/"/g, '""')}","${e.category}","${e.paymentMethod}","${e.status}",${e.amount},"${(e.description || '').replace(/"/g, '""')}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `expense_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="list-view-container">
      {/* Top Action bar */}
      <div className="list-header-bar">
        <div>
          <h2 className="page-title">Expense Log</h2>
          <p className="page-subtitle">Search, filter, and review active transactions</p>
        </div>

        <div className="view-toggle-actions">
          <button 
            onClick={exportToCSV}
            className="btn-export"
            disabled={filteredExpenses.length === 0}
            title="Export to CSV"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel />

      {/* List View Content (Expense Log Table) */}
      <div className="list-view-content">
        <div className="table-responsive">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedExpenses.length > 0 ? (
                paginatedExpenses.map(expense => (
                  <ExpenseTableItem 
                    key={expense.id} 
                    expense={expense} 
                    onEdit={setEditingExpense}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="no-records-row">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-bar">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-page"
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-page"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit Expense Modal Overlay */}
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
