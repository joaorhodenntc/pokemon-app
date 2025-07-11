"use client"

import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchPokemonDetails, setCurrentPage } from "@/lib/features/pokemon-slice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import Image from "next/image"

const ITEMS_PER_PAGE = 20

export default function PokemonList() {
  const dispatch = useAppDispatch()
  const { filteredPokemon, loading, currentPage, searchTerm, selectedType } = useAppSelector((state) => state.pokemon)

  const totalPages = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPokemon = filteredPokemon.slice(startIndex, endIndex)

  const handlePokemonClick = (name: string) => {
    dispatch(fetchPokemonDetails(name))
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const getPokemonId = (url: string) => {
    const parts = url.split("/")
    return parts[parts.length - 2]
  }

  const getPokemonImageUrl = (url: string) => {
    const id = getPokemonId(url)
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Carregando Pokémon...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Lista de Pokémon</h2>
          <Badge variant="secondary">{filteredPokemon.length} encontrados</Badge>
        </div>

        {(searchTerm || selectedType) && (
          <div className="flex gap-2">
            {searchTerm && <Badge variant="outline">Busca: {searchTerm}</Badge>}
            {selectedType && selectedType !== "all" && <Badge variant="outline">Tipo: {selectedType}</Badge>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {currentPokemon.map((pokemon) => (
          <Card
            key={pokemon.name}
            className="cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={() => handlePokemonClick(pokemon.name)}
          >
            <CardContent className="p-4 text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <Image
                  src={getPokemonImageUrl(pokemon.url) || "/placeholder.svg"}
                  alt={pokemon.name}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=80&width=80"
                  }}
                />
              </div>
              <h3 className="font-semibold text-base capitalize">{pokemon.name}</h3>
              <p className="text-sm text-gray-500">#{getPokemonId(pokemon.url).padStart(3, "0")}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
