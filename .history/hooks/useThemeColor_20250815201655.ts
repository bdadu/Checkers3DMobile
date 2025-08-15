/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import Colors from '@/constants/Colors';

type ColorCategory = keyof typeof Colors; // gray | brown | beige | white
type ColorKey<C extends ColorCategory> = keyof (typeof Colors)[C];

export function useThemeColor<C extends ColorCategory>(
  props: { value?: string },
  category: C,
  colorName: ColorKey<C>
) {
  // scheme retained only for API compatibility; palette not split by theme currently
  const colorFromProps = props.value;
  if (colorFromProps) return colorFromProps;
  return Colors[category][colorName];
}
