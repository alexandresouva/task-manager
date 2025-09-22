export const SUPPORTED_LANGUAGES = [
  { id: 'en-US', label: 'English' },
  { id: 'pt-BR', label: 'Português' },
  { id: 'es-ES', label: 'Español' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['id'];

export type TranslationObject<T = unknown> = Record<string, T>;
