import { useParams } from "react-router-dom";
import { useContext } from "react";

import Sidebar from "../components/Sidebar";

import {
  ExpenseContext,
} from "../context/ExpenseContext";

function ExpenseDetails() {
  const { id } = useParams();

  const { expenses } =
    useContext(ExpenseContext);

  const expense =
    expenses.find(
      (item) =>
        item.id.toString() === id
    );

  if (!expense) {
    return (
      <h1>
        Expense Not Found
      </h1>
    );
  }

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="main-content">

        <h1>
          Expense Details
        </h1>

        <div className="stat-card">

          <h3>
            {expense.title}
          </h3>

          <p>
            Amount:
            ₹{expense.amount}
          </p>

          <p>
            Category:
            {expense.category}
          </p>

          <p>
            ID:
            {expense.id}
          </p>

        </div>

      </div>

    </div>
  );
}

export default ExpenseDetails;