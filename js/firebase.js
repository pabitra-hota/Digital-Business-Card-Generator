const firebaseConfig = {
  apiKey: "AIzaSyA2UT9dqpQ5rzcDGoO8Y_ybBZiENApJiD8",
  authDomain: "cardforge-db.firebaseapp.com",
  projectId: "cardforge-db",
  storageBucket: "cardforge-db.firebasestorage.app",
  messagingSenderId: "1038250544212",
  appId: "1:1038250544212:web:2e1de85c6058e0875971c1",
  measurementId: "G-1ELES9H1Y3"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
