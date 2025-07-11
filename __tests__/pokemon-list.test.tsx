import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import pokemonReducer from "@/lib/features/pokemon-slice"
import PokemonList from "@/components/pokemon-list"
import jest from "jest" 

jest.mock("next/image", () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src || "/placeholder.svg"} alt={alt} {...props} />
  }
})

const mockStore = configureStore({
  reducer: {
    pokemon: pokemonReducer,
  },
  preloadedState: {
    pokemon: {
      pokemonList: [
        { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
        { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      ],
      filteredPokemon: [
        { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
        { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      ],
      selectedPokemon: null,
      loading: false,
      error: null,
      currentPage: 1,
      totalCount: 3,
      searchTerm: "",
      selectedType: "",
      pokemonTypes: [],
    },
  },
})

describe("PokemonList Component", () => {
  it("renders pokemon list correctly", () => {
    render(
      <Provider store={mockStore}>
        <PokemonList />
      </Provider>,
    )

    expect(screen.getByText("Lista de Pokémon")).toBeInTheDocument()
    expect(screen.getByText("3 encontrados")).toBeInTheDocument()
    expect(screen.getByText("pikachu")).toBeInTheDocument()
    expect(screen.getByText("charizard")).toBeInTheDocument()
    expect(screen.getByText("bulbasaur")).toBeInTheDocument()
  })

  it("displays pokemon with correct IDs", () => {
    render(
      <Provider store={mockStore}>
        <PokemonList />
      </Provider>,
    )

    expect(screen.getByText("#025")).toBeInTheDocument() // Pikachu
    expect(screen.getByText("#006")).toBeInTheDocument() // Charizard
    expect(screen.getByText("#001")).toBeInTheDocument() // Bulbasaur
  })

  it("handles pokemon click events", () => {
    const mockDispatch = jest.fn()
    jest.spyOn(require("@/lib/hooks"), "useAppDispatch").mockReturnValue(mockDispatch)

    render(
      <Provider store={mockStore}>
        <PokemonList />
      </Provider>,
    )

    const pikachuCard = screen.getByText("pikachu").closest("div")
    if (pikachuCard) {
      fireEvent.click(pikachuCard)
      expect(mockDispatch).toHaveBeenCalled()
    }
  })

  it("shows loading state", () => {
    const loadingStore = configureStore({
      reducer: {
        pokemon: pokemonReducer,
      },
      preloadedState: {
        pokemon: {
          pokemonList: [],
          filteredPokemon: [],
          selectedPokemon: null,
          loading: true,
          error: null,
          currentPage: 1,
          totalCount: 0,
          searchTerm: "",
          selectedType: "",
          pokemonTypes: [],
        },
      },
    })

    render(
      <Provider store={loadingStore}>
        <PokemonList />
      </Provider>,
    )

    expect(screen.getByText("Carregando Pokémon...")).toBeInTheDocument()
  })
})
