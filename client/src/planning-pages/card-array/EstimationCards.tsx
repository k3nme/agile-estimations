import type React from "react";
import { useState } from "react";
import type Card from "../../../../models/Card";

const EstimationCards: React.FC<{ cards: Card[] }> = ({ cards }) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null); // Use string or null for selected card id

  const handleCardClick = (title: string) => {
    setSelectedCardId(title); // Update state with the title of the selected card
  };

  return (
    <div className="flex flex-wrap justify-center items-center">
      {cards.map((card) => (
        <div
          className="w-full sm:w-auto p-2 sm:p-4 mb-4 sm:mb-0"
          key={card.title}
        >
          <div
            className={`card-wrapper border border-black rounded-lg p-4 ${
              selectedCardId === card.title ? "selected" : ""
            }`}
            onClick={() => handleCardClick(card.title)}
            onKeyDown={() => handleCardClick(card.title)}
          >
            <h3>{card.title}</h3>
          </div>
          <div
            className="card-wrapper"
            onClick={() => handleCardClick(card.title)}
            onKeyDown={() => handleCardClick(card.title)}
          />
        </div>
      ))}
    </div>
  );
};

export default EstimationCards;
