export const FlipCard = ({ frontComponent, backComponent, isFlipped }) => {
  return (
    <div className="flip-card">
      <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
        <div className="flip-card-front">{frontComponent}</div>
        <div className="flip-card-back">{backComponent}</div>
      </div>
    </div>
  );
};
