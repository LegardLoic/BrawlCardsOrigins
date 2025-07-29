import { clonerCarte, fusionnerCartesIdentiques } from "@/utils/shopUtils";
import { lancerAnimationCriDeGuerreAoE, lancerAnimationCriDeGuerreUnique } from "@/utils/animUtils";
import { cards } from "@/data/cardsData";
import { sleep } from "@/utils/combatUtils1v1";
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
                let newBoardDeck = fusionnerCartesIdentiques({
                    carteBase: draggedCard,
                    deck: nouveauDeck,
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

export function piocherCarteFamille(draggedCard, deck, setDeck, boardPlayer, setBoardPlayer, setFusionAnim){
    if(draggedCard.piocherCarteFamille){
        let clone = []
        const nouveauDeck = deck.filter((c) => c.id !== draggedCard.id);
        const cardsFamilly = cards.filter((c) => c.famille === draggedCard.famille)
        const randomCard = cardsFamilly[Math.floor(Math.random() * cardsFamilly.length)]
        clone = clonerCarte({ carte: randomCard, camp: "joueur" });
        if(draggedCard.nom === "Tornade décuplée"){
            clone.atk += draggedCard.atk
            clone.hp += draggedCard.hp
        }
        setDeck([...nouveauDeck, clone]);
        if(boardPlayer){
            setTimeout(() => {
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
            }, 1500);
        }

          return clone
    }
}
export function piocherCarteApresDecompte( decompteCard, deck, setDeck, boardPlayer, setBoardPlayer, setFusionAnim ){
    if(decompteCard.nom === "Lohan"){
        let piocheDoudou = cards.filter(card => card.sousFamille === "Doudou").filter((c) => c.nom !== decompteCard.nom)
        const randomCard = piocheDoudou[Math.floor(Math.random() * piocheDoudou.length)]
        const clone = clonerCarte({ carte: randomCard, camp: "joueur" });
        setDeck([...deck, clone]);
        setTimeout(() => {
            fusionnerCartesIdentiques({
                carteBase: clone,
                deck: deck,
                board: boardPlayer,
                setDeck: setDeck,
                setBoard: setBoardPlayer,
                clone,
                setFusionAnim,
                // setFusionAnimation
            });
        }, 1500);
    }else if(decompteCard.nom === "Maeva"){
        let piochePets = cards.filter(card => card.sousFamille === "Les Pets").filter((c) => c.nom !== decompteCard.nom)
        const randomCard = piochePets[Math.floor(Math.random() * piochePets.length)]
        
        let clone = clonerCarte({ carte: randomCard, camp: "joueur" });
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
        setDeck([...deck, clone]);
        setTimeout(() => {
            fusionnerCartesIdentiques({
                carteBase: clone,
                deck: deck,
                board: boardPlayer,
                setDeck: setDeck,
                setBoard: setBoardPlayer,
                clone,
                setFusionAnim,
                // setFusionAnimation
            });
        }, 1500);
    }else{
        const randomCardFamilly = cards.filter(card => card.famille === decompteCard.famille)
        const randomCard = randomCardFamilly[Math.floor(Math.random() * randomCardFamilly.length)]
        const clone = clonerCarte({ carte: randomCard, camp: "joueur" });
        setDeck([...deck, clone]);
        setTimeout(() => {
            fusionnerCartesIdentiques({
                carteBase: clone,
                deck: deck,
                board: boardPlayer,
                setDeck: setDeck,
                setBoard: setBoardPlayer,
                clone,
                setFusionAnim,
                // setFusionAnimation
            });
        }, 1500);
    }
    
    
}

export async function verifFureurCeleste(draggedCard, setFureurCeleste, fureurCelesteRef, boardPlayer){
    if (draggedCard.criCeleste) {
        setTimeout(() => {
            lancerAnimationCriDeGuerreAoE(draggedCard.id);
            setFureurCeleste(prev => {
                const newValue = prev + 5;
                fureurCelesteRef.current = newValue;
                console.log("Fureur céleste actualisée :", newValue);
                return newValue;
            }); 
        }, 1000);     
    }
    if (draggedCard.criCeleste2) {
        setTimeout(() => {
            lancerAnimationCriDeGuerreAoE(draggedCard.id);
            setFureurCeleste(prev => {
                const newValue = prev + boardPlayer.length * 2;
                fureurCelesteRef.current = newValue;
                console.log("Fureur céleste actualisée :", newValue);
                return newValue;
            }); 
        }, 1000);   
    }
    if(draggedCard.fureurCeleste3Self){
        if(fureurCelesteRef.current >= 3){
            setTimeout(() => {
                lancerAnimationCriDeGuerreUnique(draggedCard.id, draggedCard.id);
            }, 1000); 
            setTimeout(() => {
                draggedCard.fureurCeleste3Self(draggedCard, fureurCelesteRef.current);
                if(draggedCard.nom === "Brise-Nuées Rekkha" || draggedCard.nom === "Karaa la Frappe-Foudre"){
                    setFureurCeleste(prev => {
                        const newValue = prev - prev;
                        fureurCelesteRef.current = newValue;
                        console.log("Fureur céleste actualisée :", newValue);
                        return newValue;
                    });
                }else{
                    setFureurCeleste(prev => {
                        const newValue = prev - 3;
                        fureurCelesteRef.current = newValue;
                        console.log("Fureur céleste actualisée :", newValue);
                        return newValue;
                    });
                }
            }, 1400);
        }
    }
    if(draggedCard.fureurCeleste3OneRandom){
        if(fureurCelesteRef.current >= 3){
            const boardFiltred = boardPlayer.filter(carte => carte.famille === "Les Sabre-Tempête")
            if(boardFiltred.length > 0){
                const cible = boardFiltred[Math.floor(Math.random() * boardFiltred.length)];
                setTimeout(() => {
                    lancerAnimationCriDeGuerreUnique(draggedCard.id, cible.id);
                }, 1000);
                setTimeout(() => {
                    draggedCard.fureurCeleste3OneRandom(cible, fureurCelesteRef.current, draggedCard);
                    setFureurCeleste(prev => {
                        const newValue = prev - 3;
                        fureurCelesteRef.current = newValue;
                        console.log("Fureur céleste actualisée :", newValue);
                        return newValue;
                    });
                }, 1400);
            }
        }
    }
    if(draggedCard.fureurCeleste3All){
        if(fureurCelesteRef.current >= 3){
            const boardFiltred = boardPlayer.filter(carte => carte.famille === "Les Sabre-Tempête")
            if(boardFiltred.length > 0){
                setTimeout(() => {
                    lancerAnimationCriDeGuerreAoE(draggedCard.id);
                }, 1000); 
                setTimeout(() => {
                    draggedCard.fureurCeleste3All(boardFiltred, fureurCelesteRef.current);
                    setFureurCeleste(prev => {
                        const newValue = prev - 3;
                        fureurCelesteRef.current = newValue;
                        console.log("Fureur céleste actualisée :", newValue);
                        return newValue;
                    });
                }, 1400);
            }
        }
    }
    if(draggedCard.fureurCeleste5All){
        if(fureurCelesteRef.current >= 5){
            const boardFiltred = boardPlayer.filter(carte => carte.famille === "Les Sabre-Tempête")
            if(boardFiltred.length > 0){
                setTimeout(() => {
                    lancerAnimationCriDeGuerreAoE(draggedCard.id);
                }, 1000); 
                setTimeout(() => {
                    draggedCard.fureurCeleste5All(boardFiltred, fureurCelesteRef.current, draggedCard);
                    setFureurCeleste(prev => {
                        const newValue = prev - 5;
                        fureurCelesteRef.current = newValue;
                        console.log("Fureur céleste actualisée :", newValue);
                        return newValue;
                    });
                }, 1400);
            }
        }else if(fureurCelesteRef.current >= 3 && fureurCelesteRef.current < 5){
            const boardFiltred = boardPlayer.filter(carte => carte.famille === "Les Sabre-Tempête")
            if(boardFiltred.length > 0){
                setTimeout(() => {
                    lancerAnimationCriDeGuerreAoE(draggedCard.id);
                }, 1000);    
                setTimeout(() => {
                    draggedCard.fureurCeleste5All(boardFiltred, fureurCelesteRef.current, draggedCard);
                    setFureurCeleste(prev => {
                        const newValue = prev - 3;
                        fureurCelesteRef.current = newValue;
                        console.log("Fureur céleste actualisée :", newValue);
                        return newValue;
                    });
                }, 1400);
            }
        }
    }
    if(draggedCard.fureurCeleste7All){
        if(fureurCelesteRef.current >= 7){
            const boardFiltred = boardPlayer.filter(carte => carte.famille === "Les Sabre-Tempête")
            if(boardFiltred.length > 0){
                setTimeout(() => {
                    lancerAnimationCriDeGuerreAoE(draggedCard.id);
                }, 1000);   
                setTimeout(() => {
                    draggedCard.fureurCeleste7All(boardFiltred, fureurCelesteRef.current, draggedCard);
                    setFureurCeleste(prev => {
                        const newValue = prev - 7;
                        fureurCelesteRef.current = newValue;
                        console.log("Fureur céleste actualisée :", newValue);
                        return newValue;
                    });
                }, 1400);
            }
        }else if(fureurCelesteRef.current >= 5 && fureurCelesteRef.current < 7){
            const boardFiltred = boardPlayer.filter(carte => carte.famille === "Les Sabre-Tempête")
            if(boardFiltred.length > 0){
                setTimeout(() => {
                    lancerAnimationCriDeGuerreAoE(draggedCard.id);
                }, 1000); 
                setTimeout(() => {
                    draggedCard.fureurCeleste7All(boardFiltred, fureurCelesteRef.current, draggedCard);
                    setFureurCeleste(prev => {
                        const newValue = prev - 5;
                        fureurCelesteRef.current = newValue;
                        console.log("Fureur céleste actualisée :", newValue);
                        return newValue;
                    });
                }, 1400);
            }
        }else if(fureurCelesteRef.current >= 3 && fureurCelesteRef.current < 5){
            const boardFiltred = boardPlayer.filter(carte => carte.famille === "Les Sabre-Tempête")
            if(boardFiltred.length > 0){
                setTimeout(() => {
                    lancerAnimationCriDeGuerreAoE(draggedCard.id);
                }, 1000); 
                setTimeout(() => {
                    draggedCard.fureurCeleste7All(boardFiltred, fureurCelesteRef.current, draggedCard);
                    setFureurCeleste(prev => {
                        const newValue = prev - 3;
                        fureurCelesteRef.current = newValue;
                        console.log("Fureur céleste actualisée :", newValue);
                        return newValue;
                    });
                }, 1400);
            }
        }
    }
}
export async function verifFureurCelesteAvantAttaque(attaquant, nomAttaquant, fureurCelesteRef, setFureurCeleste, cartesPlayer, fureurCelesteRefP2, setFureurCelesteP2, cartesPlayer2){
    if(attaquant.criFureurCeleste3SelfFight && nomAttaquant === "joueur" && fureurCelesteRef.current >= 3){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste3SelfFight(attaquant, fureurCelesteRef.current);
      setFureurCeleste(prev => {
        const newValue = prev - 3;
        fureurCelesteRef.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }
    /////
    if(attaquant.criFureurCeleste5SelfFight && nomAttaquant === "joueur" && fureurCelesteRef.current >= 5){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste5SelfFight(attaquant, fureurCelesteRef.current);
      setFureurCeleste(prev => {
        const newValue = prev - 5;
        fureurCelesteRef.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }else if(attaquant.criFureurCeleste5SelfFight && nomAttaquant === "joueur" && fureurCelesteRef.current >= 3 && fureurCelesteRef.current < 5){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste5SelfFight(attaquant, fureurCelesteRef.current);
      setFureurCeleste(prev => {
        const newValue = prev - 3;
        fureurCelesteRef.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }
    //////
    if(attaquant.criFureurCeleste5AllFight && nomAttaquant === "joueur" && fureurCelesteRef.current >= 5){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste5AllFight(cartesPlayer, attaquant, fureurCelesteRef.current);
      setFureurCeleste(prev => {
        const newValue = prev - 5;
        fureurCelesteRef.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }else if(attaquant.criFureurCeleste5AllFight && nomAttaquant === "joueur" && fureurCelesteRef.current >= 3 && fureurCelesteRef.current < 5){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste5AllFight(cartesPlayer, attaquant, fureurCelesteRef.current);
      setFureurCeleste(prev => {
        const newValue = prev - 3;
        fureurCelesteRef.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }
    /////////
    if(attaquant.criFureurCeleste7AllFight && nomAttaquant === "joueur" && fureurCelesteRef.current >= 7){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste7AllFight(cartesPlayer, attaquant, fureurCelesteRef.current);
      setFureurCeleste(prev => {
        const newValue = prev - 7;
        fureurCelesteRef.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }else if(attaquant.criFureurCeleste7AllFight && nomAttaquant === "joueur" && fureurCelesteRef.current >= 5 && fureurCelesteRef.current < 7){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste7AllFight(cartesPlayer, attaquant, fureurCelesteRef.current);
      setFureurCeleste(prev => {
        const newValue = prev - 5;
        fureurCelesteRef.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }else if(attaquant.criFureurCeleste7AllFight && nomAttaquant === "joueur" && fureurCelesteRef.current >= 3 && fureurCelesteRef.current < 5){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste7AllFight(cartesPlayer, attaquant, fureurCelesteRef.current);
      setFureurCeleste(prev => {
        const newValue = prev - 3;
        fureurCelesteRef.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }
    /////////
    if(attaquant.criFureurCeleste3SelfFight && nomAttaquant === "joueur2" && fureurCelesteRefP2.current >= 3){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste3SelfFight(attaquant, fureurCelesteRefP2.current);
      setFureurCelesteP2(prev => {
        const newValue = prev - 3;
        fureurCelesteRefP2.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }
    ///////
    if(attaquant.criFureurCeleste5SelfFight && nomAttaquant === "joueur2" && fureurCelesteRefP2.current >= 5){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste5SelfFight(attaquant, fureurCelesteRefP2.current);
      setFureurCelesteP2(prev => {
        const newValue = prev - 5;
        fureurCelesteRefP2.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }else if(attaquant.criFureurCeleste5SelfFight && nomAttaquant === "joueur2" && fureurCelesteRefP2.current >= 3 && fureurCelesteRefP2.current < 5){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste5SelfFight(attaquant, fureurCelesteRefP2.current);
      setFureurCelesteP2(prev => {
        const newValue = prev - 3;
        fureurCelesteRefP2.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }
    /////////
    if(attaquant.criFureurCeleste5AllFight && nomAttaquant === "joueur2" && fureurCelesteRefP2.current >= 5){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste5AllFight(cartesPlayer2, attaquant, fureurCelesteRefP2.current);
      setFureurCelesteP2(prev => {
        const newValue = prev - 5;
        fureurCelesteRefP2.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }else if(attaquant.criFureurCeleste5AllFight && nomAttaquant === "joueur2" && fureurCelesteRefP2.current >= 3 && fureurCelesteRefP2.current < 5){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste5AllFight(cartesPlayer2, attaquant, fureurCelesteRefP2.current);
      setFureurCelesteP2(prev => {
        const newValue = prev - 3;
        fureurCelesteRefP2.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }
    /////////
    if(attaquant.criFureurCeleste7AllFight && nomAttaquant === "joueur2" && fureurCelesteRefP2.current >= 7){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste7AllFight(cartesPlayer2, attaquant, fureurCelesteRefP2.current);
      setFureurCelesteP2(prev => {
        const newValue = prev - 7;
        fureurCelesteRefP2.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }else if(attaquant.criFureurCeleste7AllFight && nomAttaquant === "joueur2" && fureurCelesteRefP2.current >= 5 && fureurCelesteRefP2.current < 7){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste7AllFight(cartesPlayer2, attaquant, fureurCelesteRefP2.current);
      setFureurCelesteP2(prev => {
        const newValue = prev - 5;
        fureurCelesteRefP2.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }
    else if(attaquant.criFureurCeleste7AllFight && nomAttaquant === "joueur2" && fureurCelesteRefP2.current >= 3 && fureurCelesteRefP2.current < 5){
      await sleep(400);
      lancerAnimationCriDeGuerreUnique(attaquant.id, attaquant.id);
      await sleep(400);

      attaquant.criFureurCeleste7AllFight(cartesPlayer2, attaquant, fureurCelesteRefP2.current);
      setFureurCelesteP2(prev => {
        const newValue = prev - 3;
        fureurCelesteRefP2.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
      await sleep(400);
    }
}
export async function verifFureurCelesteApresAttaque(defenseur, nomDefenseur, setFureurCeleste, fureurCelesteRef, setFureurCelesteP2, fureurCelesteRefP2, cartesPlayer, cartesPlayer2, attaquant, nomAttaquant){
    if(defenseur.touchFureur && nomDefenseur === "joueur"){
      lancerAnimationCriDeGuerreUnique(defenseur.id, defenseur.id);
      await sleep(400);
      setFureurCeleste(prev => {
        const newValue = prev + 2;
        fureurCelesteRef.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
    }
    if(defenseur.touchFureur && nomDefenseur === "joueur2"){
      lancerAnimationCriDeGuerreUnique(defenseur.id, defenseur.id);
      await sleep(400);
      setFureurCelesteP2(prev => {
        const newValue = prev + 2;
        fureurCelesteRefP2.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
    }
    if(defenseur.touchFureur2 && nomDefenseur === "joueur"){
      lancerAnimationCriDeGuerreUnique(defenseur.id, defenseur.id);
      await sleep(400);
      setFureurCeleste(prev => {
        const newValue = prev + 4;
        fureurCelesteRef.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
    }
    if(defenseur.touchFureur2 && nomDefenseur === "joueur2"){
      lancerAnimationCriDeGuerreUnique(defenseur.id, defenseur.id);
      await sleep(400);
      setFureurCelesteP2(prev => {
        const newValue = prev + 4;
        fureurCelesteRefP2.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
    }
    if(defenseur.touchFureur3 && nomDefenseur === "joueur"){
      lancerAnimationCriDeGuerreUnique(defenseur.id, defenseur.id);
      await sleep(400);
      setFureurCeleste(prev => {
        const newValue = prev + 8;
        fureurCelesteRef.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
    }
    if(defenseur.touchFureur3 && nomDefenseur === "joueur2"){
      lancerAnimationCriDeGuerreUnique(defenseur.id, defenseur.id);
      await sleep(400);
      setFureurCelesteP2(prev => {
        const newValue = prev + 8;
        fureurCelesteRefP2.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
    }
    if(defenseur.fureurCeleste3OneRandomDef && nomDefenseur === "joueur"){
      console.log(fureurCelesteRef.current)
      if(fureurCelesteRef.current >= 3){
          const boardFiltred = cartesPlayer.filter(carte => carte.famille === "Les Sabre-Tempête")
          if(boardFiltred.length > 0){
              const cible = boardFiltred[Math.floor(Math.random() * boardFiltred.length)];

                  lancerAnimationCriDeGuerreUnique(defenseur.id, cible.id);
                  await sleep(400);
              
     
                  defenseur.fureurCeleste3OneRandomDef(cible, fureurCelesteRef.current, defenseur);
                  setFureurCeleste(prev => {
                    const newValue = prev - 3;
                    fureurCelesteRef.current = newValue;
                    console.log("Fureur céleste actualisée :", newValue);
                    return newValue;
                  });
                  await sleep(400);
          }
      }
    }
    if(defenseur.fureurCeleste5AllDef && nomDefenseur === "joueur"){
      console.log(fureurCelesteRef.current)
      if(fureurCelesteRef.current >= 5){
          const boardFiltred = cartesPlayer.filter(carte => carte.famille === "Les Sabre-Tempête")
          if(boardFiltred.length > 0){

                  lancerAnimationCriDeGuerreUnique(defenseur.id, defenseur.id);
                  await sleep(400);
              
     
                  defenseur.fureurCeleste5AllDef(cartesPlayer, fureurCelesteRef.current, defenseur);
                  setFureurCeleste(prev => {
                    const newValue = prev - 5;
                    fureurCelesteRef.current = newValue;
                    console.log("Fureur céleste actualisée :", newValue);
                    return newValue;
                  });
                  await sleep(400);
          }
      }else if(fureurCelesteRef.current >= 3 && fureurCelesteRef.current < 5){
        const boardFiltred = cartesPlayer.filter(carte => carte.famille === "Les Sabre-Tempête")
        if(boardFiltred.length > 0){

                lancerAnimationCriDeGuerreUnique(defenseur.id, defenseur.id);
                await sleep(400);
            
   
                defenseur.fureurCeleste5AllDef(cartesPlayer, fureurCelesteRef.current, defenseur);
                setFureurCeleste(prev => {
                  const newValue = prev - 3;
                  fureurCelesteRef.current = newValue;
                  console.log("Fureur céleste actualisée :", newValue);
                  return newValue;
                });
                await sleep(400);
        }
      }
    }
    if(defenseur.fureurCeleste3OneRandomDef && nomDefenseur === "joueur2"){
      console.log(fureurCelesteRefP2.current)
      if(fureurCelesteRefP2.current >= 3){
          const boardFiltred = cartesPlayer2.filter(carte => carte.famille === "Les Sabre-Tempête")
          if(boardFiltred.length > 0){
              const cible = boardFiltred[Math.floor(Math.random() * boardFiltred.length)];

                  lancerAnimationCriDeGuerreUnique(defenseur.id, cible.id);
                  await sleep(400);
              
     
                  defenseur.fureurCeleste3OneRandomDef(cible, fureurCelesteRefP2.current, defenseur);
                  setFureurCelesteP2(prev => {
                    const newValue = prev - 3;
                    fureurCelesteRefP2.current = newValue;
                    console.log("Fureur céleste actualisée :", newValue);
                    return newValue;
                  });
                  await sleep(400);
          }
      }
    }
    if(defenseur.fureurCeleste5AllDef && nomDefenseur === "joueur2"){
      console.log(fureurCelesteRefP2.current)
      if(fureurCelesteRefP2.current >= 5){
          const boardFiltred = cartesPlayer2.filter(carte => carte.famille === "Les Sabre-Tempête")
          if(boardFiltred.length > 0){

                  lancerAnimationCriDeGuerreUnique(defenseur.id, defenseur.id);
                  await sleep(400);
              
     
                  defenseur.fureurCeleste5AllDef(cartesPlayer2, fureurCelesteRefP2.current, defenseur);
                  setFureurCelesteP2(prev => {
                    const newValue = prev - 5;
                    fureurCelesteRefP2.current = newValue;
                    console.log("Fureur céleste actualisée :", newValue);
                    return newValue;
                  });
                  await sleep(400);
          }
      }
      if(fureurCelesteRefP2.current >= 3 && fureurCelesteRefP2.current < 5){
        const boardFiltred = cartesPlayer2.filter(carte => carte.famille === "Les Sabre-Tempête")
        if(boardFiltred.length > 0){

                lancerAnimationCriDeGuerreUnique(defenseur.id, defenseur.id);
                await sleep(400);
            
   
                defenseur.fureurCeleste5AllDef(cartesPlayer2, fureurCelesteRefP2.current, defenseur);
                setFureurCelesteP2(prev => {
                  const newValue = prev - 3;
                  fureurCelesteRefP2.current = newValue;
                  console.log("Fureur céleste actualisée :", newValue);
                  return newValue;
                });
                await sleep(400);
        }
      }
    }

    if(attaquant.hp <= 0 && attaquant.deathFureur && nomAttaquant === "joueur"){
      setFureurCeleste(prev => {
        const newValue = prev + 2;
        fureurCelesteRef.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
    }
    if(defenseur.hp <= 0 && defenseur.deathFureur && nomDefenseur === "joueur"){
      setFureurCeleste(prev => {
        const newValue = prev + 2;
        fureurCelesteRef.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
    }

    if(attaquant.hp <= 0 && attaquant.deathFureur && nomAttaquant === "joueur2"){
      setFureurCelesteP2(prev => {
        const newValue = prev + 2;
        fureurCelesteRefP2.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
    }
    if(defenseur.hp <= 0 && defenseur.deathFureur && nomDefenseur === "joueur2"){
      setFureurCelesteP2(prev => {
        const newValue = prev + 2;
        fureurCelesteRefP2.current = newValue;
        console.log("Fureur céleste actualisée :", newValue);
        return newValue;
      });
    }
}
export function degatsAdj(attaquant, defenseur, cartesPlayer, cartesPlayer2, nomDefenseur, setGriffeEffects) {
    const newEffects = [];
  
    const ajouterEffet = (carte) => {
        const el = document.querySelector(`[data-id='${carte.id}']`);
        const wrapper = document.getElementById("game-wrapper");
      
        if (el && wrapper) {
          const rect = el.getBoundingClientRect();
          const wrapperRect = wrapper.getBoundingClientRect();
      
          const scale =
            parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale")) || 1;
      
          newEffects.push({
            id: carte.id,
            x: (rect.left - wrapperRect.left + rect.width / 2 - 30) * (1 / scale),
            y: (rect.top - wrapperRect.top + rect.height / 2 - 30) * (1 / scale),
          });
        }
    };

    let indexJ1 = 1
    let indexJ2 = 1
    cartesPlayer.forEach(card =>{ 
        card.boardPosition = indexJ1
        card.boardPositionFight = indexJ1
        indexJ1++
    });
    cartesPlayer2.forEach(card =>{ 
        card.boardPosition = indexJ2
        card.boardPositionFight = indexJ2
        indexJ2++
    });

  
    if (nomDefenseur === "joueur2" && cartesPlayer2.length > 1) {
      if (defenseur.boardPosition === 1) {
        if(attaquant.control){
            console.log("coucou")
            ajouterEffet(cartesPlayer[1]);
            cartesPlayer[1].hp -= attaquant.atk
            cartesPlayer[1].degatsRecus = attaquant.atk
        }else{
            console.log("coucou1")
            ajouterEffet(cartesPlayer2[1]);
            cartesPlayer2[1].hp -= attaquant.atk
            cartesPlayer2[1].degatsRecus = attaquant.atk
        }

      } else if (defenseur === cartesPlayer2[cartesPlayer2.length - 1]) {
        if(attaquant.control){
            console.log("coucou2")
            ajouterEffet(cartesPlayer[cartesPlayer.length - 2]);
            cartesPlayer[cartesPlayer.length - 2].hp -= attaquant.atk
            cartesPlayer[cartesPlayer.length - 2].degatsRecus = attaquant.atk
        }else{
            console.log("coucou3")
            ajouterEffet(cartesPlayer2[cartesPlayer2.length - 2]);
            cartesPlayer2[cartesPlayer2.length - 2].hp -= attaquant.atk
            cartesPlayer2[cartesPlayer2.length - 2].degatsRecus = attaquant.atk
        }

        
      } else {
        if(attaquant.control){
            console.log("coucou4")

            
            ajouterEffet(cartesPlayer[defenseur.boardPosition]);
            cartesPlayer[defenseur.boardPosition ].hp -= attaquant.atk
            cartesPlayer[defenseur.boardPosition ].degatsRecus = attaquant.atk
        }else{
            console.log("coucou5")
            ajouterEffet(cartesPlayer2[defenseur.boardPosition - 2]);
            cartesPlayer2[defenseur.boardPosition -2].hp -= attaquant.atk
            cartesPlayer2[defenseur.boardPosition -2].degatsRecus = attaquant.atk
            
            ajouterEffet(cartesPlayer2[defenseur.boardPosition]);
            cartesPlayer2[defenseur.boardPosition ].hp -= attaquant.atk
            cartesPlayer2[defenseur.boardPosition ].degatsRecus = attaquant.atk
        }

        
      }
    }
  
    if (nomDefenseur === "joueur" && cartesPlayer.length > 1) {
        if (defenseur.boardPosition === 1) {
            if(attaquant.control){
                ajouterEffet(cartesPlayer2[1]);
                cartesPlayer2[1].hp -= attaquant.atk
                cartesPlayer2[1].degatsRecus = attaquant.atk
            }else{
                ajouterEffet(cartesPlayer[1]);
                cartesPlayer[1].hp -= attaquant.atk
                cartesPlayer[1].degatsRecus = attaquant.atk
            }

        } else if (defenseur === cartesPlayer[cartesPlayer.length - 1]) {
            if(attaquant.control){
                ajouterEffet(cartesPlayer2[cartesPlayer2.length - 2]);
                cartesPlayer2[cartesPlayer2.length - 2].hp -= attaquant.atk
                cartesPlayer2[cartesPlayer2.length - 2].degatsRecus = attaquant.atk
            }else{
                ajouterEffet(cartesPlayer[cartesPlayer.length - 2]);
                cartesPlayer[cartesPlayer.length - 2].hp -= attaquant.atk
                cartesPlayer[cartesPlayer.length - 2].degatsRecus = attaquant.atk
            }

          
        } else {
            if(attaquant.control){
                ajouterEffet(cartesPlayer2[defenseur.boardPosition]);
                cartesPlayer2[defenseur.boardPosition ].hp -= attaquant.atk
                cartesPlayer2[defenseur.boardPosition ].degatsRecus = attaquant.atk
            }else{
                ajouterEffet(cartesPlayer[defenseur.boardPosition - 2]);
                cartesPlayer[defenseur.boardPosition -2].hp -= attaquant.atk
                cartesPlayer[defenseur.boardPosition -2].degatsRecus = attaquant.atk
                
                ajouterEffet(cartesPlayer[defenseur.boardPosition]);
                cartesPlayer[defenseur.boardPosition ].hp -= attaquant.atk
                cartesPlayer[defenseur.boardPosition ].degatsRecus = attaquant.atk
            }

          
        }
      }
  
    setGriffeEffects((prev) => [...prev, ...newEffects]);
}

export async function oneTicDebutCombat(cartesSource, cartesCible, setProjectileAnim) {
    const resultCibles = [...cartesCible];
    const morts = [];
  
    const lanceurs = cartesSource.filter(carte => carte.oneTicDebutCombat);
  
    for (const lanceur of lanceurs) {
      // 🔁 Cibles vivantes à jour
      let ciblesVivantes = []
      if(lanceur.oneTicCible){
        ciblesVivantes = resultCibles.filter(c => c.hp > 0).sort((a, b) => a.hp - b.hp);
      }else{
        ciblesVivantes = resultCibles.filter(c => c.hp > 0);
      }
      
      if (ciblesVivantes.length === 0) break;
      let cible = [];
      if(lanceur.oneTicCible){
        cible = ciblesVivantes[0];
      }else{
        cible = ciblesVivantes[Math.floor(Math.random() * ciblesVivantes.length)];
      }
      
      const index = resultCibles.findIndex(c => c.id === cible.id);
      if (index === -1) continue; // sécurité
  
      // 💥 Animation avant effet
      await jouerProjectileAvecAttente({ lanceur, cible: resultCibles[index], setProjectileAnim });
  
      // 🧠 Appliquer l'effet directement sur l’objet dans le tableau
      lanceur.oneTicDebutCombat(resultCibles[index], lanceur);
  
      // ✅ Vérifie si la cible est morte après l'effet
      if (resultCibles[index].hp <= 0) {
        morts.push(resultCibles[index]);
      }
  
      await sleep(200);
    }
  
    return {
      cartesCible: resultCibles.filter(c => c.hp > 0),
      morts,
    };
}

async function jouerProjectileAvecAttente({ lanceur, cible, setProjectileAnim }) {
    return new Promise((resolve) => {
        const sourceEl = document.querySelector(`[data-id='${lanceur.id}']`);
        const targetEl = document.querySelector(`[data-id='${cible.id}']`);

        if (sourceEl && targetEl) {
            const sRect = sourceEl.getBoundingClientRect();
            const tRect = targetEl.getBoundingClientRect();
            const projectileId = `${lanceur.id}-${cible.id}-${Date.now()}`;

            console.log("🔥 Lancement animation projectile", projectileId);
            setProjectileAnim({
                id: projectileId,
                startX: sRect.left + sRect.width / 2,
                startY: sRect.top + sRect.height / 2,
                endX: tRect.left + tRect.width / 2,
                endY: tRect.top + tRect.height / 2,
                onEnd: resolve, // très important : on résout quand le projectile est terminé
                imgSrc: lanceur.imgProjectile,
            });
        } else {
            resolve(); // fallback : ne bloque pas le jeu
        }
    });
}
export async function oneTicPendantCombat(carteMourante, carteCible, cartesCible, setProjectileAnim) {
    const resultCibles = [...cartesCible];
    const morts = [];

    const lanceur = carteMourante
    const cible = carteCible

    if (cible.hp > 0){
        // 💥 Animation avant effet
        await jouerProjectileAvecAttente({ lanceur, cible: carteCible, setProjectileAnim });

        // 🧠 Appliquer l'effet directement sur l’objet dans le tableau
        lanceur.oneTicPendantCombat(cible, lanceur);
    }

    // ✅ Vérifie si la cible est morte après l'effet
    if (cible.hp <= 0) {
        morts.push(cible);
        await sleep(200);
    }

    return {
    cartesCible: cartesCible.filter(c => c.hp > 0),
    morts,
    };
}
export async function aoeCibleApresCombat(cartesPlayer) {
    [...cartesPlayer].forEach(carte => {
      if (carte.aoeCibleApresCombat) {
        carte.aoeCibleApresCombat(cartesPlayer, carte);
      }
    });
    const cartesPlayerFiltered = cartesPlayer.filter(c => c.hp > 0);
  
    return {
      cartesPlayer: cartesPlayerFiltered,
    };
}
export async function aoeCible(cartesPlayer, cartesPlayer2) {
    [...cartesPlayer].forEach(carte => {
      if (carte.aoeCible) {
        carte.aoeCible(cartesPlayer2, carte);
      }
    });
    [...cartesPlayer2].forEach(carte => {
        if (carte.aoeCible) {
          carte.aoeCible(cartesPlayer, carte);
        }
    });
  
    const mortsPlayer = cartesPlayer.filter(c => c.hp <= 0);
    const mortsPlayer2 = cartesPlayer2.filter(c => c.hp <= 0);
  
    const cartesPlayerFiltered = cartesPlayer.filter(c => c.hp > 0);
    const cartesPlayer2Filtered = cartesPlayer2.filter(c => c.hp > 0);
  
    return {
      cartesPlayer: cartesPlayerFiltered,
      cartesPlayer2: cartesPlayer2Filtered,
      mortsPlayer,
      mortsPlayer2
    };
}
export async function verifElemOnDrag(draggedCard, boardPlayer, setBoardPlayer, shopCards, bonusHpElem, bonusAtkElem, setBonusHpElem, sourceType, targetType, deck, setDeck){
                //ELEMENTAIRES
            //si pose Board
            if (sourceType === "deck" && targetType === "board-drop" && draggedCard.criDeGuerreTaverne && boardPlayer.length <7 && draggedCard.nom !== "Oleiflamme flamboyant") {
      
                console.log(`📢 Cri de guerre activé pour ${draggedCard.nom}`);
            
                draggedCard.criDeGuerreTaverne(shopCards, draggedCard, bonusHpElem, bonusAtkElem); // Effet sur tout le board

            }
            if (sourceType === "deck" && targetType === "board-drop" && boardPlayer.length <7 ) {
                if(draggedCard.famille === "Elementaire"){
                    boardPlayer.forEach(carte =>{
                        if(carte.upSelf && carte.nom === "Roche en fusion"){
                            if(carte.estDoree){
                                carte.hp += 1 * 2 + bonusHpElem
                            }else{
                                carte.hp += 1 + bonusHpElem
                            }
                        }
                    })
                }
            }
            if (sourceType === "deck" && targetType === "board-drop") {
                if(draggedCard.famille === "Elementaire" && draggedCard.magnetisme){
                    boardPlayer.some(carte =>{
                        if(carte.famille === "Elementaire"){
                            carte.atk += draggedCard.atk + bonusAtkElem
                            carte.hp += draggedCard.hp + bonusHpElem
                            setBoardPlayer([...boardPlayer]);
                            return true;
                            
                        }
                    })
                }
            }
            

            if (sourceType === "deck" && targetType === "board-drop" && boardPlayer.length <7 &&  draggedCard.famille === "Elementaire") {
                    let elemDeFete = boardPlayer.findIndex(carte => carte.nom === "Elementaire de fête")
                    let eruptionDeMana = boardPlayer.findIndex(carte => carte.nom === "Eruption de mana déchainée")
                    if (elemDeFete >= 0){
                        let newBoard = boardPlayer.filter(carte => carte.nom !== "Elementaire de fête").filter(carte => carte.famille === "Elementaire")
                        let elemDeFeteDoree = boardPlayer.filter(carte => carte.nom === "Elementaire de fête" && carte.estDoree === true)
                        if(elemDeFeteDoree){
                            if(newBoard.length > 0){
                                let cible = newBoard[Math.floor(Math.random() * newBoard.length)];
                                cible.atk += 2 * 2 + bonusAtkElem
                                cible.hp += 1 * 2 + bonusHpElem
                            }
                        }else{
                            if(newBoard.length > 0){
                                let cible = newBoard[Math.floor(Math.random() * newBoard.length)];
                                cible.atk += 2 + bonusAtkElem
                                cible.hp += 1 + bonusHpElem
                            }
                        }
                        
                    }
                    if(eruptionDeMana >=0){
                        let newBoard = boardPlayer.filter(carte => carte.nom !== "Eruption de mana déchainée").filter(carte => carte.famille === "Elementaire")
                        let eruptionDeManaDoree = boardPlayer.filter(carte => carte.nom === "Eruption de mana déchainée" && carte.estDoree === true)
                        if(eruptionDeManaDoree){
                            if(newBoard.length > 0){
                                let cible = newBoard[Math.floor(Math.random() * newBoard.length)];
                                cible.atk += 1 * 2 + bonusAtkElem
                                cible.hp += 1 * 2 + bonusHpElem

                                let cible1 = newBoard[Math.floor(Math.random() * newBoard.length)];
                                cible1.atk += 1 * 2 + bonusAtkElem
                                cible1.hp += 1 * 2 + bonusHpElem

                                let cible2 = newBoard[Math.floor(Math.random() * newBoard.length)];
                                cible2.atk += 1 * 2 + bonusAtkElem
                                cible2.hp += 1 * 2 + bonusHpElem
                            }
                        }else{
                            if(newBoard.length > 0){
                                let cible = newBoard[Math.floor(Math.random() * newBoard.length)];
                                cible.atk += 1 + bonusAtkElem
                                cible.hp += 1 + bonusHpElem

                                let cible1 = newBoard[Math.floor(Math.random() * newBoard.length)];
                                cible1.atk += 1 + bonusAtkElem
                                cible1.hp += 1 + bonusHpElem

                                let cible2 = newBoard[Math.floor(Math.random() * newBoard.length)];
                                cible2.atk += 1 + bonusAtkElem
                                cible2.hp += 1 + bonusHpElem
                            }
                        }
                        
                    }
            }
            if (sourceType === "deck" && targetType === "board-drop" && boardPlayer.length <7 && draggedCard.nom === "Tourbillon de sable") {
                if(draggedCard.estDoree){
                    setBonusHpElem(bonusHpElem + 1 * 2)
                }else{
                    setBonusHpElem(bonusHpElem + 1)
                }
                
                console.log(bonusHpElem)

            }
            //Si vente
            if(sourceType === "board" && targetType === "header"){
                if(draggedCard.famille === "Elementaire"){
                    boardPlayer.forEach(carte => {
                        if(carte.upSelf && carte.nom === "Fracasseur de météorites"){
                            if(carte.estDoree){
                                carte.atk += 2 * 2 + bonusAtkElem
                                carte.hp += 2 * 2 + bonusHpElem
                            }else{
                                carte.atk += 2 + bonusAtkElem
                                carte.hp += 2 + bonusHpElem
                            }
                            
                        }
                    })
                }
                if(draggedCard.nom === "Tornade décuplée"){
                    draggedCard.piocherCarteFamille = true
                    piocherCarteFamille(draggedCard, deck, setDeck, boardPlayer, setBoardPlayer, setFusionAnim)
                }
            }
            //FIN ELEMENTAIRES
}

export async function verifHierelsOnDrag(sourceType, targetType, draggedCard, boardPlayer){
    
    //les Hierels
            //si pose Board
            if (sourceType === "deck" && targetType === "board-drop" && boardPlayer.length <7 && draggedCard.famille === "Les Hierels" ) {
                
                boardPlayer.forEach(carte =>{
                    if(carte.upSelf && carte.nom === "Gio & Toto"){
                        
                        if(carte.estDoree){
                            carte.hp += 1 * 2
                            carte.atk += 1 * 2
                            carte.buffHp += 1 * 2
                            carte.buffAtk += 1 * 2
                        }else{
                            carte.hp += 1
                            carte.atk += 1
                            carte.buffHp += 1
                            carte.buffAtk += 1
                        }
                    }
                    if(carte.upSelf && carte.nom === "La petite famille"){
                        if(carte.estDoree){
                            if(carte.sousFamille === "Les N"){
                               carte.hp += 4 * 2
                                carte.buffHp += 4 * 2 
                            }else{
                               carte.hp += 2 * 2
                                carte.buffHp += 2 * 2 
                            }
                        }else{
                            if(carte.sousFamille === "Les N"){
                                carte.hp += 4
                                carte.buffHp += 4
                            }else{
                                carte.hp += 2
                                carte.buffHp += 2
                            } 
                        }
                    }
                    if(carte.upSelf && carte.nom === "Thomux"){
                        if(carte.estDoree){
                            carte.hp += 1 * 2
                            carte.atk += 1 * 2
                            carte.buffHp += 1 * 2
                            carte.buffAtk += 1 * 2
                        }else{
                            carte.hp += 1
                            carte.atk += 1
                            carte.buffHp += 1
                            carte.buffAtk += 1
                        }
                    }
                })   
            }
}
export function appliquerEffetDeCouple(carteAjoutee, cartesBoard, cartesEffetDeCoupleApplique ) {
        if (!carteAjoutee.effetDeCouple || cartesEffetDeCoupleApplique.has(carteAjoutee.id)) {
            return; // ✅ Si la carte n'a pas d'effet de couple ou a déjà appliqué l'effet, on ne fait rien
        }
      
        let partenaireTrouve = cartesBoard.find(c => c.nom === carteAjoutee.effetDeCouple.partenaire);
      
        if (partenaireTrouve) {
            console.log(`💑 Effet de couple activé pour ${carteAjoutee.nom} (partenaire : ${partenaireTrouve.nom})`);
      
            // 🆕 Appliquer l'effet UNIQUEMENT à la carte posée, pas à toutes
            if (carteAjoutee.effetDeCouple.effet){
                carteAjoutee.effetDeCouple.effet(cartesBoard);
            }
            if (carteAjoutee.effetDeCouple.effetUnique){
                carteAjoutee.effetDeCouple.effetUnique(carteAjoutee);
            }
            
      
            // 🔒 Marquer la carte comme ayant déjà appliqué son effet
            cartesEffetDeCoupleApplique.add(carteAjoutee.id);
        }
};

export function bivalence(sourceType, targetType, draggedCard, boardPlayer){
  //Comptage du board
  let futurBoard = [...boardPlayer];
  if (sourceType === "deck" && targetType === "board-drop") {
    futurBoard = [...boardPlayer, draggedCard]; // simulation du board après pose
  } else if (sourceType === "board" && targetType === "header") {
    futurBoard = boardPlayer.filter(c => c !== draggedCard); // simulation du board après vente
  }

  const nbCrocNoirMarin = futurBoard.filter(
    (c) => c.famille === "Croc-Noir" && c.sousFamille === "Marin"
  ).length;

  const nbCrocNoirTerrestre = futurBoard.filter(
    (c) => c.famille === "Croc-Noir" && c.sousFamille === "Terrestre"
  ).length;

  console.log("terre", nbCrocNoirTerrestre, "mer",  nbCrocNoirMarin)

  // Si board vide
  if (sourceType === "deck" 
    && targetType === "board-drop" 
    && draggedCard.sousFamille === "Marin" 
    && boardPlayer.length <7 
    && nbCrocNoirMarin === 0 
    && nbCrocNoirTerrestre === 0
  ){
      draggedCard.bivalenceMarinEffect = true
  }
  if (sourceType === "deck" 
    && targetType === "board-drop" 
    && draggedCard.sousFamille === "Terrestre" 
    && boardPlayer.length <7 
    && nbCrocNoirMarin === 0 
    && nbCrocNoirTerrestre === 0
  ){
      draggedCard.bivalenceTerrestreEffect = true
  }
  // Si Majorité
  if (sourceType === "deck" 
    && targetType === "board-drop" 
    && draggedCard.famille === "Croc-Noir" 
    && boardPlayer.length <7 
    && nbCrocNoirMarin < nbCrocNoirTerrestre
  ){
      draggedCard.bivalenceMarinEffect = false
      futurBoard.forEach((carte) => {
        if(carte.famille === "Croc-Noir"){
          carte.bivalenceTerrestreEffect = true
          carte.bivalenceMarinEffect = false
        }
      })
  }
  if (sourceType === "deck" 
    && targetType === "board-drop" 
    && draggedCard.famille === "Croc-Noir" 
    && boardPlayer.length <7 
    && nbCrocNoirMarin > nbCrocNoirTerrestre
  ){
      draggedCard.bivalenceMarinEffect = true
      futurBoard.forEach((carte) => {
        if(carte.famille === "Croc-Noir"){
          carte.bivalenceTerrestreEffect = false
          carte.bivalenceMarinEffect = true
        }
      })
  }
  // Si Egalité
  if (sourceType === "deck" 
    && targetType === "board-drop" 
    && draggedCard.famille === "Croc-Noir" 
    && boardPlayer.length <7 
    && nbCrocNoirMarin === nbCrocNoirTerrestre
  ){
      draggedCard.bivalenceMarinEffect = true
      draggedCard.bivalenceTerrestreEffect = true
      futurBoard.forEach((carte) => {
        if(carte.famille === "Croc-Noir"){
          carte.bivalenceTerrestreEffect = true
          carte.bivalenceMarinEffect = true
        }
      })
  }
  //vente
  if (sourceType === "board" 
    && targetType === "header" 
    && draggedCard.famille === "Croc-Noir" 
    && nbCrocNoirMarin < nbCrocNoirTerrestre
  ){
    boardPlayer.forEach((carte) => {
      if(carte.famille === "Croc-Noir"){
        carte.bivalenceTerrestreEffect = true
        carte.bivalenceMarinEffect = false
      }
    })
  }
  if (sourceType === "board" 
    && targetType === "header" 
    && draggedCard.famille === "Croc-Noir" 
    && nbCrocNoirMarin > nbCrocNoirTerrestre
  ){
    boardPlayer.forEach((carte) => {
      if(carte.famille === "Croc-Noir"){
        carte.bivalenceTerrestreEffect = false
        carte.bivalenceMarinEffect = true
      }
    })
  }
  if (sourceType === "board" 
    && targetType === "header" 
    && draggedCard.famille === "Croc-Noir" 
    && nbCrocNoirMarin === nbCrocNoirTerrestre
  ){
    boardPlayer.forEach((carte) => {
      if(carte.famille === "Croc-Noir"){
        carte.bivalenceTerrestreEffect = true
        carte.bivalenceMarinEffect = true
      }
    })
  }
  
}