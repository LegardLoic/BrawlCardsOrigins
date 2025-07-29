import { useNavigate } from "react-router-dom";

export default function Menu() {
  const navigate = useNavigate();

  const startGame = (mode) => {
    navigate("/game", { state: { mode } });
  };

  return (
    <div>
      <h1>Choisissez un mode :</h1>
      <button onClick={() => startGame("ia")}>Jouer contre l'IA</button>
      <button onClick={() => startGame("1v1")}>Jouer en 1v1</button>
    </div>
  );
}
