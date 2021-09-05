import React, { useEffect } from 'react';
import useGlobalModel from '@/model/useGlobalModel';
import { ThemeType } from '@/theme/themeType';
import styles from './styles.scss';

interface ThemeItem {
  text: string;
  color: ThemeType;
}

const themesConfig: ThemeItem[] = [
  {
    text: '白兰',
    color: 'blue',
  },
  {
    text: '暗夜',
    color: 'dark',
  },
  {
    text: '橘橙',
    color: 'orange',
  },
  {
    text: '小红',
    color: 'red',
  },
  {
    text: '浅绿',
    color: 'green',
  },
  {
    text: '魅紫',
    color: 'purple',
  },
];

////////////////
// TODO：改成hover下拉显示的方式
///////////////

const ChangeTheme = () => {
  const { theme, setTheme } = useGlobalModel((modal) => [
    modal.theme,
    modal.setTheme,
  ]);
  useEffect(() => {
    scrollIntoView();
  }, []);

  const onThemeChange = (color: ThemeType) => {
    setTheme(color);
    scrollIntoView();
  };

  const scrollIntoView = () => {
    setTimeout(() => {
      const themeColor = document.querySelector(`.${styles.theme}`);
      themeColor?.scrollIntoView();
    }, 0);
  };

  return (
    <span>
      {themesConfig.map((item) => (
        <span
          key={item.color}
          className={`${styles.color} ${
            item.color === theme ? styles.theme : ''
          }`}
          onClick={() => onThemeChange(item.color)}
        >
          {item.text}&nbsp;
        </span>
      ))}
    </span>
  );
};

export default ChangeTheme;
