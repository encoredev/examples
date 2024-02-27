import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import React, { FC, PropsWithChildren, useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const appAuth = getAuth(app);

interface FirebaseContextState {
  auth: Auth | undefined;
  isLoading: boolean;
}

export const FirebaseContext = React.createContext<FirebaseContextState>(
  {} as FirebaseContextState,
);

export const FirebaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<Auth>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    appAuth?.authStateReady().then(() => {
      setAuth(appAuth);
      setIsLoading(false);
    });
  }, []);

  return (
    <FirebaseContext.Provider value={{ auth, isLoading }}>
      {children}
    </FirebaseContext.Provider>
  );
};
