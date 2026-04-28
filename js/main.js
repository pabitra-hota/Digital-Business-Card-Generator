// Redirect users who are not logged in.
function checkSession() {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    window.location.href = "index.html";
  }
}

function showCardMessage(text, isSuccess) {
  const message = document.getElementById("cardMessage");
  message.innerText = text;
  message.className = isSuccess ? "message success" : "message";
}

function createCardHtml(card) {
  return `
    <div class="card-design" style="background:${card.color}">
      <h3>${card.name}</h3>
      <p>${card.email}</p>
    </div>
  `;
}

function generateCard() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const color = document.getElementById("color").value;
  const userEmail = localStorage.getItem("currentUser");

  if (name.length < 2) {
    showCardMessage("Please enter a valid name.", false);
    return;
  }

  if (!validateCardEmail(email)) {
    showCardMessage("Please enter a valid Gmail address.", false);
    return;
  }

  const card = {
    id: Date.now(),
    userEmail,
    name,
    email,
    color,
    timestamp: new Date().toISOString()
  };

  saveCard(card);
  renderCards();
  generateQR(card);
  showCardMessage("Card saved and QR generated.", true);
}

// Live preview
function updatePreview() {
  const name = document.getElementById("name").value.trim() || "Your Name";
  const email = document.getElementById("email").value.trim() || "yourname@gmail.com";
  const color = document.getElementById("color").value;

  document.getElementById("previewName").innerText = name;
  document.getElementById("previewEmail").innerText = email;
  document.getElementById("cardPreview").style.background = color;
}

function validateCardEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (!regex.test(email)) return false;
  if (email.includes("..")) return false;

  const username = email.split("@")[0];
  if (username.length < 3) return false;
  if (!/^[a-zA-Z0-9._%+-]+$/.test(username)) return false;

  return true;
}

// Build a GitHub Pages friendly card URL.
function getCardUrl(card) {
  const encoded = btoa(
    unescape(encodeURIComponent(JSON.stringify(card)))
  );

  const baseURL = window.location.href.replace("dashboard.html", "");
  return `${baseURL}card.html?data=${encoded}`;
}

// QR generation
function generateQR(card) {
  const qrContainer = document.getElementById("qr");
  qrContainer.innerHTML = "";

  const url = getCardUrl(card);

  new QRCode(qrContainer, {
    text: url,
    width: 128,
    height: 128
  });
}

// Render saved cards
function renderCards() {
  const userEmail = localStorage.getItem("currentUser");
  const cards = getUserCards(userEmail);

  const container = document.getElementById("savedCards");
  container.innerHTML = "";

  if (cards.length === 0) {
    container.innerHTML = "<p>No saved cards yet.</p>";
    return;
  }

  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "saved-card";
    div.innerHTML = `
      ${createCardHtml(card)}
      <div id="qr-${card.id}" class="qr-box"></div>
      <button onclick="downloadCard(${card.id})">Download</button>
    `;
    container.appendChild(div);

    new QRCode(document.getElementById(`qr-${card.id}`), {
      text: getCardUrl(card),
      width: 128,
      height: 128
    });
  });
}

// Download
function downloadCard(id) {
  const cardElement = document.querySelector(`#qr-${id}`).previousElementSibling;

  html2canvas(cardElement).then(canvas => {
    const link = document.createElement("a");
    link.download = "card.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

window.onload = function () {
  checkSession();
  updatePreview();
  renderCards();
};
