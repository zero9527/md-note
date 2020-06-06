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
