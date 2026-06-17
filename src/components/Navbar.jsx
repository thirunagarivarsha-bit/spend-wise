import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <nav>

      <Link to="/">Dashboard</Link>

      {" | "}

      <Link to="/reports">Reports</Link>

      {" | "}

      <button onClick={logout}>
        Logout
      </button>

    </nav>
  );
};

export default Navbar;