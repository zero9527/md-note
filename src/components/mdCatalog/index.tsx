import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faChevronRight } from '@fortawesome/free-solid-svg-icons';
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
    if (defaultActive) setCateActive(defaultActive);
  }, []);

  useEffect(() => {
    scroll2Item();
  }, [cateActive]);

  useEffect(() => {
    generate();
  }, []);

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
    if (useScrollTop.current) scrollHandler();
  }, [scrollTop]);

  // 滚动时，显示高亮对应区域的标题
  const scrollHandler = () => {
    try {
      allcate.forEach((item: CatalogItem) => {
        const el = document.getElementById(item.id) as HTMLElement;
        if (el) {
          const bcr = el.getBoundingClientRect();
          if (bcr.top < 20) {
            setCateActive(item.id);
          }
        } else {
          // console.log('没有元素id为： ', item.id, item);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const generate = () => {
    let allcateArr: string[] = [];
    const cateList: CatalogItem[] = [];
    const content = mdtext.slice(mdtext.indexOf('\n'), mdtext.length);
    setTitle(mdtext.slice(2, mdtext.indexOf('\n')));
    const cate2Arr = content.split('\n## ');

    cate2Arr.forEach((cate2) => {
      // 二级目录
      const tempcate2 = cate2.substring(0, cate2.indexOf('\n')).trim();
      const cat3Arr = cate2.split('\n### ');
      cat3Arr.shift();
      const cat2Child: CatalogItem[] = [];

      cat3Arr.forEach((cate3) => {
        // 三级目录
        const tempcate3 = cate3.substring(0, cate3.indexOf('\n')).trim();
        cat2Child.push({
          id: tempcate3,
          header: `catelog-${tempcate3}`,
          label: tempcate3,
        });
      });

      const cate2Item: CatalogItem = {
        id: tempcate2,
        header: `catelog-${tempcate2}`,
        label: tempcate2,
        child: [],
      };

      allcateArr.push(tempcate2);
      if (cat2Child.length > 0) {
        cate2Item.child = cat2Child;
        allcateArr = allcateArr.concat(cat2Child.map((i) => i.id));
      }

      cateList.push(cate2Item);
    });

    setCate(() => cateList.filter((item) => Boolean(item.id)));
  };

  const scroll2Item = () => {
    const catelogItem = document.getElementById(`catelog-${cateActive}`);
    catelogItem?.scrollIntoView();
    onCateClick?.(cateActive);
  };

  const cateClick = (cateItem: CatalogItem) => {
    const header = document.getElementById(cateItem.id) as HTMLElement;
    header?.scrollIntoView();

    useScrollTop.current = false;
    toggleBlur('remove');
    setCateActive(cateItem.id);
    onCateClick?.(cateItem.id);
    setTimeout(() => {
      setShowCate(false);
      useScrollTop.current = true;
    }, 0);
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

  const renderCateItem = useCallback(
    (cateItem: CatalogItem) => {
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
    },
    [cateActive]
  );

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

  return (
    <div id="catalog" className={styles.catalog}>
      <FontAwesomeIcon
        className="btn"
        icon={faListUl}
        onClick={onCateListShow}
      />
      <div
        className={styles.bg}
        style={{ display: showCate ? 'block' : 'none' }}
      />
      <div
        style={{
          marginTop: scrollTop > 50 && scrollTop > prevScrollTop ? '0' : '',
        }}
        className={`${styles.catelist} ${cateListTransition}`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
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
    </div>
  );
};

export default MdCatalog;
