let notes = [];

function showNoteForm(note = {}) {
  document.getElementById('noteForm').style.display = 'block';
  document.getElementById('noteId').value = note.id || '';
  document.getElementById('noteTitle').value = note.title || '';
  document.getElementById('noteContent').value = note.content || '';
}

function hideNoteForm() {
  document.getElementById('noteForm').style.display = 'none';
}

function saveNote() {
  const id = document.getElementById('noteId').value;
  const title = document.getElementById('noteTitle').value;
  const content = document.getElementById('noteContent').value;

  if (id) {
    const note = notes.find(note => note.id == id);
    note.title = title;
    note.content = content;
    note.modified = new Date();
  } else {
    const note = { id: Date.now(), title, content, created: new Date(), modified: new Date() };
    notes.push(note);
  }

  saveNotes();
  renderNotes();
  hideNoteForm();
}

function renderNotes() {
  const noteList = document.getElementById('noteList');
  noteList.innerHTML = '';
  notes.forEach(note => {
    const li = document.createElement('li');
    li.textContent = `${note.title} - ${note.content}`;
    const editButton = document.createElement('button');
    editButton.textContent = '编辑';
    editButton.onclick = () => showNoteForm(note);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '删除';
    deleteButton.onclick = () => deleteNote(note.id);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    noteList.appendChild(li);
  });
}

function deleteNote(id) {
  notes = notes.filter(note => note.id != id);
  saveNotes();
  renderNotes();
}

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
  const savedNotes = localStorage.getItem('notes');
  if (savedNotes) {
    notes = JSON.parse(savedNotes);
  }
  renderNotes();
}

document.getElementById('search').addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase();
  const filteredNotes = notes.filter(note => note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query));
  renderNotes(filteredNotes);
});

loadNotes();
