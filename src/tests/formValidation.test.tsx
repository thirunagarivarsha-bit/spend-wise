import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExpenseProvider } from '../context/ExpenseContext';
import { ExpenseForm } from '../components/entry/ExpenseForm';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ExpenseForm Client-side Input Validation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('triggers validation errors when submitting an empty form', async () => {
    render(
      <ExpenseProvider>
        <ExpenseForm />
      </ExpenseProvider>
    );

    // Wait until load state completes and component is ready
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Add Expense/i })).toBeDefined();
    });

    // Clear the auto-filled title (default empty) and click submit
    const submitBtn = screen.getByRole('button', { name: /Add Expense/i });
    fireEvent.click(submitBtn);

    // Validate that required warnings appear on screen
    expect(screen.getByText('Title is required')).toBeDefined();
    expect(screen.getByText('Amount is required')).toBeDefined();
  });
});
