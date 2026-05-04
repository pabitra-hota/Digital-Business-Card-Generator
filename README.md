# CardForge - QR Card Generator

CardForge is a static frontend web app built with HTML, CSS, and vanilla JavaScript. It works on GitHub Pages and uses Firebase Authentication with email verification plus saved cards.

Users can sign up, verify their email, log in, generate digital business cards, create QR codes and open the same card design on mobile by scanning the QR code.

## File Structure

```text
project-root
├── index.html
├── login.html
├── signup.html
├── dashboard.html
├── card.html
├── about.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   ├── firebase.js
│   ├── auth.js
│   ├── main.js
│   ├── card.js
│   └── storage.js
└── README.md
```

## Features

- Static project: no Node.js server required.
- GitHub Pages deployable.
- Separate login and signup pages.
- Firebase Email/Password Authentication.
- Email verification after signup.
- Login blocked until email is verified.
- Dashboard blocked for unverified users.
- Each Firebase user sees only their own cards.
- Live business card preview.
- Multiple card themes, fonts, and text alignment options.
- QR code contains encoded card data and deployed `card.html` URL.
- QR scan opens the same card design on mobile.
- Saved card preview with QR code.
- Card PNG download using `html2canvas`.
- QR code PNG download.
- About and contact pages included.

## Firebase Files

Firebase is initialized in:

```text
js/firebase.js
```

The app uses Firebase compat scripts, so it does not require npm, modules, or a build step.

Required Firebase scripts are included in:

```text
index.html
login.html
signup.html
dashboard.html
```

## Firebase Authentication Flow

### Signup

1. User enters email and password.
2. Firebase creates the account.
3. Firebase sends a verification email.
4. User must open the verification email and verify the account.
5. User returns to the app and logs in.

The verification email uses an action URL that returns to:

```text
login.html?verified=true
```

### Login

Login uses Firebase Authentication.

If the user email is not verified, login is blocked and the user is signed out.

Only verified users can access:

```text
dashboard.html
```

## Firestore Card Storage

Generated cards are stored in Firestore collection:

```text
cards
```

Each saved card includes:

```js
{
  id,
  userEmail,
  name,
  title,
  company,
  tagline,
  email,
  phone,
  website,
  linkedin,
  social,
  fontStyle,
  textAlign,
  themeName,
  color,
  accent,
  timestamp,
  userId
}
```

`userId` is the Firebase user UID. Cards are loaded using:

```js
db.collection("cards").where("userId", "==", user.uid)
```

This means each user sees only their own saved cards.

Cards are not stored in localStorage anymore.

## QR Encode and Decode

When a card is generated, the full card object is converted to JSON and encoded:

```js
btoa(unescape(encodeURIComponent(JSON.stringify(card))))
```

The QR code contains a deployed URL like:

```text
https://username.github.io/repository-name/card.html?data=ENCODED_DATA
```

On `card.html`, the card data is decoded:

```js
JSON.parse(decodeURIComponent(escape(atob(data))))
```

This allows the card to open correctly on a phone after scanning the QR code.

## Firebase Setup Required

Before deployment, configure Firebase:

1. Open Firebase Console.
2. Create or open project:

```text
cardforge-db
```

3. Enable Authentication.
4. Enable Email/Password sign-in.
5. Enable Firestore Database.
6. Add your GitHub Pages domain to Firebase Authentication authorized domains:

```text
your-github-username.github.io
```

Do not include `https://` in authorized domains.

7. In Firebase Authentication email templates, set the continue/action URL to your GitHub Pages site:

```text
https://your-github-username.github.io/your-repository-name/
```

Example:

```text
https://pabitra.github.io/cardforge/
```

## Firestore Rules

For testing, Firebase test mode can work.

For safer user-based access, use rules like:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /cards/{cardId} {
      allow read: if request.auth != null
                  && request.auth.uid == resource.data.userId;

      allow create: if request.auth != null
                    && request.auth.token.email_verified == true
                    && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## How To Use

1. Open `index.html` or `login.html`.
2. Create an account from `signup.html`.
3. Open the verification email.
4. Verify the email address.
5. Return to the app and log in.
6. Open the dashboard.
7. Fill in card details.
8. Click `Generate QR Code`.
9. Scan the QR code on a phone.
10. Download saved card PNG or QR PNG if needed.

## GitHub Pages Deployment Steps

1. Create a GitHub repository.
2. Upload the project files directly into the repository root.
3. Do not upload `.DS_Store`.
4. Required upload structure:

```text
repository-root
├── index.html
├── login.html
├── signup.html
├── dashboard.html
├── card.html
├── about.html
├── contact.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── firebase.js
    ├── auth.js
    ├── main.js
    ├── card.js
    ├── storage.js
    └── sampleData.js
```

5. Open repository `Settings`.
6. Go to `Pages`.
7. Under `Build and deployment`, choose:

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

8. Click `Save`.
9. Wait for GitHub Pages to publish the site.

Final URL format:

```text
https://your-github-username.github.io/your-repository-name/
```

## Why localhost QR Failed

A QR code with `localhost` works only on the same computer. When a phone scans it, the phone treats `localhost` as the phone itself.

GitHub Pages gives the project a public HTTPS URL. The QR code can then open `card.html` correctly on any phone.

## Important Notes

- No backend server is required.
- No npm is required.
- No React or framework is used.
- Firebase Authentication handles signup and login.
- Firebase email verification is required before login.
- Firestore stores generated cards.
- Cards are saved only for verified users.
- QR landing page does not require login because card data is encoded inside the QR URL.
- The same card design is used in dashboard preview, saved cards, and mobile QR landing page.
