const form = document.getElementById('mistakeForm');
const list = document.getElementById('mistakeList');

let mistakes = [];

// ---- Modal Elements ----
const modal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
let deleteId = null; // store the mistake ID to delete

// ---- Helpers ----
function saveMistakes() {
  localStorage.setItem('mistakes', JSON.stringify(mistakes));
}

function deleteMistake(id) {
  mistakes = mistakes.filter(m => m.id !== id);
  saveMistakes();
  displayMistakes();
}

// ---- Modal Logic ----
function showConfirmModal(message, id) {
  confirmMessage.textContent = message;
  deleteId = id;
  modal.classList.add('show');
}

confirmYes.addEventListener('click', () => {
  if (deleteId !== null) {
    deleteMistake(deleteId);
    deleteId = null;
  }
  modal.classList.remove('show');
});

confirmNo.addEventListener('click', () => {
  deleteId = null;
  modal.classList.remove('show');
});

// ---- Load mistakes ----
window.onload = () => {
  const stored = localStorage.getItem('mistakes');
  if (stored) {
    try {
      mistakes = JSON.parse(stored) || [];
    } catch {
      mistakes = [];
    }
    displayMistakes();
  }
};

// ---- Add mistake ----
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const mistake = {
    id: Date.now(),
    type: document.getElementById('type').value,
    title: document.getElementById('title').value.trim(),
    source: document.getElementById('source').value.trim(),
    mistake: document.getElementById('mistake').value.trim(),
    solution: document.getElementById('solution').value.trim(),
    learned: document.getElementById('learned').value.trim(),
    tags: document
      .getElementById('tags')
      .value.split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
  };

  mistakes.push(mistake);
  saveMistakes();
  displayMistakes();
  form.reset();
});

// ---- Display mistakes ----
function displayMistakes() {
  list.innerHTML = '';

  if (mistakes.length === 0) {
    list.innerHTML = '<p class="empty-state">No mistakes logged yet.</p>';
    return;
  }

  mistakes.forEach(m => {
    const card = document.createElement('div');
    card.className = 'mistake-card';
    card.dataset.id = m.id;

    card.innerHTML = `
      <h3>${m.title} <small>(${m.type})</small></h3>
      <small><strong>Source:</strong> ${m.source}</small>
      <p><strong>❌ Mistake:</strong> ${m.mistake}</p>
      <p><strong>✅ Fix:</strong> ${m.solution}</p>
      <p><strong>📌 Learned:</strong> ${m.learned}</p>
      <p class="tags"><strong>🏷 Tags:</strong> ${m.tags.join(', ') || '—'}</p>
      <button class="delete-btn" aria-label="Delete this mistake">🗑 Delete</button>
    `;

    const delBtn = card.querySelector('.delete-btn');
    delBtn.addEventListener('click', () => {
      showConfirmModal(`Are you sure you want to delete "${m.title}"?`, m.id);
    });

    list.appendChild(card);
  });
}
