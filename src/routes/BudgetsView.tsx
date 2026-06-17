import React, { useMemo } from 'react';
import { BudgetProgress } from '../components/dashboard/BudgetProgress';
import { Card } from '../components/common/Card';

export const BudgetsView: React.FC = () => {
  // Checks URL hash to toggle between sub-views
  const currentTab = useMemo(() => {
    return window.location.hash.endsWith('/categories') ? 'categories' : 'overall';
  }, []);

  const changeTab = (selectedTab: 'overall' | 'categories') => {
    window.location.hash = `#/budgets/${selectedTab}`;
  };

  return (
    <div className="budgets-view-container">
      <div className="dashboard-header" style={{ marginBottom: '8px' }}>
        <div>
          <h2 className="page-title">Budgets & Targets</h2>
          <p className="page-subtitle">Configure overall monthly limits and allocate category thresholds</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        <button 
          onClick={() => changeTab('overall')}
          className={`btn-secondary ${currentTab === 'overall' ? 'active' : ''}`}
          style={{ 
            padding: '8px 16px', 
            borderRadius: '8px',
            fontSize: '13px',
            background: currentTab === 'overall' ? 'var(--primary-color)' : 'transparent',
            color: currentTab === 'overall' ? '#ffffff' : 'var(--text-secondary)',
            borderColor: currentTab === 'overall' ? 'var(--primary-color)' : 'var(--border-color)',
            cursor: 'pointer'
          }}
        >
          Overall Budget
        </button>
        <button 
          onClick={() => changeTab('categories')}
          className={`btn-secondary ${currentTab === 'categories' ? 'active' : ''}`}
          style={{ 
            padding: '8px 16px', 
            borderRadius: '8px',
            fontSize: '13px',
            background: currentTab === 'categories' ? 'var(--primary-color)' : 'transparent',
            color: currentTab === 'categories' ? '#ffffff' : 'var(--text-secondary)',
            borderColor: currentTab === 'categories' ? 'var(--primary-color)' : 'var(--border-color)',
            cursor: 'pointer'
          }}
        >
          Category Budgets
        </button>
      </div>

      <Card title={currentTab === 'overall' ? "Overall Monthly Limit" : "Category Allocation"} className="budget-card" style={{ padding: '32px' }}>
        <BudgetProgress showOnly={currentTab} />
      </Card>
    </div>
  );
};
