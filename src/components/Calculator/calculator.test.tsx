import * as React from 'react';
import * as ReactDom from 'react-dom'
import Calculator from './index'

it('正常渲染', () => {
  const div = document.createElement('div');
  ReactDom.render(<Calculator />, div);
  ReactDom.unmountComponentAtNode(div);
})