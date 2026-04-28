// Show message below login/signup forms.
function showMessage(elementId, text, isSuccess) {
  const message = document.getElementById(elementId);
  message.innerText = text;
  message.className = isSuccess ? "message success" : "message";
}

// Strict Gmail validation.
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (!regex.test(email)) return false;
  if (email.includes("..")) return false;

  const username = email.split("@")[0];
  if (username.length < 3) return false;
  if (!/^[a-zA-Z0-9._%+-]+$/.test(username)) return false;

  return true;
}

// Signup (NO STORAGE)
function signup() {
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!validateEmail(email)) {
    showMessage("signupMessage", "Invalid Gmail format.", false);
    return;
  }

  if (password.length < 6) {
    showMessage("signupMessage", "Password must be at least 6 characters.", false);
    return;
  }

  showMessage("signupMessage", "Signup successful. Data is not saved.", true);
}

// Login checks only SAMPLE_USERS from js/sampleData.js.
function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!validateEmail(email)) {
    showMessage("loginMessage", "Invalid Gmail format.", false);
    return;
  }

  const user = SAMPLE_USERS.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    showMessage("loginMessage", "Invalid email or password.", false);
    return;
  }

  localStorage.setItem("currentUser", email);
  window.location.href = "dashboard.html";
}
