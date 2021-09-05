
export type ThemeType = 'blue' 
  | 'red' 
  | 'orange' 
  | 'green' 
  | 'purple' 
  | 'dark';

export type ThemeValue = {
  [cssVars: string]: string;
};

export type ThemeConfig = Record<ThemeType, ThemeValue>;
