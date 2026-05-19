import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/gameMenu.css';


const Leaderboard = () => {
    const [users, setUsers] = useState([]); 
    // Store logged-in user email
    const [userEmail, setUserEmail] = useState(null);  
    const navigate = useNavigate();

    // Fetch users' scores from the backend when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/auth/users");
                const data = await response.json();
                if (!data || !data.users) {
                    console.error("Error: No users found");
                    return;
                }
                // Update the state with the fetched user data
                setUsers(data.users);  
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers(); 
    }, []);

    // Check if a user is logged in; if not, redirect to the login page
    useEffect(() => {
        const userData = localStorage.getItem("User");
        if (!userData) {
            navigate("/login");
        } else {
            const user = JSON.parse(userData);
            setUserEmail(user.email);
        }
    }, [navigate]);

    // Sort users by coins in descending order
    const sortedUsers = [...users].sort((a, b) => b.coins - a.coins);

    return (
        <div className="gamebg" style={{ backgroundImage: `url("./img/background/BG_Score.jpg")` }}>
            <div className="profile-container1">
                <h3>Leaderboard</h3>
                <table className='customTable'>
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>User Name</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Loop through sorted users and display their ranking */}
                        {sortedUsers.map((user, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{user.userName}</td>
                                <td>{user.coins}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
