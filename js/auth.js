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

// Signup validates only. It does not store user data.
function signup() {
  var firstName = document.getElementById("signupFirstName").value.trim();
  var email = document.getElementById("signupEmail").value.trim();
  var username = document.getElementById("signupUsername").value.trim();
  var password = document.getElementById("signupPassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;
  var termsChecked = document.getElementById("terms").checked;

  clearHint("firstNameHint");
  clearHint("signupEmailHint");
  clearHint("usernameHint");
  clearHint("signupPasswordHint");
  clearHint("confirmPasswordHint");

  if (firstName === "") {
    showHint("firstNameHint", "First name is required.", false);
    showMessage("signupMessage", "Please fix the errors above.", false);
    return;
  }

  if (!validateGmail(email)) {
    showHint("signupEmailHint", "Enter a valid Gmail address.", false);
    showMessage("signupMessage", "Signup accepts Gmail format only.", false);
    return;
  }

  if (username.length < 3 || username.indexOf(" ") !== -1) {
    showHint("usernameHint", "Username must be at least 3 characters with no spaces.", false);
    showMessage("signupMessage", "Please fix the errors above.", false);
    return;
  }

  if (password.length < 6) {
    showHint("signupPasswordHint", "Password must be at least 6 characters.", false);
    showMessage("signupMessage", "Please fix the errors above.", false);
    return;
  }

  if (password !== confirmPassword) {
    showHint("confirmPasswordHint", "Passwords do not match.", false);
    showMessage("signupMessage", "Please fix the errors above.", false);
    return;
  }

  if (!termsChecked) {
    showMessage("signupMessage", "You must agree to the terms.", false);
    return;
  }

  document.getElementById("signupForm").style.display = "none";
  document.getElementById("successBox").style.display = "block";
}

// Login checks only the predefined SAMPLE_USERS array.
function login() {
  var email = document.getElementById("loginEmail").value.trim();
  var password = document.getElementById("loginPassword").value;

  if (!validateGmail(email)) {
    showMessage("loginMessage", "Enter a valid Gmail address.", false);
    return;
  }

  var user = SAMPLE_USERS.find(function (sampleUser) {
    return sampleUser.email === email && sampleUser.password === password;
  });

  if (!user) {
    showMessage("loginMessage", "Invalid email or password.", false);
    return;
  }

  localStorage.setItem("currentUser", email);
  showMessage("loginMessage", "Login successful. Redirecting...", true);

  setTimeout(function () {
    window.location.href = "dashboard.html";
  }, 600);
}
