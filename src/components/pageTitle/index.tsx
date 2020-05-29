import React, { useEffect, HTMLAttributes } from 'react';

export interface PageTitleProps extends HTMLAttributes<HTMLElement> {
  pathname: string;
}

// 设置页面 title
const PageTitle: React.FC<PageTitleProps> = ({ pathname, children }) => {
  useEffect(() => {
    if (pathname.includes('/detail/')) setPageTitle('MD-NOTE|详情');
    else if (pathname.includes('/md-editor/')) setPageTitle('MD-NOTE|编辑');
    else if (pathname.includes('/note-add')) setPageTitle('MD-NOTE|添加');
    else setPageTitle('MD-NOTE');
  }, [pathname]);

  const setPageTitle = (value: string) => (document.title = value);

  return <>{children}</>;
};

export default PageTitle;
