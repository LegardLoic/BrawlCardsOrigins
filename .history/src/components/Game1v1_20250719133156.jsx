import GameLayout1v1 from "./GameLayout1v1";
import { useNavigate } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import AlertModal from "./AlertModal";
import { useState, useEffect, useRef } from "react";
import DropZone from "./DropZone";
import ShopHUD from "./ShopHUD";
import ShopBoard from "./ShopBoard";
import PlayerBoard from "./PlayerBoard";
import PlayerDeck from "./PlayerDeck";
import { coutLvlTaverne, actualiserBoutique, lvlUpTaverne, coutLvlTavernePlayer2, getCartesPourShop, getCartesAleatoires, getNombreCartesShop, getCartesSortsPourShop, getNombreCartesSortsShop, clonerCarte, jouerCarteDepuisDeck, acheterCarte, addBoardPosition, vendreCarteDuBoard, fusionnerCartesIdentiques} from "@/utils/shopUtils";
import PlayerHUD from "./PlayerHUD";
import CardPreview from "./CardPreview";
import SynergyHUD from "./SynergyHUD";
import SynergyHUDP2 from "./SynergyHUDP2";
import SynergyHUDFight from "./SynergyHUDFight";
import Player2HUD from "./Player2HUD";
import Player2HUDFight from "./Player2HUDFight";
import Player2BoardFight from "./Player2BoardFight";
import Player2Board from "./Player2Board";
import MusicControl from "./MusicControl";
import Player2Deck from "./Player2Deck";
import PlayerBoardFight from "./PlayerBoardFight";
import { deroulerCombat1v1 } from "@/utils/combatUtils1v1";
import { lancerAnimationCriDeGuerreAoE, lancerAnimationCriDeGuerreUnique } from "@/utils/animUtils";
import { piocherCarte, verifEffetDebutTour, verifFureurCeleste, verifElemOnDrag, verifHierelsOnDrag, bivalence, appliquerEffetDeCouple } from "@/utils/mecaUtils";
import ProjectileImage from "./ProjectileImage";
import { setSoundEffectVolume } from "@/utils/soundUtils";


export default function Game1v1(){
    let cartesEffetDeCoupleApplique = new Set();
    const [popupMessage, setPopupMessage] = useState(null);
    const [phase, setPhase] = useState("shopPlayer1");
    const [previewCard, setPreviewCard] = useState(null);
    const [carteAttaquantId, setCarteAttaquantId] = useState(null);
    const [carteDefenseurId, setCarteDefenseurId] = useState(null);
    const [actualPlayer, setActualPlayer] = useState(1);
    const [fusionAnim, setFusionAnim] = useState(null);
    const [fureurCeleste, setFureurCeleste] = useState(0);
    const [fureurCelesteP2, setFureurCelesteP2] = useState(0);
    const fureurCelesteRef = useRef(fureurCeleste);
    const fureurCelesteRefP2 = useRef(fureurCelesteP2);
    const [projectileAnim, setProjectileAnim] = useState(null);
    const [animAoEVisuelle, setAnimAoEVisuelle] = useState(false);
    const [griffeEffects, setGriffeEffects] = useState([]);
    const [volume, setVolume] = useState(0.4); // Valeur par défaut
    const [muted, setMuted] = useState(false)
    const [soundVolume, setSoundVolume] = useState(1); // volume effets sonores
    
    const shopMusicRef = useRef(new Audio("sounds/ambiance.mp3"));
    const combatMusicRef = useRef(new Audio("sounds/combat.mp3"));
    const fadeInterval = useRef(null);
    const navigate = useNavigate();
    const [bonusHpElem, setBonusHpElem] = useState(0);
    const [bonusAtkElem, setBonusAtkElem] = useState(0);

    //joueur 1
    const [lvlTaverne, setLvlTaverne] = useState(1);
    const [deck, setDeck] = useState([]);
    const [gold, setGold] = useState(100);
    const [maxGold, setmaxGold] = useState(10);
    const [playerPv, setplayerPv] = useState(50);
    const [boardPlayer, setBoardPlayer] = useState([]);
    const [boardCombat, setBoardCombat] = useState([]);
    const [goldTour1, setgoldTour1] = useState(3);

    //joueur2
    const [deckPlayer2, setDeckPlayer2] = useState([]);
    const [lvlTavernePlayer2, setLvlTavernePlayer2] = useState(1);
    const [goldPlayer2, setGoldPlayer2] = useState(100);
    const [maxGoldPlayer2, setmaxGoldPlayer2] = useState(10);
    const [player2Pv, setplayer2Pv] = useState(50);
    const [boardPlayer2, setBoardPlayer2] = useState([]);
    const [boardCombatPlayer2, setBoardCombatPlayer2] = useState([]);

    let [shopCards, setShopCards] = useState(() => {
        if (actualPlayer === 1){
            const tirage = getCartesPourShop(lvlTaverne);
            const cartesAleatoires = getCartesAleatoires(tirage, getNombreCartesShop(lvlTaverne));
            const tirageSorts = getCartesSortsPourShop(lvlTaverne);
            const Sorts = getCartesAleatoires(tirageSorts, getNombreCartesSortsShop(lvlTaverne)).map(carte => clonerCarte({ carte, camp: "shop" }));;
            const cartesEtSorts = []
            cartesAleatoires.forEach(carte =>{
                cartesEtSorts.push(carte)
            })
            Sorts.forEach(carte =>{
                cartesEtSorts.push(carte)
            })
            return cartesEtSorts.map(carte => clonerCarte({ carte, camp: "joueur" }));
        }
        if (actualPlayer === 2){
            const tirage = getCartesPourShop(lvlTavernePlayer2);
            const cartesAleatoires = getCartesAleatoires(tirage, getNombreCartesShop(lvlTavernePlayer2));
            return cartesAleatoires.map(carte => clonerCarte({ carte, camp: "joueur" }));
        }

    });


    const handleDragEnd = (event) => {
        if(actualPlayer === 1){
            const { active, over } = event;
            if (!over) return;

            const [sourceType, sourceId] = active.id.split("-");
            const targetType = over.id;
            const id = parseInt(sourceId);
            console.log("🔥 sourceType:", sourceType, "targetType:", targetType, "over.id:", over.id);

            let draggedCard;
            if (sourceType === "shop") {
              draggedCard = shopCards.find((c) => c.id === id);
            } else if (sourceType === "board") {
              draggedCard = boardPlayer.find((c) => c.id === id);
            } else if (sourceType === "deck") {
              draggedCard = deck.find((c) => c.id === id);
            }
          
            if (!draggedCard) return;

            if (sourceType === "board" && targetType.startsWith("board-")) {
                
                const oldIndex = boardPlayer.findIndex((c) => c.id === id);
                const newIndex = boardPlayer.findIndex((c) => c.id === parseInt(over.id.split("-")[1]));
                boardPlayer[oldIndex].boardPosition = newIndex + 1
                boardPlayer[newIndex].boardPosition = oldIndex + 1
                console.log(boardPlayer[oldIndex].boardPosition,boardPlayer[newIndex].boardPosition)
                console.log("🔁 reorder from", oldIndex, "to", newIndex);
                if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                    const newBoard = arrayMove(boardPlayer, oldIndex, newIndex);
                    setBoardPlayer(newBoard);
                    return;
                }
            }
            if (sourceType === "deck" && targetType === "board-drop" && draggedCard.effetDeCouple && boardPlayer.length <7){
                appliquerEffetDeCouple(draggedCard, boardPlayer, cartesEffetDeCoupleApplique)
            }
            verifElemOnDrag(draggedCard, boardPlayer, setBoardPlayer, shopCards, bonusHpElem, bonusAtkElem, setBonusHpElem, sourceType, targetType)
            if (sourceType === "deck" && targetType === "board-drop") {
                if(draggedCard.famille === "Sort"){
                    draggedCard.lancerSort(setGold, gold, boardPlayer, shopCards, setDeck, deck, setShopCards, maxGold, setmaxGold)
                }
            }
            if (sourceType === "deck" && targetType === "board-drop" && draggedCard.famille === "Sort"){
                jouerCarteDepuisDeck(draggedCard, boardPlayer, setDeck, deck, addBoardPosition, setBoardPlayer, setPopupMessage);
            }
            
            if (sourceType === "shop" && targetType === "footer" && deck.length < 7){
                acheterCarte(
                    draggedCard,
                    gold,
                    setGold,
                    deck,
                    setDeck,
                    shopCards,
                    setShopCards,
                    setPopupMessage
                );
                const futurDeck = [...deck, draggedCard];
                fusionnerCartesIdentiques({
                    carteBase: draggedCard,
                    deck: futurDeck,
                    board: boardPlayer,
                    setDeck: setDeck,
                    setBoard: setBoardPlayer,
                    setFusionAnim,
                });
            }else if (sourceType === "deck" && targetType === "board-drop" && boardPlayer.length < 7){
                jouerCarteDepuisDeck(draggedCard, boardPlayer, setDeck, deck, addBoardPosition, setBoardPlayer, setPopupMessage);
                if (draggedCard.criDeGuerre) {
                    if(draggedCard.criDeGuerreCible){
                        let boardFiltred =  boardPlayer.filter(card => card.famille === draggedCard.famille);
                        if(boardFiltred.length > 0){
                            let carte = boardFiltred[Math.floor(Math.random() * boardFiltred.length)];
                            setTimeout(() => {
                                const targetId = boardPlayer.find(c => c.nom === carte.nom)?.id;
                                lancerAnimationCriDeGuerreUnique(draggedCard.id, targetId);
                            }, 1000);

                            setTimeout(() => {
                                draggedCard.criDeGuerre({cartesBoard: boardPlayer, draggedCard, shopCards, bonusHpElem, bonusAtkElem, carte});
                                setBoardPlayer([...boardPlayer, draggedCard]);
                            }, 1400);
                        }     
                    }else if(draggedCard.criDeGuerreSelf){
                        setTimeout(() => {
                            const targetId = draggedCard.id
                            lancerAnimationCriDeGuerreUnique(draggedCard.id, targetId);
                        }, 1000);

                        setTimeout(() => {
                            draggedCard.criDeGuerre({cartesBoard: boardPlayer, draggedCard, shopCards, bonusHpElem, bonusAtkElem});
                            setBoardPlayer([...boardPlayer, draggedCard]);
                        }, 1400);
                    }else{
                        setTimeout(() => {
                            lancerAnimationCriDeGuerreAoE(draggedCard.id);
                        }, 1000);

                        setTimeout(() => {
                            draggedCard.criDeGuerre({cartesBoard: boardPlayer, draggedCard, shopCards, bonusHpElem, bonusAtkElem});
                            setBoardPlayer([...boardPlayer, draggedCard]);
                        }, 1400);
                    }
                     
                    
                }
                if(draggedCard.aura){
                        setTimeout(() => {
                            lancerAnimationCriDeGuerreAoE(draggedCard.id);
                        }, 1000);
                        
                        setTimeout(() => {
                            draggedCard.aura(boardPlayer, draggedCard)
                            setBoardPlayer([...boardPlayer, draggedCard]);
                        }, 1200);
                }
                verifFureurCeleste(draggedCard, setFureurCeleste, fureurCelesteRef, boardPlayer, deck, setDeck)
                verifHierelsOnDrag(sourceType, targetType, draggedCard, boardPlayer)
                if(draggedCard.piocherCarte || draggedCard.piocherCarteSpe || draggedCard.piocherCarteInf || draggedCard.piocherCarteSousFamille) {
                    setTimeout(() => {
                        lancerAnimationCriDeGuerreAoE(draggedCard.id);
                    }, 1000);
                    setTimeout(() => {
                        piocherCarte( sourceType, targetType, draggedCard, deck, setDeck, boardPlayer, setBoardPlayer, setFusionAnim)
                    }, 1400);
                }
            }else if (sourceType === "board" && targetType === "header"){
                vendreCarteDuBoard(draggedCard, boardPlayer, setBoardPlayer, setGold, gold);
                if(draggedCard.piocherCarteApresVente || draggedCard.piocherCarteSpeApresVente){
                    piocherCarte( sourceType, targetType, draggedCard, deck, setDeck, boardPlayer, setBoardPlayer, setFusionAnim)
                }
                if(draggedCard.evanescence){
                    draggedCard.evanescence(boardPlayer, draggedCard)
                }
                if(draggedCard.auraSell){
                    draggedCard.auraSell(boardPlayer, draggedCard)
                }
                
            }
            if (sourceType === "deck" && targetType === "board-drop"  && boardPlayer.length <7){
                let auraPresent = boardPlayer.findIndex(carte => carte.aura)        
                if (auraPresent >= 0){                   
                    let carteAura = boardPlayer.filter(card => card.aura);
                    carteAura.forEach(carte =>{
                        carte.auraUnique(draggedCard)
                    })
                }
            }
            if(sourceType === "deck" && targetType === "board-drop"  && boardPlayer.length <7){
                    bivalence(sourceType, targetType, draggedCard, boardPlayer)
            }
            if(sourceType === "board" && targetType === "header"){
                    bivalence(sourceType, targetType, draggedCard, boardPlayer)
            }
            


        }
        if(actualPlayer === 2){
            const { active, over } = event;
            if (!over) return;

            const [sourceType, sourceId] = active.id.split("-");
            const targetType = over.id;
            const id = parseInt(sourceId);

            let draggedCard;
            if (sourceType === "shop") {
              draggedCard = shopCards.find((c) => c.id === id);
            } else if (sourceType === "board") {
              draggedCard = boardPlayer2.find((c) => c.id === id);
            } else if (sourceType === "deck") {
              draggedCard = deckPlayer2.find((c) => c.id === id);
            }
          
            if (!draggedCard) return;

            if (sourceType === "board" && targetType.startsWith("board-")) {
                
                const oldIndex = boardPlayer2.findIndex((c) => c.id === id);
                const newIndex = boardPlayer2.findIndex((c) => c.id === parseInt(over.id.split("-")[1]));
                boardPlayer2[oldIndex].boardPosition = newIndex + 1
                boardPlayer2[newIndex].boardPosition = oldIndex + 1

                console.log("🔁 reorder from", oldIndex, "to", newIndex);
                if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                    const newBoard = arrayMove(boardPlayer2, oldIndex, newIndex);
                    setBoardPlayer2(newBoard);
                    return;
                }
            }
            if (sourceType === "deck" && targetType === "board-drop" && draggedCard.effetDeCouple && boardPlayer2.length <7){
                appliquerEffetDeCouple(draggedCard, boardPlayer2, cartesEffetDeCoupleApplique)
            }
            
            verifElemOnDrag(draggedCard, boardPlayer2, setBoardPlayer2, shopCards, bonusHpElem, bonusAtkElem, setBonusHpElem, sourceType, targetType)
            if (sourceType === "deck" && targetType === "board-drop") {
                if(draggedCard.famille === "Sort"){
                    draggedCard.lancerSort(setGoldPlayer2, goldPlayer2, boardPlayer2, shopCards, setDeckPlayer2, deckPlayer2, setShopCards, maxGoldPlayer2, setmaxGoldPlayer2)
                }
            }
            if (sourceType === "deck" && targetType === "board-drop" && draggedCard.famille === "Sort"){
                jouerCarteDepuisDeck(draggedCard, boardPlayer2, setDeckPlayer2, deckPlayer2, addBoardPosition, setBoardPlayer2, setPopupMessage);
            }

            if (sourceType === "shop" && targetType === "footer" && deckPlayer2.length < 7){
                acheterCarte(
                    draggedCard,
                    goldPlayer2,
                    setGoldPlayer2,
                    deckPlayer2,
                    setDeckPlayer2,
                    shopCards,
                    setShopCards,
                    setPopupMessage
                );
                const futurDeck = [...deckPlayer2, draggedCard];
                fusionnerCartesIdentiques({
                  carteBase: draggedCard,
                  deck: futurDeck,
                  board: boardPlayer2,
                  setDeck: setDeckPlayer2,
                  setBoard: setBoardPlayer2,
                  setFusionAnim,
                });
            }else if (sourceType === "deck" && targetType === "board-drop" && boardPlayer2.length < 7){
                jouerCarteDepuisDeck(draggedCard, boardPlayer2, setDeckPlayer2, deckPlayer2, addBoardPosition, setBoardPlayer2, setPopupMessage);
                if (draggedCard.criDeGuerre) {
                    if(draggedCard.criDeGuerreCible){
                        let boardFiltred =  boardPlayer2.filter(card => card.famille === draggedCard.famille);
                        if(boardFiltred.length > 0){
                            let carte = boardFiltred[Math.floor(Math.random() * boardFiltred.length)];
                            setTimeout(() => {
                                const targetId = boardPlayer2.find(c => c.nom === carte.nom)?.id;
                                lancerAnimationCriDeGuerreUnique(draggedCard.id, targetId);
                            }, 1000);

                            setTimeout(() => {
                                draggedCard.criDeGuerre({cartesBoard: boardPlayer2, draggedCard, shopCards, bonusHpElem, bonusAtkElem, carte});
                                setBoardPlayer2([...boardPlayer2, draggedCard]);
                            }, 1400);
                        }     
                    }else if(draggedCard.criDeGuerreSelf){
                        setTimeout(() => {
                            const targetId = draggedCard.id
                            lancerAnimationCriDeGuerreUnique(draggedCard.id, targetId);
                        }, 1000);

                        setTimeout(() => {
                            draggedCard.criDeGuerre({cartesBoard: boardPlayer2, draggedCard, shopCards, bonusHpElem, bonusAtkElem});
                            setBoardPlayer2([...boardPlayer2, draggedCard]);
                        }, 1400);
                    }else{
                        setTimeout(() => {
                            lancerAnimationCriDeGuerreAoE(draggedCard.id);
                        }, 1000);

                        setTimeout(() => {
                            draggedCard.criDeGuerre({cartesBoard: boardPlayer2, draggedCard, shopCards, bonusHpElem, bonusAtkElem});
                            setBoardPlayer2([...boardPlayer2, draggedCard]);
                        }, 1400);
                    }  
                    
                }
                if(draggedCard.aura){
                        setTimeout(() => {
                            lancerAnimationCriDeGuerreAoE(draggedCard.id);
                        }, 1000);
                        
                        setTimeout(() => {
                            draggedCard.aura(boardPlayer2, draggedCard)
                            setBoardPlayer2([...boardPlayer2, draggedCard]);
                        }, 1200);
                }
                verifHierelsOnDrag(sourceType, targetType, draggedCard, boardPlayer2, deckPlayer2, setDeckPlayer2)
                verifFureurCeleste(draggedCard, setFureurCelesteP2, fureurCelesteRefP2, boardPlayer2)
                if(draggedCard.piocherCarte || draggedCard.piocherCarteSpe || draggedCard.piocherCarteInf || draggedCard.piocherCarteSousFamille) {
                    setTimeout(() => {
                        lancerAnimationCriDeGuerreAoE(draggedCard.id);
                    }, 1000);
                    setTimeout(() => {
                        piocherCarte( sourceType, targetType, draggedCard, deckPlayer2, setDeckPlayer2, boardPlayer2, setBoardPlayer2, setFusionAnim)
                    }, 1400);
                }
            }else if (sourceType === "board" && targetType === "header"){
                vendreCarteDuBoard(draggedCard, boardPlayer2, setBoardPlayer2, setGoldPlayer2, goldPlayer2);
                if(draggedCard.piocherCarteApresVente || draggedCard.piocherCarteSpeApresVente){
                    piocherCarte( sourceType, targetType, draggedCard, deckPlayer2, setDeckPlayer2, boardPlayer2, setBoardPlayer2, setFusionAnim)
                }
                if(draggedCard.evanescence){
                    draggedCard.evanescence(boardPlayer2, draggedCard)
                }
                if(draggedCard.auraSell){
                    draggedCard.auraSell(boardPlayer2, draggedCard)
                }
            }
            if (sourceType === "deck" && targetType === "board-drop"  && boardPlayer2.length <7){
                let auraPresent = boardPlayer2.findIndex(carte => carte.aura)        
                if (auraPresent >= 0){                   
                    let carteAura = boardPlayer2.filter(card => card.aura);
                    carteAura.forEach(carte =>{
                        carte.auraUnique(draggedCard)
                    })
                }
            }
        }
    }


    useEffect(() => {
        const shopMusic = shopMusicRef.current;
        const combatMusic = combatMusicRef.current;
  
        shopMusic.loop = true;
        combatMusic.loop = true;
  
        const fadeOut = (audio, callback) => {
            clearInterval(fadeInterval.current);
            fadeInterval.current = setInterval(() => {
              if (audio.volume > 0) {
                audio.volume = Math.max(audio.volume - 0.05, 0);
              } else {
                audio.pause();
                clearInterval(fadeInterval.current);
                if (callback) callback(); // 💡 appelle le callback ici
              }
            }, 100);
        };
          
        const fadeIn = (audio) => {
            clearInterval(fadeInterval.current);
            audio.volume = 0;
            audio.play();
            fadeInterval.current = setInterval(() => {
              if (audio.volume < (muted ? 0 : volume)) {
                audio.volume = Math.min(audio.volume + 0.04, volume);
              } else {
                clearInterval(fadeInterval.current);
              }
            }, 100);
        };
  
    if (phase === "combat") {
      // 💥 transition rapide vers combat
      fadeOut(shopMusic, () => fadeIn(combatMusic, 0.4, 0.05), 0.05);
    } else if (phase === "shopPlayer1" || phase === "shopPlayer2") {
      // 🛑 si shopMusic déjà en cours, ne rien faire
      if (shopMusic.paused) {
        fadeOut(combatMusic, () => fadeIn(shopMusic));
      }
    }
    }, [phase, volume, muted]); // 👈 ajoute les dépendances volume / muted
    useEffect(() => {
        if (fusionAnim) {
          const timer = setTimeout(() => {
            setFusionAnim(null);
          }, 1500);
          return () => clearTimeout(timer);
        }
    }, [fusionAnim]);
    useEffect(() => {
        fureurCelesteRef.current = fureurCeleste;
    }, [fureurCeleste]);
    useEffect(() => {
        fureurCelesteRefP2.current = fureurCelesteP2;
    }, [fureurCelesteP2]);
    useEffect(() => {
        if (griffeEffects.length > 0) {
          const timeout = setTimeout(() => setGriffeEffects([]), 500);
          return () => clearTimeout(timeout);
        }
    }, [griffeEffects]);
    return (
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
            <GameLayout1v1
                AlertModal={
                    <AlertModal
                        message={popupMessage} onClose={() => setPopupMessage(null)}
                    />
                }
                ShopHUD={
                    phase === "shopPlayer1" ? (
                        <DropZone id="header" className="drop-header">
                            <ShopHUD cout={coutLvlTaverne[lvlTaverne]} onRefresh={() => actualiserBoutique( lvlTaverne, setShopCards, gold, setGold, setPopupMessage )} onLvlUp={() => lvlUpTaverne( gold, lvlTaverne, setGold, setLvlTaverne, setShopCards, setPopupMessage, coutLvlTaverne )}/>
                        </DropZone>
                    ) : phase === "shopPlayer2" ? (
                        <DropZone id="header" className="drop-header">
                            <ShopHUD cout={coutLvlTavernePlayer2[lvlTavernePlayer2]} onRefresh={() => actualiserBoutique( lvlTavernePlayer2, setShopCards, goldPlayer2, setGoldPlayer2, setPopupMessage )}onLvlUp={() => lvlUpTaverne( goldPlayer2, lvlTavernePlayer2, setGoldPlayer2, setLvlTavernePlayer2, setShopCards, setPopupMessage, coutLvlTavernePlayer2 )}/>
                        </DropZone>
                    ) : (
                        <Player2HUDFight goldPlayer2 = {goldPlayer2} lvlTavernePlayer2 = {lvlTavernePlayer2} player2Pv = {player2Pv}/>
                    )    
                }
                ShopBoard={
                    phase === "shopPlayer1" || phase === "shopPlayer2" ? (
                        <ShopBoard cards={shopCards} origin="shop" onPreview={setPreviewCard}/>
                    ) : (
                        <Player2BoardFight cards={ boardCombatPlayer2 } origin="board" onPreview={setPreviewCard} phase={phase} carteAttaquantId={carteAttaquantId} carteDefenseurId={carteDefenseurId}/>
                    )
                }
                PlayerBoard={
                    phase === "shopPlayer1" ? (
                        <DropZone id="board-drop" className="drop-bord">
                            <PlayerBoard cards={ boardPlayer } origin="board" onPreview={setPreviewCard} phase={phase} carteAttaquantId={carteAttaquantId} carteDefenseurId={carteDefenseurId}/>
                        </DropZone>
                    ) : phase === "shopPlayer2" ? (
                        <DropZone id="board-drop" className="drop-bord">
                            <Player2Board cards={ boardPlayer2 } origin="board" onPreview={setPreviewCard} phase={phase} carteAttaquantId={carteAttaquantId} carteDefenseurId={carteDefenseurId}/>
                        </DropZone>
                    ) : (
                        <PlayerBoardFight cards={ boardCombat } origin="board" onPreview={setPreviewCard} phase={phase} carteAttaquantId={carteAttaquantId} carteDefenseurId={carteDefenseurId}/>
                    )
                }
                PlayerDeck={
                    phase === "shopPlayer1" ? (
                        <DropZone id="footer" className="drop-footer">
                            <PlayerDeck cards={deck} origin="deck" onPlay={jouerCarteDepuisDeck} onPreview={setPreviewCard}/>
                        </DropZone>
                    ) : phase === "shopPlayer2" ? (
                        <DropZone id="footer" className="drop-footer">
                            <Player2Deck cards={deckPlayer2} origin="deck" onPlay={jouerCarteDepuisDeck} onPreview={setPreviewCard}/>
                        </DropZone>
                    ) : (
                        null
                    )
                }
                PlayerHUD={
                    phase === "shopPlayer1" ? (
                        <>
                            <PlayerHUD gold={gold} lvlTaverne={lvlTaverne} playerPv={playerPv}/> 
                            <button className="btn btn-danger mt-2 phase" 
                                onClick={async () => {
                                    setPhase("shopPlayer2"); 
                                    setActualPlayer(2); 
                                    const tiragePhase = getCartesPourShop(lvlTavernePlayer2); 
                                    const cartesPhase = getCartesAleatoires(tiragePhase, getNombreCartesShop(lvlTavernePlayer2)).map(carte => clonerCarte({ carte, camp: "shop" })); 
                                    const tirageSorts = getCartesSortsPourShop(lvlTavernePlayer2);
                                    const Sorts = getCartesAleatoires(tirageSorts, getNombreCartesSortsShop(lvlTavernePlayer2)).map(carte => clonerCarte({ carte, camp: "shop" }));;
                                    const cartesEtSorts = []
                                    cartesPhase.forEach(carte =>{
                                        cartesEtSorts.push(carte)
                                    })
                                    Sorts.forEach(carte =>{
                                        cartesEtSorts.push(carte)
                                    })
                                    setShopCards(cartesEtSorts); 
                                    await verifEffetDebutTour(
                                        boardPlayer2,
                                        setBoardPlayer2,
                                        deckPlayer2,
                                        setDeckPlayer2,
                                        setFusionAnim,
                                        bonusAtkElem,
                                        bonusHpElem,
                                        setBonusAtkElem,
                                        setBonusHpElem,
                                        shopCards,
                                        setShopCards,
                                        setAnimAoEVisuelle,
                                    );
                                }}
                            >
                                Tour Joueur 2
                            </button>
                        </>
                    ) : phase === "apresCombat" ? (
                        <>
                            <PlayerHUD gold={gold} lvlTaverne={lvlTaverne} playerPv={playerPv}/>
                            <button
                                className="btn btn-success mt-2 phase"
                                onClick={async () => {
                                    const tiragePhase = getCartesPourShop(lvlTaverne);
                                    const cartesPhase = getCartesAleatoires(tiragePhase, getNombreCartesShop(lvlTaverne))
                                        .map(carte => clonerCarte({ carte, camp: "shop" }));
                                    const tirageSorts = getCartesSortsPourShop(lvlTaverne);
                                    const Sorts = getCartesAleatoires(tirageSorts, getNombreCartesSortsShop(lvlTaverne))
                                        .map(carte => clonerCarte({ carte, camp: "shop" }));;
                                    const cartesEtSorts = []
                                    cartesPhase.forEach(carte =>{
                                        cartesEtSorts.push(carte)
                                    })
                                    Sorts.forEach(carte =>{
                                        cartesEtSorts.push(carte)
                                    })
                                    setShopCards(cartesEtSorts);
                                    setActualPlayer(1);
                                    setPhase("shopPlayer1");
                                    await verifEffetDebutTour(
                                        boardPlayer,
                                        setBoardPlayer,
                                        deck,
                                        setDeck,
                                        setFusionAnim,
                                        bonusAtkElem,
                                        bonusHpElem,
                                        setBonusAtkElem,
                                        setBonusHpElem,
                                        shopCards,
                                        setShopCards,
                                        setAnimAoEVisuelle,
                                    );
                                }}
                            >
                                Tour Joueur 1
                            </button>
                        </>
                      ) : phase === "shopPlayer2" ? (
                        <>
                            <Player2HUD goldPlayer2={goldPlayer2} lvlTavernePlayer2={lvlTavernePlayer2} player2Pv={player2Pv}/> 
                            <button 
                                className="btn btn-danger mt-2 phase" 
                                onClick={async () => {
                                    setPhase("combat");
                                    await deroulerCombat1v1({
                                        boardPlayer, boardPlayer2, setBoardCombat, setBoardCombatPlayer2, setBoardPlayer, setBoardPlayer2,  
                                        lvlTaverne, lvlTavernePlayer2, goldTour1, setgoldTour1, setGold, setGoldPlayer2, maxGold, maxGoldPlayer2,
                                        setplayerPv, setplayer2Pv, playerPv, player2Pv,
                                        setPhase, navigate, setPopupMessage, setActualPlayer,
                                        setCarteAttaquantId, setCarteDefenseurId,
                                        setFureurCeleste, setFureurCelesteP2, fureurCelesteRef, fureurCelesteRefP2,
                                        setGriffeEffects, setProjectileAnim, setAnimAoEVisuelle,
                                        setBonusAtkElem, bonusAtkElem
                                    })
                                }}
                            >
                                Fight !!
                            </button>
                        </>
                    ) : (
                        <PlayerHUD gold={gold} lvlTaverne={lvlTaverne} playerPv={playerPv}/>
                    )                                             
                }
                CardPreview={
                    <CardPreview card={previewCard} onClose={() => setPreviewCard(null)} />
                }
                SynergyHUD={
                    phase === "shopPlayer1" ? (
                        <>
                            <SynergyHUD 
                                fureurCeleste={fureurCeleste}
                            />
                        </>

                    ) : phase === "shopPlayer2" ? (
                        <>
                        <SynergyHUDP2 
                            fureurCelesteP2={fureurCelesteP2}
                        />
                    </>
                    ) : <SynergyHUDFight 
                            fureurCeleste={fureurCeleste} fureurCelesteP2={fureurCelesteP2}
                        />
                        
                }
                MusicControl={
                    <MusicControl
                        volume={volume}
                        setVolume={setVolume}
                        muted={muted}
                        setMuted={setMuted}
                        audioRefs={[shopMusicRef, combatMusicRef]}
                        soundVolume={soundVolume}
                        setSoundVolume={setSoundVolume}
                    />
                }
                FusionAnim={
                    fusionAnim && (
                      <div className="fusion-overlay">
                        <div className="fusion-effect animate__animated animate__zoomIn">
                          <img src={fusionAnim.carteResultat.img} alt="Fusion Dorée" />
                          <p className="fusion-text">Fusion en {fusionAnim.carteResultat.nom} !</p>
                        </div>
                      </div>
                    )
                }
                GriffeEffects={
                    griffeEffects.map((effet, index) => (
                        <div
                            key={`${effet.id}-${index}`}
                            className="griffe-effect"
                            style={{ top: `${effet.y}px`, left: `${effet.x}px` }}
                        />
                    ))
                }
                ProjectileAnim={
                    projectileAnim && (
                        <ProjectileImage
                            key={projectileAnim.id}
                            startX={projectileAnim.startX}
                            startY={projectileAnim.startY}
                            endX={projectileAnim.endX}
                            endY={projectileAnim.endY}
                            onEnd={() => {
                            projectileAnim.onEnd?.(); // 👈 ceci résout la promesse
                            setProjectileAnim(null);  // 👈 ceci enlève l’animation de l’écran
                             }}
                            imgSrc={projectileAnim.imgSrc} // 👈 personnalisé
                        />
                    )
                }
                AnimAoeVisuelle={
                    phase === "combat" && animAoEVisuelle && (
                        <div className="aoe-wave" />
                    )
                }
            >
                
            </GameLayout1v1>
        </DndContext>
    )
}