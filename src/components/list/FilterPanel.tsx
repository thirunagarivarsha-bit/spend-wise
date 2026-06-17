import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

export const FilterPanel: React.FC = () => {
  const { filters, setFilters, resetFilters, categories } = useExpenses();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, category: e.target.value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, startDate: e.target.value }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, endDate: e.target.value }));
  };

  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value as any }));
  };

  return (
    <div className="filter-panel">
      <div className="filter-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="filter-header-title">
          <Filter size={18} />
          <span>Search & Filters</span>
        </div>
        <button className="filter-toggle-btn" aria-label="Toggle Filters">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      <div className={`filter-body ${isOpen ? 'open' : ''}`}>
        <div className="filter-grid">
          <div className="filter-group text-search">
            <label htmlFor="filter-search" className="filter-label">Search</label>
            <input
              id="filter-search"
              type="text"
              placeholder="Search description or title..."
              value={filters.search}
              onChange={handleSearchChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="filter-category" className="filter-label">Category</label>
            <select
              id="filter-category"
              value={filters.category}
              onChange={handleCategoryChange}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-status" className="filter-label">Status</label>
            <select
              id="filter-status"
              value={filters.status}
              onChange={handleStatusChange}
              className="filter-select"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="filter-grid second-row">
          <div className="filter-group">
            <label htmlFor="filter-start-date" className="filter-label">From Date</label>
            <input
              id="filter-start-date"
              type="date"
              value={filters.startDate}
              onChange={handleStartDateChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="filter-end-date" className="filter-label">To Date</label>
            <input
              id="filter-end-date"
              type="date"
              value={filters.endDate}
              onChange={handleEndDateChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group sort-group">
            <label htmlFor="filter-sort-by" className="filter-label">Sort By</label>
            <div className="sort-control-wrapper">
              <select
                id="filter-sort-by"
                value={filters.sortBy}
                onChange={handleSortByChange}
                className="filter-select sort-select"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="title">Title</option>
              </select>
              <button 
                onClick={toggleSortOrder} 
                className="sort-direction-btn" 
                title={filters.sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
              >
                {filters.sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={resetFilters} className="btn-secondary flex items-center gap-1 text-sm">
            <RotateCcw size={14} /> Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};
