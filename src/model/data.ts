export type NoteItem = {
  id: string;
  tag: string;
  tid: string;
  date: string;
  desc: string;
  data: string;
};

const demo = [
  {
    id: '0',
    tid: '0',
    tag: 'demo',
    date: '2020/02/01 00:00:00',
    desc: 'MD_NOTE 说明',
    data: '',
  },
  {
    id: '1',
    tid: '1',
    tag: 'demo',
    date: '2019/11/01 00:00:00',
    desc: 'Promise',
    data: '',
  },
];

const js = [
  {
    id: '2',
    tid: '0',
    tag: 'js',
    date: '2019/10/01 00:00:00',
    desc: 'amd-cmd模块化',
    data: '',
  },
  {
    id: '3',
    tid: '1',
    tag: 'js',
    date: '2019/10/01 00:00:00',
    desc: 'evt事件，观察者',
    data: '',
  },
  {
    id: '4',
    tid: '2',
    tag: 'js',
    date: '2019/10/01 00:00:00',
    desc: 'js一些总结',
    data: '',
  },
  {
    id: '5',
    tid: '3',
    tag: 'js',
    date: '2019/10/01 00:00:00',
    desc: 'promise实现',
    data: '',
  },
  {
    id: '6',
    tid: '4',
    tag: 'js',
    date: '2019/10/01 00:00:00',
    desc: '滚动加载',
    data: '',
  },
];
const wx = [
  {
    id: '6',
    tid: '0',
    tag: 'mini-program',
    date: '2019/10/01 00:00:00',
    desc: '一个豆瓣电影小程序',
    data: '',
  },
];
const nodeJS = [
  {
    id: '7',
    tid: '0',
    tag: 'node.js',
    date: '2019/10/01 00:00:00',
    desc: 'cmd-line命令行',
    data: '',
  },
  {
    id: '8',
    tid: '1',
    tag: 'node.js',
    date: '2019/10/01 00:00:00',
    desc: '目录获取',
    data: '',
  },
];
const react = [
  {
    id: '9',
    tid: '0',
    tag: 'react',
    date: '2019/10/01 00:00:00',
    desc: 'movie-db-web豆瓣电影网页',
    data: '',
  },
  {
    id: '10',
    tid: '1',
    tag: 'react',
    date: '2019/10/01 00:00:00',
    desc: 'next-js',
    data: '',
  },
  {
    id: '11',
    tid: '2',
    tag: 'react',
    date: '2019/10/01 00:00:00',
    desc: 'React-Hook',
    data: '',
  },
  {
    id: '12',
    tid: '3',
    tag: 'react',
    date: '2019/10/01 00:00:00',
    desc: 'react-keep-alive',
    data: '',
  },
  {
    id: '13',
    tid: '4',
    tag: 'react',
    date: '2019/10/01 00:00:00',
    desc: 'react-ts-template',
    data: '',
  },
];
const vue = [
  {
    id: '13',
    tid: '0',
    tag: 'vue',
    date: '2019/10/01 00:00:00',
    desc: 'uni-app-calendar',
    data: '',
  },
];
const others = [
  {
    id: '14',
    tid: '0',
    tag: 'others',
    date: '2019/10/01 00:00:00',
    desc: 'web-components',
    data: '',
  },
];

const data: NoteItem[] = [
  ...demo,
  ...js,
  ...wx,
  ...nodeJS,
  ...react,
  ...vue,
  ...others,
];

export default data;
