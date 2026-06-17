export type ExpenseStatus = 'Draft' | 'Pending' | 'Approved' | 'Paid';
export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  status: ExpenseStatus;
  description?: string;
}

export interface Budget {
  category: string;
  limit: number;
}

export interface ExpenseFilter {
  search: string;
  category: string;
  status: string;
  startDate: string;
  endDate: string;
  sortBy: 'date' | 'amount' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyTrend {
  month: string; // e.g. "Jan", "Feb"
  amount: number;
}

export interface BudgetStatus {
  category: string;
  limit: number;
  spent: number;
  percentage: number; // spent / limit * 100
}
