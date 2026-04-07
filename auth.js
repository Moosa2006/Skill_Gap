const API_BASE = "http://localhost:4000";

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const showSignupBtn = document.getElementById("show-signup");
const showLoginBtn = document.getElementById("show-login");
const messageEl = document.getElementById("auth-message");

function setMessage(text, isError) {
  messageEl.textContent = text;
  messageEl.classList.toggle("error", !!isError);
  messageEl.classList.toggle("success", !isError);
}

function setTab(mode) {
  const isSignup = mode === "signup";
  signupForm.classList.toggle("hidden", !isSignup);
  loginForm.classList.toggle("hidden", isSignup);
  showSignupBtn.classList.toggle("active", isSignup);
  showLoginBtn.classList.toggle("active", !isSignup);
}

showSignupBtn.addEventListener("click", () => setTab("signup"));
showLoginBtn.addEventListener("click", () => setTab("login"));

document.getElementById("signup-btn").addEventListener("click", async () => {
  const fullName = document.getElementById("signup-name").value.trim();
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!username || !password) {
    setMessage("Username and password are required.", true);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, username, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Signup failed.", true);
      return;
    }

    localStorage.setItem("skillmap_user", JSON.stringify(data.user));
    setMessage("Signup successful. Redirecting to analysis...", false);
    setTimeout(() => {
      window.location.href = `index.html`;
    }, 700);
  } catch (err) {
    setMessage("Server error while signing up.", true);
  }
});

document.getElementById("login-btn").addEventListener("click", async () => {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    setMessage("Username and password are required.", true);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Login failed.", true);
      return;
    }

    localStorage.setItem("skillmap_user", JSON.stringify(data.user));
    setMessage("Login successful. Redirecting to dashboard...", false);
    setTimeout(() => {
      window.location.href = `dashboard.html?user=${encodeURIComponent(data.user.username)}`;
    }, 700);
  } catch (err) {
    setMessage("Server error while logging in.", true);
  }
});

