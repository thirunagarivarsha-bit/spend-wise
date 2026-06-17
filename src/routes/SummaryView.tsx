import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { SpendingTrendChart } from '../components/dashboard/SpendingTrendChart';
import { CardSkeleton, ChartSkeleton } from '../components/common/Skeleton';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Card } from '../components/common/Card';

export const SummaryView: React.FC = () => {
  const { loading, error, refreshData } = useExpenses();

  if (error) {
    return (
      <div className="error-container">
        <Card className="error-card">
          <div className="error-content">
            <AlertCircle size={48} className="text-error" />
            <h3>Failed to load financial data</h3>
            <p>{error}</p>
            <button onClick={refreshData} className="btn-primary flex items-center gap-2">
              <RefreshCw size={16} /> Retry Connection
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h2 className="page-title">Financial Dashboard</h2>
          <p className="page-subtitle">A high-level view of your expenses and spending trends</p>
        </div>
        <div>
          <button 
            onClick={refreshData} 
            className={`btn-icon-refresh ${loading ? 'spinning' : ''}`}
            disabled={loading}
            title="Refresh Data"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="summary-cards-grid">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <SummaryCards />
      )}

      {/* Full-width Trend Chart */}
      <div style={{ marginTop: '24px' }}>
        <Card title="Expense Trend Over Time" className="chart-card" style={{ padding: '24px' }}>
          {loading ? <ChartSkeleton /> : <SpendingTrendChart />}
        </Card>
      </div>
    </div>
  );
};
