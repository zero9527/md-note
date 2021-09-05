import { ThemeType } from "./themeType";
import { CssVarsThemeConfig } from './cssVars.theme';
import { CssVarsBase } from './cssVars.base';

let hasSetBaseVars = false;

/**
 * 设置css变量到html下
 * @param themeType 
 * @param wrapper 
 */
export function setThemeCssVars (themeType: ThemeType, wrapper?: HTMLElement) {
  wrapper = wrapper || document.body;
  // 只设置一次基础变量
  if (!hasSetBaseVars) {
    hasSetBaseVars = true;
    setCssVars(CssVarsBase);
  }
  const theme = CssVarsThemeConfig[themeType];
  if (!theme) return console.log(`themeType: ${themeType}未配置主题！`);
  setCssVars(theme, wrapper);
}

/**
 * 设置css变量到html下
 * @param cssVars 
 * @param wrapper 
 */
export function setCssVars (cssVars: object, wrapper?: HTMLElement) {
  wrapper = wrapper || document.body;
  Object.entries(cssVars).forEach(([key, value]) => {
    wrapper!.style.setProperty(key, value);
  });
}
