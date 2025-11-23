import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import Router from "./components/Router";
import useDynamicVH from "./utils/useDynamicVH";
import { LocaleProvider, useLocale } from "./hooks/useLocale";

import esp_messages from "./lang/esp";
import eng_messages from "./lang/eng";

import "./styles/reset.css";
import "./styles/tokens.css";
import "./styles/globals.css";
import "./styles/utilities";

const messages = {
  es: esp_messages,
  en: eng_messages,
};

function AppContent() {
  const { locale } = useLocale();

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Router />
    </IntlProvider>
  );
}

function App() {
  useDynamicVH();

  return (
    <BrowserRouter>
      <LocaleProvider>
        <AppContent />
      </LocaleProvider>
    </BrowserRouter>
  );
}

export default App;
