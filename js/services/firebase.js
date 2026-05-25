// Mock/Stub Firebase Configuration
// Replace with your actual Firebase config in production
const firebaseConfig = {
    apiKey: "MOCK_API_KEY",
    authDomain: "mock-levelup.firebaseapp.com",
    projectId: "mock-levelup",
    storageBucket: "mock-levelup.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

window.FirebaseService = {
    isReady: false,
    
    init() {
        try {
            if (firebase.apps.length === 0) {
                firebase.initializeApp(firebaseConfig);
            }
            this.auth = firebase.auth();
            this.db = firebase.firestore();
            this.isReady = true;
            console.log("Firebase initialized (Mock config for now)");
        } catch (e) {
            console.warn("Firebase not properly configured. Using local storage fallback.");
            this.isReady = false;
        }
    },

    saveUserData(uid, data) {
        if (!this.isReady) return;
        return this.db.collection('users').doc(uid).set(data, { merge: true });
    },

    async getUserData(uid) {
        if (!this.isReady) return null;
        const doc = await this.db.collection('users').doc(uid).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    }
};

// Initialize if firebase is loaded
if (typeof firebase !== 'undefined') {
    FirebaseService.init();
}
