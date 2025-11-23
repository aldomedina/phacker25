import MarkdownFromFile from "../../components/MakdownFromFile/MarkdownFromFile";
import { useIntl } from "react-intl";
// import css from "./Convocatoria.module.css";

const Conducta = () => {
  const intl = useIntl();
  const lang = intl.locale === "es" ? "esp" : "eng";

  return (
    <div className="page-container">
      <h1 className="text-heading-primary mt2XL mb4XL">
        {intl.formatMessage({ id: "titles.codigo" })}
      </h1>

      <div className="mbXL">
        <MarkdownFromFile file={`/content/${lang}/codigo-de-conducta.md`} />
      </div>

      <div className="bottom-blank" />
    </div>
  );
};

export default Conducta;
