import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExpenseProvider, useExpenses } from '../context/ExpenseContext';
import { ExpenseForm } from '../components/entry/ExpenseForm';
import { describe, it, expect, beforeEach } from 'vitest';

// Simulates a simplified log layout next to the form
const FullFlowTestLayout = () => {
  const { expenses, totalSpent, loading } = useExpenses();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <ExpenseForm />
      <div data-testid="spent-sum">{totalSpent}</div>
      <div data-testid="log-list">
        {expenses.map(e => (
          <div key={e.id} data-testid="expense-item">
            {e.title} - {e.amount}
          </div>
        ))}
      </div>
    </div>
  );
};

describe('Full Workflow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a new expense successfully and updates total spent sum', async () => {
    render(
      <ExpenseProvider>
        <FullFlowTestLayout />
      </ExpenseProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    const initialTotal = screen.getByTestId('spent-sum').textContent;
    expect(initialTotal).toBe('2676'); // Initial total from 10 default expenses

    // Populate input fields
    const titleInput = screen.getByPlaceholderText('e.g. AWS Cloud Hosting');
    const amountInput = screen.getByPlaceholderText('0.00');
    const categorySelect = screen.getByLabelText(/Category/i);

    fireEvent.change(titleInput, { target: { value: 'New Office Desk' } });
    fireEvent.change(amountInput, { target: { value: '250.00' } });
    fireEvent.change(categorySelect, { target: { value: 'Other' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Add Expense/i });
    fireEvent.click(submitBtn);

    // Wait until the new element is added to the log list
    await waitFor(() => {
      expect(screen.queryByText('New Office Desk - 250')).not.toBeNull();
    });

    // Check that the sum has updated: 2676 + 250 = 2926
    const updatedTotal = screen.getByTestId('spent-sum').textContent;
    expect(updatedTotal).toBe('2926');
  });
});
