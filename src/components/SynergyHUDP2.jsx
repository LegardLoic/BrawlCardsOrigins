import "../styles/SynergyHUD.css";
export default function SynergyHUD({fureurCelesteP2 }){
    return(
        <div className="synergyHUD">
            <h1 className="synergyTitle">Synergies :</h1>
            <ul>
                <li>
                    <h2 className="synergyTitleH2">Les Sabre-Tempête</h2>
                    <p className="synergyName">fureurCeleste : {fureurCelesteP2}</p>
                </li>
            </ul>           
        </div>
    )
}