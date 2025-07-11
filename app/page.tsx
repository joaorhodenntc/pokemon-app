"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import PokemonApp from "@/components/pokemon-app"

export default function Home() {
  return (
    <Provider store={store}>
      <PokemonApp />
    </Provider>
  )
}
