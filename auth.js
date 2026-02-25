// Firebase Auth (optional) - Client-only setup with Google provider
// To enable, create a Firebase project, enable Google Sign-In, and fill in config below.
// This file is safe to include even if config is empty; buttons will no-op.

const signinBtn = document.getElementById('btn-google-signin');
const signoutBtn = document.getElementById('btn-signout');
const authUserEl = document.getElementById('auth-user');

// Firebase config (provided)
// Ensure your Vercel domain is added under Firebase Authentication > Settings > Authorized domains.
const firebaseConfig = {
  apiKey: "AIzaSyCdlLpuxNKnbJVB0gNAZxt7NvRImXnmh3o",
  authDomain: "expense-tracker-aea5c.firebaseapp.com",
  projectId: "expense-tracker-aea5c",
  storageBucket: "expense-tracker-aea5c.firebasestorage.app",
  messagingSenderId: "301341259471",
  appId: "1:301341259471:web:165d0e16bf7de0386da9ba",
  measurementId: "G-5S6M12WG03"
};

let firebaseEnabled = false;
let auth, provider;

(async function init() {
  try {
  if (!firebaseConfig.apiKey) return; // not configured
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js');
    const { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js');
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
    firebaseEnabled = true;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        authUserEl.className = 'auth-status signed-in';
        authUserEl.textContent = `✓ Signed in as ${user.displayName || user.email}`;
        // Use user.uid as a profile namespace if desired
        localStorage.setItem('profile', user.uid);
        // force reload profile data under this namespace
        try { window.loadProfile && window.loadProfile(user.uid); } catch {}
      } else {
        authUserEl.className = 'auth-status signed-out';
        authUserEl.textContent = '○ Not signed in — data stored locally';
      }
    });

    signinBtn?.addEventListener('click', async () => {
      try { await signInWithPopup(auth, provider); } catch (e) { console.warn(e); }
    });
    signoutBtn?.addEventListener('click', async () => { try { await signOut(auth); } catch (e) { console.warn(e); } });
  } catch (e) {
    console.warn('Firebase not initialized', e);
  }
})();
