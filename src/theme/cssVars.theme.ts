import { ThemeConfig } from "./themeType";
import { CssVarsLight, CssVarsDark } from './cssVars.base';

// 白兰主题
const blue = {
  ...CssVarsLight,
  '--statusBarColor': '#5098e4',
  '--primaryColor': 'rgba(80, 152, 228, 0.8)',
  '--primaryColorLight': 'rgba(80, 152, 228, 0.6)',
  '--primaryColorHeavy': 'rgba(80, 152, 228, 1)',
  '--primaryBgColor': 'rgba(80, 152, 228, 0.05)',
};

// 暗夜
const dark = {
  ...CssVarsDark,
  '--statusBarColor': '#1e1f21',
  '--primaryColor': 'rgba(228, 149, 80, 0.8)',
  '--primaryColorLight': 'rgba(228, 149, 80, 0.6)',
  '--primaryColorHeavy': 'rgba(228, 149, 80, 1)',
  '--primaryBgColor': 'rgba(228, 149, 80, 0.05)',
};

// 橘橙
const orange = {
  ...CssVarsLight,
  '--statusBarColor': '#e49550',
  '--primaryColor': 'rgba(228, 149, 80, 0.8)',
  '--primaryColorLight': 'rgba(228, 149, 80, 0.6)',
  '--primaryColorHeavy': 'rgba(228, 149, 80, 1)',
  '--primaryBgColor': 'rgba(228, 149, 80, 0.05)',
};

// 小红
const red = {
  ...CssVarsLight,
  '--statusBarColor': '#e45250',
  '--primaryColor': 'rgba(228, 82, 80, 0.8)',
  '--primaryColorLight': 'rgba(228, 82, 80, 0.6)',
  '--primaryColorHeavy': 'rgba(228, 82, 80, 1)',
  '--primaryBgColor': 'rgba(228, 82, 80, 0.05)',
};

// 浅绿
const green = {
  ...CssVarsLight,
  '--statusBarColor': '#009688',
  '--primaryColor': 'rgba(0, 150, 136, 0.8)',
  '--primaryColorLight': 'rgba(0, 150, 136, 0.6)',
  '--primaryColorHeavy': 'rgba(0, 150, 136, 1)',
  '--primaryBgColor': 'rgba(0, 150, 136, 0.05)',
};

// 魅紫
const purple = {
  ...CssVarsLight,
  '--statusBarColor': '#c625ef',
  '--primaryColor': 'rgba(198, 37, 239, 0.8)',
  '--primaryColorLight': 'rgba(198, 37, 239, 0.6)',
  '--primaryColorHeavy': 'rgba(198, 37, 239, 1)',
  '--primaryBgColor': 'rgba(198, 37, 239, 0.05)',
};

/**
 * 导出所有主题配置
 */
export const CssVarsThemeConfig: ThemeConfig = {
  blue,
  dark,
  orange,
  red,
  green,
  purple,
};
