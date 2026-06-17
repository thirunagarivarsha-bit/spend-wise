import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { FilterPanel } from '../components/list/FilterPanel';
import { ExpenseForm } from '../components/entry/ExpenseForm';
import { 
  Trash2, 
  X,
  Edit2
} from 'lucide-react';
import type { Expense, ExpenseStatus } from '../types';

export const PipelineView: React.FC = () => {
  const { 
    filteredExpenses, 
    updateExpense, 
    deleteExpense, 
    categoryColors 
  } = useExpenses();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Drag and Drop Handlers for Kanban Board
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: ExpenseStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      await updateExpense(id, { status: newStatus });
    }
  };

  const statusColumns: { id: ExpenseStatus; label: string; colorClass: string }[] = [
    { id: 'Draft', label: 'Draft', colorClass: 'border-t-gray-500 bg-gray-50/10' },
    { id: 'Pending', label: 'Pending', colorClass: 'border-t-amber-500 bg-amber-50/10' },
    { id: 'Approved', label: 'Approved', colorClass: 'border-t-blue-500 bg-blue-50/10' },
    { id: 'Paid', label: 'Paid', colorClass: 'border-t-emerald-500 bg-emerald-50/10' }
  ];

  return (
    <div className="list-view-container">
      {/* Top Action bar */}
      <div className="list-header-bar">
        <div>
          <h2 className="page-title">Pipeline Board</h2>
          <p className="page-subtitle">Drag and drop payments through processing stages</p>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel />

      {/* Kanban Board View */}
      <div className="kanban-board" style={{ marginTop: '12px' }}>
        {statusColumns.map(col => {
          const columnExpenses = filteredExpenses.filter(e => e.status === col.id);
          const totalSum = columnExpenses.reduce((acc, curr) => acc + curr.amount, 0);

          return (
            <div 
              key={col.id} 
              className={`kanban-column ${col.colorClass}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="column-header">
                <div className="column-header-info">
                  <span className="column-title">{col.label}</span>
                  <span className="column-badge">{columnExpenses.length}</span>
                </div>
                <span className="column-sum">Rs. {totalSum.toFixed(2)}</span>
              </div>

              <div className="column-cards-container">
                {columnExpenses.length > 0 ? (
                  columnExpenses.map(expense => (
                    <div 
                      key={expense.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, expense.id)}
                      className="kanban-card"
                    >
                      <div className="card-top">
                        <span 
                          className="card-category"
                          style={{ 
                            backgroundColor: `${categoryColors[expense.category] || '#8395a7'}18`,
                            color: categoryColors[expense.category] || '#8395a7',
                            borderColor: categoryColors[expense.category] || '#8395a7'
                          }}
                        >
                          {expense.category}
                        </span>
                        <div className="card-actions-quick">
                          <button 
                            onClick={() => setEditingExpense(expense)}
                            className="quick-action-btn edit" 
                            title="Edit"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Delete "${expense.title}"?`)) {
                                deleteExpense(expense.id);
                              }
                            }}
                            className="quick-action-btn delete" 
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <h4 className="card-title">{expense.title}</h4>
                      {expense.description && (
                        <p className="card-desc">{expense.description}</p>
                      )}

                      <div className="card-footer">
                        <span className="card-date">
                          {new Date(expense.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                        </span>
                        <span className="card-amount">Rs. {expense.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="column-empty-state">
                    Drag here
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
