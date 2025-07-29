// CardPreview.jsx
import "@/styles/CardPreview.css";

export default function CardPreview({ card, onClose }) {
  if (!card) return null; // 👈 Si card est null, rien ne s'affiche
  console.log("✅ CardPreview reçoit :", card);
function parseCarteTexte(texte) {
  const elements = [];
  const regex = /(<b>.*?<\/b>|<i>.*?<\/i>|<u>.*?<\/u>|<color=(.*?)>(.*?)<\/color>|<br>)/g;

  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(texte)) !== null) {
    // Texte avant la balise
    if (match.index > lastIndex) {
      elements.push(<span key={key++}>{texte.slice(lastIndex, match.index)}</span>);
    }

    if (match[0].startsWith('<b>')) {
      const content = match[0].replace('<b>', '').replace('</b>', '');
      elements.push(<strong key={key++}>{content}</strong>);
    } else if (match[0].startsWith('<i>')) {
      const content = match[0].replace('<i>', '').replace('</i>', '');
      elements.push(<em key={key++}>{content}</em>);
    } else if (match[0].startsWith('<u>')) {
      const content = match[0].replace('<u>', '').replace('</u>', '');
      elements.push(<u key={key++}>{content}</u>);
    } else if (match[0].startsWith('<color=')) {
      const color = match[2];
      const content = match[3];

      const hasLeadingSpace = content.startsWith(' ');
      const hasTrailingSpace = content.endsWith(' ');

      if (hasLeadingSpace) elements.push(<span key={key++}>{" "}</span>);
      elements.push(
        <span key={key++} style={{ color }}>
          {content.trim()}
        </span>
      );
      if (hasTrailingSpace) elements.push(<span key={key++}>{" "}</span>);
    } else if (match[0] === '<br>') {
      elements.push(<br key={key++} />);
    }

    lastIndex = regex.lastIndex;
  }

  // Texte après la dernière balise
  if (lastIndex < texte.length) {
    elements.push(<span key={key++}>{texte.slice(lastIndex)}</span>);
  }

  return elements;
}


  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-content" onClick={(e) => e.stopPropagation()}>
        <div className="textPreview">
          {parseCarteTexte(card.texte)}
        </div>
        <p className="atkPreview">{card.baseAtk}</p>
        <p className="hpPreview">{card.baseHp}</p>
        <img src={card.img} alt={card.nom} />
      </div>
    </div>
  );
}
