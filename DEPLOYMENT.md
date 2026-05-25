# Deployment Guide

LevelUp Academy is a static Single Page Application (SPA), which makes it incredibly easy and free to deploy.

## Deploying to Vercel (Recommended)

1. Create a free account at [Vercel](https://vercel.com/).
2. Install the Vercel CLI or use their web dashboard.
3. If using the web dashboard, simply drag and drop the `levelup-academy` folder into the "Deploy" area.
4. Vercel will automatically generate a secure HTTPS link for your app within seconds.

## Deploying to Netlify

1. Create a free account at [Netlify](https://www.netlify.com/).
2. Go to your "Sites" tab.
3. Drag and drop the `levelup-academy` folder into the upload box at the bottom of the page.
4. Your site will be live instantly. You can change the domain name in the site settings.

## Setting up Firebase (For Real Data Persistence)

Currently, the app uses a mock Firebase configuration and falls back to LocalStorage. To enable real accounts and cloud saving:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (e.g., "LevelUp Academy").
3. Add a "Web App" to the project.
4. Firebase will provide you with a `firebaseConfig` object.
5. Open `js/services/firebase.js` in your code.
6. Replace the `firebaseConfig` variable with the one provided by Firebase.
7. In the Firebase Console, go to **Authentication** and enable "Email/Password" sign-in.
8. Go to **Firestore Database**, create a database, and set the security rules to allow authenticated users to read/write their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
