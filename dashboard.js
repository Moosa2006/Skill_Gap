const API_BASE = "http://localhost:4000";

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function getLoggedInUser() {
  try {
    const raw = localStorage.getItem("skillmap_user");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function renderDashboard(user) {
  const container = document.getElementById("dashboard-content");
  const missingSkills = user.missingSkills || [];
  const completedSet = new Set(user.completedSkills || []);
  const totalRequired = (user.selectedSkills || []).length + missingSkills.length;
  const completed = (user.completedSkills || []).length;
  const progressPercent = totalRequired === 0 ? 0 : Math.round((completed / totalRequired) * 100);

  const testRows = (user.testResults || [])
    .map(
      (item) => `
      <div class="test-result-row">
        <span>${item.skill}</span>
        <span>${item.score}/${item.total}</span>
      </div>
    `
    )
    .join("");

  container.innerHTML = `
    <div class="card">
      <h2 class="section-title">Profile</h2>
      <p class="muted">Name: <strong>${user.fullName || "Not provided"}</strong></p>
      <p class="muted">Username: <strong>${user.username}</strong></p>
      <p class="muted">Goal: <strong>${user.goal || "Not selected yet"}</strong></p>
      <div class="top-links">
        <a href="index.html">Analyze Skills</a>
        <a href="auth.html">Logout / Switch User</a>
      </div>
    </div>

    <div class="card">
      <h2 class="section-title">Progress Overview</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total required</div>
          <div class="stat-value">${totalRequired}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Completed</div>
          <div class="stat-value">${completed}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Missing</div>
          <div class="stat-value">${missingSkills.length}</div>
        </div>
      </div>

      <div class="progress-wrapper">
        <div class="progress-label">${completed}/${totalRequired} skills completed (${progressPercent}%)</div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width:${progressPercent}%"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2 class="section-title">Track Missing Skills</h2>
      <div class="skills-list">
        ${missingSkills
          .map(
            (skill) => `
          <div class="skill-row">
            <label class="skill-checkbox">
              <input type="checkbox" value="${skill}" ${completedSet.has(skill) ? "checked" : ""} />
              <span>${skill}</span>
            </label>
            <a class="ghost-btn" href="test.html?user=${encodeURIComponent(user.username)}&skill=${encodeURIComponent(skill)}">Take Test</a>
          </div>
        `
          )
          .join("")}
      </div>
    </div>

    <div class="card">
      <h2 class="section-title">Test History</h2>
      ${testRows || '<p class="muted">No tests attempted yet.</p>'}
    </div>
  `;

  const checkboxes = container.querySelectorAll('.skills-list input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const checkedSkills = Array.from(
        container.querySelectorAll('.skills-list input[type="checkbox"]:checked')
      ).map((el) => el.value);
      updateProgress(user.username, checkedSkills);
    });
  });
}

async function updateProgress(username, completedSkills) {
  try {
    const updateResponse = await fetch(`${API_BASE}/update-progress`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, completedSkills }),
    });
    if (!updateResponse.ok) return;

    await loadUser(username);
  } catch (err) {
    console.error("Error updating progress:", err);
  }
}

async function loadUser(fromParam) {
  const fromLocal = getLoggedInUser();
  const username = fromParam || getQueryParam("user") || (fromLocal && fromLocal.username);
  const container = document.getElementById("dashboard-content");

  if (!username) {
    container.innerHTML = `
      <div class="card">
        <p>Please login first from <a href="auth.html">auth page</a>.</p>
      </div>
    `;
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/profile/${encodeURIComponent(username)}`);
    const user = await response.json();
    if (!response.ok) {
      container.innerHTML = `<div class="card"><p>User not found. Please signup/login first.</p></div>`;
      return;
    }
    renderDashboard(user);
  } catch (err) {
    container.innerHTML = `<div class="card"><p>Could not load profile right now.</p></div>`;
  }
}

loadUser();

