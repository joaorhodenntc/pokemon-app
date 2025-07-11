import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import pokemonReducer from "@/lib/features/pokemon-slice"
import SearchFilters from "@/components/search-filters"
import jest from "jest" 

const mockStore = configureStore({
  reducer: {
    pokemon: pokemonReducer,
  },
  preloadedState: {
    pokemon: {
      pokemonList: [],
      filteredPokemon: [],
      selectedPokemon: null,
      loading: false,
      error: null,
      currentPage: 1,
      totalCount: 0,
      searchTerm: "",
      selectedType: "",
      pokemonTypes: ["fire", "water", "grass", "electric"],
    },
  },
})

describe("SearchFilters Component", () => {
  it("renders search input and type filter", () => {
    render(
      <Provider store={mockStore}>
        <SearchFilters />
      </Provider>,
    )

    expect(screen.getByPlaceholderText("Buscar Pokémon por nome...")).toBeInTheDocument()
    expect(screen.getByText("Filtrar por tipo")).toBeInTheDocument()
  })

  it("handles search input changes", () => {
    const mockDispatch = jest.fn()
    jest.spyOn(require("@/lib/hooks"), "useAppDispatch").mockReturnValue(mockDispatch)

    render(
      <Provider store={mockStore}>
        <SearchFilters />
      </Provider>,
    )

    const searchInput = screen.getByPlaceholderText("Buscar Pokémon por nome...")
    fireEvent.change(searchInput, { target: { value: "pikachu" } })

    expect(mockDispatch).toHaveBeenCalled()
  })

  it("displays current search term", () => {
    const storeWithSearch = configureStore({
      reducer: {
        pokemon: pokemonReducer,
      },
      preloadedState: {
        pokemon: {
          pokemonList: [],
          filteredPokemon: [],
          selectedPokemon: null,
          loading: false,
          error: null,
          currentPage: 1,
          totalCount: 0,
          searchTerm: "pikachu",
          selectedType: "",
          pokemonTypes: ["fire", "water", "grass", "electric"],
        },
      },
    })

    render(
      <Provider store={storeWithSearch}>
        <SearchFilters />
      </Provider>,
    )

    const searchInput = screen.getByDisplayValue("pikachu")
    expect(searchInput).toBeInTheDocument()
  })
})
