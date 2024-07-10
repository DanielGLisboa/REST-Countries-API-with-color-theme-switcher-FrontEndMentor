import style from "./Header.module.css";
import styleDark from "./HeaderDarkMode.module.css";
import { useEffect, useState } from "react";
import { classNames } from "primereact/utils";
import { ToggleButton } from "primereact/togglebutton";

export default function Header({ darkMode, setDarkMode }) {
  const [styles, setStyles] = useState(style);

  // Define o estilo com base no modo escuro ativado ou desativado
  useEffect(() => {
    if (darkMode) {
      setStyles(styleDark);
      return;
    }
    setStyles(style);
  }, [darkMode]);

  return (
    <header className={styles.header}>
      <div className={styles.title}> Where in the world?</div>
      <div className={styles.darkModeButton}>
        <ToggleButton
          data-testid="darkmodeButton"
          className={classNames(
            styles.toogleDarkMode,
            "p-button-text p-togglebutton"
          )}
          onLabel="Dark Mode"
          offLabel="Light Mode"
          onIcon="pi pi-moon"
          offIcon="pi pi-sun"
          checked={darkMode}
          onChange={(e) => {
            setDarkMode(e.value);
          }}
        />
      </div>
    </header>
  );
}
