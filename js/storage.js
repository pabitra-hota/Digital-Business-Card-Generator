function getCards() {
  const savedCards = localStorage.getItem("cards");

  if (!savedCards) {
    return [];
  }

  return JSON.parse(savedCards);
}

function saveCard(card) {
  const cards = getCards();
  cards.push(card);
  localStorage.setItem("cards", JSON.stringify(cards));
}

function getUserCards(email) {
  return getCards().filter(card => card.userEmail === email);
}
