import style from "./CountryCard.module.css";
import styleDark from "./CountryCardDarkMode.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { classNames } from "primereact/utils";

export default function CountryCard({
  darkMode,
  flag,
  name,
  population,
  region,
  capital,
}) {
  const [styles, setStyles] = useState(style);

  // Define o estilo com base no modo escuro ativado ou desativado
  useEffect(() => {
    if (darkMode == true) {
      setStyles(styleDark);
      return;
    }
    setStyles(style);
  }, [darkMode]);

  const navigate = useNavigate();

  // Função para mostrar os detalhes do país
  function showCountryDetails(name) {
    navigate(`/country-details/${name}`);
  }

  const header = <img alt="Card" src={flag} className={styles.cardHeaderImg} />;

  const nameSplit = name.split(",");

  return (
    <Card
      role="country-card"
      onClick={() => {
        showCountryDetails(name);
      }}
      title={nameSplit[0]}
      subTitle={nameSplit[1]}
      header={header}
      className={classNames(styles.card)}
    >
      <p>
        <b>Population: </b>
        {population}
      </p>
      <p>
        <b>Region: </b>
        {region}
      </p>
      <p>
        <b>Capital: </b> {capital}
      </p>
    </Card>
  );
}
