# Node.js折腾记二：命令行交互

## 前言
> 学习`node.js`生成文件、执行脚本，使用`CI`持续集成，自动构建工具之后，想要玩玩自己写点东西试试

> * 命令行参数获取使用[commander.js](https://github.com/tj/commander.js#readme)
> * 命令行交互使用[Inquirer.js](https://github.com/SBoudrias/Inquirer.js#readme)
> * 目录树生成使用[treer](https://github.com/derycktse/treer#readme)

代码：[github地址](https://github.com/zero9527/node-test)

目录结构：
```
D:\node-test
...
├─index.js
├─sh
| └sh1.js
├─scripts
|    └generateComponent.js
├─components
|     ...
|     ├─run-sh.js
...
```

```
 D:\node-test
├─ components
    ├─ components-dir-tree1.json
    ├─ file.2.js
    ├─ file.bakeup.js
    ├─ file.js
    ├─ index.js
    ├─ log.js
    ├─ node-test-dir-tree.json
    ├─ run-sh.js
    ├─ test
      └─ aa
        ├─ bb.js
        └─ cc
    └─ timeFormat.js
├─ index.js
├─ json
    ├─ a.json
    └─ b.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ scripts
    └─ generateComponent.js
└─ sh
    └─ sh1.js

```

## 一、生成文件

### npm 命令 create:comp
```json
package.json:
{
  ...
  "scripts": {
    "create:comp": "node scripts/generateComponent --path",
  },
  ...
}
```

### 参数 --path 
这个参数的值可以通过下面获取到:
> `--path` 可以自行设置，获取的时候`[path]`将作为`key`存到`program`

```js
const program = require('commander'); // 命令参数处理
program
  .version('0.0.1')
  .option('-l --path [path]', 'list of customers in CSV file')
  .parse(process.argv);

// node scripts/generateComponents --path inputName
const inputName = program.path;
log('\ninputName: ',inputName);
```

### 命令行交互 
inquirer.js 简单使用：

* `name`：字段名, 调用then的回调参数值里可以找到匹配的name，<br />
* `message`：提示信息，<br />
* 其他的就是一些选项数据、默认值、过滤规则、校验、配置等

questions数组内一个子对象的`type`可以是：<br />
> (以下摘抄自[Inquirer.js](https://github.com/SBoudrias/Inquirer.js#readme))
> * `confirm`: yes/no，type, name, message, [, default] 属性
> * `input`: 键盘输入，type, name, message, [, default, filter, validate, transformer] 属性.
> * `number`: type, name, message, [, default, filter, validate] 属性.
> * `rawlist`: 类似于ol标签，有序列表，type, name, message, choices, [, default, filter] 属性
> * `list`: 类似于ul标签，无序列表，type, name, message, choices, [, default, filter] 属性
> * `checkbox`: 多选，type, name, message, choices, [, default, filter, validate] 属性
> * `expand`: 展开menu，type, name, message, choices, [, default] 属性
> * `password`: type, name, message, mask, [, default, filter, validate] 属性.
> * `editor`: type, name, message, mask, [, default, filter, validate] 属性.

```js
const questions = [
  {
    type: "confirm",
    name: "override",
    message: "是否覆盖？"
  }
];

inquirer.prompt(questions).then(res => {  
    if (res.override) {
      log('\n文件将被覆盖！');
      resolve(path);

    } else {
      log('\n不覆盖已有文件！');
      
    }
  });
```

更多的属性：
```js
{
  /* Preferred way: with promise */
  filter() {
    return new Promise(/* etc... */);
  },

  /* Legacy way: with this.async */
  validate: function (input) {
    // Declare function as asynchronous, and save the done callback
    var done = this.async();

    // Do async stuff
    setTimeout(function() {
      if (typeof input !== 'number') {
        // Pass the return value in the done callback
        done('You need to provide a number');
        return;
      }
      // Pass the return value in the done callback
      done(null, true);
    }, 3000);
  }
}
```

### 生成文件 
scripts/generateComponent.js:
```js
const fs = require('fs');
const path = require('path');
const program = require('commander'); // 命令参数处理
const inquirer = require('inquirer'); // 选择
const chalk = require('chalk');

const log = (...text) => console.log(...text);
const componentDir = path.resolve(__dirname, '../components');

const newComp = `
const fs = require('fs');
const path = require('path');

console.log('这是一个自动生成的component');
`;

// npm scripts不能接收参数
// 下面需要 node 运行传入参数
program
  .version('0.0.1')
  .option('-l --path [path]', 'list of customers in CSV file')
  .parse(process.argv);

// node scripts/generateComponents --path inputName
const inputName = program.path;
log('\ninputName: ',inputName);

const questions = [
  {
    type: "confirm",
    name: "override",
    message: "是否覆盖？"
  }
];

mkdir(componentDir + `\\${inputName||'noname'}`)
.then(path => {
  log('\n开始生成文件...');

  return new Promise((resolve) => {
    fs.writeFile(path+'\\index.js', newComp, 'utf-8', err => {
      if (err) throw err;
      
      log(`\n${path}\\index.js 文件创建成功！\n`);
      resolve();
    });
  });

}).catch(err => {
  throw err;
});

// 创建目录
function mkdir(path) {
  return new Promise((resolve) => {
    if (fs.existsSync(path)) {
      log(`\n${path}: 文件夹已存在`);

      // 命令行交互
      inquirer.prompt(questions).then(res => {  
        if (res.override) {
          log('\n文件将被覆盖！');
          resolve(path);

        } else {
          log('\n不覆盖已有文件！');
          
        }
      });

    } else {
      fs.mkdirSync(path);
      
      log('\n文件夹创建成功！');
      resolve(path);
    }
  })
}

module.export = {
  mkdir
}

```

### 命令行打印的提示
* 新文件

```shell
$ npm run create:comp aa

> test@1.0.0 create:comp D:\node-test
> node scripts/generateComponent --path "aa"


inputName:  aa

文件夹创建成功！

开始生成文件...

D:\node-test\components\aa\index.js 文件创建成功！
```

* 文件已存在

```shell
$ npm run create:comp aa

> test@1.0.0 create:comp D:\node-test
> node scripts/generateComponent --path "aa"


inputName:  aa

D:\node-test\components\aa: 文件夹已存在
? 是否覆盖？ No

不覆盖已有文件！
```


## 二、执行脚本
> 使用`child_process`子进程的`exec`执行脚本

> #### 以下内容，摘抄自[Node.js 中文网](http://nodejs.cn/api/child_process.html#child_process_child_process)
> 默认情况下， `stdin`、 `stdout` 和 `stderr` 的管道在父 `Node.js` 进程和衍生的子进程之间建立。 这些管道具有有限的（和平台特定的）容量。 如果子进程在没有捕获输出的情况下写入超出该限制的 `stdout`，则子进程将阻塞等待管道缓冲区接受更多的数据。 这与 `shell` 中的管道的行为相同。 如果不消费输出，则使用 `{ stdio: 'ignore' }` 选项。

> `child_process.spawn()` 方法异步地衍生子进程，且不阻塞 `Node.js` 事件循环。 `child_process.spawnSync()` 方法则以同步的方式提供等效功能，但会阻止事件循环直到衍生的进程退出或终止。

> 为方便起见， `child_process` 模块提供了 `child_process.spawn()` 和 `child_process.spawnSync()` 的一些同步和异步的替代方法。 注意，这些替代方法中的每一个都是基于 `child_process.spawn()` 或 `child_process.spawnSync()` 实现的。
> * `child_process.exec()`: 衍生一个 `shell` 并在该 `shell` 中运行命令，当完成时则将 `stdout` 和 `stderr` 传给回调函数。
> * `child_process.execFile()`: 类似于 `child_process.exec()`，除了它默认会直接衍生命令且不首先衍生 `shell`。
> * `child_process.fork()`: 衍生一个新的 `Node.js` 进程，并通过建立 IPC 通信通道来调用指定的模块，该通道允许在父进程与子进程之间发送消息。
> * `child_process.execSync()`: `child_process.exec()` 的同步版本，会阻塞 `Node.js` 事件循环。
> * `child_process.execFileSync()`: `child_process.execFile()` 的同步版本，会阻塞 `Node.js` 事件循环。
对于某些用例，例如自动化的 `shell` 脚本，同步的方法可能更方便。 但是在大多数情况下，同步的方法会对性能产生重大影响，因为它会停止事件循环直到衍生的进程完成。

### npm 命令 sh
```js
package.json:
{
  ...
  "scripts": {
    "sh": "node components/run-sh.js",
  },
  ...
}
```

### 命令生成 sh/sh1.js

> 使用npm命令时，需如上所示，在上面`package.json`中`scripts`配置好

```js
const fs = require('fs');

const isDir = dir => fs.statSync(dir).isDirectory();

/**
 * 返回相关的shell脚本
 */

 // 打印指定目录
function ls(dir=null) {
  if (dir) {
    log('dir: ', dir);
    return `cd ${dir} && ls`;
  }
  return "ls";
}

/**
 * 构建前端项目
 * @param {项目路径} dir 
 * @param {执行的 npm 命令} cmd 
 */
function buildFE(dir, cmd) {
  if (!dir || !isDir(dir) || !cmd) return;
  log('build-dir: ', dir);
  return `cd ${dir} && ${cmd}`;
}

module.exports = {
  ls,
  buildFE
}
```

### 执行脚本 
components/run-sh.js

```js
// exec 执行shell命令
const { exec } = require('child_process');
const path = require('path');
require('./log');
const timeFormat = require('./timeFormat');
const { ls, buildFE } = require('../sh/sh1.js');
// console.log('sh: ',sh);

const shdir = path.resolve(__dirname, '../sh');

// 打印指定路径目录
//exec(ls('/code/react-t1'), (err, stdout, stderr) => {
//  if (err) throw err;
//  if ( stderr) log('stderr: ', stderr);
  
//  // 执行的命令所打印的内容
//  log('stdout: ', stdout);

//  let nowTime = timeFormat({timestamp: new Date(), hasTime: true });
//  log('time: ', nowTime);
//})


let nowTime = timeFormat({timestamp: new Date(), hasTime: true });
log('start--time: ', nowTime);

exec(buildFE('/code/react-t1', 'npm run build'), (err, stdout, stderr) => {
  if (err) throw err;
  if ( stderr) log('stderr: ', stderr);

  // 执行的命令所打印的内容
  log('stdout: ', stdout);

  nowTime = timeFormat({timestamp: new Date(), hasTime: true });
  log('end--time: ', nowTime);
})

```

### 命令行打印

```shell
$ npm run sh

> test@1.0.0 sh D:\node-test
> node components/run-sh.js

==log== start--time:  2019-05-08 16:29:24
==log== build-dir:  /code/react-t1
==log== stdout:
> react-t1@0.1.0 build D:\code\react-t1
> node scripts/build.js

Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  62.73 KB  docs\static\js\4.1fe71077.chunk.js
  48.9 KB   docs\static\js\7.70929cf8.chunk.js
  14.3 KB   docs\static\js\3.fe3cf9bc.chunk.js
  13.3 KB   docs\static\js\0.e70acbb7.chunk.js
  3.22 KB   docs\static\js\1.6f7cac0f.chunk.js
  3.05 KB   docs\static\js\2.ba0e413c.chunk.js
  1.94 KB   docs\static\js\main.eb84215c.chunk.js
  1.48 KB   docs\static\js\runtime~main.ff53614d.js
  634 B     docs\static\css\main.fde90119.chunk.css
  592 B     docs\static\js\8.d5307ac7.chunk.js
  438 B     docs\static\js\9.1544082f.chunk.js
  434 B     docs\static\css\0.451ae571.chunk.css

The project was built assuming it is hosted at ./.
You can control this with the homepage field in your package.json.

The docs folder is ready to be deployed.

Find out more about deployment here:

  https://bit.ly/CRA-deploy


==log== end--time:  2019-05-08 16:29:31
==log== stderr:  { parser: "babylon" } is deprecated; we now treat it as { parser: "babel" }.

```