function ExpensePresenter({
  expenses,
}) {
  return (
    <div className="stat-card">

      <h2>
        Expense Summary
      </h2>

      {expenses.length === 0 ? (
        <p>
          No Expenses Found
        </p>
      ) : (
        expenses.map(
          (expense) => (
            <p
              key={expense.id}
            >
              {expense.title}
              {" - ₹"}
              {expense.amount}
            </p>
          )
        )
      )}

    </div>
  );
}

export default ExpensePresenter;