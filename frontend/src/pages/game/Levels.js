import React , { useEffect } from "react";
import { useNavigate , Link } from "react-router-dom";

const Levels = () => {
  const navigate = useNavigate();

  // Check login on component load
  useEffect(() => {
    const user = localStorage.getItem("User");
    if (!user) {
      navigate("/login"); // Redirect if not logged in
    }
  }, [navigate]);

  return (
    <div className="gamebg" style={{ backgroundImage: `url("./img/background/BGI_M.jpg")` }}>
      <div className="con">
        <h3 className="main-title">Select Level</h3>

        <div className="gameButton">
          <Link to="/gamePage?mode=Easy" className="Game-link">Easy</Link>
        </div>

        <div className="gameButton">
          <Link to="/gamePage?mode=Medium" className="Game-link">Medium</Link>
        </div>

        <div className="gameButton">
          <Link to="/gamePage?mode=Hard" className="Game-link">Hard</Link>
        </div>

        <div className="gameButton">
          <Link to="/Mainmenu" className="Game-link">Back</Link>
        </div>
      </div>

      <img src="./img/background/Heart1.png" alt="Heart" className="heart-image"/>
    </div>
  );
};

export default Levels;
