import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useHistory, useLocation } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import StickyRight from '@/components/StickyRight';
import useScroll from '@/utils/useScroll';
import styles from './styles.scss';

export interface CatalogItem {
  id: string; // 标题的id
  header: string; // 本身的id
  label: string; // 文本
  child?: CatalogItem[];
}

export interface MdCatalogProps {
  mdtext: string;
  defaultActive?: string;
  onCateClick?: (id: string) => void;
  onGetTitle?: (title: string) => void;
}

// 根据 markdown 字符串生成 二级标题/三级标题目录
const MdCatalog: React.FC<MdCatalogProps> = ({
  mdtext,
  defaultActive,
  onCateClick,
  onGetTitle,
  ...props
}) => {
  const history = useHistory();
  const location = useLocation();
  const { scrollTop, prevScrollTop } = useScroll();
  const useScrollTop = useRef(true);
  const [showCate, setShowCate] = useState(false);
  const [cate, setCate] = useState<CatalogItem[]>([]);
  const [cateActive, setCateActive] = useState('');
  const [title, setTitle] = useState('');
  const [allcate, setAllcate] = useState<CatalogItem[]>([]);

  useEffect(() => {
    if (title) {
      document.title = `MD-NOTE|${title}`;
      onGetTitle?.(title);
    }
  }, [title]);

  useEffect(() => {
    setTitle(mdtext.slice(2, mdtext.indexOf('\n')));
    setCate(generateCate(mdtext));
  }, []);

  useEffect(() => {
    if (defaultActive) setCateActive(defaultActive);
  }, [defaultActive]);

  useEffect(() => {
    if (showCate) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  }, [showCate]);

  useEffect(() => {
    // 铺平数据，用于 scrollHandler
    function flat(arr: any[]) {
      const list: any[] = [];
      arr.forEach((item) => {
        if (item?.child?.length) list.push(item, ...flat(item.child));
        else list.push(item);
      });
      return list;
    }
    setAllcate(flat(cate));
  }, [cate]);

  useEffect(() => {
    if (useScrollTop.current) setTimeout(scrollHandler, 0);
  }, [scrollTop]);

  // 滚动时，显示高亮对应区域的标题
  const scrollHandler = () => {
    try {
      const activeItem = allcate.reverse().find((item: CatalogItem) => {
        const el = document.getElementById(item.id) as HTMLElement;
        const bcr = el?.getBoundingClientRect();
        return bcr?.top < 30 && bcr?.bottom > 0;
      });
      if (activeItem) {
        setCateActive(activeItem.id);
        scroll2Item(activeItem);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 生成目录
  const generateCate = (
    text: string,
    splitChar: string = '\n##',
    list: CatalogItem[] = []
  ) => {
    // 最多到四级标题h4 ####
    if (splitChar === '\n#####') return [];
    const cateList: CatalogItem[] = [];
    const content = text.slice(text.indexOf('\n'), text.length);
    const cateArr = content.split(`${splitChar} `);
    cateArr.shift();

    cateArr.forEach((cate) => {
      // 替换前后空格，清除转义"\"反斜杠
      const id = cate
        .substring(0, cate.indexOf('\n'))
        .replace(/\\/g, '')
        .trim();
      const cateItem: CatalogItem = {
        id,
        header: `catelog-${id}`,
        label: id,
        child: [],
      };

      const cateItemChild = generateCate(cate, `${splitChar}#`);
      if (cateItemChild.length) cateItem.child = cateItemChild;

      cateList.push(cateItem);
    });
    return list.concat(cateList);
  };

  const scroll2Item = (activeItem: CatalogItem) => {
    // if (!useScrollTop.current) return;
    const catelogItem = document.getElementById(`catelog-${activeItem.id}`);
    catelogItem?.scrollIntoView({ block: 'center' });
    replaceUrlHref(activeItem.id);
  };

  const cateClick = (cateItem: CatalogItem) => {
    useScrollTop.current = false;
    toggleBlur('remove');
    setCateActive(cateItem.id);
    replaceUrlHref(cateItem.id);
    onCateClick?.(cateItem.id);
    setTimeout(() => {
      setShowCate(false);
      useScrollTop.current = true;
    }, 0);
  };

  const replaceUrlHref = (hash: string) => {
    history.replace({ pathname: location.pathname, hash });
  };

  const onCateListShow = () => {
    toggleBlur('add');
    setTimeout(() => setShowCate(true), 0);
  };

  const onHiddenCatalog = () => {
    setShowCate(false);
    toggleBlur('remove');
  };

  const toggleBlur = (type: 'add' | 'remove') => {
    document.querySelector('#md-note')?.classList[type]('blur');
  };

  const renderCatelog = useCallback(
    (_cate: CatalogItem[], level: number) => {
      return _cate.map((cate: CatalogItem, index: number) => (
        <ul className={styles[`header-${level}`]} key={cate.id}>
          {renderCateItem(cate, index)}
          {cate.child && cate.child.length > 0 && (
            <li>{renderCatelog(cate.child, level + 1)}</li>
          )}
        </ul>
      ));
    },
    [cate, cateActive]
  );

  const renderCateItem = useCallback(
    (cateItem: CatalogItem, index: number) => {
      const className = `${styles['cate-item']} ${
        cateActive === cateItem.id ? styles.active : ''
      }`;
      return (
        <li
          key={`${cateItem.id}-${index}`}
          data-id={cateItem.id}
          id={cateItem.header}
          title={cateItem.id}
          className={className}
          onClick={() => cateClick(cateItem)}
        >
          {cateItem.label}
        </li>
      );
    },
    [cateActive]
  );

  const NoCate = () => (
    <div className={styles.desc}>
      <p>一级标题'#'为文章名，</p>
      <p>二级标题'##'为一级目录，</p>
      <p>三级标题'###'为三级目录</p>
      <p>四级标题'####'为四级目录</p>
    </div>
  );

  const cateListTransition = useMemo(() => {
    return showCate ? styles['cate-show'] : '';
  }, [showCate]);

  return (
    <StickyRight id="catalog" className={styles.catalog}>
      <div className={`btn ${styles.icon}`} onClick={onCateListShow}>
        <FontAwesomeIcon icon={faListUl} />
      </div>
      <div
        className={styles.bg}
        style={{ display: showCate ? 'block' : 'none' }}
      />
      <div
        className={`${styles.catelist} ${cateListTransition}`}
        style={{
          marginTop: scrollTop > 50 && scrollTop > prevScrollTop ? '0' : '',
        }}
      >
        {showCate && (
          <span className={styles.close} onClick={onHiddenCatalog}>
            <FontAwesomeIcon icon={faChevronRight} />
          </span>
        )}
        <section className={styles.head} title={title}>
          目录: {title}
        </section>
        <section className={styles['cate-content']}>
          {cate.length > 0 ? renderCatelog(cate, 2) : <NoCate />}
        </section>
      </div>
      {props.children}
    </StickyRight>
  );
};

export default MdCatalog;
