import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../css/gameMenu.css';

const GamePage = ({ totalCoins, setTotalCoins }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode');
  const isResume = queryParams.get('resume') === 'true';
  const [currentMode, setCurrentMode] = useState(mode);

  const defaultInitialTime  = mode === 'Hard' ? 15 : mode === 'Medium' ? 20 : 30;
  const defaultInitialLives = mode === 'Hard' ? 1  : mode === 'Medium' ? 2  : 3;

  const [currentImage, setCurrentImage] = useState({ imageUrl: '', solution: 0 });
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(defaultInitialTime);
  const [lives, setLives] = useState(defaultInitialLives);
  const [roundCoins, setRoundCoins] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const answerInputRef = useRef(null);

  // auth guard
  useEffect(() => {
    const userData = localStorage.getItem('User');
    if (!userData) {
      navigate('/login');
    } else {
      const user = JSON.parse(userData);
      setUserEmail(user.email);
    }
  }, [navigate]);

  // resume or start new
  useEffect(() => {
    const resumeGame = () => {
      const savedState = localStorage.getItem('gameState');

      const defaultTime  = mode === 'Hard' ? 15 : mode === 'Medium' ? 20 : 30;
      const defaultLives = mode === 'Hard' ? 1  : mode === 'Medium' ? 2  : 3;

      if (savedState && isResume) {
        const parsed = JSON.parse(savedState);
        let { timeLeft, lives, currentImage, roundCoins: savedRoundCoins, mode: savedMode } = parsed;

        // Validate saved values
        if (typeof timeLeft !== 'number' || timeLeft <= 0) timeLeft = defaultTime;
        if (typeof lives !== 'number' || lives <= 0) lives = defaultLives;
        if (typeof savedRoundCoins !== 'number') savedRoundCoins = 0;
        if (!currentImage || !currentImage.imageUrl) currentImage = { imageUrl: '', solution: 0 };
        if (!savedMode) savedMode = mode;

        if (timeLeft > 0 && lives > 0) {
          setTimeLeft(timeLeft);
          setLives(lives);
          setCurrentImage(currentImage);
          setRoundCoins(typeof savedRoundCoins === 'number' ? savedRoundCoins : 0);
          setCurrentMode(savedMode);
        } else {
          fetchGameData();
        }
      } else {
        setRoundCoins(0);
        fetchGameData();
      }
      setIsLoaded(true);
    };
    resumeGame();
  }, [isResume, mode]);

  // Focus input after load
  useEffect(() => {
    if (isLoaded && answerInputRef.current) {
      answerInputRef.current.focus();
    }
  }, [isLoaded]);

  // timer
  useEffect(() => {
    if (!isLoaded || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeLeft(0);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoaded, gameOver]);

  // persist state while playing
  useEffect(() => {
    if (!gameOver && isLoaded) {
      const gameState = { timeLeft, lives, currentImage, roundCoins, mode: currentMode };
      localStorage.setItem('gameState', JSON.stringify(gameState));
    }
  }, [timeLeft, lives, currentImage, roundCoins, gameOver, isLoaded, currentMode]);

  // on game over
  useEffect(() => {
    if (gameOver) {
      localStorage.removeItem('gameState');
      handleGameOver();
    }
  }, [gameOver]);

  const fetchGameData = async () => {
    try {
      const response = await fetch('https://marcconrad.com/uob/heart/api.php?out=csv&base64=yes');
      const data = await response.text();
      const [base64Image, solution] = data.split(',');
      setCurrentImage({
        imageUrl: `data:image/png;base64,${base64Image}`,
        solution: parseInt(solution, 10),
      });

      // Focus input after new equation
      if (answerInputRef.current) {
        answerInputRef.current.focus();
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  const handleAnswerSubmit = () => {
    if (gameOver) return;

    if (parseInt(answer) === currentImage.solution) {
      const gain = currentMode === 'Hard' ? 30 : currentMode === 'Medium' ? 20 : 10;
      setRoundCoins((c) => c + gain);
      setAnswer('');
      fetchGameData();
    } else {
      if (lives > 1) {
        setLives((l) => l - 1);
        alert(`Wrong answer! You have ${lives - 1} lives left.`);
      } else {
        setLives(0);
        setGameOver(true);
      }
      setAnswer('');

      // Refocus input after wrong answer
      if (answerInputRef.current) {
        answerInputRef.current.focus();
      }
    }
  };

  const handleGameOver = async () => {
    if (!userEmail) {
      navigate('/Mainmenu');
      return;
    }

    alert(`Game Over! You earned ${roundCoins} coins!`);

    try {
      const res = await fetch('http://localhost:5001/api/auth/addCoins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, coinsToAdd: roundCoins }),
      });

      const data = await res.json();

      if (res.ok) {
        const newTotal = data.User?.coins ?? data.totalCoins ?? data.coins;
        if (typeof newTotal === 'number') {
          setTotalCoins(newTotal);
        } else {
          setTotalCoins((t) => t + roundCoins);
        }

        const raw = localStorage.getItem('User');
        if (raw) {
          try {
            const u = JSON.parse(raw);
            const updatedUser = { ...u, coins: newTotal ?? (u.coins ?? 0) + roundCoins };
            localStorage.setItem('User', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('user-login'));
          } catch (err) {
            console.error('Error updating local user data:', err);
          }
        }
      } else {
        console.error('Error updating coins:', data.error);
      }
    } catch (error) {
      console.error('Error sending game data:', error);
      setTotalCoins((t) => t + roundCoins);
    }

    localStorage.removeItem('gameState');
    navigate('/Leaderboard');
  };

  return (
    <div className="gamebg" style={{ backgroundImage: `url("./img/background/BG_G7.jpg")` }}>
      <div className="gameContainer">
        <div className="gameBoard" style={{ backgroundImage: `url("./img/background/GBG.jpg")` }}>
          {currentImage.imageUrl && (
            <img src={currentImage.imageUrl} alt="Equation" className="equation-image" />
          )}
        </div>

        <div className="ScoreWrapper">
          <div className="ScoreBox">TIME<br/>LEFT: {timeLeft}s</div>
          <div className="ScoreBox">LIVES:<br/>{lives}</div>
          <div className="ScoreBox">COINS:<br/>{roundCoins}</div>
        </div>
      </div>

      <div className="ScoreCard">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnswerSubmit();
          }}
        >
          <input
            ref={answerInputRef}
            className="customInput"
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            placeholder="Enter answer"
          />
          <button type="submit" className="customSubmitButton">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default GamePage;