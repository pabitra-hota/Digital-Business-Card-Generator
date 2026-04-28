function showError(text) {
  document.getElementById("errorMessage").innerText = text;
}

function loadCard() {
  const params = new URLSearchParams(window.location.search);
  const data = params.get("data");

  if (!data) {
    showError("No card data found.");
    return;
  }

  try {
    const card = JSON.parse(
      decodeURIComponent(escape(atob(data)))
    );

    document.getElementById("card").style.background = card.color;
    document.getElementById("name").innerText = card.name;
    document.getElementById("email").innerText = card.email;
  } catch (error) {
    showError("Invalid card data.");
  }
}

window.onload = loadCard;
