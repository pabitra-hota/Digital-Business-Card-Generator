# Static QR Card Generator

This is a frontend-only static web app that works on GitHub Pages. It has login/signup screens, a card generator dashboard, QR code generation, saved cards using `localStorage`, and a mobile-friendly card landing page.

## File Structure

```text
project-root
├── index.html
├── dashboard.html
├── card.html
├── about.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   ├── auth.js
│   ├── main.js
│   ├── card.js
│   ├── storage.js
│   └── sampleData.js
└── README.md
```

## Features

- Signup validates input only and does not save user data.
- Login checks only predefined sample data from `js/sampleData.js`.
- Current login session stores only the current user email in `localStorage`.
- Users can generate cards with live preview.
- Generated cards are saved in `localStorage` using the key `cards`.
- Saved cards are filtered by the logged-in user email.
- Each card gets a QR code with the deployed GitHub Pages URL.
- QR scans open `card.html` and display the same card design.
- Cards can be downloaded as PNG using `html2canvas`.
- About and contact pages are static pages connected to the same GitHub Pages flow.

## Login System

Login data is stored only in `js/sampleData.js`:

```js
const SAMPLE_USERS = [
  {
    email: "test@gmail.com",
    password: "123456"
  }
];
```

The app does not create real users. Login succeeds only when the email and password match this sample data.

## Why Signup Does Not Store Data

This project has no backend, Firebase, or database. Signup is only for validation practice. It checks Gmail format and password length, then shows a success message. It does not add the user to `SAMPLE_USERS` and does not save signup data anywhere.

## localStorage Usage

Only generated cards are saved in `localStorage`.

Key:

```text
cards
```

Format:

```js
[
  {
    id,
    userEmail,
    name,
    email,
    color,
    timestamp
  }
]
```

The current session stores only:

```text
currentUser
```

## QR Encode and Decode

When a card is generated, the full card object is converted to JSON and encoded:

```js
btoa(unescape(encodeURIComponent(JSON.stringify(card))))
```

The QR code contains a full deployed URL like:

```text
https://username.github.io/repository-name/card.html?data=ENCODED_DATA
```

On `card.html`, the data is decoded:

```js
JSON.parse(decodeURIComponent(escape(atob(data))))
```

This lets the card open correctly on a phone after scanning the QR code.

## How To Use

1. Open `index.html`.
2. Login with:
   - Email: `test@gmail.com`
   - Password: `123456`
3. Enter name, Gmail, and color on the dashboard.
4. Click `Generate QR`.
5. Scan the QR code after the project is deployed on GitHub Pages.
6. Download saved cards as PNG from the saved cards list.

## GitHub Pages Deployment Steps

1. Create a GitHub account or log in to GitHub.
2. Click `New repository`.
3. Enter a repository name, for example `qr-card-generator`.
4. Keep the repository public.
5. Click `Create repository`.
6. Upload these project files and folders directly to the repository root:
   - `index.html`
   - `dashboard.html`
   - `card.html`
   - `about.html`
   - `contact.html`
   - `css/style.css`
   - `js/auth.js`
   - `js/main.js`
   - `js/card.js`
   - `js/storage.js`
   - `js/sampleData.js`
   - `README.md`
7. Open the repository `Settings`.
8. Go to `Pages`.
9. Under `Build and deployment`, select:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
10. Click `Save`.
11. Wait until GitHub shows the deployed site URL.

Final URL format:

```text
https://your-github-username.github.io/your-repository-name/
```

Example:

```text
https://pabitra.github.io/qr-card-generator/
```

## Why localhost Failed

QR codes must contain a URL that the phone can open. A URL like `http://localhost:3000/card.html` works only on the same computer because `localhost` means "this device". When a phone scans that QR code, the phone looks for `localhost` on the phone itself, not on your computer.

GitHub Pages fixes this because it gives the app a public HTTPS URL. The QR code then points to a real deployed page that any phone can open.

## Important Rules Followed

- No backend.
- No Firebase.
- No database.
- Signup does not store data.
- Login uses only sample data.
- Cards are the only saved user-created data.
- No localhost references are used for QR codes.
- The same card design is used in dashboard preview, saved cards, and mobile QR landing page.
