import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Card } from '../components/common/Card';
import { Lock, PiggyBank, ArrowRight } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useExpenses();
  const [passcode, setPasscode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;

    setIsSubmitting(true);
    const success = await login(passcode);
    setIsSubmitting(false);

    if (success) {
      window.location.hash = '#/dashboard';
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      background: 'var(--bg-app)',
      padding: '20px'
    }}>
      <Card 
        style={{ width: '100%', maxWidth: '420px', padding: '36px', textAlign: 'center' }}
        className="login-card"
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div className="brand-logo" style={{ padding: '12px', background: 'var(--primary-soft)', borderRadius: '16px' }}>
            <PiggyBank size={36} className="text-primary" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0 2px 0' }}>Welcome to SpendWise</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Enter your passcode to securely access your financial dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} /> Passcode
            </label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              disabled={isSubmitting}
              required
              autoFocus
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting || !passcode}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px', marginTop: '8px' }}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '12px', background: 'var(--bg-card-hover)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)' }}>
          🔒 Hint: Enter <strong>admin123</strong> to login.
        </div>
      </Card>
    </div>
  );
};

export default LoginView;
