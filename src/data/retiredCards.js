export const retiredCards = [
    {
        id: 9,
        nom: "Tor'Grag des Profondeurs",
        lvl: 7,
        hp: 4,
        baseHp: 4,
        atk: 6,
        atkDispo: false,
        img: "img/card37.png",
        imgMinia: "img/cardfight37.png",
        imgMiniaProvoc: "img/cardfight37-provoc.png",
        famille: "Croc-Noir",
        sousFamille : "Marin",
        texte: "Cri: Tor'Grag gagne +1/+1 pour chaque Croc-Noir présent sur le Board. Bivalence Mer: il gagne furie. Bivalence terre: il gagne provoc.",
        provocation: true,
        provocationUse: false,
        furie: true,
        furieUse: false,
        effetDeMass: (carte, board) => {
            const crocNoir = board.filter(c => c.famille === "Croc-Noir" && c.id !== carte.id);
            if (crocNoir.length > 0) {
            carte.atk += crocNoir.length;
            carte.hp += crocNoir.length; 
            carte.buffAtk += crocNoir.length;
            carte.buffHp += crocNoir.length;
            }     
        },
    },

    {
        id: 13,
        nom: "Gor’Tul le Fendeur d’Écailles",
        lvl: 7,
        hp: 5,
        baseHp: 5,
        atk: 4,
        atkDispo: false,
        img: "img/card41.png",
        imgMinia: "img/cardfight41.png",
        imgProjectile: "img/projectile.png",
        famille: "Croc-Noir",
        sousFamille : "Marin",
        texte: "Début de combat: inflige 3 dégats à une cible aléatoire. Bivalence mer: 3 dégats supp. Bivalence terre: Gor’Tul à +3hp supp.",
        oneTicDebutCombat: (carteCible, carteSource) => {
            if(carteCible.bouclierUse){
                carteCible.hp -= 0;
                carteCible.degatsRecus = 0;
                carteCible.bouclierUse = false
            }else{
                if(carteSource.bivalenceMarinEffect){
                carteCible.hp -= 6;
                }else{
                carteCible.hp -= 3;
                carteSource.hp += 3;
                }
            }  
        },
    },

    {
        id: 20,
        nom: "Ghar'Zûl l'Éclaireur Grondeur",
        lvl: 7,
        hp: 4,
        baseHp: 4,
        atk: 2,
        atkDispo: false,
        img: "img/card48.png",
        imgMinia: "img/cardfight48.png",
        imgProjectile: "img/projectile.png",
        famille: "Croc-Noir",
        sousFamille : "Marin",
        texte: "Debut de Combat: Inflige 2 dégats à une cible aléatoire puis gagne 1hp. Bivalence mer: 1 dégat supp. Bivalence terre: +1 hp supp.",
        oneTicDebutCombat: (carteCible, carteSource) => {
            if(carteCible.bouclierUse){
                carteCible.hp -= 0;
                carteCible.degatsRecus = 0;
                carteCible.bouclierUse = false
            }else{
                if(carteSource.bivalenceMarinEffect){
                carteCible.hp -= 3;
                carteCible.degatsRecus = 3;
                carteSource.hp += 1;
                }else{
                carteCible.hp -= 2;
                carteCible.degatsRecus = 2;
                carteSource.hp += 2;
                carteSource.buffHp += 2;
                }
            }     
        },
    },

    {
        id: 24,
        nom: "Pok'Nar le Poissonneux",
        lvl: 7,
        hp: 3,
        baseHp: 3,
        atk: 1,
        atkDispo: false,
        img: "img/card52.png",
        imgMinia: "img/cardfight52.png",
        famille: "Croc-Noir",
        sousFamille : "Marin",
        texte: "Cri: Invoque 'Le Gluant' 2/2 avec réincarnation. Aura Bivalente mer: Le gluant gagne +1/+1",
        carteSpe: 32,
        piocherCarteSpe: true,
        bivalence: (cartesBoard) => {
            cartesBoard.forEach(carte => {
                if (!carte.bivalenceSources) carte.bivalenceSources = [];
                const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
                const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
            
                if (carte.famille === "Croc-Noir" && carte.sousFamille === "Marin" && carte.nom === "Le gluant") {
                    if (carte.bivalenceMarinEffect && !carte.bivalenceSources.includes("Pok'Nar")) {
                        carte.atk += 1 + bonus;
                        carte.buffAtk += 1 + bonus;
                        carte.buffAtkBivalence += 1 + bonus;
                        carte.hp += 1 + bonus;
                        carte.buffHp += 1 + bonus;
                        carte.buffHpBivalence += 1 + bonus;
                        carte.bivalenceEffect = true;
                        carte.bivalenceSources.push("Pok'Nar");
                    }
                    if (!carte.bivalenceMarinEffect && carte.bivalenceSources.includes("Pok'Nar")) {
                        carte.atk -= 1 + bonus;
                        carte.buffAtk += 1 + bonus;
                        carte.buffAtkBivalence -= 1 + bonus;
                        carte.hp -= 1 + bonus;
                        carte.buffHp -= 1 + bonus;
                        carte.buffHpBivalence -= 1 + bonus;
                        carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Pok'Nar");
                        if(carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0){
                        carte.bivalenceEffect = false;
                        }
                    }
                }
            });
        },
        bivalenceSell: (cartesBoard) => {
            cartesBoard.forEach(carte => {
                if (!carte.bivalenceSources) return;
                const karasha = cartesBoard.find(c => c.nom === "Ka'Rasha la Lieuse d'Esprits");
                const bonus = karasha ? 1 : 0; // Ka'Rasha amplifie
            
                // Si la source est présente dans les effets appliqués
                if (carte.bivalenceSources.includes("Pok'Nar")) {
                    // Retrait des effets appliqués par cette source
                    if (carte.bivalenceMarinEffect && carte.nom === "Le gluant") {
                        carte.atk -= 1 + bonus;
                        carte.buffAtkBivalence -= 1 + bonus;
                    }
                
                    if (carte.bivalenceTerrestreEffect) {
                        carte.hp -= 0;
                        carte.buffHpBivalence -= 0;
                    }
                
                    // Suppression de la source
                    carte.bivalenceSources = carte.bivalenceSources.filter(src => src !== "Pok'Nar");
                
                    // Si plus aucun buff actif, on désactive le flag global
                    if (carte.buffHpBivalence === 0 && carte.buffAtkBivalence === 0) {
                        carte.bivalenceEffect = false;
                    }
                }
            });
        },
    },

    {
        id: 25,
        nom: "Khash la Piquante",
        lvl: 7,
        hp: 3,
        baseHp: 3,
        atk: 3,
        atkDispo: false,
        img: "img/card53.png",
        imgMinia: "img/cardfight53.png",
        imgProjectile: "img/projectile.png",
        famille: "Croc-Noir",
        sousFamille : "Terrestre",
        texte: "Debut de combat: inflige 1 dégat à une cible aléatoire. Bivalence Terre : inflige 1 dégat supplémentaire",
        oneTicDebutCombat: (carteCible, carteSource) => {
            if(carteCible.bouclierUse){
                carteCible.hp -= 0;
                carteCible.degatsRecus = 0;
                carteCible.bouclierUse = false
            }else{
                if(carteSource.bivalenceTerrestreEffect){
                carteCible.hp -= 2;
                carteCible.degatsRecus = 2;
                }else{
                carteCible.hp -= 1;
                carteCible.degatsRecus = 1;
                }
            }  
        },
    },

    {
        id: 26,
        nom: "Grik le Fangeux",
        lvl: 7,
        hp: 2,
        baseHp: 2,
        atk: 2,
        atkDispo: false,
        img: "img/card54.png",
        imgMinia: "img/cardfight54.png",
        famille: "Croc-Noir",
        sousFamille : "Terrestre",
        texte: "Si un Croc-Noir est présent sur le Board, Grik gagne +1 atk",
        effetDeMass: (carte, board) => {
            const crocNoir = board.filter(c => c.famille === "Croc-Noir" && c.id !== carte.id);
            if (crocNoir.length > 0) {
                carte.atk += 1; 
                carte.buffAtk +=1;
            }     
        },
    },

    {
        id: 30,
        nom: "Bag'Kûl le Grogneur",
        lvl: 7,
        hp: 3,
        baseHp: 3,
        atk: 1,
        atkDispo: false,
        img: "img/card58.png",
        imgMinia: "img/cardfight58.png",
        famille: "Croc-Noir",
        sousFamille : "Terrestre",
        texte: "GRUUAAAHHH ! Rien ne ce passe...",
    },

    {
        id: 33,
        nom: "Le gluant",
        lvl: 7,
        hp: 2,
        baseHp: 2,
        atk: 2,
        atkDispo: false,
        img: "img/card61.png",
        imgMinia: "img/cardfight61.png",
        famille: "Croc-Noir",
        sousFamille : "Marin",
        texte: "Reincarnation: revient 1x à la vie avec 1 hp",
        reincarnation: true,
    },

      {
    id: 41,
    nom: "Thalya des Courants Instables",
    lvl: 7,
    hp: 5,
    baseHp: 5,
    atk: 3,
    atkDispo: false,
    img: "img/card69.png",
    imgMinia: "img/cardfight69.png",
    imgMiniaProvoc: "img/cardfight69-provoc.png",
    imgMiniaBouclier: "img/cardfight69-bouclier.png",
    imgProjectile: "img/projectile2.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "Debut de combat: echange l'atk et les pv d'une carte adv aléatoire. Evanescence mort : +4 hp à la Sylphe ayant le moins de pv",
    oneTicDebutCombat: (carteCible, carteSource) => {
      if(carteCible.bouclierUse){
        carteCible.hp -= 0;
        carteCible.degatsRecus = 0;
        carteCible.bouclierUse = false
      }else{
        const hp = carteCible.hp
        const atk = carteCible.atk
        carteCible.hp = atk; 
        carteCible.buffHp = atk; 
        carteCible.atk = hp;
        carteCible.buffAtk = hp;
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
    
      // Choisir une cible aléatoire
      const cible = cibles[0];
    
      // Appliquer les buffs selon la bivalence
      cible.hp += 4;
      cible.buffHp += 4;
      cible.buffHpThalya = (cible.buffHpThalya || 0) + 4;

      cible.thalyaBuffEffect = true; // Pour tracking ou affichage
    },
  },

    {
    id: 52,
    nom: "Vyntha Voix de la Canopée",
    lvl: 7,
    hp: 3,
    baseHp: 3,
    atk: 3,
    atkDispo: false,
    img: "img/card80.png",
    imgMinia: "img/cardfight80.png",
    imgMiniaProvoc: "img/cardfight80-provoc.png",
    imgMiniaBouclier: "img/cardfight80-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "Cri: obtient une Lueur dansante 0/2. Aura: +2/+2 pour l'invocation",
    carteSpe: 64,
    piocherCarteSpe: true,
    aura: (cartesBoard) => {
      cartesBoard.forEach(carte => {
        if (carte.nom === "Lueur dansante") {
          carte.atk += 2;
          carte.buffAtk += 2;
          carte.hp += 2;
          carte.buffHp += 2;
          carte.auraVynthaEffect = true;
        }
      });
    },
    auraUnique: (carte) => {
      if (carte.nom === "Lueur dansante") {
        carte.atk += 2;
        carte.buffAtk += 2;
        carte.hp += 2;
        carte.buffHp += 2;
        carte.auraVynthaEffect = true; 
      }     
    },
    auraSell: (cartesBoard) => {
      cartesBoard.forEach(carte => {
        if (carte.auraVynthaEffect === true && carte.famille === "Les Sylphariels") {
          carte.atk -= 2;
          carte.buffAtk -= 2;
          carte.hp -= 2;
          carte.buffHp -= 2;
          if(carte.buffHp === 0 && carte.buffHp === 0){
            carte.auraVynthaEffect = false
          }        
        }
      });
    },
  },

    {
    id: 56,
    nom: "Silyne des Lueurs Tardives",
    lvl: 7,
    hp: 4,
    baseHp: 4,
    atk: 1,
    atkDispo: false,
    img: "img/card84.png",
    imgMinia: "img/cardfight84.png",
    imgMiniaProvoc: "img/cardfight84-provoc.png",
    imgMiniaBouclier: "img/cardfight84-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "Cri: +1hp aux fées sur le Board. Evanescence: +1hp à 1 fée (vente/mort)",
    criDeGuerre: (cartesBoard) => {
      cartesBoard.forEach(carte => {
        if(carte.famille === "Les Sylphariels"){
          carte.hp += 1;
          carte.buffHp += 1;
        }

      });
    },
    evanescence: (board, card) => {      
      if(board.length > 1 ){
        const copies = board.filter(c => c.id !== card.id).filter(c => c.famille === "Les Sylphariels")
        if(copies.length > 0){
          let random = copies[Math.floor(Math.random() * copies.length)]
          if(random.famille === "Les Sylphariels"){
            random.hp += 1;
            random.buffHp += 1;
          }
          const vessalyn = board.filter(c => c.nom === "Vessalyn, Chuchoteuse d''Ailes")
          const copies1 = copies.filter(c => c.nom !== random.nom)
          if(copies1.length > 0){
            let random1 = copies[Math.floor(Math.random() * copies.length)]
            if(vessalyn.length > 0){
              random1.hp += 1;
              random1.buffHp += 1;
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
      const cible = cibles[Math.floor(Math.random() * cibles.length)];
      cible.hp += 1;
      cible.buffHp += 1;
      cible.buffHpSilyne = (cible.buffHpSilyne || 0) + 1;
      cible.silyneBuffEffect = true; // Pour tracking ou affichage
    },

  },

    {
    id: 60,
    nom: "Fypi la Perdue",
    lvl: 7,
    hp: 3,
    baseHp: 3,
    atk: 1,
    atkDispo: false,
    img: "img/card88.png",
    imgMinia: "img/cardfight88.png",
    imgMiniaProvoc: "img/cardfight88-provoc.png",
    imgMiniaBouclier: "img/cardfight88-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "Evanescence : donne +1 hp à une fée aléatoire (vente et mort)",
    evanescence: (board, card) => {      
      if(board.length > 1 ){
        const copies = board.filter(c => c.id !== card.id).filter(c => c.famille === "Les Sylphariels")
        if(copies.length > 0){
          let random = copies[Math.floor(Math.random() * copies.length)]
          if(random.famille === "Les Sylphariels"){
            random.hp += 1;
            random.buffHp += 1;
          }
          const vessalyn = board.filter(c => c.nom === "Vessalyn, Chuchoteuse d''Ailes")
          const copies1 = copies.filter(c => c.nom !== random.nom)
          if(copies1.length > 0){
            let random1 = copies[Math.floor(Math.random() * copies.length)]
            if(vessalyn.length > 0){
              random1.hp += 1
              random1.buffHp += 1;
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
      const cible = cibles[Math.floor(Math.random() * cibles.length)];
      cible.hp += 1;
      cible.buffHp += 1;
      cible.buffHpFypi = (cible.buffHpFypi || 0) + 1;
      cible.fypiBuffEffect = true; // Pour tracking ou affichage
    },
  },

    {
    id: 63,
    nom: "Clélie l'Oubliée",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 1,
    atkDispo: false,
    img: "img/card91.png",
    imgMinia: "img/cardfight91.png",
    imgMiniaProvoc: "img/cardfight91-provoc.png",
    imgMiniaBouclier: "img/cardfight91-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Dark",
    texte: "Evanescence : ce vend 1po supplémentaire",
    gainOr: 1,
  },

    {
    id: 64,
    nom: "Zilla la Grincheuse",
    lvl: 7,
    hp: 1,
    baseHp: 1,
    atk: 3,
    atkDispo: false,
    img: "img/card92.png",
    imgMinia: "img/cardfight92.png",
    imgMiniaProvoc: "img/cardfight92-provoc.png",
    imgMiniaBouclier: "img/cardfight92-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Dark",
    texte: "Evanescence : donne +1 atk à une fée aléatoire (vente et mort)",
    evanescence: (board, card) => {      
      if(board.length > 1 ){
        const copies = board.filter(c => c.id !== card.id).filter(c => c.famille === "Les Sylphariels") 
        if(copies.length > 0){
          let random = copies[Math.floor(Math.random() * copies.length)]
          if(random.famille === "Les Sylphariels"){
            random.atk += 1;
            random.buffAtk +=1;
          }
          const vessalyn = board.filter(c => c.nom === "Vessalyn, Chuchoteuse d''Ailes")
          const copies1 = copies.filter(c => c.nom !== random.nom)
          if(copies1.length > 0){
            let random1 = copies[Math.floor(Math.random() * copies.length)]
            if(vessalyn.length > 0){
              random1.atk += 1;
              random1.buffAtk +=1;
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
      const cible = cibles[Math.floor(Math.random() * cibles.length)];
      cible.atk += 1;
      cible.buffAtk +=1;
      cible.buffAtkZilla = (cible.buffAtkZilla || 0) + 1;
      cible.zillaBuffEffect = true; // Pour tracking ou affichage
    },
  },

    {
    id: 65,
    nom: "Lueur dansante",
    lvl: 7,
    hp: 2,
    baseHp: 2,
    atk: 0,
    atkDispo: false,
    img: "img/card93.png",
    imgMinia: "img/cardfight93.png",
    imgMiniaProvoc: "img/cardfight93-provoc.png",
    imgMiniaBouclier: "img/cardfight93-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight93-provoc-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "",
    provocation: true,
    provocationUse: true,
  },

    {
    id: 61,
    nom: "Louli des Lanternes",
    lvl: 7,
    hp: 4,
    baseHp: 4,
    atk: 1,
    atkDispo: false,
    img: "img/card89.png",
    imgMinia: "img/cardfight89.png",
    imgMiniaProvoc: "img/cardfight89-provoc.png",
    imgMiniaBouclier: "img/cardfight89-bouclier.png",
    imgMiniaProvocBouclier: "img/cardfight89-provoc-bouclier.png",
    famille: "Les Sylphariels",
    sousFamille : "Light",
    texte: "Evanescence : obtient une Lueur dansante 0/2 avec provocation (vente)",
    carteSpe: 64,
    piocherCarteSpeApresVente: true,
  },
]