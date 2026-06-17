import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';

export const CategoryDonutChart: React.FC = () => {
  const { categorySummaries } = useExpenses();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalAmount = React.useMemo(() => {
    return categorySummaries.reduce((sum, item) => sum + item.amount, 0);
  }, [categorySummaries]);

  // SVG parameters
  const size = 200;
  const radius = 65;
  const strokeWidth = 24;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius; // ~408.4

  // Calculate angles & offsets
  let accumulatedPercent = 0;
  const chartWedges = categorySummaries
    .filter(item => item.amount > 0)
    .map((item, index) => {
      const percentage = (item.amount / totalAmount) * 100;
      const strokeOffset = circumference - (circumference * percentage) / 100;
      const rotation = (accumulatedPercent / 100) * 360 - 90; // Start at top (-90 deg)
      accumulatedPercent += percentage;

      return {
        ...item,
        percentage,
        strokeOffset,
        rotation,
        index
      };
    });

  if (totalAmount === 0) {
    return (
      <div className="empty-chart">
        <p className="no-data-text">No expense data to display.</p>
      </div>
    );
  }

  return (
    <div className="donut-chart-container">
      <div className="donut-svg-wrapper">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle / track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="var(--bg-card-hover)"
            strokeWidth={strokeWidth}
          />
          {chartWedges.map((wedge) => {
            const isHovered = hoveredIdx === wedge.index;
            return (
              <circle
                key={wedge.category}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={wedge.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={wedge.strokeOffset}
                transform={`rotate(${wedge.rotation} ${center} ${center})`}
                strokeLinecap="round"
                className="donut-slice"
                onMouseEnter={() => setHoveredIdx(wedge.index)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              />
            );
          })}
          {/* Inner label showing total */}
          <g transform={`translate(${center}, ${center})`}>
            <text
              textAnchor="middle"
              dy="-5px"
              fill="var(--text-secondary)"
              fontSize="12px"
              fontWeight="bold"
            >
              TOTAL SPENT
            </text>
            <text
              textAnchor="middle"
              dy="15px"
              fill="var(--text-primary)"
              fontSize="18px"
              fontWeight="extrabold"
            >
              Rs.{totalAmount.toFixed(0)}
            </text>
          </g>
        </svg>
      </div>

      <div className="donut-legend">
        {categorySummaries.map((item, index) => {
          if (item.amount === 0) return null;
          const isHovered = hoveredIdx === index;
          return (
            <div
              key={item.category}
              className={`legend-item ${isHovered ? 'active' : ''}`}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <span
                className="legend-badge"
                style={{ backgroundColor: item.color }}
              />
              <span className="legend-label">{item.category}</span>
              <span className="legend-value">Rs. {item.amount.toFixed(2)}</span>
              <span className="legend-percentage">({item.percentage}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
