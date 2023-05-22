import { useRouteMatch } from "react-router-dom";
import { SUPPORTED_LANGS } from "../helpers/constants";

const useUrlLang = () => {
  const langMatch = useRouteMatch(`/:lang(${SUPPORTED_LANGS.join("|")})`);
  const lang = langMatch?.params.lang ?? "en";
  const langUrlPrefix = lang === "en" ? "" : `/${lang}`;

  return { lang, langUrlPrefix };
};

export default useUrlLang;
