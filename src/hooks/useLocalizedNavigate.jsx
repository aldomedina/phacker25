import { useNavigate } from "react-router-dom";
import { useLocale } from "./useLocale";

export const useLocalizedNavigate = () => {
  const navigate = useNavigate();
  const { locale } = useLocale();

  const localizedNavigate = (path, options) => {
    const localizedPath = locale === "en" ? `/en${path}` : path;
    navigate(localizedPath, options);
  };

  return localizedNavigate;
};
