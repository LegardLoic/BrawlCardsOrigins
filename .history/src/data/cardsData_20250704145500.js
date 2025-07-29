import {clonerCarte} from "@/utils/shopUtils";
export let uniqueID = 1000;
export function getUniqueId() {
  return uniqueID++;
}
export let boardPosition = 0;
export function getBoardPosition() {
  return boardPosition++;
}
export function getBoardPositionDec() {
  return boardPosition--;
}

export const cards = [
  {
    id: 1,
    nom: "Rok'gar Croc-des-Mers",
    lvl: 6,
    hp: 6,
    baseHp: 6,
    atk: 5,
    atkDispo: false,
    img: "img/card29.1.png",
    imgMinia: "img/cardfight29.png",
    famille: "Croc-Noir",
    sousFamille : "Marin",
    texte: "<color=rgb(20, 33, 220)>Aura</color> <color=red>+3/+3</color> aux Croc-Noir<br><br><br> <color=rgb(54, 132, 198)>Aura bivalente</color> <color=red>+5atk</color><br><br><br> Si Darka est présente<br><br> Rok'gar gagne <color=red>+4/+4</color>",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        let karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
        let bonus = karasha ? 1 : 0;
        cartesBoard.forEach(carte => {
            if(carte.bivalenceMarinEffect){
                carte.atk += 5 * bonusDoree + bonus;
                carte.buffAtk +=5 * bonusDoree + bonus;
            }
        }); 
    },
    effetDeCouple: {
      partenaire: "La Matriarche Sang'Thalla",
      effet: (cartesBoard) => {
        cartesBoard.forEach(carte => {
            if (carte.famille === "Croc-Noir") {
                carte.atk += 10;
                carte.buffAtk += 10;
            }
        });
      }
    },
  },
  {
    id: 2,
    nom: "La Matriarche Sang'Thalla",
    lvl: 6,
    hp: 6,
    baseHp: 6,
    atk: 5,
    atkDispo: false,
    img: "img/card30.1.png",
    imgMinia: "img/cardfight30.png",
    famille: "Croc-Noir",
    sousFamille : "Terrestre",
    texte: "<br><color=rgb(20, 33, 220)>Aura</color> <color=red>+5hp</color> aux Croc-Noir <br><br><br> <color=rgb(54, 132, 198)>Aura bivalente</color> <color=red>+2hp</color> <br><br><br> <color=rgb(90, 61, 40)>Aura bivalente</color> <color=red>+4atk</color>",
    bivalence: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          let karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
          let bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
        
          if (!carte.bivalenceSources) carte.bivalenceSources = [];
    
        
          if (carte.famille === "Croc-Noir") {
            if (carte.bivalenceTerrestreEffect && !carte.bivalenceSources.includes("Sang'Thalla")) {
              carte.hp += 5 * bonusDoree + bonus;
              carte.buffHp += 5 * bonusDoree + bonus;
              carte.buffHpBivalence += 5 * bonusDoree + bonus;
              carte.bivalenceEffect = true;
              carte.bivalenceSources.push("Sang'Thalla");
            }
            if (!carte.bivalenceTerrestreEffect && carte.bivalenceSources.includes("Sang'Thalla")) {
              carte.hp -= 5 * bonusDoree + bonus;
              carte.buffHp -= 5 * bonusDoree + bonus;
              carte.buffHpBivalence -= 5 * bonusDoree + bonus;
              carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Sang'Thalla");
              if(carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0){
                carte.bivalenceEffect = false;
              }
            }
          }
        });
    },
    bivalenceSell: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (!carte.bivalenceSources) return;
          const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
          const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
          // Si la source est présente dans les effets appliqués
          if (carte.bivalenceSources.includes("Sang'Thalla")) {
    
            // Retrait des effets appliqués par cette source
            if (carte.bivalenceTerrestreEffect) {
            
              carte.hp -= 5 * bonusDoree + bonus;
              carte.buffHp -= 5 * bonusDoree + bonus;
              carte.buffHpBivalence -= 5 * bonusDoree + bonus;
            }
    
            // Suppression de la source
            carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Sang'Thalla");
    
            // Si plus aucun buff actif, on désactive le flag global
            if (carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0) {
              carte.bivalenceEffect = false;
            }
          }
        });
    },
    effetDeCouple: {
      partenaire: "Rok'gar Croc-des-Mers",
      effet: (cartesBoard) => {
        cartesBoard.forEach(carte => {
            if (carte.famille === "Croc-Noir") {
                carte.hp += 10;
                carte.buffHp += 10;
            }
        });
      }
    },
  },
  {
    id: 3,
    nom: "Shak’Noth, l’Oracle des Marées",
    lvl: 6,
    hp: 4,
    baseHp: 4,
    atk: 7,
    atkDispo: false,
    img: "img/card31.1.png",
    imgMinia: "img/cardfight31.png",
    famille: "Croc-Noir",
    sousFamille : "Marin",
    piocherCarte: true,
    texte: "<i>Cri</i><br><br><color=red>+4/+4</color> aux Croc-Noir<br><br><br> Vous invoquez un Croc-Noir <br><br> de niveau aléatoire",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Croc-Noir"){
                carte.atk += 4 * bonusDoree;
                carte.buffAtk +=4 * bonusDoree;
                carte.hp += 4 * bonusDoree;
                carte.buffHp +=4 * bonusDoree;
            }
        }); 
    },
  },
  {
    id: 4,
    nom: "Kaz'Drok le Maudit",
    lvl: 6,
    hp: 7,
    baseHp: 7,
    atk: 2,
    atkDispo: false,
    img: "img/card32.1.png",
    imgMinia: "img/cardfight32.png",
    famille: "Croc-Noir",
    sousFamille : "Terrestre",
    texte: "<i>Debut de combat</i><br><br><color=red>-4hp</color> à tous les ennemis <br><br><br> <color=rgb(54, 132, 198)>Aura bivalente</color> <color=red>+4atk</color> <br><br> <color=rgb(90, 61, 40)>Aura bivalente</color> <color=red>+4hp</color>",
    aoeCible: (cartesBoardAdv, carteAoe) => {
        let bonusDoree = 1
        if(carteAoe.estDoree){
            bonusDoree = 2
        }
        cartesBoardAdv.forEach(carte => {
            if(carte.bouclierUse){
                carte.hp -= 0;
                carte.degatsRecus = 0;
                carte.bouclierUse = false
                carte.animAoE = true;
            }else{
                carte.hp -= 4 * bonusDoree;
                carte.degatsRecus = 4 * bonusDoree;
                carte.animAoE = true;
            }
        });  
    },
    bivalence: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
          const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
          if (!carte.bivalenceSources) carte.bivalenceSources = [];
        
          if (carte.famille === "Croc-Noir") {
            if (carte.bivalenceTerrestreEffect && !carte.bivalenceSources.includes("Kaz'Drok")) {
              carte.hp += 5 * bonusDoree + bonus;
              carte.buffHp += 5 * bonusDoree + bonus;
              carte.buffHpBivalence += 5 * bonusDoree + bonus;
              carte.bivalenceEffect = true;
              carte.bivalenceSources.push("Kaz'Drok");
            }
            if (!carte.bivalenceTerrestreEffect && carte.bivalenceSources.includes("Kaz'Drok")) {
              carte.hp -= 5 * bonusDoree + bonus;
              carte.buffHp -= 5 * bonusDoree + bonus;
              carte.buffHpBivalence -= 5 * bonusDoree + bonus;
              carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Kaz'Drok");
              if(carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0){
                carte.bivalenceEffect = false;
              }
            }
          }
        });
    },
    bivalenceSell: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (!carte.bivalenceSources) return;
          const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
          const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
          // Si la source est présente dans les effets appliqués
          if (carte.bivalenceSources.includes("Kaz'Drok")) {
      
      
            if (carte.bivalenceTerrestreEffect) {
              carte.hp -= 5 * bonusDoree + bonus;
              carte.buffHp -= 5 * bonusDoree + bonus;
              carte.buffHpBivalence -= 5 * bonusDoree + bonus;
            }
      
            // Suppression de la source
            carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Kaz'Drok");
      
            // Si plus aucun buff actif, on désactive le flag global
            if (carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0) {
              carte.bivalenceEffect = false;
            }
          }
        });  
    },
  },
  {
    id: 5,
    nom: "Zog'Bar le Vent d'Acier",
    lvl: 6,
    hp: 5,
    baseHp: 5,
    atk: 4,
    atkDispo: false,
    img: "img/card33.1.png",
    imgMinia: "img/cardfight33.png",
    famille: "Croc-Noir",
    sousFamille : "Terrestre",
    texte: "A chaque attaque <br><br> Inflige des dégats aux<br><br> adv adjacents<br><br> <color=rgb(54, 132, 198)>Aura bivalente</color> <color=red>+3atk</color> <br><br> <color=rgb(90, 61, 40)>Aura bivalente</color> <color=red>+3hp</color>",
    degatsAdj: true,
    bivalence: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (!carte.bivalenceSources) carte.bivalenceSources = [];
          const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
          const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
          
          if (carte.famille === "Croc-Noir") {
            if (carte.bivalenceTerrestreEffect && !carte.bivalenceSources.includes("Zog'Bar")) {
              carte.hp += 3 * bonusDoree + bonus;
              carte.buffHp += 3 * bonusDoree + bonus;
              carte.buffHpBivalence += 3 * bonusDoree + bonus;
              carte.bivalenceEffect = true;
              carte.bivalenceSources.push("Zog'Bar");
            }
            if (!carte.bivalenceTerrestreEffect && carte.bivalenceSources.includes("Zog'Bar")) {
              carte.hp -= 3 * bonusDoree + bonus;
              carte.buffHp -= 3 * bonusDoree + bonus;
              carte.buffHpBivalence -= 3 * bonusDoree + bonus;
              carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Zog'Bar");
              if(carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0){
                carte.bivalenceEffect = false;
              }
            }
          }
        });
    },
    bivalenceSell: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (!carte.bivalenceSources) return;
          const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
          const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
          // Si la source est présente dans les effets appliqués
          if (carte.bivalenceSources.includes("Zog'Bar")) {
      
            // Retrait des effets appliqués par cette source
            if (carte.bivalenceTerrestreEffect) {
              carte.hp -= 3 * bonusDoree + bonus;
              carte.buffHp -= 3 * bonusDoree + bonus;
              carte.buffHpBivalence -= 3 * bonusDoree + bonus;
            }
      
            // Suppression de la source
            carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Zog'Bar");
      
            // Si plus aucun buff actif, on désactive le flag global
            if (carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0) {
              carte.bivalenceEffect = false;
            }
          }
        });  
    },
  },
  {
    id: 6,
    nom: "Darka la Brise-Voiles",
    lvl: 5,
    hp: 6,
    baseHp: 6,
    atk: 4,
    atkDispo: false,
    img: "img/card34.1.png",
    imgMinia: "img/cardfight34.png",
    famille: "Croc-Noir",
    sousFamille : "Marin",
    texte: "<color=rgb(54, 132, 198)>Aura bivalente</color> <color=red>+4/+2</color> <br><br> <color=rgb(90, 61, 40)>Aura bivalente</color> <color=red>+2/+4</color>",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Croc-Noir"){
                carte.atk += 3 * bonusDoree;
                carte.buffAtk +=3 * bonusDoree;
                if(carte.bivalenceMarinEffect){
                    carte.atk += 3 * bonusDoree;
                    carte.buffAtk +=3 * bonusDoree;
                }
            }
        });
    },
  },
  {
    id: 7,
    nom: "Grûm le Sculpteur de Crocs",
    lvl: 5,
    hp: 7,
    baseHp: 7,
    atk: 3,
    atkDispo: false,
    img: "img/card35.1.png",
    imgMinia: "img/cardfight35.png",
    famille: "Croc-Noir",
    sousFamille : "Terrestre",
    texte: "<i>En Combat</i><br><br>Lorsqu'un Croc-Noir meurt<br><br> ceux en vie gagnent <color=red>+1/+1</color><br><br> <color=rgb(54, 132, 198)>Bivalence</color> <color=red>+1atk</color> supp <br><br><color=rgb(90, 61, 40)>Bivalence</color> <color=red>+1hp</color> supp",
    deathTrigger: (mortCarte, cartesBoard, self) => {
      // Ne rien faire si la carte morte n’est pas Croc-Noir ou si elle est Grûm lui-même
      if (mortCarte.famille !== "Croc-Noir" || mortCarte.id === self.id) return;
      const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
      const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
    
      // Cherche les cibles valides (autres Croc-Noir vivants, excluant Grûm et la carte morte)
      const cibles = cartesBoard.filter(c =>
        c.famille === "Croc-Noir" &&
        c.id !== self.id &&
        c.id !== mortCarte.id &&
        c.hp > 0
      );
    
      if (cibles.length === 0) return;
    
      // Choisir une cible aléatoire
      const cible = cibles[Math.floor(Math.random() * cibles.length)];
      let bonusDoree = 1
      if(self.estDoree){
          bonusDoree = 2
      }
      // Appliquer les buffs selon la bivalence
        if (self.bivalenceMarinEffect) {
          cible.atk += 2 * bonusDoree + bonus;
          cible.hp += 1 * bonusDoree + bonus;
          cible.buffAtk += 2 * bonusDoree + bonus;
          cible.buffHp += 1 * bonusDoree + bonus;
          cible.buffAtkGrum = (cible.buffAtkGrum || 0) + 2 * bonusDoree + bonus;
          cible.buffHpGrum = (cible.buffHpGrum || 0) + 1 * bonusDoree + bonus;
        } else if (self.bivalenceTerrestreEffect) {
          cible.atk += 1 * bonusDoree + bonus;
          cible.hp += 2 * bonusDoree + bonus;
          cible.buffAtk += 1 * bonusDoree + bonus;
          cible.buffHp += 2 * bonusDoree + bonus;
          cible.buffAtkGrum = (cible.buffAtkGrum || 0) + 1 * bonusDoree + bonus;
          cible.buffHpGrum = (cible.buffHpGrum || 0) + 2 * bonusDoree + bonus;
        } else {
          cible.atk += 1 * bonusDoree + bonus;
          cible.buffAtk += 1 * bonusDoree + bonus;
          cible.buffAtkGrum = (cible.buffAtkGrum || 0) + 1 * bonusDoree + bonus;
        }
      cible.grumBuffEffect = true; // Pour tracking ou affichage
    }
    
  },

  {
    id: 8,
    nom: "Brak'Na la Dompteuse d'Écaille",
    lvl: 6,
    hp: 4,
    baseHp: 4,
    atk: 5,
    atkDispo: false,
    img: "img/card36.1.png",
    imgMinia: "img/cardfight36.png",
    famille: "Croc-Noir",
    sousFamille : "Marin",
    texte: "<i>Cri</i><br><br> Vous obtenez <color=white>LE REQUIN</color><br><br><br><color=rgb(54, 132, 198)>Bivalence</color> <color=white>LE REQUIN</color> gagne <br><br><color=red>+4/+4</color>",
    carteSpe: 23,
    piocherCarteSpe: true,
    bivalence: (cartesBoard, draggedCard) => {
      let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (!carte.bivalenceSources) carte.bivalenceSources = [];
          const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
          const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
      
          if (carte.bivalenceMarinEffect && carte.nom === "LE REQUIN") {
            if (carte.bivalenceMarinEffect && !carte.bivalenceSources.includes("Brak'Na")) {
              carte.atk += 4 * bonusDoree + bonus;
              carte.buffAtk += 4 * bonusDoree + bonus;
              carte.buffAtkBivalence += 4 * bonusDoree + bonus;
              carte.hp += 4 * bonusDoree + bonus;
              carte.buffHp += 4 * bonusDoree + bonus;
              carte.buffHpBivalence += 4 * bonusDoree + bonus;
              carte.bivalenceEffect = true;
              carte.bivalenceSources.push("Brak'Na");
            }
            if (!carte.bivalenceMarinEffect && carte.bivalenceSources.includes("Brak'Na")) {
              carte.atk -= 4 * bonusDoree + bonus;
              carte.buffAtk -= 4 * bonusDoree + bonus;
              carte.buffAtkBivalence -= 4 * bonusDoree + bonus;
              carte.hp -= 4 * bonusDoree + bonus;
              carte.buffHp -= 4 * bonusDoree + bonus;
              carte.buffHpBivalence -= 4 * bonusDoree + bonus;
              carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Brak'Na");
              if(carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0){
                carte.bivalenceEffect = false;
              }
            }
          }
        });
    },
    bivalenceSell: (cartesBoard, draggedCard) => {
      let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (!carte.bivalenceSources) return;
          const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
          const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
      
          // Si la source est présente dans les effets appliqués
          if (carte.bivalenceSources.includes("Brak'Na")) {
      
            // Retrait des effets appliqués par cette source
            if (carte.bivalenceMarinEffect && carte.nom === "LE REQUIN") {
              
              carte.atk -= 4 * bonusDoree + bonus;
              carte.buffAtk -= 4 * bonusDoree + bonus;
              carte.buffAtkBivalence -= 4 * bonusDoree + bonus;
              carte.hp -= 4 * bonusDoree + bonus;
              carte.buffHp -= 4 * bonusDoree + bonus;
              carte.buffHpBivalence -= 4 * bonusDoree + bonus;
            }
      
            // Suppression de la source
            carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Brak'Na");
      
            // Si plus aucun buff actif, on désactive le flag global
            if (carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0) {
              carte.bivalenceEffect = false;
            }
          }
        });
    },
  },
 
  {
    id: 9,
    nom: "Urgak la Ravageuse",
    lvl: 5,
    hp: 5,
    baseHp: 5,
    atk: 4,
    atkDispo: false,
    img: "img/card38.1.png",
    imgMinia: "img/cardfight38.png",
    famille: "Croc-Noir",
    sousFamille : "Terrestre",
    texte: "<i>Cri</i><br><br><color=red>+3/+3</color> aux Croc-Noir<br><br><br> <color=rgb(54, 132, 198)>Bivalence</color> <color=red>+3atk</color> supp<br><br><color=rgb(90, 61, 40)>Bivalence</color> <color=red>+3hp</color> supp",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Croc-Noir"){
                carte.hp += 3 * bonusDoree;
                carte.buffHp += 3 * bonusDoree;
                if(carte.bivalenceTerrestreEffect){
                    carte.hp += 3 * bonusDoree;
                    carte.buffHp += 3 * bonusDoree;
                }
            }
        });
    },

  },
  {
    id: 10,
    nom: "Vrak'Nul le Hurleur des Cimes",
    lvl: 4,
    hp: 4,
    baseHp: 4,
    atk: 5,
    atkDispo: false,
    img: "img/card39.1.png",
    imgMinia: "img/cardfight39.png",
    famille: "Croc-Noir",
    sousFamille : "Terrestre",
    texte: "<i>Debut de combat</i><br><br><color=red>-2hp</color> à tous les ennemis <br><br><br> <color=rgb(54, 132, 198)>Aura bivalente</color> <color=red>+4atk</color><br><br> <color=rgb(90, 61, 40)>Aura bivalente</color> <color=red>+4hp</color>",
    degatsAdj: false,
    furie: true,
    furieUse: false,
    aoeCible: (cartesBoardAdv, cardAoe) => {
      let bonusDoree = 1
        if(cardAoe.estDoree){
            bonusDoree = 2
        }
        cartesBoardAdv.forEach(carte => {
          if(carte.bouclierUse){
            carte.hp -= 0;
            carte.degatsRecus = 0;
            carte.bouclierUse = false
            carte.animAoE = true;
          }else{
            carte.hp -= 2 * bonusDoree;
            carte.degatsRecus = 2 * bonusDoree;
            carte.animAoE = true;
          }
        });
      
    },
    bivalence: (cartesBoard, draggedCard) => {
      let bonusDoree = 1
      if(draggedCard.estDoree){
        bonusDoree = 2
      }
      cartesBoard.forEach(carte => {
          if (!carte.bivalenceSources) carte.bivalenceSources = [];
          const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
          const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
          if (carte.famille === "Croc-Noir") {
            if (carte.bivalenceTerrestreEffect && !carte.bivalenceSources.includes("Vrak'Nul")) {
              carte.hp += 4 * bonusDoree + bonus;
              carte.buffHp += 4 * bonusDoree + bonus;
              carte.buffHpBivalence += 4 * bonusDoree + bonus;
              carte.bivalenceEffect = true;
              carte.bivalenceSources.push("Vrak'Nul");
            }
            if (!carte.bivalenceTerrestreEffect && carte.bivalenceSources.includes("Vrak'Nul")) {
              carte.hp -= 4 * bonusDoree + bonus;
              carte.buffHp -= 4 * bonusDoree + bonus;
              carte.buffHpBivalence -= 4 * bonusDoree + bonus;
              carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Vrak'Nul");
              if(carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0){
                carte.bivalenceEffect = false;
              }
            }
          }
        });
    },
    bivalenceSell: (cartesBoard, draggedCard) => {
      let bonusDoree = 1
      if(draggedCard.estDoree){
        bonusDoree = 2
      }
      cartesBoard.forEach(carte => {
          if (!carte.bivalenceSources) return;
          const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
          const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
          // Si la source est présente dans les effets appliqués
          if (carte.bivalenceSources.includes("Vrak'Nul")) {
      
            // Retrait des effets appliqués par cette source
      
            if (carte.bivalenceTerrestreEffect) {
              carte.hp -= 4 * bonusDoree + bonus;
              carte.buffHp -= 4 * bonusDoree + bonus;
              carte.buffHpBivalence -= 4 * bonusDoree + bonus;
            }
      
            // Suppression de la source
            carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Vrak'Nul");
      
            // Si plus aucun buff actif, on désactive le flag global
            if (carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0) {
              carte.bivalenceEffect = false;
            }
          }
        });
    },
  },
  {
    id: 11,
    nom: "Ka'Rasha la Lieuse d'Esprits",
    lvl: 4,
    hp: 6,
    baseHp: 6,
    atk: 3,
    atkDispo: false,
    img: "img/card40.1.png",
    imgMinia: "img/cardfight40.png",
    famille: "Croc-Noir",
    sousFamille : "Marin",
    texte: "<color=rgb(20, 33, 220)>Aura</color> Les effets Bivalents<br><br> sont doublés<br><br><br> <color=rgb(54, 132, 198)>Aura bivalente</color> <color=red>+2/+1</color> <br><br> <color=rgb(90, 61, 40)>Aura bivalente</color> <color=red>+1/+2</color>",
    bivalence: (cartesBoard, draggedCard) => {
      let bonusDoree = 1
      if(draggedCard.estDoree){
        bonusDoree = 2
      }
      cartesBoard.forEach(carte => {
          if (!carte.bivalenceSources) carte.bivalenceSources = [];
          const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
          const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
      
          if (carte.famille === "Croc-Noir") {
            if (carte.bivalenceMarinEffect && !carte.bivalenceSources.includes("Ka'Rasha")) {
              carte.atk += 2 * bonusDoree + bonus;
              carte.buffAtk += 2 * bonusDoree + bonus;
              carte.buffAtkBivalence += 2 * bonusDoree + bonus;
              carte.hp += 1 * bonusDoree + bonus;
              carte.buffHp += 1 * bonusDoree + bonus;
              carte.buffHpBivalence += 1 * bonusDoree + bonus;
              carte.bivalenceEffect = true;
              carte.bivalenceSources.push("Ka'Rasha");
            }
            if (!carte.bivalenceMarinEffect && carte.bivalenceSources.includes("Ka'Rasha")) {
              carte.atk -= 2 * bonusDoree + bonus;
              carte.buffAtk -= 2 * bonusDoree + bonus;
              carte.buffAtkBivalence -= 2 * bonusDoree + bonus;
              carte.hp -= 1 * bonusDoree + bonus;
              carte.buffHp -= 1 * bonusDoree + bonus;
              carte.buffHpBivalence -= 1 * bonusDoree + bonus;
              carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Ka'Rasha");
              if(carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0){
                carte.bivalenceEffect = false;
              }
            }
          }
          
          if (carte.famille === "Croc-Noir") {
            if (carte.bivalenceTerrestreEffect && !carte.bivalenceSources.includes("Ka'Rasha")) {
              carte.hp += 2 * bonusDoree + bonus;
              carte.buffHp += 2 * bonusDoree + bonus;
              carte.buffHpBivalence += 2 * bonusDoree + bonus;
              carte.atk += 1 * bonusDoree + bonus;
              carte.buffAtk += 1 * bonusDoree + bonus;
              carte.buffAtkBivalence += 1 * bonusDoree + bonus;
              carte.bivalenceEffect = true;
              carte.bivalenceSources.push("Ka'Rasha");
            }
            if (!carte.bivalenceTerrestreEffect && carte.bivalenceSources.includes("Ka'Rasha")) {
              carte.hp -= 2 * bonusDoree + bonus;
              carte.buffHp -= 2 * bonusDoree + bonus;
              carte.buffHpBivalence -= 2 * bonusDoree + bonus;
              carte.atk -= 1 * bonusDoree + bonus;
              carte.buffAtk -= 1 * bonusDoree + bonus;
              carte.buffAtkBivalence -= 1 * bonusDoree + bonus;
              carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Ka'Rasha");
              if(carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0){
                carte.bivalenceEffect = false;
              }
            }
          }
        });
    },
    bivalenceSell: (cartesBoard, draggedCard) => {
      let bonusDoree = 1
      if(draggedCard.estDoree){
        bonusDoree = 2
      }
      cartesBoard.forEach(carte => {
          if (!carte.bivalenceSources) return;
          const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
          const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
          // Si la source est présente dans les effets appliqués
          if (carte.bivalenceSources.includes("Ka'Rasha")) {
      
            // Retrait des effets appliqués par cette source
            if (carte.bivalenceMarinEffect) {
              
              carte.atk -= 2 * bonusDoree + bonus;
              carte.buffAtk -= 2 * bonusDoree + bonus;
              carte.buffAtkBivalence -= 2 * bonusDoree + bonus;
              carte.hp -= 1 * bonusDoree + bonus;
              carte.buffHp -= 1 * bonusDoree + bonus;
              carte.buffHpBivalence -= 1 * bonusDoree + bonus;
            }
      
            if (carte.bivalenceTerrestreEffect) {
              carte.hp -= 2 * bonusDoree + bonus;
              carte.buffHp -= 2 * bonusDoree + bonus;
              carte.buffHpBivalence -= 2 * bonusDoree + bonus;
              carte.atk -= 1 * bonusDoree + bonus;
              carte.buffAtk -= 1 * bonusDoree + bonus;
              carte.buffAtkBivalence -= 1 * bonusDoree + bonus;
            }
      
            // Suppression de la source
            carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Ka'Rasha");
      
            // Si plus aucun buff actif, on désactive le flag global
            if (carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0) {
              carte.bivalenceEffect = false;
            }
          }
        });  
    },
  },

  {
    id: 12,
    nom: "Na'Kra des Cendres Brûlantes",
    lvl: 4,
    hp: 4,
    baseHp: 4,
    atk: 4,
    atkDispo: false,
    img: "img/card42.1.png",
    imgMinia: "img/cardfight42.png",
    famille: "Croc-Noir",
    sousFamille : "Terrestre",
    texte: "<i>Debut de combat</i><br><br><br><color=red>-2hp</color> à tous les ennemis <br><br><br> <color=rgb(90, 61, 40)>Aura bivalente</color> Les Croc-Noir<br><br> ont <color=red>+2hp</color>",
    aoeCible: (cartesBoardAdv, carteAoe) => {
      let bonusDoree = 1
        if(carteAoe.estDoree){
          bonusDoree = 2
        }
        cartesBoardAdv.forEach(carte => {
          if(carte.bouclierUse){
            carte.hp -= 0;
            carte.degatsRecus = 0;
            carte.bouclierUse = false
            carte.animAoE = true;
          }else{
            carte.hp -= 2 * bonusDoree;
            carte.degatsRecus = 2 * bonusDoree;
            carte.animAoE = true;
          }
        });
    },
    bivalence: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
          bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (!carte.bivalenceSources) carte.bivalenceSources = [];
          const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
          const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
          if (carte.famille === "Croc-Noir") {
            if (carte.bivalenceTerrestreEffect && !carte.bivalenceSources.includes("Na'Kra")) {
              carte.hp += 2 * bonusDoree + bonus;
              carte.buffHp += 2 * bonusDoree + bonus;
              carte.buffHpBivalence += 2 * bonusDoree + bonus;
              carte.bivalenceEffect = true;
              carte.bivalenceSources.push("Na'Kra");
            }
            if (!carte.bivalenceTerrestreEffect && carte.bivalenceSources.includes("Na'Kra")) {
              carte.hp -= 2 * bonusDoree + bonus;
              carte.buffHp -= 2 * bonusDoree + bonus;
              carte.buffHpBivalence -= 2 * bonusDoree + bonus;
              carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Na'Kra");
              if(carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0){
                carte.bivalenceEffect = false;
              }
            }
          }
        });
    },
    bivalenceSell: (cartesBoard, draggedCard) => {
      let bonusDoree = 1
        if(draggedCard.estDoree){
          bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (!carte.bivalenceSources) return;
          const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
          const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
          // Si la source est présente dans les effets appliqués
          if (carte.bivalenceSources.includes("Na'Kra")) {
      
            // Retrait des effets appliqués par cette source
      
            if (carte.bivalenceTerrestreEffect) {
              carte.hp -= 2 * bonusDoree + bonus;
              carte.buffHp -= 2 * bonusDoree + bonus;
              carte.buffHpBivalence -= 2 * bonusDoree + bonus;
            }
      
            // Suppression de la source
            carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Na'Kra");
      
            // Si plus aucun buff actif, on désactive le flag global
            if (carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0) {
              carte.bivalenceEffect = false;
            }
          }
        });     
    },
  },
  {
    id: 13,
    nom: "Sha'Rok, la pisteuse furtive",
    lvl: 4,
    hp: 5,
    baseHp: 5,
    atk: 3,
    atkDispo: false,
    img: "img/card43.1.png",
    imgMinia: "img/cardfight43.png",
    famille: "Croc-Noir",
    sousFamille : "Marin",
    texte: "<i>Cri</i><br><br> <color=red>+2/+2</color> à un Croc-Noir<br><br><br> Vous obtenez un Croc-Noir<br><br> de lvl inferieur à Sha'Rok",
    piocherCarteInf: true,
    criDeGuerreCible: true,
    criDeGuerre: ({draggedCard, carte}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        carte.atk += 2 * bonusDoree;
        carte.buffAtk +=2 * bonusDoree;
        carte.hp += 2 * bonusDoree;
        carte.buffHp += 2 * bonusDoree;
        if(carte.bivalenceMarinEffect){
            carte.atk += 1 * bonusDoree;
            carte.buffAtk +=1 * bonusDoree;
        }else{
            carte.hp += 1 * bonusDoree;
            carte.buffHp += 1 * bonusDoree;
        }
    },
  },
  {
    id: 14,
    nom: "Trok'Ma, l'Écumeur Grinçant",
    lvl: 3,
    hp: 4,
    baseHp: 4,
    atk: 3,
    atkDispo: false,
    img: "img/card44.1.png",
    imgMinia: "img/cardfight44.png",
    famille: "Croc-Noir",
    sousFamille : "Marin",
    texte: "<i>Cri</i><br><br> <color=red>+3 atk</color> à un Croc-Noir <br><br><br> <color=rgb(54, 132, 198)>Bivalence</color> <color=red>+3 atk</color> supp<br><br> <color=rgb(90, 61, 40)>Bivalence</color> <color=red>+2hp</color> supp",
    criDeGuerreCible: true,
    criDeGuerre: ({draggedCard, carte}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }   
        carte.atk += 3 * bonusDoree;
        carte.buffAtk +=3 * bonusDoree;
        if(carte.bivalenceMarinEffect){
            carte.atk += 3 * bonusDoree;
            carte.buffAtk += 3 * bonusDoree;
        }  
    },
  },
  {
    id: 15,
    nom: "Muk'Zar la Ravineuse",
    lvl: 3,
    hp: 3,
    baseHp: 3,
    atk: 4,
    atkDispo: false,
    img: "img/card45.1.png",
    imgMinia: "img/cardfight45.png",
    famille: "Croc-Noir",
    sousFamille : "Terrestre",
    texte: "<i>Cri</i><br><br> Gagne <color=red>+1/+1</color> par Croc-Noir <br><br> présent<br><br> <color=rgb(54, 132, 198)>Bivalence</color> <color=red>+2atk</color> supp <br><br> <color=rgb(90, 61, 40)>Bivalence</color> <color=red>+2hp</color> supp",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        console.log(draggedCard)
        const crocNoir = cartesBoard.filter(c => c.famille === "Croc-Noir" && c.id !== draggedCard.id);
        if (crocNoir.length > 0) {
          draggedCard.atk += crocNoir.length * bonusDoree;
          draggedCard.hp += crocNoir.length * bonusDoree;
          draggedCard.buffAtk += crocNoir.length * bonusDoree;
          draggedCard.buffHp += crocNoir.length * bonusDoree;
          if(draggedCard.bivalenceTerrestreEffect){
            draggedCard.hp += 2 * bonusDoree;
            draggedCard.buffHp += 2 * bonusDoree;
          }
          if(draggedCard.bivalenceMarinEffect){
            draggedCard.atk += 2 * bonusDoree;
            draggedCard.buffAtk += 2 * bonusDoree;
          }
          
        } 
    },
  },
  {
    id: 16,
    nom: "Zug'Rok le Dresseur de Crabes",
    lvl: 4,
    hp: 5,
    baseHp: 5,
    atk: 2,
    atkDispo: false,
    img: "img/card46.1.png",
    imgMinia: "img/cardfight46.png",
    famille: "Croc-Noir",
    sousFamille : "Marin",
    texte: "<i>Cri</i><br><br><br> Vous obtenez 1 <color=white>Craby</color><br><br><br> <color=rgb(54, 132, 198)>Bivalence</color> <color=white>Craby</color> gagne <color=red>+2/+2</color>",
    carteSpe: 24,
    piocherCarteSpe: true,
  },
  {
    id: 17,
    nom: "Narka Brise-Roches",
    lvl: 3,
    hp: 5,
    baseHp: 5,
    atk: 3,
    atkDispo: false,
    img: "img/card47.1.png",
    imgMinia: "img/cardfight47.png",
    famille: "Croc-Noir",
    sousFamille : "Terrestre",
    texte: "<br><color=rgb(20, 33, 220)>Cri</color> <color=red>+2 Hp</color> aux Croc-Noir <br><br><br> <color=rgb(90, 61, 40)>Bivalence</color> <color=red>+2hp</color>",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          carte.hp += 2 * bonusDoree;
          carte.buffHp += 2 * bonusDoree;
          if(carte.bivalenceTerrestreEffect){
            carte.hp += 2 * bonusDoree;
            carte.buffHp +=2 * bonusDoree;
          }
        })
        
    },
  },
  
  {
    id: 18,
    nom: "Krug le Moussaillon",
    lvl: 2,
    hp: 3,
    baseHp: 3,
    atk: 2,
    atkDispo: false,
    img: "img/card49.1.png",
    imgMinia: "img/cardfight49.png",
    famille: "Croc-Noir",
    sousFamille : "Marin",
    texte: "<i>Cri</i><br><br><color=red>+2atk</color> à un Croc-Noir<br><br><br><color=rgb(54, 132, 198)>Bivalence</color> <color=red>+1atk</color> supp<br><br> <color=rgb(90, 61, 40)>Bivalence</color> <color=red>+1hp</color> supp",
    criDeGuerreCible: true,
    criDeGuerre: ({draggedCard, carte}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        carte.atk += 2 * bonusDoree;
        carte.buffAtk +=2 * bonusDoree;
        if(carte.bivalenceMarinEffect){
            carte.atk += 1 * bonusDoree;
            carte.buffAtk +=1 * bonusDoree;
        }else{
            carte.hp += 1 * bonusDoree;
            carte.buffHp += 1 * bonusDoree;
        }
    },
  },
  {
    id: 19,
    nom: "Drozha l'essoreuse d'os",
    lvl: 2,
    hp: 2,
    baseHp: 2,
    atk: 3,
    atkDispo: false,
    img: "img/card50.1.png",
    imgMinia: "img/cardfight50.png",
    famille: "Croc-Noir",
    sousFamille : "Terrestre",
    texte: "<br>Lorsqu'un Croc-Noir meurt<br><br> <i>Drozha</i> gagne <color=red>+1atk</color><br><br><br> <color=rgb(54, 132, 198)>Bivalence</color> <color=red>+1atk</color> supp<br><br> <color=rgb(90, 61, 40)>Bivalence</color> <color=red>+1hp</color> supp",
    deathTrigger: (mortCarte, cartesBoard, self) => {
      // Ne rien faire si la carte morte n’est pas Croc-Noir ou si elle est Grûm lui-même
      if (mortCarte.famille !== "Croc-Noir" || mortCarte.id === self.id) return;
      const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
      const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
    
      // Cherche les cibles valides (autres Croc-Noir vivants, excluant Grûm et la carte morte)
      const cibles = cartesBoard.filter(c =>
        c.famille === "Croc-Noir" &&
        c.id !== self.id &&
        c.id !== mortCarte.id &&
        c.hp > 0
      );
    
      if (cibles.length === 0) return;
    
      // Choisir une cible aléatoire
      const cible = cibles[Math.floor(Math.random() * cibles.length)];
      let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        if (self.bivalenceMarinEffect) {
          self.atk += 2 * bonusDoree + bonus;
          self.buffAtk += 2 * bonusDoree + bonus;
          self.buffAtkGrum = (self.buffAtkGrum || 0) + 2 * bonusDoree + bonus;
        } else if (self.bivalenceTerrestreEffect) {
          self.atk += 1 * bonusDoree + bonus;
          self.buffAtk += 1 * bonusDoree + bonus;
          self.hp += 1 * bonusDoree + bonus;
          self.buffHp += 1 * bonusDoree + bonus;
          self.buffAtkGrum = (self.buffAtkGrum || 0) + 1 * bonusDoree + bonus;
          self.buffHpGrum = (self.buffHpGrum || 0) + 1 * bonusDoree + bonus;
        } else {
          self.atk += 1 * bonusDoree + bonus;
          self.buffAtk += 1 * bonusDoree + bonus;
          self.buffAtkGrum = (self.buffAtkGrum || 0) + 1 * bonusDoree + bonus;
        }
      
        self.grumBuffEffect = true; // Pour tracking ou affichage
        
    }
  },
  {
    id: 20,
    nom: "Zûn'Tul, le Mange-Racines",
    lvl: 2,
    hp: 5,
    baseHp: 5,
    atk: 1,
    atkDispo: false,
    img: "img/card51.1.png",
    imgMinia: "img/cardfight51.png",
    imgMiniaProvoc: "img/cardfight51-provoc.png",
    famille: "Croc-Noir",
    sousFamille : "Terrestre",
    texte: "<br><color=rgb(20, 33, 220)>Aura</color> <color=red>+1hp</color> aux Croc-Noir <br><br><br> <color=rgb(54, 132, 198)>Bivalence</color> Gagne furie <br><br><color=rgb(90, 61, 40)>Bivalence</color> Gagne Provocation",
    provocation: true,
    provocationUse: false,
    furie: true,
    furieUse: false,
    aura: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (carte.famille === "Croc-Noir") {
            carte.hp += 1 * bonusDoree;
            carte.buffHp += 1 * bonusDoree;
            carte.auraEffect = true;
          }
        });
    },
    auraSell: (cartesBoard, draggedCard) => {
      let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (carte.auraEffect === true && carte.famille === "Croc-Noir") {
            carte.hp -= 1 * bonusDoree;
            carte.buffHp -= 1 * bonusDoree;
            if(carte.buffHp === 0 && carte.buffHp === 0){
              carte.auraEffect = false
            }        
          }
        });      
    },
    auraUnique: (carte) => {
      if (carte.famille === "Croc-Noir") {
        carte.hp += 1;
        carte.buffHp += 1;
        carte.auraEffect = true; 
      }     
    }
  },

  {
    id: 21,
    nom: "Krosh l’Écailleuse",
    lvl: 1,
    hp: 3,
    baseHp: 3,
    atk: 1,
    atkDispo: false,
    img: "img/card55.1.png",
    imgMinia: "img/cardfight55.png",
    famille: "Croc-Noir",
    sousFamille : "Marin",
    texte: "<i>Cri</i><br><br><br><color=red>+1atk</color> à un Croc-Noir <br><br> aléatoire",
    criDeGuerreCible: true,
    criDeGuerre: ({draggedCard, carte}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        carte.atk += 1 * bonusDoree;
        carte.buffAtk +=1 * bonusDoree;   
    },
  },
  {
    id: 22,
    nom: "Ur'Thok le Rampe-Sable",
    lvl: 1,
    hp: 1,
    baseHp: 1,
    atk: 3,
    atkDispo: false,
    img: "img/card56.1.png",
    imgMinia: "img/cardfight56.png",
    imgProjectile: "img/projectile.png",
    famille: "Croc-Noir",
    sousFamille : "Terrestre",
    texte: "<br><i>Debut de combat</i><br><br><br><color=red>-1hp</color> à un adversaire aléatoire<br><br>",
    oneTicDebutCombat: (carteCible, carteSource) => {
      let bonusDoree = 1
      if(carteSource.estDoree){
        bonusDoree = 2
      }
      if(carteCible.bouclierUse){
          carteCible.hp -= 0;
          carteCible.degatsRecus = 0;
          carteCible.bouclierUse = false
        }else{
          carteCible.hp -= 1 * bonusDoree; 
          carteCible.degatsRecus = 1 * bonusDoree;
        }
    },
  },
  {
    id: 23,
    nom: "Drush la Poissonneuse",
    lvl: 2,
    hp: 2,
    baseHp: 2,
    atk: 1,
    atkDispo: false,
    img: "img/card57.1.png",
    imgMinia: "img/cardfight57.png",
    famille: "Croc-Noir",
    sousFamille : "Marin",
    texte: "<br><br><i>Cri</i><br><br><br>Vous obtenez 1 <color=white>Poisson gris</color><br><br>",
    carteSpe: 25,
    piocherCarteSpe: true,
  },

  {
    id: 24,
    nom: "LE REQUIN",
    lvl: 7,
    hp: 4,
    baseHp: 4,
    atk: 4,
    atkDispo: false,
    img: "img/card59.png",
    imgMinia: "img/cardfight59.png",
    famille: "Croc-Noir",
    sousFamille : "Marin",
    texte: "<br><br><i>Résurection</i>",
    reincarnation: true,
  },
  {
    id: 25,
    nom: "Craby",
    lvl: 7,
    hp: 3,
    baseHp: 3,
    atk: 3,
    atkDispo: false,
    img: "img/card60.png",
    imgMinia: "img/cardfight60.png",
    famille: "Croc-Noir",
    sousFamille : "Marin",
    texte: "<br><br><i>Résurection</i>",
    reincarnation: true,
  },

  {
    id: 26,
    nom: "Poisson gris",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 1,
    atkDispo: false,
    img: "img/card61.1.png",
    imgMinia: "img/cardfight61.png",
    famille: "Croc-Noir",
    sousFamille : "Marin",
    texte: "<br><br><i>Résurection</i>",
    reincarnation: true,
  },
  {
    id: 27,
    nom: "Myrrh Reine des Voiles",
    lvl: 6,
    hp: 7,
    baseHp: 7,
    atk: 5,
    atkDispo: false,
    img: "img/card63.1.png",
    imgMinia: "img/cardfight63.png",
    imgMiniaProvoc: "img/cardfight63-provoc.png",
    imgMiniaBouclier: "img/cardfight63-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<i>Cri</i><br><br> Donne <color=rgb(0, 163, 238)> Voile</color> aux Sylph<br><br> <color=rgb(20, 33, 220)>Aura</color> <color=red>+4hp</color> aux Sylph ayant <br><br><color=rgb(0, 163, 238)> Voile</color>",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
      cartesBoard.forEach(carte => {
        if(carte.famille === "Les Sylphariels" && carte.bouclierUse === false){
          carte.bouclierUse = true
          draggedCard.bouclierUse = true
        }
      });
    },
    aura: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if (carte.famille === "Les Sylphariels" && carte.bouclierUse) {
                carte.hp += 4 * bonusDoree;
                carte.buffHp += 4 * bonusDoree;
                carte.auraEffect = true;
            }
        });
    },
    auraSell: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if (carte.auraEffect === true && carte.bouclierUse && carte.famille === "Les Sylphariels") {
                carte.hp -= 4 * bonusDoree;
                carte.buffHp -= 4 * bonusDoree;
                if(carte.buffHp === 0 && carte.buffHp === 0){
                    carte.auraEffect = false
                }        
            }
        });
    },
    auraUnique: (carte) => {
      if (carte.famille === "Les Sylphariels" && carte.bouclierUse) {
        carte.hp += 4;
        carte.buffHp += 4;
        carte.auraEffect = true; 
      }     
    },
  },
  {
    id: 28,
    nom: "Nythéa la Sorcière des Brumes",
    lvl: 6,
    hp: 4,
    baseHp: 4,
    atk: 6,
    atkDispo: false,
    img: "img/card64.1.png",
    imgMinia: "img/cardfight64.png",
    imgMiniaProvoc: "img/cardfight64-provoc.png",
    imgMiniaBouclier: "img/cardfight64-bouclier.png",
    imgProjectile: "img/projectile3.png",
    famille: "Les Sylphariels",
    sousFamille : "Dark",
    bouclier: true,
    bouclierUse: true,
    texte: "<i>Début de tour</i><br><br> <color=red>+4atk</color> aux Sylph <br><br><i>Début de Combat</i><br><br> Lance <color=rgb(52, 16, 79)>Envoûtement</color>",
    oneTicDebutCombat: (carteCible, carteSource) => {
        carteCible.control = true;
    },
    aoeCibleApresCombat: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            carte.atk += 4 * bonusDoree;
            carte.buffAtk +=4 * bonusDoree;
            carte.animAoE = true; 
        });  
    },
    
  },
  {
    id: 29,
    nom: "Arwyn des Mille Reflets",
    lvl: 6,
    hp: 3,
    baseHp: 3,
    atk: 3,
    atkDispo: false,
    img: "img/card65.1.png",
    imgMinia: "img/cardfight65.png",
    imgMiniaProvoc: "img/cardfight65-provoc.png",
    imgMiniaBouclier: "img/cardfight65-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<i>Début du tour</i><br><br><br> Les Sylph gagnent <color=red>+4hp</color>",
    aoeCibleApresCombat: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            carte.hp += 4 * bonusDoree;
            carte.buffHp += 4 * bonusDoree;
            carte.animAoE = true; 
        });
    },
  },
  {
    id: 30,
    nom: "Thalya le Jugement Serein",
    lvl: 6,
    hp: 4,
    baseHp: 4,
    atk: 6,
    atkDispo: false,
    img: "img/card66.1.png",
    imgMinia: "img/cardfight69.png",
    imgMiniaProvoc: "img/cardfight69-provoc.png",
    imgMiniaBouclier: "img/cardfight69-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<i>Cri et Evanescence(Mort)</i><br><br> <color=red>+4atk</color> aux Sylph <br><br> A chaque attaque <br><br> Inflige des dégats aux<br><br> adv adjacents",
    degatsAdj: true,
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Les Sylphariels"){
                carte.atk += 4 * bonusDoree;
                carte.buffAtk +=4 * bonusDoree;
                draggedCard.atk += 4 * bonusDoree;
                draggedCard.buffAtk +=4 * bonusDoree;
            }
        });
    },
    


    deathTrigger: (mortCarte, cartesBoard, self) => {
        // Ne rien faire si la carte morte n’est pas Croc-Noir ou si elle est Grûm lui-même
        if ( mortCarte.id !== self.id) return;
      
        // Cherche les cibles valides (autres Croc-Noir vivants, excluant Grûm et la carte morte)
        const cibles = cartesBoard.filter(c =>
          c.famille === "Les Sylphariels" &&
          c.id !== self.id &&
          c.id !== mortCarte.id &&
          c.hp > 0
        ).sort((a, b) => a.hp - b.hp);
        if (cibles.length === 0) return;
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        cibles.forEach(cible => {
            // Appliquer les buffs
            cible.atk += 4 * bonusDoree;
            cible.buffAtk += 4 * bonusDoree;
            cible.buffatkTahlRin = (cible.buffatkTahlRin || 0) + 4 * bonusDoree;

            cible.tahlRinBuffEffect = true; // Pour tracking ou affichage
        })
    },
  },
  {
    id: 31,
    nom: "Lúmena La Dernière Lueur",
    lvl: 6,
    hp: 6,
    baseHp: 6,
    atk: 4,
    atkDispo: false,
    img: "img/card67.1.png",
    imgMinia: "img/cardfight67.png",
    imgMiniaProvoc: "img/cardfight67-provoc.png",
    imgMiniaBouclier: "img/cardfight67-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<i>Cri et Evanescence(Vente)</i><br><br><br> <color=red>+3/+6</color> aux Sylphs ayant <br><br><br> <color=rgb(0, 163, 238)> Voile de Lune</color>",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Les Sylphariels" && carte.bouclierUse){
                carte.atk += 3 * bonusDoree;
                carte.buffAtk +=3 * bonusDoree;
                carte.hp += 6 * bonusDoree;
                carte.buffHp += 6 * bonusDoree;
            }
        });
    },
    evanescence: (board, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        board.forEach(carte => {
          if(carte.famille === "Les Sylphariels" && carte.bouclierUse){
            carte.atk += 3 * bonusDoree;
            carte.buffAtk +=3 * bonusDoree;
            carte.hp += 6 * bonusDoree;
            carte.buffHp += 6 * bonusDoree;
          }
        });
        const vessalyn = board.filter(c => c.nom === "Vessalyn, Chuchoteuse d''Ailes")
        if(vessalyn.length > 0){
          board.forEach(carte => {
            if(carte.famille === "Les Sylphariels" && carte.bouclierUse){
              carte.atk += 3;
              carte.buffAtk += 3;
              carte.hp += 6;
              carte.buffHp += 6;
            }
          });
        }
    },
  },
  {
    id: 32,
    nom: "Elyssia le Miroir de l'Éclat",
    lvl: 5,
    hp: 6,
    baseHp: 6,
    atk: 4,
    atkDispo: false,
    img: "img/card68.1.png",
    imgMinia: "img/cardfight68.png",
    imgMiniaProvoc: "img/cardfight68-provoc.png",
    imgMiniaBouclier: "img/cardfight68-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<i>Cri et Evanescence(Vente)</i><br><br><br> <color=red>+2/+4</color> aux Sylphs ayant <br><br><br> <color=rgb(0, 163, 238)> Voile de Lune</color>",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Les Sylphariels" && carte.bouclierUse){
                carte.atk += 2 * bonusDoree;
                carte.buffAtk +=2 * bonusDoree;
                carte.hp += 4 * bonusDoree;
                carte.buffHp += 4 * bonusDoree;
            }
        });  
    },
    evanescence: (board, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        board.forEach(carte => {
          if(carte.famille === "Les Sylphariels" && carte.bouclierUse){
            carte.atk += 2 * bonusDoree;
            carte.buffAtk +=2 * bonusDoree;
            carte.hp += 2 * bonusDoree;
            carte.buffHp += 2 * bonusDoree;
          }
        });
        const vessalyn = board.filter(c => c.nom === "Vessalyn, Chuchoteuse d''Ailes")
        if(vessalyn.length > 0){
          board.forEach(carte => {
            if(carte.famille === "Les Sylphariels" && carte.bouclierUse){
              carte.atk += 2;
              carte.buffAtk += 2;
              carte.hp += 2;
              carte.buffHp += 2;
            }
          });
        }
    },
  },

  {
    id: 33,
    nom: "Virelys Porteuse de Lueurs",
    lvl: 3,
    hp: 4,
    baseHp: 4,
    atk: 4,
    atkDispo: false,
    img: "img/card70.1.png",
    imgMinia: "img/cardfight70.png",
    imgMiniaProvoc: "img/cardfight70-provoc.png",
    imgMiniaBouclier: "img/cardfight70-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<i>Cri et Evanescence(Vente)</i><br><br><br> Vous obtenez une <br><br><color=white>Lueur déferlante</color>",
    carteSpe: 49,
    piocherCarteSpeApresVente: true,
    
  },
  {
    id: 34,
    nom: "Sillènne, l'Épine de Brume",
    lvl: 5,
    hp: 3,
    baseHp: 3,
    atk: 6,
    atkDispo: false,
    img: "img/card71.1.png",
    imgMinia: "img/cardfight71.png",
    imgMiniaProvoc: "img/cardfight71-provoc.png",
    imgMiniaBouclier: "img/cardfight71-bouclier.png",
    imgProjectile: "img/projectile1.png",
    famille: "Les Sylphariels",
    sousFamille : "Dark",
    texte: "<i>Debut de combat</i><br><br><color=red>-4hp</color> à tous les ennemis <br><br> <color=rgb(111, 52, 139)>Vengeance Furieuse</color> <br><br><i>Evanescence</i><br><br> <color=red>+2atk</color> aux Sylphariels",
    aoeCible: (cartesBoardAdv, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoardAdv.forEach(carte => {
            if(carte.bouclierUse){
                carte.atk -= 0;
                carte.degatsRecus = 0;
                carte.bouclierUse = false
                carte.animAoE = true;
            }else{
                carte.hp -= 4 * bonusDoree;
                carte.degatsRecus = 4 * bonusDoree;
                carte.animAoE = true;
            }
        });
    },
    oneTicPendantCombat: (carteCible, carteSource) => {
        let bonusDoree = 1
        if(carteSource.estDoree){
            bonusDoree = 2
        }
        if(carteCible.bouclierUse){
          carteCible.hp -= 0;
          carteCible.degatsRecus = 0;
          carteCible.bouclierUse = false
        }else{
          carteCible.hp -= carteSource.atk * bonusDoree; 
          carteCible.degatsRecus = carteSource.atk * bonusDoree;
        }
    },
    deathTrigger: (mortCarte, cartesBoard, self) => {
        // Ne rien faire si la carte morte n’est pas Croc-Noir ou si elle est Grûm lui-même
        if ( mortCarte.id !== self.id) return;
      
        // Cherche les cibles valides (autres Croc-Noir vivants, excluant Grûm et la carte morte)
        const cibles = cartesBoard.filter(c =>
          c.famille === "Les Sylphariels" &&
          c.id !== self.id &&
          c.id !== mortCarte.id &&
          c.hp > 0
        ).sort((a, b) => a.atk - b.atk);
      
        if (cibles.length === 0) return;
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        cibles.forEach(cible => {
            // Appliquer les buffs
            cible.atk += 2 * bonusDoree;
            cible.buffAtk += 2 * bonusDoree;
            cible.buffAtkSillenne = (cible.buffHpSillenne || 0) + 2 * bonusDoree;

            cible.sillenneBuffEffect = true; // Pour tracking ou affichage

        }) 
    },
  },
  {
    id: 35,
    nom: "Méllua la Feuille Dansante",
    lvl: 5,
    hp: 7,
    baseHp: 7,
    atk: 3,
    atkDispo: false,
    img: "img/card72.1.png",
    imgMinia: "img/cardfight72.png",
    imgMiniaProvoc: "img/cardfight72-provoc.png",
    imgMiniaBouclier: "img/cardfight72-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<i>Debut de tour</i><br><br><color=red>+2hp</color> aux Sylphariels<br><br><br> <color=rgb(20, 33, 220)>Aura</color><br><br><color=red>+4hp</color> aux Sylphariels",
    aura: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (carte.famille === "Les Sylphariels") {
            carte.hp += 4 * bonusDoree;
            carte.buffHp += 4 * bonusDoree;
            carte.auraEffect = true;
          }
        });
    },
    auraSell: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if (carte.auraEffect === true && carte.famille === "Les Sylphariels") {
                carte.hp -= 4 * bonusDoree;
                carte.buffHp -= 4 * bonusDoree;
                if(carte.buffHp === 0 && carte.buffHp === 0){
                    carte.auraEffect = false
                }        
            }
        });
    },
    auraUnique: (carte) => {
      if (carte.famille === "Les Sylphariels") {
        carte.hp += 4;
        carte.buffHp += 4;
        carte.auraEffect = true; 
      }     
    },
    aoeCibleApresCombat: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            carte.hp += 2 * bonusDoree;
            carte.buffHp += 2 * bonusDoree;
            carte.animAoE = true; 
        });  
    },
  },
  {
    id: 36,
    nom: "Syra des Feuilles Troublées",
    lvl: 4,
    hp: 5,
    baseHp: 5,
    atk: 4,
    atkDispo: false,
    img: "img/card73.1.png",
    imgMinia: "img/cardfight73.png",
    imgMiniaProvoc: "img/cardfight73-provoc.png",
    imgMiniaBouclier: "img/cardfight73-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<i>Cri et Evanescence</i><br><br><br> <color=red>+1/+3</color> aux Sylphariels ",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Les Sylphariels"){
                carte.atk += 1 * bonusDoree;
                carte.buffAtk +=1 * bonusDoree;
                carte.hp += 3 * bonusDoree;
                carte.buffHp += 3 * bonusDoree;
            }
        });
    },
    evanescence: (board, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        board.forEach(carte => {
          if(carte.famille === "Les Sylphariels"){
            carte.atk += 1 * bonusDoree;
            carte.buffAtk +=1 * bonusDoree;
            carte.hp += 3 * bonusDoree;
            carte.buffHp += 3 * bonusDoree;
          }
        });
        const vessalyn = board.filter(c => c.nom === "Vessalyn, Chuchoteuse d''Ailes")
        if(vessalyn.length > 0){
          board.forEach(carte => {
            if(carte.famille === "Les Sylphariels"){
              carte.atk += 1;
              carte.buffAtk += 1;
              carte.hp += 3;
              carte.buffHp += 3;
            }
          });
        }
    },
    deathTrigger: (mortCarte, cartesBoard, self) => {
      // Ne rien faire si la carte morte n’est pas Croc-Noir ou si elle est Grûm lui-même
      if ( mortCarte.id !== self.id) return;
    
      // Cherche les cibles valides (autres Croc-Noir vivants, excluant Grûm et la carte morte)
      const cibles = cartesBoard.filter(c =>
        c.famille === "Les Sylphariels" &&
        c.id !== self.id &&
        c.id !== mortCarte.id &&
        c.hp > 0
      ).sort((a, b) => a.hp - b.hp);
    
      if (cibles.length === 0) return;
      let bonusDoree = 1
      if(self.estDoree){
          bonusDoree = 2
      }
      cibles.forEach(cible => {
          // Appliquer les buffs
          cible.atk += 1 * bonusDoree;
          cible.buffAtk += 1 * bonusDoree;
          cible.buffAtkSyra = (cible.buffHpSyra || 0) + 1 * bonusDoree;
          cible.hp += 3 * bonusDoree;
          cible.buffHp += 3 * bonusDoree;
          cible.buffHpSyra = (cible.buffHpSyra || 0) + 3 * bonusDoree;

          cible.syraBuffEffect = true; // Pour tracking ou affichage

      })
    },
  },
  {
    id: 37,
    nom: "Nym'Leth la Tisseuse d'Échos",
    lvl: 4,
    hp: 4,
    baseHp: 4,
    atk: 3,
    atkDispo: false,
    img: "img/card74.1.png",
    imgMinia: "img/cardfight74.png",
    imgMiniaProvoc: "img/cardfight74-provoc.png",
    imgMiniaBouclier: "img/cardfight74-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<i>Evanescence(Vente)</i><br><br><br> Pioche une Sylphariel<br><br> de lvl 1 à 6",
    piocherCarteApresVente: true,
  },
  {
    id: 38,
    nom: "Ivrana, l'Onde Retenue",
    lvl: 2,
    hp: 3,
    baseHp: 3,
    atk: 2,
    atkDispo: false,
    img: "img/card75.1.png",
    imgMinia: "img/cardfight75.png",
    imgMiniaProvoc: "img/cardfight75-provoc.png",
    imgMiniaBouclier: "img/cardfight75-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<br><i>Evanescence(Vente)</i> et <color=rgb(20, 33, 220)>Aura</color><br><br><br><color=red>+2hp</color> aux Sylphariels",
    evanescence: (board, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        board.forEach(carte => {
          if(carte.famille === "Les Sylphariels"){
            carte.hp += 2 * bonusDoree;
            carte.buffHp += 2 * bonusDoree;
          }
        });
        const vessalyn = board.filter(c => c.nom === "Vessalyn, Chuchoteuse d''Ailes")
        if(vessalyn.length > 0){
          board.forEach(carte => {
            if(carte.famille === "Les Sylphariels"){
              carte.hp += 2;
              carte.buffHp += 2;
            }
          });
        }
    },
    aura: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (carte.famille === "Les Sylphariels") {
            carte.hp += 2 * bonusDoree;
            carte.buffHp += 2 * bonusDoree;
            carte.auraEffect = true;
          }
        }); 
    },
    auraSell: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (carte.auraEffect === true && carte.famille === "Les Sylphariels") {
            carte.hp -= 2 * bonusDoree;
            carte.buffHp -= 2 * bonusDoree;
            if(carte.buffHp === 0 && carte.buffHp === 0){
              carte.auraEffect = false
            }        
          }
        });  
    },
    auraUnique: (carte) => {
      if (carte.famille === "Les Sylphariels") {
        carte.hp += 2;
        carte.buffHp += 2;
        carte.auraEffect = true; 
      }     
    }
  },
  {
    id: 39,
    nom: "Liraël la Douteuse",
    lvl: 4,
    hp: 2,
    baseHp: 2,
    atk: 5,
    atkDispo: false,
    img: "img/card76.1.png",
    imgMinia: "img/cardfight76.png",
    imgMiniaProvoc: "img/cardfight76-provoc.png",
    imgMiniaBouclier: "img/cardfight76-bouclier.png",
    imgProjectile: "img/projectile1.png",
    famille: "Les Sylphariels",
    sousFamille : "Dark",
    texte: "<i>Cri</i> <br><br><color=red>+4atk</color> aux Sylphariels <br><br> <i>Debut de combat</i><br><br><color=red>-2hp</color> à un adversaire <br><br><i>Vengeance</i> <color=red>-2hp</color>",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Les Sylphariels"){
                carte.atk += 4 * bonusDoree;
                carte.buffAtk +=4 * bonusDoree;
            }
        });      
    },
    oneTicDebutCombat: (carteCible, carteSource) => {
        let bonusDoree = 1
        if(carteSource.estDoree){
            bonusDoree = 2
        }
        if(carteCible.bouclierUse){
          carteCible.hp -= 0;
          carteCible.degatsRecus = 0;
          carteCible.bouclierUse = false
        }else{
          carteCible.hp -= 2 * bonusDoree; 
          carteCible.degatsRecus = 2 * bonusDoree;
        }  
    },
    oneTicPendantCombat: (carteCible, carteSource) => {
        let bonusDoree = 1
        if(carteSource.estDoree){
            bonusDoree = 2
        }
        if(carteCible.bouclierUse){
          carteCible.hp -= 0;
          carteCible.degatsRecus = 0;
          carteCible.bouclierUse = false
        }else{
          carteCible.hp -= 2 * bonusDoree; 
          carteCible.degatsRecus = 2 * bonusDoree;
        }     
    },
  },
  {
    id: 40,
    nom: "Vessalyn, Chuchoteuse d''Ailes",
    lvl: 4,
    hp: 5,
    baseHp: 5,
    atk: 3,
    atkDispo: false,
    img: "img/card77.1.png",
    imgMinia: "img/cardfight77.png",
    imgMiniaProvoc: "img/cardfight77-provoc.png",
    imgMiniaBouclier: "img/cardfight77-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<color=rgb(20, 33, 220)>Aura</color><br><br><br>Les effets d'Evanescence <br><br>sont doublés",
  },
  {
    id: 41,
    nom: "Naëlia des Brumes Tournoyantes",
    lvl: 4,
    hp: 4,
    baseHp: 4,
    atk: 3,
    atkDispo: false,
    img: "img/card78.1.png",
    imgMinia: "img/cardfight78.png",
    imgMiniaProvoc: "img/cardfight78-provoc.png",
    imgMiniaBouclier: "img/cardfight78-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<i>Cri et Evanescence</i><br><br> Pose <color=rgb(0, 163, 238)> Voile</color> sur une Sylph <br><br><br><color=rgb(20, 33, 220)>Aura</color> Les Sylph avec <color=rgb(0, 163, 238)> Voile</color> ont <br><br><color=red>+1/+1</color>",
    criDeGuerreCible: true,
    criDeGuerre: ({draggedCard, carte}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        carte.bouclier = true;
        carte.bouclierUse = true;
        carte.atk += 1 * bonusDoree;
        carte.buffAtk += 1 * bonusDoree;
        carte.hp += 1 * bonusDoree;
        carte.buffHp += 1 * bonusDoree;

    },
    deathTrigger: (mortCarte, cartesBoard, self) => {
      // Ne rien faire si la carte morte n’est pas Croc-Noir ou si elle est Grûm lui-même
      if ( mortCarte.id !== self.id) return;
    
      // Cherche les cibles valides (autres Croc-Noir vivants, excluant Grûm et la carte morte)
      const cibles = cartesBoard.filter(c =>
        c.famille === "Les Sylphariels" &&
        c.id !== self.id &&
        c.id !== mortCarte.id &&
        c.hp > 0
      );
    
      if (cibles.length === 0) return;  
      // Choisir une cible aléatoire
      if(self.estDoree){
        const cible = cibles[Math.floor(Math.random() * cibles.length)];
        const cible1 = cibles[Math.floor(Math.random() * cibles.length)];
        cible.bouclier = true;
        cible.bouclierUse = true;
        cible1.bouclier = true;
        cible1.bouclierUse = true;
      }else{
        const cible = cibles[Math.floor(Math.random() * cibles.length)];
        cible.bouclier = true;
        cible.bouclierUse = true;
      }

    },
    aura: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (carte.bouclierUse) {
            carte.atk += 1 * bonusDoree;
            carte.buffAtk += 1 * bonusDoree;
            carte.hp += 1 * bonusDoree;
            carte.buffHp += 1 * bonusDoree;
            carte.auraNaeliaEffect = true;
          }
        });
      
    },
    auraUnique: (carte) => {
      if (carte.bouclierUse) {
        carte.atk += 1;
        carte.buffAtk += 1;
        carte.hp += 1;
        carte.buffHp += 1;
        carte.auraNaeliaEffect = true; 
      }     
    },
    auraSell: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (carte.auraNaeliaEffect === true && carte.famille === "Les Sylphariels") {
            carte.atk -= 1 * bonusDoree;
            carte.buffAtk -= 1 * bonusDoree;
            carte.hp -= 1 * bonusDoree;
            carte.buffHp -= 1 * bonusDoree;
            if(carte.buffHp === 0 && carte.buffHp === 0){
              carte.auraNaeliaEffect = false
            }        
          }
        });  
    },
  },
  {
    id: 42,
    nom: "Elwyn la Souffleuse de brume",
    lvl: 3,
    hp: 2,
    baseHp: 2,
    atk: 5,
    atkDispo: false,
    img: "img/card79.1.png",
    imgMinia: "img/cardfight79.png",
    imgMiniaProvoc: "img/cardfight79-provoc.png",
    imgMiniaBouclier: "img/cardfight79-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight79-provoc-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Dark",
    texte: "<i>Debut de tour</i><br><br><color=red>+1atk</color> aux Sylphariels<br><br><i>Evanescence</i><br><br><color=red>+2atk</color> à la Sylphariel <br><br>ayant le moins d'atk",
    aoeCibleApresCombat: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          carte.atk += 1 * bonusDoree;
          carte.buffAtk += 1 * bonusDoree;
          carte.animAoE = true; 
        });
    },
    evanescence: (board, card) => {      
      if(board.length > 1 ){
        const copies = board.filter(c => c.id !== card.id).filter(c => c.famille === "Les Sylphariels").sort((a, b) => a.atk - b.atk)
        let cible = copies[0]
        let bonusDoree = 1
        if(card.estDoree){
            bonusDoree = 2
        }
        if(cible.famille === "Les Sylphariels"){
            cible.atk += 2 * bonusDoree;
            cible.buffAtk += 1 * bonusDoree;
        }
        const vessalyn = board.filter(c => c.nom === "Vessalyn, Chuchoteuse d''Ailes")
        if(vessalyn.length > 0){
          cible.atk += 2;
          cible.buffAtk += 1;
        }
      } 
    }, 
    deathTrigger: (mortCarte, cartesBoard, self) => {
      // Ne rien faire si la carte morte n’est pas Croc-Noir ou si elle est Grûm lui-même
      if ( mortCarte.id !== self.id) return;
    
      // Cherche les cibles valides (autres Croc-Noir vivants, excluant Grûm et la carte morte)
      const cibles = cartesBoard.filter(c =>
        c.famille === "Les Sylphariels" &&
        c.id !== self.id &&
        c.id !== mortCarte.id &&
        c.hp > 0
      ).sort((a, b) => a.atk - b.atk);
    
      if (cibles.length === 0) return;
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        // Choisir une cible aléatoire
        const cible = cibles[0];
      
        // Appliquer les buffs selon la bivalence
        cible.atk += 2 * bonusDoree;
        cible.buffAtk += 2 * bonusDoree;
        cible.buffAtkElwyn = (cible.buffAtkElwyn || 0) + 2 * bonusDoree;

        cible.elwynBuffEffect = true; // Pour tracking ou affichage  
    },
  },

  {
    id: 43,
    nom: "Nyssa l'Épine de Rosée",
    lvl: 3,
    hp: 2,
    baseHp: 2,
    atk: 4,
    atkDispo: false,
    img: "img/card81.1.png",
    imgMinia: "img/cardfight81.png",
    imgMiniaProvoc: "img/cardfight81-provoc.png",
    imgMiniaBouclier: "img/cardfight81-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Dark",
    imgProjectile: "img/projectile1.png",
    texte: "<i>Debut de combat</i><br><br><color=red>-1hp</color> à tous les ennemis <br><br><br><i>Evanescence</i><br><br> <color=red>+2atk</color> aux Sylphariels",
    oneTicCible:  true,
    aoeCible: (cartesBoardAdv, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoardAdv.forEach(carte => {
          if(carte.bouclierUse){
            carte.atk -= 0;
            carte.degatsRecus = 0;
            carte.bouclierUse = false
            carte.animAoE = true;
          }else{
            carte.hp -= 1 * bonusDoree;
            carte.degatsRecus = 1 * bonusDoree;
            carte.animAoE = true;
          }
        });
    },
    evanescence: (board, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        board.forEach(carte => {
          if(carte.famille === "Les Sylphariels"){
            carte.atk += 2 * bonusDoree;
            carte.buffAtk += 2 * bonusDoree;
          }
        });
        const vessalyn = board.filter(c => c.nom === "Vessalyn, Chuchoteuse d''Ailes")
        if(vessalyn.length > 0){
          board.forEach(carte => {
            if(carte.famille === "Les Sylphariels"){
              carte.atk += 2;
              carte.buffAtk += 2;
            }
          });
        }
    },
    deathTrigger: (mortCarte, cartesBoard, self) => {
      // Ne rien faire si la carte morte n’est pas Croc-Noir ou si elle est Grûm lui-même
      if ( mortCarte.id !== self.id) return;
    
      // Cherche les cibles valides (autres Croc-Noir vivants, excluant Grûm et la carte morte)
      const cibles = cartesBoard.filter(c =>
        c.famille === "Les Sylphariels" &&
        c.id !== self.id &&
        c.id !== mortCarte.id &&
        c.hp > 0
      ).sort((a, b) => a.atk - b.atk);
    
      if (cibles.length === 0) return;
    
      // Choisir une cible aléatoire
      const cible = cibles[0];
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        // Appliquer les buffs selon la bivalence
        cible.atk += 2 * bonusDoree;
        cible.buffAtk += 2 * bonusDoree;
        cible.buffAtkNyssa = (cible.buffAtkNyssa || 0) + 2 * bonusDoree;

        cible.nyssaBuffEffect = true; // Pour tracking ou affichage
    }
  },
  {
    id: 44,
    nom: "Sylène la Faiblissante",
    lvl: 3,
    hp: 4,
    baseHp: 4,
    atk: 2,
    atkDispo: false,
    img: "img/card82.1.png",
    imgMinia: "img/cardfight82.png",
    imgMiniaProvoc: "img/cardfight82-provoc.png",
    imgMiniaBouclier: "img/cardfight82-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Dark",
    texte: "<i>Debut de combat</i><br><br><color=red>-1atk</color> à tous les ennemis <br><br><br><i>Evanescence</i><br><br> <color=red>+1atk</color> aux Sylphariels",
    aoeCible: (cartesBoardAdv, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoardAdv.forEach(carte => {
          if(carte.bouclierUse){
            carte.atk -= 0;
            carte.degatsRecus = 0;
            carte.bouclierUse = false
            carte.animAoE = true;
          }else{
            carte.atk -= 1 * bonusDoree;
            carte.degatsRecus = 1 * bonusDoree;
            carte.animAoE = true;
          }
        });  
    },
    evanescence: (board, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        board.forEach(carte => {
          if(carte.famille === "Les Sylphariels"){
            carte.atk += 1 * bonusDoree;
            carte.buffAtk += 1 * bonusDoree;
          }
        });      
        const vessalyn = board.filter(c => c.nom === "Vessalyn, Chuchoteuse d''Ailes")
        if(vessalyn.length > 0){
          board.forEach(carte => {
            if(carte.famille === "Les Sylphariels"){
              carte.atk += 1;
              carte.buffAtk += 1;
            }
          });
        }
    },
    deathTrigger: (mortCarte, cartesBoard, self) => {
      // Ne rien faire si la carte morte n’est pas Croc-Noir ou si elle est Grûm lui-même
      if ( mortCarte.id !== self.id) return;
    
      // Cherche les cibles valides (autres Croc-Noir vivants, excluant Grûm et la carte morte)
      const cibles = cartesBoard.filter(c =>
        c.famille === "Les Sylphariels" &&
        c.id !== self.id &&
        c.id !== mortCarte.id &&
        c.hp > 0
      );
    
      if (cibles.length === 0) return;
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        cibles.forEach(carte => {
          carte.atk += 1 * bonusDoree;
          carte.buffAtk += 1 * bonusDoree;
          carte.buffAtkSylene = (carte.buffAtkSylene || 0) + 1 * bonusDoree;
          carte.syleneBuffEffect = true; // Pour tracking ou affichage
        })  
    }
  },
  {
    id: 45,
    nom: "Fylia l'Évanouie",
    lvl: 2,
    hp: 3,
    baseHp: 3,
    atk: 2,
    atkDispo: false,
    img: "img/card83.1.png",
    imgMinia: "img/cardfight83.png",
    imgMiniaProvoc: "img/cardfight83-provoc.png",
    imgMiniaBouclier: "img/cardfight83-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Dark",
    texte: "<i>Evanescence</i><br><br><br> Donne <color=red>+2atk</color> <br><br>à une Sylphariel aléatoire",
    evanescence: (board, card) => { 
        let bonusDoree = 1
        if(card.estDoree){
            bonusDoree = 2
        }
        if(board.length > 1 ){
          const copies = board.filter(c => c.id !== card.id).filter(c => c.famille === "Les Sylphariels")
          if(copies.length > 0){
            let random = copies[Math.floor(Math.random() * copies.length)]
            if(random.famille === "Les Sylphariels"){
              random.atk += 2 * bonusDoree;
              random.buffAtk += 2 * bonusDoree;
            }
            const vessalyn = board.filter(c => c.nom === "Vessalyn, Chuchoteuse d''Ailes")
            const copies1 = copies.filter(c => c.nom !== random.nom)
            if(copies1.length > 0){
              let random1 = copies[Math.floor(Math.random() * copies.length)]
              if(vessalyn.length > 0){
                random1.atk += 2;
                random1.buffAtk += 2;
              }  
            }
          }
        }      
    },
    deathTrigger: (mortCarte, cartesBoard, self) => {
      // Ne rien faire si la carte morte n’est pas Croc-Noir ou si elle est Grûm lui-même
      if ( mortCarte.id !== self.id) return;
    
      // Cherche les cibles valides (autres Croc-Noir vivants, excluant Grûm et la carte morte)
      const cibles = cartesBoard.filter(c =>
        c.famille === "Les Sylphariels" &&
        c.id !== self.id &&
        c.id !== mortCarte.id &&
        c.hp > 0
      );
    
      if (cibles.length === 0) return;
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        // Choisir une cible aléatoire
        const cible = cibles[Math.floor(Math.random() * cibles.length)];
        cible.atk += 2 * bonusDoree;
        cible.buffAtk += 2 * bonusDoree;
        cible.buffAtkFylia = (cible.buffAtkFylia || 0) + 2 * bonusDoree;
        cible.fyliaBuffEffect = true; // Pour tracking ou affichage
    },
  },

  {
    id: 46,
    nom: "Veya l'Inaperçue",
    lvl: 1,
    hp: 2,
    baseHp: 2,
    atk: 3,
    atkDispo: false,
    img: "img/card85.1.png",
    imgMinia: "img/cardfight85.png",
    imgMiniaProvoc: "img/cardfight85-provoc.png",
    imgMiniaBouclier: "img/cardfight85-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<i>Cri</i><br><br>Si seule gagne <color=red>+2atk</color><br><br><i>Evanescence(vente)</i><br><br><color=gold>+1 po</color>",
    gainOr: 1,
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        if(cartesBoard.length === 0){
          draggedCard.atk += 2 * bonusDoree;
          draggedCard.buffAtk +=2 * bonusDoree;
        }      
    },    
  },
  {
    id: 47,
    nom: "Linn d'Écorce Douce",
    lvl: 2,
    hp: 5,
    baseHp: 5,
    atk: 1,
    atkDispo: false,
    img: "img/card86.1.png",
    imgMinia: "img/cardfight86.png",
    imgMiniaProvoc: "img/cardfight86-provoc.png",
    imgMiniaBouclier: "img/cardfight86-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<i>Evanescence</i><br><br><br>Confère<color=rgb(0, 163, 238)> Voile de lune</color> <br><br>à une Sylphariel aléatoire",
    evanescence: (board, card) => {    
      if(card.estDoree){
        if(board.length > 1 ){
          const copies = board.filter(c => c.id !== card.id).filter(c => c.famille === "Les Sylphariels")
          if(copies.length > 0){
            let random = copies[Math.floor(Math.random() * copies.length)]
            let random1 = copies[Math.floor(Math.random() * copies.length)]
            if(random.famille === "Les Sylphariels"){
              random.bouclier = true;
              random.bouclierUse = true;
            }
            if(random1.famille === "Les Sylphariels"){
              random1.bouclier = true;
              random1.bouclierUse = true;
            }
            const vessalyn = board.filter(c => c.nom === "Vessalyn, Chuchoteuse d''Ailes")
            const copies1 = copies.filter(c => c.nom !== random.nom)
            if(copies1.length > 0){
              let random2 = copies[Math.floor(Math.random() * copies.length)]
              if(vessalyn.length > 0){
                random2.bouclier = true;
                random2.bouclierUse = true;
              }
            }
          }
        }
      }else{
        if(board.length > 1 ){
          const copies = board.filter(c => c.id !== card.id).filter(c => c.famille === "Les Sylphariels")
          if(copies.length > 0){
            let random = copies[Math.floor(Math.random() * copies.length)]
            if(random.famille === "Les Sylphariels"){
              random.bouclier = true;
              random.bouclierUse = true;
            }
            const vessalyn = board.filter(c => c.nom === "Vessalyn, Chuchoteuse d''Ailes")
            const copies1 = copies.filter(c => c.nom !== random.nom)
            if(copies1.length > 0){
              let random1 = copies[Math.floor(Math.random() * copies.length)]
              if(vessalyn.length > 0){
                random1.bouclier = true;
                random1.bouclierUse = true;
              }
    
            }
          }

        }
      }  
       
    },
    deathTrigger: (mortCarte, cartesBoard, self) => {
      // Ne rien faire si la carte morte n’est pas Croc-Noir ou si elle est Grûm lui-même
      if ( mortCarte.id !== self.id) return;
    
      // Cherche les cibles valides (autres Croc-Noir vivants, excluant Grûm et la carte morte)
      const cibles = cartesBoard.filter(c =>
        c.famille === "Les Sylphariels" &&
        c.id !== self.id &&
        c.id !== mortCarte.id &&
        c.hp > 0
      );
    
      if (cibles.length === 0) return;  
      // Choisir une cible aléatoire
      if(self.estDoree){
        const ciblesFiltred = cibles.filter(c => c.bouclierUse === false)
        const cible = ciblesFiltred[Math.floor(Math.random() * ciblesFiltred.length)];
        const cible1 = ciblesFiltred[Math.floor(Math.random() * ciblesFiltred.length)];
        cible.bouclier = true;
        cible.bouclierUse = true;
        cible1.bouclier = true;
        cible1.bouclierUse = true;
      }else{
        const ciblesFiltred = cibles.filter(c => c.bouclierUse === false)
        const cible = ciblesFiltred[Math.floor(Math.random() * ciblesFiltred.length)];
        cible.bouclier = true;
        cible.bouclierUse = true;
      }

    },
  },
  {
    id: 48,
    nom: "Elra la Clignotante",
    lvl: 2,
    hp: 2,
    baseHp: 2,
    atk: 2,
    atkDispo: false,
    img: "img/card87.1.png",
    imgMinia: "img/cardfight87.png",
    imgMiniaProvoc: "img/cardfight87-provoc.png",
    imgMiniaBouclier: "img/cardfight87-bouclier.png",
    imgProjectile: "img/projectile2.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<i>Debut de combat</i><br><br><color=red>-1hp</color> à un adv aléatoire<br><br><i>Evanescence(mort)</i><br><br><color=red>+1hp</color> à une <br><br>Sylphariel aléatoire",
    oneTicDebutCombat: (carteCible, carteSource) => {
        let bonusDoree = 1
        if(carteSource.estDoree){
            bonusDoree = 2
        }
        if(carteCible.bouclierUse){
          carteCible.hp -= 0;
          carteCible.degatsRecus = 0;
          carteCible.bouclierUse = false
        }else{
          carteCible.hp -= 1 * bonusDoree; 
          carteCible.degatsRecus = 1 * bonusDoree;
        }
    },
    deathTrigger: (mortCarte, cartesBoard, self) => {
      // Ne rien faire si la carte morte n’est pas Croc-Noir ou si elle est Grûm lui-même
      if ( mortCarte.id !== self.id) return;
    
      // Cherche les cibles valides (autres Croc-Noir vivants, excluant Grûm et la carte morte)
      const cibles = cartesBoard.filter(c =>
        c.famille === "Les Sylphariels" &&
        c.id !== self.id &&
        c.id !== mortCarte.id &&
        c.hp > 0
      );
    
      if (cibles.length === 0) return;  
      // Choisir une cible aléatoire
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
      const cible = cibles[Math.floor(Math.random() * cibles.length)];
      cible.hp += 1 * bonusDoree;
      cible.buffHp += 1 * bonusDoree;
      cible.buffHpSilyne = (cible.buffHpSilyne || 0) + 1 * bonusDoree;
      cible.silyneBuffEffect = true; // Pour tracking ou affichage
      }      
  },


  {
    id: 49,
    nom: "Fiffa la Trébuchante",
    lvl: 1,
    hp: 2,
    baseHp: 2,
    atk: 2,
    atkDispo: false,
    img: "img/card90.1.png",
    imgMinia: "img/cardfight90.png",
    imgMiniaProvoc: "img/cardfight90-provoc.png",
    imgMiniaBouclier: "img/cardfight90-bouclier.png",
    imgProjectile: "img/projectile2.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "<i>Debut de combat</i><br><br><br>33% de chance d'infliger <br><br><color=red>-1hp</color> à un adversaire <br><br> aléatoire",
    oneTicDebutCombat: (carteCible, carteSource) => {
        let bonusDoree = 1
        if(carteSource.estDoree){
            bonusDoree = 2
        }
        let unSurTrois = Math.floor(Math.random() * 3)
        if(unSurTrois === 0){
          if(carteCible.bouclierUse){
            carteCible.hp -= 0;
            carteCible.degatsRecus = 0;
            carteCible.bouclierUse = false
          }else{
            carteCible.hp -= 1 * bonusDoree;
            carteCible.degatsRecus = 1 * bonusDoree;
          }
        }else{
          carteCible.hp -= 0;
          carteCible.degatsRecus = 0;
        }      
    },
  },

  {
    id: 50,
    nom: "Lueur déferlante",
    lvl: 7,
    hp: 6,
    baseHp: 6,
    atk: 0,
    atkDispo: false,
    img: "img/card93.1.png",
    imgMinia: "img/cardfight93.png",
    imgMiniaProvoc: "img/cardfight93-provoc.png",
    imgMiniaBouclier: "img/cardfight93-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight93-provoc-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "*",
    provocation: true,
    provocationUse: true,
    bouclier: true,
    bouclierUse: true,
  },
  {
    id: 51,
    nom: "Habitant des dunes",
    lvl: 1,
    hp: 2,
    baseHp: 2,
    atk: 3,
    atkDispo: false,
    img: "img/card94.png",
    imgMinia: "img/cardfight94.png",
    famille: "Elementaire",
    texte: "*",
    criDeGuerre: ({shopCards, draggedCard, bonusHpElem, bonusAtkElem}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        shopCards.forEach(carte => {
            if(carte.famille === "Elementaire"){
              carte.atk += 1 * bonusDoree + bonusAtkElem;
              carte.buffAtk += 1 * bonusDoree + bonusAtkElem;
              carte.hp += 1 * bonusDoree + bonusHpElem;
              carte.buffHp += 1 * bonusDoree + bonusHpElem;
            }
        });
        cards.forEach(carte =>{
            if(carte.famille === "Elementaire"){
              carte.baseAtk = carte.atk
              carte.atk += 1 * bonusDoree + bonusAtkElem;
              carte.buffAtk += 1 * bonusDoree + bonusAtkElem;
              carte.hp += 1 * bonusDoree + bonusHpElem;
              carte.buffHp += 1 * bonusDoree + bonusHpElem;
            }
        })  
    }
  },
  {
    id: 52,
    nom: "Roche en fusion",
    lvl: 1,
    hp: 3,
    baseHp: 3,
    atk: 3,
    atkDispo: false,
    img: "img/card95.png",
    imgMinia: "img/cardfight95.png",
    famille: "Elementaire",
    texte: "*",
    upSelf: true,
  },
  {
    id: 53,
    nom: "Cyclone crépitant",
    lvl: 2,
    hp: 1,
    baseHp: 1,
    atk: 5,
    atkDispo: false,
    img: "img/card96.png",
    imgMinia: "img/cardfight96.png",
    imgMiniaBouclier: "img/cardfight96-bouclier.png",
    famille: "Elementaire",
    texte: "*",
    bouclier: true,
    bouclierUse: true,
    furie: true,
    furieUse: true,
  },
  {
    id: 54,
    nom: "Elemenplus",
    lvl: 2,
    hp: 3,
    baseHp: 3,
    atk: 3,
    atkDispo: false,
    img: "img/card97.png",
    imgMinia: "img/cardfight97.png",
    famille: "Elementaire",
    texte: "*",
    carteSpe: 74,
    piocherCarteSpeApresVente: true,
  },
  {
    id: 55,
    nom: "Elementaire de fête",
    lvl: 2,
    hp: 2,
    baseHp: 2,
    atk: 3,
    atkDispo: false,
    img: "img/card98.png",
    imgMinia: "img/cardfight98.png",
    famille: "Elementaire",
    texte: "*",
  },
  {
    id: 56,
    nom: "Pirate d'eau douce",
    lvl: 3,
    hp: 5,
    baseHp: 5,
    atk: 4,
    atkDispo: false,
    img: "img/card99.png",
    imgMinia: "img/cardfight99.png",
    famille: "Elementaire",
    texte: "*",
    gainOr: 1,
  },
  {
    id: 57,
    nom: "Roche mère bienfaisante",
    lvl: 3,
    hp: 4,
    baseHp: 4,
    atk: 3,
    atkDispo: false,
    img: "img/card100.png",
    imgMinia: "img/cardfight100.png",
    famille: "Elementaire",
    texte: "*",
    decomptePioche: 2,
  },
  {
    id: 58,
    nom: "Tourbillon de sable",
    lvl: 3,
    hp: 3,
    baseHp: 3,
    atk: 4,
    atkDispo: false,
    img: "img/card101.png",
    imgMinia: "img/cardfight101.png",
    famille: "Elementaire",
    texte: "*",
  },
  {
    id: 59,
    nom: "Elementaire du feu de brousse",
    lvl: 3,
    hp: 3,
    baseHp: 3,
    atk: 6,
    atkDispo: false,
    img: "img/card102.png",
    imgMinia: "img/cardfight102.png",
    famille: "Elementaire",
    texte: "*",
    degatsAdj: true,
  },
  {
    id: 60,
    nom: "Elementaire gangrené",
    lvl: 3,
    hp: 3,
    baseHp: 3,
    atk: 6,
    atkDispo: false,
    img: "img/card103.png",
    imgMinia: "img/cardfight103.png",
    famille: "Elementaire",
    texte: "*",
    criDeGuerre: ({shopCards, draggedCard, bonusHpElem, bonusAtkElem}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        shopCards.forEach(carte => {
            if(carte.famille === "Elementaire"){
              carte.atk += 1 * bonusDoree + bonusAtkElem;
              carte.buffAtk += 1 * bonusDoree + bonusAtkElem;
              carte.hp += 1 * bonusDoree + bonusHpElem;
              carte.buffHp += 1 * bonusDoree + bonusHpElem;
            }
        });
        cards.forEach(carte =>{
            if(carte.famille === "Elementaire"){
              carte.baseAtk = carte.atk
              carte.atk += 1 * bonusDoree + bonusAtkElem;
              carte.buffAtk += 1 * bonusDoree + bonusAtkElem;
              carte.hp += 1 * bonusDoree + bonusHpElem;
              carte.buffHp += 1 * bonusDoree + bonusHpElem;
            }
        })
    }
  },
  {
    id: 61,
    nom: "Anomalie actualisante",
    lvl: 4,
    hp: 5,
    baseHp: 5,
    atk: 4,
    atkDispo: false,
    img: "img/card104.png",
    imgMinia: "img/cardfight104.png",
    famille: "Elementaire",
    texte: "*",
    gainOr: 2,
  },
  {
    id: 62,
    nom: "Fracasseur de météorites",
    lvl: 4,
    hp: 6,
    baseHp: 6,
    atk: 4,
    atkDispo: false,
    img: "img/card105.png",
    imgMinia: "img/cardfight105.png",
    famille: "Elementaire",
    texte: "*",
    upSelf: true,
  },
  {
    id: 63,
    nom: "Incandescence de braise",
    lvl: 4,
    hp: 2,
    baseHp: 2,
    atk: 4,
    atkDispo: false,
    img: "img/card106.png",
    imgMinia: "img/cardfight106.png",
    famille: "Elementaire",
    texte: "*",
  },
  {
    id: 64,
    nom: "Oleiflamme flamboyant",
    lvl: 4,
    hp: 4,
    baseHp: 4,
    atk: 6,
    atkDispo: false,
    img: "img/card107.png",
    imgMinia: "img/cardfight107.png",
    famille: "Elementaire",
    texte: "*",
    criDeGuerre: ({shopCards, draggedCard, bonusHpElem, bonusAtkElem}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        shopCards.forEach(carte => {
            if(carte.famille === "Elementaire"){
                carte.atk += 3 * bonusDoree + bonusAtkElem;
                carte.buffAtk += 3 * bonusDoree + bonusAtkElem;
                carte.hp += 2 * bonusDoree + bonusHpElem;
                carte.buffHp += 2 * bonusDoree + bonusHpElem;
            }
        });
        cards.forEach(carte =>{
            if(carte.famille === "Elementaire"){
                carte.baseAtk = carte.atk
                carte.atk += 3 * bonusDoree + bonusAtkElem;
                carte.buffAtk += 3 * bonusDoree + bonusAtkElem;
                carte.hp += 2 * bonusDoree + bonusHpElem;
                carte.buffHp += 2 * bonusDoree + bonusHpElem;
            }
        })  
    }
  },
  {
    id: 65,
    nom: "Tornade décuplée",
    lvl: 4,
    hp: 4,
    baseHp: 4,
    atk: 4,
    atkDispo: false,
    img: "img/card108.png",
    imgMinia: "img/cardfight108.png",
    famille: "Elementaire",
    texte: "*",
    piocherCarteFamille: false,
  },
  {
    id: 66,
    nom: "Lokholar le Forgegivre",
    lvl: 5,
    hp: 5,
    baseHp: 5,
    atk: 7,
    atkDispo: false,
    img: "img/card109.png",
    imgMinia: "img/cardfight109.png",
    famille: "Elementaire",
    texte: "*",
  },
  {
    id: 67,
    nom: "Souffle-grange dansant",
    lvl: 5,
    hp: 4,
    baseHp: 4,
    atk: 5,
    atkDispo: false,
    img: "img/card110.png",
    imgMinia: "img/cardfight110.png",
    famille: "Elementaire",
    texte: "*",
    criDeGuerre: ({shopCards, draggedCard, bonusHpElem, bonusAtkElem}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        shopCards.forEach(carte => {
            if(carte.famille === "Elementaire"){
                carte.atk += 2 * bonusDoree + bonusAtkElem;
                carte.buffAtk += 2 * bonusDoree + bonusAtkElem;
                carte.hp += 2 * bonusDoree + bonusHpElem;
                carte.buffHp += 2 * bonusDoree + bonusHpElem;
            }
        });
        cards.forEach(carte =>{
            if(carte.famille === "Elementaire"){
                carte.baseAtk = carte.atk
                carte.atk += 2 * bonusDoree + bonusAtkElem;
                carte.buffAtk += 2 * bonusDoree + bonusAtkElem;
                carte.hp += 2 * bonusDoree + bonusHpElem;
                carte.buffHp += 2 * bonusDoree + bonusHpElem;
            }
        })
    }
  },
  {
    id: 68,
    nom: "Element technique",
    lvl: 5,
    hp: 10,
    baseHp: 10,
    atk: 10,
    atkDispo: false,
    img: "img/card111.png",
    imgMinia: "img/cardfight111.png",
    famille: "Elementaire",
    texte: "*",
    magnetisme: true,
  },
  {
    id: 69,
    nom: "Ama-tueur de thé",
    lvl: 6,
    hp: 6,
    baseHp: 6,
    atk: 6,
    atkDispo: false,
    img: "img/card112.png",
    imgMinia: "img/cardfight112.png",
    famille: "Elementaire",
    texte: "*",
    criDeGuerreCible: true,
    criDeGuerre: ( {draggedCard, bonusHpElem, bonusAtkElem, carte}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        carte.atk += 3 * bonusDoree + bonusAtkElem;
        carte.buffAtk += 3 * bonusDoree + bonusAtkElem;
        carte.hp += 3 * bonusDoree + bonusHpElem;
        carte.buffHp += 3 * bonusDoree + bonusHpElem;
    },
  },
  {
    id: 70,
    nom: "Atrocité aride",
    lvl: 6,
    hp: 6,
    baseHp: 6,
    atk: 6,
    atkDispo: false,
    img: "img/card113.png",
    imgMinia: "img/cardfight113.png",
    famille: "Elementaire",
    texte: "*",
  },
  {
    id: 71,
    nom: "Gentil djinn",
    lvl: 6,
    hp: 5,
    baseHp: 5,
    atk: 4,
    atkDispo: false,
    img: "img/card114.png",
    imgMinia: "img/cardfight114.png",
    imgMiniaProvoc: "img/cardfight114-provoc.png",
    famille: "Elementaire",
    texte: "*",
    piocherCarte: true,
    provocation: true,
    provocationUse: true,
  },
  {
    id: 72,
    nom: "Rejeton de lumière amplifié",
    lvl: 6,
    hp: 9,
    baseHp: 9,
    atk: 5,
    atkDispo: false,
    img: "img/card115.png",
    imgMinia: "img/cardfight115.png",
    famille: "Elementaire",
    texte: "*",
  },
  {
    id: 73,
    nom: "Elementaire de surprise",
    lvl: 6,
    hp: 8,
    baseHp: 8,
    atk: 8,
    atkDispo: false,
    img: "img/card116.png",
    imgMinia: "img/cardfight116.png",
    famille: "Elementaire",
    texte: "*",
  },
  {
    id: 74,
    nom: "Eruption de mana déchainée",
    lvl: 6,
    hp: 4,
    baseHp: 4,
    atk: 6,
    atkDispo: false,
    img: "img/card117.png",
    imgMinia: "img/cardfight117.png",
    famille: "Elementaire",
    texte: "*",
  },
  {
    id: 75,
    nom: "Elementaire",
    lvl: 7,
    hp: 3,
    baseHp: 3,
    atk: 3,
    atkDispo: false,
    img: "img/card118.png",
    imgMinia: "img/cardfight118.png",
    famille: "Elementaire",
    texte: "*",
  },
  {
    id: 76,
    nom: "Grorak, Œil-du-Ciel",
    lvl: 6,
    hp: 8,
    baseHp: 8,
    atk: 7,
    atkDispo: false,
    img: "img/card119.1.png",
    imgMinia: "img/cardfight119.png",
    imgMiniaProvoc: "img/cardfight119-provoc.png",
    imgMiniaBouclier: "img/cardfight119-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight119-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<i>Cri</i><br><br><br>Piochez le Totem <br><br> Ancien de l'Orage Hurlant ",
    deathFureur: true,
    carteSpe: 77,
    piocherCarteSpe: true,
  },
  {
    id: 77,
    nom: "Karaa la Frappe-Foudre",
    lvl: 6,
    hp: 6,
    baseHp: 6,
    atk: 9,
    atkDispo: false,
    img: "img/card120.1.png",
    imgMinia: "img/cardfight120.png",
    imgMiniaProvoc: "img/cardfight120-provoc.png",
    imgMiniaBouclier: "img/cardfight120-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight120-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<i>Cri</i><br><br> Consomme <color=aqua>toutes</color> vos <br><br>charges et gagne <br><br><color=red>+2/+2</color> par charge<br><br>",
    deathFureur: true,
    fureurCeleste3Self: (self, fureurValue) => {
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 3){
          self.atk += fureurValue * 2 * bonusDoree;
          self.buffAtk += fureurValue * 2 * bonusDoree;
          self.hp += fureurValue * 2 * bonusDoree;
          self.buffHp += fureurValue * 2 * bonusDoree;
        }
    },
  },
  {
    id: 78,
    nom: "Ancien de l'Orage Hurlant",
    lvl: 6,
    hp: 12,
    baseHp: 12,
    atk: 4,
    atkDispo: false,
    img: "img/card121.1.png",
    imgMinia: "img/cardfight121.png",
    imgMiniaProvoc: "img/cardfight121-provoc.png",
    imgMiniaBouclier: "img/cardfight121-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight121-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "A chaque attaque subi <br><br><color=aqua>+3</color> Fureur Céleste <br><br> Donne <color=red>+8/+8</color> <br><br>aux Sabre-Tempête",
    deathFureur: true,
    provocation: true,
    provocationUse: true,
    touchFureur3: true,
    fureurCeleste5AllDef: (board, fureurValue, defenseur) => {
        let bonusDoree = 1
        if(defenseur.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 5 && board.length > 1){
          board.forEach(carte => {
            carte.atk += 8 * bonusDoree;
            carte.buffAtk += 8 * bonusDoree;
            carte.hp += 8 * bonusDoree;
            carte.buffHp += 8 * bonusDoree;
          })
        }else if (fureurValue >= 3 && fureurValue < 5){
          board.forEach(carte => {
            carte.atk += 4 * bonusDoree;
            carte.buffAtk += 4 * bonusDoree;
            carte.hp += 4 * bonusDoree;
            carte.buffHp += 4 * bonusDoree;
          })
        }
    }
  },
  {
    id: 79,
    nom: "Marche-Foudre Jorr'Tan",
    lvl: 6,
    hp: 6,
    baseHp: 6,
    atk: 6,
    atkDispo: false,
    img: "img/card122.1.png",
    imgMinia: "img/cardfight122.png",
    imgMiniaProvoc: "img/cardfight122-provoc.png",
    imgMiniaBouclier: "img/cardfight122-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight122-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "Au moment d'attaquer<br><br>Consomme <color=aqua>7</color> - <color=aqua>5</color> ou <color=aqua>3</color><br><br>Donne <color=red>+1/+1</color> par charge<br><br> supp - <color=red>+6/+6</color> ou <color=red>+3/+3</color>",
    deathFureur: true,
    criFureurCeleste7AllFight: (board, attaquant, fureurValue) => {
        let bonusDoree = 1
        if(attaquant.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 7){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += fureurValue * bonusDoree;
              card.buffAtk += fureurValue * bonusDoree;
              card.hp += fureurValue * bonusDoree;
              card.buffHp += fureurValue * bonusDoree;
            }
          })

        }else if(fureurValue >= 5 && fureurValue < 7){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += 6 * bonusDoree;
              card.buffAtk += 6 * bonusDoree;
              card.hp += 6 * bonusDoree;
              card.buffHp += 6 * bonusDoree;
            }
          })

        }
        else if(fureurValue >= 3 && fureurValue < 5){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += 3 * bonusDoree;
              card.buffAtk += 3 * bonusDoree;
              card.hp += 3 * bonusDoree;
              card.buffHp += 3 * bonusDoree;
            }
          })

        }
    }
  },
  {
    id: 80,
    nom: "Torrha, Avatar de l'Ascension",
    lvl: 6,
    hp: 6,
    baseHp: 6,
    atk: 6,
    atkDispo: false,
    img: "img/card123.1.png",
    imgMinia: "img/cardfight123.png",
    imgMiniaProvoc: "img/cardfight123-provoc.png",
    imgMiniaBouclier: "img/cardfight123-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight123-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<i>Cri</i><br><br>Consomme <color=aqua>7</color> - <color=aqua>5</color> ou <color=aqua>3</color> <br><br>Donne <color=red>10atk</color> - <color=red>6atk</color> ou <br><br><color=red>3atk</color> aux Sabre-Tempête",
    deathFureur: true,
    fureurCeleste7All: (board, fureurValue, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 7){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += 10 * bonusDoree;
              card.buffAtk += 10 * bonusDoree;
            }
          })
        }else if(fureurValue >= 5 && fureurValue < 7){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += 6 * bonusDoree;
              card.buffAtk += 6 * bonusDoree;
            }
          })
        }else if(fureurValue >= 3 && fureurValue < 5){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += 3 * bonusDoree;
              card.buffAtk += 3 * bonusDoree;
            }
          })
        }
    }
  },
  {
    id: 81,
    nom: "Rôdeur Cramponné",
    lvl: 6,
    hp: 5,
    baseHp: 5,
    atk: 8,
    atkDispo: false,
    img: "img/card124.1.png",
    imgMinia: "img/cardfight124.png",
    imgMiniaProvoc: "img/cardfight124-provoc.png",
    imgMiniaBouclier: "img/cardfight124-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight124-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<i>Cri</i><br><br>Consomme <color=aqua>7</color> - <color=aqua>5</color> ou <color=aqua>3</color> <br><br>Donne <color=red>10hp</color> - <color=red>6hp</color> ou <br><br><color=red>3hp</color> aux Sabre-Tempête",
    deathFureur: true,
    fureurCeleste7All: (board, fureurValue, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 7){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.hp += 10 * bonusDoree;
              card.buffHp += 10 * bonusDoree;
            }
          })
        }else if(fureurValue >= 5 && fureurValue < 7){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.hp += 6 * bonusDoree;
              card.buffHp += 6 * bonusDoree;
            }
          })
        }else if(fureurValue >= 3 && fureurValue < 5){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.hp += 3 * bonusDoree;
              card.buffHp += 3 * bonusDoree;
            }
          })
        }      
    }
  },
  {
    id: 82,
    nom: "Hurle-Rite d'Éclat-Tempête",
    lvl: 5,
    hp: 7,
    baseHp: 7,
    atk: 6,
    atkDispo: false,
    img: "img/card125.1.png",
    imgMinia: "img/cardfight125.png",
    imgMiniaProvoc: "img/cardfight125-provoc.png",
    imgMiniaBouclier: "img/cardfight125-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight125-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<i>Cri</i><br><br><br>Piochez un Totem de <br><br> Canalisation Céleste",
    deathFureur: true,
    carteSpe: 87,
    piocherCarteSpe: true,
  },
  {
    id: 83,
    nom: "Totem-Runique de Lointanclair",
    lvl: 5,
    hp: 15,
    baseHp: 15,
    atk: 2,
    atkDispo: false,
    img: "img/card126.1.png",
    imgMinia: "img/cardfight126.png",
    imgMiniaProvoc: "img/cardfight126-provoc.png",
    imgMiniaBouclier: "img/cardfight126-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight126-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<br>Après chaque attaque subi <br><br> consomme <color=aqua>5</color> ou <color=aqua>3</color> <br><br>  donne <color=red>+4/+4</color> ou <color=red>+2/+2</color> <br><br> aux Sabre-Tempête",
    deathFureur: true,
    provocation: true,
    provocationUse: true,
    fureurCeleste5AllDef: (board, fureurValue, defenseur) => {
        let bonusDoree = 1
        if(defenseur.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 5){
          board.forEach(carte => {
            carte.atk += 4 * bonusDoree;
            carte.buffAtk += 4 * bonusDoree;
            carte.hp += 4 * bonusDoree;
            carte.buffHp += 4 * bonusDoree;
          })
        }else if (fureurValue >= 3 && fureurValue < 5){
          board.forEach(carte => {
            carte.atk += 2 * bonusDoree;
            carte.buffAtk += 2 * bonusDoree;
            carte.hp += 2 * bonusDoree;
            carte.buffHp += 2 * bonusDoree;
          })
        }
    }
  },
  {
    id: 84,
    nom: "Maître-Tonnerre Korr'Lok",
    lvl: 5,
    hp: 8,
    baseHp: 8,
    atk: 5,
    atkDispo: false,
    img: "img/card127.1.png",
    imgMinia: "img/cardfight127.png",
    imgMiniaProvoc: "img/cardfight127-provoc.png",
    imgMiniaBouclier: "img/cardfight127-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight127-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<i>Cri</i><br><br><color=aqua>+2</color> Fureur Celeste <br><br>par Sabre-Tempête <br><br>présent sur le board",
    deathFureur: true,
    criCeleste2: true,
  },
  {
    id: 85,
    nom: "Fauche-Vents de la Cime Noire",
    lvl: 5,
    hp: 7,
    baseHp: 7,
    atk: 7,
    atkDispo: false,
    img: "img/card128.1.png",
    imgMinia: "img/cardfight128.png",
    imgMiniaProvoc: "img/cardfight128-provoc.png",
    imgMiniaBouclier: "img/cardfight128-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight128-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "Au moment d'attaquer<br><br>Consomme <color=aqua>7</color> - <color=aqua>5</color> ou <color=aqua>3</color> <br><br>Donne <color=red>+6/+6</color> - <color=red>+4/+4</color> ou <br><br><color=red>+2/+2</color> aux Sabre-Tempête<br><br>Il gagne le double",
    deathFureur: true,
    criFureurCeleste7AllFight: (board, attaquant, fureurValue) => {
        let bonusDoree = 1
        if(attaquant.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 7){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += 6 * bonusDoree;
              card.buffAtk += 6 * bonusDoree;
              card.hp += 6 * bonusDoree;
              card.buffHp += 6 * bonusDoree;
            }
          })
          attaquant.atk += 6 * bonusDoree;
          attaquant.buffAtk += 6 * bonusDoree;
          attaquant.hp += 6 * bonusDoree;
          attaquant.buffHp += 6 * bonusDoree;

        }else if(fureurValue >= 5 && fureurValue < 7){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += 4 * bonusDoree;
              card.buffAtk += 4 * bonusDoree;
              card.hp += 4 * bonusDoree;
              card.buffHp += 4 * bonusDoree;
            }
          })
          attaquant.atk += 4 * bonusDoree;
          attaquant.buffAtk += 4 * bonusDoree;
          attaquant.hp += 4 * bonusDoree;
          attaquant.buffHp += 4 * bonusDoree;

        }
        else if(fureurValue >= 3 && fureurValue < 5){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += 2 * bonusDoree;
              card.buffAtk += 2 * bonusDoree;
              card.hp += 2 * bonusDoree;
              card.buffHp += 2 * bonusDoree;
            }
          })
          attaquant.atk += 2 * bonusDoree;
          attaquant.buffAtk += 2 * bonusDoree;
          attaquant.hp += 2 * bonusDoree;
          attaquant.buffHp += 2 * bonusDoree;

        }
    }
  },
  {
    id: 86,
    nom: "Gardien des Hautes-Terres",
    lvl: 4,
    hp: 10,
    baseHp: 10,
    atk: 4,
    atkDispo: false,
    img: "img/card129.1.png",
    imgMinia: "img/cardfight129.png",
    imgMiniaProvoc: "img/cardfight129-provoc.png",
    imgMiniaBouclier: "img/cardfight129-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight129-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<br>Au moment d'attaquer<br><br>consomme <color=aqua>5</color> ou <color=aqua>3</color> charges<br><br> Gagne <color=red>10hp</color> ou <color=red>5hp</color>",
    deathFureur: true,
    criFureurCeleste5SelfFight: (self, fureurValue) => {
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 5){
          self.provocation = true;
          self.provocationUse = true;
          self.hp += 10 * bonusDoree;
          self.buffHp += 10 * bonusDoree;
        }else if(fureurValue >= 3 && fureurValue < 5){
          self.hp += 5 * bonusDoree;
          self.buffHp += 5 * bonusDoree;
        }
    },
  },
  {
    id: 87,
    nom: "Brise-Nuées Rekkha",
    lvl: 4,
    hp: 2,
    baseHp: 2,
    atk: 2,
    atkDispo: false,
    img: "img/card130.1.png",
    imgMinia: "img/cardfight130.png",
    imgMiniaProvoc: "img/cardfight130-provoc.png",
    imgMiniaBouclier: "img/cardfight130-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight130-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<i>Cri</i><br><br> Consomme <color=aqua>toutes</color> vos <br><br>charges gagne <br><br><color=red>+1/+1</color> par charge<br><br>",
    deathFureur: true,
    fureurCeleste3Self: (self, fureurValue) => {
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 3){
          self.atk += fureurValue * bonusDoree;
          self.buffAtk += fureurValue * bonusDoree;
          self.hp += fureurValue * bonusDoree;
          self.buffHp += fureurValue * bonusDoree;
        }     
    },
  },
  {
    id: 88,
    nom: "Totem de Canalisation Céleste",
    lvl: 4,
    hp: 12,
    baseHp: 12,
    atk: 0,
    atkDispo: false,
    img: "img/card131.1.png",
    imgMinia: "img/cardfight131.png",
    imgMiniaProvoc: "img/cardfight131-provoc.png",
    imgMiniaBouclier: "img/cardfight131-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight131-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<br><br><color=aqua>+4</color> Fureur Celeste à<br><br> chaque fois qu'il est<br><br> attaqué",
    deathFureur: true,
    provocation: true,
    provocationUse: true,
    touchFureur2: true,
  },
  {
    id: 89,
    nom: "Vétéran Sabre-Gris",
    lvl: 4,
    hp: 6,
    baseHp: 6,
    atk: 5,
    atkDispo: false,
    img: "img/card132.1.png",
    imgMinia: "img/cardfight132.png",
    imgMiniaProvoc: "img/cardfight132-provoc.png",
    imgMiniaBouclier: "img/cardfight132-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight132-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<br>Au moment d'attaquer<br><br>consomme <color=aqua>5</color> ou <color=aqua>3</color> charges<br><br> Gagne <color=red>+6/+6</color> ou <color=red>+3/+3</color>",
    deathFureur: true,
    criFureurCeleste5SelfFight: (self, fureurValue) => {
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 5){
          self.atk += 6 * bonusDoree;
          self.buffAtk += 6 * bonusDoree;
          self.hp += 6 * bonusDoree;
          self.buffHp += 6 * bonusDoree;
        }else if(fureurValue >= 3 && fureurValue < 5){
          self.atk += 3 * bonusDoree;
          self.buffAtk += 3 * bonusDoree;
          self.hp += 3 * bonusDoree;
          self.buffHp += 3 * bonusDoree;
        }
    },
  },
  {
    id: 90,
    nom: "Lame-Rituelle de Farghann",
    lvl: 4,
    hp: 7,
    baseHp: 7,
    atk: 3,
    atkDispo: false,
    img: "img/card133.1.png",
    imgMinia: "img/cardfight133.png",
    imgMiniaProvoc: "img/cardfight133-provoc.png",
    imgMiniaBouclier: "img/cardfight133-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight133-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<i>Cri</i><br><br>Cosomme <color=aqua>5</color> ou <color=aqua>3</color> charges <br><br> Donne <color=red>+4/+4</color> ou <color=red>+2/+2</color> <br><br> aux Sabre-Tempête",
    deathFureur: true,
    fureurCeleste5All: (board, fureurValue, draggedCard) => {
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 5){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += 4 * bonusDoree;
              card.buffAtk += 4 * bonusDoree;
              card.hp += 4 * bonusDoree;
              card.buffHp += 4 * bonusDoree;
            }
          })
        }else if(fureurValue >= 3 && fureurValue < 5){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += 2 * bonusDoree;
              card.buffAtk += 2 * bonusDoree;
              card.hp += 2 * bonusDoree;
              card.buffHp += 2 * bonusDoree;
            }
          })
        }
    }
  },
  {
    id: 91,
    nom: "Fracture-Éclair Rhakka",
    lvl: 3,
    hp: 5,
    baseHp: 5,
    atk: 5,
    atkDispo: false,
    img: "img/card134.1.png",
    imgMinia: "img/cardfight134.png",
    imgMiniaProvoc: "img/cardfight134-provoc.png",
    imgMiniaBouclier: "img/cardfight134-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight134-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "Au moment d'attaquer<br><br>consomme <color=aqua>5</color> ou <color=aqua>3</color> charges<br><br>donne <color=red>+2/+2</color> ou <color=red>+1/+1</color> <br><br>aux Sabre-Tempête<br><br>Rhakka gagne le double",
    deathFureur: true,
    criFureurCeleste5AllFight: (board, attaquant, fureurValue) => {
        let bonusDoree = 1
        if(attaquant.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 5){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += 2 * bonusDoree;
              card.buffAtk += 2 * bonusDoree;
              card.hp += 2 * bonusDoree;
              card.buffHp += 2 * bonusDoree;
            }
          })
          attaquant.atk += 2 * bonusDoree;
          attaquant.buffAtk += 2 * bonusDoree;
          attaquant.hp += 2 * bonusDoree;
          attaquant.buffHp += 2 * bonusDoree;
        }else if(fureurValue >= 3 && fureurValue < 5){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += 1 * bonusDoree;
              card.buffAtk += 1 * bonusDoree;
              card.hp += 1 * bonusDoree;
              card.buffHp += 1 * bonusDoree;
            }
          })
          attaquant.atk += 1 * bonusDoree;
          attaquant.buffAtk += 1 * bonusDoree;
          attaquant.hp += 1 * bonusDoree;
          attaquant.buffHp += 1 * bonusDoree;
        }
    }
  },
  {
    id: 92,
    nom: "Chante-Rites Féral'Ka",
    lvl: 3,
    hp: 6,
    baseHp: 6,
    atk: 3,
    atkDispo: false,
    img: "img/card135.1.png",
    imgMinia: "img/cardfight135.png",
    imgMiniaProvoc: "img/cardfight135-provoc.png",
    imgMiniaBouclier: "img/cardfight135-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight135-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<i>Cri</i><br><br>Cosomme <color=aqua>5</color> ou <color=aqua>3</color> charges <br><br> Donne <color=red>+2/+2</color> ou <color=red>+1/+1</color> <br><br> aux Sabre-Tempête  ",
    deathFureur: true,
    fureurCeleste5All: (board, fureurValue, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 5){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += 2 * bonusDoree;
              card.buffAtk += 2 * bonusDoree;
              card.hp += 2 * bonusDoree;
              card.buffHp += 2 * bonusDoree;
            }
          })
        }else if(fureurValue >= 3 && fureurValue < 5){
          board.forEach(card =>{
            if(card.famille === "Les Sabre-Tempête"){
              card.atk += 1 * bonusDoree;
              card.buffAtk += 1 * bonusDoree;
              card.hp += 1 * bonusDoree;
              card.buffHp += 1 * bonusDoree;
            }
          })
        }
    }
  },
  {
    id: 93,
    nom: "Totem de l'Étincelle Sage",
    lvl: 3,
    hp: 8,
    baseHp: 8,
    atk: 0,
    atkDispo: false,
    img: "img/card136.1.png",
    imgMinia: "img/cardfight136.png",
    imgMiniaProvoc: "img/cardfight136-provoc.png",
    imgMiniaBouclier: "img/cardfight136-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight136-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<br><color=red>+2/+2</color> à un Sabre-Tempête<br><br>aléatoire après chaque<br><br>attaque subi<br><br>Consomme <color=aqua>3</color> charges",
    deathFureur: true,
    provocation: true,
    provocationUse: true,
    fureurCeleste3OneRandomDef: (cible, fureurValue, defenseur) => {
        let bonusDoree = 1
        if(defenseur.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 3){
          cible.atk += 2 * bonusDoree;
          cible.buffAtk += 2 * bonusDoree;
          cible.hp += 2 * bonusDoree;
          cible.buffHp += 2 * bonusDoree;
        }
    }
  },
  {
    id: 94,
    nom: "Tisse-Foudre Tahran",
    lvl: 3,
    hp: 4,
    baseHp: 4,
    atk: 6,
    atkDispo: false,
    img: "img/card137.1.png",
    imgMinia: "img/cardfight137.png",
    imgMiniaProvoc: "img/cardfight137-provoc.png",
    imgMiniaBouclier: "img/cardfight137-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight137-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<br><br> Au moment d'attaquer <br><br> Consomme <color=aqua>3</color> charges <br><br> gagne <color=red>+2/+2</color>",
    deathFureur: true,
    criFureurCeleste3SelfFight: (self, fureurValue) => {
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 3){
          self.atk += 2 * bonusDoree;
          self.buffAtk += 2 * bonusDoree;
          self.hp += 2 * bonusDoree;
          self.buffHp += 2 * bonusDoree;
        }
    },
  },
  {
    id: 95,
    nom: "Gardienne Totémique Korai",
    lvl: 2,
    hp: 7,
    baseHp: 7,
    atk: 3,
    atkDispo: false,
    img: "img/card138.1.png",
    imgMinia: "img/cardfight138.png",
    imgMiniaProvoc: "img/cardfight138-provoc.png",
    imgMiniaBouclier: "img/cardfight138-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight138-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<br><i>Cri</i><br><br>Piochez un Totem<br><br> d'Agitation Céleste",
    deathFureur: true,
    carteSpe: 97,
    piocherCarteSpe: true,
  },
  {
    id: 96,
    nom: "Torak Bouclier-des-Plaines",
    lvl: 2,
    hp: 4,
    baseHp: 4,
    atk: 4,
    atkDispo: false,
    img: "img/card139.1.png",
    imgMinia: "img/cardfight139.png",
    imgMiniaProvoc: "img/cardfight139-provoc.png",
    imgMiniaBouclier: "img/cardfight139-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight139-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<br><br> Au moment d'attaquer <br><br> Consomme <color=aqua>3</color> charges <br><br> gagne <color=red>+1/+2</color> ",
    deathFureur: true,
    criFureurCeleste3SelfFight: (self, fureurValue) => {
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 3){
          self.atk+= 1 * bonusDoree;
          self.buffAtk += 1 * bonusDoree;
          self.hp += 2 * bonusDoree;
          self.buffHp += 2 * bonusDoree;
        }
    },
    
  },
  {
    id: 97,
    nom: "Soigne-Vents Taliha",
    lvl: 2,
    hp: 5,
    baseHp: 5,
    atk: 3,
    atkDispo: false,
    img: "img/card140.1.png",
    imgMinia: "img/cardfight140.png",
    imgMiniaProvoc: "img/cardfight140-provoc.png",
    imgMiniaBouclier: "img/cardfight140-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight140-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<i>Cri</i><br><br> <color=red>+2hp</color> à un Sabre-Tempête<br><br>aléatoire. Consomme <color=aqua>3</color><br><br>charges",
    deathFureur: true,
    fureurCeleste3OneRandom: (cible, fureurValue, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 3){
          cible.hp += 2 * bonusDoree;
          cible.buffHp += 2 * bonusDoree;
        }
    }
  },
  {
    id: 98,
    nom: "Totem d'Agitation Céleste",
    lvl: 2,
    hp: 6,
    baseHp: 6,
    atk: 0,
    atkDispo: false,
    img: "img/card141.1.png",
    imgMinia: "img/cardfight141.png",
    imgMiniaProvoc: "img/cardfight141-provoc.png",
    imgMiniaBouclier: "img/cardfight141-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight141-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<br><br><color=aqua>+2</color> Fureur Celeste à<br><br> chaque fois qu'il est<br><br> attaqué",
    deathFureur: true,
    provocation: true,
    provocationUse: true,
    touchFureur: true,
  },
  {
    id: 99,
    nom: "Lame de Loint'Roc",
    lvl: 1,
    hp: 3,
    baseHp: 3,
    atk: 5,
    atkDispo: false,
    img: "img/card142.1.png",
    imgMinia: "img/cardfight142.png",
    imgMiniaProvoc: "img/cardfight142-provoc.png",
    imgMiniaBouclier: "img/cardfight142-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight142-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<i>Cri</i><br><br><br> Consomme <color=aqua>3</color> charges <br><br> Gagne <color=red>+1/+1</color>",
    fureurCeleste3Self: (self, fureurValue) => {
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        if (fureurValue >= 3){
          self.atk += 1 * bonusDoree;
          self.buffAtk += 1 * bonusDoree;
          self.hp += 1 * bonusDoree;
          self.buffHp += 1 * bonusDoree;
        }
    },
    deathFureur: true,
  },
  {
    id: 100,
    nom: "Vole-Flamme Mikka",
    lvl: 1,
    hp: 3,
    baseHp: 3,
    atk: 2,
    atkDispo: false,
    img: "img/card143.1.png",
    imgMinia: "img/cardfight143.png",
    imgMiniaProvoc: "img/cardfight143-provoc.png",
    imgMiniaBouclier: "img/cardfight143-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight143-provoc-bouclier.png",
    famille: "Les Sabre-Tempête",
    texte: "<br><i>Cri</i><br><br><br> Fureur Celeste <color=aqua>+5</color>",
    criCeleste: true,
    deathFureur: true,
  },
  {
    id: 101,
    nom: "Tirelire",
    lvl: 1,
    hp: "",
    baseHp: "",
    atk: "",
    atkDispo: false,
    img: "img/card144.png",
    imgMinia: "img/cardfight144.png",
    famille: "Sort",
    texte: "<br><i>Tirelire</i><br><br><br><br>Vous gagnez <color=gold> 1 </color> pièce d'or.",
    lancerSort: (setter, gold) => {
      setter(gold + 1)
    }
  },
  {
    id: 102,
    nom: "Ration de Combat",
    lvl: 1,
    hp: "",
    baseHp: "",
    atk: "",
    atkDispo: false,
    img: "img/card145.png",
    imgMinia: "img/cardfight145.png",
    famille: "Sort",
    texte: "<br><i>Ration de Combat</i> <br><br><br> Donne <color=red>+2/+2</color> au serviteur<br><br>le plus à gauche du board",
    lancerSort: (setter, gold, board) => {
      if(board.length > 0){
        board[0].atk += 2;
        board[0].buffAtk += 2;
        board[0].hp += 2;
        board[0].BuffHp += 2;
      }

    }
  },
  {
    id: 103,
    nom: "Hache de Guerre",
    lvl: 1,
    hp: "",
    baseHp: "",
    atk: "",
    atkDispo: false,
    img: "img/card146.png",
    imgMinia: "img/cardfight146.png",
    famille: "Sort",
    texte: "<br><i>Hache de Guerre</i> <br><br><br> Donne <color=red>+4atk</color> à votre serviteur <br><br> le plus à gauche",
    lancerSort: (setter, gold, board) => {
      if(board.length > 0){
        board[0].atk += 4;
        board[0].buffAtk += 4;
      }

    }
  },
  {
    id: 104,
    nom: "Bouclier en Bois",
    lvl: 1,
    hp: "",
    baseHp: "",
    atk: "",
    atkDispo: false,
    img: "img/card147.png",
    imgMinia: "img/cardfight147.png",
    famille: "Sort",
    texte: "<br><i>Bouclier en Bois</i> <br><br><br> Donne <color=red>+4hp</color> à votre serviteur <br><br> le plus à gauche",
    lancerSort: (setter, gold, board) => {
      if(board.length > 0){
        board[0].hp += 4;
        board[0].buffHp += 4;
      }

    }
  },
  {
    id: 104,
    nom: "Gardien",
    lvl: 1,
    hp: "",
    baseHp: "",
    atk: "",
    atkDispo: false,
    img: "img/card148.png",
    imgMinia: "img/cardfight148.png",
    famille: "Sort",
    texte: "<br><i>Gardien</i> <br><br><br> Donne <color=red>Gardien</color> à <br><br> votre serviteur le plus à <br><br> gauche",
    lancerSort: (setter, gold, board) => {
      if(board.length > 0){
        board[0].provocation = true;
        board[0].provocationUse = true;
      }

    }
  },
  {
    id: 105,
    nom: "Subtiliser",
    lvl: 2,
    hp: "",
    baseHp: "",
    atk: "",
    atkDispo: false,
    img: "img/card149.png",
    imgMinia: "img/cardfight149.png",
    famille: "Sort",
    texte: "<br><i>Subtiliser</i> <br><br><br> Vole une carte aléatoire<br><br> de la taverne ",
    lancerSort: (setter, gold, board, shop, setterDeck, deck, setterShop) => {
      const randomCardShop = shop[Math.floor(Math.random() * shop.length)]
      const cloneCard = clonerCarte({ carte: randomCardShop, camp: "shop" })
      let newDeck = deck.push(cloneCard)
      setterDeck(newDeck)
      let newShop = shop.filter(c => c !== randomCardShop)
      setterShop(newShop)
    }
  },
  {
    id: 106,
    nom: "Petit Coffre",
    lvl: 2,
    hp: "",
    baseHp: "",
    atk: "",
    atkDispo: false,
    img: "img/card150.png",
    imgMinia: "img/cardfight150.png",
    famille: "Sort",
    texte: "<br><i>Petit Coffre</i> <br><br><br> Vous obtenez une carte <br><br> aléatoire de lvl <color=red>1</color>",
    lancerSort: (setter, gold, board, shop, setterDeck, deck, setterShop) => {
      const cardsLvl1 = cards.filter(c => c.lvl === 1 && c.famille !== "Sort")
      const randomCardsLvl1 = cardsLvl1[Math.floor(Math.random() * cardsLvl1.length)]
      const cloneCard = clonerCarte({ carte: randomCardsLvl1, camp: "shop" })
      let newDeck = deck.push(cloneCard)
      setterDeck(newDeck)
    }
  },
  {
    id: 107,
    nom: "Lien Spirituel",
    lvl: 2,
    hp: "",
    baseHp: "",
    atk: "",
    atkDispo: false,
    img: "img/card151.png",
    imgMinia: "img/cardfight151.png",
    famille: "Sort",
    texte: "<br><i>Lien Spirituel</i> <br><br><br> Pioche une carte d'un lvl <br><br> inferieur et de la même <br><br> famille que celle la plus à <br><br> gauche du Board",
    lancerSort: (setter, gold, board, shop, setterDeck, deck, setterShop) => {
      let cardsFamilleLvlInf = cards.filter(c => c.lvl < board[0].lvl && c.famille !== "Sort" && c.famille === board[0].famille)
      if(cardsFamilleLvlInf.length <= 0){
        cardsFamilleLvlInf = cards.filter(c => c.lvl === board[0].lvl && c.famille !== "Sort" && c.famille === board[0].famille)
      }
      const randomCardsFamilleInf = cardsFamilleLvlInf[Math.floor(Math.random() * cardsFamilleLvlInf.length)]
      const cloneCard = clonerCarte({ carte: randomCardsFamilleInf, camp: "shop" })
      let newDeck = deck.push(cloneCard)
      setterDeck(newDeck)
    }
  },
  {
    id: 108,
    nom: "Gold additionnel",
    lvl: 3,
    hp: "",
    baseHp: "",
    atk: "",
    atkDispo: false,
    img: "img/card152.png",
    imgMinia: "img/cardfight152.png",
    famille: "Sort",
    texte: "<br><i>Gold additionnel</i> <br><br><br> Augmente votre maximum <br><br> d'or de <color=gold>1</color>",
    lancerSort: (setter, gold, board, shop, setterDeck, deck, setterShop, maxGold, setmaxGold) => {
      setmaxGold(maxGold + 1)
      console.log(maxGold)
    }
  },
  {
    id: 109,
    nom: "Titi L'aigri",
    lvl: 1,
    hp: 2,
    baseHp: 2,
    atk: 3,
    atkDispo: false,
    img: "img/card7.png",
    imgMinia: "img/cardfight7.png",
    famille: "Les Hierels",
    sousFamille: "Les Pets",
    texte: "<br><i>Miaouuu</i> <br><br><br> Réclame à manger mais <br><br> ne mange rien...",
  },
  {
    id: 110,
    nom: "Maya-Bull",
    lvl: 1,
    hp: 3,
    baseHp: 3,
    atk: 2,
    atkDispo: false,
    img: "img/card6.png",
    imgMinia: "img/cardfight6.png",
    imgMiniaProvoc: "img/cardfight6-provoc.png",
    famille: "Les Hierels",
    sousFamille: "Les Pets",
    texte: "<br><i>On joue?!?</i> <br><br><br> On joue? on joue? <br><br> ON JOUE?? On mange?",
  },
  {
    id: 111,
    nom: "Floby",
    lvl: 2,
    hp: 2,
    baseHp: 2,
    atk: 1,
    atkDispo: false,
    img: "img/card4.png",
    imgMinia: "img/cardfight4.png",
    famille: "Les Hierels",
    sousFamille: "Les Z",
    texte: "<br><i>Cri</i> <br><br><br> <color=red>+1 Atk</color> à un Hierel <br><br> aléatoire",
    criDeGuerreCible: true,
    criDeGuerre: ({draggedCard, carte}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        if(carte.famille === "Les Hierels"){
            carte.atk += 1 * bonusDoree;
            carte.buffAtk +=1 * bonusDoree;
        }
    },
  },
  {
    id: 112,
    nom: "Los Mecanos",
    lvl: 2,
    hp: 2,
    baseHp: 2,
    atk: 2,
    atkDispo: false,
    img: "img/card5.png",
    imgMinia: "img/cardfight5.png",
    famille: "Les Hierels",
    sousFamille: "Les L",
    texte: "<br><i>Cri</i> <br><br><br> Donne Gardien à un Hierel <br><br> aléatoire",
    criDeGuerreCible: true,
    criDeGuerre: ({carte}) => {
      if(carte.famille === "Les Hierels"){
        carte.provocation = true
        carte.provocationUse = true
      }     
    },
  },
  {
    id: 113,
    nom: "Chauve Qui Peut",
    lvl: 2,
    hp: 3,
    baseHp: 3,
    atk: 3,
    atkDispo: false,
    img: "img/card28.1.png",
    imgMinia: "img/cardfight28.1.png",
    famille: "Les Hierels",
    sousFamille: "Les L",
    texte: "<br><i>Cri</i> <br><br><br> Gagne <color=red>+2 Hp</color> si un autre <br><br> Hierel est présent",
    criDeGuerreSelf: true,
    criDeGuerre: ({draggedCard, cartesBoard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        let boardFiltred =  cartesBoard.filter(card => card.famille === "Les Hierels")
        if(boardFiltred.length > 0){
          draggedCard.hp += 2 * bonusDoree;
          draggedCard.buffHp +=2 * bonusDoree;
        }
    },
  },
  {
    id: 114,
    nom: "Gio & Toto",
    lvl: 3,
    hp: 2,
    baseHp: 2,
    atk: 2,
    atkDispo: false,
    img: "img/card11.png",
    imgMinia: "img/cardfight11.png",
    famille: "Les Hierels",
    sousFamille: "Les N",
    texte: "<br><i>Renforcement familiaux</i> <br><br><br> Gagne <color=red>+1/+1</color> à chaque <br><br> fois qu'un Hierel est posé",
    upSelf: true,
  },
  {
    id: 115,
    nom: "Chrys & Jerem",
    lvl: 3,
    hp: 3,
    baseHp: 3,
    atk: 4,
    atkDispo: false,
    img: "img/card16.png",
    imgMinia: "img/cardfight16.png",
    imgProjectile: "img/projectile2.png",
    famille: "Les Hierels",
    sousFamille: "Les Z",
    texte: "<br><i>Debut de combat</i> <br><br><br> inflige <color=red>1 dégat</color> par pts <br><br> d'atk à 1 adv. aléatoire",
    oneTicDebutCombat: (carteCible, carteSource) => {
        let bonusDoree = 1
        if(carteSource.estDoree){
            bonusDoree = 2
        }
        if(carteCible.bouclierUse){
          carteCible.hp -= 0;
          carteCible.degatsRecus = 0;
          carteCible.bouclierUse = false
        }else{
          carteCible.hp -= carteSource.atk * bonusDoree; 
          carteCible.degatsRecus = carteSource.atk * bonusDoree;
        }  
    },
  },
  {
    id: 116,
    nom: "Lohan",
    lvl: 3,
    hp: 2,
    baseHp: 2,
    atk: 2,
    atkDispo: false,
    img: "img/card3.png",
    imgMinia: "img/cardfight3.png",
    famille: "Les Hierels",
    sousFamille: "Les L",
    texte: "<br><i>Cri et tous les 2 tours</i> <br><br><br> Piochez une carte <br><br> <color=white>Doudou</color> aléatoire",
    carteSpe: 117,
    piocherCarteSpe: true,
    decomptePioche: 2,
  },
  {
    id: 117,
    nom: "Chat-Miaou",
    lvl: 7,
    hp: 2,
    baseHp: 2,
    atk: 2,
    atkDispo: false,
    img: "img/card17.png",
    imgMinia: "img/cardfight17.png",
    famille: "Les Hierels",
    sousFamille: "Doudou",
    texte: "<br><i>Renforcement du maitre</i> <br><br><br> Donne <color=red>+1/+1</color> à Lohan",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Les Hierels"){
                carte.atk += 1 * bonusDoree;
                carte.buffAtk +=1 * bonusDoree;
                carte.hp += 1 * bonusDoree;
                carte.buffHp +=1 * bonusDoree;
            }
            if(carte.nom === "Lohan"){
                carte.atk += 1 * bonusDoree;
                carte.buffAtk +=1 * bonusDoree;
                carte.hp += 1 * bonusDoree;
                carte.buffHp +=1 * bonusDoree;
            }
        });      
    }, 
  },
  {
    id: 118,
    nom: "Felix",
    lvl: 7,
    hp: 3,
    baseHp: 3,
    atk: 1,
    atkDispo: false,
    img: "img/card19.png",
    imgMinia: "img/cardfight19.png",
    famille: "Les Hierels",
    sousFamille: "Doudou",
    texte: "<br><i>Renforcement du maitre</i> <br><br><br> Donne <color=red>+2 Hp</color> à Lohan",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Les Hierels"){
                carte.hp += 2 * bonusDoree;
                carte.buffHp +=2 * bonusDoree;
            }
            if(carte.nom === "Lohan"){
                carte.hp += 2 * bonusDoree;
                carte.buffHp +=2 * bonusDoree;
            }
        });      
    },
  },
  {
    id: 119,
    nom: "Pinceau",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 3,
    atkDispo: false,
    img: "img/card20.png",
    imgMinia: "img/cardfight20.png",
    famille: "Les Hierels",
    sousFamille: "Doudou",
    texte: "<br><i>Renforcement du maitre</i> <br><br><br> Donne <color=red>+2 Atk</color> à Lohan",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Les Hierels"){
                carte.atk += 2 * bonusDoree;
                carte.buffAtk +=2 * bonusDoree;
            }
            if(carte.nom === "Lohan"){
                carte.atk += 2 * bonusDoree;
                carte.buffAtk +=2 * bonusDoree;
            }
        });      
    },
  },
  {
    id: 120,
    nom: "Fufu",
    lvl: 3,
    hp: 4,
    baseHp: 4,
    atk: 2,
    atkDispo: false,
    img: "img/card22.png",
    imgMinia: "img/cardfight22.png",
    famille: "Les Hierels",
    sousFamille: "Les BBEW",
    texte: "<br><i>En combat</i> <br><br><br> Gagne <br><br> <color=red>+2/+2</color> à chaque Hierel <br><br> mort",
    deathTrigger: (mortCarte, cartesBoard, self) => {
      // Ne rien faire si la carte morte n’est pas Croc-Noir ou si elle est Grûm lui-même
      if (mortCarte.famille !== "Les Hierels" || mortCarte.id === self.id) return;
        let bonusDoree = 1
        if(self.estDoree){
            bonusDoree = 2
        }
        self.atk += 2 * bonusDoree;
        self.buffAtk += 2 * bonusDoree;
        self.hp += 1 * bonusDoree;
        self.buffHp += 1 * bonusDoree;
        self.buffAtkGrum = (self.buffAtkGrum || 0) + 1 * bonusDoree;
        self.buffHpGrum = (self.buffHpGrum || 0) + 1 * bonusDoree; 
        self.grumBuffEffect = true; // Pour tracking ou affichage
    }
  },
  {
    id: 121,
    nom: "Super Thomux",
    lvl: 3,
    hp: 3,
    baseHp: 3,
    atk: 3,
    atkDispo: false,
    img: "img/card24.png",
    imgMinia: "img/cardfight24.png",
    famille: "Les Hierels",
    sousFamille: "Les BBEW",
    texte: "<br><i>Cri</i> <br><br> Donne <color=red>+1/+1</color> aux Hierels <br><br> présent. <color=red>+2/+2</color> si c'est un <br><br> BBEW",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Les Hierels"){
                carte.atk += 1 * bonusDoree;
                carte.buffAtk +=1 * bonusDoree;
                carte.hp += 1 * bonusDoree;
                carte.buffHp +=1 * bonusDoree;
            }
            if(carte.sousFamille === "Les BBEW"){
                carte.atk += 1 * bonusDoree;
                carte.buffAtk +=1 * bonusDoree;
                carte.hp += 1 * bonusDoree;
                carte.buffHp +=1 * bonusDoree;
            }
        });      
    },
  },
  {
    id: 122,
    nom: "Ludo & Jenny",
    lvl: 4,
    hp: 4,
    baseHp: 4,
    atk: 4,
    atkDispo: false,
    img: "img/card12.png",
    imgMinia: "img/cardfight12.png",
    famille: "Les Hierels",
    sousFamille: "Les N",
    texte: "<br><i>effet de mass</i> <br><br><color=red>+1/+1</color> pour chaque Hierel <br><br><i>aura</i> <br><br><color=red>+1/+1</color> aux Hierels",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        const Hierel = cartesBoard.filter(c => c.famille === "Les Hierels" && c.id !== draggedCard.id);
        if (Hierel.length > 0) {
          draggedCard.atk += Hierel.length * bonusDoree;
          draggedCard.hp += Hierel.length * bonusDoree;
          draggedCard.buffAtk += Hierel.length * bonusDoree;
          draggedCard.buffHp += Hierel.length * bonusDoree;
        }    
    },
    aura: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if (carte.famille === "Les Hierels") {
                carte.atk += 2 * bonusDoree;
                carte.buffAtk += 2 * bonusDoree;
                carte.hp += 2 * bonusDoree;
                carte.buffHp += 2 * bonusDoree;
                carte.auraEffect = true;
            } 
        });
    },
    auraSell: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (carte.auraEffect === true && carte.famille === "Les Hierels") {
            carte.atk -= 2 * bonusDoree;
            carte.buffAtk -= 2 * bonusDoree;
            carte.hp -= 2 * bonusDoree;
            carte.buffHp -= 2 * bonusDoree;
            if(carte.buffHp === 0 && carte.buffAtk === 0){
              carte.auraEffect = false
            }        
          }
        }); 
    },
    auraUnique: (carte) => {
      if (carte.famille === "Les Hierels") {
        carte.atk += 2;
        carte.buffAtk += 2;
        carte.hp += 2;
        carte.buffHp += 2;
        carte.auraEffect = true; 
      }     
    },
  },
  {
    id: 123,
    nom: "Rayan",
    lvl: 4,
    hp: 3,
    baseHp: 3,
    atk: 4,
    atkDispo: false,
    img: "img/card14.png",
    imgMinia: "img/cardfight14.png",
    famille: "Les Hierels",
    sousFamille: "Les L",
    texte: "<br><i>Début de tour</i> <br><br> Gagne <color=red>+1/+1</color><br><br> si Aurelie ou Cedric <br><br> présent, <color=red>+2/+2</color>",
    carteSpe: 135,
    piocherCarteSpe: true,
    aoeCibleApresCombat: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        if(carte.sousFamille === "Les L"){
            draggedCard.atk += 2 * bonusDoree;
            draggedCard.buffAtk += 2 * bonusDoree;
            draggedCard.hp += 2 * bonusDoree;
            draggedCard.buffHp += 2 * bonusDoree;
            draggedCard.animAoE = true; 
          }else{
            if(carte.famille === "Les Hierels"){
              draggedCard.atk += 1 * bonusDoree;
              draggedCard.buffAtk += 1 * bonusDoree;
              draggedCard.hp += 1 * bonusDoree;
              draggedCard.buffHp += 1 * bonusDoree;
              draggedCard.animAoE = true;
            }
          }
    },

  },
  {
    id: 124,
    nom: "Flo Mediv",
    lvl: 4,
    hp: 3,
    baseHp: 3,
    atk: 2,
    atkDispo: false,
    img: "img/card1.png",
    imgMinia: "img/cardfight1.png",
    famille: "Les Hierels",
    sousFamille: "Les Z",
    texte: "<br><i>Cri et Début de tour</i> <br><br> Donne <color=red>+1/+1</color><br><br> <color=red>+2/+2</color> si c'est un Z",
    aoeCibleApresCombat: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if(carte.famille === "Les Hierels"){
            carte.hp += 2 * bonusDoree;
            carte.buffHp += 2 * bonusDoree;
            carte.animAoE = true; 
          }else{
            carte.hp += 1 * bonusDoree;
            carte.buffHp += 1 * bonusDoree;
            carte.animAoE = true;
          }

        });      
    },
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Les Hierels"){
                carte.atk += 2 * bonusDoree;
                carte.buffAtk += 2 * bonusDoree;
                carte.hp += 2 * bonusDoree;
                carte.buffHp +=2 * bonusDoree;
            }
            if(carte.sousFamille === "Les Z"){
                carte.atk += 1 * bonusDoree;
                carte.buffAtk +=1 * bonusDoree;
                carte.hp += 1 * bonusDoree;
                carte.buffHp +=1 * bonusDoree;
            }
        });      
    },

  },
  {
    id: 125,
    nom: "Thomux",
    lvl: 4,
    hp: 4,
    baseHp: 4,
    atk: 5,
    atkDispo: false,
    img: "img/card18.png",
    imgMinia: "img/cardfight18.png",
    famille: "Les Hierels",
    sousFamille: "Les BBEW",
    texte: "<i>Pote la !</i> <br><br> Quand un Hierel meurt <br><br> donne <color=red>+2/+1</color> à un autre <br><br><i>Début de tour</i> <br><br> gagne <color=red>+1/+1</color>",
    upSelf: true,
    deathTrigger: (mortCarte, cartesBoard, self) => {
      // Ne rien faire si la carte morte n’est pas Croc-Noir ou si elle est Grûm lui-même
      if (mortCarte.famille !== "Les Hierels" || mortCarte.id === self.id) return;
    
      // Cherche les cibles valides (autres Croc-Noir vivants, excluant Grûm et la carte morte)
      const cibles = cartesBoard.filter(c =>
        c.famille === "Les Hierels" &&
        c.id !== self.id &&
        c.id !== mortCarte.id &&
        c.hp > 0
      );
    
      if (cibles.length === 0) return;
    
      // Choisir une cible aléatoire
      const cible = cibles[Math.floor(Math.random() * cibles.length)];
      let bonusDoree = 1
      if(self.estDoree){
          bonusDoree = 2
      }
      cible.atk += 2 * bonusDoree;
      cible.hp += 1 * bonusDoree;
      cible.buffAtk += 2 * bonusDoree;
      cible.buffHp += 1 * bonusDoree;
      cible.buffAtkGrum = (cible.buffAtkGrum || 0) + 2 * bonusDoree;
      cible.buffHpGrum = (cible.buffHpGrum || 0) + 1 * bonusDoree;
      cible.grumBuffEffect = true; // Pour tracking ou affichage
    }
  },
  {
    id: 126,
    nom: "Patricia",
    lvl: 5,
    hp: 6,
    baseHp: 6,
    atk: 2,
    atkDispo: false,
    img: "img/card13.png",
    imgMinia: "img/cardfight13.png",
    famille: "Les Hierels",
    sousFamille: "Les L",
    texte: "<br><i>Effet de couple et aura</i> <br><br> si Patrick est présent <br><br><color=red>+2/+2</color> aux Hierels<br><br> Bonus doublé pour les L",
    effetDeCouple: {
      partenaire: "Patrick",
      effet: (cartesBoard) => {
        cartesBoard.forEach(carte => {
          if (carte.famille === "Les Hierels") {
            if(carte.sousFamille === "Les L"){
              carte.atk += 4;
              carte.buffAtk += 4;
              carte.hp += 4;
              carte.buffHp += 4;
            }else{
              carte.atk += 2;
              carte.buffAtk += 2;
              carte.hp += 2;
              carte.buffHp += 2;
            }   
          }
        });
      },
    }, 
    aura: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if (carte.famille === "Les Hierels") {
                if(carte.sousFamille === "Les L"){
                    carte.atk += 4 * bonusDoree;
                    carte.buffAtk += 4 * bonusDoree;
                    carte.hp += 4 * bonusDoree;
                    carte.buffHp += 4 * bonusDoree;
                    carte.auraEffect = true;
                }else{
                    carte.atk += 2 * bonusDoree;
                    carte.buffAtk += 2 * bonusDoree;
                    carte.hp += 2 * bonusDoree;
                    carte.buffHp += 2 * bonusDoree;
                    carte.auraEffect = true;
                }  
            } 
        });
    },
    auraSell: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (carte.auraEffect === true && carte.famille === "Les Hierels") {
            if(carte.sousFamille === "Les L"){
              carte.atk -= 4 * bonusDoree;
              carte.buffAtk -= 4 * bonusDoree;
              carte.hp -= 4 * bonusDoree;
              carte.buffHp -= 4 * bonusDoree;
            }else{
              carte.atk -= 2 * bonusDoree;
              carte.buffAtk -= 2 * bonusDoree;
              carte.hp -= 2 * bonusDoree;
              carte.buffHp -= 2 * bonusDoree;
            }
            if(carte.buffHp === 0 && carte.buffAtk === 0){
              carte.auraEffect = false
            }        
          }
        }); 
    },
    auraUnique: (carte) => {
      if (carte.famille === "Les Hierels") {
        if(carte.sousFamille === "Les L"){
          carte.atk += 4;
          carte.buffAtk += 4;
          carte.hp += 4;
          carte.buffHp += 4;
        }else{
          carte.atk += 2;
          carte.buffAtk += 2;
          carte.hp += 2;
          carte.buffHp += 2;
        }
        carte.auraEffect = true;     
      }     
    },  
  },
  {
    id: 127,
    nom: "La petite famille",
    lvl: 5,
    hp: 10,
    baseHp: 10,
    atk: 2,
    atkDispo: false,
    img: "img/card15.png",
    imgMinia: "img/cardfight15.png",
    imgMiniaProvoc: "img/cardfight15-provoc.png",
    famille: "Les Hierels",
    sousFamille: "Les N",
    texte: "<br><i>Les protecteurs</i> <br><br> gagne <color=red>+2 Hp</color> à chaque fois <br><br> qu'un Hierel est joué. <br><br> doublé si c'est un N",
    provocation: true,
    provocationUse: true,
    upSelf: true,
  },
  {
    id: 128,
    nom: "Tek",
    lvl: 5,
    hp: 6,
    baseHp: 6,
    atk: 3,
    atkDispo: false,
    img: "img/card23.png",
    imgMinia: "img/cardfight23.png",
    famille: "Les Hierels",
    sousFamille: "Les BBEW",
    texte: "<br><i>L'appel des BBEW</i> <br><br><br> Piochez une carte BBEW <br><br> aléatoire",
    piocherCarteSousFamille: true,
  },
  {
    id: 129,
    nom: "Maeva",
    lvl: 6,
    hp: 6,
    baseHp: 6,
    atk: 6,
    atkDispo: false,
    img: "img/card21.png",
    imgMinia: "img/cardfight21.png",
    famille: "Les Hierels",
    sousFamille: "Les Pets",
    texte: "<br><i>L'appel des BBEW</i> <br><br><br> Piochez une carte BBEW <br><br> aléatoire",
    piocherCarteSousFamille: true,
    decomptePioche: 2,
  },
  {
    id: 130,
    nom: "Patrick",
    lvl: 6,
    hp: 5,
    baseHp: 5,
    atk: 6,
    atkDispo: false,
    img: "img/card8.png",
    imgMinia: "img/cardfight8.png",
    famille: "Les Hierels",
    sousFamille: "Les L",
    texte: "<br><i>Effet de couple</i> <br><br> si Patricia est présente il <br><br> gagne <br><br><color=red>+10/+10</color> et furie",
    effetDeCouple: {
      partenaire: "Patricia",
      effetUnique: (carte) => {
        let bonusDoree = 1
        if(carte.estDoree){
            bonusDoree = 2
        }
        carte.atk += 10 * bonusDoree;
        carte.hp += 10 * bonusDoree;
        carte.buffAtk += 10 * bonusDoree;
        carte.buffHp += 10 * bonusDoree;
        carte.furie = true
        carte.furieUse = true        
      },
    },
  },
  {
    id: 131,
    nom: "Jé",
    lvl: 5,
    hp: 5,
    baseHp: 5,
    atk: 5,
    atkDispo: false,
    img: "img/card26.png",
    imgMinia: "img/cardfight26.png",
    famille: "Les Hierels",
    sousFamille : "Les Z",
    texte: "<i>Cri:</i> <br><br> Jé gagne <color=red>+1/+1</color> pour <br><br> chaque Hierel présent sur <br><br> le Board. <color=red>+1/+1</color> supp. pour <br><br> chaque Z présent",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        const lesHierels = cartesBoard.filter(c => c.famille === "Les Hierels" && c.id !== draggedCard.id);
        if (lesHierels.length > 0) {
          draggedCard.atk += lesHierels.length * bonusDoree;
          draggedCard.hp += lesHierels.length * bonusDoree;
          draggedCard.buffAtk += lesHierels.length * bonusDoree;
          draggedCard.buffHp += lesHierels.length * bonusDoree; 
        }
        
        const lesZ = cartesBoard.filter(c => c.sousFamille === "Les Z" && c.id !== draggedCard.id);
        if (lesZ.length > 0) {
          draggedCard.atk += lesZ.length * bonusDoree;
          draggedCard.hp += lesZ.length * bonusDoree;
          draggedCard.buffAtk += lesZ.length * bonusDoree;
          draggedCard.buffHp += lesZ.length * bonusDoree; 
        } 
    },
  },
  {
    id: 132,
    nom: "MamieNel",
    lvl: 6,
    hp: 6,
    baseHp: 6,
    atk: 3,
    atkDispo: false,
    img: "img/card10.png",
    imgMinia: "img/cardfight10.png",
    famille: "Les Hierels",
    sousFamille: "Les N",
    texte: "<br><i>Cri et Début de tour</i> <br><br> Donne <color=red>+1/+1</color><br><br> <color=red>+2/+2</color> si c'est un N",
    aoeCibleApresCombat: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if(carte.famille === "Les Hierels"){
            carte.hp += 2 * bonusDoree;
            carte.buffHp += 2 * bonusDoree;
            carte.animAoE = true; 
          }else{
            carte.hp += 1 * bonusDoree;
            carte.buffHp += 1 * bonusDoree;
            carte.animAoE = true;
          }

        });
    },
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Les Hierels"){
                carte.atk += 2 * bonusDoree;
                carte.buffAtk += 2 * bonusDoree;
                carte.hp += 2 * bonusDoree;
                carte.buffHp +=2 * bonusDoree;
            }
            if(carte.sousFamille === "Les N"){
                carte.atk += 5 * bonusDoree;
                carte.buffAtk +=5 * bonusDoree;
                carte.hp += 5 * bonusDoree;
                carte.buffHp +=5 * bonusDoree;
            }
        });      
    },

  },
  {
    id: 133,
    nom: "Chounette",
    lvl: 6,
    hp: 6,
    baseHp: 6,
    atk: 3,
    atkDispo: false,
    img: "img/card2.png",
    imgMinia: "img/cardfight2.png",
    famille: "Les Hierels",
    sousFamille: "Les BBEW",
    texte: "<br><i> aura</i> <br><br><color=red>+3/+3</color> aux Hierels<br><br> Bonus doublé pour les <br><br> BBEW", 
    aura: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if (carte.famille === "Les Hierels") {
                if(carte.sousFamille === "Les BBEW"){
                    carte.atk += 6 * bonusDoree;
                    carte.buffAtk += 6 * bonusDoree;
                    carte.hp += 6 * bonusDoree;
                    carte.buffHp += 6 * bonusDoree;
                    carte.auraEffect = true;
                }else{
                    carte.atk += 3 * bonusDoree;
                    carte.buffAtk += 3 * bonusDoree;
                    carte.hp += 3 * bonusDoree;
                    carte.buffHp += 3 * bonusDoree;
                    carte.auraEffect = true;
                }  
            } 
        });
    },
    auraSell: (cartesBoard, draggedCard) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
          if (carte.auraEffect === true && carte.famille === "Les Hierels") {
            if(carte.sousFamille === "Les BBEW"){
              carte.atk -= 6 * bonusDoree;
              carte.buffAtk -= 6 * bonusDoree;
              carte.hp -= 6 * bonusDoree;
              carte.buffHp -= 6 * bonusDoree;
            }else{
              carte.atk -= 3 * bonusDoree;
              carte.buffAtk -= 3 * bonusDoree;
              carte.hp -= 3 * bonusDoree;
              carte.buffHp -= 3 * bonusDoree;
            }
            if(carte.buffHp === 0 && carte.buffAtk === 0){
              carte.auraEffect = false
            }        
          }
        }); 
    },
    auraUnique: (carte) => {
      if (carte.famille === "Les Hierels") {
        if(carte.sousFamille === "Les BBEW"){
          carte.atk += 6;
          carte.buffAtk += 6;
          carte.hp += 6;
          carte.buffHp += 6;
        }else{
          carte.atk += 3;
          carte.buffAtk += 3;
          carte.hp += 3;
          carte.buffHp += 3;
        }
        carte.auraEffect = true;     
      }     
    },  
  },
  {
    id: 134,
    nom: "Cedric",
    lvl: 6,
    hp: 5,
    baseHp: 5,
    atk: 5,
    atkDispo: false,
    img: "img/card25.png",
    imgMinia: "img/cardfight25.png",
    famille: "Les Hierels",
    sousFamille: "Les L",
    texte: "<br><i>Effet de couple</i> <br><br> si Aurelie est présente il <br><br> gagne <br><br><color=red>+10/+10</color> et Degats adj.",
    effetDeCouple: {
      partenaire: "Aurelie",
      effetUnique: (carte) => {
          let bonusDoree = 1
          if(carte.estDoree){
              bonusDoree = 2
          }
          carte.atk += 10 * bonusDoree;
          carte.hp += 10 * bonusDoree;
          carte.buffAtk += 10 * bonusDoree;
          carte.buffHp += 10 * bonusDoree;
          carte.degatsAdj = true
        
      },
    },
  },
  {
    id: 135,
    nom: "Lila",
    lvl: 7,
    hp: 2,
    baseHp: 2,
    atk: 2,
    atkDispo: false,
    img: "img/card14.1.png",
    imgMinia: "img/cardfight14.1.png",
    famille: "Les Hierels",
    sousFamille: "Les L",
    texte: "<br><i>Renforcement du maitre</i> <br><br><br> Donne <color=red>+2/+2</color> à Rayan",
    criDeGuerre: ({cartesBoard, draggedCard}) => {
        let bonusDoree = 1
        if(draggedCard.estDoree){
            bonusDoree = 2
        }
        cartesBoard.forEach(carte => {
            if(carte.famille === "Les Hierels"){
                carte.atk += 1 * bonusDoree;
                carte.buffAtk +=1 * bonusDoree;
                carte.hp += 1 * bonusDoree;
                carte.buffHp +=1 * bonusDoree;
            }
            if(carte.nom === "Rayan"){
                carte.atk += 1 * bonusDoree;
                carte.buffAtk +=1 * bonusDoree;
                carte.hp += 1 * bonusDoree;
                carte.buffHp +=1 * bonusDoree;
            }
        });      
    }, 
  },
  {
    id: 136,
    nom: "Boost",
    lvl: 1,
    hp: "",
    baseHp: "",
    atk: "",
    atkDispo: false,
    img: "img/card153.png",
    imgMinia: "img/cardfight153.png",
    famille: "Sort",
    texte: "<br><i>Boost</i> <br><br><br> Donne <color=red>+1/+2</color> aux <br><br> cartes du comptoir.",
    lancerSort: (setter, gold, board, shop, setterDeck, deck, setterShop) => {
      shop.forEach(card => {
        card.atk += 1;
        card.buffAtk +=1;
        card.hp +=2;
        card.buffHp +=2;
      })
    }
  },
  {
    id: 137,
    nom: "Jackpot",
    lvl: 2,
    hp: "",
    baseHp: "",
    atk: "",
    atkDispo: false,
    img: "img/card154.png",
    imgMinia: "img/cardfight154.png",
    famille: "Sort",
    texte: "<br><i>Jackpot</i><br><br><br><br>Vous gagnez <color=gold> 2 </color> pièces d'or.",
    lancerSort: (setter, gold) => {
      setter(gold + 2)
    }
  },
  {
    id: 138,
    nom: "Bague étincelante",
    lvl: 3,
    hp: "",
    baseHp: "",
    atk: "",
    atkDispo: false,
    img: "img/card155.png",
    imgMinia: "img/cardfight155.png",
    famille: "Sort",
    texte: "<br><i>Bague étincelante</i> <br><br><br> Donne <color=red>+1/+1</color> au Board.",
    lancerSort: (setter, gold, board) => {
      if(board.length > 0){
        board.forEach(card => {
          card.atk += 1;
          card.buffAtk += 1;
          card.hp += 1;
          card.buffHp += 1;
        })
      }

    }
  },
  {
    id: 139,
    nom: "Coup de foudre divin",
    lvl: 3,
    hp: "",
    baseHp: "",
    atk: "",
    atkDispo: false,
    img: "img/card156.png",
    imgMinia: "img/cardfight156.png",
    famille: "Sort",
    texte: "<br><i>Coup de foudre divin</i> <br><br><br> Donne <color=red>+3/+3</color> à votre serviteur <br><br> le plus à gauche",
    lancerSort: (setter, gold, board) => {
      if(board.length > 0){
        board[0].atk += 3;
        board[0].buffAtk += 3;
        board[0].hp += 3;
        board[0].buffHp += 3;
      }

    }
  },

  {
    id: 140,
    nom: "Écuyer du Crépuscule",
    lvl: 1,
    hp: 2,
    baseHp: 2,
    atk: 2,
    atkDispo: false,
    img: "img/card200.png",
    imgMinia: "img/cardfight200.png",
    famille: "Les Ombrecendre",
    sousFamille: "Humain",
    texte: "",
    transformation: true
  },

  {
    id: 141,
    nom: "Écuyer du Crépuscule Réprouvé",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 2,
    atkDispo: false,
    img: "img/card200.1.png",
    imgMinia: "img/cardfight200.1.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 142,
    nom: "Fossoyeur du Royaume",
    lvl: 1,
    hp: 3,
    baseHp: 3,
    atk: 1,
    atkDispo: false,
    img: "img/card201.png",
    imgMinia: "img/cardfight201.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 143,
    nom: "Chevalier Loyal",
    lvl: 2,
    hp: 2,
    baseHp: 2,
    atk: 3,
    atkDispo: false,
    img: "img/card202.png",
    imgMinia: "img/cardfight202.png",
    famille: "Les Ombrecendre",
    sousFamille: "Humain",
    texte: "", 
  },

  {
    id: 143,
    nom: "Chevalier Loyal Réprouvé",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 2,
    atkDispo: false,
    img: "img/card202.1.png",
    imgMinia: "img/cardfight202.1.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 144,
    nom: "Apprenti Nécromancien",
    lvl: 2,
    hp: 4,
    baseHp: 4,
    atk: 2,
    atkDispo: false,
    img: "img/card203.png",
    imgMinia: "img/cardfight203.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 145,
    nom: "Guetteur du Sépulcre",
    lvl: 2,
    hp: 3,
    baseHp: 3,
    atk: 3,
    atkDispo: false,
    img: "img/card204.png",
    imgMinia: "img/cardfight204.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 146,
    nom: "Guerrier Spectral",
    lvl: 3,
    hp: 3,
    baseHp: 3,
    atk: 4,
    atkDispo: false,
    img: "img/card205.png",
    imgMinia: "img/cardfight205.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 147,
    nom: "Prêtresse de l'Aube",
    lvl: 3,
    hp: 5,
    baseHp: 5,
    atk: 2,
    atkDispo: false,
    img: "img/card206.png",
    imgMinia: "img/cardfight206.png",
    famille: "Les Ombrecendre",
    sousFamille: "Humain",
    texte: "", 
  },

  {
    id: 148,
    nom: "Prêtresse de l'Aube Réprouvé",
    lvl: 7,
    hp: 2,
    baseHp: 2,
    atk: 3,
    atkDispo: false,
    img: "img/card206.1.png",
    imgMinia: "img/cardfight206.1.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 149,
    nom: "Mage Exorciste",
    lvl: 3,
    hp: 4,
    baseHp: 4,
    atk: 3,
    atkDispo: false,
    img: "img/card207.png",
    imgMinia: "img/cardfight207.png",
    famille: "Les Ombrecendre",
    sousFamille: "Humain",
    texte: "", 
  },

  {
    id: 150,
    nom: "Mage Exorciste Réprouvé",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 3,
    atkDispo: false,
    img: "img/card207.1.png",
    imgMinia: "img/cardfight207.1.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 151,
    nom: "Sentinelle du Tombeau",
    lvl: 3,
    hp: 4,
    baseHp: 4,
    atk: 2,
    atkDispo: false,
    img: "img/card208.png",
    imgMinia: "img/cardfight208.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 152,
    nom: "Ermite des Âmes",
    lvl: 3,
    hp: 2,
    baseHp: 2,
    atk: 4,
    atkDispo: false,
    img: "img/card209.png",
    imgMinia: "img/cardfight209.png",
    famille: "Les Ombrecendre",
    sousFamille: "Humain",
    texte: "", 
  },

  {
    id: 153,
    nom: "Ermite des Âmes Réprouvé",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 4,
    atkDispo: false,
    img: "img/card209.1.png",
    imgMinia: "img/cardfight209.1.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 154,
    nom: "Prince Alaric",
    lvl: 4,
    hp: 5,
    baseHp: 5,
    atk: 5,
    atkDispo: false,
    img: "img/card210.png",
    imgMinia: "img/cardfight210.png",
    famille: "Les Ombrecendre",
    sousFamille: "Humain",
    texte: "", 
  },

  {
    id: 155,
    nom: "Prince Alaric Réprouvé",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 5,
    atkDispo: false,
    img: "img/card210.1.png",
    imgMinia: "img/cardfight210.1.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 156,
    nom: "Gardien des Tombes",
    lvl: 4,
    hp: 7,
    baseHp: 7,
    atk: 3,
    atkDispo: false,
    img: "img/card211.png",
    imgMinia: "img/cardfight211.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 157,
    nom: "Capitaine de la Garde Maudite",
    lvl: 4,
    hp: 4,
    baseHp: 4,
    atk: 5,
    atkDispo: false,
    img: "img/card212.png",
    imgMinia: "img/cardfight212.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 158,
    nom: "Oracle de la Lumière",
    lvl: 4,
    hp: 5,
    baseHp: 5,
    atk: 3,
    atkDispo: false,
    img: "img/card213.png",
    imgMinia: "img/cardfight213.png",
    famille: "Les Ombrecendre",
    sousFamille: "Humain",
    texte: "", 
  },

  {
    id: 159,
    nom: "Oracle de la Lumière réprouvé",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 3,
    atkDispo: false,
    img: "img/card213.1.png",
    imgMinia: "img/cardfight213.1.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 160,
    nom: "Assassin des Ombres",
    lvl: 4,
    hp: 3,
    baseHp: 3,
    atk: 6,
    atkDispo: false,
    img: "img/card214.png",
    imgMinia: "img/cardfight214.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 161,
    nom: "Archevêque Lazarus",
    lvl: 5,
    hp: 8,
    baseHp: 8,
    atk: 4,
    atkDispo: false,
    img: "img/card215.png",
    imgMinia: "img/cardfight215.png",
    famille: "Les Ombrecendre",
    sousFamille: "Humain",
    texte: "", 
  },

  {
    id: 162,
    nom: "Archevêque Lazarus Réprouvé",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 4,
    atkDispo: false,
    img: "img/card215.1.png",
    imgMinia: "img/cardfight215.1.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 163,
    nom: "Commandant de l'Abîme",
    lvl: 5,
    hp: 6,
    baseHp: 6,
    atk: 6,
    atkDispo: false,
    img: "img/card216.png",
    imgMinia: "img/cardfight216.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 164,
    nom: "Championne des Cendres",
    lvl: 5,
    hp: 5,
    baseHp: 5,
    atk: 7,
    atkDispo: false,
    img: "img/card217.png",
    imgMinia: "img/cardfight217.png",
    famille: "Les Ombrecendre",
    sousFamille: "Humain",
    texte: "", 
  },

  {
    id: 165,
    nom: "Championne des Cendres Réprouvé",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 7,
    atkDispo: false,
    img: "img/card217.1.png",
    imgMinia: "img/cardfight217.1.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 166,
    nom: "Grand Invocateur Mortis",
    lvl: 5,
    hp: 6,
    baseHp: 6,
    atk: 5,
    atkDispo: false,
    img: "img/card218.png",
    imgMinia: "img/cardfight218.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 167,
    nom: "Roi Shinigami",
    lvl: 6,
    hp: 6,
    baseHp: 6,
    atk: 6,
    atkDispo: false,
    img: "img/card219.png",
    imgMinia: "img/cardfight219.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 168,
    nom: "Reine Éléonora",
    lvl: 6,
    hp: 8,
    baseHp: 8,
    atk: 4,
    atkDispo: false,
    img: "img/card220.png",
    imgMinia: "img/cardfight220.png",
    famille: "Les Ombrecendre",
    sousFamille: "Humain",
    texte: "", 
  },

  {
    id: 169,
    nom: "Reine Éléonora Réprouvé",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 4,
    atkDispo: false,
    img: "img/card220.1.png",
    imgMinia: "img/cardfight220.1.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 170,
    nom: "Seigneur des Lamentations",
    lvl: 6,
    hp: 10,
    baseHp: 10,
    atk: 4,
    atkDispo: false,
    img: "img/card221.png",
    imgMinia: "img/cardfight221.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 171,
    nom: "Ange de la Résurrection",
    lvl: 6,
    hp: 7,
    baseHp: 7,
    atk: 3,
    atkDispo: false,
    img: "img/card222.png",
    imgMinia: "img/cardfight222.png",
    famille: "Les Ombrecendre",
    sousFamille: "Humain",
    texte: "", 
  },

  {
    id: 172,
    nom: "Ange Réprouvé",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 3,
    atkDispo: false,
    img: "img/card222.1.png",
    imgMinia: "img/cardfight222.1.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 173,
    nom: "Le Sans-Visage",
    lvl: 6,
    hp: 6,
    baseHp: 6,
    atk: 6,
    atkDispo: false,
    img: "img/card223.png",
    imgMinia: "img/cardfight223.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

  {
    id: 174,
    nom: "Paladin du Dernier Serment",
    lvl: 6,
    hp: 8,
    baseHp: 8,
    atk: 8,
    atkDispo: false,
    img: "img/card224.png",
    imgMinia: "img/cardfight224.png",
    famille: "Les Ombrecendre",
    sousFamille: "Humain",
    texte: "", 
  },

  {
    id: 175,
    nom: "Paladin Réprouvé",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 8,
    atkDispo: false,
    img: "img/card224.1.png",
    imgMinia: "img/cardfight224.1.png",
    famille: "Les Ombrecendre",
    sousFamille: "Réprouvé",
    texte: "", 
  },

]