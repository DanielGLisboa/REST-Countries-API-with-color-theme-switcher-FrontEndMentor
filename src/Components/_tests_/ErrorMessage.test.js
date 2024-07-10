import { render, screen } from "@testing-library/react";
import ErrorMessage from "../errorMessage/errorMessage";

describe("Testes do componente ErrorMesage", () => {
  it("deve aplicar o modo dark no componente ", async () => {
    render(<ErrorMessage darkMode={true} />);

    expect(
      screen.getByText(
        "We are temporarily unable to fulfill your request due to maintenance outage or capacity issues."
      )
    ).toBeInTheDocument();
  });

  it("deve aplicar o modo Light no componente ", async () => {
    render(<ErrorMessage darkMode={false} />);

    expect(
      screen.getByText(
        "We are temporarily unable to fulfill your request due to maintenance outage or capacity issues."
      )
    ).toBeInTheDocument();
  });
});
