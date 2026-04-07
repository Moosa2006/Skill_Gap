const API_BASE = "http://localhost:4000"; // backend URL

async function analyze() {
    const usernameInput = document.getElementById("username");
    const username = usernameInput ? usernameInput.value.trim() : "";
    const goal = document.getElementById("goal").value;

    if (!username) {
        alert("Please enter a username so we can save your progress.");
        if (usernameInput) {
            usernameInput.focus();
        }
        return;
    }

    // Get selected skills
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const userSkills = Array.from(checkboxes).map(cb => cb.value);

    // Skill database
    const roles = {
        frontend: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Git", "GitHub"],

        backend: ["Node.js", "Express", "SQL", "PostgreSQL", "MongoDB", "Git", "Docker"],

        fullstack: [
            "HTML", "CSS", "JavaScript", "TypeScript", "React",
            "Node.js", "Express", "SQL", "MongoDB", "Git", "Docker"
        ],

        data: ["Python", "SQL", "Statistics", "Pandas", "NumPy", "Git"],

        ai: ["Python", "Statistics", "NumPy", "Pandas", "Machine Learning", "Git"]
    };

    // Get required skills for selected goal
    const requiredSkills = roles[goal];

    // Find missing skills
    const missingSkills = requiredSkills.filter(skill => !userSkills.includes(skill));

    // Course database (multiple recommendations per skill)
    const skillCourses = {
        "HTML": [
            { title: "HTML Full Course - Build a Website Tutorial", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg" },
            { title: "Learn HTML (Web Docs)", provider: "MDN", level: "Beginner", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML" },
            { title: "Responsive Web Design", provider: "freeCodeCamp", level: "Beginner", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" }
        ],
        "CSS": [
            { title: "CSS Full Course - Includes Flexbox and Grid", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=OXGznpKZ_sA" },
            { title: "Learn CSS (Web Docs)", provider: "MDN", level: "Beginner", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS" },
            { title: "Flexbox Froggy (Practice)", provider: "Flexbox Froggy", level: "Beginner", url: "https://flexboxfroggy.com/" }
        ],
        "JavaScript": [
            { title: "JavaScript Tutorial for Beginners", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
            { title: "Eloquent JavaScript (Book)", provider: "Eloquent JavaScript", level: "Intermediate", url: "https://eloquentjavascript.net/" },
            { title: "JavaScript Guide", provider: "MDN", level: "Beginner", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }
        ],
        "TypeScript": [
            { title: "TypeScript Course for Beginners", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=30LWjhZzg8U" },
            { title: "The TypeScript Handbook", provider: "TypeScript", level: "Beginner", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
            { title: "TypeScript for JavaScript Programmers", provider: "TypeScript", level: "Beginner", url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html" }
        ],
        "React": [
            { title: "React Course - Beginner's Tutorial", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=bMknfKXIFA8" },
            { title: "Learn React", provider: "React Docs", level: "Beginner", url: "https://react.dev/learn" },
            { title: "React + TypeScript Cheatsheets", provider: "Community", level: "Intermediate", url: "https://react-typescript-cheatsheet.netlify.app/" }
        ],
        "Next.js": [
            { title: "Learn Next.js", provider: "Next.js Docs", level: "Beginner", url: "https://nextjs.org/learn" },
            { title: "Next.js App Router Fundamentals", provider: "Next.js Docs", level: "Beginner", url: "https://nextjs.org/docs/app" },
            { title: "Full Stack Next.js Tutorial", provider: "freeCodeCamp", level: "Intermediate", url: "https://www.youtube.com/watch?v=KjY94sAKLlw" }
        ],
        "Node.js": [
            { title: "Node.js and Express.js - Full Course", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
            { title: "Node.js Tutorials", provider: "Node.js Docs", level: "Beginner", url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs" },
            { title: "Node Best Practices", provider: "Community", level: "Intermediate", url: "https://github.com/goldbergyoni/nodebestpractices" }
        ],
        "Express": [
            { title: "Express JS Crash Course", provider: "Traversy Media", level: "Beginner", url: "https://www.youtube.com/watch?v=L72fhGm1tfE" },
            { title: "Express Guide", provider: "Express Docs", level: "Beginner", url: "https://expressjs.com/en/guide/routing.html" },
            { title: "Build a REST API with Node/Express", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=pKd0Rpw7O48" }
        ],
        "MongoDB": [
            { title: "MongoDB Crash Course", provider: "Traversy Media", level: "Beginner", url: "https://www.youtube.com/watch?v=-56x56UppqQ" },
            { title: "MongoDB University (Free Courses)", provider: "MongoDB University", level: "Beginner", url: "https://learn.mongodb.com/" },
            { title: "MongoDB Manual", provider: "MongoDB Docs", level: "Reference", url: "https://www.mongodb.com/docs/manual/" }
        ],
        "SQL": [
            { title: "SQL Tutorial - Full Database Course", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
            { title: "SQLBolt (Practice)", provider: "SQLBolt", level: "Beginner", url: "https://sqlbolt.com/" },
            { title: "Mode SQL Tutorial", provider: "Mode", level: "Beginner", url: "https://mode.com/sql-tutorial/" }
        ],
        "PostgreSQL": [
            { title: "PostgreSQL Tutorial", provider: "PostgreSQL Docs", level: "Beginner", url: "https://www.postgresql.org/docs/current/tutorial.html" },
            { title: "PostgreSQL Full Course", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=qw--VYLpxG4" },
            { title: "Explain Analyze & Indexing Basics", provider: "Community", level: "Intermediate", url: "https://www.youtube.com/watch?v=H9h2w0qS9mM" }
        ],
        "Python": [
            { title: "Python for Beginners (Full Course)", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc" },
            { title: "Python Tutorial", provider: "Official Docs", level: "Beginner", url: "https://docs.python.org/3/tutorial/" },
            { title: "Automate the Boring Stuff", provider: "Book", level: "Beginner", url: "https://automatetheboringstuff.com/" }
        ],
        "Git": [
            { title: "Git and GitHub for Beginners", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=RGOj5yH7evk" },
            { title: "Pro Git (Book)", provider: "Book", level: "Beginner", url: "https://git-scm.com/book/en/v2" },
            { title: "Learn Git Branching (Practice)", provider: "Interactive", level: "Beginner", url: "https://learngitbranching.js.org/" }
        ],
        "GitHub": [
            { title: "GitHub Skills (Interactive)", provider: "GitHub", level: "Beginner", url: "https://skills.github.com/" },
            { title: "Understanding GitHub (Docs)", provider: "GitHub Docs", level: "Beginner", url: "https://docs.github.com/en/get-started" },
            { title: "Open Source Guide", provider: "GitHub", level: "Beginner", url: "https://opensource.guide/" }
        ],
        "Docker": [
            { title: "Docker Tutorial for Beginners", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=fqMOX6JJhGo" },
            { title: "Get Started", provider: "Docker Docs", level: "Beginner", url: "https://docs.docker.com/get-started/" },
            { title: "Dockerizing a Node.js App", provider: "Docker Docs", level: "Beginner", url: "https://docs.docker.com/language/nodejs/" }
        ],
        "NumPy": [
            { title: "NumPy Tutorial", provider: "Official Docs", level: "Beginner", url: "https://numpy.org/doc/stable/user/absolute_beginners.html" },
            { title: "NumPy Crash Course", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=QUT1VHiLmmI" },
            { title: "Scientific Computing with Python", provider: "freeCodeCamp", level: "Beginner", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" }
        ],
        "Pandas": [
            { title: "Pandas Tutorial", provider: "Official Docs", level: "Beginner", url: "https://pandas.pydata.org/docs/user_guide/10min.html" },
            { title: "Data Analysis with Python (Pandas)", provider: "freeCodeCamp", level: "Beginner", url: "https://www.freecodecamp.org/learn/data-analysis-with-python/" },
            { title: "Pandas Full Course", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=vmEHCJofslg" }
        ],
        "Statistics": [
            { title: "Statistics Fundamentals", provider: "Khan Academy", level: "Beginner", url: "https://www.khanacademy.org/math/statistics-probability" },
            { title: "Statistics for Data Science", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=xxpc-HPKN28" },
            { title: "Seeing Theory (Interactive)", provider: "Seeing Theory", level: "Beginner", url: "https://seeing-theory.brown.edu/" }
        ],
        "Machine Learning": [
            { title: "Machine Learning for Everybody", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=i_LwzRVP7bg" },
            { title: "Intro to Machine Learning", provider: "Kaggle", level: "Beginner", url: "https://www.kaggle.com/learn/intro-to-machine-learning" },
            { title: "Machine Learning Crash Course", provider: "Google", level: "Beginner", url: "https://developers.google.com/machine-learning/crash-course" }
        ],
        "DSA": [
            { title: "Data Structures and Algorithms", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=8hly31xKli0" },
            { title: "NeetCode Roadmap", provider: "NeetCode", level: "Beginner", url: "https://neetcode.io/roadmap" },
            { title: "LeetCode Explore (Practice)", provider: "LeetCode", level: "Beginner", url: "https://leetcode.com/explore/" }
        ],
        "System Design": [
            { title: "System Design Primer", provider: "GitHub", level: "Intermediate", url: "https://github.com/donnemartin/system-design-primer" },
            { title: "Grokking System Design (Concepts)", provider: "Community", level: "Intermediate", url: "https://www.youtube.com/watch?v=MbjObHmDbZo" },
            { title: "System Design Basics", provider: "freeCodeCamp", level: "Beginner", url: "https://www.youtube.com/watch?v=F2FmTdLtb_4" }
        ]
    };

    const goalName = {
        frontend: "Frontend Developer",
        backend: "Backend Developer",
        fullstack: "Full Stack Developer",
        data: "Data Analyst",
        ai: "AI/ML Engineer"
    }[goal] || goal;

    const escapeHtml = (str) =>
        String(str).replace(/[&<>"']/g, (ch) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[ch]));

    const renderCourse = (course) => {
        const title = escapeHtml(course.title);
        const provider = escapeHtml(course.provider);
        const level = escapeHtml(course.level);
        const url = course.url;

        return `
      <div class="course">
        <div class="course-title">${title}</div>
        <a href="${url}" target="_blank" rel="noopener noreferrer">Open</a>
        <div class="course-meta">${provider} • ${level}</div>
      </div>
    `;
    };

    const renderSkillCard = (skill, index) => {
        const courses = skillCourses[skill] || [
            { title: `Search a course for ${skill}`, provider: "General", level: "Any", url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(skill + " course") }
        ];

        return `
      <div class="skill-card">
        <div class="skill-card-header">
          <div class="skill-name">Step ${index + 1}: ${escapeHtml(skill)}</div>
          <div class="tag">Recommended courses</div>
        </div>
        <div class="course-list">
          ${courses.slice(0, 3).map(renderCourse).join("")}
        </div>
    </div>
  `;
    };

    // Display result
    const missingCount = missingSkills.length;
    const missingLabel = missingCount === 0 ? "No gaps found" : `${missingCount} skill${missingCount === 1 ? "" : "s"} to learn`;

    document.getElementById("result").innerHTML = `
    <div class="results-header">
      <h3>Results for: ${escapeHtml(goalName)}</h3>
      <span class="pill"><span class="muted">Status:</span> ${escapeHtml(missingLabel)}</span>
    </div>

    ${missingCount === 0 ? `
      <p class="muted">You're in a great spot. To level up faster, build a small project with your current stack and add tests + deployment.</p>
    ` : `
      <p class="muted">Focus on the next 2–3 steps first. Finish one mini-project per skill to lock it in.</p>
      <div class="missing-grid">
        ${missingSkills.map(renderSkillCard).join("")}
      </div>
    `}
    `;

    // === Send data to backend to save user ===
    try {
        const res = await fetch(`${API_BASE}/save-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                goal,
                selectedSkills: userSkills,
                missingSkills
            }),
        });

        const data = await res.json();
        if (!res.ok) {
            console.error("Failed to save user:", data);
            return;
        }

        // Offer a simple link to the dashboard for this user
        const dashboardLink = document.createElement("a");
        dashboardLink.href = `dashboard.html?user=${encodeURIComponent(username)}`;
        dashboardLink.textContent = "Open your progress dashboard →";
        dashboardLink.className = "primary-btn secondary";
        dashboardLink.style.display = "inline-block";
        dashboardLink.style.marginTop = "1rem";

        const resultEl = document.getElementById("result");
        resultEl.appendChild(dashboardLink);
    } catch (err) {
        console.error("Error saving user:", err);
    }
}
