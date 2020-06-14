import React from 'react';
import useGlobalModel from '@/model/useGlobalModel';
import styles from './styles.scss';

interface ThemeItem {
  text: string;
  color: string;
}

const ChangeTheme = () => {
  const { theme, setTheme } = useGlobalModel((modal) => [
    modal.theme,
    modal.setTheme,
  ]);
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
      text: '媚紫',
      color: 'purple',
    },
  ];

  const onThemeChange = (color: string) => {
    setTheme(color);
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
