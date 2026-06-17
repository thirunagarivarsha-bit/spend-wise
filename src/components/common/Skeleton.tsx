import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="skeleton-card pulsing">
      <div className="skeleton-line short" />
      <div className="skeleton-line medium" />
      <div className="skeleton-line long" />
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="skeleton-chart-container pulsing">
      <div className="skeleton-chart-bar-wrap">
        <div className="skeleton-chart-bar hb-1" />
        <div className="skeleton-chart-bar hb-2" />
        <div className="skeleton-chart-bar hb-3" />
        <div className="skeleton-chart-bar hb-4" />
        <div className="skeleton-chart-bar hb-5" />
      </div>
      <div className="skeleton-line long center-margin" />
    </div>
  );
};

export const ListSkeleton: React.FC = () => {
  return (
    <div className="skeleton-list-container pulsing">
      {[1, 2, 3, 4, 5].map((val) => (
        <div key={val} className="skeleton-list-row">
          <div className="skeleton-circle" />
          <div className="skeleton-row-details">
            <div className="skeleton-line short" />
            <div className="skeleton-line long" />
          </div>
          <div className="skeleton-badge" />
        </div>
      ))}
    </div>
  );
};
