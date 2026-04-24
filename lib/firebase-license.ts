// Firebase configuration for license verification (Developer account - ofisk)
// This is separate from the client's Firebase used for email sending

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const licenseFirebaseConfig = {
    apiKey: "AIzaSyDkKJxZMgCcepwUkXb3Se9Bw-uT_Tkvs_o",
    authDomain: "ofisk-87251.firebaseapp.com",
    projectId: "ofisk-87251",
    storageBucket: "ofisk-87251.firebasestorage.app",
    messagingSenderId: "18209365667",
    appId: "1:18209365667:web:9691db4eccb4ad273f2916",
    measurementId: "G-8DV8SHNT53"
};

// Initialize a separate Firebase app for license verification
const LICENSE_APP_NAME = 'license-app';

function getLicenseApp() {
    const existingApp = getApps().find(app => app.name === LICENSE_APP_NAME);
    if (existingApp) {
        return existingApp;
    }
    return initializeApp(licenseFirebaseConfig, LICENSE_APP_NAME);
}

const licenseApp = getLicenseApp();
const licenseDb = getFirestore(licenseApp);

export async function checkLicenseStatus(): Promise<boolean> {
    try {
        const userDocRef = doc(licenseDb, 'users', 'tovalseguros');
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const data = userDoc.data();
            return data?.active === true;
        }

        // If document doesn't exist, consider license as inactive
        return false;
    } catch (error) {
        console.error('Error checking license status:', error);
        // In case of error, allow access (fail open) to not block legitimate users
        return true;
    }
}
