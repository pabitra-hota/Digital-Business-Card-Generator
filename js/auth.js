// Show a message on login/signup pages.
function showMessage(elementId, text, isSuccess) {
  var message = document.getElementById(elementId);
  if (!message) return;

  message.textContent = text;
  message.className = isSuccess ? "message success" : "message error";
}

// Extract clean error message without "Firebase: " prefix
function getCleanErrorMessage(error) {
  var message = error.message || error.code || "An error occurred";
  
  // Remove "Firebase: " prefix if present
  if (message.startsWith("Firebase: ")) {
    message = message.substring(9); // Remove "Firebase: "
  }
  
  return message;
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

function getActionCodeSettings() {
  var returnUrl = window.location.href.replace(/[^/]*$/, "login.html");

  return {
    url: returnUrl,
    handleCodeInApp: true
  };
}

function signup() {
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const actionCodeSettings = getActionCodeSettings();

      // Send verification email
      return user.sendEmailVerification(actionCodeSettings);
    })
    .then(() => {
      showMessage("signupMessage", "Verification email sent. Check inbox.", true);
      auth.signOut();
    })
    .catch((error) => {
      showMessage("signupMessage", getCleanErrorMessage(error), false);
    });
}

function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      if (!user.emailVerified) {
        showMessage("loginMessage", "Please verify your email first.", false);
        auth.signOut();
        return;
      }

      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      showMessage("loginMessage", getCleanErrorMessage(error), false);
    });
}

// Handle email verification from link
window.addEventListener("DOMContentLoaded", function () {
  var params = new URLSearchParams(window.location.search);
  var oobCode = params.get("oobCode");
  var mode = params.get("mode");

  // If this is a verification link
  if (mode === "verifyEmail" && oobCode) {
    // Apply the verification code
    auth.applyActionCode(oobCode)
      .then(() => {
        showMessage("loginMessage", "Email verified successfully! Please login.", true);
      })
      .catch((error) => {
        showMessage("loginMessage", "Verification failed: " + getCleanErrorMessage(error), false);
      });
  }
});
