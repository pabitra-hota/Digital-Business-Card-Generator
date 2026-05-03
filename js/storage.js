function saveCard(card) {
  const user = auth.currentUser;
  if (!user) return;

  return db.collection("cards").add({
    ...card,
    userId: user.uid
  });
}

function getUserCards(callback) {
  const user = auth.currentUser;
  if (!user) return;

  db.collection("cards")
    .where("userId", "==", user.uid)
    .get()
    .then((snapshot) => {
      const cards = [];
      snapshot.forEach(doc => cards.push(doc.data()));
      callback(cards);
    });
}
