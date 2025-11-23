import { create } from "zustand";
import eng_messages from "../lang/eng";
import esp_messages from "../lang/esp";

const messages = {
  eng: eng_messages,
  esp: esp_messages,
};

export const useLang = create((set, get) => ({
  lang: "esp",
  setEsp: () => set(() => ({ lang: "esp" })),
  setEng: () => set(() => ({ lang: "eng" })),
  messages: () => messages[get().lang],
}));
