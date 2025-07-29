import { useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function MusicControl({
  volume, setVolume,
  muted, setMuted,
  soundVolume, setSoundVolume,
  audioRefs
}) {
  const containerRef = useRef(null);
  const controlsVisible = useRef(false);

  const toggleControls = () => {
    controlsVisible.current = !controlsVisible.current;
    containerRef.current.classList.toggle("show");
  };

  // Appliquer le volume à toutes les musiques
  useEffect(() => {
    audioRefs.forEach(ref => {
      if (ref.current) {
        ref.current.volume = muted ? 0 : volume;
      }
    });
  }, [volume, muted, audioRefs]);

  // Fermer si clic en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        containerRef.current.classList.remove("show");
        controlsVisible.current = false;
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "absolute", top: 20, right: 150, zIndex: 999 }}>
      <div style={{ position: "relative" }}>
        <button
          onClick={toggleControls}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "white"
          }}
        >
          {muted || volume === 0 ? <VolumeX size={28} /> : <Volume2 size={28} />}
        </button>

        <div
          ref={containerRef}
          className="music-controls"
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 10,
            padding: 10,
            background: "rgba(0,0,0,0.7)",
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "fadeIn 0.3s ease-out"
          }}
        >
          <label style={{ color: "white", fontSize: 14, marginBottom: 4 }}>🎵 Musique</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: 100 }}
          />

          <label style={{ color: "white", fontSize: 14, margin: "10px 0 4px" }}>🔊 Effets</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={soundVolume}
            onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
            style={{ width: 100 }}
          />

          <button
            onClick={() => setMuted(!muted)}
            style={{
              marginTop: 10,
              background: "white",
              color: "black",
              border: "none",
              padding: "4px 8px",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>
      </div>
    </div>
  );
}
