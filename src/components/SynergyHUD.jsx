import "../styles/SynergyHUD.css";
export default function SynergyHUD({fureurCeleste }){
    return(
        <div className="synergyHUD">
            <h1 className="synergyTitle">Synergies :</h1>
            <ul>
                <li>
                    <h2 className="synergyTitleH2">Les Sabre-Tempête</h2>
                    <p className="synergyName">fureurCeleste : {fureurCeleste}</p>
                </li>
            </ul>           
        </div>
    )
}