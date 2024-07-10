import Header from "./Components/header/Header";
import Countries from "./Pages/countries/Countries";
import CountryDetails from "./Pages/country-details/CountryDetails";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";

import { useEffect, useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [style, setStyle] = useState("page");

  const html = document.querySelector("#html");

  useEffect(() => {
    if (darkMode) {
      setStyle("pageDark");
      html.classList.remove("html");
      html.classList.add("htmlDark");
      return;
    }
    setStyle("page");
    html.classList.remove("htmlDark");
    html.classList.add("html");
  }, [darkMode]);

  return (
    <div role="page" className={style}>
      <header>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      </header>
      <main className="main">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Countries darkMode={darkMode} />} />
            <Route
              path="/country-details/:name"
              element={<CountryDetails darkMode={darkMode} />}
            />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
