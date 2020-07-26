import React from 'react';
import { TagItem } from '@/views/NoteList';
import styles from './styles.scss';

export interface ArticleTagProps {
  tags: TagItem[];
  currentTag: TagItem | undefined;
  className?: string;
  onTagChange: (tag?: TagItem) => void;
}

// 文章标签
const ArticleTag: React.FC<ArticleTagProps> = ({
  tags,
  currentTag,
  className,
  onTagChange,
}) => {
  const getActiveTag = (tag: TagItem) => {
    if (!currentTag && tag.name === '全部') return styles.active;
    const hasTag = tag.name.split(',').some((tag) => tag === currentTag?.name);
    return hasTag ? styles.active : '';
  };

  return (
    <div className={`${styles.tags} ${className || ''}`}>
      <span>标签：</span>
      {tags.map((tag: TagItem, index: number) => (
        <span
          key={tag.name}
          className={`${styles.tag} ${getActiveTag(tag)}`}
          title={`${tag.name}: ${tag.count}`}
          onClick={() => onTagChange(index === 0 ? undefined : tag)}
        >
          <span>{tag.name || '全部'}</span>
          <span className={styles.count}>
            {tag.count > 99 ? '99+' : tag.count}
          </span>
        </span>
      ))}
    </div>
  );
};
export default ArticleTag;
