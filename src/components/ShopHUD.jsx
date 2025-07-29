import "../styles/ShopHUD.css";
export default function ShopHUD({ cout, onRefresh, onLvlUp }){
    return(
        <div className="hud-layer">
            <img type="button" onClick={ onRefresh } className="hudActu" src="img/bouton_actualiser.png" alt=""/>
            <img src="img/chounette_la_taverniere.png" className="hudPersoShop" alt="HUD Tavernière"/>
            <img type="button" onClick={ onLvlUp } className="hudLvlUp" src="img/bouton_lvlup_taverne.png" alt=""/>
            <div id="taverneCost" className="taverneCost">{ cout }</div>
        </div>
    )
}