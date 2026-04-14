import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC6uG2hu0zbgt_zfw4XRSQTI_1mbB0az_Q",
  authDomain: "disco-history-430508-e3.firebaseapp.com",
  projectId: "disco-history-430508-e3",
  storageBucket: "disco-history-430508-e3.firebasestorage.app",
  messagingSenderId: "911000742263",
  appId: "1:911000742263:web:74eac83dd12f7822985972",
  measurementId: "G-CCKW3XP725"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BPYrxky9d6pB5sIsvYco5SbchJB3fpUwNcgipOH3a0fFw1-vrxhNqoQvWs1zKkpIlNqJYWaxy754fWdZgDwTtdU" 
    });
    if (currentToken) {
      console.log("Token FCM didapat:", currentToken);
      return currentToken;
    } else {
      console.log("Izin notifikasi ditolak");
    }
  } catch (err) {
    console.log("Error mengambil token FCM:", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });