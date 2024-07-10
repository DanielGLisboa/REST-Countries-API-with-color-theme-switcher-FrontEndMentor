import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CountryCard from "../country-card/CountryCard";

const MOCK_NAVIGATE = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => MOCK_NAVIGATE,
}));

const MOCK_FLAG = "flags.png";
const MOCK_NAME = "Brazil";
const MOCK_POPULATION = "210 million";
const MOCK_REGION = "America";
const MOCK_CAPITAL = "Brasília";

describe("Testes do componente CountryCard", () => {
  it("deve aplicar o modo dark no componente ", async () => {
    render(<CountryCard darkMode={true} name={MOCK_NAME} />);
  });

  it("deve aplicar o modo Light no componente ", async () => {
    render(<CountryCard darkMode={false} name={MOCK_NAME} />);
  });

  it("deve navegar para a pagina de detalhes ao clicar em algum card", async () => {
    render(
      <CountryCard
        flag={MOCK_FLAG}
        name={MOCK_NAME}
        population={MOCK_POPULATION}
        region={MOCK_REGION}
        capital={MOCK_CAPITAL}
      />
    );

    const card = screen.getByRole("country-card");
    await act(async () => userEvent.click(card));

    expect(MOCK_NAVIGATE).toHaveBeenCalledWith("/country-details/Brazil");
  });
});
