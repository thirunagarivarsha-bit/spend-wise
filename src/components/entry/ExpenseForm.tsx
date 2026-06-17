import React, { useState, useEffect, useRef } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import type { PaymentMethod, ExpenseStatus, Expense } from '../../types';

interface ExpenseFormProps {
  initialData?: Expense;
  onSuccess?: () => void;
}

interface FormFields {
  title: string;
  amount: string;
  category: string;
  date: string;
  paymentMethod: PaymentMethod;
  status: ExpenseStatus;
  description: string;
}

interface FormErrors {
  title?: string;
  amount?: string;
  category?: string;
  date?: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, onSuccess }) => {
  const { addExpense, updateExpense, categories } = useExpenses();
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormFields>({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().substring(0, 10),
    paymentMethod: 'Credit Card',
    status: 'Pending',
    description: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Autofocus title input on mount to help keyboard workflow
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        amount: initialData.amount.toString(),
        category: initialData.category,
        date: initialData.date,
        paymentMethod: initialData.paymentMethod,
        status: initialData.status,
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const validate = (name: string, value: string): string => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.trim().length < 3) return 'Title must be at least 3 characters';
        if (value.trim().length > 50) return 'Title must be under 50 characters';
        return '';
      case 'amount':
        if (!value) return 'Amount is required';
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) return 'Amount must be a positive number greater than 0';
        return '';
      case 'category':
        if (!value || value === '') return 'Please select a category';
        return '';
      case 'date':
        if (!value) return 'Date is required';
        const inputDate = new Date(value);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Allow today's transactions
        if (inputDate > today) return 'Date cannot be in the future';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation on change
    const err = validate(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: err ? err : undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run all validations
    const formErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const errorMsg = validate(key, formData[key as keyof FormFields]);
      if (errorMsg) {
        formErrors[key as keyof FormErrors] = errorMsg;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    const parsedData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    let result = false;
    if (initialData) {
      result = await updateExpense(initialData.id, parsedData);
    } else {
      result = await addExpense(parsedData);
    }

    setIsSubmitting(false);

    if (result) {
      if (!initialData) {
        // Clear form if we just added
        setFormData({
          title: '',
          amount: '',
          category: categories[0] || '',
          date: new Date().toISOString().substring(0, 10),
          paymentMethod: 'Credit Card',
          status: 'Pending',
          description: ''
        });
      }
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form" noValidate>
      <h3 className="form-header-title">{initialData ? 'Edit Expense' : 'Add New Expense'}</h3>
      
      <div className="form-group">
        <label htmlFor="title" className="form-label">Title <span className="text-error">*</span></label>
        <input
          type="text"
          id="title"
          name="title"
          ref={titleInputRef}
          value={formData.title}
          onChange={handleChange}
          className={`form-input ${errors.title ? 'is-invalid' : ''}`}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
          placeholder="e.g. AWS Cloud Hosting"
          required
        />
        {errors.title && <span id="title-error" className="error-message" role="alert">{errors.title}</span>}
      </div>

      <div className="form-row">
        <div className="form-group flex-1">
          <label htmlFor="amount" className="form-label">Amount (Rs.) <span className="text-error">*</span></label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`form-input ${errors.amount ? 'is-invalid' : ''}`}
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? 'amount-error' : undefined}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
          {errors.amount && <span id="amount-error" className="error-message" role="alert">{errors.amount}</span>}
        </div>

        <div className="form-group flex-1">
          <label htmlFor="category" className="form-label">Category <span className="text-error">*</span></label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? 'category-error' : undefined}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span id="category-error" className="error-message" role="alert">{errors.category}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group flex-1">
          <label htmlFor="date" className="form-label">Date <span className="text-error">*</span></label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`form-input ${errors.date ? 'is-invalid' : ''}`}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? 'date-error' : undefined}
            required
          />
          {errors.date && <span id="date-error" className="error-message" role="alert">{errors.date}</span>}
        </div>

        <div className="form-group flex-1">
          <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group flex-1">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">Description (Optional)</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
          placeholder="Add further details..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary form-submit-btn"
      >
        {isSubmitting ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
};
