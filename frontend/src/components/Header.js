import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = ({ coins }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user data from backend
  const fetchUserData = async (email) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/userData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.User);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Load user from localStorage
  const loadUser = () => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchUserData(parsedUser.email);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  };

  useEffect(() => {
    loadUser();

    const handleUserLogin = () => {
      loadUser();
    };

    window.addEventListener("user-login", handleUserLogin);

    return () => {
      window.removeEventListener("user-login", handleUserLogin);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("gameState");
    localStorage.removeItem("User");
    setUser(null);
    navigate("/login");
    window.dispatchEvent(new Event("user-login"));
  };

  return (
    <nav className="navbar">
      <div className="User_name">{user ? user.userName : "Guest"}</div>

      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "cust-link active-link" : "cust-link"}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/userProfile" className={({ isActive }) => isActive ? "cust-link active-link" : "cust-link"}>
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/Mainmenu" className={({ isActive }) => isActive ? "cust-link active-link" : "cust-link"}>
            Main Menu
          </NavLink>
        </li>
        {user ? (
          <li>
            <NavLink to="/login" onClick={handleLogout} className="cust-link">
              Logout
            </NavLink>
          </li>
        ) : (
          <li>
            <NavLink to="/login" className={({ isActive }) => isActive ? "cust-link active-link" : "cust-link"}>
              Login
            </NavLink>
          </li>
        )}
      </ul>

      <div className="coin-counter">
        <img src={"./img/background/coin1.png"} alt="Coin" className="coin-icon"/>
        <span className="coin-value">{user ? user.coins : 0}</span>
      </div>
    </nav>
  );
};

export default Header;
