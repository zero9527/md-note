import React, { useEffect, useState, useMemo, CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import styles from './mdCatalog.scss';

export interface CatalogItem {
  id: string; // 标题的id
  header: string; // 本身的id
  label: string; // 文本
  child?: CatalogItem[];
}

export interface MdCatalogProps {
  mdtext: string;
  position?: CSSProperties;
  defaultActive?: string;
  onCateClick?: (id: string) => void;
}

// 根据 markdown 字符串生成 二级标题/三级标题目录
const MdCatalog: React.FC<MdCatalogProps> = ({
  mdtext,
  position,
  defaultActive,
  onCateClick,
  ...props
}) => {
  const [showCate, setShowCate] = useState(false);
  const [cate, setCate] = useState<CatalogItem[]>([]);
  const [cateActive, setCateActive] = useState('');
  const [title, setTitle] = useState('');
  // const [allcate, setAllcate] = useState<string[]>([]);

  useEffect(() => {
    if (title) document.title += `|${title}`;
  }, [title]);

  useEffect(() => {
    if (defaultActive) setCateActive(defaultActive);
  }, [defaultActive]);

  useEffect(() => {
    generate();

    return () => {
      removeBodyClick();
    };
  }, []);

  useEffect(() => {
    function resize() {
      if (showCate) {
        const width = window.innerWidth;
        if (width < 1100) document.body.style.overflowY = 'auto';
        setShowCate(false);
        toggleBlur('remove');
      }
    }

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [showCate]);

  useEffect(() => {
    if (showCate) {
      document.body.style.overflowY = 'hidden';
      const catelogItem = document.getElementById(`catelog-${defaultActive}`);
      catelogItem?.scrollIntoView();
      addBodyClick();
    } else {
      document.body.style.overflowY = 'auto';
    }
    // eslint-disable-next-line
  }, [showCate, defaultActive]);

  const generate = () => {
    let allcateArr: string[] = [];
    const cateList: CatalogItem[] = [];
    const content = mdtext.slice(mdtext.indexOf('\n'), mdtext.length);
    setTitle(mdtext.slice(0, mdtext.indexOf('\n')));
    const cate2Arr = content.split('\n## ');

    cate2Arr.forEach(cate2 => {
      // 二级目录
      const tempcate2 = cate2.substring(0, cate2.indexOf('\n')).trim();
      const cat3Arr = cate2.split('\n### ');
      cat3Arr.shift();
      const cat2Child: CatalogItem[] = [];

      cat3Arr.forEach(cate3 => {
        // 三级目录
        const tempcate3 = cate3.substring(0, cate3.indexOf('\n')).trim();
        cat2Child.push({
          id: tempcate3,
          header: `catelog-${tempcate3}`,
          label: tempcate3
        });
      });

      const cate2Item: CatalogItem = {
        id: tempcate2,
        header: `catelog-${tempcate2}`,
        label: tempcate2,
        child: []
      };

      allcateArr.push(tempcate2);
      if (cat2Child.length > 0) {
        cate2Item.child = cat2Child;
        allcateArr = allcateArr.concat(cat2Child.map(i => i.id));
      }

      cateList.push(cate2Item);
    });

    setCate(() => cateList.filter(item => Boolean(item.id)));
    // setAllcate(allcateArr);
  };

  const cateClick = (cateItem: CatalogItem) => {
    const header = document.getElementById(cateItem.id) as HTMLElement;
    header?.scrollIntoView();

    setCateActive(cateItem.id);
    onCateClick?.(cateItem.id);
    setTimeout(() => setShowCate(false), 0);
  };

  const onCateListShow = () => {
    toggleBlur('add');
    setTimeout(() => setShowCate(true), 0);
  };

  const removeBodyClick = () => window.removeEventListener('click', handler);
  const addBodyClick = () => window.addEventListener('click', handler);

  const handler = () => {
    setShowCate(false);
    removeBodyClick();
    toggleBlur('remove');
  };

  const toggleBlur = (type: 'add' | 'remove') => {
    document.querySelector('#md-note')?.classList[type]('blur');
  };

  const renderCateItem = (cateItem: CatalogItem) => {
    const className = `${styles['cate-item']} ${
      cateActive === cateItem.id ? styles.active : ''
    }`;
    return (
      <div
        data-id={cateItem.id}
        id={cateItem.header}
        className={className}
        onClick={() => cateClick(cateItem)}
      >
        {cateItem.label}
      </div>
    );
  };

  const NoCate = () => (
    <div className={styles.desc}>
      <p>一级标题'#'为文章名，</p>
      <p>二级标题'##'为一级目录，</p>
      <p>三级标题'###'为三级目录</p>
    </div>
  );

  const cateListTransition = useMemo(() => {
    return showCate ? styles['cate-show'] : '';
  }, [showCate]);

  return ReactDOM.createPortal(
    <div className={styles.catalog} style={position}>
      <FontAwesomeIcon
        className="btn dark"
        icon={faListUl}
        onClick={onCateListShow}
      />
      <div
        className={styles.bg}
        style={{ display: showCate ? 'block' : 'none' }}
      />
      <div className={`btn dark ${styles.catelist} ${cateListTransition}`}>
        <section className={styles.head}>目录: {title}</section>
        <section className={styles['cate-content']}>
          {cate.length > 0 ? (
            cate.map((cate2: CatalogItem) => (
              <ul key={cate2.id}>
                {renderCateItem(cate2)}
                {cate2.child &&
                  cate2.child?.length > 0 &&
                  cate2.child?.map((cate3: CatalogItem) => (
                    <ul key={cate3.id}>{renderCateItem(cate3)}</ul>
                  ))}
              </ul>
            ))
          ) : (
            <NoCate />
          )}
        </section>
      </div>
      {props.children}
    </div>,
    document.body
  );
};

export default MdCatalog;
