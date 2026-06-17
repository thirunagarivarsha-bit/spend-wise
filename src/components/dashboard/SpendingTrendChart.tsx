import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';

export const SpendingTrendChart: React.FC = () => {
  const { monthlyTrend } = useExpenses();
  const [activePoint, setActivePoint] = useState<{ x: number; y: number; month: string; amount: number } | null>(null);

  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = 600;
  const height = 250;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const chartData = React.useMemo(() => {
    if (!monthlyTrend || monthlyTrend.length === 0) return { points: [], linePath: '', areaPath: '', yTicks: [] };

    // Ensure we have at least 2 points to draw lines, if 1, duplicate it to draw a flat line
    const data = monthlyTrend.length === 1 
      ? [{ month: '', amount: monthlyTrend[0].amount }, ...monthlyTrend] 
      : monthlyTrend;

    const maxAmount = Math.max(...data.map(d => d.amount), 100) * 1.1; // 10% padding on top
    
    const points = data.map((d, index) => {
      const x = padding.left + (index / (data.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - (d.amount / maxAmount) * chartHeight;
      return { x, y, month: d.month, amount: d.amount };
    });

    // Build path strings
    let linePath = '';
    let areaPath = '';

    if (points.length > 0) {
      linePath = `M ${points[0].x} ${points[0].y}`;
      areaPath = `M ${points[0].x} ${padding.top + chartHeight}`;
      
      points.forEach((p, idx) => {
        if (idx === 0) {
          areaPath += ` L ${p.x} ${p.y}`;
        } else {
          linePath += ` L ${p.x} ${p.y}`;
          areaPath += ` L ${p.x} ${p.y}`;
        }
      });

      areaPath += ` L ${points[points.length - 1].x} ${padding.top + chartHeight} Z`;
    }

    // Generate Y axis ticks
    const yTicks = [0, 0.25, 0.5, 0.75, 1].map(pct => {
      const val = maxAmount * pct;
      const y = padding.top + chartHeight - (val / maxAmount) * chartHeight;
      return { y, value: Math.round(val) };
    });

    return { points, linePath, areaPath, yTicks };
  }, [monthlyTrend, chartWidth, chartHeight]);

  const handleMouseEnter = (point: typeof activePoint) => {
    setActivePoint(point);
  };

  const handleMouseLeave = () => {
    setActivePoint(null);
  };

  if (!monthlyTrend || monthlyTrend.length === 0) {
    return (
      <div className="empty-chart">
        <p>No historical data available. Add some expenses to view trends.</p>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <h3 className="chart-header-title">Monthly Trend</h3>
      <div className="svg-container" style={{ position: 'relative' }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {chartData.yTicks.map((tick, i) => (
            <g key={i}>
              <line 
                x1={padding.left} 
                y1={tick.y} 
                x2={width - padding.right} 
                y2={tick.y} 
                stroke="var(--border-color)" 
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text 
                x={padding.left - 10} 
                y={tick.y + 4} 
                textAnchor="end" 
                fill="var(--text-secondary)" 
                fontSize="11px"
              >
                Rs.{tick.value}
              </text>
            </g>
          ))}

          {/* X axis labels */}
          {chartData.points.map((p, i) => (
            p.month ? (
              <text 
                key={i} 
                x={p.x} 
                y={height - 15} 
                textAnchor="middle" 
                fill="var(--text-secondary)" 
                fontSize="11px"
              >
                {p.month}
              </text>
            ) : null
          ))}

          {/* Area Path */}
          {chartData.areaPath && (
            <path 
              d={chartData.areaPath} 
              fill="url(#chartAreaGradient)"
            />
          )}

          {/* Line Path */}
          {chartData.linePath && (
            <path 
              d={chartData.linePath} 
              fill="none" 
              stroke="var(--primary-color)" 
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive points */}
          {chartData.points.map((p, i) => (
            p.month ? (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={activePoint && activePoint.month === p.month ? 7 : 5}
                fill="var(--primary-color)"
                stroke="var(--bg-card)"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                onMouseEnter={() => handleMouseEnter(p)}
                onMouseLeave={handleMouseLeave}
              />
            ) : null
          ))}
        </svg>

        {/* HTML Tooltip overlay */}
        {activePoint && (
          <div 
            className="chart-tooltip" 
            style={{ 
              position: 'absolute', 
              left: `${(activePoint.x / width) * 100}%`, 
              top: `${(activePoint.y / height) * 100 - 15}%`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            <div className="tooltip-title">{activePoint.month}</div>
            <div className="tooltip-value">Rs. {activePoint.amount.toFixed(2)}</div>
          </div>
        )}
      </div>
    </div>
  );
};
