import React, { useState, useEffect } from 'react';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import { SummaryView } from './routes/SummaryView';
import { AnalyticsView } from './routes/AnalyticsView';
import { EntryView } from './routes/EntryView';
import { ListView } from './routes/ListView';
import { PipelineView } from './routes/PipelineView';
import { BudgetsView } from './routes/BudgetsView';
import { InsightsView } from './routes/InsightsView';
import { LoginView } from './routes/LoginView';
import { DetailView } from './routes/DetailView';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastContainer } from './components/common/Toast';
import { ThemeToggle } from './components/common/ThemeToggle';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  PiggyBank, 
  BarChart3, 
  Kanban, 
  Target, 
  Sparkles,
  LogOut
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('#/dashboard');
  const { monthSpent, monthlyBudget, isAuthenticated, currentUser, logout } = useExpenses();

  // Initialize theme at root layout level so it is active even on login page
  useEffect(() => {
    const savedTheme = localStorage.getItem('expensify_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/dashboard';
      
      // Protected routing check
      if (!isAuthenticated && hash !== '#/login') {
        window.location.hash = '#/login';
      } else if (isAuthenticated && hash === '#/login') {
        window.location.hash = '#/dashboard';
      } else {
        setCurrentRoute(hash);
      }
    };

    // Initialize and listen to hash change
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isAuthenticated]);

  const navigateTo = (route: string) => {
    window.location.hash = route;
  };

  const renderView = () => {
    // Dynamic route check
    if (currentRoute.startsWith('#/log/')) {
      return <DetailView />;
    }

    switch (currentRoute) {
      case '#/login':
        return <LoginView />;
      case '#/dashboard':
        return <SummaryView />;
      case '#/analytics':
        return <AnalyticsView />;
      case '#/add':
        return <EntryView />;
      case '#/log':
        return <ListView />;
      case '#/pipeline':
        return <PipelineView />;
      case '#/budgets':
      case '#/budgets/overall':
      case '#/budgets/categories':
        return <BudgetsView />;
      case '#/insights':
        return <InsightsView />;
      default:
        return <SummaryView />;
    }
  };

  const budgetPercentage = monthlyBudget > 0 ? Math.min((monthSpent / monthlyBudget) * 100, 100) : 0;
  const showNav = isAuthenticated && currentRoute !== '#/login';

  return (
    <div className="app-container">
      {/* Sidebar Navigation for Desktop */}
      {showNav && (
        <aside className="app-sidebar" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="sidebar-brand">
              <div className="brand-logo">
                <PiggyBank size={28} className="text-primary" />
              </div>
              <span className="brand-name">SpendWise</span>
            </div>

            <nav className="sidebar-nav">
              <button
                onClick={() => navigateTo('#/dashboard')}
                className={`nav-item ${currentRoute === '#/dashboard' ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => navigateTo('#/analytics')}
                className={`nav-item ${currentRoute === '#/analytics' ? 'active' : ''}`}
              >
                <BarChart3 size={18} />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => navigateTo('#/add')}
                className={`nav-item ${currentRoute === '#/add' ? 'active' : ''}`}
              >
                <PlusCircle size={18} />
                <span>Add Expense</span>
              </button>
              <button
                onClick={() => navigateTo('#/log')}
                className={`nav-item ${currentRoute.startsWith('#/log') ? 'active' : ''}`}
              >
                <FileText size={18} />
                <span>Expense Log</span>
              </button>
              <button
                onClick={() => navigateTo('#/pipeline')}
                className={`nav-item ${currentRoute === '#/pipeline' ? 'active' : ''}`}
              >
                <Kanban size={18} />
                <span>Pipeline Board</span>
              </button>
              <button
                onClick={() => navigateTo('#/budgets')}
                className={`nav-item ${currentRoute.startsWith('#/budgets') ? 'active' : ''}`}
              >
                <Target size={18} />
                <span>Budgets & Targets</span>
              </button>
              <button
                onClick={() => navigateTo('#/insights')}
                className={`nav-item ${currentRoute === '#/insights' ? 'active' : ''}`}
              >
                <Sparkles size={18} />
                <span>Smart Insights</span>
              </button>
            </nav>
          </div>

          <div>
            {/* User Profile Widget */}
            {currentUser && (
              <div style={{
                background: 'var(--bg-card-hover)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentUser.email}
                  </div>
                </div>
                <button 
                  onClick={logout} 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--error-color)', padding: '4px', borderRadius: '4px' }}
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}

            {/* Sidebar Budget Meter Widget */}
            <div className="sidebar-widget-card" style={{
              background: 'var(--bg-card-hover)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Monthly Spend</span>
                <span>{budgetPercentage.toFixed(0)}%</span>
              </div>
              <div className="progress-bar-bg" style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                <div className="progress-bar-fill" style={{
                  height: '100%',
                  width: `${budgetPercentage}%`,
                  backgroundColor: budgetPercentage >= 100 ? 'var(--error-color)' : budgetPercentage >= 80 ? 'var(--warning-color)' : 'var(--primary-color)'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>
                <span>Spent: Rs.{monthSpent.toFixed(0)}</span>
                <span>Limit: Rs.{monthlyBudget.toFixed(0)}</span>
              </div>
            </div>

            <div className="sidebar-footer">
              <ThemeToggle />
              <span className="footer-text">Dark/Light Mode</span>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="main-wrapper" style={{ marginLeft: showNav ? '260px' : '0' }}>
        {showNav && (
          <header className="mobile-header">
            <div className="brand-logo-mobile">
              <PiggyBank size={24} className="text-primary" />
              <span className="brand-name-mobile">SpendWise</span>
            </div>
            <ThemeToggle />
          </header>
        )}

        <main className="content-area">
          {renderView()}
        </main>

        {/* Bottom Navigation for Mobile */}
        {showNav && (
          <nav className="mobile-bottom-nav" style={{
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            justifyContent: 'flex-start',
            padding: '0 8px',
            gap: '8px'
          }}>
            <button
              onClick={() => navigateTo('#/dashboard')}
              className={`mobile-nav-item ${currentRoute === '#/dashboard' ? 'active' : ''}`}
              style={{ minWidth: '70px', padding: '6px' }}
            >
              <LayoutDashboard size={18} />
              <span className="mobile-nav-label" style={{ fontSize: '10px' }}>Dashboard</span>
            </button>
            <button
              onClick={() => navigateTo('#/analytics')}
              className={`mobile-nav-item ${currentRoute === '#/analytics' ? 'active' : ''}`}
              style={{ minWidth: '70px', padding: '6px' }}
            >
              <BarChart3 size={18} />
              <span className="mobile-nav-label" style={{ fontSize: '10px' }}>Analytics</span>
            </button>
            <button
              onClick={() => navigateTo('#/add')}
              className={`mobile-nav-item ${currentRoute === '#/add' ? 'active' : ''}`}
              style={{ minWidth: '70px', padding: '6px' }}
            >
              <PlusCircle size={18} />
              <span className="mobile-nav-label" style={{ fontSize: '10px' }}>Add</span>
            </button>
            <button
              onClick={() => navigateTo('#/log')}
              className={`mobile-nav-item ${currentRoute.startsWith('#/log') ? 'active' : ''}`}
              style={{ minWidth: '70px', padding: '6px' }}
            >
              <FileText size={18} />
              <span className="mobile-nav-label" style={{ fontSize: '10px' }}>Logs</span>
            </button>
            <button
              onClick={() => navigateTo('#/pipeline')}
              className={`mobile-nav-item ${currentRoute === '#/pipeline' ? 'active' : ''}`}
              style={{ minWidth: '70px', padding: '6px' }}
            >
              <Kanban size={18} />
              <span className="mobile-nav-label" style={{ fontSize: '10px' }}>Pipeline</span>
            </button>
            <button
              onClick={() => navigateTo('#/budgets')}
              className={`mobile-nav-item ${currentRoute.startsWith('#/budgets') ? 'active' : ''}`}
              style={{ minWidth: '70px', padding: '6px' }}
            >
              <Target size={18} />
              <span className="mobile-nav-label" style={{ fontSize: '10px' }}>Budgets</span>
            </button>
            <button
              onClick={() => navigateTo('#/insights')}
              className={`mobile-nav-item ${currentRoute === '#/insights' ? 'active' : ''}`}
              style={{ minWidth: '70px', padding: '6px' }}
            >
              <Sparkles size={18} />
              <span className="mobile-nav-label" style={{ fontSize: '10px' }}>Insights</span>
            </button>
          </nav>
        )}
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ExpenseProvider>
        <MainLayout />
      </ExpenseProvider>
    </ErrorBoundary>
  );
};

export default App;
