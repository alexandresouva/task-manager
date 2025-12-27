export const CUSTOM_BUTTON_APPEARANCES = [
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'accent',
  'ghost',
  'link',
] as const;

export type CustomButtonAppearance = (typeof CUSTOM_BUTTON_APPEARANCES)[number];
