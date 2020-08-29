const isEnvDev = process.env.NODE_ENV === 'development';

// systemjs-importmap 的配置，通过webpack给html用
const maplist = [
  {
    name: 'root-config',
    entry: '/js/app.js',
  },
  {
    name: '@vue-mf/calendar',
    entry: isEnvDev
      ? '//zero9527.site/vue-calendar/js/app.js' // '//localhost:2333/js/app.js'
      : '//zero9527.site/vue-calendar/js/app.js',
  },
  {
    name: '@vue-mf/clock',
    entry: isEnvDev
      ? '//zero9527.site/vue-clock/js/app.js' // '//localhost:2333/js/app.js'
      : '//zero9527.site/vue-clock/js/app.js',
  },
];

if (!isEnvDev) {
  const libs = [
    {
      name: 'react',
      entry: '/libs/react-16.13.1.min.js',
    },
    {
      name: 'react-dom',
      entry: '/libs/react-dom-16.13.1.min.js',
    },
    {
      name: 'react-router',
      entry: '/libs/react-router-5.1.2.min.js',
    },
    {
      name: 'highlight.js',
      entry: '/libs/highlight.js-10.1.0.min.js',
    },
  ];
  maplist.push(...libs);
}

module.exports = maplist;
