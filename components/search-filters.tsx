"use client"

import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setSearchTerm, setSelectedType, fetchPokemonByType, fetchPokemonList } from "@/lib/features/pokemon-slice"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export default function SearchFilters() {
  const dispatch = useAppDispatch()
  const { searchTerm, selectedType, pokemonTypes } = useAppSelector((state) => state.pokemon)

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value))
  }

  const handleTypeChange = (value: string) => {
    dispatch(setSelectedType(value))
    if (value === "all") {
      dispatch(fetchPokemonList({ offset: 0, limit: 1000 }))
    } else {
      dispatch(fetchPokemonByType(value))
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar Pokémon por nome..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="relative sm:w-48">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger className="pl-10">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            {pokemonTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
