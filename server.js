const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let db = new sqlite3.Database('./notes.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the notes database.');
});

db.run(`CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created TEXT NOT NULL,
  modified TEXT NOT NULL
)`);

app.get('/api/notes', (req, res) => {
  db.all(`SELECT * FROM notes`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  const created = new Date().toISOString();
  const modified = created;
  db.run(`INSERT INTO notes (title, content, created, modified) VALUES (?, ?, ?, ?)`, [title, content, created, modified], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.json({ id: this.lastID });
  });
});

app.put('/api/notes/:id', (req, res) => {
  const { title, content } = req.body;
  const modified = new Date().toISOString();
  db.run(`UPDATE notes SET title = ?, content = ?, modified = ? WHERE id = ?`, [title, content, modified, req.params.id], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.sendStatus(200);
  });
});

app.delete('/api/notes/:id', (req, res) => {
  db.run(`DELETE FROM notes WHERE id = ?`, [req.params.id], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
