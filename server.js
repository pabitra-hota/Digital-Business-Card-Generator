// ============================================================
// server.js  — Simple Express + MongoDB server
// What this file does:
//   1. Connects to MongoDB database
//   2. Serves our HTML files (login.html, signup.html)
//   3. Handles /api/signup  →  saves a new user to database
//   4. Handles /api/login   →  checks username + password
// ============================================================

// Step 1: Import the packages we need
var express    = require('express');     // web server framework
var cors       = require('cors');        // allows the browser to call our server
var mongodb    = require('mongodb');     // lets us talk to MongoDB
require('dotenv').config();              // reads the .env file

// Step 2: Create the Express app
var app = express();

// Step 3: Add middlewares
app.use(cors());                   // allow requests from the browser
app.use(express.json());           // automatically read JSON from request body
app.use(express.static(__dirname)); // serve our HTML files from this folder

// Step 4: MongoDB setup
// Read the connection string from .env file (or use local default)
var mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
var dbName   = 'ca2project';   // name of our database
var PORT     = process.env.PORT || 3000;

// MongoClient is what we use to connect to MongoDB
var MongoClient = mongodb.MongoClient;
var client      = new MongoClient(mongoURI);

// This variable will hold our "users" collection (like a table in SQL)
var usersCollection;

// Step 5: Connect to MongoDB before starting the server
async function startServer() {

  try {
    // Try to connect to the database
    await client.connect();
    console.log('Connected to MongoDB successfully!');

    // Pick the database and the collection (table) we want to use
    var db = client.db(dbName);
    usersCollection = db.collection('users');

    // Start listening for requests AFTER the DB is connected
    app.listen(PORT, function() {
      console.log('Server is running at: http://localhost:' + PORT);
      console.log('Open this URL in your browser to use the app.');
    });

  } catch (err) {
    // If MongoDB is not running, show a helpful message
    console.log('ERROR: Could not connect to MongoDB!');
    console.log('Make sure MongoDB is running. Start it with:');
    console.log('  brew services start mongodb-community');
    console.log('Error details:', err.message);
    process.exit(1); // stop the server
  }
}

// ============================================================
// ROUTE 1: POST /api/signup
// Called when the user submits the signup form.
// We check if the user already exists, then save them.
// ============================================================
app.post('/api/signup', async function(req, res) {

  // Read the data sent from the form
  var fname    = req.body.fname;
  var lname    = req.body.lname;
  var email    = req.body.email;
  var username = req.body.user;
  var password = req.body.pass;

  // Check all required fields are present
  if (!fname || !email || !username || !password) {
    return res.json({ success: false, error: 'Please fill all required fields.' });
  }

  try {
    // Check if someone already has this username OR email
    var existingUser = await usersCollection.findOne({
      $or: [
        { user: username },
        { email: email }
      ]
    });

    if (existingUser) {
      // User already exists — don't create a duplicate
      return res.json({ success: false, error: 'Username or email is already taken.' });
    }

    // Save the new user to the database
    // NOTE: In a real project you should hash the password (use bcrypt)
    //       For a student demo we store it as plain text.
    await usersCollection.insertOne({
      fname:    fname,
      lname:    lname,
      email:    email,
      user:     username,
      pass:     password,
      joinedAt: new Date()    // record when they signed up
    });

    console.log('New user created:', username);

    // Tell the browser it worked
    return res.json({ success: true });

  } catch (err) {
    console.log('Signup error:', err.message);
    return res.json({ success: false, error: 'Server error. Try again.' });
  }
});

// ============================================================
// ROUTE 2: POST /api/login
// Called when the user submits the login form.
// We look for a user with matching username AND password.
// ============================================================
app.post('/api/login', async function(req, res) {

  // Read the username and password sent from the form
  var username = req.body.user;
  var password = req.body.pass;

  // Check both fields are present
  if (!username || !password) {
    return res.json({ success: false, error: 'Please enter username and password.' });
  }

  try {
    // Look for a user who matches BOTH username and password
    var foundUser = await usersCollection.findOne({
      user: username,
      pass: password
    });

    if (!foundUser) {
      // No match found — wrong username or password
      return res.json({ success: false, error: 'Incorrect username or password.' });
    }

    // Found the user — login is successful!
    console.log('User logged in:', username);
    return res.json({ success: true });

  } catch (err) {
    console.log('Login error:', err.message);
    return res.json({ success: false, error: 'Server error. Try again.' });
  }
});

// ============================================================
// Start everything!
// ============================================================
startServer();
