import React, { useMemo, useRef } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Card } from '../components/common/Card';
import { AlertTriangle, Lightbulb, ShieldAlert, Award } from 'lucide-react';

export const InsightsView: React.FC = () => {
  const { expenses, monthlyBudget, monthSpent, budgetStatuses } = useExpenses();
  const emailRef = useRef<HTMLInputElement>(null);
  const feedbackRef = useRef<HTMLTextAreaElement>(null);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const msg = feedbackRef.current?.value;
    if (email && msg) {
      alert(`Suggestion submitted! Thank you for helping us improve SpendWise.`);
      if (emailRef.current) emailRef.current.value = '';
      if (feedbackRef.current) feedbackRef.current.value = '';
    }
  };

  // Calculate Financial Health Score (0 - 100)
  const healthData = useMemo(() => {
    let score = 100;
    const details: string[] = [];
    let criticalAlertsCount = 0;
    let warningAlertsCount = 0;

    // 1. Overall Budget Check
    if (monthlyBudget > 0) {
      const spentPct = (monthSpent / monthlyBudget) * 100;
      if (spentPct >= 100) {
        score -= 40;
        criticalAlertsCount++;
        details.push('Overall monthly budget is exceeded. Deficit incurred.');
      } else if (spentPct >= 80) {
        score -= 15;
        warningAlertsCount++;
        details.push('Approaching overall monthly budget threshold (over 80%).');
      }
    }

    // 2. Category Budget Checks
    budgetStatuses.forEach(status => {
      if (status.limit > 0) {
        if (status.spent >= status.limit) {
          score -= 15;
          criticalAlertsCount++;
          details.push(`Budget limit exceeded for category "${status.category}".`);
        } else if (status.spent >= 0.8 * status.limit) {
          score -= 5;
          warningAlertsCount++;
          details.push(`Approaching budget limit for category "${status.category}" (over 80%).`);
        }
      }
    });

    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(score, 100));

    let rating = 'Excellent';
    let color = 'var(--success-color)';
    let ratingDescription = 'Your finances are in great shape. Keep up the disciplined budgeting!';
    
    if (score < 50) {
      rating = 'Critical';
      color = 'var(--error-color)';
      ratingDescription = 'Multiple budget overruns detected. Recommend pausing discretionary spend immediately.';
    } else if (score < 80) {
      rating = 'Warning';
      color = 'var(--warning-color)';
      ratingDescription = 'Minor budget overruns or warnings. Review active category limits soon.';
    }

    return {
      score,
      rating,
      color,
      ratingDescription,
      alerts: details,
      criticalCount: criticalAlertsCount,
      warningCount: warningAlertsCount
    };
  }, [monthlyBudget, monthSpent, budgetStatuses]);

  // Derived Savings Stats
  const savingsRate = useMemo(() => {
    if (monthlyBudget === 0) return 0;
    const savings = monthlyBudget - monthSpent;
    return (savings / monthlyBudget) * 100;
  }, [monthlyBudget, monthSpent]);

  const averageTransactionSize = useMemo(() => {
    if (expenses.length === 0) return 0;
    return monthSpent / expenses.length;
  }, [expenses, monthSpent]);

  // SVG Gauge calculations
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (healthData.score / 100) * circumference;

  // Custom AI Recommendations
  const recommendations = useMemo(() => {
    const tips: string[] = [];

    // General tips
    if (monthSpent === 0) {
      tips.push('No expenses recorded yet. Start adding expenses to receive smart optimization insights!');
      return tips;
    }

    const savings = monthlyBudget - monthSpent;
    if (savings > 0) {
      tips.push(`Excellent planning! You are on track to save Rs. ${savings.toFixed(0)} this month, representing a savings rate of ${savingsRate.toFixed(1)}%.`);
    } else {
      tips.push(`Budget deficit: You have overspent by Rs. ${Math.abs(savings).toFixed(0)} beyond your overall limit. Review your discretionary transactions.`);
    }

    // Top categories tips
    const highestSpentCategory = [...budgetStatuses].sort((a, b) => b.spent - a.spent)[0];
    if (highestSpentCategory && highestSpentCategory.spent > 0) {
      tips.push(`Your highest spending category is "${highestSpentCategory.category}" at Rs. ${highestSpentCategory.spent.toFixed(0)}. Try reducing minor expenses here.`);
    }

    // Transaction volume tips
    if (expenses.length > 15) {
      tips.push(`High transaction volume: You logged ${expenses.length} expenses this month. Consolidating purchases can help reduce impulsive shopping.`);
    }

    return tips;
  }, [expenses, monthlyBudget, monthSpent, budgetStatuses, savingsRate]);

  return (
    <div className="insights-view-container">
      <div className="dashboard-header" style={{ marginBottom: '8px' }}>
        <div>
          <h2 className="page-title">Smart Insights</h2>
          <p className="page-subtitle">Algorithmic metrics and budgeting optimization guidelines</p>
        </div>
      </div>

      {/* Grid: Health Score vs Key Metrics */}
      <div className="charts-grid" style={{ gridTemplateColumns: '1.2fr 1.8fr', marginBottom: '24px' }}>
        {/* Left: Financial Health Score Gauge */}
        <Card title="Financial Health Score" className="chart-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px' }}>
          <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg height="150" width="150">
              <circle
                stroke="var(--bg-card-hover)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx="75"
                cy="75"
              />
              <circle
                stroke={healthData.color}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                r={normalizedRadius}
                cx="75"
                cy="75"
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '36px', fontWeight: '800', color: healthData.color }}>
                {healthData.score}
              </span>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 'bold', marginTop: '-4px' }}>
                Score
              </span>
            </div>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: '800', marginTop: '16px', color: healthData.color }}>
            {healthData.rating} Rating
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.4' }}>
            {healthData.ratingDescription}
          </p>
        </Card>

        {/* Right: Key Performance Indicators */}
        <Card title="Key Metrics & Targets" className="chart-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Savings Rate</h4>
                <p style={{ fontSize: '22px', fontWeight: '800', color: savingsRate >= 0 ? 'var(--success-color)' : 'var(--error-color)' }}>
                  {savingsRate.toFixed(1)}%
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Average Ticket Size</h4>
                <p style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  Rs. {averageTransactionSize.toFixed(0)}
                </p>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Active Limit Status</h4>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, background: 'var(--bg-app)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--error-color)', fontWeight: 'bold' }}>
                    <ShieldAlert size={14} /> Over Budget
                  </span>
                  <span style={{ fontSize: '22px', fontWeight: '800', display: 'block', marginTop: '4px' }}>
                    {healthData.criticalCount}
                  </span>
                </div>
                <div style={{ flex: 1, background: 'var(--bg-app)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--warning-color)', fontWeight: 'bold' }}>
                    <AlertTriangle size={14} /> Warnings (80%+)
                  </span>
                  <span style={{ fontSize: '22px', fontWeight: '800', display: 'block', marginTop: '4px' }}>
                    {healthData.warningCount}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </Card>
      </div>

      {/* Grid: Alerts vs Tips */}
      <div className="charts-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        
        {/* Alerts Box */}
        <Card title="Active Alerts" className="chart-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {healthData.alerts.length > 0 ? (
              healthData.alerts.map((alert, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    alignItems: 'flex-start', 
                    background: alert.includes('exceeded') ? 'var(--error-soft)' : 'var(--warning-soft)',
                    borderLeft: `3px solid ${alert.includes('exceeded') ? 'var(--error-color)' : 'var(--warning-color)'}`,
                    padding: '12px',
                    borderRadius: '0 8px 8px 0'
                  }}
                >
                  <AlertTriangle 
                    size={18} 
                    style={{ 
                      color: alert.includes('exceeded') ? 'var(--error-color)' : 'var(--warning-color)', 
                      marginTop: '2px', 
                      flexShrink: 0 
                    }} 
                  />
                  <span style={{ fontSize: '13px', lineHeight: '1.4' }}>{alert}</span>
                </div>
              ))
            ) : (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--success-color)', background: 'var(--success-soft)', padding: '12px', borderRadius: '8px' }}>
                <Award size={18} />
                <span style={{ fontSize: '13px', fontWeight: '600' }}>No budget limits or thresholds exceeded. Excellent job!</span>
              </div>
            )}
          </div>
        </Card>

        {/* Smart Recommendations */}
        <Card title="Optimization Tips" className="chart-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendations.map((rec, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  alignItems: 'flex-start', 
                  background: 'var(--primary-soft)',
                  borderLeft: '3px solid var(--primary-color)',
                  padding: '12px',
                  borderRadius: '0 8px 8px 0'
                }}
              >
                <Lightbulb size={18} style={{ color: 'var(--primary-color)', marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', lineHeight: '1.4', color: 'var(--text-primary)' }}>{rec}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>

      <div style={{ marginTop: '24px' }}>
        <Card title="Quick Suggestions" subtitle="Help us improve SpendWise algorithms">
          <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  ref={emailRef} 
                  className="form-input" 
                  placeholder="you@domain.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Your Suggestion / Note</label>
                <textarea 
                  ref={feedbackRef} 
                  className="form-textarea" 
                  rows={3} 
                  placeholder="e.g. Include a dynamic savings goal tracker..."
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
              Submit Feedback
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};
