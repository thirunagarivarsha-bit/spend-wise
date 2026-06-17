import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Expense, Budget, ExpenseFilter, CategorySummary, MonthlyTrend, BudgetStatus } from '../types';
import { api } from '../services/api';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  budgets: Budget[];
  monthlyBudget: number;
  filters: ExpenseFilter;
  loading: boolean;
  error: string | null;
  toasts: ToastMessage[];
  categories: string[];
  categoryColors: Record<string, string>;
  isAuthenticated: boolean;
  currentUser: { name: string; email: string } | null;
  
  // Actions
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<boolean>;
  updateExpense: (id: string, updatedData: Partial<Expense>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  saveBudget: (budget: Budget) => Promise<boolean>;
  saveMonthlyBudget: (limit: number) => Promise<boolean>;
  setFilters: React.Dispatch<React.SetStateAction<ExpenseFilter>>;
  resetFilters: () => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  refreshData: () => Promise<void>;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  
  // Derived state
  filteredExpenses: Expense[];
  totalSpent: number;
  categorySummaries: CategorySummary[];
  monthlyTrend: MonthlyTrend[];
  budgetStatuses: BudgetStatus[];
  todaySpent: number;
  weekSpent: number;
  monthSpent: number;
  averageExpense: number;
}

const defaultFilters: ExpenseFilter = {
  search: '',
  category: 'All',
  status: 'All',
  startDate: '',
  endDate: '',
  sortBy: 'date',
  sortOrder: 'desc'
};

const CATEGORIES = [
  'Food & Dining',
  'Travel & Transport',
  'Utilities & Bills',
  'Software & Subscriptions',
  'Entertainment',
  'Other'
];

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#ff9f43',
  'Travel & Transport': '#54a0ff',
  'Utilities & Bills': '#1dd1a1',
  'Software & Subscriptions': '#5f27cd',
  'Entertainment': '#ff6b6b',
  'Other': '#8395a7'
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    const saved = localStorage.getItem('expensify_monthly_budget');
    return saved ? parseFloat(saved) : 15000;
  });
  const [filters, setFilters] = useState<ExpenseFilter>(defaultFilters);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Simulated authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('spendwise_auth') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('spendwise_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (password: string) => {
    if (password === 'admin123') {
      localStorage.setItem('spendwise_auth', 'true');
      const user = { name: 'Admin User', email: 'admin@spendwise.co' };
      localStorage.setItem('spendwise_user', JSON.stringify(user));
      setIsAuthenticated(true);
      setCurrentUser(user);
      showToast('Logged in successfully', 'success');
      return true;
    }
    showToast('Invalid passcode. Hint: admin123', 'error');
    return false;
  };

  const logout = () => {
    localStorage.removeItem('spendwise_auth');
    localStorage.removeItem('spendwise_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
    window.location.hash = '#/login';
  };

  // Toast helper
  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedExpenses = await api.getExpenses();
      const fetchedBudgets = await api.getBudgets();
      setExpenses(fetchedExpenses);
      setBudgets(fetchedBudgets);
    } catch (err: any) {
      setError(err.message || 'Failed to load data.');
      showToast('Error loading financial data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = async () => {
    await fetchData();
    showToast('Data refreshed successfully!', 'success');
  };

  // Actions
  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    setLoading(true);
    try {
      const newExp = await api.createExpense(expenseData);
      setExpenses(prev => [newExp, ...prev]);
      showToast(`Added "${newExp.title}" successfully`, 'success');
      return true;
    } catch (err: any) {
      showToast('Failed to add expense', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id: string, updatedData: Partial<Expense>) => {
    // Optimistic update for UI feel (important for drag-and-drop)
    const originalExpenses = [...expenses];
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, ...updatedData } : exp));
    
    try {
      await api.updateExpense(id, updatedData);
      return true;
    } catch (err: any) {
      setExpenses(originalExpenses); // Rollback
      showToast('Failed to update expense', 'error');
      return false;
    }
  };

  const deleteExpense = async (id: string) => {
    // Optimistic delete
    const originalExpenses = [...expenses];
    const itemToDelete = expenses.find(exp => exp.id === id);
    setExpenses(prev => prev.filter(exp => exp.id !== id));

    try {
      await api.deleteExpense(id);
      showToast(`Deleted "${itemToDelete?.title || 'Expense'}"`, 'info');
      return true;
    } catch (err: any) {
      setExpenses(originalExpenses); // Rollback
      showToast('Failed to delete expense', 'error');
      return false;
    }
  };

  const saveBudget = async (budget: Budget) => {
    setLoading(true);
    try {
      const newBudget = await api.saveBudget(budget);
      setBudgets(prev => {
        const index = prev.findIndex(b => b.category === budget.category);
        if (index > -1) {
          const updated = [...prev];
          updated[index] = newBudget;
          return updated;
        } else {
          return [...prev, newBudget];
        }
      });
      showToast(`Updated budget for ${budget.category}`, 'success');
      return true;
    } catch (err: any) {
      showToast('Failed to update budget', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const saveMonthlyBudget = useCallback(async (limit: number) => {
    setLoading(true);
    try {
      localStorage.setItem('expensify_monthly_budget', limit.toString());
      setMonthlyBudget(limit);
      showToast(`Monthly budget updated to Rs. ${limit}`, 'success');
      return true;
    } catch (err: any) {
      showToast('Failed to update monthly budget', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // -- DERIVED STATE CALCULATIONS (Optimized with useMemo) --

  // 1. Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      // Search filter (title or description)
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const inTitle = exp.title.toLowerCase().includes(query);
        const inDesc = exp.description ? exp.description.toLowerCase().includes(query) : false;
        if (!inTitle && !inDesc) return false;
      }
      // Category filter
      if (filters.category !== 'All' && exp.category !== filters.category) {
        return false;
      }
      // Status filter
      if (filters.status !== 'All' && exp.status !== filters.status) {
        return false;
      }
      // Date filter - Start Date
      if (filters.startDate && exp.date < filters.startDate) {
        return false;
      }
      // Date filter - End Date
      if (filters.endDate && exp.date > filters.endDate) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'date') {
        comparison = a.date.localeCompare(b.date);
      } else if (filters.sortBy === 'amount') {
        comparison = a.amount - b.amount;
      } else if (filters.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [expenses, filters]);

  // 2. Total spent (for filtered set)
  const totalSpent = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  // 3. Category Summaries (total/percentage for each category, and color)
  const categorySummaries = useMemo(() => {
    const totalAll = expenses.reduce((sum, e) => sum + e.amount, 0);
    const map: Record<string, number> = {};
    
    // Initialize all categories with 0
    CATEGORIES.forEach(cat => {
      map[cat] = 0;
    });

    expenses.forEach(exp => {
      const cat = CATEGORIES.includes(exp.category) ? exp.category : 'Other';
      map[cat] = (map[cat] || 0) + exp.amount;
    });

    return Object.keys(map)
      .map(cat => ({
        category: cat,
        amount: parseFloat(map[cat].toFixed(2)),
        percentage: totalAll > 0 ? parseFloat(((map[cat] / totalAll) * 100).toFixed(1)) : 0,
        color: CATEGORY_COLORS[cat] || '#8395a7'
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  // 4. Monthly Trend
  const monthlyTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dataMap: Record<string, number> = {};

    expenses.forEach(exp => {
      if (!exp.date) return;
      const dateObj = new Date(exp.date);
      const label = `${months[dateObj.getMonth()]} ${dateObj.getFullYear().toString().slice(-2)}`;
      dataMap[label] = (dataMap[label] || 0) + exp.amount;
    });

    // Sort chronologically
    return Object.keys(dataMap)
      .map(key => ({
        month: key,
        amount: parseFloat(dataMap[key].toFixed(2))
      }))
      .sort((a, b) => {
        const parseDate = (str: string) => {
          const parts = str.split(' ');
          const monthIdx = months.indexOf(parts[0]);
          const year = parseInt(`20${parts[1]}`);
          return new Date(year, monthIdx);
        };
        return parseDate(a.month).getTime() - parseDate(b.month).getTime();
      });
  }, [expenses]);

  // 5. Budget Statuses
  const budgetStatuses = useMemo(() => {
    return budgets.map(b => {
      // Calculate total spent in this category
      const spent = expenses
        .filter(e => e.category === b.category)
        .reduce((sum, e) => sum + e.amount, 0);
      
      const percentage = b.limit > 0 ? parseFloat(((spent / b.limit) * 100).toFixed(1)) : 0;

      return {
        category: b.category,
        limit: b.limit,
        spent: parseFloat(spent.toFixed(2)),
        percentage
      };
    });
  }, [expenses, budgets]);

  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  // 6. Today's expense total
  const todaySpent = useMemo(() => {
    const todayStr = getLocalDateString(new Date());
    return expenses
      .filter(e => e.date === todayStr)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  // 7. This Week's expense total
  const weekSpent = useMemo(() => {
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    return expenses
      .filter(e => {
        if (!e.date) return false;
        const eDate = new Date(e.date + 'T00:00:00');
        return eDate >= startOfWeek && eDate <= now;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  // 8. This Month's expense total
  const monthSpent = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    return expenses
      .filter(e => {
        if (!e.date) return false;
        const eDate = new Date(e.date + 'T00:00:00');
        return eDate.getFullYear() === currentYear && eDate.getMonth() === currentMonth;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  // 9. Average Expense
  const averageExpense = useMemo(() => {
    if (expenses.length === 0) return 0;
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    return total / expenses.length;
  }, [expenses]);

  return (
    <ExpenseContext.Provider value={{
      expenses,
      budgets,
      monthlyBudget,
      filters,
      loading,
      error,
      toasts,
      categories: CATEGORIES,
      categoryColors: CATEGORY_COLORS,
      
      addExpense,
      updateExpense,
      deleteExpense,
      saveBudget,
      saveMonthlyBudget,
      setFilters,
      resetFilters,
      showToast,
      dismissToast,
      refreshData,
      login,
      logout,
      isAuthenticated,
      currentUser,
      
      filteredExpenses,
      totalSpent,
      categorySummaries,
      monthlyTrend,
      budgetStatuses,
      todaySpent,
      weekSpent,
      monthSpent,
      averageExpense
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
