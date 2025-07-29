import { div } from "framer-motion/client";
import "../styles/SynergyHUD.css";
export default function SynergyHUDFight({fureurCeleste, fureurCelesteP2}){
    return(
        <div className="synergyHUDFight">
            <div className="synergyHUD">
                <h1 className="synergyTitle">Synergies J1:</h1>
                <ul>
                    <li>
                        <h2 className="synergyTitleH2">Les Sabre-Tempête</h2>
                        <p className="synergyName">fureurCeleste : {fureurCeleste}</p>
                    </li>
                </ul>           
            </div>
            <div className="synergyHUDP2Fight">
                <h1 className="synergyTitle">Synergies J2:</h1>
                <ul>
                    <li>
                        <h2 className="synergyTitleH2">Les Sabre-Tempête</h2>
                        <p className="synergyName">fureurCeleste : {fureurCelesteP2}</p>
                    </li>
                </ul>           
            </div>
        </div>

        
        
    )
}