import React, { useEffect , useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from './components/Header';
import Home from './pages/home/Home';
import Levels from './pages/game/Levels';
import Mainmenu from './pages/game/Mainmenu';
import GamePage from './pages/game/gamePage';
import Leaderboard from './pages/game/Leaderboard';
import UserProfile from './pages/user/UserProfile';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

const App = () => {
  const [coins, setCoins] = useState(0); // total balance for navbar

  useEffect(() => {
    const initCoins = async () => {
      try {
        const raw = localStorage.getItem('User');
        if (!raw) { setCoins(0); return; }

        const user = JSON.parse(raw);
        if (!user?.email) { setCoins(0); return; }

        // Try to get current total from backend
        const res = await fetch('http://localhost:5001/api/auth/getCoins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email }),
        });

        if (res.ok) {
          const data = await res.json();
          const serverTotal = data.totalCoins ?? data.coins;
          if (typeof serverTotal === 'number') {
            setCoins(serverTotal);
            return;
          }
        }

        // Fallbacks: if your login stores coins in localStorage user object
        if (typeof user.coins === 'number') {
          setCoins(user.coins);
        } else {
          setCoins(0);
        }
      } catch {
        setCoins(0);
      }
    };

    initCoins();
  }, []);

  return (
    <div>
      <Header coins={coins} />

      {/* Toastify container */}
      <ToastContainer 
      autoClose={1500}
      pauseOnFocusLoss={false}
      newestOnTop={false}
      transition={Slide}
      closeOnClick
      />



      {/* Define all routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/mainmenu" element={<Mainmenu />} />
        <Route
          path='/gamePage'
          element={<GamePage totalCoins={coins} setTotalCoins={setCoins} />}
        />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/userProfile" element={<UserProfile />} />
      </Routes>
    </div>
  );
};

export default App;
