const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = 3000;

// ── Serve static files (CSS, JS, images, etc.) from the project folder ──
app.use(express.static(path.join(__dirname), { index: false }));
app.use(express.json()); // Allow parsing JSON bodies

const USER_FILE = path.join(__dirname, 'user.txt');

function getUsers() {
  try {
    if (!fs.existsSync(USER_FILE)) fs.writeFileSync(USER_FILE, '[]');
    const data = fs.readFileSync(USER_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2));
}

// ─────────────────────────────────────────
//  ROUTES — one per HTML page
// ─────────────────────────────────────────

// 1. Home / Default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// 2. About
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

// 3. Contact
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// 4. Login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// 5. Sign Up
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

// ─────────────────────────────────────────
//  API ROUTES
// ─────────────────────────────────────────
app.post('/api/signup', (req, res) => {
  const { fname, lname, email, user, pass } = req.body;
  const users = getUsers();
  const exists = users.find(u => u.email === email || u.user === user);
  
  if (exists) {
    return res.status(400).json({ error: 'Account already exists' });
  }
  
  users.push({ fname, lname, email, user, pass });
  saveUsers(users);
  res.json({ success: true, message: 'Signup successful' });
});

app.post('/api/login', (req, res) => {
  const { loginId, pass } = req.body;
  const users = getUsers();
  const existingUser = users.find(u => u.email === loginId || u.user === loginId);
  
  if (!existingUser) {
    return res.status(404).json({ error: 'signup first or wrong user name' });
  }
  
  if (existingUser.pass !== pass) {
    return res.status(401).json({ error: 'wrong password' });
  }
  
  res.json({ success: true, message: 'login succesfull' });
});

// ─────────────────────────────────────────
//  404 — catch all unmatched routes
// ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <body style="font-family:sans-serif;text-align:center;padding:80px;background:#080810;color:#eeeef5;">
        <h1 style="font-size:4rem;color:#c9a227;">404</h1>
        <p style="color:#888899;">Page not found.</p>
        <a href="/" style="color:#c9a227;">← Back to Home</a>
      </body>
    </html>
  `);
});

// ─────────────────────────────────────────
//  START SERVER
// ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✦ CardForge server running at http://localhost:${PORT}`);
  console.log('  Routes:');
  console.log(`  GET /         → login.html   (Default)`);
  console.log(`  GET /about    → about.html`);
  console.log(`  GET /contact  → contact.html`);
  console.log(`  GET /login    → login.html`);
  console.log(`  GET /signup   → signup.html`);
});
