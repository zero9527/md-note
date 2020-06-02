# 一个豆瓣电影小程序

## 前言
这个小程序很简单：只包括以下功能，无广告、非盈利；只是一些信息的展示及电影排行榜、评分等

* 数据来源豆瓣电影[api](https://douban-api.uieee.com)，相关接口网上一堆，这个可以在微信小程序上面使用（记得设置合法域名）；
* 使用到的接口有：'院线热映'，'即将上映'，'Top250'，'电影详情'；
* 由于**搜索接口不可用**，这里的搜索数据是在Top250中匹配的。。。

> 侵删，请跟我说一下。。。

> **更新：**
> 2019.10.30，网页版 (React+Typescript) ，[源码](https://github.com/zero9527/Movie-DB_web)， [预览](https://zero9527.github.io/Movie-DB_web)

**可以在线体验（已发布）:**
![MovieDob](https://s1.ax1x.com/2020/06/01/tJRBWV.jpg)

**源码戳👇[这里](https://github.com/zero9527/Movie-DB)**

**项目结构：**
```
.
├── _readme
│   ├── ...
├── api
│   ├── config.js
│   ├── index.js
│   └── movie.js
├── assets
│   ├── iconfont
│   └── images
├── components
│   ├── icon-button
│   ├── loading
│   ├── search
│   └── star
├── pages
│   ├── index
│   ├── movie-detail
│   └── search-list
├── utils
│   └── util.js
├── README.md
├── app.js
├── app.json
├── app.wxss
├── project.config.json
└── sitemap.json
```

**一些页面截图：**

![MovieDob](https://s1.ax1x.com/2020/06/01/tJWn6U.md.png)


## API管理
### api封装处理
就是使用 Promise 包装一下
```js
// api/config.js
module.exports = {
  baseUrl: "https://douban-api.uieee.com"
}


// api/index.js
const ApiConfig = require('./config');

/**
 * ### 基于wx.request的api封装
 * @HttpUtil HttpUtil(url, options);
 * @param url {*} 请求地址
 * @param options.method {*} 请求方式
 * @param options.header {*} 请求头
 * @param options.data {*} 请求数据
 */
module.exports = function HttpUtil(url = '', {
  method = 'GET',
  header = {
    'content-type': 'json'
  },
  data
} = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: method,
      header: header,
      url: ApiConfig.baseUrl + url,
      data: data,
      success(res) {
        if (res.statusCode == 200) resolve(res.data);
        else reject(res.statusCode);
      },
      fail(err){
        reject(err);
      }
    });
  });
}
```

### api 使用
**模块：**
```js
// api/movie.js
const HttpUtil = require('./index.js');

export function getMovieLine(params=null) {
  return HttpUtil('/v2/movie/in_theaters', {
    data: params
  });
}

export function getMovieComing(params=null) {
  return HttpUtil('/v2/movie/coming_soon', {
    data: params
  });
}

export function getMovieTop250(params=null) {
  return HttpUtil('/v2/movie/top250', {
    data: params
  });
}

export function getMovieDetail({ id }) {
  return HttpUtil('/v2/movie/subject/'+id);
}

// 这个接口挂了。。。
export function searchMovie(params=null) {
  return HttpUtil('/v2/search', {
    data: params
  });
}
```

**组件使用：**
```js
// pages/movie-detail/movie-detail.js
const Api = require('../../api/movie.js');

Api.getMovieDetail({
  id: '1'
}).then(res => {
  // ...
}).catch(err => {
  // ...
});
```


## 数据监听
observers，[官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/observer.html)
```js
// components/search/search.js
// loading
Component({
  properties: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      data: ''
    }
  },
  data: {
    inputValue: '',
    inputTimer: null,
    showClearIcon: false
  },
  ready() {},
  observers: {
    'value': function(value) {
      this.setData({
        inputValue: value
      })
    },
    'inputValue': function(inputValue) {
      this.setData({ showClearIcon: inputValue !== '' });
    }
  },
  methods: {
    input(e) {
      const input = e.detail.value;
      if (this.data.inputTimer) clearTimeout(this.data.inputTimer);
      const timer = setTimeout(() => {
        this.triggerEvent('change', input)
      }, 500);
      this.setData({
        inputValue: input,
        inputTimer: timer
      });
    },
    confirm(e) {
      const input = e.detail.value;
      this.triggerEvent('confirm', input);
    },
    clear() {
      this.setData({
        inputValue: ''
      })
    }
  }
});
```


## 版本更新
```js
// app.js
const Api = require('./api/movie.js');

App({
  onLaunch() {
    if (wx.canIUse("getUpdateManager")) {
      this.checkUpdate();
    } else {
      wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用版本更新！"
      });
    }
  },
  // 检查新版本
  checkUpdate() {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showModal({
        title: "提示",
        content: "版本更新失败，请清除缓存后再试！"
      });
    })
  },
  // ...
})
```


## 分享
可以手动触发(使用button open-type)，也可以默认触发（点击右上角三个点）

![MovieDob](https://s1.ax1x.com/2020/06/01/tJW07d.md.png)

```js
// pages/movie-detail/movie-detail.js

Page({
  // ...
  onShareAppMessage() {
    return {
      title: `${this.data.movieInfo.title}|介绍、评分`,
      imageUrl: this.data.movieInfo.images.medium,
      path:`pages/movie-detail/movie-detail?id=${this.data.id}`
    };
  }
})
```


## 说明
* 忽略的文件(project.config.json) 

> 设置的文件/文件夹不会被上传到微信服务器（使用开发者工具上传代码会有提示哪些文件不上传），如 `_readme` 中存放一些 `README.md` 的引用文件

```js
// project.config.json
"packOptions": {
  "ignore": [
    {
      "type": "folder",
      "value": "_readme"
    }
  ]
},
```


## 最后
就这样
