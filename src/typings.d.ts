/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

interface IMetrics {
  ps: number;
  pm: number;
  pl: number;
  ts: number;
  tm: number;
  tl: number;
  imgSmall: number;
  imgSmallMedium: number;
  imgMedium: number;
}

declare var global: {
  metrics: IMetrics,
  colors: any,
  isMacOS: boolean,
  os: 'ios' | 'macos' | 'android' | 'web' | 'windows'
};

declare module "*.png"

declare module "react-native-global-props"
// declare module "react-native-background-fetch"