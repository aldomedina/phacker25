import MarkdownFromFile from "../../components/MakdownFromFile/MarkdownFromFile";
import { useIntl } from "react-intl";
// import css from "./Manifiesto.module.css";

const Manifiesto = () => {
  const intl = useIntl();
  const lang = intl.locale === "es" ? "esp" : "eng";

  return (
    <div className="page-container">
      <h1 className="text-heading-primary mt3XL mb4XL text-align-center">
        {intl.formatMessage({ id: "titles.manifiesto" })}
      </h1>
      <div className="mbXL">
        <MarkdownFromFile file={`/content/${lang}/manifiesto.md`} />
      </div>
      <div className="bottom-blank" />
    </div>
  );
};

export default Manifiesto;
