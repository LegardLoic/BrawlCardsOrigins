import { coutLvlTaverne, coutLvlTavernePlayer2, clonerCarte, boardPositionFight } from "@/utils/shopUtils";
import { playSound } from '@/utils/soundUtils';
import { cards } from "@/data/cardsData";
import { verifFureurCelesteAvantAttaque, verifFureurCelesteApresAttaque, degatsAdj, oneTicDebutCombat, oneTicPendantCombat, aoeCible, piocherCarteFamille } from '@/utils/mecaUtils';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export  function entierAleatoire(min, max)
{
 return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function retirerCartesMortes(cartes) {
    return cartes.filter(c => c.hp > 0);
}


export async function deroulerCombat1v1({
    boardPlayer, boardPlayer2, setBoardCombat, setBoardCombatPlayer2, setBoardPlayer, setBoardPlayer2,  
    lvlTaverne, lvlTavernePlayer2, goldTour1, setgoldTour1, setGold, setGoldPlayer2, maxGold, maxGoldPlayer2,
    setplayerPv, setplayer2Pv, playerPv, player2Pv,
    setPhase, navigate, setPopupMessage, setActualPlayer,
    setCarteAttaquantId, setCarteDefenseurId,
    setFureurCeleste, setFureurCelesteP2, fureurCelesteRef, fureurCelesteRefP2,
    setGriffeEffects, setProjectileAnim, setAnimAoEVisuelle,
    setBonusAtkElem, bonusAtkElem
}){
    console.log("⚔️ Combat lancé !");
  
    const boardAvantCombat = boardPlayer.map(carte => ({ ...carte }));
    const boardAvantCombatPlayer2 = boardPlayer2.map(carte => ({ ...carte }));
    console.log("📌 Sauvegarde du board Player 1 avant combat :", boardAvantCombat);
    console.log("📌 Sauvegarde du board Player 2 avant combat :", boardAvantCombatPlayer2);
  
  
    let cartesPlayer = [...boardPlayer];
    let cartesPlayer2 = [...boardPlayer2];
    setBoardCombat([...cartesPlayer]);
    setBoardCombatPlayer2([...cartesPlayer2]);

    await sleep(1200);
    if (cartesPlayer.length === 0 || cartesPlayer2.length === 0) {
        finDeCombat(cartesPlayer, cartesPlayer2, boardAvantCombat, boardAvantCombatPlayer2, lvlTaverne, lvlTavernePlayer2, setBoardPlayer, setBoardPlayer2, goldTour1, setgoldTour1, setGoldPlayer2, setplayerPv, setplayer2Pv, setGold, setActualPlayer, setPhase, playerPv, player2Pv, navigate, setPopupMessage, maxGold, maxGoldPlayer2)
        return;
    }

    // verif si oneTicDebutCombat
    let oneTicDebutCombatPresent1 = cartesPlayer.findIndex(carte => carte.oneTicDebutCombat)
    let oneTicDebutCombatPresent2 = cartesPlayer2.findIndex(carte => carte.oneTicDebutCombat)
    // oneTicDebutCombat
    if(oneTicDebutCombatPresent1 >= 0){
      await oneTicDebutCombat(cartesPlayer, cartesPlayer2, setProjectileAnim); // Applique les dégâts
      await sleep(600)
      setBoardCombatPlayer2([...cartesPlayer2]); // Affiche dégâts subis
      const oneTicResult1 = await retirerCartesMortes(cartesPlayer2); // à toi de créer cette fonction
      let index = 1
      cartesPlayer2.forEach(carte => {
        carte.degatsRecus = 0
        carte.boardPosition = index
        index ++
      });
      cartesPlayer2 = oneTicResult1;
      setBoardCombatPlayer2([...cartesPlayer2]);

    }
    if(oneTicDebutCombatPresent2 >= 0){
      // Idem côté joueur 2
      await oneTicDebutCombat(cartesPlayer2, cartesPlayer, setProjectileAnim);
      setBoardCombat([...cartesPlayer]);
      await sleep(600);
      const oneTicResult2 = await retirerCartesMortes(cartesPlayer);
      let index = 1
      cartesPlayer.forEach(carte => {
        carte.degatsRecus = 0
        carte.boardPosition = index
        index ++
      });
      cartesPlayer = oneTicResult2;
      setBoardCombat([...cartesPlayer]);
    
    }
    //Fin oneTicDebutCombat

    // verif si aoeCible
    let aoeCiblePresent1 = cartesPlayer.findIndex(carte => carte.aoeCible)
    let aoeCiblePresent2 = cartesPlayer2.findIndex(carte => carte.aoeCible)
    //aoe//
    if(aoeCiblePresent1 >= 0 || aoeCiblePresent2 >= 0 ){
   
        const aoeCibleResult = await aoeCible(cartesPlayer, cartesPlayer2);
        // déclenchement visuel
        setAnimAoEVisuelle(true);
        await sleep(600);
        setAnimAoEVisuelle(false);
        setBoardCombat([...cartesPlayer]);
        setBoardCombatPlayer2([...cartesPlayer2]);
    
        cartesPlayer = aoeCibleResult.cartesPlayer;
        cartesPlayer2 = aoeCibleResult.cartesPlayer2;
        // 💀 Déclencher les deathTriggers post-AoE
        aoeCibleResult.mortsPlayer.forEach(carteMorte => {
        cartesPlayer.forEach(survivant => {
            if (survivant.deathTrigger) {
            survivant.deathTrigger(carteMorte, cartesPlayer, survivant);
            }
        });
        });
        aoeCibleResult.mortsPlayer2.forEach(carteMorte => {
            cartesPlayer2.forEach(survivant => {
                if (survivant.deathTrigger) {
                survivant.deathTrigger(carteMorte, cartesPlayer2, survivant);
                }
            });
        });
        let index = 1
        cartesPlayer.forEach(carte => {
            carte.degatsRecus = 0
            carte.boardPosition = index
            index ++
        });
        let index1 = 1
        cartesPlayer2.forEach(carte => {
            carte.degatsRecus = 0
            carte.boardPosition = index1
            index1 ++
        });
        // Mise à jour des boards après buffs
        setBoardCombat([...cartesPlayer]);
        setBoardCombatPlayer2([...cartesPlayer2]);
        await sleep(400);
    }
    //fin aoe cible
    if (cartesPlayer.length === 0 || cartesPlayer2.length === 0) {
        finDeCombat(cartesPlayer, cartesPlayer2, boardAvantCombat, boardAvantCombatPlayer2, lvlTaverne, lvlTavernePlayer2, setBoardPlayer, setBoardPlayer2, goldTour1, setgoldTour1, setGoldPlayer2, setplayerPv, setplayer2Pv, setGold, setActualPlayer, setPhase, playerPv, player2Pv, navigate, setPopupMessage, maxGold, maxGoldPlayer2)
        return;
    }


    let tirageAuSort = entierAleatoire(0,1);
    let joueurAttaquant = null
    if (tirageAuSort === 0){
      joueurAttaquant = true
    }else{
      joueurAttaquant = false
    }
    let defenseur = null
    let nomAttaquant = ""
    let nomDefenseur = ""
    let tourCombat = 1
    cartesPlayer[0].atkDispo = true;
    cartesPlayer2[0].atkDispo = true;

    while (cartesPlayer.length > 0 && cartesPlayer2.length > 0){
        console.log("TOUR", tourCombat)
        let attaquant = joueurAttaquant
        if (joueurAttaquant === true){
            nomAttaquant = "joueur"
            nomDefenseur = "joueur2"
            attaquant = cartesPlayer[0]
            if (attaquant.atkDispo === false){
                cartesPlayer.forEach((carte) => {
                    if(carte.atkDispo === true){
                        attaquant = carte
                    }
                })  
            }
            // attribution du defenseur
            const defenseurProvoc = cartesPlayer2.filter(c => c.provocationUse);
          console.log(defenseurProvoc)
          if (defenseurProvoc.length > 0){
            defenseur = defenseurProvoc[Math.floor(Math.random() * defenseurProvoc.length)];
          }else{
            defenseur = cartesPlayer2[entierAleatoire(0, cartesPlayer2.length -1)]
          }
        }
        if (joueurAttaquant === false){
            nomAttaquant = "joueur2"
            nomDefenseur = "joueur"
            attaquant = cartesPlayer2[0]
            if (attaquant.atkDispo === false){
                cartesPlayer2.forEach((carte) => {
                    if(carte.atkDispo === true){
                        attaquant = carte
                    }
                })    
            }
            // attribution du defenseur
            const defenseurProvoc = cartesPlayer.filter(c => c.provocationUse);
            console.log(defenseurProvoc)
            if (defenseurProvoc.length > 0){
              defenseur = defenseurProvoc[Math.floor(Math.random() * defenseurProvoc.length)];
            }else{
              defenseur = cartesPlayer[entierAleatoire(0, cartesPlayer.length -1)]
            }
        }
        await sleep(200);
        //tour de combat
        ({ cartesPlayer, cartesPlayer2 }  = await TourCombat(nomAttaquant, attaquant, nomDefenseur, defenseur, setCarteAttaquantId, setCarteDefenseurId, setBoardCombat, setBoardCombatPlayer2, cartesPlayer, cartesPlayer2, sleep, boardPositionFight, setFureurCeleste, setFureurCelesteP2, fureurCelesteRef, fureurCelesteRefP2, setGriffeEffects, setProjectileAnim, setBonusAtkElem, bonusAtkElem))
        //fin tour de combat
        joueurAttaquant = !joueurAttaquant;
        await sleep(400);
        tourCombat ++
        console.log(cartesPlayer)
    }
    finDeCombat(cartesPlayer, cartesPlayer2, boardAvantCombat, boardAvantCombatPlayer2, lvlTaverne, lvlTavernePlayer2, setBoardPlayer, setBoardPlayer2, goldTour1, setgoldTour1, setGoldPlayer2, setplayerPv, setplayer2Pv, setGold, setActualPlayer, setPhase, playerPv, player2Pv, navigate, setPopupMessage, maxGold, maxGoldPlayer2)
}

export async function TourCombat(nomAttaquant, attaquant, nomDefenseur, defenseur, setCarteAttaquantId, setCarteDefenseurId, setBoardCombat, setBoardCombatPlayer2, cartesPlayer, cartesPlayer2, sleep, boardPositionFight, setFureurCeleste, setFureurCelesteP2, fureurCelesteRef, fureurCelesteRefP2, setGriffeEffects, setProjectileAnim, setBonusAtkElem, bonusAtkElem ){
    console.log(nomAttaquant, "commence")
    if(attaquant.criFureurCeleste3SelfFight || attaquant.criFureurCeleste5SelfFight || attaquant.criFureurCeleste5AllFight || attaquant.criFureurCeleste7AllFight ){
        await verifFureurCelesteAvantAttaque(attaquant, nomAttaquant, fureurCelesteRef, setFureurCeleste, cartesPlayer, fureurCelesteRefP2, setFureurCelesteP2, cartesPlayer2)
        
    }
    
    console.log("la première carte de",nomAttaquant,attaquant.nom, "attaque la carte de",nomDefenseur, defenseur.nom )
    playSound('sounds/impact.mp3'); // 👈 joue le son à chaque attaque
    if(attaquant.control){
      if( nomAttaquant === "joueur" && cartesPlayer.length > 1){
        if(attaquant.control && attaquant.degatsAdj){
          if(attaquant.boardPosition !== cartesPlayer.length){
            defenseur = cartesPlayer[attaquant.boardPosition]
          }else{
            defenseur = cartesPlayer[attaquant.boardPosition - 2]
          }  
        }
        if(attaquant.boardPosition !== cartesPlayer.length){
          defenseur = cartesPlayer[attaquant.boardPosition]
        }else{
          defenseur = cartesPlayer[attaquant.boardPosition - 2]
        }  
      }
      else if(nomAttaquant === "joueur2" && cartesPlayer2.length > 1) {
        if(attaquant.boardPosition !== cartesPlayer2.length){
          defenseur = cartesPlayer2[attaquant.boardPosition]
        }else{
          defenseur = cartesPlayer2[attaquant.boardPosition - 2]
        }  
      }
      
    }
    setCarteAttaquantId(attaquant.id);
    setCarteDefenseurId(defenseur.id);
 
    await sleep(400); // le temps de jouer l'anim

    setCarteAttaquantId(null);
    setCarteDefenseurId(null);

    console.log(attaquant.nom,"à",attaquant.hp, "pv. Il perd", defenseur.atk, "hp" )
    console.log(defenseur.nom,"à",defenseur.hp, "pv. Il perd", attaquant.atk, "hp" )

    // 1. Appliquer les dégâts en premier
    if(attaquant.bouclierUse){
      attaquant.hp -= 0;
      defenseur.hp -= attaquant.atk;
          
      // 2. Appliquer les effets visuels
      attaquant.degatsRecus = 0;
      defenseur.degatsRecus = attaquant.atk;
      if(defenseur.atk > 0){
        attaquant.bouclierUse = false
      }
      
    }else if(defenseur.bouclierUse){
      attaquant.hp -= defenseur.atk;
      defenseur.hp -= 0;
          
      // 2. Appliquer les effets visuels
      attaquant.degatsRecus = defenseur.atk;
      defenseur.degatsRecus = 0;
      if(attaquant.atk > 0){
        defenseur.bouclierUse = false
      }
      
    }else if(attaquant.bouclierUse && defenseur.bouclierUse){
      attaquant.hp -= 0;
      defenseur.hp -= 0;
          
      // 2. Appliquer les effets visuels
      attaquant.degatsRecus = 0;
      defenseur.degatsRecus = 0;
      attaquant.bouclierUse = false
      defenseur.bouclierUse = false
    }else{
      attaquant.hp -= defenseur.atk;
      defenseur.hp -= attaquant.atk;
          
      // 2. Appliquer les effets visuels
      attaquant.degatsRecus = defenseur.atk;
      defenseur.degatsRecus = attaquant.atk;
    }

    if(attaquant.hp <= 0 && attaquant.oneTicPendantCombat){
      if(nomAttaquant === "joueur"){
        await sleep(400);
        await oneTicPendantCombat(attaquant, defenseur, cartesPlayer2, setProjectileAnim);
        await sleep(400);
      }else{
        await sleep(400);
        await oneTicPendantCombat(attaquant, defenseur, cartesPlayer, setProjectileAnim);
        await sleep(400);
      }

    }
    if(defenseur.hp <= 0 && defenseur.oneTicPendantCombat){
      if(nomDefenseur === "joueur"){
        await sleep(400);
        await oneTicPendantCombat(defenseur, attaquant, cartesPlayer2, setProjectileAnim);
        await sleep(400);
      }else{
        await sleep(400);
        await oneTicPendantCombat(defenseur, attaquant, cartesPlayer, setProjectileAnim);
        await sleep(400);
      }

    }

    // 3. Mettre à jour les boards (React déclenche les useEffect dans Card.jsx)
    setBoardCombat([...cartesPlayer]);
    setBoardCombatPlayer2([...cartesPlayer2]);
    
    // 4. Attendre l'affichage
    await sleep(400);
    
    // 5. Réinitialiser les animations
    attaquant.degatsRecus = 0;
    defenseur.degatsRecus = 0;
            
    // 6. Re-update pour que les popup disparaissent
    setBoardCombat([...cartesPlayer]);
    setBoardCombatPlayer2([...cartesPlayer2]);

    console.log("pv restant de", attaquant.nom, ":", attaquant.hp, "pv" )
    console.log("pv restant de", defenseur.nom, ":", defenseur.hp, "pv" )

    if(attaquant.degatsAdj && attaquant.atkDispo === true){
      degatsAdj(attaquant, defenseur, cartesPlayer, cartesPlayer2, nomDefenseur, setGriffeEffects)
      await sleep(400);
      cartesPlayer.forEach(carte => {
        carte.degatsRecus =0
      });
      cartesPlayer2.forEach(carte => {
        carte.degatsRecus =0
      });

    }

    verifFureurCelesteApresAttaque(defenseur, nomDefenseur, setFureurCeleste, fureurCelesteRef, setFureurCelesteP2, fureurCelesteRefP2, cartesPlayer, cartesPlayer2, attaquant, nomAttaquant)


    //Reatribution flag d'attaque après tour de combat
    if(nomAttaquant === "joueur"){
      attaquant.atkDispo = false
      if(cartesPlayer.length > 1){
        if(attaquant === cartesPlayer[cartesPlayer.length - 1]){
          cartesPlayer[0].atkDispo = true
        }else{
          cartesPlayer[cartesPlayer.indexOf(attaquant) + 1 ].atkDispo = true
        } 
      }else{
        cartesPlayer[0].atkDispo = true
      }
      if(attaquant.control){
        if(cartesPlayer.length > 1){
          if (defenseur.hp <= 0 && nomDefenseur === "joueur2" && defenseur.atkDispo === true && defenseur === cartesPlayer[cartesPlayer.length - 1] ){
            cartesPlayer[0].atkDispo = true
          }
          if(defenseur.hp <= 0 && nomDefenseur === "joueur2" && defenseur.atkDispo === true && defenseur !== cartesPlayer[cartesPlayer.length - 1]){
            cartesPlayer[cartesPlayer.indexOf(defenseur) + 1 ].atkDispo = true
          }
        }else{
          cartesPlayer[0].atkDispo = true
        }
      }else{
        if(cartesPlayer2.length > 1){
          if (defenseur.hp <= 0 && nomDefenseur === "joueur2" && defenseur.atkDispo === true && defenseur === cartesPlayer2[cartesPlayer2.length - 1] ){
            cartesPlayer2[0].atkDispo = true
          }
          if(defenseur.hp <= 0 && nomDefenseur === "joueur2" && defenseur.atkDispo === true && defenseur !== cartesPlayer2[cartesPlayer2.length - 1]){
            cartesPlayer2[cartesPlayer2.indexOf(defenseur) + 1 ].atkDispo = true
          }
        }else{
          cartesPlayer2[0].atkDispo = true
        }
      }  
 
    }
    if(nomAttaquant === "joueur2"){
      attaquant.atkDispo = false
      if(cartesPlayer2.length > 1){
        if(attaquant === cartesPlayer2[cartesPlayer2.length - 1]){
          cartesPlayer2[0].atkDispo = true
        }else{
          cartesPlayer2[cartesPlayer2.indexOf(attaquant) + 1 ].atkDispo = true
        } 
      }else{
        cartesPlayer2[0].atkDispo = true
      }
      if(attaquant.control){
        if(cartesPlayer2.length > 1){
          if (defenseur.hp <= 0 && nomDefenseur === "joueur" && defenseur.atkDispo === true && defenseur === cartesPlayer2[cartesPlayer2.length - 1] ){
            cartesPlayer2[0].atkDispo = true
          }
          if(defenseur.hp <= 0 && nomDefenseur === "joueur" && defenseur.atkDispo === true && defenseur !== cartesPlayer2[cartesPlayer2.length - 1]){
            cartesPlayer2[cartesPlayer2.indexOf(defenseur) + 1 ].atkDispo = true
          }
        }else{
          cartesPlayer2[0].atkDispo = true
        }
      }else{
        if(cartesPlayer.length > 1){
          if (defenseur.hp <= 0 && nomDefenseur === "joueur" && defenseur.atkDispo === true && defenseur === cartesPlayer[cartesPlayer.length - 1] ){
            cartesPlayer[0].atkDispo = true
          }
          if(defenseur.hp <= 0 && nomDefenseur === "joueur" && defenseur.atkDispo === true && defenseur !== cartesPlayer[cartesPlayer.length - 1]){
            cartesPlayer[cartesPlayer.indexOf(defenseur) + 1 ].atkDispo = true
          }
        }else{
          cartesPlayer[0].atkDispo = true
        }
      }  

    }

    if(attaquant.control){
      attaquant.control = false
    }
    await sleep(50);
    //Fin de reatribution flag d'attaque après tour de combat
    boardPositionFight(cartesPlayer)
    boardPositionFight(cartesPlayer2)

    await sleep(400);

    // 🔪 Ensuite on retire les cartes mortes
    // 1. Identifier les cartes mortes
    const cartesMortesPlayer = cartesPlayer.filter(c => c.hp <= 0);
    const cartesMortesPlayer2 = cartesPlayer2.filter(c => c.hp <= 0);

    // 2. Appeler les deathTrigger chez les survivants du même camp

    cartesMortesPlayer.forEach(carteMorte => {

      cartesPlayer.forEach(survivant => {
        if (survivant.deathTrigger) {
          survivant.deathTrigger(carteMorte, cartesPlayer, survivant);
        }
      });
      if(carteMorte.nom === "Incandescence de braise"){
        setBonusAtkElem(bonusAtkElem + 1)
      }
      if(carteMorte.nom === "Gentil djinn"){
        piocherCarteFamille(carteMorte, deck, setDeck)
      }
      if(carteMorte.reincarnation){
        carteMorte.boardPosition = cartesPlayer.length + 1

      }
    });
  
    cartesMortesPlayer2.forEach(carteMorte => {
        cartesPlayer2.forEach(survivant => {
            if (survivant.deathTrigger) {
                survivant.deathTrigger(carteMorte, cartesPlayer2, survivant);
            }
        });
        if(carteMorte.nom === "Incandescence de braise"){
            setBonusAtkElem(bonusAtkElem + 1)
        }
        if(carteMorte.nom === "Gentil djinn"){
            piocherCarteFamille(carteMorte, deckPlayer2, setDeckPlayer2)
        }
        if(carteMorte.reincarnation){
            carteMorte.boardPosition = cartesPlayer2.length + 1
            console.log(carteMorte)
        }
    });

    // 3. Retirer les morts du board
    cartesPlayer = cartesPlayer.filter(c => c.hp > 0);
    cartesPlayer2 = cartesPlayer2.filter(c => c.hp > 0);

    // 4. Mettre à jour les boards affichés
    setBoardCombat([...cartesPlayer]);
    setBoardCombatPlayer2([...cartesPlayer2]);
    if(defenseur.reincarnation || attaquant.reincarnation || defenseur.transformation || attaquant.transformation){
      if(defenseur.hp < 0 || attaquant.hp < 0){
        await sleep(400);
        cartesMortesPlayer.forEach(carteMorte => {
          if(carteMorte.reincarnation){
            carteMorte.hp = 1
            carteMorte.boardPosition = cartesPlayer.length + 1
            cartesPlayer.push(carteMorte); // 👈 on les remet directement dans cartesPlayer
            carteMorte.reincarnation = false
          }
          if(carteMorte.transformation){
            
            const reprouve = cards[carteMorte.carteSpe]
            console.log(reprouve)
            const clone = clonerCarte({ carte: reprouve, camp: "joueur" })
            
            cartesPlayer.push(clone);
          }
        });
        cartesMortesPlayer2.forEach(carteMorte => {
          if(carteMorte.reincarnation){
            carteMorte.hp = 1
            carteMorte.boardPosition = cartesPlayer2.length + 1
            cartesPlayer2.push(carteMorte); // 👈 on les remet directement dans cartesPlayer
            carteMorte.reincarnation = false
          }
        })
  
      
        setBoardCombat([...cartesPlayer]);
        setBoardCombatPlayer2([...cartesPlayer2]);
        await sleep(600);
      }
      let index = 1
      cartesPlayer.forEach(carte => {
        carte.degatsRecus = 0
        carte.boardPosition = index
        index ++
      });
      let index1 = 1
      cartesPlayer2.forEach(carte => {
        carte.degatsRecus = 0
        carte.boardPosition = index1
        index1 ++
      });
      // Mise à jour des boards après buffs
      setBoardCombat([...cartesPlayer]);
      setBoardCombatPlayer2([...cartesPlayer2]);
      await sleep(400);

    }
    

    return {
        cartesPlayer,
        cartesPlayer2
    };

}

export async function finDeCombat(cartesPlayer, cartesPlayer2, boardAvantCombat, boardAvantCombatPlayer2, lvlTaverne, lvlTavernePlayer2, setBoardPlayer, setBoardPlayer2, goldTour1, setgoldTour1, setGoldPlayer2, setplayerPv, setplayer2Pv, setGold, setActualPlayer, setPhase, playerPv, player2Pv, navigate, setPopupMessage, maxGold, maxGoldPlayer2){
    console.log("⚔️ Combat terminé !");
    // **Réinitialisation des PV après combat avec les buffs**
    cartesPlayer.forEach((carte) => {
        let carteOriginale = boardAvantCombat.find(c => c.id === carte.id);
        if (carteOriginale) {
            carte.hp = carteOriginale.hp,
            carte.buffHp = carteOriginale.buffHp,
            carte.buffAtk = carteOriginale.buffAtk,
            carte.auraEffect = carteOriginale.auraEffect
        }
    });
  
    cartesPlayer2.forEach((carte) => {
        let carteOriginale = boardAvantCombatPlayer2.find(c => c.id === carte.id);
        if (carteOriginale){
            carte.hp = carteOriginale.hp,
            carte.buffHp = carteOriginale.buffHp,
            carte.buffAtk = carteOriginale.buffAtk,
            carte.auraEffect = carteOriginale.auraEffect
        }
    });

    const survivantsJoueur = cartesPlayer.filter(c => c.hp > 0);
    const survivantsPlayer2 = cartesPlayer2.filter(c => c.hp > 0);

    if (survivantsJoueur.length === 0 && survivantsPlayer2.length === 0) {
        setPopupMessage("⚖️ Match nul !");
    } else {
        const degats = lvlTaverne + (survivantsJoueur.length || survivantsPlayer2.length);
        if (survivantsJoueur.length > 0) {
            setplayer2Pv(prev => prev - degats);
            setPopupMessage(`🏆 Victoire du Joueur 1, le joueur 2 perd ${degats} PV`);
        } else {
            setplayerPv(prev => prev - degats);
            setPopupMessage(`🏆 Victoire du joueur 2, le joueur 1 perd ${degats} PV`);
        }
    }

    // Restauration des boards à l'identique
    setBoardPlayer(
        boardAvantCombat.map(carte => clonerCarte({ carte, camp: "joueur" }))
    );
    setBoardPlayer2(
        boardAvantCombatPlayer2.map(carte => clonerCarte({ carte, camp: "joueur" }))
    );
    if (playerPv - (survivantsPlayer2.length > 0 ? (lvlTaverne + survivantsPlayer2.length) : 0) <= 0) {
        setPopupMessage("🏆 Le joueur 2 a gagné la partie !");
        navigate("/#/menu"); // redirection vers ta page Menu.jsx
        return;
    }
    
    if (player2Pv - (survivantsJoueur.length > 0 ? (lvlTaverne + survivantsJoueur.length) : 0) <= 0) {
        setPopupMessage("🏆 Le joueur 1 a gagné la partie !");
        navigate("/#/menu"); // redirection vers ta page Menu.jsx
        return;
    }

    let nouveauGoldJ1 = goldTour1 + 1 + (maxGold - 10);
    if(nouveauGoldJ1 > maxGold){
        nouveauGoldJ1 = maxGold
    }
    let nouveauGoldJ2 = goldTour1 + 1 + (maxGoldPlayer2 - 10);
    if(nouveauGoldJ2 > maxGoldPlayer2){
        nouveauGoldJ2 = maxGoldPlayer2
    }
    setgoldTour1(goldTour1 + 1)
    setGoldPlayer2(nouveauGoldJ2)
    setGold(nouveauGoldJ1)
  
    coutLvlTaverne[lvlTaverne]--;
    coutLvlTavernePlayer2[lvlTavernePlayer2]--;
    if(coutLvlTaverne[lvlTaverne] < 0 || coutLvlTavernePlayer2[lvlTavernePlayer2] < 0){
        coutLvlTaverne[lvlTaverne] = 0;
        coutLvlTavernePlayer2[lvlTavernePlayer2] = 0;
    }
    setActualPlayer(1)
    await sleep(200);
    setPhase("apresCombat");
}