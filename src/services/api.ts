import type { Expense, Budget } from '../types';

const STORAGE_KEY_EXPENSES = 'expensify_expenses';
const STORAGE_KEY_BUDGETS = 'expensify_budgets';
const DELAY = 0; // Simulated network delay in ms

const defaultExpenses: Expense[] = [
  {
    id: '1',
    title: 'AWS Cloud Hosting',
    amount: 145.50,
    category: 'Software & Subscriptions',
    date: '2026-06-12',
    paymentMethod: 'Credit Card',
    status: 'Paid',
    description: 'Monthly production server hosting.'
  },
  {
    id: '2',
    title: 'Client Lunch - Pizzeria',
    amount: 85.20,
    category: 'Food & Dining',
    date: '2026-06-10',
    paymentMethod: 'Credit Card',
    status: 'Approved',
    description: 'Lunch meeting with Acme Corp representatives.'
  },
  {
    id: '3',
    title: 'Uber to Conference',
    amount: 24.50,
    category: 'Travel & Transport',
    date: '2026-06-08',
    paymentMethod: 'Cash',
    status: 'Paid',
    description: 'Ride to the Tech Expo center.'
  },
  {
    id: '4',
    title: 'GitHub Enterprise Annual',
    amount: 300.00,
    category: 'Software & Subscriptions',
    date: '2026-06-05',
    paymentMethod: 'Bank Transfer',
    status: 'Pending',
    description: 'Annual subscription renewal for team seat.'
  },
  {
    id: '5',
    title: 'Internet & Phone Bundle',
    amount: 90.00,
    category: 'Utilities & Bills',
    date: '2026-06-01',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    description: 'Office internet and VoIP services.'
  },
  {
    id: '6',
    title: 'Office Snacks and Coffee',
    amount: 45.80,
    category: 'Food & Dining',
    date: '2026-05-28',
    paymentMethod: 'Debit Card',
    status: 'Paid',
    description: 'Groceries for the breakroom pantry.'
  },
  {
    id: '7',
    title: 'Flights to annual retreat',
    amount: 450.00,
    category: 'Travel & Transport',
    date: '2026-05-15',
    paymentMethod: 'Credit Card',
    status: 'Approved',
    description: 'Roundtrip flights for summer meetup.'
  },
  {
    id: '8',
    title: 'Team Building Dinner',
    amount: 210.00,
    category: 'Entertainment',
    date: '2026-05-20',
    paymentMethod: 'Credit Card',
    status: 'Approved',
    description: 'Celebrating project completion at Bistro Bistro.'
  },
  {
    id: '9',
    title: 'Office Rent - June',
    amount: 1200.00,
    category: 'Utilities & Bills',
    date: '2026-06-01',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    description: 'Monthly office space lease.'
  },
  {
    id: '10',
    title: 'Team T-shirts Printing',
    amount: 125.00,
    category: 'Other',
    date: '2026-06-07',
    paymentMethod: 'Debit Card',
    status: 'Draft',
    description: 'Custom swag for team members.'
  }
];

const defaultBudgets: Budget[] = [
  { category: 'Food & Dining', limit: 400 },
  { category: 'Travel & Transport', limit: 600 },
  { category: 'Utilities & Bills', limit: 1500 },
  { category: 'Software & Subscriptions', limit: 500 },
  { category: 'Entertainment', limit: 300 },
  { category: 'Other', limit: 200 }
];

// Helper to initialize local storage if empty
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY_EXPENSES)) {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(defaultExpenses));
  }
  if (!localStorage.getItem(STORAGE_KEY_BUDGETS)) {
    localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(defaultBudgets));
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getExpenses: async (): Promise<Expense[]> => {
    await delay(DELAY);
    initStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEY_EXPENSES) || '[]');
  },

  saveExpenses: async (expenses: Expense[]): Promise<void> => {
    await delay(DELAY - 200); // slightly shorter write delay
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
  },

  createExpense: async (expenseData: Omit<Expense, 'id'>): Promise<Expense> => {
    await delay(DELAY);
    initStorage();
    const expenses = JSON.parse(localStorage.getItem(STORAGE_KEY_EXPENSES) || '[]');
    const newExpense: Expense = {
      ...expenseData,
      id: Math.random().toString(36).substr(2, 9) // Simple unique ID generator
    };
    expenses.unshift(newExpense); // Put newest on top
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
    return newExpense;
  },

  updateExpense: async (id: string, updatedData: Partial<Expense>): Promise<Expense> => {
    await delay(DELAY);
    initStorage();
    const expenses: Expense[] = JSON.parse(localStorage.getItem(STORAGE_KEY_EXPENSES) || '[]');
    const index = expenses.findIndex(exp => exp.id === id);
    if (index === -1) throw new Error('Expense not found');
    
    expenses[index] = { ...expenses[index], ...updatedData };
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
    return expenses[index];
  },

  deleteExpense: async (id: string): Promise<boolean> => {
    await delay(DELAY);
    initStorage();
    const expenses: Expense[] = JSON.parse(localStorage.getItem(STORAGE_KEY_EXPENSES) || '[]');
    const filtered = expenses.filter(exp => exp.id !== id);
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(filtered));
    return true;
  },

  getBudgets: async (): Promise<Budget[]> => {
    await delay(DELAY - 100);
    initStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEY_BUDGETS) || '[]');
  },

  saveBudget: async (budget: Budget): Promise<Budget> => {
    await delay(DELAY);
    initStorage();
    const budgets: Budget[] = JSON.parse(localStorage.getItem(STORAGE_KEY_BUDGETS) || '[]');
    const index = budgets.findIndex(b => b.category === budget.category);
    if (index > -1) {
      budgets[index] = budget;
    } else {
      budgets.push(budget);
    }
    localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(budgets));
    return budget;
  }
};
