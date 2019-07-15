import { dateFormate } from './utils';

describe('测试 utils.ts 的函数', () => {
  it('测试 dateFormate 函数', () => {
    expect(dateFormate({
      timeStamp: Date.now()
    })).toBe('string')
  })
})
