import { configureStore } from "@reduxjs/toolkit"
import pokemonReducer, {
  setCurrentPage,
  setSearchTerm,
  setSelectedType,
  clearSelectedPokemon,
  fetchPokemonList,
  fetchPokemonDetails,
} from "@/lib/features/pokemon-slice"
import jest from "jest" 

global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe("Pokemon Slice", () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        pokemon: pokemonReducer,
      },
    })
    mockFetch.mockClear()
  })

  describe("reducers", () => {
    it("should set current page", () => {
      store.dispatch(setCurrentPage(2))
      const state = store.getState().pokemon
      expect(state.currentPage).toBe(2)
    })

    it("should set search term and filter pokemon", () => {
      const initialState = {
        pokemonList: [
          { name: "pikachu", url: "test-url-1" },
          { name: "charizard", url: "test-url-2" },
          { name: "bulbasaur", url: "test-url-3" },
        ],
        filteredPokemon: [
          { name: "pikachu", url: "test-url-1" },
          { name: "charizard", url: "test-url-2" },
          { name: "bulbasaur", url: "test-url-3" },
        ],
        selectedPokemon: null,
        loading: false,
        error: null,
        currentPage: 1,
        totalCount: 0,
        searchTerm: "",
        selectedType: "",
        pokemonTypes: [],
      }

      const storeWithData = configureStore({
        reducer: {
          pokemon: pokemonReducer,
        },
        preloadedState: {
          pokemon: initialState,
        },
      })

      storeWithData.dispatch(setSearchTerm("pika"))
      const state = storeWithData.getState().pokemon

      expect(state.searchTerm).toBe("pika")
      expect(state.filteredPokemon).toHaveLength(1)
      expect(state.filteredPokemon[0].name).toBe("pikachu")
      expect(state.currentPage).toBe(1) 
    })

    it("should set selected type", () => {
      store.dispatch(setSelectedType("fire"))
      const state = store.getState().pokemon
      expect(state.selectedType).toBe("fire")
      expect(state.currentPage).toBe(1) 
    })

    it("should clear selected pokemon", () => {
      store.dispatch(clearSelectedPokemon())
      const state = store.getState().pokemon
      expect(state.selectedPokemon).toBeNull()
    })
  })

  describe("async thunks", () => {
    it("should fetch pokemon list successfully", async () => {
      const mockResponse = {
        results: [
          { name: "pikachu", url: "test-url-1" },
          { name: "charizard", url: "test-url-2" },
        ],
        count: 1000,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      await store.dispatch(fetchPokemonList({ offset: 0, limit: 20 }))
      const state = store.getState().pokemon

      expect(state.loading).toBe(false)
      expect(state.pokemonList).toEqual(mockResponse.results)
      expect(state.filteredPokemon).toEqual(mockResponse.results)
      expect(state.totalCount).toBe(1000)
      expect(state.error).toBeNull()
    })

    it("should fetch pokemon details successfully", async () => {
      const mockPokemon = {
        id: 25,
        name: "pikachu",
        sprites: {
          front_default: "sprite-url",
          other: {
            "official-artwork": {
              front_default: "artwork-url",
            },
          },
        },
        types: [{ type: { name: "electric" } }],
        abilities: [{ ability: { name: "static" } }],
        stats: [
          { base_stat: 35, stat: { name: "hp" } },
          { base_stat: 55, stat: { name: "attack" } },
        ],
        height: 4,
        weight: 60,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemon,
      } as Response)

      await store.dispatch(fetchPokemonDetails("pikachu"))
      const state = store.getState().pokemon

      expect(state.loading).toBe(false)
      expect(state.selectedPokemon).toEqual(mockPokemon)
      expect(state.error).toBeNull()
    })

    it("should handle fetch errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"))

      await store.dispatch(fetchPokemonList({ offset: 0, limit: 20 }))
      const state = store.getState().pokemon

      expect(state.loading).toBe(false)
      expect(state.error).toBe("Network error")
    })
  })

  describe("pagination logic", () => {
    it("should handle pagination correctly", () => {
      const pokemonList = Array.from({ length: 50 }, (_, i) => ({
        name: `pokemon-${i}`,
        url: `url-${i}`,
      }))

      const storeWithData = configureStore({
        reducer: {
          pokemon: pokemonReducer,
        },
        preloadedState: {
          pokemon: {
            pokemonList,
            filteredPokemon: pokemonList,
            selectedPokemon: null,
            loading: false,
            error: null,
            currentPage: 1,
            totalCount: 50,
            searchTerm: "",
            selectedType: "",
            pokemonTypes: [],
          },
        },
      })

      storeWithData.dispatch(setCurrentPage(2))
      const state = storeWithData.getState().pokemon
      expect(state.currentPage).toBe(2)

      storeWithData.dispatch(setSearchTerm("pokemon-1"))
      const stateAfterSearch = storeWithData.getState().pokemon
      expect(stateAfterSearch.currentPage).toBe(1)
    })
  })
})
