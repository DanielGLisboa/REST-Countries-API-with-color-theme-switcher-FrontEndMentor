import style from "./Countries.module.css";
import styleDark from "./CountriesDarkMode.module.css";
import { getAll, getByRegion } from "../../services/ApiCountries";
import CountryCard from "../../Components/country-card/CountryCard";
import ErrorMessage from "../../Components/errorMessage/errorMessage";
import { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";

export default function Countries({ darkMode }) {
  const [styles, setStyles] = useState(style);
  const [response, setResponse] = useState([]);
  const [validResponse, setValidResponse] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [search, setSearch] = useState("");

  // Define o estilo com base no modo escuro ativado ou desativado
  useEffect(() => {
    if (darkMode) {
      setStyles(styleDark);
      return;
    }
    setStyles(style);
  }, [darkMode]);

  const getAllCountries = async () => {
    await getAll("/all?fields=name,flags,capital,population,region,cca3")
      ?.then((resp) => {
        setResponse(resp);
        setValidResponse(true);
      })
      ?.catch((error) => {
        setValidResponse(false);
        console.log(error);
      });
  };

  const getCountriesByRegion = async (filter) => {
    await getByRegion(
      `/region/${filter}?fields=name,flags,capital,population,region,cca3`
    )
      ?.then((resp) => {
        setResponse(resp);
        setValidResponse(true);
      })
      .catch((error) => {
        setValidResponse(false);
        console.log(error);
      });
  };

  // Obtém todos os países assim que o componente é montado
  useEffect(function () {
    getAllCountries();
  }, []);

  const regions = [
    { name: "All Regions" },
    { name: "Africa" },
    { name: "America" },
    { name: "Antarctic" },
    { name: "Asia" },
    { name: "Europe" },
    { name: "Oceania" },
  ];

  // Aplica o filtro selecionado
  function applyFilter(filter) {
    if (filter === "All Regions") {
      getAllCountries();
    } else {
      getCountriesByRegion(filter);
    }
  }

  // Filtra e mapeia os países com base nos critérios de pesquisa
  const filteredCountries = () => {
    return response?.length > 0
      ? response?.filter(
          (country) =>
            country.name.common.toLowerCase().includes(search.toLowerCase()) ||
            country.name.official
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            country.region.toLowerCase().includes(search.toLowerCase())
        )
      : "";
  };

  return validResponse ? (
    <div className={styles.content}>
      <div className={styles.divSearchAndFilter}>
        <span className={classNames(styles.inputSearch, "p-input-icon-left")}>
          <i className="pi pi-search" />
          <InputText
            role="searchBar"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search for a country..."
          />
        </span>
        <Dropdown
          role="filterSelector"
          panelClassName={styles.dropdownFilterByRegionPanel}
          className={styles.dropdownFilterByRegion}
          value={selectedRegion}
          onChange={(e) => {
            applyFilter(e.value.name);
            setSelectedRegion(e.value);
          }}
          options={regions}
          optionLabel="name"
          placeholder="Filter by Region"
        />
      </div>
      <div className={styles.cards}>
        {filteredCountries() != "" ? (
          filteredCountries().map((country) => {
            return (
              <CountryCard
                key={country?.cca3}
                darkMode={darkMode}
                name={country?.name?.common}
                flag={country?.flags?.png}
                population={country?.population}
                region={country?.region}
                capital={country?.capital}
              />
            );
          })
        ) : (
          <div>
            <h2 className={styles.cardNotFound}>COUNTRY NOT FOUND</h2>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className={styles.content}>
      <ErrorMessage darkMode={darkMode} />
    </div>
  );
}
