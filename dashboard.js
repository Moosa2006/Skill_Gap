// Dashboard logic for Skill Gap Finder
// This page reads the username from the URL (?user=...) and shows
// goal, totals, missing skills with checkboxes, and a progress bar.

const API_BASE = "http://localhost:4000"; // backend URL

// Helper: get query parameter value
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Render the dashboard UI using user data from the backend
function renderDashboard(user) {
  const container = document.getElementById("dashboard-content");
  if (!user) {
    container.innerHTML = `
      <div class="card">
        <p>Could not load user data.</p>
      </div>
    `;
    return;
  }

  const totalRequired = (user.selectedSkills.length || 0) + (user.missingSkills.length || 0);
  const completed = user.completedSkills.length || 0;
  const progressPercent = totalRequired === 0 ? 0 : Math.round((completed / totalRequired) * 100);

  const missingSkills = user.missingSkills || [];
  const completedSet = new Set(user.completedSkills || []);

  container.innerHTML = `
    <div class="card">
      <h2 class="section-title">Overview</h2>
      <p class="muted">User: <strong>${user.username}</strong></p>
      <p class="muted">Goal: <strong>${user.goal}</strong></p>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total required skills</div>
          <div class="stat-value">${totalRequired}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Completed skills</div>
          <div class="stat-value">${completed}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Missing skills</div>
          <div class="stat-value">${missingSkills.length}</div>
        </div>
      </div>

      <div class="progress-wrapper">
        <div class="progress-label">Progress: ${completed}/${totalRequired} skills (${progressPercent}%)</div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2 class="section-title">Missing skills</h2>
      <p class="section-hint">Check skills as you complete them. This will update your progress.</p>
      <div id="skills-list" class="skills-list">
        ${missingSkills
          .map(
            (skill) => `
          <label class="skill-checkbox">
            <input type="checkbox" value="${skill}" ${
              completedSet.has(skill) ? "checked" : ""
            } />
            <span>${skill}</span>
          </label>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  // Attach change event to checkboxes to update progress
  const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      const checkedSkills = Array.from(
        container.querySelectorAll('input[type="checkbox"]:checked')
      ).map((el) => el.value);
      updateProgress(user.username, checkedSkills);
    });
  });
}

// Call backend to update completed skills
async function updateProgress(username, completedSkills) {
  try {
    const res = await fetch(`${API_BASE}/update-progress`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, completedSkills }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Failed to update progress:", data);
      return;
    }

    // After updating, re-render to update progress bar & stats
    renderDashboard(data);
  } catch (err) {
    console.error("Error updating progress:", err);
  }
}

// Initial load
async function loadUser() {
  const username = getQueryParam("user");
  const container = document.getElementById("dashboard-content");

  if (!username) {
    container.innerHTML = `
      <div class="card">
        <p>Please open the dashboard from the main page after running an analysis.</p>
      </div>
    `;
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/user/${encodeURIComponent(username)}`);
    const data = await res.json();
    if (!res.ok) {
      container.innerHTML = `
        <div class="card">
          <p>Could not find data for user: <strong>${username}</strong></p>
        </div>
      `;
      return;
    }

    renderDashboard(data);
  } catch (err) {
    console.error("Error loading user:", err);
    container.innerHTML = `
      <div class="card">
        <p>There was an error loading the dashboard.</p>
      </div>
    `;
  }
}

loadUser();

