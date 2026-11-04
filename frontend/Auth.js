const ADMIN_ACCOUNTS = [
  { email: "admin@adnu.edu.ph", password: "admin123", name: "Admin User" },
];

const AUTH_KEY = "astik_admin_session";
const DASHBOARD_PAGE = "admindashboard.html";
const LOGIN_PAGE = "AdminLogin.html";

function checkCredentials(email, password) {
  const e = email.trim().toLowerCase();
  return ADMIN_ACCOUNTS.find((a) => a.email === e && a.password === password) || null;
}

function saveSession(account, remember) {
  const data = JSON.stringify({ email: account.email, name: account.name });
  // "Remember me" -> localStorage (survives closing the browser)
  // otherwise      -> sessionStorage (cleared when the tab closes)
  const store = remember ? localStorage : sessionStorage;
  store.setItem(AUTH_KEY, data);
}

function getSession() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_KEY);
  window.location.href = LOGIN_PAGE;
}

function requireLogin() {
  if (!getSession()) window.location.replace(LOGIN_PAGE);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  if (getSession()) {
    window.location.replace(DASHBOARD_PAGE);
    return;
  }

  const emailInput = document.getElementById("email");
  const passInput = document.getElementById("password");
  const remember = document.getElementById("remember");
  const errorBox = document.getElementById("login-error");

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    errorBox.hidden = true;

    const email = emailInput.value;
    const password = passInput.value;

    if (!email.trim() || !password) {
      showError("Please enter your email and password.");
      return;
    }

    const account = checkCredentials(email, password);
    if (!account) {
      showError("Incorrect email or password.");
      passInput.value = "";
      passInput.focus();
      return;
    }

    saveSession(account, remember.checked);
    window.location.href = DASHBOARD_PAGE;
  });
});