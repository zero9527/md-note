import * as React from 'react';
import style from './calculator.scss'

const { useState, useEffect, useMemo } = React;

interface Ibtn {
  type: string, 
  label: string
}

// 计算器
function Caculator() {
  const [showHistory, setShowHistory] = useState(false);
  const [calcHistory, setCalcHistory] =  useState(['']); // 计算历史记录
  const [show, setShow] = useState([{ type: '', label: '0' }]); // 表达式
  const [result, setResult] = useState(0); // 显示结果
  const [clearTag, setClearTag] = useState(false); // 点击等号后，初始化
  const numList:string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const btnList:Ibtn[][] = [
    [{ type: 'residue', label: '%'}, { type: 'sqrt', label: '√' }, { type: 'square', label: 'x²' }, { type: 'fraction-of', label: '¹/x' }],
    [{ type: 'CE', label: 'CE'}, { type: 'C', label: 'C' }, { type: 'DELETE', label: 'DELETE' }, { type: 'divide', label: '÷' }],
    [{ type: 'number', label: '7'}, { type: 'number', label: '8' }, { type: 'number', label: '9' }, { type: 'mul', label: 'x' }],
    [{ type: 'number', label: '4'}, { type: 'number', label: '5' }, { type: 'number', label: '6' }, { type: 'minus', label: '-' }],
    [{ type: 'number', label: '1'}, { type: 'number', label: '2' }, { type: 'number', label: '3' }, { type: 'add', label: '+' }],
    [{ type: 'pm', label: '±'}, { type: 'number', label: '0' }, { type: 'number', label: '.' }, { type: 'equal', label: '=' }]
  ];

  useEffect(() => {
    // console.log('load');
  }, []);

  useMemo(() => {
    console.log('show: ', JSON.stringify(show));
  }, [show]);

  // 点击按钮
  async function btnClick(btn: Ibtn) {
    // console.log('btn: ', btn);
    let tempShow = show;
    // 加减乘除 求余数
    const charList = ['add', 'minus', 'mul', 'divide', 'residue'];
    // 平方根，平方数，几分之一
    const oneCharList = ['sqrt', 'square', 'fraction-of'];

    // 符号：平方根，平方数，几分之一
    if (
      oneCharList.includes(btn.type) && 
      tempShow[0].label !== ''
    ) {
      // 最后一个是符号
      if (tempShow[tempShow.length-1].type !== 'number') {
        tempShow.pop();
      }
      // 计算结果
      if (
        tempShow[tempShow.length-1].type === 'number' &&
        tempShow.find(item => item.type !== 'number')
      ) {
        const temp:Ibtn = getResult();
        await setShow([temp]);
      }
      const { num0 } = divideNumberChar();

      const operate = {
        'sqrt': { // 平方根
          result: Math.sqrt(+num0),
          show: [{ type: 'number', label: `${Math.sqrt(+num0)}` }]
        },
        'square': { // 平方数
          result: +num0 * +num0,
          show: [{ type: 'number', label: `${+num0 * +num0}` }]
        },
        'fraction-of': { // 几分之一
          result: 1 / (+num0),
          show: [{ type: 'number', label: `${1 / (+num0)}` }]
        }
      }
      setResult(operate[btn.type].result);
      setShow(operate[btn.type].show);
    }

    // 符号：加减乘除，求余数
    if (
      charList.includes(btn.type) && 
      tempShow[0].type === 'number'
    ) {
      // 点击等号后，继续输入数字则重新运算，继续输入符号则保留上次运算结果
      setClearTag(false);
      if (tempShow[show.length-1].type !== 'number') { // 上一次点的也是符号，则替换
        tempShow[show.length-1] = btn;
        setShow([...tempShow]);

      } else if (tempShow.find(item => item.type !== 'number')) { // 已经有一个运算符，则计算
        const temp:Ibtn = getResult();
        setShow([temp, btn]);

      } else if (tempShow[show.length-1].label === '.') { // 上一次点击是 '.'
        tempShow.pop();
        setShow([...tempShow]);

      } else {
        tempShow.push(btn);
        setShow([...show]);
      }
    }

    // 清空
    if (btn.type === 'C') {
      tempShow.length = 0;
      setResult(0);
      setShow([{ type: '', label: '0' }]);
    }

    // 删除
    if (btn.type === 'DELETE') {
      if (tempShow.length > 1) tempShow.pop();
      else tempShow = [{ type: '', label: '0' }];
      setShow([...tempShow]);
    }

    // 数字
    if (btn.type === 'number') {
      // 点击等号后，继续输入数字则重新运算，继续输入符号则保留上次运算结果
      if (clearTag) {
        setResult(+btn.label);
        setShow([btn]);
        setClearTag(false);
        return;
      }
      if (tempShow[0].label === '0') {
        tempShow[0] = btn;
      } else {
        tempShow.push(btn);
      }
      setShow([...tempShow]);
      // 组成一个表达式
      if (
        tempShow.find(item => item.type !== 'number') &&
        tempShow[tempShow.length-1].type === 'number'
      ) {
        getResult(false);
      }
    }

    // 等号
    if (btn.type === 'equal') {
      if (
        tempShow[tempShow.length-1].type !== 'number' ||
        !tempShow.find(item => item.type !== 'number')
      ) {
        return;
      }
      getResult();
      // 点击等号后，继续输入数字则重新运算，继续输入符号则保留上次运算结果
      setClearTag(true);
    }
  }

  // 计算结果
  function getResult(updateShow:boolean = true) {
    let res:string|number = '';
    const { num0, num1, char } = divideNumberChar();

    if (char.type === 'add') res = +num0 + +num1; // 加法
    if (char.type === 'minus') res = +num0 - +num1; // 减法
    if (char.type === 'mul') res = +num0 * +num1; // 乘法
    if (char.type === 'divide') res = +num0 / +num1; // 除法
    if (char.type === 'residue') res = +num0 % +num1; // 求余数
    
    setResult(+res);
    // 更新输入显示
    if (updateShow) {
      setShow([{
        type: 'number',
        label: res+''
      }]);

      // 历史纪录
      const temp = calcHistory;
      const calcHis = show.map(item => item.label).join('');
      temp.push(`${calcHis} = ${result}`);
      setCalcHistory(temp);
    }

    return {
      type: 'number',
      label: res+''
    }
  }

  // 分离数字、符号
  function divideNumberChar() {
    // 符号
    const charIndex = show.findIndex(item => item.type !== 'number');

    if (charIndex >= 0 && charIndex !== show.length-1) { // 组成表达式
      // 分离运算的两个数字
      const num:string[][] = [
        show.slice(0, charIndex).map(item => item.label), 
        show.slice(charIndex+1, show.length).map(item => item.label)
      ];
      // 运算符
      const char:Ibtn = show.slice(charIndex, charIndex+1)[0];

      // 拼接两个数字
      const num0 = num[0].reduce((acc, cur) => acc + cur, '');
      const num1 = num[1].reduce((acc, cur) => acc + cur, '');

      return { num0, num1, char };

    } else if (charIndex < 0) { // 没有符号
      // 拼接数字
      const num0 = show.reduce((acc, cur) => acc + cur.label, '');
      return { num0, num1: '', char:{ type: '', label: '0' } };

    } else if (charIndex === show.length-1) { // 最后一个是符号
      show.pop(); // 去掉符号
      // 拼接数字
      const num0 = show.reduce((acc, cur) => acc + cur.label, '');
      return { num0, num1: '', char:{ type: '', label: '0' } };

    }
    return { num0: '', num1: '', char:{ type: 'number', label: '0' } };
  }

  return (
    <div className={style.caculator}>
      {/* 显示 */}
      <section className={style.display}>
        <div className={style.title}>
          <span>简易计算器</span>
          <span onClick={() => setShowHistory(true)}>历史纪录</span>
        </div>
        <div className={style['number-block']}>
          { 
            show.map((item, index) => {
              return (
                <span 
                  key={index} 
                  className={
                    item.type === 'number' ? style.number : style.char
                  }
                >{ item.label }</span>
              )
            })
          }
        </div>
        <div className={style.result}>{ result }</div>
        <div className={style.textinfo}>√，x²，¹/x：这几个请先输入数字再运算！</div>
      </section>

      {/* 输入历史纪录 */}
      {
        showHistory && (
          <section className={style.history}>
            <div className={style['history-content']}>
              {
                calcHistory.map((item, index) => {
                  return <div key={index}>{ item }</div>
                })
              }
              <div className={style.close} onClick={() => setShowHistory(false)}>关闭</div>
            </div>
          </section>
        )
      }

      {/* 按钮 */}
      <section className={style['num-content']}>
        {
          btnList.map((btnBlock, blockindex) => {
            return (
              <div className={style['num-block']} key={blockindex}>
                {
                  btnBlock.map((btn, index) => {
                    return (
                      <span 
                        key={index} 
                        className={`${style['btn-item']} ${numList.includes(btn.label) ? style['num-item'] : ''}`}
                        onClick={() => btnClick(btn)}
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
