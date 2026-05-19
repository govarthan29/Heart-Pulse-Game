import React from "react";
import { Link } from "react-router-dom";

const Mainmenu = () => {
  const hasSavedGame = localStorage.getItem("gameState");
  
  return (
    <div className="gamebg" style={{ backgroundImage: `url("./img/background/BGI_M.jpg")` }}>
      <div className="con">
        <h3 className="main-title">MAIN MENU</h3>

        <div className="gameButton">
          <Link to="/levels" className="Game-link">New Game</Link>
        </div>

{hasSavedGame && (
  <div className="gameButton">
    <Link to="/gamePage?resume=true" className="Game-link">Resume Game</Link>
  </div>
)}


        <div className="gameButton">
          <Link to="/Leaderboard" className="Game-link">leaderboard</Link>
        </div>

        <div className="gameButton">
          <Link to="/" className="Game-link">Exit</Link>
        </div>
      </div>

      <img src="./img/background/Heart1.png" alt="Heart" className="heart-image"/>
    </div>
  );
};

export default Mainmenu;
