import Countries from "../countries/Countries";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as ApiCountries from "../../services/ApiCountries";

const MOCK_NAVIGATE = jest.fn();

const MOCK_PARAMS = jest.fn();

const MOCK_COUNTRIES = [
  {
    cca3: "BRA",
    name: {
      common: "Brazil",
      official: "República Federativa do Brasil",
    },
    flags: {
      png: "brazil.png",
    },
    population: 211049527,
    region: "America",
    capital: "Brasília",
  },
  {
    cca3: "NGA",
    name: {
      common: "Nigeria",
      official: "Nigeria",
    },
    flags: {
      png: "Nigeria.png",
    },
    population: 2110495,
    region: "Africa",
    capital: "Abuja",
  },
];

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => MOCK_NAVIGATE,
  useParams: () => MOCK_PARAMS,
}));

describe("Testes do componente Countries", () => {
  it("deve aplicar o modo dark no componente ", async () => {
    render(<Countries darkMode={true} />);
  });

  it("deve aplicar o modo Light no componente ", async () => {
    render(<Countries darkMode={false} />);
  });

  it("Deve filtrar os países com base no common name do país", async () => {
    jest.spyOn(ApiCountries, "getAll").mockResolvedValue(MOCK_COUNTRIES);
    await act(async () => {
      render(<Countries />);
    });
    const searchBar = screen.getByRole("searchBar");
    await act(async () => userEvent.type(searchBar, "Brazil"));

    expect(screen.getByText("Brazil")).toBeInTheDocument();
    expect(screen.getByText("211049527")).toBeInTheDocument();
    expect(screen.getByText("America")).toBeInTheDocument();
    expect(screen.getByText("Brasília")).toBeInTheDocument();
    screen.debug();
  });

  it("Deve filtrar os países com base no nome oficial do país", async () => {
    jest.spyOn(ApiCountries, "getAll").mockResolvedValue(MOCK_COUNTRIES);
    await act(async () => {
      render(<Countries />);
    });
    const searchBar = screen.getByRole("searchBar");
    await act(async () =>
      userEvent.type(searchBar, "República Federativa do Brasil")
    );

    expect(screen.getByText("Brazil")).toBeInTheDocument();
    expect(screen.getByText("211049527")).toBeInTheDocument();
    expect(screen.getByText("America")).toBeInTheDocument();
    expect(screen.getByText("Brasília")).toBeInTheDocument();
  });

  it("Deve filtrar os países com base na região do país", async () => {
    jest.spyOn(ApiCountries, "getAll").mockResolvedValue(MOCK_COUNTRIES);
    await act(async () => {
      render(<Countries />);
    });
    const searchBar = screen.getByRole("searchBar");
    await act(async () => userEvent.type(searchBar, "America"));

    expect(screen.getByText("Brazil")).toBeInTheDocument();
    expect(screen.getByText("211049527")).toBeInTheDocument();
    expect(screen.getByText("America")).toBeInTheDocument();
    expect(screen.getByText("Brasília")).toBeInTheDocument();
  });

  it("Deve renderizar a mensagem 'COUNTRY NOT FOUND'", async () => {
    jest.spyOn(ApiCountries, "getAll").mockResolvedValue(MOCK_COUNTRIES);
    await act(async () => {
      render(<Countries />);
    });
    const searchBar = screen.getByRole("searchBar");
    await act(async () => userEvent.type(searchBar, "TESTE"));

    expect(screen.getByText("COUNTRY NOT FOUND")).toBeInTheDocument();
  });

  it("Deve aplicar o filtro que exibe todos os países", async () => {
    jest.spyOn(ApiCountries, "getAll").mockResolvedValue(MOCK_COUNTRIES);
    await act(async () => {
      render(<Countries />);
    });

    const filterSelector = screen.getByRole("filterSelector");
    await act(async () => userEvent.click(filterSelector));

    const filterSelectorOption = screen.getByText("All Regions");
    await act(async () => userEvent.click(filterSelectorOption));

    expect(filterSelector.textContent).toBe("All RegionsAll Regions");
  });

  it("Deve aplicar o filtro que exibe os países da opção de região selecionada", async () => {
    const MOCK_COUNTRIES_FILTERED = [
      {
        cca3: "NGA",
        name: {
          common: "Nigeria",
          official: "Nigeria",
        },
        flags: {
          png: "Nigeria.png",
        },
        population: 2110495,
        region: "Africa",
        capital: "Abuja",
      },
    ];

    jest
      .spyOn(ApiCountries, "getByRegion")
      .mockResolvedValue(MOCK_COUNTRIES_FILTERED);

    await act(async () => {
      render(<Countries />);
    });

    const filterSelector = screen.getByRole("filterSelector");
    await act(async () => userEvent.click(filterSelector));

    const filterSelectorOption = screen.getByLabelText("Africa");
    await act(async () => userEvent.click(filterSelectorOption));

    expect(filterSelector.textContent).toBe("AfricaAfrica");
  });

  it("Deve retornar a mensagem de indisponibilidade do sistema", async () => {
    jest.spyOn(ApiCountries, "getAll").mockRejectedValueOnce("Ops!");

    await act(async () => {
      render(<Countries />);
    });

    expect(
      screen.getByText(
        "We are temporarily unable to fulfill your request due to maintenance outage or capacity issues."
      )
    ).toBeInTheDocument();
  });

  it("Deve retornar a mensagem de indisponibilidade do sistema (Com filtro aplicado) ", async () => {
    jest.spyOn(ApiCountries, "getByRegion").mockRejectedValue("Ops!");

    await act(async () => {
      render(<Countries />);
    });

    const filterSelector = screen.getByRole("filterSelector");
    await act(async () => userEvent.click(filterSelector));

    const filterSelectorOption = screen.getByLabelText("Africa");
    await act(async () => userEvent.click(filterSelectorOption));

    expect(
      screen.getByText(
        "We are temporarily unable to fulfill your request due to maintenance outage or capacity issues."
      )
    ).toBeInTheDocument();
  });
});
