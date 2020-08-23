# vue/uni-app之空手撕日历

## 前言
项目需要，没有合适的轮子，所以，，，

效果（红圈部分）：
![](../static/images/vue-uni-app-1.png)

## 需求
* 日期对应星期显示
* 可选的默认选中日期
* 今天包括今天之前禁用
* 某产品的最短预定时间内禁用，如提前三天，则今天明天后天禁用
* 日期下面显示对应的价格
* 简易版：**如果要当成完全的日历，还需完善**


## 思路
* 传入年份，月份创建日历；日期价格数组；日期禁用数组
* 创建一个二维数组，第一维存放一月的周数，第二维存放一周的天数；一维的周数最多有6个数组
* 每个日期包含年月日三个属性，价格对应的日期也是年月日，禁用的日期页按照年月日，所以匹配一下就可以了
* 每月天数使用 js 原生判断，即：    
    js 中`new Date('2019/06/21')`传入一个日期，可以用来判断某个月是否有某一天。   
    **没有的话，返回下一个月一号的构造函数**；有的话返回这一天的构造函数；超出31号的则是Invalid。

    ![](../static/images/vue-uni-app-2.png)
    ```js
    // 根据传入的日期构造函数获取年月日
      getYMD(time = new Date()) {
        return {
          _year: time.getFullYear(),
          _month: time.getMonth() + 1,
          _date: time.getDate(),
        }
      },
      // 验证日期是否有效：对应的月份是否有这一天
      validDate(year, month, date) {
        let time = new Date(`${year}/${month}/${date}`);
        const { _year, _month, _date } = this.getYMD(time);
        
        return _year === year && month === _month && date === _date
      },
    ```
    生成当月天数按周分割的数组
    ```js
    // 生成一个月的天数
      generateCalendar(year, month) {
        let that = this;
        let weekLen = new Array(7).fill(''); // 一周七天
        let weekday = new Date(`${year}/${month}/01`).getDay(); // 1号星期几
        
        // 重置
        this.monthDay = [[], [], [], [], [], []];
        
        // 生成一月对齐星期的天数，一周以周日开始
        weekLen.map((item, index) => {
          that.monthDay[0].push(
            index < weekday 
            ? '' 
            : (index === weekday) 
              ? {year, month, date: 1}
              : {year, month, date: that.monthDay[0][index-1].date+1}
          );
          that.monthDay[1].push({year, month, date: index + (7 - weekday + 1)});
          that.monthDay[2].push({year, month, date: that.monthDay[1][index].date + 7});
          that.monthDay[3].push({year, month, date: that.monthDay[2][index].date + 7});
          if (
            that.monthDay[3][index].date + 7 <= 31 && 
            that.validDate(year, month, that.monthDay[3][index].date + 7)
          ) {
            that.monthDay[4].push({year, month, date: that.monthDay[3][index].date + 7});
          } else {
            that.monthDay[4].push('');
          }
          if (
            that.monthDay[4][index].date + 7 <= 31 && 
            that.validDate(year, month, that.monthDay[4][index].date + 7)
          ) {
            that.monthDay[5].push({year, month, date: that.monthDay[4][index].date + 7});
          }
        })
      }
    ```

### 遇到的问题
* 这里在安卓App上面（webview），`new Date('2019/06/21')`的参数需要用斜杠`'/'`，用短横线`new Date('2019-06-21')`的话会是 Invalid Date，貌似IOS也是只能使用`'/'`来获取，兼容性上`'/'`最靠谱了。。。


## 代码

父组件使用
```html
<cus-calendar 
    class="calendar" 
    :year="monthActive.year" 
    :month="monthActive.month" 
    :dateActiveDefault="activeDate"
    :saleList="saleList"
    :disabledDate="disabledDate"
    @check-date="checkDate" 
  />
```
其他：
```js
this.disabledDate = ['2019-06-21','2019-06-22','2019-06-23'];
this.saleList = [
    { date: '2019-06-24', price: 6188 },
    { date: '2019-06-25', price: 6188 },
    { date: '2019-06-26', price: 6188 },
    { date: '2019-07-26', price: 6188 },
    { date: '2019-06-27', price: 6188 },
    { date: '2019-06-28', price: 6188 },
  ];
```

### template
```html
<template>
  <view class="calendar-container">
    <view class="month-bg">
      {{ month }}
    </view>
    <view class="week-title">
      <text class="weekend">日</text>
      <text>一</text>
      <text>二</text>
      <text>三</text>
      <text>四</text>
      <text>五</text>
      <text class="weekend">六</text>
    </view>
    
    <view class="calendar-content">
      <view 
        v-for="(week, weekindex) in monthDay"
        :key="weekindex"
        class="week-month"
      >
        <view
          class="date"
          v-for="(date, dateindex) in week"
          :key="dateindex"
          :class="{'date-disabled': !date || beforeToday(date) || disabledDateFn(date)}"
          @tap="dateTap(date)"
        >
          <view 
            class="date-item"
            :class="{
              'date-active': showPrice(date) && isActiveDate(date),
              'date-active date-active2': !showPrice(date) && isActiveDate(date)
            }"
          >
            <text v-if="isToday(date)">今天</text>
            <text v-else>{{ date.date }}</text>
            <view class="price" v-if="showPrice(date)">¥{{ showPrice(date) }}</view>						
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
```

### js
```js
// <script>
  // 旅游产品 - 日历
  export default {
    name: 'cus-calendar',
    props: {
      theme: {
        type: String,
        default: '#F87D72'
      },
      // 日期下面的价格
      saleList: {
        type: Array,
        default: () => []
      },
      // 禁用的日期
      disabledDate: {
        type: Array,
        default: () => []
      },
      // 默认选中的日期, 如2019-06-24
      dateActiveDefault: {
        type: String,
        default: ''
      },
      year: {
        type: Number,
        default: () => new Date().getFullYear()
      },
      month: {
        type: Number,
        default: () => new Date().getMonth()+1
      }
    },
    data() {
      return {
        newYear: '',
        newMonth: '',
        monthDay: [[], [], [], [], [], []],
        dateActive: {
          year: '',
          month: '',
          date: ''
        }
      }
    },
    mounted() {
      // 默认选中
      if (this.dateActiveDefault) {
        const [year, month, date] = this.dateActiveDefault.split('-');
        this.dateActive = {
          year: +year,
          month: +month,
          date: +date
        }
      }
    },
    watch: {
      month: {
        handler(val) {
          this.newYear = this.year;
          this.newMonth = this.month;
          this.generateCalendar(this.newYear, this.newMonth);
        },
        immediate: true
      }
    },
    methods: {
      // 根据传入的日期构造函数获取年月日
      getYMD(time = new Date()) {
        return {
          _year: time.getFullYear(),
          _month: time.getMonth() + 1,
          _date: time.getDate(),
        }
      },
      // 验证日期是否有效：对应的月份是否有这一天
      validDate(year, month, date) {
        let time = new Date(`${year}/${month}/${date}`);
        const { _year, _month, _date } = this.getYMD(time);
        
        return _year === year && month === _month && date === _date
      },
      // 是否今天
      isToday({ year, month, date }) {
        let time = new Date();
        const { _year, _month, _date } = this.getYMD(time);
        
        return year === _year && month === _month && date === _date
      },
      // 今天之前
      beforeToday({ year, month, date }) {
        let time = new Date();
        const { _year, _month, _date } = this.getYMD(time);
        
        return year <= _year && month <= _month && date <= _date
      },
      // 禁用的日期
      disabledDateFn({ year, month, date }) {
        month = (month+'').padStart(2, '0');
        date = (date+'').padStart(2, '0');
        
        return this.disabledDate.includes(`${year}-${month}-${date}`);
      },
      // 是否选中
      isActiveDate({ year, month, date }) {
        const { year: _year, month: _month, date: _date } = this.dateActive;
        return year === _year && month === _month && date === _date;
      },
      // 点击有效的一天
      dateTap({ year, month, date }) {
        this.dateActive = {
          year,
          month,
          date
        };
        this.$emit('check-date', this.dateActive);
      },
      // 日期下面显示价格
      showPrice({ year, month, date }) {
        if (!year) return;
        
        month = (month+'').padStart(2, '0');
        date = (date+'').padStart(2, '0');
        
        let obj = this.saleList.find(item => item.date === `${year}-${month}-${date}`);
        return obj && obj.price
      },
      // 生成一个月的天数
      generateCalendar(year, month) {
        let that = this;
        let weekLen = new Array(7).fill(''); // 一周七天
        let weekday = new Date(`${year}/${month}/01`).getDay(); // 1号星期几
        
        // 重置
        that.monthDay = [[], [], [], [], [], []];
        
        // 生成一月对齐星期的天数，一周以周日开始
        weekLen.map((item, index) => {
          that.monthDay[0].push(
            index < weekday 
            ? '' 
            : (index === weekday) 
              ? {year, month, date: 1}
              : {year, month, date: that.monthDay[0][index-1].date+1}
          );
          that.monthDay[1].push({year, month, date: index + (7 - weekday + 1)});
          that.monthDay[2].push({year, month, date: that.monthDay[1][index].date + 7});
          that.monthDay[3].push({year, month, date: that.monthDay[2][index].date + 7});
          if (
            that.monthDay[3][index].date + 7 <= 31 && 
            that.validDate(year, month, that.monthDay[3][index].date + 7)
          ) {
            that.monthDay[4].push({year, month, date: that.monthDay[3][index].date + 7});
          } else {
            that.monthDay[4].push('');
          }
          if (
            that.monthDay[4][index].date + 7 <= 31 && 
            that.validDate(year, month, that.monthDay[4][index].date + 7)
          ) {
            that.monthDay[5].push({year, month, date: that.monthDay[4][index].date + 7});
          }
        })
      }
    }
  }
// </script>
```

### 样式
```scss
/* <style lang="scss" scoped> */
  .calendar-container {
    width: 100%;
    position: relative;
    color: #999;
  }
  .month-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    color: #f6f6f6;
    font-size: 60px;
    transform: translate(-50%, -50%);
    z-index: -1;
  }
  .week-title {
    padding: 20upx 40upx;
    display: flex;
    justify-content: space-between;
    &>text {
      flex: 1;
      text-align: center;
    }
  }
  .weekend {
    color: #F87D72;
  }
  .week-month {
    display: flex;
    justify-content: flex-start;
    padding: 20upx 40upx;
    color: #2b2b2b;
    &>.date {
      flex: 14.285% 0 0;
      text-align: center;
    }
  }
  .date-item {
    width: 60upx;
    height: 60upx;
    position: relative;
    left: 50%;
    margin-left: -30upx;
    line-height: 1;
  }
  .date-disabled {
    color: #999;
    pointer-events: none;
  }
  .price {
    color: #F87D72;
    font-size: 18upx;
  }
  .date-active {
    color: #fff;
    &::after {
      content: '';
      width: 140%;
      height: 140%;
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50px;
      background-color: linear-gradient(right, #F87D72, #F29E97);
      box-shadow: 0 6upx 16upx -6upx #F97C71;
      z-index: -1;
    }
    &>.price {
      color: #fff;
    }
  }
  .date-active2::after {
    transform: translate(-50%, -68%);
  }
/* </style> */
```