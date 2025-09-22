import { Provider, EnvironmentProviders, isDevMode } from '@angular/core';
import { TranslocoHttpLoader } from '@app/core/i18n/services/transloco-loader';
import {
  getBrowserCultureLang,
  getBrowserLang,
  provideTransloco,
} from '@jsverse/transloco';
import { AVAILABLE_LANGUAGES, FALLBACK_LANGUAGE } from '../constants/languages';
import { LanguageCode } from '../models/language.model';

export function provideI18n(): (Provider | EnvironmentProviders)[] {
  const initialLang = getInitialLang();

  return [
    provideTransloco({
      config: {
        availableLangs: AVAILABLE_LANGUAGES,
        defaultLang: initialLang,
        fallbackLang: FALLBACK_LANGUAGE,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ];
}

/**
 * Determines the initial language:
 * - Exact match with the browser's culture (e.g., browserCultureLang = 'en-US')
 * - Regional fallback based on prefix (e.g., getBrowserLang = 'en')
 * - Global fallback (if no match is found)
 */
function getInitialLang(): LanguageCode {
  const browserCultureLang = getBrowserCultureLang();
  const exactMatch = AVAILABLE_LANGUAGES.find(
    (lang) => lang === browserCultureLang,
  );
  if (exactMatch) return exactMatch;

  const browserLang = getBrowserLang();
  const regionalFallback = AVAILABLE_LANGUAGES.find((lang) =>
    lang.startsWith(browserLang),
  );
  if (regionalFallback) return regionalFallback;

  return FALLBACK_LANGUAGE;
}
