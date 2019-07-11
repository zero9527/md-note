import * as React from 'react';
import style from './calculator.scss'

const { useState, useEffect } = React;

// 计算器
function Caculator() {
  const [show, setShow] = useState('');
  const [result, setResult] = useState('0');
  const numList:string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const btnList:any[][] = [
    [{ type: '', label: '%'}, { type: '', label: '√' }, { type: '', label: 'x²' }, { type: '', label: '¹/x' }],
    [{ type: '', label: 'CE'}, { type: '', label: 'C' }, { type: '', label: 'DELETE' }, { type: '', label: '÷' }],
    [{ type: '', label: '7'}, { type: '', label: '8' }, { type: '', label: 'x9' }, { type: '', label: 'X' }],
    [{ type: '', label: '4'}, { type: '', label: '5' }, { type: '', label: '6' }, { type: '', label: '-' }],
    [{ type: '', label: '1'}, { type: '', label: '2' }, { type: '', label: '3' }, { type: '', label: '4' }],
    [{ type: '', label: '±'}, { type: '', label: '0' }, { type: '', label: '.' }, { type: '', label: '=' }]
  ];

  useEffect(() => {
    setResult('0');
  }, []);

  const btnClick = (btn: any) => {
    // const tempShow = show + btn;
    switch (btn.type) {
      case 'add':
        break;
      case 'minus':
        break;
      case 'X':
        break;
      case '-':
        break;
      default:
        setShow(show + btn.label);
        break;
    }
  }

  return (
    <div className={style.caculator}>
      {/* 显示 */}
      <section className={style.display}>
        <div className={style.result}>
          <section>{ show }</section>
          <section>{ result }</section>
        </div>
      </section>

      {/* 按钮 */}
      <section className={style['num-content']}>
        {
          btnList.map((btnBlock, blockindex) => {
            return (
              <div className={style['num-block']} key={blockindex}>
                {
                  btnBlock.map((btn, index) => {
                    console.log('btn: ',btn);
                    return (
                      <span 
                        key={index} 
                        className={`${style['btn-item']} ${numList.includes(btn.label) ? style['num-item'] : ''}`}
                        onTouchEnd={() => btnClick(btn)}
                      >{ btn.label }</span>
                    )
                  })
                }
              </div>
            )
          })
        }
      </section>
    </div>
  );
}

export default Caculator;
