const API_BASE = "http://localhost:4000";

const questionBank = {
  HTML: [
    { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Transfer Machine Language", "Hyperlinks and Text Management Language"], answer: 0 },
    { q: "Which tag creates a hyperlink?", options: ["<p>", "<a>", "<link>"], answer: 1 },
    { q: "Which element is used for the largest heading?", options: ["<h6>", "<heading>", "<h1>"], answer: 2 },
  ],
  CSS: [
    { q: "Which property changes text color?", options: ["font-color", "text-style", "color"], answer: 2 },
    { q: "Which display value creates flex layout?", options: ["block", "flex", "grid"], answer: 1 },
    { q: "How to select class `btn` in CSS?", options: [".btn", "#btn", "btn"], answer: 0 },
  ],
  JavaScript: [
    { q: "Which keyword declares a block-scoped variable?", options: ["var", "let", "define"], answer: 1 },
    { q: "Which method converts JSON string to object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.object()"], answer: 0 },
    { q: "Which symbol is strict equality?", options: ["==", "===", "="], answer: 1 },
  ],
};

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function getQuestions(skill) {
  return questionBank[skill] || [
    { q: `What is the main use of ${skill}?`, options: ["Backend only", "It depends on context", "Never used in software"], answer: 1 },
    { q: `How should you learn ${skill} better?`, options: ["Build mini projects", "Avoid practice", "Memorize only"], answer: 0 },
    { q: `What improves confidence in ${skill}?`, options: ["Consistent practice", "Random guessing", "No coding"], answer: 0 },
  ];
}

async function saveResult(username, skill, score, total) {
  await fetch(`${API_BASE}/save-test-result`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, skill, score, total }),
  });
}

function renderQuiz() {
  const username = getQueryParam("user");
  const skill = getQueryParam("skill");
  const root = document.getElementById("test-root");

  if (!username || !skill) {
    root.innerHTML = `<p>Missing user or skill. Open this page from dashboard.</p>`;
    return;
  }

  const questions = getQuestions(skill);
  root.innerHTML = `
    <h2 class="section-title">${skill} Test</h2>
    <p class="muted">User: <strong>${username}</strong> | Questions: ${questions.length}</p>
    <div id="quiz-questions"></div>
    <button id="submit-test" class="primary-btn">Submit Test</button>
    <div id="quiz-result" class="status-card"></div>
  `;

  const questionsBox = document.getElementById("quiz-questions");
  questionsBox.innerHTML = questions
    .map(
      (item, index) => `
      <div class="question-card">
        <p><strong>Q${index + 1}. ${item.q}</strong></p>
        ${item.options
          .map(
            (opt, optIndex) => `
          <label class="option-row">
            <input type="radio" name="q-${index}" value="${optIndex}" />
            <span>${opt}</span>
          </label>
        `
          )
          .join("")}
      </div>
    `
    )
    .join("");

  document.getElementById("submit-test").addEventListener("click", async () => {
    let score = 0;

    questions.forEach((q, index) => {
      const selected = document.querySelector(`input[name="q-${index}"]:checked`);
      if (selected && Number(selected.value) === q.answer) {
        score += 1;
      }
    });

    await saveResult(username, skill, score, questions.length);

    const percent = Math.round((score / questions.length) * 100);
    document.getElementById("quiz-result").innerHTML = `
      <p><strong>Your Score:</strong> ${score}/${questions.length} (${percent}%)</p>
      <a class="ghost-btn" href="dashboard.html?user=${encodeURIComponent(username)}">Back to dashboard</a>
    `;
  });
}

renderQuiz();

