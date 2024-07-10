import style from "./CountryDetails.module.css";
import styleDark from "./CountryDetailsDarkMode.module.css";
import { getByName, getByAlphaCode } from "../../services/ApiCountries";
import ErrorMessage from "../../Components/errorMessage/errorMessage";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";

export default function CountryDetails({ darkMode }) {
  const [styles, setStyles] = useState(style);
  const [response, setResponse] = useState();
  const [validResponse, setValidResponse] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [borders, setBorders] = useState([]);
  const [codes, setCodes] = useState([]);
  const { name } = useParams();
  const navigate = useNavigate();

  // Define o estilo com base no modo escuro ativado ou desativado
  useEffect(() => {
    if (darkMode) {
      setStyles(styleDark);
      return;
    }
    setStyles(style);
  }, [darkMode]);

  const getCountryDetailsByName = async () => {
    await getByName(
      `/name/${name}?fields=name,flags,capital,population,region,subregion,tld,currencies,languages,countries,borders`
    )
      .then((resp) => {
        setResponse(resp);
        setCurrencies(Object.values(resp?.currencies));
        setLanguages(Object.values(resp?.languages));
        setCodes(resp?.borders?.join(","));
        setValidResponse(true)
      })
      .catch((error) => {
        setValidResponse(false)
        console.log(error)
      });
  };

  const getBorderCountriesByAlphaCode = async () => {
    if (codes && codes != "") {
     await getByAlphaCode(`/alpha?codes=${codes}`)
        .then((resp) => {
          setBorders(resp);
        })
        .catch((error) => {
          console.log(error)
        });
      return;
    }
  };

  // Obter os detalhes do país pelo nome quando o componente é montado ou quando o nome muda
  useEffect(() => {
    getCountryDetailsByName();
  }, [name]);

  // Obter os países vizinhos pelos códigos alfa do país quando a resposta do país muda
  useEffect(() => {
    getBorderCountriesByAlphaCode();
  }, [response]);

  // Função para mostrar os detalhes de um país vizinho
  function showBorderDetails(name) {
    navigate(`/country-details/${name}`);
  }

  const back = () => {
    navigate("/");
  };

  return validResponse ? (
    <div className={styles.content}>
      <div>
        <Button
          onClick={back}
          className={styles.backButton}
          label="Back"
          icon="pi pi-arrow-left"
        />
      </div>
      <div className={styles.main}>
        <div
          className={styles.flag}
          style={{ backgroundImage: `url(${response?.flags?.svg})` }}
        ></div>

        <div className={styles.data}>
          <div className={styles.countryName}>{response?.name?.common}</div>
          <div className={styles.details}>
            <span className={styles.Detailsitem}>
              <b>Native Name: </b>
              {" " +
                response?.name?.nativeName?.[
                  Object.keys(response?.name?.nativeName)[0]?.toString()
                ]?.common}
            </span>
            <span className={styles.Detailsitem}>
              <b>Population:</b>
              {" " + response?.population}
            </span>
            <span className={styles.Detailsitem}>
              <b>Region:</b>
              {" " + response?.region}
            </span>
            <span className={styles.Detailsitem}>
              <b>Sub Region:</b>
              {" " + response?.subregion}
            </span>
            <span className={styles.Detailsitem}>
              <b>Capital:</b>
              {response?.capital == 0
                ? " unspecified"
                : " " + response?.capital}
            </span>
            <span className={styles.Detailsitem}>
              <b>Top Level Domain:</b>
              {response?.tld == 0 ? " unspecified" : " " + response?.tld}
            </span>
            <span className={styles.Detailsitem}>
              <b>Currencies:</b>
              {" " +
                currencies?.map((currency) => {
                  return " " + currency?.name;
                })}
            </span>
            <span className={styles.Detailsitem}>
              <b>Languages:</b>
              {" " +
                languages.map((language, index) => {
                  return " " + Object.values(languages)[index];
                })}
            </span>
          </div>
          <div className={styles.divBorderCountries}>
            <div className={styles.labelBorderCountries}>
              <span>
                <b>Border Countries: </b>
              </span>
            </div>
            <div className={styles.borderCountries}>
              {" " + borders == 0
                ? "No border countries"
                : borders?.map((border) => {
                    return (
                      <button 
                        key={border?.name}
                        className={styles.buttonBorder}
                        onClick={() => {
                          showBorderDetails(border?.name?.common);
                        }}
                      >
                        {border?.name?.common}
                      </button>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) :
  (
    <div className={styles.content}>
      <ErrorMessage darkMode={darkMode} />
    </div>
  );
}
