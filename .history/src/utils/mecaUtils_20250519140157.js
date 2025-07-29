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
            fusionnerCartesIdentiques({
                carteBase: draggedCard,
                deck: deck,
                board: boardPlayer,
                setDeck: setDeck,
                setBoard: setBoardPlayer,
                clone,
                setFusionAnim,
                // setFusionAnimation
              });

        }
        if(draggedCard.piocherCarteSpeApresVente){
            let clone = []
            const carteSpe = cards[draggedCard.carteSpe]
            clone = clonerCarte({ carte: carteSpe, camp: "joueur" });
            setDeck([...deck, clone]);
                fusionnerCartesIdentiques({
                    carteBase: draggedCard,
                    deck: deck,
                    board: boardPlayer,
                    setDeck: setDeck,
                    setBoard: setBoardPlayer,
                    clone,
                    setFusionAnim,
                    // setFusionAnimation
                });

        }
    }
}