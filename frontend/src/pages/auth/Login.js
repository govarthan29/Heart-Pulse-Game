import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  // Function to handle login form submission
  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("Login Response Data:", data);

      // Show toast on success
      toast.success("Login Successful!");

      // Store the user data and token in localStorage
      localStorage.setItem("User", JSON.stringify(data.User));
      localStorage.setItem("token", data.token);

      // Notify Header to update username
      window.dispatchEvent(new Event("user-login"));

      navigate("/userProfile");

    } catch (err) {
      // Show error message as an alert
      toast.error(err.message);
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="bg" style={{ backgroundImage: `url("./img/background/BG_L.jpg")` }}>
     <div className="login-container">
      <h1>Welcome back...</h1>
      <form className="signup-form" onSubmit={submitHandler}>
        <input 
          type="email" 
          placeholder="Enter Email Address" 
          className="signup-input" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
        <input 
          type="password" 
          placeholder="Enter Password" 
          className="signup-input" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        <button type="submit" className="signup-button">Sign In</button>
      </form>

      </div>
        <label>
          Create an account? <Link to="/signup" className="custom-link">Click here</Link>
        </label>  
      </div>
  );
};

export default Login;