import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { CategoryDonutChart } from '../components/dashboard/CategoryDonutChart';
import { Card } from '../components/common/Card';
import { BarChart3, TrendingUp, Compass, Award } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { categorySummaries, expenses } = useExpenses();

  const totalSpent = React.useMemo(() => {
    return categorySummaries.reduce((sum, item) => sum + item.amount, 0);
  }, [categorySummaries]);

  // Derived stats
  const activeCategories = React.useMemo(() => {
    return categorySummaries.filter(c => c.amount > 0);
  }, [categorySummaries]);

  const topCategory = React.useMemo(() => {
    if (activeCategories.length === 0) return null;
    return activeCategories[0]; // Already sorted by amount desc in context
  }, [activeCategories]);

  const categoryAverage = React.useMemo(() => {
    if (activeCategories.length === 0) return 0;
    return totalSpent / activeCategories.length;
  }, [activeCategories, totalSpent]);

  // Transaction count per category
  const transactionCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    expenses.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, [expenses]);

  return (
    <div className="analytics-container">
      <div className="dashboard-header" style={{ marginBottom: '8px' }}>
        <div>
          <h2 className="page-title">Category Analytics</h2>
          <p className="page-subtitle">Deep dive insights into where your money goes</p>
        </div>
      </div>

      {/* Grid of Highlight Cards */}
      <div className="summary-cards-grid" style={{ marginBottom: '24px' }}>
        <div className="metric-card">
          <div className="metric-icon bg-primary-soft text-primary">
            <Award size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Top Category</span>
            <h2 className="metric-value" style={{ fontSize: '18px' }} title={topCategory ? topCategory.category : 'N/A'}>
              {topCategory ? topCategory.category : 'N/A'}
            </h2>
            <span className="metric-subtext">
              {topCategory ? `Rs. ${topCategory.amount.toFixed(0)} spent` : 'No expenses logged'}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-success-soft text-success">
            <Compass size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Active Sectors</span>
            <h2 className="metric-value">
              {activeCategories.length} / {categorySummaries.length}
            </h2>
            <span className="metric-subtext">Categories used this month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-info-soft text-info">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Category Avg</span>
            <h2 className="metric-value">
              Rs. {categoryAverage.toFixed(0)}
            </h2>
            <span className="metric-subtext">Average spend per category</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-warning-soft text-warning">
            <BarChart3 size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Volume</span>
            <h2 className="metric-value">
              {expenses.length}
            </h2>
            <span className="metric-subtext">Total logged transactions</span>
          </div>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="charts-grid" style={{ gridTemplateColumns: '1.2fr 1.8fr' }}>
        {/* Left: Donut Chart */}
        <Card title="Category Distribution" className="chart-card">
          <CategoryDonutChart />
        </Card>

        {/* Right: Detailed List breakdown */}
        <Card title="Detailed Breakdown" className="chart-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="table-responsive">
              <table className="expense-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Category</th>
                    <th style={{ padding: '8px 12px', color: 'var(--text-secondary)', textAlign: 'right' }}>Total Spent</th>
                    <th style={{ padding: '8px 12px', color: 'var(--text-secondary)', textAlign: 'right' }}>Share</th>
                    <th style={{ padding: '8px 12px', color: 'var(--text-secondary)', textAlign: 'center' }}>Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {categorySummaries.map((catSummary) => {
                    const count = transactionCounts[catSummary.category] || 0;
                    return (
                      <tr 
                        key={catSummary.category} 
                        style={{ 
                          borderBottom: '1px solid var(--border-color)',
                          opacity: catSummary.amount > 0 ? 1 : 0.5 
                        }}
                      >
                        <td style={{ padding: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span 
                            style={{ 
                              display: 'inline-block',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: catSummary.color 
                            }} 
                          />
                          {catSummary.category}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                          Rs. {catSummary.amount.toFixed(2)}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                          {catSummary.percentage}%
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          {count}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
