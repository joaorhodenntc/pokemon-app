import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default: string
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
  types: Array<{
    type: {
      name: string
    }
  }>
  abilities: Array<{
    ability: {
      name: string
    }
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
  height: number
  weight: number
}

export interface PokemonListItem {
  name: string
  url: string
}

interface PokemonState {
  pokemonList: PokemonListItem[]
  filteredPokemon: PokemonListItem[]
  selectedPokemon: Pokemon | null
  loading: boolean
  error: string | null
  currentPage: number
  totalCount: number
  searchTerm: string
  selectedType: string
  pokemonTypes: string[]
}

const initialState: PokemonState = {
  pokemonList: [],
  filteredPokemon: [],
  selectedPokemon: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalCount: 0,
  searchTerm: "",
  selectedType: "",
  pokemonTypes: [],
}

export const fetchPokemonList = createAsyncThunk(
  "pokemon/fetchPokemonList",
  async ({ offset, limit }: { offset: number; limit: number }) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
    const data = await response.json()
    return data
  },
)

export const fetchPokemonDetails = createAsyncThunk(
  "pokemon/fetchPokemonDetails",
  async (nameOrId: string | number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`)
    const data = await response.json()
    return data
  },
)

export const fetchPokemonTypes = createAsyncThunk("pokemon/fetchPokemonTypes", async () => {
  const response = await fetch("https://pokeapi.co/api/v2/type")
  const data = await response.json()
  return data.results.map((type: { name: string }) => type.name)
})

export const fetchPokemonByType = createAsyncThunk("pokemon/fetchPokemonByType", async (typeName: string) => {
  const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`)
  const data = await response.json()
  return data.pokemon.map((p: { pokemon: PokemonListItem }) => p.pokemon)
})

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
      state.currentPage = 1
      if (action.payload === "") {
        state.filteredPokemon = state.pokemonList
      } else {
        state.filteredPokemon = state.pokemonList.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(action.payload.toLowerCase()),
        )
      }
    },
    setSelectedType: (state, action: PayloadAction<string>) => {
      state.selectedType = action.payload
      state.currentPage = 1
    },
    clearSelectedPokemon: (state) => {
      state.selectedPokemon = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemonList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPokemonList.fulfilled, (state, action) => {
        state.loading = false
        state.pokemonList = action.payload.results
        state.filteredPokemon = action.payload.results
        state.totalCount = action.payload.count
      })
      .addCase(fetchPokemonList.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch Pokemon list"
      })
      .addCase(fetchPokemonDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPokemonDetails.fulfilled, (state, action) => {
        state.loading = false
        state.selectedPokemon = action.payload
      })
      .addCase(fetchPokemonDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch Pokemon details"
      })
      .addCase(fetchPokemonTypes.fulfilled, (state, action) => {
        state.pokemonTypes = action.payload
      })
      .addCase(fetchPokemonByType.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPokemonByType.fulfilled, (state, action) => {
        state.loading = false
        state.filteredPokemon = action.payload
      })
  },
})

export const { setCurrentPage, setSearchTerm, setSelectedType, clearSelectedPokemon } = pokemonSlice.actions
export default pokemonSlice.reducer
