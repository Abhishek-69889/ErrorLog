const form = document.getElementById('mistakeForm');
const list = document.getElementById('mistakeList');

let mistakes = [];

// ✅ Load mistakes from localStorage on page load
window.onload = () => {
  const stored = localStorage.getItem('mistakes');
  if (stored) {
    mistakes = JSON.parse(stored);
    displayMistakes();
  }
};

// ✅ Handle form submission
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const mistake = {
    id: Date.now(),
    type: document.getElementById('type').value,
    title: document.getElementById('title').value,
    source: document.getElementById('source').value,
    mistake: document.getElementById('mistake').value,
    solution: document.getElementById('solution').value,
    learned: document.getElementById('learned').value,
    tags: document.getElementById('tags').value.split(',').map(tag => tag.trim())
  };

  mistakes.push(mistake);

  // ✅ Save to localStorage
  localStorage.setItem('mistakes', JSON.stringify(mistakes));

  displayMistakes();
  form.reset();
});

// ✅ Render the mistakes on the page
function displayMistakes() {
  list.innerHTML = '';

  mistakes.forEach(m => {
    const card = document.createElement('div');
    card.className = 'mistake-card';

    card.innerHTML = `
      <h3>${m.title} <small>(${m.type})</small></h3>
      <small><strong>Source:</strong> ${m.source}</small>
      <p><strong>❌ Mistake:</strong> ${m.mistake}</p>
      <p><strong>✅ Fix:</strong> ${m.solution}</p>
      <p><strong>📌 Learned:</strong> ${m.learned}</p>
      <p class="tags"><strong>🏷 Tags:</strong> ${m.tags.join(', ')}</p>
    `;

    list.appendChild(card);
  });
}
