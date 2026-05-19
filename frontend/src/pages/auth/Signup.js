import React, { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("Enter Password");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const signupResponse = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password }),
      });

      // Parse response data
      const signupData = await signupResponse.json();
      
      // Handle unsuccessful signup attempt
      if (!signupResponse.ok) {
        if (signupData.error === "Already Existing User Email") {
          toast.error("This email is already registered! Please log in.");
          return;
        }
        if (signupData.error === "Password must have at least 8 characters") {
          toast.error("Password must have at least 8 characters.")
          setPassword("");
          return;
        }
        throw new Error(signupData.error || "Signup failed");
      }

      console.log("Signup Success:", signupData);

      // Show success message and navigate to login page
      toast.success("User Registration successful! Please log in.");
      setTimeout(() => navigate("/login"), 1000);

    } catch (err) {
      toast.error("Something went wrong! Please try again later.");
      console.error("Signup Error:", err);
    }
  };

  return (
    <div className="bg" style={{ backgroundImage: `url("./img/background/BG_L.jpg")` }}>
      <div className="login-container">
      <h1 className="Heading">Create an account</h1>
      <form className="signup-form" onSubmit={submitHandler}>
        <input 
          type="text" 
          placeholder="Enter User Name" 
          className="signup-input" 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)}
          required 
        />
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
          placeholder={passwordPlaceholder} 
          className="signup-input" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="signup-button">Signup</button>
      </form>

      </div>
        <label>
          You have an account? <Link to="/login" className="custom-link">Login here</Link>
        </label>
      </div>
  );
};

export default Signup;
