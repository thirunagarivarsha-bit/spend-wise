import Sidebar from "../components/Sidebar";
import ExpenseForm from "../components/ExpenseForm";

function AddExpense() {
  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="main-content">

        <h1>Add Expense</h1>

        <ExpenseForm />

      </div>

    </div>
  );
}

export default AddExpense;