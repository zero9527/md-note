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
  let config = fs.readFileSync(path.resolve(__dirname, './deploy-config.json'));
  if (config) config = JSON.parse(config);
  else {
    textError('config.json不存在或配置不正确！');
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
