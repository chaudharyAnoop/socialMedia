import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDTH8dvQznTaJRnl8NbZHPfMIMWLplKZvo",
  authDomain: "my-project-f3fb8.firebaseapp.com",
  projectId: "my-project-f3fb8",
  storageBucket: "my-project-f3fb8.firebasestorage.app",
  messagingSenderId: "880241752809",
  appId: "1:880241752809:web:0306aaf550a9f8ee388e78",
  measurementId: "G-HL1P162Q1J",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const VAPID_KEY =
  "BLvNuY9Y68_bC0ZVee7U4A7hUPKokV5X4nZWWMsQXui3l-kybkYAWjGEvq4iyGmIey_0UP9WPxQ1f09Cs4EGZu8";

let token: string | undefined;
export const requestNotificationPermission = async (): Promise<void> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission not granted.");
      return;
    }

    token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (token) {
      console.log(" FCM Token:", token);
    } else {
      console.warn(" No FCM registration token available.");
    }
  } catch (error) {
    console.error(" Error getting FCM token:", error);
  }
};

export const onFirebaseMessage = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);

      const notificationTitle =
        payload?.notification?.title || "New Notification";
      const notificationBody = payload?.notification?.body || "";
      const notificationType = payload?.data?.type;

      switch (notificationType) {
        case "like":
          toast.success(
            <div>
              <strong>❤️ New Like</strong>
              <div>{notificationBody}</div>
            </div>,
            {
              position: "top-center",
              autoClose: 3000,
              icon: <span>'❤️'</span>,
            }
          );
          break;

        case "comment":
          toast.info(
            <div>
              <strong>💬 New Comment</strong>
              <div>{notificationBody}</div>
            </div>,
            {
              position: "top-center",
              autoClose: 4000,
              icon: <span>'💬'</span>,
            }
          );
          break;

        case "mention":
          toast.warning(
            <div>
              <strong>👋 You Were Mentioned</strong>
              <div>{notificationBody}</div>
            </div>,
            {
              position: "top-center",
              autoClose: 5000,
              icon: <span>'👋'</span>,
            }
          );
          break;

        case "follow":
          toast.success(
            <div>
              <strong>✨ New Follower</strong>
              <div>{notificationBody}</div>
            </div>,
            {
              position: "top-center",
              autoClose: 4000,
              icon: <span> '✨'</span>,
            }
          );
          break;

        default:
          toast.info(
            <div>
              <strong>{notificationTitle}</strong>
              <div>{notificationBody}</div>
            </div>,
            {
              position: "top-center",
              autoClose: 3000,
            }
          );
      }

      resolve(payload);
    });
  });

export { token };
