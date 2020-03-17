import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import useGlobalModel from '@/model/useGlobalModel';

const ChangeTheme = () => {
  const { theme, setTheme } = useGlobalModel(modal => [
    modal.theme,
    modal.setTheme
  ]);

  const onThemeChange = () => {
    const _theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(_theme);
  };

  return (
    <span onClick={onThemeChange}>
      {theme === 'light' ? (
        <FontAwesomeIcon icon={faSun} />
      ) : (
        <FontAwesomeIcon icon={faMoon} />
      )}
    </span>
  );
};

export default ChangeTheme;
