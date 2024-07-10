import Header from "../header/Header";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let MOCK_DARK_MODE = false;
const MOCK_SET_DARK_MODE = jest.fn(() => {
  MOCK_DARK_MODE = !MOCK_DARK_MODE;
});
describe("Testes do componente Header", () => {
  it('deve verificar se o bottão de dark mode exibe o texto "Dark Mode" quando a propriedade darkMode for igual a true ', async () => {
    render(<Header darkMode={true} />);
    const darkmodeButton = screen.getByTestId("darkmodeButton");

    expect(darkmodeButton.textContent).toBe("Dark Mode");
  });

  it('deve verificar se o bottão de dark mode exibe o texto "Light Mode" quando a propriedade darkMode for igual a false ', async () => {
    render(<Header darkMode={false} />);
    const darkmodeButton = screen.getByTestId("darkmodeButton");

    expect(darkmodeButton.textContent).toBe("Light Mode");
  });

  it("deve verificar se o texto do botão é alterado quando clicado", async () => {
    render(<Header setDarkMode={MOCK_SET_DARK_MODE} />);

    const darkmodeButton = screen.getByTestId("darkmodeButton");
    await act(async () => userEvent.click(darkmodeButton));

    expect(MOCK_SET_DARK_MODE).toBeCalled();
    expect(MOCK_DARK_MODE).toBe(true);
  });
});
