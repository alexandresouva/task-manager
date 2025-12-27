export const CUSTOM_BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export type CustomButtonSize = (typeof CUSTOM_BUTTON_SIZES)[number];
