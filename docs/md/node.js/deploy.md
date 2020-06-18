# Node.js写一个前端项目部署脚本

> 未完：正在完善发布到 npm 的版本

## 前言
部署流程：
- 打包：执行 `shell` 脚本打包项目
- 压缩：打包完成后将文件压缩
- 连接服务器：`ssh` 连接服务器
- 上传代码：进入项目目录后上传文件
- 备份旧的项目文件（暂无）
- 解压缩项目文件


![部署动画](https://s1.ax1x.com/2020/06/14/NS9ffK.gif)

## deploy 目录的结构
```
.
├── buildDist.js
├── compressDist.js
├── deploy-config.json
├── deploy.js
├── index.js
└── textConsole.js
```


## 部署脚本入口
```js
// deploy/index.js
'use strict';

/**
 * 自动部署项目
 */
const fs = require('fs');
const path = require('path');
const { textTitle, textInfo } = require('./textConsole');
const buildDist = require('./buildDist');
const compressDist = require('./compressDist');
const deploy = require('./deploy');

/* =================== 0、获取配置 =================== */
function getConfig() {
  const configFile = path.resolve(process.cwd(), './deploy-config.json');
  if (!fs.existsSync(configFile)) {
    textError('deploy-config.json 不存在！');
    textInfo(`请先增加 deploy-config.json 如下：
    {
      "local": {
        "distDir": "./docs",
        "distZip": "./dist.zip"
      },
      "server": {
        "host": "服务器IP",
        "username": "服务器用户名",
        "password": "对应用户名的密码",
        "distDir": "项目路径",
        "distZipName": "上传的压缩文件名"
      }
    }`);
    process.exit(1);
  }
  let config = fs.readFileSync(configFile);
  if (config) config = JSON.parse(config);
  else {
    textError('deploy-config.json配置不正确！');
    process.exit(1);
  }
  return config;
}
/* =================== 1、项目打包 =================== */

/* =================== 2、项目压缩 =================== */

/* =================== 3、连接服务器 =================== */

/* =================== 4、部署项目 =================== */

/**
 * promisfy 会自动给包裹的函数添加一个参数，next，作为后续执行的回调
 */

async function start() {
  const CONFIG = getConfig();
  textTitle('======== 自动部署项目 ========');
  textInfo('');

  // 部署环境，选择
  // 备份服务器上旧项目文件，选择

  await buildDist('yarn', ['build']);
  await compressDist(CONFIG.local);
  await deploy(CONFIG.local, CONFIG.server);
  process.exit();
}

start();
```


## 准备
### 配置文件 deploy-config.json
添加配置文件
> 记住 加到 `.gitignore`，不要把它上传到 `github` 上面了

配置文件包含：
- 服务器的登录用户名、密码
- 服务器项目路径
- 本地打包输出的路径
- 压缩打包文件的文件名

这个是我的模板
```json
{
  "local": {
    "distDir": "./docs",
    "distZip": "./dist.zip"
  },
  "server": {
    "host": "服务器IP",
    "username": "服务器用户名",
    "password": "对应用户名的密码",
    "distDir": "项目路径",
    "distZipName": "上传的压缩文件名"
  }
}
```


### 环境
如果有多个环境，可以使用 [inquirer](https://www.npmjs.com/package/inquirer)，我这里就没有使用了


### ssh
使用 `node-ssh` 连接服务器
```shell
yarn add -D node-ssh
```

```js
const node_ssh = require('node-ssh');

const SSH = new node_ssh();

/**
 * 连接服务器
 * @param {*} params { host, username, password }
 */
async function connectServer(params) {
  const spinner = ora(chalk.cyan('正在连接服务器...\n')).start();
  await SSH.connect(params)
    .then(() => {
      spinner.succeed(chalk.green('服务器连接成功！\n'));
    })
    .catch(err => {
      spinner.fail(chalk.red('服务器连接失败！\n'));
      textError(err);
      process.exit(1);
    });
}

// 通过 ssh 在服务器上命令
async function runCommand(cmd, cwd) {
  await SSH.execCommand(cmd, {
    cwd,
    onStderr(chunk) {
      textError(`${cmd}, stderrChunk, ${chunk.toString('utf8')}`);
    },
  });
}
```

### 压缩文件
```shell
yarn add -D zip-local
```

### 进度工具
```shell
yarn add -D ora
```

```js
const chalk = require('chalk');
const ora = require('ora');

const spinner = ora(chalk.cyan('正在打包... \n')).start();
spinner.succeed(chalk.green('打包完成！\n'));
spinner.fail(chalk.red('打包失败！\n'));
```

### promisify
`promisify` 包装一下，方便使用 `async`/`await`，记住要调用一下 `next()`，相当于 `Promise.resolve()`，不然是不会走到下一步的

```js
const { promisify } = require('util');

async function buildDist(cmd, params, next) {
    // ... 
    if (next) next();
}

module.exports = promisify(buildDist);
```


## 打包代码 buildDist
可以用 `child_process.spawn` 执行 `shell` 命令 `npm/yarn build` 
```js
// deploy/buildDist.js
'use strict';

const { promisify } = require('util');
const { spawn } = require('child_process');
const { textError, textSuccess } = require('./utils/textConsole');

/**
 * 执行脚本 spawn 的封装
 * @param {*} cmd
 * @param {*} params
 */
async function buildDist(cmd, params, next) {
  const build = spawn(cmd, params, {
    shell: process.platform === 'win32', // 兼容windows系统
    stdio: 'inherit', // 打印命令原始输出
  });

  build.on('error', () => {
    textError('打包失败！\n');
    process.exit(1);
  });

  build.on('close', (code) => {
    if (code === 0) {
      textSuccess('√ 打包完成！\n');
    } else {
      textError('× 打包失败！\n');
      process.exit(1);
    }
    // 必传，promisify 回调继续执行后续函数
    if (next) next();
  });
}

module.exports = promisify(buildDist);
```

## 压缩打包好的代码 compressDist

```js
'use strict';

const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const zipper = require('zip-local');
const { promisify } = require('util');
const { textError } = require('./textConsole');

// 压缩打包好的项目
function compressDist(LOCAL_CONFIG, next) {
  const spinner = ora(chalk.cyan('正在压缩...\n')).start();

  try {
    const { distDir, distZip } = LOCAL_CONFIG;

    zipper.sync
      .zip(path.resolve(process.cwd(), distDir))
      .compress()
      .save(path.resolve(process.cwd(), distZip));

    spinner.succeed(chalk.green('压缩完成！\n'));
    if (next) next();
  } catch (err) {
    textError('压缩失败！', err);
  }
}

module.exports = promisify(compressDist);
```

## 连接服务器
```shell
yarn add -D node-ssh
```

### 连接成功后
- 上传代码
- 配置文件夹权限
- 备份原来的项目（我这里就没有了，毕竟是个人的项目）
- 解压缩上传的项目
- 解压缩完成后，删除压缩文件
- 部署成功

```js
// deploy/deploy.js
'use strict';

const path = require('path');
const promisfy = require('util').promisify;
const ora = require('ora');
const chalk = require('chalk');
const node_ssh = require('node-ssh');
const { textError, textInfo } = require('./textConsole');

const SSH = new node_ssh();

/* =================== 3、连接服务器 =================== */
async function connectServer(params) {
  const spinner = ora(chalk.cyan('正在连接服务器...\n')).start();
  await SSH.connect(params);
  spinner.succeed(chalk.green('服务器连接成功！\n'));
}

// 通过 ssh 在服务器上命令
async function runCommand(cmd, cwd) {
  await SSH.execCommand(cmd, {
    cwd,
    onStderr(chunk) {
      textError(`${cmd}, stderrChunk, ${chunk.toString('utf8')}`);
    },
  });
}

/* =================== 4、部署项目 =================== */
async function deploy(LOCAL_CONFIG, SERVER_CONFIG, next) {
  const { host, username, password, distDir, distZipName } = SERVER_CONFIG;

  if (!distZipName || distDir === '/') {
    textError('请正确配置config.json!');
    process.exit(1);
  }

  // 连接服务器
  await connectServer({ host, username, password });
  // privateKey: '/home/steel/.ssh/id_rsa'

  const spinner = ora(chalk.cyan('正在部署项目...\n')).start();

  try {
    // 上传压缩的项目文件
    await SSH.putFile(
      path.resolve(process.cwd(), LOCAL_CONFIG.distZip),
      `${distDir}/${distZipName}.zip`
    );

    // 备份重命名原项目的文件
    // await runCommand(`mv ${distZipName} ${distZipName}-${Date.now()}`, distDir);

    // 删除原项目的文件
    await runCommand(`rm -rf ${distZipName}`, distDir);

    // 修改文件权限
    await runCommand(`chmod 777 ${distZipName}.zip`, distDir);

    // 解压缩上传的项目文件
    await runCommand(`unzip ./${distZipName}.zip -d ${distZipName}`, distDir);

    // 删除服务器上的压缩的项目文件
    await runCommand(`rm -rf ./${distZipName}.zip`, distDir);

    // 删除本地的压缩文件

    spinner.succeed(chalk.green('部署完成！\n'));
    textInfo(`项目路径: ${distDir}`);
    textInfo(new Date());
    textInfo('');

    if (next) next();
  } catch (err) {
    spinner.fail(chalk.red('项目部署失败！\n'));
    textError(`catch: ${err}`);
    process.exit(1);
  }
}

module.exports = promisfy(deploy);
```


## 大公告成
没有意外的话，退出进程，然后就部署好了