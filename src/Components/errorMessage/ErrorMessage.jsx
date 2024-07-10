import style from "./ErrorMessage.module.css";
import styleDark from "./ErrorMessageDarkMode.module.css";
import { useState, useEffect } from "react";

export default function ErrorMessage({ darkMode }) {
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
    <div className={styles.content}>
      <div className={styles.errorMessage}>
        <p>
          We are temporarily unable to fulfill your request due to maintenance
          outage or capacity issues.
        </p>
        <p>Please try again later.</p>
      </div>
    </div>
  );
}
