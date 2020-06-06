const isEnvDev = process.env.NODE_ENV === 'development';

// systemjs-importmap 的配置，通过webpack给html用
module.exports = [
  {
    name: 'root-config',
    entry: './js/main.chunk.js',
  },
  {
    name: '@vue-mf/calendar',
    entry: isEnvDev
      ? 'http://zero9527.site/vue-calendar/js/app.js' // '//localhost:2333/js/app.js'
      : 'http://zero9527.site/vue-calendar/js/app.js',
  },
];
