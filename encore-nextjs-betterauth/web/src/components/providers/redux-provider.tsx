"use client"

import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "@/store/store"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
