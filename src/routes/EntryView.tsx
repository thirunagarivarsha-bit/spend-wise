import React from 'react';
import { ExpenseForm } from '../components/entry/ExpenseForm';
import { Card } from '../components/common/Card';

export const EntryView: React.FC = () => {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '12px' }}>
      <Card>
        <ExpenseForm />
      </Card>
    </div>
  );
};
