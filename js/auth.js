// Show a message on login/signup pages.
function showMessage(elementId, text, isSuccess) {
  var message = document.getElementById(elementId);
  if (!message) return;

  message.textContent = text;
  message.className = isSuccess ? "message success" : "message error";
}

// Strict Gmail validation used by login and signup.
function validateGmail(email) {
  var regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (!regex.test(email)) return false;
  if (email.indexOf("..") !== -1) return false;

  var username = email.split("@")[0];
  if (username.length < 3) return false;
  if (!/^[a-zA-Z0-9._%+-]+$/.test(username)) return false;

  return true;
}

function showHint(hintId, text, isOk) {
  var hint = document.getElementById(hintId);
  if (!hint) return;

  hint.textContent = text;
  hint.className = isOk ? "hint ok" : "hint err";
}

function clearHint(hintId) {
  var hint = document.getElementById(hintId);
  if (!hint) return;

  hint.textContent = "";
  hint.className = "hint";
}

function togglePassword(inputId, button) {
  var input = document.getElementById(inputId);

  if (input.type === "password") {
    input.type = "text";
    button.textContent = "Hide";
  } else {
    input.type = "password";
    button.textContent = "Show";
  }
}

function signup() {
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      showMessage("signupMessage", "Account created successfully!", true);
    })
    .catch((error) => {
      showMessage("signupMessage", error.message, false);
    });
}

function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      showMessage("loginMessage", error.message, false);
    });
}
