import React, { useEffect, HTMLAttributes } from 'react';

export interface PageTitleProps extends HTMLAttributes<HTMLElement> {
  pathname: string;
}

// 设置页面 title
const PageTitle: React.FC<PageTitleProps> = ({ pathname, children }) => {
  useEffect(() => {
    if (pathname.includes('/detail/')) setPageTitle('md-note|详情');
    else if (pathname.includes('/md-editor/')) setPageTitle('md-note|编辑');
    else if (pathname.includes('/note-add')) setPageTitle('md-note|添加');
    else setPageTitle('md-note');
  }, [pathname]);

  const setPageTitle = (value: string) => (document.title = value);

  return <>{children}</>;
};

export default PageTitle;
