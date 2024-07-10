import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CountryDetails from "../country-details/CountryDetails";
import * as ApiCountries from "../../services/ApiCountries";


const MOCK_NAVIGATE = jest.fn();

const MOCK_PARAMS = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => MOCK_NAVIGATE,
  useParams: () => MOCK_PARAMS,
}));

const MOCK_COUNTRY_DETAILS = {
  flags: {
    png: "flagcdn.png",
    svg: "flagcdn.svg",
    alt: "Alt",
  },
  name: {
    common: "Brazil",
    official: "Federative Republic of Brazil",
    nativeName: {
      por: {
        official: "República Federativa do Brasil",
        common: "Brasil",
      },
    },
  },
  tld: [".br"],
  currencies: {
    BRL: {
      name: "Brazilian real",
      symbol: "R$",
    },
  },
  capital: ["Brasília"],
  region: "Americas",
  subregion: "South America",
  languages: {
    por: "Portuguese",
  },
  borders: ["ARG"],
  population: 212559409,
};

const MOCK_COUNTRY_DETAILS_SOME_EMPTY_DETAILS = {
  flags: {
    png: "flagcdn.png",
    svg: "flagcdn.svg",
    alt: "Alt",
  },
  name: {
    common: "Brazil",
    official: "Federative Republic of Brazil",
    nativeName: {
      por: {
        official: "República Federativa do Brasil",
        common: "Brasil",
      },
    },
  },
  tld: [],
  currencies: {
    BRL: {
      name: "Brazilian real",
      symbol: "R$",
    },
  },
  capital: [],
  region: "Americas",
  subregion: "South America",
  languages: {
    por: "Portuguese",
  },
  borders: ["BRA"],
  population: 212559409,
};

const MOCK_BORDER_COUNTRIES = [
  {
    name: {
      common: "Argentina",
      official: "Argentine Republic",
      nativeName: {
        grn: {
          official: "Argentine Republic",
          common: "Argentina",
        },
        spa: {
          official: "República Argentina",
          common: "Argentina",
        },
      },
    },
    tld: [".ar"],
    currencies: {
      ARS: {
        name: "Argentine peso",
        symbol: "$",
      },
    },
    capital: ["Buenos Aires"],
    region: "Americas",
    subregion: "South America",
    languages: {
      grn: "Guaraní",
      spa: "Spanish",
    },
    borders: ["BOL", "BRA", "CHL", "PRY", "URY"],
    flag: "🇦🇷",
    population: 45376763,
  },
];

describe("Testes da Página country details", () => {
  it("deve aplicar o modo dark no componente ", async () => {
    render(<CountryDetails darkMode={true} />);
  });

  it("deve aplicar o modo Light no componente ", async () => {
    render(<CountryDetails darkMode={false} />);
  });
  it("Deve navegar de volta para a página countries", async () => {
    await act(async () => {
      render(<CountryDetails />);
    });

    const backButton = screen.getByText("Back");
    await act(async () => userEvent.click(backButton));

    expect(MOCK_NAVIGATE).toHaveBeenCalledWith("/");
  });

  it("Deve exibir os detalhes do país", async () => {
    jest
      .spyOn(ApiCountries, "getByName")
      .mockResolvedValueOnce(MOCK_COUNTRY_DETAILS);
    jest
      .spyOn(ApiCountries, "getByAlphaCode")
      .mockResolvedValueOnce(MOCK_BORDER_COUNTRIES);
    await act(async () => {
      render(<CountryDetails />);
    });

    expect(screen.getByText("Brazil")).toBeInTheDocument();
    expect(screen.getByText("Brasil")).toBeInTheDocument();
    expect(screen.getByText("212559409")).toBeInTheDocument();
    expect(screen.getByText("Americas")).toBeInTheDocument();
    expect(screen.getByText("Brasília")).toBeInTheDocument();
    expect(screen.getByText(".br")).toBeInTheDocument();
    expect(screen.getByText("Brazilian real")).toBeInTheDocument();
    expect(screen.getByText("Portuguese")).toBeInTheDocument();
    expect(screen.getByText("Brazilian real")).toBeInTheDocument();
  });

  it("Deve exibir os detalhes do país (Sem capital e top level domain)", async () => {
    jest
      .spyOn(ApiCountries, "getByName")
      .mockResolvedValueOnce(MOCK_COUNTRY_DETAILS_SOME_EMPTY_DETAILS);
    jest
      .spyOn(ApiCountries, "getByAlphaCode")
      .mockResolvedValueOnce(MOCK_BORDER_COUNTRIES);
    await act(async () => {
      render(<CountryDetails />);
    });

    expect(screen.getByText("Brazil")).toBeInTheDocument();
    expect(screen.getByText("Brasil")).toBeInTheDocument();
    expect(screen.getByText("212559409")).toBeInTheDocument();
    expect(screen.getByText("Americas")).toBeInTheDocument();
    expect(screen.getByText("Brazilian real")).toBeInTheDocument();
    expect(screen.getByText("Portuguese")).toBeInTheDocument();
    expect(screen.getByText("Brazilian real")).toBeInTheDocument();
  });

  it("Deve exibir uma mensagem de indisponibilidade do sistema (funçao getByName)", async () => {
    jest.spyOn(ApiCountries, "getByName").mockRejectedValueOnce("Ops!");
    await act(async () => {
      render(<CountryDetails />);
    });

    expect(
      screen.getByText(
        "We are temporarily unable to fulfill your request due to maintenance outage or capacity issues."
      )
    ).toBeInTheDocument();
  });

  it("Deve exibir a informação de que não há países fronteiriços", async () => {
    jest
      .spyOn(ApiCountries, "getByName")
      .mockResolvedValueOnce(MOCK_COUNTRY_DETAILS_SOME_EMPTY_DETAILS);
    jest
      .spyOn(ApiCountries, "getByAlphaCode")
      .mockRejectedValueOnce("Ops border invalido!");
    await act(async () => {
      render(<CountryDetails />);
    });

    expect(screen.getByText("No border countries")).toBeInTheDocument();
  });

  it("Deve navegar novamente para a página de detalhes passandou outro Country Name como parâmetro", async () => {
    jest
      .spyOn(ApiCountries, "getByName")
      .mockResolvedValueOnce(MOCK_COUNTRY_DETAILS);
    jest
      .spyOn(ApiCountries, "getByAlphaCode")
      .mockResolvedValueOnce(MOCK_BORDER_COUNTRIES);
    await act(async () => {
      render(<CountryDetails />);
    });

    await act(async () => {
      await act(async () => userEvent.click(screen.getByText("Argentina")));
    });

    expect(MOCK_NAVIGATE).toHaveBeenCalledWith("/country-details/Argentina");
  });
});
