import { clonerCarte, fusionnerCartesIdentiques } from "@/utils/shopUtils";
import { cards } from "@/data/cardsData";
export function piocherCarte( sourceType, targetType, draggedCard, deck, setDeck, boardPlayer, setBoardPlayer, setFusionAnim ){
    if (sourceType === "deck" && targetType === "board-drop" && boardPlayer.length <7) {
        const nouveauDeck = deck.filter((c) => c.id !== draggedCard.id);
        const cartesFamille = cards.filter((c) => c.famille === draggedCard.famille);
        const carteRandom = cartesFamille[Math.floor(Math.random() * cartesFamille.length)];
        const cartesSousFamille = cards.filter((c) => c.sousFamille === draggedCard.sousFamille).filter((c) => c.nom !== draggedCard.nom);
        const carteRandomSousFamille = cartesSousFamille[Math.floor(Math.random() * cartesSousFamille.length)];
        
        const cartesInf = cards.filter((c) => c.famille === draggedCard.famille && c.lvl < draggedCard.lvl);
        const carteInfRandom = cartesInf[Math.floor(Math.random() * cartesInf.length)];
        const carteSpe = cards[draggedCard.carteSpe]
        if(draggedCard.piocherCarte){
            const clone = clonerCarte({ carte: carteRandom, camp: "joueur" });
            setDeck([...nouveauDeck, clone]);
                fusionnerCartesIdentiques({
                    carteBase: draggedCard,
                    deck: nouveauDeck,
                    board: boardPlayer,
                    setDeck: setDeck,
                    setBoard: setBoardPlayer,
                    clone,
                    setFusionAnim,
                    // setFusionAnimation
                });
            setBoardPlayer([...boardPlayer, draggedCard])
        }
        if(draggedCard.piocherCarteSpe){
            const clone = clonerCarte({ carte: carteSpe, camp: "joueur" });
            setDeck([...nouveauDeck, clone]);
                fusionnerCartesIdentiques({
                    carteBase: draggedCard,
                    deck: nouveauDeck,
                    board: boardPlayer,
                    setDeck: setDeck,
                    setBoard: setBoardPlayer,
                    clone,
                    setFusionAnim,
                    // setFusionAnimation
                });
            setBoardPlayer([...boardPlayer, draggedCard])


        }
        if(draggedCard.piocherCarteInf){
            const clone = clonerCarte({ carte: carteInfRandom, camp: "joueur" });
            setDeck([...nouveauDeck, clone]);
                fusionnerCartesIdentiques({
                    carteBase: draggedCard,
                    deck: nouveauDeck,
                    board: boardPlayer,
                    setDeck: setDeck,
                    setBoard: setBoardPlayer,
                    clone,
                    setFusionAnim,
                    // setFusionAnimation
            });
            setBoardPlayer([...boardPlayer, draggedCard])
        }
        if(draggedCard.piocherCarteSousFamille){
            
            let clone = clonerCarte({ carte: carteRandomSousFamille, camp: "joueur" });
            if(draggedCard.nom === "Maeva"){
                if(clone.nom === "Maya-Bull"){
                    clone.provocation = true
                    clone.provocationUse = true
                    clone.hp += 10
                    clone.buffHp += 10
                }
                if(clone.nom === "Titi L'aigri"){
                    clone.degatsAdj = true
                    clone.atk += 10
                    clone.buffAtk += 10
                }
            }
            setDeck([...nouveauDeck, clone]);
                fusionnerCartesIdentiques({
                    carteBase: draggedCard,
                    deck: nouveauDeck,
                    board: boardPlayer,
                    setDeck: setDeck,
                    setBoard: setBoardPlayer,
                    clone,
                    setFusionAnim,
                    // setFusionAnimation
            });
            setBoardPlayer([...boardPlayer, draggedCard])
        }
    }
    if (sourceType === "board" && targetType === "header" && deck.length <7){
        if(draggedCard.piocherCarteApresVente){
            let clone = []
            const cartesFamille = cards.filter((c) => c.famille === draggedCard.famille)
            const randomFamille = cartesFamille[Math.floor(Math.random() * cartesFamille.length)]
            clone = clonerCarte({ carte: randomFamille, camp: "joueur" });
            setDeck([...deck, clone]);
            let newBoardDeck = fusionnerCartesIdentiques({
                carteBase: draggedCard,
                deck: deck,
                board: boardPlayer,
                setDeck: setDeck,
                setBoard: setBoardPlayer,
                clone,
                setFusionAnim,
                // setFusionAnimation
            });
            if(newBoardDeck){
                let newBoard = boardPlayer.filter((c)=> c !==draggedCard).filter((c)=> c.nom !== clone.nom)
                setBoardPlayer([...newBoard])
            }

        }
        if(draggedCard.piocherCarteSpeApresVente){
            let clone = []
            const carteSpe = cards[draggedCard.carteSpe]

            clone = clonerCarte({ carte: carteSpe, camp: "joueur" });
            setDeck([...deck, clone]);
            let newBoardDeck = fusionnerCartesIdentiques({
                    carteBase: draggedCard,
                    deck: deck,
                    board: boardPlayer,
                    setDeck: setDeck,
                    setBoard: setBoardPlayer,
                    clone,
                    setFusionAnim,
                    // setFusionAnimation
                });

            console.log(newBoardDeck)  
            if(newBoardDeck){
                let newBoard = boardPlayer.filter((c)=> c !==draggedCard).filter((c)=> c.nom !== clone.nom)
                setBoardPlayer([...newBoard])
            }          
        }
    }
}

export async function verifEffetDebutTour(boardPlayer, setBoardPlayer, deck, setDeck, setFusionAnim, bonusAtkElem, bonusHpElem, setBonusAtkElem, setBonusHpElem, shopCards, setShopCards, setAnimAoEVisuelle){
      // verif si Roche mere bienfaisante
  let carteDecomptePioche = boardPlayer.findIndex(carte => carte.decomptePioche)
  if(carteDecomptePioche >= 0 ){
    boardPlayer.forEach(carte =>{
      if(carte.decomptePioche){
        carte.decomptePioche -= 1
        console.log("decompte avant pioche", carte.decomptePioche)
        if(carte.decomptePioche === 0){
          piocherCarteApresDecompte(carte, deck, setDeck, boardPlayer, setBoardPlayer, setFusionAnim)
          carte.decomptePioche = 2
        }
        setBoardPlayer(boardPlayer);
      }
    })
  }
    // verif si Lokholar
    let verifCartesLokholar = boardPlayer.findIndex(carte => carte.nom === "Lokholar le Forgegivre")
    if(verifCartesLokholar >= 0 ){
        await sleep(1500);
        boardPlayer.forEach(carte =>{
        carte.atk += 2 + bonusAtkElem
        carte.hp += 2 + bonusHpElem
          
      })
      setBoardPlayer([...boardPlayer]);
    }
        // verif si Rejeton
    let verifCartesRejeton = boardPlayer.findIndex(carte => carte.nom === "Rejeton de lumière amplifié")
    if(verifCartesRejeton >= 0 ){
       
      setBonusAtkElem(bonusAtkElem + 1)
      setBonusHpElem(bonusHpElem + 1)
      await sleep(1500);
    }
    console.log(bonusHpElem, bonusAtkElem)
    
    // verif si criDeGuerreApresCombat
    let carteCriDeGuerreTaverne = boardPlayer.findIndex(carte => carte.criDeGuerreTaverne)
    if(carteCriDeGuerreTaverne >= 0 ){

        boardPlayer.forEach(carte =>{
            if(carte.criDeGuerreTaverne && carte.nom === "Oleiflamme flamboyant"){
                carte.criDeGuerreTaverne(shopCards, bonusHpElem, bonusAtkElem)
            }
            if(carte.criDeGuerreTaverne && carte.nom === "Souffle-grange dansant"){
                carte.criDeGuerreTaverne(shopCards, bonusHpElem, bonusAtkElem)
            }
        })
        setShopCards(shopCards)
    }
      // verif si aoeCibleApresCombat

  let aoeCiblePresent1 = boardPlayer.findIndex(carte => carte.aoeCibleApresCombat)

  //aoe//
  if(aoeCiblePresent1 >= 0 ){
    await sleep(1200);
    const aoeCibleResult = await aoeCibleApresCombat(boardPlayer);
    // déclenchement visuel
    setAnimAoEVisuelle(true);
    await sleep(600);
    setAnimAoEVisuelle(false);
    setBoardPlayer([...boardPlayer]);
    boardPlayer.forEach(carte => {
      carte.animAoE = false
    })
    boardPlayer = aoeCibleResult.boardPlayer;
  }
}