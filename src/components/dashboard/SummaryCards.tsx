import React from 'react';
import { Calendar, CalendarDays, CalendarRange, IndianRupee } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

export const SummaryCards: React.FC = () => {
  const { todaySpent, weekSpent, monthSpent, averageExpense } = useExpenses();

  return (
    <div className="summary-cards-grid">
      <div className="metric-card">
        <div className="metric-icon bg-info-soft text-info">
          <Calendar size={24} />
        </div>
        <div className="metric-content">
          <span className="metric-label">Today's Expense</span>
          <h2 className="metric-value">Rs. {todaySpent.toFixed(2)}</h2>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon bg-warning-soft text-warning">
          <CalendarDays size={24} />
        </div>
        <div className="metric-content">
          <span className="metric-label">This Week's Expense</span>
          <h2 className="metric-value">Rs. {weekSpent.toFixed(2)}</h2>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon bg-primary-soft text-primary">
          <CalendarRange size={24} />
        </div>
        <div className="metric-content">
          <span className="metric-label">This Month's Expense</span>
          <h2 className="metric-value">Rs. {monthSpent.toFixed(2)}</h2>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon bg-success-soft text-success">
          <IndianRupee size={24} />
        </div>
        <div className="metric-content">
          <span className="metric-label">Average Expense</span>
          <h2 className="metric-value">Rs. {averageExpense.toFixed(2)}</h2>
        </div>
      </div>
    </div>
  );
};
