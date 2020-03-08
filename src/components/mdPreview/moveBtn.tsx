import React, { useEffect, useState, useRef } from 'react';

export interface MoveBtnProps {
  className?: string;
  onPosChange: (param: PosParam) => void;
}

export interface PosParam {
  posBottom: number;
  posRight: number;
}

const MoveBtn: React.FC<MoveBtnProps> = ({
  className = '',
  onPosChange,
  ...props
}) => {
  const dragBtn = useRef<any>();
  const [pos, updatePos] = useState({
    posX: 0,
    posY: 0,
    posRight: 10,
    posBottom: 80
  });

  useEffect(() => {
    moveInit();

    return () => {
      dragBtn.current?.removeEventListener('touchstart', onTouchStart, {
        passive: false
      });
      dragBtn.current?.removeEventListener('touchmove', onTouchMove, {
        passive: false
      });
    };
  });

  const moveInit = () => {
    dragBtn.current = document.querySelector(`.${className}`) as HTMLDivElement;
    dragBtn.current?.addEventListener('touchstart', onTouchStart, {
      passive: false
    });
    dragBtn.current?.addEventListener('touchmove', onTouchMove, {
      passive: false
    });
  };

  const onTouchStart = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const { pageX: posX, pageY: posY } = e.touches[0];
    updatePos({ ...pos, posX, posY });
  };

  const onTouchMove = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    moveHandler(e);
  };

  const moveHandler = (e: any) => {
    const {
      posX: lastPosX,
      posY: lastPosY,
      posRight: lastPosRight,
      posBottom: lastPosBottom
    } = pos;
    const { pageX: posX, pageY: posY } = e.touches[0];
    let posRight = 0;
    let posBottom = 0;

    if (posX > 20 && posX < window.innerWidth - 20) {
      if (posX - lastPosX < 0) {
        posRight = lastPosRight + Math.abs(posX - lastPosX);
      } else {
        posRight = lastPosRight - Math.abs(posX - lastPosX);
      }
    }
    if (posY > 20 && posY < window.innerHeight - 20) {
      if (posY - lastPosY < 0) {
        posBottom = lastPosBottom + Math.abs(posY - lastPosY);
      } else {
        posBottom = lastPosBottom - Math.abs(posY - lastPosY);
      }
    }

    // 边界
    if (posX <= 20 || posX >= window.innerWidth - 20) {
      posRight = lastPosRight;
    }
    if (posY <= 20 || posY >= window.innerHeight - 20) {
      posBottom = lastPosBottom;
    }

    posBottom = Math.round(posBottom);
    posRight = Math.round(posRight);

    updatePos({ posX, posY, posBottom, posRight });
    onPosChange({ posBottom, posRight });
  };

  return <div className={`btn ${className}`} />;
};

export default MoveBtn;
