"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchPokemonList, fetchPokemonTypes } from "@/lib/features/pokemon-slice"
import PokemonList from "./pokemon-list"
import PokemonDetails from "./pokemon-details"
import SearchFilters from "./search-filters"
import { Card } from "@/components/ui/card"

export default function PokemonApp() {
  const dispatch = useAppDispatch()
  const { selectedPokemon } = useAppSelector((state) => state.pokemon)

  useEffect(() => {
    dispatch(fetchPokemonList({ offset: 0, limit: 1000 }))
    dispatch(fetchPokemonTypes())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Pokédex
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-4 mb-6">
              <SearchFilters />
            </Card>
            <PokemonList />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <PokemonDetails pokemon={selectedPokemon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
