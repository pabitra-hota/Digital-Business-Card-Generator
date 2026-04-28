// CardForge dashboard logic. Static only: no backend calls.

var themes = [
  { name: "Dark Gold", bg: "#1a1a2e", accent: "#c9a227" },
  { name: "Midnight", bg: "#0d1117", accent: "#58a6ff" },
  { name: "Forest", bg: "#0b2619", accent: "#4ade80" },
  { name: "Crimson", bg: "#2b0a0a", accent: "#f87171" },
  { name: "Ocean", bg: "#0a1628", accent: "#38bdf8" },
  { name: "Violet", bg: "#1e0a3c", accent: "#a78bfa" },
  { name: "Slate", bg: "#1e293b", accent: "#94a3b8" },
  { name: "Copper", bg: "#1c120a", accent: "#fb923c" }
];

var selectedTheme = themes[0];
var lastGeneratedCard = null;

function checkSession() {
  if (!localStorage.getItem("currentUser")) {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function showNotification(message) {
  var notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(function () {
    notification.classList.remove("show");
  }, 2500);
}

function validateGmail(email) {
  var regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (!regex.test(email)) return false;
  if (email.indexOf("..") !== -1) return false;

  var username = email.split("@")[0];
  if (username.length < 3) return false;
  if (!/^[a-zA-Z0-9._%+-]+$/.test(username)) return false;

  return true;
}

function buildThemePicker() {
  var picker = document.getElementById("themePicker");
  picker.innerHTML = "";

  themes.forEach(function (theme, index) {
    var circle = document.createElement("div");
    circle.className = "theme-circle" + (index === 0 ? " selected" : "");
    circle.style.backgroundColor = theme.accent;
    circle.title = theme.name;

    circle.onclick = function () {
      var circles = document.querySelectorAll(".theme-circle");
      circles.forEach(function (item) {
        item.classList.remove("selected");
      });

      circle.classList.add("selected");
      selectedTheme = theme;
      renderCard();
    };

    picker.appendChild(circle);
  });
}

function getFormCardData() {
  return {
    id: Date.now(),
    userEmail: localStorage.getItem("currentUser"),
    name: document.getElementById("f-name").value.trim(),
    title: document.getElementById("f-title").value.trim(),
    company: document.getElementById("f-company").value.trim(),
    tagline: document.getElementById("f-tagline").value.trim(),
    email: document.getElementById("f-email").value.trim(),
    phone: document.getElementById("f-phone").value.trim(),
    website: document.getElementById("f-website").value.trim(),
    linkedin: document.getElementById("f-linkedin").value.trim(),
    social: document.getElementById("f-social").value.trim(),
    fontStyle: document.getElementById("f-font").value,
    textAlign: document.getElementById("f-layout").value,
    themeName: selectedTheme.name,
    color: selectedTheme.bg,
    accent: selectedTheme.accent,
    timestamp: new Date().toISOString()
  };
}

function safeText(text) {
  var div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function getContactRows(card, useLinks) {
  var rows = "";

  if (card.email) {
    rows += getContactRow("✉", card.email, "mailto:" + card.email, useLinks);
  }
  if (card.phone) {
    rows += getContactRow("☎", card.phone, "tel:" + card.phone, useLinks);
  }
  if (card.website) {
    rows += getContactRow("🌐", card.website, normalUrl(card.website), useLinks);
  }
  if (card.linkedin) {
    rows += getContactRow("🔗", card.linkedin, normalUrl(card.linkedin), useLinks);
  }
  if (card.social) {
    rows += getContactRow("👤", card.social, normalUrl(card.social), useLinks);
  }

  return rows;
}

function getContactRow(icon, text, link, useLinks) {
  if (useLinks) {
    return '<div class="contact-row"><span>' + icon + '</span><a href="' + link + '" target="_blank">' + safeText(text) + "</a></div>";
  }

  return '<div class="contact-row"><span>' + icon + "</span><span>" + safeText(text) + "</span></div>";
}

function normalUrl(value) {
  if (value.indexOf("http://") === 0 || value.indexOf("https://") === 0) {
    return value;
  }

  return "https://" + value;
}

function buildCardHtml(card, useLinks) {
  var title = card.title || "Job Title";
  var company = card.company || "Company";

  return '' +
    '<div class="biz-card" style="background-color:' + card.color + ';font-family:' + card.fontStyle + ';text-align:' + card.textAlign + ';">' +
      '<div>' +
        '<div class="card-name">' + safeText(card.name || "Your Name") + '</div>' +
        '<div class="card-job-title" style="color:' + card.accent + ';">' + safeText(title) + '</div>' +
        '<div class="card-company">' + safeText(company) + '</div>' +
        '<div class="card-tagline">' + safeText(card.tagline) + '</div>' +
      '</div>' +
      '<div class="card-contacts">' + getContactRows(card, useLinks) + '</div>' +
    '</div>';
}

function renderCard() {
  var card = getFormCardData();
  var preview = document.getElementById("bizCard");
  var previewHtml = buildCardHtml({
    name: card.name || "Your Name",
    title: card.title || "Job Title",
    company: card.company || "Company",
    tagline: card.tagline,
    email: card.email,
    phone: card.phone,
    website: card.website,
    linkedin: card.linkedin,
    social: card.social,
    fontStyle: card.fontStyle,
    textAlign: card.textAlign,
    color: card.color,
    accent: card.accent
  }, false);

  preview.outerHTML = previewHtml.replace('<div class="biz-card"', '<div class="biz-card" id="bizCard"');
}

function getCardUrl(card) {
  var encoded = btoa(unescape(encodeURIComponent(JSON.stringify(card))));
  var baseUrl = window.location.href.replace("dashboard.html", "");

  return baseUrl + "card.html?data=" + encoded;
}

function generateCard() {
  var card = getFormCardData();

  if (card.name.length < 2) {
    showNotification("Please enter your full name.");
    return;
  }

  if (!validateGmail(card.email)) {
    showNotification("Please enter a valid Gmail address.");
    return;
  }

  lastGeneratedCard = card;
  saveCard(card);
  renderCards();
  generateQR(card, "qrcode");

  document.getElementById("qr-hint").style.display = "none";
  showNotification("Card saved. QR Code generated for mobile.");
}

function generateQR(card, elementId) {
  var qrDiv = document.getElementById(elementId);
  qrDiv.innerHTML = "";

  new QRCode(qrDiv, {
    text: getCardUrl(card),
    width: 140,
    height: 140,
    colorDark: card.accent,
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
}

function renderCards() {
  var userEmail = localStorage.getItem("currentUser");
  var cards = getUserCards(userEmail);
  var container = document.getElementById("savedCards");

  container.innerHTML = "";

  if (cards.length === 0) {
    container.innerHTML = '<p style="font-size:13px; color:#666;">No saved cards yet.</p>';
    return;
  }

  cards.slice().reverse().forEach(function (card) {
    var wrapper = document.createElement("div");
    wrapper.className = "saved-card";
    wrapper.innerHTML =
      '<div class="saved-card-layout">' +
        '<div id="saved-card-' + card.id + '">' + buildCardHtml(card, false) + '</div>' +
        '<div>' +
          '<div class="saved-qr" id="saved-qr-' + card.id + '"></div>' +
          '<div class="saved-actions">' +
            '<button class="download-btn" onclick="downloadSavedCard(' + card.id + ')">Download Card PNG</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    container.appendChild(wrapper);
    generateQR(card, "saved-qr-" + card.id);
  });
}

function downloadQR() {
  var canvas = document.querySelector("#qrcode canvas");

  if (!canvas || !lastGeneratedCard) {
    showNotification("Please generate a QR code first.");
    return;
  }

  var link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = lastGeneratedCard.name + "-qrcode.png";
  link.click();
}

function downloadSavedCard(id) {
  var cardElement = document.querySelector("#saved-card-" + id + " .biz-card");

  html2canvas(cardElement).then(function (canvas) {
    var link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "card-" + id + ".png";
    link.click();
  });
}

function resetForm() {
  var fields = ["f-name", "f-title", "f-company", "f-tagline", "f-email", "f-phone", "f-website", "f-linkedin", "f-social"];

  fields.forEach(function (fieldId) {
    document.getElementById(fieldId).value = "";
  });

  document.getElementById("qrcode").innerHTML = "";
  document.getElementById("qr-hint").style.display = "block";
  lastGeneratedCard = null;
  renderCard();
  showNotification("Form cleared.");
}

window.onload = function () {
  checkSession();
  buildThemePicker();
  renderCard();
  renderCards();
};
