import { configureStore, combineReducers } from "@reduxjs/toolkit"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import createWebStorage from "redux-persist/lib/storage/createWebStorage"
import { encryptTransform } from "redux-persist-transform-encrypt"
import authReducer from "./slices/authSlice"

// Create a noop storage for server-side rendering
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value)
    },
    removeItem(_key: string) {
      return Promise.resolve()
    },
  }
}

// Use localStorage on client, noop storage on server
const storage =
  typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage()

// Create encryption transformer
const encryptor = encryptTransform({
  secretKey:
    process.env.NEXT_PUBLIC_PERSIST_KEY ||
    "your-secure-random-32-character-key-anything-you like",
  onError: (error) => {
    console.error("Encryption error:", error)
  },
})

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  transforms: [encryptor],
} as any

const rootReducer = combineReducers({
  auth: authReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
