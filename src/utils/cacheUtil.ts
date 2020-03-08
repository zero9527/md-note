export interface CacheUtilsProps {
  type?: 'localStorage' | 'sessionStorage';
  cacheKey: string;
  version: string;
}

/**
 * 带版本的缓存管理
 * @param type {*} 'localStorage' | 'sessionStorage'
 * @param version {*} 缓存版本
 * @param cacheKey {*} 缓存的数据key
 * @param data {*} 缓存的数据
 */
export interface CacheUtil {
  cacheKey: string;
  localVersion: string;
  getData: <T>() => T | null;
  setData: <T>(data: T) => void;
  updateVersion: (version: string) => void;
  clear: () => void;
}
export function cacheUtil({
  type = 'localStorage',
  cacheKey,
  version
}: CacheUtilsProps) {
  let localVersion = version;

  // 修改缓存版本
  function updateVersion(v: string) {
    localVersion = v;
    const temp = window[type].getItem(cacheKey);
    const oldVersion = temp ? JSON.parse(temp).version : version;
    if (oldVersion !== localVersion) window[type].removeItem(cacheKey);
  }

  // 获取
  function getData<T>() {
    const temp = window[type].getItem(cacheKey);
    return temp ? (JSON.parse(temp).data as T) : null;
  }

  // 设置
  function setData<T>(data: T) {
    const temp = { version: localVersion, data };
    window[type].setItem(cacheKey, JSON.stringify(temp));
  }

  // 清缓存
  function clear() {
    window[type].removeItem(cacheKey);
  }

  return {
    cacheKey,
    localVersion,
    getData,
    setData,
    updateVersion,
    clear
  };
}
