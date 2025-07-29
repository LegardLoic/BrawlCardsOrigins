import "../styles/Player2HUD.css";

export default function Player2HUDFight({ goldPlayer2, lvlTavernePlayer2, player2Pv }) {
  return (
    <div className="player2HudFight">
        <img className="hudPersoPlayer2Fight" src="img/persomaehud.png" alt=""/>
        <img className="orlvlimghudP2Fight" src="img/orlvlimghud.png" alt=""/>
        <div id="player2Or" className="player2OrFight">{ goldPlayer2 }</div>
        <img className="hpimghudP2Fight" src="img/hpimghud.png" alt=""/>
        <div id="player2Pv" className="player2PvFight">{ player2Pv }</div>
        <div id="player2Lvl" className="player2LvlFight">{ lvlTavernePlayer2 }</div>
    </div>
  );
}