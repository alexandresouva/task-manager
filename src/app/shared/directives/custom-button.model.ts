export const CUSTOM_BUTTON_TYPES = [
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'accent',
  'ghost',
  'link',
] as const;

export type CustomButtonType = (typeof CUSTOM_BUTTON_TYPES)[number];
