import React from "react";
import {Link} from "react-router-dom";

const Home = () => {
    return(
        <div className="Homebg" style={{backgroundImage: `url("./img/background/H_BG.jpg")`}}>
            <div className="GameTitle">
                <h1>Heart Pulse</h1>
                <p className="subtitle">Count fast. Play smart!</p>
            </div>

            <div>
                <Link to="/Mainmenu" className="start-button">START</Link>
            </div>
        </div>
    );
};

export default Home;