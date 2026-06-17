import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Card } from './Card';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by boundary:', error, errorInfo);
  }

  private handleReset = () => {
    // Clear localStorage to fix possible corrupted state
    localStorage.removeItem('expensify_expenses');
    localStorage.removeItem('expensify_budgets');
    localStorage.removeItem('expensify_monthly_budget');
    // Reload page
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'var(--bg-app)',
          padding: '20px'
        }}>
          <Card 
            title="Application Error" 
            subtitle="The application encountered an unexpected runtime crash." 
            className="error-card"
            style={{ maxWidth: '500px', textAlign: 'center', padding: '32px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <AlertCircle size={56} className="text-error" />
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                A component failed to render. This can sometimes be caused by inconsistent local data.
              </p>
              {this.state.error && (
                <pre style={{
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  width: '100%',
                  overflowX: 'auto',
                  textAlign: 'left',
                  color: 'var(--error-color)'
                }}>
                  {this.state.error.toString()}
                </pre>
              )}
              <button 
                onClick={this.handleReset} 
                className="btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '8px' }}
              >
                <RefreshCw size={16} /> Reset Application Cache
              </button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
