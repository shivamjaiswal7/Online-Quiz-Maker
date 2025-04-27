
// login.js
function login() {
  const name = document.getElementById("username").value;
  if (name.trim()) {
    localStorage.setItem("quizUser", name);
    window.location.href = "dashboard.html";
  }
}

// dashboard.js
if (window.location.pathname.includes("dashboard.html")) {
  const user = localStorage.getItem("quizUser");
  if (user) {
    document.getElementById("greeting").innerText = `Hey ${user}, welcome to your dashboard! 🎉`;
  } else {
    window.location.href = "index.html";
  }
}

// create.js
if (window.location.pathname.includes("create.html")) {
  const questionsContainer = document.getElementById("questionsContainer");
  for (let i = 1; i <= 10; i++) {
    const div = document.createElement("div");
    div.classList.add("question-block");
    div.innerHTML = `
      <h4>Question ${i}</h4>
      <input type="text" placeholder="Enter question ${i}" name="q${i}" />
      <input type="text" placeholder="Option A" name="q${i}_a" />
      <input type="text" placeholder="Option B" name="q${i}_b" />
      <input type="text" placeholder="Option C" name="q${i}_c" />
      <input type="text" placeholder="Option D" name="q${i}_d" />
      <label>Correct Answer:
        <select name="q${i}_correct">
          <option value="">Select</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </label><hr/>
    `;
    questionsContainer.appendChild(div);
  }

  document.getElementById("quizForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const quiz = [];
    for (let i = 1; i <= 10; i++) {
      const q = formData.get(`q${i}`);
      const a = formData.get(`q${i}_a`);
      const b = formData.get(`q${i}_b`);
      const c = formData.get(`q${i}_c`);
      const d = formData.get(`q${i}_d`);
      const correct = formData.get(`q${i}_correct`);

      if (q && a && b && c && d && correct) {
        quiz.push({
          text: q,
          options: { A: a, B: b, C: c, D: d },
          correct: correct
        });
      }
    }
    if (quiz.length > 0) {
      localStorage.setItem("customQuiz", JSON.stringify(quiz));
      document.getElementById("saveMessage").style.display = "block";
    } else {
      alert("Add at least one complete question to save the quiz.");
    }
  });
}

// quiz.js
if (window.location.pathname.includes("quiz.html")) {
  const quizData = JSON.parse(localStorage.getItem("customQuiz")) || [];
  const form = document.getElementById("quizAttemptForm");
  const user = localStorage.getItem("quizUser");

  if (!quizData.length) {
    form.innerHTML = "<p>No quiz available. Please create one first.</p>";
    document.getElementById("submitBtn").style.display = "none";
  } else {
    quizData.forEach((q, index) => {
      const div = document.createElement("div");
      div.classList.add("question-block");
      div.innerHTML =
        "<h4>Q" + (index + 1) + ": " + q.text + "</h4>" +
        `<label><input type="radio" name="q${index}" value="A" required> ${q.options.A}</label><br/>` +
        `<label><input type="radio" name="q${index}" value="B"> ${q.options.B}</label><br/>` +
        `<label><input type="radio" name="q${index}" value="C"> ${q.options.C}</label><br/>` +
        `<label><input type="radio" name="q${index}" value="D"> ${q.options.D}</label><br/><hr/>`;
      form.appendChild(div);
    });
  }

  document.getElementById("submitBtn").addEventListener("click", function () {
    const formData = new FormData(form);
    let score = 0;
    quizData.forEach((q, index) => {
      const ans = formData.get(`q${index}`);
      if (ans === q.correct) {
        score++;
      }
    });
    const percentage = (score / quizData.length) * 100;
    document.getElementById("result").innerHTML =
      `<h3>Your Score: ${score} / ${quizData.length} (${percentage.toFixed(2)}%)</h3>`;
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: user || "Anonymous", score: score });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  });
}

// leaderboard.js
if (window.location.pathname.includes("leaderboard.html")) {
  const leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardData.sort((a, b) => b.score - a.score).forEach((entry, index) => {
    const li = document.createElement("li");
    li.innerText = `${index + 1}. ${entry.name} - ${entry.score} points`;
    document.getElementById("leaderboardList").appendChild(li);
  });
}
