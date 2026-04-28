// Mobile QR landing page. It displays the same card saved in the QR payload.

function safeText(text) {
  var div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function normalUrl(value) {
  if (value.indexOf("http://") === 0 || value.indexOf("https://") === 0) {
    return value;
  }

  return "https://" + value;
}

function getContactRow(icon, text, link) {
  return '<div class="contact-row"><span>' + icon + '</span><a href="' + link + '" target="_blank">' + safeText(text) + '</a></div>';
}

function getContactRows(card) {
  var rows = "";

  if (card.email) {
    rows += getContactRow("✉", card.email, "mailto:" + card.email);
  }
  if (card.phone) {
    rows += getContactRow("☎", card.phone, "tel:" + card.phone);
  }
  if (card.website) {
    rows += getContactRow("🌐", card.website, normalUrl(card.website));
  }
  if (card.linkedin) {
    rows += getContactRow("🔗", card.linkedin, normalUrl(card.linkedin));
  }
  if (card.social) {
    rows += getContactRow("👤", card.social, normalUrl(card.social));
  }

  return rows;
}

function showError() {
  document.getElementById("cardWrapper").innerHTML =
    '<div class="error-box">' +
      '<h2>No card found</h2>' +
      '<p>This QR code does not contain valid card information.</p>' +
    '</div>';
}

function loadCard() {
  var params = new URLSearchParams(window.location.search);
  var data = params.get("data");

  if (!data) {
    showError();
    return;
  }

  try {
    var card = JSON.parse(decodeURIComponent(escape(atob(data))));
    document.title = card.name + " - Digital Card";
    var title = card.title || "Job Title";
    var company = card.company || "Company";

    document.getElementById("cardWrapper").innerHTML =
      '<div class="biz-card" id="mobileBizCard" style="background-color:' + card.color + ';font-family:' + card.fontStyle + ';text-align:' + card.textAlign + ';">' +
        '<div>' +
          '<div class="card-name">' + safeText(card.name) + '</div>' +
          '<div class="card-job-title" style="color:' + card.accent + ';">' + safeText(title) + '</div>' +
          '<div class="card-company">' + safeText(company) + '</div>' +
          (card.tagline ? '<div class="card-tagline">' + safeText(card.tagline) + '</div>' : '') +
        '</div>' +
        '<hr class="card-divider">' +
        '<div class="card-contacts">' + getContactRows(card) + '</div>' +
      '</div>' +
      '<button class="save-btn" onclick="saveContact()">+ Save Contact</button>' +
      '<div class="footer-text">Powered by <a href="index.html">CardForge</a></div>';

    window.currentCard = card;
  } catch (error) {
    showError();
  }
}

function saveContact() {
  var card = window.currentCard;
  if (!card) return;

  var vcard = "BEGIN:VCARD\n";
  vcard += "VERSION:3.0\n";
  vcard += "FN:" + card.name + "\n";
  if (card.title) vcard += "TITLE:" + card.title + "\n";
  if (card.company) vcard += "ORG:" + card.company + "\n";
  if (card.email) vcard += "EMAIL:" + card.email + "\n";
  if (card.phone) vcard += "TEL:" + card.phone + "\n";
  if (card.website) vcard += "URL:" + card.website + "\n";
  vcard += "END:VCARD";

  var blob = new Blob([vcard], { type: "text/vcard" });
  var url = URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = url;
  link.download = card.name + ".vcf";
  link.click();
  URL.revokeObjectURL(url);
}

window.onload = loadCard;
