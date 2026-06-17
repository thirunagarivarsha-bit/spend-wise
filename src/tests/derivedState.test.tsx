import { render, screen, waitFor } from '@testing-library/react';
import { ExpenseProvider, useExpenses } from '../context/ExpenseContext';
import { describe, it, expect, beforeEach } from 'vitest';

// Simple component to dump context values to DOM so we can test them
const TestComponent = () => {
  const { expenses, totalSpent, averageExpense, loading } = useExpenses();

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div>
      <span data-testid="count">{expenses.length}</span>
      <span data-testid="total">{totalSpent}</span>
      <span data-testid="avg">{averageExpense.toFixed(2)}</span>
    </div>
  );
};

describe('Global Context Derived State Math', () => {
  beforeEach(() => {
    // Clean mock localStorage state before running
    localStorage.clear();
  });

  it('calculates total and average spent from mock initial database', async () => {
    render(
      <ExpenseProvider>
        <TestComponent />
      </ExpenseProvider>
    );

    // Wait until mock loading overlay finishes
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).toBeNull();
    });

    // Check count and math calculations from default initial list
    expect(screen.getByTestId('count').textContent).toBe('10');
    expect(screen.getByTestId('total').textContent).toBe('2676');
    expect(screen.getByTestId('avg').textContent).toBe('267.60');
  });
});
