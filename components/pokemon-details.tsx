"use client"

import type { Pokemon } from "@/lib/features/pokemon-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface PokemonDetailsProps {
  pokemon: Pokemon | null
}

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",

  steel: "bg-gray-500",
  fairy: "bg-pink-300",
}

const statTranslations: Record<string, string> = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Ataque Especial",
  "special-defense": "Defesa Especial",
  speed: "Velocidade",
}

export default function PokemonDetails({ pokemon }: PokemonDetailsProps) {
  if (!pokemon) {
    return (
      <Card className="h-fit">
        <CardContent className="p-6 text-center">
          <div className="text-gray-400 mb-4">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🔍</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Selecione um Pokémon</h3>
          <p className="text-sm text-gray-500">Clique em qualquer Pokémon da lista para ver informações</p>
        </CardContent>
      </Card>
    )
  }

  const maxStat = Math.max(...pokemon.stats.map((stat) => stat.base_stat))

  return (
    <Card className="h-fit">
      <CardHeader className="text-center pb-4">
        <div className="relative w-40 h-40 mx-auto mb-4">
          <Image
            src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            fill
            className="object-contain"
          />
        </div>
        <CardTitle className="text-2xl capitalize">{pokemon.name}</CardTitle>
        <p className="text-gray-500">#{pokemon.id.toString().padStart(3, "0")}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tipos */}
        <div>
          <h4 className="font-semibold mb-2">Tipo</h4>
          <div className="flex gap-2">
            {pokemon.types.map((type) => (
              <Badge
                key={type.type.name}
                className={`${typeColors[type.type.name] || "bg-gray-400"} text-white capitalize`}
              >
                {type.type.name}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Estatísticas Físicas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{pokemon.height / 10}m</p>
            <p className="text-sm text-gray-500">Altura</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{pokemon.weight / 10}kg</p>
            <p className="text-sm text-gray-500">Peso</p>
          </div>
        </div>

        <Separator />

        {/* Habilidades */}
        <div>
          <h4 className="font-semibold mb-2">Habilidades</h4>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((ability) => (
              <Badge key={ability.ability.name} variant="outline" className="capitalize">
                {ability.ability.name.replace("-", " ")}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Estatísticas */}
        <div>
          <h4 className="font-semibold mb-3">Estatísticas Base</h4>
          <div className="space-y-3">
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{statTranslations[stat.stat.name] || stat.stat.name}</span>
                  <span className="text-sm font-bold">{stat.base_stat}</span>
                </div>
                <Progress value={(stat.base_stat / maxStat) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
