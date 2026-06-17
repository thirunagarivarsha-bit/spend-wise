import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { Edit2, Check, X } from 'lucide-react';

interface BudgetProgressProps {
  showOnly?: 'overall' | 'categories';
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({ showOnly }) => {
  const { 
    budgets, 
    budgetStatuses, 
    saveBudget, 
    categories, 
    monthlyBudget, 
    monthSpent, 
    saveMonthlyBudget 
  } = useExpenses();

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newLimit, setNewLimit] = useState<string>('');
  
  const [isEditingOverall, setIsEditingOverall] = useState(false);
  const [overallLimitInput, setOverallLimitInput] = useState('');

  const handleEditClick = (category: string, currentLimit: number) => {
    setEditingCategory(category);
    setNewLimit(currentLimit.toString());
  };

  const handleSave = async (category: string) => {
    const parsedLimit = parseFloat(newLimit);
    if (!isNaN(parsedLimit) && parsedLimit >= 0) {
      const success = await saveBudget({ category, limit: parsedLimit });
      if (success) {
        setEditingCategory(null);
      }
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
  };

  const handleEditOverallClick = () => {
    setIsEditingOverall(true);
    setOverallLimitInput(monthlyBudget.toString());
  };

  const handleSaveOverall = async () => {
    const parsedLimit = parseFloat(overallLimitInput);
    if (!isNaN(parsedLimit) && parsedLimit >= 0) {
      const success = await saveMonthlyBudget(parsedLimit);
      if (success) {
        setIsEditingOverall(false);
      }
    }
  };

  // Build a map of category status by merging configured budgets with categories
  const fullBudgetStatuses = React.useMemo(() => {
    return categories.map(category => {
      const statusObj = budgetStatuses.find(b => b.category === category);
      const limitObj = budgets.find(b => b.category === category);
      
      const limit = limitObj ? limitObj.limit : 0;
      const spent = statusObj ? statusObj.spent : 0;
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;

      return {
        category,
        limit,
        spent,
        percentage
      };
    });
  }, [categories, budgets, budgetStatuses]);

  const overallPercentage = monthlyBudget > 0 ? (monthSpent / monthlyBudget) * 100 : 0;
  const overallPct = Math.min(overallPercentage, 100);
  const remainingBudget = monthlyBudget - monthSpent;

  let overallColor = 'var(--success-color)';
  if (overallPercentage >= 100) {
    overallColor = 'var(--error-color)';
  } else if (overallPercentage >= 80) {
    overallColor = 'var(--warning-color)';
  }

  const renderOverall = () => (
    <div className="overall-budget-card">
      <div className="overall-budget-header">
        <span className="overall-budget-title">Overall Monthly Budget</span>
        {isEditingOverall ? (
          <div className="budget-edit-input-group">
            <span className="input-currency">₹</span>
            <input
              type="number"
              value={overallLimitInput}
              onChange={(e) => setOverallLimitInput(e.target.value)}
              className="budget-input-field"
              min="0"
              step="500"
              autoFocus
            />
            <button 
              onClick={handleSaveOverall} 
              className="btn-icon btn-save"
              title="Save Budget"
            >
              <Check size={14} />
            </button>
            <button 
              onClick={() => setIsEditingOverall(false)} 
              className="btn-icon btn-cancel"
              title="Cancel"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="budget-values-group">
            <button
              onClick={handleEditOverallClick}
              className="btn-icon btn-edit"
              title="Edit Overall Budget"
            >
              <Edit2 size={14} />
            </button>
          </div>
        )}
      </div>
      
      <div className="overall-budget-stats">
        <div className="budget-stat">
          <span className="stat-label">Budget</span>
          <span className="stat-value font-semibold">₹{monthlyBudget.toLocaleString()}</span>
        </div>
        <div className="budget-stat">
          <span className="stat-label">Spent</span>
          <span className="stat-value font-semibold">₹{monthSpent.toLocaleString()}</span>
        </div>
        <div className="budget-stat">
          <span className="stat-label">Remaining</span>
          <span className={`stat-value font-bold ${remainingBudget < 0 ? 'text-error' : 'text-success'}`}>
            ₹{remainingBudget.toLocaleString()}
          </span>
        </div>
      </div>
      
      <div className="progress-bar-bg large" style={{ height: '12px', marginTop: '8px' }}>
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${overallPct}%`, 
            backgroundColor: overallColor 
          }}
        />
      </div>
    </div>
  );

  const renderCategories = () => (
    <>
      <h3 className="section-title" style={{ marginBottom: '16px' }}>Category Budgets</h3>
      <div className="budget-list">
        {fullBudgetStatuses.map((budget) => {
          const isEditing = editingCategory === budget.category;
          const pct = Math.min(budget.percentage, 100);
          
          let progressColor = 'var(--success-color)';
          if (budget.percentage >= 100) {
            progressColor = 'var(--error-color)';
          } else if (budget.percentage >= 80) {
            progressColor = 'var(--warning-color)';
          }

          return (
            <div key={budget.category} className="budget-item">
              <div className="budget-item-header">
                <span className="budget-category-name">{budget.category}</span>
                {isEditing ? (
                  <div className="budget-edit-input-group">
                    <span className="input-currency">₹</span>
                    <input
                      type="number"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                      className="budget-input-field"
                      min="0"
                      step="10"
                      autoFocus
                    />
                    <button 
                      onClick={() => handleSave(budget.category)} 
                      className="btn-icon btn-save"
                      title="Save Budget"
                    >
                      <Check size={14} />
                    </button>
                    <button 
                      onClick={handleCancel} 
                      className="btn-icon btn-cancel"
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="budget-values-group">
                    <span className="budget-numbers">
                      <strong>₹{budget.spent.toFixed(0)}</strong> / ₹{budget.limit.toFixed(0)}
                    </span>
                    <button
                      onClick={() => handleEditClick(budget.category, budget.limit)}
                      className="btn-icon btn-edit"
                      title="Edit Budget"
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                )}
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${pct}%`, 
                    backgroundColor: progressColor 
                  }}
                />
              </div>
              {budget.limit > 0 && budget.percentage >= 100 && (
                <div className="budget-alert-text text-error">
                  Budget limit exceeded!
                </div>
              )}
              {budget.limit > 0 && budget.percentage >= 80 && budget.percentage < 100 && (
                <div className="budget-alert-text text-warning">
                  Approaching budget limit (80%+)
                </div>
              )}
              {budget.limit === 0 && (
                <div className="budget-alert-text text-muted">
                  No limit set. Click edit to set a budget.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="budget-section">
      {(!showOnly || showOnly === 'overall') && renderOverall()}
      {!showOnly && <div style={{ margin: '24px 0', borderBottom: '1px solid var(--border-color)' }} />}
      {(!showOnly || showOnly === 'categories') && renderCategories()}
    </div>
  );
};
