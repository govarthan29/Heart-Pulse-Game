import React, { useEffect , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/signup.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to fetch the latest user data from the server
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
        // Update the user state with the latest data
        setUser(data.User);  
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("User");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Stored User Data:", parsedUser);
        // Set user data from localStorage initially
        setUser(parsedUser);
        // Fetch latest user data from backend
        fetchUserData(parsedUser.email);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      navigate("/login"); 
    }
  }, [navigate]);

  return (
    <div className="bg" style={{ backgroundImage: `url("./img/background/BG_P.jpg")` }}>
      <div className="profile-container">
        <h3>User Profile</h3>
        {user ? (
        <div>
          <table className="profile-table">
              <tr>
                <th>
                  <img src="./img/background/profile1.jpg" alt="User Profile" height="250" width="250" />
                </th>
                <th>
                  {/* Display user information */}
                  <p><strong>Name:</strong> {user.userName}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Coins:</strong> {user.coins}</p>
                </th>
              </tr>
            </table>
          </div>
        ) : (
          // Show loading message while fetching data
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;