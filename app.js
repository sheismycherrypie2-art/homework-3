// Готовая защитная механика. Не изменяйте эту функцию.
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function selectAttempts(filter) {
  const attempts = window.reportData.attempts;

  if (filter === "all") {
    return attempts;
  }

  if (filter === "passed") {
    return attempts.filter(a => a.passed === true);
  }

  if (filter === "failed") {
    return attempts.filter(a => a.passed === false);
  }

  return []
}

function renderAttempts(attempts) {
  let html = "";

  attempts.forEach(attempt => {
    const name = escapeHtml(attempt.name);

    html += `
      <li class="result-item">
        <span class="result-name">${name}</span>
        <span>
          ${attempt.score} из ${attempt.questionCount}
          (${attempt.percentage}%)
        </span>
      </li>
    `;
  });

  document.querySelector("#result-list").innerHTML = html;

  document.querySelector("#result-count").textContent =
    `Показано: ${attempts.length} из ${window.reportData.attempts.length}`;
}

function startFilter() {
  const form = document.querySelector("#filter-form");
  const select = document.querySelector("#filter");
  const count = document.querySelector("#result-count");
  const list = document.querySelector("#result-list");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const filter = select.value;
    const attempts = selectAttempts(filter);

    renderAttempts(attempts);
  });
}

startFilter()
